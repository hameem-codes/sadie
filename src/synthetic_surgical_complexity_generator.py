"""
Synthetic Case Generator for Maxillofacial Surgical Complexity Assessment
ADRAB System — Synthetic Surgical Complexity Dataset

Generates at least 12 explicitly labeled, diverse synthetic test cases spanning:
1. Low, Moderate, High, and Extreme surgical complexity patterns.
2. Distinct fracture distributions (isolated zygoma, mandibular angle, panfacial, NOE, orbital).
3. Complex reconstruction with excellent postoperative outcomes (decoupling proof).
4. Uncomplicated surgery with severe postoperative infection (decoupling proof).
5. Cases with missing operative information (never treated as zero).
6. Cases with contradictory operative documentation.
7. Cases with insufficient information to calculate a defensible profile.
8. Cases with severe acute intraoperative complications.

Guarantees:
- Purely synthetic / fictional data (no real patient identifiers, PHI, or empirical cohorts).
- Strict adherence to schemas/surgical_complexity_case.schema.json.
- Deterministic output.
"""

import os
import json
from typing import Dict, Any, List

SYNTHETIC_COMPLEXITY_DIR = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "data",
    "synthetic_surgical_complexity_cases"
)


def get_base_complexity_case(case_id: str) -> Dict[str, Any]:
    """Returns baseline schema-compliant synthetic surgical complexity case."""
    return {
        "case_metadata": {
            "pseudonymous_case_id": case_id,
            "schema_version": "1.0.0",
            "rubric_specification_version": "SURGICAL-COMPLEXITY-v1.0",
            "case_creation_timestamp": "2026-10-20T10:00:00Z",
            "patient_age_group": "ADULT_18_TO_64",
            "asa_physical_status": "ASA_I"
        },
        "fracture_characterization": {
            "fracture_locations": ["ZYGOMATICOMAXILLARY_COMPLEX"],
            "documented_severity": "DISPLACED_NON_COMMINUTED",
            "bilateral_injury": False,
            "panfacial_involvement": False,
            "occlusal_derangement_preop": "PRESERVED_NORMAL"
        },
        "operative_details": {
            "anatomical_regions_operated": ["MIDFACE_MAXILLARY_ZYGOMATIC"],
            "bones_operated": ["ZYGOMA"],
            "reduction_complexity": "OPEN_DIRECT_ANATOMIC_SIMPLE",
            "procedures_performed": ["OPEN_REDUCTION_INTERNAL_FIXATION"],
            "surgical_approaches": ["MAXILLARY_VESTIBULAR_GINGIVOBUCCAL", "SUBCILIARY_TRANSCUTANEOUS"],
            "staged_procedure": {
                "is_staged": False,
                "stage_number": None,
                "total_planned_stages": None,
                "timing_description": None
            }
        },
        "hardware_inventory": {
            "hardware_documented": True,
            "plate_count": 2,
            "screw_count": 8,
            "mesh_implant_count": 0,
            "custom_patient_specific_implant_used": False,
            "reconstruction_plate_used": False,
            "fixation_sites": ["ZYGOMATICOMAXILLARY_BUTTRESS", "INFRAORBITAL_RIM"]
        },
        "soft_tissue_and_associated_injuries": {
            "extensive_facial_lacerations_or_degloving": False,
            "primary_nerve_repair_or_decompression": False,
            "lacrimal_system_repair_or_intubation": False,
            "concomitant_cervical_spine_injury": False,
            "concomitant_traumatic_brain_injury": False,
            "concomitant_vascular_injury": False
        },
        "intraoperative_events_and_resources": {
            "operative_duration_minutes": 110.0,
            "estimated_blood_loss_ml": 100.0,
            "blood_transfusion_units": 0.0,
            "intraoperative_complications": ["NONE_DOCUMENTED"],
            "unplanned_additional_interventions": []
        },
        "complexity_evaluation_audit": {
            "evaluator_disclaimer": "PROTOTYPE TESTING FIXTURE: Synthetic fictional case.",
            "surgeon_validation_status": "PENDING_SURGEON_CONSENSUS_VALIDATION",
            "composite_score_status": "PROHIBITED_UNVALIDATED_PROFILE_ONLY",
            "known_postoperative_outcome_reference": "UNCOMPLICATED_HEALING"
        }
    }


