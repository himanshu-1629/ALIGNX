# ALIGNX — Database Schema

> **Project:** ALIGNX — Aligning Talent With Opportunity  
> **Document:** Database Schema  
> **Version:** 1.0

---

# 1. Purpose

This document defines the database structure for ALIGNX.

The database must support:

- Student profiles
- Family and parent/guardian information
- Assessments
- Career DNA
- Financial information
- Career knowledge
- Market intelligence
- Recommendations
- Parent invitations
- Skill gaps
- Roadmaps
- What-If scenarios

---

# 2. Database Technology

Recommended database:

**PostgreSQL**

Supabase may be used as the managed PostgreSQL platform.

The schema should use:

- Primary keys
- Foreign keys
- Unique constraints
- Check constraints where useful
- Timestamps
- Indexes for frequently queried fields

---

# 3. High-Level Entity Relationship

```text
                         ┌──────────────┐
                         │   STUDENTS   │
                         └──────┬───────┘
                                │
             ┌──────────────────┼──────────────────┐
             │                  │                  │
             ▼                  ▼                  ▼
      ┌─────────────┐   ┌──────────────┐   ┌──────────────┐
      │ ASSESSMENTS │   │   FAMILIES   │   │ CAREER DNA   │
      └─────────────┘   └──────┬───────┘   └──────────────┘
                                │
                                ▼
                         ┌──────────────┐
                         │   PARENTS    │
                         └──────────────┘

Students ──────────────── Recommendations
Students ──────────────── Financial Profiles
Students ──────────────── Roadmaps
Students ──────────────── What-If Scenarios

Careers ───────────────── Recommendations
Careers ───────────────── Skills
Careers ───────────────── Market Data
Careers ───────────────── Education Paths
```

---

# 4. Core Tables

Initial core tables:

```text
students
families
parents
parent_invitations
student_assessments
aptitude_results
career_dna
financial_profiles
careers
skills
career_skills
career_market_data
career_location_demand
recommendations
recommendation_scores
skill_gaps
roadmaps
roadmap_items
what_if_scenarios
```

---

# 5. `students`

Stores the primary student profile.

| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `name` | VARCHAR | Student name |
| `age` | INTEGER | Student age |
| `education_level` | VARCHAR | Current education |
| `location` | VARCHAR | Current location |
| `email` | VARCHAR | Student email |
| `created_at` | TIMESTAMP | Creation time |
| `updated_at` | TIMESTAMP | Last update |

Example:

```json
{
  "id": "uuid",
  "name": "Himanshu",
  "age": 19,
  "education_level": "B.Tech",
  "location": "Chennai"
}
```

---

# 6. `student_interests`

Stores structured student interests.

| Column | Type |
|---|---|
| `id` | UUID |
| `student_id` | UUID |
| `interest` | VARCHAR |
| `score` | DECIMAL |
| `created_at` | TIMESTAMP |

Relationship:

```text
students 1 ──────── N student_interests
```

---

# 7. `student_skills`

Stores skills associated with a student.

| Column | Type |
|---|---|
| `id` | UUID |
| `student_id` | UUID |
| `skill_id` | UUID |
| `proficiency` | DECIMAL |
| `source` | VARCHAR |
| `created_at` | TIMESTAMP |

`source` can indicate whether the skill came from:

- Student input
- Assessment
- Imported profile
- Verified evidence

---

# 8. `families`

Represents the student's family context.

| Column | Type |
|---|---|
| `id` | UUID |
| `student_id` | UUID |
| `created_at` | TIMESTAMP |
| `updated_at` | TIMESTAMP |

Relationship:

```text
students 1 ──────── 1 families
```

A family belongs to one student in the MVP.

---

# 9. `parents`

Stores individual parent/guardian information.

| Column | Type |
|---|---|
| `id` | UUID |
| `family_id` | UUID |
| `relationship` | VARCHAR |
| `name` | VARCHAR |
| `status` | VARCHAR |
| `created_at` | TIMESTAMP |
| `updated_at` | TIMESTAMP |

Possible statuses:

```text
pending
filling
completed
```

Relationship:

```text
families 1 ──────── N parents
```

This supports:

```text
Family
├── Parent 1
├── Parent 2
└── Parent 3
```

