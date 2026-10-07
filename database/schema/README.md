# ALIGNX — Database Schema Reference

This directory contains the database collection schema definitions, Mongoose models mapping, and indexing strategy for **ALIGNX** on **MongoDB Atlas**.

## Core Collections & Models

| Collection Name | Mongoose Model | File Location | Key Responsibility |
|---|---|---|---|
| `students` | `Student` | `backend/src/models/Student.ts` | Student profile, embedded Career DNA, skills, interests & aptitude snapshot |
| `families` | `Family` | `backend/src/models/Family.ts` | Multi-parent entries, individual financial profiles, expectations, and conflict index |
| `parent_invitations` | `ParentInvitation` | `backend/src/models/ParentInvitation.ts` | Tokenized invitation links for passwordless parent participation |
| `assessments` | `Assessment` | `backend/src/models/Assessment.ts` | Discovery and aptitude assessment sessions and question responses |
| `careers` | `Career` | `backend/src/models/Career.ts` | Knowledge base of careers, benchmarks, costs, salaries, and market demand |
| `recommendations` | `Recommendation` | `backend/src/models/Recommendation.ts` | Calculated recommendations with component scores and explainability |
| `skill_gaps` | `SkillGap` | `backend/src/models/SkillGap.ts` | Delta analysis between student profile and target career requirements |
| `roadmaps` | `Roadmap` | `backend/src/models/Roadmap.ts` | Multi-phase learning roadmaps with sequenced milestones |
| `what_if_scenarios` | `WhatIfScenario` | `backend/src/models/WhatIfScenario.ts` | Dynamic simulation runs with score and rank deltas |

## Indexing Strategy

1. **Email & Auth**: `students.email` (unique)
2. **Invitations**: `parent_invitations.token` (unique), compound `(tokenHash, expiresAt)`
3. **Lookup Optimization**:
   - `students.location`
   - `families.studentId` (unique)
   - `careers.slug` (unique), `careers.category`
   - `assessments.(studentId, assessmentType)`
   - `recommendations.(studentId, createdAt: -1)`
   - `skill_gaps.(studentId, careerId)` (unique)
   - `roadmaps.(studentId, careerId)`
   - `what_if_scenarios.(studentId, createdAt: -1)`
