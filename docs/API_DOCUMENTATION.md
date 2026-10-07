# ALIGNX — API Documentation

> **Project:** ALIGNX — Aligning Talent With Opportunity  
> **Document:** API Documentation  
> **Version:** 1.0  
> **Base URL:** `/api/v1`

---

# 1. Purpose

This document defines the API contracts used by ALIGNX.

The API layer connects:

```text
Frontend
   ↓
Backend API
   ↓
Database
Decision Engine
LLM
Career Knowledge
Market Data
```

The API should provide predictable request and response structures so that frontend, backend, AI/ML, and data development can happen independently.

---

# 2. API Principles

All APIs should follow these principles:

- REST-style endpoints.
- JSON request/response bodies.
- Consistent error format.
- Backend validation.
- Authentication where required.
- Authorization for protected resources.
- No direct frontend-to-database access.
- No Decision Engine logic inside frontend.
- No secrets in frontend code.

---

# 3. Base URL

Development:

```text
http://localhost:<PORT>/api/v1
```

Production:

```text
https://<backend-domain>/api/v1
```

The actual production domain should be configured through environment variables.

---

# 4. Standard Response Format

## Success

```json
{
  "success": true,
  "data": {},
  "message": "Request successful"
}
```

## Error

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  }
}
```

---

# 5. HTTP Status Codes

| Status | Meaning |
|---|---|
| `200` | Successful request |
| `201` | Resource created |
| `204` | Successful request with no content |
| `400` | Invalid request |
| `401` | Authentication required |
| `403` | Access denied |
| `404` | Resource not found |
| `409` | Conflict |
| `422` | Validation error |
| `429` | Rate limit exceeded |
| `500` | Internal server error |
| `503` | Service temporarily unavailable |

---

# 6. Authentication

Student-facing protected APIs should require authentication.

Example:

```http
Authorization: Bearer <access_token>
```

Parent invitation APIs may use a secure invitation token instead of full authentication.

---

# 7. API Modules

The API is divided into:

```text
Authentication
Students
Assessments
Parents
Careers
Recommendations
Decision Engine
Career Twin
What-If Simulator
Skill Gaps
Roadmaps
```

---

# 8. Authentication APIs

## 8.1 Register Student

```http
POST /auth/register
```

### Request

```json
{
  "name": "Himanshu",
  "email": "student@example.com",
  "password": "********"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "studentId": "uuid"
  },
  "message": "Student registered successfully"
}
```

---

## 8.2 Login

```http
POST /auth/login
```

### Request

```json
{
  "email": "student@example.com",
  "password": "********"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "accessToken": "<token>",
    "student": {
      "id": "uuid",
      "name": "Himanshu"
    }
  }
}
```

---

## 8.3 Get Current Student

```http
GET /auth/me
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Himanshu",
    "email": "student@example.com"
  }
}
```

---

# 9. Student APIs

## 9.1 Create Student Profile

```http
POST /students
```

### Request

```json
{
  "name": "Himanshu",
  "age": 19,
  "educationLevel": "B.Tech",
  "location": "Chennai",
  "interests": [
    "AI",
    "Robotics"
  ],
  "skills": [
    "Python",
    "C++"
  ],
  "goals": [
    "Build AI systems"
  ]
}
```

### Response

```json
{
  "success": true,
  "data": {
    "studentId": "uuid"
  },
  "message": "Student profile created"
}
```

---

## 9.2 Get Student Profile

```http
GET /students/:studentId
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Himanshu",
    "age": 19,
    "educationLevel": "B.Tech",
    "location": "Chennai",
    "interests": [],
    "skills": [],
    "goals": []
  }
}
```

---

## 9.3 Update Student Profile

```http
PATCH /students/:studentId
```

### Request

```json
{
  "location": "Bangalore",
  "skills": [
    "Python",
    "C++",
    "Machine Learning"
  ]
}
```

---

# 10. Career Discovery APIs

## 10.1 Start Career Discovery

```http
POST /assessments/career-discovery/start
```

### Request

```json
{
  "studentId": "uuid"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "assessmentId": "uuid",
    "totalQuestions": 15
  }
}
```

---

## 10.2 Submit Career Discovery Response

```http
POST /assessments/career-discovery/:assessmentId/response
```

### Request

```json
{
  "questionId": "q01",
  "answer": "build_solution"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "saved": true,
    "nextQuestion": "q02"
  }
}
```

---

## 10.3 Complete Career Discovery

```http
POST /assessments/career-discovery/:assessmentId/complete
```

### Response

```json
{
  "success": true,
  "data": {
    "analytical": 91,
    "builder": 84,
    "research": 81,
    "creative": 74,
    "leadership": 63,
    "social": 58,
    "risk": 71
  }
}
```

---

# 11. Aptitude APIs

## 11.1 Start Aptitude Assessment

```http
POST /assessments/aptitude/start
```

### Response

```json
{
  "success": true,
  "data": {
    "assessmentId": "uuid",
    "totalQuestions": 15
  }
}
```

---

## 11.2 Submit Aptitude Answer

```http
POST /assessments/aptitude/:assessmentId/response
```

### Request

```json
{
  "questionId": "aptitude_01",
  "answer": 2
}
```

---

## 11.3 Complete Aptitude Assessment

```http
POST /assessments/aptitude/:assessmentId/complete
```

### Response

```json
{
  "success": true,
  "data": {
    "logical": 91,
    "numerical": 82,
    "analytical": 88,
    "spatial": 76,
    "verbal": 69
  }
}
```

---

# 12. Career DNA APIs

## 12.1 Generate Career DNA

```http
POST /career-dna/:studentId/generate
```

The backend collects:

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
```

