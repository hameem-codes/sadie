import { CaseItem, UserItem, KnowledgeDocument, RubricCriterion, RubricVersion, CopilotConversation } from '../types';

export const mockUsers: UserItem[] = [
  {
    id: 'usr-1',
    name: 'Dr. Evelyn Vance, MD, DDS',
    email: 'e.vance@sadie-omfs.org',
    role: 'Chief Surgeon',
    status: 'Active',
    department: 'Oral & Maxillofacial Surgery',
    casesCount: 48,
    lastActive: '10 mins ago',
  },
  {
    id: 'usr-2',
    name: 'Dr. Marcus Sterling, DMD',
    email: 'm.sterling@sadie-omfs.org',
    role: 'Attending Surgeon',
    status: 'Active',
    department: 'Craniofacial Reconstruction',
    casesCount: 34,
    lastActive: '1 hour ago',
  },
  {
    id: 'usr-3',
    name: 'Dr. Soraya Chen, MD',
    email: 's.chen@sadie-omfs.org',
    role: 'Oral Radiologist',
    status: 'Active',
    department: 'Diagnostic Radiology',
    casesCount: 52,
    lastActive: 'Just now',
  },
  {
    id: 'usr-4',
    name: 'Dr. Tariq Al-Mansoor, DDS',
    email: 't.almansoor@sadie-omfs.org',
    role: 'Fellow',
    status: 'Active',
    department: 'Orthognathic & Trauma',
    casesCount: 19,
    lastActive: '3 hours ago',
  },
  {
    id: 'usr-5',
    name: 'Dr. Claire Beauchamp, DMD',
    email: 'c.beauchamp@sadie-omfs.org',
    role: 'Resident',
    status: 'Active',
    department: 'Maxillofacial Surgery PGY-3',
    casesCount: 12,
    lastActive: 'Yesterday',
  },
  {
    id: 'usr-6',
    name: 'Helena Rostov, MS',
    email: 'h.rostov@sadie-omfs.org',
    role: 'Administrator',
    status: 'Active',
    department: 'Clinical Informatics & Quality',
    casesCount: 0,
    lastActive: '4 hours ago',
  },
];

