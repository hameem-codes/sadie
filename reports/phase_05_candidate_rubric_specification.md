# Phase 5 — Formal Candidate Rubric Specification

## Maxillofacial Fracture Treatment-Outcome Evaluator Project

**Specification Version:** `PHASE-05-CANDIDATE-v1.0`  
**Date of Specification:** 2026-10-11  
**Target Architecture:** Multi-Attribute Postoperative Evaluation (De-identified, Local-First, Zero-Fabrication)  
**Clinical Status:** **CANDIDATE SPECIFICATION PENDING FORMAL SURGEON CONSENSUS REVIEW** (Not a validated clinical scoring instrument)

---

### 1. Executive Summary & Foundational Principles

The Maxillofacial Treatment-Outcome Evaluator project evaluates surgical and non-surgical treatment outcomes following maxillofacial fractures using preoperative and postoperative imaging, objective clinical measurements, and validated patient-reported outcomes (PROMs).

#### Explicit Project Scope Boundaries
1. **Outcome Evaluation, NOT Fracture Diagnosis:** The system evaluates post-treatment results; it does **not** diagnose acute fractures, classify triage urgency, or recommend initial surgical indications.
2. **Support Tool, NOT Autonomous Clinical Arbiter:** The system provides objective, reproducible measurement data and structured candidate evaluation profiles; it **never replaces a craniomaxillofacial surgeon's clinical judgment**.
3. **Candidate Specification, NOT Validated Scoring:** This Phase 5 specification organizes evidence-grounded candidate criteria for formal clinician review. It makes **zero claim of clinical validation**, introduces no arbitrary scoring weights, and refuses to output a composite single-number grade.

```
+----------------------------------------------------------------------------------------------------+
|                           FIVE CORE SPECIFICATION RULES (TASKS 1 - 3)                             |
+------------------------------------+---------------------------------------------------------------+
| Core Concept                       | Mandatory Representation Rule                                 |
+------------------------------------+---------------------------------------------------------------+
| 1. Separation of Facts vs. Decision| Every criterion explicitly distinguishes Source Finding,      |
|                                    | Proposed Definition, Threshold Evidence, and Surgeon Decision.|
| 2. Unsupported Threshold Policy    | When no cutoff is published, use NO EXPLICIT THRESHOLD REPORTED|
| 3. Unapproved Status Policy        | When clinician consensus is pending, use PENDING SURGEON VALID.|
| 4. Abstract Scoping Disclosure     | Paywalled papers retain VERIFIED_ABSTRACT_ONLY without inference|
| 5. Parallel Domain Profiles Only   | No composite arithmetic formula; output parallel radar metrics|
+------------------------------------+---------------------------------------------------------------+
```

---

### 2. Organization Across the Eight Clinical Outcome Domains

The 14 candidate criteria derived from the reconciled Phase 4 Evidence Matrix are organized across the eight defined clinical domains:

```
+----------------------------------------------------------------------------------------------------+
|                               EIGHT CLINICAL OUTCOME DOMAINS OVERVIEW                              |
+--------+-------------------------------------------------------+-------------------+---------------+
| Domain | Domain Title                                          | Candidate Criteria| Primary Tools |
+--------+-------------------------------------------------------+-------------------+---------------+
| D1     | Skeletal reduction, alignment and symmetry            | RUB-CRIT-D1-01, 02| CT / 3D Mesh  |
| D2     | Orbital reconstruction and ophthalmic outcomes        | RUB-CRIT-D2-01..03| CT / Hertel   |
| D3     | Occlusion and mandibular function                     | RUB-CRIT-D3-01..03| Caliper/Shim  |
| D4     | Mastication, speech and functional outcomes           | RUB-CRIT-D4-01    | Dietary Scale |
| D5     | Neurosensory outcomes                                 | RUB-CRIT-D5-01    | 2PD / MRC S0-4|
| D6     | Facial soft-tissue appearance and symmetry            | RUB-CRIT-D6-01    | 3D Photo/POSAS|
| D7     | Patient-reported outcomes (PROMs)                     | RUB-CRIT-D7-01    | FACE-Q Survey |
| D8     | Complications, safety and additional treatment        | RUB-CRIT-D8-01, 02| Clavien-Dindo |
+--------+-------------------------------------------------------+-------------------+---------------+
```