# =============================================================================
# 12 Case Definitions
# =============================================================================

def generate_case_sc01() -> Dict[str, Any]:
    """CASE-SC01: Isolated Unilateral ZMC Fracture (Low-to-Moderate Complexity)."""
    case = get_base_complexity_case("CASE-SC01")
    return case


def generate_case_sc02() -> Dict[str, Any]:
    """CASE-SC02: Isolated Mandibular Angle Fracture Treated with Single Miniplate (Low Complexity)."""
    case = get_base_complexity_case("CASE-SC02")
    case["fracture_characterization"]["fracture_locations"] = ["MANDIBULAR_ANGLE"]
    case["fracture_characterization"]["documented_severity"] = "DISPLACED_NON_COMMINUTED"
    case["fracture_characterization"]["occlusal_derangement_preop"] = "PRESERVED_NORMAL"

    case["operative_details"]["anatomical_regions_operated"] = ["LOWER_FACE_MANDIBULAR"]
    case["operative_details"]["bones_operated"] = ["MANDIBLE"]
    case["operative_details"]["reduction_complexity"] = "OPEN_DIRECT_ANATOMIC_SIMPLE"
    case["operative_details"]["procedures_performed"] = ["OPEN_REDUCTION_INTERNAL_FIXATION", "INTERMAXILLARY_FIXATION_APPLICATION"]
    case["operative_details"]["surgical_approaches"] = ["MANDIBULAR_VESTIBULAR_INTRAORAL"]

    case["hardware_inventory"]["plate_count"] = 1
    case["hardware_inventory"]["screw_count"] = 4
    case["hardware_inventory"]["fixation_sites"] = ["SUPERIOR_BORDER_OBLIQUE_RIDGE"]

    case["intraoperative_events_and_resources"]["operative_duration_minutes"] = 65.0
    case["intraoperative_events_and_resources"]["estimated_blood_loss_ml"] = 50.0
    case["complexity_evaluation_audit"]["known_postoperative_outcome_reference"] = "ANATOMIC_UNION_NORMAL_OCCLUSION"
    return case


def generate_case_sc03() -> Dict[str, Any]:
    """CASE-SC03: Complex Panfacial Trauma (High Complexity: Le Fort II/III + Mandible + Frontal)."""
    case = get_base_complexity_case("CASE-SC03")
    case["fracture_characterization"]["fracture_locations"] = [
        "FRONTAL_SINUS_ANTERIOR_TABLE",
        "LE_FORT_II",
        "LE_FORT_III",
        "ZYGOMATICOMAXILLARY_COMPLEX",
        "ORBITAL_FLOOR",
        "MANDIBULAR_SYMPHYSIS_PARASYMPHYSIS",
        "MANDIBULAR_CONDYLE_HEAD_NECK"
    ]
    case["fracture_characterization"]["documented_severity"] = "COMMINUTED_SEGMENTAL"
    case["fracture_characterization"]["bilateral_injury"] = True
    case["fracture_characterization"]["panfacial_involvement"] = True
    case["fracture_characterization"]["occlusal_derangement_preop"] = "GROSS_DISARTICULATION"

    case["operative_details"]["anatomical_regions_operated"] = [
        "UPPER_FACE_CRANIOFACIAL",
        "ORBITAL_INTERNAL",
        "MIDFACE_MAXILLARY_ZYGOMATIC",
        "LOWER_FACE_MANDIBULAR"
    ]
    case["operative_details"]["bones_operated"] = ["FRONTAL_BONE", "ZYGOMA", "MAXILLA", "MANDIBLE"]
    case["operative_details"]["reduction_complexity"] = "OPEN_COMMINUTED_REASSEMBLY_PUZZLE"
    case["operative_details"]["procedures_performed"] = [
        "OPEN_REDUCTION_INTERNAL_FIXATION",
        "INTERNAL_ORBITAL_RECONSTRUCTION_MESH",
        "INTERMAXILLARY_FIXATION_APPLICATION",
        "TRACHEOSTOMY_SURGICAL"
    ]
    case["operative_details"]["surgical_approaches"] = [
        "CORONAL_BICORONAL",
        "TRANSCONJUNCTIVAL_RETROSEPTAL_PRESEPTAL",
        "MAXILLARY_VESTIBULAR_GINGIVOBUCCAL",
        "MANDIBULAR_VESTIBULAR_INTRAORAL"
    ]

    case["hardware_inventory"]["plate_count"] = 7
    case["hardware_inventory"]["screw_count"] = 28
    case["hardware_inventory"]["mesh_implant_count"] = 2
    case["hardware_inventory"]["reconstruction_plate_used"] = True
    case["hardware_inventory"]["fixation_sites"] = [
        "FRONTOMAXILLARY_BUTTRESS",
        "ZYGOMATICOMAXILLARY_BUTTRESS_BILATERAL",
        "INFRAORBITAL_RIM_BILATERAL",
        "MANDIBULAR_INFERIOR_BORDER_RECON",
        "MANDIBULAR_ALVEOLAR_TENSION_BAND"
    ]

    case["soft_tissue_and_associated_injuries"]["extensive_facial_lacerations_or_degloving"] = True
    case["soft_tissue_and_associated_injuries"]["concomitant_cervical_spine_injury"] = True
    case["soft_tissue_and_associated_injuries"]["concomitant_traumatic_brain_injury"] = True

    case["intraoperative_events_and_resources"]["operative_duration_minutes"] = 430.0
    case["intraoperative_events_and_resources"]["estimated_blood_loss_ml"] = 950.0
    case["intraoperative_events_and_resources"]["blood_transfusion_units"] = 2.0
    case["intraoperative_events_and_resources"]["intraoperative_complications"] = ["NONE_DOCUMENTED"]

    case["complexity_evaluation_audit"]["known_postoperative_outcome_reference"] = "SATISFACTORY_SYMMETRY_AND_OCCLUSION_DESPITE_EXTREME_SURGERY"
    return case


