# ALIGNX — Development Roadmap

> **Product:** ALIGNX — Aligning Talent With Opportunity  
> **Document:** Development Roadmap  
> **Version:** 1.0

---

# 1. Purpose

This roadmap defines the recommended implementation sequence for ALIGNX.

The goal is to avoid building isolated features and instead build the product as a series of integrated vertical slices.

The most important rule is:

> **Build the recommendation pipeline early. Do not spend most of the hackathon polishing screens before the core engine works.**

---

# 2. Development Strategy

ALIGNX should be developed in the following order:

```text
Foundation
   ↓
Student Profile
   ↓
Career Discovery
   ↓
Aptitude
   ↓
Career DNA
   ↓
Parent Intelligence
   ↓
Career Knowledge Base
   ↓
Decision Engine
   ↓
Recommendations
   ↓
Explainability
   ↓
Career Twin
   ↓
What-If
   ↓
Skill Gap
   ↓
Roadmap
   ↓
Polish + Demo
```

---

# 3. Priority Levels

## P0 — Must Have

Required for a functional hackathon MVP.

```text
Student onboarding
Career Discovery
Aptitude assessment
Career DNA
Parent invitation
Parent financial/expectation form
Career dataset
Decision Engine
Recommendations
Explainability
Basic roadmap
```

---

## P1 — Strong Differentiators

Build after the core pipeline works.

```text
Career Twin
What-If Simulator
Skill Gap Analysis
Multiple Parent Support
Family Conflict Analysis
Location-aware recommendations
```

---

## P2 — Enhancement

Useful but not required for the first working version.

```text
Advanced market visualization
Interdisciplinary career graph
Advanced comparison
Recommendation history
Recommendation versioning
```

---

## P3 — Future

Do not prioritize during the initial hackathon build.

```text
Real-time labor market ingestion
Advanced predictive models
Large-scale psychometric validation
External education integrations
Scholarship automation
Institution integrations
Mobile application
```

---

# 4. Phase 0 — Project Foundation

## Goal

Create a stable development environment for all four team members.

### Tasks

```text
Repository
   ↓
Branch strategy
   ↓
Frontend setup
   ↓
Backend setup
   ↓
Database setup
   ↓
Environment configuration
   ↓
Basic CI / testing
```

### Himanshu

- Define Decision Engine interfaces.
- Define scoring inputs.
- Define student vector structure.
- Define Career DNA dimensions.
- Define recommendation output structure.

### Arpit

- Create initial career knowledge dataset.
- Define career schema.
- Define career attributes.
- Collect initial career data.

### OM

- Initialize backend.
- Configure database.
- Create initial migrations.
- Implement basic API structure.
- Configure validation.

### Daksh

- Initialize frontend.
- Configure routing.
- Establish design system.
- Create reusable components.
- Build landing page shell.

### Deliverable

```text
Frontend ↔ Backend ↔ Database
```

must communicate successfully.

---

# 5. Phase 1 — Student Profile

## Goal

Create the basic student identity and profile.

### Features

- Onboarding
- Education
- Location
- Interests
- Skills
- Goals

### Backend

Implement:

```text
POST /students
GET /students/:id
PATCH /students/:id
```

### Database

Create:

```text
students
student_interests
student_skills
```

### Frontend

Build:

```text
Landing
   ↓
Onboarding
   ↓
Student Profile
```

### Completion condition

A student can create and retrieve a complete profile.

---

# 6. Phase 2 — Career Discovery

## Goal

Capture meaningful preference and interest signals.

### Frontend

Build:

- Scenario cards
- Progress indicator
- Answer selection
- Navigation
- Completion state

### Backend

Store:

```text
assessment
responses
career discovery results
```

### Himanshu

Define:

```text
Question
   ↓
Trait Mapping
   ↓
Signal
```

### Arpit

Create:

- Scenario questions
- Trait mappings
- Career-related signals

### Deliverable

A student completes Career Discovery and receives a structured profile.

---

# 7. Phase 3 — Aptitude Assessment

## Goal

Create a normalized aptitude profile.

