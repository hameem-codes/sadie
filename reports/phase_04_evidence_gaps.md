# Phase 4 — Prioritized Evidence Gaps & Research Roadmap

## Maxillofacial Fracture Treatment-Outcome Evaluator Project

**Quality Status:** Grounded strictly in currently ingested evidence (62 records: 2 textbooks, 14 clinical studies).  
**Notice:** These findings are labeled as gaps identified by the currently ingested evidence, not an exhaustive systematic review.

---

### 1. Executive Summary of Prioritized Gaps
The Maxillofacial Treatment-Outcome Evaluator aims to replace subjective impressions with objective, reproducible, and clinically validated treatment-outcome evaluations. 

A critical finding of Phase 4 is that while current literature provides abundant **qualitative principles** (textbooks) and **isolated continuous predictors** (primary studies), significant clinical evidence gaps remain before an automated evaluation system can establish definitive scoring cutoffs.

```
+--------------------------------------------------------------------------------------------------+
|                                    PRIORITIZED EVIDENCE GAPS                                     |
+--------+---------------------------------------------------------+-------------------------------+
| Gap ID | Clinical Evaluation Priority Area                       | Current Literature Status     |
+--------+---------------------------------------------------------+-------------------------------+
| GAP-01 | Quantitative Skeletal Reduction & Symmetry Tolerances   | Partial baseline controls only|
| GAP-02 | Orbital Reconstruction & Clinically Meaningful Outcomes | Continuous predictor only     |
| GAP-03 | Mandibular Occlusion & Functional Recovery              | Comparative cohort means only |
| GAP-04 | Validated PROMs in Facial Trauma (Composite Formula)    | Isolated construct scales only|
| GAP-05 | Complication Definitions & Standardized Follow-up Timing| Narrative atlas guidance only |
| GAP-06 | Interobserver & Intraobserver Measurement Reliability   | Subsystem-dependent data only |
+--------+---------------------------------------------------------+-------------------------------+
```

---

### 2. Detailed Gap Analyses

#### Gap 1: Quantitative Skeletal Reduction & Symmetry Tolerances
- **What Current Evidence Supports:**
  - Ho et al. (2017) demonstrated that uninjured Dutch adults possess natural facial skeletal asymmetry averaging $	ext{MSD } 0.14	ext{ mm}$ and $	ext{RMSD } 0.87	ext{ mm}$, extending up to $1.98	ext{ mm}$ in normal anatomies.
  - Fonseca Chapter 12 details the three-dimensional buttress pillars necessary for facial height, width, and projection.
- **What Is Missing (The Gap):**
  - There is a lack of prospective clinical evidence defining the **threshold of perceptible deformity**. Specifically, what millimeter discrepancy between fractured and mirrored normal zygomas is perceptible to trained surgeons versus lay observers?
  - Does a residual asymmetry of $2.2	ext{ mm}$ RMSD correlate with adverse functional or psychosocial outcomes?
- **Clinical Consequence:**
  - Without surgeon consensus on acceptable asymmetry tolerances, automated CT mirroring tools risk flagging clinically imperceptible biological asymmetry as "surgical failure," or passing cosmetically significant malar flattening.
- **Recommended Study Design:**
  - A multi-center validation cohort ($n \ge 100$) evaluating post-reduction 3D CT symmetry against blinded expert surgeon ratings, 3D optical surface photogrammetry, and FACE-Q scores.

---

#### Gap 2: Orbital Reconstruction & Clinically Meaningful Outcomes
- **What Current Evidence Supports:**
  - Whitehouse et al. (1994) documented that each $1.0	ext{ mL}$ increase in bony orbital volume predicts $pprox 0.8	ext{ mm}$ of globe recession ($r = 0.79$).
  - Bly et al. (2013) demonstrated that computer-assisted reconstruction reduces volume delta to $0.74	ext{ mL}$ vs $2.12	ext{ mL}$ conventional.
- **What Is Missing (The Gap):**
  - A definitive volume threshold that guarantees the absence of late enophthalmos across all defect sizes.
  - Evidence quantifying how orbital fat necrosis, soft tissue scarring, and defect location (anterior floor vs posterior retrobulbar ledge) modify the volumetric predictive equation.
- **Clinical Consequence:**
  - Focusing exclusively on a $1.0	ext{ mL}$ volume delta ignores retrobulbar fat atrophy and ocular motility restrictions (diplopia), which can occur even with anatomically restored volume.
- **Recommended Study Design:**
  - A prospective registry integrating pre- and postoperative fine-slice orbital CT, automated volume segmentation, Hertel exophthalmometry, and Hess screen binocular diplopia mapping at 6 months follow-up.