### Response

```json
{
  "success": true,
  "data": {
    "primaryTrait": "Analytical Builder",
    "secondaryTraits": [
      "Research",
      "Creative"
    ],
    "traitScores": {
      "analytical": 91,
      "builder": 84,
      "research": 81,
      "creative": 74
    },
    "description": "You tend to enjoy solving complex problems and turning ideas into practical solutions."
  }
}
```

---

## 12.2 Get Career DNA

```http
GET /career-dna/:studentId
```

---

# 13. Parent APIs

## 13.1 Add Parent

```http
POST /families/:familyId/parents
```

### Request

```json
{
  "name": "Parent Name",
  "relationship": "Father"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "parentId": "uuid",
    "status": "pending"
  }
}
```

---

# 14. Parent Invitation APIs

## 14.1 Generate Invitation

```http
POST /parents/:parentId/invitation
```

### Response

```json
{
  "success": true,
  "data": {
    "invitationUrl": "/parent/invite/<secure-token>",
    "expiresAt": "2026-10-10T12:00:00Z"
  }
}
```

The raw token should not be stored directly in the database when avoidable.

---

## 14.2 Open Invitation

```http
GET /parents/invitation/:token
```

### Response

```json
{
  "success": true,
  "data": {
    "valid": true,
    "parentId": "uuid",
    "studentName": "Himanshu"
  }
}
```

Only the minimum information required for the parent workflow should be returned.

---

## 14.3 Submit Parent Form

```http
POST /parents/invitation/:token/submit
```

### Request

```json
{
  "incomeRange": "5-10L",
  "educationBudget": 300000,
  "riskAppetite": "low",
  "locationPreference": "India",
  "stabilityPreference": "high",
  "careerExpectations": [
    "Stable career",
    "Good employment opportunities"
  ]
}
```

### Response

```json
{
  "success": true,
  "data": {
    "status": "completed"
  },
  "message": "Parent information submitted successfully"
}
```

---

# 15. Parent Status API

```http
GET /families/:familyId/parents/status
```

### Response

```json
{
  "success": true,
  "data": [
    {
      "parentId": "uuid1",
      "relationship": "Father",
      "status": "completed"
    },
    {
      "parentId": "uuid2",
      "relationship": "Mother",
      "status": "pending"
    }
  ]
}
```

---

# 16. Family Analysis API

## 16.1 Calculate Family Analysis

```http
POST /families/:familyId/analyze
```

### Response

```json
{
  "success": true,
  "data": {
    "financialFit": 82,
    "familyAlignment": 88,
    "conflictIndex": 24
  }
}
```

