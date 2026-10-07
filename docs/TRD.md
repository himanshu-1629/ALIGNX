# ALIGNX — Technical Requirements Document

> **Project:** ALIGNX — Aligning Talent With Opportunity  
> **Hackathon:** DataQuest 3.0  
> **Document:** Technical Requirements Document  
> **Version:** 1.0

---

# 1. Purpose

This document defines the technical requirements, engineering decisions, interfaces, data flow, and implementation standards for ALIGNX.

The PRD defines **what the product must do**.

This document defines **how the product should technically achieve it**.

---

# 2. Technical Vision

ALIGNX should use a modular architecture:

```text
Frontend
   ↓
Backend API
   ↓
Application Services
   ↓
ALIGNX Decision Engine
   ↓
┌───────────────┬────────────────┐
│ Career Data   │ Market Data    │
└───────────────┴────────────────┘
   ↓
Database
```

The LLM layer should operate primarily as an explanation and assistance layer.

```text
Decision Engine
      ↓
Structured Recommendation
      ↓
LLM
      ↓
Human-readable Explanation
```

---

# 3. Core Technical Principles

## 3.1 Separation of Concerns

Each layer must have a clear responsibility.

```text
Frontend
→ User interaction

Backend
→ API + application orchestration

Database
→ Persistent data

Decision Engine
→ Scoring + ranking

Knowledge Base
→ Career and market information

LLM
→ Explanation + generation
```

---

## 3.2 Single Decision Engine

There must be one authoritative implementation of career scoring.

The following components must NOT independently calculate career rankings:

- Frontend
- Backend
- LLM

The backend should call the Decision Engine.

---

## 3.3 Deterministic Core

Given the same:

- Student profile
- Family profile
- Career data
- Market data
- Location

the Decision Engine should produce the same result, assuming the same engine configuration.

---

## 3.4 Explainability

The engine must return component-level scores rather than only a final score.

Example:

```json
{
  "career": "AI Engineer",
  "overall_score": 91,
  "components": {
    "student_fit": 94,
    "financial_fit": 82,
    "family_alignment": 88,
    "market_fit": 95,
    "location_fit": 86
  }
}
```

---

# 4. Recommended Technology Stack

The exact implementation may evolve, but the following stack is recommended for the MVP.

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Reusable component architecture
- Chart/visualization library where required

## Backend

- Node.js
- Express.js
- TypeScript
- REST APIs

## Database

- MongoDB (MongoDB Atlas)

MongoDB is used for document-oriented storage of polymorphic AI structures, Career DNA, and fast hackathon iteration:

- MongoDB Atlas (Cloud-hosted cluster)
- Mongoose ODM (for Node.js/Express) or Motor/Beanie (for FastAPI)
- Native JSON/BSON document modeling for Career DNA and assessment answers
- Built-in MongoDB Atlas Vector Search ($vectorSearch) for semantic matching

## AI/ML

- Python for advanced scoring/ML services if required
- Node.js integration where a separate service is unnecessary
- LLM API for explanations and roadmap generation

## Deployment

Possible MVP deployment:

```text
Frontend → Vercel
Backend  → Render / Railway / Vercel-compatible service
Database → MongoDB Atlas
AI      → API-based service
```

The final deployment provider can be changed without changing the product architecture.

---

# 5. High-Level Architecture

```text
                         ┌─────────────────────┐
                         │       Student       │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │      Frontend       │
                         │      React/TS        │
                         └──────────┬──────────┘
                                    │
                              REST / HTTPS
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │      Backend        │
                         │    Node/Express     │
                         └──────────┬──────────┘
                                    │
                  ┌─────────────────┼─────────────────┐
                  │                 │                 │
                  ▼                 ▼                 ▼
             MongoDB Atlas     Decision Engine      LLM Service
                  │                 │                 │
                  │                 │                 │
                  └────────────┬────┴─────────────────┘
                               │
                               ▼
                      Recommendation Result
                               │
                               ▼
                           Frontend
```

---

# 6. Frontend Requirements

## 6.1 Frontend Responsibilities

The frontend must handle:

- Navigation
- Forms
- Assessments
- Career Discovery
- Career DNA visualization
- Parent invitation
- Parent status
- Dashboard
- Career recommendations
- Career Twin
- What-If Simulator
- Roadmap
- Loading/error states

The frontend must not contain authoritative career-ranking logic.

---

# 7. Frontend Architecture

Recommended structure:

```text
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── hooks/
│   ├── services/
│   ├── api/
│   ├── types/
│   ├── utils/
│   ├── constants/
│   ├── context/
│   └── assets/
├── public/
├── package.json
└── README.md
```