---

### 3. Granular Domain Specifications & Candidate Criteria

#### Domain 1: Skeletal Reduction, Alignment and Symmetry
- **Clinical Construct Assessed:** 3D multiplanar skeletal repositioning, restoration of anatomical height, width, and projection, and cortical contact across major craniofacial load-bearing pillars.
- **Eligible Fracture Regions:** Zygomaticomaxillary complex (ZMC), zygomatic arch, nasoethmoid (NOE) complex, Le Fort I/II/III, frontomaxillary buttress.
- **Treatment Contexts:** Open reduction and internal fixation (ORIF), computer-assisted intraoperative navigation, patient-specific implants (PSIs).

##### Criterion RUB-CRIT-D1-01: ZMC 3D Surface Mesh Congruence & Global Facial Symmetry
- **A. Source-Reported Finding:** Ho et al. (2017) demonstrated that uninjured Dutch adults possess natural baseline facial skeletal asymmetry: $\text{Mean Surface Distance (MSD)} = 0.14 \pm 0.12\text{ mm}$ (range $0.002\text{--}0.881\text{ mm}$); $\text{Root Mean Square Distance (RMSD)} = 0.87 \pm 0.21\text{ mm}$ (range $0.56\text{--}1.98\text{ mm}$ in $n=15$).
- **B. Candidate Operational Definition:** Postoperative 3D surface distance mapping across segmented ZMC surface mesh registered against mirrored uninjured contralateral facial skeleton using Iterative Closest Point (ICP).
- **C. Threshold Evidence:** `NO EXPLICIT THRESHOLD REPORTED`. The $1.98\text{ mm}$ upper bound represents biological control variance in a small uninjured cohort, **not** an operational surgical success cutoff.
- **D. Proposed Clinical Decision:** `PENDING SURGEON VALIDATION`. Qualified craniomaxillofacial surgeons must determine whether residual RMSD discrepancy is stratified into continuous percentiles or tiered clinical zones (e.g. $<1.0\text{ mm}$, $1.0\text{--}2.0\text{ mm}$, $>2.0\text{ mm}$) and how patient perception modifies this evaluation.
- **E. Validation Requirement:** Multi-center study correlating 3D CT RMSD values with blinded surgeon aesthetic ratings and patient FACE-Q scores in surgically treated ZMC cohorts.
- **Measurement Method & Units:** Fine-slice multiplanar CT ($\le 1.0\text{ mm}$ slices, $0^\circ$ gantry tilt) + automated 3D mesh surface registration; units: millimeters ($\text{mm}$).
- **Preoperative Reference:** Contralateral uninjured facial skeleton serves as virtual mirror reference.
- **Assessment Timing:** Postoperative 2–6 weeks (baseline skeletal check) and $\ge 6\text{ months}$ (late stability).
- **Direction of Outcome:** Favourable: Residual surface discrepancy approaching normal population biological baseline ($\text{RMSD} \le 0.87\text{ mm}$).
- **Applicability & Exclusions:** Applicable to unilateral fractures with intact contralateral skeleton. Excluded in bilateral comminuted midface fractures lacking uninjured mirror reference.
- **Missing / Unreliable Data Policy:** If metal streak artifact or missing contralateral anatomy precludes registration, record as `UNMEASURABLE_ABSENT_CONTRALATERAL`. Do not treat missing data as normal symmetry.
- **Automation Type:** Requires Both (Automated 3D mesh registration + Surgeon clinical review).
- **Supporting Evidence IDs:** `CANON-RES-EVD-001` (PAP-001), `CANON-RES-EVD-002` (PAP-002) [`VERIFIED_ABSTRACT_ONLY`].

