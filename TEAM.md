# ALIGNX — Team Structure

> **Project:** ALIGNX — Aligning Talent With Opportunity  
> **Hackathon:** DataQuest 3.0  
> **Team Size:** 4 Members

---

## 1. Team Overview

ALIGNX is developed by a four-member team with clearly separated responsibilities across intelligence, data, backend infrastructure, and user experience.

The team follows this ownership model:

```text
Himanshu  → Decision Intelligence
Arpit     → Data + LLM
OM        → Backend + Database
Daksh     → Frontend + UI/UX
```

The objective is to keep responsibilities clear while ensuring that all modules integrate through well-defined interfaces.

---

# 2. Team Members

## 2.1 Himanshu — AI/ML + ALIGNX Decision Engine

### Primary Responsibility

Himanshu owns the core intelligence and decision-making layer of ALIGNX.

### Responsibilities

- Career Discovery scoring
- Aptitude scoring
- Career DNA generation
- Student profile/vector generation
- Family profile interpretation
- Financial Constraint Solver
- Parent–Student Conflict Index
- Student Fit calculation
- Financial Fit calculation
- Family Alignment calculation
- Market Fit calculation
- Location Fit calculation
- Overall ALIGNX score
- Career ranking
- Career recommendation logic
- Career comparison
- What-If Career Simulator logic
- Integration of market and location factors into recommendations
- Explainable scoring structure

### Core Output

```text
Student Data
+
Family Data
+
Career Knowledge
+
Market Data
        ↓
ALIGNX Decision Engine
        ↓
Career Scores
        ↓
Ranked Career Recommendations
```

### Ownership Boundary

Himanshu owns **how career decisions are calculated**.

The Decision Engine should be deterministic and explainable wherever possible.

The LLM should not independently decide the final career ranking.

---

# 3. Arpit — Data + LLM

### Primary Responsibility

Arpit owns the career knowledge layer and LLM-powered explanation layer.

## Data Responsibilities

- Career knowledge base
- Career profiles
- Required skills
- Aptitude profiles
- Interest profiles
- Education pathways
- Education costs
- Salary ranges
- Market demand
- Geographic demand
- Career risk levels
- Entrance exams
- Scholarships
- Certifications
- Alternative careers
- Interdisciplinary careers
- Career transition pathways

## LLM Responsibilities

- Recommendation explanations
- Career explanations
- Skill-gap explanations
- Personalized roadmap generation
- Alternative career suggestions
- Education pathway explanations
- Exam and scholarship explanations
- Natural-language summaries
- Career comparison explanations

### Ownership Boundary

Arpit owns:

```text
Knowledge
+
Data
+
AI Explanations
```

The structured career data should be provided to the ALIGNX Decision Engine.

The LLM should not invent important factual information such as:

- Salary
- Education cost
- Market demand
- Career requirements
- Scholarship eligibility

when structured data is available.

---

# 4. OM — Backend + Database

### Primary Responsibility

OM owns the backend infrastructure, APIs, database, and application data flow.

## Backend Responsibilities

- Backend architecture
- REST APIs
- Authentication where required
- Authorization
- Request validation
- Business API integration
- Recommendation APIs
- Assessment APIs
- Parent invitation APIs
- Parent verification
- Parent submission handling
- What-If APIs
- Career data APIs
- Student profile APIs

## Database Responsibilities

- Student records
- Parent/Guardian records
- Family relationships
- Assessment results
- Student profiles
- Financial profiles
- Career data
- Market data
- Recommendations
- Parent invitation tokens
- Verification data
- Application statuses

### Parent Flow

```text
Student
   ↓
Add Parent
   ↓
Generate Invitation
   ↓
Parent Opens Link
   ↓
Verification
   ↓
Parent Form
   ↓
Submission
   ↓
Database
   ↓
Student Dashboard
```

### Ownership Boundary

OM owns **how application data is stored, validated, accessed, and transferred**.

Backend APIs should provide clean contracts for the frontend and Decision Engine.

---

# 5. Daksh — Frontend + UI/UX

### Primary Responsibility

Daksh owns the complete user-facing experience of ALIGNX.

## Frontend Responsibilities

- Landing page
- Student onboarding
- Career Discovery interface
- Aptitude assessment interface
- Career DNA reveal
- Parent addition flow
- Parent invitation interface
- Parent status interface
- Parent form
- Student dashboard
- Career recommendation cards
- Career score visualization
- Career Twin interface
- What-If Career Simulator interface
- Skill-gap interface
- Personalized roadmap interface
- Responsive design
- Animations
- Interaction design
- Visual consistency

## UI/UX Responsibilities

- User flows
- Wireframes
- Component design
- Design system
- Typography
- Color system
- Layout
- Navigation
- Interaction states
- Loading states
- Empty states
- Error states
- Mobile responsiveness

### Ownership Boundary

Daksh owns **how users interact with ALIGNX and how information is presented**.

