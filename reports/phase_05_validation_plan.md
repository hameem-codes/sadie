# Phase 5 — Multi-Center Validation & Quality Assurance Plan

## Maxillofacial Fracture Treatment-Outcome Evaluator Project

**Version:** `PHASE-05-CANDIDATE-v1.0`  
**Date:** 2026-10-11  
**Status:** **PROSPECTIVE VALIDATION SPECIFICATION** (No empirical validation claims made in Phase 5)

---

### 1. Executive Summary & Validation Philosophy

A medical evaluation system cannot establish validity merely by demonstrating computational reproducibility or machine learning convergence. Before any automated or semi-automated treatment-outcome evaluator can be deployed in clinical audits or quality assurance registries, it must undergo rigorous empirical validation across:
1. **Measurement Reliability:** Repeatability of image-derived and bedside clinical metrics.
2. **Measurement Agreement:** Concordance between automated algorithms and expert human clinician measurements.
3. **Clinical Criterion Validity:** Correlation with independently assessed patient outcomes, functional recovery, and quality of life.
4. **Generalizability & Robustness:** Performance stability across diverse trauma centers, scanner manufacturers, and patient demographics.

```
+--------------------------------------------------------------------------------------------------+
|                               TEN PILLARS OF CLINICAL VALIDATION                                 |
+--------+---------------------------------------+-------------------------------------------------+
| Pillar | Validation Dimension                  | Target Metric & Evidentiary Standard            |
+--------+---------------------------------------+-------------------------------------------------+
| 1      | Inter- and Intra-Observer Reliability | ICC > 0.85, Cohen / Fleiss kappa > 0.80         |
| 2      | Imaging Repeatability                 | Bland-Altman 95% limits of agreement            |
| 3      | Automated vs Human Agreement          | Mean absolute difference < 0.5 mm / 0.3 mL      |
| 4      | Subsite & Treatment Stratification    | Separate validation across ZMC, Orbit, Mandible |
| 5      | Longitudinal Epoch Stability          | Tracking 6-week, 6-month, and 12-month change   |
| 6      | Missingness & Quality Failure Audit   | Explicit failure modes for artifact / motion    |
| 7      | Clinical Criterion Correlation        | Regression against blinded surgeon ratings      |
| 8      | External Multi-Center Generalizability| Multi-scanner validation (GE, Siemens, Philips) |
| 9      | Performance & Uncertainty Reporting   | 95% confidence intervals on all metrics         |
| 10     | Data Governance & HIPAA Compliance    | Zero-PHI cryptographic hashing & local storage  |
+--------+---------------------------------------+-------------------------------------------------+
```

---

### 2. Detailed Protocols for the Ten Validation Pillars

#### Pillar 1: Inter-Observer and Intra-Observer Reliability
- **Objective:** Quantify human measurement variability when qualified craniomaxillofacial surgeons perform landmark placement, buttress step-off measurements, and clinical assessments.
- **Protocol:**
  - Standardized benchmark dataset of 50 post-reduction CT scans evaluated independently by 5 board-certified craniomaxillofacial surgeons from different institutions.
  - Surgeons repeat measurements after a 4-week washout period to prevent recall bias.
- **Target Statistical Endpoints:**
  - Continuous metrics (MIO, orbital volume delta, ZMC surface RMSD): Two-way mixed-effects Intraclass Correlation Coefficient ($\text{ICC}_{2,1} \ge 0.85$).
  - Categorical classifications (occlusion, diplopia severity, Clavien-Dindo complications): Fleiss' $\kappa \ge 0.75$.

---

#### Pillar 2: Repeatability of Imaging-Derived Measurements
- **Objective:** Establish the test-retest measurement error floor of the automated 3D surface mesh registration and volumetric segmentation pipelines.
- **Protocol:**
  - Automated 3D mirroring and ICP registration executed across simulated head repositioning perturbations ($\pm 10^\circ$ pitch/yaw/roll rotations) and resampled slice thicknesses ($0.5\text{ mm}$, $0.75\text{ mm}$, $1.0\text{ mm}$, $1.25\text{ mm}$).
- **Target Statistical Endpoints:**
  - Registration repeatability error: Root Mean Square Error ($\text{RMSE} < 0.20\text{ mm}$).
  - Volume segmentation stability: Volume Variation Coefficient ($\text{CV} < 3.0\%$).

---

#### Pillar 3: Agreement Between Automated Algorithms and Expert Clinicians
- **Objective:** Verify that automated algorithms produce outputs concordant with expert clinical manual planimetry.
- **Protocol:**
  - Orbital volume: Automated deep-learning segmentation compared directly against slice-by-slice manual expert tracing on 60 orbital trauma CTs.
  - ZMC surface symmetry: Automated ICP mirrored surface distance compared against manual 3D anatomical landmark triangulation (zygomatic arch midpoint, infraorbital margin, zygomaticofrontal suture).
