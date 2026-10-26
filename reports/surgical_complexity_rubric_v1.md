# Candidate Surgical Complexity Rubric Specification (Version 1.0)

## ADRAB Project: Maxillofacial Surgical Complexity Assessment Framework

**Specification Version:** `SURGICAL-COMPLEXITY-v1.0`  
**Date of Specification:** 2026-10-20  
**Target Domain:** Technical Extent and Procedural Complexity of Maxillofacial Trauma Surgery  
**Clinical Status:** **CANDIDATE SPECIFICATION PENDING MULTIDISCIPLINARY SURGEON CONSENSUS VALIDATION**  
**Evidence Grounding:** Fonseca et al. (4th Ed, Ch. 12), Perry & Holmes Atlas (Ch. 19), and Clinical Research Batch 01 (PAP-001 through PAP-014).

---

### 1. Executive Summary & Architectural Scope Boundaries

The ADRAB surgical complexity framework quantifies the **operative difficulty, anatomical burden, technical extent, and procedural resource demands** of maxillofacial trauma surgery. 

#### Foundational Guardrails & Principles:
1. **Decoupled from Postoperative Outcomes:** A complex multi-hour reconstruction resulting in a perfect anatomical and functional recovery remains a **high-complexity surgery**. Conversely, an isolated undisplaced fracture treated by simple closed reduction that develops a severe late surgical site infection is an **uncomplicated surgery that experienced an adverse postoperative outcome**. Surgical complexity is never defined by post-treatment success or failure.
2. **Deterministic Rules, Zero Fabricated Scores:** No arbitrary weights (e.g., "$30\%\text{ fracture} + 20\%\text{ hardware}$") or letter grades are invented. Unvalidated composite formulas are strictly prohibited until multi-center surgeon consensus panels establish psychometric or clinical validity.
3. **No Inference of Normalcy from Missing Data:** Unrecorded values (such as operative duration or hardware counts) are explicitly flagged as `INSUFFICIENT_DATA` or `MISSING_INPUT` with uncertainty boundaries, never silently assigned zero.
4. **Anti-Double-Counting Architecture:** The 9 criteria explicitly isolate independent operational constructs to prevent compounding the same underlying clinical feature across multiple scoring dimensions.

---

### 2. Candidate Criteria Specification Overview

The rubric comprises 9 surgeon-reviewable criteria:

| Criterion ID | Criterion Title | Target Construct | Primary Input Source | Surgeon Validation Status |
| :--- | :--- | :--- | :--- | :--- |
| **COMPLEX-CRIT-01** | Fracture Number & Severity | Skeletal disruption & comminution | Preop Multiplanar CT | PENDING SURGEON VALIDATION |
| **COMPLEX-CRIT-02** | Anatomical Regions & Bones | Compartments & osseous units operated | Operative Report | PENDING SURGEON VALIDATION |
| **COMPLEX-CRIT-03** | Reduction & Reconstruction | Difficulty of fragment re-approximation | Operative Narrative | PENDING SURGEON VALIDATION |
| **COMPLEX-CRIT-04** | Procedures Executed | Inventory of operative interventions | Operative Record | PENDING SURGEON VALIDATION |
| **COMPLEX-CRIT-05** | Fixation Hardware Burden | Plates, screws, meshes, PSI counts | Implant Log / Radiographs | PENDING SURGEON VALIDATION |
| **COMPLEX-CRIT-06** | Soft-Tissue & Associated Injury | Concomitant lacerations, nerves, C-spine | Trauma Registry / Chart | PENDING SURGEON VALIDATION |
| **COMPLEX-CRIT-07** | Surgical Approaches & Staging | Incisions, exposure planes, stages | Operative Record | PENDING SURGEON VALIDATION |
| **COMPLEX-CRIT-08** | Operative Duration & Blood Loss | Physiological and resource stress | Anesthesia Record | PENDING SURGEON VALIDATION |
| **COMPLEX-CRIT-09** | Intraoperative Complications | Acute unexpected intraop crises | Operative & Anesthesia Logs | PENDING SURGEON VALIDATION |

---

### 3. Detailed Criteria Specifications

