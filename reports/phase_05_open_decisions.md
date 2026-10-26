# Phase 5 — Unresolved Decisions & Surgeon Review Register

## Maxillofacial Fracture Treatment-Outcome Evaluator Project

**Version:** `PHASE-05-CANDIDATE-v1.0`  
**Date:** 2026-10-11  
**Status:** **ACTIVE CLINICAL REVIEW REGISTER** (Zero fabricated consensus ratings)

---

### 1. Executive Summary: Why Open Decisions Must Remain Explicit
A recurring failure mode in clinical AI algorithms is premature closure—converting preliminary observational studies, narrative rules of thumb, or small-cohort means into rigid, automated pass/fail cutoffs.

The Maxillofacial Treatment-Outcome Evaluator strictly forbids this. Every clinical decision requiring expert judgment is isolated into this register. Until a structured, qualified craniomaxillofacial surgeon panel reviews and votes on these decisions through a formal Delphi process, every item retains `PENDING SURGEON VALIDATION`.

```
+--------------------------------------------------------------------------------------------------+
|                                  SUMMARY OF MAJOR OPEN DECISIONS                                 |
+--------+---------------------------------------+-----------------------------+-------------------+
| Reg ID | Clinical Decision Topic               | Primary Open Question       | Evidence Grounding|
+--------+---------------------------------------+-----------------------------+-------------------+
| DEC-01 | ZMC Skeletal Symmetry Acceptance      | Define acceptable RMSD band | Ho 2017 (n=15)    |
| DEC-02 | Orbital Volume vs Functional Outliers | Conditioning volume on Dipl.| Whitehouse/Bly    |
| DEC-03 | Mandibular MIO Physiological Adjust.  | Normative bands vs Baseline | Eckelt/Adeyemi    |
| DEC-04 | PROM Isolation & Multi-Attribute Rep. | Prohibit arithmetic collapse| Elegbede/Pusic    |
| DEC-05 | Complication Severity Grading         | Adapt Clavien-Dindo CMF     | Nagase/Mosbah     |
| DEC-06 | Imaging Reliability & Slice Tolerance | Fine-slice CT error floor   | Mittermiller 2019 |
+--------+---------------------------------------+-----------------------------+-------------------+
```

---

### 2. Granular Review Register of Open Decisions

#### Decision DEC-01: ZMC Skeletal Symmetry Acceptance Boundary
- **Candidate Criterion Affected:** `RUB-CRIT-D1-01`
- **What the Evidence Proves:** Ho et al. (2017) demonstrated that uninjured Dutch adults possess natural facial skeletal asymmetry: $\text{MSD } 0.14\text{ mm}$, $\text{RMSD } 0.87\text{ mm}$, upper bound $1.98\text{ mm}$ ($n=15$).
- **The Unresolved Clinical Decision:**
  - What millimeter discrepancy threshold separates acceptable post-reduction alignment from clinically significant asymmetry requiring consideration of revision?
  - Should the evaluator:
    - *Option A:* Enforce a continuous percentile distribution compared to normal controls (e.g. within $1\text{ SD}$, within $2\text{ SD}$ of biological baseline)?
    - *Option B:* Adopt tiered clinical bands: Optimal ($<1.0\text{ mm}$), Mild Subclinical Discrepancy ($1.0\text{--}2.0\text{ mm}$), Significant Asymmetry ($>2.0\text{ mm}$)?
    - *Option C:* Require patient aesthetic dissatisfaction on PROM surveys before flagging any asymmetry $<2.5\text{ mm}$ as an adverse outcome?
- **Reviewer Action Required:** Reviewers must evaluate Options A, B, and C in Delphi Round 1.
- **Current Status:** `PENDING SURGEON VALIDATION`

---

