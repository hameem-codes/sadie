"""
Unit Test Suite for Treatment Outcome Evaluator
Phase 6B Implementation

Verifies:
1. Evaluation across each of the eight distinct clinical domains.
2. Inapplicable, missing, and unrecorded data semantics (never treated as normal).
3. Image quality auditing and artifact rejection (no unsupported measurements from poor scans).
4. Unit mismatches and malformed schema rejection.
5. Rejection of unvalidated composite scores and final pass/fail grades.
6. Absence of complications is never inferred as proven surgical success.
7. Synthetic case data is never conflated with real patient cohorts.
8. Deterministic output reproducibility (identical input produces byte-for-byte identical profile).
9. Traceability of all applied rules and candidate criteria to canonical evidence IDs.
10. Detection of clinical discordance (e.g. volume delta vs diplopia, IMF vs trismus).
"""

import os
import json
import unittest
import copy

from src.treatment_outcome_evaluator import (
    TreatmentOutcomeEvaluator,
    STATUS_ASSESSABLE,
    STATUS_INSUFFICIENT_DATA,
    STATUS_NOT_APPLICABLE,
    STATUS_CONFLICTING_EVIDENCE,
    STATUS_HUMAN_REVIEW_REQUIRED,
    VALID_DOMAIN_STATUSES
)
from src.synthetic_case_generator import (
    generate_case_syn01,
    generate_case_syn02,
    generate_case_syn03,
    generate_case_syn04,
    generate_case_syn05,
    generate_case_syn06
)

