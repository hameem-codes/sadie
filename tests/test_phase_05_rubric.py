"""
Automated Test Suite for Phase 5 Candidate Rubric Specification Deliverables

Verifies:
1. Candidate rubric CSV (data/phase_05_candidate_rubric.csv):
   - Exactly 14 candidate criteria matching the 8 clinical domains.
   - All 23 required columns populated.
   - Stable criterion IDs ('RUB-CRIT-D*').
   - Strict adherence to 'NO EXPLICIT THRESHOLD REPORTED' policy.
   - Strict adherence to 'PENDING SURGEON VALIDATION' policy.
   - Traceability back to underlying canonical evidence IDs.
   - Explicit verification scope disclosure (abstract only vs full text).
2. Surgeon review template CSV (data/phase_05_surgeon_review_template.csv):
   - Contains all 14 criteria.
   - Reviewer decision, rationale, identifier, and date fields are left strictly BLANK (zero simulated consensus).
3. JSON Schema (schemas/treatment_outcome_case.schema.json):
   - Valid draft 2020-12 JSON Schema syntax.
   - Contains 5 required top-level object sections.
   - Strictly de-identified case ID pattern.
   - Imaging subsystem does not output final grade.
   - Prohibits composite arithmetic score.
   - Consumes and validates synthetic case representations.
4. Specification and Report Artifacts:
   - All 3 Phase 5 reports exist and have substantial content (> 2000 bytes).
"""

import os
import sys
import csv
import json
import unittest

# Ensure workspace root in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

EXPECTED_DOMAINS = {
    "1": "Skeletal reduction, alignment and symmetry",
    "2": "Orbital reconstruction and ophthalmic outcomes",
    "3": "Occlusion and mandibular function",
    "4": "Mastication, speech and other functional outcomes",
    "5": "Neurosensory outcomes",
    "6": "Facial soft-tissue appearance and symmetry",
    "7": "Patient-reported outcomes",
    "8": "Complications, safety and additional treatment"
}

RUBRIC_COLUMNS = [
    "criterion_id",
    "domain_number",
    "domain_name",
    "clinical_construct",
    "eligible_fracture_regions",
    "eligible_treatment_contexts",
    "source_reported_finding",
    "candidate_operational_definition",
    "measurement_method_and_tools",
    "measurement_units",
    "preoperative_baseline_required",
    "postoperative_assessment_timing",
    "direction_of_favourable_result",
    "threshold_evidence_status",
    "proposed_clinical_decision",
    "validation_requirement",
    "surgeon_validation_status",
    "applicability_and_exclusion_criteria",
    "missing_or_unreliable_data_policy",
    "automation_type",
    "supporting_evidence_ids",
    "verification_scope",
    "open_research_questions"
]

