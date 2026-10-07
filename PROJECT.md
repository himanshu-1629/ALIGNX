# ALIGNX — Project Definition

> **Aligning Talent With Opportunity**

## 1. Project Overview

ALIGNX is an AI-powered, multi-dimensional career guidance and discovery platform designed to help students identify career paths that align with:

1. Their capabilities and aspirations
2. Their family's financial and career considerations
3. Real-world industry and geographic opportunities

ALIGNX is being developed for the **DataQuest 3.0 hackathon** based on the challenge of building a multi-dimensional STEAM career guidance and hyper-local innovation platform.

The platform should not behave like a generic career chatbot or a simple personality quiz.

The central idea is:

```text
STUDENT
   +
FAMILY
   +
MARKET
   ↓
ALIGNX DECISION ENGINE
   ↓
PERSONALIZED CAREER ALIGNMENT
```

---

# 2. Product Vision

ALIGNX aims to help students answer four important questions:

### 1. Who am I?

Understand:

- Aptitude
- Interests
- Skills
- Behavioral preferences
- Cognitive preferences
- Work style
- Risk tolerance
- Career aspirations

### 2. What can my family support?

Understand:

- Education budget
- Parent/guardian contributions
- Financial constraints
- Risk appetite
- Career expectations
- Family considerations
- Potential scholarships or financial aid

### 3. Where are the opportunities?

Understand:

- Industry demand
- Job-market demand
- Geographic demand
- Salary potential
- Career growth
- Required skills
- Education requirements
- Emerging opportunities

### 4. What should I do next?

Provide:

- Ranked career pathways
- Reasons behind recommendations
- Skill gaps
- Alternative careers
- Interdisciplinary careers
- Exams
- Scholarships
- Education pathways
- Personalized learning roadmap

---

# 3. Core Product Principle

ALIGNX should **not tell students what career they must choose**.

It should provide decision support.

The platform should follow:

```text
Understand the Student
        ↓
Understand the Family
        ↓
Understand the Opportunity
        ↓
Calculate Career Alignment
        ↓
Explain the Result
        ↓
Show Alternatives
        ↓
Provide Next Steps
        ↓
Student Makes the Final Decision
```

The final decision always remains with the student and their family.

---

# 4. Three Core Dimensions

## 4.1 Student Dimension

The student profile should include:

### Personal Information

- Name
- Age
- Education level
- Degree/branch
- Current year

### Skills

Technical skills such as:

- Programming
- Web development
- Data analysis
- Machine learning
- Cybersecurity
- Cloud
- Other relevant skills

Soft skills such as:

- Communication
- Leadership
- Teamwork
- Presentation
- Problem solving
- Time management

### Interests

Examples:

- AI
- Robotics
- Healthcare
- Environment
- Cybersecurity
- Software
- Design
- Research
- Business

### Aptitude

Initial aptitude dimensions:

- Logical
- Numerical
- Analytical
- Spatial/Pattern
- Verbal

### Career DNA

Career DNA represents behavioral and work-style signals derived from interactive career discovery questions.

Possible dimensions:

- Analytical
- Builder
- Research
- Creative
- Leadership
- Social
- Risk

The exact scoring mechanism is defined separately in the technical documentation.

---

# 5. Interactive Career Discovery

The student assessment should not feel like a long traditional form.

The experience should use:

- One question at a time
- Large answer cards
- Minimal typing
- Clear progress indicators
- Interactive scenarios
- Immediate visual feedback where appropriate

Example:

```text
You are given a problem nobody has solved before.

What excites you most?

A. Break it into logical parts
B. Build and test something
C. Find a creative solution
D. Understand the people affected
E. Research existing solutions
```

Each answer can contribute to multiple Career DNA dimensions.

Important:

A single answer should **not** directly map to one career.

For example:

```text
"Build and test something"
```

may contribute to:

```text
Builder
Engineering
Practical Problem Solving
Technical Interest
```

This prevents the assessment from becoming a disguised career-selection questionnaire.

---

# 6. Aptitude Snapshot

ALIGNX includes a short quiz-style aptitude assessment.

