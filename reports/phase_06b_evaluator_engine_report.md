# Phase 6B — Rule-Based Treatment Outcome Evaluator Report

**Repository:** `C:\ML_Projects\adrab\adrab`  
**Phase:** Phase 6B (Rule-Based Treatment Outcome Evaluator Engine)  
**Date:** October 2026  
**Status:** Completed & Validated  

---

## 1. Executive Summary & Purpose

Phase 6B delivers the core software engine for the Maxillofacial Treatment-Outcome Evaluator project: `src/treatment_outcome_evaluator.py`.

The evaluator translates validated, de-identified clinical and radiological case evidence into transparent, independent outcome profiles across the eight defined clinical domains. 

### Core Scientific & Clinical Guardrails Maintained:
1. **Software Prototype Disclaimer:** The evaluator is an experimental clinical decision-support research tool, **not** a cleared medical device, diagnostic system, or autonomous clinical arbiter.
2. **Prohibition of Composite Scoring:** The engine strictly refuses to compute an unvalidated weighted composite score, average percentage, or single letter grade. Clinical domains are reported in parallel to prevent arbitrary mathematical trade-offs between disparate outcomes (e.g., masking severe functional diplopia with optimal cosmetic bone alignment).
3. **Decoupling of Imaging Pipeline from Clinical Outcome:** The imaging subsystem supplies objective geometric measurements (e.g., RMSD in mm, orbital volume delta in mL) and technical quality flags only. It is programmatically barred from outputting clinical pass/fail verdicts or final grades.
4. **Transparent, Grounded Rule Execution:** Every applied rule has a unique, deterministic rule ID (e.g., `RULE-D1-OBSERVE-RMSD`, `RULE-D3-AUDIT-IMF-DURATION`), an explicit rationale, and direct provenance linking to candidate rubric criteria (`RUB-CRIT-*`) and canonical evidence records (`CANON-*`).
5. **Missing-Data & Inapplicability Semantics:** Missing, unrecorded, or uncompleted data are explicitly flagged (`INSUFFICIENT_DATA`, `UNRECORDED`) and **never inferred as normal**. Inapplicable assessments (e.g., bilateral comminution precluding contralateral mirroring) are assigned `NOT_APPLICABLE` without penalty.
6. **Absence of Complications is Not Proof of Success:** A case with zero recorded complications is audited under rule `RULE-D8-ZERO-RECORDED-COMPLICATIONS` with an explicit caveat that lack of documentation does not guarantee clinical perfection.
7. **Strict Determinism:** Identical input produces byte-for-byte identical output profiles without relying on non-deterministic timestamps, random numbers, or external network requests.

---

## 2. Architecture & Data Flow

```
+----------------------------------------------------------------------------------------------------+
|                                    EVALUATOR DATA FLOW PIPELINE                                    |
+----------------------------------------------------------------------------------------------------+
                                      [ Structured Case JSON ]
                                                 │
                                                 ▼
                          ┌──────────────────────────────────────────────┐
                          │   Step 1: Structural Pre-Flight & Guardrails │
                          │   - Verify mandatory top-level sections      │
                          │   - Audit pseudonymous ID format             │
                          │   - Reject leaked clinical grades in imaging │
                          │   - Enforce composite score prohibition      │
                          │   - Enforce SI measurement units             │
                          └──────────────────────┬───────────────────────┘
                                                 │ (Pass)
                                                 ▼
                          ┌──────────────────────────────────────────────┐
                          │     Step 2: Modular Domain Evaluation        │
                          │     (Parallel, Independent Rule Execution)   │
                          ├──────────────────────────────────────────────┤
                          │ Domain 1: Skeletal Reduction & Symmetry      │
                          │ Domain 2: Orbital & Ophthalmic Outcomes      │
                          │ Domain 3: Occlusion & Mandibular Function    │
                          │ Domain 4: Mastication & Speech               │
                          │ Domain 5: Neurosensory Function              │
                          │ Domain 6: Soft-Tissue Aesthetics             │
                          │ Domain 7: Patient-Reported Outcomes (PROMs)  │
                          │ Domain 8: Safety & Complications             │
                          └──────────────────────┬───────────────────────┘
                                                 │
                                                 ▼
                          ┌──────────────────────────────────────────────┐
                          │ Step 3: Cross-Domain Discordance Auditing    │
                          │ - Detect volume parity vs diplopia conflict  │
                          │ - Detect prolonged IMF vs trismus violation  │
                          │ - Detect bone reduction vs PROM divergence   │
                          └──────────────────────┬───────────────────────┘
                                                 │
                                                 ▼
                          ┌──────────────────────────────────────────────┐
                          │   Step 4: Deterministic Multi-Domain Output  │
                          │   - 8 Standardized Domain Profiles           │
                          │   - Explicit Status Enum & Rule Provenance   │
                          │   - Active Unresolved Clinical Decisions Log │
                          │   - Final Prototype Notice / Disclaimer      │
                          └──────────────────────────────────────────────┘
```

