# ALIGNX — Development Tasks

> **Project:** ALIGNX — Aligning Talent With Opportunity  
> **Hackathon:** DataQuest 3.0  
> **Team:** 4 Members

---

# 1. Purpose

This file contains the development tasks required to build ALIGNX.

Tasks are divided by ownership so that each team member knows:

- What they need to build
- What they need to deliver
- Which modules depend on their work
- Which tasks must be completed before integration

This file should be updated as development progresses.

---

# 2. Task Status

Use the following status values:

| Status | Meaning |
|---|---|
| `TODO` | Not started |
| `IN PROGRESS` | Currently being developed |
| `BLOCKED` | Waiting for another task/team member |
| `REVIEW` | Completed and waiting for review |
| `DONE` | Completed and tested |

---

# 3. Himanshu — AI/ML + Decision Engine

## Phase 1 — Intelligence Foundation

- [ ] Define student profile dimensions
- [ ] Define interest dimensions
- [ ] Define aptitude dimensions
- [ ] Define skill dimensions
- [ ] Define Career DNA dimensions
- [ ] Define family/financial dimensions
- [ ] Define market dimensions
- [ ] Define location dimensions
- [ ] Define normalized score ranges

**Status:** `TODO`

---

## Phase 2 — Student Intelligence

- [ ] Implement student vector representation
- [ ] Implement interest scoring
- [ ] Implement aptitude scoring
- [ ] Implement skill-fit scoring
- [ ] Implement Career DNA generation
- [ ] Generate dominant Career DNA traits
- [ ] Generate secondary traits
- [ ] Create student-fit calculation

**Status:** `TODO`

---

## Phase 3 — Family Intelligence

- [ ] Define financial fit calculation
- [ ] Implement education affordability logic
- [ ] Implement budget constraint logic
- [ ] Implement risk appetite interpretation
- [ ] Implement family alignment calculation
- [ ] Implement Parent–Student Conflict Index
- [ ] Support multiple parents/guardians
- [ ] Handle incomplete parent responses

**Status:** `TODO`

---

## Phase 4 — ALIGNX Decision Engine

Implement the main career ranking engine.

Initial model:

```text
Overall Score =
    35% Student Fit
  + 20% Financial Fit
  + 15% Family Alignment
  + 20% Market Fit
  + 10% Location Fit
```

Tasks:

- [ ] Implement Student Fit
- [ ] Implement Financial Fit
- [ ] Implement Family Alignment
- [ ] Implement Market Fit
- [ ] Implement Location Fit
- [ ] Implement overall score
- [ ] Implement career ranking
- [ ] Implement tie-breaking logic
- [ ] Return component scores
- [ ] Return recommendation reasons
- [ ] Return confidence/quality indicators where appropriate

**Status:** `TODO`

> The weights are configurable and can be adjusted during testing. They are not official hackathon-provided weights.

---

## Phase 5 — What-If Simulator

- [ ] Define What-If input parameters
- [ ] Support education budget changes
- [ ] Support location changes
- [ ] Support risk appetite changes
- [ ] Support time-to-employment changes
- [ ] Re-run the same Decision Engine
- [ ] Compare original vs simulated recommendations
- [ ] Show score changes
- [ ] Explain why rankings changed

**Status:** `TODO`

---

## Phase 6 — Integration

- [ ] Integrate career knowledge data
- [ ] Integrate market data
- [ ] Integrate location data
- [ ] Integrate backend API
- [ ] Test recommendation pipeline
- [ ] Test edge cases
- [ ] Validate recommendation consistency

**Status:** `TODO`

---

# 4. Arpit — Data + LLM

## Phase 1 — Career Knowledge Base

- [x] Define career data structure
- [x] Create initial career dataset
- [x] Add career descriptions
- [x] Add required skills
- [x] Add aptitude profiles
- [x] Add interest profiles
- [x] Add education pathways
- [x] Add education cost ranges
- [x] Add salary ranges
- [x] Add career risk levels
- [x] Add entrance exams
- [x] Add scholarships
- [x] Add alternative careers
- [x] Add interdisciplinary careers