---

# 8. Frontend State Management

Application state may be divided into:

### Local UI State

Examples:

- Modal visibility
- Current question
- Animation state
- Form field state

### Session State

Examples:

- Logged-in student
- Current onboarding progress
- Parent invitation state

### Server State

Examples:

- Student profile
- Assessment results
- Recommendations
- Parent statuses
- Career data

Server state should not be duplicated unnecessarily in local state.

---

# 9. Backend Requirements

The backend is responsible for:

- Authentication
- Authorization
- Input validation
- API routing
- Business orchestration
- Database interaction
- Decision Engine integration
- LLM integration
- Error handling
- Security

---

# 10. Backend Architecture

Recommended structure:

```text
backend/
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── models/
│   ├── middleware/
│   ├── validators/
│   ├── utils/
│   ├── config/
│   ├── engine/
│   └── types/
├── tests/
├── package.json
└── README.md
```

### Layer responsibilities

```text
Routes
  ↓
Controllers
  ↓
Services
  ↓
Database / Decision Engine / LLM
```

Routes should not contain complex business logic.

---

# 11. API Design

APIs should follow REST principles.

Example:

```text
POST   /api/students
GET    /api/students/:id
PATCH  /api/students/:id

POST   /api/assessments/career-discovery
POST   /api/assessments/aptitude
GET    /api/assessments/:studentId

POST   /api/parents/invite
GET    /api/parents/invite/:token
POST   /api/parents/invite/:token/submit

POST   /api/recommendations
GET    /api/recommendations/:studentId

POST   /api/simulator
GET    /api/careers/:id
```

The exact endpoints are finalized in:

`docs/API_DOCUMENTATION.md`

---

# 12. API Response Standard

Successful responses should follow a consistent structure.

Example:

```json
{
  "success": true,
  "data": {},
  "message": "Request successful"
}
```

Error responses:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Invalid student profile"
  }
}
```

---

# 13. Database Requirements

The database must support:

- Students
- Parents/Guardians
- Family relationships
- Assessments
- Career DNA
- Financial profiles
- Careers
- Skills
- Market information
- Recommendations
- Parent invitations
- Roadmaps

The detailed schema is defined in:

`docs/DATABASE_SCHEMA.md`

---

# 14. Student Data Model

Conceptual structure:

```json
{
  "student": {
    "id": "student_id",
    "name": "Student Name",
    "age": 19,
    "education": "B.Tech",
    "location": "Chennai",
    "skills": [],
    "interests": [],
    "goals": []
  }
}
```

The actual database implementation may normalize these fields into multiple tables.

---

# 15. Parent Data Model

Conceptual structure:

```json
{
  "parent": {
    "id": "parent_id",
    "relationship": "Father",
    "income_range": {},
    "education_budget": {},
    "risk_appetite": "low",
    "stability_preference": "high"
  }
}
```

Sensitive financial data must be protected.

---

# 16. Career Data Model

Each career should contain structured attributes.

```json
{
  "id": "ai_engineer",
  "name": "AI Engineer",
  "skills": [],
  "aptitude_profile": {},
  "interest_profile": {},
  "education_cost": {},
  "salary_range": {},
  "market_demand": {},
  "location_demand": {},
  "risk": "medium",
  "exams": [],
  "scholarships": [],
  "alternative_careers": []
}
```

---

# 17. Data Normalization

Different inputs may have different scales.

For example:

```text
Aptitude → 0–100
Market Demand → 0–10
Risk → categorical
Education Cost → currency
Interest → 1–5
```

The Decision Engine must normalize relevant inputs before combining them.

Example min-max normalization:

```text
normalized =
(value - minimum)
-----------------
(maximum - minimum)
```

The final normalized value should be converted to a consistent scoring range.

---

# 18. ALIGNX Decision Engine

## 18.1 Inputs

The engine receives:

```text
Student Profile
Family Profile
Career Knowledge
Market Data
Location Data
Engine Configuration
```

---

## 18.2 Processing

```text
Raw Input
   ↓
Validation
   ↓
Normalization
   ↓
Student Fit
   ↓
Financial Fit
   ↓
Family Alignment
   ↓
Market Fit
   ↓
Location Fit
   ↓
Weighted Score
   ↓
Ranking
   ↓
Explanation Metadata
```

---

# 19. Decision Engine Formula

Initial configuration:

```text
Student Fit       = 35%
Financial Fit     = 20%
Family Alignment  = 15%
Market Fit        = 20%
Location Fit      = 10%
```

Therefore:

```text
Overall Score =
    0.35 × Student Fit
  + 0.20 × Financial Fit
  + 0.15 × Family Alignment
  + 0.20 × Market Fit
  + 0.10 × Location Fit