def generate_case_sc04() -> Dict[str, Any]:
    """CASE-SC04: Highly Complex Surgery with Flawless Postoperative Recovery (Decoupling Test)."""
    case = get_base_complexity_case("CASE-SC04")
    case["fracture_characterization"]["fracture_locations"] = [
        "ORBITAL_FLOOR",
        "ORBITAL_MEDIAL_WALL",
        "ZYGOMATICOMAXILLARY_COMPLEX",
        "LE_FORT_I"
    ]
    case["fracture_characterization"]["documented_severity"] = "COMMINUTED_SEGMENTAL"
    case["fracture_characterization"]["bilateral_injury"] = False
    case["fracture_characterization"]["panfacial_involvement"] = False
    case["fracture_characterization"]["occlusal_derangement_preop"] = "ANTERIOR_OPEN_BITE"

    case["operative_details"]["anatomical_regions_operated"] = ["ORBITAL_INTERNAL", "MIDFACE_MAXILLARY_ZYGOMATIC"]
    case["operative_details"]["bones_operated"] = ["ZYGOMA", "MAXILLA"]
    case["operative_details"]["reduction_complexity"] = "COMPUTER_ASSISTED_NAVIGATION_OR_PSI"
    case["operative_details"]["procedures_performed"] = [
        "OPEN_REDUCTION_INTERNAL_FIXATION",
        "INTERNAL_ORBITAL_RECONSTRUCTION_PSI",
        "CANTHOPEXY_MEDIAL_OR_LATERAL"
    ]
    case["operative_details"]["surgical_approaches"] = [
        "TRANSCONJUNCTIVAL_RETROSEPTAL_PRESEPTAL",
        "MAXILLARY_VESTIBULAR_GINGIVOBUCCAL"
    ]

    case["hardware_inventory"]["plate_count"] = 4
    case["hardware_inventory"]["screw_count"] = 16
    case["hardware_inventory"]["mesh_implant_count"] = 1
    case["hardware_inventory"]["custom_patient_specific_implant_used"] = True

    case["intraoperative_events_and_resources"]["operative_duration_minutes"] = 285.0
    case["intraoperative_events_and_resources"]["estimated_blood_loss_ml"] = 350.0

    # Postop outcome is stellar: zero diplopia, perfect volume, high FACE-Q
    case["complexity_evaluation_audit"]["known_postoperative_outcome_reference"] = "PERFECT_ENOPHTHALMOS_CORRECTION_ZERO_DIPLOPIA_PROMS_92"
    return case


