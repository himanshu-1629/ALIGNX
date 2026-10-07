# ALIGNX — Product Requirements Document

> **Product:** ALIGNX — Aligning Talent With Opportunity  
> **Hackathon:** DataQuest 3.0  
> **Challenge:** PRISM Engine — Multi-Dimensional STEAM Career Guidance & Hyper-Local Innovation Platform  
> **Document:** Product Requirements Document  
> **Version:** 1.0

---

# 1. Product Overview

## 1.1 What is ALIGNX?

ALIGNX is an AI-assisted career decision platform that helps students identify career paths by analyzing three major dimensions:

```text
Student
   +
Family
   +
Market
   ↓
ALIGNX Decision Engine
   ↓
Personalized Career Alignment
```

Instead of recommending careers using only interests or aptitude, ALIGNX considers:

- Student interests
- Skills
- Aptitude
- Cognitive preferences
- Career goals
- Family financial constraints
- Parent/guardian expectations
- Risk appetite
- Education affordability
- Market demand
- Geographic demand
- Location suitability
- Career alternatives
- Skill gaps

The objective is to recommend careers that are not only interesting to the student, but also **financially viable, family-aware, market-relevant, and realistically achievable**.

---

# 2. Problem Statement

Students frequently choose careers based on incomplete information.

Typical career guidance systems may focus primarily on:

- Interest
- Aptitude
- Academic performance
- Generic career descriptions

However, real-world career decisions are affected by additional constraints.

### Student-side problems

- Students may not understand their own strengths.
- Students may know only common career options.
- Students may not understand emerging or interdisciplinary careers.
- Students may not know what skills they are missing.
- Students may not understand how location affects opportunities.

### Family-side problems

- Parents influence career decisions.
- Education affordability may constrain available choices.
- Parents may prioritize stability over interest.
- Parents and students may have conflicting expectations.
- Financial constraints are often discussed too late.

### Market-side problems

- Career demand changes over time.
- Opportunities vary geographically.
- Some careers have strong demand in specific regions.
- Emerging interdisciplinary careers may be difficult to discover.
- Students may select careers without understanding employment opportunities.

ALIGNX addresses these dimensions together.

---

# 3. Product Vision

ALIGNX aims to become a **decision-support system for career planning**, rather than simply a career recommendation quiz.

The platform should answer:

> **"Given who I am, what my family can realistically support, and where the market is heading, which career paths are the strongest options for me?"**

ALIGNX should also explain:

> **"Why is this career recommended, what could change the recommendation, and what should I do next?"**

---

# 4. Product Goals

## Primary Goals

1. Understand the student's interests, aptitude, skills, and goals.
2. Build a meaningful student profile.
3. Generate a visual Career DNA.
4. Include parent/guardian financial and aspirational context.
5. Identify financial constraints.
6. Measure parent–student alignment/conflict.
7. Incorporate career and market knowledge.
8. Consider geographic opportunity.
9. Rank careers using a transparent Decision Engine.
10. Explain why each career was recommended.
11. Identify skill gaps.
12. Generate a personalized career roadmap.

## Secondary Goals

- Discover interdisciplinary careers.
- Allow users to simulate alternative scenarios.
- Help students understand career trade-offs.
- Make career exploration engaging rather than form-heavy.
- Provide actionable next steps.

---

# 5. Non-Goals for MVP

The MVP should NOT attempt to:

- Replace professional career counselors.
- Provide clinical psychological diagnosis.
- Predict an individual's guaranteed salary.
- Guarantee employment.
- Provide legally or financially binding advice.
- Build a complete real-time labor-market forecasting system.
- Automatically scrape every job platform.
- Create a full educational institution marketplace.
- Make decisions on behalf of the student or family.

ALIGNX is a **decision-support and exploration platform**.

---

# 6. Target Users

## 6.1 Primary User — Student

The student is the primary user.

The student should be able to:

