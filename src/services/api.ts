import {
  CaseItem,
  UserItem,
  KnowledgeDocument,
  RubricCriterion,
  RubricVersion,
  CopilotConversation,
  CopilotMessage,
  SurgicalStage
} from '../types';

export interface ApiResponse<T> {
  data: T | null;
  error?: string | null;
  loading?: boolean;
  status: number;
  message?: string;
  timestamp?: string;
  count?: number;
}

export function wrapResponse<T>(data: T, message?: string, status: number = 200): ApiResponse<T> {
  return {
    data,
    error: null,
    loading: false,
    status,
    message,
    timestamp: new Date().toISOString()
  };
}
import {
  mockCases,
  mockUsers,
  mockKnowledgeDocuments,
  mockRubricCriteria,
  mockRubricVersions,
  mockCopilotConversations
} from '../data/mockData';

// Local in-memory state initialized from mock data
let casesState: CaseItem[] = [...mockCases];
let usersState: UserItem[] = [...mockUsers];
let knowledgeDocsState: KnowledgeDocument[] = [...mockKnowledgeDocuments];
let conversationsState: CopilotConversation[] = [...mockCopilotConversations];

const delay = (ms: number = 180) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  // Case APIs
  async getCases(filter?: {
    search?: string;
    tab?: 'all' | 'mine' | 'shared';
    status?: string;
    procedure?: string;
    currentUserId?: string;
  }): Promise<CaseItem[]> {
    await delay();
    let result = [...casesState];

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        c =>
          c.caseNumber.toLowerCase().includes(q) ||
          c.patientName.toLowerCase().includes(q) ||
          c.patientId.toLowerCase().includes(q) ||
          c.procedure.toLowerCase().includes(q)
      );
    }

    if (filter?.tab === 'mine' && filter.currentUserId) {
      result = result.filter(c => c.ownerId === filter.currentUserId);
    } else if (filter?.tab === 'shared') {
      result = result.filter(c => c.isShared);
    }

    if (filter?.status && filter.status !== 'all') {
      result = result.filter(c => c.status === filter.status);
    }

    if (filter?.procedure && filter.procedure !== 'all') {
      result = result.filter(c => c.procedure === filter.procedure);
    }

    return result;
  },

  async getCaseById(id: string): Promise<CaseItem | null> {
    await delay();
    const found = casesState.find(c => c.id === id);
    return found ? { ...found } : null;
  },

  async createCase(data: Partial<CaseItem>): Promise<CaseItem> {
    await delay();
    const newId = `case-${Date.now()}`;
    const newCaseNumber = `MX-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCase: CaseItem = {
      id: newId,
      caseNumber: newCaseNumber,
      patientName: data.patientName || 'Anonymous Patient',
      patientId: data.patientId || `MRN-${Math.floor(100000 + Math.random() * 899999)}`,
      age: data.age || 30,
      gender: data.gender || 'Female',
      procedure: data.procedure || 'Bimaxillary Osteotomy',
      stage: data.stage || 'Pre-Operative Planning',
      status: 'draft',
      lastUpdated: 'Just now',
      surgeryDate: data.surgeryDate || new Date().toISOString().split('T')[0],
      primarySurgeon: data.primarySurgeon || 'Primary Evaluator',
      evaluator: 'SADIE Evaluator v3.2',
      ownerId: 'usr-1',
      isShared: false,
      notes: data.notes || '',
      domainScores: [],
      measurements: [],
      evidence: [],
      files: [],
      ...data
    };
    casesState = [newCase, ...casesState];
    return newCase;
  },

  async updateCase(id: string, data: Partial<CaseItem>): Promise<CaseItem> {
    await delay();
    const index = casesState.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Case not found');
    casesState[index] = { ...casesState[index], ...data, lastUpdated: 'Just now' };
    return { ...casesState[index] };
  },

  async deleteCase(id: string): Promise<boolean> {
    await delay();
    casesState = casesState.filter(c => c.id !== id);
    return true;
  },

  async duplicateCase(id: string): Promise<CaseItem> {
    await delay();
    const original = casesState.find(c => c.id === id);
    if (!original) throw new Error('Case not found');
    const duplicated: CaseItem = {
      ...original,
      id: `case-${Date.now()}`,
      caseNumber: `${original.caseNumber}-COPY`,
      patientName: `${original.patientName} (Copy)`,
      status: 'draft',
      lastUpdated: 'Just now',
    };
    casesState = [duplicated, ...casesState];
    return duplicated;
  },

  async runAnalysis(id: string): Promise<CaseItem> {
    await delay(350);
    const index = casesState.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Case not found');

    const score = Math.round((88 + Math.random() * 9) * 10) / 10;
    const updated: CaseItem = {
      ...casesState[index],
      status: 'completed',
      score,
      confidenceInterval: [Math.round((score - 1.8) * 10) / 10, Math.round((score + 1.8) * 10) / 10],
      needsAttention: false,
      attentionReason: undefined,
      lastUpdated: 'Just now',
      domainScores: [
        { domain: 'Occlusal Relationship', score: Math.round(score + 1), maxScore: 100, weight: 35, status: 'optimal', summary: 'Automated 3D occlusion evaluation complete.' },
        { domain: 'Skeletal Symmetry', score: Math.round(score - 1), maxScore: 100, weight: 25, status: 'optimal', summary: 'Craniofacial midline alignment verified.' },
        { domain: 'Soft Tissue Harmony', score: Math.round(score), maxScore: 100, weight: 25, status: 'optimal', summary: 'Facial profile contour harmony within normal limits.' },
        { domain: 'Airway Volumetric Safety', score: Math.round(score - 2), maxScore: 100, weight: 15, status: 'optimal', summary: 'Minimum cross sectional area evaluated.' },
      ]
    };
    casesState[index] = updated;
    return updated;
  },

  // Users APIs
  async getUsers(): Promise<UserItem[]> {
    await delay();
    return [...usersState];
  },

  async inviteUser(userData: Partial<UserItem>): Promise<UserItem> {
    await delay();
    const newUser: UserItem = {
      id: `usr-${Date.now()}`,
      name: userData.name || 'New Surgeon',
      email: userData.email || 'user@sadie-omfs.org',
      role: userData.role || 'Resident',
      status: 'Active',
      department: userData.department || 'Oral & Maxillofacial Surgery',
      casesCount: 0,
      lastActive: 'Just invited',
      ...userData
    };
    usersState = [...usersState, newUser];
    return newUser;
  },

  async updateUser(id: string, data: Partial<UserItem>): Promise<UserItem> {
    await delay();
    const idx = usersState.findIndex(u => u.id === id);
    if (idx === -1) throw new Error('User not found');
    usersState[idx] = { ...usersState[idx], ...data };
    return { ...usersState[idx] };
  },

  async deactivateUser(id: string): Promise<UserItem> {
    await delay();
    const idx = usersState.findIndex(u => u.id === id);
    if (idx === -1) throw new Error('User not found');
    usersState[idx] = {
      ...usersState[idx],
      status: usersState[idx].status === 'Suspended' ? 'Active' : 'Suspended'
    };
    return { ...usersState[idx] };
  },

  // Knowledge Documents & Rubric APIs
  async getKnowledgeDocs(): Promise<KnowledgeDocument[]> {
    await delay();
    return [...knowledgeDocsState];
  },

  async getRubricCriteria(): Promise<RubricCriterion[]> {
    await delay();
    return [...mockRubricCriteria];
  },

  async getRubricVersions(): Promise<RubricVersion[]> {
    await delay();
    return [...mockRubricVersions];
  },

  // Copilot APIs
  async getConversations(): Promise<CopilotConversation[]> {
    await delay();
    return [...conversationsState];
  },

  async createConversation(title: string, caseId?: string): Promise<CopilotConversation> {
    await delay();
    const targetCase = caseId ? casesState.find(c => c.id === caseId) : undefined;
    const newConvo: CopilotConversation = {
      id: `conv-${Date.now()}`,
      title,
      caseId,
      caseName: targetCase ? `${targetCase.patientName} (${targetCase.caseNumber})` : 'All Cases (Global)',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      updatedAt: 'Just now',
      messages: []
    };
    conversationsState = [newConvo, ...conversationsState];
    return newConvo;
  },

  async renameConversation(id: string, title: string): Promise<boolean> {
    await delay();
    const idx = conversationsState.findIndex(c => c.id === id);
    if (idx !== -1) {
      conversationsState[idx].title = title;
      return true;
    }
    return false;
  },

  async deleteConversation(id: string): Promise<boolean> {
    await delay();
    conversationsState = conversationsState.filter(c => c.id !== id);
    return true;
  },

  async sendMessage(convoId: string, text: string): Promise<CopilotMessage> {
    await delay(350);
    const convo = conversationsState.find(c => c.id === convoId);
    if (!convo) throw new Error('Conversation not found');

    const targetCase = convo.caseId ? casesState.find(c => c.id === convo.caseId) : casesState[0];

    const userMsg: CopilotMessage = {
      id: `msg-${Date.now()}-u`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    convo.messages.push(userMsg);

    const queryClean = text.trim();
    const queryLower = queryClean.toLowerCase();
    const caseName = targetCase ? targetCase.patientName : 'Eleanor Vance';
    const caseNum = targetCase ? targetCase.caseNumber : 'CAS-8821';
    const isGreeting = /^hi\b|^hello\b|^hey\b/i.test(queryClean);

    let responseText = `Analysis for query: "${queryClean}" scoped to case ${caseName} (${caseNum}). Computerized cephalometric landmarks and 3D surface mesh alignment confirm stability within the 95% confidence interval per SADIE Protocol v3.2.`;
    let findingsList = [
      { text: 'Adherence verified against operative transcription and CAD/CAM surgical plan', badge: 'Op Note' },
      { text: 'Histopathology examination confirms benign tissue morphology with negative surgical margins', badge: 'Pathology' },
      { text: 'Procedural benchmarks remain compliant with NSQIP quality standards', badge: 'NSQIP' }
    ];
    let recText = 'Patient records reflect low complication risk (Low (2.4%)). Continue planned clinical protocol.';
    let stat1 = 'Mean Error: 0.38 mm';
    let stat2 = 'Volume Delta: +18.2%';
    let stat3 = 'Confidence: 97.4%';
    let cardSummary = 'No critical anatomical interference or adverse bony displacement detected.';

    if (isGreeting) {
      responseText = "Hello! I am SADIE, your clinical AI assistant for maxillofacial radiomics and surgical evaluations. How can I assist your case review today?";
    } else if (queryLower.includes('summary') || queryLower.includes('executive')) {
      responseText = `Executive Surgical Summary for ${caseName} (${caseNum}): Underwent successful bimaxillary osteotomy with Le Fort I advancement (4.5mm) and BSSO setback. Occlusion is class I with overjet normalized to 2.1mm and overbite 1.8mm. Airway volume expanded by +28.4% without condylar sag.`;
      findingsList = [
        { text: 'Maxillary advancement 4.5mm executed within 0.2mm of CAD/CAM intermediate splint', badge: 'CAD/CAM' },
        { text: 'Mandibular setback with counter-clockwise rotation normalized ANB to +2.7°', badge: 'Ceph' },
        { text: 'Retroglossal airway minimum cross-sectional area increased from 82 mm² to 142 mm²', badge: 'Airway' }
      ];
      recText = 'Surgical objectives achieved. Advance patient to phase-2 orthodontic detailing.';
      stat1 = 'Score: 94.6%';
      stat2 = 'Airway: +28.4%';
      stat3 = 'Overjet: 2.1 mm';
      cardSummary = 'Optimal anatomical correction achieved across skeletal, dental, and airway domains.';
    } else if (queryLower.includes('anomaly') || queryLower.includes('alert') || queryLower.includes('displacement')) {
      responseText = `Anomaly Detection Scanner: Zero critical anatomical anomalies detected across multiplanar CT volume. Bilateral condyles seated concentric in glenoid fossae (<0.2mm variance). 4-hole L-plates and bicortical screws demonstrate rigid osseointegration without osteotomy gap non-union.`;
      findingsList = [
        { text: 'Condylar centric relation verified; zero rotational sag or posterior subluxation', badge: 'TMJ' },
        { text: 'Rigid fixation integrity: no plate bending, screw loosening, or micro-motion', badge: 'Hardware' },
        { text: 'Inferior alveolar nerve canal intact with >2.0mm osseous clearance from osteotomy cuts', badge: 'Neuro' }
      ];
      recText = 'No clinical intervention needed. Hardware remains fully stable.';
      stat1 = 'Hardware Sag: 0.0 mm';
      stat2 = 'Condylar Delta: 0.18 mm';
      stat3 = 'Risk: < 0.5%';
      cardSummary = 'Zero hardware displacement or condylar torque identified on volumetric scan.';
    } else if (queryLower.includes('predictive') || queryLower.includes('forecast') || queryLower.includes('relapse')) {
      responseText = `Predictive Analytics Model (24-Month Long-Term Stability): Projected relapse probability is 2.8% (95% CI: 1.6% - 3.9%). Biomechanical bone remodeling indicates robust osteogenesis at maxillary downfracture sites. Soft tissue profile concordance projected at 95.2%.`;
      findingsList = [
        { text: 'Biomechanical bone remodeling simulation predicts cortical bridging within 12 weeks', badge: 'Biomech' },
        { text: 'Soft-tissue nasolabial projection stability estimated at 96.1% at 24 months', badge: 'Aesthetics' },
        { text: 'Airway volumetric stability forecast remains consistent with low OSA risk profile', badge: 'Airway' }
      ];
      recText = 'Standard nighttime retention protocol recommended to preserve arch alignment.';
      stat1 = 'Relapse Risk: 2.8%';
      stat2 = 'Remodeling: 98.4%';
      stat3 = 'Confidence: 96.2%';
      cardSummary = 'High long-term stability projected with negligible risk of skeletal relapse.';
    } else if (queryLower.includes('imaging') || queryLower.includes('vector') || queryLower.includes('plane')) {
      responseText = `3D Imaging Vector Analysis: Maxillary occlusal plane inclination is 8.4° relative to the Frankfort Horizontal reference plane. Transverse roll deviation is 0.2° (within 0.5° clinical tolerance). Facial midline concordance with Menton is 0.3mm.`;
      findingsList = [
        { text: 'Occlusal plane pitch: 8.4° (Target: 8.0° ± 1.5°)', badge: 'Vector' },
        { text: 'Transverse roll discrepancy: 0.2° (Threshold: < 0.8°)', badge: 'Symmetry' },
        { text: 'Skeletal midline deviation (ANS-Me to N-Ba): 0.3 mm', badge: 'Midline' }
      ];
      recText = '3D surface alignment verifies optimal multiplanar orientation.';
      stat1 = 'Pitch: 8.4°';
      stat2 = 'Roll: 0.2°';
      stat3 = 'Yaw: 0.1°';
      cardSummary = 'Transverse and sagittal vectors align with planned CAD/CAM parameters.';
    } else if (queryLower.includes('landmark') || queryLower.includes('sella') || queryLower.includes('nasion')) {
      responseText = `Automated 3D Landmark Detection: 24 cephalometric landmarks identified with deep convolutional mesh regression (mean Euclidean error 0.22mm). SNA: 82.1°, SNB: 79.4°, ANB: 2.7°, Pogonion advancement: +4.2mm, Menton deviation: 0.2mm.`;
      findingsList = [
        { text: 'Sella-Nasion-A Point (SNA): 82.1° (Pre-op 77.2° -> Normal Range 80-84°)', badge: 'Skeletal' },
        { text: 'Sella-Nasion-B Point (SNB): 79.4° (Pre-op 83.5° -> Normal Range 78-82°)', badge: 'Skeletal' },
        { text: 'A Point-Nasion-B Point (ANB): 2.7° (Class I skeletal relationship normalized)', badge: 'Skeletal' }
      ];
      recText = 'All landmarks validated against Steiner and Tweed cephalometric norms.';
      stat1 = 'SNA: 82.1°';
      stat2 = 'SNB: 79.4°';
      stat3 = 'ANB: +2.7°';
      cardSummary = 'Automated 3D coordinates confirmed within 95% confidence intervals.';
    } else if (queryLower.includes('rubric') || queryLower.includes('scoring') || queryLower.includes('criteria')) {
      responseText = `Rubric Scoring Suggestions (NSQIP & OMFS Consensus v3.2): Occlusal Relationship: 96/100 (Optimal), Skeletal Symmetry: 93/100 (Optimal), Soft Tissue Harmony: 95/100 (Optimal), Airway Volumetric Safety: 94/100 (Optimal). Composite SADIE Outcome Score: 94.6%.`;
      findingsList = [
        { text: 'Domain 1 (Occlusal): 96 pts - Class I molar & canine relation, normalized overjet', badge: 'Domain 1' },
        { text: 'Domain 2 (Symmetry): 93 pts - Midline deviation under 0.5mm across all reference planes', badge: 'Domain 2' },
        { text: 'Domain 3 (Airway): 94 pts - Significant expansion of retroglossal volume', badge: 'Domain 3' }
      ];
      recText = 'Score meets criteria for Level-1 surgical excellence certification.';
      stat1 = 'Score: 94.6%';
      stat2 = 'Rubric: Level-1';
      stat3 = 'Adherence: 98.2%';
      cardSummary = 'Objective evaluation confirms optimal compliance with all clinical rubrics.';
    } else if (queryLower.includes('treatment') || queryLower.includes('recommendation') || queryLower.includes('engine')) {
      responseText = `Evidence-Based Treatment Recommendations: 1. Initiate light Class III guiding elastics (3/16", 4.5 oz) for 3 weeks to reinforce condylar seating. 2. Prescribe non-chewing soft diet for 4 additional weeks. 3. Perform 6-month CBCT follow-up for volumetric airway confirmation.`;
      findingsList = [
        { text: 'Neuromuscular rehabilitation protocol indicated for masticatory muscle adaptation', badge: 'Therapy' },
        { text: 'Physical therapy jaw exercises recommended starting week 7', badge: 'Rehab' },
        { text: 'Follow-up diagnostic radiographic assessment at 6 and 12 months', badge: 'Protocol' }
      ];
      recText = 'Follow standard post-operative management protocol with elastics guidance.';
      stat1 = 'Protocol: Phase-2';
      stat2 = 'Elastics: 3/16" 4.5oz';
      stat3 = 'Review: 6 Months';
      cardSummary = 'Treatment plan calibrated to maximize long-term skeletal and dental stability.';
    } else if (queryLower.includes('literature') || queryLower.includes('pubmed') || queryLower.includes('nsqip')) {
      responseText = `Integrated Clinical Literature Search: Synthesized evidence from 18 multi-center clinical trials (J Oral Maxillofac Surg, Int J Oral Maxillofac Surg). Relapse rates for rigid internal fixation in bimaxillary osteotomies average 3.1% ± 1.4%. Patient outcome exceeds peer benchmark thresholds.`;
      findingsList = [
        { text: 'Proffit et al. (2024): Skeletal stability hierarchy confirms maxillary impaction/advancement has >90% predictability', badge: 'Literature' },
        { text: 'Reyneke & Ferretti: Rigid bicortical fixation reduces sagittal relapse to under 1.0mm in 96% of cases', badge: 'Evidence' },
        { text: 'NSQIP OMFS Quality Advisory: Surgical site infection rate in clean-contaminated osteotomies is <1.2%', badge: 'NSQIP' }
      ];
      recText = 'Current clinical course is strongly supported by high-level evidence (Level-1A).';
      stat1 = 'Articles: 18 Studies';
      stat2 = 'Stability: >95%';
      stat3 = 'Evidence: Level-1A';
      cardSummary = 'Surgical procedure and outcome strongly corroborated by contemporary OMFS literature.';
    }

    // Generate intelligent AI response matching the exact structure from the user's images
    const aiResponse: CopilotMessage = {
      id: `msg-${Date.now()}-a`,
      role: 'assistant',
      content: responseText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      thinkingTrace: {
        duration: '2.4s',
        isFinished: true,
        searched: [
          { label: 'Patient CBCT Archive' },
          { label: 'Operative Transcription' },
          { label: 'Cephalometric Norms v3.2' },
          { label: 'NSQIP Clinical Rubric' }
        ],
        steps: [
          `Finding patient DICOM scan: ${caseName}_PostOp_CBCT.dcm...`,
          `Calculating 3D cephalometric landmarks (SNA, SNB, Pog, Menton)...`,
          `Calculating airway volumetric clearance and minimum cross-sectional area...`,
          `Verifying procedural benchmarks against NSQIP criteria...`,
          `Synthesizing clinical evaluation decision recommendation...`
        ]
      },
      clinicalDossier: {
        primarySources: [
          {
            badge: 'Op Note',
            category: 'Operative Note',
            title: 'Operative Transcription (Section 4)',
            subtitle: `Surgical Registry • Verified`
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
        title: `${queryClean}: Clinical Evaluation`,
        scopedCaseName: caseName,
        scopedCaseId: caseNum,
        findings: findingsList,
        contextNote: 'Grounded in all standard dossier records and quality metrics for this case.',
        recommendation: recText
      },
      nestedCard: {
        title: 'Evaluator Finding Summary',
        badge: 'Passed Level-1 Rubric',
        stat1,
        stat2,
        stat3,
        summary: cardSummary
      },
      suggestions: [
        'Scan for anatomical anomalies',
        'Forecast 24-month relapse risk',
        'Check NSQIP rubric domain scores'
      ]
    };

    convo.messages.push(aiResponse);
    convo.updatedAt = 'Just now';
    return aiResponse;
  }
};
