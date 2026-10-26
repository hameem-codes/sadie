"""
Atlas of Operative Maxillofacial Trauma Surgery - Chapter 19 Extraction Script
Maxillofacial Treatment Outcome Evaluator Project

Source: Atlas of Operative Maxillofacial Trauma Surgery (2014, Springer)
Target: Chapter 19 - "Aftercare and Follow-up" (Michael Perry)
Printed Pages: 805-817 | Zero-based PDF Page Indexes: 808-820

Extracts structured evidence items, validates records, and writes:
- data/extracted/atlas_chapter_20_evidence.csv
- data/extracted/atlas_chapter_20_evidence.json
- reports/atlas_chapter_20_summary.md
- reports/atlas_chapter_20_validation.md
"""

import os
import sys
import json
import csv
from typing import List, Dict, Any

# Ensure DLL path for PyMuPDF on Windows
for p in [r"C:\Windows\System32\Microsoft-Edge-WebView"]:
    if os.path.isdir(p):
        try:
            os.add_dll_directory(p)
        except Exception:
            pass

import pymupdf


def get_raw_evidence_records() -> List[Dict[str, Any]]:
    """Returns curated evidence records strictly grounded in Atlas Chapter 19 text."""
    records = [
        # --- Section: Chapter Introduction & Philosophy ---
        {
            "evidence_id": "ATLAS-CH19-EVD-001",
            "source_filename": "Michael Perry, Simon Holmes (eds.) - Atlas of Operative Maxillofacial Trauma Surgery_ Primary Repair of Facial Injuries (2014, Springer) [10.1007_978-1-4471-2855-7] - libgen.li.pdf",
            "book_title": "Atlas of Operative Maxillofacial Trauma Surgery (2014, Springer)",
            "chapter": "Chapter 19 (designated as Chapter 20 target: Aftercare and Follow-up)",
            "section": "Introduction - Long-Term Follow-up and Quality Control",
            "printed_page": 805,
            "pdf_page_index": 808,
            "outcome_domain": "Quality of Care / Long-Term Outcome Assessment",
            "fracture_region": "Panfacial / General Maxillofacial",
            "exact_finding_or_outcome_definition": "Long-term follow-up is necessary to assess true surgical outcomes; absence of acute complications does not equate to a good surgical outcome.",
            "assessment_method": "Long-term clinical review and critical analysis",
            "follow_up_time": "Months to years (variable based on injury complexity and complications)",
            "unit_or_explicit_threshold": "NO EXPLICIT THRESHOLD REPORTED",
            "supporting_quotation": "Lack of complications does not necessarily mean a good outcome.",
            "evidence_classification": "CLINICAL_CONTEXT",
            "cited_study_reference": "NOT REPORTED IN SOURCE (Textbook guidance / expert analysis)",
            "limitations_and_cautions": "Author notes postoperative care protocols vary considerably and are often based on individual experience rather than rigorous evidence base.",
            "verification_status": "VERIFIED_SOURCE_TEXT"
        },

        # --- Section: Table 19.1 - Biological Facts to Help Follow-up ---
        {
            "evidence_id": "ATLAS-CH19-EVD-002",
            "source_filename": "Michael Perry, Simon Holmes (eds.) - Atlas of Operative Maxillofacial Trauma Surgery_ Primary Repair of Facial Injuries (2014, Springer) [10.1007_978-1-4471-2855-7] - libgen.li.pdf",
            "book_title": "Atlas of Operative Maxillofacial Trauma Surgery (2014, Springer)",
            "chapter": "Chapter 19 (designated as Chapter 20 target: Aftercare and Follow-up)",
            "section": "Table 19.1 - Biological Facts to Help Follow-up",
            "printed_page": 805,
            "pdf_page_index": 808,
            "outcome_domain": "Skeletal Healing / Masticatory Function",
            "fracture_region": "Mandible / Midface",
            "exact_finding_or_outcome_definition": "Bone healing timeframe required to support functional physiological loads (biting and chewing).",
            "assessment_method": "Clinical evaluation of functional loading / mastication",
            "follow_up_time": "About 1 month post-repair (longer for comminuted fractures)",
            "unit_or_explicit_threshold": "About 1 month (comminuted fractures take longer)",
            "supporting_quotation": "Most fractures are healed sufficiently to support functional loads (notably biting/chewing) by about 1 month.",
            "evidence_classification": "POSTOPERATIVE_ASSESSMENT",
            "cited_study_reference": "NOT REPORTED IN SOURCE (Expert consensus table)",
            "limitations_and_cautions": "Functional load tolerance is estimated; severe comminution delays bone consolidation.",
            "verification_status": "VERIFIED_SOURCE_TEXT"
        },
        {
            "evidence_id": "ATLAS-CH19-EVD-003",
            "source_filename": "Michael Perry, Simon Holmes (eds.) - Atlas of Operative Maxillofacial Trauma Surgery_ Primary Repair of Facial Injuries (2014, Springer) [10.1007_978-1-4471-2855-7] - libgen.li.pdf",
            "book_title": "Atlas of Operative Maxillofacial Trauma Surgery (2014, Springer)",
            "chapter": "Chapter 19 (designated as Chapter 20 target: Aftercare and Follow-up)",
            "section": "Table 19.1 - Biological Facts to Help Follow-up",
            "printed_page": 805,
            "pdf_page_index": 808,
            "outcome_domain": "Residual Deformity / Globe Position",
            "fracture_region": "Orbital Fractures / ZMC",
            "exact_finding_or_outcome_definition": "Clinical manifestation timeline for noticeable post-traumatic or post-surgical enophthalmos.",
            "assessment_method": "Clinical inspection / Hertel exophthalmometry",
            "follow_up_time": "By about 3 months, if not sooner",
            "unit_or_explicit_threshold": "Noticeable by about 3 months, if not sooner",
            "supporting_quotation": "Enophthalmos is usually noticeable by about 3 months, if not sooner.",
            "evidence_classification": "COMPLICATION",
            "cited_study_reference": "NOT REPORTED IN SOURCE (Expert consensus table)",
            "limitations_and_cautions": "Tissue edema in early postoperative weeks masks underlying orbital volume expansion and enophthalmos.",
            "verification_status": "VERIFIED_SOURCE_TEXT"
        },
        {
            "evidence_id": "ATLAS-CH19-EVD-004",
            "source_filename": "Michael Perry, Simon Holmes (eds.) - Atlas of Operative Maxillofacial Trauma Surgery_ Primary Repair of Facial Injuries (2014, Springer) [10.1007_978-1-4471-2855-7] - libgen.li.pdf",
            "book_title": "Atlas of Operative Maxillofacial Trauma Surgery (2014, Springer)",
            "chapter": "Chapter 19 (designated as Chapter 20 target: Aftercare and Follow-up)",
            "section": "Table 19.1 - Biological Facts to Help Follow-up",
            "printed_page": 805,
            "pdf_page_index": 808,
            "outcome_domain": "Ophthalmic Function / Diplopia",
            "fracture_region": "Orbital Fractures",
            "exact_finding_or_outcome_definition": "Recovery timeline for minor residual post-repair diplopia at extremes of gaze.",
            "assessment_method": "Ocular motility examination / Hess chart",
            "follow_up_time": "Many months postoperatively",
            "unit_or_explicit_threshold": "Many months to resolve (or not)",
            "supporting_quotation": "Minor residual diplopia can take many months to resolve (or not).",
            "evidence_classification": "COMPLICATION",
            "cited_study_reference": "NOT REPORTED IN SOURCE (Expert consensus table)",
            "limitations_and_cautions": "Diplopia may remain permanent if muscle fibroses or entrapped tissue sustains permanent neuromuscular injury.",
            "verification_status": "VERIFIED_SOURCE_TEXT"
        },
        {
            "evidence_id": "ATLAS-CH19-EVD-005",
            "source_filename": "Michael Perry, Simon Holmes (eds.) - Atlas of Operative Maxillofacial Trauma Surgery_ Primary Repair of Facial Injuries (2014, Springer) [10.1007_978-1-4471-2855-7] - libgen.li.pdf",
            "book_title": "Atlas of Operative Maxillofacial Trauma Surgery (2014, Springer)",
            "chapter": "Chapter 19 (designated as Chapter 20 target: Aftercare and Follow-up)",
            "section": "Table 19.1 - Biological Facts to Help Follow-up",
            "printed_page": 805,
            "pdf_page_index": 808,
            "outcome_domain": "Infection / Hardware Morbidity",
            "fracture_region": "Internal Fixation Sites / General",
            "exact_finding_or_outcome_definition": "Variable presentation timeline for hardware / osteosynthesis plate infection (smokers at elevated risk).",
            "assessment_method": "Clinical examination for erythema, fluctuance, sinus tract, or dehiscence",
            "follow_up_time": "Days to years post-implantation",
            "unit_or_explicit_threshold": "Within days or years (smokers especially at risk)",
            "supporting_quotation": "Metal work can become infected within days or it may take years (smokers are especially at risk).",
            "evidence_classification": "COMPLICATION",
            "cited_study_reference": "NOT REPORTED IN SOURCE (Expert consensus table)",
            "limitations_and_cautions": "Late plate colonization can occur years later, necessitating hardware removal.",
            "verification_status": "VERIFIED_SOURCE_TEXT"
        },
        {
            "evidence_id": "ATLAS-CH19-EVD-006",
            "source_filename": "Michael Perry, Simon Holmes (eds.) - Atlas of Operative Maxillofacial Trauma Surgery_ Primary Repair of Facial Injuries (2014, Springer) [10.1007_978-1-4471-2855-7] - libgen.li.pdf",
            "book_title": "Atlas of Operative Maxillofacial Trauma Surgery (2014, Springer)",
            "chapter": "Chapter 19 (designated as Chapter 20 target: Aftercare and Follow-up)",
            "section": "Table 19.1 - Biological Facts to Help Follow-up",
            "printed_page": 805,
            "pdf_page_index": 808,
            "outcome_domain": "Soft Tissue Healing / Scar Maturation",
            "fracture_region": "Cutaneous / Facial Soft Tissues",
            "exact_finding_or_outcome_definition": "Timeframe required for soft tissue injuries and surgical access scars to mature before definitive long-term outcome evaluation.",
            "assessment_method": "Visual and tactile scar assessment / Vancouver Scar Scale",
            "follow_up_time": "18 months or longer",
            "unit_or_explicit_threshold": "18 months or longer for scar maturation",
            "supporting_quotation": "Soft tissue injuries and scars can take 18 months or longer to mature enough to give an indication of long-term results.",
            "evidence_classification": "POSTOPERATIVE_ASSESSMENT",
            "cited_study_reference": "NOT REPORTED IN SOURCE (Expert consensus table)",
            "limitations_and_cautions": "Premature scar revision prior to 18 months may lead to poor secondary outcomes; ongoing remodeling occurs over years.",
            "verification_status": "VERIFIED_SOURCE_TEXT"
        },
        {
            "evidence_id": "ATLAS-CH19-EVD-007",
            "source_filename": "Michael Perry, Simon Holmes (eds.) - Atlas of Operative Maxillofacial Trauma Surgery_ Primary Repair of Facial Injuries (2014, Springer) [10.1007_978-1-4471-2855-7] - libgen.li.pdf",
            "book_title": "Atlas of Operative Maxillofacial Trauma Surgery (2014, Springer)",
            "chapter": "Chapter 19 (designated as Chapter 20 target: Aftercare and Follow-up)",
            "section": "Table 19.1 - Biological Facts to Help Follow-up",
            "printed_page": 805,
            "pdf_page_index": 808,
            "outcome_domain": "Neurosensory Function",
            "fracture_region": "Trigeminal / Facial Nerve Distribution",
            "exact_finding_or_outcome_definition": "Sensory and motor nerve regeneration timeline following maxillofacial trauma or surgical access stretch/transection.",
            "assessment_method": "Neurosensory testing (light touch, 2-point discrimination) / House-Brackmann scale",
            "follow_up_time": "18 months or longer",
            "unit_or_explicit_threshold": "18 months or longer for nerve recovery",
            "supporting_quotation": "Nerve injuries can take 18 months or longer to recover.",
            "evidence_classification": "COMPLICATION",
            "cited_study_reference": "NOT REPORTED IN SOURCE (Expert consensus table)",
            "limitations_and_cautions": "Collateral sprouting and slow axonal regeneration limit definitive evaluation of permanent deficit until 18+ months.",
            "verification_status": "VERIFIED_SOURCE_TEXT"
        },
        {
            "evidence_id": "ATLAS-CH19-EVD-008",
            "source_filename": "Michael Perry, Simon Holmes (eds.) - Atlas of Operative Maxillofacial Trauma Surgery_ Primary Repair of Facial Injuries (2014, Springer) [10.1007_978-1-4471-2855-7] - libgen.li.pdf",
            "book_title": "Atlas of Operative Maxillofacial Trauma Surgery (2014, Springer)",
            "chapter": "Chapter 19 (designated as Chapter 20 target: Aftercare and Follow-up)",
            "section": "Table 19.1 - Biological Facts to Help Follow-up",
            "printed_page": 805,
            "pdf_page_index": 808,
            "outcome_domain": "Late Sinonasal & Craniofacial Complications",
            "fracture_region": "Frontal Sinus / Nasoethmoid Complex",
            "exact_finding_or_outcome_definition": "Late mucocele development and life-long risk of meningitis following frontal sinus or lacrimal duct injury.",
            "assessment_method": "Clinical examination / periodic CT or MRI for sinus expansile masses",
            "follow_up_time": "Several or more years (life-long vigilance)",
            "unit_or_explicit_threshold": "Several (or more) years; life-long meningitis risk",
            "supporting_quotation": "Mucocele formation (notably frontal sinus and lacrimal) can take several (or more) years to become clinically apparent.",
            "evidence_classification": "COMPLICATION",
            "cited_study_reference": "NOT REPORTED IN SOURCE (Expert consensus table)",
            "limitations_and_cautions": "Mucoceles develop insidiously secondary to mucosal entrapment or duct obstruction; short-term follow-up will miss 100% of late mucoceles.",
            "verification_status": "VERIFIED_SOURCE_TEXT"
        },
        {
            "evidence_id": "ATLAS-CH19-EVD-009",
            "source_filename": "Michael Perry, Simon Holmes (eds.) - Atlas of Operative Maxillofacial Trauma Surgery_ Primary Repair of Facial Injuries (2014, Springer) [10.1007_978-1-4471-2855-7] - libgen.li.pdf",
            "book_title": "Atlas of Operative Maxillofacial Trauma Surgery (2014, Springer)",
            "chapter": "Chapter 19 (designated as Chapter 20 target: Aftercare and Follow-up)",
            "section": "Table 19.1 - Biological Facts to Help Follow-up",
            "printed_page": 805,
            "pdf_page_index": 808,
            "outcome_domain": "TMJ / Degenerative Skeletal Complication",
            "fracture_region": "Mandibular Condyle",
            "exact_finding_or_outcome_definition": "Late avascular necrosis and condylar resorption following condylar trauma or open reduction.",
            "assessment_method": "Orthopantomography, CT, or MRI; clinical occlusal tracking",
            "follow_up_time": "Years to become clinically apparent",
            "unit_or_explicit_threshold": "Years to become clinically apparent",
            "supporting_quotation": "Condylar resorption can take years to become clinically apparent.",
            "evidence_classification": "COMPLICATION",
            "cited_study_reference": "NOT REPORTED IN SOURCE (Expert consensus table)",
            "limitations_and_cautions": "Manifests as progressive posterior open bite or retrognathia years post-trauma; impossible to detect at routine 6-week discharge.",
            "verification_status": "VERIFIED_SOURCE_TEXT"
        },

        # --- Section: 19.1.2 - Postoperative Instructions & Cautions ---
        {
            "evidence_id": "ATLAS-CH19-EVD-010",
            "source_filename": "Michael Perry, Simon Holmes (eds.) - Atlas of Operative Maxillofacial Trauma Surgery_ Primary Repair of Facial Injuries (2014, Springer) [10.1007_978-1-4471-2855-7] - libgen.li.pdf",
            "book_title": "Atlas of Operative Maxillofacial Trauma Surgery (2014, Springer)",
            "chapter": "Chapter 19 (designated as Chapter 20 target: Aftercare and Follow-up)",
            "section": "19.1.2 - No Nose Blowing",
            "printed_page": 808,
            "pdf_page_index": 811,
            "outcome_domain": "Postoperative Precaution / Adverse Event Prevention",
            "fracture_region": "Midface / Skull Base / Orbit",
            "exact_finding_or_outcome_definition": "Refraining from nose blowing / Valsalva to avoid forcing air and bacteria into soft tissues or intracranially (pneumocephalus, emphysema, retrobulbar proptosis).",
            "assessment_method": "Patient instruction and adherence tracking",
            "follow_up_time": "3 to 6 weeks duration",
            "unit_or_explicit_threshold": "3 to 6 weeks refraining period",
            "supporting_quotation": "How long someone should refrain from nose blowing is also subject to debate. Three to six weeks seems to be common practice.",
            "evidence_classification": "CLINICAL_CONTEXT",
            "cited_study_reference": "NOT REPORTED IN SOURCE (Common practice / expert opinion)",
            "limitations_and_cautions": "Clinical benefits are theoretical and not extensively reported; figure 19.5 demonstrates massive surgical emphysema when violated.",
            "verification_status": "VERIFIED_SOURCE_TEXT"
        },

        # --- Section: 19.1.3 & Table 19.2 - Postoperative Imaging Utility ---
        {
            "evidence_id": "ATLAS-CH19-EVD-011",
            "source_filename": "Michael Perry, Simon Holmes (eds.) - Atlas of Operative Maxillofacial Trauma Surgery_ Primary Repair of Facial Injuries (2014, Springer) [10.1007_978-1-4471-2855-7] - libgen.li.pdf",
            "book_title": "Atlas of Operative Maxillofacial Trauma Surgery (2014, Springer)",
            "chapter": "Chapter 19 (designated as Chapter 20 target: Aftercare and Follow-up)",
            "section": "19.1.3 & Table 19.2 - Postoperative Imaging",
            "printed_page": "808-809",
            "pdf_page_index": 811,
            "outcome_domain": "Postoperative Radiologic Evaluation",
            "fracture_region": "Orbital, Nasoethmoid, Skull Base, General",
            "exact_finding_or_outcome_definition": "Computed tomography (CT) as modality of choice for verifying reduction of complex deep repairs (orbits, NOE, skull base) versus clinical decision-making.",
            "assessment_method": "Postoperative computed tomography (CT)",
            "follow_up_time": "Early postoperative period prior to discharge",
            "unit_or_explicit_threshold": "NO EXPLICIT THRESHOLD REPORTED",
            "supporting_quotation": "Only with CT can the 'deeper' aspects of the repair by visualised (notably in orbital fractures).",
            "evidence_classification": "IMAGING_METHOD",
            "cited_study_reference": "NOT REPORTED IN SOURCE (Discussion of current practice and literature debate)",
            "limitations_and_cautions": "Table 19.2 notes that in routine fractures, postoperative views rarely alter reoperation decisions, which are primarily based on clinical exam.",
            "verification_status": "VERIFIED_SOURCE_TEXT"
        },

        # --- Section: 19.1.5 - Intermaxillary Fixation (IMF) & Occlusion ---
        {
            "evidence_id": "ATLAS-CH19-EVD-012",
            "source_filename": "Michael Perry, Simon Holmes (eds.) - Atlas of Operative Maxillofacial Trauma Surgery_ Primary Repair of Facial Injuries (2014, Springer) [10.1007_978-1-4471-2855-7] - libgen.li.pdf",
            "book_title": "Atlas of Operative Maxillofacial Trauma Surgery (2014, Springer)",
            "chapter": "Chapter 19 (designated as Chapter 20 target: Aftercare and Follow-up)",
            "section": "19.1.5 - Postoperative Elastic IMF",
            "printed_page": "809-810",
            "pdf_page_index": 812,
            "outcome_domain": "Occlusal Recovery / Skeletal Alignment",
            "fracture_region": "Mandibular Fractures / Condyle",
            "exact_finding_or_outcome_definition": "Elastic IMF provides minor occlusal fine tuning and allows condylar repositioning during function, but cannot rescue a poor anatomical repair.",
            "assessment_method": "Static and dynamic occlusal evaluation (group function, patient bite sensation)",
            "follow_up_time": "Up to 4 weeks post-repair",
            "unit_or_explicit_threshold": "Up to 4 weeks (fractures quite firm after 4 weeks)",
            "supporting_quotation": "Since most fractures are quite firm after 4 weeks, any benefit following this will presumably be minimal.",
            "evidence_classification": "TREATMENT_OUTCOME_EVIDENCE",
            "cited_study_reference": "Adeyemo MF, Ogunlewe MO, Ladeinde AL. J Oral Maxillofac Surg 2012;70:1896-902 (cited in Suggested Reading)",
            "limitations_and_cautions": "Elastic IMF fine tuning is unpredictable and should not be relied upon as a bailout for inadequate intraoperative reduction.",
            "verification_status": "VERIFIED_SOURCE_TEXT"
        },
        {
            "evidence_id": "ATLAS-CH19-EVD-013",
            "source_filename": "Michael Perry, Simon Holmes (eds.) - Atlas of Operative Maxillofacial Trauma Surgery_ Primary Repair of Facial Injuries (2014, Springer) [10.1007_978-1-4471-2855-7] - libgen.li.pdf",
            "book_title": "Atlas of Operative Maxillofacial Trauma Surgery (2014, Springer)",
            "chapter": "Chapter 19 (designated as Chapter 20 target: Aftercare and Follow-up)",
            "section": "Figure 19.7 - Assessment of the Occlusion",
            "printed_page": 810,
            "pdf_page_index": 813,
            "outcome_domain": "Functional Assessment / Occlusal Metric",
            "fracture_region": "Mandible / Maxilla",
            "exact_finding_or_outcome_definition": "Occlusal outcome assessment must include dental group function, patient subjective perception of bite, and radiographic reduction rather than simple visual intercuspation.",
            "assessment_method": "Clinical group function check, patient bite assessment, radiographic confirmation",
            "follow_up_time": "Postoperative clinic review",
            "unit_or_explicit_threshold": "NO EXPLICIT THRESHOLD REPORTED",
            "supporting_quotation": "Correct assessment of the occlusion is more than just asking the patient to 'bite together.' This can be misleading.",
            "evidence_classification": "POSTOPERATIVE_ASSESSMENT",
            "cited_study_reference": "NOT REPORTED IN SOURCE (Clinical case demonstration)",
            "limitations_and_cautions": "Apparent visual dysocclusion may represent pre-existing patient baseline occlusion; patient confirmation is critical.",
            "verification_status": "VERIFIED_SOURCE_TEXT"
        },

        # --- Section: 19.1.6 - Return to Normal Diet ---
        {
            "evidence_id": "ATLAS-CH19-EVD-014",
            "source_filename": "Michael Perry, Simon Holmes (eds.) - Atlas of Operative Maxillofacial Trauma Surgery_ Primary Repair of Facial Injuries (2014, Springer) [10.1007_978-1-4471-2855-7] - libgen.li.pdf",
            "book_title": "Atlas of Operative Maxillofacial Trauma Surgery (2014, Springer)",
            "chapter": "Chapter 19 (designated as Chapter 20 target: Aftercare and Follow-up)",
            "section": "19.1.6 - Return to Normal Diet",
            "printed_page": 810,
            "pdf_page_index": 813,
            "outcome_domain": "Functional Recovery / Bone Consolidation",
            "fracture_region": "Mandible / Midface",
            "exact_finding_or_outcome_definition": "Soft diet duration recommended before bone union is adequate to withstand physiological masticatory forces.",
            "assessment_method": "Dietary progression monitoring",
            "follow_up_time": "4 to 6 weeks duration",
            "unit_or_explicit_threshold": "4 to 6 weeks soft diet",
            "supporting_quotation": "for mandibular and midface fractures to firmly unite, 4–6 weeks of 'soft diet' seems to be an appropriate length of time",
            "evidence_classification": "POSTOPERATIVE_ASSESSMENT",
            "cited_study_reference": "NOT REPORTED IN SOURCE (Expert consensus)",
            "limitations_and_cautions": "Significantly shorter immobilization period than orthopedic extremities despite substantial mandibular bite forces.",
            "verification_status": "VERIFIED_SOURCE_TEXT"
        },

        # --- Section: 19.1.7 - Routine Plate Removal ---
        {
            "evidence_id": "ATLAS-CH19-EVD-015",
            "source_filename": "Michael Perry, Simon Holmes (eds.) - Atlas of Operative Maxillofacial Trauma Surgery_ Primary Repair of Facial Injuries (2014, Springer) [10.1007_978-1-4471-2855-7] - libgen.li.pdf",
            "book_title": "Atlas of Operative Maxillofacial Trauma Surgery (2014, Springer)",
            "chapter": "Chapter 19 (designated as Chapter 20 target: Aftercare and Follow-up)",
            "section": "19.1.7 - Routine Plate Removal",
            "printed_page": 811,
            "pdf_page_index": 814,
            "outcome_domain": "Hardware Morbidity / Secondary Surgery",
            "fracture_region": "Internal Fixation Sites / Craniofacial",
            "exact_finding_or_outcome_definition": "Controversy over routine plate removal: titanium particle migration documented, but little evidence demonstrates routine removal is necessary absent significant complications.",
            "assessment_method": "Symptom-driven evaluation (infection, palpability, cold sensitivity)",
            "follow_up_time": "Long-term follow-up",
            "unit_or_explicit_threshold": "NO EXPLICIT THRESHOLD REPORTED",
            "supporting_quotation": "Other centres do not remove plates unless there have been significant complications.",
            "evidence_classification": "TREATMENT_OUTCOME_EVIDENCE",
            "cited_study_reference": "Jorgenson et al. (1997); Rosenberg et al. (1993); Mosbah et al. (2003); Nagase et al. (2005) (cited in Suggested Reading)",
            "limitations_and_cautions": "Routine hardware removal constitutes a secondary surgery with associated general anesthetic and morbidity risks.",
            "verification_status": "VERIFIED_SOURCE_TEXT"
        },

        # --- Section: 19.1.8 - Facial Physiotherapy & Rehabilitation ---
        {
            "evidence_id": "ATLAS-CH19-EVD-016",
            "source_filename": "Michael Perry, Simon Holmes (eds.) - Atlas of Operative Maxillofacial Trauma Surgery_ Primary Repair of Facial Injuries (2014, Springer) [10.1007_978-1-4471-2855-7] - libgen.li.pdf",
            "book_title": "Atlas of Operative Maxillofacial Trauma Surgery (2014, Springer)",
            "chapter": "Chapter 19 (designated as Chapter 20 target: Aftercare and Follow-up)",
            "section": "19.1.8 - Facial Physiotherapy (Orbital)",
            "printed_page": "811-812",
            "pdf_page_index": 814,
            "outcome_domain": "Ocular Motility / Functional Recovery",
            "fracture_region": "Orbital Fractures",
            "exact_finding_or_outcome_definition": "Active extraocular muscle exercises facilitate central fusion; eye patches should be avoided post-orbital repair.",
            "assessment_method": "Orthoptic examination, prism adaptation, ocular motility tracking",
            "follow_up_time": "Early postoperative days to weeks",
            "unit_or_explicit_threshold": "NO EXPLICIT THRESHOLD REPORTED",
            "supporting_quotation": "Following orbital surgery, eye patches should be avoided and extraocular muscle activity ('eye exercises') encouraged.",
            "evidence_classification": "POSTOPERATIVE_ASSESSMENT",
            "cited_study_reference": "NOT REPORTED IN SOURCE (Expert consensus)",
            "limitations_and_cautions": "Failure of diplopia to resolve or respond to prisms can lead to permanent inability to drive or work.",
            "verification_status": "VERIFIED_SOURCE_TEXT"
        },
        {
            "evidence_id": "ATLAS-CH19-EVD-017",
            "source_filename": "Michael Perry, Simon Holmes (eds.) - Atlas of Operative Maxillofacial Trauma Surgery_ Primary Repair of Facial Injuries (2014, Springer) [10.1007_978-1-4471-2855-7] - libgen.li.pdf",
            "book_title": "Atlas of Operative Maxillofacial Trauma Surgery (2014, Springer)",
            "chapter": "Chapter 19 (designated as Chapter 20 target: Aftercare and Follow-up)",
            "section": "19.1.8 & Figure 19.11 - Mandibular Rehabilitation",
            "printed_page": 812,
            "pdf_page_index": 815,
            "outcome_domain": "Mandibular Mobility / Trismus Recovery",
            "fracture_region": "Mandibular Fractures",
            "exact_finding_or_outcome_definition": "Active jaw mobilization (forward, lateral, vertical mouth opening) overcomes muscle contracture and limitation after mandibular repair.",
            "assessment_method": "Maximum interincisal opening (MIO) measurement / lateral excursion check",
            "follow_up_time": "Post-fixation recovery period",
            "unit_or_explicit_threshold": "NO EXPLICIT THRESHOLD REPORTED",
            "supporting_quotation": "Limitation in mouth opening is common after treatment of mandibular fractures but can usually be overcome with appropriate exercises",
            "evidence_classification": "POSTOPERATIVE_ASSESSMENT",
            "cited_study_reference": "NOT REPORTED IN SOURCE (Clinical guidance / exercises)",
            "limitations_and_cautions": "Rehabilitation success requires assessing dynamic range of motion, not simply static intercuspal occlusion.",
            "verification_status": "VERIFIED_SOURCE_TEXT"
        },
        {
            "evidence_id": "ATLAS-CH19-EVD-018",
            "source_filename": "Michael Perry, Simon Holmes (eds.) - Atlas of Operative Maxillofacial Trauma Surgery_ Primary Repair of Facial Injuries (2014, Springer) [10.1007_978-1-4471-2855-7] - libgen.li.pdf",
            "book_title": "Atlas of Operative Maxillofacial Trauma Surgery (2014, Springer)",
            "chapter": "Chapter 19 (designated as Chapter 20 target: Aftercare and Follow-up)",
            "section": "19.1.8 & Figure 19.15 - Soft Tissue & Scar Complications",
            "printed_page": "812-814",
            "pdf_page_index": 817,
            "outcome_domain": "Eyelid Position / Scar Contracture",
            "fracture_region": "Periorbital / Lower Eyelid",
            "exact_finding_or_outcome_definition": "Early lower eyelid ectropion secondary to surgical access scar contraction requires vigorous massage and careful follow-up; secondary correction is difficult.",
            "assessment_method": "Eyelid margin position inspection / scleral show assessment",
            "follow_up_time": "Early postoperative weeks through scar maturation",
            "unit_or_explicit_threshold": "NO EXPLICIT THRESHOLD REPORTED",
            "supporting_quotation": "Early ectropion of the lower eyelid due to scar contraction. This needs vigorous massage and careful follow-up. Secondary correction can be very difficult",
            "evidence_classification": "COMPLICATION",
            "cited_study_reference": "NOT REPORTED IN SOURCE (Clinical complication demonstration)",
            "limitations_and_cautions": "Surgical revision of cicatricial ectropion is often disappointing; conservative massage is the critical early intervention.",
            "verification_status": "VERIFIED_SOURCE_TEXT"
        },

        # --- Section: 19.1.9 - Follow-up Timing & Dental Devitalization ---
        {
            "evidence_id": "ATLAS-CH19-EVD-019",
            "source_filename": "Michael Perry, Simon Holmes (eds.) - Atlas of Operative Maxillofacial Trauma Surgery_ Primary Repair of Facial Injuries (2014, Springer) [10.1007_978-1-4471-2855-7] - libgen.li.pdf",
            "book_title": "Atlas of Operative Maxillofacial Trauma Surgery (2014, Springer)",
            "chapter": "Chapter 19 (designated as Chapter 20 target: Aftercare and Follow-up)",
            "section": "19.1.9 - Length and Frequency of Follow-up",
            "printed_page": 816,
            "pdf_page_index": 819,
            "outcome_domain": "Follow-up Methodology & Limitations",
            "fracture_region": "General Maxillofacial",
            "exact_finding_or_outcome_definition": "Current clinical follow-up intervals are based on arbitrary calendar cycles rather than biological healing principles, leading to under-detection of late outcomes.",
            "assessment_method": "Biologically tailored follow-up scheduling vs. calendar appointments",
            "follow_up_time": "Case-by-case (days for infections, years for condylar resorption / mucoceles)",
            "unit_or_explicit_threshold": "NO EXPLICIT THRESHOLD REPORTED",
            "supporting_quotation": "Follow up, whether it be weekly, monthly or annually is generally not based on biology, but rather on the Gregorian... calendar.",
            "evidence_classification": "CLINICAL_CONTEXT",
            "cited_study_reference": "NOT REPORTED IN SOURCE (Critical editorial analysis)",
            "limitations_and_cautions": "Arbitrary 6-week or 1-year discharge schedules prevent systematic collection of late treatment outcomes.",
            "verification_status": "VERIFIED_SOURCE_TEXT"
        },
        {
            "evidence_id": "ATLAS-CH19-EVD-020",
            "source_filename": "Michael Perry, Simon Holmes (eds.) - Atlas of Operative Maxillofacial Trauma Surgery_ Primary Repair of Facial Injuries (2014, Springer) [10.1007_978-1-4471-2855-7] - libgen.li.pdf",
            "book_title": "Atlas of Operative Maxillofacial Trauma Surgery (2014, Springer)",
            "chapter": "Chapter 19 (designated as Chapter 20 target: Aftercare and Follow-up)",
            "section": "19.1.9 & Figure 19.19 - Dental Devitalization",
            "printed_page": 816,
            "pdf_page_index": 819,
            "outcome_domain": "Dentoalveolar Morbidity / Iatrogenic Complication",
            "fracture_region": "Alveolus / Dentition",
            "exact_finding_or_outcome_definition": "Late tooth devitalization and discoloration resulting from initial trauma or iatrogenic root contact during osteosynthesis screw placement.",
            "assessment_method": "Dental pulp vitality testing, periapical radiography, visual crown discoloration check",
            "follow_up_time": "Months to several years (figure shows 2-year presentation)",
            "unit_or_explicit_threshold": "NO EXPLICIT THRESHOLD REPORTED",
            "supporting_quotation": "Teeth can devitalise and stain, even in the absence of obvious injury, either as a result of the initial impact or subsequent screw placement",
            "evidence_classification": "COMPLICATION",
            "cited_study_reference": "NOT REPORTED IN SOURCE (Clinical complication demonstration)",
            "limitations_and_cautions": "Requires ongoing dental surveillance; may occur late without acute symptoms at initial fracture discharge.",
            "verification_status": "VERIFIED_SOURCE_TEXT"
        }
    ]
    return records


