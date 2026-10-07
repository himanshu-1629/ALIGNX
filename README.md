# ALIGNX 🚀

> ## **Aligning Talent With Opportunity**
>
> **AI-Powered Multi-Dimensional Career Intelligence Platform**

ALIGNX is an intelligent career discovery and decision-support platform designed to help students discover career paths that align with **who they are, what they can do, what their family can support, and where real-world opportunities exist**.

Unlike traditional career quizzes that primarily focus on interests or personality, ALIGNX combines three major dimensions:

```text
              ┌─────────────────────┐
              │      STUDENT        │
              │                     │
              │ Aptitude            │
              │ Skills              │
              │ Interests           │
              │ Career DNA          │
              │ Goals               │
              └──────────┬──────────┘
                         │
                         ▼
                  ┌───────────────┐
                  │    ALIGNX     │
                  │ Decision      │
                  │ Engine        │
                  └───────┬───────┘
                         ▲
              ┌──────────┴──────────┐
              │                     │
      ┌───────┴────────┐   ┌───────┴────────┐
      │     FAMILY     │   │   OPPORTUNITY  │
      │                │   │                │
      │ Budget         │   │ Market Demand  │
      │ Contributions  │   │ Salary         │
      │ Risk Appetite  │   │ Geography      │
      │ Expectations   │   │ Growth         │
      └────────────────┘   └────────────────┘
                         │
                         ▼
             Personalized Career Paths
```

The goal is not to tell a student what career they **must** choose.

Instead, ALIGNX explains:

> **Why a career fits, what may prevent the student from pursuing it, what alternatives exist, and what the student can do next.**

---

# 📌 Table of Contents