#### Decision DEC-02: Orbital Volume vs Functional Outlier Conditioning
- **Candidate Criterion Affected:** `RUB-CRIT-D2-01`, `RUB-CRIT-D2-02`, `RUB-CRIT-D2-03`
- **What the Evidence Proves:** Whitehouse et al. (1994) documented that $1.0\text{ mL}$ volume expansion predicts $0.8\text{ mm}$ enophthalmos; Bly et al. (2013) achieved $0.74\text{ mL}$ volume delta with computer navigation; Zhang et al. (2012) showed posterior floor herniation drives enophthalmos.
- **The Unresolved Clinical Decision:**
  - How should the evaluator resolve discordance between orbital volume and ocular function?
  - Specifically: If a patient has an anatomically perfect volume restoration ($\Delta\text{mL} \le 0.5\text{ mL}$) but suffers persistent diplopia in reading gaze due to muscle fibrosis, how is the case classified?
  - Conversely: If a patient has a $\Delta\text{mL} = 1.3\text{ mL}$ anteriorly but zero enophthalmos and perfect binocular motility, should the case be penalized?
  - *Proposed Rule:* Volume parity is treated strictly as an anatomical intermediate parameter. Global ophthalmic outcome is determined by functional motility and globe projection, never by volume in isolation.
- **Reviewer Action Required:** Ratify or modify the functional conditioning rule.
- **Current Status:** `PENDING SURGEON VALIDATION`

---

#### Decision DEC-03: Mandibular MIO Physiological Adjustment & Trismus Boundary
- **Candidate Criterion Affected:** `RUB-CRIT-D3-01`
- **What the Evidence Proves:** Eckelt et al. (2006) showed operative treatment yielded mean MIO of $46.5\text{ mm}$ vs closed $40.9\text{ mm}$. Both treatment arms achieved mean openings $>40\text{ mm}$.
- **The Unresolved Clinical Decision:**
  - Can any single millimeter cutoff (such as $40\text{ mm}$) serve as a universal threshold for surgical success?
  - *Consensus Finding:* No. Fixed cutoffs penalize patients with physiological premorbid openings of $36\text{--}38\text{ mm}$ and fail to detect significant limitation in patients whose baseline was $55\text{ mm}$.
  - What physiological adjustment formula should be adopted when pre-injury baseline MIO is unknown?
  - *Proposed Rule:* Adopt continuous functional bands anchored by consensus definitions of clinical trismus:
    - Normal Mobility: $\ge 40\text{ mm}$ (or within $10\%$ of verified baseline), protrusion $\ge 5\text{ mm}$, lateral excursion $\ge 6\text{ mm}$.
    - Mild Restriction: $35\text{--}39\text{ mm}$.
    - Clinical Trismus / Adverse Functional Outcome: $< 35\text{ mm}$ or persistent painful opening deflection $> 4\text{ mm}$.
- **Reviewer Action Required:** Reviewers must vote on whether $35\text{ mm}$ or $40\text{ mm}$ represents the boundary for clinically actionable trismus.
- **Current Status:** `PENDING SURGEON VALIDATION`

---

#### Decision DEC-04: Patient-Reported Outcome PROM Independence
- **Candidate Criterion Affected:** `RUB-CRIT-D7-01`
- **What the Evidence Proves:** Elegbede et al. (2018) and Pusic et al. (2013) demonstrated high internal consistency and construct validity of FACE-Q modules in facial reconstruction.
- **The Unresolved Clinical Decision:**
  - Is it ever scientifically or clinically defensible to combine subjective PROM survey points and objective CT millimeter measurements into a single arithmetic composite score?
  - *Proposed Rule:* Absolute prohibition of composite arithmetic collapsing. PROM scores (Rasch 0–100) must be displayed on a distinct parallel axis alongside anatomical reduction and functional mastication.
  - Open question: How should discordant cases be flagged (e.g. perfect anatomic reduction with low FACE-Q score, vs imperfect bone alignment with 100/100 patient satisfaction)?