**Status:** `DONE`

---

## Phase 2 — Market Knowledge

- [x] Define market demand structure
- [x] Add career demand indicators
- [x] Add geographic demand
- [x] Add regional opportunity data
- [x] Add local innovation opportunities where available
- [x] Define market-data update strategy

**Status:** `DONE`

---

## Phase 3 — LLM Layer

- [x] Design recommendation explanation prompt
- [x] Design Career DNA explanation prompt
- [x] Design skill-gap prompt
- [x] Design career roadmap prompt
- [x] Design alternative-career prompt
- [x] Design interdisciplinary-career prompt
- [x] Design education-pathway prompt
- [x] Add structured context to prompts
- [x] Prevent unsupported factual generation

**Status:** `DONE`

---

## Phase 4 — LLM Integration

- [x] Integrate LLM API (Google Gemini API)
- [x] Create reusable prompt templates
- [x] Create structured LLM response format
- [x] Add fallback handling (Deterministic offline generation engine)
- [x] Test generated explanations
- [x] Test hallucination-prone cases
- [x] Connect LLM outputs to frontend

**Status:** `DONE`

---

# 5. OM — Backend + Database

## Phase 1 — Backend Foundation

- [x] Initialize backend
- [x] Configure environment variables
- [x] Configure database connection
- [x] Configure API structure
- [x] Configure error handling
- [x] Configure request validation
- [x] Configure logging
- [x] Configure CORS

**Status:** `DONE`

---

## Phase 2 — Database

Create and implement:

- [x] Students
- [x] Parents/Guardians
- [x] Family relationships
- [x] Student assessments
- [x] Aptitude results
- [x] Career DNA results
- [x] Financial profiles
- [x] Career knowledge
- [x] Market data
- [x] Recommendations
- [x] Parent invitation tokens
- [x] Parent submission status

**Status:** `DONE`

---

## Phase 3 — Student APIs

- [x] Student registration
- [x] Student profile API
- [x] Student profile update
- [x] Assessment submission
- [x] Aptitude result storage
- [x] Career DNA storage
- [x] Recommendation retrieval

**Status:** `DONE`

---

## Phase 4 — Parent APIs

- [x] Add parent/guardian
- [x] Generate invitation link/code
- [x] Parent verification
- [x] Parent form retrieval
- [x] Parent form submission
- [x] Parent status
- [x] Multiple-parent support
- [x] Invalid/expired invitation handling

**Status:** `DONE`

---

## Phase 5 — Recommendation APIs

- [x] Recommendation request endpoint
- [x] Decision Engine integration
- [x] Career ranking response
- [x] Score breakdown response
- [x] Recommendation explanation response
- [x] Career details endpoint
- [x] What-If endpoint

**Status:** `DONE`

---

## Phase 6 — Testing & Security

- [x] Validate API inputs
- [x] Validate authentication
- [x] Protect sensitive family information
- [x] Protect invitation tokens
- [x] Handle unauthorized requests
- [x] Test API edge cases
- [x] Test database constraints

**Status:** `DONE`

---

# 6. Daksh — Frontend + UI/UX

## Phase 1 — Design System

- [x] Define color palette
- [x] Define typography
- [x] Define spacing system
- [x] Define button styles
- [x] Define card styles
- [x] Define form styles
- [x] Define navigation
- [x] Define responsive breakpoints
- [x] Define loading states
- [x] Define error states
- [x] Define empty states

**Status:** `DONE`

---

## Phase 2 — Landing & Onboarding

- [x] Landing page
- [x] Product explanation
- [x] Student onboarding
- [x] Basic profile form
- [x] Interest collection
- [x] Goal collection
- [x] Location collection

**Status:** `DONE`

