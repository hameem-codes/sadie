"""
Unit Tests for Evaluator Test Harness (Phase 6A)

Tests:
1. Valid cases: Evaluates all 6 generated synthetic cases and asserts they pass.
2. Missing required fields: Detects missing top-level and domain keys.
3. Unit mismatch: Flags invalid measurement units (e.g. MILLILITERS for distance).
4. Guardrail violation: Detects leaked clinical grades in the imaging subsystem.
5. Composite score guardrail: Flags invalid composite score statuses.
6. Provenance check: Flags invalid or ungrounded evidence identifiers.
7. Discordance alerts: Detects volume-diplopia discrepancy and IMF safety violation.
"""

import os
import sys
import copy
import unittest

# Ensure workspace root in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.synthetic_case_generator import (
    generate_case_syn01,
    generate_case_syn02,
    generate_case_syn03,
    SYNTHETIC_DIR
)
from src.evaluator_test_harness import (
    EvaluatorTestHarness,
    run_test_harness_on_all_synthetic_cases
)

class TestEvaluatorTestHarness(unittest.TestCase):

    def setUp(self):
        self.harness = EvaluatorTestHarness()

    def test_all_generated_cases_pass_harness(self):
        """Verifies that all 6 generated synthetic cases pass schema and guardrail compliance."""
        results = run_test_harness_on_all_synthetic_cases(SYNTHETIC_DIR)
        self.assertEqual(len(results), 6)
        for res in results:
            self.assertTrue(res["overall_test_passed"], f"Case {res['case_id']} failed harness: {res['schema_errors']}")
            self.assertTrue(res["is_schema_compliant"], f"Case {res['case_id']} schema non-compliant")
            self.assertTrue(res["is_guardrail_compliant"], f"Case {res['case_id']} guardrail non-compliant")

    def test_missing_top_level_property(self):
        """Verifies error detection when a top-level key is omitted."""
        case = generate_case_syn01()
        del case["clinical_baseline"]
        res = self.harness.evaluate_case(case)
        self.assertFalse(res["overall_test_passed"])
        self.assertTrue(any("clinical_baseline" in err for err in res["schema_errors"]))

    def test_invalid_case_id_pattern(self):
        """Verifies regex check on pseudonymous case ID."""
        case = generate_case_syn01()
        case["case_metadata"]["pseudonymous_case_id"] = "INVALID_ID_123"
        res = self.harness.evaluate_case(case)
        self.assertFalse(res["overall_test_passed"])
        self.assertTrue(any("pseudonymous case ID format" in err for err in res["schema_errors"]))

    def test_imaging_subsystem_grade_leakage(self):
        """Verifies guardrail detection when imaging subsystem leaks final outcome grades."""
        case = generate_case_syn01()
        case["imaging_subsystem"]["final_grade"] = "GRADE_A_SUCCESS"
        res = self.harness.evaluate_case(case)
        self.assertFalse(res["overall_test_passed"])
        self.assertTrue(any("GUARDRAIL VIOLATION: Imaging subsystem leaked" in v for v in res["guardrail_violations"]))

    def test_composite_score_prohibition(self):
        """Verifies guardrail detection when composite score status is violated."""
        case = generate_case_syn01()
        case["evaluation_audit"]["composite_score_status"] = "CALCULATED_TOTAL_SCORE_88_POINTS"
        res = self.harness.evaluate_case(case)
        self.assertFalse(res["overall_test_passed"])
        self.assertTrue(any("Composite scoring status" in v for v in res["guardrail_violations"]))

    def test_measurement_unit_mismatch(self):
        """Verifies detection of unit mismatches (e.g. MILLILITERS for distance)."""
        case = generate_case_syn01()
        meas = case["imaging_subsystem"]["measurements"][0]
        meas["unit"] = "MILLILITERS"  # SKELETAL_SURFACE_DISTANCE_RMSD expects MILLIMETERS
        res = self.harness.evaluate_case(case)
        self.assertFalse(res["overall_test_passed"])
        self.assertTrue(any("UNIT MISMATCH" in v for v in res["guardrail_violations"]))

    def test_invalid_evidence_provenance(self):
        """Verifies detection of ungrounded evidence IDs."""
        case = generate_case_syn01()
        meas = case["imaging_subsystem"]["measurements"][0]
        meas["supporting_evidence_id"] = "FABRICATED-EVD-999"
        res = self.harness.evaluate_case(case)
        self.assertFalse(res["overall_test_passed"])
        self.assertTrue(any("EVIDENCE PROVENANCE ERROR" in v for v in res["guardrail_violations"]))

    def test_clinical_discordance_detection(self):
        """Verifies detection of discordance alerts in CASE-SYN02."""
        case = generate_case_syn02()
        res = self.harness.evaluate_case(case)
        self.assertTrue(res["overall_test_passed"])  # Schema is valid, but alert is triggered
        alerts = res["clinical_alerts_and_discordance"]
        self.assertTrue(any("CLINICAL DISCORDANCE ALERT" in a for a in alerts))

    def test_imf_safety_threshold_alert(self):
        """Verifies detection of IMF duration safety violation in CASE-SYN03."""
        case = generate_case_syn03()
        res = self.harness.evaluate_case(case)
        self.assertTrue(res["overall_test_passed"])
        alerts = res["clinical_alerts_and_discordance"]
        self.assertTrue(any("SAFETY THRESHOLD EXCEEDED" in a for a in alerts))

if __name__ == "__main__":
    unittest.main()