---

## 3. Implemented Rules & Evidence Provenance

Each evaluated domain returns a standardized profile conforming to:
- `domain_id` and `domain_name`
- `status`: One of `ASSESSABLE`, `INSUFFICIENT_DATA`, `NOT_APPLICABLE`, `CONFLICTING_EVIDENCE`, `HUMAN_REVIEW_REQUIRED`
- `status_reason`: Concise summary of why the status was assigned
- `observations`: Available measurements, parameters, and physical units
- `applied_rules`: List of applied deterministic rules with IDs, candidate criterion links, and descriptions
- `supporting_evidence_ids`: Traceable canonical evidence IDs
- `missing_or_conflicting_information`: Specific alerts or missing components
- `limitations_and_uncertainty`: Documented technical or observational boundaries
- `human_review_requirements`: Mandatory clinician actions

### Summary of Rule Cards Implemented:

| Rule ID | Domain | Criterion ID | Rule Title & Clinical Focus | Canonical Evidence Provenance |
| :--- | :--- | :--- | :--- | :--- |
| `RULE-D1-INAPPLICABLE-NO-REF` | D1 | `RUB-CRIT-D1-01` | Bilateral Comminution Inapplicability Rule | `CANON-RES-EVD-001`, `CANON-RES-EVD-002` |
| `RULE-D1-UNRELIABLE-SCAN` | D1 | `RUB-CRIT-D1-01` | Skeletal Imaging Quality Rejection Rule | `CANON-RES-EVD-001` |
| `RULE-D1-OBSERVE-RMSD` | D1 | `RUB-CRIT-D1-01` | 3D Surface Mesh RMSD Continuous Observation Rule | `CANON-RES-EVD-001`, `CANON-RES-EVD-002` |
| `RULE-D1-OBSERVE-BUTTRESS` | D1 | `RUB-CRIT-D1-02` | Craniofacial Buttress Cortical Step-Off Rule | `CANON-CH12-EVD-001`, `CANON-CH12-EVD-002` |
| `RULE-D2-INAPPLICABLE-NO-ORBIT` | D2 | `RUB-CRIT-D2-01` | No Orbital Fracture Inapplicability Rule | N/A |
| `RULE-D2-OBSERVE-VOLUME` | D2 | `RUB-CRIT-D2-01` | Bony Orbital Volume Parity Observation Rule | `CANON-RES-EVD-003`, `CANON-RES-EVD-005` |
| `RULE-D2-OBSERVE-GLOBE` | D2 | `RUB-CRIT-D2-02` | Hertel Globe Projection & Enophthalmos Rule | `CANON-RES-EVD-004`, `CANON-ATLAS-CH19-EVD-004` |
| `RULE-D2-OBSERVE-FUNCTION` | D2 | `RUB-CRIT-D2-03` | Ophthalmic Motility Field & Diplopia Rule | `CANON-ATLAS-CH19-EVD-004`, `CANON-RES-EVD-005` |
| `RULE-D2-ALERT-DISCORDANCE` | D2 | `RUB-CRIT-D2-03` | Volume vs Functional Diplopia Discordance Alert | `CANON-RES-EVD-003`, `CANON-ATLAS-CH19-EVD-004` |
| `RULE-D3-INAPPLICABLE-NO-JAW` | D3 | `RUB-CRIT-D3-01` | No Mandibular/Maxillary Injury Inapplicability | N/A |
| `RULE-D3-INAPPLICABLE-EDENT` | D3 | `RUB-CRIT-D3-02` | Edentulous Occlusal Inapplicability Rule | `CANON-ATLAS-CH19-EVD-011` |
| `RULE-D3-OBSERVE-MIO` | D3 | `RUB-CRIT-D3-01` | Maximal Interincisal Opening Observation Rule | `CANON-RES-EVD-006`, `CANON-RES-EVD-008` |
| `RULE-D3-OBSERVE-OCCLUSION` | D3 | `RUB-CRIT-D3-02` | Dental Occlusal Restoration Observation Rule | `CANON-RES-EVD-007`, `CANON-ATLAS-CH19-EVD-010` |
| `RULE-D3-AUDIT-IMF-DURATION` | D3 | `RUB-CRIT-D3-03` | IMF Immobilization Duration Audit Rule | `CANON-RES-EVD-008`, `CANON-ATLAS-CH19-EVD-012` |
| `RULE-D4-OBSERVE-DIET` | D4 | `RUB-CRIT-D4-01` | Dietary Progression & Masticatory Milestone Rule | `CANON-ATLAS-CH19-EVD-010` |
| `RULE-D5-OBSERVE-SENSATION` | D5 | `RUB-CRIT-D5-01` | Trigeminal Neurosensory Recovery Rule | `CANON-ATLAS-CH19-EVD-013` |
| `RULE-D6-OBSERVE-SOFT-TISSUE` | D6 | `RUB-CRIT-D6-01` | Soft Tissue Redraping and Scar Maturation Rule | `CANON-ATLAS-CH19-EVD-018`, `CANON-ATLAS-CH19-EVD-019` |
| `RULE-D7-OMITTED-SURVEY` | D7 | `RUB-CRIT-D7-01` | PROM Survey Omission Audit Rule | `CANON-RES-EVD-012` |
| `RULE-D7-OBSERVE-FACE-Q` | D7 | `RUB-CRIT-D7-01` | FACE-Q Appearance Satisfaction Scale Rule | `CANON-RES-EVD-012`, `CANON-RES-EVD-013` |
| `RULE-D8-ZERO-RECORDED-COMP` | D8 | `RUB-CRIT-D8-01` | Zero Recorded Complications Guardrail Rule | `CANON-ATLAS-CH19-EVD-001`, `CANON-ATLAS-CH19-EVD-015` |
| `RULE-D8-RECORDED-COMPLICATION`| D8 | `RUB-CRIT-D8-02` | Clavien-Dindo Surgical Complication Grading Rule | `CANON-RES-EVD-010`, `CANON-ATLAS-CH19-EVD-001` |

