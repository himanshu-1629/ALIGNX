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

- [ ] Define career data structure
- [ ] Create initial career dataset
- [ ] Add career descriptions
- [ ] Add required skills
- [ ] Add aptitude profiles
- [ ] Add interest profiles
- [ ] Add education pathways
- [ ] Add education cost ranges
- [ ] Add salary ranges
- [ ] Add career risk levels
- [ ] Add entrance exams
- [ ] Add scholarships
- [ ] Add alternative careers
- [ ] Add interdisciplinary careers

**Status:** `TODO`

---

## Phase 2 — Market Knowledge

- [ ] Define market demand structure
- [ ] Add career demand indicators
- [ ] Add geographic demand
- [ ] Add regional opportunity data
- [ ] Add local innovation opportunities where available
- [ ] Define market-data update strategy

**Status:** `TODO`

---

## Phase 3 — LLM Layer

- [ ] Design recommendation explanation prompt
- [ ] Design Career DNA explanation prompt
- [ ] Design skill-gap prompt
- [ ] Design career roadmap prompt
- [ ] Design alternative-career prompt
- [ ] Design interdisciplinary-career prompt
- [ ] Design education-pathway prompt
- [ ] Add structured context to prompts
- [ ] Prevent unsupported factual generation

**Status:** `TODO`

---

## Phase 4 — LLM Integration

- [ ] Integrate LLM API
- [ ] Create reusable prompt templates
- [ ] Create structured LLM response format
- [ ] Add fallback handling
- [ ] Test generated explanations
- [ ] Test hallucination-prone cases
- [ ] Connect LLM outputs to frontend

**Status:** `TODO`

---

# 5. OM — Backend + Database

## Phase 1 — Backend Foundation

- [ ] Initialize backend
- [ ] Configure environment variables
- [ ] Configure database connection
- [ ] Configure API structure
- [ ] Configure error handling
- [ ] Configure request validation
- [ ] Configure logging
- [ ] Configure CORS

**Status:** `TODO`

---

## Phase 2 — Database

Create and implement:

- [ ] Students
- [ ] Parents/Guardians
- [ ] Family relationships
- [ ] Student assessments
- [ ] Aptitude results
- [ ] Career DNA results
- [ ] Financial profiles
- [ ] Career knowledge
- [ ] Market data
- [ ] Recommendations
- [ ] Parent invitation tokens
- [ ] Parent submission status

**Status:** `TODO`

---

## Phase 3 — Student APIs

- [ ] Student registration
- [ ] Student profile API
- [ ] Student profile update
- [ ] Assessment submission
- [ ] Aptitude result storage
- [ ] Career DNA storage
- [ ] Recommendation retrieval

**Status:** `TODO`

---

## Phase 4 — Parent APIs

- [ ] Add parent/guardian
- [ ] Generate invitation link/code
- [ ] Parent verification
- [ ] Parent form retrieval
- [ ] Parent form submission
- [ ] Parent status
- [ ] Multiple-parent support
- [ ] Invalid/expired invitation handling

**Status:** `TODO`

---

## Phase 5 — Recommendation APIs

- [ ] Recommendation request endpoint
- [ ] Decision Engine integration
- [ ] Career ranking response
- [ ] Score breakdown response
- [ ] Recommendation explanation response
- [ ] Career details endpoint
- [ ] What-If endpoint

**Status:** `TODO`

---

## Phase 6 — Testing & Security

- [ ] Validate API inputs
- [ ] Validate authentication
- [ ] Protect sensitive family information
- [ ] Protect invitation tokens
- [ ] Handle unauthorized requests
- [ ] Test API edge cases
- [ ] Test database constraints

**Status:** `TODO`

---

# 6. Daksh — Frontend + UI/UX

## Phase 1 — Design System

- [ ] Define color palette
- [ ] Define typography
- [ ] Define spacing system
- [ ] Define button styles
- [ ] Define card styles
- [ ] Define form styles
- [ ] Define navigation
- [ ] Define responsive breakpoints
- [ ] Define loading states
- [ ] Define error states
- [ ] Define empty states

**Status:** `TODO`

---

## Phase 2 — Landing & Onboarding

- [ ] Landing page
- [ ] Product explanation
- [ ] Student onboarding
- [ ] Basic profile form
- [ ] Interest collection
- [ ] Goal collection
- [ ] Location collection

**Status:** `TODO`

---

## Phase 3 — Career Discovery

- [ ] Interactive scenario cards
- [ ] One-question-at-a-time interaction
- [ ] Progress indicator
- [ ] Career preference collection
- [ ] Discovery completion screen
- [ ] Connect responses to backend

**Status:** `TODO`

---

## Phase 4 — Aptitude Assessment

- [ ] Aptitude quiz UI
- [ ] Question navigation
- [ ] Progress tracking
- [ ] Answer selection
- [ ] Result loading state
- [ ] Aptitude result visualization

**Status:** `TODO`

---

## Phase 5 — Career DNA

- [ ] Career DNA reveal
- [ ] Trait visualization
- [ ] Primary trait
- [ ] Secondary traits
- [ ] Career DNA explanation
- [ ] Career DNA animation

**Status:** `TODO`

---

## Phase 6 — Parent Flow

- [ ] Add parent/guardian screen
- [ ] Parent information form
- [ ] Generate invitation UI
- [ ] Copy invitation link
- [ ] Parent status cards
- [ ] Pending state
- [ ] Filling state
- [ ] Completed state
- [ ] Multiple-parent support

**Status:** `TODO`

---

## Phase 7 — Recommendation Dashboard

- [ ] Dashboard
- [ ] Top career cards
- [ ] Overall score visualization
- [ ] Student Fit visualization
- [ ] Financial Fit visualization
- [ ] Family Alignment visualization
- [ ] Market Fit visualization
- [ ] Location Fit visualization
- [ ] Recommendation explanation
- [ ] Career comparison

**Status:** `TODO`

---

## Phase 8 — Career Twin

- [ ] Career Twin visualization
- [ ] Student-to-career mapping
- [ ] Strength indicators
- [ ] Weakness indicators
- [ ] Skill-gap indicators
- [ ] Career alternatives

**Status:** `TODO`

---

## Phase 9 — What-If Simulator

- [ ] Budget control
- [ ] Location control
- [ ] Risk appetite control
- [ ] Time-to-employment control
- [ ] Run simulation button
- [ ] Before/after comparison
- [ ] Ranking changes
- [ ] Explanation of changes

**Status:** `TODO`

---

## Phase 10 — Roadmap

- [ ] Skill-gap display
- [ ] Learning roadmap
- [ ] Education pathway
- [ ] Exams
- [ ] Scholarships
- [ ] Milestones
- [ ] Career preparation timeline

**Status:** `TODO`

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