The aptitude assessment is separate from career preference discovery.

### Career Discovery measures:

- Behavioral signals
- Interests
- Work preferences
- Problem-solving preferences
- Career orientation

### Aptitude Snapshot measures:

- Logical reasoning
- Numerical reasoning
- Analytical reasoning
- Spatial/pattern reasoning
- Verbal reasoning

The aptitude assessment should produce structured scores.

Example:

```json
{
  "logical": 91,
  "numerical": 84,
  "analytical": 89,
  "spatial": 77,
  "verbal": 73
}
```

ALIGNX should describe this as an **Aptitude Snapshot**, not as a clinically or scientifically validated psychological diagnosis.

---

# 7. Career DNA

After the interactive assessment, ALIGNX generates a Career DNA profile.

Example:

```json
{
  "analytical": 91,
  "builder": 87,
  "research": 82,
  "creative": 74,
  "leadership": 61,
  "social": 55,
  "risk": 72
}
```

The system may summarize this as:

> **Analytical Builder**

Career DNA is an input to the recommendation engine.

It should not independently determine the final career.

---

# 8. Family / Parent Intelligence

A major component of ALIGNX is family-aware career planning.

A student should be able to add multiple paying parents or guardians.

Example:

```text
Student
│
└── Family
    ├── Father
    ├── Mother
    └── Guardian
```

The student can select:

> **+ Add Paying Parent / Guardian**

For each contributor, the system stores:

- Name
- Relationship
- Contribution information
- Education budget
- Risk appetite
- Financial constraints
- Career expectations
- Relevant family considerations

Parents do not need to create a full application account for the MVP.

---

# 9. Parent Invitation Flow

The expected flow is:

```text
Student
   ↓
Add Parent / Guardian
   ↓
Enter Name + Relationship
   ↓
Generate Unique Link / Code
   ↓
Parent Opens Link
   ↓
Verification
   ↓
Parent Form
   ↓
Submit
   ↓
Parent Status = Completed
```

Student dashboard should show parent participation status.

Possible statuses:

```text
Pending
Filling
Completed
```

Example:

```text
Father      🟢 Completed
Mother      🟡 Filling
Guardian    ⚪ Pending
```

Multiple parents must be supported.

---

# 10. Family Financial Model

ALIGNX should not simply add all parent incomes together and call that the family's financial capacity.

The system should retain individual parent contributions and relevant family context.

The family financial model should consider:

- Individual parent contribution
- Total education budget
- Education cost
- Scholarships
- Financial aid
- Career risk
- Expected earning potential
- Family constraints

The exact financial calculation is defined in the decision-engine and database documentation.

---

# 11. Financial Constraint Solver

The Financial Constraint Solver determines how financially feasible a career pathway is for the family.

A career should not simply be classified as:

```text
Affordable / Not Affordable
```

Instead, the MVP should support categories such as:

```text
Financially Feasible
Feasible With Scholarship / Aid
Stretch Option
Currently Unsuitable
```

The solver should consider possible ways to make a pathway feasible.

For example:

```text
High education cost
       +
Available scholarship
       +
Family contribution
       ↓
Potentially feasible pathway
```

---

# 12. Parent–Student Conflict Index

ALIGNX should identify potential gaps between student aspirations and family expectations.

Example:

```text
Student:
AI / Startup / High Growth

Parent:
Traditional Engineering / Stable Career / Low Risk
```

The system may calculate:

```text
Conflict Index = 72 / 100
```

The index can consider differences in:

- Preferred career domain
- Career stability preference
- Risk appetite
- Education budget
- Expected career path
- Student aspirations
- Parent expectations

The Conflict Index is a decision-support signal.

It should not label a parent or student as "wrong."

It should help identify areas where discussion or alternative pathways may be useful.

---

# 13. Market Intelligence

ALIGNX should incorporate career opportunity information.

Career profiles may contain:

- Industry demand
- Job velocity
- Geographic demand
- Salary range
- Career growth
- Required skills
- Education requirements
- Education cost
- Risk level
- Exams
- Scholarships
- Alternative careers

