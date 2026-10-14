# SADIE — Maxillofacial Surgical Outcome Evaluator

SADIE is a clinical web application for evaluating orthognathic and maxillofacial surgical outcomes using multiplanar radiographic assessment (3D CT volume, axial, coronal, and lateral cephalometric X-ray), automated anatomical landmark tracking, and standardized consensus scoring rubrics.

Built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, and **React Router**.

---

## 1. Quick Start

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation & Running Locally
```bash
# Install dependencies
npm install

# Start development server
npm run dev
# The application will be running at http://localhost:5173/

# Typecheck and build production bundle
npm run build

# Preview production bundle
npm run preview
```

---

## 2. Design System Tokens Used (`DESIGN_SYSTEM.md`)

All design tokens from section 9 of `DESIGN_SYSTEM.md` were directly mapped into `tailwind.config.ts` and `src/index.css`:

| Category | Token | Value | Clinical Application |
|---|---|---|---|
| **Canvas** | `bg-base` | `#0A0A0A` | Deep calm canvas for high contrast DICOM & radiomic views |
| **Panels** | `bg-surface` | `#141414` | Clinical cards, inputs, and multiplanar viewports |
| **Elevated** | `bg-elevated` | `#1C1C1C` | Dropdowns, table hover rows, active chips |
| **Typography** | `font-serif` | `"Lora", Georgia, serif` | Editorial headlines, H1/H2, KPI score displays |
| **Typography** | `font-sans` | `"Inter", system-ui, sans-serif` | Dense clinical data, measurements, and table text |
| **Radius** | `radius-pill` | `999px` | Buttons, badges, chips, search pills, chat bubbles |
| **Radius** | `radius-lg` | `16px` | Feature cards, viewport frames |
| **Radius** | `radius-md` | `12px` | Modals, drawers, inputs |
| **Hairlines** | `border-subtle` | `rgba(255, 255, 255, 0.25)` | Pill borders, active badge outlines |
| **Hairlines** | `border-hairline` | `rgba(255, 255, 255, 0.12)` | Subtle panel and table row dividers |

### Design System Extensions Added
To adapt the original marketing page design system for a dense clinical tool:
1. **Restrained Clinical Status Palette**:
   - `status-completed` (`#4E9A4B` / `#18301C` leaf green): Successful analysis with 95% CI computed.
   - `status-processing` (`#E58A3A` / `#3B230D` amber with animated pulse): Radiomic DICOM segmentation running.
   - `status-failed` (`#C8623C` / `#361515` terracotta red): Imaging artifact or registration failure.
   - `status-draft` (`#7A7A7A` / `#1E1E1E` muted gray): Pre-operative baseline without post-op scan.
2. **Clinical Readability Typography Scale**:
   - Raised body, measurement, and table text to **13–14px** (with monospace font for millimeter/degree landmarks) to guarantee WCAG AA legibility in high-density surgical tables.
3. **Multiplanar Radiographic Viewer**:
   - Added interactive CT volume, axial, coronal, and lateral cephalometric views with zoom (60%–200%), landmark overlay toggles (ANS, PNS, Pog, Me), and pre/post split comparison slider.
4. **Report Preview Drawer**:
   - Dossier with PDF preview, JSON export, and instant browser print formatting.

---

## 3. Application Structure

