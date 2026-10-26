"""
Treatment Outcome Evaluator for Maxillofacial Fracture Surgery
Phase 6B Implementation

Converts validated structured case evidence conforming to schemas/treatment_outcome_case.schema.json
into transparent, independent, multi-attribute outcome-domain profiles across the eight candidate domains:
1. Skeletal reduction, alignment and symmetry
2. Orbital reconstruction and ophthalmic outcomes
3. Occlusion and mandibular function
4. Mastication, speech and functional outcomes
5. Neurosensory outcomes
6. Facial soft-tissue appearance and symmetry
7. Patient-reported outcomes (PROMs)
8. Complications, safety and additional treatment

SCIENTIFIC & CLINICAL GUARDRAILS:
1. Software prototype only; NOT a clinically validated medical device or autonomous grading system.
2. Evaluates each domain independently in parallel; strictly prohibits calculating unvalidated
   composite scores, linear weights, overall percentages, or scalar letter grades.
3. Imaging subsystem measurements, quality flags, and methods are decoupled from clinical outcome
   grading; imaging pipelines never emit clinical pass/fail verdicts.
4. Missing, omitted, or unassessed observations are NEVER inferred as normal.
5. Inapplicable criteria (e.g. absent contralateral mirror reference in bilateral panfacial fractures,
   or edentulous status) are recorded with explicit reason codes and not penalized.
6. Absence of recorded complications is never conflated with proven clinical success or optimal healing.
7. Unresolved clinical decisions (DEC-01 through DEC-06) and missing threshold evidence are reported
   as continuous observations without fabricating pass/fail boundaries.
8. Output is strictly deterministic: no non-deterministic timestamps, random seeds, or network dependencies.
"""

import os
import re
import json
from typing import Dict, Any, List, Optional, Tuple

# Domain status constants
STATUS_ASSESSABLE = "ASSESSABLE"
STATUS_INSUFFICIENT_DATA = "INSUFFICIENT_DATA"
STATUS_NOT_APPLICABLE = "NOT_APPLICABLE"
STATUS_CONFLICTING_EVIDENCE = "CONFLICTING_EVIDENCE"
STATUS_HUMAN_REVIEW_REQUIRED = "HUMAN_REVIEW_REQUIRED"

VALID_DOMAIN_STATUSES = {
    STATUS_ASSESSABLE,
    STATUS_INSUFFICIENT_DATA,
    STATUS_NOT_APPLICABLE,
    STATUS_CONFLICTING_EVIDENCE,
    STATUS_HUMAN_REVIEW_REQUIRED,
}

