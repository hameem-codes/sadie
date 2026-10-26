"""
Unit & Contract Test Suite for Slicer Processing Scripts
Phase 7B Implementation

Tests:
1. Environment-independent execution of scripts/slicer/inspect_ct_volume.py.
2. Environment-independent execution of scripts/slicer/export_bone_surface.py.
3. Verification of strict input validation (empty paths, malformed case IDs).
4. Rejection of prohibited clinical-grade fields in output metadata.
5. Verification that exported metadata contains explicit human review and provisional flags.
6. Verification that unreviewed surface meshes are not misrepresented as validated treatment scores.
7. Verification that source input files are never overwritten.
"""

import os
import json
import unittest
import tempfile
import shutil

from scripts.slicer.inspect_ct_volume import run_inspection
from scripts.slicer.export_bone_surface import run_export_pipeline

class TestSlicerScripts(unittest.TestCase):

    def setUp(self):
        self.temp_dir = tempfile.mkdtemp()

    def tearDown(self):
        shutil.rmtree(self.temp_dir)

    def test_inspect_ct_volume_contract_compliance(self):
        """Verifies that inspect_ct_volume runs safely and emits compliant JSON metadata."""
        out_json = os.path.join(self.temp_dir, "inspect_meta.json")
        result = run_inspection(
            input_path="dummy_scan.nrrd",
            output_json=out_json,
            case_id="CASE-SYN01"
        )

        self.assertTrue(os.path.exists(out_json))
        with open(out_json, "r", encoding="utf-8") as f:
            data = json.load(f)

        self.assertEqual(data["pseudonymous_case_id"], "CASE-SYN01")
        self.assertEqual(data["human_review_status"], "AUTOMATED_EXTRACTION_UNCONFIRMED")
        self.assertIn("limitations_and_uncertainty", data)

        # Prohibited grade check
        prohibited = {"final_grade", "outcome_score", "pass_fail_status", "surgical_success"}
        self.assertFalse(bool(prohibited.intersection(data.keys())))

    def test_export_bone_surface_contract_compliance(self):
        """Verifies that export_bone_surface runs safely and documents provisional status."""
        out_mesh = os.path.join(self.temp_dir, "mesh.vtk")
        out_meta = os.path.join(self.temp_dir, "export_meta.json")

        result = run_export_pipeline(
            input_path="dummy_scan.nrrd",
            output_mesh_path=out_mesh,
            output_json_path=out_meta,
            case_id="CASE-SYN01",
            lower_threshold_hu=200.0,
            upper_threshold_hu=3000.0
        )

        self.assertTrue(os.path.exists(out_meta))
        with open(out_meta, "r", encoding="utf-8") as f:
            data = json.load(f)

        self.assertEqual(data["pseudonymous_case_id"], "CASE-SYN01")
        self.assertEqual(data["segmentation_parameters"]["lower_threshold_hu"], 200.0)
        self.assertEqual(data["segmentation_parameters"]["upper_threshold_hu"], 3000.0)
        self.assertEqual(data["human_review_status"], "AUTOMATED_EXTRACTION_UNCONFIRMED")

        # Prohibited grade check
        prohibited = {"final_grade", "outcome_score", "pass_fail_status", "surgical_success"}
        self.assertFalse(bool(prohibited.intersection(data.keys())))

        # Guardrail: Meshes alone are not treatment outcome scores
        lims = " ".join(data.get("limitations_and_uncertainty", []))
        self.assertIn("does not constitute a valid postoperative outcome grade", lims.lower())

    def test_reject_non_pseudonymous_case_id(self):
        """Verifies that patient names or non-pseudonymous IDs fail pre-flight validation."""
        out_json = os.path.join(self.temp_dir, "inspect_meta.json")
        with self.assertRaises(ValueError):
            run_inspection(
                input_path="dummy_scan.nrrd",
                output_json=out_json,
                case_id="JOHN_DOE_MRN9999"
            )

    def test_reject_empty_paths(self):
        """Verifies that empty input/output parameters are rejected."""
        with self.assertRaises(ValueError):
            run_inspection(
                input_path="",
                output_json="out.json",
                case_id="CASE-SYN01"
            )

    def test_source_input_path_never_overwritten(self):
        """Verifies that input and output paths cannot be identical."""
        fake_input = os.path.join(self.temp_dir, "scan.nrrd")
        with open(fake_input, "w") as f:
            f.write("test")

        # Destination mesh must not overwrite input volume
        out_mesh = fake_input  # Attempting to overwrite
        out_meta = os.path.join(self.temp_dir, "meta.json")

        with self.assertRaises(ValueError):
            run_export_pipeline(
                input_path=fake_input,
                output_mesh_path=out_mesh,
                output_json_path=out_meta,
                case_id="CASE-SYN01"
            )

        # Destination inspection json must not overwrite input volume
        with self.assertRaises(ValueError):
            run_inspection(
                input_path=fake_input,
                output_json=fake_input,
                case_id="CASE-SYN01"
            )

        # Source input scan content remains intact
        with open(fake_input, "r") as f:
            self.assertEqual(f.read(), "test")

    def test_cli_nonzero_exit_on_fatal_error(self):
        """Verifies that CLI scripts terminate with nonzero exit code on invalid arguments."""
        import subprocess
        import sys

        script_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "scripts", "slicer", "inspect_ct_volume.py")
        out_json = os.path.join(self.temp_dir, "test_err.json")

        proc = subprocess.run(
            [sys.executable, script_path, "--input", "test.nrrd", "--output", out_json, "--case-id", "INVALID_MRN"],
            capture_output=True,
            text=True
        )
        self.assertNotEqual(proc.returncode, 0)
        self.assertIn("FATAL", proc.stderr)

if __name__ == "__main__":
    unittest.main()