```
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx         # Responsive sidebar, topbar, mobile drawer, new case modal
│   │   │   └── CommandPalette.tsx    # Global Cmd/Ctrl+K search modal
│   │   ├── ui/
│   │   │   ├── Button.tsx            # Pill primary, secondary, outline, ghost, icon
│   │   │   ├── Badge.tsx             # Eyebrow badges & pill badges
│   │   │   ├── Chip.tsx              # Filter chips & suggestion prompts
│   │   │   ├── Card.tsx              # Dark container cards (radius-lg, radius-md)
│   │   │   ├── Input.tsx             # Dark panel input with focus ring
│   │   │   ├── Table.tsx             # Dense clinical table with 13-14px font
│   │   │   ├── Tabs.tsx              # Pill & underline tab navigation
│   │   │   ├── Drawer.tsx            # Slide-over drawer with backdrop blur
│   │   │   ├── Modal.tsx             # Accessible dialog with ESC close
│   │   │   ├── Toast.tsx             # Clinical notification toast provider & hook
│   │   │   ├── KpiCard.tsx           # Lora serif KPI metric cards
│   │   │   ├── ChatBubble.tsx        # Section 6 chat mockup bubble with nested cards
│   │   │   ├── StatusPill.tsx        # Restrained status pills with animated pulse
│   │   │   └── index.ts              # Component exports
│   │   └── workspace/
│   │       └── ImagingViewer.tsx     # Pre vs post multiplanar CT & X-ray viewer
│   ├── data/
│   │   └── mockData.ts               # 12 clinical cases, 6 users, 10 knowledge docs, rubrics
│   ├── pages/
│   │   ├── Home.tsx                  # 4 KPIs, Needs Attention list, Recent cases
│   │   ├── Cases.tsx                 # Full table, filter chips, action row menus
│   │   ├── CaseWorkspace.tsx         # 4 Tabs: Overview, Measurements, Evidence, Files + Copilot slide-over
│   │   ├── Insights.tsx              # Recharts Scores histogram, Trends, and Case Comparison
│   │   ├── Knowledge.tsx             # Documents PDF viewer, Rubric v3.2 & history, Imaging standards
│   │   ├── Copilot.tsx               # Chat thread, context picker (All cases or specific), prompt chips
│   │   └── Users.tsx                 # Clinical user administration & invite modal
│   ├── services/
│   │   └── api.ts                    # Async mock API layer (ready to swap with real REST/GraphQL)
│   ├── types/
│   │   └── index.ts                  # TypeScript clinical domain interfaces
│   ├── App.tsx                       # React Router configuration
│   ├── index.css                     # Design tokens, motion rules, scrollbars
│   └── main.tsx                      # Root mount
├── tailwind.config.ts                # Tailwind design token mapping
└── index.html                        # Google Fonts (Lora, Inter)
```

---

## 4. Key Pages & Features

1. **Home (`/dashboard`)**:
   - 4 KPI cards: Total Cases (12), In Progress (1), Completed (8), Average Score (93.8%).
   - "Needs Attention" list highlighting imaging artifacts (e.g., motion blur, scatter) with 1-click retry.
   - Recent cases table with direct link to workspace.
   - Primary "New Case" pill button opening a structured clinical entry modal.

2. **Cases Directory (`/cases`)**:
   - Complete table of surgical records with search by patient, procedure, MRN, or surgeon.
   - Filter chips: All Cases, My Cases, Shared with Me, Status toggles, and Procedure dropdown.
   - Row menu: Open Workspace, Run Analysis, Share, Export JSON, Duplicate, Archive, Delete.

3. **Case Workspace (`/cases/:caseId`)**:
   - Header with patient demographics, procedure type, stage, Run Analysis, Share, and Report.
   - **Overview Tab**: Outcome score with 95% Confidence Interval, interactive Pre vs Post Multiplanar Imaging Viewer (CT 3D, axial, coronal, ceph X-ray with pan, zoom, split slider, fullscreen), domain breakdown, and key observations.
   - **Measurements Tab**: Quantitative table of pre-op, post-op, change (Δ), expected normative range, and status indicator, filterable by category (Skeletal, Dental, Soft Tissue, Airway).
   - **Evidence Tab**: Auditable chain linking radiographic findings to consensus rubric rules with confidence scores.
   - **Files Tab**: Upload zone for DICOM / STL / CBCT files with rename, replace, and delete controls.
   - **Case-Scoped Copilot**: Slide-over available from any tab for asking case-specific anatomical questions.
   - **Report Drawer**: Clinical dossier with PDF download, JSON export, and instant browser Print formatting.

4. **Insights (`/insights`)**:
   - **Scores**: Score distribution histogram and clinical domain performance using Recharts.
   - **Trends**: Longitudinal tracking of outcome accuracy and confidence over time.
   - **Compare**: Side-by-side comparative analysis of two selected cases across all metrics.

5. **Knowledge & Rubrics (`/knowledge`)**:
   - **Documents**: 10 clinical reference guides with category filters and interactive PDF viewer with page navigation, zoom, and fullscreen mode.
   - **Rubric**: Governing Consensus Rubric v3.2 specs with criteria table and historical changelog (v3.1, v3.0).
   - **Imaging Requirements**: Standardized CBCT/CT acquisition protocols, voxel resolution, FOV, and head positioning.

6. **Copilot Assistant (`/copilot`)**:
   - Conversation management: search past threads, create new threads, rename, and delete.
   - Context picker: Toggle between All Cases (global cohort) or any specific patient case.
   - Chat bubbles styled after `DESIGN_SYSTEM.md` Section 6 with nested outcome result cards, landmark measurement blocks, radiographic sources, and clickable suggestion chips.

7. **User Administration (`/users`)**:
   - Clinical staff roster with role filters (Chief Surgeon, Fellow, Resident, Radiologist, Admin).
   - Invite staff member modal and role edit / deactivate actions.