### Dimensions

```text
Logical
Numerical
Analytical
Spatial / Pattern
Verbal
```

### Frontend

Build:

- Question interface
- Progress
- Answer selection
- Completion state

### Backend

Implement:

```text
POST /assessments/aptitude
GET /students/:id/aptitude
```

### Himanshu

Implement:

```text
Responses
   ↓
Dimension Scoring
   ↓
Normalization
   ↓
Aptitude Profile
```

### Arpit

Provide:

- Questions
- Answer keys
- Dimension mappings

### Deliverable

Student receives a structured aptitude profile.

---

# 8. Phase 4 — Career DNA

## Goal

Convert student signals into a memorable identity.

### Inputs

```text
Career Discovery
+
Aptitude
+
Skills
+
Interests
```

### Dimensions

```text
Analytical
Builder
Research
Creative
Leadership
Social
Risk
```

### Himanshu

Own:

- Trait calculation
- Normalization
- Primary identity
- Secondary traits

### Daksh

Own:

- Career DNA reveal
- Visualization
- Trait cards
- Explanation layout

### OM

Store:

```text
career_dna
```

### Deliverable

Example:

```text
Analytical Builder

Analytical: 91
Builder: 84
Research: 81
```

---

# 9. Phase 5 — Parent Intelligence

## Goal

Introduce the family dimension.

### Features

- Add parent
- Generate invitation
- Parent link
- Parent form
- Parent status
- Multiple parents

### OM

Build:

```text
families
parents
parent_invitations
parent_financial_profiles
parent_expectations
```

### Daksh

Build:

```text
Add Parent
Parent Status
Invitation
Parent Form
Completion State
```

### Arpit

Define:

- Parent questions
- Financial categories
- Risk categories
- Career expectation categories

### Himanshu

Define:

- Family representation
- Financial Fit
- Parent–Student Conflict Index

---

# 10. Phase 6 — Family Analysis

## Goal

Convert parent data into usable recommendation inputs.

### Financial Constraint Solver

Consider:

```text
Education Cost
Family Budget
Income Context
Financial Commitments
Funding Opportunities
Time-to-Earnings
```

Output:

```text
Financial Fit
```

### Parent–Student Alignment

Compare:

```text
Career Preference
Budget
Risk
Location
Stability
Time-to-Earnings
```

Output:

```text
Family Alignment
Conflict Index
```

### Deliverable

```text
Financial Fit = 82
Family Alignment = 88
Conflict Index = 24
```

---

# 11. Phase 7 — Career Knowledge Base

## Goal

Create the structured source of career truth.

### Career fields

```text
Career
Skills
Aptitude Profile
Interest Profile
Education
Education Cost
Salary
Market Demand
Location Demand
Risk
Exams
Scholarships
Alternative Careers
```

### Arpit owns the knowledge layer.

### Himanshu validates the fields required by the Decision Engine.

### OM owns storage/API integration.

### Important rule

Do not build an enormous dataset first.

Start with approximately:

```text
20–50 careers
```

with high-quality structured attributes.

Expand later.

---

# 12. Phase 8 — Market & Location Intelligence

## Goal

Add opportunity context.

### Inputs

```text
Market Demand
Growth
Location Demand
Salary
Economic Risk
```

Possible locations:

```text
Local
Regional
National
Global
```

For the hackathon MVP, curated or static market data is acceptable if clearly represented.

Do not make real-time scraping a dependency for the core demo.

---

# 13. Phase 9 — ALIGNX Decision Engine

## Goal

Build the central recommendation engine.

### Pipeline

```text
Student
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
Eligibility
   ↓
Ranking
```

### Initial formula

```text
Alignment Score =
    0.35 × Student Fit
  + 0.20 × Financial Fit
  + 0.15 × Family Alignment
  + 0.20 × Market Fit
  + 0.10 × Location Fit
```

### Critical engineering rule

Keep the scoring engine deterministic.

Same inputs should produce the same result.

---

# 14. Decision Engine Architecture

Recommended:

```text
DecisionEngine
├── EligibilityFilter
├── StudentFitCalculator
├── FinancialFitCalculator
├── FamilyAlignmentCalculator
├── MarketFitCalculator
├── LocationFitCalculator
├── CareerRanker
└── ExplanationDataBuilder
```

This allows each component to be tested independently.

---

# 15. Phase 10 — Recommendation API

## Goal

Expose engine results to the frontend.

### Endpoint

```text
POST /recommendations/generate
```

### Input

```json
{
  "studentId": "student_id"
}
```

### Output

```json
{
  "recommendations": [
    {
      "career": "AI Engineer",
      "score": 91,
      "studentFit": 94,
      "financialFit": 82,
      "familyAlignment": 88,
      "marketFit": 95,
      "locationFit": 86
    }
  ]
}
```

---

# 16. Phase 11 — Recommendation Dashboard

## Goal

Turn engine output into a useful student experience.

### Features

- Top career cards
- Alignment score
- Component scores
- Why this career
- Strengths
- Concerns
- Career details

### Daksh

Own presentation.

### Himanshu

Own score correctness.

### OM

Own API integration.

### Arpit

Own career explanations/facts.

---

# 17. Phase 12 — Explainability

## Goal

Make every recommendation understandable.

### Explanation structure

```text
Why recommended?
      ↓
Strongest factors
      ↓
Supporting evidence
      ↓
Potential concerns
      ↓
What to improve
```

Example:

```text
AI Engineer — 91%

Why:
+ Strong analytical aptitude
+ Strong AI interest
+ Good programming foundation
+ High market demand

Watch out:
- Machine learning skills need development
- Advanced specialization may increase education cost
```

---

# 18. Phase 13 — LLM Integration

## Goal

Use LLM where it creates meaningful value.

### LLM responsibilities

- Explain recommendations
- Explain skill gaps
- Explain career pathways
- Generate roadmap descriptions
- Suggest interdisciplinary alternatives
- Answer career questions using structured context

### LLM should NOT:

- Independently rank careers
- Invent salary values
- Invent market statistics
- Override eligibility
- Replace deterministic scoring

### Architecture

```text
Decision Engine
      ↓
Structured Results
      ↓
Knowledge Base
      ↓
LLM
      ↓
Explanation
```

---

# 19. Phase 14 — Career Twin

## Goal

Create a visual representation of student-career alignment.

### Inputs

```text
Career DNA
Aptitude
Skills
Interests
Goals
```

### Output

```text
Student
   ↓
Career Twin
   ↓
Selected Career
```

### Show

- Matching traits
- Matching skills
- Missing skills
- Potential concerns

---

# 20. Phase 15 — Skill Gap Analysis

## Goal

Determine what the student needs to improve.

```text
Career Requirements
       -
Student Profile
       ↓
Skill Gap
```

Example:

```text
Python            Strong
Statistics        Developing
Machine Learning  Priority
System Design     Future
```

---

# 21. Phase 16 — Personalized Roadmap

## Goal

Turn recommendations into an actionable plan.

### Roadmap inputs

```text
Target Career
Current Skills
Skill Gaps
Education
Goals
Time Availability
```

### Roadmap output

```text
Foundation
    ↓
Skill Development
    ↓
Projects
    ↓
Experience
    ↓
Interview Preparation
    ↓
Career Entry
```

---

# 22. Phase 17 — What-If Simulator

## Goal

Show how changing constraints affects recommendations.

### Variables

```text
Education Budget
Location
Risk Appetite
Time-to-Employment
```

### Flow

```text
Current Profile
      ↓
Change Variable
      ↓
Create Temporary Scenario
      ↓
Run Same Decision Engine
      ↓
Compare
```

### Important

The simulator must reuse the same Decision Engine.

Do not create a separate scoring formula.

---

# 23. Phase 18 — Interdisciplinary Careers

## Goal

Find non-obvious career combinations.

Example:

```text
Medicine
+
Technology
       ↓
Medical AI
Bioinformatics
Biomedical Engineering
Computational Biology
Medical Robotics
```

This should be based on structured career relationships and student signals.