- **Reviewer Action Required:** Confirm prohibition of composite formulas and approve parallel profile reporting format.
- **Current Status:** `PENDING SURGEON VALIDATION`

---

#### Decision DEC-05: Standardized Maxillofacial Complication Classification
- **Candidate Criterion Affected:** `RUB-CRIT-D8-01`, `RUB-CRIT-D8-02`
- **What the Evidence Proves:** Atlas Ch. 19 and Nagase et al. (2005) detail complication incidences (plate removal in $5\text{--}10\%$, infection in $5\%$) but lack a standardized severity hierarchy.
- **The Unresolved Clinical Decision:**
  - How should maxillofacial complications be ranked in an outcome evaluation?
  - *Proposed Rule:* Formally adopt the Clavien-Dindo Surgical Complication Grading system adapted for craniomaxillofacial trauma:
    - Grade I: Minor deviation managed bedside (e.g., superficial suture removal, minor oral hygiene elastics).
    - Grade II: Pharmacological intervention (e.g., oral antibiotics for minor cellulitis).
    - Grade IIIa: Intervention under local anesthesia (e.g., bedside incision and drainage, removal of single loose screw).
    - Grade IIIb: Re-operation under general anesthesia (e.g., open drainage of deep osteomyelitis, removal of infected plate, revision osteotomy for malunion).
    - Grade IV: Life-threatening complication (e.g., deep neck space infection requiring ICU admission).
- **Reviewer Action Required:** Approve adoption of Clavien-Dindo grading for Domain 8 adverse events.
- **Current Status:** `PENDING SURGEON VALIDATION`

---

#### Decision DEC-06: Minimum Image Quality and Segmentation Reliability Floor
- **Candidate Criterion Affected:** All Domain 1 & Domain 2 Imaging Criteria
- **What the Evidence Proves:** van Hout et al. (2019) demonstrated that diagnostic agreement drops significantly on subtle displacement morphology ($\kappa = 0.59$ on mandibular comminution).
- **The Unresolved Clinical Decision:**
  - What technical CT imaging parameters represent the absolute minimum threshold below which automated 3D mirroring and volumetric measurement must refuse to generate a numerical score?
  - *Proposed Rule:*
    - Maximum slice thickness: $\le 1.25\text{ mm}$ (axial source).
    - Gantry tilt: Must be $0^\circ$ (non-zero tilt distorts 3D surface mesh mirroring).
    - Metal artifact: Severe artifact obscuring $\ge 25\%$ of the region of interest flags the measurement as `UNRELIABLE_MOTION_OR_ARTIFACT`.
- **Reviewer Action Required:** Ratify imaging technical inclusion criteria.
- **Current Status:** `PENDING SURGEON VALIDATION`

---

### 3. Delphi Consensus Protocol Specification

To resolve the above open decisions without fabricating consensus, the following formal Delphi process is specified for Phase 6:

1. **Panel Composition:** Minimum $N = 12\text{ to } 20$ board-certified craniomaxillofacial surgeons, oral and maxillofacial surgeons, and plastic/reconstructive surgeons from at least 4 independent academic trauma centers.
2. **Review Template:** Every panelist receives [`data/phase_05_surgeon_review_template.csv`](file:///c:/ML_Projects/adrab/adrab/data/phase_05_surgeon_review_template.csv) containing plain-language criterion descriptions, evidence citations, and structured voting options.
3. **Voting Mechanics:**
   - Round 1: Independent, blinded review of each criterion (Approve / Revise / Reject / Insufficient Evidence) + feedback on open decision options.
   - Round 2: Aggregated, anonymized distribution of votes and rationales returned to panelists; re-vote on non-consensus items.
   - Pre-specified Consensus Boundary: $\ge 80\%$ agreement required to ratify a clinical decision or operational threshold.
4. **Zero-Simulation Guarantee:** No ratings, votes, or consensus decisions will be simulated or reported until actual completed review forms are collected from verified clinical reviewers.