---

# 10. `parent_invitations`

Stores temporary parent invitation information.

| Column | Type |
|---|---|
| `id` | UUID |
| `parent_id` | UUID |
| `token_hash` | VARCHAR |
| `expires_at` | TIMESTAMP |
| `used_at` | TIMESTAMP |
| `created_at` | TIMESTAMP |

The raw token should not be stored when avoidable.

The invitation URL may conceptually look like:

```text
/invite/parent/<secure-token>
```

---

# 11. `parent_financial_profiles`

Stores parent-provided financial information.

| Column | Type |
|---|---|
| `id` | UUID |
| `parent_id` | UUID |
| `income_range` | VARCHAR |
| `education_budget` | DECIMAL |
| `risk_appetite` | VARCHAR |
| `location_preference` | VARCHAR |
| `stability_preference` | VARCHAR |
| `created_at` | TIMESTAMP |
| `updated_at` | TIMESTAMP |

Sensitive financial information should have restricted access.

---

# 12. `parent_expectations`

Stores parent career and education expectations.

| Column | Type |
|---|---|
| `id` | UUID |
| `parent_id` | UUID |
| `career_expectations` | JSONB |
| `education_expectations` | JSONB |
| `priority_factors` | JSONB |
| `created_at` | TIMESTAMP |

Possible priority factors:

```text
stability
salary
education_cost
location
prestige
employment_speed
risk
```

---

# 13. `student_assessments`

Stores assessment sessions.

| Column | Type |
|---|---|
| `id` | UUID |
| `student_id` | UUID |
| `assessment_type` | VARCHAR |
| `status` | VARCHAR |
| `started_at` | TIMESTAMP |
| `completed_at` | TIMESTAMP |

Possible assessment types:

```text
career_discovery
aptitude
```

Possible statuses:

```text
started
completed
abandoned
```

---

# 14. `assessment_responses`

Stores individual answers.

| Column | Type |
|---|---|
| `id` | UUID |
| `assessment_id` | UUID |
| `question_id` | VARCHAR |
| `answer` | JSONB |
| `created_at` | TIMESTAMP |

JSONB allows different question types.

---

# 15. `aptitude_results`

Stores normalized aptitude dimensions.

| Column | Type |
|---|---|
| `id` | UUID |
| `student_id` | UUID |
| `logical` | DECIMAL |
| `numerical` | DECIMAL |
| `analytical` | DECIMAL |
| `spatial` | DECIMAL |
| `verbal` | DECIMAL |
| `created_at` | TIMESTAMP |

Scores should normally be stored on a normalized scale such as `0–100`.

---

# 16. `career_discovery_results`

Stores results from the interactive Career Discovery module.

| Column | Type |
|---|---|
| `id` | UUID |
| `student_id` | UUID |
| `analytical` | DECIMAL |
| `builder` | DECIMAL |
| `research` | DECIMAL |
| `creative` | DECIMAL |
| `leadership` | DECIMAL |
| `social` | DECIMAL |
| `risk` | DECIMAL |
| `created_at` | TIMESTAMP |

---

# 17. `career_dna`

Stores the generated Career DNA.

| Column | Type |
|---|---|
| `id` | UUID |
| `student_id` | UUID |
| `primary_trait` | VARCHAR |
| `secondary_traits` | JSONB |
| `trait_scores` | JSONB |
| `description` | TEXT |
| `created_at` | TIMESTAMP |
| `updated_at` | TIMESTAMP |

Example:

```json
{
  "primary_trait": "Analytical Builder",
  "secondary_traits": [
    "Research",
    "Creative"
  ],
  "trait_scores": {
    "analytical": 91,
    "builder": 84,
    "research": 81
  }
}
```

---

# 18. `financial_profiles`

Stores the student's calculated family-level financial context.

| Column | Type |
|---|---|
| `id` | UUID |
| `student_id` | UUID |
| `education_budget` | DECIMAL |
| `risk_level` | VARCHAR |
| `financial_fit` | DECIMAL |
| `created_at` | TIMESTAMP |
| `updated_at` | TIMESTAMP |

This table should contain derived information rather than replacing the original parent-level financial records.

---

# 19. `careers`

Stores the career knowledge base.