---

## Phase 3 — Career Discovery

- [x] Interactive scenario cards
- [x] One-question-at-a-time interaction
- [x] Progress indicator
- [x] Career preference collection
- [x] Discovery completion screen
- [x] Connect responses to backend

**Status:** `DONE`

---

## Phase 4 — Aptitude Assessment

- [x] Aptitude quiz UI
- [x] Question navigation
- [x] Progress tracking
- [x] Answer selection
- [x] Result loading state
- [x] Aptitude result visualization

**Status:** `DONE`

---

## Phase 5 — Career DNA

- [x] Career DNA reveal
- [x] Trait visualization
- [x] Primary trait
- [x] Secondary traits
- [x] Career DNA explanation
- [x] Career DNA animation

**Status:** `DONE`

---

## Phase 6 — Parent Flow

- [x] Add parent/guardian screen
- [x] Parent information form
- [x] Generate invitation UI
- [x] Copy invitation link
- [x] Parent status cards
- [x] Pending state
- [x] Filling state
- [x] Completed state
- [x] Multiple-parent support

**Status:** `DONE`

---

## Phase 7 — Recommendation Dashboard

- [x] Dashboard
- [x] Top career cards
- [x] Overall score visualization
- [x] Student Fit visualization
- [x] Financial Fit visualization
- [x] Family Alignment visualization
- [x] Market Fit visualization
- [x] Location Fit visualization
- [x] Recommendation explanation
- [x] Career comparison

**Status:** `DONE`

---

## Phase 8 — Career Twin

- [x] Career Twin visualization
- [x] Student-to-career mapping
- [x] Strength indicators
- [x] Weakness indicators
- [x] Skill-gap indicators
- [x] Career alternatives

**Status:** `DONE`

---

## Phase 9 — What-If Simulator

- [x] Budget control
- [x] Location control
- [x] Risk appetite control
- [x] Time-to-employment control
- [x] Run simulation button
- [x] Before/after comparison
- [x] Ranking changes
- [x] Explanation of changes

**Status:** `DONE`

---

## Phase 10 — Roadmap

- [x] Skill-gap display
- [x] Learning roadmap
- [x] Education pathway
- [x] Exams
- [x] Scholarships
- [x] Milestones
- [x] Career preparation timeline

**Status:** `DONE`

---

# 7. Cross-Team Tasks

These tasks require collaboration between multiple team members.

## Student Profile

```text
Daksh
  ↓
Frontend Form
  ↓
OM
  ↓
Database
  ↓
Himanshu
  ↓
Student Vector
```

- [ ] Agree on student profile fields
- [ ] Define API contract
- [ ] Implement database model
- [ ] Implement frontend form
- [ ] Implement student vector

---

## Aptitude Assessment

```text
Daksh → Quiz UI
OM → API + Storage
Himanshu → Scoring
```

- [ ] Define question format
- [ ] Define aptitude dimensions
- [ ] Implement questions
- [ ] Build UI
- [ ] Build API
- [ ] Implement scoring
- [ ] Store results
- [ ] Display results

---

## Parent Intelligence

```text
Daksh → Parent UI
OM → Parent APIs + DB
Himanshu → Financial + Conflict Logic
Arpit → Parent-facing explanations
```

- [ ] Define parent fields
- [ ] Define financial fields
- [ ] Define risk fields
- [ ] Build invitation flow
- [ ] Build parent form
- [ ] Store responses
- [ ] Calculate financial fit
- [ ] Calculate conflict index
- [ ] Display results

---

## Career Recommendations

```text
Arpit
   ↓
Career Knowledge
   ↓
Himanshu
   ↓
ALIGNX Decision Engine
   ↓
OM
   ↓
API
   ↓
Daksh
   ↓
Dashboard
```

- [ ] Finalize career schema
- [ ] Populate career data
- [ ] Implement scoring
- [ ] Implement ranking
- [ ] Build API
- [ ] Build recommendation UI
- [ ] Add explanation layer