---

#### Gap 3: Mandibular Occlusion & Functional Recovery
- **What Current Evidence Supports:**
  - Eckelt et al. (2006) showed operative condylar treatment achieves superior functional means over closed treatment ($	ext{MIO } 46.5	ext{ mm}$ vs $40.9	ext{ mm}$; lateral excursion $7.3	ext{ mm}$ vs $4.7	ext{ mm}$).
  - Adeyemi et al. (2012) proved that short elastic IMF ($\le 2	ext{ weeks}$) restores mouth opening faster than prolonged immobilization.
- **What Is Missing (The Gap):**
  - Validated scoring systems that adjust post-treatment MIO for individual pre-morbid baseline, sex, and age.
  - Quantitative digital metrics for dental occlusal alignment (e.g., T-Scan digital occlusal force mapping or automated intraoral scan step-off detection).
- **Clinical Consequence:**
  - A rigid $40	ext{ mm}$ binary cutoff inappropriately penalizes patients whose physiological uninjured baseline was $36	ext{--}38	ext{ mm}$, while failing to detect significant functional loss in patients whose baseline was $55	ext{ mm}$.
- **Recommended Study Design:**
  - Prospective study tracking dynamic mandibular kinematics (MIO, protrusion, lateral movement) and digital occlusal analysis across mandibular fracture cohorts at 6 weeks, 3 months, and 12 months.

---

#### Gap 4: Validated Patient-Reported Outcome Measures in Facial Trauma
- **What Current Evidence Supports:**
  - Elegbede et al. (2018) and Pusic et al. (2013) established that the FACE-Q Craniofacial/Aesthetic modules possess high internal consistency (Cronbach's $lpha = 0.82	ext{--}0.97$) and construct validity for patient satisfaction in trauma.
- **What Is Missing (The Gap):**
  - An evidence-based weighting framework determining how subjective patient perception should be integrated with objective CT imaging metrics.
  - Validation demonstrating that composite scores (e.g., $50\%\text{ CT symmetry} + 25\%\text{ Occlusion} + 25\%\text{ FACE-Q}$) possess clinical utility or predictive validity.
- **Clinical Consequence:**
  - Prematurely combining objective skeletal millimeter discrepancies and subjective questionnaire points into an arithmetic composite score creates an unvalidated metric with an unearned veneer of scientific authority.
- **Recommended Study Design:**
  - Structural equation modeling and psychometric validation of multi-attribute outcome profiles (reporting skeletal, functional, and PROM dimensions separately rather than collapsed into an arithmetic sum).

---

#### Gap 5: Complication Definitions & Follow-up Periods
- **What Current Evidence Supports:**
  - Nagase et al. (2005) and Mosbah et al. (2003) document symptomatic plate removal rates ($5	ext{--}10\%$) driven by infection, pain, and cold intolerance.
  - Perry & Holmes (Atlas Chapter 19) outline biological healing intervals for bones (6–8 weeks), sensory nerves (6–12 months), and soft tissue scars (12–18 months).
- **What Is Missing (The Gap):**
  - An adopted trauma complication classification system (such as Clavien-Dindo adapted for craniomaxillofacial surgery) defining minor vs major adverse events.
  - Consensus on standardized follow-up evaluation epochs for definitive outcome reporting.
- **Clinical Consequence:**
  - Evaluating treatment success before 6–12 months inappropriately penalizes transient neuropraxia, post-traumatic swelling, or early scar redness as surgical failures.
- **Recommended Study Design:**
  - International Delphi consensus study establishing standardized reporting epochs (6 weeks, 6 months, 12 months) and adverse event definitions in maxillofacial trauma.

---

#### Gap 6: Interobserver & Intraobserver Measurement Reliability
- **What Current Evidence Supports:**
  - van Hout et al. (2019) demonstrated that diagnostic classification agreement in facial trauma varies significantly across subsites (AO CMF agreement $\kappa = 0.60	ext{--}0.78$, dropping in condylar and internal orbital fractures).
- **What Is Missing (The Gap):**
  - Reliability data assessing the measurement error of CT landmark identification, 3D plane definition, and automated surface registration.
- **Clinical Consequence:**
  - If interobserver error in placing orbital or zygomatic reference landmarks is $\pm 1.2	ext{ mm}$, an algorithm cannot reliably enforce a $1.5	ext{ mm}$ tolerance threshold.
- **Recommended Study Design:**
  - Multi-observer reliability study involving craniomaxillofacial surgeons and radiologists performing repeated manual and semi-automated measurements on standardized CT datasets to establish ICC (Intraclass Correlation Coefficients) and Bland-Altman limits of agreement.