| Column | Type |
|---|---|
| `id` | UUID |
| `name` | VARCHAR |
| `description` | TEXT |
| `risk_level` | VARCHAR |
| `education_pathway` | JSONB |
| `salary_range` | JSONB |
| `exams` | JSONB |
| `scholarships` | JSONB |
| `alternative_careers` | JSONB |
| `created_at` | TIMESTAMP |
| `updated_at` | TIMESTAMP |

---

# 20. `skills`

Stores reusable skill definitions.

| Column | Type |
|---|---|
| `id` | UUID |
| `name` | VARCHAR |
| `category` | VARCHAR |
| `description` | TEXT |

Possible categories:

```text
technical
analytical
communication
creative
leadership
domain
```

---

# 21. `career_skills`

Many-to-many relationship between careers and skills.

| Column | Type |
|---|---|
| `career_id` | UUID |
| `skill_id` | UUID |
| `importance` | DECIMAL |
| `required_level` | DECIMAL |

Relationship:

```text
careers N ──────── N skills
```

---

# 22. `career_aptitude_profiles`

Stores aptitude requirements for careers.

| Column | Type |
|---|---|
| `id` | UUID |
| `career_id` | UUID |
| `logical` | DECIMAL |
| `numerical` | DECIMAL |
| `analytical` | DECIMAL |
| `spatial` | DECIMAL |
| `verbal` | DECIMAL |

This allows comparison between:

```text
Student Aptitude
        vs
Career Aptitude Profile
```

---

# 23. `career_interest_profiles`

Stores interest compatibility.

| Column | Type |
|---|---|
| `id` | UUID |
| `career_id` | UUID |
| `interest` | VARCHAR |
| `importance` | DECIMAL |

---

# 24. `career_market_data`

Stores market-level information.

| Column | Type |
|---|---|
| `id` | UUID |
| `career_id` | UUID |
| `demand_score` | DECIMAL |
| `growth_score` | DECIMAL |
| `hiring_velocity` | DECIMAL |
| `stability_score` | DECIMAL |
| `data_source` | VARCHAR |
| `data_date` | DATE |

For MVP, these values may come from curated datasets.

---

# 25. `career_location_demand`

Stores geographic career demand.

| Column | Type |
|---|---|
| `id` | UUID |
| `career_id` | UUID |
| `location` | VARCHAR |
| `demand_score` | DECIMAL |
| `opportunity_score` | DECIMAL |
| `cost_index` | DECIMAL |
| `data_date` | DATE |

Example:

```text
AI Engineer
├── Chennai
├── Bangalore
├── Hyderabad
└── Delhi NCR
```

---

# 26. `recommendations`

Stores a recommendation result generated for a student.

| Column | Type |
|---|---|
| `id` | UUID |
| `student_id` | UUID |
| `generated_at` | TIMESTAMP |
| `engine_version` | VARCHAR |
| `status` | VARCHAR |

Possible statuses:

```text
generated
outdated
failed
```

---

# 27. `recommendation_scores`

Stores individual career recommendation scores.

| Column | Type |
|---|---|
| `id` | UUID |
| `recommendation_id` | UUID |
| `career_id` | UUID |
| `overall_score` | DECIMAL |
| `student_fit` | DECIMAL |
| `financial_fit` | DECIMAL |
| `family_alignment` | DECIMAL |
| `market_fit` | DECIMAL |
| `location_fit` | DECIMAL |
| `rank` | INTEGER |
| `explanation_data` | JSONB |

This is one of the most important tables.

It allows ALIGNX to explain:

```text
AI Engineer — 91

Student Fit       94
Financial Fit     82
Family Alignment  88
Market Fit        95
Location Fit      86
```

---

# 28. `parent_student_alignment`

Stores family analysis results.

| Column | Type |
|---|---|
| `id` | UUID |
| `student_id` | UUID |
| `family_id` | UUID |
| `financial_fit` | DECIMAL |
| `conflict_index` | DECIMAL |
| `family_alignment` | DECIMAL |
| `analysis_data` | JSONB |
| `created_at` | TIMESTAMP |

---

# 29. `skill_gaps`

Stores the difference between student skills and career requirements.

