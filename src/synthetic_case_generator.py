"""
Synthetic Case Generator for Maxillofacial Treatment-Outcome Evaluator
Phase 6A Implementation

Generates deterministic, explicitly labeled synthetic case files that conform strictly
to schemas/treatment_outcome_case.schema.json.
Guarantees:
1. Purely synthetic / fictional data (no real patient identifiers, PHI, or empirical clinical cohorts).
2. Diverse anatomical fracture regions, treatment contexts, and longitudinal follow-up epochs.
3. Explicit edge cases: missing measurements, conflicting observations, low-quality imaging flags,
   inapplicable domains, and Clavien-Dindo complications.
4. Deterministic output based on seed / case specifications.
"""

import os
import json
from typing import Dict, Any, List

SYNTHETIC_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "synthetic_cases")

def get_base_synthetic_case(case_id: str) -> Dict[str, Any]:
    """Returns a schema-compliant baseline synthetic case structure."""
    return {
        "case_metadata": {
            "pseudonymous_case_id": case_id,
            "evaluator_schema_version": "1.0.0",
            "rubric_specification_version": "PHASE-05-CANDIDATE-v1.0",
            "case_creation_timestamp": "2026-10-11T12:00:00Z",
            "primary_fracture_regions": ["ZYGOMATICOMAXILLARY_COMPLEX"],
            "treatment_context": "OPEN_REDUCTION_INTERNAL_FIXATION",
            "assessment_epoch": "INTERMEDIATE_FOLLOWUP_6_MONTHS"
        },
        "clinical_baseline": {
            "contralateral_facial_skeleton_status": "INTACT_NORMAL_REFERENCE",
            "premorbid_dentition_status": "COMPLETE_NATURAL_DENTITION",
            "history_of_previous_facial_injury_or_surgery": False,
            "known_premorbid_mio_mm": 45.0
        },
        "imaging_subsystem": {
            "imaging_modality": "MULTI_DETECTOR_CT",
            "scan_timing": "POSTOPERATIVE_FOLLOWUP",
            "technical_parameters": {
                "slice_thickness_mm": 0.75,
                "reconstruction_kernel": "BONE",
                "gantry_tilt_degrees": 0.0
            },
            "image_quality_audit": {
                "metal_hardware_artifact_severity": "MILD_NON_OBSCURING",
                "patient_motion_artifact_present": False,
                "field_of_view_adequacy": "COMPLETE_FACIAL_SKELETON",
                "usable_for_3d_mirroring": True
            },
            "measurements": []
        },
        "domain_assessments": {
            "domain_1_skeletal_alignment": {
                "applicability_status": "APPLICABLE",
                "evaluation_status": "PENDING_SURGEON_REVIEW",
                "quantitative_findings": {
                    "zmc_surface_msd_mm": None,
                    "zmc_surface_rmsd_mm": None,
                    "max_buttress_gap_mm": None
                },
                "surgeon_qualitative_assessment": "NOT_EVALUATED",
                "unresolved_decision_flags": []
            },
            "domain_2_orbital_ophthalmic": {
                "applicability_status": "NOT_APPLICABLE_NO_ORBITAL_FRACTURE",
                "evaluation_status": "COMPLETED_REVIEW",
                "orbital_volume_delta_ml": None,
                "globe_projection_difference_mm": None,
                "clinical_enophthalmos_present": None,
                "diplopia_status": "UNTESTED",
                "ocular_motility_limitation": "UNTESTED"
            },
            "domain_3_occlusion_mandibular_function": {
                "applicability_status": "NOT_APPLICABLE_NO_MANDIBULAR_OR_MAXILLARY_INJURY",
                "evaluation_status": "COMPLETED_REVIEW",
                "maximal_interincisal_opening_mm": None,
                "lateral_excursion_ipsilateral_mm": None,
                "lateral_excursion_contralateral_mm": None,
                "protrusive_movement_mm": None,
                "terminal_opening_deviation_present": None,
                "occlusal_relationship_status": "UNEVALUATED",
                "duration_of_active_imf_weeks": None
            },
            "domain_4_mastication_speech": {
                "applicability_status": "NOT_APPLICABLE",
                "evaluation_status": "UNASSESSED",
                "dietary_progression_level": "UNRECORDED",
                "articulatory_speech_impairment_present": None
            },
            "domain_5_neurosensory": {
                "applicability_status": "NOT_APPLICABLE",
                "evaluation_status": "UNASSESSED",
                "infraorbital_nerve_status": "UNTESTED",
                "inferior_alveolar_nerve_status": "UNTESTED",
                "facial_nerve_motor_deficit_present": None
            },
            "domain_6_soft_tissue_aesthetics": {
                "applicability_status": "NOT_APPLICABLE",
                "evaluation_status": "UNASSESSED",
                "canthal_dystopia_present": None,
                "facial_soft_tissue_ptosis_present": None,
                "hypertrophic_or_unsatisfactory_scarring_present": None
            },
            "domain_7_patient_reported_outcomes": {
                "applicability_status": "SURVEY_NOT_ADMINISTERED",
                "evaluation_status": "NOT_ASSESSED",
                "prom_instrument_administered": "NONE",
                "face_q_appearance_satisfaction_score": None,
                "face_q_early_life_impact_score": None
            },
            "domain_8_safety_and_complications": {
                "applicability_status": "APPLICABLE",
                "evaluation_status": "COMPLETED_REVIEW",
                "complications_recorded": []
            }
        },
        "evaluation_audit": {
            "human_surgeon_review_status": "UNREVIEWED_MACHINE_EXTRACTED_ONLY",
            "composite_score_status": "PROHIBITED_UNVALIDATED",
            "uncertainty_and_limitations_summary": "Synthetic test case demonstrating schema compliance.",
            "missing_data_reasons": []
        }
    }

