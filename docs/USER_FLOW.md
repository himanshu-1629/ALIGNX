# ALIGNX — User Flow

> **Product:** ALIGNX — Aligning Talent With Opportunity  
> **Document:** User Flow Specification  
> **Version:** 1.0

---

# 1. Purpose

This document defines the end-to-end user journeys and system flows for ALIGNX.

It acts as the shared reference for:

- Frontend
- Backend
- AI/ML
- Database
- UI/UX
- Parent experience
- Recommendation engine

The goal is to ensure every team member implements the same product flow.

---

# 2. Product Flow Overview

The complete ALIGNX journey is:

```text
Landing
   ↓
Student Onboarding
   ↓
Career Discovery
   ↓
Aptitude Assessment
   ↓
Career DNA
   ↓
Add Parent / Guardian
   ↓
Parent Financial & Expectation Input
   ↓
Family Analysis
   ↓
Market Intelligence
   ↓
ALIGNX Decision Engine
   ↓
Career Recommendations
   ↓
Career Twin
   ↓
What-If Simulation
   ↓
Skill Gap
   ↓
Personalized Roadmap
```

---

# 3. Actors

ALIGNX has three primary actors.

## 3.1 Student

The student:

- Creates a profile.
- Completes discovery.
- Takes aptitude assessment.
- Reviews Career DNA.
- Adds parents/guardians.
- Views recommendations.
- Explores career alternatives.
- Runs simulations.
- Follows the roadmap.

---

## 3.2 Parent / Guardian

The parent:

- Receives an invitation.
- Opens a unique link.
- Provides financial information.
- Provides career expectations.
- Provides risk preferences.
- Provides location preferences.
- Submits the form.

A parent does not need a complete student-style account in the MVP.

---

## 3.3 ALIGNX System

The system:

- Collects inputs.
- Validates data.
- Creates student vectors.
- Creates family/financial representations.
- Calculates Career DNA.
- Calculates aptitude results.
- Evaluates financial feasibility.
- Calculates parent-student alignment.
- Retrieves career knowledge.
- Evaluates market opportunity.
- Runs the Decision Engine.
- Generates explanations.
- Produces recommendations and roadmaps.

---

# 4. High-Level Journey

```text
┌───────────────┐
│    STUDENT    │
└───────┬───────┘
        │
        ▼
┌───────────────────┐
│    ONBOARDING     │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ CAREER DISCOVERY  │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ APTITUDE TEST     │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│    CAREER DNA     │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  ADD PARENT(S)    │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ FAMILY ANALYSIS   │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ MARKET ANALYSIS   │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ DECISION ENGINE   │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ RECOMMENDATIONS   │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ ROADMAP + ACTION  │
└───────────────────┘
```

---

# 5. Student Journey

## Step 1 — Landing

Student arrives at ALIGNX.

### User sees

- Product introduction
- Student + Family + Market concept
- Key features
- Example career insight
- CTA

### Primary action

```text
Discover My Career Alignment
```

---

# 6. Step 2 — Student Onboarding

Student provides basic information.

### Information

- Name
- Age
- Education
- Academic background
- Location
- Interests
- Existing skills
- Career goals

### System actions

```text
Validate
   ↓
Create Student
   ↓
Create Profile
   ↓
Save Interests
   ↓
Save Skills
```

### Output

Student profile is created.

---

# 7. Step 3 — Career Discovery

Student enters the interactive discovery experience.

Instead of asking:

> "Select your career."

ALIGNX asks scenario-based questions.

Example:

> You have a difficult technical problem with no obvious solution. What would you naturally do?

Possible choices:

- Break the problem down.
- Build a prototype.
- Research existing solutions.
- Discuss it with others.

---

# 8. Career Discovery Data Flow

```text
Question
   ↓
Student Answer
   ↓
Response Stored
   ↓
Trait Mapping
   ↓
Interest / Preference Signals
   ↓
Career Discovery Profile
```

The frontend should only capture the response.

The backend/engine determines how the response contributes to the profile.

---

# 9. Step 4 — Aptitude Assessment

Student starts the aptitude assessment.

Recommended dimensions:

```text
Logical
Numerical
Analytical
Spatial / Pattern
Verbal
```

### Flow

```text
Start Assessment
      ↓
Question 1
      ↓
Answer
      ↓
Question 2
      ↓
...
      ↓
Assessment Complete
      ↓
Calculate Scores
```

---

# 10. Aptitude Processing

```text
Responses
    ↓
Validation
    ↓
Dimension Mapping
    ↓
Raw Scores
    ↓
Normalization
    ↓
Aptitude Profile
```

Example:

```text
Analytical → 88
Logical → 91
Numerical → 76
Spatial → 72
Verbal → 68
```