#### Criterion COMPLEX-CRIT-01: Fracture Number and Documented Severity
- **Operational Definition:** Preoperative count and morphological classification of osseous fractures across anatomical sites.
- **Required Inputs:** `fracture_locations` (array of subsites), `documented_severity` (enum: `NON_DISPLACED_SIMPLE`, `DISPLACED_NON_COMMINUTED`, `COMMINUTED_SEGMENTAL`, `HIGH_ENERGY_CRUSH_BONE_LOSS`, `DEFECT_OR_AVULSION`), `bilateral_injury` (boolean), `panfacial_involvement` (boolean).
- **Source Grounding:** Fonseca et al. Ch. 12 (pp. 232–247; multi-buttress collapse, comminution); Mittermiller et al. (2019, PAP-014; Level 2 location vs Level 3 displacement inter-rater reliability).
- **Scoring Proposal (Candidate Profile):**
  - *Tier 1 (Mild):* Single isolated non-displaced fracture.
  - *Tier 2 (Moderate):* 1–2 displaced non-comminuted fractures.
  - *Tier 3 (Severe):* Multiple comminuted fractures or bilateral midface/panfacial disruption.
  - *Status:* `PENDING SURGEON VALIDATION`.
- **Clinical Rationale:** Comminution and multi-buttress loss exponentially diminish native bone reference points, requiring complex spatial re-alignment.
- **Uncertainty & Limitations:** Mittermiller et al. proved that fracture morphology/displacement variables exhibit lower inter-rater agreement ($\kappa = 0.59$) than anatomical location ($\kappa = 0.69$).
- **Double-Counting Safeguard:** Evaluates pre-injury skeletal damage only. Does not count how many bones were surgically opened (which is measured in Criterion 2).

#### Criterion COMPLEX-CRIT-02: Number of Anatomical Regions and Bones Operated On
- **Operational Definition:** Direct quantification of distinct anatomical craniofacial compartments and individual osseous units exposed and surgically treated.
- **Required Inputs:** `anatomical_regions_operated` (Upper Face, Orbit, Midface, Lower Face), `bones_operated` (Frontal, Nasal/Ethmoid, Zygoma, Maxilla, Palatine/Sphenoid, Mandible).
- **Source Grounding:** Fonseca Ch. 12 (pp. 232–235; multi-pillar load transfer); Perry & Holmes Atlas Ch. 19 (p. 805; panfacial skeletal repair sequencing).
- **Scoring Proposal (Candidate Profile):**
  - *Monostotic / Single Compartment:* 1 region, 1 bone.
  - *Oligostotic / Bi-compartment:* 2 regions or 2–3 bones.
  - *Polystotic / Multi-compartment:* $\ge 3$ regions or $\ge 4$ bones.
  - *Status:* `PENDING SURGEON VALIDATION`.
- **Clinical Rationale:** Multi-compartmental surgery requires separate repositioning vectors, continuous re-verification of occlusal/spatial relationships, and wider exposure.
- **Double-Counting Safeguard:** Distinct from fracture location; records only what was actually operated on. Unoperated or conservatively observed fractures are excluded.

#### Criterion COMPLEX-CRIT-03: Reconstruction and Reduction Complexity
- **Operational Definition:** The technical difficulty of anatomical fragment re-approximation: closed traction/IMF only, simple direct anatomic reduction, multi-axial traction against displacement vectors, complex comminuted mosaic puzzle reassembly, or computer-assisted navigation/PSI.
- **Required Inputs:** `reduction_complexity` (enum), `occlusal_derangement_preop` (enum).
- **Source Grounding:** Fonseca Ch. 12 (pp. 240–244; Le Fort disjunctions and buttress comminution); Bly et al. (2013, PAP-005; computer-assisted navigation in complex multi-vector defects).
- **Scoring Proposal (Candidate Profile):**
  - *Ordinal Complexity Tier:* Closed/Minimal (Level 1), Open Anatomic (Level 2), Multi-axial Difficult (Level 3), Comminuted Puzzle/Navigation (Level 4).
  - *Status:* `PENDING SURGEON VALIDATION`.
- **Clinical Rationale:** Severely displaced fragments with muscle distraction (e.g. masseter/pterygoid pull on angle/condyle or craniofacial telescoping) require high physical effort and precision reduction.
- **Double-Counting Safeguard:** Evaluates the reduction maneuver itself, not the number of plates applied (Criterion 5) or approach used (Criterion 7).

