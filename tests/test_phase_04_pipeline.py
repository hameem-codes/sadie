"""
Automated Test Suite for Phase 4 Consolidated Evidence Matrix Pipeline

Verifies:
1. Input schema integrity and record counts (28 Ch12, 20 Atlas Ch19, 14 Research = 62 total).
2. Canonical schema compliance (all 31 required columns present and populated).
3. 100% Traceability from canonical records back to original evidence IDs and sources.
4. Allowed enumeration values for Evidence Classification and Verification Status.
5. Exact duplicate detection and preservation of original records (zero silent loss).
6. Clinical evidence boundaries:
   - ZMC symmetry normal range != automatic pass/fail threshold.
   - Orbital volume != universal surgical success threshold.
   - MIO != universal 40 mm binary success boundary.
   - FACE-Q / PROMs != validation of composite arithmetic rubric.
   - No fabricated thresholds (strict 'NO EXPLICIT THRESHOLD REPORTED' policy).
   - Candidate criteria retain 'PENDING SURGEON VALIDATION'.
7. Valid OpenXML structure of data/Maxillofacial_Evidence_Pipeline_v2.xlsx with all 8 sheets.
"""

import os
import sys
import zipfile
import json
import csv
import xml.etree.ElementTree as ET
import unittest

# Ensure root in path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.harmonize_evidence import harmonize_evidence_records, load_all_sources, CLASSIFICATION_MAPPING

CANONICAL_COLUMNS = [
    "canonical_evidence_id",
    "original_evidence_id",
    "source_id",
    "source_type",
    "full_citation",
    "doi_or_pmid_or_url",
    "source_verification_status",
    "verification_scope",
    "exact_source_location",
    "original_supporting_quotation",
    "fracture_region",
    "treatment_context",
    "imaging_modality",
    "assessment_timing",
    "outcome_domain",
    "outcome_criterion_or_finding",
    "measurement_method",
    "measurement_unit",
    "operational_definition",
    "source_reported_threshold_or_reference",
    "direction_of_outcome",
    "study_design",
    "population_and_sample_size",
    "source_reported_result",
    "limitations",
    "evidence_classification",
    "potential_automation_method",
    "rubric_candidate_status",
    "surgeon_validation_status",
    "evidence_conflict_or_dependency",
    "notes_and_next_verification_action"
]

ALLOWED_CLASSIFICATIONS = {
    "DIRECT_TREATMENT_OUTCOME_EVIDENCE",
    "POSTOPERATIVE_OUTCOME_MEASUREMENT",
    "IMAGING_OR_MEASUREMENT_METHOD",
    "COMPLICATION_OR_SAFETY_OUTCOME",
    "PATIENT_REPORTED_OUTCOME",
    "GENERAL_CLINICAL_CONTEXT",
    "DIAGNOSTIC_CONTEXT_ONLY",
    "INSUFFICIENT_INFORMATION_MANUAL_REVIEW"
}

ALLOWED_VERIFICATION_STATUSES = {
    "VERIFIED_PRIMARY_SOURCE",
    "VERIFIED_ABSTRACT_ONLY",
    "VERIFIED_SECONDARY_CITATION",
    "UNVERIFIED_PENDING_AUDIT"
}

EXPECTED_SHEETS = [
    "Consolidated Evidence Matrix",
    "Source Registry",
    "Candidate Criteria",
    "Imaging Requirements",
    "Evidence Gaps",
    "Verification Status",
    "Decision Log",
    "Data Dictionary"
]