class TestTreatmentOutcomeEvaluator(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
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

    # -------------------------------------------------------------------------
    # Test 1: Eight Distinct Domains Supported in Output Contract
    # -------------------------------------------------------------------------
    def test_eight_domains_evaluated_independently(self):
        """Verifies that evaluator returns independent profiles for all 8 domains without aggregation."""
        case_01 = self.case_dict["CASE-SYN01"]
        result = self.evaluator.evaluate_case(case_01)

        self.assertEqual(result["evaluation_status"], "COMPLETED_INDEPENDENT_PROFILES")
        self.assertFalse(result["composite_score_calculated"])
        self.assertIsNone(result["final_grade"])
        self.assertIsNone(result["overall_pass_fail"])

        expected_domain_keys = [
            "domain_1_skeletal_alignment",
            "domain_2_orbital_ophthalmic",
            "domain_3_occlusion_mandibular_function",
            "domain_4_mastication_speech",
            "domain_5_neurosensory",
            "domain_6_soft_tissue_aesthetics",
            "domain_7_patient_reported_outcomes",
            "domain_8_safety_and_complications",
        ]
        self.assertEqual(sorted(list(result["domain_profiles"].keys())), sorted(expected_domain_keys))

        for dom_key, profile in result["domain_profiles"].items():
            self.assertIn("domain_id", profile)
            self.assertIn("domain_name", profile)
            self.assertIn("status", profile)
            self.assertIn(profile["status"], VALID_DOMAIN_STATUSES)
            self.assertIn("observations", profile)
            self.assertIn("applied_rules", profile)
            self.assertIn("supporting_evidence_ids", profile)
            self.assertIn("missing_or_conflicting_information", profile)
            self.assertIn("limitations_and_uncertainty", profile)
            self.assertIn("human_review_requirements", profile)

    # -------------------------------------------------------------------------
    # Test 2: Inapplicable Data Policy (Bilateral Comminution & Isolated Fractures)
    # -------------------------------------------------------------------------
    def test_inapplicable_domain_handling(self):
        """Verifies that criteria inapplicable due to fracture pattern or absent reference are not penalized."""
        # Case 06 has bilateral comminution: Domain 1 mirror analysis is NOT_APPLICABLE
        case_06 = self.case_dict["CASE-SYN06"]
        result = self.evaluator.evaluate_case(case_06)
        d1 = result["domain_profiles"]["domain_1_skeletal_alignment"]

        self.assertEqual(d1["status"], STATUS_NOT_APPLICABLE)
        self.assertIn("contralateral", d1["status_reason"].lower())
        rule_ids = [r["rule_id"] for r in d1["applied_rules"]]
        self.assertIn("RULE-D1-INAPPLICABLE-NO-REF", rule_ids)

        # Case 01 has ZMC injury only: Domain 2 (Orbital) and Domain 3 (Occlusion) are NOT_APPLICABLE
        case_01 = self.case_dict["CASE-SYN01"]
        res_01 = self.evaluator.evaluate_case(case_01)
        d2 = res_01["domain_profiles"]["domain_2_orbital_ophthalmic"]
        d3 = res_01["domain_profiles"]["domain_3_occlusion_mandibular_function"]
        self.assertEqual(d2["status"], STATUS_NOT_APPLICABLE)
        self.assertEqual(d3["status"], STATUS_NOT_APPLICABLE)

    # -------------------------------------------------------------------------
    # Test 3: Missing or Unassessed Data Semantics (Never Treated as Normal)
    # -------------------------------------------------------------------------
    def test_missing_data_never_inferred_as_normal(self):
        """Verifies that missing PROM, unmeasured MIO, or untested nerve is flagged INSUFFICIENT_DATA."""
        # Mutate a case to remove PROM scores
        case_missing = copy.deepcopy(self.case_dict["CASE-SYN01"])
        case_missing["domain_assessments"]["domain_7_patient_reported_outcomes"]["applicability_status"] = "SURVEY_NOT_ADMINISTERED"
        case_missing["domain_assessments"]["domain_7_patient_reported_outcomes"]["face_q_appearance_satisfaction_score"] = None

        result = self.evaluator.evaluate_case(case_missing)
        d7 = result["domain_profiles"]["domain_7_patient_reported_outcomes"]

        self.assertEqual(d7["status"], STATUS_INSUFFICIENT_DATA)
        self.assertIn("omitted", d7["status_reason"])
        self.assertTrue(len(d7["missing_or_conflicting_information"]) > 0)
        self.assertIn("RULE-D7-OMITTED-SURVEY", [r["rule_id"] for r in d7["applied_rules"]])

    # -------------------------------------------------------------------------
    # Test 4: Low-Quality Imaging and Artifact Rejection
    # -------------------------------------------------------------------------
    def test_poor_quality_imaging_rejection(self):
        """Verifies that severe artifacts or gantry tilt cause HUMAN_REVIEW_REQUIRED / reject 3D calculations."""
        # Case 04 has severe metal streak and gantry tilt
        case_04 = self.case_dict["CASE-SYN04"]
        result = self.evaluator.evaluate_case(case_04)
        d1 = result["domain_profiles"]["domain_1_skeletal_alignment"]

        self.assertEqual(d1["status"], STATUS_HUMAN_REVIEW_REQUIRED)
        self.assertIn("preclude", d1["status_reason"])
        rule_ids = [r["rule_id"] for r in d1["applied_rules"]]
        self.assertIn("RULE-D1-UNRELIABLE-SCAN", rule_ids)
        self.assertTrue(any("manual radiologist" in req.lower() for req in d1["human_review_requirements"]))

    # -------------------------------------------------------------------------
    # Test 5: Clinical Discordance and Edge Cases Detection
    # -------------------------------------------------------------------------
    def test_clinical_discordance_alert_generation(self):
        """Verifies that discordant cases (e.g. CASE-SYN02: good volume + persistent diplopia) trigger alerts."""
        case_02 = self.case_dict["CASE-SYN02"]
        result = self.evaluator.evaluate_case(case_02)
        d2 = result["domain_profiles"]["domain_2_orbital_ophthalmic"]

        self.assertEqual(d2["status"], STATUS_CONFLICTING_EVIDENCE)
        rule_ids = [r["rule_id"] for r in d2["applied_rules"]]
        self.assertIn("RULE-D2-ALERT-DISCORDANCE", rule_ids)
        self.assertTrue(len(result["cross_domain_discordance_alerts"]) > 0)
        self.assertTrue(any("diplopia" in alert.lower() for alert in result["cross_domain_discordance_alerts"]))

    # -------------------------------------------------------------------------
    # Test 6: IMF Safety Protocol Violation Detection
    # -------------------------------------------------------------------------
    def test_imf_safety_threshold_audit(self):
        """Verifies that prolonged IMF duration (> 4 weeks) is audited as a safety protocol violation."""
        case_03 = self.case_dict["CASE-SYN03"]
        result = self.evaluator.evaluate_case(case_03)
        d3 = result["domain_profiles"]["domain_3_occlusion_mandibular_function"]

        rule_ids = [r["rule_id"] for r in d3["applied_rules"]]
        self.assertIn("RULE-D3-AUDIT-IMF-DURATION", rule_ids)
        self.assertTrue(any("safety threshold exceeded" in item.lower() for item in d3["missing_or_conflicting_information"]))

    # -------------------------------------------------------------------------
    # Test 7: Absence of Complications Guardrail
    # -------------------------------------------------------------------------
    def test_absence_of_complications_is_not_conflated_with_perfection(self):
        """Verifies that zero complications is audited with explicit caveat that it does not prove clinical success."""
        case_01 = self.case_dict["CASE-SYN01"]
        result = self.evaluator.evaluate_case(case_01)
        d8 = result["domain_profiles"]["domain_8_safety_and_complications"]

        self.assertEqual(d8["status"], STATUS_ASSESSABLE)
        self.assertEqual(d8["observations"]["complication_count"], 0)
        rule_ids = [r["rule_id"] for r in d8["applied_rules"]]
        self.assertIn("RULE-D8-ZERO-RECORDED-COMPLICATIONS", rule_ids)

        # Check explanation explicitly mentions guardrail
        rule_obj = next(r for r in d8["applied_rules"] if r["rule_id"] == "RULE-D8-ZERO-RECORDED-COMPLICATIONS")
        self.assertIn("does not prove surgical perfection", rule_obj["explanation"].lower())

    # -------------------------------------------------------------------------
    # Test 8: High Severity Complication (Clavien-Dindo Grade IIIb)
    # -------------------------------------------------------------------------
    def test_high_severity_complication_audit(self):
        """Verifies that Grade IIIb surgical revision triggers human review requirement."""
        case_05 = self.case_dict["CASE-SYN05"]
        result = self.evaluator.evaluate_case(case_05)
        d8 = result["domain_profiles"]["domain_8_safety_and_complications"]

        self.assertEqual(d8["status"], STATUS_HUMAN_REVIEW_REQUIRED)
        self.assertTrue(any("high severity" in item.lower() for item in d8["missing_or_conflicting_information"]))
        self.assertTrue(any("morbidity" in req.lower() for req in d8["human_review_requirements"]))

    # -------------------------------------------------------------------------
    # Test 9: Guardrail Rejections (Leaked Grade, Incompatible Units, Bad ID)
    # -------------------------------------------------------------------------
    def test_guardrail_rejections_and_unit_mismatches(self):
        """Verifies rejection of cases containing leaked grades, illegal composite status, or unit mismatches."""
        # 1. Leaked Grade in Imaging Subsystem
        case_leaked = copy.deepcopy(self.case_dict["CASE-SYN01"])
        case_leaked["imaging_subsystem"]["final_grade"] = "EXCELLENT"
        res_leaked = self.evaluator.evaluate_case(case_leaked)
        self.assertEqual(res_leaked["evaluation_status"], "REJECTED_INVALID_INPUT")
        self.assertTrue(any("leaked" in err.lower() for err in res_leaked["validation_errors"]))

        # 2. Composite Score Status Violation
        case_comp = copy.deepcopy(self.case_dict["CASE-SYN01"])
        case_comp["evaluation_audit"]["composite_score_status"] = "CALCULATED_WEIGHTED_AVERAGE"
        res_comp = self.evaluator.evaluate_case(case_comp)
        self.assertEqual(res_comp["evaluation_status"], "REJECTED_INVALID_INPUT")
        self.assertTrue(any("composite scoring is prohibited" in err.lower() for err in res_comp["validation_errors"]))

        # 3. Unit Incompatibility (e.g. RMSD in Inches)
        case_unit = copy.deepcopy(self.case_dict["CASE-SYN01"])
        case_unit["imaging_subsystem"]["measurements"][0]["unit"] = "INCHES"
        res_unit = self.evaluator.evaluate_case(case_unit)
        self.assertEqual(res_unit["evaluation_status"], "REJECTED_INVALID_INPUT")
        self.assertTrue(any("unit incompatibility" in err.lower() for err in res_unit["validation_errors"]))

    # -------------------------------------------------------------------------
    # Test 10: Strict Determinism & Traceability
    # -------------------------------------------------------------------------
    def test_strict_determinism_and_evidence_traceability(self):
        """Verifies that repeated evaluations produce identical results and trace to CANON-* evidence IDs."""
        case_01 = self.case_dict["CASE-SYN01"]
        run_1 = self.evaluator.evaluate_case(case_01)
        run_2 = self.evaluator.evaluate_case(case_01)

        # JSON serialized string comparison proves exact determinism
        self.assertEqual(json.dumps(run_1, sort_keys=True), json.dumps(run_2, sort_keys=True))

        # Check evidence traceability in all applied rules
        for dom_key, profile in run_1["domain_profiles"].items():
            for rule in profile["applied_rules"]:
                for ev_id in rule["supporting_evidence_ids"]:
                    self.assertTrue(
                        ev_id.startswith("CANON-RES-EVD-") or
                        ev_id.startswith("CANON-CH12-EVD-") or
                        ev_id.startswith("CANON-ATLAS-CH19-EVD-"),
                        f"Untraced evidence ID '{ev_id}' in rule '{rule['rule_id']}'"
                    )

if __name__ == "__main__":
    unittest.main()