- Create a profile.
- Explore careers.
- Complete assessments.
- Discover Career DNA.
- Add parents/guardians.
- View financial alignment.
- View recommendations.
- Compare careers.
- Explore alternatives.
- Run What-If scenarios.
- View skill gaps.
- Follow a roadmap.

---

## 6.2 Secondary User — Parent/Guardian

Parents provide contextual information rather than becoming the primary platform user.

Parents should be able to:

- Receive an invitation.
- Verify access.
- Provide financial information.
- Provide education expectations.
- Provide risk preferences.
- Provide stability preferences.
- Submit the form.

Parents do not need a full account in the MVP.

---

## 6.3 Internal/Platform User

The platform/team maintains:

- Career knowledge.
- Market data.
- Education pathways.
- Scholarship information.
- Career alternatives.
- Geographic information.

---

# 7. Core Product Flow

The complete MVP flow is:

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
Parent Invitation
   ↓
Parent Financial + Aspirational Form
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
Skill Gap
   ↓
Personalized Roadmap
```

---

# 8. Student Onboarding

## Requirement

The platform must collect enough information to construct an initial student profile.

### Required information

- Name
- Age
- Education level
- Academic background
- Location
- Skills
- Interests
- Career goals/preferences

### Optional information

- Existing projects
- Certifications
- Preferred work environment
- Preferred industries
- Existing career interests

### Acceptance Criteria

- Student can complete onboarding.
- Data is validated.
- Data is stored.
- Student can continue to Career Discovery.
- User should not be forced to enter unnecessary information.

---

# 9. Interactive Career Discovery

## Objective

Understand how the student naturally responds to career-related situations.

Instead of presenting a long form, ALIGNX should use an interactive scenario-based experience.

### Example

> You are given a complex technical problem with no obvious solution. What would you rather do?

Options could include:

- Break the problem into smaller parts.
- Build a prototype.
- Research how others solved it.
- Discuss it with people.
- Experiment with different approaches.

Each response contributes to underlying dimensions.

### Possible dimensions

- Analytical
- Builder
- Research
- Creative
- Leadership
- Social
- Risk
- Exploration

### Requirements

- One question at a time.
- Clear progress indicator.
- Minimal cognitive load.
- Avoid repetitive questions.
- Store responses.
- Convert responses into structured scores.

---

# 10. Aptitude Assessment

## Objective

Measure broad cognitive tendencies relevant to career exploration.

The MVP may include approximately 12–20 questions.

### Dimensions

- Logical reasoning
- Numerical reasoning
- Analytical reasoning
- Spatial/pattern reasoning
- Verbal reasoning

### Important limitation

The assessment is an **informational career-guidance assessment**, not a clinically validated psychological or IQ test.

### Requirements

- Questions must have deterministic answers where appropriate.
- Responses must be scored consistently.
- Scores should be normalized.
- Results should be stored.
- Results should feed the Decision Engine.
- Results should be visually understandable.

Example:

```text
Logical        91
Analytical     88
Numerical      82
Spatial        76
Verbal        69
```

---

# 11. Career DNA

## Objective

Transform student responses into an understandable identity representation.

Career DNA should combine information from:

- Career Discovery
- Aptitude
- Skills
- Interests
- Goals

### Example

```text
Career DNA

Analytical      █████████  91
Builder         ████████   84
Research        ████████   81
Creative        ███████    74
Leadership      ██████     63
Social          █████      58
Risk            ███████    71
```

### Example identity

> **Analytical Builder**

The system should provide:

- Primary traits
- Secondary traits
- Short explanation
- Suitable career families

Career DNA should be explainable and should not be presented as a permanent personality label.

---

# 12. Parent / Guardian Module

## Objective

Capture family constraints and expectations that affect career feasibility.

A student should be able to add multiple parents/guardians.

```text
Student
└── Family
    ├── Parent / Guardian 1
    ├── Parent / Guardian 2
    └── Parent / Guardian 3...