| Column | Type |
|---|---|
| `id` | UUID |
| `student_id` | UUID |
| `career_id` | UUID |
| `skill_id` | UUID |
| `current_level` | DECIMAL |
| `required_level` | DECIMAL |
| `gap` | DECIMAL |
| `priority` | VARCHAR |

Example:

```text
Python
Current: 85
Required: 80
Gap: 0

Machine Learning
Current: 40
Required: 85
Gap: 45
```

---

# 30. `roadmaps`

Stores a student's career roadmap.

| Column | Type |
|---|---|
| `id` | UUID |
| `student_id` | UUID |
| `career_id` | UUID |
| `title` | VARCHAR |
| `description` | TEXT |
| `created_at` | TIMESTAMP |
| `updated_at` | TIMESTAMP |

---

# 31. `roadmap_items`

Stores individual roadmap steps.

| Column | Type |
|---|---|
| `id` | UUID |
| `roadmap_id` | UUID |
| `title` | VARCHAR |
| `description` | TEXT |
| `category` | VARCHAR |
| `priority` | VARCHAR |
| `estimated_duration` | VARCHAR |
| `status` | VARCHAR |
| `sequence` | INTEGER |

Possible categories:

```text
skill
project
course
exam
certification
internship
education
```

---

# 32. `what_if_scenarios`

Stores optional simulation history.

| Column | Type |
|---|---|
| `id` | UUID |
| `student_id` | UUID |
| `scenario_name` | VARCHAR |
| `inputs` | JSONB |
| `results` | JSONB |
| `created_at` | TIMESTAMP |

Example inputs:

```json
{
  "education_budget": 1000000,
  "location": "Bangalore",
  "risk_appetite": "medium",
  "time_to_employment": "short"
}
```

The original student profile must remain unchanged.

---

# 33. Relationships

## Student

```text
students
   │
   ├── student_interests
   ├── student_skills
   ├── student_assessments
   ├── aptitude_results
   ├── career_discovery_results
   ├── career_dna
   ├── families
   ├── financial_profiles
   ├── recommendations
   ├── skill_gaps
   ├── roadmaps
   └── what_if_scenarios
```

---

# 34. Family Relationships

```text
students
   │
   └── families
          │
          ├── parents
          │      │
          │      ├── parent_invitations
          │      ├── parent_financial_profiles
          │      └── parent_expectations
          │
          └── parent_student_alignment
```

---

# 35. Career Relationships

```text
careers
   │
   ├── career_skills ─── skills
   ├── career_aptitude_profiles
   ├── career_interest_profiles
   ├── career_market_data
   ├── career_location_demand
   ├── recommendations
   ├── skill_gaps
   └── roadmaps
```

---

# 36. Foreign Key Rules

Recommended relationships:

```text
students.id
    ↓
student_interests.student_id

students.id
    ↓
families.student_id

families.id
    ↓
parents.family_id

parents.id
    ↓
parent_invitations.parent_id

parents.id
    ↓
parent_financial_profiles.parent_id

students.id
    ↓
recommendations.student_id

recommendations.id
    ↓
recommendation_scores.recommendation_id

careers.id
    ↓
recommendation_scores.career_id
```

Foreign keys should use appropriate deletion behavior.

Sensitive historical recommendation data should not be accidentally deleted through cascading operations unless explicitly intended.

---

# 37. Constraints

Important constraints include:

### Students

- `id` must be unique.
- Email should be unique if email authentication is used.

### Parents

- A parent belongs to a family.
- Parent status must use allowed values.

### Invitations

- Token hash must be unique.
- Expiration must be validated.

### Assessments

- Assessment type must use allowed values.
- A response must belong to a valid assessment.

### Scores

Scores should normally be constrained to:

```text
0 ≤ score ≤ 100
```

---

# 38. Indexing

Indexes should be created for frequently accessed fields.

Recommended:

```text
students.email
student_interests.student_id
student_skills.student_id
families.student_id
parents.family_id
parent_invitations.token_hash
parent_invitations.expires_at
student_assessments.student_id
recommendations.student_id
recommendation_scores.recommendation_id
recommendation_scores.career_id
career_market_data.career_id
career_location_demand.career_id
skill_gaps.student_id
skill_gaps.career_id
roadmaps.student_id
```

