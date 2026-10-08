# ALIGNX — Real-Time Multi-Dimensional Career Intelligence & Decision Support Platform

[![DataQuest 3.0](https://img.shields.io/badge/Hackathon-DataQuest%203.0-blue.svg)](https://github.com/himanshu-1629/ALIGNX)
[![Challenge](https://img.shields.io/badge/Challenge-PRISM%20Engine-purple.svg)](https://github.com/himanshu-1629/ALIGNX)
[![Presentation Deck](https://img.shields.io/badge/Pitch%20Deck-Google%20Slides-orange.svg)](https://docs.google.com/presentation/d/1dWUnx_up_YXxmj7wloj-4Z_OMFGZoAhl/edit?usp=drive_link&ouid=102706534764800955072&rtpof=true&sd=true)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **ALIGNX** is a production-ready, full-stack career decision intelligence platform built for students and parents navigating high-stakes career pathways in India. Instead of generic personality quizzes or ungrounded generative chatbots, ALIGNX calculates career alignment across **5 real-world pillars**: **Student Aptitude & Interests**, **Household Financial Realities**, **Parent–Student Family Alignment**, **Live Labor Market Demand**, and **Geographic Relocation Limits**.

---

## 📽️ Project Presentation Deck (Google Slides)

📊 **Official Pitch Deck & Architecture Overview:**  
👉 **[ALIGNX Pitch Deck & System Architecture (Google Slides)](https://docs.google.com/presentation/d/1dWUnx_up_YXxmj7wloj-4Z_OMFGZoAhl/edit?usp=drive_link&ouid=102706534764800955072&rtpof=true&sd=true)**

---

## ⚡ Quick Demo: Try ALIGNX in 2 Minutes

ALIGNX includes a **Resilient Embedded MongoDB Engine** (`mongodb-memory-server`) that automatically initializes and seeds all 25 verified careers if your external MongoDB Atlas connection is unreachable. You can clone and run it instantly with **zero external database setup required**!

```bash
# 1. Clone the repository
git clone https://github.com/himanshu-1629/ALIGNX.git
cd ALIGNX

# 2. Start the Backend API (Port 5001)
cd backend
npm install
npm run dev

# 3. Start the Frontend Client (Port 5173 / 5174) in another terminal
cd ../frontend
npm install
npm run dev
```

Open **`http://localhost:5173`** (or the port Vite prints in your console) to explore the full interactive experience!

---

## 🎯 The Problem: Why Career Guidance in India Fails

Every year, millions of Indian students make irreversible educational and career decisions influenced by social prestige, peer pressure, or one-dimensional online tests:

1. **The Vacuum Assessment Trap**: Traditional psychometric tests measure personality traits in isolation, ignoring whether the student's family can afford the degree tuition.
2. **The Household Conflict Dilemma**: 78% of career friction occurs between parents (seeking financial stability and low risk) and students (seeking high growth and modern domains). There is no objective platform to mediate this trade-off.
3. **Outdated Speculative Information**: Advice relies on word-of-mouth rather than real labor economics, verified hiring trends, or authentic automation risk data.
4. **Black-Box AI Hallucinations**: Generic LLMs offer vague, unchecked advice like *"Follow your passion"* without mathematical risk analysis or ROI feasibility.

---

## 💡 The ALIGNX Solution

ALIGNX acts as an **objective, deterministic decision support engine**. It does not dictate a single career path; instead, it models multi-party trade-offs into quantifiable scores, transparent compromise solutions, and milestone-driven execution roadmaps:

```text
  ┌────────────────────────────────────────────────────────────────────────┐
  │                           ALIGNX USER JOURNEY                          │
  └───────────────────────────────────┬────────────────────────────────────┘
                                      │
  ┌───────────────────────────────────▼────────────────────────────────────┐
  │ 1. STAGE-AWARE ONBOARDING                                              │
  │    Class 10 • Class 12 • Undergrad • Postgrad • Working Professional   │
  └───────────────────────────────────┬────────────────────────────────────┘
                                      │
  ┌───────────────────────────────────▼────────────────────────────────────┐
  │ 2. TACTICAL DISCOVERY & UNIVERSAL APTITUDE ASSESSMENT                  │
  │    6 High-Stakes Dilemma Missions + 5 Universal Cognitive Reasoning    │
  │    Vectors (Logical, Numerical, Systemic, Spatial, Verbal)             │
  └───────────────────────────────────┬────────────────────────────────────┘
                                      │
  ┌───────────────────────────────────▼────────────────────────────────────┐
  │ 3. CAREER TWIN & TRANSFERABLE SKILLS RADAR                             │
  │    Real-time psychometric mapping, skill baselines, role adjacencies   │
  └───────────────────────────────────┬────────────────────────────────────┘
                                      │
  ┌───────────────────────────────────▼────────────────────────────────────┐
  │ 4. 5D DETERMINISTIC DECISION ENGINE & SENSITIVITY PIPELINE             │
  │    Student Fit (35%) + Financial Fit (20%) + Family Alignment (15%)    │
  │    + Market Fit (20%) + Location Fit (10%)                             │
  └───────────────────────────────────┬────────────────────────────────────┘
                                      │
  ┌───────────────────────────────────▼────────────────────────────────────┐
  │ 5. COLLABORATIVE FAMILY RECONCILIATION PORTAL                          │
  │    Dedicated Parent Portal (/parent/invite/:token)                     │
  │    Tuition limits, risk tolerance, Parent–Student Conflict Index       │
  └───────────────────────────────────┬────────────────────────────────────┘
                                      │
  ┌───────────────────────────────────▼────────────────────────────────────┐
  │ 6. TALENT ATLAS (GOVERNMENT & INDUSTRY GROUND-TRUTH)                   │
  │    MoSPI PLFS 2023-24, NASSCOM 2026, Wheebox ISR 2026 Telemetry        │
  └───────────────────────────────────┬────────────────────────────────────┘
                                      │
  ┌───────────────────────────────────▼────────────────────────────────────┐
  │ 7. WHAT-IF SCENARIO LAB & DYNAMIC 3-PHASE MILESTONE ROADMAP            │
  │    Live sensitivity levers + 0-36 month actionable execution plan      │
  │    powered by Google Gemini GenAI explanations                         │
  └────────────────────────────────────────────────────────────────────────┘
```

---

## 🌟 Core Modules & MVP Features

### 1. 🎓 Life-Stage Aware Student Onboarding
- Dynamic adaptation across 5 academic stages: **Class 10**, **Class 12**, **Undergraduate**, **Postgraduate**, and **Working Professional**.
- Configures household tuition ceilings, geographic relocation willingness, academic stream, and primary aspirational domains.

### 2. ⚡ 6 Tactical Missions (Career Discovery)
- Replaces tedious 50-question surveys with **6 high-stakes operational dilemma missions** (Autonomous Hardware, Frontier AI, Spatial UX, Crisis Mediation, Deep-Tech Venture, Critical Systems).
- **Stage-Calibrated Question Banks**: Dedicated psychometric items stored in `stageQuestionsData.ts` calibrated to the student's exact educational maturity.
- **Real-Time DNA Synthesis Equalizer HUD**: Live visualization of Holland RIASEC points (Realistic, Investigative, Artistic, Social, Enterprising, Conventional) accumulating in real time.
- Takes **under 60 seconds** to complete with tactile archetype cards and keyboard shortcuts (`1-4`, `Enter`).

### 3. 🧠 Universal Cognitive & IQ Aptitude Assessment
- Free of unfair computer science jargon—evaluates core cognitive capability across **5 universal reasoning vectors**:
  - **Logical Deduction**: Competitive sequence deduction and topological ordering.
  - **Numerical Patterns**: Exponential sequence recognition (`3, 7, 15, 31, 63, 127`).
  - **Systemic Problem Solving**: Multi-variable balance scale substitution.
  - **Spatial Orientation**: Mental rotation and cardinal compass orientation.
  - **Verbal Analogies**: Functional instrument and proportional relationships (`Compass:Navigation :: Thermometer:Temperature`).
- Features responsive feedback and instant keyboard navigation (`1-4`, `A-D`, `Enter`).

### 4. 🔮 Career Twin & Transferable Skills Radar
- Maps the student’s psychometric telemetry into a **Transferable Skills Vector**.
- Visualizes role adjacencies and skill transferability indices across emerging domains.
- Displays an interactive **3D Equilibrium Radar** illustrating balance across Analytical, Creative, Leadership, Execution, and Systematic traits.

### 5. ⚖️ 5D Deterministic Decision Engine & Sensitivity Pipeline
- **Zero Black-Box Guessing**: Career compatibility is computed with deterministic, mathematically provable multi-attribute formulas:
  $$\text{ALIGNX Score} = 0.35 \cdot S_{\text{fit}} + 0.20 \cdot F_{\text{fit}} + 0.15 \cdot A_{\text{family}} + 0.20 \cdot M_{\text{fit}} + 0.10 \cdot L_{\text{fit}}$$
- **Interactive Decision Architecture Pipeline**: Allows students to adjust pillar weight sliders to see how their career rankings dynamically shift when prioritizing family stability vs. market upside.
- Transparent score breakdown for every career showing exact percentages for each pillar.

### 6. 👨‍👩‍👦 Collaborative Family Portal & Conflict Reconciliation
- **Parent Invitation System**: Students generate secure, shareable invite links (`/parent/invite/:token`) with universal clipboard support.
- **Dedicated Parent Portal**: Parents independently submit tuition capacity (₹ Lakhs/year), risk appetite (Low, Moderate, High), and relocation boundaries.
- **Automated Conflict Reconciliation**: Calculates the **Parent–Student Conflict Index** and suggests concrete compromise careers that satisfy both student aspirations and family budgets.
- **"Fill as Parent" Direct Simulation**: Students can also simulate parental perspectives directly within the portal for testing or family discussions.

### 7. 🗺️ Talent Atlas (Grounded in MoSPI PLFS & NASSCOM Data)
- **Authentic Indian Economic Ground-Truth** (documented in `docs/DATA_SOURCES.md`):
  - **MoSPI PLFS (2023-24)**: Official labor force participation rates and urban youth unemployment benchmarks.
  - **NASSCOM Strategic Review 2026**: High-demand tech domains, starting packages, and AI talent demand-supply ratios.
  - **Wheebox India Skills Report 2026**: STEAM employability rates (54.2% national baseline).
  - **O*NET 31.0 & TeamLease**: Skill vectors and automation vulnerability discounts.
- **Clean, Spacious UI**: Light aesthetic with regional hub distributions (Bangalore, NCR, Hyderabad, Pune, Chennai), entry-to-peak salary trajectories, and hiring surge telemetry.
- **Interactive Provenance Modal**: Complete transparency into sample sizes, publication years, and methodology citations.

### 8. 🧪 Interactive What-If Scenario Lab
- Real-time sensitivity sandbox answering critical life questions:
  - *"What if my family's annual education budget increases by ₹5 Lakhs?"*
  - *"What if I relocate to Bangalore, NCR, or Pune?"*
  - *"What if I learn PyTorch, Distributed Systems, or Cloud Architecture?"*
  - *"What if my parents prefer higher job security over startup equity?"*
- Instantly recalculates 5D alignment scores without forcing the student to re-take assessments.

### 9. 🗺️ Dynamic 3-Phase Milestone Roadmap & AI Explanations
- **Personalized 3-Phase Milestone Plans**:
  - **Phase 1 (Months 0–6)**: Foundations, core prerequisite coursework, and baseline credentials.
  - **Phase 2 (Months 6–18)**: Applied execution, open-source portfolio development, and competitive internships.
  - **Phase 3 (Months 18–36)**: Specialization, target degree admissions, and Tier-1 industry placement.
- **Context-Aware Recommendations**: Tailored specifically to the chosen career (e.g., AI/ML Architect vs. Semiconductor Engineer vs. Product Strategist) and the student's current stage.
- **Google Gemini GenAI Explanations**: Generates empathetic, transparent narratives explaining why a pathway was recommended and how to mitigate potential family or financial risks.

---

## 📊 The 5-Pillar Mathematical Scoring Model

| Dimension | Weight | Mathematical Parameters & Inputs |
|---|:---:|---|
| **Student Fit ($S_{\text{fit}}$)** | **35%** | Skill overlap (35%), Cognitive aptitude vector (35%), Holland RIASEC synergy (30%) |
| **Financial Fit ($F_{\text{fit}}$)** | **20%** | Degree tuition vs. budget ceiling, household financial friction, ROI payback period |
| **Family Alignment ($A_{\text{family}}$)** | **15%** | Parental preference congruence, Parent–Student Conflict Index, risk divergence penalty |
| **Market Demand ($M_{\text{fit}}$)** | **20%** | 5-year growth trajectory, verified hiring surge index, automation vulnerability discount |
| **Location Fit ($L_{\text{fit}}$)** | **10%** | Regional industry tech clusters (Bangalore, Pune, Hyderabad, NCR), geographic mobility score |

### Conflict & Friction Metrics

- **Financial Friction Index ($FFI$)**:
  $$FFI = \max\left(0, \frac{\text{Required Tuition} - \text{Household Budget}}{\text{Required Tuition}}\right) \times 100$$
- **Parent–Student Conflict Index ($CI$)**:
  $$CI = \left(w_{\text{risk}} |\Delta \text{Risk}| + w_{\text{budget}} |\Delta \text{Budget}| + w_{\text{domain}} |\Delta \text{Domain}|\right) \times 100$$

---

## 🏗️ System Architecture

```text
┌────────────────────────────────────────────────────────────────────────┐
│                               FRONTEND                                 │
│             React 19 • TypeScript • Vite • Vanilla Design System       │
│  Onboarding │ 6 Missions Discovery │ Cognitive Aptitude │ Talent Atlas │
│  Decision Pipeline │ Family Portal │ What-If Lab │ Milestone Roadmap  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ REST API (HTTP JSON)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                              BACKEND API                               │
│                   Node.js • Express • TypeScript (tsx)                 │
│  Auth Middleware │ Assessment Controller │ Family Reconciliation       │
│  Market Telemetry Controller │ What-If Simulator │ Roadmap Controller │
└───────────────────────┬────────────────────────┬───────────────────────┘
                        │                        │
         ┌──────────────┘                        └──────────────┐
         ▼                                                      ▼
┌───────────────────────────────┐                      ┌──────────────────┐
│        DATABASE LAYER         │                      │ DECISION ENGINE  │
│  Primary: MongoDB Atlas       │                      │ (Deterministic)  │
│  Fallback: Embedded Engine    │                      │ 5-Pillar Scoring │
│  (100% Zero-Config Ingestion) │                      │ Sensitivity Math │
└───────────────────────────────┘                      └────────┬─────────┘
                                                                │
                                                       ┌────────┴─────────┐
                                                       ▼                  ▼
                                              ┌──────────────────┐ ┌────────────────┐
                                              │ CAREER KNOWLEDGE │ │  GEMINI GENAI  │
                                              │ 25 Grounded      │ │  Empathetic    │
                                              │ Benchmarks       │ │  Explanations  │
                                              └──────────────────┘ └────────────────┘
```

---

## 📁 Repository Structure

```text
ALIGNX/
├── backend/                       # Express + TypeScript REST API Server
│   ├── src/
│   │   ├── controllers/           # Assessment, Career, Family/Parent, Market, Roadmap
│   │   ├── engine/                # Deterministic scoringEngine.ts (5-pillar math)
│   │   ├── middleware/            # Auth, guest fallback, error handling
│   │   ├── models/                # Mongoose models (Career, Student, Family, Assessment)
│   │   ├── routes/                # Express API routes
│   │   ├── services/              # Gemini LLM service, market aggregators
│   │   └── validators/            # Request validators (parent, assessment, profile)
│   ├── package.json
│   └── tsconfig.json
├── frontend/                      # React 19 + TypeScript Client
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/            # AuthenticCompass, EquilibriumRadar3D, Modals
│   │   │   ├── modules/           # Onboarding, Discovery, Aptitude, Recommendations,
│   │   │   │                      # DecisionPipeline, ParentModule, TalentAtlas,
│   │   │   │                      # WhatIfModule, RoadmapModule, CareerTwinModule
│   │   │   └── portal/            # ParentInvitePortal (/parent/invite/:token)
│   │   ├── data/                  # stageQuestionsData.ts, allCareers.ts, mockAlignxData.ts
│   │   ├── services/              # ApiService REST client
│   │   ├── types/                 # TypeScript interfaces (alignx.ts)
│   │   └── utils/                 # sessionManager.ts (resilient offline/live sync)
│   ├── index.html
│   └── vite.config.ts
├── database/                      # Data assets & seeds
│   ├── data/raw/                  # mospi_plfs_2023_24.json (Raw Indian government data)
│   └── seeds/                     # careers.json (25 verified career benchmarks), skills.json
├── docs/                          # Comprehensive Technical Documentation
│   ├── DATA_SOURCES.md            # Complete Citations, Sample Sizes & Provenance
│   ├── PRD.md                     # Product Requirements Document
│   ├── TRD.md                     # Technical Requirements Document
│   ├── SYSTEM_ARCHITECTURE.md     # Detailed Micro-Architecture
│   ├── DATABASE_SCHEMA.md         # Schema Models & Indexes
│   ├── API_DOCUMENTATION.md       # Full REST API Contracts
│   ├── CAREER_SCHEMA_AND_METHODOLOGY.md # Career taxonomy and research formulas
│   └── USER_FLOW.md               # Visual state transitions & UX journeys
└── README.md                      # Project Overview & Quickstart Guide
```

---

## 🛠️ Installation & Setup Guide

### Prerequisites
- **Node.js**: v18.x or v20.x+ LTS
- **npm**: v9.x or higher
- **MongoDB** *(Optional)*: If you do not have a MongoDB Atlas cluster, the server will automatically launch the **Embedded In-Memory Engine** and seed all 25 careers.

### 1. Configure Environment Variables

**Backend (`backend/.env`):**
```env
PORT=5001
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/alignx
JWT_SECRET=alignx_jwt_secret_dev_key_2026
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Note: If `MONGODB_URI` is not set or network access is restricted, ALIGNX automatically falls back to its embedded database on `127.0.0.1`.)*

**Frontend (`frontend/.env`):**
```env
VITE_API_BASE_URL=http://localhost:5001/api/v1
```

### 2. Run the Development Servers

```bash
# Terminal 1: Backend API
cd backend
npm install
npm run dev

# Terminal 2: Frontend Client
cd frontend
npm install
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 🔌 API Endpoint Summary

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/auth/register` | Register a new student account |
| `POST` | `/api/v1/auth/login` | Authenticate and obtain JWT token |
| `POST` | `/api/v1/assessments/career-discovery/start` | Initialize 6-mission discovery assessment |
| `POST` | `/api/v1/assessments/aptitude/start` | Initialize universal cognitive assessment |
| `GET`  | `/api/v1/career-dna/me` | Fetch student Career DNA and Holland vectors |
| `POST` | `/api/v1/recommendations/:studentId/generate` | Generate deterministic 5D recommendations |
| `POST` | `/api/v1/parents/invite` | Create parental invite and generate secure link |
| `GET`  | `/api/v1/parents/invite/:token` | Fetch student context for parent verification |
| `POST` | `/api/v1/parents/invite/:token/submit` | Parent submits budget and risk perspective |
| `GET`  | `/api/v1/parents/status` | Fetch family profile and Parent–Student Conflict Index |
| `GET`  | `/api/v1/market/atlas` | Fetch labor market telemetry and MoSPI PLFS metrics |
| `POST` | `/api/v1/simulator/simulate` | Run real-time What-If sensitivity simulations |
| `GET`  | `/api/v1/roadmaps/:careerId` | Generate 3-phase milestone roadmap with Gemini |

*(For full request/response schemas, refer to [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md).)*

---

## 👥 Team & Ownership (DataQuest 3.0)

| Member | Primary Focus | Key Contributions |
|---|---|---|
| **Himanshu** | **AI/ML & Decision Engine** | 5-pillar mathematical scoring engine, Talent Atlas MoSPI/NASSCOM telemetry, What-If simulator engine, Career Twin transferable skills radar. |
| **Arpit** | **Data Architecture & Full-Stack** | Career benchmark database (25 careers), Google Gemini prompt engineering, collaborative family portal & parent reconciliation, life-stage personalized roadmap. |
| **Daksh** | **Frontend Experience & UI/UX** | Decision architecture pipeline, 6-mission tactical discovery, universal cognitive assessment, authentic compass visualizer, design system. |
| **OM** | **Backend Infrastructure & Systems** | Express REST API gateway, Mongoose models, resilient embedded database fallback, automated seeding pipelines, error handling. |

---

## 📑 Detailed Documentation Directory

For deep-dive technical evaluations, inspect the comprehensive guides in `/docs`:
- 📊 **[Pitch Deck & Architecture (Google Slides)](https://docs.google.com/presentation/d/1dWUnx_up_YXxmj7wloj-4Z_OMFGZoAhl/edit?usp=drive_link&ouid=102706534764800955072&rtpof=true&sd=true)**
- 📋 [Data Sources & Provenance Audit](docs/DATA_SOURCES.md)
- 🏗️ [System Architecture & Data Flows](docs/SYSTEM_ARCHITECTURE.md)
- 🔌 [Complete REST API Documentation](docs/API_DOCUMENTATION.md)
- 🗄️ [Database Schema & Entity Models](docs/DATABASE_SCHEMA.md)
- 📐 [Career Schema & Scoring Methodology](docs/CAREER_SCHEMA_AND_METHODOLOGY.md)
- 🎨 [UI/UX Specifications](docs/UI_UX.md)
- 🧪 [Testing & Validation Verification](docs/testing.md)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
