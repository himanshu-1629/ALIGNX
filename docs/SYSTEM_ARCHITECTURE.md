# ALIGNX — System Architecture

> **Product:** ALIGNX — Aligning Talent With Opportunity  
> **Hackathon:** DataQuest 3.0  
> **Document:** System Architecture  
> **Version:** 1.0

---

# 1. Architecture Overview

ALIGNX is designed as a modular, layered system connecting:

```text
Student
   ↓
Frontend
   ↓
Backend API
   ↓
Application Services
   ↓
ALIGNX Decision Engine
   ↓
Career + Market Knowledge
   ↓
Recommendation
   ↓
LLM Explanation
   ↓
Frontend
```

The architecture separates:

- User experience
- API orchestration
- Persistent data
- Decision intelligence
- Career knowledge
- AI-generated explanations

---

# 2. High-Level Architecture

```text
                         ┌───────────────────────┐
                         │        STUDENT        │
                         │       / PARENT        │
                         └───────────┬───────────┘
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │       FRONTEND        │
                         │      React + TS        │
                         │                       │
                         │ Onboarding            │
                         │ Assessments            │
                         │ Dashboard              │
                         │ Career Twin            │
                         │ What-If                │
                         └───────────┬───────────┘
                                     │
                                HTTPS / REST
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │      BACKEND API      │
                         │    Node + Express     │
                         │                       │
                         │ Auth                  │
                         │ Validation            │
                         │ Controllers           │
                         │ Services              │
                         │ Orchestration         │
                         └───────┬───────┬───────┘
                                 │       │
                  ┌──────────────┘       └──────────────┐
                  ▼                                     ▼
        ┌───────────────────┐                ┌───────────────────┐
        │     DATABASE      │                │ DECISION ENGINE   │
        │   MongoDB Atlas   │                │                   │
        │                   │                │ Student Fit       │
        │ Students          │                │ Financial Fit     │
        │ Parents           │                │ Family Alignment  │
        │ Assessments       │                │ Market Fit        │
        │ Careers           │                │ Location Fit      │
        │ Recommendations   │                │ Ranking           │
        └───────────────────┘                └─────────┬─────────┘
                                                       │
                                             ┌─────────┴─────────┐
                                             ▼                   ▼
                                  ┌──────────────────┐  ┌──────────────────┐
                                  │ CAREER KNOWLEDGE │  │  MARKET / LOCAL  │
                                  │      BASE       │  │      DATA        │
                                  └──────────────────┘  └──────────────────┘
                                                       │
                                                       ▼
                                             ┌──────────────────┐
                                             │   LLM SERVICE    │
                                             │                  │
                                             │ Explanations     │
                                             │ Roadmaps         │
                                             │ Skill Gaps       │
                                             └────────┬─────────┘
                                                      │
                                                      ▼
                                               Recommendation
                                                  Response
```

---

# 3. Architectural Layers

## Layer 1 — Presentation Layer

Owned primarily by **Daksh**.

Responsibilities:

- User interface
- Navigation
- Forms
- Assessments
- Visualizations
- Dashboard
- Career recommendations
- Career Twin
- What-If interface
- Roadmap

The frontend communicates with the backend through APIs.

---

# 4. API Layer

Owned primarily by **OM**.

Responsibilities:

- HTTP requests
- Authentication
- Authorization
- Input validation
- Response formatting
- Error handling
- API routing

The API layer should not contain large scoring algorithms.

---

# 5. Application Service Layer

The service layer coordinates operations such as:

```text
StudentService
AssessmentService
ParentService
RecommendationService
CareerService
SimulationService
RoadmapService
```

Example:

```text
RecommendationController
        ↓
RecommendationService
        ↓
Decision Engine
        ↓
Career Data
        ↓
Recommendation Result
```

---

# 6. Data Layer

Owned primarily by **OM**.

The data layer manages persistent information.

Major data domains:

```text
Students
Parents
Families
Assessments
Career DNA
Financial Profiles
Careers
Skills
Market Data
Recommendations
Invitations
Roadmaps
```

The frontend must never directly access the database.

---

# 7. Decision Intelligence Layer

Owned primarily by **Himanshu**.

This is the core intelligence of ALIGNX.

Components:

```text
Student Vector
      ↓
Career Fit
      ↓
Financial Constraint Solver
      ↓
Family Alignment
      ↓
Conflict Index
      ↓
Market Fit
      ↓
Location Fit
      ↓
Career Ranking
```

---

# 8. Knowledge Layer

Owned primarily by **Arpit**.