```

### Parent information

Potential fields include:

- Relationship
- Income range
- Education budget
- Preferred education location
- Risk appetite
- Stability preference
- Education expectations
- Career expectations
- Financial constraints

### Parent statuses

```text
Pending
   ↓
Filling
   ↓
Completed
```

### Requirements

- Student can add multiple parents.
- Each parent gets a unique invitation.
- Parent can submit without creating a full account.
- Student can see completion status.
- Parent data is securely stored.
- Incomplete parent data must not break recommendations.

---

# 13. Financial Constraint Solver

## Objective

Determine whether a career path is financially realistic under the family's constraints.

The solver should consider factors such as:

- Education cost
- Available education budget
- Duration of education
- Potential additional costs
- Geographic cost differences
- Family financial constraints
- Financial risk preference

### Output

The solver should produce a normalized Financial Fit score.

Example:

```text
Education Cost:        ₹4.5L
Family Budget:         ₹6L
Financial Fit:         84/100
```

### Important rule

The system should not simply compare total family income with education cost.

Multiple parents' information should be interpreted as a family context rather than blindly summed.

---

# 14. Parent–Student Conflict Index

## Objective

Measure the degree of mismatch between the student's preferences and family expectations.

Potential dimensions:

- Career preference
- Risk appetite
- Education budget
- Preferred location
- Stability preference
- Time-to-employment preference

Example:

```text
Parent–Student Alignment

Career Preference     → High
Financial Expectation → Medium
Risk Appetite         → Low
Location Preference   → High

Conflict Index: 24/100
```

### Interpretation

```text
0–20    Strong Alignment
21–40   Moderate Alignment
41–60   Noticeable Conflict
61–80   High Conflict
81–100  Severe Conflict
```

The exact thresholds can be adjusted during testing.

The Conflict Index should be used to identify areas requiring discussion, not to declare one side correct.

---

# 15. Market Intelligence

## Objective

Connect student suitability with external opportunity.

Market information may include:

- Career demand
- Hiring velocity
- Industry growth
- Geographic demand
- Regional opportunities
- Salary ranges
- Career stability
- Emerging fields
- Local innovation opportunities

### Geographic levels

```text
Local
 ↓
Regional
 ↓
National
 ↓
Global
```

### MVP Approach

The MVP may use curated/static datasets.

Real-time market APIs and large-scale live data ingestion are future enhancements.

---

# 16. Career Knowledge Base

Each career should have structured information.

Example:

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

The knowledge base is used by the Decision Engine and LLM explanation layer.

---

# 17. ALIGNX Decision Engine

## Objective

The Decision Engine is the core of ALIGNX.

It combines student, family, and market information to calculate career suitability.

Initial scoring model:

```text
Overall Career Score =

    0.35 × Student Fit
  + 0.20 × Financial Fit
  + 0.15 × Family Alignment
  + 0.20 × Market Fit
  + 0.10 × Location Fit
```

All component scores should be normalized to a common scale.

### Student Fit

May include:

- Interest
- Aptitude
- Skills
- Career Discovery
- Career DNA
- Goals

### Financial Fit

May include:

- Education affordability
- Budget
- Education duration
- Financial risk

### Family Alignment

May include:

- Parent expectations
- Risk preference
- Stability preference
- Education preference

### Market Fit

May include:

- Demand
- Hiring trends
- Industry growth
- Career opportunity

### Location Fit

May include:

- Local demand
- Regional demand
- Preferred location
- Relocation feasibility

---

# 18. Recommendation Output

The system should not only return a career name and score.

Example:

```json
{
  "career": "AI Engineer",
  "overall_score": 91,
  "student_fit": 94,
  "financial_fit": 82,
  "family_alignment": 88,
  "market_fit": 95,
  "location_fit": 86
}
```

The UI should communicate:

- Why this career fits.
- Which factors contributed most.
- Potential concerns.
- Required skills.
- Education pathway.
- Alternatives.

---

# 19. Explainable Recommendations

Every recommendation should answer:

### Why this career?

Example:

> AI Engineering ranks highly because your analytical and logical aptitude is strong, your interests align with AI and robotics, and current market demand is favorable.

### What may be difficult?

Example:

> The primary constraint is the cost of specialized postgraduate education if you choose an overseas pathway.

### What should you do?

Example:

> Strengthen Python, machine learning fundamentals, statistics, and build two applied AI projects.

---

# 20. Career Twin

## Objective

Career Twin provides a visual representation of how the student's profile maps to a career.

Concept:

```text
Student Profile
      │
      ├── Aptitude
      ├── Interests
      ├── Skills
      ├── Career DNA
      └── Goals
              ↓
        Career Twin
              ↓
       Target Career