---

## 4. Rules Deliberately Not Implemented

In adherence to the zero-fabrication constraint, several tempting algorithmic shortcuts were deliberately **omitted**:

1. **Binary RMSD Pass/Fail Reduction Cutoff:**
   - *Omitted Rule:* Classifying RMSD $< 1.0$ mm as "Pass" and $\ge 1.0$ mm as "Fail".
   - *Reason:* Ho et al. (2017) observed uninjured biological facial asymmetry up to $1.98$ mm. No clinical trial has validated a universal threshold where asymmetry becomes perceptible to lay observers. Decision `DEC-01` remains pending formal surgeon consensus.
2. **Volumetric Revision Trigger Threshold:**
   - *Omitted Rule:* Mandating surgical revision for orbital volume expansion $> 1.5$ mL.
   - *Reason:* Whitehouse et al. (1994) documented a linear regression slope ($1.0\text{ mL} \approx 0.8\text{ mm}$ enophthalmos), but asymptomatic patients with preserved binocular single vision do not require revision based purely on an isolated volume delta (`DEC-02`).
3. **Linear Composite Weighting Formula:**
   - *Omitted Rule:* Calculating an overall outcome index like $\text{Score} = 0.3 \times \text{Bone} + 0.3 \times \text{Occlusion} + 0.2 \times \text{PROM} + 0.2 \times \text{Safety}$.
   - *Reason:* Scientifically invalid. Heterogeneous clinical domains cannot be collapsed linearly without distorting trade-offs. The Phase 5 specification explicitly bans composite scoring (`DEC-04`).
