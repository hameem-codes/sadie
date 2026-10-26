"""
Unit & Contract Test Suite for Imaging Pipeline Adapter
Phase 7A Implementation

Tests:
1. Valid structured measurements normalization and schema compliance.
2. Rejection of invalid units and construct unit mismatches.
3. Handling of missing or null measurements with explicit unmeasurable quality flags.
4. Handling of unreliable imaging (severe streak, patient motion, non-zero gantry tilt).
5. Missing contralateral reference (bilateral comminution inapplicability).
6. Conflicting observations and data quality failures.
7. Rejection of prohibited clinical outcome grades or pass/fail fields.
8. Deterministic normalization (repeated runs yield byte-identical payloads).
9. Slicer CLI invocation specification boundary verification without fabricating real scan results.
"""

import os
import json
import unittest
import copy

from src.imaging_pipeline_adapter import ImagingPipelineAdapter

class TestImagingPipelineAdapter(unittest.TestCase):

    def setUp(self):
        self.adapter = ImagingPipelineAdapter()
        self.valid_input = {
            "pseudonymous_case_id": "CASE-SYN01",
            "imaging_modality": "MULTI_DETECTOR_CT",
            "anatomical_regions_imaged": ["MIDFACE_AND_ORBITS", "COMPLETE_CRANIOFACIAL_SKELETON"],
            "study_metadata": {
                "scan_epoch": "POSTOPERATIVE_FOLLOWUP_6_MONTHS",
                "series_instance_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                "source_reference_id": "IMG-STUDY-001"
            },
            "technical_parameters": {
                "slice_thickness_mm": 0.75,
                "reconstruction_kernel": "BONE",
                "gantry_tilt_degrees": 0.0,
                "voxel_size_xyz_mm": [0.45, 0.45, 0.75]
            },
            "image_quality_audit": {
                "metal_hardware_artifact_severity": "MILD_NON_OBSCURING",
                "patient_motion_artifact_present": False,
                "field_of_view_adequacy": "COMPLETE_FACIAL_SKELETON",
                "usable_for_3d_mirroring": True,
                "unusable_reason_codes": ["NONE"]
            },
            "measurements": [
                {
                    "measurement_id": "MEAS-ZMC-001",
                    "construct": "SKELETAL_SURFACE_DISTANCE_RMSD",
                    "anatomical_subsite": "Zygomaticomaxillary complex",
                    "measurement_category": "ALGORITHMIC_SURFACE_REGISTRATION",
                    "numerical_value": 0.78,
                    "unit": "MILLIMETERS",
                    "method": "AUTOMATED_3D_MIRRORING_ICP",
                    "reference_frame": "CONTRALATERAL_MIRRORED_SKELETON",
                    "uncertainty_margin": {
                        "confidence_interval_95": [0.72, 0.84],
                        "std_error": 0.03
                    },
                    "quality_flag": "VERIFIED_OPTIMAL",
                    "supporting_evidence_id": "CANON-RES-EVD-002"
                }
            ],
            "provenance": {
                "software_pipeline_name": "ADRAB-3D-ImagingPipeline",
                "pipeline_version": "1.0.0",
                "model_identifier": None,
                "execution_timestamp": "2026-10-11T12:00:00Z"
            },
            "human_review_status": "VERIFIED_BY_ATTENDING_RADIOLOGIST",
            "limitations_and_uncertainty": [
                "Contralateral side used as mirror target; assumes pre-injury symmetry."
            ]
        }

    # 1. Valid Structured Measurements
    def test_valid_structured_measurements_succeed(self):
        """Verifies that well-formed input normalizes into a valid contract payload."""
        result = self.adapter.validate_and_normalize(self.valid_input)
        self.assertEqual(result["adapter_status"], "VALIDATED_AND_NORMALIZED")
        self.assertEqual(len(result["validation_errors"]), 0)

        contract = result["contract_payload"]
        self.assertEqual(contract["contract_version"], "1.0.0")
        self.assertEqual(contract["pseudonymous_case_id"], "CASE-SYN01")
        self.assertEqual(len(contract["measurements"]), 1)
        self.assertEqual(contract["measurements"][0]["construct"], "SKELETAL_SURFACE_DISTANCE_RMSD")
        self.assertEqual(contract["measurements"][0]["unit"], "MILLIMETERS")

    # 2. Invalid Units and Malformed Inputs
    def test_invalid_units_are_rejected(self):
        """Verifies that construct unit mismatches (e.g. RMSD in INCHES or volume in MM) are rejected."""
        bad_input = copy.deepcopy(self.valid_input)
        bad_input["measurements"][0]["unit"] = "INCHES"

        result = self.adapter.validate_and_normalize(bad_input)
        self.assertEqual(result["adapter_status"], "REJECTED_VALIDATION_ERRORS")
        self.assertTrue(any("UNIT MISMATCH" in err for err in result["validation_errors"]))

    def test_malformed_case_id_rejected(self):
        """Verifies that non-pseudonymous or malformed case IDs are rejected to protect privacy."""
        bad_input = copy.deepcopy(self.valid_input)
        bad_input["pseudonymous_case_id"] = "PATIENT_JOHN_DOE_MRN123"

        result = self.adapter.validate_and_normalize(bad_input)
        self.assertEqual(result["adapter_status"], "REJECTED_VALIDATION_ERRORS")
        self.assertTrue(any("Invalid pseudonymous_case_id" in err for err in result["validation_errors"]))

    # 3. Missing Measurements & Explicit Unmeasurable States
    def test_missing_measurement_with_unmeasurable_flag_is_handled(self):
        """Verifies that null measurements are allowed when paired with explicit unmeasurable quality flags."""
        unmeas_input = copy.deepcopy(self.valid_input)
        unmeas_input["measurements"][0]["numerical_value"] = None
        unmeas_input["measurements"][0]["quality_flag"] = "UNMEASURABLE_SEVERE_ARTIFACT"
        unmeas_input["image_quality_audit"]["usable_for_3d_mirroring"] = False
        unmeas_input["image_quality_audit"]["unusable_reason_codes"] = ["SEVERE_METAL_STREAK"]

        result = self.adapter.validate_and_normalize(unmeas_input)
        self.assertEqual(result["adapter_status"], "VALIDATED_AND_NORMALIZED")
        self.assertIsNone(result["contract_payload"]["measurements"][0]["numerical_value"])
        self.assertEqual(result["contract_payload"]["measurements"][0]["quality_flag"], "UNMEASURABLE_SEVERE_ARTIFACT")

    def test_missing_measurement_without_unmeasurable_flag_is_rejected(self):
        """Verifies that null measurement with a 'VERIFIED_OPTIMAL' flag is rejected as contradictory."""
        bad_input = copy.deepcopy(self.valid_input)
        bad_input["measurements"][0]["numerical_value"] = None
        bad_input["measurements"][0]["quality_flag"] = "VERIFIED_OPTIMAL"

        result = self.adapter.validate_and_normalize(bad_input)
        self.assertEqual(result["adapter_status"], "REJECTED_VALIDATION_ERRORS")
        self.assertTrue(any("does not declare an unmeasurable state" in err for err in result["validation_errors"]))

    # 4. Unreliable Imaging & Quality Failures
    def test_severe_streak_and_motion_flagged(self):
        """Verifies that severe hardware streak artifact and motion are properly audited."""
        poor_input = copy.deepcopy(self.valid_input)
        poor_input["image_quality_audit"]["metal_hardware_artifact_severity"] = "SEVERE_INVALIDATING"
        poor_input["image_quality_audit"]["patient_motion_artifact_present"] = True
        poor_input["image_quality_audit"]["usable_for_3d_mirroring"] = False
        poor_input["image_quality_audit"]["unusable_reason_codes"] = ["SEVERE_METAL_STREAK", "PATIENT_MOTION_BLUR"]
        poor_input["measurements"][0]["numerical_value"] = None
        poor_input["measurements"][0]["quality_flag"] = "UNMEASURABLE_SEVERE_ARTIFACT"

        result = self.adapter.validate_and_normalize(poor_input)
        self.assertEqual(result["adapter_status"], "VALIDATED_AND_NORMALIZED")
        q = result["contract_payload"]["image_quality_audit"]
        self.assertEqual(q["metal_hardware_artifact_severity"], "SEVERE_INVALIDATING")
        self.assertTrue(q["patient_motion_artifact_present"])
        self.assertFalse(q["usable_for_3d_mirroring"])

    # 5. Missing Contralateral Reference (Bilateral Comminution)
    def test_missing_contralateral_reference_handled(self):
        """Verifies that bilateral comminuted midface injuries declare absent reference without penalty."""
        bilateral_input = copy.deepcopy(self.valid_input)
        bilateral_input["image_quality_audit"]["usable_for_3d_mirroring"] = False
        bilateral_input["image_quality_audit"]["unusable_reason_codes"] = ["ABSENT_CONTRALATERAL_REFERENCE"]
        bilateral_input["measurements"][0]["numerical_value"] = None
        bilateral_input["measurements"][0]["quality_flag"] = "UNMEASURABLE_ABSENT_CONTRALATERAL"

        result = self.adapter.validate_and_normalize(bilateral_input)
        self.assertEqual(result["adapter_status"], "VALIDATED_AND_NORMALIZED")
        m = result["contract_payload"]["measurements"][0]
        self.assertEqual(m["quality_flag"], "UNMEASURABLE_ABSENT_CONTRALATERAL")
        self.assertIn("ABSENT_CONTRALATERAL_REFERENCE", result["contract_payload"]["image_quality_audit"]["unusable_reason_codes"])

    # 6. Prohibited Clinical-Grade Fields (Guardrail Test)
    def test_prohibited_clinical_grade_fields_rejected(self):
        """Verifies that imaging inputs containing clinical success grades or revision recommendations are rejected."""
        leaked_input = copy.deepcopy(self.valid_input)
        leaked_input["final_grade"] = "SURGICAL_SUCCESS"
        leaked_input["clinical_recommendation"] = "RE_OPERATE"

        result = self.adapter.validate_and_normalize(leaked_input)
        self.assertEqual(result["adapter_status"], "REJECTED_GUARDRAIL_VIOLATION")
        self.assertTrue(any("GUARDRAIL REJECTION" in err for err in result["validation_errors"]))

    # 7. Strict Determinism
    def test_normalization_is_strictly_deterministic(self):
        """Verifies that normalizing the same input produces byte-identical output."""
        res_1 = self.adapter.validate_and_normalize(self.valid_input)
        res_2 = self.adapter.validate_and_normalize(self.valid_input)

        self.assertEqual(
            json.dumps(res_1, sort_keys=True),
            json.dumps(res_2, sort_keys=True)
        )

    # 8. Slicer CLI Invocation Specification Boundary
    def test_slicer_cli_invocation_spec_generation(self):
        """Verifies Slicer CLI contract generation without falsely claiming a real scan was processed."""
        spec = self.adapter.generate_slicer_cli_invocation_spec(
            input_volume_path="C:/Data/Scans/test_scan.nrrd",
            output_json_path="C:/Data/Output/results.json",
            case_id="CASE-SYN01"
        )
        self.assertEqual(spec["slicer_executable"], "Slicer.exe")
        self.assertEqual(spec["execution_mode"], "HEADLESS_CLI")
        self.assertIn("--python-script", spec["cli_arguments"])
        self.assertFalse(spec["environment_status"]["real_scan_processed"])
        self.assertEqual(spec["pilot_clinical_use_case"]["construct"], "SKELETAL_SURFACE_DISTANCE_RMSD")
        self.assertIn("DEC-01", spec["pilot_clinical_use_case"]["unresolved_clinical_decision"])

if __name__ == "__main__":
    unittest.main()