##### Criterion RUB-CRIT-D1-02: Craniofacial Buttress Anatomical Continuity
- **A. Source-Reported Finding:** Fonseca Ch. 12 (pp. 232–235) establishes vertical and horizontal buttress pillars as structural frameworks governing facial height, width, and projection. Cortical continuity restoration is required for masticatory load transfer.
- **B. Candidate Operational Definition:** Direct multiplanar radiological assessment of cortical bone alignment, residual gap, and step-off deformity at key buttress contact points.
- **C. Threshold Evidence:** `NO EXPLICIT THRESHOLD REPORTED`. Textbook narrative provides anatomical principles without statistical millimeter reduction cutoffs.
- **D. Proposed Clinical Decision:** `PENDING SURGEON VALIDATION`. Surgeons must ratify acceptable reduction tolerances: anatomic ($<1\text{ mm}$ gap), near-anatomic ($1\text{--}2\text{ mm}$), or malreduced ($>2\text{ mm}$ with loss of projection).
- **E. Validation Requirement:** Inter-rater reliability trial testing agreement among craniomaxillofacial surgeons measuring buttress step-offs on 2D multiplanar CT vs 3D volume renderings.
- **Supporting Evidence IDs:** `CANON-CH12-EVD-001`, `CANON-CH12-EVD-002` [`VERIFIED_PRIMARY_SOURCE`].

---

#### Domain 2: Orbital Reconstruction and Ophthalmic Outcomes
- **Clinical Construct Assessed:** Internal bony orbital volume parity, clinical globe position (enophthalmos/hypoglobus), extraocular muscle function, and binocular single vision.
- **Eligible Fracture Regions:** Internal orbital floor, medial orbital wall, inferior orbital rim, zygomatico-orbital complex.
- **Treatment Contexts:** Reconstruction with pre-formed titanium mesh, patient-specific implants (PSIs), porous polyethylene, autologous bone grafting.

##### Criterion RUB-CRIT-D2-01: Internal Bony Orbital Volume Parity
- **A. Source-Reported Finding:** Whitehouse et al. (1994) showed that each $1.0\text{ cm}^3$ ($1.0\text{ mL}$) increase in bony orbital volume predicts $0.8\text{ mm}$ of late enophthalmos ($r = 0.79, P < 0.001$). Bly et al. (2013) demonstrated that computer-assisted reconstruction achieved a mean volume difference of $0.74\text{ mL}$ compared to $2.12\text{ mL}$ in conventional surgery ($P = .003$).
- **B. Candidate Operational Definition:** Postoperative difference in bony orbital volume between reconstructed orbit and contralateral unaffected orbit ($\Delta\text{mL} = \text{Volume}_{\text{reconstructed}} - \text{Volume}_{\text{contralateral}}$).
- **C. Threshold Evidence:** `NO EXPLICIT THRESHOLD REPORTED`. The $1.0\text{ mL} \approx 0.8\text{ mm}$ ratio is a continuous predictive regression slope, **not** a universal standalone binary pass/fail cutoff.
- **D. Proposed Clinical Decision:** `PENDING SURGEON VALIDATION`. Qualified clinicians must decide whether volume delta is evaluated independently or strictly conditioned on clinical globe projection and motility.
- **E. Validation Requirement:** Prospective cohort validating automated AI orbital volume segmentation against manual planimetry and 6-month Hertel exophthalmometry.
- **Measurement Method & Units:** Multiplanar fine-slice CT ($\le 1.0\text{ mm}$) with automated deep learning segmentation; units: milliliters ($\text{mL}$).
- **Supporting Evidence IDs:** `CANON-RES-EVD-003` (PAP-003, `VERIFIED_PRIMARY_SOURCE`), `CANON-RES-EVD-005` (PAP-005, `VERIFIED_ABSTRACT_ONLY`).