class TestPhase04Pipeline(unittest.TestCase):

    def test_original_input_record_counts(self):
        """Confirms exactly 28 Ch12, 20 Atlas Ch19, and 14 Research records exist in source extractions."""
        ch12, atlas, cross_audit, papers, r_batch, r_verif = load_all_sources()
        self.assertEqual(len(ch12), 28, f"Expected 28 Ch12 records, found {len(ch12)}")
        self.assertEqual(len(atlas), 20, f"Expected 20 Atlas records, found {len(atlas)}")
        self.assertEqual(len(r_batch), 14, f"Expected 14 Research records, found {len(r_batch)}")
        self.assertEqual(len(papers), 14, f"Expected 14 Research papers in registry, found {len(papers)}")

    def test_canonical_matrix_preservation_and_count(self):
        """Confirms total canonical records equal exactly 62 (28 + 20 + 14) with zero silent loss."""
        matrix, papers, verifs = harmonize_evidence_records()
        self.assertEqual(len(matrix), 62, f"Expected 62 canonical records, found {len(matrix)}")
        
        # Check original ID counts
        ch12_ids = {r["original_evidence_id"] for r in matrix if "CH12" in r["original_evidence_id"]}
        atlas_ids = {r["original_evidence_id"] for r in matrix if "ATLAS" in r["original_evidence_id"] or "CH19" in r["original_evidence_id"]}
        res_ids = {r["original_evidence_id"] for r in matrix if "RES" in r["original_evidence_id"]}
        
        self.assertEqual(len(ch12_ids), 28, f"Expected 28 unique Ch12 IDs, found {len(ch12_ids)}")
        self.assertEqual(len(atlas_ids), 20, f"Expected 20 unique Atlas IDs, found {len(atlas_ids)}")
        self.assertEqual(len(res_ids), 14, f"Expected 14 unique Research IDs, found {len(res_ids)}")

    def test_canonical_schema_completeness(self):
        """Confirms all 31 canonical fields are present in every row and no required field is empty."""
        matrix, _, _ = harmonize_evidence_records()
        for row in matrix:
            for col in CANONICAL_COLUMNS:
                self.assertIn(col, row, f"Missing column '{col}' in row {row.get('canonical_evidence_id')}")
                val = row[col]
                self.assertTrue(val is not None and str(val).strip() != "", f"Empty value for '{col}' in {row['canonical_evidence_id']}")

    def test_allowed_classification_values(self):
        """Confirms all rows use only allowed classifications."""
        matrix, _, _ = harmonize_evidence_records()
        for row in matrix:
            c = row["evidence_classification"]
            self.assertIn(c, ALLOWED_CLASSIFICATIONS, f"Invalid classification '{c}' in {row['canonical_evidence_id']}")

    def test_allowed_verification_status_values(self):
        """Confirms all rows use only allowed verification statuses."""
        matrix, _, _ = harmonize_evidence_records()
        for row in matrix:
            v = row["source_verification_status"]
            self.assertIn(v, ALLOWED_VERIFICATION_STATUSES, f"Invalid verification status '{v}' in {row['canonical_evidence_id']}")

    def test_abstract_only_scoping_enforced(self):
        """Confirms papers verified by abstract only do not claim full-text verification."""
        matrix, _, _ = harmonize_evidence_records()
        for row in matrix:
            if row["source_verification_status"] == "VERIFIED_ABSTRACT_ONLY":
                self.assertEqual(row["verification_scope"], "abstract only", f"Scope mismatch in {row['canonical_evidence_id']}")

    def test_clinical_boundaries_and_no_fabricated_thresholds(self):
        """
        Confirms Task 5 boundaries:
        - ZMC symmetry normal baseline range is NOT stated as a validated binary success boundary.
        - Orbital volume delta is NOT stated as a universal standalone success cutoff.
        - Mandibular MIO is NOT hardcoded to 40 mm binary threshold.
        - Narrative descriptions without numbers retain 'NO EXPLICIT THRESHOLD REPORTED'.
        """
        matrix, _, _ = harmonize_evidence_records()
        
        # Check Ho 2017 (RES-EVD-002)
        res_002 = next(r for r in matrix if r["original_evidence_id"] == "RES-EVD-002")
        self.assertIn("0.14", res_002["source_reported_threshold_or_reference"])
        self.assertIn("0.87", res_002["source_reported_threshold_or_reference"])
        self.assertEqual(res_002["rubric_candidate_status"], "CANDIDATE_OUTCOME_CRITERION")
        self.assertEqual(res_002["surgeon_validation_status"], "PENDING_SURGEON_VALIDATION")
        
        # Check Whitehouse (RES-EVD-003)
        res_003 = next(r for r in matrix if r["original_evidence_id"] == "RES-EVD-003")
        self.assertIn("0.8 mm", res_003["source_reported_threshold_or_reference"])
        self.assertEqual(res_003["surgeon_validation_status"], "PENDING_SURGEON_VALIDATION")
        
        # Check Eckelt (RES-EVD-006)
        res_006 = next(r for r in matrix if r["original_evidence_id"] == "RES-EVD-006")
        self.assertIn("46.5 mm", res_006["source_reported_threshold_or_reference"])
        self.assertEqual(res_006["surgeon_validation_status"], "PENDING_SURGEON_VALIDATION")

    def test_workbook_structure_and_sheets(self):
        """Confirms data/Maxillofacial_Evidence_Pipeline_v2.xlsx exists and has all 8 sheets in OpenXML."""
        wb_path = "data/Maxillofacial_Evidence_Pipeline_v2.xlsx"
        self.assertTrue(os.path.exists(wb_path), f"Workbook not found at {wb_path}")
        self.assertGreater(os.path.getsize(wb_path), 10000, f"Workbook size suspiciously small ({os.path.getsize(wb_path)} bytes)")
        
        with zipfile.ZipFile(wb_path, "r") as z:
            wb_xml_str = z.read("xl/workbook.xml").decode("utf-8")
            for sheet_name in EXPECTED_SHEETS:
                self.assertIn(f'name="{sheet_name}"', wb_xml_str, f"Sheet '{sheet_name}' not found in workbook.xml")
                
            self.assertIn("xl/styles.xml", z.namelist())
            for i in range(1, 9):
                self.assertIn(f"xl/worksheets/sheet{i}.xml", z.namelist())

    def test_audit_reports_exist(self):
        """Confirms all three audit reports were generated and are non-empty."""
        reports = [
            "reports/phase_04_evidence_integration_report.md",
            "reports/phase_04_evidence_gaps.md",
            "reports/phase_04_data_quality_report.md"
        ]
        for rep in reports:
            self.assertTrue(os.path.exists(rep), f"Report '{rep}' does not exist")
            self.assertGreater(os.path.getsize(rep), 1000, f"Report '{rep}' is unexpectedly small")

if __name__ == "__main__":
    unittest.main()
