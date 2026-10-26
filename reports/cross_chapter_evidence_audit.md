# Cross-Chapter Evidence Audit Report

## Maxillofacial Treatment-Outcome Evaluator Project

**Audit Scope:** Comprehensive cross-chapter evaluation of 48 extracted evidence records across two primary reference volumes:
1. *Oral and Maxillofacial Trauma*, 4th Edition (2013, Saunders) — Chapter 12 (*Radiographic Evaluation of Facial Injuries*, pp. 232–247 / PDF 254–269): **28 records** (`CH12-EVD-001` to `028`).
2. *Atlas of Operative Maxillofacial Trauma Surgery* (2014, Springer) — Chapter 19 (*Aftercare and Follow-up*, pp. 805–817 / PDF 808–820): **20 records** (`ATLAS-CH19-EVD-001` to `020`).

## 1. Chapter Naming Discrepancy Note & Correction Recommendation
> [!IMPORTANT]
> **Naming Discrepancy:** The second source chapter was prompted as 'Chapter 20 — Aftercare and Follow-up'. In the physical volume (*Atlas of Operative Maxillofacial Trauma Surgery*, Springer 2014, DOI: `10.1007/978-1-4471-2855-7_19`), this chapter is **Chapter 19** (printed pp. 805–817, PDF indexes 808–820). The book ends with the Index on printed p. 819 (PDF 821); there is no Chapter 20.
> 
> **Preservation Protocol:** Existing filenames `atlas_chapter_20_evidence.csv`, `atlas_chapter_20_evidence.json`, `atlas_chapter_20_summary.md`, and `atlas_chapter_20_validation.md` have been strictly preserved without silent modification or deletion.
> 
> **Recommended Future Correction:** When refactoring the data pipeline, maintain symbolic aliases or migrate to canonical source-based names (e.g., `atlas_chapter_19_aftercare_evidence.*`) with backwards-compatible symlinks or configuration mappings.

## 2. Classification Summary (All 48 Records)

| Standardized Audit Classification | Record Count | Percentage | Primary Clinical / Pipeline Role |
| :--- | :---: | :---: | :--- |
| **`IMAGING OR MEASUREMENT METHOD`** | 17 | 35.4% | Imaging hardware protocols, search lines, and anatomical reference planes. |
| **`POSTOPERATIVE OUTCOME MEASUREMENT`** | 9 | 18.8% | Clinical and radiological assessment methods, diet duration, and follow-up intervals. |
| **`COMPLICATION / SAFETY OUTCOME`** | 9 | 18.8% | Documented post-repair adverse events, timeframes, and anatomical hazards. |
| **`GENERAL CLINICAL CONTEXT`** | 6 | 12.5% | Triage clearance rules, biology vs calendar follow-up, and general principles. |
| **`DIAGNOSTIC CONTEXT ONLY`** | 5 | 10.4% | Pre-reduction acute fracture signs, initial incidence, and diagnostic imaging accuracy. |
| **`DIRECT TREATMENT-OUTCOME EVIDENCE`** | 2 | 4.2% | Validated biological efficacy bounds of reduction / fixation techniques. |

## 3. Detailed Audit Matrix by Evidence Record

