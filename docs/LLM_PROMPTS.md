# ALIGNX — LLM Prompt Architecture & Guardrail Specification

> **Document:** LLM Prompt Architecture & Response Contracts  
> **Owner:** Arpit (Data & LLM Layer)  
> **Version:** 1.0 (DataQuest 3.0 / PRISM Engine)  
> **LLM Backbone:** Google Gemini 2.5 / 1.5 Pro via Gemini API  

---

## 1. Executive Architecture

The ALIGNX Large Language Model (LLM) Layer is strictly an **intelligence-explanation and synthesis engine**. In accordance with [SYSTEM_ARCHITECTURE.md](../docs/SYSTEM_ARCHITECTURE.md) and [PRD.md](../docs/PRD.md):

1. **Ranking Separation**: The LLM **never** decides or overrides mathematical career scores, financial viability formulas, or ranking weights. All ranking is strictly derived by Himanshu's Decision Engine ($S_{\text{fit}}, F_{\text{fit}}, M_{\text{fit}}, L_{\text{fit}}, \text{Family Alignment}$).
2. **Strict Grounding (Anti-Hallucination)**: The LLM is restricted to citing facts, colleges, scholarships, salary bands, and entrance exams present in the verified **Career Knowledge Base** (`database/seeds/careers.json`) and macro sources (`DATA_SOURCES.md`).
3. **Dual Audience Tone Adaptation**: The LLM synthesizes two distinct emotional and cognitive perspectives:
   - **Student View**: Inspiring, strength-based, actionable milestone roadmaps, skill clarity.
   - **Parent Reassurance View**: Respectful, ROI-conscious, risk-mitigated, addressing Indian familial financial stability and educational pathway clarity.

---

## 2. Core Prompt Contracts

### 2.1 Prompt 1: Career DNA Narrative Synthesis (`career_dna_narrative`)

* **Purpose:** Synthesizes the student's multi-dimensional RIASEC interest vector and 5-factor Aptitude profile ($[L, N, A, S, V]$) into a cohesive identity profile.
* **Input Context:**
  ```json
  {
    "studentName": "Aarav Sharma",
    "aptitude": { "logical": 92, "numerical": 88, "analytical": 95, "spatial": 72, "verbal": 68 },
    "interests": { "realistic": 45, "investigative": 95, "artistic": 30, "social": 25, "enterprising": 60, "conventional": 50 },
    "topTraits": ["Analytical Thinker", "System Builder", "Deep Investigator"]
  }
  ```
* **Output Schema:**
  ```json
  {
    "archetypeTitle": "The Deep-Tech Systems Architect",
    "executiveSummary": "Aarav possesses an elite analytical-investigative profile characterized by deep mathematical reasoning and high logical problem-solving acuity...",
    "primarySuperpowers": [
      "High deductive reasoning for complex algorithmic problems",
      "Intrinsic curiosity towards emerging technical systems"
    ],
    "optimalWorkEnvironments": [
      "High-autonomy R&D labs",
      "Advanced computational engineering teams"
    ],
    "growthAreas": [
      "Cross-functional collaborative communication and stakeholder presentation"
    ]
  }
  ```

---

### 2.2 Prompt 2: Decision Engine Recommendation Explanation (`recommendation_explanation`)

* **Purpose:** Explains *why* a specific career was recommended by breaking down the multi-factor scoring breakdown into transparent, intelligible insights.
* **Input Context:**
  - Decision Engine output ($S_{\text{fit}}, F_{\text{fit}}, M_{\text{fit}}, L_{\text{fit}}, \text{Family Score}$)
  - Canonical Career Record from `careers.json`
  - Student & Family Profile
* **Output Schema (Matching API Documentation Section 21):**
  ```json
  {
    "careerId": "ai_ml_engineer",
    "careerName": "AI & Machine Learning Engineer",
    "overallFitScore": 91.4,
    "whyRecommended": "Your analytical aptitude (95/100) and investigative interest (95/100) place you in the top tier for AI system architecture, matched by a rapid 97/100 national hiring velocity.",
    "strengths": [
      "Exceptional alignment with mathematical and analytical requirements",
      "Robust national market hiring velocity across Bangalore and Hyderabad tech hubs",
      "Tier-1 govt college affordability within family educational budget"
    ],
    "concerns": [
      "Private Tier-1 universities exceed current self-funded budget without merit scholarships"
    ],
    "fitBreakdownNarrative": {
      "studentFit": "Strong cognitive synergy with core algorithmic skills.",
      "financialFit": "Highly viable via IIT/NIT subsidized tiers (₹6.5L - ₹10.5L) or Reliance scholarships.",
      "marketFit": "AI roles hold a 97 hiring velocity with 45% YoY talent demand in Indian GCCs.",
      "locationFit": "Top opportunities clustered in Bangalore (98/100) and Hyderabad (92/100)."
    }
  }
  ```

