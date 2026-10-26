# Phase 6C — Imaging Evidence Output Interface Contract

**Repository:** `C:\ML_Projects\adrab\adrab`  
**Document:** Interface Specification & Implementation Contract  
**Version:** `1.0.0`  
**Date:** October 2026  
**Status:** **AUTHORITATIVE SUBSYSTEM CONTRACT** (Ready for Future Imaging Pipeline Integration)

---

## 1. Executive Summary & Purpose

The **Imaging Evidence Output Interface Contract** defines a formal, versioned schema contract (`schemas/imaging_evidence_output.schema.json`) that decouples radiologic/optical 3D imaging pipelines from clinical outcome evaluation in the Maxillofacial Treatment-Outcome Evaluator project.

### Core Principles & Scientific Boundaries:
1. **Separation of Measurement from Interpretation:** The imaging subsystem outputs objective geometric, volumetric, and landmark data, error margins, and technical image quality flags. It **never** outputs a clinical pass/fail grade, surgical success classification, treatment recommendation, or revision directive.
2. **De-Identification & Privacy (Zero PHI):** Direct personal identifiers (patient names, medical record numbers, dates of birth) are strictly forbidden. Scans and cases are tracked via pseudonymous identifiers matching `^CASE-[A-Z0-9]{4,12}$`, and DICOM UID references are securely hashed (`series_instance_hash`).
3. **Explicit Quality Auditing:** If imaging is degraded by metallic hardware streak artifacts, motion blur, non-zero gantry tilt, or truncated fields of view, the subsystem explicitly sets quality audit flags and unmeasurability codes rather than generating distorted or unvalidated calculations.
4. **Distinction Between Observed vs Estimated Values:** Measurements explicitly identify their extraction category: direct physical/caliper observations, surface registration calculations, or deep learning volumetric segmentation estimates.
5. **Evidence Grounding:** Every quantitative construct references canonical evidence identifiers (`CANON-RES-EVD-*`, `CANON-CH12-EVD-*`, `CANON-ATLAS-CH19-EVD-*`).

---

## 2. Contract Specification & Data Structures

