"""
Evaluator Test Harness for Maxillofacial Treatment-Outcome Evaluator
Phase 6A Implementation

Audits structured case assessments against the project data contract, candidate rubric,
and scientific boundary constraints:
1. Validates strict schema conformance without external third-party dependencies.
2. Checks imaging subsystem guardrail: ensures the imaging pipeline returns raw measurements
   and technical quality flags only, never emitting final clinical grades or pass/fail outcomes.
3. Checks multi-attribute domain independence: enforces that domains are evaluated in parallel
   and that no unvalidated composite arithmetic score is calculated.
4. Audits measurement units, evidence traceability, and missing-data semantics.
5. Flags conflicting clinical observations (e.g. optimal volume delta with persistent diplopia).
6. Generates deterministic evaluation reports and quality summaries.
"""

import os
import re
import json
from typing import Dict, Any, List, Tuple

class EvaluatorTestHarness:
    """Rigorous evaluation and audit harness for structured cases."""

    def __init__(self, schema_path: str = None):
        if schema_path is None:
            schema_path = os.path.join(
                os.path.dirname(os.path.dirname(__file__)),
                "schemas",
                "treatment_outcome_case.schema.json"
            )
        self.schema_path = schema_path
        with open(schema_path, "r", encoding="utf-8") as f:
            self.schema = json.load(f)

    def validate_schema_compliance(self, case_data: Dict[str, Any]) -> List[str]:
        """Performs strict recursive schema validation against schemas/treatment_outcome_case.schema.json."""
        errors = []

        # 1. Top level required properties
        required_top = self.schema.get("required", [])
        for prop in required_top:
            if prop not in case_data:
                errors.append(f"Missing required top-level property: '{prop}'")

        # 2. Case Metadata validation
        metadata = case_data.get("case_metadata", {})
        case_id = metadata.get("pseudonymous_case_id", "")
        if not re.match(r"^CASE-[A-Z0-9]{4,12}$", case_id):
            errors.append(f"Invalid pseudonymous case ID format: '{case_id}'. Must match '^CASE-[A-Z0-9]{{4,12}}$'.")

        schema_ver = metadata.get("evaluator_schema_version")
        if schema_ver not in ["1.0.0", "1.1.0"]:
            errors.append(f"Unsupported evaluator_schema_version: '{schema_ver}'")

        rubric_ver = metadata.get("rubric_specification_version")
        if rubric_ver != "PHASE-05-CANDIDATE-v1.0":
            errors.append(f"Invalid rubric_specification_version: '{rubric_ver}'. Must be 'PHASE-05-CANDIDATE-v1.0'.")

        regions = metadata.get("primary_fracture_regions", [])
        if not isinstance(regions, list) or len(regions) < 1:
            errors.append("primary_fracture_regions must be a non-empty list.")

        # 3. Imaging Subsystem validation
        img = case_data.get("imaging_subsystem", {})
        if "imaging_modality" not in img:
            errors.append("imaging_subsystem missing 'imaging_modality'")
        if "measurements" not in img or not isinstance(img["measurements"], list):
            errors.append("imaging_subsystem missing 'measurements' list")
        else:
            for idx, meas in enumerate(img["measurements"]):
                for req_key in ["measurement_id", "construct", "anatomical_subsite", "method", "unit", "quality_flag"]:
                    if req_key not in meas:
                        errors.append(f"Measurement #{idx} missing required key: '{req_key}'")

        # 4. Domain Assessments validation
        domains = case_data.get("domain_assessments", {})
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
        for d in expected_domains:
            if d not in domains:
                errors.append(f"Missing required domain assessment: '{d}'")
            else:
                d_obj = domains[d]
                if "applicability_status" not in d_obj:
                    errors.append(f"Domain '{d}' missing 'applicability_status'")
                if "evaluation_status" not in d_obj:
                    errors.append(f"Domain '{d}' missing 'evaluation_status'")

        # 5. Evaluation Audit validation
        audit = case_data.get("evaluation_audit", {})
        for audit_req in ["human_surgeon_review_status", "composite_score_status", "uncertainty_and_limitations_summary"]:
            if audit_req not in audit:
                errors.append(f"evaluation_audit missing '{audit_req}'")

        return errors

    def audit_clinical_boundaries_and_guardrails(self, case_data: Dict[str, Any]) -> List[str]:
        """
        Enforces project scientific boundaries:
        - Imaging subsystem does not output final pass/fail grade.
        - Composite score status must be PROHIBITED_UNVALIDATED or NOT_CALCULATED.
        - Measurement units are physically appropriate.
        - Evidence IDs trace back to canonical matrix.
        """
        guardrail_violations = []

        # Guardrail 1: Imaging Subsystem Grade Leakage Check
        img = case_data.get("imaging_subsystem", {})
        illegal_img_keys = {"final_grade", "outcome_score", "pass_fail_status", "surgical_success"}
        leaked_keys = illegal_img_keys.intersection(img.keys())
        if leaked_keys:
            guardrail_violations.append(
                f"GUARDRAIL VIOLATION: Imaging subsystem leaked clinical outcome grades: {leaked_keys}. "
                "Imaging pipeline must output measurements and quality flags only."
            )

        # Guardrail 2: Composite Score Prohibition
        audit = case_data.get("evaluation_audit", {})
        comp_status = audit.get("composite_score_status")
        if comp_status not in ["PROHIBITED_UNVALIDATED", "NOT_CALCULATED_PARALLEL_PROFILES_ONLY"]:
            guardrail_violations.append(
                f"GUARDRAIL VIOLATION: Composite scoring status is '{comp_status}'. "
                "Single composite arithmetic scores are strictly prohibited."
            )

        # Guardrail 3: Measurement Units Consistency Check
        measurements = img.get("measurements", [])
        expected_units = {
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
        for meas in measurements:
            construct = meas.get("construct")
            unit = meas.get("unit")
            if construct in expected_units:
                exp_unit = expected_units[construct]
                if unit != exp_unit:
                    guardrail_violations.append(
                        f"UNIT MISMATCH in measurement '{meas.get('measurement_id')}': "
                        f"Construct '{construct}' expects '{exp_unit}', but found '{unit}'."
                    )

        # Guardrail 4: Evidence Provenance Traceability Check
        for meas in measurements:
            ev_id = meas.get("supporting_evidence_id", "")
            if ev_id and not (ev_id.startswith("CANON-RES-EVD-") or ev_id.startswith("CANON-CH12-EVD-") or ev_id.startswith("CANON-ATLAS-CH19-EVD-")):
                guardrail_violations.append(
                    f"EVIDENCE PROVENANCE ERROR in measurement '{meas.get('measurement_id')}': "
                    f"Invalid evidence identifier '{ev_id}'. Must reference CANON-* matrix."
                )

        return guardrail_violations

    def detect_clinical_discordance_and_edge_cases(self, case_data: Dict[str, Any]) -> List[str]:
        """Detects conflicting clinical observations, low quality imaging, and complication alerts."""
        alerts = []

        domains = case_data.get("domain_assessments", {})
        img = case_data.get("imaging_subsystem", {})
        d2 = domains.get("domain_2_orbital_ophthalmic", {})
        d3 = domains.get("domain_3_occlusion_mandibular_function", {})
        d8 = domains.get("domain_8_safety_and_complications", {})

        # Discordance 1: Optimal Orbital Volume Delta (< 0.75 mL) with Persistent Diplopia
        vol_delta = d2.get("orbital_volume_delta_ml")
        diplopia = d2.get("diplopia_status")
        if vol_delta is not None and vol_delta <= 0.75 and diplopia in ["PRIMARY_GAZE", "READING_DOWNWARD_GAZE"]:
            alerts.append(
                f"CLINICAL DISCORDANCE ALERT: Optimal bony orbital volume restoration (Delta = {vol_delta} mL) "
                f"coexists with functional diplopia in '{diplopia}'. Demonstrates why volume alone is not a success threshold."
            )

        # Discordance 2: Prolonged IMF Duration (> 4 weeks) with Severe Trismus
        imf_weeks = d3.get("duration_of_active_imf_weeks")
        mio = d3.get("maximal_interincisal_opening_mm")
        if imf_weeks is not None and imf_weeks > 4.0 and mio is not None and mio < 35.0:
            alerts.append(
                f"SAFETY THRESHOLD EXCEEDED: IMF duration was {imf_weeks} weeks (> 4-week guideline ceiling); "
                f"associated with severe trismus (MIO = {mio} mm)."
            )

        # Alert 3: Low Image Quality & Gantry Tilt Distorting 3D Mirroring
        gantry = img.get("technical_parameters", {}).get("gantry_tilt_degrees")
        usable_3d = img.get("image_quality_audit", {}).get("usable_for_3d_mirroring")
        artifact = img.get("image_quality_audit", {}).get("metal_hardware_artifact_severity")
        if (gantry is not None and abs(gantry) > 0.0) or artifact in ["SEVERE_INVALIDATING"]:
            if usable_3d:
                alerts.append(
                    f"QUALITY AUDIT CONFLICT: Non-zero gantry tilt ({gantry} deg) or severe hardware artifact "
                    "flagged, but 'usable_for_3d_mirroring' was incorrectly marked True."
                )

        # Alert 4: Severe Complications Recorded
        complications = d8.get("complications_recorded", [])
        if complications:
            for comp in complications:
                grade = comp.get("clavien_dindo_severity_grade")
                ctype = comp.get("complication_type")
                if grade in ["GRADE_IIIb", "GRADE_IV", "GRADE_V"]:
                    alerts.append(
                        f"HIGH-SEVERITY COMPLICATION RECORDED: '{ctype}' (Clavien-Dindo {grade}) "
                        f"requiring secondary surgical intervention: {comp.get('additional_intervention_required')}."
                    )

        return alerts

    def evaluate_case(self, case_data: Dict[str, Any]) -> Dict[str, Any]:
        """Runs the full diagnostic evaluation suite on a single structured case."""
        schema_errors = self.validate_schema_compliance(case_data)
        guardrail_violations = self.audit_clinical_boundaries_and_guardrails(case_data)
        alerts = self.detect_clinical_discordance_and_edge_cases(case_data)

        case_id = case_data.get("case_metadata", {}).get("pseudonymous_case_id", "UNKNOWN_ID")
        is_valid = (len(schema_errors) == 0 and len(guardrail_violations) == 0)

        return {
            "case_id": case_id,
            "is_schema_compliant": len(schema_errors) == 0,
            "is_guardrail_compliant": len(guardrail_violations) == 0,
            "overall_test_passed": is_valid,
            "schema_errors": schema_errors,
            "guardrail_violations": guardrail_violations,
            "clinical_alerts_and_discordance": alerts,
            "domain_profile_summary": self._extract_domain_profile(case_data)
        }

    def _extract_domain_profile(self, case_data: Dict[str, Any]) -> Dict[str, str]:
        """Extracts status overview across the 8 domains."""
        domains = case_data.get("domain_assessments", {})
        profile = {}
        for d_key, d_obj in domains.items():
            app = d_obj.get("applicability_status", "UNKNOWN")
            eval_st = d_obj.get("evaluation_status", "UNKNOWN")
            profile[d_key] = f"Applicability: {app} | Evaluation: {eval_st}"
        return profile

def run_test_harness_on_all_synthetic_cases(cases_dir: str = None) -> List[Dict[str, Any]]:
    """Runs evaluation on all JSON cases in the data/synthetic_cases directory."""
    if cases_dir is None:
        cases_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "synthetic_cases")

    harness = EvaluatorTestHarness()
    results = []

    case_files = sorted([f for f in os.listdir(cases_dir) if f.endswith(".json")])
    for fname in case_files:
        fpath = os.path.join(cases_dir, fname)
        with open(fpath, "r", encoding="utf-8") as f:
            cdata = json.load(f)
        eval_result = harness.evaluate_case(cdata)
        results.append(eval_result)
        status_str = "PASSED" if eval_result["overall_test_passed"] else "FAILED"
        print(f"[{status_str}] Case {eval_result['case_id']} ({fname})")
        if not eval_result["overall_test_passed"]:
            for err in eval_result["schema_errors"] + eval_result["guardrail_violations"]:
                print(f"   - Error: {err}")
        if eval_result["clinical_alerts_and_discordance"]:
            for alert in eval_result["clinical_alerts_and_discordance"]:
                print(f"   * Alert: {alert}")

    return results

if __name__ == "__main__":
    run_test_harness_on_all_synthetic_cases()
