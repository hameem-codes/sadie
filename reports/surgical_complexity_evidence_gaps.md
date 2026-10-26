# Surgical Complexity Assessment — Evidence Mapping and Gap Analysis

**Project:** ADRAB Maxillofacial Surgical Complexity Framework  
**Document:** `reports/surgical_complexity_evidence_gaps.md`  
**Rubric Specification:** `SURGICAL-COMPLEXITY-v1.0`  
**Audit Standard:** Zero-Fabrication, Strict Citation Verification, Full-Text vs. Abstract Scoping  

---

## 1. Executive Summary

This report audits the published scientific evidence supporting the 9 criteria of the candidate **Surgical Complexity Rubric**. 

It details:
1. Which published and verified records in the ADRAB canonical repository directly support each criterion.
2. The exact page numbers, table references, and citation identifiers where documented.
3. The distinction between full-text verification (`VERIFIED_PRIMARY_SOURCE`) and abstract-only verification (`VERIFIED_ABSTRACT_ONLY`).
4. Key scientific evidence gaps, unvalidated thresholds, and the immediate blockers to clinical deployment.

---

## 2. Published Evidence Mapping by Criterion

| Criterion ID | Criterion Name | Supporting Evidence Record IDs | Exact Source Location & Citation | Verification Scope | What Current Evidence Specifically Supports |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **COMPLEX-CRIT-01** | Fracture Number & Severity | `CANON-CH12-EVD-001`, `CANON-RES-EVD-014` | Fonseca Ch. 12 (pp. 232–247); Mittermiller et al. (2019, *CMTR*, PMC6834479) | **Full Text** (Fonseca) / **Full Text** (Mittermiller) | Biomechanical significance of buttress disruption; establishes that Level 2 location has higher agreement ($\kappa=0.69$) than Level 3 comminution/displacement ($\kappa=0.59$). |
| **COMPLEX-CRIT-02** | Regions & Bones Operated | `CANON-CH12-EVD-001`, `CANON-ATLAS-CH19-EVD-001` | Fonseca Ch. 12 (pp. 232–235); Perry & Holmes Atlas Ch. 19 (p. 805) | **Full Text** (Fonseca) / **Full Text** (Atlas Ch. 19) | Multi-pillar midfacial load transfer; sequencing principles for panfacial reconstruction across compartments. |
| **COMPLEX-CRIT-03** | Reduction Complexity | `CANON-CH12-EVD-001`, `CANON-RES-EVD-005` | Fonseca Ch. 12 (pp. 240–244); Bly et al. (2013, *JAMA Facial Plast Surg*, PMID 23328551) | **Full Text** (Fonseca) / **Abstract Only** (Bly 2013) | Anatomical vector challenges in Le Fort/ZMC; computer navigation utility in complex multi-vector defects ($0.74\text{ mL}$ vs $2.12\text{ mL}$ error). |
| **COMPLEX-CRIT-04** | Procedures Performed | `CANON-ATLAS-CH19-EVD-001`, `CANON-RES-EVD-003` | Perry & Holmes Atlas Ch. 19 (pp. 808–811); Whitehouse et al. (1994, *Br J Ophthalmol*, PMC504888) | **Full Text** (Atlas Ch. 19) / **Full Text** (Whitehouse 1994) | Surgical access indications for internal orbit, skull base, and sinus cranialization; predictive model for orbital defect repair ($1.0\text{ mL} = 0.8\text{ mm}$ enophthalmos). |
| **COMPLEX-CRIT-05** | Fixation Hardware Burden | `CANON-RES-EVD-009`, `CANON-RES-EVD-010`, `CANON-RES-EVD-011` | Kroon et al. (1991, *JCMS*, PMID 1943807); Nagase et al. (2005, *Ann Plast Surg*, PMID 16327461); Mosbah et al. (2003, *IJOMS*, PMID 12615467) | **Abstract Only** (Kroon, Nagase, Mosbah) | Load-bearing vs load-sharing biomechanics (Kroon); hardware burden and removal distribution across 13-year cohort ($33.3\%$ removal rate, Nagase). |
| **COMPLEX-CRIT-06** | Soft-Tissue & Associated Injury | `CANON-CH12-EVD-006`, `CANON-CH12-EVD-008` | Fonseca Ch. 12 (pp. 234–237) | **Full Text** (Fonseca) | Denis three-column cervical spine instability (2 or 3 columns disrupted = unstable); CTA indication for head/neck vascular trauma ($100\%$ sensitivity, $98\%$ specificity). |
| **COMPLEX-CRIT-07** | Approaches & Staging | `CANON-ATLAS-CH19-EVD-001`, `CANON-CH12-EVD-001` | Perry & Holmes Atlas Ch. 19 (pp. 805, 815); Fonseca Ch. 12 (pp. 240–244) | **Full Text** (Atlas Ch. 19) / **Full Text** (Fonseca) | Extent and morbidity of extended exposures (bicoronal flap, transfacial approaches); surgical sequencing in staged reconstruction. |
| **COMPLEX-CRIT-08** | Operative Duration & Blood Loss | `CANON-CH12-EVD-008`, `CANON-ATLAS-CH19-EVD-001` | Fonseca Ch. 12 (pp. 236–237); Perry & Holmes Atlas Ch. 19 (pp. 805–808) | **Full Text** (Fonseca) / **Full Text** (Atlas Ch. 19) | Major hemorrhage risks from internal maxillary/ethmoidal arteries; physiological stress of prolonged operative exposure. |
| **COMPLEX-CRIT-09** | Intraoperative Complications | `CANON-ATLAS-CH19-EVD-001`, `CANON-CH12-EVD-008` | Perry & Holmes Atlas Ch. 19 (pp. 805–809); Fonseca Ch. 12 (pp. 236–241) | **Full Text** (Atlas Ch. 19) / **Full Text** (Fonseca) | Acute intraoperative crises: catastrophic internal maxillary hemorrhage, cribriform plate dural disruption/CSF leak, acute orbital compartment syndrome. |