##### Criterion RUB-CRIT-D2-02: Clinical Globe Projection & Enophthalmos
- **A. Source-Reported Finding:** Zhang et al. (2012) reported secondary enophthalmos averaged $4.0 \pm 1.49\text{ mm}$ and showed that only herniation posterior to the vertical eyeball equator significantly drives enophthalmos ($P < .05$). Atlas Ch. 19 (p. 809) emphasizes serial globe projection tracking.
- **B. Candidate Operational Definition:** Direct clinical measurement of anterior corneal projection relative to lateral orbital rim using Hertel exophthalmometry, or 3D CT axial globe protrusion comparison.
- **C. Threshold Evidence:** `NO EXPLICIT THRESHOLD REPORTED`. Sources describe continuous physical relationships without an arbitrary binary success boundary.
- **D. Proposed Clinical Decision:** `PENDING SURGEON VALIDATION`. Surgeons must ratify clinical bands: $\le 1.0\text{ mm}$ (optimal), $1.1\text{--}2.0\text{ mm}$ (subclinical), $> 2.0\text{ mm}$ (adverse clinical enophthalmos).
- **E. Validation Requirement:** Inter-examiner reliability comparison of Hertel exophthalmometry vs 3D CT axial globe distance.
- **Supporting Evidence IDs:** `CANON-RES-EVD-004` (PAP-004, `VERIFIED_ABSTRACT_ONLY`), `CANON-ATLAS-CH19-EVD-004` (`VERIFIED_PRIMARY_SOURCE`).

##### Criterion RUB-CRIT-D2-03: Postoperative Diplopia & Ocular Motility Field
- **A. Source-Reported Finding:** Atlas Ch. 19 (p. 809) and Bly et al. (2013) document diplopia incidence and extraocular muscle entrapment. Bly reported conventional repair left 38% enophthalmos vs 9% with computer guidance.
- **B. Candidate Operational Definition:** Structured binocular visual field evaluation recording presence, gaze direction (primary, downward/reading, extreme periphery), and severity of double vision.
- **C. Threshold Evidence:** `NO EXPLICIT THRESHOLD REPORTED`. Binary pass/fail is clinically invalid without gaze-direction stratification.
- **D. Proposed Clinical Decision:** `PENDING SURGEON VALIDATION`. Surgeons and ophthalmologists must ratify the clinical rule: diplopia in extreme peripheral gaze ($>30^\circ$) is clinically acceptable, whereas diplopia in primary or downward/reading gaze constitutes an adverse surgical outcome.
- **Supporting Evidence IDs:** `CANON-ATLAS-CH19-EVD-004` (`VERIFIED_PRIMARY_SOURCE`), `CANON-RES-EVD-005` (PAP-005, `VERIFIED_ABSTRACT_ONLY`).

---

#### Domain 3: Occlusion and Mandibular Function
- **Clinical Construct Assessed:** Dynamic mandibular kinematics, interincisal opening, protrusive/lateral excursions, static dental intercuspation, and avoidance of prolonged immobilization.
- **Eligible Fracture Regions:** Mandibular condyle/subcondyle, angle, ramus, body, symphysis, Le Fort fractures with occlusal disruption.
- **Treatment Contexts:** ORIF (miniplates/screws, reconstruction plates), closed reduction with IMF, functional active mobilization.

##### Criterion RUB-CRIT-D3-01: Maximal Interincisal Opening (MIO) & Mobility
- **A. Source-Reported Finding:** Eckelt et al. (2006) randomized multicenter trial showed operative treatment achieved significantly greater mean MIO ($46.5\text{ mm}$ vs $40.9\text{ mm}$, $P = 0.001$), greater protrusion ($7.3\text{ mm}$ vs $4.7\text{ mm}$), and fewer terminal deviations ($19\%$ vs $66\%$).
- **B. Candidate Operational Definition:** Interincisal distance between central incisor edges at maximum active jaw opening, measured with calibrated millimeter scale.
- **C. Threshold Evidence:** `NO EXPLICIT THRESHOLD REPORTED`. Both operative and closed groups in Eckelt achieved mean openings $>40\text{ mm}$. Hard-coding $40\text{ mm}$ as a universal pass/fail boundary is scientifically invalid.
- **D. Proposed Clinical Decision:** `PENDING SURGEON VALIDATION`. Surgeons must ratify age- and gender-adjusted continuous functional bands: Normal ($\ge 40\text{ mm}$ or return to baseline), Mild Limitation ($35\text{--}39\text{ mm}$), Severe Trismus ($<35\text{ mm}$).
- **E. Validation Requirement:** Longitudinal study evaluating pre-injury baseline MIO distribution and recovery trajectories across adult trauma cohorts.
- **Supporting Evidence IDs:** `CANON-RES-EVD-006` (PAP-006), `CANON-RES-EVD-008` (PAP-008) [`VERIFIED_ABSTRACT_ONLY`].

