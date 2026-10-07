# ALIGNX — Testing Strategy

> **Product:** ALIGNX — Aligning Talent With Opportunity  
> **Document:** Testing Strategy  
> **Version:** 1.0

---

# 1. Purpose

This document defines the testing strategy for ALIGNX.

Testing must ensure that:

- Student data is stored correctly.
- Assessments produce consistent results.
- Career DNA calculations are correct.
- Parent and family information is handled correctly.
- Financial constraints are calculated correctly.
- Career recommendations are deterministic and explainable.
- APIs behave consistently.
- Frontend and backend integrate correctly.
- Critical user journeys work end-to-end.

---

# 2. Testing Philosophy

ALIGNX should follow:

```text
Test Early
    ↓
Test Components
    ↓
Test Integrations
    ↓
Test End-to-End
    ↓
Validate Demo
```

The most important component to test rigorously is the:

> **ALIGNX Decision Engine**

Because incorrect scoring can produce incorrect career recommendations.

---

# 3. Testing Levels

ALIGNX uses five main testing levels:

```text
Unit Testing
     ↓
Integration Testing
     ↓
API Testing
     ↓
End-to-End Testing
     ↓
Manual / Demo Testing
```

---

# 4. Unit Testing

Unit tests verify individual functions or modules.

Examples:

```text
calculateAptitudeScore()
calculateStudentFit()
calculateFinancialFit()
calculateFamilyAlignment()
calculateMarketFit()
calculateLocationFit()
calculateAlignmentScore()
checkEligibility()
rankCareers()
```

Each function should be testable independently.

---

# 5. Frontend Unit Testing

Frontend components that contain meaningful logic should be tested.

Examples:

```text
AssessmentOption
CareerCard
ScoreCard
ParentCard
ProgressBar
SkillGapCard
RoadmapItem
```

Test:

- Rendering
- User interaction
- State changes
- Validation
- Conditional UI

---

# 6. Backend Unit Testing

Backend services should be tested independently.

Examples:

```text
StudentService
AssessmentService
ParentService
InvitationService
RecommendationService
CareerService
RoadmapService
```

Tests should verify:

- Valid inputs
- Invalid inputs
- Missing data
- Database errors
- Business rules

---

# 7. Decision Engine Testing

The Decision Engine requires special attention.

Its output should be deterministic.

For the same input:

```text
Input A
   ↓
Decision Engine
   ↓
Output A
```

Running it again should produce:

```text
Input A
   ↓
Decision Engine
   ↓
Output A
```

The ranking should not randomly change.

---

# 8. Student Fit Testing

Test whether student characteristics correctly affect Student Fit.

Example:

```text
Student:
Strong analytical aptitude
Strong AI interest
Python skill

Career:
AI Engineer
```

Expected:

```text
Student Fit → High
```

A student with significantly weaker alignment should produce a lower Student Fit.

---

# 9. Aptitude Testing

Test each aptitude dimension independently.

```text
Logical
Numerical
Analytical
Spatial
Verbal
```

Test:

- Correct answers
- Incorrect answers
- Partial scores
- Maximum scores
- Minimum scores
- Missing responses
- Invalid responses

---

# 10. Career DNA Testing

Test that Career DNA correctly reflects the input signals.

Example:

```text
Strong:
Analytical
Builder
Research
```

Expected:

```text
Primary Identity:
Analytical Builder
```

Edge cases should also be tested.

For example:

```text
Two equally strong traits
```

The system must have a deterministic tie-breaking rule.

---

# 11. Financial Fit Testing

Financial Fit should be tested using controlled scenarios.

Example:

```text
Career Education Cost = ₹3L
Family Education Budget = ₹5L
```

Expected:

```text
Financial Fit → High
```

Another scenario:

```text
Career Education Cost = ₹15L
Family Education Budget = ₹3L
```

Expected:

```text
Financial Fit → Low
```

The exact numerical score depends on the implemented solver configuration.

---

# 12. Multiple Parent Testing

ALIGNX supports multiple parents/guardians.

Test:

```text
0 parents
1 parent
2 parents
3+ parents
```

The system should not assume exactly two parents.

Example:

```text
Student
 └── Family
      ├── Parent A
      ├── Parent B
      └── Guardian C
```

---

# 13. Parent Invitation Testing

Test invitation states:

```text
PENDING
FILLING
COMPLETED
EXPIRED
REVOKED
```

Test:

- Valid token
- Invalid token
- Expired token
- Revoked token
- Reused token
- Duplicate invitation
- Resend invitation

---

# 14. Parent Form Testing

Test:

- Required fields
- Optional fields
- Invalid values
- Valid values
- Boundary values
- Form submission
- Duplicate submission
- Network failure

The parent should not be able to submit malformed data.