| ID | Source | Classification | What It CAN Support | What It CANNOT Support | Explicit Threshold | Primary Study |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `CH12-EVD-001` | Oral and Maxill... | `IMAGING OR MEASUREMENT METHOD` | Anatomical reference framework for evaluating vertical and A... | Cannot support a validated success score, reduction toleranc... | `NO EXPLICIT THRESHOLD REPORTED` | Manson et al. (1980); Mar... |
| `CH12-EVD-002` | Oral and Maxill... | `IMAGING OR MEASUREMENT METHOD` | Reference framework for horizontal midfacial width, lateral ... | Cannot support a quantitative reduction threshold, acceptabl... | `NO EXPLICIT THRESHOLD REPORTED` | Manson et al. (1980); Fat... |
| `CH12-EVD-003` | Oral and Maxill... | `POSTOPERATIVE OUTCOME MEASUREMENT` | Verification that Towne's projection is used postoperatively... | Cannot support an acceptable degree of residual angulation (... | `NO EXPLICIT THRESHOLD REPORTED` | Perry & Moutray (2008); B... |
| `CH12-EVD-004` | Oral and Maxill... | `IMAGING OR MEASUREMENT METHOD` | Identifies plain radiographic projections (lateral cephalic,... | Cannot support treatment outcome evaluation or quantitative ... | `NO EXPLICIT THRESHOLD REPORTED` | Afzelius & Rosen (1980)... |
| `CH12-EVD-005` | Oral and Maxill... | `IMAGING OR MEASUREMENT METHOD` | Identifies Waters' and SMV projections for midface, orbital ... | Cannot support postoperative reduction scoring or objective ... | `NO EXPLICIT THRESHOLD REPORTED` | NOT REPORTED IN SOURCE... |
| `CH12-EVD-006` | Oral and Maxill... | `GENERAL CLINICAL CONTEXT` | Preoperative triage safety rule: Denis 3-column spinal stabi... | Cannot support maxillofacial treatment outcome assessment or... | `2 or 3 columns disrupted = uns` | Denis (1984), Clin Orthop... |
| `CH12-EVD-007` | Oral and Maxill... | `IMAGING OR MEASUREMENT METHOD` | Establishes multiplanar CT (<=3 mm slices) and 3D reformatio... | Cannot define acceptable postoperative residual displacement... | `<= 3 mm image slice thickness` | Salvolini (2002); Heiken ... |
| `CH12-EVD-008` | Oral and Maxill... | `DIAGNOSTIC CONTEXT ONLY` | Validates multidetector CTA/MRA sensitivity (100%) and speci... | Cannot evaluate fracture reduction or maxillofacial skeletal... | `100% sensitivity, 98% specific` | Múnera et al. (2002), Rad... |
| `CH12-EVD-009` | Oral and Maxill... | `IMAGING OR MEASUREMENT METHOD` | Identifies MRI utility for soft tissue, TMJ, and CSF leak im... | Cannot support bony union or rigid fixation outcome assessme... | `NO EXPLICIT THRESHOLD REPORTED` | Bloch & Purcell (1940s); ... |
| `CH12-EVD-010` | Oral and Maxill... | `IMAGING OR MEASUREMENT METHOD` | Systematic search patterns (McGrigor & Campbell 4 lines, Tra... | Cannot measure postoperative reduction quality, gap, or heal... | `NO EXPLICIT THRESHOLD REPORTED` | McGrigor & Campbell (1950... |
| `CH12-EVD-011` | Oral and Maxill... | `POSTOPERATIVE OUTCOME MEASUREMENT` | Delbalso Four Ss method provides a qualitative framework for... | Does not provide quantitative symmetry tolerance limits (e.g... | `NO EXPLICIT THRESHOLD REPORTED` | Delbalso, Hall, Margarone... |
| `CH12-EVD-012` | Oral and Maxill... | `DIAGNOSTIC CONTEXT ONLY` | Diagnostic radiographic signs of acute cortical disruption (... | Cannot be used as a postoperative treatment outcome criterio... | `NO EXPLICIT THRESHOLD REPORTED` | NOT REPORTED IN SOURCE... |
| `CH12-EVD-013` | Oral and Maxill... | `DIAGNOSTIC CONTEXT ONLY` | Identifies indirect signs of paranasal sinus and soft tissue... | Cannot evaluate post-surgical bone stability or definitive f... | `NO EXPLICIT THRESHOLD REPORTED` | NOT REPORTED IN SOURCE... |
| `CH12-EVD-014` | Oral and Maxill... | `GENERAL CLINICAL CONTEXT` | Biological remodeling timeline: 7 to 10 days for fracture si... | Cannot evaluate reduction adequacy or operative outcome.... | `7 to 10 days` | NOT REPORTED IN SOURCE... |
| `CH12-EVD-015` | Oral and Maxill... | `IMAGING OR MEASUREMENT METHOD` | Imaging protocol for frontal sinus fractures: axial CT with ... | Cannot define acceptable postoperative residual sinus displa... | `1.0 or 1.5 mm slice thickness` | NOT REPORTED IN SOURCE... |
| `CH12-EVD-016` | Oral and Maxill... | `IMAGING OR MEASUREMENT METHOD` | Imaging protocol for NOE complex fractures: axial and corona... | Cannot define quantitative intercanthal distance threshold o... | `1.0 or 1.5 mm slice thickness` | NOT REPORTED IN SOURCE... |
| `CH12-EVD-017` | Oral and Maxill... | `POSTOPERATIVE OUTCOME MEASUREMENT` | Objective radiodensity threshold: CT fat attenuation (< -10 ... | Cannot determine acceptable residual enophthalmos (mm) or di... | `< -10 HU fat density indicates` | NOT REPORTED IN SOURCE... |
| `CH12-EVD-018` | Oral and Maxill... | `IMAGING OR MEASUREMENT METHOD` | Defines multiplanar reformats: coronal CT evaluates orbital ... | Cannot provide quantitative reconstructive defect size cutof... | `NO EXPLICIT THRESHOLD REPORTED` | Go et al. (2002)... |
| `CH12-EVD-019` | Oral and Maxill... | `IMAGING OR MEASUREMENT METHOD` | Anatomical reference framework for evaluating ZMC tripod ali... | Cannot define a post-reduction mm threshold for acceptable m... | `NO EXPLICIT THRESHOLD REPORTED` | NOT REPORTED IN SOURCE... |
| `CH12-EVD-020` | Oral and Maxill... | `COMPLICATION / SAFETY OUTCOME` | Identifies functional complication: medial displacement of z... | Cannot specify millimeter displacement threshold required to... | `NO EXPLICIT THRESHOLD REPORTED` | Dolan et al. (1984)... |
| `CH12-EVD-021` | Oral and Maxill... | `DIAGNOSTIC CONTEXT ONLY` | Frequency statistic (>80%) of vertical radiopaque band over ... | Cannot evaluate postoperative reduction or treatment outcome... | `> 80% prevalence in acute frac` | NOT REPORTED IN SOURCE... |
| `CH12-EVD-022` | Oral and Maxill... | `IMAGING OR MEASUREMENT METHOD` | Anatomical definition of LeFort I horizontal fracture involv... | Cannot establish an outcome score or acceptable postoperativ... | `NO EXPLICIT THRESHOLD REPORTED` | Mole et al. (1995)... |
| `CH12-EVD-023` | Oral and Maxill... | `IMAGING OR MEASUREMENT METHOD` | Anatomical definition of LeFort II pyramidal fracture involv... | Cannot provide quantitative projection restoration standards... | `NO EXPLICIT THRESHOLD REPORTED` | Mole et al. (1995)... |
| `CH12-EVD-024` | Oral and Maxill... | `IMAGING OR MEASUREMENT METHOD` | Anatomical definition of LeFort III craniofacial disjunction... | Cannot define a postoperative success score.... | `NO EXPLICIT THRESHOLD REPORTED` | Dolan et al. (1984)... |
| `CH12-EVD-025` | Oral and Maxill... | `DIAGNOSTIC CONTEXT ONLY` | Epidemiological incidence of mandibular fracture subsites: A... | Cannot evaluate treatment outcomes or post-surgical reductio... | `32% angle, 23.3% condyle, 17.7` | Mole et al. (1995), J Ora... |
| `CH12-EVD-026` | Oral and Maxill... | `GENERAL CLINICAL CONTEXT` | Injury co-occurrence rates: 50% facial fractures involve man... | Cannot measure treatment outcome quality or bone healing.... | `50% associated mandibular frac` | Ellis et al. (1985); Ceal... |
| `CH12-EVD-027` | Oral and Maxill... | `IMAGING OR MEASUREMENT METHOD` | Validates coronal CT superiority over panoramic radiographs ... | Cannot define acceptable postoperative condylar displacement... | `NO EXPLICIT THRESHOLD REPORTED` | Chacon et al. (2003), J O... |
| `CH12-EVD-028` | Oral and Maxill... | `IMAGING OR MEASUREMENT METHOD` | Identifies specific mandibular projections: PA for ramus/bod... | Cannot provide quantitative reduction standards.... | `NO EXPLICIT THRESHOLD REPORTED` | NOT REPORTED IN SOURCE... |
| `ATLAS-CH19-EVD-001` | Atlas of Operat... | `GENERAL CLINICAL CONTEXT` | Quality assurance principle: long-term follow-up is essentia... | Does not define a numerical scoring scale or validated instr... | `NO EXPLICIT THRESHOLD REPORTED` | NOT REPORTED IN SOURCE... |
| `ATLAS-CH19-EVD-002` | Atlas of Operat... | `POSTOPERATIVE OUTCOME MEASUREMENT` | Defines biological timeline for bone healing to support mast... | Cannot determine union failure or non-union threshold in non... | `About 1 month (longer for comm` | NOT REPORTED IN SOURCE... |
| `ATLAS-CH19-EVD-003` | Atlas of Operat... | `COMPLICATION / SAFETY OUTCOME` | Defines manifestation window for enophthalmos (~3 months pos... | Cannot provide a millimeter enophthalmos threshold defining ... | `Noticeable by about 3 months, ` | NOT REPORTED IN SOURCE... |
| `ATLAS-CH19-EVD-004` | Atlas of Operat... | `COMPLICATION / SAFETY OUTCOME` | Defines recovery timeline for residual diplopia at extremes ... | Does not provide a validated binocular single vision score (... | `Many months to resolve (or not` | NOT REPORTED IN SOURCE... |
| `ATLAS-CH19-EVD-005` | Atlas of Operat... | `COMPLICATION / SAFETY OUTCOME` | Documents variable timeline for internal fixation infection ... | Cannot predict infection rate percentage or hardware removal... | `Days to years (smokers especia` | NOT REPORTED IN SOURCE... |
| `ATLAS-CH19-EVD-006` | Atlas of Operat... | `POSTOPERATIVE OUTCOME MEASUREMENT` | Defines mandatory follow-up window for facial soft tissue in... | Cannot provide a scar rating scale score (e.g., POSAS or VSS... | `18 months or longer` | NOT REPORTED IN SOURCE... |
| `ATLAS-CH19-EVD-007` | Atlas of Operat... | `COMPLICATION / SAFETY OUTCOME` | Defines neurosensory recovery timeline (trigeminal and facia... | Cannot specify sensory recovery threshold (e.g., 2-point dis... | `18 months or longer` | NOT REPORTED IN SOURCE... |
| `ATLAS-CH19-EVD-008` | Atlas of Operat... | `COMPLICATION / SAFETY OUTCOME` | Documents insidious timeline of late sinonasal/lacrimal muco... | Cannot specify mucocele incidence rate or prophylactic inter... | `Several (or more) years; life-` | NOT REPORTED IN SOURCE... |
| `ATLAS-CH19-EVD-009` | Atlas of Operat... | `COMPLICATION / SAFETY OUTCOME` | Documents timeline of condylar resorption and avascular necr... | Cannot specify millimeter condylar height loss or joint spac... | `Years to become clinically app` | NOT REPORTED IN SOURCE... |
| `ATLAS-CH19-EVD-010` | Atlas of Operat... | `GENERAL CLINICAL CONTEXT` | Postoperative safety precaution: refraining from nose blowin... | Cannot evaluate fracture stability or treatment outcome.... | `3 to 6 weeks` | NOT REPORTED IN SOURCE... |
| `ATLAS-CH19-EVD-011` | Atlas of Operat... | `IMAGING OR MEASUREMENT METHOD` | Identifies CT as modality of choice to visualize deeper repa... | Cannot provide an objective reduction grading scale.... | `NO EXPLICIT THRESHOLD REPORTED` | NOT REPORTED IN SOURCE... |
| `ATLAS-CH19-EVD-012` | Atlas of Operat... | `DIRECT TREATMENT-OUTCOME EVIDENCE` | Establishes biological limit of elastic IMF for occlusal fin... | Cannot provide a millimeter occlusal discrepancy threshold d... | `Up to 4 weeks (fractures firm ` | Adeyemo, Ogunlewe, Ladein... |
| `ATLAS-CH19-EVD-013` | Atlas of Operat... | `POSTOPERATIVE OUTCOME MEASUREMENT` | Establishes multi-component occlusal outcome definition: den... | Cannot define quantitative occlusal contact force or millime... | `NO EXPLICIT THRESHOLD REPORTED` | NOT REPORTED IN SOURCE... |
| `ATLAS-CH19-EVD-014` | Atlas of Operat... | `POSTOPERATIVE OUTCOME MEASUREMENT` | Establishes postoperative diet protocol: 4 to 6 weeks of sof... | Cannot evaluate bite force or masticatory efficiency quantit... | `4 to 6 weeks soft diet` | NOT REPORTED IN SOURCE... |
| `ATLAS-CH19-EVD-015` | Atlas of Operat... | `DIRECT TREATMENT-OUTCOME EVIDENCE` | Establishes long-term hardware outcome standard: routine rem... | Cannot define a biomarker or quantitative threshold for tita... | `Remove only for significant co` | Jorgenson et al. (1997); ... |
| `ATLAS-CH19-EVD-016` | Atlas of Operat... | `POSTOPERATIVE OUTCOME MEASUREMENT` | Ocular motility rehabilitation protocol: eye exercises encou... | Cannot provide a binocular visual field degree threshold.... | `NO EXPLICIT THRESHOLD REPORTED` | NOT REPORTED IN SOURCE... |
| `ATLAS-CH19-EVD-017` | Atlas of Operat... | `POSTOPERATIVE OUTCOME MEASUREMENT` | Mandibular functional outcome definition: dynamic active ran... | Cannot provide an explicit interincisal opening cutoff (mm) ... | `NO EXPLICIT THRESHOLD REPORTED` | NOT REPORTED IN SOURCE... |
| `ATLAS-CH19-EVD-018` | Atlas of Operat... | `COMPLICATION / SAFETY OUTCOME` | Identifies iatrogenic/access complication: lower eyelid cica... | Cannot provide a millimeter scleral show measurement thresho... | `NO EXPLICIT THRESHOLD REPORTED` | NOT REPORTED IN SOURCE... |
| `ATLAS-CH19-EVD-019` | Atlas of Operat... | `GENERAL CLINICAL CONTEXT` | Critique of follow-up methodology: routine calendar follow-u... | Does not provide a standardized follow-up protocol schedule.... | `NO EXPLICIT THRESHOLD REPORTED` | NOT REPORTED IN SOURCE... |
| `ATLAS-CH19-EVD-020` | Atlas of Operat... | `COMPLICATION / SAFETY OUTCOME` | Documents late dental devitalization and crown discoloration... | Cannot specify root proximity distance threshold (mm) for sa... | `NO EXPLICIT THRESHOLD REPORTED` | NOT REPORTED IN SOURCE... |

## 4. Synthesis by Outcome Domain

### A. Skeletal Alignment & Facial Symmetry (Midface, Orbit, Mandible)
- **Useful Grounding:** `CH12-EVD-001`, `002`, `007`, `011`, `018`, `019`, `022`, `023`, `024`, `028`.
- **Capabilities:** Establishes the 3 vertical and 3 horizontal buttresses as the definitive reference planes for 3D multiplanar CT symmetry assessment (Delbalso 'Symmetry' principle against contralateral uninjured anatomy). Confirms multiplanar CT (axial, coronal, sagittal <=3 mm slices) as the necessary standard.
- **Critical Gaps:** Neither chapter provides a quantitative millimeter tolerance (e.g., <=2 mm vs >2 mm step-off) or rotational degree threshold that defines 'successful' skeletal reduction.

### B. Masticatory & Occlusal Function (Mandible & Midface)
- **Useful Grounding:** `CH12-EVD-027`, `ATLAS-CH19-EVD-002`, `012`, `013`, `014`, `017`.
- **Capabilities:** Establishes that occlusal evaluation requires **dynamic dental group function and patient perception of their bite**, rather than static intercuspation (`ATLAS-CH19-EVD-013`). Demonstrates that mandibular rehabilitation requires **dynamic active range of motion** (vertical opening, lateral excursion) (`ATLAS-CH19-EVD-017`). Confirms bone consolidation reaches functional loading tolerance at **~1 month**, with soft diet maintained for **4 to 6 weeks** (`ATLAS-CH19-EVD-002`, `014`). Establishes that elastic IMF can fine-tune occlusion up to **4 weeks**, but cannot rescue an inadequate reduction (`ATLAS-CH19-EVD-012`).
- **Critical Gaps:** Neither text specifies a numerical maximum interincisal opening (MIO in mm) cutoff or quantitative occlusal contact score.

### C. Ophthalmic Outcomes (Orbital Blowout, ZMC, NOE)
- **Useful Grounding:** `CH12-EVD-017`, `018`, `ATLAS-CH19-EVD-003`, `004`, `016`, `018`.
- **Capabilities:** Proves orbital wall rupture and fat herniation via CT fat attenuation cutoff (**`< -10 HU`** in maxillary/ethmoid sinus). Identifies coronal reformats for floor defect width and sagittal reformats for AP extent (`CH12-EVD-017`, `018`). Establishes clinical onset of enophthalmos at **~3 months** (`ATLAS-CH19-EVD-003`), recovery window of residual diplopia as **many months** (`ATLAS-CH19-EVD-004`), and identifies cicatricial ectropion as a key access complication (`ATLAS-CH19-EVD-018`).
- **Critical Gaps:** No quantitative Hertel exophthalmometry cutoff (e.g., >2 mm discrepancy) or binocular visual field degree measurement is defined.

### D. Soft Tissue & Neurosensory Outcomes
- **Useful Grounding:** `ATLAS-CH19-EVD-006`, `007`.
- **Capabilities:** Mandates an **18-month or longer** follow-up threshold before assessing permanent scar results or nerve recovery (`ATLAS-CH19-EVD-006`, `007`).
- **Critical Gaps:** No quantitative scar score (e.g., POSAS) or 2-point sensory discrimination measurement is provided.

### E. Hardware, Infection & Late Complications
- **Useful Grounding:** `ATLAS-CH19-EVD-005`, `008`, `009`, `015`, `020`.
- **Capabilities:** Establishes that hardware infection and plate removal should be managed on a symptom/complication-driven basis rather than routine secondary surgery (`ATLAS-CH19-EVD-015`). Identifies late condylar resorption, frontal mucoceles, and dental devitalization as late outcomes requiring multi-year follow-up (`ATLAS-CH19-EVD-008`, `009`, `020`).

## 5. Audit Flags & Verification Scope
- **Word Count Constraints:** All 48 quotations verified at <= 25 words.
- **Page & PDF Index Alignment:** 100% verified across both source PDFs in PyMuPDF.
- **Threshold Verification:** All quantitative values audited back to primary text and cited literature.
- **Uncertain / Flagged Records:** 0 records require manual review. All 48 items have verified source provenance.