The frontend should consume backend APIs and Decision Engine results rather than duplicating core recommendation logic.

---

# 6. Responsibility Boundaries

To avoid duplicated work, the following boundaries should be maintained.

| Area | Owner |
|---|---|
| Career scoring | Himanshu |
| Decision Engine | Himanshu |
| Career DNA algorithm | Himanshu |
| Financial Constraint Solver | Himanshu |
| Conflict Index | Himanshu |
| Career knowledge base | Arpit |
| Career data | Arpit |
| LLM prompts | Arpit |
| LLM explanations | Arpit |
| Backend | OM |
| Database | OM |
| APIs | OM |
| Authentication | OM |
| Parent invitation system | OM |
| Frontend | Daksh |
| UI/UX | Daksh |
| Wireframes | Daksh |
| Dashboard UI | Daksh |
| Career visualization | Daksh |

---

# 7. Cross-Team Integration

ALIGNX should be developed as connected layers.

```text
                    ┌──────────────────────┐
                    │      FRONTEND        │
                    │       Daksh          │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │       BACKEND        │
                    │         OM           │
                    └───────┬───────┬──────┘
                            │       │
                            ▼       ▼
                  ┌────────────┐  ┌──────────────┐
                  │ ALIGNX     │  │ Career       │
                  │ Decision   │  │ Knowledge    │
                  │ Engine     │  │ Base         │
                  │ Himanshu   │  │ Arpit        │
                  └─────┬──────┘  └──────┬───────┘
                        │                │
                        └───────┬────────┘
                                ▼
                         ┌─────────────┐
                         │ LLM Layer   │
                         │   Arpit     │
                         └─────────────┘
```

---

# 8. Shared Development Principles

All team members should follow these principles.

### 8.1 Single Source of Truth

Important business rules should exist in one place.

Do not implement the same scoring logic independently in multiple modules.

---

### 8.2 API Contracts First

Before frontend/backend integration, agree on:

- Request structure
- Response structure
- Field names
- Data types
- Error format
- Authentication requirements

---

### 8.3 Clear Ownership

A team member should be able to modify their module without unnecessarily modifying another member's module.

If a change crosses ownership boundaries, coordinate before implementation.

---

### 8.4 No Duplicate Logic

For example:

```text
❌ Frontend calculates career score
❌ Backend calculates a different career score
❌ LLM generates another ranking

Instead:

Frontend
   ↓
Backend
   ↓
ALIGNX Decision Engine
   ↓
Single Official Score
```

---

### 8.5 Explainability

Every important recommendation should be explainable.

Example:

```text
AI Engineer — 91%

Student Fit       94
Financial Fit     82
Family Alignment  88
Market Fit        95
Location Fit      86
```

The exact weights and formulas are defined in the Decision Engine documentation.

---

# 9. Collaboration Workflow

Each team member should work primarily within their assigned ownership area.

```text
                ALIGNX
                   │
       ┌───────────┼───────────┐
       │           │           │
       ▼           ▼           ▼
   Intelligence   Data      Infrastructure
       │           │           │
    Himanshu      Arpit        OM
                   │
                   ▼
              Experience
                 Daksh
```

However, ownership does not mean isolation.

Team members should coordinate whenever:

- An API contract changes
- A database schema changes
- A scoring input changes
- A new feature requires multiple layers
- A data field is renamed
- A UI requires a new backend capability
- The Decision Engine requires new career data

---

# 10. Git Responsibilities

Each team member should:

1. Work on their assigned feature/module.
2. Create a separate feature branch.
3. Commit related changes together.
4. Push the branch.
5. Open a Pull Request.
6. Explain what changed.
7. Test before requesting review.
8. Avoid modifying unrelated files.

Example:

```bash
git checkout -b feature/career-dna
```

```bash
git add .
git commit -m "feat: implement career DNA scoring"
git push origin feature/career-dna
```

---

# 11. Communication Rule

Before making a cross-module change, communicate with the owner of that module.

Examples:

```text
Frontend needs a new API
        ↓
Talk to OM

Decision Engine needs new career fields
        ↓
Talk to Arpit + OM

Backend needs a new scoring output
        ↓
Talk to Himanshu

Dashboard needs a new visualization
        ↓
Talk to Daksh
```

---

# 12. Final Ownership Model

The team can be summarized as:

```text
┌──────────────────────────────────────────────┐
│                  ALIGNX                      │
│                                              │
│  Himanshu → DECISION                         │
│  Arpit    → KNOWLEDGE + EXPLANATION          │
│  OM       → INFRASTRUCTURE + DATA            │
│  Daksh    → EXPERIENCE                       │
│                                              │
└──────────────────────────────────────────────┘
```

The four layers together form the complete ALIGNX system:

**Knowledge → Decision → Infrastructure → Experience**

No single layer is sufficient on its own. The final product depends on clean integration between all four.