##### Criterion RUB-CRIT-D3-02: Static and Dynamic Dental Occlusal Restoration
- **A. Source-Reported Finding:** Ellis et al. (2000) prospective trial showed closed treatment of condylar fractures resulted in significantly higher incidence of postoperative malocclusion. Atlas Ch. 19 (p. 810) stresses restoration of pre-morbid wear facets.
- **B. Candidate Operational Definition:** Clinical intraoral evaluation of intercuspation reproducibility, absence of premature contacts, and dental midline alignment using articulating paper and shimstock foil.
- **C. Threshold Evidence:** `NO EXPLICIT THRESHOLD REPORTED`. Source literature reports presence vs absence of malocclusion without millimeter step-off thresholds.
- **D. Proposed Clinical Decision:** `PENDING SURGEON VALIDATION`. Surgeons must ratify categorical classification: Class 1 (anatomic reproduction of premorbid occlusion), Class 2 (minor prematurity managed with selective grinding/elastics), Class 3 (gross malocclusion requiring revision).
- **Supporting Evidence IDs:** `CANON-RES-EVD-007` (PAP-007, `VERIFIED_ABSTRACT_ONLY`), `CANON-ATLAS-CH19-EVD-010`/`011` (`VERIFIED_PRIMARY_SOURCE`).

##### Criterion RUB-CRIT-D3-03: Intermaxillary Fixation (IMF) Immobilization Duration
- **A. Source-Reported Finding:** Adeyemi et al. (2012) trial showed 2 weeks of IMF achieved normal MIO recovery significantly faster than 4–6 weeks ($P < .001$) with identical union rates. Atlas Ch. 19 (p. 812) warns that elastic IMF exceeding 4 weeks causes permanent joint stiffness and muscle atrophy.
- **B. Candidate Operational Definition:** Documented total elapsed duration (calendar days and weeks) of active rigid or tight elastic intermaxillary immobilization.
- **C. Threshold Evidence:** `NO EXPLICIT THRESHOLD REPORTED`. Establishes a clinical safety ceiling ($\le 4\text{ weeks}$), not a standalone quality score.
- **D. Proposed Clinical Decision:** `PENDING SURGEON VALIDATION`. Surgeons must confirm protocol rule: active IMF exceeding 4 weeks without documented specific indication is flagged as a functional process risk factor.
- **Supporting Evidence IDs:** `CANON-RES-EVD-008` (PAP-008, `VERIFIED_ABSTRACT_ONLY`), `CANON-ATLAS-CH19-EVD-012` (`VERIFIED_PRIMARY_SOURCE`).

---

#### Domain 4: Mastication, Speech and Other Functional Outcomes
- **Clinical Construct Assessed:** Ability to resume pre-morbid diet consistency and articulate speech without trauma-related phonetic impediment.
- **Eligible Fracture Regions:** Mandibular body, angle, symphysis, condyle, maxilla, palatal vault.

##### Criterion RUB-CRIT-D4-01: Masticatory Efficiency & Dietary Progression
- **A. Source-Reported Finding:** Atlas Ch. 19 (p. 810) outlines dietary progression stages: soft non-chew diet for 4–6 weeks transitioning to unrestricted mastication as bone consolidates.
- **B. Candidate Operational Definition:** Standardized categorical assessment of highest tolerated dietary consistency (Level 1 Liquid, Level 2 Pureed, Level 3 Soft Mechanical, Level 4 Unrestricted Solid) at follow-up epochs.
- **C. Threshold Evidence:** `NO EXPLICIT THRESHOLD REPORTED`. Qualitative clinical aftercare milestone.
- **D. Proposed Clinical Decision:** `PENDING SURGEON VALIDATION`. Surgeons must ratify expected recovery timelines (e.g., Level 4 solid diet achieved by 12 weeks in uncomplicated repairs).
- **Supporting Evidence IDs:** `CANON-ATLAS-CH19-EVD-010` [`VERIFIED_PRIMARY_SOURCE`].

---