---

# 24. Phase 19 — Advanced Market Intelligence

Optional enhancement:

```text
Local Demand
Regional Demand
National Demand
Global Demand
```

Possible visualizations:

- Location comparison
- Demand map
- Salary comparison
- Growth trend
- Opportunity density

This should only be implemented after the core recommendation engine is stable.

---

# 25. Phase 20 — Testing

Testing should happen continuously.

## Frontend

Test:

- Forms
- Navigation
- Components
- Responsive behavior
- Assessment flow

## Backend

Test:

- API validation
- Authentication
- Parent invitations
- Database operations
- Error handling

## Decision Engine

Test:

- Individual scoring components
- Eligibility
- Ranking
- Edge cases
- Determinism

## Integration

Test:

```text
Student
→ Assessment
→ Parent
→ Recommendation
→ Roadmap
```

---

# 26. Phase 21 — Demo Preparation

The demo should follow one strong story.

Recommended demo student:

```text
Student
↓
Completes Discovery
↓
Gets Career DNA
↓
Adds Parents
↓
Family constraints appear
↓
Market data appears
↓
ALIGNX recommends careers
↓
Student asks "Why?"
↓
Career Twin
↓
What-If
↓
Roadmap
```

---

# 27. Hackathon Demo Strategy

Do not demo every feature.

Focus on the product's strongest differentiator:

```text
Student
+
Family
+
Market
      ↓
ALIGNX
      ↓
Explainable Career Alignment
```

The judges should understand within minutes that ALIGNX is more than a normal career recommendation quiz.

---

# 28. Parallel Development Plan

The four members can work in parallel after the foundation.

```text
                    ALIGNX
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
    HIMANSHU         ARPIT            OM
  Decision Engine  Knowledge/LLM   Backend/DB
        │              │              │
        └──────────────┼──────────────┘
                       │
                       ▼
                     DAKSH
                  Frontend/UI
```

---

# 29. Team Dependency Order

## Himanshu depends on

- Arpit's career data
- OM's API/data structures

## Arpit depends on

- Engine-required career attributes
- Product requirements

## OM depends on

- Database schema
- API contracts
- Engine input/output structures

## Daksh depends on

- API contracts
- UI/UX specification
- Response schemas

---

# 30. Integration Milestones

## Milestone 1

```text
Frontend → Backend → Database
```

Student profile works.

---

## Milestone 2

```text
Assessment → Backend → Results
```

Career Discovery and Aptitude work.

---

## Milestone 3

```text
Student
→ Career DNA
```

---

## Milestone 4

```text
Student
→ Parent
→ Family Analysis
```

---

## Milestone 5

```text
Student
+
Family
+
Career Data
→ Decision Engine
```

---

## Milestone 6

```text
Decision Engine
→ Recommendation Dashboard
```

---

## Milestone 7

```text
Recommendation
→ Career Twin
→ Skill Gap
→ Roadmap
```

---

## Milestone 8

```text
Recommendation
→ What-If
```

---

# 31. Vertical Slice Strategy

Instead of completing every frontend screen first, build one complete path.

### First vertical slice

```text
Onboarding
   ↓
Career Discovery
   ↓
Aptitude
   ↓
Career DNA
   ↓
One Parent
   ↓
Family Data
   ↓
5–10 Careers
   ↓
Decision Engine
   ↓
Top 3 Recommendations
```

Once this works end-to-end, expand.

---

# 32. Recommended Build Order by Team

## Himanshu

```text
1. Student vector
2. Aptitude scoring
3. Career DNA
4. Student Fit
5. Financial Fit
6. Family Alignment
7. Market Fit
8. Location Fit
9. Eligibility
10. Ranking
11. Explainability data
12. What-If
```

---

## Arpit

```text
1. Career schema
2. Initial career dataset
3. Skill mappings
4. Aptitude mappings
5. Interest mappings
6. Cost data
7. Salary data
8. Market data
9. Location data
10. Alternative careers
11. LLM prompts
12. Explanation templates
```

---

## OM