```

The Career Twin should show:

- Strong matches
- Weak matches
- Required skills
- Missing skills
- Career fit
- Alternative careers

---

# 21. Interdisciplinary Career Discovery

ALIGNX should identify career combinations that may not appear in traditional career guidance.

Example:

```text
Interest: Medicine
+
Strong Technology Aptitude
+
AI Interest
        ↓
Potential Careers
        ↓
Medical AI
Bioinformatics
Biomedical Engineering
Computational Biology
Medical Robotics
```

This should be driven by structured career relationships rather than random LLM suggestions.

---

# 22. What-If Career Simulator

## Objective

Allow students to understand how changing constraints affects career recommendations.

Possible variables:

- Education budget
- Location
- Risk appetite
- Time-to-employment
- Education pathway

Example:

```text
Current Scenario
Budget: ₹5L
Location: Chennai
Risk: Low

        ↓

Top Career: Career A
Score: 88


What If?
Budget: ₹10L
Location: Bangalore
Risk: Medium

        ↓

Top Career: Career B
Score: 93
```

### Important Requirement

The simulator must use the **same ALIGNX Decision Engine**.

It must not create a separate scoring system.

---

# 23. Skill Gap Analysis

For every major recommended career, ALIGNX should identify:

```text
Current Skills
       ↓
Career Requirements
       ↓
Skill Gap
       ↓
Learning Plan
```

Example:

```text
Career: AI Engineer

Strong:
✓ Python
✓ C++
✓ Problem Solving

Needs Improvement:
○ Statistics
○ Machine Learning
○ Deep Learning
○ MLOps
```

---

# 24. Personalized Roadmap

The roadmap should convert recommendations into actionable steps.

Possible structure:

```text
Phase 1 — Foundation
    ↓
Phase 2 — Skill Development
    ↓
Phase 3 — Projects
    ↓
Phase 4 — Certification / Education
    ↓
Phase 5 — Internship / Experience
    ↓
Phase 6 — Career Entry
```

The roadmap may include:

- Skills
- Projects
- Courses
- Certifications
- Exams
- Scholarships
- Milestones
- Suggested timelines

---

# 25. LLM Requirements

The LLM is an **explanation and assistance layer**, not the primary ranking engine.

### LLM SHOULD

- Explain recommendations.
- Explain Career DNA.
- Explain skill gaps.
- Generate roadmaps.
- Explain alternatives.
- Summarize career information.
- Help students understand trade-offs.

### LLM SHOULD NOT

- Randomly rank careers.
- Override Decision Engine scores.
- Invent salary information.
- Invent education costs.
- Invent market-demand statistics.
- Invent scholarship eligibility.
- Replace structured career data.

Architecture:

```text
Structured Data
      ↓
Decision Engine
      ↓
Official Recommendation
      ↓
LLM
      ↓