---

# 17. Career APIs

## 17.1 Get Careers

```http
GET /careers
```

Optional filters:

```text
?category=technology
?location=Chennai
?search=AI
```

---

## 17.2 Get Career

```http
GET /careers/:careerId
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "ai_engineer",
    "name": "AI Engineer",
    "description": "...",
    "skills": [],
    "aptitudeProfile": {},
    "interestProfile": {},
    "educationPathway": {},
    "salaryRange": {},
    "risk": "medium",
    "alternativeCareers": []
  }
}
```

---

# 18. Recommendation API

## 18.1 Generate Recommendations

```http
POST /recommendations/:studentId/generate
```

### Request

```json
{
  "location": "Chennai"
}
```

The backend should gather:

```text
Student
+
Aptitude
+
Career Discovery
+
Career DNA
+
Family
+
Financial Profile
+
Career Knowledge
+
Market Data
+
Location Data
```

Then call the Decision Engine.

---

# 19. Recommendation Response

### Response

```json
{
  "success": true,
  "data": {
    "recommendationId": "uuid",
    "engineVersion": "1.0",
    "recommendations": [
      {
        "careerId": "ai_engineer",
        "careerName": "AI Engineer",
        "rank": 1,
        "overallScore": 91,
        "studentFit": 94,
        "financialFit": 82,
        "familyAlignment": 88,
        "marketFit": 95,
        "locationFit": 86
      },
      {
        "careerId": "data_scientist",
        "careerName": "Data Scientist",
        "rank": 2,
        "overallScore": 86
      }
    ]
  }
}
```

---

# 20. Get Existing Recommendations

```http
GET /recommendations/:studentId
```

Returns the latest valid recommendation.

---

# 21. Recommendation Explanation API

```http
GET /recommendations/:recommendationId/explanation
```

### Response

```json
{
  "success": true,
  "data": {
    "careerId": "ai_engineer",
    "whyRecommended": "Your analytical aptitude and interest in AI align strongly with this career.",
    "strengths": [
      "Strong logical reasoning",
      "High interest in AI",
      "Good programming foundation"
    ],
    "concerns": [
      "Machine learning experience needs development"
    ]
  }
}
```

---

# 22. Decision Engine API

The Decision Engine may be implemented internally as a service rather than exposed publicly.

Recommended internal contract:

```text
POST /internal/decision-engine/evaluate
```

### Request

```json
{
  "student": {},
  "family": {},
  "careers": [],
  "marketData": [],
  "locationData": [],
  "configuration": {
    "weights": {
      "studentFit": 0.35,
      "financialFit": 0.20,
      "familyAlignment": 0.15,
      "marketFit": 0.20,
      "locationFit": 0.10
    }
  }
}
```

---

# 23. Decision Engine Response

```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "careerId": "ai_engineer",
        "overallScore": 91,
        "components": {
          "studentFit": 94,
          "financialFit": 82,
          "familyAlignment": 88,
          "marketFit": 95,
          "locationFit": 86
        },
        "reasons": [
          "Strong analytical aptitude",
          "Strong AI interest",
          "High market demand"
        ]
      }
    ]
  }
}
```

---

# 24. Career Twin API

## Generate Career Twin

```http
POST /career-twin/:studentId/:careerId
```

### Response

```json
{
  "success": true,
  "data": {
    "careerId": "ai_engineer",
    "matchScore": 91,
    "strengths": [
      "Analytical reasoning",
      "Programming"
    ],
    "gaps": [
      "Machine Learning",
      "Statistics"
    ],
    "matchingDimensions": {
      "aptitude": 94,
      "interest": 92,
      "skills": 78,
      "careerDNA": 90
    }
  }
}
```

---

# 25. Skill Gap API

```http
GET /skill-gaps/:studentId/:careerId
```

### Response

```json
{
  "success": true,
  "data": {
    "career": "AI Engineer",
    "skills": [
      {
        "name": "Python",
        "current": 85,
        "required": 80,
        "gap": 0,
        "priority": "low"
      },
      {
        "name": "Machine Learning",
        "current": 40,
        "required": 85,
        "gap": 45,
        "priority": "high"
      }
    ]
  }
}
```