#### Domain 5: Neurosensory Outcomes
- **Clinical Construct Assessed:** Somatosensory recovery of the trigeminal nerve divisions (V2 infraorbital nerve, V3 inferior alveolar/mental nerve) and motor branch integrity of the facial nerve (cranial nerve VII).
- **Eligible Fracture Regions:** ZMC, orbital floor, mandibular angle, body, parasymphysis.

##### Criterion RUB-CRIT-D5-01: Trigeminal Sensory Nerve Recovery
- **A. Source-Reported Finding:** Atlas Ch. 19 (p. 813) details neurosensory recovery curves: neuropraxia improves over 6–12 months; persistent anesthesia beyond 12 months signifies permanent nerve transection or entrapment.
- **B. Candidate Operational Definition:** Standardized clinical neurosensory testing (static 2-point discrimination in mm, light brush directional sensation, pinprick) mapped across V2/V3 dermatomes and scored on MRC sensory scale (S0 to S4).
- **C. Threshold Evidence:** `NO EXPLICIT THRESHOLD REPORTED`. Surgical atlas documents a 6–12 month biological timeframe, not a binary surgical success cutoff.
- **D. Proposed Clinical Decision:** `PENDING SURGEON VALIDATION`. Clinicians must approve timeline rule: neurosensory deficit is evaluated as an adverse surgical outcome **only after 12 months follow-up**, separating early transient neuropraxia.
- **Supporting Evidence IDs:** `CANON-ATLAS-CH19-EVD-013` [`VERIFIED_PRIMARY_SOURCE`].

---

#### Domain 6: Facial Soft-Tissue Appearance and Symmetry
- **Clinical Construct Assessed:** Soft tissue redraping, facial animation symmetry, eyelid position (scleral show / ectropion), and surgical scar maturation.
- **Eligible Fracture Regions:** Panfacial trauma, coronal, transconjunctival, subciliary, and intraoral surgical approaches.

##### Criterion RUB-CRIT-D6-01: Facial Soft Tissue Contour & Scar Maturation
- **A. Source-Reported Finding:** Atlas Ch. 19 (p. 815) documents soft tissue redraping and scar maturation continuing for 12–18 months. Highlights potential for ectropion, canthal dystopia, and facial ptosis following trauma dissection.
- **B. Candidate Operational Definition:** Assessment of lower eyelid position (scleral show in mm), intercanthal alignment, and surgical scar quality using Patient and Observer Scar Assessment Scale (POSAS).
- **C. Threshold Evidence:** `NO EXPLICIT THRESHOLD REPORTED`. Qualitative aesthetic aftercare guideline.
- **D. Proposed Clinical Decision:** `PENDING SURGEON VALIDATION`. Surgeons must confirm timing threshold: definitive soft-tissue aesthetic scoring must not be finalized before 12 months post-injury.
- **Supporting Evidence IDs:** `CANON-ATLAS-CH19-EVD-018`, `CANON-ATLAS-CH19-EVD-019` [`VERIFIED_PRIMARY_SOURCE`].

---

#### Domain 7: Patient-Reported Outcomes (PROMs)
- **Clinical Construct Assessed:** Patient perception of facial appearance satisfaction, psychological well-being, and health-related quality of life.
- **Eligible Fracture Regions:** All craniomaxillofacial fractures in cognitively intact adult patients.

##### Criterion RUB-CRIT-D7-01: FACE-Q Satisfaction with Facial Appearance
- **A. Source-Reported Finding:** Elegbede et al. (2018) prospectively administered FACE-Q scales to 185 facial fracture patients (Cronbach alpha 0.824–0.969). Pusic et al. (2013) developed the Satisfaction with Facial Appearance scale using Rasch Measurement Theory (transformed score 0–100).
- **B. Candidate Operational Definition:** Patient-completed FACE-Q Satisfaction with Facial Appearance module. 10 items scored 1–4 and converted via Rasch table to an interval-level score from 0 (lowest) to 100 (highest satisfaction).
- **C. Threshold Evidence:** `NO EXPLICIT THRESHOLD REPORTED`. Psychometrically validated continuous survey scale; source defines no binary surgical pass/fail threshold.
- **D. Proposed Clinical Decision:** `PENDING SURGEON VALIDATION`. Clinicians and patient panels must determine how PROM scores are reported alongside objective CT measurements **without arithmetic weighted collapsing**.
- **Critical Boundary Enforced:** Psychometric validation of an individual survey instrument **cannot validate an arithmetic composite rubric** that sums survey points and skeletal millimeter gaps. PROMs must be presented as an independent dimension.
- **Supporting Evidence IDs:** `CANON-RES-EVD-012` (PAP-012, `VERIFIED_PRIMARY_SOURCE`), `CANON-RES-EVD-013` (PAP-013, `VERIFIED_ABSTRACT_ONLY`).