- **Target Statistical Endpoints:**
  - Bland-Altman $95\%$ limits of agreement: Volume delta difference within $\pm 0.35\text{ mL}$; surface distance within $\pm 0.40\text{ mm}$.

---

#### Pillar 4: Stratification Across Fracture Subsites and Treatment Contexts
- **Objective:** Prevent the bias of applying a single panfacial validation metric across heterogeneous injuries.
- **Protocol:**
  - Validation cohorts must be partitioned and reported independently across:
    1. Isolated unilateral ZMC fractures.
    2. Isolated internal orbital blowout fractures.
    3. Mandibular condylar process fractures (open ORIF vs closed treatment).
    4. Mandibular angle and body fractures.
    5. Complex panfacial / Le Fort injuries.
- **Rule:** A metric validated for ZMC symmetry (e.g. ICP surface registration) cannot be declared validated for mandibular condylar fractures without dedicated subsite testing.

---

#### Pillar 5: Longitudinal Follow-up Timing and Biological Maturation
- **Objective:** Account for the biological time dependency of bone healing, nerve regeneration, and scar maturation.
- **Protocol:**
  - Prospective longitudinal cohort ($N \ge 100$) tracked at 4 standardized timepoints:
    - Epoch 1: Immediate postoperative (0–2 weeks) $\rightarrow$ Early skeletal reduction and hardware safety check.
    - Epoch 2: 6 weeks $\rightarrow$ Bone union consolidation, IMF release, early MIO check.
    - Epoch 3: 6 months $\rightarrow$ Resolution of orbital edema, diplopia evaluation, globe projection stabilization.
    - Epoch 4: 12 months $\rightarrow$ Definitive neurosensory testing (trigeminal 2PD), scar maturation (POSAS), and long-term FACE-Q PROMs.
- **Rule:** Definitive clinical outcome ratings must not be assigned during Epoch 1 or 2 for constructs that require 6–12 months for biological maturation.

---

#### Pillar 6: Missingness and Measurement-Quality Failures
- **Objective:** Ensure the system handles missing, incomplete, or corrupted clinical data safely without fabricating median values or assuming normalcy.
- **Protocol:**
  - Stress testing using synthetic edge cases:
    - Case A: Severe dental amalgam streak artifact obscuring mandibular border $\rightarrow$ System must flag `UNRELIABLE_BORDER_ARTIFACT` and refuse to output an unverified bone gap score.
    - Case B: Edentulous patient lacking central incisors $\rightarrow$ System must flag `DENTURE_ADJUSTED_MIO` rather than misclassifying missing teeth as trismus.
    - Case C: Incomplete PROM questionnaire (patient skipped items) $\rightarrow$ Rasch measurement model must report standard error of measurement ($\text{SEM}$) and refuse composite imputation.

---

#### Pillar 7: Comparison Against Independently Assessed Clinical Outcomes
- **Objective:** Establish criterion validity by testing whether objective imaging parameters correlate with real-world patient outcomes.
- **Protocol:**
  - Multivariable regression modeling:
    - Does post-reduction 3D CT RMSD predict blinded expert panel aesthetic satisfaction?
    - Does orbital volume delta ($\Delta\text{mL}$) predict 6-month binocular diplopia and Hertel globe projection?
    - Does 6-week MIO predict 1-year masticatory chewing efficiency?

---

#### Pillar 8: External Multi-Center Generalizability and Dataset Shift
- **Objective:** Prevent overfitting to a single academic hospital's imaging equipment or surgical technique.
- **Protocol:**
  - Evaluation across multi-vendor CT platforms:
    - Siemens SOMATOM (tin-filtered fine slice).
    - GE Revolution CT.
    - Philips Brilliance.
    - Planmeca Cone Beam CT (CBCT).
  - Multi-institutional dataset of 200 cases drawn from at least 4 international trauma centers across Europe, North America, and Asia.

---

#### Pillar 9: Transparent Reporting of Performance and Uncertainty
- **Objective:** Provide clinicians with calibrated uncertainty boundaries for every automated measurement.
- **Protocol:**
  - Every numerical metric output by the system must display its estimated $95\%$ confidence interval (e.g., "Orbital Volume Delta: $0.82\text{ mL}$ [95% CI: $0.68\text{--}0.96\text{ mL}$]").
  - Automated segmentations must provide a Dice Similarity Coefficient ($\text{DSC}$) confidence score.

---

#### Pillar 10: Data Governance, De-Identification and Ethics
- **Objective:** Comply with HIPAA, GDPR, and ethical principles of medical AI research.
- **Protocol:**
  - Zero Protected Health Information (PHI) stored or transmitted.
  - DICOM headers de-identified using DICOM PS 3.15 Annex E standard: patient names, MRNs, dates of birth, and acquisition institution addresses removed before analysis.
  - 3D facial soft tissue surfaces defaced or anonymized where public registry storage is planned to prevent facial recognition matching.
  - Cryptographically secure pseudonymous case identifiers (`CASE-XXXXXXXX`).