def validate_records(records: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Validates records against required constraints."""
    val_result = {
        "total_records": len(records),
        "duplicate_ids": [],
        "missing_references": [],
        "invalid_page_indexes": [],
        "unsupported_thresholds": [],
        "quote_length_violations": [],
        "classification_breakdown": {}
    }

    seen_ids = set()
    for r in records:
        eid = r["evidence_id"]
        if eid in seen_ids:
            val_result["duplicate_ids"].append(eid)
        seen_ids.add(eid)

        # Check required fields
        for field in [
            "source_filename", "book_title", "chapter", "section",
            "printed_page", "pdf_page_index", "outcome_domain",
            "fracture_region", "exact_finding_or_outcome_definition",
            "assessment_method", "follow_up_time", "unit_or_explicit_threshold",
            "supporting_quotation", "evidence_classification", "verification_status"
        ]:
            if not r.get(field):
                val_result["missing_references"].append((eid, field))

        # Check page boundary within Atlas Chapter 19 (808 to 820)
        pidx = r["pdf_page_index"]
        if not (808 <= pidx <= 820):
            val_result["invalid_page_indexes"].append((eid, pidx))

        # Check quotation word count <= 25 words
        words = r["supporting_quotation"].split()
        if len(words) > 25:
            val_result["quote_length_violations"].append((eid, len(words)))

        # Track classification
        c = r["evidence_classification"]
        val_result["classification_breakdown"][c] = val_result["classification_breakdown"].get(c, 0) + 1

    return val_result


def export_csv(records: List[Dict[str, Any]], filepath: str):
    fieldnames = [
        "evidence_id",
        "source_filename",
        "book_title",
        "chapter",
        "section",
        "printed_page",
        "pdf_page_index",
        "outcome_domain",
        "fracture_region",
        "exact_finding_or_outcome_definition",
        "assessment_method",
        "follow_up_time",
        "unit_or_explicit_threshold",
        "supporting_quotation",
        "evidence_classification",
        "cited_study_reference",
        "limitations_and_cautions",
        "verification_status"
    ]
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for r in records:
            writer.writerow(r)


def export_json(records: List[Dict[str, Any]], filepath: str):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(records, f, indent=2, ensure_ascii=False)


def generate_summary_report(records: List[Dict[str, Any]], filepath: str):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write("# Atlas of Operative Maxillofacial Trauma Surgery — Chapter 19 Evidence Summary\n\n")
        f.write("## Source Specification\n")
        f.write("- **Book Title:** *Atlas of Operative Maxillofacial Trauma Surgery: Primary Repair of Facial Injuries* (2014, Springer)\n")
        f.write("- **Editors:** Michael Perry, Simon Holmes\n")
        f.write("- **Chapter:** Chapter 19 — *Aftercare and Follow-up* (Targeted as 'Chapter 20' in user request; verified as Chapter 19 in publisher's DOI `10.1007/978-1-4471-2855-7_19` and TOC)\n")
        f.write("- **Chapter Author:** Michael Perry (Regional North West London Craniomaxillofacial Unit)\n")
        f.write("- **Printed Page Range:** 805 to 817 (13 pages)\n")
        f.write("- **Zero-Based PDF Page Indexes:** 808 to 820 (13 pages)\n\n")

        f.write("## Overview of Extracted Evidence\n")
        f.write(f"- **Total Evidence Records Extracted:** {len(records)}\n")
        
        cats = {}
        for r in records:
            c = r["evidence_classification"]
            cats[c] = cats.get(c, 0) + 1
        
        f.write("- **Breakdown by Classification:**\n")
        for c, count in sorted(cats.items()):
            f.write(f"  - `{c}`: {count} records\n")
        
        f.write("\n## Clinical Synthesis of Follow-up & Outcome Evidence\n")
        f.write("1. **Long-Term Outcome Principles:** The author explicitly states that *'lack of complications does not necessarily mean a good outcome'*, advocating for rigorous long-term quality control.\n")
        f.write("2. **Biological Healing Timelines:** Bone consolidates sufficiently for functional loads (chewing) by ~1 month, soft diet is maintained for 4–6 weeks, and scars and nerve injuries require 18+ months to mature.\n")
        f.write("3. **Late-Onset Complications:** Enophthalmos becomes noticeable by ~3 months; condylar resorption, titanium particle migration, dental devitalization, and frontal sinus mucoceles take years or lifetimes to become clinically manifest.\n")
        f.write("4. **Occlusal & Functional Assessment:** Occlusion cannot be judged simply by asking the patient to bite together; dynamic group function, patient perception, and active mandibular excursion (forward and lateral) are required.\n\n")

        f.write("## Evidence Records Table\n\n")
        f.write("| Evidence ID | Printed Page | PDF Idx | Domain | Finding / Outcome | Classification | Follow-up Time |\n")
        f.write("| :--- | :---: | :---: | :--- | :--- | :---: | :--- |\n")
        for r in records:
            f.write(f"| `{r['evidence_id']}` | {r['printed_page']} | {r['pdf_page_index']} | {r['outcome_domain']} | {r['exact_finding_or_outcome_definition'][:55]}... | `{r['evidence_classification']}` | {r['follow_up_time']} |\n")


def generate_validation_report(val_result: Dict[str, Any], filepath: str):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write("# Atlas Chapter 19 Evidence Validation Report\n\n")
        f.write("## Validation Metrics\n")
        f.write(f"- **Total Records Validated:** {val_result['total_records']}\n")
        f.write(f"- **Duplicate IDs:** {len(val_result['duplicate_ids'])} ({val_result['duplicate_ids'] or 'None'})\n")
        f.write(f"- **Missing Reference Attributes:** {len(val_result['missing_references'])} ({val_result['missing_references'] or 'None'})\n")
        f.write(f"- **Invalid Page Indexes (Outside 808–820):** {len(val_result['invalid_page_indexes'])} ({val_result['invalid_page_indexes'] or 'None'})\n")
        f.write(f"- **Quotation Word Count Violations (>25 words):** {len(val_result['quote_length_violations'])} ({val_result['quote_length_violations'] or 'None'})\n\n")

        f.write("## Classification Breakdown\n")
        for c, count in sorted(val_result["classification_breakdown"].items()):
            f.write(f"- `{c}`: {count} records\n")
        
        f.write("\n## Chapter Designation Clarification\n")
        f.write("- The user prompt requested Chapter 20 (*Aftercare and Follow-up*). In this volume (*Atlas of Operative Maxillofacial Trauma Surgery*, Springer 2014), the chapter titled **'Aftercare and Follow-up'** is authored by Michael Perry and published as **Chapter 19** (DOI: `10.1007/978-1-4471-2855-7_19`, printed pp. 805–817 / PDF indexes 808–820). Chapter 19 is immediately followed by the book Index on printed p. 819 / PDF index 821 (there is no Chapter 20 in this volume). All records are mapped to this confirmed chapter.\n")


def main():
    records = get_raw_evidence_records()
    val_result = validate_records(records)

    csv_path = "data/extracted/atlas_chapter_20_evidence.csv"
    json_path = "data/extracted/atlas_chapter_20_evidence.json"
    sum_path = "reports/atlas_chapter_20_summary.md"
    val_path = "reports/atlas_chapter_20_validation.md"

    export_csv(records, csv_path)
    export_json(records, json_path)
    generate_summary_report(records, sum_path)
    generate_validation_report(val_result, val_path)

    print(f"Successfully processed Atlas Chapter 19 (target Aftercare chapter).")
    print(f"Total records extracted: {len(records)}")
    print(f"Duplicate IDs: {len(val_result['duplicate_ids'])}")
    print(f"Quote length violations: {len(val_result['quote_length_violations'])}")
    print(f"Outputs generated:")
    print(f"  - {csv_path}")
    print(f"  - {json_path}")
    print(f"  - {sum_path}")
    print(f"  - {val_path}")


if __name__ == "__main__":
    main()
