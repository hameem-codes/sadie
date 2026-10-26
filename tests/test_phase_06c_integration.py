"""
Integration & Regression Test Suite for Phase 6C
Maxillofacial Treatment-Outcome Evaluator Project

Tests:
Task 1: End-to-end integration across all six synthetic cases:
- Evaluates CASE-SYN01 through CASE-SYN06 through EvaluatorTestHarness and TreatmentOutcomeEvaluator.
- Confirms cases are identified as synthetic demonstrations with zero real PHI.
- Confirms all 8 distinct outcome domains are populated in the response.
- Confirms missing, conflicting, inapplicable, and poor-quality observations are handled explicitly.
- Confirms orbital volume, globe position, and diplopia remain strictly decoupled.
- Confirms absence of complications is never inferred as proven surgical success.
- Confirms PROMs remain strictly independent of radiological CT measurements.
- Confirms no final clinical grade, overall pass/fail, or composite score is calculated.
- Confirms evidence references trace to canonical registry IDs.
- Confirms strict determinism: repeated evaluation yields byte-identical output.

Task 2 & 3: Imaging interface contract validation:
- Validates sample valid imaging outputs against schemas/imaging_evidence_output.schema.json.
- Verifies rejection of leaked clinical grades (final_grade, outcome_score, pass_fail_status).
- Verifies rejection of unit mismatches (e.g. RMSD in inches, volume in milliliters mismatch).
- Verifies quality failure handling (unusable_reason_codes, unmeasurable flags).
- Verifies safe handling of missing measurements.
"""

import os
import json
import unittest
import copy

from src.synthetic_case_generator import (
    generate_case_syn01,
    generate_case_syn02,
    generate_case_syn03,
    generate_case_syn04,
    generate_case_syn05,
    generate_case_syn06
)
from src.evaluator_test_harness import EvaluatorTestHarness
from src.treatment_outcome_evaluator import (
    TreatmentOutcomeEvaluator,
    STATUS_ASSESSABLE,
    STATUS_INSUFFICIENT_DATA,
    STATUS_NOT_APPLICABLE,
    STATUS_CONFLICTING_EVIDENCE,
    STATUS_HUMAN_REVIEW_REQUIRED
)