```

The weights must be configurable rather than hard-coded throughout the application.

---

# 20. Student Fit

Student Fit may combine:

```text
Interest Match
+
Aptitude Match
+
Skill Match
+
Career Discovery
+
Career DNA
+
Goal Alignment
```

The exact sub-weights should be maintained in the Decision Engine configuration.

---

# 21. Financial Fit

Financial Fit should consider:

```text
Education Cost
+
Family Budget
+
Education Duration
+
Financial Risk
+
Location Cost
```

The implementation should avoid simplistic income-versus-cost comparisons.

---

# 22. Family Alignment

Family Alignment should consider:

- Parent career expectations
- Stability preference
- Risk appetite
- Education preferences
- Location preferences
- Student preferences

Multiple parents should be handled individually before generating a combined family signal.

---

# 23. Parent–Student Conflict Index

Conceptual calculation:

```text
Conflict =
Career Preference Difference
+
Risk Difference
+
Budget Expectation Difference
+
Location Difference
+
Stability Difference
```

The raw result must be normalized to:

```text
0–100
```

Higher score means greater disagreement.

The index should identify areas of disagreement rather than assign blame.

---

# 24. Market Fit

Market Fit can consider:

- Current demand
- Hiring velocity
- Industry growth
- Career stability
- Geographic opportunity
- Emerging demand

For MVP, these values may come from curated data.

---

# 25. Location Fit

Location Fit should consider:

- Student's current/preferred location
- Career demand in that location
- Relocation willingness
- Regional opportunity
- Local cost considerations where data is available

Example:

```text
Student Location → Chennai
Career Demand:
Chennai     → 78
Bangalore   → 92
Hyderabad   → 84
Delhi NCR   → 86
```

---

# 26. Recommendation Ranking

The engine should:

1. Calculate scores for eligible careers.
2. Sort careers by overall score.
3. Preserve component scores.
4. Generate explanation metadata.
5. Return top recommendations.
6. Include meaningful alternatives.

Example:

```json
{
  "recommendations": [
    {
      "career": "AI Engineer",
      "score": 91
    },
    {
      "career": "Data Scientist",
      "score": 86
    },
    {
      "career": "Robotics Engineer",
      "score": 83
    }
  ]
}
```

---

# 27. Career Eligibility vs Ranking

The system should distinguish between:

### Eligibility

Can the student realistically pursue the career based on required prerequisites?

### Ranking

How well does the career align with the student's overall situation?

Conceptually:

```text
Career Universe
      ↓
Eligibility Filter
      ↓
Eligible Careers
      ↓
ALIGNX Scoring
      ↓
Ranking
```

This prevents unsuitable careers from receiving high scores simply because of strong interest.

---

# 28. What-If Simulator

The simulator must not duplicate the Decision Engine.

Architecture:

```text
Current Profile
      ↓
Scenario Modification
      ↓
Temporary Profile
      ↓
Same Decision Engine
      ↓
New Ranking
      ↓
Compare Results
```

Example inputs:

```json
{
  "education_budget": 1000000,
  "location": "Bangalore",
  "risk_appetite": "medium",
  "time_to_employment": "short"
}
```

---

# 29. Career Twin

The Career Twin should use:

```text
Student Vector
+
Career Vector
```

to visualize alignment.

Potential implementation:

```text
Student Profile
      ↓
Feature Vector
      ↓
Career Vector
      ↓
Similarity / Component Matching
      ↓
Career Twin
```

The exact similarity technique can evolve during development.

---

# 30. LLM Architecture

The LLM should receive structured context.

Example:

```json
{
  "career": "AI Engineer",
  "score": 91,
  "student_fit": 94,
  "financial_fit": 82,
  "family_alignment": 88,
  "market_fit": 95,
  "location_fit": 86,
  "strengths": [],
  "gaps": []
}
```

The LLM then generates:

- Explanation
- Strength summary
- Concern summary
- Skill-gap explanation
- Roadmap

---

# 31. LLM Guardrails

The LLM must:

- Use provided structured facts.
- Avoid inventing numeric facts.
- Avoid changing Decision Engine scores.
- Avoid overriding ranking.
- Clearly distinguish estimates from facts.
- Return structured output where possible.

If structured data is unavailable:

```text
Do not invent.
Return:
"Information unavailable."
```

---

# 32. Parent Invitation System

The invitation system should use secure random tokens.

Concept:

```text
Student
   ↓
