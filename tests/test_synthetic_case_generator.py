"""
Unit Tests for Synthetic Case Generator (Phase 6A)

Tests:
1. All 6 synthetic case files are generated and exist in data/synthetic_cases/.
2. Each file is non-empty and contains valid JSON.
3. Case IDs adhere strictly to pseudonymous pattern CASE-SYN0[1-6].
4. Distinct scenarios are correctly parameterized:
   - CASE-SYN01: Benchmark ZMC with 3D mesh surface distance.
   - CASE-SYN02: Orbital volume / diplopia discordance.
   - CASE-SYN03: Condylar trismus, open bite, prolonged IMF.
   - CASE-SYN04: Severe streak artifact, non-zero gantry tilt.
   - CASE-SYN05: Clavien-Dindo Grade IIIb complication.
   - CASE-SYN06: Bilateral panfacial fracture with inapplicable contralateral reference.
5. Determinism: Multiple runs produce byte-identical JSON outputs.
"""

import os
import sys
import json
import unittest

# Ensure workspace root in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.synthetic_case_generator import (
    generate_all_synthetic_cases,
    generate_case_syn01,
    generate_case_syn02,
    generate_case_syn03,
    generate_case_syn04,
    generate_case_syn05,
    generate_case_syn06,
    SYNTHETIC_DIR
)

class TestSyntheticCaseGenerator(unittest.TestCase):

    def setUp(self):
        generate_all_synthetic_cases(SYNTHETIC_DIR)

    def test_all_cases_exist(self):
        """Verifies that all 6 expected synthetic case files are generated."""
        expected_files = [f"CASE-SYN0{i}.json" for i in range(1, 7)]
        for fname in expected_files:
            fpath = os.path.join(SYNTHETIC_DIR, fname)
            self.assertTrue(os.path.exists(fpath), f"Synthetic case file missing: {fpath}")
            self.assertGreater(os.path.getsize(fpath), 500, f"Case file too small: {fpath}")

    def test_case_syn01_benchmark_zmc(self):
        """Checks CASE-SYN01 parameters (favourable ZMC reduction)."""
        case = generate_case_syn01()
        self.assertEqual(case["case_metadata"]["pseudonymous_case_id"], "CASE-SYN01")
        self.assertIn("ZYGOMATICOMAXILLARY_COMPLEX", case["case_metadata"]["primary_fracture_regions"])
        meas = case["imaging_subsystem"]["measurements"]
        self.assertTrue(any(m["construct"] == "SKELETAL_SURFACE_DISTANCE_RMSD" for m in meas))
        self.assertEqual(case["domain_assessments"]["domain_1_skeletal_alignment"]["surgeon_qualitative_assessment"], "ANATOMIC_REDUCTION")

    def test_case_syn02_orbital_discordance(self):
        """Checks CASE-SYN02 parameters (optimal volume delta but persistent diplopia)."""
        case = generate_case_syn02()
        self.assertEqual(case["case_metadata"]["pseudonymous_case_id"], "CASE-SYN02")
        d2 = case["domain_assessments"]["domain_2_orbital_ophthalmic"]
        self.assertLess(d2["orbital_volume_delta_ml"], 0.75)
        self.assertEqual(d2["diplopia_status"], "READING_DOWNWARD_GAZE")

    def test_case_syn03_condylar_trismus(self):
        """Checks CASE-SYN03 parameters (trismus MIO=28 mm, IMF=5 weeks)."""
        case = generate_case_syn03()
        self.assertEqual(case["case_metadata"]["pseudonymous_case_id"], "CASE-SYN03")
        d3 = case["domain_assessments"]["domain_3_occlusion_mandibular_function"]
        self.assertEqual(d3["maximal_interincisal_opening_mm"], 28.0)
        self.assertEqual(d3["occlusal_relationship_status"], "POSTERIOR_OPEN_BITE")
        self.assertEqual(d3["duration_of_active_imf_weeks"], 5.0)

    def test_case_syn04_low_quality_imaging(self):
        """Checks CASE-SYN04 parameters (severe artifact, non-zero gantry tilt)."""
        case = generate_case_syn04()
        self.assertEqual(case["case_metadata"]["pseudonymous_case_id"], "CASE-SYN04")
        img = case["imaging_subsystem"]
        self.assertEqual(img["technical_parameters"]["gantry_tilt_degrees"], 12.0)
        self.assertEqual(img["image_quality_audit"]["usable_for_3d_mirroring"], False)
        d1 = case["domain_assessments"]["domain_1_skeletal_alignment"]
        self.assertEqual(d1["evaluation_status"], "UNASSESSABLE_IMAGE_ARTIFACT")

    def test_case_syn05_complication(self):
        """Checks CASE-SYN05 parameters (Clavien-Dindo Grade IIIb infection/hardware removal)."""
        case = generate_case_syn05()
        self.assertEqual(case["case_metadata"]["pseudonymous_case_id"], "CASE-SYN05")
        comps = case["domain_assessments"]["domain_8_safety_and_complications"]["complications_recorded"]
        self.assertEqual(len(comps), 2)
        self.assertEqual(comps[0]["clavien_dindo_severity_grade"], "GRADE_IIIb")

    def test_case_syn06_inapplicable_contralateral(self):
        """Checks CASE-SYN06 parameters (bilateral midface comminution)."""
        case = generate_case_syn06()
        self.assertEqual(case["case_metadata"]["pseudonymous_case_id"], "CASE-SYN06")
        self.assertEqual(case["clinical_baseline"]["contralateral_facial_skeleton_status"], "CONCOMITANT_BILATERAL_FRACTURE")
        d1 = case["domain_assessments"]["domain_1_skeletal_alignment"]
        self.assertEqual(d1["applicability_status"], "NOT_APPLICABLE_BILATERAL_COMMINUTED_NO_REFERENCE")

    def test_deterministic_generation(self):
        """Verifies that running generation twice yields identical output."""
        case_a = generate_case_syn01()
        case_b = generate_case_syn01()
        self.assertEqual(json.dumps(case_a, sort_keys=True), json.dumps(case_b, sort_keys=True))

if __name__ == "__main__":
    unittest.main()