export const mockCases: CaseItem[] = [
  {
    id: 'case-101',
    caseNumber: 'MX-2026-0891',
    patientName: 'Eleanor Vance-Cole',
    patientId: 'MRN-884129',
    age: 26,
    gender: 'Female',
    procedure: 'Bimaxillary Osteotomy',
    stage: 'Early Follow-up (6 Weeks)',
    status: 'completed',
    lastUpdated: 'Today, 09:30 AM',
    surgeryDate: '2026-08-28',
    primarySurgeon: 'Dr. Evelyn Vance, MD, DDS',
    evaluator: 'SADIE Evaluator v3.2',
    ownerId: 'usr-1',
    isShared: true,
    score: 94.6,
    confidenceInterval: [92.8, 96.4],
    needsAttention: false,
    notes: 'Maxillary advancement 4.5mm with impaction; mandibular setback with bilateral counter-clockwise rotation.',
    domainScores: [
      { domain: 'Occlusal Relationship', score: 96, maxScore: 100, weight: 35, status: 'optimal', summary: 'Overjet normalized to 2.1mm; Overbite 1.8mm with class I canine and molar lock.' },
      { domain: 'Skeletal Symmetry', score: 93, maxScore: 100, weight: 25, status: 'optimal', summary: 'Midline discrepancy under 0.4mm across ANS, Me, and dental arches.' },
      { domain: 'Soft Tissue Harmony', score: 95, maxScore: 100, weight: 25, status: 'optimal', summary: 'Nasolabial angle 104°; chin projection concordant with Holdaway ratio.' },
      { domain: 'Airway Volumetric Safety', score: 94, maxScore: 100, weight: 15, status: 'optimal', summary: 'Minimal retroglossal cross-sectional area expanded by +28.4%.' }
    ],
    measurements: [
      { id: 'm-1', name: 'SNA Angle', landmark: 'S-N-A', preOp: 77.2, postOp: 82.1, change: +4.9, unit: '°', expectedRange: [80.0, 84.0], status: 'within-norm', category: 'Skeletal', notes: 'Advancement executed within 0.2mm of CAD/CAM splint' },
      { id: 'm-2', name: 'SNB Angle', landmark: 'S-N-B', preOp: 83.5, postOp: 79.4, change: -4.1, unit: '°', expectedRange: [78.0, 82.0], status: 'within-norm', category: 'Skeletal', notes: 'BSSO setback stable' },
      { id: 'm-3', name: 'ANB Difference', landmark: 'A-N-B', preOp: -6.3, postOp: 2.7, change: +9.0, unit: '°', expectedRange: [1.5, 3.5], status: 'within-norm', category: 'Skeletal', notes: 'Skeletal Class III fully corrected to Class I' },
      { id: 'm-4', name: 'Overjet', landmark: 'U1 to L1 horizontal', preOp: -4.2, postOp: 2.1, change: +6.3, unit: 'mm', expectedRange: [1.5, 2.5], status: 'within-norm', category: 'Dental', notes: 'Ideal incisal relationship achieved' },
      { id: 'm-5', name: 'Overbite', landmark: 'U1 to L1 vertical', preOp: 0.5, postOp: 1.8, change: +1.3, unit: 'mm', expectedRange: [1.0, 2.5], status: 'within-norm', category: 'Dental', notes: 'Positive anterior overlap restored' },
      { id: 'm-6', name: 'Nasolabial Angle', landmark: 'Col-Sn-Ls', preOp: 89.0, postOp: 104.2, change: +15.2, unit: '°', expectedRange: [95.0, 110.0], status: 'within-norm', category: 'Soft Tissue', notes: 'Aesthetic subnasale projection' },
      { id: 'm-7', name: 'Oropharyngeal Airway Vol.', landmark: 'PNS-Epiglottis', preOp: 12.8, postOp: 16.4, change: +3.6, unit: 'cm³', expectedRange: [14.0, 22.0], status: 'within-norm', category: 'Airway', notes: 'Significantly reduced OSA risk index' }
    ],
    evidence: [
      { id: 'ev-1', findingTitle: 'Skeletal Midline Alignment', findingDescription: 'Anterior nasal spine (ANS) and menton (Me) deviate by <0.4mm from the true sagittal plane (N-Ba).', rubricCode: 'RUB-SYM-01', rubricRule: 'Craniofacial Symmetry Tolerance <= 1.5mm', radiographicSource: 'Coronal CBCT slice #142 & 3D Surface Mesh', confidence: 98.2, impact: 'positive' },
      { id: 'ev-2', findingTitle: 'Bimaxillary Hardware Rigidity', findingDescription: '4-hole L-plates at piriform aperture and 2.0mm bicortical screws at ramus intact without micro-motion.', rubricCode: 'RUB-FIX-03', rubricRule: 'Osteosynthesis Fixation Stability', radiographicSource: '3D Volume Rendering & Axial Slice #88', confidence: 97.4, impact: 'positive' },
      { id: 'ev-3', findingTitle: 'Condylar Seating Integrity', findingDescription: 'Bilateral condyles centered in glenoid fossae without superior or posterior displacement.', rubricCode: 'RUB-TMJ-02', rubricRule: 'Centric Relation Condyle Position Tolerance < 1.0mm', radiographicSource: 'Axial & Sagittal TMJ Reconstructions', confidence: 95.1, impact: 'positive' }
    ],
    files: [
      { id: 'f-1', name: 'PostOp_CBCT_FullSkull_0.4mm.nii.gz', type: 'CBCT', size: '142 MB', uploadDate: '2026-09-02', url: '/imaging/ct-3d.png', viewType: '3d', isKeyImaging: true },
      { id: 'f-2', name: 'PostOp_Lateral_Ceph_HighRes.dcm', type: 'Cephalometric X-ray', size: '18 MB', uploadDate: '2026-09-02', url: '/imaging/ceph.png', viewType: 'xray', isKeyImaging: true },
      { id: 'f-3', name: 'PreOp_Virtual_Surgical_Plan.stl', type: 'CT 3D', size: '44 MB', uploadDate: '2026-08-20', url: '/imaging/vsp.png', viewType: '3d' },
      { id: 'f-4', name: 'Intraoral_Occlusion_PostOp_6w.ply', type: 'Intraoral Scan', size: '28 MB', uploadDate: '2026-10-02', url: '/imaging/scan.png', viewType: '3d' }
    ]
  },
  {
    id: 'case-102',
    caseNumber: 'MX-2026-0892',
    patientName: 'Julian Hayes',
    patientId: 'MRN-491024',
    age: 34,
    gender: 'Male',
    procedure: 'Mandibular Reconstruction (Fibula)',
    stage: 'Intermediate (6 Months)',
    status: 'completed',
    lastUpdated: 'Yesterday, 04:15 PM',
    surgeryDate: '2026-04-12',
    primarySurgeon: 'Dr. Marcus Sterling, DMD',
    evaluator: 'SADIE Evaluator v3.2',
    ownerId: 'usr-2',
    isShared: true,
    score: 89.2,
    confidenceInterval: [86.7, 91.5],
    needsAttention: false,
    notes: 'Post-ameloblastoma segmental resection right hemimandible reconstructed with vascularized fibula flap and patient-specific CAD/CAM titanium plate.',
    domainScores: [
      { domain: 'Bony Union & Consolidation', score: 92, maxScore: 100, weight: 30, status: 'optimal', summary: 'Continuous cortical bridging across both osteotomy docking sites.' },
      { domain: 'Mandibular Contour & Symmetry', score: 88, maxScore: 100, weight: 30, status: 'optimal', summary: 'Gonial angle restored to 122° (contralateral 120°).' },
      { domain: 'Occlusal Restorability', score: 86, maxScore: 100, weight: 25, status: 'acceptable', summary: 'Premolar segment vertically adequate for endosseous dental implants.' },
      { domain: 'Hardware Integrity', score: 94, maxScore: 100, weight: 15, status: 'optimal', summary: 'Custom milled titanium plate passive with zero stress fracture signs.' }
    ],
    measurements: [
      { id: 'm-201', name: 'Gonial Angle Symmetry', landmark: 'Ar-Go-Me', preOp: 138.0, postOp: 122.4, change: -15.6, unit: '°', expectedRange: [118.0, 126.0], status: 'within-norm', category: 'Skeletal' },
      { id: 'm-202', name: 'Fibula Segment Length', landmark: 'Osteotomy Gap', preOp: 0.0, postOp: 68.2, change: +68.2, unit: 'mm', expectedRange: [65.0, 72.0], status: 'within-norm', category: 'Skeletal' },
      { id: 'm-203', name: 'Bone Bridge Density', landmark: 'HU Mean at Docking Site', preOp: 120.0, postOp: 850.0, change: +730.0, unit: 'mm', expectedRange: [700.0, 1100.0], status: 'within-norm', category: 'Skeletal' },
      { id: 'm-204', name: 'Vertical Crestal Height', landmark: 'Alveolar Crest to Basal Border', preOp: 9.0, postOp: 14.5, change: +5.5, unit: 'mm', expectedRange: [13.0, 18.0], status: 'within-norm', category: 'Dental' }
    ],
    evidence: [
      { id: 'ev-201', findingTitle: 'Complete Cortical Bridging', findingDescription: 'Proximal and distal osteotomies show high-attenuation trabecular connectivity at 6-month CT.', rubricCode: 'RUB-REC-01', rubricRule: 'Bony Union in Vascularized Flap >= Grade III', radiographicSource: 'High-Res Multiplanar CT Reconstruction', confidence: 94.8, impact: 'positive' },
      { id: 'ev-202', findingTitle: 'Slight Inferior Border Contour Step', findingDescription: '0.9mm minor contour step at the distal osteotomy junction near parasymphysis.', rubricCode: 'RUB-CON-04', rubricRule: 'Contour Discontinuity Tolerance <= 1.2mm', radiographicSource: '3D Mandibular Volume Model', confidence: 89.2, impact: 'neutral' }
    ],
    files: [
      { id: 'f-201', name: '6Mo_Followup_Neck_Mandible_CT.dcm', type: 'CT 3D', size: '210 MB', uploadDate: '2026-10-01', url: '/imaging/ct-3d.png', viewType: '3d', isKeyImaging: true },
      { id: 'f-202', name: 'Panoramic_Radiograph_6Mo.png', type: 'Panoramic', size: '12 MB', uploadDate: '2026-10-01', url: '/imaging/pano.png', viewType: 'xray' }
    ]
  },
  {
    id: 'case-103',
    caseNumber: 'MX-2026-0893',
    patientName: 'Maya Lin-Patel',
    patientId: 'MRN-330198',
    age: 21,
    gender: 'Female',
    procedure: 'Le Fort I Osteotomy',
    stage: 'Immediate Post-Op (24-48h)',
    status: 'processing',
    lastUpdated: '12 mins ago',
    surgeryDate: '2026-10-10',
    primarySurgeon: 'Dr. Evelyn Vance, MD, DDS',
    evaluator: 'SADIE Evaluator v3.2',
    ownerId: 'usr-1',
    isShared: false,
    score: undefined,
    needsAttention: true,
    attentionReason: 'Radiographic segmentation is currently processing 840 axial CT slices.',
    notes: 'Maxillary down-fracture, impaction 3.0mm, advancement 3.5mm for anterior open bite correction.',
    domainScores: [],
    measurements: [
      { id: 'm-301', name: 'Overbite Correction', landmark: 'Incisal overlap', preOp: -3.5, postOp: 1.5, change: +5.0, unit: 'mm', expectedRange: [1.0, 2.5], status: 'within-norm', category: 'Dental' },
      { id: 'm-302', name: 'Maxillary Posterior Impaction', landmark: 'U6 vertical to Palatal Plane', preOp: 24.2, postOp: 21.0, change: -3.2, unit: 'mm', expectedRange: [20.0, 22.5], status: 'within-norm', category: 'Skeletal' }
    ],
    evidence: [],
    files: [
      { id: 'f-301', name: 'PostOp_Immediate_CBCT_Scan.dcm', type: 'CBCT', size: '168 MB', uploadDate: '2026-10-11', url: '/imaging/ct-3d.png', viewType: '3d', isKeyImaging: true }
    ]
  },
  {
    id: 'case-104',
    caseNumber: 'MX-2026-0894',
    patientName: 'Liam O\'Connor',
    patientId: 'MRN-721099',
    age: 29,
    gender: 'Male',
    procedure: 'ZMC Fracture Repair',
    stage: 'Early Follow-up (6 Weeks)',
    status: 'failed',
    lastUpdated: '2 hours ago',
    surgeryDate: '2026-08-30',
    primarySurgeon: 'Dr. Tariq Al-Mansoor, DDS',
    evaluator: 'SADIE Evaluator v3.2',
    ownerId: 'usr-4',
    isShared: true,
    score: undefined,
    needsAttention: true,
    attentionReason: 'Motion artifact detected in orbital floor CT; automated landmark detection aborted at Infraorbital Margin (IOM). Manual landmark pin or rescan recommended.',
    notes: 'Left zygomaticomaxillary complex fracture with orbital floor entrapment. 3-point open reduction and internal fixation.',
    domainScores: [],
    measurements: [],
    evidence: [],
    files: [
      { id: 'f-401', name: 'Left_ZMC_PostOp_CT_MotionBlur.dcm', type: 'CT 3D', size: '92 MB', uploadDate: '2026-10-10', url: '/imaging/ct-3d.png', viewType: '3d', isKeyImaging: true }
    ]
  },
  {
    id: 'case-105',
    caseNumber: 'MX-2026-0895',
    patientName: 'Sophia Montgomery',
    patientId: 'MRN-190334',
    age: 24,
    gender: 'Female',
    procedure: 'Genioplasty',
    stage: 'Final Review (12 Months)',
    status: 'completed',
    lastUpdated: '3 days ago',
    surgeryDate: '2025-10-04',
    primarySurgeon: 'Dr. Claire Beauchamp, DMD',
    evaluator: 'SADIE Evaluator v3.2',
    ownerId: 'usr-5',
    isShared: false,
    score: 97.1,
    confidenceInterval: [95.5, 98.6],
    needsAttention: false,
    notes: 'Osseous sliding genioplasty: 7.0mm advancement with 2.0mm vertical reduction for microgenia.',
    domainScores: [
      { domain: 'Symphyseal Remodeling', score: 98, maxScore: 100, weight: 35, status: 'optimal', summary: 'Complete osseous smoothing across lateral osteotomy wings without step defect.' },
      { domain: 'Soft Tissue Pog-to-Bony Pog Ratio', score: 96, maxScore: 100, weight: 35, status: 'optimal', summary: 'Soft tissue advancement ratio measured at 0.88:1.0, matching ideal cephalometric profile.' },
      { domain: 'Labiomental Sulcus Depth', score: 97, maxScore: 100, weight: 30, status: 'optimal', summary: 'Natural 4.2mm depth maintained without hyper-accentuation.' }
    ],
    measurements: [
      { id: 'm-501', name: 'Pogonion Advancement', landmark: 'Pog-Horiz', preOp: 0.0, postOp: 7.1, change: +7.1, unit: 'mm', expectedRange: [6.5, 7.5], status: 'within-norm', category: 'Skeletal' },
      { id: 'm-502', name: 'Facial Convexity (excluding nose)', landmark: 'G-Sn-Pog\'', preOp: 154.0, postOp: 167.2, change: +13.2, unit: '°', expectedRange: [165.0, 172.0], status: 'within-norm', category: 'Soft Tissue' }
    ],
    evidence: [
      { id: 'ev-501', findingTitle: 'Symphysis Bony Union', findingDescription: '100% cortical bridging with remodeled step deformities at 1-year CBCT.', rubricCode: 'RUB-GEN-01', rubricRule: 'Osseous Genioplasty Remodeling Completeness', radiographicSource: 'CBCT Sagittal & 3D Surface', confidence: 99.1, impact: 'positive' }
    ],
    files: [
      { id: 'f-501', name: '12Mo_Final_CBCT.nii', type: 'CBCT', size: '135 MB', uploadDate: '2026-10-04', url: '/imaging/ct-3d.png', viewType: '3d', isKeyImaging: true }
    ]
  },
  {
    id: 'case-106',
    caseNumber: 'MX-2026-0896',
    patientName: 'Devon Gallagher',
    patientId: 'MRN-654812',
    age: 42,
    gender: 'Male',
    procedure: 'TMJ Alloplastic Replacement',
    stage: 'Early Follow-up (6 Weeks)',
    status: 'completed',
    lastUpdated: '4 days ago',
    surgeryDate: '2026-08-22',
    primarySurgeon: 'Dr. Marcus Sterling, DMD',
    evaluator: 'SADIE Evaluator v3.2',
    ownerId: 'usr-2',
    isShared: true,
    score: 91.8,
    confidenceInterval: [89.2, 94.1],
    needsAttention: false,
    notes: 'Left total joint replacement with custom ultra-high molecular weight polyethylene fossa and Co-Cr-Mo ramus component.',
    domainScores: [
      { domain: 'Fossa Component Seating', score: 94, maxScore: 100, weight: 35, status: 'optimal', summary: 'Intimate adaptation to zygomatic arch without gap >0.3mm.' },
      { domain: 'Ramus Fixation Vector', score: 91, maxScore: 100, weight: 35, status: 'optimal', summary: 'Neutral vertical vector without torquing the distal segment.' },
      { domain: 'Maximum Incisal Opening (MIO)', score: 89, maxScore: 100, weight: 30, status: 'acceptable', summary: 'Measured at 36mm post-op (up from 14mm pre-op ankylosis).' }
    ],
    measurements: [
      { id: 'm-601', name: 'Max Incisal Opening', landmark: 'U1 to L1 Max Opening', preOp: 14.0, postOp: 36.5, change: +22.5, unit: 'mm', expectedRange: [35.0, 45.0], status: 'within-norm', category: 'Dental' },
      { id: 'm-602', name: 'Ramus Height Restored', landmark: 'Condylion to Gonion', preOp: 42.1, postOp: 58.2, change: +16.1, unit: 'mm', expectedRange: [55.0, 62.0], status: 'within-norm', category: 'Skeletal' }
    ],
    evidence: [
      { id: 'ev-601', findingTitle: 'Biocompatible Hardware Stability', findingDescription: '9 monocortical screws engaged in zygomatic root and 7 bicortical screws in ramus.', rubricCode: 'RUB-TMJ-03', rubricRule: 'Total Joint Prosthesis Fixation', radiographicSource: 'High-kV CT 3D Reconstructed', confidence: 96.0, impact: 'positive' }
    ],
    files: [
      { id: 'f-601', name: 'TMJ_PostOp_HighRes_CT.dcm', type: 'CT 3D', size: '175 MB', uploadDate: '2026-09-08', url: '/imaging/ct-3d.png', viewType: '3d', isKeyImaging: true }
    ]
  },
  {
    id: 'case-107',
    caseNumber: 'MX-2026-0897',
    patientName: 'Amara Okafor',
    patientId: 'MRN-512990',
    age: 19,
    gender: 'Female',
    procedure: 'SARPE (Palatal Expansion)',
    stage: 'Early Follow-up (6 Weeks)',
    status: 'completed',
    lastUpdated: '5 days ago',
    surgeryDate: '2026-08-15',
    primarySurgeon: 'Dr. Evelyn Vance, MD, DDS',
    evaluator: 'SADIE Evaluator v3.2',
    ownerId: 'usr-1',
    isShared: false,
    score: 93.4,
    confidenceInterval: [91.0, 95.8],
    needsAttention: false,
    notes: 'Subtotal Le Fort I osteotomy with midpalatal suture split and tooth-borne distractor activated 7.5mm.',
    domainScores: [
      { domain: 'Skeletal Midpalatal Expansion', score: 95, maxScore: 100, weight: 40, status: 'optimal', summary: 'True skeletal split of 5.8mm at ANS and 4.2mm at PNS.' },
      { domain: 'Dental Tipping Control', score: 91, maxScore: 100, weight: 35, status: 'acceptable', summary: 'Buccal crown tipping restricted to <3.5 degrees per side.' },
      { domain: 'Nasal Cavity Width Gain', score: 94, maxScore: 100, weight: 25, status: 'optimal', summary: 'Pyriform aperture width increased by +2.9mm with improved airway patency.' }
    ],
    measurements: [
      { id: 'm-701', name: 'Intermolar Width', landmark: 'Maxillary M1 Palatal Cusp', preOp: 31.2, postOp: 38.6, change: +7.4, unit: 'mm', expectedRange: [37.0, 40.0], status: 'within-norm', category: 'Dental' },
      { id: 'm-702', name: 'Pyriform Aperture Width', landmark: 'Apertura piriformis lat-lat', preOp: 22.4, postOp: 25.3, change: +2.9, unit: 'mm', expectedRange: [24.5, 27.0], status: 'within-norm', category: 'Skeletal' }
    ],
    evidence: [
      { id: 'ev-701', findingTitle: 'Symmetric Suture Opening', findingDescription: 'Parallel separation of maxilla halves without unilateral hinge artifact.', rubricCode: 'RUB-PAL-02', rubricRule: 'Midpalatal Expansion Symmetry', radiographicSource: 'Occlusal Radiograph & Coronal CBCT', confidence: 97.2, impact: 'positive' }
    ],
    files: [
      { id: 'f-701', name: 'SARPE_PostActivation_CBCT.dcm', type: 'CBCT', size: '120 MB', uploadDate: '2026-09-01', url: '/imaging/ct-3d.png', viewType: '3d', isKeyImaging: true }
    ]
  },
  {
    id: 'case-108',
    caseNumber: 'MX-2026-0898',
    patientName: 'Zachary Thornton',
    patientId: 'MRN-880214',
    age: 31,
    gender: 'Male',
    procedure: 'BSSO (Bilateral Sagittal Split)',
    stage: 'Pre-Operative Planning',
    status: 'draft',
    lastUpdated: '1 week ago',
    surgeryDate: '2026-11-04',
    primarySurgeon: 'Dr. Marcus Sterling, DMD',
    evaluator: 'SADIE Evaluator v3.2',
    ownerId: 'usr-2',
    isShared: false,
    score: undefined,
    needsAttention: false,
    notes: 'Virtual surgical plan created for 6.5mm mandibular advancement with slight rightward yaw correction.',
    domainScores: [],
    measurements: [
      { id: 'm-801', name: 'Planned Mandibular Advancement', landmark: 'Pogonion CAD Vector', preOp: 0.0, postOp: 6.5, change: +6.5, unit: 'mm', expectedRange: [6.0, 7.0], status: 'within-norm', category: 'Skeletal' }
    ],
    evidence: [],
    files: [
      { id: 'f-801', name: 'PreOp_HighRes_Diagnostic_CT.dcm', type: 'CT 3D', size: '180 MB', uploadDate: '2026-10-01', url: '/imaging/ct-3d.png', viewType: '3d', isKeyImaging: true }
    ]
  },
  {
    id: 'case-109',
    caseNumber: 'MX-2026-0899',
    patientName: 'Hannah Berardi',
    patientId: 'MRN-994301',
    age: 27,
    gender: 'Female',
    procedure: 'Bimaxillary Osteotomy',
    stage: 'Early Follow-up (6 Weeks)',
    status: 'completed',
    lastUpdated: '1 week ago',
    surgeryDate: '2026-08-10',
    primarySurgeon: 'Dr. Evelyn Vance, MD, DDS',
    evaluator: 'SADIE Evaluator v3.2',
    ownerId: 'usr-1',
    isShared: true,
    score: 95.8,
    confidenceInterval: [94.2, 97.4],
    needsAttention: false,
    notes: 'Complex facial asymmetry case. Maxillary differential impaction and asymmetric BSSO rotation.',
    domainScores: [
      { domain: 'Occlusal Relationship', score: 97, maxScore: 100, weight: 35, status: 'optimal', summary: 'Complete intercuspation and canine guidance restored.' },
      { domain: 'Skeletal Symmetry', score: 95, maxScore: 100, weight: 25, status: 'optimal', summary: 'Occlusal cant corrected from 4.8° to 0.3°.' },
      { domain: 'Soft Tissue Harmony', score: 96, maxScore: 100, weight: 25, status: 'optimal', summary: 'Restoration of facial third proportions.' },
      { domain: 'Airway Volumetric Safety', score: 94, maxScore: 100, weight: 15, status: 'optimal', summary: 'Pharyngeal airway maintained >15.2 cm³.' }
    ],
    measurements: [
      { id: 'm-901', name: 'Occlusal Cant Angle', landmark: 'Maxillary Occlusal Plane to Orbitale', preOp: 4.8, postOp: 0.3, change: -4.5, unit: '°', expectedRange: [0.0, 1.0], status: 'within-norm', category: 'Skeletal' }
    ],
    evidence: [
      { id: 'ev-901', findingTitle: 'Cant Correction Stability', findingDescription: 'Bilateral maxillary vertical heights symmetrical within 0.5mm.', rubricCode: 'RUB-CANT-01', rubricRule: 'Occlusal Cant Correction Tolerance <= 1.0°', radiographicSource: 'Coronal Reformat CT', confidence: 98.4, impact: 'positive' }
    ],
    files: [
      { id: 'f-901', name: 'Bimax_PostOp_6W_CBCT.nii', type: 'CBCT', size: '144 MB', uploadDate: '2026-09-22', url: '/imaging/ct-3d.png', viewType: '3d', isKeyImaging: true }
    ]
  },
  {
    id: 'case-110',
    caseNumber: 'MX-2026-0900',
    patientName: 'Kareem Nasser',
    patientId: 'MRN-773120',
    age: 38,
    gender: 'Male',
    procedure: 'Distraction Osteogenesis',
    stage: 'Intermediate (6 Months)',
    status: 'completed',
    lastUpdated: '2 weeks ago',
    surgeryDate: '2026-03-18',
    primarySurgeon: 'Dr. Tariq Al-Mansoor, DDS',
    evaluator: 'SADIE Evaluator v3.2',
    ownerId: 'usr-4',
    isShared: false,
    score: 88.5,
    confidenceInterval: [85.9, 91.1],
    needsAttention: false,
    notes: 'Unilateral mandibular ramus distraction for hemifacial microsomia Pruzansky Type II.',
    domainScores: [
      { domain: 'Distraction Gap Consolidation', score: 89, maxScore: 100, weight: 35, status: 'acceptable', summary: '18mm regenerat completely mineralized with cortical continuity.' },
      { domain: 'Symmetry Restoration', score: 87, maxScore: 100, weight: 35, status: 'acceptable', summary: 'Chin point brought within 2.1mm of facial midline.' },
      { domain: 'Airway Remodeling', score: 90, maxScore: 100, weight: 30, status: 'optimal', summary: 'Base of tongue pulled forward with 22% volume expansion.' }
    ],
    measurements: [
      { id: 'm-1001', name: 'Ramus Distraction Length', landmark: 'Distractor Vector Pin Distance', preOp: 0.0, postOp: 18.2, change: +18.2, unit: 'mm', expectedRange: [16.0, 20.0], status: 'within-norm', category: 'Skeletal' }
    ],
    evidence: [
      { id: 'ev-1001', findingTitle: 'Regenerate Mineralization Density', findingDescription: 'Distraction gap demonstrates mature trabecular architecture matching native ramus bone density.', rubricCode: 'RUB-DIS-02', rubricRule: 'Distraction Regenerate Mineralization Index', radiographicSource: 'Axial and 3D Reconstructed CT', confidence: 93.6, impact: 'positive' }
    ],
    files: [
      { id: 'f-1001', name: 'Ramus_Distraction_6Mo_CT.dcm', type: 'CT 3D', size: '155 MB', uploadDate: '2026-09-18', url: '/imaging/ct-3d.png', viewType: '3d', isKeyImaging: true }
    ]
  },
  {
    id: 'case-111',
    caseNumber: 'MX-2026-0901',
    patientName: 'Grace Holloway',
    patientId: 'MRN-442190',
    age: 23,
    gender: 'Female',
    procedure: 'Le Fort I Osteotomy',
    stage: 'Early Follow-up (6 Weeks)',
    status: 'completed',
    lastUpdated: '2 weeks ago',
    surgeryDate: '2026-07-29',
    primarySurgeon: 'Dr. Claire Beauchamp, DMD',
    evaluator: 'SADIE Evaluator v3.2',
    ownerId: 'usr-5',
    isShared: true,
    score: 93.9,
    confidenceInterval: [91.7, 95.9],
    needsAttention: false,
    notes: 'Maxillary advancement 5.0mm with bone grafting in cleft lip and palate secondary deformity.',
    domainScores: [
      { domain: 'Advancement Accuracy', score: 95, maxScore: 100, weight: 40, status: 'optimal', summary: 'A-point advancement verified within 0.3mm of target.' },
      { domain: 'Alveolar Cleft Graft Integration', score: 92, maxScore: 100, weight: 35, status: 'optimal', summary: 'Continuous bone bridge across pyriform margin.' },
      { domain: 'Velopharyngeal Function', score: 94, maxScore: 100, weight: 25, status: 'optimal', summary: 'Speech hypernasality avoided through controlled advancement.' }
    ],
    measurements: [
      { id: 'm-1101', name: 'Maxillary Advancement', landmark: 'A-Point to Coronal Ref', preOp: 0.0, postOp: 5.1, change: +5.1, unit: 'mm', expectedRange: [4.8, 5.5], status: 'within-norm', category: 'Skeletal' }
    ],
    evidence: [
      { id: 'ev-1101', findingTitle: 'Stable Rigid Fixation', findingDescription: '4 pre-bent titanium plates positioned at piriform and buttresses without screw loosening.', rubricCode: 'RUB-FIX-01', rubricRule: 'Rigid Osteosynthesis Placement Precision', radiographicSource: 'CBCT 3D Surface Model', confidence: 96.5, impact: 'positive' }
    ],
    files: [
      { id: 'f-1101', name: 'LeFort_Cleft_PostOp_CBCT.dcm', type: 'CBCT', size: '130 MB', uploadDate: '2026-08-30', url: '/imaging/ct-3d.png', viewType: '3d', isKeyImaging: true }
    ]
  },
  {
    id: 'case-112',
    caseNumber: 'MX-2026-0902',
    patientName: 'Lucas Lindqvist',
    patientId: 'MRN-819302',
    age: 28,
    gender: 'Male',
    procedure: 'BSSO (Bilateral Sagittal Split)',
    stage: 'Early Follow-up (6 Weeks)',
    status: 'failed',
    lastUpdated: '3 weeks ago',
    surgeryDate: '2026-07-14',
    primarySurgeon: 'Dr. Marcus Sterling, DMD',
    evaluator: 'SADIE Evaluator v3.2',
    ownerId: 'usr-2',
    isShared: false,
    score: undefined,
    needsAttention: true,
    attentionReason: 'Severe dental metallic scattering on postoperative CBCT corrupted occlusal surface segmentation. Requires Scatter Reduction filter re-run.',
    notes: 'Mandibular setback with bilateral sagittal split osteotomy. Severe scatter from orthodontic brackets.',
    domainScores: [],
    measurements: [],
    evidence: [],
    files: [
      { id: 'f-1201', name: 'BSSO_PostOp_Scatter_CBCT.dcm', type: 'CBCT', size: '112 MB', uploadDate: '2026-07-28', url: '/imaging/ct-3d.png', viewType: '3d', isKeyImaging: true }
    ]
  }
];

