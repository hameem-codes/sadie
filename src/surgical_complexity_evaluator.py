"""
Surgical Complexity Evaluator for Maxillofacial Fracture Surgery
ADRAB System — Surgical Complexity Scoring Engine

Evaluates the extent and technical complexity of maxillofacial surgery performed
based on candidate rubric specification SURGICAL-COMPLEXITY-v1.0.

SCIENTIFIC & CLINICAL GUARDRAILS:
1. Software prototype only; NOT a clinically validated medical device.
2. Evaluates the 9 complexity criteria independently; refuses to output an unvalidated
   single composite number, linear weighting sum, or arbitrary letter grade.
3. Missing or unrecorded data is NEVER silently treated as zero or normal.
4. Postoperative success or failure (good recovery vs late infection) NEVER defines surgical complexity.
5. Incomplete, conflicting, or unparseable cases return an explicit INSUFFICIENT_DATA or
   HUMAN_REVIEW_REQUIRED result status.
6. Output is strictly deterministic and free of non-deterministic timestamps or network dependencies.
"""

import os
import csv
import json
from typing import Dict, Any, List, Optional

# Status constants for complexity criteria and overall profile
STATUS_ASSESSABLE = "ASSESSABLE"
STATUS_INSUFFICIENT_DATA = "INSUFFICIENT_DATA"
STATUS_CONFLICTING_EVIDENCE = "CONFLICTING_EVIDENCE"
STATUS_HUMAN_REVIEW_REQUIRED = "HUMAN_REVIEW_REQUIRED"
STATUS_NOT_APPLICABLE = "NOT_APPLICABLE"

VALID_CRITERION_STATUSES = {
    STATUS_ASSESSABLE,
    STATUS_INSUFFICIENT_DATA,
    STATUS_CONFLICTING_EVIDENCE,
    STATUS_HUMAN_REVIEW_REQUIRED,
    STATUS_NOT_APPLICABLE,
}

RUBRIC_VERSION = "SURGICAL-COMPLEXITY-v1.0"