```text
1. Backend setup
2. Database setup
3. Student APIs
4. Assessment APIs
5. Career APIs
6. Parent APIs
7. Invitation APIs
8. Family APIs
9. Recommendation APIs
10. What-If APIs
11. Validation
12. Security
```

---

## Daksh

```text
1. Design system
2. Landing
3. Onboarding
4. Career Discovery
5. Aptitude
6. Career DNA
7. Parent flow
8. Dashboard
9. Recommendation cards
10. Career details
11. Career Twin
12. What-If
13. Roadmap
14. Final polish
```

---

# 33. Critical Integration Contracts

The following interfaces should be agreed upon before implementation:

```text
Student Profile Schema
Assessment Response Schema
Aptitude Result Schema
Career DNA Schema
Parent Profile Schema
Career Schema
Decision Engine Input
Decision Engine Output
Recommendation Schema
What-If Scenario Schema
Roadmap Schema
```

These should not be changed casually after multiple modules depend on them.

---

# 34. Definition of "MVP Complete"

ALIGNX MVP is complete when a new student can:

```text
1. Create profile
2. Complete Career Discovery
3. Complete Aptitude Assessment
4. View Career DNA
5. Add at least one parent
6. Receive family analysis
7. Generate career recommendations
8. Understand why careers were recommended
9. View career details
10. View a basic skill gap
11. Receive a basic roadmap
```

---

# 35. Definition of "Hackathon Ready"

The product is hackathon ready when:

- Core flow works end-to-end.
- Recommendation results are deterministic.
- Data is seeded.
- No critical API failures exist.
- Parent invitation works.
- Recommendation explanations are understandable.
- UI is responsive.
- Demo account is prepared.
- Loading/error states exist.
- Environment variables are configured.
- README is updated.
- Architecture is explainable to judges.

---

# 36. Final Priority Matrix

| Feature | Priority | Dependency |
|---|---|---|
| Landing | P0 | None |
| Onboarding | P0 | Backend |
| Career Discovery | P0 | Questions + API |
| Aptitude | P0 | Questions + Engine |
| Career DNA | P0 | Discovery + Aptitude |
| Parent Flow | P0 | Backend + UI |
| Financial Fit | P0 | Parent + Career Data |
| Family Alignment | P0 | Parent + Student |
| Career Dataset | P0 | None |
| Market Data | P0 | Career Dataset |
| Decision Engine | P0 | All scoring inputs |
| Recommendations | P0 | Decision Engine |
| Explainability | P0 | Recommendations |
| Skill Gap | P1 | Career + Student |
| Roadmap | P1 | Skill Gap |
| Career Twin | P1 | Student + Career |
| What-If | P1 | Decision Engine |
| Interdisciplinary Careers | P1 | Career Knowledge |
| Advanced Market Map | P2 | Market Data |
| Real-time Market APIs | P3 | External Sources |

---

# 37. Final Roadmap

```text
PHASE 0
Foundation
     ↓
PHASE 1
Student Profile
     ↓
PHASE 2
Career Discovery
     ↓
PHASE 3
Aptitude
     ↓
PHASE 4
Career DNA
     ↓
PHASE 5
Parent Intelligence
     ↓
PHASE 6
Family Analysis
     ↓
PHASE 7
Career Knowledge
     ↓
PHASE 8
Market Intelligence
     ↓
PHASE 9
ALIGNX Decision Engine
     ↓
PHASE 10
Recommendations
     ↓
PHASE 11
Explainability
     ↓
PHASE 12
Career Twin
     ↓
PHASE 13
Skill Gap + Roadmap
     ↓
PHASE 14
What-If
     ↓
PHASE 15
Testing + Integration
     ↓
PHASE 16
Demo + Polish
```

---

# 38. Core Rule

> **Do not build features because they look impressive. Build the dependency chain that makes ALIGNX's core decision possible.**

The highest-value path is:

```text
Student
+
Family
+
Market
      ↓
ALIGNX Decision Engine
      ↓
Explainable Recommendation
      ↓
Actionable Roadmap
```

Everything else should strengthen this journey.