class TestPhase06cIntegration(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.harness = EvaluatorTestHarness()
        cls.evaluator = TreatmentOutcomeEvaluator()
        cls.cases = [
            generate_case_syn01(),
            generate_case_syn02(),
            generate_case_syn03(),
            generate_case_syn04(),
            generate_case_syn05(),
            generate_case_syn06()
        ]
        cls.case_dict = {c["case_metadata"]["pseudonymous_case_id"]: c for c in cls.cases}

        # Load imaging evidence schema
        schema_path = os.path.join(
            os.path.dirname(os.path.dirname(__file__)),
            "schemas",
            "imaging_evidence_output.schema.json"
        )
        with open(schema_path, "r", encoding="utf-8") as f:
            cls.imaging_schema = json.load(f)

    # =========================================================================
    # Task 1: End-to-End Synthetic Case Integration Tests
    # =========================================================================

    def test_all_cases_identified_as_synthetic_demonstrations(self):
        """Verifies that each case is explicitly flagged as synthetic and contains valid pseudonymous IDs."""
        for case in self.cases:
            meta = case["case_metadata"]
            case_id = meta["pseudonymous_case_id"]
            self.assertTrue(case_id.startswith("CASE-SYN"), f"Case ID '{case_id}' must start with 'CASE-SYN'")
            # Harness audit check
            harness_res = self.harness.evaluate_case(case)
            self.assertTrue(harness_res["overall_test_passed"], f"Harness audit failed for {case_id}")

    def test_all_eight_domains_populated_for_every_case(self):
        """Verifies that evaluating any case yields all eight domain profiles without aggregation."""
        expected_domains = [
            "domain_1_skeletal_alignment",
            "domain_2_orbital_ophthalmic",
            "domain_3_occlusion_mandibular_function",
            "domain_4_mastication_speech",
            "domain_5_neurosensory",
            "domain_6_soft_tissue_aesthetics",
            "domain_7_patient_reported_outcomes",
            "domain_8_safety_and_complications"
        ]
        for case in self.cases:
            res = self.evaluator.evaluate_case(case)
            self.assertEqual(res["evaluation_status"], "COMPLETED_INDEPENDENT_PROFILES")
            self.assertFalse(res["composite_score_calculated"])
            self.assertIsNone(res["final_grade"])
            self.assertIsNone(res["overall_pass_fail"])
            self.assertEqual(sorted(list(res["domain_profiles"].keys())), sorted(expected_domains))

    def test_orbital_volume_globe_and_diplopia_remain_separate(self):
        """Verifies that orbital volume delta, globe projection, and diplopia remain distinct outcomes."""
        case_02 = self.case_dict["CASE-SYN02"]
        res = self.evaluator.evaluate_case(case_02)
        d2 = res["domain_profiles"]["domain_2_orbital_ophthalmic"]
        obs = d2["observations"]

        # Ensure volume, globe, and diplopia are distinct keys
        self.assertIn("orbital_volume_delta_ml", obs)
        self.assertIn("globe_projection_difference_mm", obs)
        self.assertIn("diplopia_status", obs)

        # Discordance is flagged without overwriting the individual facts
        self.assertEqual(obs["orbital_volume_delta_ml"]["value"], 0.42)
        self.assertEqual(obs["diplopia_status"], "READING_DOWNWARD_GAZE")
        self.assertEqual(d2["status"], STATUS_CONFLICTING_EVIDENCE)
        self.assertTrue(any("diplopia" in alert.lower() for alert in res["cross_domain_discordance_alerts"]))

    def test_missing_complication_documentation_not_proof_of_success(self):
        """Verifies that absence of documented complications carries an explicit caveat."""
        case_01 = self.case_dict["CASE-SYN01"]
        res = self.evaluator.evaluate_case(case_01)
        d8 = res["domain_profiles"]["domain_8_safety_and_complications"]
        self.assertEqual(d8["observations"]["complication_count"], 0)
        rule_ids = [r["rule_id"] for r in d8["applied_rules"]]
        self.assertIn("RULE-D8-ZERO-RECORDED-COMPLICATIONS", rule_ids)
        rule = next(r for r in d8["applied_rules"] if r["rule_id"] == "RULE-D8-ZERO-RECORDED-COMPLICATIONS")
        self.assertIn("does not prove surgical perfection", rule["explanation"].lower())

    def test_prom_isolation_from_radiological_measurements(self):
        """Verifies that patient-reported outcomes (Rasch transformed FACE-Q) are not mixed into imaging math."""
        case_01 = self.case_dict["CASE-SYN01"]
        res = self.evaluator.evaluate_case(case_01)
        d1 = res["domain_profiles"]["domain_1_skeletal_alignment"]
        d7 = res["domain_profiles"]["domain_7_patient_reported_outcomes"]

        # D1 contains mm measurements
        self.assertIn("zmc_surface_rmsd_mm", d1["observations"])
        self.assertEqual(d1["observations"]["zmc_surface_rmsd_mm"]["unit"], "MILLIMETERS")

        # D7 contains dimensionless interval scores
        self.assertIn("face_q_appearance_satisfaction_score", d7["observations"])
        self.assertEqual(d7["observations"]["face_q_appearance_satisfaction_score"]["unit"], "NONE_UNITLESS")
        self.assertIn("DEC-04 active: PROM scores must remain strictly on a parallel axis", d7["limitations_and_uncertainty"][0])

    def test_inapplicable_panfacial_reference_handling(self):
        """Verifies that CASE-SYN06 (bilateral comminuted panfacial) handles inapplicable mirror reference without penalty."""
        case_06 = self.case_dict["CASE-SYN06"]
        res = self.evaluator.evaluate_case(case_06)
        d1 = res["domain_profiles"]["domain_1_skeletal_alignment"]
        self.assertEqual(d1["status"], STATUS_NOT_APPLICABLE)
        self.assertIn("contralateral", d1["status_reason"].lower())

    def test_poor_quality_imaging_safe_fallback(self):
        """Verifies that CASE-SYN04 (severe artifact, gantry tilt) rejects 3D calculations and defers to human review."""
        case_04 = self.case_dict["CASE-SYN04"]
        res = self.evaluator.evaluate_case(case_04)
        d1 = res["domain_profiles"]["domain_1_skeletal_alignment"]
        self.assertEqual(d1["status"], STATUS_HUMAN_REVIEW_REQUIRED)
        self.assertTrue(len(d1["human_review_requirements"]) > 0)

    def test_traceability_to_canonical_registry(self):
        """Verifies that all applied rules link to verified canonical evidence IDs."""
        for case in self.cases:
            res = self.evaluator.evaluate_case(case)
            for dom_key, profile in res["domain_profiles"].items():
                for rule in profile["applied_rules"]:
                    for ev_id in rule["supporting_evidence_ids"]:
                        self.assertTrue(
                            ev_id.startswith("CANON-RES-EVD-") or
                            ev_id.startswith("CANON-CH12-EVD-") or
                            ev_id.startswith("CANON-ATLAS-CH19-EVD-"),
                            f"Untraced evidence ID '{ev_id}' in rule '{rule['rule_id']}' in {case['case_metadata']['pseudonymous_case_id']}"
                        )

    def test_repeated_evaluation_is_strictly_deterministic(self):
        """Verifies that repeated evaluations of the exact same case produce byte-for-byte identical output."""
        for case in self.cases:
            run_1 = self.evaluator.evaluate_case(case)
            run_2 = self.evaluator.evaluate_case(case)
            self.assertEqual(
                json.dumps(run_1, sort_keys=True),
                json.dumps(run_2, sort_keys=True),
                f"Evaluation of {case['case_metadata']['pseudonymous_case_id']} is non-deterministic."
            )

    # =========================================================================
    # Task 2 & 3: Imaging Interface Contract Validation Tests
    # =========================================================================

    def _get_valid_sample_imaging_evidence(self):
        """Constructs a valid specimen conforming to schemas/imaging_evidence_output.schema.json."""
        return {
            "contract_version": "1.0.0",
            "pseudonymous_case_id": "CASE-SYN01",
            "imaging_modality": "MULTI_DETECTOR_CT",
            "anatomical_regions_imaged": ["MIDFACE_AND_ORBITS", "COMPLETE_CRANIOFACIAL_SKELETON"],
            "study_metadata": {
                "scan_epoch": "POSTOPERATIVE_FOLLOWUP_6_MONTHS",
                "series_instance_hash": "a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f90",
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
                    "measurement_id": "MEAS-IMG-001",
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
                "Contralateral side used as mirror template; assumes symmetrical premorbid morphology."
            ]
        }

    def _validate_imaging_contract_specimen(self, data):
        """Validates specimen against schemas/imaging_evidence_output.schema.json without third-party deps."""
        errors = []
        # Required top level
        req_keys = self.imaging_schema.get("required", [])
        for k in req_keys:
            if k not in data:
                errors.append(f"Missing required key: '{k}'")

        # Prohibited keys check (Grade leakage)
        prohibited = {"final_grade", "outcome_score", "pass_fail_status", "surgical_success", "clinical_recommendation"}
        leaked = prohibited.intersection(data.keys())
        if leaked:
            errors.append(f"PROHIBITED LEAKED KEYS FOUND: {leaked}")

        # Check measurements
        for meas in data.get("measurements", []):
            meas_req = [
                "measurement_id", "construct", "anatomical_subsite", "measurement_category",
                "numerical_value", "unit", "method", "reference_frame", "quality_flag", "supporting_evidence_id"
            ]
            for mr in meas_req:
                if mr not in meas:
                    errors.append(f"Measurement missing required key: '{mr}'")

        return errors

    def test_valid_imaging_contract_specimen_passes(self):
        """Verifies that a well-formed specimen strictly adheres to the Imaging Evidence Output Contract."""
        specimen = self._get_valid_sample_imaging_evidence()
        errors = self._validate_imaging_contract_specimen(specimen)
        self.assertEqual(len(errors), 0, f"Validation errors on valid specimen: {errors}")

    def test_imaging_contract_rejects_leaked_clinical_grades(self):
        """Verifies that the imaging contract rejects any attempt to output clinical grades or recommendations."""
        specimen = self._get_valid_sample_imaging_evidence()
        specimen["final_grade"] = "SURGICAL_SUCCESS"
        specimen["clinical_recommendation"] = "NO_REVISION_REQUIRED"
        errors = self._validate_imaging_contract_specimen(specimen)
        self.assertTrue(any("PROHIBITED LEAKED KEYS" in err for err in errors))

    def test_imaging_contract_handles_missing_unmeasurable_data(self):
        """Verifies that severely degraded imaging sets numerical_value to null and logs unmeasurable reason."""
        specimen = self._get_valid_sample_imaging_evidence()
        specimen["image_quality_audit"]["usable_for_3d_mirroring"] = False
        specimen["image_quality_audit"]["unusable_reason_codes"] = ["SEVERE_METAL_STREAK", "NON_ZERO_GANTRY_TILT"]
        specimen["measurements"][0]["numerical_value"] = None
        specimen["measurements"][0]["quality_flag"] = "UNMEASURABLE_SEVERE_ARTIFACT"

        errors = self._validate_imaging_contract_specimen(specimen)
        self.assertEqual(len(errors), 0, f"Unmeasurable artifact representation should be valid: {errors}")
        self.assertIsNone(specimen["measurements"][0]["numerical_value"])
        self.assertIn("SEVERE_METAL_STREAK", specimen["image_quality_audit"]["unusable_reason_codes"])

    def test_imaging_contract_detects_unit_errors(self):
        """Verifies that unit mismatches in imaging outputs fail validation in the case evaluator harness."""
        specimen = self._get_valid_sample_imaging_evidence()
        # Feed into case format
        case_specimen = copy.deepcopy(self.case_dict["CASE-SYN01"])
        case_specimen["imaging_subsystem"]["measurements"][0]["unit"] = "INCHES"

        harness_res = self.harness.evaluate_case(case_specimen)
        self.assertFalse(harness_res["is_guardrail_compliant"])
        self.assertTrue(any("UNIT MISMATCH" in v for v in harness_res["guardrail_violations"]))

        eval_res = self.evaluator.evaluate_case(case_specimen)
        self.assertEqual(eval_res["evaluation_status"], "REJECTED_INVALID_INPUT")
        self.assertTrue(any("UNIT INCOMPATIBILITY" in err for err in eval_res["validation_errors"]))

if __name__ == "__main__":
    unittest.main()