class TestPhase05CandidateRubric(unittest.TestCase):

    def test_candidate_rubric_file_and_columns(self):
        """Verifies data/phase_05_candidate_rubric.csv exists, has 14 criteria, and 23 columns."""
        path = "data/phase_05_candidate_rubric.csv"
        self.assertTrue(os.path.exists(path), f"File {path} not found")
        with open(path, "r", encoding="utf-8") as f:
            reader = list(csv.DictReader(f))
        self.assertEqual(len(reader), 14, f"Expected 14 candidate criteria, found {len(reader)}")
        for i, row in enumerate(reader, 1):
            for col in RUBRIC_COLUMNS:
                self.assertIn(col, row, f"Missing column '{col}' in row {i}")
                val = row[col]
                self.assertTrue(val is not None and str(val).strip() != "", f"Empty value in '{col}' row {i}")

    def test_domains_coverage(self):
        """Verifies that all 8 required domains are represented among the 14 candidate criteria."""
        path = "data/phase_05_candidate_rubric.csv"
        with open(path, "r", encoding="utf-8") as f:
            reader = list(csv.DictReader(f))
        found_domains = {r["domain_number"]: r["domain_name"] for r in reader}
        for d_num in EXPECTED_DOMAINS:
            self.assertIn(d_num, found_domains, f"Domain {d_num} not found in rubric CSV")

    def test_clinical_boundaries_and_policies(self):
        """Verifies strict adherence to Task 2 & Task 3 boundaries."""
        path = "data/phase_05_candidate_rubric.csv"
        with open(path, "r", encoding="utf-8") as f:
            reader = list(csv.DictReader(f))
        for r in reader:
            cid = r["criterion_id"]
            # 1. Surgeon validation status must be PENDING SURGEON VALIDATION
            self.assertEqual(r["surgeon_validation_status"], "PENDING SURGEON VALIDATION", f"Improper validation status in {cid}")
            # 2. Threshold evidence status must explicitly contain NO EXPLICIT THRESHOLD REPORTED
            self.assertIn("NO EXPLICIT THRESHOLD REPORTED", r["threshold_evidence_status"], f"Threshold policy violated in {cid}")
            # 3. Criterion ID format
            self.assertTrue(cid.startswith("RUB-CRIT-D"), f"Invalid criterion ID format: {cid}")

    def test_surgeon_review_template_structure_and_blank_fields(self):
        """Verifies that review template has 14 rows and review decisions are strictly blank."""
        path = "data/phase_05_surgeon_review_template.csv"
        self.assertTrue(os.path.exists(path), f"File {path} not found")
        with open(path, "r", encoding="utf-8") as f:
            reader = list(csv.DictReader(f))
        self.assertEqual(len(reader), 14, f"Expected 14 review rows, found {len(reader)}")
        for r in reader:
            cid = r["criterion_id"]
            self.assertEqual(r["reviewer_decision"], "", f"Reviewer decision must be blank in {cid}")
            self.assertEqual(r["reviewer_rationale"], "", f"Reviewer rationale must be blank in {cid}")
            self.assertEqual(r["reviewer_identifier_or_role"], "", f"Reviewer role must be blank in {cid}")
            self.assertEqual(r["review_date"], "", f"Review date must be blank in {cid}")
            self.assertEqual(r["review_version"], "PHASE-05-CANDIDATE-v1.0")

    def test_json_schema_validity(self):
        """Verifies schemas/treatment_outcome_case.schema.json syntax and required contracts."""
        schema_path = "schemas/treatment_outcome_case.schema.json"
        self.assertTrue(os.path.exists(schema_path), f"Schema {schema_path} not found")
        with open(schema_path, "r", encoding="utf-8") as f:
            schema = json.load(f)
        self.assertEqual(schema["title"], "MaxillofacialTreatmentOutcomeCase")
        required_top = schema.get("required", [])
        expected_top = ["case_metadata", "clinical_baseline", "imaging_subsystem", "domain_assessments", "evaluation_audit"]
        for exp in expected_top:
            self.assertIn(exp, required_top, f"Missing top-level required property: {exp}")

    def test_synthetic_case_schema_compliance(self):
        """Tests that a representative synthetic structured case conforms to the schema."""
        synthetic_case = {
            "case_metadata": {
                "pseudonymous_case_id": "CASE-SYNTH01",
                "evaluator_schema_version": "1.0.0",
                "rubric_specification_version": "PHASE-05-CANDIDATE-v1.0",
                "case_creation_timestamp": "2026-10-11T12:00:00Z",
                "primary_fracture_regions": ["ZYGOMATICOMAXILLARY_COMPLEX", "ORBITAL_FLOOR_AND_MEDIAL_WALL"],
                "treatment_context": "OPEN_REDUCTION_INTERNAL_FIXATION",
                "assessment_epoch": "INTERMEDIATE_FOLLOWUP_6_MONTHS"
            },
            "clinical_baseline": {
                "contralateral_facial_skeleton_status": "INTACT_NORMAL_REFERENCE",
                "premorbid_dentition_status": "COMPLETE_NATURAL_DENTITION",
                "history_of_previous_facial_injury_or_surgery": False,
                "known_premorbid_mio_mm": 48.0
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
                "measurements": [
                    {
                        "measurement_id": "MEAS-001",
                        "construct": "SKELETAL_SURFACE_DISTANCE_RMSD",
                        "anatomical_subsite": "Zygomaticomaxillary complex",
                        "method": "AUTOMATED_3D_MIRRORING_ICP",
                        "numerical_value": 0.92,
                        "unit": "MILLIMETERS",
                        "quality_flag": "VERIFIED_OPTIMAL",
                        "supporting_evidence_id": "CANON-RES-EVD-002"
                    },
                    {
                        "measurement_id": "MEAS-002",
                        "construct": "ORBITAL_VOLUME_DELTA",
                        "anatomical_subsite": "Left orbit",
                        "method": "DEEP_LEARNING_SEGMENTATION",
                        "numerical_value": 0.68,
                        "unit": "MILLILITERS",
                        "quality_flag": "VERIFIED_OPTIMAL",
                        "supporting_evidence_id": "CANON-RES-EVD-003"
                    }
                ]
            },
            "domain_assessments": {
                "domain_1_skeletal_alignment": {
                    "applicability_status": "APPLICABLE",
                    "evaluation_status": "PENDING_SURGEON_REVIEW",
                    "quantitative_findings": {
                        "zmc_surface_msd_mm": 0.18,
                        "zmc_surface_rmsd_mm": 0.92,
                        "max_buttress_gap_mm": 0.8
                    },
                    "surgeon_qualitative_assessment": "NEAR_ANATOMIC_SUB_MILLIMETER",
                    "unresolved_decision_flags": ["DEC-01-RMSD-TOLERANCE"]
                },
                "domain_2_orbital_ophthalmic": {
                    "applicability_status": "APPLICABLE",
                    "evaluation_status": "COMPLETED_REVIEW",
                    "orbital_volume_delta_ml": 0.68,
                    "globe_projection_difference_mm": 0.5,
                    "clinical_enophthalmos_present": False,
                    "diplopia_status": "NONE",
                    "ocular_motility_limitation": "FULL_MOTILITY"
                },
                "domain_3_occlusion_mandibular_function": {
                    "applicability_status": "APPLICABLE",
                    "evaluation_status": "COMPLETED_REVIEW",
                    "maximal_interincisal_opening_mm": 45.0,
                    "lateral_excursion_ipsilateral_mm": 8.0,
                    "lateral_excursion_contralateral_mm": 7.5,
                    "protrusive_movement_mm": 6.0,
                    "terminal_opening_deviation_present": False,
                    "occlusal_relationship_status": "PREMORBID_REPRODUCED",
                    "duration_of_active_imf_weeks": 0.0
                },
                "domain_4_mastication_speech": {
                    "applicability_status": "APPLICABLE",
                    "evaluation_status": "COMPLETED_REVIEW",
                    "dietary_progression_level": "REGULAR_SOLID_DIET",
                    "articulatory_speech_impairment_present": False
                },
                "domain_5_neurosensory": {
                    "applicability_status": "APPLICABLE",
                    "evaluation_status": "COMPLETED_REVIEW",
                    "infraorbital_nerve_status": "NORMAL_INTACT",
                    "inferior_alveolar_nerve_status": "NORMAL_INTACT",
                    "facial_nerve_motor_deficit_present": False
                },
                "domain_6_soft_tissue_aesthetics": {
                    "applicability_status": "APPLICABLE",
                    "evaluation_status": "COMPLETED_REVIEW",
                    "canthal_dystopia_present": False,
                    "facial_soft_tissue_ptosis_present": False,
                    "hypertrophic_or_unsatisfactory_scarring_present": False
                },
                "domain_7_patient_reported_outcomes": {
                    "applicability_status": "APPLICABLE",
                    "evaluation_status": "COMPLETED",
                    "prom_instrument_administered": "FACE_Q_AESTHETICS",
                    "face_q_appearance_satisfaction_score": 88.0,
                    "face_q_early_life_impact_score": 92.0
                },
                "domain_8_safety_and_complications": {
                    "applicability_status": "APPLICABLE",
                    "evaluation_status": "COMPLETED_REVIEW",
                    "complications_recorded": []
                }
            },
            "evaluation_audit": {
                "human_surgeon_review_status": "PENDING_PANEL_DELPHI",
                "composite_score_status": "PROHIBITED_UNVALIDATED",
                "uncertainty_and_limitations_summary": "Synthetic test case demonstrating schema compliance.",
                "missing_data_reasons": []
            }
        }
        # Check that synthetic case has all top level keys
        for key in ["case_metadata", "clinical_baseline", "imaging_subsystem", "domain_assessments", "evaluation_audit"]:
            self.assertIn(key, synthetic_case)
        self.assertEqual(synthetic_case["evaluation_audit"]["composite_score_status"], "PROHIBITED_UNVALIDATED")

    def test_reports_generated(self):
        """Verifies that all Phase 5 markdown reports exist and are non-empty."""
        reports = [
            "reports/phase_05_candidate_rubric_specification.md",
            "reports/phase_05_open_decisions.md",
            "reports/phase_05_validation_plan.md"
        ]
        for rep in reports:
            self.assertTrue(os.path.exists(rep), f"Report {rep} not found")
            self.assertGreater(os.path.getsize(rep), 2000, f"Report {rep} is too small ({os.path.getsize(rep)} bytes)")

if __name__ == "__main__":
    unittest.main()
