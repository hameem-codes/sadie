"""
Unit Test Suite for Surgical Complexity Evaluator Engine
ADRAB Project — Surgical Complexity Assessment

Verifies:
1. Evaluator evaluates all 9 surgical complexity criteria independently.
2. Refusal to compute unvalidated scalar composite scores, letter grades, or percentages.
3. Explicit detection of missing data (missing inputs flagged, never treated as zero).
4. Detection of contradictory operative documentation (e.g. 3 plates with 0 screws, or none + complication).
5. Explicit handling of cases with insufficient information to calculate a defensible profile.
6. Decoupling of complexity from outcome:
   - Case SC04: Complex multi-bone reconstruction with flawless recovery retains high complexity.
   - Case SC05: Simple single-bone surgery with severe late complication retains low complexity.
7. Verification of all 12 synthetic cases against the external fixture fixture/surgical_complexity_expected_results.json.
8. Deterministic output reproducibility.
"""

import os
import json
import unittest

from src.surgical_complexity_evaluator import (
    SurgicalComplexityEvaluator,
    STATUS_ASSESSABLE,
    STATUS_INSUFFICIENT_DATA,
    STATUS_CONFLICTING_EVIDENCE,
    STATUS_HUMAN_REVIEW_REQUIRED,
    STATUS_NOT_APPLICABLE,
    VALID_CRITERION_STATUSES,
    RUBRIC_VERSION
)
from src.synthetic_surgical_complexity_generator import (
    generate_all_surgical_complexity_cases,
    SYNTHETIC_COMPLEXITY_DIR
)


