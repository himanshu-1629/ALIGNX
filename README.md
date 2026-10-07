# ALIGNX — Aligning Talent With Opportunity

[![DataQuest 3.0](https://img.shields.io/badge/Hackathon-DataQuest%203.0-blue.svg)](https://github.com/himanshu-1629/ALIGNX)
[![Challenge](https://img.shields.io/badge/Challenge-PRISM%20Engine-purple.svg)](https://github.com/himanshu-1629/ALIGNX)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **ALIGNX** is an AI-powered, multi-dimensional career decision and discovery platform designed for students navigating critical career choices. Instead of generic quizzes or open-ended chatbots, ALIGNX calculates career alignment across three real-world pillars: **Student Aptitude & Aspirations**, **Family Financial Realities**, and **Market & Geographic Demands**.

---

## 🌟 The Core Vision

Most career guidance tools fail because they only look at a single dimension—typically student interest or a personality questionnaire—while ignoring the real-world constraints that dictate career success:

```text
      ┌───────────────────────┐
      │   STUDENT DIMENSION   │  (Interests, Aptitude, Skills, Work Style, DNA)
      └───────────┬───────────┘
                  │
                  ▼
      ┌───────────────────────┐
      │   FAMILY DIMENSION    │  (Education Budget, Risk Tolerance, Expectations)
      └───────────┬───────────┘
                  │
                  ▼
      ┌───────────────────────┐
      │   MARKET DIMENSION    │  (Industry Demand, Salary Trajectory, Regional Fit)
      └───────────┬───────────┘
                  │
                  ▼
      ┌───────────────────────┐
      │ ALIGNX DECISION ENGINE│  (Multi-Fit Deterministic Scoring & Optimization)
      └───────────┬───────────┘
                  │
                  ▼
      ┌───────────────────────┐
      │   DECISION SUPPORT    │  (Ranked Pathways, Explainability, What-If Twin)
      └───────────────────────┘
```

**ALIGNX does not dictate what career a student must choose.** It serves as an objective, transparent **decision support engine** empowering students and families to make informed, conflict-free life choices.

---

## 🚀 Key Features

- **Multi-Dimensional Career DNA**: Generates a student's cognitive and interest profile across Holland Codes (RIASEC), skill vectors, and learning preferences.
- **Financial Constraint Solver**: Cross-references career education costs (degree tuition, living expenses) against family affordability and scholarship potential.
- **Parent–Student Conflict Index**: Quantifies differences between parent expectations and student aspirations, providing actionable middle-ground pathways.
- **Explainable Decision Engine**: Uses deterministic, testable scoring formulas ($S_{\text{fit}}, F_{\text{fit}}, A_{\text{family}}, M_{\text{fit}}, L_{\text{fit}}$) rather than black-box AI hallucinations.
- **AI-Powered Narrative Explanations**: Integrates Google Gemini LLMs to articulate *why* careers are recommended, bridging technical scores into empathetic advice.
- **Interactive "What-If" Career Simulator**: Lets students test dynamic scenarios in real-time (*"What if my budget increases by ₹3L?"*, *"What if I relocate to Bangalore?"*, *"What if I learn PyTorch?"*).
- **Personalized Learning & Skill-Gap Roadmaps**: Pinpoints precise technical and soft skill deficits and maps clear milestones to career readiness.

---

## 📐 System Architecture

ALIGNX follows a modular, decoupled architecture:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                               FRONTEND                                 │
│                   React / Next.js + TypeScript + Tailwind              │
│       Onboarding │ Assessment UI │ Dashboard │ Career Twin │ What-If   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTPS / REST
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                              BACKEND API                               │
│                      Node.js / Express or FastAPI                      │
│             Auth │ Validation │ Controllers │ Orchestration            │
└───────────────────────┬────────────────────────┬───────────────────────┘
                        │                        │
         ┌──────────────┘                        └──────────────┐
         ▼                                                      ▼
┌──────────────────┐                                  ┌──────────────────┐
│     DATABASE     │                                  │ DECISION ENGINE  │
│    PostgreSQL    │                                  │ (Deterministic)  │
│    (Supabase)    │                                  │ Multi-Fit Math   │
└──────────────────┘                                  └────────┬─────────┘
                                                               │
                                                     ┌─────────┴─────────┐
                                                     ▼                   ▼
                                            ┌──────────────────┐ ┌────────────────┐
                                            │ CAREER KNOWLEDGE │ │ LLM EXPLAINER  │
                                            │       BASE       │ │ (Gemini API)   │
                                            └──────────────────┘ └────────────────┘
```

---

## 👥 Team & Ownership

Developed for **DataQuest 3.0** by a dedicated 4-member team:

| Member | Primary Domain | Core Responsibilities |
|---|---|---|
| **Himanshu** | **AI/ML & Decision Engine** | Mathematical scoring engine, Student Vector / Career DNA, Financial Solver, Conflict Index, What-If simulator logic. |
| **Arpit** | **Data & LLM Layer** | Career Knowledge Base, LLM prompt engineering, Gemini integration, Career DNA narrative synthesis. |
| **OM** | **Backend & Database** | API infrastructure, schema design (PostgreSQL/Supabase), authentication, service orchestration. |
| **Daksh** | **Frontend & UI/UX** | User experience, design system, interactive dashboards, Career Twin visualizations, What-If UI. |

---

## 📁 Repository Structure

```text
ALIGNX/
├── backend/            # Backend API server & business logic
├── frontend/           # Client application (Next.js / React)
├── database/           # PostgreSQL migration scripts & seed data
├── assets/             # Architecture diagrams, mockups, design assets
├── docs/               # In-depth technical & product specifications
│   ├── PRD.md                  # Product Requirements Document
│   ├── TRD.md                  # Technical Requirements Document
│   ├── SYSTEM_ARCHITECTURE.md  # Detailed System Architecture
│   ├── DATABASE_SCHEMA.md      # Database Entity-Relationship & DDL
│   ├── API_DOCUMENTATION.md    # REST API Contracts
│   ├── UI_UX.md                # Design System & Wireframes
│   ├── USER_FLOW.md            # User Journeys & State Machines
│   ├── ROADMAP.md              # Milestones & Sprint Breakdown
│   └── testing.md              # Quality Assurance Strategy
├── PROJECT.md          # Comprehensive Project Charter
├── TASKS.md            # Detailed Team Task Breakdown
├── TEAM.md             # Team Roles & Ownership Matrix
└── README.md           # Project Overview & Quickstart
```

---

## 📊 The Scoring Model (ALIGNX Engine)

The core recommendation score is calculated deterministically across 5 normalized components $[0, 100]$:

$$\text{ALIGNX Score} = w_s S_{\text{fit}} + w_f F_{\text{fit}} + w_a A_{\text{family}} + w_m M_{\text{fit}} + w_l L_{\text{fit}}$$

| Component | Default Weight | Evaluates |
|---|:---:|---|
| **Student Fit ($S_{\text{fit}}$)** | **35%** | Aptitude alignment, interest match (RIASEC), skill overlap |
| **Financial Fit ($F_{\text{fit}}$)** | **20%** | Degree cost vs. budget, affordability margin, scholarship offset |
| **Family Alignment ($A_{\text{family}}$)** | **15%** | Parental preference congruence, Parent–Student Conflict Index |
| **Market Fit ($M_{\text{fit}}$)** | **20%** | Current industry hiring demand, 5-year growth trajectory, salary potential |
| **Location Fit ($L_{\text{fit}}$)** | **10%** | Regional job clusters, geographic mobility constraints |

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18+ or v20 LTS)
- Python (3.10+ for Decision Engine & AI modules)
- PostgreSQL (or Supabase account)

### Quick Setup

```bash
# 1. Clone the repository
git clone https://github.com/himanshu-1629/ALIGNX.git
cd ALIGNX

# 2. Setup Backend
cd backend
npm install   # or pip install -r requirements.txt
cp .env.example .env

# 3. Setup Frontend
cd ../frontend
npm install
npm run dev
```

---

## 📖 Complete Documentation Index

For deep dives into design and implementation details, refer to:
- 📋 [Product Requirements Document (PRD)](file:///Users/himanshusingh/project/ALIGNX/docs/PRD.md)
- ⚙️ [Technical Requirements Document (TRD)](file:///Users/himanshusingh/project/ALIGNX/docs/TRD.md)
- 🏗️ [System Architecture](file:///Users/himanshusingh/project/ALIGNX/docs/SYSTEM_ARCHITECTURE.md)
- 🗄️ [Database Schema & Models](file:///Users/himanshusingh/project/ALIGNX/docs/DATABASE_SCHEMA.md)
- 🔌 [API Endpoints Documentation](file:///Users/himanshusingh/project/ALIGNX/docs/API_DOCUMENTATION.md)
- 🧪 [Testing Strategy](file:///Users/himanshusingh/project/ALIGNX/docs/testing.md)
- 🗺️ [Development Roadmap](file:///Users/himanshusingh/project/ALIGNX/docs/ROADMAP.md)
- 👥 [Team Roles & Ownership](file:///Users/himanshusingh/project/ALIGNX/TEAM.md)
- ✅ [Task Breakdown](file:///Users/himanshusingh/project/ALIGNX/TASKS.md)

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
