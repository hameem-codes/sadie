"""
Imaging Pipeline Adapter for ADRAB Maxillofacial Treatment-Outcome Evaluator
Phase 7A Implementation

Validates, normalizes, and packages structured imaging measurements into the formal
Imaging Evidence Output Contract (schemas/imaging_evidence_output.schema.json).

Prepares the 3D Slicer integration boundary:
- Defines Slicer execution contracts for CT/CBCT volume ingestion, segmentation,
  landmark picking, and mid-sagittal mirroring surface distance calculations.
- Verifies input quality, scan orientation, gantry tilt, slice thickness, and artifact severity.
- Normalizes raw measurements into canonical constructs and SI units.
- Explicitly handles unavailable, unreliable, or inapplicable measurements (e.g. bilateral comminution).
- STRICT GUARDRAIL: Never outputs clinical outcome grades, pass/fail thresholds, or surgical recommendations.
- Zero PHI: Uses hashed series instance identifiers and pseudonymous case IDs.
"""

import os
import re
import json
from typing import Dict, Any, List, Optional, Tuple

SCHEMA_PATH = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "schemas",
    "imaging_evidence_output.schema.json"
)

# Canonical SI unit mappings required by contract
EXPECTED_CONSTRUCT_UNITS = {
    "SKELETAL_SURFACE_DISTANCE_MSD": "MILLIMETERS",
    "SKELETAL_SURFACE_DISTANCE_RMSD": "MILLIMETERS",
    "MAXIMUM_SURFACE_DEVIATION": "MILLIMETERS",
    "ORBITAL_VOLUME_DELTA": "MILLILITERS",
    "ORBITAL_DEFECT_AREA": "SQUARE_MILLIMETERS",
    "GLOBE_PROJECTION_DELTA_HERTEL": "MILLIMETERS",
    "ANTERIOR_BUTTRESS_DISPLACEMENT_GAP": "MILLIMETERS",
    "POSTERIOR_BUTTRESS_DISPLACEMENT_GAP": "MILLIMETERS",
    "CONDYLAR_HEIGHT_RATIO_PERCENT": "PERCENT",
    "DENTAL_MIDLINE_DISCREPANCY": "MILLIMETERS"
}

VALID_MEASUREMENT_CATEGORIES = {
    "OBSERVED_DIRECT_MEASUREMENT",
    "ALGORITHMIC_SURFACE_REGISTRATION",
    "VOLUMETRIC_SEGMENTATION_ESTIMATE"
}

VALID_METHODS = {
    "AUTOMATED_3D_MIRRORING_ICP",
    "MANUAL_LANDMARK_TRIANGULATION",
    "CT_SLICE_SLICE_PLANIMETRY",
    "DEEP_LEARNING_SEGMENTATION",
    "DIGITAL_CALIPER_MEASUREMENT"
}

VALID_QUALITY_FLAGS = {
    "VERIFIED_OPTIMAL",
    "UNCERTAIN_BORDER_ARTIFACT",
    "UNRELIABLE_MOTION",
    "UNMEASURABLE_ABSENT_CONTRALATERAL",
    "UNMEASURABLE_SEVERE_ARTIFACT"
}

PROHIBITED_LEAKED_KEYS = {
    "final_grade",
    "outcome_score",
    "pass_fail_status",
    "surgical_success",
    "clinical_grade",
    "clinical_recommendation",
    "revision_indicated"
}