---

# 39. Sensitive Data

Sensitive data includes:

- Parent income
- Education budget
- Family financial information
- Student personal information
- Invitation tokens
- Authentication information

Access must be restricted.

Do not expose raw parent financial data through public APIs.

---

# 40. Data Versioning

Recommendation results should store the Decision Engine version.

Example:

```text
engine_version = "1.0"
```

This allows the team to understand why an old recommendation may differ from a new one after scoring changes.

Career market data should also store:

```text
data_source
data_date
```

---

# 41. Recommendation Lifecycle

```text
Profile Updated
      ↓
Existing Recommendation
      ↓
Outdated
      ↓
Decision Engine Re-run
      ↓
New Recommendation
      ↓
Generated
```

Relevant changes may include:

- Student interests
- Skills
- Aptitude results
- Parent data
- Education budget
- Location
- Market dataset

---

# 42. What-If Data Rule

What-If simulations must be isolated from the actual student profile.

```text
Actual Profile
     │
     ├───────────────┐
     │               │
     ▼               ▼
Normal Engine     What-If Copy
                       │
                       ▼
                  Modified Inputs
                       │
                       ▼
                  Same Engine
```

The simulation must never overwrite the original profile.

---

# 43. MVP Simplification

For the hackathon, the database may initially simplify some entities.

For example, structured JSONB can temporarily store:

- Career education pathways
- Exams
- Scholarships
- Alternative careers
- Parent expectations
- Career traits

However, frequently queried relationships should eventually be normalized.

---

# 44. Seed Data

The MVP should contain enough curated career data to demonstrate the system.

Suggested initial categories:

```text
AI / ML
Software Engineering
Data Science
Cybersecurity
Robotics
Biomedical Engineering
Bioinformatics
Cloud Engineering
Product Engineering
UX / Design
Environmental Engineering
Renewable Energy
Research
```

The final dataset should be selected and maintained by the data owner.

---

# 45. Database Development Rules

### Rule 1

Do not modify production schema manually without documenting the change.

### Rule 2

Use migrations for schema changes.

### Rule 3

Never commit production credentials.

### Rule 4

Use seed data for repeatable local development.

### Rule 5

Do not expose sensitive parent information to the frontend unnecessarily.

### Rule 6

Use foreign keys for relational integrity.

### Rule 7

Add indexes based on actual query requirements.

### Rule 8

Document breaking schema changes.

---

# 46. Example Recommendation Query Flow

```text
Student ID
   ↓
Fetch Student
   ↓
Fetch Aptitude
   ↓
Fetch Career Discovery
   ↓
Fetch Career DNA
   ↓
Fetch Family
   ↓
Fetch Financial Profile
   ↓
Fetch Relevant Career Data
   ↓
Fetch Market Data
   ↓
Fetch Location Data
   ↓
Decision Engine
   ↓
Store Recommendation
```

---

# 47. Final Database Architecture

```text
                         STUDENT
                            │
              ┌─────────────┼─────────────┐
              │             │             │
              ▼             ▼             ▼
         ASSESSMENTS     CAREER DNA     FAMILY
              │                           │
              │                     ┌─────┴─────┐
              │                     │           │
              │                  PARENTS     FINANCE
              │                     │
              │                  INVITES
              │
              └─────────────┐
                            ▼
                     DECISION ENGINE
                            │
             ┌──────────────┼──────────────┐
             ▼              ▼              ▼
          CAREERS        MARKET         LOCATION
             │              │              │
             └──────────────┼──────────────┘
                            ▼
                     RECOMMENDATIONS
                            │
                  ┌─────────┼─────────┐
                  ▼         ▼         ▼
              SKILL GAPS  ROADMAP   WHAT-IF
```

---

# 48. Final Principle

The ALIGNX database should preserve the distinction between:

```text
RAW INPUT
    ↓
Student / Parent Responses

DERIVED DATA
    ↓
Aptitude / Career DNA / Financial Fit

KNOWLEDGE
    ↓
Career / Market / Location Data

DECISION
    ↓
Recommendation Scores

ACTION
    ↓
Skill Gaps / Roadmap
```

This separation allows ALIGNX to remain explainable, maintainable, and easy to evolve as the Decision Engine improves.