4. **Automated Replacement of Missing PROM with Median Imputation:**
   - *Omitted Rule:* Imputing cohort average FACE-Q satisfaction when survey is unadministered.
   - *Reason:* Clinically deceptive. Missing surveys are flagged `INSUFFICIENT_DATA`.
5. **Inference of Success from Zero Complications:**
   - *Omitted Rule:* Automatically awarding a perfect grade because no complication is listed.
   - *Reason:* Under-reporting of adverse events in trauma follow-up is common; absence of an entry is audited as "no recorded events" with explicit limitations.

---

## 5. Verification & Test Execution Results

The test suite [`tests/test_treatment_outcome_evaluator.py`](file:///c:/ML_Projects/adrab/adrab/tests/test_treatment_outcome_evaluator.py) was executed alongside all repository test suites using `python -m unittest discover tests`.

**All 43 unit tests across all project phases passed with 0 failures or errors:**

```
Ran 43 tests in 0.156s

OK

Consolidated Breakdown:
1. tests/test_phase_04_pipeline.py:              9/9 passed
2. tests/test_phase_05_rubric.py:                7/7 passed
3. tests/test_synthetic_case_generator.py:       8/8 passed
4. tests/test_evaluator_test_harness.py:         9/9 passed
5. tests/test_treatment_outcome_evaluator.py:   10/10 passed
=========================================================
Total:                                         43/43 passed
```

### New Phase 6B Test Coverage:
- `test_eight_domains_evaluated_independently`: Verifies that all 8 domain contracts exist and are isolated.
- `test_inapplicable_domain_handling`: Verifies bilateral panfacial comminution and isolated injury inapplicability.
- `test_missing_data_never_inferred_as_normal`: Verifies unrecorded PROMs or untested nerves trigger `INSUFFICIENT_DATA`.
- `test_poor_quality_imaging_rejection`: Verifies severe CT streak and gantry tilt trigger `HUMAN_REVIEW_REQUIRED`.
- `test_clinical_discordance_alert_generation`: Verifies detection of optimal volume coexisting with diplopia.
- `test_imf_safety_threshold_audit`: Verifies prolonged IMF duration $> 4$ weeks triggers safety alerts.
- `test_absence_of_complications_is_not_conflated_with_perfection`: Verifies zero complications guardrail.
- `test_high_severity_complication_audit`: Verifies Clavien-Dindo Grade IIIb surgical revision alerts.
- `test_guardrail_rejections_and_unit_mismatches`: Verifies rejection of leaked grades, illegal composite status, and incompatible units.
- `test_strict_determinism_and_evidence_traceability`: Verifies byte-identical serialization across repeated runs and traces all rules to canonical evidence IDs.

---

## 6. Known Limitations & Active Decisions Requiring Surgeon Input

1. **Prototype Status:** The evaluator is a local-first software prototype intended for clinical research audits. It must not be deployed in live patient care without institutional ethics approval and regulatory clearance.
2. **Open Decision Log (Active):**
   - **DEC-01 (RMSD Acceptance Band):** Awaiting surgeon Delphi consensus on continuous percentiles vs tiered clinical zones ($<1.0$ mm vs $1.0\text{--}2.0$ mm).
   - **DEC-02 (Volume vs Motility Priority):** Awaiting consensus on whether orbital volume restoration is strictly subordinated to ocular motility.
   - **DEC-03 (MIO Physiological Adjustment):** Awaiting consensus on physiological opening baseline adjustment for gender, age, and dentition.
   - **DEC-04 (PROM Isolation):** Confirmed prohibition on arithmetic composite aggregation.
   - **DEC-05 (Clavien-Dindo CMF Adaptation):** Awaiting formal validation of maxillofacial-specific complication grading.
   - **DEC-06 (CT Voxel Error Floor):** Awaiting physical phantom experiments defining registration noise floor in comminuted anatomy.