class TreatmentOutcomeEvaluator:
    """
    Deterministic rule-based evaluation engine for structured maxillofacial trauma cases.
    Produces independent parallel profiles across the eight candidate outcome domains.
    """

    def __init__(self, rubric_csv_path: Optional[str] = None):
        if rubric_csv_path is None:
            rubric_csv_path = os.path.join(
                os.path.dirname(os.path.dirname(__file__)),
                "data",
                "phase_05_candidate_rubric.csv"
            )
        self.rubric_csv_path = rubric_csv_path
        self._rubric_rules = self._load_rubric_metadata()

    def _load_rubric_metadata(self) -> Dict[str, Dict[str, str]]:
        """Loads candidate rubric criteria IDs and evidence references."""
        rules = {}
        if os.path.exists(self.rubric_csv_path):
            with open(self.rubric_csv_path, "r", encoding="utf-8") as f:
                header = None
                for line in f:
                    line = line.strip()
                    if not line:
                        continue
                    parts = [p.strip().strip('"') for p in line.split(",")]
                    if header is None:
                        header = parts
                        continue
                    if len(parts) > 0 and parts[0].startswith("RUB-CRIT-"):
                        crit_id = parts[0]
                        dom_num = parts[1] if len(parts) > 1 else ""
                        dom_name = parts[2] if len(parts) > 2 else ""
                        construct = parts[3] if len(parts) > 3 else ""
                        ev_ids = parts[20] if len(parts) > 20 else ""
                        rules[crit_id] = {
                            "domain_number": dom_num,
                            "domain_name": dom_name,
                            "construct": construct,
                            "supporting_evidence_ids": ev_ids
                        }
        return rules

    def evaluate_case(self, case_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Main entry point for evaluating a structured case instance.
        Validates input structure and executes independent parallel evaluation across 8 domains.
        """
        # 1. Structural Pre-flight validation & Guardrail checking
        validation_errors = self._validate_case_structure(case_data)
        if validation_errors:
            return {
                "evaluation_status": "REJECTED_INVALID_INPUT",
                "case_id": case_data.get("case_metadata", {}).get("pseudonymous_case_id", "UNKNOWN"),
                "validation_errors": validation_errors,
                "domain_profiles": {},
                "evaluator_disclaimer": self._get_evaluator_disclaimer()
            }

        case_id = case_data["case_metadata"]["pseudonymous_case_id"]

        # 2. Evaluate the 8 individual domains in strict isolation
        domain_1 = self._evaluate_domain_1_skeletal_alignment(case_data)
        domain_2 = self._evaluate_domain_2_orbital_ophthalmic(case_data)
        domain_3 = self._evaluate_domain_3_occlusion_mandibular_function(case_data)
        domain_4 = self._evaluate_domain_4_mastication_speech(case_data)
        domain_5 = self._evaluate_domain_5_neurosensory(case_data)
        domain_6 = self._evaluate_domain_6_soft_tissue_aesthetics(case_data)
        domain_7 = self._evaluate_domain_7_patient_reported_outcomes(case_data)
        domain_8 = self._evaluate_domain_8_safety_and_complications(case_data)

        domain_profiles = {
            "domain_1_skeletal_alignment": domain_1,
            "domain_2_orbital_ophthalmic": domain_2,
            "domain_3_occlusion_mandibular_function": domain_3,
            "domain_4_mastication_speech": domain_4,
            "domain_5_neurosensory": domain_5,
            "domain_6_soft_tissue_aesthetics": domain_6,
            "domain_7_patient_reported_outcomes": domain_7,
            "domain_8_safety_and_complications": domain_8,
        }

        # 3. Compile meta-audit and discordance summary
        global_alerts = self._detect_cross_domain_discordance(case_data, domain_profiles)

        # 4. Construct final deterministic response contract
        return {
            "evaluation_status": "COMPLETED_INDEPENDENT_PROFILES",
            "case_id": case_id,
            "schema_version": case_data["case_metadata"].get("evaluator_schema_version", "1.0.0"),
            "rubric_specification_version": case_data["case_metadata"].get("rubric_specification_version", "PHASE-05-CANDIDATE-v1.0"),
            "composite_score_calculated": False,
            "composite_score_rationale": "PROHIBITED: Composite arithmetic weighting between heterogeneous clinical domains is unvalidated and clinically unsafe.",
            "final_grade": None,
            "overall_pass_fail": None,
            "domain_profiles": domain_profiles,
            "cross_domain_discordance_alerts": global_alerts,
            "unresolved_clinical_decisions_active": [
                "DEC-01: ZMC RMSD symmetry cutoff undefined (continuous observation reported)",
                "DEC-02: Orbital volume delta vs diplopia functional priority unstratified",
                "DEC-03: MIO physiological adjustment formula pending surgeon consensus",
                "DEC-04: PROM arithmetic aggregation strictly prohibited",
                "DEC-05: Maxillofacial Clavien-Dindo adaptation requires panel signoff",
                "DEC-06: Fine-slice CT registration error floor in comminuted anatomy"
            ],
            "evaluator_disclaimer": self._get_evaluator_disclaimer()
        }

    # -------------------------------------------------------------------------
    # Input Validation & Guardrails
    # -------------------------------------------------------------------------
    def _validate_case_structure(self, case_data: Dict[str, Any]) -> List[str]:
        """Pre-flight check verifying required sections, units, and strict absence of leaked grades."""
        errors = []
        if not isinstance(case_data, dict):
            return ["Case data must be a valid JSON dictionary."]

        # Check required top-level sections
        required_sections = [
            "case_metadata",
            "clinical_baseline",
            "imaging_subsystem",
            "domain_assessments",
            "evaluation_audit"
        ]
        for sec in required_sections:
            if sec not in case_data:
                errors.append(f"Missing mandatory section: '{sec}'")

        if errors:
            return errors

        # Case metadata checks
        meta = case_data.get("case_metadata", {})
        case_id = meta.get("pseudonymous_case_id", "")
        if not re.match(r"^CASE-[A-Z0-9]{4,12}$", str(case_id)):
            errors.append(f"Invalid pseudonymous case ID format: '{case_id}'. Must match '^CASE-[A-Z0-9]{{4,12}}$'.")

        # Guardrail: Imaging Subsystem Grade Leakage Check
        img = case_data.get("imaging_subsystem", {})
        prohibited_keys = {"final_grade", "outcome_score", "pass_fail_status", "surgical_success", "clinical_grade"}
        leaked = prohibited_keys.intersection(img.keys())
        if leaked:
            errors.append(
                f"GUARDRAIL REJECTION: Imaging subsystem contains leaked clinical outcome fields: {sorted(list(leaked))}. "
                "Imaging subsystem must supply measurements and technical flags only."
            )

        # Guardrail: Composite Score Prohibition in Audit
        audit = case_data.get("evaluation_audit", {})
        comp_status = audit.get("composite_score_status")
        if comp_status not in ["PROHIBITED_UNVALIDATED", "NOT_CALCULATED_PARALLEL_PROFILES_ONLY"]:
            errors.append(
                f"GUARDRAIL REJECTION: evaluation_audit.composite_score_status is '{comp_status}'. "
                "Composite scoring is prohibited."
            )

        # Guardrail: Physical Units Consistency in Imaging Measurements
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
                    errors.append(
                        f"UNIT INCOMPATIBILITY: Construct '{construct}' has unit '{unit}', expected '{exp_unit}'."
                    )

        return errors

    # -------------------------------------------------------------------------
    # Domain 1: Skeletal reduction, alignment and symmetry
    # -------------------------------------------------------------------------
    def _evaluate_domain_1_skeletal_alignment(self, case_data: Dict[str, Any]) -> Dict[str, Any]:
        domain_id = "DOMAIN_1"
        domain_name = "Skeletal reduction, alignment and symmetry"
        d1_input = case_data.get("domain_assessments", {}).get("domain_1_skeletal_alignment", {})
        baseline = case_data.get("clinical_baseline", {})
        img_quality = case_data.get("imaging_subsystem", {}).get("image_quality_audit", {})
        tech_params = case_data.get("imaging_subsystem", {}).get("technical_parameters", {})

        applied_rules = []
        observations = {}
        missing_or_conflicting = []
        limitations = []
        human_review_reqs = []

        # 1. Applicability Check
        app_status = d1_input.get("applicability_status", "APPLICABLE")
        contra_status = baseline.get("contralateral_facial_skeleton_status", "UNKNOWN")

        if app_status == "NOT_APPLICABLE_BILATERAL_COMMINUTED_NO_REFERENCE" or contra_status in ["CONCOMITANT_BILATERAL_FRACTURE", "PREVIOUSLY_INJURED"]:
            applied_rules.append({
                "rule_id": "RULE-D1-INAPPLICABLE-NO-REF",
                "criterion_id": "RUB-CRIT-D1-01",
                "title": "Bilateral Skeletal Comminution Inapplicability Rule",
                "explanation": "Contralateral facial skeleton is fractured or pre-injured; virtual mirroring reference is physically inapplicable.",
                "supporting_evidence_ids": ["CANON-RES-EVD-001", "CANON-RES-EVD-002"]
            })
            return self._build_domain_response(
                domain_id=domain_id,
                domain_name=domain_name,
                status=STATUS_NOT_APPLICABLE,
                status_reason="Contralateral facial skeleton unavailable as an uninjured virtual mirror reference.",
                observations={"contralateral_status": contra_status},
                applied_rules=applied_rules,
                limitations=["Mirror symmetry analysis cannot be computed without intact reference."],
                human_review_reqs=["Requires clinical anatomical assessment by operating surgeon."]
            )

        if app_status == "NOT_APPLICABLE_NO_BONY_FRACTURE":
            applied_rules.append({
                "rule_id": "RULE-D1-INAPPLICABLE-NO-BONE",
                "criterion_id": "RUB-CRIT-D1-01",
                "title": "No Bony Facial Fracture Inapplicability Rule",
                "explanation": "Case represents isolated soft tissue or non-skeletal injury.",
                "supporting_evidence_ids": []
            })
            return self._build_domain_response(
                domain_id=domain_id,
                domain_name=domain_name,
                status=STATUS_NOT_APPLICABLE,
                status_reason="No bony skeletal fracture involved in treatment scope.",
                observations={},
                applied_rules=applied_rules
            )

        # 2. Image Quality & Artifact Auditing
        gantry_tilt = tech_params.get("gantry_tilt_degrees")
        streak = img_quality.get("metal_hardware_artifact_severity")
        motion = img_quality.get("patient_motion_artifact_present")
        usable_3d = img_quality.get("usable_for_3d_mirroring")

        if streak == "SEVERE_INVALIDATING" or motion is True or (gantry_tilt is not None and abs(gantry_tilt) > 5.0) or usable_3d is False:
            applied_rules.append({
                "rule_id": "RULE-D1-UNRELIABLE-SCAN",
                "criterion_id": "RUB-CRIT-D1-01",
                "title": "Skeletal Imaging Quality Rejection Rule",
                "explanation": "Severe metal streak artifact, patient motion, or non-zero gantry tilt precludes reliable 3D registration.",
                "supporting_evidence_ids": ["CANON-RES-EVD-001"]
            })
            limitations.append("Automated 3D surface mesh distances cannot be computed reliably due to scan degradation.")
            human_review_reqs.append("Manual radiologist and surgeon qualitative multiplanar CT slice review required.")
            return self._build_domain_response(
                domain_id=domain_id,
                domain_name=domain_name,
                status=STATUS_HUMAN_REVIEW_REQUIRED,
                status_reason="CT scan quality parameters preclude automated 3D mesh surface comparison.",
                observations={
                    "metal_artifact": streak,
                    "patient_motion": motion,
                    "gantry_tilt_degrees": gantry_tilt,
                    "usable_for_3d_mirroring": usable_3d
                },
                applied_rules=applied_rules,
                limitations=limitations,
                human_review_reqs=human_review_reqs
            )

        # 3. Extract Observations
        q_find = d1_input.get("quantitative_findings", {})
        msd = q_find.get("zmc_surface_msd_mm")
        rmsd = q_find.get("zmc_surface_rmsd_mm")
        buttress_gap = q_find.get("max_buttress_gap_mm")
        qual_eval = d1_input.get("surgeon_qualitative_assessment", "NOT_EVALUATED")

        if msd is not None:
            observations["zmc_surface_msd_mm"] = {"value": msd, "unit": "MILLIMETERS"}
        if rmsd is not None:
            observations["zmc_surface_rmsd_mm"] = {"value": rmsd, "unit": "MILLIMETERS"}
        if buttress_gap is not None:
            observations["max_buttress_gap_mm"] = {"value": buttress_gap, "unit": "MILLIMETERS"}
        observations["surgeon_qualitative_assessment"] = qual_eval

        # Check for missing critical measurements
        if rmsd is None and buttress_gap is None:
            missing_or_conflicting.append("Both 3D RMSD surface distance and buttress continuity measurements are unrecorded.")
            return self._build_domain_response(
                domain_id=domain_id,
                domain_name=domain_name,
                status=STATUS_INSUFFICIENT_DATA,
                status_reason="No quantitative skeletal alignment measurements available.",
                observations=observations,
                applied_rules=applied_rules,
                missing_or_conflicting=missing_or_conflicting,
                human_review_reqs=["Requires post-reduction CT measurement extraction."]
            )

        # 4. Apply Evaluation Rules (Without fabricating a pass/fail threshold)
        if rmsd is not None:
            applied_rules.append({
                "rule_id": "RULE-D1-OBSERVE-RMSD",
                "criterion_id": "RUB-CRIT-D1-01",
                "title": "3D Surface RMSD Continuous Observation Rule",
                "explanation": f"Observed RMSD = {rmsd} mm. Natural uninjured population baseline is 0.87 +/- 0.21 mm (range 0.56-1.98 mm, Ho et al. 2017). No binary pass/fail cutoff applied (open decision DEC-01).",
                "supporting_evidence_ids": ["CANON-RES-EVD-001", "CANON-RES-EVD-002"]
            })
            limitations.append("Decision DEC-01 active: Exact millimeter threshold separating acceptable reduction from adverse deformity is unvalidated.")

        if buttress_gap is not None:
            applied_rules.append({
                "rule_id": "RULE-D1-OBSERVE-BUTTRESS",
                "criterion_id": "RUB-CRIT-D1-02",
                "title": "Craniofacial Buttress Continuity Observation Rule",
                "explanation": f"Observed buttress step-off / gap = {buttress_gap} mm. Evaluates vertical and horizontal load-bearing pillars (Fonseca Ch. 12).",
                "supporting_evidence_ids": ["CANON-CH12-EVD-001", "CANON-CH12-EVD-002"]
            })

        if qual_eval in ["NOT_EVALUATED", "PENDING"]:
            human_review_reqs.append("Formal clinical review by attending craniomaxillofacial surgeon is pending.")

        status = STATUS_ASSESSABLE if qual_eval != "NOT_EVALUATED" else STATUS_HUMAN_REVIEW_REQUIRED

        return self._build_domain_response(
            domain_id=domain_id,
            domain_name=domain_name,
            status=status,
            status_reason="Skeletal alignment observations extracted and benchmarked against published population controls.",
            observations=observations,
            applied_rules=applied_rules,
            missing_or_conflicting=missing_or_conflicting,
            limitations=limitations,
            human_review_reqs=human_review_reqs
        )

    # -------------------------------------------------------------------------
    # Domain 2: Orbital reconstruction and ophthalmic outcomes
    # -------------------------------------------------------------------------
    def _evaluate_domain_2_orbital_ophthalmic(self, case_data: Dict[str, Any]) -> Dict[str, Any]:
        domain_id = "DOMAIN_2"
        domain_name = "Orbital reconstruction and ophthalmic outcomes"
        d2_input = case_data.get("domain_assessments", {}).get("domain_2_orbital_ophthalmic", {})

        applied_rules = []
        observations = {}
        missing_or_conflicting = []
        limitations = []
        human_review_reqs = []

        # Applicability Check
        app_status = d2_input.get("applicability_status", "APPLICABLE")
        if app_status == "NOT_APPLICABLE_NO_ORBITAL_FRACTURE":
            applied_rules.append({
                "rule_id": "RULE-D2-INAPPLICABLE-NO-ORBIT",
                "criterion_id": "RUB-CRIT-D2-01",
                "title": "No Orbital Fracture Inapplicability Rule",
                "explanation": "No internal orbital or periorbital fracture involved in case.",
                "supporting_evidence_ids": []
            })
            return self._build_domain_response(
                domain_id=domain_id,
                domain_name=domain_name,
                status=STATUS_NOT_APPLICABLE,
                status_reason="Fracture pattern does not involve internal orbital walls or ophthalmic structures.",
                observations={},
                applied_rules=applied_rules
            )

        # Extract observations
        vol_delta = d2_input.get("orbital_volume_delta_ml")
        globe_diff = d2_input.get("globe_projection_difference_mm")
        enophthalmos = d2_input.get("clinical_enophthalmos_present")
        diplopia = d2_input.get("diplopia_status", "UNTESTED")
        motility = d2_input.get("ocular_motility_limitation", "UNTESTED")

        if vol_delta is not None:
            observations["orbital_volume_delta_ml"] = {"value": vol_delta, "unit": "MILLILITERS"}
        if globe_diff is not None:
            observations["globe_projection_difference_mm"] = {"value": globe_diff, "unit": "MILLIMETERS"}
        if enophthalmos is not None:
            observations["clinical_enophthalmos_present"] = enophthalmos
        observations["diplopia_status"] = diplopia
        observations["ocular_motility_limitation"] = motility

        # Rule for volume delta
        if vol_delta is not None:
            applied_rules.append({
                "rule_id": "RULE-D2-OBSERVE-VOLUME",
                "criterion_id": "RUB-CRIT-D2-01",
                "title": "Internal Orbital Volume Parity Observation Rule",
                "explanation": f"Observed volume delta = {vol_delta} mL. 1.0 mL expansion predicts ~0.8 mm late enophthalmos (Whitehouse et al. 1994). Computer-assisted navigation achieves mean 0.74 mL (Bly et al. 2013).",
                "supporting_evidence_ids": ["CANON-RES-EVD-003", "CANON-RES-EVD-005"]
            })

        # Rule for globe projection
        if globe_diff is not None or enophthalmos is not None:
            applied_rules.append({
                "rule_id": "RULE-D2-OBSERVE-GLOBE",
                "criterion_id": "RUB-CRIT-D2-02",
                "title": "Globe Projection and Enophthalmos Observation Rule",
                "explanation": f"Observed globe projection difference = {globe_diff} mm; clinical enophthalmos = {enophthalmos} (Zhang et al. 2012, Atlas Ch. 19 p. 809).",
                "supporting_evidence_ids": ["CANON-RES-EVD-004", "CANON-ATLAS-CH19-EVD-004"]
            })

        # Rule for functional diplopia & motility
        if diplopia != "UNTESTED" or motility != "UNTESTED":
            applied_rules.append({
                "rule_id": "RULE-D2-OBSERVE-FUNCTION",
                "criterion_id": "RUB-CRIT-D2-03",
                "title": "Diplopia and Motility Field Observation Rule",
                "explanation": f"Diplopia state: '{diplopia}'; Motility limitation: '{motility}' (Atlas Ch. 19 p. 809).",
                "supporting_evidence_ids": ["CANON-ATLAS-CH19-EVD-004", "CANON-RES-EVD-005"]
            })

        # Guardrail: Check for Clinical Discordance (DEC-02)
        # Optimal volume delta (< 0.75 mL) with persistent primary/reading diplopia
        is_conflicting = False
        if vol_delta is not None and vol_delta <= 0.75 and diplopia in ["PRIMARY_GAZE", "READING_DOWNWARD_GAZE"]:
            is_conflicting = True
            missing_or_conflicting.append(
                f"DISCORDANCE ALERT: Optimal bony reconstruction (volume delta = {vol_delta} mL) coexists with functional diplopia in '{diplopia}'. "
                "Bony volume parity does not guarantee ocular muscle release or binocular alignment."
            )
            applied_rules.append({
                "rule_id": "RULE-D2-ALERT-DISCORDANCE",
                "criterion_id": "RUB-CRIT-D2-03",
                "title": "Orbital Volume vs Motility Discordance Alert",
                "explanation": "Flags divergence between radiological volume restoration and clinical extraocular motility impairment.",
                "supporting_evidence_ids": ["CANON-RES-EVD-003", "CANON-ATLAS-CH19-EVD-004"]
            })
            human_review_reqs.append("Urgent orthoptic and formal ophthalmological examination required to evaluate muscular entrapment vs fibrosis.")

        # Check for unassessed clinical data
        if diplopia == "UNTESTED" or motility == "UNTESTED":
            missing_or_conflicting.append("Formal motility testing or binocular visual field examination is unrecorded.")
            human_review_reqs.append("Bedside or formal ophthalmic motility examination required.")

        status = STATUS_CONFLICTING_EVIDENCE if is_conflicting else (
            STATUS_ASSESSABLE if vol_delta is not None and diplopia != "UNTESTED" else STATUS_INSUFFICIENT_DATA
        )

        return self._build_domain_response(
            domain_id=domain_id,
            domain_name=domain_name,
            status=status,
            status_reason="Orbital anatomical volume and clinical functional parameters evaluated independently.",
            observations=observations,
            applied_rules=applied_rules,
            missing_or_conflicting=missing_or_conflicting,
            limitations=["DEC-02 active: Relative weighting of orbital volume vs functional diplopia requires multi-disciplinary consensus."],
            human_review_reqs=human_review_reqs
        )

    # -------------------------------------------------------------------------
    # Domain 3: Occlusion and mandibular function
    # -------------------------------------------------------------------------
    def _evaluate_domain_3_occlusion_mandibular_function(self, case_data: Dict[str, Any]) -> Dict[str, Any]:
        domain_id = "DOMAIN_3"
        domain_name = "Occlusion and mandibular function"
        d3_input = case_data.get("domain_assessments", {}).get("domain_3_occlusion_mandibular_function", {})
        baseline = case_data.get("clinical_baseline", {})

        applied_rules = []
        observations = {}
        missing_or_conflicting = []
        limitations = []
        human_review_reqs = []

        # Applicability
        app_status = d3_input.get("applicability_status", "APPLICABLE")
        dentition = baseline.get("premorbid_dentition_status", "UNKNOWN")

        if app_status == "NOT_APPLICABLE_NO_MANDIBULAR_OR_MAXILLARY_INJURY":
            applied_rules.append({
                "rule_id": "RULE-D3-INAPPLICABLE-NO-JAW-INJURY",
                "criterion_id": "RUB-CRIT-D3-01",
                "title": "No Occlusal Injury Inapplicability Rule",
                "explanation": "No fracture of the tooth-bearing mandible or maxilla present.",
                "supporting_evidence_ids": []
            })
            return self._build_domain_response(
                domain_id=domain_id,
                domain_name=domain_name,
                status=STATUS_NOT_APPLICABLE,
                status_reason="Fracture pattern does not involve mandible or maxilla.",
                observations={},
                applied_rules=applied_rules
            )

        if app_status == "NOT_APPLICABLE_EDENTULOUS" or dentition == "EDENTULOUS":
            applied_rules.append({
                "rule_id": "RULE-D3-INAPPLICABLE-EDENTULOUS",
                "criterion_id": "RUB-CRIT-D3-02",
                "title": "Edentulous Occlusal Inapplicability Rule",
                "explanation": "Dental occlusal relations cannot be evaluated in edentulous patients without prostheses.",
                "supporting_evidence_ids": ["CANON-ATLAS-CH19-EVD-011"]
            })
            limitations.append("Occlusal wear facets inapplicable; jaw mobility should be evaluated with denture stops.")

        # Extract observations
        mio = d3_input.get("maximal_interincisal_opening_mm")
        lat_ipsi = d3_input.get("lateral_excursion_ipsilateral_mm")
        lat_contra = d3_input.get("lateral_excursion_contralateral_mm")
        protrusion = d3_input.get("protrusive_movement_mm")
        deviation = d3_input.get("terminal_opening_deviation_present")
        occlusion = d3_input.get("occlusal_relationship_status", "UNEVALUATED")
        imf_weeks = d3_input.get("duration_of_active_imf_weeks")
        premorbid_mio = baseline.get("known_premorbid_mio_mm")

        if mio is not None:
            observations["maximal_interincisal_opening_mm"] = {"value": mio, "unit": "MILLIMETERS"}
        if lat_ipsi is not None:
            observations["lateral_excursion_ipsilateral_mm"] = {"value": lat_ipsi, "unit": "MILLIMETERS"}
        if lat_contra is not None:
            observations["lateral_excursion_contralateral_mm"] = {"value": lat_contra, "unit": "MILLIMETERS"}
        if protrusion is not None:
            observations["protrusive_movement_mm"] = {"value": protrusion, "unit": "MILLIMETERS"}
        if deviation is not None:
            observations["terminal_opening_deviation_present"] = deviation
        observations["occlusal_relationship_status"] = occlusion
        if imf_weeks is not None:
            observations["duration_of_active_imf_weeks"] = {"value": imf_weeks, "unit": "WEEKS"}

        # Rule for MIO Observation
        if mio is not None:
            applied_rules.append({
                "rule_id": "RULE-D3-OBSERVE-MIO",
                "criterion_id": "RUB-CRIT-D3-01",
                "title": "Maximal Interincisal Opening Observation Rule",
                "explanation": f"Observed MIO = {mio} mm. Eckelt et al. (2006) reported operative mean 46.5 mm vs closed 40.9 mm (both > 40 mm). Premorbid baseline: {premorbid_mio} mm.",
                "supporting_evidence_ids": ["CANON-RES-EVD-006", "CANON-RES-EVD-008"]
            })
            if mio < 35.0:
                missing_or_conflicting.append(f"FUNCTIONAL IMPAIRMENT: Severe trismus detected (MIO = {mio} mm < 35 mm consensus threshold).")
                human_review_reqs.append("Physical therapy and TMJ mobility evaluation required for trismus management.")

        # Rule for Occlusal Relationship
        if occlusion != "UNEVALUATED":
            applied_rules.append({
                "rule_id": "RULE-D3-OBSERVE-OCCLUSION",
                "criterion_id": "RUB-CRIT-D3-02",
                "title": "Dental Occlusal Restoration Observation Rule",
                "explanation": f"Occlusal relationship: '{occlusion}'. Evaluates reproducibility of pre-morbid wear facets (Ellis et al. 2000, Atlas Ch. 19 p. 810).",
                "supporting_evidence_ids": ["CANON-RES-EVD-007", "CANON-ATLAS-CH19-EVD-010"]
            })
            if occlusion in ["ANTERIOR_OPEN_BITE", "POSTERIOR_OPEN_BITE", "CROSSBITE"]:
                missing_or_conflicting.append(f"MALOCCLUSION DETECTED: Patient presents with '{occlusion}'.")
                human_review_reqs.append("Dental/orthodontic evaluation and potential guiding elastic traction or revision review needed.")

        # Rule for IMF Safety Threshold (Adeyemi et al. 2012, Atlas Ch. 19 p. 812)
        if imf_weeks is not None:
            applied_rules.append({
                "rule_id": "RULE-D3-AUDIT-IMF-DURATION",
                "criterion_id": "RUB-CRIT-D3-03",
                "title": "IMF Immobilization Duration Audit Rule",
                "explanation": f"Documented active IMF duration = {imf_weeks} weeks. Guidelines advise <= 2 weeks; prolonged IMF (> 4 weeks) induces muscle contracture and joint stiffness.",
                "supporting_evidence_ids": ["CANON-RES-EVD-008", "CANON-ATLAS-CH19-EVD-012"]
            })
            if imf_weeks > 4.0:
                missing_or_conflicting.append(
                    f"SAFETY THRESHOLD EXCEEDED: IMF duration was {imf_weeks} weeks (> 4.0-week clinical safety ceiling)."
                )
                limitations.append("Prolonged IMF immobilization may be primary cause of secondary jaw stiffness.")

        status = STATUS_ASSESSABLE if mio is not None and occlusion != "UNEVALUATED" else (
            STATUS_INSUFFICIENT_DATA if mio is None and occlusion == "UNEVALUATED" else STATUS_HUMAN_REVIEW_REQUIRED
        )

        return self._build_domain_response(
            domain_id=domain_id,
            domain_name=domain_name,
            status=status,
            status_reason="Occlusion and jaw opening parameters audited against clinical and safety thresholds.",
            observations=observations,
            applied_rules=applied_rules,
            missing_or_conflicting=missing_or_conflicting,
            limitations=limitations,
            human_review_reqs=human_review_reqs
        )

    # -------------------------------------------------------------------------
    # Domain 4: Mastication, speech and functional outcomes
    # -------------------------------------------------------------------------
    def _evaluate_domain_4_mastication_speech(self, case_data: Dict[str, Any]) -> Dict[str, Any]:
        domain_id = "DOMAIN_4"
        domain_name = "Mastication, speech and other functional outcomes"
        d4_input = case_data.get("domain_assessments", {}).get("domain_4_mastication_speech", {})

        applied_rules = []
        observations = {}
        missing_or_conflicting = []
        limitations = []
        human_review_reqs = []

        app_status = d4_input.get("applicability_status", "APPLICABLE")
        if app_status == "NOT_APPLICABLE":
            applied_rules.append({
                "rule_id": "RULE-D4-INAPPLICABLE",
                "criterion_id": "RUB-CRIT-D4-01",
                "title": "Mastication Domain Inapplicability Rule",
                "explanation": "Domain marked inapplicable for case.",
                "supporting_evidence_ids": []
            })
            return self._build_domain_response(
                domain_id=domain_id,
                domain_name=domain_name,
                status=STATUS_NOT_APPLICABLE,
                status_reason="Mastication and speech functional assessment marked inapplicable.",
                observations={},
                applied_rules=applied_rules
            )

        diet = d4_input.get("dietary_progression_level", "UNRECORDED")
        speech = d4_input.get("articulatory_speech_impairment_present")

        observations["dietary_progression_level"] = diet
        observations["articulatory_speech_impairment_present"] = speech

        if diet == "UNRECORDED" and speech is None:
            applied_rules.append({
                "rule_id": "RULE-D4-UNASSESSED",
                "criterion_id": "RUB-CRIT-D4-01",
                "title": "Mastication Unrecorded Audit Rule",
                "explanation": "No dietary progression or speech outcome recorded in clinical documentation.",
                "supporting_evidence_ids": ["CANON-ATLAS-CH19-EVD-010"]
            })
            missing_or_conflicting.append("Dietary intake stage and articulatory speech impairment are unrecorded.")
            return self._build_domain_response(
                domain_id=domain_id,
                domain_name=domain_name,
                status=STATUS_INSUFFICIENT_DATA,
                status_reason="No functional dietary or speech records available.",
                observations=observations,
                applied_rules=applied_rules,
                missing_or_conflicting=missing_or_conflicting,
                human_review_reqs=["Clinical follow-up dietary inquiry required."]
            )

        applied_rules.append({
            "rule_id": "RULE-D4-OBSERVE-DIET",
            "criterion_id": "RUB-CRIT-D4-01",
            "title": "Dietary Progression Milestone Rule",
            "explanation": f"Observed dietary consistency: '{diet}'. Atlas Ch. 19 (p. 810) describes soft diet for 4-6 weeks transitioning to unrestricted solid diet.",
            "supporting_evidence_ids": ["CANON-ATLAS-CH19-EVD-010"]
        })

        return self._build_domain_response(
            domain_id=domain_id,
            domain_name=domain_name,
            status=STATUS_ASSESSABLE,
            status_reason="Dietary progression and speech milestones documented.",
            observations=observations,
            applied_rules=applied_rules,
            missing_or_conflicting=missing_or_conflicting,
            limitations=limitations,
            human_review_reqs=human_review_reqs
        )

    # -------------------------------------------------------------------------
    # Domain 5: Neurosensory outcomes
    # -------------------------------------------------------------------------
    def _evaluate_domain_5_neurosensory(self, case_data: Dict[str, Any]) -> Dict[str, Any]:
        domain_id = "DOMAIN_5"
        domain_name = "Neurosensory outcomes"
        d5_input = case_data.get("domain_assessments", {}).get("domain_5_neurosensory", {})

        applied_rules = []
        observations = {}
        missing_or_conflicting = []
        limitations = []
        human_review_reqs = []

        app_status = d5_input.get("applicability_status", "APPLICABLE")
        if app_status == "NOT_APPLICABLE":
            applied_rules.append({
                "rule_id": "RULE-D5-INAPPLICABLE",
                "criterion_id": "RUB-CRIT-D5-01",
                "title": "Neurosensory Inapplicability Rule",
                "explanation": "No nerve distribution at risk in treated anatomical zones.",
                "supporting_evidence_ids": []
            })
            return self._build_domain_response(
                domain_id=domain_id,
                domain_name=domain_name,
                status=STATUS_NOT_APPLICABLE,
                status_reason="Nerve assessment not applicable for fracture distribution.",
                observations={},
                applied_rules=applied_rules
            )

        ion = d5_input.get("infraorbital_nerve_status", "UNTESTED")
        ian = d5_input.get("inferior_alveolar_nerve_status", "UNTESTED")
        facial_motor = d5_input.get("facial_nerve_motor_deficit_present")

        observations["infraorbital_nerve_status"] = ion
        observations["inferior_alveolar_nerve_status"] = ian
        observations["facial_nerve_motor_deficit_present"] = facial_motor

        if ion == "UNTESTED" and ian == "UNTESTED" and facial_motor is None:
            applied_rules.append({
                "rule_id": "RULE-D5-UNTESTED",
                "criterion_id": "RUB-CRIT-D5-01",
                "title": "Neurosensory Untested Audit Rule",
                "explanation": "Bedside trigeminal and facial nerve evaluations unrecorded.",
                "supporting_evidence_ids": ["CANON-ATLAS-CH19-EVD-013"]
            })
            missing_or_conflicting.append("Trigeminal sensory distribution (V2/V3) and facial motor nerve status are untested.")
            return self._build_domain_response(
                domain_id=domain_id,
                domain_name=domain_name,
                status=STATUS_INSUFFICIENT_DATA,
                status_reason="Neurosensory testing unrecorded.",
                observations=observations,
                applied_rules=applied_rules,
                missing_or_conflicting=missing_or_conflicting,
                human_review_reqs=["Bedside 2-point discrimination or sharp/dull testing recommended."]
            )

        applied_rules.append({
            "rule_id": "RULE-D5-OBSERVE-SENSATION",
            "criterion_id": "RUB-CRIT-D5-01",
            "title": "Trigeminal Sensory Nerve Recovery Observation Rule",
            "explanation": f"Infraorbital (V2): '{ion}'; Inferior alveolar (V3): '{ian}'. Neuropraxia typically resolves over 6-12 months (Atlas Ch. 19 p. 813).",
            "supporting_evidence_ids": ["CANON-ATLAS-CH19-EVD-013"]
        })

        if facial_motor is True:
            missing_or_conflicting.append("MOTOR DEFICIT: Facial nerve branch motor weakness or paralysis documented.")
            human_review_reqs.append("Specialist facial nerve assessment recommended.")

        return self._build_domain_response(
            domain_id=domain_id,
            domain_name=domain_name,
            status=STATUS_ASSESSABLE,
            status_reason="Cranial nerve sensory and motor function documented.",
            observations=observations,
            applied_rules=applied_rules,
            missing_or_conflicting=missing_or_conflicting,
            limitations=["Recovery timelines vary; definitive assessment recommended at 12 months."],
            human_review_reqs=human_review_reqs
        )

    # -------------------------------------------------------------------------
    # Domain 6: Facial soft-tissue appearance and symmetry
    # -------------------------------------------------------------------------
    def _evaluate_domain_6_soft_tissue_aesthetics(self, case_data: Dict[str, Any]) -> Dict[str, Any]:
        domain_id = "DOMAIN_6"
        domain_name = "Facial soft-tissue appearance and symmetry"
        d6_input = case_data.get("domain_assessments", {}).get("domain_6_soft_tissue_aesthetics", {})

        applied_rules = []
        observations = {}
        missing_or_conflicting = []
        limitations = []
        human_review_reqs = []

        app_status = d6_input.get("applicability_status", "APPLICABLE")
        if app_status == "NOT_APPLICABLE":
            applied_rules.append({
                "rule_id": "RULE-D6-INAPPLICABLE",
                "criterion_id": "RUB-CRIT-D6-01",
                "title": "Soft Tissue Inapplicability Rule",
                "explanation": "Soft tissue aesthetics marked not applicable.",
                "supporting_evidence_ids": []
            })
            return self._build_domain_response(
                domain_id=domain_id,
                domain_name=domain_name,
                status=STATUS_NOT_APPLICABLE,
                status_reason="Soft tissue assessment marked not applicable.",
                observations={},
                applied_rules=applied_rules
            )

        canthal = d6_input.get("canthal_dystopia_present")
        ptosis = d6_input.get("facial_soft_tissue_ptosis_present")
        scar = d6_input.get("hypertrophic_or_unsatisfactory_scarring_present")

        observations["canthal_dystopia_present"] = canthal
        observations["facial_soft_tissue_ptosis_present"] = ptosis
        observations["hypertrophic_or_unsatisfactory_scarring_present"] = scar

        if canthal is None and ptosis is None and scar is None:
            applied_rules.append({
                "rule_id": "RULE-D6-UNASSESSED",
                "criterion_id": "RUB-CRIT-D6-01",
                "title": "Soft Tissue Aesthetics Unassessed Rule",
                "explanation": "No formal clinical scar assessment or photographic rating available.",
                "supporting_evidence_ids": ["CANON-ATLAS-CH19-EVD-018", "CANON-ATLAS-CH19-EVD-019"]
            })
            missing_or_conflicting.append("Soft tissue contour, canthal position, and scar maturation are unassessed.")
            return self._build_domain_response(
                domain_id=domain_id,
                domain_name=domain_name,
                status=STATUS_INSUFFICIENT_DATA,
                status_reason="Soft tissue visual evaluation unassessed.",
                observations=observations,
                applied_rules=applied_rules,
                missing_or_conflicting=missing_or_conflicting,
                human_review_reqs=["Standardized 5-view medical photography and POSAS scar audit recommended."]
            )

        applied_rules.append({
            "rule_id": "RULE-D6-OBSERVE-SOFT-TISSUE",
            "criterion_id": "RUB-CRIT-D6-01",
            "title": "Soft Tissue Redraping and Scar Maturation Observation Rule",
            "explanation": f"Canthal dystopia: {canthal}; Malar/facial ptosis: {ptosis}; Scarring: {scar}. Atlas Ch. 19 (p. 815) documents remodeling for 12-18 months.",
            "supporting_evidence_ids": ["CANON-ATLAS-CH19-EVD-018", "CANON-ATLAS-CH19-EVD-019"]
        })

        return self._build_domain_response(
            domain_id=domain_id,
            domain_name=domain_name,
            status=STATUS_ASSESSABLE,
            status_reason="Soft tissue morphological findings documented.",
            observations=observations,
            applied_rules=applied_rules,
            missing_or_conflicting=missing_or_conflicting,
            limitations=["Definitive scar maturation requires >= 12 months longitudinal follow-up."],
            human_review_reqs=human_review_reqs
        )

    # -------------------------------------------------------------------------
    # Domain 7: Patient-reported outcomes (PROMs)
    # -------------------------------------------------------------------------
    def _evaluate_domain_7_patient_reported_outcomes(self, case_data: Dict[str, Any]) -> Dict[str, Any]:
        domain_id = "DOMAIN_7"
        domain_name = "Patient-reported outcomes"
        d7_input = case_data.get("domain_assessments", {}).get("domain_7_patient_reported_outcomes", {})

        applied_rules = []
        observations = {}
        missing_or_conflicting = []
        limitations = []
        human_review_reqs = []

        app_status = d7_input.get("applicability_status", "APPLICABLE")
        if app_status in ["SURVEY_NOT_ADMINISTERED", "PATIENT_DECLINED_OR_UNAVAILABLE"]:
            applied_rules.append({
                "rule_id": "RULE-D7-OMITTED-SURVEY",
                "criterion_id": "RUB-CRIT-D7-01",
                "title": "PROM Survey Omission Rule",
                "explanation": f"PROM survey was not completed (status: '{app_status}'). Guardrail: Never substitute missing surveys with cohort means or assume optimal satisfaction.",
                "supporting_evidence_ids": ["CANON-RES-EVD-012"]
            })
            return self._build_domain_response(
                domain_id=domain_id,
                domain_name=domain_name,
                status=STATUS_INSUFFICIENT_DATA,
                status_reason=f"Patient-reported survey was omitted or uncompleted ({app_status}).",
                observations={"prom_instrument_administered": "NONE"},
                applied_rules=applied_rules,
                missing_or_conflicting=["PROM survey was omitted; patient aesthetic satisfaction unknown."],
                human_review_reqs=["Administer validated FACE-Q or OHIP-14 questionnaire at next follow-up."]
            )

        prom_tool = d7_input.get("prom_instrument_administered", "NONE")
        score_app = d7_input.get("face_q_appearance_satisfaction_score")
        score_life = d7_input.get("face_q_early_life_impact_score")

        observations["prom_instrument_administered"] = prom_tool
        if score_app is not None:
            observations["face_q_appearance_satisfaction_score"] = {"value": score_app, "unit": "NONE_UNITLESS"}
        if score_life is not None:
            observations["face_q_early_life_impact_score"] = {"value": score_life, "unit": "NONE_UNITLESS"}

        if score_app is None and score_life is None:
            applied_rules.append({
                "rule_id": "RULE-D7-MISSING-SCORES",
                "criterion_id": "RUB-CRIT-D7-01",
                "title": "PROM Missing Scores Rule",
                "explanation": "Survey instrument was named, but individual Rasch-transformed scales are null.",
                "supporting_evidence_ids": ["CANON-RES-EVD-012"]
            })
            missing_or_conflicting.append("Survey administered, but numeric scale scores are missing.")
            return self._build_domain_response(
                domain_id=domain_id,
                domain_name=domain_name,
                status=STATUS_INSUFFICIENT_DATA,
                status_reason="Survey scale scores are missing.",
                observations=observations,
                applied_rules=applied_rules,
                missing_or_conflicting=missing_or_conflicting
            )

        # Apply PROM reporting rule (Guardrail: Rasch score kept separate from CT math)
        applied_rules.append({
            "rule_id": "RULE-D7-OBSERVE-FACE-Q",
            "criterion_id": "RUB-CRIT-D7-01",
            "title": "FACE-Q Appearance Satisfaction Scale Rule",
            "explanation": f"Instrument '{prom_tool}': Appearance score = {score_app}/100. Rasch-transformed interval scale (Elegbede et al. 2018, Pusic et al. 2013). Scores > 70-80 indicate high aesthetic satisfaction.",
            "supporting_evidence_ids": ["CANON-RES-EVD-012", "CANON-RES-EVD-013"]
        })

        limitations.append("DEC-04 active: PROM scores must remain strictly on a parallel axis; linear arithmetic combination with CT metrics is prohibited.")

        return self._build_domain_response(
            domain_id=domain_id,
            domain_name=domain_name,
            status=STATUS_ASSESSABLE,
            status_reason="Patient-reported outcome module documented on validated interval scale.",
            observations=observations,
            applied_rules=applied_rules,
            missing_or_conflicting=missing_or_conflicting,
            limitations=limitations,
            human_review_reqs=human_review_reqs
        )

    # -------------------------------------------------------------------------
    # Domain 8: Complications, safety and additional treatment
    # -------------------------------------------------------------------------
    def _evaluate_domain_8_safety_and_complications(self, case_data: Dict[str, Any]) -> Dict[str, Any]:
        domain_id = "DOMAIN_8"
        domain_name = "Complications, safety and additional treatment"
        d8_input = case_data.get("domain_assessments", {}).get("domain_8_safety_and_complications", {})

        applied_rules = []
        observations = {}
        missing_or_conflicting = []
        limitations = []
        human_review_reqs = []

        app_status = d8_input.get("applicability_status", "APPLICABLE")
        if app_status == "INSUFFICIENT_FOLLOWUP_DURATION":
            applied_rules.append({
                "rule_id": "RULE-D8-INSUFFICIENT-FOLLOWUP",
                "criterion_id": "RUB-CRIT-D8-01",
                "title": "Insufficient Follow-Up Duration Rule",
                "explanation": "Follow-up period is too brief (< 6 weeks) to audit delayed hardware failure or infection.",
                "supporting_evidence_ids": ["CANON-RES-EVD-010", "CANON-ATLAS-CH19-EVD-015"]
            })
            limitations.append("Late complications (e.g. cold intolerance, chronic plate exposure) cannot be ruled out.")
            return self._build_domain_response(
                domain_id=domain_id,
                domain_name=domain_name,
                status=STATUS_INSUFFICIENT_DATA,
                status_reason="Follow-up duration insufficient for safety audit.",
                observations={},
                applied_rules=applied_rules,
                limitations=limitations
            )

        complications = d8_input.get("complications_recorded", [])
        observations["complication_count"] = len(complications)
        observations["complications_detailed"] = complications

        # Guardrail: Absence of recorded complications is NOT proof of clinical perfection
        if len(complications) == 0:
            applied_rules.append({
                "rule_id": "RULE-D8-ZERO-RECORDED-COMPLICATIONS",
                "criterion_id": "RUB-CRIT-D8-01",
                "title": "Zero Recorded Complications Audit Rule",
                "explanation": "No adverse events or hardware removals documented in current chart. Guardrail: Absence of documented complications indicates uneventful early course, but does NOT prove surgical perfection or guarantee absence of unrecorded events.",
                "supporting_evidence_ids": ["CANON-ATLAS-CH19-EVD-001", "CANON-ATLAS-CH19-EVD-015"]
            })
            return self._build_domain_response(
                domain_id=domain_id,
                domain_name=domain_name,
                status=STATUS_ASSESSABLE,
                status_reason="No complications recorded in surgical and follow-up audit.",
                observations=observations,
                applied_rules=applied_rules,
                limitations=["Late hardware loosening or infection can emerge up to 24 months postoperatively."],
                human_review_reqs=[]
            )

        # Audit recorded complications by Clavien-Dindo severity
        high_severity_present = False
        for comp in complications:
            ctype = comp.get("complication_type", "UNKNOWN")
            grade = comp.get("clavien_dindo_severity_grade", "GRADE_I")
            timing = comp.get("onset_timing_weeks")
            intervention = comp.get("additional_intervention_required", "")

            applied_rules.append({
                "rule_id": "RULE-D8-RECORDED-COMPLICATION",
                "criterion_id": "RUB-CRIT-D8-02",
                "title": f"Complication Recorded: {ctype} ({grade})",
                "explanation": f"Onset at {timing} weeks. Required intervention: '{intervention}' (Nagase et al. 2005, Atlas Ch. 19 p. 806).",
                "supporting_evidence_ids": ["CANON-RES-EVD-010", "CANON-ATLAS-CH19-EVD-001"]
            })

            if grade in ["GRADE_IIIb", "GRADE_IV", "GRADE_V"]:
                high_severity_present = True
                missing_or_conflicting.append(
                    f"HIGH SEVERITY ADVERSE EVENT: '{ctype}' classified as Clavien-Dindo {grade} requiring secondary surgical re-operation: {intervention}."
                )

        if high_severity_present:
            human_review_reqs.append("Formal morbidity and mortality surgical audit review required.")

        return self._build_domain_response(
            domain_id=domain_id,
            domain_name=domain_name,
            status=STATUS_ASSESSABLE if not high_severity_present else STATUS_HUMAN_REVIEW_REQUIRED,
            status_reason=f"{len(complications)} complication(s) documented and audited against Clavien-Dindo criteria.",
            observations=observations,
            applied_rules=applied_rules,
            missing_or_conflicting=missing_or_conflicting,
            limitations=limitations,
            human_review_reqs=human_review_reqs
        )

    # -------------------------------------------------------------------------
    # Cross-Domain Discordance Detection
    # -------------------------------------------------------------------------
    def _detect_cross_domain_discordance(self, case_data: Dict[str, Any], domain_profiles: Dict[str, Any]) -> List[str]:
        """Detects scientific and clinical discrepancies across disparate domains."""
        alerts = []

        d1 = domain_profiles.get("domain_1_skeletal_alignment", {})
        d2 = domain_profiles.get("domain_2_orbital_ophthalmic", {})
        d3 = domain_profiles.get("domain_3_occlusion_mandibular_function", {})
        d7 = domain_profiles.get("domain_7_patient_reported_outcomes", {})
        d8 = domain_profiles.get("domain_8_safety_and_complications", {})

        # Discordance 1: Normal orbital volume delta with persistent diplopia
        d2_obs = d2.get("observations", {})
        vol_data = d2_obs.get("orbital_volume_delta_ml", {})
        vol_val = vol_data.get("value") if isinstance(vol_data, dict) else None
        diplopia = d2_obs.get("diplopia_status")
        if vol_val is not None and vol_val <= 0.75 and diplopia in ["PRIMARY_GAZE", "READING_DOWNWARD_GAZE"]:
            alerts.append(
                f"CROSS-DOMAIN DISCORDANCE: Orbital volume delta is optimal ({vol_val} mL <= 0.75 mL), but functional diplopia persists in '{diplopia}'. "
                "Illustrates why radiological volume alone cannot serve as an autonomous success grade."
            )

        # Discordance 2: Favourable anatomical reduction with high PROM dissatisfaction
        d1_obs = d1.get("observations", {})
        rmsd_data = d1_obs.get("zmc_surface_rmsd_mm", {})
        rmsd_val = rmsd_data.get("value") if isinstance(rmsd_data, dict) else None
        d7_obs = d7.get("observations", {})
        prom_data = d7_obs.get("face_q_appearance_satisfaction_score", {})
        prom_val = prom_data.get("value") if isinstance(prom_data, dict) else None

        if rmsd_val is not None and rmsd_val <= 1.0 and prom_val is not None and prom_val < 50.0:
            alerts.append(
                f"ANATOMICAL-PATIENT DISCORDANCE: Anatomical surface reduction is optimal (RMSD = {rmsd_val} mm), but patient FACE-Q appearance satisfaction is low ({prom_val}/100)."
            )

        # Discordance 3: Prolonged IMF duration (> 4 weeks) with severe trismus (< 35 mm)
        d3_obs = d3.get("observations", {})
        imf_data = d3_obs.get("duration_of_active_imf_weeks", {})
        imf_val = imf_data.get("value") if isinstance(imf_data, dict) else None
        mio_data = d3_obs.get("maximal_interincisal_opening_mm", {})
        mio_val = mio_data.get("value") if isinstance(mio_data, dict) else None
        if imf_val is not None and imf_val > 4.0 and mio_val is not None and mio_val < 35.0:
            alerts.append(
                f"TREATMENT-FUNCTIONAL DISCORDANCE: Prolonged IMF ({imf_val} weeks > 4-week guideline ceiling) coexists with severe trismus (MIO = {mio_val} mm)."
            )

        return alerts

    # -------------------------------------------------------------------------
    # Helper to Build Uniform Domain Contract
    # -------------------------------------------------------------------------
    def _build_domain_response(
        self,
        domain_id: str,
        domain_name: str,
        status: str,
        status_reason: str,
        observations: Dict[str, Any],
        applied_rules: List[Dict[str, Any]],
        missing_or_conflicting: Optional[List[str]] = None,
        limitations: Optional[List[str]] = None,
        human_review_reqs: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """Constructs an immutable, standardized domain profile contract."""
        if status not in VALID_DOMAIN_STATUSES:
            raise ValueError(f"Invalid domain status '{status}'. Must be one of {VALID_DOMAIN_STATUSES}")

        # Extract all supporting evidence IDs mentioned in applied rules
        evidence_refs = []
        for r in applied_rules:
            for ev in r.get("supporting_evidence_ids", []):
                if ev not in evidence_refs:
                    evidence_refs.append(ev)

        return {
            "domain_id": domain_id,
            "domain_name": domain_name,
            "status": status,
            "status_reason": status_reason,
            "observations": observations,
            "applied_rules": applied_rules,
            "supporting_evidence_ids": evidence_refs,
            "missing_or_conflicting_information": missing_or_conflicting or [],
            "limitations_and_uncertainty": limitations or [],
            "human_review_requirements": human_review_reqs or []
        }

    def _get_evaluator_disclaimer(self) -> str:
        return (
            "NOTICE: The Maxillofacial Treatment Outcome Evaluator is an experimental research prototype "
            "designed to produce structured, transparent multi-attribute evaluation profiles. It is NOT a "
            "certified medical device, does NOT replace licensed surgical judgment, and does NOT generate "
            "treatment directives or autonomous pass/fail decisions. Open decisions DEC-01 through DEC-06 "
            "remain active pending qualified craniomaxillofacial surgeon consensus."
        )

# Convenience CLI execution function
def evaluate_synthetic_case_file(file_path: str) -> Dict[str, Any]:
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    evaluator = TreatmentOutcomeEvaluator()
    return evaluator.evaluate_case(data)