def generate_case_sc05() -> Dict[str, Any]:
    """CASE-SC05: Simple Surgery Followed by Severe Postoperative Complication (Decoupling Test)."""
    case = get_base_complexity_case("CASE-SC05")
    # Low complexity operative details
    case["fracture_characterization"]["fracture_locations"] = ["MANDIBULAR_BODY"]
    case["fracture_characterization"]["documented_severity"] = "DISPLACED_NON_COMMINUTED"

    case["operative_details"]["anatomical_regions_operated"] = ["LOWER_FACE_MANDIBULAR"]
    case["operative_details"]["bones_operated"] = ["MANDIBLE"]
    case["operative_details"]["reduction_complexity"] = "OPEN_DIRECT_ANATOMIC_SIMPLE"
    case["operative_details"]["procedures_performed"] = ["OPEN_REDUCTION_INTERNAL_FIXATION"]
    case["operative_details"]["surgical_approaches"] = ["MANDIBULAR_VESTIBULAR_INTRAORAL"]

    case["hardware_inventory"]["plate_count"] = 1
    case["hardware_inventory"]["screw_count"] = 4

    case["intraoperative_events_and_resources"]["operative_duration_minutes"] = 55.0
    case["intraoperative_events_and_resources"]["estimated_blood_loss_ml"] = 40.0

    # The patient develops an osteomyelitis and hardware infection at 4 weeks requiring secondary plate removal
    case["complexity_evaluation_audit"]["known_postoperative_outcome_reference"] = "POSTOP_CLAVIEN_DINDO_GRADE_IIIB_OSTEOMYELITIS_PLATE_REMOVAL"
    return case


def generate_case_sc06() -> Dict[str, Any]:
    """CASE-SC06: Missing Hardware Log and Operative Duration (Missing Data Safety Test)."""
    case = get_base_complexity_case("CASE-SC06")
    case["fracture_characterization"]["fracture_locations"] = ["ZYGOMATICOMAXILLARY_COMPLEX", "ORBITAL_FLOOR"]
    case["fracture_characterization"]["documented_severity"] = "DISPLACED_NON_COMMINUTED"

    # Hardware is undocumented
    case["hardware_inventory"]["hardware_documented"] = False
    case["hardware_inventory"]["plate_count"] = None
    case["hardware_inventory"]["screw_count"] = None
    case["hardware_inventory"]["fixation_sites"] = []

    # Operative duration and blood loss are missing from anesthesia sheet
    case["intraoperative_events_and_resources"]["operative_duration_minutes"] = None
    case["intraoperative_events_and_resources"]["estimated_blood_loss_ml"] = None

    return case


def generate_case_sc07() -> Dict[str, Any]:
    """CASE-SC07: Contradictory Operative Documentation (Audit Discrepancy Test)."""
    case = get_base_complexity_case("CASE-SC07")
    # Discrepancy 1: Plate count is 3, but screws are 0
    case["hardware_inventory"]["plate_count"] = 3
    case["hardware_inventory"]["screw_count"] = 0

    # Discrepancy 2: Complications list contains NONE_DOCUMENTED AND severe hemorrhage
    case["intraoperative_events_and_resources"]["intraoperative_complications"] = [
        "NONE_DOCUMENTED",
        "SIGNIFICANT_HAEMORRHAGE_INTERNAL_MAXILLARY_OR_ETHMOIDAL"
    ]
    return case


def generate_case_sc08() -> Dict[str, Any]:
    """CASE-SC08: Severe Acute Intraoperative Complication (Internal Maxillary Artery Bleed)."""
    case = get_base_complexity_case("CASE-SC08")
    case["fracture_characterization"]["fracture_locations"] = ["LE_FORT_I", "ZYGOMATICOMAXILLARY_COMPLEX"]
    case["fracture_characterization"]["documented_severity"] = "DISPLACED_NON_COMMINUTED"

    case["operative_details"]["procedures_performed"] = ["OPEN_REDUCTION_INTERNAL_FIXATION"]
    case["intraoperative_events_and_resources"]["operative_duration_minutes"] = 340.0
    case["intraoperative_events_and_resources"]["estimated_blood_loss_ml"] = 1600.0
    case["intraoperative_events_and_resources"]["blood_transfusion_units"] = 4.0
    case["intraoperative_events_and_resources"]["intraoperative_complications"] = [
        "SIGNIFICANT_HAEMORRHAGE_INTERNAL_MAXILLARY_OR_ETHMOIDAL"
    ]
    case["intraoperative_events_and_resources"]["unplanned_additional_interventions"] = [
        "Transoral packing of pterygomaxillary fissure and emergent selective embolization."
    ]
    return case