Contains structured knowledge about:

- Careers
- Skills
- Aptitudes
- Interests
- Education
- Exams
- Scholarships
- Salary ranges
- Market demand
- Geographic demand
- Alternative careers
- Interdisciplinary careers

The knowledge layer supplies facts to the Decision Engine.

---

# 9. LLM Layer

The LLM acts as an intelligence-assistance layer.

It should receive structured information from the application.

```text
Decision Engine
      ↓
Structured Result
      ↓
LLM
      ↓
Explanation
```

The LLM should not independently determine the official recommendation ranking.

---

# 10. Core Data Flow

## 10.1 Student Onboarding

```text
Student
   ↓
Frontend Form
   ↓
POST /students
   ↓
Backend Validation
   ↓
Student Service
   ↓
Database
```

---

# 11. Career Discovery Flow

```text
Student
   ↓
Career Discovery UI
   ↓
Answers
   ↓
Assessment API
   ↓
Assessment Service
   ↓
Database
   ↓
Student Profile
```

---

# 12. Aptitude Flow

```text
Student
   ↓
Aptitude Questions
   ↓
Answers
   ↓
Backend
   ↓
Aptitude Scoring
   ↓
Normalized Results
   ↓
Database
```

---

# 13. Career DNA Flow

```text
Career Discovery
       +
Aptitude
       +
Skills
       +
Interests
       +
Goals
       ↓
Student Feature Profile
       ↓
Career DNA Engine
       ↓
Career DNA
       ↓
Database
```

Example:

```text
Analytical → 91
Builder    → 84
Research   → 81
Creative   → 74
Leadership → 63
Social     → 58
Risk       → 71
```

---

# 14. Parent Invitation Architecture

```text
Student
   ↓
Add Parent
   ↓
Backend
   ↓
Generate Secure Token
   ↓
Store Invitation
   ↓
Generate URL
   ↓
Parent Opens URL
   ↓
Verification
   ↓
Parent Form
   ↓
Submit
   ↓
Backend
   ↓
Database
```

Parent access should be limited to the invited workflow.

---

# 15. Multiple Parent Architecture

ALIGNX supports multiple parents/guardians.

```text
                 Student
                    │
                  Family
        ┌───────────┼───────────┐
        │           │           │
     Parent 1    Parent 2    Parent 3
        │           │           │
        └───────────┼───────────┘
                    ↓
             Family Analysis
```

Each parent should retain their individual responses.

The Decision Engine then generates the combined family signal.

---

# 16. Family Intelligence Flow

```text
Parent Data
     +
Student Preferences
     ↓
Financial Constraint Solver
     ↓
Financial Fit

Parent Expectations
     +
Student Preferences
     ↓
Parent–Student Conflict Index
     ↓
Family Alignment
```

---

# 17. Recommendation Architecture

```text
                    Student
                       │
                       ▼
                Student Profile
                       │
                       ▼
                Student Vector
                       │
                       ├──────────────┐
                       │              │
                       ▼              ▼
                Family Profile   Career Database
                       │              │
                       ▼              │
              Family Intelligence     │
                       │              │
                       └──────┬───────┘
                              ▼
                       Market Data
                              │
                              ▼
                      Location Data
                              │
                              ▼
                  ┌──────────────────────┐
                  │ ALIGNX DECISION      │
                  │ ENGINE               │
                  └──────────┬───────────┘
                             │
                             ▼
                      Eligibility Filter
                             │
                             ▼
                       Career Scoring
                             │
                             ▼
                         Ranking
                             │
                             ▼
                   Recommendation Result
                             │
                             ▼
                           LLM
                             │
                             ▼
                        Explanation
```

---

# 18. Decision Engine Components

## 18.1 Student Fit

```text
Interest
+
Aptitude
+
Skills
+
Career Discovery
+
Career DNA
+
Goals
```

---

## 18.2 Financial Fit

```text
Education Cost
+
Family Budget
+
Education Duration
+
Risk
+
Location Cost
```

---

## 18.3 Family Alignment

```text
Parent Expectations
+
Risk Preference
+
Stability Preference
+
Location Preference
+
Student Preference
```

---

## 18.4 Market Fit

```text
Demand
+
Hiring Velocity
+
Industry Growth
+
Career Stability
+
Emerging Opportunity
```

---

## 18.5 Location Fit

```text
Student Location
+
Preferred Location
+
Career Demand
+
Relocation Willingness
```

---

# 19. Recommendation Calculation

Initial engine configuration:

```text
Student Fit       = 35%
Financial Fit     = 20%
Family Alignment  = 15%
Market Fit        = 20%
Location Fit      = 10%
```

Formula:

```text
Overall Score =
    0.35 × Student Fit
  + 0.20 × Financial Fit
  + 0.15 × Family Alignment
  + 0.20 × Market Fit
  + 0.10 × Location Fit
```

All component scores should be normalized to the same scale.

---

# 20. Eligibility Architecture

Career ranking should happen after basic eligibility filtering.

```text
All Careers
    ↓
Prerequisite Check
    ↓
Education Requirement
    ↓
Required Skill / Pathway Check
    ↓
Eligible Careers
    ↓
Decision Engine
    ↓
Ranking
```

This prevents a career from receiving a high recommendation score when the student cannot reasonably enter the pathway without addressing prerequisite requirements.

---

# 21. Career Vector Architecture

Each career can be represented as a structured feature vector.

Example:

```text
AI Engineer

Analytical: 95
Logical:    94
Numerical:  88
Creative:   76
Builder:    89
Research:   84
Risk:       65
```

The student's profile can be represented using compatible dimensions.

The engine can then calculate component-level similarity.

---

# 22. Career Twin Architecture

```text
Student Vector
       +
Career Vector
       ↓
Feature Comparison
       ↓
Strong Matches
       +
Weak Matches
       +
Missing Skills
       ↓
Career Twin
```

The Career Twin is primarily a visualization and interpretation layer.

---

# 23. What-If Architecture

The What-If Simulator creates a temporary scenario.

```text
Current Student Profile
          ↓
Copy Profile
          ↓
Modify Scenario
          ↓
Temporary Profile
          ↓
Same Decision Engine
          ↓
New Recommendations
          ↓
Compare With Original
```

Original data must not be overwritten.

---

# 24. LLM Architecture

The LLM should receive:

```text
Career
Overall Score
Component Scores
Student Strengths
Skill Gaps
Family Constraints
Market Information
Education Pathway
```

The LLM generates:

```text
Why Recommended
Potential Concerns
Skill Gap Explanation
Career Roadmap
Alternative Careers
```

---

# 25. Database Interaction

The backend is the only normal application layer that should directly interact with the database.

```text
Frontend
   X
   │
   │ No direct database access
   │
Backend
   ↓
Database
```

This provides:

- Security
- Validation
- Centralized business logic
- Consistent access patterns

---

# 26. Caching Architecture

Static or slowly changing data may be cached.

Suitable candidates:

- Career metadata
- Skill definitions
- Aptitude dimensions
- Market datasets
- Scholarship metadata

Personalized data should be refreshed when relevant inputs change.

---

# 27. Error Flow

```text
Frontend Request
      ↓
Backend Validation
      ↓
Invalid?
 ┌────┴─────┐
Yes         No
 │           │
 ▼           ▼
Error      Service
Response      │
              ▼
          Operation
              │
        ┌─────┴─────┐
      Error       Success
        │             │
        ▼             ▼
   Error Response   Data Response
```

---

# 28. Security Architecture

Sensitive information includes:

- Student personal data
- Parent information
- Financial information
- Invitation tokens
- Authentication credentials

Security requirements:

```text
HTTPS
  +
Authentication
  +
Authorization
  +
Input Validation
  +
Secure Tokens
  +
Database Access Control
  +
Environment Secrets
```

---

# 29. Parent Security

Parent invitation links must:

- Use unpredictable tokens.
- Have an expiration time.
- Be associated with one invitation.
- Provide limited access.
- Avoid exposing internal database identifiers.
- Become invalid when appropriate.

---

# 30. API Communication

All frontend/backend communication should occur over HTTPS in production.

Example:

```text
POST /api/v1/recommendations
```

Request:

```json
{
  "studentId": "student_123"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "recommendations": []
  }
}
```

Detailed contracts belong in:

`docs/API_DOCUMENTATION.md`

---

# 31. Component Communication

The system should follow:

```text
UI
 ↓
API Client
 ↓
Backend Controller
 ↓
Service
 ↓
Engine / Database / LLM
 ↓
Service
 ↓
Controller
 ↓
API Response
 ↓
UI
```

Components should avoid tightly coupling themselves to database implementation details.

---

# 32. Deployment Architecture

Recommended MVP deployment:

```text
                  Internet
                     │
                     ▼
              ┌─────────────┐
              │   Vercel    │
              │  Frontend   │
              └──────┬──────┘
                     │
                     ▼
              ┌─────────────┐
              │   Backend   │
              │ Node/Express│
              └───┬─────┬───┘
                  │     │
          ┌───────┘     └────────┐
          ▼                      ▼
   ┌─────────────┐        ┌─────────────┐
   │   MongoDB   │        │  LLM API    │
   │    Atlas    │        │             │
   └─────────────┘        └─────────────┘
```