These values become inputs to the ALIGNX Decision Engine.

---

# 11. Step 5 — Career DNA

Once Career Discovery and Aptitude are available, ALIGNX generates the student's Career DNA.

Possible dimensions:

```text
Analytical
Builder
Research
Creative
Leadership
Social
Risk
```

### Flow

```text
Career Discovery
       +
Aptitude
       +
Skills
       +
Interests
       ↓
Career DNA Engine
       ↓
Career DNA Profile
```

---

# 12. Career DNA Result

Example:

```text
Primary Identity:
Analytical Builder

Strong traits:
Analytical
Builder
Research

Supporting traits:
Creative
Leadership
```

The system stores the Career DNA for later recommendation calculations.

---

# 13. Step 6 — Add Parent / Guardian

Student reaches the family intelligence stage.

### Student sees

```text
Your career decision is also affected by:

• Education affordability
• Family expectations
• Risk tolerance
• Location
• Financial priorities

[ + Add Parent ]
```

---

# 14. Adding Multiple Parents

The student can add multiple parents/guardians.

Example:

```text
Student
   │
   └── Family
        ├── Father
        ├── Mother
        └── Guardian
```

Each parent has an independent status.

```text
Father    → Completed
Mother    → Pending
Guardian  → Completed
```

---

# 15. Step 7 — Parent Invitation

Student enters:

- Relationship
- Parent name
- Contact information if required

ALIGNX creates an invitation.

```text
Parent
   ↓
Invitation Token
   ↓
Unique Link
   ↓
Parent Opens Link
```

Example:

```text
alignx.app/parent/<token>
```

The token should be unique and securely generated.

---

# 16. Parent Invitation States

A parent invitation can have:

```text
PENDING
FILLING
COMPLETED
EXPIRED
REVOKED
```

Typical flow:

```text
PENDING
   ↓
FILLING
   ↓
COMPLETED
```

---

# 17. Step 8 — Parent Form

Parent opens the invitation.

The parent should immediately understand:

> "This information helps ALIGNX understand your family's financial and career expectations."

---

# 18. Parent Information

The form can collect:

## Financial Context

- Approximate income range
- Education budget
- Existing financial commitments
- Affordability comfort

## Career Expectations

- Preferred career stability
- Expected career outcomes
- Preferred fields
- Education expectations

## Risk

```text
Low
Medium
High
```

## Location

- Preferred location
- Willingness to relocate
- Local preference

---

# 19. Parent Submission

```text
Parent Form
    ↓
Validation
    ↓
Save Financial Profile
    ↓
Save Expectations
    ↓
Update Invitation Status
    ↓
COMPLETED
```

Student dashboard updates accordingly.

---

# 20. Step 9 — Family Analysis

After one or more parents complete their forms:

```text
Student Profile
       +
Parent Profiles
       ↓
Family Analysis
```

The system evaluates:

- Financial feasibility
- Family expectations
- Risk tolerance
- Location preference
- Student-parent alignment

---

# 21. Financial Constraint Solver

The solver evaluates whether a career is financially realistic.

Inputs may include:

```text
Education Cost
+
Family Education Budget
+
Income Context
+
Financial Commitments
+
Funding Opportunities
+
Career Time-to-Earnings
```

Output:

```text
Financial Fit Score
```

Example:

```text
AI Engineer
Financial Fit = 82
```

---

# 22. Parent–Student Conflict Index

The system compares student preferences with parent expectations.

Potential dimensions:

```text
Career Preference
Education Budget
Risk Appetite
Location
Stability Preference
Time-to-Earnings
```

Example:

```text
Conflict Index = 24

Low Conflict
```

Higher value:

```text
Conflict Index = 78

High Conflict
```

The exact scale must remain consistent across backend and frontend.

---

# 23. Step 10 — Market Intelligence

ALIGNX evaluates the career against available opportunity information.

Possible inputs:

```text
Career Demand
Growth
Geographic Demand
Regional Opportunities
Salary Range
Economic Risk
Industry Trends
```

Example:

```text
AI Engineer

Market Fit = 91

Chennai = 78
Bangalore = 92
Hyderabad = 88
```

The source and freshness of market data must be visible where appropriate.

---

# 24. Step 11 — ALIGNX Decision Engine

This is the central decision stage.

Inputs:

```text
Student Profile
       +
Career DNA
       +
Aptitude
       +
Family Context
       +
Financial Constraints
       +
Market Intelligence
       +
Location
       ↓
ALIGNX Decision Engine
```

---

# 25. Recommendation Calculation

Initial team-defined weighting:

```text
Student Fit       35%
Financial Fit     20%
Family Alignment  15%
Market Demand     20%
Location Fit      10%
```

Overall:

```text
Alignment Score =
    0.35 × Student Fit
  + 0.20 × Financial Fit
  + 0.15 × Family Alignment
  + 0.20 × Market Fit
  + 0.10 × Location Fit
```

These weights should be configurable rather than hard-coded throughout the application.

---

# 26. Eligibility Before Ranking

ALIGNX should first check whether a career is realistically eligible.

```text
Career
   ↓
Eligibility Check
   ↓
Eligible?
 ┌──────┴──────┐
No             Yes
│               │
Exclude         Rank
```

Eligibility may consider:

- Required education
- Required prerequisites
- Hard constraints
- Financial impossibility where applicable
- Other career-specific requirements

Do not use the ranking score to bypass hard eligibility constraints.

---

# 27. Recommendation Output

The engine returns ranked careers.

Example:

```text
1. AI Engineer          91
2. Data Scientist       86
3. Robotics Engineer    83
4. Product Engineer     80
```

It should also return component scores.

```text
AI Engineer

Student Fit       94
Financial Fit     82
Family Alignment  88
Market Fit        95
Location Fit      86

Overall           91
```

---

# 28. Step 12 — Recommendation Dashboard

Student sees:

```text
Your strongest career alignments
```

Each career card should contain:

- Career name
- Alignment score
- Short reason
- Key strengths
- Potential concerns
- Explore button

---

# 29. Explainability Flow

When student asks:

> Why AI Engineer?

System should respond with structured reasons.

```text
Recommendation
      ↓
Component Scores
      ↓
Top Contributing Factors
      ↓
Knowledge Base Facts
      ↓
LLM Explanation
```

The LLM explains existing system results.

It should not independently invent the ranking.

---

# 30. Step 13 — Career Exploration

Student opens a career.

Career details can include:

```text
Career Overview
Required Skills
Aptitude Profile
Education Path
Education Cost
Salary Range
Market Demand
Location Demand
Risk
Exams
Scholarships
Alternative Careers
```

---

# 31. Step 14 — Career Twin

The Career Twin connects the student's profile to the selected career.

```text
Student
  │
  ├── Aptitude
  ├── Interests
  ├── Skills
  ├── Career DNA
  └── Goals
          ↓
      Career Twin
          ↓
      Selected Career
```

It identifies:

- Strong matches
- Partial matches
- Skill gaps
- Potential challenges

---

# 32. Step 15 — What-If Simulator

Student changes one or more assumptions.

Example:

```text
Current:

Budget: ₹5L
Location: Chennai
Risk: Low

             ↓

What If:

Budget: ₹10L
Location: Bangalore
Risk: Medium
```

The system runs the same Decision Engine again with modified inputs.

---

# 33. What-If Flow

```text
Current Profile
      ↓
User Changes Variables
      ↓
Temporary Scenario
      ↓
Decision Engine
      ↓
New Rankings
      ↓
Compare With Current
```

The scenario should not overwrite the student's actual profile.

---

# 34. Step 16 — Skill Gap

After selecting a career:

```text
Career Requirements
        -
Student Skills
        ↓
Skill Gap Analysis
```

Example:

```text
Python
Strong

Machine Learning
Needs Improvement

Statistics
Needs Improvement

System Design
Future Priority
```

---

# 35. Step 17 — Personalized Roadmap

The roadmap converts recommendations into action.

Example:

```text
Month 1–2
Python + Mathematics

Month 3–4
Machine Learning

Month 5–6
Build Projects

Month 7
Internship Preparation

Month 8+
Applications + Interviews
```

Roadmap generation should consider:

- Current skill level
- Target career
- Skill gaps
- Student goals
- Education pathway

---

# 36. Returning User Flow

A returning student should not repeat completed assessments.

```text
Login
  ↓
Dashboard
  ↓
Existing Career DNA
  ↓
Existing Recommendations
  ↓
Roadmap
```

If data has become outdated:

```text
Dashboard
   ↓
Profile Update Required
   ↓
Recalculate
```

---

# 37. Recommendation Refresh

Recommendations can be refreshed when relevant inputs change.

Examples:

```text
Student skills changed
Parent data changed
Location changed
Education budget changed
Market data updated
```

Flow:

```text
Input Change
    ↓
Mark Recommendation Stale
    ↓
Recalculate
    ↓
New Recommendation Version
```

---

# 38. Parent Revisit Flow

A parent can potentially return through a valid invitation.

```text
Parent Link
   ↓
Token Validation
   ↓
Existing Form
   ↓
Edit
   ↓
Submit
   ↓
Student Notified / Status Updated
```

Changes should trigger appropriate recommendation recalculation.

---

# 39. Failure Scenarios

## Student abandons assessment

Save progress where possible.