Generate Token
   ↓
Store Hashed/Protected Token
   ↓
Create Invitation URL
   ↓
Parent Opens URL
   ↓
Verify
   ↓
Submit
```

Invitation tokens should:

- Be unpredictable.
- Have an expiry.
- Be associated with a specific parent invitation.
- Become invalid after appropriate completion/use.
- Never expose internal database IDs unnecessarily.

---

# 33. Authentication

Student authentication should be implemented according to the selected backend/authentication provider.

Parent access should remain lightweight for MVP.

Possible model:

```text
Student
→ Full authentication

Parent
→ Invitation token
→ Verification
→ Limited form access
```

Parents should only access the information necessary to complete their contribution.

---

# 34. Authorization

The system should enforce:

```text
Student
→ Own profile/data

Parent
→ Own invitation/form

Admin/System
→ Authorized platform management
```

A parent must not be able to access another student's information by modifying a URL or identifier.

---

# 35. Validation

Validation must occur on both:

```text
Frontend
+
Backend
```

Frontend validation improves UX.

Backend validation provides security and correctness.

---

# 36. Security Requirements

The system must:

- Never hard-code API secrets.
- Use environment variables.
- Protect authentication tokens.
- Validate all API input.
- Sanitize user-controlled data.
- Protect parent invitation tokens.
- Restrict database access.
- Avoid exposing sensitive financial information.
- Avoid unnecessary logging of personal data.
- Use HTTPS in deployed environments.

---

# 37. Error Handling

All API errors should be predictable.

Example:

```json
{
  "success": false,
  "error": {
    "code": "PARENT_INVITATION_EXPIRED",
    "message": "This invitation has expired."
  }
}
```

Frontend should map known error codes to useful user-facing messages.

---

# 38. Loading & Async Operations

Potentially slow operations include:

- LLM generation
- Recommendation calculation
- Large data retrieval

The UI must provide appropriate loading states.

Example:

```text
Analyzing your profile...
       ↓
Combining family constraints...
       ↓
Checking career opportunities...
       ↓
Building your recommendations...
```

---

# 39. Caching

Caching may be used for relatively static data:

- Career profiles
- Career metadata
- Market datasets
- Scholarship information

Personalized recommendations should be invalidated/recalculated when relevant student or family inputs change.

---

# 40. Testing Requirements

## Unit Testing

Test:

- Scoring functions
- Normalization
- Conflict Index
- Financial Fit
- Career matching
- Eligibility logic

## Integration Testing

Test:

- Frontend → API
- API → Database
- API → Decision Engine
- API → LLM
- Parent invitation flow

## End-to-End Testing

Test:

```text
Student Onboarding
→ Assessment
→ Parent
→ Recommendation
→ Roadmap
```

---

# 41. Decision Engine Test Cases

The engine must be tested with different scenarios.

### Scenario A — Strong Student Fit

```text
High aptitude
High interest
Strong skills
Low financial constraints
High market demand
```

Expected:

High recommendation score.

---

### Scenario B — Strong Interest, Poor Financial Fit

```text
High student fit
Low financial fit
```

Expected:

Career remains visible but receives a reduced overall score and financial explanation.

---

### Scenario C — Strong Student/Market Fit, Family Conflict

```text
High student fit
High market fit
Low family alignment
```

Expected:

Career may still rank highly, but the system should highlight the family conflict.

---

### Scenario D — What-If

Change:

```text
Budget: ₹5L → ₹10L
```

Expected:

Decision Engine recalculates recommendations using the same scoring logic.

---

# 42. Performance Targets

Initial MVP targets:

| Operation | Target |
|---|---:|
| Basic API request | < 500 ms where practical |
| Database query | < 300 ms where practical |
| Recommendation calculation | < 1 second where practical |
| LLM generation | Show asynchronous/loading state |
| Initial page load | Optimize for fast first render |

These are engineering targets, not strict guarantees.

---

# 43. Environment Variables

Secrets must be stored outside source code.

Example:

```env
MONGODB_URI=
JWT_SECRET=
GEMINI_API_KEY=
PORT=5000
```

Never commit `.env` files containing secrets.

Use:

```text
.env
.env.local
```

and appropriate `.gitignore` rules.

---

# 44. Repository Responsibilities

```text
ALIGNX/
│
├── frontend/
│   └── UI + client application
│
├── backend/
│   └── API + services
│
├── database/
│   └── schemas + seed data
│
├── docs/
│   └── project documentation
│
├── assets/
│   ├── wireframes/
│   ├── diagrams/
│   └── screenshots/
│
├── README.md
├── PROJECT.md
├── TEAM.md
└── TASKS.md
```

---

# 45. Integration Contract

Each layer must communicate through explicit contracts.

```text
Frontend
   │
   │ API Contract
   ▼
