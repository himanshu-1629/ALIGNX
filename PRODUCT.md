# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
- Indian students in Class 9-12 and early undergraduate college facing high-stakes career selection crossroads.
- Parents balancing risk tolerance, family education budget, long-term career stability, and societal expectations.
- Secondary audience: Academic mentors and career counselors seeking objective, diagnostic career fit data.

## Product Purpose
ALIGNX is an AI-powered multi-dimensional career decision intelligence platform. It replaces subjective career counseling and unconstrained LLM guesswork with deterministic psychometric vectors, financial affordability modeling, labor market telemetry, and mutual parent-student alignment. Success means transforming high-anxiety family arguments into transparent, data-grounded career roadmaps.

## Positioning
Unlike conventional aptitude tests that deliver static generic lists, or ChatGPT wrappers that hallucinate advice without economic grounding, ALIGNX executes a deterministic 5D mathematical model ($S_{\text{fit}}, F_{\text{fit}}, A_{\text{family}}, M_{\text{fit}}, L_{\text{fit}}$) backed by MoSPI PLFS 2023-24 labor market benchmarks and non-linear financial affordability decay curves.

## Operating Context
- Students exploring in high-stress decision windows (board exams, entrance prep, college admissions).
- Joint family counseling sessions where students and parents simultaneously evaluate trade-offs.
- Multi-device web environment (desktop and mobile browsers) requiring responsive, highly legible dashboards and interactive counterfactual simulation sliders.

## Capabilities and Constraints
- **5D Algorithmic Scoring**: Deterministic 5-dimension weighted scoring engine ($S_{\text{fit}} 35\%, F_{\text{fit}} 20\%, A_{\text{family}} 15\%, M_{\text{fit}} 20\%, L_{\text{fit}} 10\%$).
- **Holland RIASEC Profile**: 6-axis cosine vector similarity across Realistic, Investigative, Artistic, Social, Enterprising, and Conventional traits.
- **Parent-Student Conflict Index (PSCI)**: Mathematical dissonance measurement pinpointing exact gaps in risk tolerance, budget, and compensation targets.
- **Counterfactual "What-If" Simulator**: Sub-millisecond slider simulations demonstrating how budget shifts, regional relocation, or skill acquisitions alter career rankings.
- **Phased Career Twin & Roadmap**: Multi-stage strategic learning milestones tailored to target career archetypes.
- **LLM Diagnostic Explainer**: Gemini 3.5 Flash Lite constrained to structured explanatory synthesis rather than predictive guessing, enforced by a 10s timeout ceiling and candidate model cascade.

## Brand Commitments
- **Name**: ALIGNX
- **Aesthetic Direction**: Light or adaptive clean editorial theme with high-contrast typography, crisp subtle borders, disciplined spacing, and refined interactive data visualizations.
- **Tone**: Analytical, empathetic, authoritative, transparent, and non-judgmental.

## Evidence on Hand
- 25 authentic STEAM careers seeded in `database/seeds/careers.json` with realistic educational costs and MoSPI PLFS entry/mid/senior compensation benchmarks.
- 18 psychometric RIASEC questions and 5 cognitive aptitude challenges in `database/seeds/assessment_questions.json`.
- Tested and operational backend API with 13 passing E2E test suites on port 5001.
- React 19 + TypeScript + Vite frontend with custom interactive visualizers on port 5174.

## Product Principles
1. **Mathematical Grounding over Hallucination**: Every recommendation stems from verifiable vector math, financial margins, and market velocity; AI is strictly the explanatory voice.
2. **Dual-Stakeholder Empathy**: A career path is only viable if it is both inspiring for the student and sustainable for the family.
3. **Actionable Transparency**: Never provide a black-box score; show the exact dimensional breakdown, prerequisite skill gaps, and phased acquisition milestones.
4. **Editorial Clarity**: Present dense quantitative data with unhurried typography, precise micro-copy, and legible visual balance.

## Accessibility & Inclusion
- High-contrast typography conforming to WCAG 2.1 AA standards.
- Fully keyboard-navigable assessment quizzes and simulation controls.
- Explicit support for regional financial figures denominated clearly in Indian Rupees (₹ Lakhs / ₹ Crores).