---

### 2.3 Prompt 3: Parent Reassurance & Family Alignment (`parent_reassurance`)

* **Purpose:** Translates career pathways into culturally conscious, respectful financial and stability explanations for Indian parents.
* **Input Context:**
  - Parent financial budget (`income_range`, `education_budget`)
  - Parent priority factors (Stability, Salary, Risk, Prestige)
  - Career risk level, salary progression (Entry, Mid, Senior), and entrance exams
* **Output Schema:**
  ```json
  {
    "careerId": "ai_ml_engineer",
    "executiveSummary": "This career offers exceptional long-term stability and high earning potential in India's top technology hubs.",
    "financialRoadmap": {
      "budgetStatus": "Within Budget (Govt Tier) / Scholarship Eligible (Private Tier)",
      "estimatedCostRange": "₹6.5 Lakhs – ₹10.5 Lakhs (Govt) to ₹24 Lakhs (Private)",
      "scholarshipMitigation": "Eligible for Central Sector Scheme and Reliance Foundation Scholarship (₹2 Lakhs)."
    },
    "careerStabilityAndROI": {
      "entrySalaryExpectation": "₹9.5 LPA – ₹16 LPA",
      "midCareerPotential": "₹24 LPA – ₹38 LPA",
      "industryDemand": "Ranked among India's highest growth sectors with 2,100+ Global Capability Centers hiring."
    },
    "riskMitigationStrategy": "Foundational computer science degrees preserve career mobility into cloud, software, or data engineering if market conditions shift."
  }
  ```

---

### 2.4 Prompt 4: Skill-Gap & 3-Year Actionable Milestone Roadmap (`skill_gap_roadmap`)

* **Purpose:** Generates a structured 36-month execution roadmap to bridge identified skill gaps.
* **Input Context:**
  - Verified skills required by target career
  - Student's current verified / self-assessed skill levels
* **Output Schema:**
  ```json
  {
    "careerId": "ai_ml_engineer",
    "criticalGaps": [
      {
        "skillId": "deep_learning",
        "name": "Deep Learning & Neural Networks",
        "currentLevel": 20,
        "requiredLevel": 85,
        "urgency": "high"
      }
    ],
    "milestonePlan": [
      {
        "phase": "Months 0–6: Foundations & Mathematical Modeling",
        "targetSkills": ["python", "data_structures", "mathematical_modeling"],
        "actionItems": [
          "Master Python object-oriented programming and NumPy/Pandas",
          "Complete linear algebra and multivariate calculus fundamentals"
        ],
        "checkpoint": "Build 2 data manipulation projects and solve 50 core algorithmic problems."
      },
      {
        "phase": "Months 6–18: Core Machine Learning & Model Pipelines",
        "targetSkills": ["machine_learning", "sql_databases"],
        "actionItems": [
          "Implement regression, decision trees, and ensemble methods using Scikit-Learn",
          "Deploy relational databases and build data ingestion pipelines"
        ],
        "checkpoint": "Participate in Kaggle / community hackathons and deploy an end-to-end ML API."
      },
      {
        "phase": "Months 18–36: Advanced Deep Learning & Systems Deployment",
        "targetSkills": ["deep_learning", "cloud_computing"],
        "actionItems": [
          "Train neural architectures in PyTorch (CNNs, Transformers)",
          "Deploy containerized inference models on cloud infrastructure"
        ],
        "checkpoint": "Complete capstone open-source project and secure an engineering internship."
      }
    ]
  }
  ```

---

## 3. Anti-Hallucination & Grounding Guardrails

All prompt templates must enforce the following system instructions:

1. **Deterministic Grounding**: Citing salary ranges outside the `salaryRange` object provided in context is strictly prohibited.
2. **Standardized Exam List**: Entrance exams must strictly match accredited Indian authorities (NTA JEE, BITSAT, UCEED, GATE, NEET).
3. **No Phantom Institutions**: The LLM must not invent unaccredited colleges or non-existent government quota schemes.
4. **Offline Fallback Guarantee**: If the LLM provider fails, the backend switches instantly to the deterministic template builder with zero service degradation.