Backend
   │
   ├── Database Contract
   │
   ├── Decision Engine Contract
   │
   └── LLM Contract
```

Changes to contracts should be communicated to affected team members.

---

# 46. Versioning

API changes should avoid breaking existing frontend functionality.

For major breaking changes, consider:

```text
/api/v1/
```

and later:

```text
/api/v2/
```

The MVP can initially use `/api/v1`.

---

# 47. Logging

Logs should support debugging without exposing sensitive information.

Good:

```text
Recommendation request completed
student_id=<internal-id>
duration=420ms
```

Avoid:

```text
Parent income = ₹12,00,000
Password = ...
Token = ...
```

---

# 48. Deployment Architecture

Recommended MVP:

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
             │  Backend    │
             │ Node/Express│
             └──────┬──────┘
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
   MongoDB Atlas Decision     LLM API
                   Engine
```

Deployment providers are implementation choices and can change.

---

# 49. Data Flow — Complete Recommendation

```text
Student
   ↓
Frontend
   ↓
Student Profile API
   ↓
Database
   ↓
Assessment APIs
   ↓
Student Vector
   ↓
Parent Data
   ↓
Family Vector
   ↓
Career Knowledge Base
   ↓
Market Data
   ↓
ALIGNX Decision Engine
   ↓
Eligibility Filter
   ↓
Component Scores
   ↓
Overall Scores
   ↓
Ranking
   ↓
LLM Explanation
   ↓
Recommendation API
   ↓
Dashboard
```

---

# 50. Technical MVP

The technical MVP is complete when the following pipeline works:

```text
Frontend
   ↓
Backend
   ↓
Database
   ↓
Student + Family Data
   ↓
Career Knowledge
   ↓
Decision Engine
   ↓
Ranked Careers
   ↓
LLM Explanation
   ↓
Frontend Dashboard
```

---

# 51. Technical Priorities

## P0 — Required

- Frontend foundation
- Backend foundation
- Database
- Student profile
- Assessments
- Parent invitation
- Career data
- Decision Engine
- Recommendation API
- Dashboard

## P1 — Important

- Career DNA
- Financial Constraint Solver
- Conflict Index
- LLM explanations
- Career Twin
- Skill Gap

## P2 — Enhancement

- What-If Simulator
- Hyper-local intelligence
- Advanced visualizations
- Interdisciplinary recommendation engine

---

# 52. Engineering Rules

### Rule 1

Do not duplicate Decision Engine logic.

### Rule 2

Do not put secrets in Git.

### Rule 3

Do not let the LLM override deterministic recommendations.

### Rule 4

Do not directly access the database from the frontend.

### Rule 5

Validate data at API boundaries.

### Rule 6

Keep scoring configuration separate from UI code.

### Rule 7

Keep career knowledge separate from scoring logic.

### Rule 8

Use reusable components and services.

### Rule 9

Document breaking API/schema changes.

### Rule 10

Do not add major features without checking the PRD and TASKS.

---

# 53. Technical Source of Truth

| Area | Source |
|---|---|
| Product requirements | `docs/PRD.md` |
| Technical implementation | `docs/TRD.md` |
| Architecture | `docs/SYSTEM_ARCHITECTURE.md` |
| Database | `docs/DATABASE_SCHEMA.md` |
| API contracts | `docs/API_DOCUMENTATION.md` |
| UI/UX | `docs/UI_UX.md` |
| User journeys | `docs/USER_FLOW.md` |
| Development roadmap | `docs/ROADMAP.md` |
| Team ownership | `TEAM.md` |
| Development tasks | `TASKS.md` |

---

# 54. Final Technical Principle

ALIGNX should remain modular:

```text
┌──────────────────────────────────────┐
│             EXPERIENCE               │
│              Daksh                   │
├──────────────────────────────────────┤
│             API LAYER                │
│               OM                     │
├──────────────────────────────────────┤
│         DECISION INTELLIGENCE        │
│             Himanshu                 │
├──────────────────────────────────────┤
│       KNOWLEDGE + AI EXPLANATION     │
│              Arpit                   │
├──────────────────────────────────────┤
│              DATA                    │
│               OM                     │
└──────────────────────────────────────┘
```

The technical architecture should support the central ALIGNX principle:

> **Structured knowledge provides the facts, the Decision Engine makes the decision, the LLM explains the decision, the backend orchestrates the system, and the frontend makes the result understandable and actionable.**