def generate_case_syn01() -> Dict[str, Any]:
    """CASE-SYN01: Benchmark Anatomical ZMC Reduction (Standard Favourable)."""
    case = get_base_synthetic_case("CASE-SYN01")
    case["case_metadata"]["primary_fracture_regions"] = ["ZYGOMATICOMAXILLARY_COMPLEX", "ZYGOMATIC_ARCH"]
    case["case_metadata"]["treatment_context"] = "OPEN_REDUCTION_INTERNAL_FIXATION"
    case["case_metadata"]["assessment_epoch"] = "INTERMEDIATE_FOLLOWUP_6_MONTHS"
    
    case["imaging_subsystem"]["measurements"] = [
        {
            "measurement_id": "MEAS-SYN01-01",
            "construct": "SKELETAL_SURFACE_DISTANCE_RMSD",
            "anatomical_subsite": "Zygomaticomaxillary complex",
            "method": "AUTOMATED_3D_MIRRORING_ICP",
            "numerical_value": 0.78,
            "unit": "MILLIMETERS",
            "quality_flag": "VERIFIED_OPTIMAL",
            "supporting_evidence_id": "CANON-RES-EVD-002"
        },
        {
            "measurement_id": "MEAS-SYN01-02",
            "construct": "ANTERIOR_BUTTRESS_DISPLACEMENT_GAP",
            "anatomical_subsite": "Zygomaticomaxillary buttress",
            "method": "MANUAL_LANDMARK_TRIANGULATION",
            "numerical_value": 0.50,
            "unit": "MILLIMETERS",
            "quality_flag": "VERIFIED_OPTIMAL",
            "supporting_evidence_id": "CANON-CH12-EVD-001"
        }
    ]
    
    d1 = case["domain_assessments"]["domain_1_skeletal_alignment"]
    d1["applicability_status"] = "APPLICABLE"
    d1["evaluation_status"] = "PENDING_SURGEON_REVIEW"
    d1["quantitative_findings"]["zmc_surface_msd_mm"] = 0.12
    d1["quantitative_findings"]["zmc_surface_rmsd_mm"] = 0.78
    d1["quantitative_findings"]["max_buttress_gap_mm"] = 0.50
    d1["surgeon_qualitative_assessment"] = "ANATOMIC_REDUCTION"
    d1["unresolved_decision_flags"] = ["DEC-01-RMSD-TOLERANCE"]
    
    d7 = case["domain_assessments"]["domain_7_patient_reported_outcomes"]
    d7["applicability_status"] = "APPLICABLE"
    d7["evaluation_status"] = "COMPLETED"
    d7["prom_instrument_administered"] = "FACE_Q_AESTHETICS"
    d7["face_q_appearance_satisfaction_score"] = 85.0
    d7["face_q_early_life_impact_score"] = 90.0
    
    return case