#### Criterion COMPLEX-CRIT-04: Procedures Performed
- **Operational Definition:** The specific inventory of operative procedures executed during surgery: ORIF, internal orbital mesh reconstruction, patient-specific implant (PSI), autologous bone grafting, alloplastic grafting, frontal sinus cranialization/obliteration, medial/lateral canthopexy, tracheostomy.
- **Required Inputs:** `procedures_performed` (array of enums).
- **Source Grounding:** Perry & Holmes Atlas Ch. 19 (pp. 808–811; orbital reconstruction and secondary revision); Whitehouse (1994, PAP-003); Zhang (2012, PAP-004; posterior ledge defect).
- **Scoring Proposal (Candidate Profile):**
  - Multi-procedure inventory profile. High-complexity flags for cranialization, autologous donor site harvest, and posterior orbital wall repair.
  - *Status:* `PENDING SURGEON VALIDATION`.
- **Clinical Rationale:** Procedures involving skull base, orbital apex, or autologous tissue harvesting add distinct surgical phases, anatomical risk, and technical demands.
- **Double-Counting Safeguard:** Captures the nature of the interventions; hardware counts used within these procedures are recorded in Criterion 5.

#### Criterion COMPLEX-CRIT-05: Fixation Hardware Requirements
- **Operational Definition:** Quantitative count and structural specification of osteosynthesis hardware installed: plates, screws, orbital meshes, reconstruction plates (2.4/2.7 mm load-bearing), and custom PSIs, with documented anatomical fixation sites.
- **Required Inputs:** `hardware_documented` (boolean), `plate_count` (int/null), `screw_count` (int/null), `mesh_implant_count` (int/null), `reconstruction_plate_used` (boolean), `custom_patient_specific_implant_used` (boolean), `fixation_sites` (array).
- **Source Grounding:** Kroon et al. (1991, PAP-009; biomechanical load sharing vs bearing); Nagase et al. (2005, PAP-010; multi-site plate placement); Mosbah (2003, PAP-011).
- **Scoring Proposal (Candidate Profile):**
  - *Hardware Burden Profile:* Low (<2 plates, <8 screws), Moderate (2–4 plates, 8–16 screws), High (>4 plates, >16 screws, or heavy load-bearing reconstruction bar).
  - *Status:* `PENDING SURGEON VALIDATION`.
- **Clinical Rationale:** Heavy load-bearing reconstruction plates (mandibular continuity defects) and multi-plate buttress fixation indicate high biomechanical instability and surgical labor.
- **Double-Counting Safeguard:** Quantifies mechanical implants placed, independent of the surgical approach used to place them (Criterion 7). Missing hardware logs must NOT be assumed zero.

#### Criterion COMPLEX-CRIT-06: Soft-Tissue Repair and Associated Injuries
- **Operational Definition:** Concomitant soft-tissue destruction (degloving, avulsion, complex lacerations), specialized anatomical structures repaired (facial nerve branches, parotid duct, lacrimal system, medial canthus), and systemic trauma (C-spine, TBI, vascular).
- **Required Inputs:** `extensive_facial_lacerations_or_degloving` (bool), `primary_nerve_repair_or_decompression` (bool), `lacrimal_system_repair_or_intubation` (bool), `concomitant_cervical_spine_injury` (bool), `concomitant_traumatic_brain_injury` (bool), `concomitant_vascular_injury` (bool).
- **Source Grounding:** Fonseca Ch. 12 (pp. 234–237; C-spine Denis 3-column instability, CTA head/neck vascular trauma); Perry & Holmes Atlas Ch. 19 (pp. 805, 815; soft tissue handling).
- **Scoring Proposal (Candidate Profile):**
  - *Categorical Co-injury Profile:* Isolated skeletal vs Skeletal + Complex soft tissue/neurovascular/cervical spine involvement.
  - *Status:* `PENDING SURGEON VALIDATION`.
- **Clinical Rationale:** Operating in the presence of unstable cervical spine requires rigid in-line stabilization, avoiding neck extension, and carefully coordinating with neurosurgery/trauma teams.
- **Double-Counting Safeguard:** Measures non-osseous and systemic surgical modifiers, strictly separate from skeletal fracture count (Criterion 1).