class TestSurgicalComplexityEvaluator(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.evaluator = SurgicalComplexityEvaluator()
        # Ensure cases are generated
        generate_all_surgical_complexity_cases()

        # Load fixture
        fixture_path = os.path.join(
            os.path.dirname(__file__),
            "fixtures",
            "surgical_complexity_expected_results.json"
        )
        with open(fixture_path, "r", encoding="utf-8") as f:
            cls.expected_fixtures = json.load(f)

        # Load cases from data directory
        cls.case_dict = {}
        for fname in sorted(os.listdir(SYNTHETIC_COMPLEXITY_DIR)):
            if fname.endswith(".json"):
                fpath = os.path.join(SYNTHETIC_COMPLEXITY_DIR, fname)
                with open(fpath, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    cid = data["case_metadata"]["pseudonymous_case_id"]
                    cls.case_dict[cid] = data

    def test_all_12_cases_loaded(self):
        """Verifies that at least 12 synthetic cases are loaded and evaluated."""
        self.assertGreaterEqual(len(self.case_dict), 12)
        for i in range(1, 13):
            cid = f"CASE-SC{i:02d}"
            self.assertIn(cid, self.case_dict, f"Missing {cid}")

    def test_nine_criteria_evaluated_independently(self):
        """Verifies that evaluator returns independent profiles for all 9 criteria without aggregation."""
        case = self.case_dict["CASE-SC01"]
        res = self.evaluator.evaluate_case(case)

        self.assertEqual(res["rubric_version"], RUBRIC_VERSION)
        self.assertFalse(res["composite_score_calculated"])
        self.assertIsNone(res["composite_score"])
        self.assertEqual(res["composite_score_status"], "PROHIBITED_UNVALIDATED_PARALLEL_PROFILES_ONLY")

        expected_criteria = [f"COMPLEX-CRIT-{i:02d}" for i in range(1, 10)]
        self.assertEqual(sorted(list(res["criteria_profiles"].keys())), sorted(expected_criteria))

        for cid, prof in res["criteria_profiles"].items():
            self.assertEqual(prof["criterion_id"], cid)
            self.assertIn(prof["status"], VALID_CRITERION_STATUSES)
            self.assertIn("complexity_tier", prof)
            self.assertIn("evidence_ids", prof)
            self.assertIn("missing_inputs", prof)
            self.assertIn("human_review_flag", prof)

    def test_clinical_decoupling_complex_surgery_with_good_outcome(self):
        """
        CASE-SC04: Complex multi-bone computer-guided reconstruction with perfect recovery.
        Asserts that surgical complexity remains high and is not attenuated by the good outcome.
        """
        case = self.case_dict["CASE-SC04"]
        res = self.evaluator.evaluate_case(case)

        c1 = res["criteria_profiles"]["COMPLEX-CRIT-01"]
        c3 = res["criteria_profiles"]["COMPLEX-CRIT-03"]
        c5 = res["criteria_profiles"]["COMPLEX-CRIT-05"]

        self.assertEqual(c1["complexity_tier"], "HIGH_COMPLEXITY_SKELETAL_INJURY")
        self.assertEqual(c3["complexity_tier"], "LEVEL_4_ADVANCED_COMPUTER_GUIDED")
        self.assertEqual(c5["complexity_tier"], "HEAVY_HARDWARE_BURDEN")
        self.assertFalse(res["composite_score_calculated"])

    def test_clinical_decoupling_simple_surgery_with_adverse_outcome(self):
        """
        CASE-SC05: Simple single-bone surgery with subsequent severe osteomyelitis / plate removal.
        Asserts that surgical complexity remains low and is not conflated with the late complication.
        """
        case = self.case_dict["CASE-SC05"]
        res = self.evaluator.evaluate_case(case)

        c1 = res["criteria_profiles"]["COMPLEX-CRIT-01"]
        c2 = res["criteria_profiles"]["COMPLEX-CRIT-02"]
        c5 = res["criteria_profiles"]["COMPLEX-CRIT-05"]

        self.assertEqual(c1["complexity_tier"], "MODERATE_COMPLEXITY_SKELETAL_INJURY")
        self.assertEqual(c2["complexity_tier"], "MONOSTOTIC_SINGLE_COMPARTMENT_SURGERY")
        self.assertEqual(c5["complexity_tier"], "LOW_HARDWARE_BURDEN")
        self.assertEqual(res["criteria_profiles"]["COMPLEX-CRIT-09"]["complexity_tier"], "UNEVENTFUL_INTRAOPERATIVE_COURSE")

    def test_missing_data_not_silently_zeroed(self):
        """
        CASE-SC06: Missing hardware logs and operative duration.
        Asserts that missing data is explicitly flagged as INSUFFICIENT_DATA and human review is requested.
        """
        case = self.case_dict["CASE-SC06"]
        res = self.evaluator.evaluate_case(case)

        c5 = res["criteria_profiles"]["COMPLEX-CRIT-05"]
        c8 = res["criteria_profiles"]["COMPLEX-CRIT-08"]

        self.assertEqual(c5["status"], STATUS_INSUFFICIENT_DATA)
        self.assertEqual(c8["status"], STATUS_INSUFFICIENT_DATA)
        self.assertTrue(res["human_review_required"])
        self.assertGreater(len(res["missing_inputs"]), 0)

    def test_conflicting_evidence_detection(self):
        """
        CASE-SC07: Contradictory hardware and intraoperative logs.
        Asserts that CONFLICTING_OPERATIVE_EVIDENCE status is emitted with human review flag.
        """
        case = self.case_dict["CASE-SC07"]
        res = self.evaluator.evaluate_case(case)

        self.assertEqual(res["evaluation_status"], "CONFLICTING_OPERATIVE_EVIDENCE")
        self.assertTrue(res["human_review_required"])
        self.assertEqual(res["criteria_profiles"]["COMPLEX-CRIT-05"]["status"], STATUS_CONFLICTING_EVIDENCE)
        self.assertEqual(res["criteria_profiles"]["COMPLEX-CRIT-09"]["status"], STATUS_CONFLICTING_EVIDENCE)

    def test_insufficient_information_case_rejection(self):
        """
        CASE-SC09: Severely depleted record.
        Asserts that overall evaluation status is INSUFFICIENT_DATA_FOR_DEFENSIBLE_PROFILE.
        """
        case = self.case_dict["CASE-SC09"]
        res = self.evaluator.evaluate_case(case)

        self.assertEqual(res["evaluation_status"], "INSUFFICIENT_DATA_FOR_DEFENSIBLE_PROFILE")
        self.assertTrue(res["human_review_required"])

    def test_severe_intraoperative_complication_handling(self):
        """
        CASE-SC08: Internal maxillary artery hemorrhage requiring packing and transfusion.
        Asserts that Criterion 9 flags the acute crisis and human review is recommended.
        """
        case = self.case_dict["CASE-SC08"]
        res = self.evaluator.evaluate_case(case)

        c9 = res["criteria_profiles"]["COMPLEX-CRIT-09"]
        self.assertEqual(c9["complexity_tier"], "CRITICAL_INTRAOPERATIVE_EVENT_OR_UNPLANNED_INTERVENTION")
        self.assertTrue(c9["human_review_flag"])
        self.assertTrue(res["human_review_required"])

    def test_fixture_validation_across_all_cases(self):
        """
        Validates all 12 cases against expected results in test fixture.
        """
        for cid, expected in self.expected_fixtures.items():
            case = self.case_dict[cid]
            res = self.evaluator.evaluate_case(case)

            self.assertEqual(
                res["evaluation_status"],
                expected["expected_evaluation_status"],
                f"Mismatch in evaluation status for {cid}"
            )
            self.assertEqual(res["composite_score_calculated"], expected["expected_composite_calculated"])
            self.assertEqual(res["human_review_required"], expected["expected_human_review_required"])

            if "expected_criteria_tiers" in expected:
                for crit_id, exp_tier in expected["expected_criteria_tiers"].items():
                    actual_tier = res["criteria_profiles"][crit_id]["complexity_tier"]
                    self.assertEqual(
                        actual_tier,
                        exp_tier,
                        f"Tier mismatch in {cid} for {crit_id}: expected {exp_tier}, got {actual_tier}"
                    )

    def test_deterministic_reproducibility(self):
        """Verifies that running evaluator twice on the same case gives identical results."""
        case = self.case_dict["CASE-SC03"]
        res1 = self.evaluator.evaluate_case(case)
        res2 = self.evaluator.evaluate_case(case)

        self.assertEqual(json.dumps(res1, sort_keys=True), json.dumps(res2, sort_keys=True))


if __name__ == "__main__":
    unittest.main()