export const mockKnowledgeDocuments: KnowledgeDocument[] = [
  {
    id: 'doc-1',
    title: 'SADIE Clinical Outcome Rubrics & Assessment Matrix (v3.2)',
    category: 'Clinical Rubrics',
    version: '3.2',
    lastUpdated: '2026-09-15',
    pages: 34,
    author: 'International Maxillofacial Consensus Board & SADIE Core',
    summary: 'Standardized quantitative scoring rubric across 4 clinical domains: Occlusion, Skeletal Symmetry, Soft Tissue Harmony, and Airway Volumetric Safety.',
    contentMarkdown: `# SADIE Clinical Outcome Rubrics v3.2
## Objective
Define standardized automated evaluation thresholds for maxillofacial and orthognathic surgical outcomes from multi-modality CT/CBCT imaging.

### Scoring Domains
1. **Occlusal Relationship (35%)**: Overjet (1.5–2.5mm), Overbite (1.0–2.5mm), Midline dental concordance (<= 1.0mm).
2. **Skeletal Symmetry (25%)**: ANS, Pog, Me deviation from midsagittal plane <= 1.5mm. Condylar seat variation <= 1.0mm.
3. **Soft Tissue Harmony (25%)**: Nasolabial angle (95–110°), Mentocervical angle, Holdaway ratio adherence.
4. **Airway Volumetric Safety (15%)**: Minimal retroglossal cross-sectional area expansion > 20% without retropalatal collapse.
`
  },
  {
    id: 'doc-2',
    title: 'Cephalometric Norms & 3D Skeletal Landmark Directory',
    category: 'Cephalometrics',
    version: '2.8',
    lastUpdated: '2026-08-01',
    pages: 42,
    author: 'Craniofacial Anatomy Faculty',
    summary: 'Complete atlas of 48 standardized craniofacial anatomical landmarks (S, N, A, B, Pog, Gn, Me, Go, Ba, ANS, PNS, Or, Po) with 3D coordinate detection criteria.',
    contentMarkdown: `# Craniofacial Landmark Atlas
Detailed volumetric coordinates for machine-assisted landmark localization on CBCT and CT DICOM data.
`
  },
  {
    id: 'doc-3',
    title: 'CBCT & Multi-Slice CT Radiographic Acquisition Protocol',
    category: 'Imaging Protocols',
    version: '4.1',
    lastUpdated: '2026-07-20',
    pages: 18,
    author: 'Department of Diagnostic & Maxillofacial Radiology',
    summary: 'Mandatory field-of-view (FOV), slice thickness (<= 0.5mm), patient positioning in natural head position (NHP), and metal artifact reduction protocols.',
    contentMarkdown: `# Radiographic Acquisition Protocols
Ensure isotropic voxel dimension <= 0.4mm for sub-millimeter outcome accuracy.
`
  },
  {
    id: 'doc-4',
    title: 'Postoperative Asymmetry & Skeletal Relapse Tolerances',
    category: 'Quality Standards',
    version: '1.9',
    lastUpdated: '2026-06-11',
    pages: 26,
    author: 'Clinical Quality Advisory',
    summary: 'Evidence-based thresholds for acceptable physiologic bone remodeling vs clinically significant relapse (>2mm or >2° deviation) at 6 and 12-month intervals.',
    contentMarkdown: `# Asymmetry & Relapse Tolerances
Statistical margins for surgical stability after Le Fort I and BSSO osteotomies.
`
  },
  {
    id: 'doc-5',
    title: 'Vascularized Fibula Mandibular Reconstruction Guide',
    category: 'Surgical Guides',
    version: '2.1',
    lastUpdated: '2026-05-04',
    pages: 29,
    author: 'Craniofacial Reconstruction Core',
    summary: 'Surgical and radiographic guidelines for virtual surgical planning, neo-mandible contour symmetry, and endosseous implant rehabilitation.',
    contentMarkdown: `# Fibula Flap CAD/CAM Protocols
Virtual planning alignment, plate passivity criteria, and bone bridge density metrics.
`
  },
  {
    id: 'doc-6',
    title: 'Temporomandibular Joint Alloplastic Prosthesis Protocol',
    category: 'Surgical Guides',
    version: '1.4',
    lastUpdated: '2026-04-18',
    pages: 22,
    author: 'Biomechanical Standards Core',
    summary: 'Biomechanical verification standards for custom fossa-ramus prosthesis placement, screw fixation density, and condylar clearance.',
    contentMarkdown: `# TMJ Total Joint Replacement Standards
Screw vectors, fossa seat gap limits <= 0.5mm, and heterotopic bone surveillance.
`
  },
  {
    id: 'doc-7',
    title: 'Surgically Assisted Rapid Palatal Expansion (SARPE) Analysis',
    category: 'Clinical Rubrics',
    version: '2.0',
    lastUpdated: '2026-03-30',
    pages: 16,
    author: 'Clinical Advisory Board',
    summary: 'Differentiating skeletal expansion from dental tipping; anterior vs posterior diastema ratios; nasal airflow volume changes.',
    contentMarkdown: `# SARPE Outcome Criteria
Pyramidal osteotomy release verification and bilateral symmetry ratio analysis.
`
  },
  {
    id: 'doc-8',
    title: 'Soft Tissue Profile Prediction & Holdaway Analysis',
    category: 'Cephalometrics',
    version: '3.0',
    lastUpdated: '2026-02-14',
    pages: 31,
    author: 'Cephalometric Analysis Core',
    summary: 'Translational ratio models for hard-to-soft tissue changes (Upper lip to Maxilla 0.6:1, Lower lip to Mandible 0.9:1, Chin 1:1).',
    contentMarkdown: `# Soft Tissue Prediction Models
Photogrammetry and CBCT surface mesh fusion guidelines.
`
  },
  {
    id: 'doc-9',
    title: 'DICOM Scatter Reduction & AI Artifact Cleansing Standard',
    category: 'Imaging Protocols',
    version: '1.2',
    lastUpdated: '2026-01-22',
    pages: 15,
    author: 'Helena Rostov, MS & SADIE Radiomics Unit',
    summary: 'Iterative reconstruction algorithms and deep learning filters to suppress orthodontic streak artifacts without eroding thin cortical bone plates.',
    contentMarkdown: `# Scatter Reduction Algorithms
High-Z material beam hardening suppression for clear dental landmarking.
`
  },
  {
    id: 'doc-10',
    title: 'Maxillofacial Trauma ZMC 3-Point Fixation Assessment',
    category: 'Quality Standards',
    version: '2.4',
    lastUpdated: '2025-11-19',
    pages: 24,
    author: 'Trauma & Reconstruction Core',
    summary: 'Orbital volume symmetry, zygomatic arch alignment, and frontozygomatic/infraorbital rim alignment grading.',
    contentMarkdown: `# ZMC Trauma Grading
Orbital volume reconstruction tolerance within <= 1.2 cm³ of uninjured contralateral orbit.
`
  }
];