- [About ALIGNX](#-about-alignx)
- [Problem Statement](#-problem-statement)
- [Our Solution](#-our-solution)
- [What Makes ALIGNX Different](#-what-makes-alignx-different)
- [Key Features](#-key-features)
- [How ALIGNX Works](#-how-alignx-works)
- [ALIGNX Decision Engine](#-alignx-decision-engine)
- [Career DNA](#-career-dna)
- [Family Intelligence](#-family-intelligence)
- [Market Intelligence](#-market-intelligence)
- [Career Twin](#-career-twin)
- [What-If Career Simulator](#-what-if-career-simulator)
- [Interdisciplinary Career Discovery](#-interdisciplinary-career-discovery)
- [Target Users](#-target-users)
- [Core Modules](#-core-modules)
- [User Journey](#-user-journey)
- [System Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Documentation](#-documentation)
- [Development Roadmap](#-development-roadmap)
- [Team Workflow](#-team-workflow)
- [Git Workflow](#-git-workflow)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Testing](#-testing)
- [Security](#-security)
- [Future Scope](#-future-scope)
- [MVP Scope](#-mvp-scope)
- [Contributing](#-contributing)
- [License](#-license)

---

# 🎯 About ALIGNX

Choosing a career is one of the most important decisions a student makes.

However, students often make career decisions based on:

- Peer pressure
- Family expectations
- Salary alone
- Popular careers
- Social media trends
- Limited awareness of alternative careers
- Generic online quizzes
- Incomplete understanding of their own strengths

At the same time, a career that looks perfect on paper may not be financially realistic for a particular family.

Similarly, a financially feasible career may not align with the student's aptitude, interests, or long-term goals.

ALIGNX addresses this by bringing together:

```text
Student Potential
        +
Family Reality
        +
Market Opportunity
        ↓
Career Alignment
```

---

# ❗ Problem Statement

Traditional career guidance often focuses primarily on the student.

It may ask:

> "What are you interested in?"

or:

> "Which career sounds attractive to you?"

But a real career decision involves much more.

### Student-side questions

- What am I naturally good at?
- What kind of problems do I enjoy solving?
- What is my aptitude?
- What skills do I already have?
- What type of work environment suits me?
- What careers match my interests and abilities?

### Family-side questions

- How much can my family realistically spend on education?
- What level of financial risk is acceptable?
- What career expectations do my parents have?
- Are there disagreements between student aspirations and family expectations?
- Can scholarships or alternative pathways make an expensive career feasible?

### Opportunity-side questions

- Is the industry growing?
- Where is demand concentrated?
- What is the earning potential?
- What skills are required?
- What education pathway is required?
- Are there better interdisciplinary alternatives?

### The core problem

> **Students need career guidance that considers not only who they are, but also what their family can support and where real opportunities exist.**

---

# 💡 Our Solution

ALIGNX creates a personalized career discovery and decision-support journey.

Instead of asking students to browse hundreds of careers, ALIGNX gradually builds a structured representation of the student.

```text
Interactive Career Discovery
             ↓
      Career Preferences
             ↓
       Aptitude Snapshot
             ↓
         Career DNA
             ↓
        Student Vector
             ↓
      Family Information
             ↓
    Financial Constraint Solver
             ↓
 Parent–Student Conflict Index
             ↓
      Market Intelligence
             ↓
     ALIGNX Decision Engine
             ↓
     Ranked Career Paths
             ↓
    Explanation + Alternatives
             ↓
 Career Twin + What-If Simulator
             ↓
     Personalized Roadmap
```

---

# 🔥 What Makes ALIGNX Different?

ALIGNX is not designed as another generic career quiz or chatbot.

### 1. Student + Family + Market

Most career tools focus mainly on the student.

ALIGNX considers:

```text
Student
+
Family
+
Market
```

before producing its recommendations.

### 2. Multiple Paying Parents/Guardians

A student can add multiple contributors:

```text
Student
│
└── Family
    ├── Father
    ├── Mother
    └── Guardian
```

Each contributor can receive a unique invitation link/code and independently provide relevant financial and career-expectation information.

### 3. Deterministic Decision Engine + LLM Explanation

The recommendation score is generated by the ALIGNX decision engine.

The LLM is used to:

- Explain recommendations
- Explain skill gaps
- Suggest alternatives
- Generate learning roadmaps

The LLM does **not** independently decide which career should rank first.

### 4. Career What-If Simulation

Students can change conditions such as:

- Education budget
- Risk appetite
- Location
- Time-to-employment

and observe how career rankings change.

### 5. Career Twin

ALIGNX creates a visual representation of the student's Career DNA and connects it to suitable career pathways.

### 6. Interdisciplinary Discovery

ALIGNX can identify career paths that the student may not have considered.

For example:

```text
Strong Biology
+
Strong Technology
+
Interest in Healthcare
        ↓
Medical AI
Bioinformatics
Biomedical Engineering
Computational Biology
```

---

# ✨ Key Features

## 1. 🧠 Interactive Career Discovery

The assessment should feel like an interactive experience rather than a long form.

Example:

```text
You are given a problem nobody has solved before.

What excites you most?

┌────────────────────────────┐
│ Break it into logical      │
│ parts and find the cause   │
└────────────────────────────┘

┌────────────────────────────┐
│ Build something and test   │
│ different approaches       │
└────────────────────────────┘

┌────────────────────────────┐
│ Find an unusual or         │
│ creative solution          │
└────────────────────────────┘

┌────────────────────────────┐
│ Understand how it affects  │
│ people                     │
└────────────────────────────┘
```

Each answer contributes to multiple Career DNA dimensions.

---

# 2. 📊 PRISM Aptitude Snapshot

ALIGNX includes a short quiz-style aptitude assessment.

Suggested dimensions:

- Logical Reasoning
- Numerical Reasoning
- Analytical Thinking
- Spatial / Pattern Recognition
- Verbal Reasoning

Example result:

```text
Logical        ██████████████████  91
Numerical      █████████████████   84
Analytical     ██████████████████  89
Spatial        ███████████████     77
Verbal         ██████████████      73
```

The aptitude snapshot is one input into career alignment, not a standalone career diagnosis.

---

# 3. 🧬 Career DNA

The student's answers generate a multidimensional Career DNA.

Example:

```text
Analytical      91
Builder        87
Research       82
Creative       74
Leadership     61
Social         55
Risk           72
```

ALIGNX can summarize the profile as:

> **Analytical Builder**

The Career DNA is then compared against career requirements.

---

# 4. 👨‍👩‍👧 Family Intelligence

Students can add one or more paying parents/guardians.

### Student Flow

```text
Student Dashboard
        ↓
+ Add Paying Parent / Guardian
        ↓
Enter Name + Relationship
        ↓
Generate Unique Link / Code
```

### Parent Flow

```text
Open Invitation
        ↓
Verification
        ↓
Parent Form
        ↓
Submit
        ↓
Status = Completed
```

Parent status can appear on the student dashboard:

```text
Father      🟢 Completed
Mother      🟡 Filling Pending
Guardian    ⚪ Invitation Pending
```

Parents do not need a full account for this workflow.

---

# 5. 💰 Financial Constraint Solver

ALIGNX considers:

- Parent contributions
- Education budget
- Education cost
- Scholarships
- Financial aid
- Career risk
- Expected earning potential

Instead of simply rejecting an expensive career, ALIGNX can classify it as:

```text
Financially Feasible
        ↓
Feasible With Scholarship
        ↓
Stretch Option
        ↓
Currently Unsuitable
```

This allows the system to recommend realistic pathways rather than simply high-paying careers.

---

# 6. ⚖️ Parent–Student Conflict Index

ALIGNX identifies possible gaps between student aspirations and family expectations.

Example:

```text
Student:
AI / Startup / High Growth

Parent:
Traditional Engineering / Stable Career / Low Risk
```

ALIGNX may identify:

```text
Conflict Index: 72 / 100
```

The system can then surface alternative or compromise pathways.

The conflict index is intended as a decision-support signal, not a judgment about the family.

---

# 7. 📈 Market Intelligence

Career recommendations also consider opportunity-side information such as:

- Industry demand
- Job-market demand
- Geographic demand
- Salary range
- Career growth
- Education cost
- Required skills
- Career risk

Example:

```text
AI Engineer

Market Demand        93
Growth Potential     91
Location Fit         88
Salary Potential     89
```

---

# 8. 🎯 ALIGNX Career Recommendations

Each career receives a transparent score.

Example:

```text
AI Engineer
━━━━━━━━━━━━━━━━━━━━━━━━━━

ALIGNX Score          91%

Student Fit           94%
Financial Fit         82%
Family Alignment      76%
Market Fit            93%
Location Fit          88%
```

The system should also explain **why** the career received its score.

---

# 9. 🔍 Explainable Recommendations

Example:

### AI Engineer — 91%

**Why it matches**

- Strong analytical aptitude
- High logical reasoning score
- Builder-oriented Career DNA
- Strong interest in technology
- Favorable market demand

**Potential challenges**

- Education pathway may require additional investment
- Advanced mathematics may need improvement
- Parent preference has moderate disagreement

**Possible alternatives**

- Data Scientist
- Robotics Engineer
- Healthcare AI
- ML Engineer

---

# 10. 📈 Skill Gap Analysis

ALIGNX compares the student's current skills with the target career.

Example:

```text
Target Career: Data Scientist

Python
████████░░

Statistics
█████░░░░░

SQL
███████░░░

Machine Learning
██░░░░░░░░

Data Visualization
████░░░░░░
```

Priority gaps:

```text
1. Statistics
2. Machine Learning
3. Data Visualization
```

---

# 11. 🛣️ Personalized Career Roadmap

ALIGNX can convert the identified skill gaps into an actionable roadmap.

Example:

```text
Data Scientist
      ↓
Python Fundamentals
      ↓
Statistics
      ↓
SQL
      ↓
Data Analysis
      ↓
Machine Learning
      ↓
Projects
      ↓
Internships
      ↓
Data Scientist
```

A roadmap can contain:

- Skills
- Learning resources
- Projects
- Practice tasks
- Milestones
- Suggested progression

---

# 12. 🪞 Career Twin

Career Twin provides a visual representation of:

```text
Your Career DNA
        +
Your Aptitude
        +
Your Skills
        +
Your Goals
        ↓
Potential Career Universe
```

It can show:

- Core career matches
- Strong alternatives
- Unexpected interdisciplinary matches
- Strengths
- Development areas

---

# 13. 🎮 What-If Career Simulator

The What-If simulator allows students to experiment with their future.

Example:

```text
Education Budget
₹3,00,000 ─────────●──── ₹6,00,000

Risk Appetite
Low ───────────────●──── High

Preferred Location
India ─────────────●──── Global

Time to Employment
2 years ───────────●──── 5 years
```

The ALIGNX engine recalculates career rankings using the same underlying decision model.

Example:

```text
Before

AI Engineer       84
Data Scientist    82
Robotics          76


After increasing education budget

AI Engineer       91 ↑
Data Scientist    85 ↑
Robotics          81 ↑
```

This makes the recommendation system dynamic rather than static.

---

# 🧠 ALIGNX Decision Engine

The core recommendation engine combines:

```text
Student Vector
      +
Family Vector
      +
Career Knowledge
      +
Market Intelligence
      ↓
ALIGNX Decision Engine
      ↓
Career Scores
```

The initial scoring model can use configurable weights:

```text
Student Fit          35%
Financial Fit        20%
Family Alignment     15%
Market Demand        20%
Location Fit         10%
```

Therefore:

```text
ALIGNX Score =
0.35 × Student Fit
+
0.20 × Financial Fit
+
0.15 × Family Alignment
+
0.20 × Market Demand
+
0.10 × Location Fit
```

These weights are configurable and can be refined during development.

The important principle is that the recommendation should remain **explainable**.

---

# 🔄 User Journey

```text
                    ┌──────────────┐
                    │   Landing    │
                    └──────┬───────┘
                           ↓
                    ┌──────────────┐
                    │   Student    │
                    │  Onboarding  │
                    └──────┬───────┘
                           ↓
                 ┌────────────────────┐
                 │ Career Discovery   │
                 │ Interactive        │
                 │ Questions          │
                 └─────────┬──────────┘
                           ↓
                 ┌────────────────────┐
                 │ Aptitude Snapshot  │
                 └─────────┬──────────┘
                           ↓
                 ┌────────────────────┐
                 │    Career DNA      │
                 └─────────┬──────────┘
                           ↓
                 ┌────────────────────┐
                 │ Add Parent /       │
                 │ Guardian            │
                 └─────────┬──────────┘
                           ↓
                 ┌────────────────────┐
                 │ Parent Invitation  │
                 └─────────┬──────────┘
                           ↓
                 ┌────────────────────┐
                 │ Parent Financial   │
                 │ + Expectations     │
                 └─────────┬──────────┘
                           ↓
                 ┌────────────────────┐
                 │ Family Analysis    │
                 └─────────┬──────────┘
                           ↓
              ┌────────────┴────────────┐
              ↓                         ↓
     Financial Solver          Conflict Index
              └────────────┬────────────┘
                           ↓
                 ┌────────────────────┐
                 │ Market Intelligence│
                 └─────────┬──────────┘
                           ↓
                 ┌────────────────────┐
                 │ ALIGNX Decision    │
                 │ Engine             │
                 └─────────┬──────────┘
                           ↓
                 ┌────────────────────┐
                 │ Career Rankings    │
                 └─────────┬──────────┘
                           ↓
             ┌─────────────┼──────────────┐
             ↓             ↓              ↓
       Career Twin      What-If        Roadmap
                        Simulator
```

---

# 🏗️ System Architecture

```text
┌────────────────────────────────────────────┐
│              FRONTEND                      │
│                                            │
│ Student UI │ Parent UI │ Dashboard        │
└──────────────────────┬─────────────────────┘
                       │
                       │ REST API
                       ▼
┌────────────────────────────────────────────┐
│              BACKEND                       │
│                                            │
│ Auth │ Family │ Assessment │ Recommendations│
└──────────────┬───────────────┬─────────────┘
               │               │
               ▼               ▼
        ┌────────────┐   ┌─────────────────┐
        │  DATABASE  │   │ ALIGNX ENGINE   │
        │            │   │                 │
        │ Students   │   │ Career DNA      │
        │ Parents    │   │ Aptitude        │
        │ Careers    │   │ Financial Fit   │
        │ Assessments│  │ Conflict Index  │
        └────────────┘   │ Market Fit      │
                         └────────┬────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │ LLM EXPLANATION │
                         │                 │
                         │ Why             │
                         │ Alternatives    │
                         │ Skill Gaps      │
                         │ Roadmap         │
                         └─────────────────┘
```

### Architecture Principle

```text
Frontend
   ↓
Experience

Backend
   ↓
Data + APIs

ALIGNX Engine
   ↓
Decision

Career Dataset
   ↓
Knowledge

LLM
   ↓
Explanation
```

The LLM should not replace the deterministic decision engine.

---

# 🛠️ Technology Stack

The stack can evolve during development, but the initial architecture is expected to use:

## Frontend

- React
- TypeScript
- Tailwind CSS
- Vite

## Backend

- Node.js
- Express.js
- REST APIs

## Database

- PostgreSQL / Supabase

## AI / Intelligence

- Deterministic recommendation engine
- Rule/weighted scoring for MVP
- LLM API for explanations and roadmap generation

## Development Tools

- Git
- GitHub
- VS Code
- Postman
- Figma

---

# 📁 Project Structure

```text
ALIGNX/
│
├── README.md
├── PROJECT.md
├── TEAM.md
├── TASKS.md
│
├── docs/
│   ├── PRD.md
│   ├── TRD.md
│   ├── UI_UX.md
│   ├── SYSTEM_ARCHITECTURE.md
│   ├── DATABASE_SCHEMA.md
│   ├── API_DOCUMENTATION.md
│   ├── USER_FLOW.md
│   └── ROADMAP.md
│
├── frontend/
│
├── backend/
│
├── database/
│
└── assets/
    ├── wireframes/
    ├── diagrams/
    └── screenshots/
```

---

# 📚 Documentation

| Document | Purpose |
|---|---|
| `PROJECT.md` | Product vision, requirements and principles |
| `TEAM.md` | Team responsibilities and ownership |
| `TASKS.md` | Master implementation checklist |
| `PRD.md` | Product requirements |
| `TRD.md` | Technical requirements |
| `UI_UX.md` | UI/UX specifications |
| `SYSTEM_ARCHITECTURE.md` | System architecture |
| `DATABASE_SCHEMA.md` | Database design |
| `API_DOCUMENTATION.md` | API contracts |
| `USER_FLOW.md` | Complete user journeys |
| `ROADMAP.md` | Development roadmap |

---

# 🚀 Development Roadmap

## Phase 0 — Foundation

- [ ] Finalize PRD
- [ ] Finalize TRD
- [ ] Finalize UI/UX
- [ ] Finalize system architecture
- [ ] Finalize database schema
- [ ] Finalize API contracts
- [ ] Finalize user flow
- [ ] Create career dataset

---

## Phase 1 — Student MVP

- [ ] Student onboarding
- [ ] Interactive Career Discovery
- [ ] Aptitude Snapshot
- [ ] Career DNA generation
- [ ] Student vector

---

## Phase 2 — Career Intelligence

- [ ] Career database
- [ ] Career profiles
- [ ] Career matching
- [ ] Student Fit
- [ ] Market Fit
- [ ] Location Fit
- [ ] Initial recommendation ranking

---

## Phase 3 — Family Intelligence

- [ ] Add Paying Parent/Guardian
- [ ] Parent invitation
- [ ] Verification
- [ ] Multiple parent support
- [ ] Parent status
- [ ] Financial Constraint Solver
- [ ] Parent–Student Conflict Index
- [ ] Family Alignment

---

## Phase 4 — ALIGNX Engine

- [ ] Combine Student + Family + Market vectors
- [ ] Calculate component scores
- [ ] Calculate overall ALIGNX score
- [ ] Generate explainable recommendations

---

## Phase 5 — AI Explanation

- [ ] LLM integration
- [ ] Recommendation explanation
- [ ] Alternative careers
- [ ] Skill gap explanation
- [ ] Roadmap generation

---

## Phase 6 — Differentiating Features

- [ ] Career Twin
- [ ] What-If Career Simulator
- [ ] Interdisciplinary Career Discovery

---

## Phase 7 — Final Polish

- [ ] Full end-to-end testing
- [ ] UI animations
- [ ] Score visualizations
- [ ] Responsive design
- [ ] Demo data
- [ ] Deployment
- [ ] Hackathon presentation

---

# 👥 Team Workflow

ALIGNX is developed by a four-member team.

### Himanshu — AI/ML + Decision Engine

Responsible for:

- Career DNA
- Aptitude scoring
- Student vector
- Financial Constraint Solver
- Conflict Index
- Career matching
- Career ranking
- Market integration
- What-If engine

### Arpit — Data + LLM

Responsible for:

- Career knowledge base
- Career profiles
- Skills
- Education costs
- Salary ranges
- Market data
- Geographic data
- Exams
- Scholarships
- Alternative careers
- LLM prompts
- Explanations
- Roadmaps

### OM — Backend + Database

Responsible for:

- Database
- APIs
- Student records
- Family relationships
- Parent invitations
- Verification
- Parent status
- Assessment APIs
- Recommendation APIs
- Data persistence

### Daksh — Frontend + UI/UX

Responsible for:

- Landing page
- Student onboarding
- Career Discovery
- Aptitude UI
- Career DNA visualization
- Parent invitation UI
- Parent status
- Recommendation dashboard
- Career Twin
- What-If Simulator
- Roadmap
- Animations and visual polish

### Ownership Principle

```text
Himanshu → Decision
Arpit    → Knowledge + Explanation
OM       → Infrastructure
Daksh    → Experience
```

---

# 🌿 Git Workflow

We use feature branches.

### Main branch

```text
main
```

Production-ready code only.

### Feature branches

```text
feature/student-assessment
feature/career-engine
feature/family-module
feature/database
feature/dashboard
feature/ui
feature/llm
```

### Development Flow

```bash
git checkout -b feature/your-feature

git add .

git commit -m "feat: add assessment module"

git push origin feature/your-feature
```

Then:

```text
Feature Branch
      ↓
Pull Request
      ↓
Code Review
      ↓
Testing
      ↓
Merge → main
```

---

# 📝 Commit Convention

Use conventional commit messages:

```text
feat: add career assessment
fix: resolve recommendation calculation
docs: update PRD
style: improve dashboard UI
refactor: restructure recommendation service
test: add assessment tests
chore: update dependencies
```

---

# ⚙️ Getting Started

## Prerequisites

Install:

- Node.js
- npm
- Git
- PostgreSQL / Supabase
- VS Code
- Postman

Verify:

```bash
node --version
npm --version
git --version
```

---

## Clone Repository

```bash
git clone https://github.com/himanshu-1629/ALIGNX.git
cd ALIGNX
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## Backend Setup

Open another terminal:

```bash
cd backend
npm install
npm run dev
```

The backend will run on the configured development port.

---

# 🔑 Environment Variables

Create:

```text
backend/.env
```

Example:

```env
PORT=5000

DATABASE_URL=your_database_url

JWT_SECRET=your_secret

AI_API_KEY=your_api_key
```

Never commit `.env` files.

Add them to `.gitignore`:

```text
.env
.env.local
```

---

# 🧪 Testing

ALIGNX should be tested at multiple levels.

### Frontend

- Component testing
- UI testing
- Responsive testing
- Assessment flow testing

### Backend

- API testing
- Validation testing
- Authentication testing
- Parent invitation testing

### Decision Engine

- Career scoring
- Financial fit
- Conflict index
- Market fit
- What-If recalculation

### End-to-End

Test scenarios including:

- One parent
- Multiple parents
- Parent pending
- Parent completed
- High student-parent conflict
- Expensive career
- Scholarship-supported career
- High local demand
- Low local demand
- What-If budget change
- What-If location change
- What-If risk change

---

# 🔐 Security

Security must be considered from the beginning.

Important practices:

- Password hashing
- Secure authentication
- Authorization
- Input validation
- API protection
- Environment variables
- Secure database access
- Rate limiting
- CORS configuration
- Protection against common web vulnerabilities

Sensitive credentials must never be committed to GitHub.

---

# 🎯 MVP Scope

The hackathon MVP focuses on the following complete journey:

```text
Student Onboarding
       ↓
Career Discovery
       ↓
Aptitude Snapshot
       ↓
Career DNA
       ↓
Add Parent/Guardian
       ↓
Family Information
       ↓
Financial Constraint Solver
       ↓
Conflict Index
       ↓
Market Intelligence
       ↓
ALIGNX Decision Engine
       ↓
Top Career Recommendations
       ↓
Explainable Results
       ↓
Career Twin
       ↓
What-If Simulator
       ↓
Personalized Roadmap
```

### MVP priority

> **Working end-to-end flow > feature quantity**

The team should not add major features until the core journey works reliably.

---

# 🔮 Future Scope

Future versions of ALIGNX could expand into a broader career ecosystem.

### AI Career Assistant

Students could ask:

> "Why am I suitable for cybersecurity?"

or:

> "What should I learn after Python?"

### Resume Analysis

Analyze:

- Skills
- Experience
- Projects
- Career alignment
- Missing skills

### Project Recommendations

Recommend projects based on target careers.

### Internship Discovery

Connect students with relevant internship opportunities.

### Mentor Matching

Connect students with mentors working in their target domains.

### Career Progress Tracking

Track:

- Skills completed
- Projects completed
- Roadmap progress
- Career development

---

# 🎨 UI/UX Principles

ALIGNX should feel:

### Simple

Students should never feel overwhelmed.

### Interactive

Assessment should feel engaging rather than like a traditional examination.

### Personalized

Recommendations should clearly reflect the student's profile.

### Explainable

Every major recommendation should have a reason.

### Actionable

ALIGNX should answer:

> **"What should I do next?"**

not simply:

> **"What career should I choose?"**

---

# 🧠 Design Philosophy

ALIGNX should **not decide a student's future**.

Instead:

```text
             ALIGNX
                ↓
       Understand the Student
                ↓
        Understand the Family
                ↓
        Understand the Market
                ↓
       Identify Career Matches
                ↓
         Explain the Reason
                ↓
       Show Strengths & Gaps
                ↓
       Explore Alternatives
                ↓
        Build Possible Paths
                ↓
       Student Makes the Choice
```

ALIGNX is a **career guidance and decision-support platform**, not an authority that determines a student's future.

---

# 📊 Success Metrics

Potential success metrics include:

### Engagement

- Assessment completion rate
- Career exploration rate
- Session completion rate

### Recommendation Quality

- Recommendation feedback
- Career exploration after recommendation
- User satisfaction
- Career comparison usage

### Learning Progress

- Skill completion
- Roadmap completion
- Projects completed

### Family Engagement

- Parent invitation completion
- Parent response rate
- Family alignment analysis usage

---

# 🤝 Contributing

Contributions are welcome.

Before contributing:

1. Create a feature branch.
2. Make your changes.
3. Test your changes.
4. Follow the commit convention.
5. Push your branch.
6. Open a Pull Request.
7. Request review from another team member.

Before making major architectural changes, discuss them with the team and update the relevant documentation.

---

# 📄 License

This project is currently under development.

License information will be added before public release.

---

# 🚧 Project Status

**Status:** 🟡 Active Development

Current focus:

```text
[x] Project Concept
[x] Product Direction
[x] Core User Journey
[x] Team Responsibilities

[ ] PRD
[ ] TRD
[ ] UI/UX Specification
[ ] System Architecture
[ ] Database Design
[ ] API Design
[ ] MVP Development
[ ] Integration
[ ] Testing
[ ] Deployment
[ ] Hackathon Demo
```

---

# 🚀 ALIGNX

> **Don't choose a career blindly.**
>
> **Understand yourself. Understand your reality. Discover where you align.**

### **ALIGNX — Aligning Talent With Opportunity.**