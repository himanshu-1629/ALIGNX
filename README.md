# ALIGNX — Real-Time Multi-Dimensional Career Intelligence & Decision Support Platform

[![DataQuest 3.0](https://img.shields.io/badge/Hackathon-DataQuest%203.0-blue.svg)](https://github.com/himanshu-1629/ALIGNX)
[![Challenge](https://img.shields.io/badge/Challenge-PRISM%20Engine-purple.svg)](https://github.com/himanshu-1629/ALIGNX)
[![Presentation Deck](https://img.shields.io/badge/Pitch%20Deck-Google%20Slides-orange.svg)](https://docs.google.com/presentation/d/1dWUnx_up_YXxmj7wloj-4Z_OMFGZoAhl/edit?usp=drive_link&ouid=102706534764800955072&rtpof=true&sd=true)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **ALIGNX** is an AI-powered, multi-dimensional career decision and discovery platform designed for students and parents navigating high-stakes career choices. Instead of generic personality quizzes or ungrounded chatbots, ALIGNX calculates career alignment across five real-world pillars: **Student Aptitude & Interests**, **Family Financial Realities**, **Parent–Student Alignment**, **Live Market Demand**, and **Geographic Hubs**.

---

## 📽️ Project Presentation Deck (PPT)

📊 **Access the official project slide deck here:**  
👉 **[ALIGNX Pitch Deck & System Architecture (Google Slides)](https://docs.google.com/presentation/d/1dWUnx_up_YXxmj7wloj-4Z_OMFGZoAhl/edit?usp=drive_link&ouid=102706534764800955072&rtpof=true&sd=true)**

---

## 🌟 The Core Problem & Vision

Traditional career counseling fails because it evaluates students in a vacuum—typically relying on dry, 50-question personality surveys while completely ignoring the practical boundaries that determine real-world success:

```text
      ┌────────────────────────┐
      │   STUDENT DIMENSION    │  (Cognitive Aptitude, RIASEC Holland Traits, Skills)
      └───────────┬────────────┘
                  │
                  ▼
      ┌────────────────────────┐
      │    FAMILY DIMENSION    │  (Education Budget, Affordability Margin, Risk Appetite)
      └───────────┬────────────┘
                  │
                  ▼
      ┌────────────────────────┐
      │    MARKET DIMENSION    │  (Verified Hiring Surges, Salary Bands, MoSPI/NASSCOM Data)
      └───────────┬────────────┘
                  │
                  ▼
      ┌────────────────────────┐
      │ ALIGNX DECISION ENGINE │  (Deterministic 5-Pillar Optimization Math)
      └───────────┬────────────┘
                  │
                  ▼
      ┌────────────────────────┐
      │    DECISION SUPPORT    │  (Ranked Pathways, What-If Twin, 3-Phase Roadmaps)
      └────────────────────────┘
```

**ALIGNX does not dictate what career a student must choose.** It serves as an objective, transparent **decision support engine** that synthesizes multi-party trade-offs into clear, actionable clarity.

---

## 🚀 Key Innovation Highlights

### 1. ⚡ Streamlined 6 Tactical Missions (Career Discovery)
- Replaced 18 tedious survey cards with **6 high-stakes dilemma missions** (Autonomous Hardware, Frontier AI, Spatial UX, Crisis Mediation, Deep-Tech Venture, and Critical System Integrity).
- **Interactive Gamification**: Live tactile archetype cards (`[HARDWARE ARCHITECT]`, `[RESEARCH SCIENTIST]`, etc.), keyboard shortcuts (`1-4`, `Enter`), and a **Real-Time DNA Synthesis Equalizer HUD** that visualizes Holland RIASEC points accumulating live.
- Takes **under 60 seconds** to complete while delivering mathematically rigorous psychometric inputs.

### 2. 🧠 Universal Cognitive & IQ Aptitude Assessment
- Replaced hyper-technical computer engineering jargon with **5 universal reasoning vectors** that test core cognitive capability regardless of background:
  - **Logical Deduction**: Competitive sequence ordering puzzle.
  - **Numerical Pattern**: Exponential doubling series recognition (`3, 7, 15, 31, 63, 127`).
  - **Systemic Problem Solving**: Multi-variable balance scale substitution.
  - **Spatial Orientation**: Cardinal compass mental rotation without 3D math.
  - **Verbal Analogy**: Functional instrument relationship (`Compass:Navigation :: Thermometer:Temperature`).
- Features instant keyboard navigation (`1-4`, `A-D`, `Enter`).

### 3. 🗺️ Talent Atlas with Verified Government & Industry Data
- **Live Market Telemetry**: Periodic 15-second background polling simulating real-time labor market shifts.
- **Verified Ground-Truth Sources** (as documented in `docs/DATA_SOURCES.md`):
  - **MoSPI PLFS (2023-24)**: Official labor force participation and urban youth unemployment baselines.
  - **NASSCOM Strategic Review 2026**: High-demand tech domains, starting packages, and AI talent demand-supply ratios.
  - **Wheebox India Skills Report 2026**: STEAM employability rates (54.2% national benchmark).
  - **O*NET 31.0 & TeamLease Primer**: Skill vectors, STEM automation risk, and hiring surge telemetry.
  - **NIRF & AICTE**: Higher education fee brackets and regional degree return-on-investment (ROI).
- **Data Provenance Modal**: Interactive source audit showing official publication years, sample sizes, and update cycles.

### 4. ⚖️ Deterministic 5-Pillar Decision Engine
- Zero black-box AI guessing. Career scores are calculated with transparent, testable mathematical formulas:
  $$\text{ALIGNX Score} = w_s S_{\text{fit}} + w_f F_{\text{fit}} + w_a A_{\text{family}} + w_m M_{\text{fit}} + w_l L_{\text{fit}}$$
- Integrates a **Financial Friction Index** and **Parent–Student Conflict Index** to identify viable compromise careers.

### 5. 🔮 Interactive "What-If" Career Twin Simulator & 3D Radar
- Allows students to simulate life changes in real time:
  - *"What if my education budget increases by ₹4 Lakhs?"*
  - *"What if I relocate to Bangalore or Hyderabad?"*
  - *"What if I acquire Distributed Systems or PyTorch skills?"*
- Features real-time sensitivity sliders, an **Authentic Compass**, and a **3D Equilibrium Radar**.

### 6. 🗺️ 3-Phase Milestone Roadmaps & Gemini LLM Explanations
- Actionable 3-tier milestone plans (**0–6 months**, **6–18 months**, **18–36 months**).
- Pinpoints skill deficits and specifies industry certifications, open-source projects, and target degree specializations.
- Employs Google Gemini LLMs to articulate empathetic, humanized explanations bridging quantitative scores into practical guidance.

---

## 📊 The Scoring Model (ALIGNX Engine)

| Component | Default Weight | Key Mathematical Parameters |
|---|:---:|---|
| **Student Fit ($S_{\text{fit}}$)** | **35%** | Skill overlap (35%), Cognitive aptitude vector (35%), Holland RIASEC synergy (30%) |
| **Financial Fit ($F_{\text{fit}}$)** | **20%** | Degree tuition vs. budget buffer, household financial friction, ROI payback period |
| **Family Alignment ($A_{\text{family}}$)** | **15%** | Parental preference congruence, Parent–Student Conflict Index, risk penalty |
| **Market Fit ($M_{\text{fit}}$)** | **20%** | 5-year growth trajectory, verified hiring surge, automation vulnerability discount |
| **Location Fit ($L_{\text{fit}}$)** | **10%** | Regional industry clusters (Bangalore, Pune, Hyderabad), geographic mobility score |

---

## 🏗️ System Architecture

```text
┌────────────────────────────────────────────────────────────────────────┐
│                               FRONTEND                                 │
│              React 19 + TypeScript + Vite + Vanilla Design System       │
│  Onboarding │ 6-Mission Discovery │ Cognitive IQ │ What-If │ Talent Atlas│
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTPS / REST (Port 5173 -> 5001)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                              BACKEND API                               │
│                  Node.js / Express / TypeScript (ES Modules)           │
│   Auth Controller │ Assessment Controller │ Market & Atlas Telemetry   │
└───────────────────────┬────────────────────────┬───────────────────────┘
                        │                        │
         ┌──────────────┘                        └──────────────┐
         ▼                                                      ▼
┌──────────────────┐                                  ┌──────────────────┐
│  DATABASE LAYER  │                                  │ DECISION ENGINE  │
│   MongoDB Atlas  │                                  │ (Deterministic)  │
│ Mongoose Models  │                                  │ Scoring Engine   │
└──────────────────┘                                  └────────┬─────────┘
                                                               │
                                                     ┌─────────┴─────────┐
                                                     ▼                   ▼
                                            ┌──────────────────┐ ┌────────────────┐
                                            │ CAREER KNOWLEDGE │ │ LLM EXPLAINER  │
                                            │ Verified MoSPI / │ │ (Google Gemini │
                                            │ NASSCOM Datasets │ │ GenAI SDK)     │
                                            └──────────────────┘ └────────────────┘
```

---

## 📁 Repository Structure

```text
ALIGNX/
├── backend/                    # Express + TypeScript API Server
│   ├── src/
│   │   ├── controllers/        # Assessment, Auth, Career, Market, Recommendation
│   │   ├── engine/             # Deterministic scoringEngine.ts
│   │   ├── models/             # Mongoose schemas (Assessment, Career, Student)
│   │   ├── routes/             # REST API routing
│   │   └── services/           # LLM service & market data aggregators
│   ├── package.json
│   └── tsconfig.json
├── frontend/                   # React 19 + TypeScript Client App
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # AuthenticCompass, EquilibriumRadar3D, Modals
│   │   │   ├── frames/         # Cinematic visual frames
│   │   │   └── modules/        # Discovery (6 Missions), Aptitude (IQ),
│   │   │                       # Talent Atlas, Recommendations, What-If, Parent
│   │   ├── data/               # mockAlignxData.ts (Careers, Scenarios, Puzzles)
│   │   └── services/           # ApiService client & telemetry listeners
│   ├── index.html
│   └── vite.config.ts
├── database/                   # Seed files & raw verified data sets
│   ├── data/raw/               # mospi_plfs_2023_24.json, nasscom_tech_2026.json
│   └── seeds/                  # careers.json, assessment_questions.json
├── docs/                       # Technical & Product Documentation
│   ├── DATA_SOURCES.md         # Full Provenance & Government Citations
│   ├── PRD.md                  # Product Requirements Document
│   ├── TRD.md                  # Technical Architecture Document
│   ├── SYSTEM_ARCHITECTURE.md  # Detailed Micro-Architecture
│   ├── DATABASE_SCHEMA.md      # Collection Schemas & Indices
│   └── API_DOCUMENTATION.md    # REST API Contracts
└── README.md                   # Project Overview & Quickstart Guide
```

---

## 🛠️ Getting Started & Quick Setup

### Prerequisites
- **Node.js**: v18+ or v20 LTS
- **MongoDB**: Local MongoDB instance or MongoDB Atlas connection string
- **Google Gemini API Key** *(optional, for live LLM explanations)*

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/himanshu-1629/ALIGNX.git
cd ALIGNX

# Install Backend dependencies
cd backend
npm install

# Install Frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

Create `backend/.env`:
```env
PORT=5001
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/alignx
JWT_SECRET=your_jwt_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Launch the Application

```bash
# Terminal 1: Start Backend (Port 5001)
cd backend
npm run dev

# Terminal 2: Start Frontend (Port 5173)
cd frontend
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 👥 Team & Ownership (DataQuest 3.0)

| Member | Primary Domain | Core Responsibilities |
|---|---|---|
| **Himanshu** | **AI/ML & Decision Engine** | Mathematical 5-pillar scoring engine, Talent Atlas telemetry, 6-mission tactical discovery, universal IQ aptitude evaluation, What-If simulator. |
| **Arpit** | **Data & LLM Layer** | Career knowledge base, Gemini prompt engineering, narrative synthesis, user authentication & profile integration. |
| **OM** | **Backend & Database** | REST API infrastructure, Mongoose data models, seed pipelines, service orchestration. |
| **Daksh** | **Frontend & UI/UX** | Design system, 3D radar visualizer, authentic compass, landing cinematic frames. |

---

## 🔗 Important Project Links

- 📊 **[Google Slides Presentation Deck](https://docs.google.com/presentation/d/1dWUnx_up_YXxmj7wloj-4Z_OMFGZoAhl/edit?usp=drive_link&ouid=102706534764800955072&rtpof=true&sd=true)**
- 📋 [Data Sources & Provenance Audit](docs/DATA_SOURCES.md)
- 🏗️ [System Architecture](docs/SYSTEM_ARCHITECTURE.md)
- 🔌 [API Endpoints Documentation](docs/API_DOCUMENTATION.md)
- 📄 [Product Requirements Document (PRD)](docs/PRD.md)

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