class SurgicalComplexityEvaluator:
    """
    Deterministic rule-based evaluation engine for assessing the extent and technical
    complexity of maxillofacial surgery performed.
    """

    def __init__(self, rubric_csv_path: Optional[str] = None):
        if rubric_csv_path is None:
            rubric_csv_path = os.path.join(
                os.path.dirname(os.path.dirname(__file__)),
                "data",
                "surgical_complexity_rubric_v1.csv"
            )
        self.rubric_csv_path = rubric_csv_path
        self._rubric_rules = self._load_rubric_metadata()

    def _load_rubric_metadata(self) -> Dict[str, Dict[str, str]]:
        rules = {}
        if os.path.exists(self.rubric_csv_path):
            with open(self.rubric_csv_path, "r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    crit_id = row.get("criterion_id")
                    if crit_id:
                        rules[crit_id] = row
        return rules

    def evaluate_case(self, case_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Main entry point for evaluating surgical complexity.
        Returns multi-attribute criterion-level profiles, missing inputs, evidence references,
        uncertainty, rubric version, and human review flags.
        """
        # 1. Structural pre-flight validation
        validation_errors = self._validate_structure(case_data)
        case_id = case_data.get("case_metadata", {}).get("pseudonymous_case_id", "UNKNOWN")

        if validation_errors:
            return {
                "evaluation_status": "REJECTED_INVALID_INPUT",
                "case_id": case_id,
                "rubric_version": RUBRIC_VERSION,
                "validation_errors": validation_errors,
                "criteria_profiles": {},
                "composite_score": None,
                "composite_score_calculated": False,
                "missing_inputs": validation_errors,
                "human_review_required": True,
                "evaluator_disclaimer": self._get_disclaimer()
            }

        # 2. Check for overall insufficient data gate
        crit_01 = self._eval_crit_01_fracture_severity(case_data)
        crit_02 = self._eval_crit_02_regions_and_bones(case_data)
        crit_03 = self._eval_crit_03_reduction_complexity(case_data)
        crit_04 = self._eval_crit_04_procedures(case_data)
        crit_05 = self._eval_crit_05_hardware(case_data)
        crit_06 = self._eval_crit_06_soft_tissue_injuries(case_data)
        crit_07 = self._eval_crit_07_approaches_and_staging(case_data)
        crit_08 = self._eval_crit_08_duration_and_blood_loss(case_data)
        crit_09 = self._eval_crit_09_intraop_complications(case_data)

        criteria_profiles = {
            "COMPLEX-CRIT-01": crit_01,
            "COMPLEX-CRIT-02": crit_02,
            "COMPLEX-CRIT-03": crit_03,
            "COMPLEX-CRIT-04": crit_04,
            "COMPLEX-CRIT-05": crit_05,
            "COMPLEX-CRIT-06": crit_06,
            "COMPLEX-CRIT-07": crit_07,
            "COMPLEX-CRIT-08": crit_08,
            "COMPLEX-CRIT-09": crit_09,
        }

        # Collect missing inputs & uncertainty across criteria
        all_missing = []
        human_review_reasons = []
        conflicting_reasons = []
        insufficient_data_criteria = []

        for cid, prof in criteria_profiles.items():
            if prof.get("missing_inputs"):
                all_missing.extend([f"{cid}: {m}" for m in prof["missing_inputs"]])
            if prof.get("status") == STATUS_INSUFFICIENT_DATA:
                insufficient_data_criteria.append(cid)
            elif prof.get("status") == STATUS_CONFLICTING_EVIDENCE:
                conflicting_reasons.append(f"{cid}: {prof.get('notes')}")
            if prof.get("human_review_flag"):
                human_review_reasons.append(f"{cid}: {prof.get('human_review_reason')}")

        # Check if case has insufficient information to calculate a defensible profile
        # e.g., if core operative and fracture data are both missing or unrecorded
        if len(insufficient_data_criteria) >= 4 or (
            crit_01["status"] == STATUS_INSUFFICIENT_DATA and crit_02["status"] == STATUS_INSUFFICIENT_DATA
        ):
            overall_status = "INSUFFICIENT_DATA_FOR_DEFENSIBLE_PROFILE"
            needs_human_review = True
            human_review_reasons.append("Multiple critical operative and fracture criteria lack required documentation.")
        elif conflicting_reasons:
            overall_status = "CONFLICTING_OPERATIVE_EVIDENCE"
            needs_human_review = True
            human_review_reasons.extend(conflicting_reasons)
        elif human_review_reasons:
            overall_status = "COMPLETED_PROFILES_HUMAN_REVIEW_RECOMMENDED"
            needs_human_review = True
        else:
            overall_status = "COMPLETED_INDEPENDENT_PROFILES"
            needs_human_review = False

        return {
            "evaluation_status": overall_status,
            "case_id": case_id,
            "rubric_version": RUBRIC_VERSION,
            "composite_score": None,
            "composite_score_calculated": False,
            "composite_score_status": "PROHIBITED_UNVALIDATED_PARALLEL_PROFILES_ONLY",
            "criteria_profiles": criteria_profiles,
            "missing_inputs": all_missing,
            "human_review_required": needs_human_review,
            "human_review_flags": human_review_reasons,
            "evaluator_disclaimer": self._get_disclaimer()
        }

    # -------------------------------------------------------------------------
    # Structural Pre-flight Validation
    # -------------------------------------------------------------------------
    def _validate_structure(self, case: Dict[str, Any]) -> List[str]:
        errors = []
        if not isinstance(case, dict):
            return ["Case data must be a valid JSON dictionary."]

        top_keys = [
            "case_metadata",
            "fracture_characterization",
            "operative_details",
            "hardware_inventory",
            "soft_tissue_and_associated_injuries",
            "intraoperative_events_and_resources",
            "complexity_evaluation_audit"
        ]
        for tk in top_keys:
            if tk not in case:
                errors.append(f"Missing required top-level section: '{tk}'")

        if "case_metadata" in case:
            meta = case["case_metadata"]
            if not meta.get("pseudonymous_case_id"):
                errors.append("case_metadata.pseudonymous_case_id is required.")

        return errors

    # -------------------------------------------------------------------------
    # Criterion 1: Fracture Number and Documented Severity
    # -------------------------------------------------------------------------
    def _eval_crit_01_fracture_severity(self, case: Dict[str, Any]) -> Dict[str, Any]:
        fc = case.get("fracture_characterization", {})
        locations = fc.get("fracture_locations", [])
        severity = fc.get("documented_severity")
        panfacial = fc.get("panfacial_involvement", False)
        bilateral = fc.get("bilateral_injury", False)

        missing = []
        if severity is None or severity == "UNSPECIFIED_OR_UNDOCUMENTED":
            missing.append("documented_severity is missing or undocumented")

        if not locations:
            missing.append("fracture_locations array is empty")

        if missing:
            return {
                "criterion_id": "COMPLEX-CRIT-01",
                "name": "Fracture Number and Documented Severity",
                "status": STATUS_INSUFFICIENT_DATA,
                "fracture_count": len(locations),
                "severity_grade": severity,
                "complexity_tier": "UNDETERMINED_INSUFFICIENT_DATA",
                "missing_inputs": missing,
                "evidence_ids": ["CANON-CH12-EVD-001", "CANON-RES-EVD-014"],
                "human_review_flag": True,
                "human_review_reason": "Preoperative fracture severity or location count unrecorded.",
                "notes": "Never infer single/mild fracture from missing imaging documentation."
            }

        # Deterministic tier categorization pending surgeon validation
        if panfacial or severity in ("COMMINUTED_SEGMENTAL", "HIGH_ENERGY_CRUSH_BONE_LOSS", "DEFECT_OR_AVULSION") or len(locations) >= 4:
            tier = "HIGH_COMPLEXITY_SKELETAL_INJURY"
        elif bilateral or len(locations) >= 2 or severity == "DISPLACED_NON_COMMINUTED":
            tier = "MODERATE_COMPLEXITY_SKELETAL_INJURY"
        else:
            tier = "LOW_COMPLEXITY_SKELETAL_INJURY"

        return {
            "criterion_id": "COMPLEX-CRIT-01",
            "name": "Fracture Number and Documented Severity",
            "status": STATUS_ASSESSABLE,
            "fracture_count": len(locations),
            "fracture_locations": locations,
            "documented_severity": severity,
            "bilateral_injury": bilateral,
            "panfacial_involvement": panfacial,
            "complexity_tier": tier,
            "surgeon_validation_status": "PENDING_SURGEON_VALIDATION",
            "missing_inputs": [],
            "evidence_ids": ["CANON-CH12-EVD-001", "CANON-RES-EVD-014"],
            "human_review_flag": False,
            "human_review_reason": None,
            "notes": "Morphology variables carry lower inter-rater agreement (Mittermiller 2019)."
        }

    # -------------------------------------------------------------------------
    # Criterion 2: Number of Anatomical Regions and Bones Operated On
    # -------------------------------------------------------------------------
    def _eval_crit_02_regions_and_bones(self, case: Dict[str, Any]) -> Dict[str, Any]:
        op = case.get("operative_details", {})
        regions = op.get("anatomical_regions_operated", [])
        bones = op.get("bones_operated", [])

        missing = []
        if not regions:
            missing.append("anatomical_regions_operated is unrecorded")
        if not bones:
            missing.append("bones_operated is unrecorded")

        if missing:
            return {
                "criterion_id": "COMPLEX-CRIT-02",
                "name": "Number of Anatomical Regions and Bones Operated On",
                "status": STATUS_INSUFFICIENT_DATA,
                "region_count": len(regions),
                "bone_count": len(bones),
                "complexity_tier": "UNDETERMINED_INSUFFICIENT_DATA",
                "missing_inputs": missing,
                "evidence_ids": ["CANON-CH12-EVD-001", "CANON-ATLAS-CH19-EVD-001"],
                "human_review_flag": True,
                "human_review_reason": "Operative regions or operated bone list missing.",
                "notes": "Records only what was actually operated on; does not assume unlisted bones were intact or explored."
            }

        # Categorization
        if len(regions) >= 3 or len(bones) >= 4:
            tier = "POLYSTOTIC_MULTI_COMPARTMENT_SURGERY"
        elif len(regions) == 2 or len(bones) in (2, 3):
            tier = "BI_COMPARTMENT_OLIGOSTOTIC_SURGERY"
        else:
            tier = "MONOSTOTIC_SINGLE_COMPARTMENT_SURGERY"

        return {
            "criterion_id": "COMPLEX-CRIT-02",
            "name": "Number of Anatomical Regions and Bones Operated On",
            "status": STATUS_ASSESSABLE,
            "regions_operated": regions,
            "region_count": len(regions),
            "bones_operated": bones,
            "bone_count": len(bones),
            "complexity_tier": tier,
            "surgeon_validation_status": "PENDING_SURGEON_VALIDATION",
            "missing_inputs": [],
            "evidence_ids": ["CANON-CH12-EVD-001", "CANON-ATLAS-CH19-EVD-001"],
            "human_review_flag": False,
            "human_review_reason": None,
            "notes": "Anti-double-counting: measures surgical exposure burden, not initial fracture sites."
        }

    # -------------------------------------------------------------------------
    # Criterion 3: Reconstruction and Reduction Complexity
    # -------------------------------------------------------------------------
    def _eval_crit_03_reduction_complexity(self, case: Dict[str, Any]) -> Dict[str, Any]:
        op = case.get("operative_details", {})
        reduction = op.get("reduction_complexity")

        if not reduction or reduction == "UNDOCUMENTED":
            return {
                "criterion_id": "COMPLEX-CRIT-03",
                "name": "Reconstruction and Reduction Complexity",
                "status": STATUS_INSUFFICIENT_DATA,
                "reduction_complexity": None,
                "complexity_tier": "UNDETERMINED_INSUFFICIENT_DATA",
                "missing_inputs": ["reduction_complexity is undocumented"],
                "evidence_ids": ["CANON-CH12-EVD-001", "CANON-RES-EVD-005"],
                "human_review_flag": True,
                "human_review_reason": "Technique of reduction unrecorded in operative narrative.",
                "notes": "Cannot default undocumented reduction to simple."
            }

        tier_map = {
            "CLOSED_MANUAL_OR_TRACTION_ONLY": "LEVEL_1_CLOSED_MINIMAL",
            "OPEN_DIRECT_ANATOMIC_SIMPLE": "LEVEL_2_DIRECT_ANATOMIC",
            "OPEN_MULTIAXIAL_DIFFICULT_TRACTION": "LEVEL_3_MULTIAXIAL_DIFFICULT",
            "OPEN_COMMINUTED_REASSEMBLY_PUZZLE": "LEVEL_4_COMPLEX_COMMINUTED_REASSEMBLY",
            "COMPUTER_ASSISTED_NAVIGATION_OR_PSI": "LEVEL_4_ADVANCED_COMPUTER_GUIDED",
            "NOT_APPLICABLE_CONSERVATIVE": "LEVEL_0_NOT_APPLICABLE"
        }

        tier = tier_map.get(reduction, "UNKNOWN_TIER")
        return {
            "criterion_id": "COMPLEX-CRIT-03",
            "name": "Reconstruction and Reduction Complexity",
            "status": STATUS_ASSESSABLE,
            "reduction_complexity": reduction,
            "complexity_tier": tier,
            "surgeon_validation_status": "PENDING_SURGEON_VALIDATION",
            "missing_inputs": [],
            "evidence_ids": ["CANON-CH12-EVD-001", "CANON-RES-EVD-005"],
            "human_review_flag": False,
            "human_review_reason": None,
            "notes": "Captures the mechanics of bone re-alignment."
        }

    # -------------------------------------------------------------------------
    # Criterion 4: Procedures Performed
    # -------------------------------------------------------------------------
    def _eval_crit_04_procedures(self, case: Dict[str, Any]) -> Dict[str, Any]:
        op = case.get("operative_details", {})
        procs = op.get("procedures_performed", [])

        if not procs:
            return {
                "criterion_id": "COMPLEX-CRIT-04",
                "name": "Procedures Performed",
                "status": STATUS_INSUFFICIENT_DATA,
                "procedures_count": 0,
                "complexity_tier": "UNDETERMINED_INSUFFICIENT_DATA",
                "missing_inputs": ["procedures_performed array is empty"],
                "evidence_ids": ["CANON-ATLAS-CH19-EVD-001", "CANON-RES-EVD-003"],
                "human_review_flag": True,
                "human_review_reason": "Operative procedures list omitted.",
                "notes": "Operative report missing procedure coding."
            }

        high_risk_procs = {
            "FRONTAL_SINUS_OBLITERATION_OR_CRANIALIZATION",
            "AUTOLOGOUS_BONE_GRAFTING",
            "INTERNAL_ORBITAL_RECONSTRUCTION_PSI",
            "TRACHEOSTOMY_SURGICAL"
        }
        has_high_risk = any(p in high_risk_procs for p in procs)

        if len(procs) >= 4 or has_high_risk:
            tier = "HIGH_PROCEDURAL_COMPLEXITY"
        elif len(procs) >= 2:
            tier = "MODERATE_PROCEDURAL_COMPLEXITY"
        else:
            tier = "SINGLE_PROCEDURE_COMPLEXITY"

        return {
            "criterion_id": "COMPLEX-CRIT-04",
            "name": "Procedures Performed",
            "status": STATUS_ASSESSABLE,
            "procedures_performed": procs,
            "procedures_count": len(procs),
            "high_risk_procedures_present": has_high_risk,
            "complexity_tier": tier,
            "surgeon_validation_status": "PENDING_SURGEON_VALIDATION",
            "missing_inputs": [],
            "evidence_ids": ["CANON-ATLAS-CH19-EVD-001", "CANON-RES-EVD-003"],
            "human_review_flag": False,
            "human_review_reason": None,
            "notes": "Captures surgical procedures executed, not the hardware quantity used within them."
        }

    # -------------------------------------------------------------------------
    # Criterion 5: Fixation Hardware Requirements
    # -------------------------------------------------------------------------
    def _eval_crit_05_hardware(self, case: Dict[str, Any]) -> Dict[str, Any]:
        hw = case.get("hardware_inventory", {})
        documented = hw.get("hardware_documented", False)
        plates = hw.get("plate_count")
        screws = hw.get("screw_count")
        meshes = hw.get("mesh_implant_count", 0) or 0
        recon_plate = hw.get("reconstruction_plate_used", False)
        psi_used = hw.get("custom_patient_specific_implant_used", False)
        sites = hw.get("fixation_sites", [])

        # Check for contradictory data: e.g. documented=True but plate_count=None while screws exist
        if documented and plates is None and screws is None:
            return {
                "criterion_id": "COMPLEX-CRIT-05",
                "name": "Fixation Hardware Requirements",
                "status": STATUS_INSUFFICIENT_DATA,
                "complexity_tier": "UNDETERMINED_INSUFFICIENT_DATA",
                "missing_inputs": ["hardware_documented is true but plate_count and screw_count are null"],
                "evidence_ids": ["CANON-RES-EVD-009", "CANON-RES-EVD-010"],
                "human_review_flag": True,
                "human_review_reason": "Hardware implant counts missing despite record indicating placement.",
                "notes": "Never assume null plate_count means zero plates."
            }

        if not documented or (plates is None and screws is None):
            return {
                "criterion_id": "COMPLEX-CRIT-05",
                "name": "Fixation Hardware Requirements",
                "status": STATUS_INSUFFICIENT_DATA,
                "complexity_tier": "UNDETERMINED_INSUFFICIENT_DATA",
                "missing_inputs": ["Hardware inventory not documented in record"],
                "evidence_ids": ["CANON-RES-EVD-009", "CANON-RES-EVD-010"],
                "human_review_flag": True,
                "human_review_reason": "Implant logs unrecorded.",
                "notes": "Missing hardware log flagged."
            }

        plates_val = plates or 0
        screws_val = screws or 0

        # Contradiction check: plates present but 0 screws documented
        if plates_val > 0 and screws_val == 0:
            return {
                "criterion_id": "COMPLEX-CRIT-05",
                "name": "Fixation Hardware Requirements",
                "status": STATUS_CONFLICTING_EVIDENCE,
                "complexity_tier": "CONFLICTING_HARDWARE_LOG",
                "missing_inputs": [],
                "evidence_ids": ["CANON-RES-EVD-009", "CANON-RES-EVD-010"],
                "human_review_flag": True,
                "human_review_reason": f"Discrepancy: {plates_val} plates documented with 0 screws.",
                "notes": "Hardware log discordance requires manual chart verification."
            }

        if recon_plate or psi_used or plates_val >= 5 or screws_val >= 20:
            tier = "HEAVY_HARDWARE_BURDEN"
        elif plates_val >= 2 or screws_val >= 8 or meshes >= 1:
            tier = "MODERATE_HARDWARE_BURDEN"
        else:
            tier = "LOW_HARDWARE_BURDEN"

        return {
            "criterion_id": "COMPLEX-CRIT-05",
            "name": "Fixation Hardware Requirements",
            "status": STATUS_ASSESSABLE,
            "plate_count": plates_val,
            "screw_count": screws_val,
            "mesh_count": meshes,
            "reconstruction_plate_used": recon_plate,
            "psi_used": psi_used,
            "fixation_sites_count": len(sites),
            "complexity_tier": tier,
            "surgeon_validation_status": "PENDING_SURGEON_VALIDATION",
            "missing_inputs": [],
            "evidence_ids": ["CANON-RES-EVD-009", "CANON-RES-EVD-010"],
            "human_review_flag": False,
            "human_review_reason": None,
            "notes": "Biomechanical load-bearing vs load-sharing hardware recorded."
        }

    # -------------------------------------------------------------------------
    # Criterion 6: Soft-Tissue Repair and Associated Injuries
    # -------------------------------------------------------------------------
    def _eval_crit_06_soft_tissue_injuries(self, case: Dict[str, Any]) -> Dict[str, Any]:
        st = case.get("soft_tissue_and_associated_injuries", {})
        cspine = st.get("concomitant_cervical_spine_injury", False)
        tbi = st.get("concomitant_traumatic_brain_injury", False)
        vasc = st.get("concomitant_vascular_injury", False)
        degloving = st.get("extensive_facial_lacerations_or_degloving", False)
        nerve = st.get("primary_nerve_repair_or_decompression", False)
        lacrimal = st.get("lacrimal_system_repair_or_intubation", False)

        has_severe_concomitant = cspine or tbi or vasc
        has_complex_soft_tissue = degloving or nerve or lacrimal

        if has_severe_concomitant and has_complex_soft_tissue:
            tier = "SEVERE_SYSTEMIC_AND_COMPLEX_SOFT_TISSUE_INVOLVEMENT"
        elif has_severe_concomitant:
            tier = "CONCOMITANT_SYSTEMIC_OR_SPINAL_RISK_FACTOR"
        elif has_complex_soft_tissue:
            tier = "COMPLEX_FACIAL_SOFT_TISSUE_OR_NEUROVASCULAR_REPAIR"
        else:
            tier = "ISOLATED_SKELETAL_NO_COMPLEX_SOFT_TISSUE"

        return {
            "criterion_id": "COMPLEX-CRIT-06",
            "name": "Soft-Tissue Repair and Associated Injuries",
            "status": STATUS_ASSESSABLE,
            "cervical_spine_injury_present": cspine,
            "traumatic_brain_injury_present": tbi,
            "vascular_injury_present": vasc,
            "extensive_soft_tissue_injury": degloving,
            "nerve_repair_performed": nerve,
            "lacrimal_repair_performed": lacrimal,
            "complexity_tier": tier,
            "surgeon_validation_status": "PENDING_SURGEON_VALIDATION",
            "missing_inputs": [],
            "evidence_ids": ["CANON-CH12-EVD-006", "CANON-CH12-EVD-008"],
            "human_review_flag": cspine or vasc,
            "human_review_reason": "Unstable cervical spine or major vascular injury significantly alters intraoperative positioning and risk." if (cspine or vasc) else None,
            "notes": "Denis 3-column C-spine precautions (Fonseca Ch. 12 p. 234)."
        }

    # -------------------------------------------------------------------------
    # Criterion 7: Surgical Approaches and Staged Procedures
    # -------------------------------------------------------------------------
    def _eval_crit_07_approaches_and_staging(self, case: Dict[str, Any]) -> Dict[str, Any]:
        op = case.get("operative_details", {})
        approaches = op.get("surgical_approaches", [])
        staged = op.get("staged_procedure", {})
        is_staged = staged.get("is_staged", False)

        if not approaches:
            return {
                "criterion_id": "COMPLEX-CRIT-07",
                "name": "Surgical Approaches and Staged Procedures",
                "status": STATUS_INSUFFICIENT_DATA,
                "complexity_tier": "UNDETERMINED_INSUFFICIENT_DATA",
                "missing_inputs": ["surgical_approaches array is empty"],
                "evidence_ids": ["CANON-ATLAS-CH19-EVD-001", "CANON-CH12-EVD-001"],
                "human_review_flag": True,
                "human_review_reason": "Surgical incisions and approaches unrecorded.",
                "notes": "Cannot evaluate operative access burden."
            }

        coronal_used = "CORONAL_BICORONAL" in approaches
        extended_approaches = {"CORONAL_BICORONAL", "RETROMANDIBULAR", "PREAURICULAR_ENDRUM"}
        has_extended = any(a in extended_approaches for a in approaches)

        if is_staged or (coronal_used and len(approaches) >= 3) or len(approaches) >= 4:
            tier = "EXTENDED_MULTIPLE_APPROACHES_OR_STAGED"
        elif len(approaches) >= 2 or has_extended:
            tier = "COMBINED_OR_TRANSCUTANEOUS_APPROACHES"
        else:
            tier = "LOCAL_OR_INTRAORAL_SOLO_APPROACH"

        return {
            "criterion_id": "COMPLEX-CRIT-07",
            "name": "Surgical Approaches and Staged Procedures",
            "status": STATUS_ASSESSABLE,
            "approaches_count": len(approaches),
            "surgical_approaches": approaches,
            "coronal_approach_used": coronal_used,
            "is_staged_procedure": is_staged,
            "stage_number": staged.get("stage_number"),
            "complexity_tier": tier,
            "surgeon_validation_status": "PENDING_SURGEON_VALIDATION",
            "missing_inputs": [],
            "evidence_ids": ["CANON-ATLAS-CH19-EVD-001", "CANON-CH12-EVD-001"],
            "human_review_flag": False,
            "human_review_reason": None,
            "notes": "Quantifies access complexity; coronal flap elevation introduces cranial nerve VII branch risk."
        }

    # -------------------------------------------------------------------------
    # Criterion 8: Operative Duration and Blood Loss
    # -------------------------------------------------------------------------
    def _eval_crit_08_duration_and_blood_loss(self, case: Dict[str, Any]) -> Dict[str, Any]:
        ir = case.get("intraoperative_events_and_resources", {})
        duration = ir.get("operative_duration_minutes")
        ebl = ir.get("estimated_blood_loss_ml")
        transfusion = ir.get("blood_transfusion_units", 0)

        missing = []
        if duration is None:
            missing.append("operative_duration_minutes is unrecorded")
        if ebl is None:
            missing.append("estimated_blood_loss_ml is unrecorded")

        if missing:
            return {
                "criterion_id": "COMPLEX-CRIT-08",
                "name": "Operative Duration and Blood Loss",
                "status": STATUS_INSUFFICIENT_DATA,
                "operative_duration_minutes": duration,
                "estimated_blood_loss_ml": ebl,
                "complexity_tier": "UNDETERMINED_INSUFFICIENT_DATA",
                "missing_inputs": missing,
                "evidence_ids": ["CANON-CH12-EVD-008", "CANON-ATLAS-CH19-EVD-001"],
                "human_review_flag": True,
                "human_review_reason": "Operative duration or blood loss unrecorded. Never infer zero blood loss or short duration from silence.",
                "notes": "Anesthetic log unavailable."
            }

        # Check for contradiction: e.g. duration <= 0 or ebl < 0
        if duration <= 0 or ebl < 0:
            return {
                "criterion_id": "COMPLEX-CRIT-08",
                "name": "Operative Duration and Blood Loss",
                "status": STATUS_CONFLICTING_EVIDENCE,
                "complexity_tier": "CONFLICTING_PHYSIOLOGICAL_MEASUREMENTS",
                "missing_inputs": [],
                "evidence_ids": ["CANON-CH12-EVD-008", "CANON-ATLAS-CH19-EVD-001"],
                "human_review_flag": True,
                "human_review_reason": f"Negative or zero physiological values: duration={duration}, ebl={ebl}.",
                "notes": "Physiological recording error."
            }

        transfusion_val = transfusion or 0
        if duration > 300 or ebl > 750 or transfusion_val > 0:
            tier = "PROLONGED_HIGH_PHYSIOLOGICAL_STRESS"
        elif duration > 150 or ebl > 250:
            tier = "MODERATE_DURATION_AND_BLOOD_LOSS"
        else:
            tier = "SHORT_MINIMAL_BLOOD_LOSS"

        return {
            "criterion_id": "COMPLEX-CRIT-08",
            "name": "Operative Duration and Blood Loss",
            "status": STATUS_ASSESSABLE,
            "operative_duration_minutes": duration,
            "estimated_blood_loss_ml": ebl,
            "blood_transfusion_units": transfusion_val,
            "complexity_tier": tier,
            "surgeon_validation_status": "PENDING_SURGEON_VALIDATION",
            "missing_inputs": [],
            "evidence_ids": ["CANON-CH12-EVD-008", "CANON-ATLAS-CH19-EVD-001"],
            "human_review_flag": False,
            "human_review_reason": None,
            "notes": "Confounded by surgical team speed and training environment."
        }

    # -------------------------------------------------------------------------
    # Criterion 9: Documented Intraoperative Complications and Additional Interventions
    # -------------------------------------------------------------------------
    def _eval_crit_09_intraop_complications(self, case: Dict[str, Any]) -> Dict[str, Any]:
        ir = case.get("intraoperative_events_and_resources", {})
        comps = ir.get("intraoperative_complications", [])
        interventions = ir.get("unplanned_additional_interventions", [])

        # Check for NONE_DOCUMENTED vs acute complications
        has_none = "NONE_DOCUMENTED" in comps
        real_comps = [c for c in comps if c != "NONE_DOCUMENTED"]

        if has_none and real_comps:
            return {
                "criterion_id": "COMPLEX-CRIT-09",
                "name": "Documented Intraoperative Complications and Additional Interventions",
                "status": STATUS_CONFLICTING_EVIDENCE,
                "complexity_tier": "CONFLICTING_COMPLICATION_LOG",
                "missing_inputs": [],
                "evidence_ids": ["CANON-ATLAS-CH19-EVD-001", "CANON-CH12-EVD-008"],
                "human_review_flag": True,
                "human_review_reason": "Log contains both 'NONE_DOCUMENTED' and active intraoperative complication entries.",
                "notes": "Documentation discrepancy."
            }

        if real_comps or interventions:
            tier = "CRITICAL_INTRAOPERATIVE_EVENT_OR_UNPLANNED_INTERVENTION"
            review_flag = True
            review_reason = f"Intraoperative crisis recorded: {', '.join(real_comps + interventions)}"
        else:
            tier = "UNEVENTFUL_INTRAOPERATIVE_COURSE"
            review_flag = False
            review_reason = None

        return {
            "criterion_id": "COMPLEX-CRIT-09",
            "name": "Documented Intraoperative Complications and Additional Interventions",
            "status": STATUS_ASSESSABLE,
            "intraoperative_complications": real_comps,
            "unplanned_additional_interventions": interventions,
            "complication_count": len(real_comps),
            "complexity_tier": tier,
            "surgeon_validation_status": "PENDING_SURGEON_VALIDATION",
            "missing_inputs": [],
            "evidence_ids": ["CANON-ATLAS-CH19-EVD-001", "CANON-CH12-EVD-008"],
            "human_review_flag": review_flag,
            "human_review_reason": review_reason,
            "notes": "Measures acute intraoperative crises, NOT late postoperative infections."
        }

    def _get_disclaimer(self) -> str:
        return (
            "RESEARCH PROTOTYPE ONLY: The ADRAB Surgical Complexity Scoring Engine provides "
            "independent, rule-based criteria profiling of the technical extent and difficulty of maxillofacial "
            "surgery. It makes NO claim of autonomous clinical accuracy or surgeon replacement. Calculating "
            "an unvalidated composite numerical score or letter grade is strictly prohibited pending formal "
            "multidisciplinary consensus validation."
        )