def generate_case_sc09() -> Dict[str, Any]:
    """CASE-SC09: Insufficient Information Case (Truncated Records, Undefensible Score)."""
    case = get_base_complexity_case("CASE-SC09")
    # Severely depleted fields
    case["fracture_characterization"]["fracture_locations"] = []
    case["fracture_characterization"]["documented_severity"] = "UNSPECIFIED_OR_UNDOCUMENTED"

    case["operative_details"]["anatomical_regions_operated"] = []
    case["operative_details"]["bones_operated"] = []
    case["operative_details"]["reduction_complexity"] = "UNDOCUMENTED"
    case["operative_details"]["procedures_performed"] = []
    case["operative_details"]["surgical_approaches"] = []

    case["hardware_inventory"]["hardware_documented"] = False
    case["hardware_inventory"]["plate_count"] = None
    case["hardware_inventory"]["screw_count"] = None

    case["intraoperative_events_and_resources"]["operative_duration_minutes"] = None
    case["intraoperative_events_and_resources"]["estimated_blood_loss_ml"] = None
    return case


def generate_case_sc10() -> Dict[str, Any]:
    """CASE-SC10: High-Energy Craniomaxillofacial Trauma with Denis 3-Column Cervical Spine Injury."""
    case = get_base_complexity_case("CASE-SC10")
    case["fracture_characterization"]["fracture_locations"] = [
        "FRONTAL_SINUS_ANTERIOR_TABLE",
        "FRONTAL_SINUS_POSTERIOR_TABLE",
        "NASOETHMOID_COMPLEX",
        "ORBITAL_ROOF"
    ]
    case["fracture_characterization"]["documented_severity"] = "COMMINUTED_SEGMENTAL"

    case["operative_details"]["anatomical_regions_operated"] = ["UPPER_FACE_CRANIOFACIAL", "ORBITAL_INTERNAL"]
    case["operative_details"]["bones_operated"] = ["FRONTAL_BONE", "NASAL_ETHMOID_BONES"]
    case["operative_details"]["procedures_performed"] = [
        "FRONTAL_SINUS_OBLITERATION_OR_CRANIALIZATION",
        "OPEN_REDUCTION_INTERNAL_FIXATION",
        "CANTHOPEXY_MEDIAL_OR_LATERAL"
    ]
    case["operative_details"]["surgical_approaches"] = ["CORONAL_BICORONAL"]

    # Concomitant cervical spine trauma
    case["soft_tissue_and_associated_injuries"]["concomitant_cervical_spine_injury"] = True
    case["soft_tissue_and_associated_injuries"]["concomitant_traumatic_brain_injury"] = True

    case["intraoperative_events_and_resources"]["operative_duration_minutes"] = 380.0
    case["intraoperative_events_and_resources"]["estimated_blood_loss_ml"] = 550.0
    return case


def generate_case_sc11() -> Dict[str, Any]:
    """CASE-SC11: Staged Bilateral Subcondylar and Symphysis Fracture Reconstruction."""
    case = get_base_complexity_case("CASE-SC11")
    case["fracture_characterization"]["fracture_locations"] = [
        "MANDIBULAR_SYMPHYSIS_PARASYMPHYSIS",
        "MANDIBULAR_CONDYLE_HEAD_NECK"
    ]
    case["fracture_characterization"]["documented_severity"] = "COMMINUTED_SEGMENTAL"
    case["fracture_characterization"]["bilateral_injury"] = True

    case["operative_details"]["anatomical_regions_operated"] = ["LOWER_FACE_MANDIBULAR"]
    case["operative_details"]["bones_operated"] = ["MANDIBLE"]
    case["operative_details"]["reduction_complexity"] = "OPEN_MULTIAXIAL_DIFFICULT_TRACTION"
    case["operative_details"]["procedures_performed"] = [
        "OPEN_REDUCTION_INTERNAL_FIXATION",
        "INTERMAXILLARY_FIXATION_APPLICATION"
    ]
    case["operative_details"]["surgical_approaches"] = [
        "MANDIBULAR_VESTIBULAR_INTRAORAL",
        "RETROMANDIBULAR",
        "PREAURICULAR_ENDRUM"
    ]
    case["operative_details"]["staged_procedure"] = {
        "is_staged": True,
        "stage_number": 1,
        "total_planned_stages": 2,
        "timing_description": "Stage 1 symphysis and right condyle ORIF; Stage 2 left condyle arthroplasty."
    }

    case["hardware_inventory"]["plate_count"] = 4
    case["hardware_inventory"]["screw_count"] = 16
    case["hardware_inventory"]["reconstruction_plate_used"] = True

    case["intraoperative_events_and_resources"]["operative_duration_minutes"] = 270.0
    case["intraoperative_events_and_resources"]["estimated_blood_loss_ml"] = 300.0
    return case