---

# 26. Roadmap API

## Generate Roadmap

```http
POST /roadmaps/:studentId/:careerId
```

### Response

```json
{
  "success": true,
  "data": {
    "roadmapId": "uuid",
    "career": "AI Engineer",
    "phases": [
      {
        "title": "Foundation",
        "items": []
      },
      {
        "title": "Skill Development",
        "items": []
      },
      {
        "title": "Projects",
        "items": []
      }
    ]
  }
}
```

---

# 27. What-If Simulator API

## Run Scenario

```http
POST /simulator/:studentId
```

### Request

```json
{
  "educationBudget": 1000000,
  "location": "Bangalore",
  "riskAppetite": "medium",
  "timeToEmployment": "short"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "scenario": {
      "educationBudget": 1000000,
      "location": "Bangalore",
      "riskAppetite": "medium"
    },
    "recommendations": [
      {
        "careerId": "ai_engineer",
        "score": 93,
        "rank": 1
      }
    ],
    "changes": [
      {
        "careerId": "ai_engineer",
        "previousScore": 88,
        "newScore": 93,
        "change": 5
      }
    ]
  }
}
```

---

# 28. What-If Rule

The simulator must call the same Decision Engine used by normal recommendations.

```text
Normal Recommendation
        ↓
Decision Engine

What-If Recommendation
        ↓
Same Decision Engine
```

Only the input scenario changes.

---

# 29. Dashboard API

A combined endpoint may be provided for efficient dashboard loading.

```http
GET /dashboard/:studentId
```

### Response

```json
{
  "success": true,
  "data": {
    "student": {},
    "careerDNA": {},
    "parents": [],
    "familyAnalysis": {},
    "recommendations": [],
    "skillGaps": [],
    "roadmap": {}
  }
}
```

This avoids excessive frontend API calls when appropriate.

---

# 30. Market Data API

```http
GET /market/careers/:careerId
```

### Response

```json
{
  "success": true,
  "data": {
    "careerId": "ai_engineer",
    "demandScore": 92,
    "growthScore": 89,
    "hiringVelocity": 87,
    "stabilityScore": 84
  }
}
```

---

# 31. Location Demand API

```http
GET /market/careers/:careerId/locations
```

### Response

```json
{
  "success": true,
  "data": [
    {
      "location": "Bangalore",
      "demandScore": 92,
      "opportunityScore": 94
    },
    {
      "location": "Chennai",
      "demandScore": 78,
      "opportunityScore": 81
    }
  ]
}
```

---

# 32. API Validation

Every request must be validated.

Example:

```text
educationBudget
→ must be numeric
→ must not be negative

age
→ must be within reasonable range

riskAppetite
→ must be one of allowed values
```

Validation should happen at the backend boundary even if frontend validation already exists.

---

# 33. API Error Codes

Recommended error codes:

```text
INVALID_REQUEST
VALIDATION_ERROR
UNAUTHORIZED
FORBIDDEN
RESOURCE_NOT_FOUND
STUDENT_NOT_FOUND
PARENT_NOT_FOUND
INVITATION_NOT_FOUND
INVITATION_EXPIRED
INVITATION_ALREADY_USED
ASSESSMENT_NOT_FOUND
ASSESSMENT_INCOMPLETE
RECOMMENDATION_FAILED
DECISION_ENGINE_ERROR
LLM_SERVICE_ERROR
DATABASE_ERROR
RATE_LIMITED
INTERNAL_ERROR
```

---

# 34. Parent Privacy

Parent APIs must never return unnecessary sensitive information.

For example, a student status endpoint may return:

```json
{
  "relationship": "Father",
  "status": "completed"
}
```

rather than:

```json
{
  "income": 850000,
  "educationBudget": 300000
}
```

unless that information is specifically required and authorized.

---

# 35. API Security

The backend must:

- Validate authentication.
- Validate authorization.
- Validate request bodies.
- Validate route parameters.
- Protect invitation tokens.
- Rate-limit sensitive endpoints.
- Avoid exposing stack traces.
- Avoid logging secrets.
- Avoid returning unnecessary personal information.