The exact cloud provider can be changed without changing the logical architecture.

---

# 33. Repository Architecture

```text
ALIGNX/
│
├── README.md
├── PROJECT.md
├── TEAM.md
├── TASKS.md
├── .gitignore
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

# 34. Module Ownership

```text
┌─────────────────────────────────────┐
│              ALIGNX                 │
├─────────────────────────────────────┤
│                                     │
│ Himanshu                            │
│ AI/ML + Decision Engine             │
│                                     │
│ Arpit                               │
│ Career Data + LLM                   │
│                                     │
│ OM                                  │
│ Backend + Database + APIs           │
│                                     │
│ Daksh                               │
│ Frontend + UI/UX                    │
│                                     │
└─────────────────────────────────────┘
```

---

# 35. Cross-Module Integration

## Student Profile

```text
Daksh
  ↓
Frontend Form
  ↓
OM
  ↓
Backend API
  ↓
Database
  ↓
Himanshu
  ↓
Student Vector
```

## Career Knowledge

```text
Arpit
  ↓
Career Dataset
  ↓
Database
  ↓
Decision Engine
```

## Recommendations

```text
Himanshu
  ↓
Decision Engine
  ↓
OM
  ↓
Recommendation API
  ↓
Daksh
  ↓
Dashboard
```

## Explanation

```text
Decision Engine
      ↓
Structured Result
      ↓
Arpit / LLM Layer
      ↓
Explanation
      ↓
Frontend
```

---

# 36. Architecture Rules

### Rule 1 — One Decision Engine

All official career ranking must come from one engine.

### Rule 2 — Backend as Gateway

Frontend must communicate with backend APIs rather than directly accessing core services.

### Rule 3 — Data/Logic Separation

Career facts must remain separate from scoring logic.

### Rule 4 — LLM Is Not the Source of Truth

The LLM explains structured decisions.

### Rule 5 — Temporary What-If Data

What-If scenarios must not overwrite the student's real profile.

### Rule 6 — Secure Parent Access

Parent invitations must use secure temporary access.

### Rule 7 — Modular Services

Features should be implemented as reusable services rather than one large backend module.

### Rule 8 — Explicit Contracts

Cross-module communication must use documented contracts.

---

# 37. Architecture Evolution

The MVP should remain simple enough for a hackathon while allowing future expansion.

### MVP

```text
React
+
Node/Express
+
MongoDB Atlas
+
Decision Engine
+
LLM
```

### Future

```text
Frontend
      ↓
API Gateway
      ↓
Microservices / Modular Services
      ├── Profile Service
      ├── Assessment Service
      ├── Recommendation Service
      ├── Market Intelligence
      ├── Career Knowledge
      └── Roadmap Service
```

The team should not introduce unnecessary microservices during the MVP.

---

# 38. End-to-End Architecture

```text
                         ALIGNX
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
     STUDENT             FAMILY              MARKET
        │                   │                   │
        ▼                   ▼                   ▼
   Interests            Budget              Demand
   Aptitude             Risk                Location
   Skills               Goals               Opportunity
   Goals                Expectations        Growth
        │                   │                   │
        └───────────────────┼───────────────────┘
                            ▼
                 ┌─────────────────────┐
                 │ ALIGNX DECISION     │
                 │ ENGINE              │
                 └──────────┬──────────┘
                            │
                    Eligibility
                            │
                         Scoring
                            │
                         Ranking
                            │
                 ┌──────────┴──────────┐
                 │                     │
                 ▼                     ▼
           Career Twin             What-If
                 │                 Simulator
                 │                     │
                 └──────────┬──────────┘
                            ▼
                    Recommendations
                            │
                            ▼
                           LLM
                            │
                            ▼
                  Explanation + Roadmap
                            │
                            ▼
                       Student UI
```

---

# 39. Final Architecture Principle

ALIGNX follows this fundamental architecture:

> **The frontend captures and presents information, the backend orchestrates the application, the database stores structured state, the knowledge layer provides factual career information, the Decision Engine calculates career alignment, and the LLM converts structured results into understandable guidance.**

This separation ensures that ALIGNX remains:

- Explainable
- Testable
- Maintainable
- Secure
- Scalable
- Easy for the four-member team to develop independently
- Suitable for rapid hackathon iteration