def generate_case_syn02() -> Dict[str, Any]:
    """CASE-SYN02: Discordant Orbital Fracture (Perfect Volume Delta 0.4 mL, but Persistent Reading Diplopia)."""
    case = get_base_synthetic_case("CASE-SYN02")
    case["case_metadata"]["primary_fracture_regions"] = ["ORBITAL_FLOOR_AND_MEDIAL_WALL"]
    case["case_metadata"]["treatment_context"] = "ENDOSCOPIC_COMPUTER_ASSISTED_RECONSTRUCTION"
    case["case_metadata"]["assessment_epoch"] = "INTERMEDIATE_FOLLOWUP_6_MONTHS"
    
    case["imaging_subsystem"]["measurements"] = [
        {
            "measurement_id": "MEAS-SYN02-01",
            "construct": "ORBITAL_VOLUME_DELTA",
            "anatomical_subsite": "Left orbit",
            "method": "DEEP_LEARNING_SEGMENTATION",
            "numerical_value": 0.42,
            "unit": "MILLILITERS",
            "quality_flag": "VERIFIED_OPTIMAL",
            "supporting_evidence_id": "CANON-RES-EVD-003"
        },
        {
            "measurement_id": "MEAS-SYN02-02",
            "construct": "GLOBE_PROJECTION_DELTA_HERTEL",
            "anatomical_subsite": "Left eye",
            "method": "MANUAL_LANDMARK_TRIANGULATION",
            "numerical_value": 0.60,
            "unit": "MILLIMETERS",
            "quality_flag": "VERIFIED_OPTIMAL",
            "supporting_evidence_id": "CANON-RES-EVD-004"
        }
    ]
    
    case["domain_assessments"]["domain_1_skeletal_alignment"]["applicability_status"] = "NOT_APPLICABLE_NO_BONY_FRACTURE"
    
    d2 = case["domain_assessments"]["domain_2_orbital_ophthalmic"]
    d2["applicability_status"] = "APPLICABLE"
    d2["evaluation_status"] = "COMPLETED_REVIEW"
    d2["orbital_volume_delta_ml"] = 0.42
    d2["globe_projection_difference_mm"] = 0.60
    d2["clinical_enophthalmos_present"] = False
    d2["diplopia_status"] = "READING_DOWNWARD_GAZE"  # Clinical discordance
    d2["ocular_motility_limitation"] = "MILD_ELEVATION_RESTRICTION"
    
    case["evaluation_audit"]["uncertainty_and_limitations_summary"] = "Clinical discordance noted: Volume delta is optimal (0.42 mL), but persistent reading diplopia is present."
    return case

def generate_case_syn03() -> Dict[str, Any]:
    """CASE-SYN03: Mandibular Condylar Fracture with Trismus & Occlusal Discrepancy."""
    case = get_base_synthetic_case("CASE-SYN03")
    case["case_metadata"]["primary_fracture_regions"] = ["MANDIBULAR_CONDYLE_AND_SUBCONDYLE"]
    case["case_metadata"]["treatment_context"] = "CLOSED_REDUCTION_WITH_IMF"
    case["case_metadata"]["assessment_epoch"] = "EARLY_FOLLOWUP_6_WEEKS"
    case["clinical_baseline"]["known_premorbid_mio_mm"] = 52.0
    
    case["imaging_subsystem"]["imaging_modality"] = "PLAIN_RADIOGRAPHY_PANORAMIC"
    case["imaging_subsystem"]["technical_parameters"]["slice_thickness_mm"] = None
    case["imaging_subsystem"]["technical_parameters"]["gantry_tilt_degrees"] = None
    case["imaging_subsystem"]["image_quality_audit"]["usable_for_3d_mirroring"] = False
    
    d3 = case["domain_assessments"]["domain_3_occlusion_mandibular_function"]
    d3["applicability_status"] = "APPLICABLE"
    d3["evaluation_status"] = "COMPLETED_REVIEW"
    d3["maximal_interincisal_opening_mm"] = 28.0  # Trismus (< 35 mm)
    d3["lateral_excursion_ipsilateral_mm"] = 3.0
    d3["lateral_excursion_contralateral_mm"] = 2.0
    d3["protrusive_movement_mm"] = 2.5
    d3["terminal_opening_deviation_present"] = True
    d3["occlusal_relationship_status"] = "POSTERIOR_OPEN_BITE"
    d3["duration_of_active_imf_weeks"] = 5.0  # Exceeds 4-week safety guideline
    
    d4 = case["domain_assessments"]["domain_4_mastication_speech"]
    d4["applicability_status"] = "APPLICABLE"
    d4["evaluation_status"] = "COMPLETED_REVIEW"
    d4["dietary_progression_level"] = "NON_CHEW_PUREED_DIET"
    d4["articulatory_speech_impairment_present"] = True
    
    return case