Human-Friendly Explanation
```

---

# 26. User Experience Requirements

ALIGNX should feel like an interactive product rather than a traditional survey website.

### Principles

- Minimal unnecessary forms.
- One meaningful interaction at a time.
- Clear progress.
- Strong visual feedback.
- Explain complex results simply.
- Avoid overwhelming students with data.
- Use visualizations where useful.
- Make important insights scannable.
- Mobile-responsive interface.

---

# 27. Dashboard Requirements

The student dashboard should provide:

### Profile

- Career DNA
- Aptitude
- Interests
- Skills

### Family

- Parent status
- Financial alignment
- Conflict indicators

### Recommendations

- Top careers
- Scores
- Reasons
- Alternatives

### Career Exploration

- Career Twin
- What-If Simulator
- Interdisciplinary careers

### Action

- Skill gaps
- Roadmap
- Education pathways
- Exams
- Scholarships

---

# 28. Security & Privacy Requirements

The system handles sensitive personal and family information.

The MVP should:

- Protect authentication credentials.
- Protect parent invitation tokens.
- Validate API requests.
- Restrict unauthorized access.
- Avoid exposing family financial information publicly.
- Avoid logging sensitive information unnecessarily.
- Use environment variables for secrets.
- Follow least-privilege access principles.

---

# 29. Performance Requirements

The application should provide:

- Fast onboarding interactions.
- Responsive UI.
- Reasonable API response times.
- Efficient database queries.
- Graceful handling of LLM delays.
- Loading states for long-running operations.

LLM calls should not block the entire application unnecessarily where asynchronous processing is possible.

---

# 30. Error Handling Requirements

The system should gracefully handle:

### Frontend

- Network failures
- Invalid inputs
- Empty states
- Loading states
- API failures

### Backend

- Invalid requests
- Unauthorized access
- Missing records
- Database failures
- External API failures
- LLM failures

### Parent Flow

- Invalid invitation
- Expired invitation
- Already-used invitation
- Incomplete submission

---

# 31. MVP Requirements

The minimum demo-ready version must support:

## Student

- [ ] Onboarding
- [ ] Career Discovery
- [ ] Aptitude Assessment
- [ ] Career DNA

## Family

- [ ] Add parent
- [ ] Generate invitation
- [ ] Parent form
- [ ] Financial information
- [ ] Parent status

## Intelligence

- [ ] Student Fit
- [ ] Financial Fit
- [ ] Family Alignment
- [ ] Market Fit
- [ ] Location Fit
- [ ] Overall ranking
- [ ] Explainable recommendations

## Experience

- [ ] Dashboard
- [ ] Career cards
- [ ] Score breakdown
- [ ] Career alternatives

---

# 32. Strong Differentiator Requirements

If time permits, implement:

- [ ] Parent–Student Conflict Index
- [ ] Financial Constraint Solver
- [ ] Career Twin
- [ ] What-If Simulator
- [ ] Interdisciplinary Career Discovery
- [ ] Skill Gap Analysis
- [ ] Personalized Roadmap
- [ ] Hyper-local opportunity visualization

---

# 33. Future Scope

Potential future capabilities:

- Real-time job market integrations.
- Government/open labor-market datasets.
- Institution recommendations.
- Counselor dashboards.
- School dashboards.
- Scholarship matching.
- Internship matching.
- Longitudinal student progress tracking.
- Improved psychometric validation.
- Predictive career-path analysis.
- AI career counseling assistant.
- Regional innovation opportunity mapping.

These are not required for the initial hackathon MVP.

---

# 34. Success Criteria

ALIGNX should be considered successful when a student can complete the following journey:

```text
Create Profile
      ↓
Discover Personal Strengths
      ↓
Complete Aptitude Assessment
      ↓
Understand Career DNA
      ↓
Add Parent/Guardian
      ↓
Capture Family Constraints
      ↓
Analyze Market Opportunity
      ↓
Receive Ranked Careers
      ↓
Understand WHY
      ↓
Explore Alternatives
      ↓
See Skill Gaps
      ↓