---

## 3. Prioritized Scientific Evidence Gaps

While current literature provides rich anatomical and biomechanical descriptions, five distinct evidence gaps prevent automated scalar scoring:

### Gap 1: Absence of Validated Relative Weights for Surgical Complexity
- **The Gap:** There is no empirical, peer-reviewed consensus determining how many points a coronal flap elevation is worth relative to a 2.4 mm load-bearing reconstruction plate, or how fracture comminution weights against operative duration.
- **Clinical Consequence:** Creating a single composite mathematical formula (e.g. $10\cdot\text{Fractures} + 5\cdot\text{Plates} + 2\cdot\text{Hours}$) would represent arbitrary fabrication.
- **Mitigation:** The system refuses to calculate a composite score, reporting independent parallel profiles (`PROHIBITED_UNVALIDATED_PARALLEL_PROFILES_ONLY`).

### Gap 2: Confounding of Operative Duration
- **The Gap:** Literature lacks multi-center case-mix adjustment models for operative duration in maxillofacial trauma. Operative time is confounded by surgical team experience, resident training environment, difficult airway management, and anesthesia changeover.
- **Clinical Consequence:** Fast surgeons operating on complex cases could be scored as having lower complexity if duration is treated as an unadjusted linear variable.
- **Mitigation:** Operative duration is categorized into broad descriptive bands (<120 min, 120–240 min, >240 min) and evaluated in parallel with hardware and anatomical regions.

### Gap 3: Observer Reliability of Comminution & Displacement Variables
- **The Gap:** As demonstrated by Mittermiller et al. (2019, PAP-014), inter-rater agreement for fracture displacement and comminution morphology ($\kappa = 0.59$) is substantially lower than for anatomical fracture location ($\kappa = 0.69$).
- **Clinical Consequence:** Categorizing a case into "High" vs "Moderate" comminution from imaging or narrative notes alone suffers from inter-examiner variability.
- **Mitigation:** Preoperative severity is audited with explicit uncertainty documentation and flagged for surgeon confirmation.

### Gap 4: Incomplete Full-Text Ingestion for Biomechanical Studies
- **The Gap:** Studies evaluating miniplate mechanical failure (Kroon et al. 1991) and plate removal epidemiology (Nagase et al. 2005; Mosbah et al. 2003) are currently ingested under `VERIFIED_ABSTRACT_ONLY` scope due to paywall boundaries.
- **Clinical Consequence:** Specific granular measurements (such as plate fatigue failure cycles or screw pull-out forces) cannot be cited beyond abstract assertions.
- **Mitigation:** Explicitly labeled as `VERIFIED_ABSTRACT_ONLY` without inferring unverified full-text tables.

### Gap 5: Prospective Multi-Center Surgeon Panel Validation
- **The Gap:** The candidate rubric has not yet undergone formal multidisciplinary review (Oral & Maxillofacial Surgery, Plastic Surgery, Otolaryngology–Head & Neck Surgery).
- **Status:** All 9 criteria carry the formal status `PENDING_SURGEON_VALIDATION`.

---

## 4. Next Project Blocker

The immediate next blocker for the ADRAB Surgical Complexity Assessment module is:
**Conducting a formal Delphi consensus study or structured surgeon review panel to ratify candidate criteria definitions, threshold bands, and applicability rules.**

Until that panel review is completed, the software engine correctly operates in prototype mode, producing transparent, multi-attribute, unweighted descriptive profiles.