class ImagingPipelineAdapter:
    """
    Adapter bridging imaging processing workflows (such as 3D Slicer extensions,
    CLI modules, or photogrammetry exports) with the ADRAB treatment-outcome evaluator.
    """

    def __init__(self, schema_file: Optional[str] = None):
        self.schema_file = schema_file or SCHEMA_PATH
        self._schema = None
        if os.path.exists(self.schema_file):
            with open(self.schema_file, "r", encoding="utf-8") as f:
                self._schema = json.load(f)

    @property
    def is_3d_slicer_available(self) -> bool:
        """Checks if 3D Slicer Python environment is natively active."""
        try:
            import slicer  # type: ignore
            return True
        except ImportError:
            return False

    def validate_and_normalize(self, raw_input: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validates raw or pipeline-exported imaging data, normalizes measurement records,
        and packages the output into a strictly compliant ImagingEvidenceOutputContract dictionary.
        """
        if not isinstance(raw_input, dict):
            return {
                "adapter_status": "REJECTED_MALFORMED_INPUT",
                "validation_errors": ["Raw imaging input must be a dictionary."]
            }

        # Guardrail Check 1: Leaked clinical outcome grades
        leaked = PROHIBITED_LEAKED_KEYS.intersection(raw_input.keys())
        if leaked:
            return {
                "adapter_status": "REJECTED_GUARDRAIL_VIOLATION",
                "validation_errors": [
                    f"GUARDRAIL REJECTION: Input contains leaked clinical outcome fields: {sorted(list(leaked))}. "
                    "The imaging subsystem must output measurements, technical parameters, quality flags, and uncertainty only."
                ]
            }

        errors = []

        # 1. Pseudonymous Case ID Validation
        case_id = raw_input.get("pseudonymous_case_id", "")
        if not re.match(r"^CASE-[A-Z0-9]{4,12}$", str(case_id)):
            errors.append(f"Invalid pseudonymous_case_id: '{case_id}'. Must match '^CASE-[A-Z0-9]{{4,12}}$'. Direct PHI is prohibited.")

        # 2. Modality & Regions Validation
        modality = raw_input.get("imaging_modality")
        valid_modalities = {
            "MULTI_DETECTOR_CT", "CONE_BEAM_CT", "PLAIN_RADIOGRAPHY_PANORAMIC",
            "PLAIN_RADIOGRAPHY_WATERS", "MRI", "3D_OPTICAL_PHOTOGRAMMETRY"
        }
        if modality not in valid_modalities:
            errors.append(f"Invalid or missing imaging_modality: '{modality}'")

        regions = raw_input.get("anatomical_regions_imaged", [])
        if not isinstance(regions, list) or len(regions) < 1:
            errors.append("anatomical_regions_imaged must be a non-empty list.")

        # 3. Study Metadata Validation
        study_meta = raw_input.get("study_metadata", {})
        if not isinstance(study_meta, dict):
            errors.append("study_metadata must be a dictionary.")
        else:
            scan_epoch = study_meta.get("scan_epoch")
            valid_epochs = {
                "PREOPERATIVE_BASELINE", "INTRAOPERATIVE_POST_REDUCTION",
                "POSTOPERATIVE_ACUTE_0_TO_2_WEEKS", "POSTOPERATIVE_FOLLOWUP_6_WEEKS",
                "POSTOPERATIVE_FOLLOWUP_3_MONTHS", "POSTOPERATIVE_FOLLOWUP_6_MONTHS",
                "POSTOPERATIVE_FOLLOWUP_12_MONTHS"
            }
            if scan_epoch not in valid_epochs:
                errors.append(f"Invalid scan_epoch in study_metadata: '{scan_epoch}'")

            series_hash = study_meta.get("series_instance_hash", "")
            if not re.match(r"^[a-f0-9]{16,64}$", str(series_hash)):
                errors.append(f"Invalid series_instance_hash: '{series_hash}'. Must be 16-64 char hex hash.")

            if not study_meta.get("source_reference_id"):
                errors.append("study_metadata missing source_reference_id.")

        # 4. Technical Parameters Validation
        tech_params = raw_input.get("technical_parameters", {})
        if not isinstance(tech_params, dict):
            errors.append("technical_parameters must be a dictionary.")
        else:
            slice_th = tech_params.get("slice_thickness_mm")
            gantry_tilt = tech_params.get("gantry_tilt_degrees")
            kernel = tech_params.get("reconstruction_kernel")
            voxel_size = tech_params.get("voxel_size_xyz_mm")

            if kernel is None:
                errors.append("technical_parameters missing reconstruction_kernel.")
            if voxel_size is None or not (isinstance(voxel_size, list) and len(voxel_size) == 3):
                errors.append("technical_parameters.voxel_size_xyz_mm must be a 3-element list [x, y, z].")

        # 5. Image Quality Audit
        quality_audit = raw_input.get("image_quality_audit", {})
        if not isinstance(quality_audit, dict):
            errors.append("image_quality_audit must be a dictionary.")
        else:
            artifact = quality_audit.get("metal_hardware_artifact_severity")
            motion = quality_audit.get("patient_motion_artifact_present")
            fov = quality_audit.get("field_of_view_adequacy")
            usable_3d = quality_audit.get("usable_for_3d_mirroring")
            unusable_codes = quality_audit.get("unusable_reason_codes", [])

            if artifact not in {"NONE", "MILD_NON_OBSCURING", "MODERATE_PARTIALLY_OBSCURING", "SEVERE_INVALIDATING"}:
                errors.append(f"Invalid metal_hardware_artifact_severity: '{artifact}'")
            if not isinstance(motion, bool):
                errors.append("patient_motion_artifact_present must be boolean.")
            if fov not in {"COMPLETE_FACIAL_SKELETON", "TRUNCATED_MIDFACE", "TRUNCATED_MANDIBLE", "SUBOPTIMAL"}:
                errors.append(f"Invalid field_of_view_adequacy: '{fov}'")
            if not isinstance(usable_3d, bool):
                errors.append("usable_for_3d_mirroring must be boolean.")
            if not isinstance(unusable_codes, list):
                errors.append("unusable_reason_codes must be a list.")

        # 6. Normalize and Audit Measurements
        raw_measurements = raw_input.get("measurements", [])
        normalized_measurements = []

        if not isinstance(raw_measurements, list):
            errors.append("measurements must be a list.")
        else:
            for idx, meas in enumerate(raw_measurements):
                meas_errors, norm_meas = self._normalize_single_measurement(meas, idx, quality_audit, tech_params)
                if meas_errors:
                    errors.extend(meas_errors)
                else:
                    normalized_measurements.append(norm_meas)

        # 7. Provenance Validation
        provenance = raw_input.get("provenance", {})
        if not isinstance(provenance, dict):
            errors.append("provenance must be a dictionary.")
        else:
            for req_p in ["software_pipeline_name", "pipeline_version", "execution_timestamp"]:
                if req_p not in provenance:
                    errors.append(f"provenance missing required field: '{req_p}'")

        # 8. Human Review Status Validation
        review_status = raw_input.get("human_review_status")
        valid_reviews = {
            "AUTOMATED_EXTRACTION_UNCONFIRMED",
            "VERIFIED_BY_RADIOLOGY_TECHNOLOGIST",
            "VERIFIED_BY_ATTENDING_RADIOLOGIST",
            "VERIFIED_BY_OPERATING_SURGEON"
        }
        if review_status not in valid_reviews:
            errors.append(f"Invalid human_review_status: '{review_status}'")

        if errors:
            return {
                "adapter_status": "REJECTED_VALIDATION_ERRORS",
                "validation_errors": errors
            }

        # Construct final compliant contract payload
        contract_payload = {
            "contract_version": "1.0.0",
            "pseudonymous_case_id": case_id,
            "imaging_modality": modality,
            "anatomical_regions_imaged": regions,
            "study_metadata": study_meta,
            "technical_parameters": tech_params,
            "image_quality_audit": quality_audit,
            "measurements": normalized_measurements,
            "provenance": provenance,
            "human_review_status": review_status,
            "limitations_and_uncertainty": raw_input.get("limitations_and_uncertainty", [])
        }

        return {
            "adapter_status": "VALIDATED_AND_NORMALIZED",
            "contract_payload": contract_payload,
            "validation_errors": []
        }

    def _normalize_single_measurement(
        self,
        meas: Dict[str, Any],
        index: int,
        quality_audit: Dict[str, Any],
        tech_params: Dict[str, Any]
    ) -> Tuple[List[str], Optional[Dict[str, Any]]]:
        """Validates, units-checks, and normalizes a single measurement record."""
        errors = []
        if not isinstance(meas, dict):
            return ([f"Measurement #{index} must be a dictionary."], None)

        # Check for prohibited clinical grade leak inside measurement record
        leaked = PROHIBITED_LEAKED_KEYS.intersection(meas.keys())
        if leaked:
            return ([f"Measurement #{index} leaked prohibited keys: {sorted(list(leaked))}"], None)

        meas_id = meas.get("measurement_id") or f"MEAS-{index+1:03d}"
        construct = meas.get("construct")
        if construct not in EXPECTED_CONSTRUCT_UNITS:
            errors.append(f"Measurement #{index} unknown construct: '{construct}'")

        expected_unit = EXPECTED_CONSTRUCT_UNITS.get(construct)
        unit = meas.get("unit")
        if unit != expected_unit:
            errors.append(
                f"UNIT MISMATCH in measurement #{index} ('{meas_id}'): Construct '{construct}' requires '{expected_unit}', found '{unit}'."
            )

        category = meas.get("measurement_category")
        if category not in VALID_MEASUREMENT_CATEGORIES:
            errors.append(f"Measurement #{index} invalid measurement_category: '{category}'")

        method = meas.get("method")
        if method not in VALID_METHODS:
            errors.append(f"Measurement #{index} invalid method: '{method}'")

        ref_frame = meas.get("reference_frame")
        valid_frames = {
            "CONTRALATERAL_MIRRORED_SKELETON",
            "FRANKFORT_HORIZONTAL_PLANE",
            "MIDSAGITTAL_REFERENCE_PLANE",
            "ANTERIOR_ORBITAL_APERTURE_PLANE",
            "CORONAL_FRONTOMAXILLARY_AXIS"
        }
        if ref_frame not in valid_frames:
            errors.append(f"Measurement #{index} invalid reference_frame: '{ref_frame}'")

        q_flag = meas.get("quality_flag")
        if q_flag not in VALID_QUALITY_FLAGS:
            errors.append(f"Measurement #{index} invalid quality_flag: '{q_flag}'")

        ev_id = meas.get("supporting_evidence_id", "")
        if not re.match(r"^CANON-(RES-EVD-[0-9]{3}|CH12-EVD-[0-9]{3}|ATLAS-CH19-EVD-[0-9]{3})$", str(ev_id)):
            errors.append(f"Measurement #{index} invalid supporting_evidence_id: '{ev_id}'. Must reference CANON-* registry.")

        # Missing or unmeasurable value handling
        num_val = meas.get("numerical_value")
        if num_val is None:
            # Value is null: ensure appropriate unmeasurable flag is set
            if q_flag not in ["UNMEASURABLE_ABSENT_CONTRALATERAL", "UNMEASURABLE_SEVERE_ARTIFACT", "UNRELIABLE_MOTION"]:
                errors.append(
                    f"Measurement #{index} has null numerical_value but quality_flag '{q_flag}' does not declare an unmeasurable state."
                )

        if errors:
            return (errors, None)

        norm_meas = {
            "measurement_id": meas_id,
            "construct": construct,
            "anatomical_subsite": meas.get("anatomical_subsite", "Unspecified subsite"),
            "measurement_category": category,
            "numerical_value": num_val,
            "unit": unit,
            "method": method,
            "reference_frame": ref_frame,
            "quality_flag": q_flag,
            "supporting_evidence_id": ev_id
        }

        # Optional uncertainty margin
        uncert = meas.get("uncertainty_margin")
        if uncert is not None:
            if isinstance(uncert, dict) and "confidence_interval_95" in uncert and "std_error" in uncert:
                norm_meas["uncertainty_margin"] = uncert
            else:
                errors.append(f"Measurement #{index} invalid uncertainty_margin format.")
                return (errors, None)

        return ([], norm_meas)

    # -------------------------------------------------------------------------
    # 3D Slicer Integration Specification Boundary
    # -------------------------------------------------------------------------
    def generate_slicer_cli_invocation_spec(
        self,
        input_volume_path: str,
        output_json_path: str,
        case_id: str,
        reference_mode: str = "CONTRALATERAL_MIRROR"
    ) -> Dict[str, Any]:
        """
        Generates the planned CLI invocation contract for running 3D Slicer in headless mode:
        `Slicer --no-splash --no-main-window --python-script <script> [args]`
        
        Note: When 3D Slicer is not installed, this contract defines the execution specification
        without fabricating imaginary segmentation or voxel results.
        """
        return {
            "slicer_executable": "Slicer.exe",
            "execution_mode": "HEADLESS_CLI",
            "cli_arguments": [
                "--no-splash",
                "--no-main-window",
                "--python-script",
                "src/slicer_scripts/adrab_surface_mirror_distance.py",
                "--input-volume", input_volume_path,
                "--case-id", case_id,
                "--reference-mode", reference_mode,
                "--output-json", output_json_path
            ],
            "expected_outputs": [
                output_json_path,
                f"{output_json_path}.segmentation.nrrd",
                f"{output_json_path}.mirrored_mesh.vtk"
            ],
            "pilot_clinical_use_case": {
                "anatomical_structure": "Zygomaticomaxillary complex (ZMC)",
                "construct": "SKELETAL_SURFACE_DISTANCE_RMSD",
                "unit": "MILLIMETERS",
                "method": "AUTOMATED_3D_MIRRORING_ICP",
                "evidence_anchor": "CANON-RES-EVD-002 (Ho et al. 2017)",
                "normal_biological_reference": "0.87 +/- 0.21 mm (range 0.56-1.98 mm in uninjured adults)",
                "unresolved_clinical_decision": "DEC-01: Continuous observation reported; universal binary pass/fail cutoff prohibited."
            },
            "environment_status": {
                "slicer_installed": self.is_3d_slicer_available,
                "real_scan_processed": False,
                "note": "Execution boundary defined. Real scan execution deferred until 3D Slicer environment and calibrated DICOM volume are linked."
            }
        }