Market data should be represented as structured data whenever possible.

The recommendation engine should use this structured information.

---

# 14. Hyper-Local Opportunity Awareness

Geographic context is an important part of ALIGNX.

The platform should be capable of considering:

```text
Student Location
      ↓
Local / Regional Demand
      ↓
Career Opportunity
```

The system should be able to distinguish between:

- Local opportunity
- Regional opportunity
- National opportunity
- Global opportunity

The MVP may use a curated/static dataset rather than building a full real-time labor-market scraping system.

Do not over-engineer live market scraping during the hackathon.

---

# 15. Career Knowledge Base

Each career should have a structured profile.

Conceptual example:

```json
{
  "name": "AI Engineer",
  "skills": [],
  "aptitude_profile": {},
  "interest_profile": {},
  "education_cost": {},
  "salary_range": {},
  "market_demand": 0,
  "location_demand": {},
  "risk": "medium",
  "exams": [],
  "scholarships": [],
  "alternative_careers": []
}
```

The career dataset is a knowledge layer.

It should not contain recommendation decisions specific to individual students.

---

# 16. ALIGNX Decision Engine

The decision engine combines:

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
Career Ranking
```

Initial configurable scoring model:

```text
Student Fit          35%
Financial Fit        20%
Family Alignment     15%
Market Demand        20%
Location Fit         10%
```

Overall:

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

These are **team-designed initial weights**, not official challenge-provided weights.

The weights must remain configurable.

---

# 17. Explainability

Every major recommendation should be explainable.

Example:

```text
AI Engineer — 91%

Student Fit        94
Financial Fit      82
Family Alignment   76
Market Fit         93
Location Fit       88
```

The system should be able to explain:

- Why the career matches
- Which student strengths contributed
- Which financial factors affected the score
- Which family factors affected the score
- Which market factors affected the score
- What gaps remain

---

# 18. LLM Responsibility

The LLM is an explanation and generation layer.

The LLM can be used for:

- Recommendation explanations
- Alternative career suggestions
- Skill-gap explanations
- Learning roadmap generation
- Education pathway explanations
- Career comparison explanations

The LLM must **not independently determine the primary career ranking**.

The deterministic ALIGNX Decision Engine produces the ranking.

The LLM receives structured results and explains them.

---

# 19. Career Twin

Career Twin is a visual representation of the student's career profile.

It combines:

```text
Career DNA
+
Aptitude
+
Skills
+
Interests
+
Goals
```

and maps these to a career universe.

Example:

```text
Analytical Builder
       ↓
AI Engineering
Robotics
Data Science
Cybersecurity
Healthcare AI
```

Career Twin is primarily a visualization and discovery feature.

---

# 20. Interdisciplinary Career Discovery

ALIGNX should identify career paths that may not be obvious from the student's initial preference.

Example:

```text
Student Interest:
Medicine

Student Strength:
Technology + AI

Potential Alternatives:

Medical AI
Bioinformatics
Biomedical Engineering
Computational Biology
Medical Robotics
```

This is one of the mechanisms through which ALIGNX can discover alternatives instead of simply confirming the student's first choice.

---

# 21. What-If Career Simulator

The What-If simulator allows a student to modify important conditions and see how recommendations change.

Possible variables:

- Education budget
- Risk appetite
- Preferred location
- Time-to-employment

Example:

```text
Before:

AI Engineer       84
Data Scientist    82
Robotics          76

Increase Education Budget

AI Engineer       91
Data Scientist    85
Robotics          81
```

The simulator must reuse the same ALIGNX Decision Engine.

Do not create a second independent scoring algorithm.

---

# 22. Core MVP Journey

The primary MVP journey is:

```text
Landing
   ↓
Student Onboarding
   ↓
Interactive Career Discovery
   ↓
Aptitude Snapshot
   ↓
Career DNA
   ↓
Add Paying Parent / Guardian
   ↓
Parent Invitation
   ↓
Parent Financial / Family Input
   ↓
Parent Status
   ↓
Financial Constraint Solver
   ↓
Parent–Student Conflict Index
   ↓