---

# 36. Rate Limiting

Rate limiting should be considered for:

- Login
- Registration
- Parent invitation generation
- Parent invitation verification
- LLM endpoints
- Recommendation generation
- What-If simulation

This helps prevent abuse and accidental excessive API usage.

---

# 37. API Versioning

Initial version:

```text
/api/v1
```

Breaking changes should use a new version where necessary.

Example:

```text
/api/v1/recommendations
/api/v2/recommendations
```

---

# 38. Frontend Integration Rule

Daksh's frontend should communicate through API service functions.

Example:

```text
frontend
   ↓
api/recommendations.ts
   ↓
GET /recommendations/:studentId
```

Components should not contain raw API calls everywhere.

---

# 39. Backend Integration Rule

OM's backend should keep:

```text
Routes
   ↓
Controllers
   ↓
Services
   ↓
Repositories / Engine / External Services
```

Avoid putting database queries and business logic directly inside route definitions.

---

# 40. Decision Engine Integration Rule

Himanshu's Decision Engine should expose a clear function/service contract.

Conceptually:

```text
evaluateCareerAlignment(input)
```

Input:

```text
Student
Family
Career
Market
Location
Configuration
```

Output:

```text
Eligibility
Student Fit
Financial Fit
Family Alignment
Market Fit
Location Fit
Overall Score
Reasons
```

---

# 41. LLM Integration Rule

Arpit's LLM layer should consume structured results.

```text
Decision Engine
       ↓
Structured Result
       ↓
LLM Prompt Builder
       ↓
LLM
       ↓
Structured Explanation
```

The LLM should not receive unrestricted authority to modify scores.

---

# 42. API Development Order

Recommended implementation order:

### Phase 1

```text
Auth
Student
```

### Phase 2

```text
Career Discovery
Aptitude
Career DNA
```

### Phase 3

```text
Family
Parents
Invitations
```

### Phase 4

```text
Careers
Market Data
```

### Phase 5

```text
Decision Engine
Recommendations
```

### Phase 6

```text
Career Twin
Skill Gaps
Roadmap
What-If
```

---

# 43. End-to-End API Flow

```text
POST /auth/register
        ↓
POST /students
        ↓
POST /assessments/career-discovery/start
        ↓
POST /assessments/career-discovery/.../response
        ↓
POST /assessments/career-discovery/.../complete
        ↓
POST /assessments/aptitude/start
        ↓
POST /assessments/aptitude/.../complete
        ↓
POST /career-dna/:studentId/generate
        ↓
POST /families/:familyId/parents
        ↓
POST /parents/:parentId/invitation
        ↓
Parent opens invitation
        ↓
POST /parents/invitation/:token/submit
        ↓
POST /families/:familyId/analyze
        ↓
POST /recommendations/:studentId/generate
        ↓
GET /recommendations/:studentId
        ↓
GET /recommendations/:id/explanation
        ↓
POST /career-twin/:studentId/:careerId
        ↓
GET /skill-gaps/:studentId/:careerId
        ↓
POST /roadmaps/:studentId/:careerId
```

---

# 44. API Source of Truth

| Area | Documentation |
|---|---|
| Product behavior | `PRD.md` |
| Technical requirements | `TRD.md` |
| Architecture | `SYSTEM_ARCHITECTURE.md` |
| Database | `DATABASE_SCHEMA.md` |
| API contracts | `API_DOCUMENTATION.md` |
| UI/UX | `UI_UX.md` |
| User journeys | `USER_FLOW.md` |
| Roadmap | `ROADMAP.md` |

Any API change that affects another team member must be documented.

---

# 45. Final API Principle

ALIGNX APIs should maintain a clean separation:

```text
Frontend
   ↓
API
   ↓
Backend Services
   ↓
┌───────────────┬────────────────┬───────────────┐
│   Database    │ Decision Engine│   LLM Service │
└───────────────┴────────────────┴───────────────┘
   ↓
Structured Response
   ↓
Frontend
```

> **The API layer is the contract between the four team-owned parts of ALIGNX. Keep those contracts explicit, predictable, validated, and versioned.**