def generate_case_syn04() -> Dict[str, Any]:
    """CASE-SYN04: Severely Corrupted CT Image (Hardware Streak Artifact, Invalidating 3D Mirroring)."""
    case = get_base_synthetic_case("CASE-SYN04")
    case["case_metadata"]["primary_fracture_regions"] = ["MANDIBULAR_ANGLE", "MANDIBULAR_BODY"]
    case["case_metadata"]["treatment_context"] = "OPEN_REDUCTION_INTERNAL_FIXATION"
    case["case_metadata"]["assessment_epoch"] = "IMMEDIATE_POSTOPERATIVE_0_TO_2_WEEKS"
    
    img = case["imaging_subsystem"]
    img["technical_parameters"]["slice_thickness_mm"] = 2.5  # Suboptimal thick slice
    img["technical_parameters"]["gantry_tilt_degrees"] = 12.0  # Non-zero gantry tilt
    img["image_quality_audit"]["metal_hardware_artifact_severity"] = "SEVERE_INVALIDATING"
    img["image_quality_audit"]["patient_motion_artifact_present"] = True
    img["image_quality_audit"]["field_of_view_adequacy"] = "TRUNCATED_MANDIBLE"
    img["image_quality_audit"]["usable_for_3d_mirroring"] = False
    
    img["measurements"] = [
        {
            "measurement_id": "MEAS-SYN04-01",
            "construct": "ANTERIOR_BUTTRESS_DISPLACEMENT_GAP",
            "anatomical_subsite": "Mandibular angle inferior border",
            "method": "MANUAL_LANDMARK_TRIANGULATION",
            "numerical_value": None,
            "unit": "MILLIMETERS",
            "quality_flag": "UNRELIABLE_MOTION",
            "supporting_evidence_id": "CANON-CH12-EVD-028"
        }
    ]
    
    d1 = case["domain_assessments"]["domain_1_skeletal_alignment"]
    d1["applicability_status"] = "APPLICABLE"
    d1["evaluation_status"] = "UNASSESSABLE_IMAGE_ARTIFACT"
    
    case["evaluation_audit"]["missing_data_reasons"] = [
        "Severe titanium hardware streak artifact obscuring inferior mandibular border.",
        "Gantry tilt of 12.0 degrees invalidates 3D multiplanar surface reconstruction.",
        "Motion artifact present; slice thickness of 2.5 mm exceeds fine-slice threshold (<= 1.25 mm)."
    ]
    return case

def generate_case_syn05() -> Dict[str, Any]:
    """CASE-SYN05: Complication Case (Deep Hardware Infection requiring Clavien-Dindo Grade IIIb Removal)."""
    case = get_base_synthetic_case("CASE-SYN05")
    case["case_metadata"]["primary_fracture_regions"] = ["MANDIBULAR_ANGLE"]
    case["case_metadata"]["treatment_context"] = "OPEN_REDUCTION_INTERNAL_FIXATION"
    case["case_metadata"]["assessment_epoch"] = "INTERMEDIATE_FOLLOWUP_3_MONTHS"
    
    d8 = case["domain_assessments"]["domain_8_safety_and_complications"]
    d8["applicability_status"] = "APPLICABLE"
    d8["evaluation_status"] = "COMPLETED_REVIEW"
    d8["complications_recorded"] = [
        {
            "complication_type": "SURGICAL_SITE_INFECTION_DEEP_HARDWARE",
            "onset_timing_weeks": 4.0,
            "clavien_dindo_severity_grade": "GRADE_IIIb",
            "additional_intervention_required": "Incision and drainage with operative removal of infected angle miniplate under general anesthesia."
        },
        {
            "complication_type": "SYMPTOMATIC_HARDWARE_REMOVAL",
            "onset_timing_weeks": 4.5,
            "clavien_dindo_severity_grade": "GRADE_IIIb",
            "additional_intervention_required": "Titanium osteosynthesis hardware removal."
        }
    ]
    
    d5 = case["domain_assessments"]["domain_5_neurosensory"]
    d5["applicability_status"] = "APPLICABLE"
    d5["evaluation_status"] = "COMPLETED_REVIEW"
    d5["inferior_alveolar_nerve_status"] = "HYPOAESTHESIA"
    
    case["evaluation_audit"]["uncertainty_and_limitations_summary"] = "Severe complication event recorded: Clavien-Dindo Grade IIIb hardware removal at 4 weeks."
    return case