export const mockRubricCriteria: RubricCriterion[] = [
  { id: 'RC-1', code: 'RUB-OCC-01', title: 'Overjet Normalization', domain: 'Occlusal Relationship', weight: 15, targetRange: '1.5 – 2.5 mm', toleranceMm: 0.5, description: 'Horizontal distance between upper and lower incisal edges in centric occlusion.', updatedInVersion: 'v3.2' },
  { id: 'RC-2', code: 'RUB-OCC-02', title: 'Overbite Normalization', domain: 'Occlusal Relationship', weight: 10, targetRange: '1.0 – 2.5 mm', toleranceMm: 0.5, description: 'Vertical overlap of upper incisors over lower incisors.', updatedInVersion: 'v3.2' },
  { id: 'RC-3', code: 'RUB-OCC-03', title: 'Dental Midline Concordance', domain: 'Occlusal Relationship', weight: 10, targetRange: '0.0 – 1.0 mm', toleranceMm: 0.5, description: 'Alignment of maxillary and mandibular dental midlines to each other.', updatedInVersion: 'v3.1' },
  { id: 'RC-4', code: 'RUB-SYM-01', title: 'Skeletal Midline Alignment', domain: 'Skeletal Symmetry', weight: 15, targetRange: '< 1.5 mm deviation', toleranceMm: 0.8, description: 'Perpendicular deviation of ANS, Pog, and Me from mid-sagittal plane.', updatedInVersion: 'v3.2' },
  { id: 'RC-5', code: 'RUB-SYM-02', title: 'Occlusal Cant Correction', domain: 'Skeletal Symmetry', weight: 10, targetRange: '< 1.0° roll', toleranceMm: 0.5, description: 'Transverse tilt of occlusal plane relative to interpupillary/orbitale line.', updatedInVersion: 'v3.0' },
  { id: 'RC-6', code: 'RUB-ST-01', title: 'Nasolabial Angle', domain: 'Soft Tissue Harmony', weight: 15, targetRange: '95° – 110°', toleranceMm: 2.0, description: 'Angle formed between columella and philtrum of upper lip.', updatedInVersion: 'v3.2' },
  { id: 'RC-7', code: 'RUB-ST-02', title: 'Pogonion Soft-Tissue Projection', domain: 'Soft Tissue Harmony', weight: 10, targetRange: 'Holdaway Line ± 1.5mm', toleranceMm: 1.0, description: 'Soft tissue chin projection relative to facial plane.', updatedInVersion: 'v3.0' },
  { id: 'RC-8', code: 'RUB-AIR-01', title: 'Retroglossal Airway Volume', domain: 'Airway Volumetric Safety', weight: 15, targetRange: '> 14.0 cm³ total', toleranceMm: 1.5, description: 'Minimal cross-sectional airway area expansion in retropalatal & retroglossal spaces.', updatedInVersion: 'v3.2' }
];