---

#### Domain 8: Complications, Safety and Additional Treatment
- **Clinical Construct Assessed:** Adverse events, surgical site infection, wound breakdown, hardware failure, and requirement for secondary revision surgery.
- **Eligible Fracture Regions:** All surgically treated maxillofacial fractures.

##### Criterion RUB-CRIT-D8-01: Hardware Complications & Symptomatic Plate Removal
- **A. Source-Reported Finding:** Nagase et al. (2005) 13-year cohort reported 33.3% hardware removal, with 64.4% driven by infection, pain, palpability, or cold intolerance. Mosbah et al. (2003) confirmed site pain in 14% and early removal driven by infection/exposure. Atlas Ch. 19 (p. 814) notes 5–10% removal rate.
- **B. Candidate Operational Definition:** Documented incidence, postoperative timing, and specific indication (infection, exposure, pain, cold intolerance) for surgical removal of osteosynthesis hardware.
- **C. Threshold Evidence:** `NO EXPLICIT THRESHOLD REPORTED`. Routine removal is explicitly discouraged; removal reflects symptom-driven clinical management.
- **D. Proposed Clinical Decision:** `PENDING SURGEON VALIDATION`. Surgeons must confirm event definition: asymptomatic hardware retention = stable outcome; plate removal within 12 months for infection/dehiscence = surgical complication.
- **Supporting Evidence IDs:** `CANON-RES-EVD-010` (PAP-010), `CANON-RES-EVD-011` (PAP-011) [`VERIFIED_ABSTRACT_ONLY`], `CANON-ATLAS-CH19-EVD-015` [`VERIFIED_PRIMARY_SOURCE`].

##### Criterion RUB-CRIT-D8-02: Surgical Site Infection, Dehiscence & Bone Non-Union
- **A. Source-Reported Finding:** Atlas Ch. 19 (pp. 806–808) details postoperative wound complications, healing timelines, and factors predisposing to osteomyelitis, bone non-union, or catastrophic plate exposure.
- **B. Candidate Operational Definition:** Occurrence of deep or superficial surgical site infection (CDC criteria), mucosal wound breakdown exposing bone/plates, or delayed/non-union requiring secondary surgery, graded on Clavien-Dindo scale.
- **C. Threshold Evidence:** `NO EXPLICIT THRESHOLD REPORTED`. Standard surgical adverse event metric.
- **D. Proposed Clinical Decision:** `PENDING SURGEON VALIDATION`. Surgeons must ratify complication severity grading using Clavien-Dindo classification adapted for maxillofacial trauma.
- **Supporting Evidence IDs:** `CANON-ATLAS-CH19-EVD-001`, `CANON-ATLAS-CH19-EVD-002`, `CANON-ATLAS-CH19-EVD-007` [`VERIFIED_PRIMARY_SOURCE`].

---

### 4. Prohibition of Arbitrary Composite Scoring

To maintain scientific integrity and prevent false clinical certainty:
1. **No Single Number Total Score:** The evaluator will **never** sum millimeters, survey points, and binary infection flags into a single composite score (e.g. "82/100 points").
2. **Parallel Radar Profiles:** Output will be presented as eight distinct parallel domain axes, enabling clinicians to identify isolated deficits (e.g., perfect skeletal symmetry but persistent diplopia).
3. **No Fabricated Grade Boundaries:** Labels like "Grade A / Excellent", "Grade B / Good", or "Pass / Fail" are prohibited until established through multi-center prospective outcome trials.