---

# 8. Integration Milestones

## Milestone 1 — Foundation

- [ ] Repository structure complete
- [ ] Backend initialized
- [ ] Frontend initialized
- [ ] Database initialized
- [ ] Documentation initialized
- [ ] Team ownership finalized

---

## Milestone 2 — User Data

- [ ] Student onboarding complete
- [ ] Career Discovery complete
- [ ] Aptitude assessment complete
- [ ] Parent invitation complete
- [ ] Parent form complete

---

## Milestone 3 — Intelligence

- [ ] Career dataset available
- [ ] Student vector implemented
- [ ] Career DNA implemented
- [ ] Financial Solver implemented
- [ ] Conflict Index implemented
- [ ] Decision Engine implemented

---

## Milestone 4 — Recommendations

- [ ] Recommendation API complete
- [ ] Career ranking complete
- [ ] Explainable recommendations complete
- [ ] Dashboard connected

---

## Milestone 5 — Differentiation

- [ ] Career Twin
- [ ] What-If Simulator
- [ ] Interdisciplinary career discovery
- [ ] Skill-gap analysis
- [ ] Personalized roadmap

---

## Milestone 6 — Hackathon Demo

- [ ] End-to-end flow tested
- [ ] Demo data prepared
- [ ] UI polished
- [ ] Error states handled
- [ ] Performance checked
- [ ] Final presentation flow tested
- [ ] Demo backup prepared

---

# 9. Definition of Done

A task is considered `DONE` only when:

- The feature is implemented.
- The feature works with the relevant API/data.
- Basic edge cases are handled.
- No obvious console/runtime errors remain.
- The feature has been tested locally.
- Related documentation is updated if necessary.
- Code is committed to the feature branch.
- Pull Request is created when applicable.

---

# 10. Priority Levels

| Priority | Meaning |
|---|---|
| `P0` | Required for MVP/demo |
| `P1` | Important for strong submission |
| `P2` | Enhancement |
| `P3` | Future scope |

### P0 — Must Have

- Student onboarding
- Career Discovery
- Aptitude assessment
- Parent invitation
- Parent financial input
- Career knowledge base
- ALIGNX Decision Engine
- Career recommendations
- Explainable scoring
- Dashboard

### P1 — Strong Differentiators

- Career DNA
- Parent–Student Conflict Index
- Financial Constraint Solver
- Career Twin
- Skill-gap analysis
- Personalized roadmap

### P2 — Advanced Features

- What-If Career Simulator
- Interdisciplinary career discovery
- Hyper-local opportunity intelligence
- Advanced visualizations

### P3 — Future Scope

- Real-time labor market APIs
- Large-scale psychometric validation
- Institution dashboards
- Counselor dashboards
- Long-term career tracking
- Advanced predictive analytics

---

# 11. Rule for Adding New Tasks

Before adding a major feature, answer:

1. Does it directly support ALIGNX?
2. Is it required for the MVP?
3. Which team member owns it?
4. What dependencies does it have?
5. Does it require a database/API change?
6. Does it affect the Decision Engine?
7. Does it affect the existing user flow?

Do not add major features only because they sound impressive.

The hackathon MVP should prioritize:

```text
Working Product
      >
Clear Intelligence
      >
Good UX
      >
Extra Features
```

---

# 12. Current Team Goal

The immediate objective is to build a complete working vertical slice:

```text
Student
   ↓
Career Discovery
   ↓
Aptitude Assessment
   ↓
Career DNA
   ↓
Add Parent
   ↓
Parent Financial Input
   ↓
Family Analysis
   ↓
Market Intelligence
   ↓
ALIGNX Decision Engine
   ↓
Top Career Recommendations
   ↓
Career Twin
   ↓
Roadmap
```

Once this complete flow works, additional features should be added without breaking the core pipeline.