Market Intelligence
   ↓
ALIGNX Decision Engine
   ↓
Career Recommendations
   ↓
Career Twin
   ↓
What-If Simulator
   ↓
Personalized Roadmap
```

---

# 23. Primary Product Modules

The MVP consists of:

1. Student Onboarding
2. Interactive Career Discovery
3. Aptitude Snapshot
4. Career DNA
5. Parent / Guardian Management
6. Family Financial Analysis
7. Financial Constraint Solver
8. Parent–Student Conflict Index
9. Career Knowledge Base
10. Market Intelligence
11. ALIGNX Decision Engine
12. Career Recommendations
13. Explainable Recommendations
14. Career Twin
15. What-If Simulator
16. Skill Gap Analysis
17. Personalized Roadmap

---

# 24. What ALIGNX Is NOT

ALIGNX should not become:

- A generic ChatGPT-style career chatbot
- A simple personality quiz
- A static career database
- A job-board clone
- A career recommendation system based only on salary
- A system where parents independently control the student's career
- A system where the LLM decides all recommendations
- A huge assessment containing unnecessary questions
- A Tinder-style career swiping application

The product must remain focused on **career alignment**.

---

# 25. Product Design Principles

### Simple

Minimize unnecessary typing.

### Interactive

Use scenario-based questions and visual interactions.

### Explainable

Show why a recommendation was generated.

### Personalized

Use individual student and family data.

### Financially Aware

Do not ignore family constraints.

### Market Aware

Do not recommend careers without considering opportunity.

### Dynamic

Allow conditions to change through What-If simulation.

### Student-Centric

Parents contribute information but do not replace the student's agency.

### Actionable

Every recommendation should lead toward a possible next step.

---

# 26. Hackathon MVP Principle

The project is being developed under a limited hackathon timeline.

Therefore:

> **Working end-to-end MVP > Number of features**

The team should first make this flow work:

```text
Student
→ Assessment
→ Career DNA
→ Parent
→ Family Analysis
→ Market Data
→ ALIGNX Engine
→ Career Ranking
```

Only after this works reliably should the team prioritize:

- Career Twin
- What-If Simulator
- LLM enhancements
- UI animations
- Advanced visualizations

---

# 27. Non-Goals for the Initial MVP

The initial MVP does not need:

- Real-time global labor-market scraping
- Full financial planning
- Professional psychological diagnosis
- University application automation
- Full job application automation
- Complex recommendation ML training
- Large-scale authentication infrastructure
- Native mobile applications
- Social networking
- Mentor marketplace

These may be considered in future versions.

---

# 28. Source of Truth

The following documents define different aspects of ALIGNX:

```text
PROJECT.md
    ↓
Product vision and principles

docs/PRD.md
    ↓
Functional product requirements

docs/TRD.md
    ↓
Technical requirements

docs/UI_UX.md
    ↓
User interface and experience

docs/SYSTEM_ARCHITECTURE.md
    ↓
System components and communication

docs/DATABASE_SCHEMA.md
    ↓
Data model

docs/API_DOCUMENTATION.md
    ↓
API contracts

docs/USER_FLOW.md
    ↓
User journeys

docs/ROADMAP.md
    ↓
Implementation phases
```

If documents conflict, the team must resolve the conflict before implementation rather than silently creating different interpretations.

---

# 29. Implementation Rule for Antigravity

Before making a significant implementation decision:

1. Read `PROJECT.md`
2. Read the relevant document in `docs/`
3. Check `TEAM.md`
4. Check `TASKS.md`
5. Reuse existing architecture and contracts
6. Avoid introducing duplicate logic
7. Avoid adding major features without approval

Do not modify the overall architecture simply because another implementation approach appears easier.

---

# 30. Final Product Identity

## ALIGNX

### Aligning Talent With Opportunity

```text
Student Potential
        +
Family Reality
        +
Market Opportunity
        ↓
       ALIGNX
        ↓
Career Alignment
        ↓
Better-Informed Decisions
```

ALIGNX does not choose the student's future.

**ALIGNX helps the student understand where their potential, reality, and opportunities align.**