export const mockRubricVersions: RubricVersion[] = [
  {
    version: 'v3.2',
    releaseDate: 'September 2026',
    status: 'active',
    reviewedBy: 'International Consensus Board & Chief OMFS Faculty',
    changelog: [
      'Refined retroglossal airway scoring using volumetric CFD dynamic safety thresholds',
      'Integrated CAD/CAM surgical splint discrepancy tracking under 0.5mm tolerance',
      'Added custom titanium plate passivity evaluation rules'
    ]
  },
  {
    version: 'v3.1',
    releaseDate: 'January 2026',
    status: 'archived',
    reviewedBy: 'Consensus Quality Board',
    changelog: [
      'Expanded dental midline concordance to account for asymmetric tooth dimensions',
      'Added automated 3D mesh curvature analysis for sliding genioplasty step defects'
    ]
  },
  {
    version: 'v3.0',
    releaseDate: 'June 2025',
    status: 'archived',
    reviewedBy: 'Maxillofacial Radiomics Working Group',
    changelog: [
      'Initial transition from 2D cephalometric lines to fully volumetric 3D coordinate evaluation',
      'Introduced confidence interval estimation based on CT voxel resolution'
    ]
  }
];

export const mockCopilotConversations: CopilotConversation[] = [
  {
    id: 'conv-1',
    title: 'Eleanor Vance-Cole Skeletal Stability Review',
    caseId: 'case-101',
    caseName: 'Eleanor Vance-Cole (MX-2026-0891)',
    createdAt: '2026-10-10 14:20',
    updatedAt: '2026-10-10 14:45',
    messages: [
      {
        id: 'msg-1',
        role: 'user',
        userName: 'Clinical Evaluator',
        content: 'Review 3D cephalometric landmark stability and airway clearance.',
        timestamp: '12:04 AM'
      },
      {
        id: 'msg-2',
        role: 'assistant',
        content: 'Analysis for query: "Cephalometric Stability" scoped to case Eleanor Vance-Cole (MX-2026-0891):',
        timestamp: '12:04 AM',
        thinkingTrace: {
          duration: '3m38s',
          isFinished: true,
          searched: [
            { label: 'acedesign.io' },
            { label: 'LinkedIn - Ace Design...' },
            { label: 'X - Ace Design News' },
            { label: 'AI Search' }
          ],
          steps: [
            'Drafting your positioning brief...',
            'Checking patient operative note records...',
            'Retrieving high-resolution CBCT volumetric landmarks...',
            'Another idea could explore user interactions.',
            'Evaluating different color schemes for usability.',
            'Finish thinking node'
          ]
        },
        clinicalDossier: {
          primarySources: [
            {
              badge: 'Op Note',
              category: 'Operative Note',
              title: 'Operative Transcription (Section 4)',
              subtitle: 'Surgical Registry • Verified'
            },
            {
              badge: 'Pathology',
              category: 'Pathology Record',
              title: 'Surgical Histopathology Report',
              subtitle: 'Pathology Accession PATH-2026-4491'
            },
            {
              badge: 'NSQIP',
              category: 'Quality Standard',
              title: 'NSQIP Quality Standard Benchmark',
              subtitle: 'National Surgical Quality Advisory'
            }
          ],
          title: 'Hi: Clinical Evaluation',
          scopedCaseName: 'Eleanor Vance',
          scopedCaseId: 'CAS-8821',
          findings: [
            {
              text: 'Adherence verified against operative transcription',
              badge: 'Op Note'
            },
            {
              text: 'Histopathology examination confirms benign tissue morphology with negative surgical margins',
              badge: 'Pathology'
            },
            {
              text: 'Procedural benchmarks remain compliant with NSQIP criteria',
              badge: 'NSQIP'
            }
          ],
          contextNote: 'Grounded in all standard dossier records and quality metrics for this case.',
          recommendation: 'Patient records reflect low complication risk (Low (2.4%)). Continue planned clinical protocol.'
        },
        nestedCard: {
          title: 'SADIE Evaluator Outcome Metric',
          badge: 'Score: 94.6% (Optimal)',
          stat1: 'Airway Gain: +28.4% (16.4 cm³)',
          stat2: 'ANB Normalized: 2.7° (Target 2.0°)',
          stat3: 'Midline Deviation: < 0.4 mm',
          summary: 'Bimaxillary osteotomy meets all Level-1 rubric criteria with high clinical confidence (95% CI: 92.8% - 96.4%).'
        },
        suggestions: [
          'What is the risk of condylar resorption in this case?',
          'Compare pre-op vs post-op Holdaway soft tissue profile.',
          'Export clinical summary report as PDF.'
        ]
      }
    ]
  },
  {
    id: 'conv-2',
    title: 'Global Cohort Asymmetry Trends',
    caseId: undefined, // All cases
    caseName: 'All Cases (Global Context)',
    createdAt: '2026-10-09 11:00',
    updatedAt: '2026-10-09 11:30',
    messages: [
      {
        id: 'msg-201',
        role: 'user',
        content: 'Across our 12 recent cases, what procedure has the highest average outcome score and lowest variance?',
        timestamp: '11:00'
      },
      {
        id: 'msg-202',
        role: 'assistant',
        content: 'Across your clinic\'s active registry, Genioplasty and Bimaxillary Osteotomies demonstrate the highest average outcome scores:\n\n1. **Genioplasty**: 97.1% average score with very tight standard deviation (±0.8%).\n2. **Bimaxillary Osteotomy**: 95.2% average score across 3 evaluated patients.\n3. **SARPE**: 93.4% average with minimal crown tipping.\n\nTwo cases currently flag for attention due to imaging artifacts (ZMC fracture motion artifact and BSSO dental scatter).',
        timestamp: '11:01',
        suggestions: [
          'Show me the 2 cases that need attention.',
          'Which procedures have the highest airway volume expansion rates?',
          'Generate a quarterly performance chart.'
        ]
      }
    ]
  }
];