def generate_case_syn06() -> Dict[str, Any]:
    """CASE-SYN06: Bilateral Comminuted Midface (Contralateral Reference Inapplicable)."""
    case = get_base_synthetic_case("CASE-SYN06")
    case["case_metadata"]["primary_fracture_regions"] = ["LE_FORT_II", "LE_FORT_III", "NASOETHMOID_COMPLEX"]
    case["case_metadata"]["treatment_context"] = "OPEN_REDUCTION_INTERNAL_FIXATION"
    case["case_metadata"]["assessment_epoch"] = "LATE_STABLE_12_MONTHS"
    
    case["clinical_baseline"]["contralateral_facial_skeleton_status"] = "CONCOMITANT_BILATERAL_FRACTURE"
    
    img = case["imaging_subsystem"]
    img["image_quality_audit"]["usable_for_3d_mirroring"] = False
    img["measurements"] = [
        {
            "measurement_id": "MEAS-SYN06-01",
            "construct": "SKELETAL_SURFACE_DISTANCE_RMSD",
            "anatomical_subsite": "Bilateral midface",
            "method": "AUTOMATED_3D_MIRRORING_ICP",
            "numerical_value": None,
            "unit": "MILLIMETERS",
            "quality_flag": "UNMEASURABLE_ABSENT_CONTRALATERAL",
            "supporting_evidence_id": "CANON-RES-EVD-001"
        }
    ]
    
    d1 = case["domain_assessments"]["domain_1_skeletal_alignment"]
    d1["applicability_status"] = "NOT_APPLICABLE_BILATERAL_COMMINUTED_NO_REFERENCE"
    d1["evaluation_status"] = "COMPLETED_REVIEW"
    d1["surgeon_qualitative_assessment"] = "RESIDUAL_DISPLACEMENT_ACCEPTABLE"
    
    d7 = case["domain_assessments"]["domain_7_patient_reported_outcomes"]
    d7["applicability_status"] = "APPLICABLE"
    d7["evaluation_status"] = "COMPLETED"
    d7["prom_instrument_administered"] = "FACE_Q_CRANIOFACIAL"
    d7["face_q_appearance_satisfaction_score"] = 72.0
    d7["face_q_early_life_impact_score"] = 78.0
    
    case["evaluation_audit"]["missing_data_reasons"] = [
        "Contralateral skeletal mirroring is inapplicable due to severe bilateral panfacial comminution."
    ]
    return case

def generate_all_synthetic_cases(output_dir: str = SYNTHETIC_DIR) -> List[str]:
    """Generates all 6 standardized synthetic test cases into the designated directory."""
    os.makedirs(output_dir, exist_ok=True)
    generators = [
        ("CASE-SYN01.json", generate_case_syn01),
        ("CASE-SYN02.json", generate_case_syn02),
        ("CASE-SYN03.json", generate_case_syn03),
        ("CASE-SYN04.json", generate_case_syn04),
        ("CASE-SYN05.json", generate_case_syn05),
        ("CASE-SYN06.json", generate_case_syn06)
    ]
    created_paths = []
    for fname, gen_func in generators:
        case_data = gen_func()
        file_path = os.path.join(output_dir, fname)
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(case_data, f, indent=2)
        created_paths.append(file_path)
        print(f"Generated synthetic case: {file_path}")
    return created_paths

if __name__ == "__main__":
    generate_all_synthetic_cases()