Follow a Roadmap
```

The system should demonstrate that the recommendation is based on **multiple dimensions rather than a single test score**.

---

# 35. Acceptance Criteria

## AC-01 — Student Profile

A student can create and save a complete basic profile.

## AC-02 — Career Discovery

A student can complete the interactive Career Discovery experience and receive structured dimension scores.

## AC-03 — Aptitude

A student can complete the aptitude assessment and receive normalized aptitude scores.

## AC-04 — Career DNA

The system generates a Career DNA profile based on collected student information.

## AC-05 — Parent

A student can add multiple parents/guardians and generate invitations.

## AC-06 — Parent Submission

A parent can complete the financial and aspirational form without requiring a full account.

## AC-07 — Family Analysis

The system can calculate financial fit and family alignment from available family data.

## AC-08 — Recommendations

The Decision Engine produces ranked career recommendations.

## AC-09 — Explainability

Every major recommendation contains a score breakdown and understandable reasoning.

## AC-10 — Alternatives

The system provides alternative or interdisciplinary career paths.

## AC-11 — Roadmap

The system identifies relevant skill gaps and next steps.

## AC-12 — End-to-End Demo

A complete student journey can be demonstrated from onboarding to career recommendation.

---

# 36. Product Principles

ALIGNX must follow these principles:

### 1. Student-Centered

The student's goals and capabilities remain central.

### 2. Family-Aware

Family constraints are considered without allowing them to completely erase student preferences.

### 3. Market-Aware

Recommendations should account for opportunity and demand.

### 4. Explainable

Students should understand why a career was recommended.

### 5. Actionable

Recommendations must lead toward concrete next steps.

### 6. Non-Deterministic Career Identity

ALIGNX should never imply that one assessment permanently determines a student's future.

### 7. Data + Intelligence Separation

Structured data and deterministic scoring should remain separate from natural-language generation.

### 8. Same Engine, Different Scenarios

What-If analysis must use the same core Decision Engine as the primary recommendation system.

---

# 37. Source of Truth

This PRD defines **what ALIGNX should do**.

Other documentation has different responsibilities:

| Document | Purpose |
|---|---|
| `README.md` | Project overview and GitHub documentation |
| `PROJECT.md` | Product context and implementation guidance |
| `PRD.md` | Product requirements |
| `TRD.md` | Technical requirements and implementation |
| `UI_UX.md` | User experience and design system |
| `SYSTEM_ARCHITECTURE.md` | System architecture |
| `DATABASE_SCHEMA.md` | Database structure |
| `API_DOCUMENTATION.md` | API contracts |
| `USER_FLOW.md` | Detailed user journeys |
| `ROADMAP.md` | Development roadmap |
| `TEAM.md` | Team ownership |
| `TASKS.md` | Development tasks |

If implementation details conflict with product requirements, the team should review the relevant requirement before changing the product behavior.

---

# 38. Final Product Definition

ALIGNX is not simply:

```text
"Take a quiz → Get a career"
```

It is:

```text
              STUDENT
                 │
       ┌─────────┼─────────┐
       │         │         │
   Interests  Aptitude  Skills
       │         │         │
       └─────────┼─────────┘
                 ↓
            CAREER DNA
                 │
                 ↓
              FAMILY
       ┌─────────┼─────────┐
       │         │         │
    Budget     Risk    Expectations
       └─────────┼─────────┘
                 ↓
             MARKET
       ┌─────────┼─────────┐
       │         │         │
     Demand   Location  Opportunity
       └─────────┼─────────┘
                 ↓
       ALIGNX DECISION ENGINE
                 ↓
       ┌─────────┼─────────┐
       │         │         │
   Best Fit   Alternatives  What-If
       │         │         │
       └─────────┼─────────┘
                 ↓
        CAREER ALIGNMENT
                 ↓
        SKILL GAP + ROADMAP
```

**ALIGNX's core promise:**

> **Align who the student is, what the family can support, and where opportunity exists — then turn that alignment into an actionable career path.**