```text
Exit
 ↓
Save Progress
 ↓
Resume Later
```

---

## Parent does not respond

Student sees:

```text
Mother
Invitation Pending

[ Resend Invitation ]
```

Recommendations can still operate with incomplete family information, but the system should clearly indicate reduced confidence or incomplete family analysis.

---

## Market data unavailable

Use the latest available validated data.

Show:

> Market information may not be current.

Do not fabricate market values.

---

## LLM unavailable

Core recommendations should still work.

```text
Decision Engine
      ↓
Recommendation
      ↓
LLM unavailable
      ↓
Structured explanation shown
```

LLM must not be a single point of failure for the core recommendation engine.

---

# 40. Data Flow Ownership

```text
┌──────────────┐
│   Frontend   │
│ Capture/Input│
└──────┬───────┘
       ↓
┌──────────────┐
│    Backend   │
│ Orchestration│
└──────┬───────┘
       ↓
┌──────────────┐
│   Database   │
│   Storage    │
└──────┬───────┘
       ↓
┌──────────────┐
│ Decision     │
│ Engine       │
└──────┬───────┘
       ↓
┌──────────────┐
│ Recommendation│
└──────┬───────┘
       ↓
┌──────────────┐
│    Frontend  │
│ Presentation │
└──────────────┘
```

---

# 41. LLM Flow

LLM should primarily handle explanation and generation.

```text
Decision Engine
      ↓
Structured Result
      ↓
Relevant Career Facts
      ↓
LLM
      ↓
Explanation
```

Examples:

- Why this career?
- Explain my skill gap.
- Explain education pathway.
- Generate learning roadmap.
- Suggest interdisciplinary alternatives.

The LLM should not override deterministic Decision Engine rankings.

---

# 42. End-to-End Example

A student has:

```text
Strong analytical aptitude
Strong AI interest
Python skills
Low family risk tolerance
Moderate education budget
Chennai preference
```

Parent provides:

```text
Moderate education budget
Low risk preference
Preference for stable career
```

ALIGNX processes:

```text
Student Profile
       ↓
Career DNA
       ↓
Family Analysis
       ↓
Financial Fit
       ↓
Market Fit
       ↓
Location Fit
       ↓
Decision Engine
```

Result:

```text
AI Engineer
91%

Data Scientist
86%

Software Engineer
84%
```

The student then opens AI Engineer and sees:

```text
Strong match:
Analytical ability
AI interest
Programming

Needs improvement:
Machine Learning
Statistics

Market:
High

Financial:
Good

Family alignment:
Good
```

Then ALIGNX generates:

```text
Skill Gap
   ↓
Roadmap
   ↓
Career Action
```

---

# 43. MVP User Flow

For the hackathon MVP, prioritize:

```text
Landing
   ↓
Onboarding
   ↓
Career Discovery
   ↓
Aptitude
   ↓
Career DNA
   ↓
Add Parent
   ↓
Parent Form
   ↓
Family Analysis
   ↓
Recommendation Engine
   ↓
Top Careers
   ↓
Explainability
   ↓
Roadmap
```

---

# 44. Strong Differentiator Flow

If time permits:

```text
Career Twin
      +
What-If Simulator
      +
Interdisciplinary Career Discovery
      +
Hyper-Local Market Insights
```

These should be built after the core recommendation pipeline works reliably.

---

# 45. Final System Journey

The complete ALIGNX experience can be summarized as:

```text
                    STUDENT
                       │
                       ▼
                 ┌───────────┐
                 │ DISCOVER  │
                 └─────┬─────┘
                       │
                       ▼
                 ┌───────────┐
                 │ ASSESS    │
                 └─────┬─────┘
                       │
                       ▼
                 ┌───────────┐
                 │ CAREER DNA│
                 └─────┬─────┘
                       │
                       ▼
              ┌─────────────────┐
              │ FAMILY CONTEXT  │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │ MARKET CONTEXT  │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │ ALIGNX DECISION │
              │     ENGINE      │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │ RECOMMENDATIONS │
              └────────┬────────┘
                       │
             ┌─────────┼─────────┐
             ▼         ▼         ▼
        Career Twin  What-If   Compare
             │         │         │
             └─────────┼─────────┘
                       ▼
                 ┌───────────┐
                 │ SKILL GAP │
                 └─────┬─────┘
                       │
                       ▼
                 ┌───────────┐
                 │ ROADMAP   │
                 └─────┬─────┘
                       │
                       ▼
                    ACTION
```

---

# 46. Core UX Principle

ALIGNX should take the student from:

> **"I don't know what career fits me."**

to:

> **"I understand why these careers fit me, what constraints affect my decision, what I need to improve, and what I should do next."**

That is the complete ALIGNX user journey.