---

# 15. Family Alignment Testing

Test student-parent differences across:

```text
Career preference
Budget
Risk
Location
Stability
Time-to-earnings
```

Example:

```text
Student Risk = High
Parent Risk = Low
```

Expected:

```text
Conflict Index → Higher
```

The exact score should follow the configured conflict calculation.

---

# 16. Market Fit Testing

Test different market conditions.

Example:

```text
Career A:
High market demand

Career B:
Low market demand
```

All else equal:

```text
Career A
Market Fit > Career B
```

Market data should never be silently fabricated when unavailable.

---

# 17. Location Fit Testing

Test:

```text
Preferred Location = Chennai
Career Demand in Chennai = High
```

Expected:

```text
Location Fit → High
```

Also test:

- No location preference
- No location data
- Multiple preferred locations
- Local vs regional vs national data

---

# 18. Eligibility Testing

Eligibility must be evaluated before ranking.

Example:

```text
Career requires:
Specific prerequisite

Student:
Does not satisfy prerequisite
```

Expected:

```text
Career → Excluded
```

It should not receive a high ranking simply because its other scores are strong.

---

# 19. Overall Score Testing

Initial configured formula:

```text
Alignment Score =
    0.35 × Student Fit
  + 0.20 × Financial Fit
  + 0.15 × Family Alignment
  + 0.20 × Market Fit
  + 0.10 × Location Fit
```

Example:

```text
Student Fit       = 90
Financial Fit     = 80
Family Alignment  = 70
Market Fit        = 95
Location Fit      = 85
```

Expected:

```text
0.35(90)
+ 0.20(80)
+ 0.15(70)
+ 0.20(95)
+ 0.10(85)

= 31.5
+ 16
+ 10.5
+ 19
+ 8.5

= 85.5
```

The implementation should return the configured representation of this value, for example `85.5` or a rounded `86`, consistently across the system.

---

# 20. Ranking Testing

Given:

```text
Career A = 91
Career B = 86
Career C = 83
```

Expected:

```text
1. Career A
2. Career B
3. Career C
```

Test:

- Equal scores
- Missing scores
- Excluded careers
- Large career datasets
- Different weighting configurations

---

# 21. Tie-Breaking

If two careers have identical overall scores, the system must use a deterministic tie-breaker.

Recommended order:

```text
Overall Score
      ↓
Student Fit
      ↓
Market Fit
      ↓
Financial Fit
      ↓
Stable Career ID / deterministic ordering
```

The exact rule should be implemented consistently.

---

# 22. Recommendation Testing

Test complete recommendation generation.

Input:

```text
Student
+
Family
+
Career Dataset
+
Market Data
```

Expected:

```text
Ranked Careers
+
Component Scores
+
Explanation Data
```

Verify that every returned score can be traced to its inputs.

---

# 23. Explainability Testing

Every recommendation should have explainable factors.

Example:

```text
AI Engineer — 91%

Reasons:
✓ Strong analytical aptitude
✓ Strong AI interest
✓ Good programming foundation
✓ High market demand
```

The explanation should not claim facts that are absent from the structured data.

---

# 24. LLM Testing

LLM output should be tested for:

- Relevance
- Grounding
- Consistency
- No fabricated statistics
- No fabricated salary data
- No unsupported claims
- Appropriate tone
- No ranking override

The LLM receives structured context from the system.

---

# 25. LLM Fallback Testing

If the LLM API fails:

```text
LLM unavailable
      ↓
Structured Recommendation
      ↓
Fallback Explanation
```

The recommendation system should continue functioning.

---

# 26. What-If Testing

The What-If Simulator must not modify the actual student profile.

Example:

```text
Current Budget = ₹5L

What-If Budget = ₹10L
```

After simulation:

```text
Actual Budget = ₹5L
Scenario Budget = ₹10L
```

The original profile must remain unchanged.

---

# 27. What-If Consistency

The What-If Simulator must use the same Decision Engine.

Test:

```text
Normal Engine(Input A)
```

and:

```text
WhatIf Engine(Input A)
```

when no values are changed.

Expected:

```text
Same result
```

---

# 28. Skill Gap Testing

Given:

```text
Required Skills
-
Student Skills
```

the system should identify missing or insufficient skills.

Example:

```text
Required:
Python
Machine Learning
Statistics

Student:
Python
```

Expected:

```text
Strong:
Python

Gap:
Machine Learning
Statistics
```

---

# 29. Roadmap Testing

The roadmap should correspond to the selected career and identified skill gaps.

Example:

```text
Skill Gap:
Machine Learning

Roadmap:
Machine Learning Fundamentals
        ↓
ML Projects
        ↓
Advanced ML
```

The roadmap should not recommend unrelated skills.