def generate_case_sc12() -> Dict[str, Any]:
    """CASE-SC12: Extensive Facial Degloving, Facial Nerve Transection and Soft Tissue Reconstruction."""
    case = get_base_complexity_case("CASE-SC12")
    case["fracture_characterization"]["fracture_locations"] = [
        "ZYGOMATICOMAXILLARY_COMPLEX",
        "MANDIBULAR_ANGLE",
        "MANDIBULAR_BODY"
    ]
    case["fracture_characterization"]["documented_severity"] = "HIGH_ENERGY_CRUSH_BONE_LOSS"

    case["operative_details"]["anatomical_regions_operated"] = [
        "MIDFACE_MAXILLARY_ZYGOMATIC",
        "LOWER_FACE_MANDIBULAR"
    ]
    case["operative_details"]["bones_operated"] = ["ZYGOMA", "MAXILLA", "MANDIBLE"]
    case["operative_details"]["procedures_performed"] = [
        "OPEN_REDUCTION_INTERNAL_FIXATION",
        "AUTOLOGOUS_BONE_GRAFTING"
    ]
    case["operative_details"]["surgical_approaches"] = [
        "LOCAL_LACERATION_EXISTING",
        "RISDON_SUBMANDIBULAR",
        "MAXILLARY_VESTIBULAR_GINGIVOBUCCAL"
    ]

    case["soft_tissue_and_associated_injuries"]["extensive_facial_lacerations_or_degloving"] = True
    case["soft_tissue_and_associated_injuries"]["primary_nerve_repair_or_decompression"] = True
    case["soft_tissue_and_associated_injuries"]["lacrimal_system_repair_or_intubation"] = True

    case["hardware_inventory"]["plate_count"] = 5
    case["hardware_inventory"]["screw_count"] = 20
    case["hardware_inventory"]["reconstruction_plate_used"] = True

    case["intraoperative_events_and_resources"]["operative_duration_minutes"] = 390.0
    case["intraoperative_events_and_resources"]["estimated_blood_loss_ml"] = 650.0
    return case


# =============================================================================
# Generator Registry and Runner
# =============================================================================

GENERATORS = [
    ("CASE-SC01.json", generate_case_sc01),
    ("CASE-SC02.json", generate_case_sc02),
    ("CASE-SC03.json", generate_case_sc03),
    ("CASE-SC04.json", generate_case_sc04),
    ("CASE-SC05.json", generate_case_sc05),
    ("CASE-SC06.json", generate_case_sc06),
    ("CASE-SC07.json", generate_case_sc07),
    ("CASE-SC08.json", generate_case_sc08),
    ("CASE-SC09.json", generate_case_sc09),
    ("CASE-SC10.json", generate_case_sc10),
    ("CASE-SC11.json", generate_case_sc11),
    ("CASE-SC12.json", generate_case_sc12),
]


def generate_all_surgical_complexity_cases(output_dir: str = SYNTHETIC_COMPLEXITY_DIR) -> List[str]:
    """Generates all 12 synthetic cases and saves them to the designated directory."""
    os.makedirs(output_dir, exist_ok=True)
    created_paths = []
    for fname, func in GENERATORS:
        data = func()
        fpath = os.path.join(output_dir, fname)
        with open(fpath, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
        created_paths.append(fpath)
        print(f"Generated synthetic surgical complexity case: {fpath}")
    return created_paths


if __name__ == "__main__":
    generate_all_surgical_complexity_cases()