The contract is formally implemented in [`schemas/imaging_evidence_output.schema.json`](file:///c:/ML_Projects/adrab/adrab/schemas/imaging_evidence_output.schema.json) with the following structure:

```
ImagingEvidenceOutputContract
├── contract_version ("1.0.0")
├── pseudonymous_case_id ("CASE-SYN01")
├── imaging_modality (e.g. "MULTI_DETECTOR_CT", "CONE_BEAM_CT", "3D_OPTICAL_PHOTOGRAMMETRY")
├── anatomical_regions_imaged (e.g. ["MIDFACE_AND_ORBITS", "COMPLETE_CRANIOFACIAL_SKELETON"])
├── study_metadata
│   ├── scan_epoch ("PREOPERATIVE_BASELINE" | "POSTOPERATIVE_FOLLOWUP_6_MONTHS" | etc.)
│   ├── series_instance_hash (SHA-256 hash of DICOM series UID)
│   └── source_reference_id (De-identified study token, e.g. "IMG-STUDY-0012")
├── technical_parameters
│   ├── slice_thickness_mm (<= 1.0 mm required for fine-slice 3D analysis)
│   ├── reconstruction_kernel ("BONE", "SHARP", "STANDARD", "SOFT_TISSUE")
│   ├── gantry_tilt_degrees (Must be 0.0 for reliable 3D multiplanar mirroring)
│   └── voxel_size_xyz_mm ([x, y, z] in millimeters)
├── image_quality_audit
│   ├── metal_hardware_artifact_severity ("NONE" | "MILD_NON_OBSCURING" | "MODERATE" | "SEVERE_INVALIDATING")
│   ├── patient_motion_artifact_present (boolean)
│   ├── field_of_view_adequacy ("COMPLETE_FACIAL_SKELETON" | "TRUNCATED_MIDFACE" | "SUBOPTIMAL")
│   ├── usable_for_3d_mirroring (boolean)
│   └── unusable_reason_codes (["NONE"] | ["SEVERE_METAL_STREAK", "NON_ZERO_GANTRY_TILT", etc.])
├── measurements (Array of quantitative features)
│   ├── measurement_id ("MEAS-001")
│   ├── construct ("SKELETAL_SURFACE_DISTANCE_RMSD", "ORBITAL_VOLUME_DELTA", etc.)
│   ├── anatomical_subsite ("Zygomaticomaxillary complex", "Orbital floor", etc.)
│   ├── measurement_category ("OBSERVED_DIRECT_MEASUREMENT" | "ALGORITHMIC_SURFACE_REGISTRATION" | "VOLUMETRIC_SEGMENTATION_ESTIMATE")
│   ├── numerical_value (float or null)
│   ├── unit ("MILLIMETERS", "MILLILITERS", "SQUARE_MILLIMETERS", "PERCENT")
│   ├── method ("AUTOMATED_3D_MIRRORING_ICP", "DEEP_LEARNING_SEGMENTATION", etc.)
│   ├── reference_frame ("CONTRALATERAL_MIRRORED_SKELETON", "FRANKFORT_HORIZONTAL_PLANE", etc.)
│   ├── uncertainty_margin ({ confidence_interval_95: [lower, upper], std_error: float })
│   ├── quality_flag ("VERIFIED_OPTIMAL", "UNCERTAIN_BORDER_ARTIFACT", "UNMEASURABLE_SEVERE_ARTIFACT", etc.)
│   └── supporting_evidence_id ("CANON-RES-EVD-002", etc.)
├── provenance
│   ├── software_pipeline_name ("ADRAB-3D-ImagingPipeline")
│   ├── pipeline_version ("0.1.0")
│   ├── model_identifier (Neural model weights hash or null)
│   └── execution_timestamp (ISO-8601 UTC)
├── human_review_status ("AUTOMATED_EXTRACTION_UNCONFIRMED" | "VERIFIED_BY_ATTENDING_RADIOLOGIST" | etc.)
└── limitations_and_uncertainty (Array of explicit strings)
```

---

## 3. Mandatory Guardrails & Prohibited Fields

The contract enforces strict anti-leakage policies to prevent unauthorized clinical interpretation in the imaging pipeline:

```
+----------------------------------------------------------------------------------------------------+
|                         IMAGING SUBSYSTEM STRICT PROHIBITION REGISTER                             |
+-----------------------------------+----------------------------------------------------------------+
| Prohibited Key / Field Pattern    | Rationale & Enforcement Rule                                   |
+-----------------------------------+----------------------------------------------------------------+
| final_grade                       | Clinical grades must never be assigned by imaging algorithms.  |
| outcome_score                     | Aggregating imaging data into scalar scores is unvalidated.    |
| pass_fail_status                  | Threshold for revision requires multi-disciplinary consensus.   |
| surgical_success                  | Clinical success depends on functional motility & PROMs.       |
| clinical_recommendation           | Directives (e.g. "re-operate") violate medical software scopes.|
| revision_indicated                | Secondary surgery indication is an exclusive surgeon decision. |
+-----------------------------------+----------------------------------------------------------------+
```

---

## 4. Physical Measurement Units & Dimensional Consistency

The interface mandates strict SI units tailored to each clinical construct. Incompatible units (e.g. inches, cubic centimeters labeled as cm3 instead of mL, degrees labeled as radians) are rejected during validation:

| Quantitative Construct | Required Physical Unit | Reference Standard & Evidence |
| :--- | :--- | :--- |
| `SKELETAL_SURFACE_DISTANCE_MSD` | `MILLIMETERS` | Ho et al. (2017) baseline facial asymmetry |
| `SKELETAL_SURFACE_DISTANCE_RMSD` | `MILLIMETERS` | Ho et al. (2017), Gellrich et al. (2002) |
| `MAXIMUM_SURFACE_DEVIATION` | `MILLIMETERS` | Craniofacial contour analysis |
| `ORBITAL_VOLUME_DELTA` | `MILLILITERS` | Whitehouse et al. (1994) ($1.0\text{ mL} \approx 0.8\text{ mm}$ enophthalmos) |
| `ORBITAL_DEFECT_AREA` | `SQUARE_MILLIMETERS` | Internal orbital floor defect planimetry |
| `GLOBE_PROJECTION_DELTA_HERTEL` | `MILLIMETERS` | Hertel exophthalmometry & axial CT distance |
| `ANTERIOR_BUTTRESS_DISPLACEMENT_GAP`| `MILLIMETERS` | Fonseca Ch. 12 load-bearing pillars |
| `POSTERIOR_BUTTRESS_DISPLACEMENT_GAP`| `MILLIMETERS` | Pterygomaxillary junction continuity |
| `CONDYLAR_HEIGHT_RATIO_PERCENT` | `PERCENT` | Mandibular ramus height restoration |
| `DENTAL_MIDLINE_DISCREPANCY` | `MILLIMETERS` | Dental inter-arch relationship |

---

## 5. Representation of Missing, Unreliable & Inapplicable Data

1. **Unreliable Imaging (Severe Artifact / Motion):**
   - The measurement's `numerical_value` is set to `null`.
   - `quality_flag` is set to `UNMEASURABLE_SEVERE_ARTIFACT` or `UNRELIABLE_MOTION`.
   - `image_quality_audit.usable_for_3d_mirroring` is set to `false`.
   - `image_quality_audit.unusable_reason_codes` includes `["SEVERE_METAL_STREAK"]` or `["PATIENT_MOTION_BLUR"]`.
   - The evaluator receives this without crashing and transitions Domain 1 to `HUMAN_REVIEW_REQUIRED`.
2. **Inapplicable Contralateral Reference (Bilateral Comminution):**
   - In bilateral panfacial trauma, mid-sagittal mirroring cannot establish a virtual target.
   - `quality_flag` is set to `UNMEASURABLE_ABSENT_CONTRALATERAL`.
   - `image_quality_audit.unusable_reason_codes` includes `["ABSENT_CONTRALATERAL_REFERENCE"]`.
   - The evaluator logs `RULE-D1-INAPPLICABLE-NO-REF` without penalizing the patient's evaluation.
3. **Measurement Uncertainty Reporting:**
   - Where volumetric or surface registration is performed algorithmically, the output provides a 95% confidence interval and standard error (`uncertainty_margin`).

---

## 6. Integration Contract with Downstream Evaluator

The `imaging_evidence_output` contract directly populates the `imaging_subsystem` block of `schemas/treatment_outcome_case.schema.json`. 

Downstream consumers (e.g. `src/treatment_outcome_evaluator.py`):
1. Ingest `imaging_subsystem.measurements` and cross-reference them against clinical findings.
2. Maintain separate records for `ORBITAL_VOLUME_DELTA` (Domain 2), `GLOBE_PROJECTION_DELTA_HERTEL` (Domain 2), and clinical diplopia symptoms (Domain 2).
3. Detect clinical discordance (e.g. volume delta $< 0.75$ mL with diplopia in reading gaze) without overriding either domain.
4. Keep imaging metrics isolated from subjective PROM Rasch scores (Domain 7).