---

# 30. API Testing

Every API should be tested for:

### Success

```text
200
201
204
```

### Client errors

```text
400
401
403
404
409
422
```

### Server errors

```text
500
```

---

# 31. API Validation Testing

Test:

- Missing fields
- Wrong data types
- Invalid IDs
- Invalid enums
- Excessively large input
- Duplicate data
- Unauthorized requests

Example:

```json id="a6x1hj"
{
  "age": "hello"
}
```

should be rejected.

---

# 32. Authentication Testing

If authentication is implemented, test:

```text
Valid credentials
Invalid credentials
Expired session
Unauthorized endpoint
Role restrictions
```

Parent invitation access should remain separate from normal student authentication where intended.

---

# 33. Authorization Testing

A student should only access their own protected data.

Example:

```text
Student A
   ✗
Student B's Profile
```

Parent access should only expose information required for the parent workflow.

---

# 34. Database Testing

Verify:

- Foreign keys
- Unique constraints
- Required fields
- Cascade behavior
- Indexes
- Data types
- Enum values

Example:

```text
Student
   ↓
Family
   ↓
Parent
```

Deleting or modifying records must respect the defined relationships.

---

# 35. Data Integrity Testing

Verify that:

```text
Assessment Response
      ↓
Assessment
      ↓
Student
```

always references valid records.

Similarly:

```text
Recommendation
      ↓
Student
      ↓
Career
```

must maintain valid relationships.

---

# 36. Integration Testing

Integration tests verify that modules work together.

### Example

```text
Frontend
   ↓
API
   ↓
Backend
   ↓
Database
   ↓
Decision Engine
   ↓
API Response
   ↓
Frontend
```

---

# 37. Critical Integration Test

The most important integration test is:

```text
Create Student
      ↓
Complete Discovery
      ↓
Complete Aptitude
      ↓
Generate Career DNA
      ↓
Add Parent
      ↓
Complete Parent Form
      ↓
Generate Recommendation
      ↓
View Career
      ↓
Generate Skill Gap
      ↓
Generate Roadmap
```

This should be tested before the hackathon demo.

---

# 38. End-to-End Testing

The complete student journey should be tested from the user's perspective.

### E2E Scenario

```text
Open ALIGNX
      ↓
Create Profile
      ↓
Complete Discovery
      ↓
Complete Aptitude
      ↓
View Career DNA
      ↓
Add Parent
      ↓
Parent Opens Link
      ↓
Parent Completes Form
      ↓
Student Receives Recommendations
      ↓
Explore Career
      ↓
View Roadmap
```

---

# 39. Responsive Testing

Test major screens on:

```text
Mobile
Tablet
Desktop
```

Important flows:

- Onboarding
- Career Discovery
- Aptitude
- Parent form
- Recommendation dashboard
- What-If
- Roadmap

---

# 40. Browser Testing

At minimum test the supported frontend on:

```text
Chrome
Safari
Edge
```

Mobile browser testing should be performed for the parent invitation flow.

---

# 41. Performance Testing

Measure:

- Page load
- API response time
- Recommendation generation time
- Database queries
- LLM response time

The Decision Engine should be fast enough to run interactively.

---

# 42. Error Handling Testing

Simulate:

```text
Database unavailable
API timeout
LLM timeout
Invalid token
Missing career data
Incomplete student profile
Incomplete parent profile
```

The user should receive a meaningful recovery action.

---

# 43. Security Testing

Sensitive information includes:

- Financial information
- Parent information
- Student information
- Invitation tokens
- Authentication credentials

Test:

- Input sanitization
- Authorization
- Token security
- Rate limiting
- Sensitive data exposure
- Environment variable handling

Never commit secrets to Git.

---

# 44. Test Data

Create a controlled seed dataset.

Recommended:

```text
5–10 test students
20–50 careers
Multiple parent profiles
Different financial situations
Different locations
Different aptitude profiles
```

Include both normal and edge cases.

---

# 45. Recommended Test Personas

## Persona A — High Student Fit

```text
Strong aptitude
Strong interest
Good skills
Supportive family
Good market
```

Expected:

```text
High alignment
```

---

## Persona B — Student/Parent Conflict

```text
Student → High risk
Parent → Low risk
```

Expected:

```text
Higher Conflict Index
```

---

## Persona C — Financial Constraint

```text
Student → Strong fit
Family → Low education budget
Career → High education cost
```

Expected:

```text
Reduced Financial Fit
```

---

## Persona D — Market Mismatch

```text
Student → Strong fit
Career → Low market demand
```

Expected:

```text
Reduced Market Fit
```

---

## Persona E — Location Mismatch

```text
Student → Strong fit
Preferred location → Chennai
Career demand → Low in Chennai
```

Expected:

```text
Reduced Location Fit
```

---

# 46. Edge Cases

Test:

```text
No parent
One parent
Multiple parents

No skills
Many skills

No interests
Many interests

Incomplete assessment
Duplicate submission

No market data
No location data

Equal career scores
Zero scores
Maximum scores

Very low budget
Very high budget
```

---

# 47. Regression Testing

Whenever a major feature changes, rerun:

```text
Student Profile
Assessment
Career DNA
Parent Flow
Decision Engine
Recommendations
Career Details
Skill Gap
Roadmap
```

A change in one module must not silently break another.

---

# 48. Decision Engine Regression Set

Maintain a fixed set of known inputs.

Example:

```text
Test Case 01
Input → Expected ranking

Test Case 02
Input → Expected ranking

Test Case 03
Input → Expected ranking
```

After every scoring change:

```text
Run Regression Set
        ↓
Compare Results
        ↓
Review Unexpected Changes
```

---

# 49. Test Automation

Where practical:

```text
Unit Tests       → Automated
API Tests        → Automated
Decision Engine  → Automated
Integration      → Automated
E2E              → Selected critical flows
UI Visual        → Manual / automated where practical
```

Do not attempt to automate every visual detail during the hackathon.

---

# 50. Manual QA Checklist

Before demo:

### Student

- [ ] Registration/onboarding works
- [ ] Discovery works
- [ ] Aptitude works
- [ ] Career DNA loads
- [ ] Parent can be added
- [ ] Recommendations generate
- [ ] Career details work
- [ ] Roadmap works

### Parent

- [ ] Invitation opens
- [ ] Parent form works
- [ ] Submission succeeds
- [ ] Status updates

### System

- [ ] No critical console errors
- [ ] No broken API calls
- [ ] No missing images/assets
- [ ] No secrets exposed
- [ ] Database seeded
- [ ] Demo account works

---

# 51. Definition of Done

A feature is considered complete only when:

```text
Implementation
      +
Validation
      +
Error Handling
      +
Testing
      +
Integration
```

are complete.

A feature that only works on the developer's machine is not considered done.

---

# 52. Bug Priority

## P0 — Critical

Blocks the core journey.

Examples:

- Cannot create student
- Decision Engine crashes
- Recommendations unavailable
- Parent form cannot submit

Fix immediately.

---

## P1 — High

Major functionality is broken.

Examples:

- Incorrect score
- Incorrect ranking
- Career details unavailable
- Roadmap incorrect

Fix before demo.

---

## P2 — Medium

Feature works but has issues.

Examples:

- Minor UI issue
- Non-critical validation issue
- Slow secondary screen

Fix if time allows.

---

## P3 — Low

Cosmetic or future improvement.

Examples:

- Minor spacing
- Animation improvement
- Small visual polish

Do after core functionality.

---

# 53. Team Testing Responsibilities

## Himanshu

Owns testing of:

- Aptitude scoring
- Career DNA
- Student Fit
- Financial Fit
- Family Alignment
- Market Fit
- Location Fit
- Eligibility
- Ranking
- What-If consistency

---

## Arpit

Owns testing of:

- Career dataset validity
- Career attributes
- Skill mappings
- Market information
- LLM prompts
- Explanation grounding

---

## OM

Owns testing of:

- APIs
- Database
- Authentication
- Authorization
- Parent invitations
- Data validation
- Error handling

---

## Daksh

Owns testing of:

- UI
- Responsive behavior
- Navigation
- Forms
- Loading states
- Error states
- Assessment interactions
- Visual consistency

---

# 54. Integration Testing Ownership

All four members participate in the final end-to-end test.

```text
Himanshu
Decision Engine
      │
      ▼
Arpit
Knowledge
      │
      ▼
OM
Backend + Database
      │
      ▼
Daksh
Frontend
```

The final product is considered ready only when the entire chain works.

---

# 55. Pre-Demo Test Run

Run the following exact journey before presenting:

```text
1. Open ALIGNX
2. Create demo student
3. Complete Career Discovery
4. Complete Aptitude
5. Reveal Career DNA
6. Add Parent
7. Open parent link
8. Submit parent data
9. Generate recommendations
10. Explain recommendation
11. Open Career Twin
12. Run What-If
13. View Skill Gap
14. View Roadmap
```

Record any failure.

Fix P0/P1 issues first.

---

# 56. Final Testing Principle

The most important test is not:

> "Does every page look good?"

It is:

> **"Can ALIGNX take a real student through Student + Family + Market analysis and produce a consistent, explainable, actionable career recommendation?"**

If the answer is yes, the core product works.

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
Skill Gap
   ↓
Roadmap
   ↓
Action
```

**That complete chain is the primary acceptance test for ALIGNX.**