#### Criterion COMPLEX-CRIT-07: Surgical Approaches and Staged Procedures
- **Operational Definition:** The anatomical incisions and exposures utilized (coronal/bicoronal, transconjunctival, subciliary, intraoral vestibular, submandibular, retromandibular, preauricular) and whether the operative plan required staged sequential surgeries.
- **Required Inputs:** `surgical_approaches` (array of enums), `staged_procedure` (object: `is_staged`, `stage_number`, `total_planned_stages`).
- **Source Grounding:** Perry & Holmes Atlas Ch. 19 (p. 805; extended approaches, coronal flap elevation, staged panfacial reconstruction); Fonseca Ch. 12 (pp. 240–244).
- **Scoring Proposal (Candidate Profile):**
  - *Approach Invasiveness & Staging Profile:* Single local/intraoral approach vs Multiple combined extended approaches (e.g. coronal + transconjunctival + intraoral) + Staging.
  - *Status:* `PENDING SURGEON VALIDATION`.
- **Clinical Rationale:** Coronal flaps and combined transfacial incisions multiply exposure time, blood loss risk, and require precise dissection planes to protect the facial nerve and supraorbital vessels.
- **Double-Counting Safeguard:** Scores the exposure and staging, independent of how many fractures were reduced through that exposure.

#### Criterion COMPLEX-CRIT-08: Operative Duration and Blood Loss
- **Operational Definition:** Total operative duration in minutes, estimated blood loss (EBL in mL), and transfusion requirements. Analyzed as objective surrogates of physiological stress and operative intensity.
- **Required Inputs:** `operative_duration_minutes` (number/null), `estimated_blood_loss_ml` (number/null), `blood_transfusion_units` (number/null).
- **Source Grounding:** Fonseca Ch. 12 (pp. 236–237; vascular injuries); Perry & Holmes Atlas Ch. 19 (pp. 805–808; physiological impact of prolonged trauma surgery).
- **Scoring Proposal (Candidate Profile):**
  - *Continuous Parameter Reporting with Uncertainty Bounds:* Duration (<120 min, 120–240 min, >240 min); EBL (<250 mL, 250–750 mL, >750 mL).
  - *Status:* `PENDING SURGEON VALIDATION`.
- **Clinical Rationale:** Prolonged surgery (>4–6 hours) and significant blood loss reflect extensive anatomical dissection, difficult reduction, or severe hemorrhage control.
- **Double-Counting Safeguard:** Reflects overall case resource utilization and physiological stress, not a duplicate of fracture count. Missing records are marked `UNRECORDED_INSUFFICIENT_DATA`.

#### Criterion COMPLEX-CRIT-09: Documented Intraoperative Complications and Additional Interventions
- **Operational Definition:** Acute adverse events occurring during surgery (severe internal maxillary or ethmoidal hemorrhage, dural tear with CSF leak, retrobulbar hematoma/tension, instrument breakage) and unplanned additional procedures necessitated.
- **Required Inputs:** `intraoperative_complications` (array of enums), `unplanned_additional_interventions` (array of strings).
- **Source Grounding:** Perry & Holmes Atlas Ch. 19 (pp. 805–809; acute orbital/dural emergencies); Fonseca Ch. 12 (pp. 236–241; life-threatening hemorrhage, cribriform plate fracture).
- **Scoring Proposal (Candidate Profile):**
  - *Complication Event Register:* Absent/Uneventful vs Acute intraoperative event requiring immediate unplanned intervention.
  - *Status:* `PENDING SURGEON VALIDATION`.
- **Clinical Rationale:** Intraoperative crises dramatically increase technical complexity, requiring urgent hemostatic packing, dural repair, or emergent lateral canthotomy.
- **Double-Counting Safeguard:** Captures unexpected intraoperative surgical crises; distinct from postoperative late complications (which belong to outcome assessment).

---

### 4. Implementation Guidelines & Next Steps
- The candidate rubric is serialized in `data/surgical_complexity_rubric_v1.csv`.
- The corresponding data interchange schema is defined in `schemas/surgical_complexity_case.schema.json`.
- A panel of certified craniomaxillofacial surgeons must review the proposed tier boundaries and determine whether composite index weights should ever be adopted.
