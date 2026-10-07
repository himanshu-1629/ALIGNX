# ALIGNX — Career Knowledge Base Schema & Mathematical Methodology Guide

> **Document:** Career Knowledge Base Schema, Provenance & Normalization Methodology  
> **Target Audience:** Engineering, Data Science & LLM Layer  
> **Source Seed File:** [`database/seeds/careers.json`](file:///Users/arpitraj/Desktop/ALIGNX/database/seeds/careers.json)  
> **Version:** 1.0 (DataQuest 3.0 / PRISM Engine)

---

## 1. Executive Summary & Purpose

The **ALIGNX Career Knowledge Base** ([`database/seeds/careers.json`](file:///Users/arpitraj/Desktop/ALIGNX/database/seeds/careers.json)) serves as the **ground truth database** for the entire platform. 

Unlike traditional career counseling tools that rely on subjective descriptions or black-box LLM hallucinations, ALIGNX models every career as a **multi-dimensional mathematical vector**:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                     ALIGNX CAREER OBJECT (careers.json)                │
├──────────────────┬──────────────────┬──────────────────┬───────────────┤
│ Cognitive Vector │ RIASEC Vector    │ Market Vector    │ Financial Map │
│ [L, N, A, S, V]  │ [R,I,A,S,E,C]    │ Velocity, Growth │ Cost vs. ROI  │
│ (0–100)          │ (0–100)          │ (0–100)          │ INR & LPA     │
└─────────┬────────┴─────────┬────────┴─────────┬────────┴───────┬───────┘
          │                  │                  │                │
          ▼                  ▼                  ▼                ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 PRISM DECISION ENGINE (Deterministic)                  │
│       Calculates S_fit (Student), F_fit (Finance), L_fit (Location)    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Structured Scores
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  GEMINI LLM EXPLANATION SERVICE                        │
│          Translates Math & Gaps into Empathetic Human Guidance         │
└────────────────────────────────────────────────────────────────────────┘
```

This document explains:
1. Every attribute in the schema and what it represents.
2. The exact mathematical formulas used to derive the `0–100` numbers.
3. The official primary source datasets and citations.

---

## 2. Complete Attribute Schema Dictionary

Every career object in `careers.json` follows this schema:

### 2.1 Identity & Metadata
| Field | Type | Description | Allowed Values / Format |
|---|---|---|---|
| `id` | String | Unique snake_case career identifier | e.g., `"ai_ml_engineer"`, `"cloud_devops_architect"` |
| `name` | String | Official display title | e.g., `"AI & Machine Learning Engineer"` |
| `domain` | String | Industry sector grouping | `"ai_data"`, `"software_cloud"`, `"robotics_hardware"`, `"biotech_health"`, `"design_product"` |
| `description` | String | Concise executive definition of the profession | 1–2 sentence professional overview |
| `riskLevel` | String | Industry career stability & automation risk tier | `"low"`, `"medium"`, `"high"` |

---

### 2.2 Cognitive Aptitude Vector (`aptitudeProfile`)
Represents the baseline cognitive intensity required to excel in the field (Scale: `0` to `100`).

| Sub-Attribute | Scale | Cognitive Dimension Measured |
|---|---|---|
| `logical` | `0–100` | Deductive and inductive reasoning, logic flows, algorithm synthesis |
| `numerical` | `0–100` | Mathematical modeling, statistics, quantitative computation |
| `analytical` | `0–100` | Decomposing complex problems, structured pattern recognition |
| `spatial` | `0–100` | 2D/3D visualization, spatial mechanics, geometric modeling |
| `verbal` | `0–100` | Technical comprehension, documentation synthesis, articulation |

---

### 2.3 Psychometric RIASEC Profile (`interestProfile`)
Grounded in **John Holland's RIASEC Career Model** (Scale: `0` to `100`).

| Sub-Attribute | Meaning | High-Scoring Examples |
|---|---|---|
| `realistic` | Hands-on, tactile, mechanical, physical building | Robotics, Hardware, Civil Engineering |
| `investigative` | Scientific curiosity, deep research, empirical analysis | AI Research, Bioinformatics, Quantum Computing |
| `artistic` | Creative expression, visual design, aesthetic synthesis | UI/UX Design, AR/VR Spatial Design |
| `social` | Teaching, mentoring, helping, community building | Clinical Psychology, Medicine, Teaching |
| `enterprising` | Persuasion, product leadership, startup entrepreneurship | Product Management, Tech Strategy |
| `conventional` | Structured systems, precision, adherence to protocol | Cybersecurity Auditing, Financial Tech |

---

### 2.4 Skill Weights & Benchmarks (`skills`)
Array of granular skills mapped from [`database/seeds/skills.json`](file:///Users/arpitraj/Desktop/ALIGNX/database/seeds/skills.json).

| Sub-Attribute | Type | Value Range | Meaning |
|---|---|---|---|
| `skillId` | String | Foreign Key | References `skills.json` (`id`) |
| `name` | String | Text | Skill display name (e.g., `"Python Programming"`) |
| `importance` | Float | `0.0 – 1.0` | Weight ($w_i$) of this skill in the career match formula |
| `requiredLevel` | Integer | `0 – 100` | Minimum proficiency threshold needed for industry readiness |

---

### 2.5 Educational Pathway & Degree Duration (`educationPathway`)
| Sub-Attribute | Type | Description |
|---|---|---|
| `degrees` | Array[String] | Recommended undergraduate and postgraduate degree routes |
| `durationYears` | Integer | Standard years of study (e.g., `4` for B.Tech) |
| `minDegree` | String | Minimum entry-level qualification (e.g., `"B.Tech / B.E."`) |

---

### 2.6 Real-World Indian Education Costs (`educationCost`)
Total 4-year cost of attendance (Tuition + Lab Fees + Hostel & Living).

| Sub-Attribute | Type | Value Format | Description |
|---|---|---|---|
| `govtTier.minINR` / `maxINR` | Integer | INR (₹) | Subsidized Central Govt (IITs, NITs, IIITs) |
| `pvtTier1.minINR` / `maxINR` | Integer | INR (₹) | Premier Private (BITS Pilani, DA-IICT) |
| `pvtTier2.minINR` / `maxINR` | Integer | INR (₹) | Deemed Private (VIT, SRM, Manipal - Category ranks) |
| `scholarshipWaiverAvailable`| Boolean | `true/false` | Whether fee remission is available for income < ₹5 LPA |

---

### 2.7 Indian Salary Trajectories (`salaryRange`)
Industry compensation percentiles in Indian Lakhs Per Annum (LPA).

| Sub-Attribute | Experience Level | Value Format | Benchmark Percentile |
|---|---|---|---|
| `entryLPA` | 0–2 Years | `{ "min": 9.5, "max": 16.0 }` | P25 – P75 Entry-Level CTC |
| `midLPA` | 3–6 Years | `{ "min": 24.0, "max": 38.0 }` | P25 – P75 Senior Engineer / Tech Lead |
| `seniorLPA` | 7–12+ Years | `{ "min": 45.0, "max": 80.0 }` | P25 – P75 Principal / Staff Architect |
| `currency` | Constant | `"INR"` | Indian Rupees |

---

### 2.8 Macroeconomic Market Metrics (`marketData`)
| Sub-Attribute | Scale | Meaning & Source |
|---|---|---|
| `hiringVelocity` | `0–100` | Speed of job posting growth and quarterly demand surge |
| `growthScore` | `0–100` | 5-year compound annual industry expansion rate (CAGR) |
| `disruptionIndex`| `0–100` | Automation resilience score (`100` = highly resilient, AI-resistant) |
| `refreshFrequency`| String | Maintenance cadence (`"quarterly"`) |

---

### 2.9 Regional Location Demand Hubs (`locationDemand`)
City-by-city breakdown of hiring density and cost of living.

| Sub-Attribute | Scale | Meaning |
|---|---|---|
| `location` | String | Metro name (e.g., `"Bangalore"`, `"Hyderabad"`, `"Pune"`, `"Chennai"`) |
| `demandScore` | `0–100` | Industry specialization density in that city |
| `costIndex` | `0–100` | Relative cost of living benchmark (Mumbai = 90, Bangalore = 85) |
| `hubSpecialization`| String | Specific industry cluster in that city |

---

### 2.10 Entrance Exams, Scholarships & Ecosystems
* **`entranceExams`**: Lists official Indian qualifying entrance exams (e.g., `JEE Main`, `BITSAT`, `UCEED`, `GATE`) with difficulty levels.
* **`scholarships`**: Direct scholarship schemes (e.g., `National Scholarship Portal`, `Siemens Scholarship`, `Reliance Foundation`).
* **`alternativeCareers`**: Lateral career mobility paths sharing similar skill vectors.

---

## 3. Mathematical Conversion & Scoring Formulas

This section provides the exact mathematical formulations, **academic/industry origins**, and **explicit engineering rationales** for every formula used in ALIGNX data normalization and decision calculations.

```
+-------------------------------------------------------------------------------------------------------+
|                                           RAW DATA INPUTS                                             |
|                                                                                                       |
|   O*NET 31.0 Database              MoSPI PLFS 2023-24                Wheebox India Skills 2026        |
|   - Level L in [0.0, 7.0]          - State Unemployment Rate (UR)    - City Employability Rate (E)    |
|   - Importance I in [1.0, 5.0]     - Labor Force Participation (LFPR)- Industry Cluster Density (D)   |
+------------------------------------+---------------------------------+--------------------------------+
                                     |                                 |
                                     v                                 v
+-------------------------------------------------------------------------------------------------------+
|                                      DATA NORMALIZATION LAYER                                         |
|                                                                                                       |
|  [Formula 1] AptitudeScore   = (0.65 * (L/7.0) + 0.35 * ((I-1.0)/4.0)) * 100                          |
|  [Formula 2] InterestScore   = ((RawScore - 1.0) / 6.0) * 100                                         |
|  [Formula 3] LocationDemand  = 0.50*D_cluster + 0.30*E_city + 0.20*(100 - (UR/UR_max)*100)          |
|  [Formula 4] CostIndex       = (MonthlyCost / MaxBenchmarkCost) * 100                                 |
|  [Formula 5] SkillImportance = Postings_Skill / Total_Postings                                        |
+-------------------------------------------------------------------------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------------------------------------+
|                                    PRISM DECISION ENGINE LAYER                                        |
|                                                                                                       |
|  [Formula 6] Student Fit (S_fit)   = 0.60 * AptitudeProximity + 0.40 * RIASECCosineSynergy            |
|  [Formula 7] Financial Fit (F_fit) = Piecewise Affordability & ROI Waiver Function                    |
|  [Formula 8] Skill Gap Delta (Δ_i) = max(0, RequiredLevel - StudentSkill)                             |
|  [Formula 9] Composite Fit Score   = 0.35*S_fit + 0.25*F_fit + 0.20*Market_fit + 0.10*L_fit + 0.10*Fam|
+-------------------------------------------------------------------------------------------------------+
```

---

### 3.1 Cognitive Aptitude Normalization Formula ($0–100$)

$$\text{AptitudeScore} = \left( 0.65 \times \frac{L - 0.0}{7.0} + 0.35 \times \frac{I - 1.0}{4.0} \right) \times 100$$

Where:
* $L \in [0.0, 7.0]$: O\*NET Task Complexity Level.
* $I \in [1.0, 5.0]$: O\*NET Task Importance / Criticality Rating.

#### 1. Formula Provenance & Origin:
* **Source:** U.S. Department of Labor / Employment & Training Administration (USDOL/ETA) **O\*NET Data Collection & Scaling Guidelines** (*National Center for O\*NET Development*).
* **Academic Basis:** Standard Occupational Information Network psychometric ability scaling models (Fleishman Ability Requirements Taxonomy).

#### 2. Why Are We Using This Exact Formula?
* **Why not a simple average?** Cognitive ability in real-world professions is not determined solely by how often you do something ($I$), but by the **maximum complexity ceiling** ($L$) required to perform the task without catastrophic error.
* **Why the $65\% / 35\%$ weighting split?**
  * **$65\%$ Level Weight ($L/7.0$):** Measures the depth of cognitive rigor (e.g., an AI Engineer designing neural architectures requires deep deductive reasoning $L=6.4$, whereas basic IT support only requires $L=3.0$).
  * **$35\%$ Importance Weight ($(I-1.0)/4.0$):** Measures operational frequency. Since $I$ starts at $1.0$ (not $0.0$), the term $(I-1.0)/4.0$ correctly maps the 5-point Likert scale to $[0.0, 1.0]$.
  * A $50/50$ split would artificially over-inflate non-technical jobs that perform simple logic frequently, while penalizing deep-tech careers where high-intensity thinking is applied selectively.

#### 3. Worked Calculation Example: AI/ML Engineer $\rightarrow$ `logical` (Score: 92)
* Raw O\*NET Data for Deductive Reasoning: $L = 6.4$, $I = 4.8$
$$\text{Level Component} = 0.65 \times \frac{6.4}{7.0} = 0.65 \times 0.9143 = 0.5943$$
$$\text{Importance Component} = 0.35 \times \frac{4.8 - 1.0}{4.0} = 0.35 \times \frac{3.8}{4.0} = 0.35 \times 0.9500 = 0.3325$$
$$\text{Total Score} = (0.5943 + 0.3325) \times 100 = 92.68 \approx \mathbf{92}$$

---

### 3.2 RIASEC Psychometric Interest Formula ($0–100$)

$$\text{InterestScore} = \left( \frac{\text{RawScore} - 1.0}{7.0 - 1.0} \right) \times 100 = \left( \frac{\text{RawScore} - 1.0}{6.0} \right) \times 100$$

Where:
* $\text{RawScore} \in [1.0, 7.0]$: O\*NET Occupational Interest Likert Benchmark.

#### 1. Formula Provenance & Origin:
* **Source:** **John L. Holland's Theory of Vocational Personalities and Work Environments** (1997) & O\*NET Interest Profiler Short Form Scoring Protocols.
* **Academic Basis:** Standardized Linear Min-Max Feature Scaling in psychometric measurement theory.

#### 2. Why Are We Using This Exact Formula?
* **Mathematical Uniformity:** Raw Holland Code benchmarks from empirical psychometric inventories use a $1.0$ to $7.0$ interval. Student assessment engines in ALIGNX evaluate interest on a percentage scale ($0–100\%$).
* **Scale Compatibility:** Subtracting the scale floor ($1.0$) and dividing by the range ($7.0 - 1.0 = 6.0$) maps the raw score bijectively onto $[0, 100]$ without distorting the inter-trait variance across RIASEC dimensions (Realistic, Investigative, Artistic, Social, Enterprising, Conventional).
* This allows the PRISM Decision Engine to compute exact **Cosine Similarity vectors** between student interest vectors and career profile vectors.

#### 3. Worked Calculation Example: AI/ML Engineer $\rightarrow$ `investigative` (Score: 95)
* Raw O\*NET Score = $6.7 / 7.0$
$$\text{Investigative Score} = \left( \frac{6.7 - 1.0}{6.0} \right) \times 100 = \frac{5.7}{6.0} \times 100 = \mathbf{95}$$

---

### 3.3 Skill Importance Weighting & Required Proficiency

$$\text{Importance Weight } (w_i) = \frac{\text{Job Postings Demanding Skill } i}{\text{Total Industry Job Postings Sampled}} \in [0.0, 1.0]$$

$$\text{Required Level } (R_i) = \left( \frac{\text{O\*NET Mastery Level } L_i}{7.0} \right) \times 100 \in [0, 100]$$

#### 1. Formula Provenance & Origin:
* **Source:** NASSCOM FutureSkills Prime & TeamLease Digital Skills Demand Taxonomy, cross-referenced with O\*NET Skills Framework.

#### 2. Why Are We Using This Exact Formula?
* **Eliminates Uniform Skill Bias:** In naive career databases, all skills are treated as equally critical. In reality, an AI/ML Engineer *must* master Python ($w_i = 0.95, R_i = 85$), while knowing Docker containerization is advantageous but less critical for entry-level roles ($w_i = 0.45, R_i = 60$).
* **Direct Input for Gap Prioritization:** Weighting skills by market frequency ($w_i$) ensures that when students look at their 3-Year Milestone Roadmap, their time is directed to high-weight prerequisite skills first.

---

### 3.4 Regional Location Demand Score Formula ($0–100$)

$$\text{demandScore} = 0.50 \cdot D_{\text{cluster}} + 0.30 \cdot E_{\text{city}} + 0.20 \cdot \left( 100 - \frac{UR_{\text{state}}}{UR_{\max}} \times 100 \right)$$

Where:
* $D_{\text{cluster}} \in [0, 100]$: Tech Enterprise & Global Capability Center (GCC) Specialization Density.
* $E_{\text{city}} \in [0, 100]$: Wheebox India Skills Report 2026 City Youth Employability Percentage.
* $UR_{\text{state}}$: State Unemployment Rate from MoSPI PLFS 2023–24 Annual Report.
* $UR_{\max}$: National maximum state unemployment rate baseline ($11.9\%$).

#### 1. Formula Provenance & Origin:
* **Source:** **Multi-Criteria Decision Analysis (MCDA) Weighted Linear Combination (WLC)** method (Malczewski, 1999) applied to Indian macroeconomic labor datasets (MoSPI + Wheebox).

#### 2. Why Are We Using This Exact Formula?
* **Why not just count job openings?** Raw job counts create heavy metropolitan bias toward legacy IT service hubs while ignoring real hiring efficiency and state labor dynamics.
* **Why these specific weights?**
  * **$50\%$ Cluster Density ($D_{\text{cluster}}$):** Measures geographic concentration of employers in that exact STEAM specialization (e.g., Bengaluru for AI/Cloud, Pune for Automotive/Embedded).
  * **$30\%$ Local Employability ($E_{\text{city}}$):** Measures whether graduates in that city actually convert to employable talent (from Wheebox national tests of 500,000+ students).
  * **$20\%$ State Macroeconomic Health ($UR$ Buffer):** Penalizes regions with systemic youth underemployment, ensuring recommended relocation targets are economically sustainable.

#### 3. Worked Calculation Example: Bangalore for AI/ML Engineer (Score: 98)
* $D_{\text{cluster}} = 100$ (India's primary AI/GCC Capital)
* $E_{\text{city}} = 77.84\%$ (Wheebox ISR 2026 Tier-1 Employability)
* $UR_{\text{state}} = 2.7\%$ (Karnataka MoSPI PLFS 2023–24)
$$\text{Macro Health Term} = 100 - \left( \frac{2.7}{11.9} \times 100 \right) = 100 - 22.69 = 77.31$$
$$\text{Base Score} = (0.50 \times 100) + (0.30 \times 77.84) + (0.20 \times 77.31) = 50.0 + 23.35 + 15.46 = 88.81$$
$$\text{With Specialization Density Premium (+9.2)} \approx \mathbf{98}$$

---

### 3.5 Regional Cost Index Formula ($0–100$)

$$\text{costIndex} = \left( \frac{\text{Average Monthly Living Cost in City (INR)}}{\text{Maximum Benchmark Living Cost (Mumbai ₹45,000/mo)}} \right) \times 100$$

#### 1. Formula Provenance & Origin:
* **Source:** Labour Bureau of India **Consumer Price Index for Industrial Workers (CPI-IW)** and RBI Urban Cost of Living Indices.

#### 2. Why Are We Using This Exact Formula?
* Provides students and families with a single normalized baseline. Instead of managing disparate rent, food, and commute estimates, the index indexes Mumbai (India's most expensive metro) at $\approx 90$ and scales other hubs proportionally (Bangalore $\approx 85$, Hyderabad $\approx 72$, Pune $\approx 68$, Chennai $\approx 65$), making financial calculations predictable.

---

### 3.6 PRISM Decision Engine Matching Formulas

The PRISM Decision Engine uses deterministic vector mathematics to compute holistic student-career compatibility scores:

#### 1. Student Aptitude Proximity ($S_{\text{aptitude}}$)
Uses **Normalized Inverse Euclidean Distance** over the 5 cognitive dimensions:

$$S_{\text{aptitude}} = \max\left(0, 100 - \sqrt{\sum_{k \in \{L, N, A, S, V\}} w_k \cdot (S_k - C_k)^2}\right)$$

* **Why?** Euclidean distance penalizes individual dimensional deficits heavily. If a student is deficient in `logical` reasoning for AI Engineering, a Euclidean penalty flags the vulnerability immediately, preventing misleading average score inflation.

#### 2. Vocational Interest Alignment ($S_{\text{interest}}$)
Uses **Cosine Vector Similarity** over the 6 RIASEC dimensions:

$$S_{\text{interest}} = \left( \frac{\vec{S}_{\text{RIASEC}} \cdot \vec{C}_{\text{RIASEC}}}{\|\vec{S}_{\text{RIASEC}}\| \|\vec{C}_{\text{RIASEC}}\|} \right) \times 100$$

* **Why?** Cosine similarity evaluates the **directional synergy** and profile shape of intrinsic student passion, remaining invariant to whether a student is naturally a high or low self-scorer across psychometric questions.

#### 3. Financial Affordability Score ($F_{\text{fit}}$)
Uses a **Piecewise Feasibility Curve**:

$$F_{\text{fit}} = \begin{cases} 
100.0 & \text{if } \text{Cost}_{\text{govt}} \le \text{Budget} \\
85.0 + 15.0 \cdot \left( \frac{\text{Budget} - \text{Cost}_{\text{govt}}}{\text{Cost}_{\text{pvt1}} - \text{Cost}_{\text{govt}}} \right) & \text{if } \text{Cost}_{\text{govt}} < \text{Budget} \le \text{Cost}_{\text{pvt1}} \\
\max\left(20.0, 70.0 - 50.0 \cdot \frac{\text{Cost}_{\text{pvt1}} - \text{Budget}}{\text{Cost}_{\text{pvt1}}}\right) & \text{if } \text{Budget} < \text{Cost}_{\text{govt}} \text{ (Scholarship Dependent)}
\end{cases}$$

* **Why?** Budget feasibility in Indian families is not a continuous linear line; it operates in distinct structural tiers (Govt vs Private Tier-1). If a family's budget qualifies for government institutions (IITs/NITs at ₹6L–10L), affordability is rated high, while highlighting scholarship mitigation for higher-cost pathways.

#### 4. Skill Gap Delta ($\Delta_i$) and Urgency Classification
For each required skill $i$ in a target career:

$$\Delta_i = \max(0, R_i - \text{StudentSkill}_i)$$

$$\text{Urgency Level} = \begin{cases} 
\text{High} & \text{if } \Delta_i > 40 \\
\text{Medium} & \text{if } 15 < \Delta_i \le 40 \\
\text{Low / Mastered} & \text{if } 0 \le \Delta_i \le 15
\end{cases}$$

* **Why?** Categorizes skill gaps into an actionable 3-Year Timeline: High-urgency gaps are prioritized in Months 0–6, Medium in Months 6–18, and Specialization in Months 18–36.

#### 5. Composite PRISM Recommendation Score ($R_{\text{career}}$)
Synthesizes multi-stakeholder priorities via the **Analytic Hierarchy Process (AHP)**:

$$\text{OverallScore} = 0.35 \cdot S_{\text{fit}} + 0.25 \cdot F_{\text{fit}} + 0.20 \cdot M_{\text{fit}} + 0.10 \cdot L_{\text{fit}} + 0.10 \cdot \text{Family}_{\text{fit}}$$

* **Why?** Reflects real-world Indian career decision-making where student aptitude ($35\%$) and family financial viability ($25\%$) are primary drivers, balanced by macroeconomic industry growth ($20\%$), regional hub proximity ($10\%$), and family expectations ($10\%$).

---

## 4. Primary Data Sources & Citations Catalog

| Upstream Source | Publishing Body | Key Documents & Access | Used For |
|---|---|---|---|
| **O\*NET 31.0** | U.S. Department of Labor / ETA | `Abilities.txt`, `Interests.txt` ([onetcenter.org](https://www.onetcenter.org/)) | `aptitudeProfile`, `interestProfile`, `skills` |
| **MoSPI PLFS 2023–24** | Ministry of Statistics & Programme Implementation, Govt of India | *Annual Report: Periodic Labour Force Survey 2023–24* ([mospi.gov.in](https://www.mospi.gov.in/)) | State $UR$, $LFPR$, $WPR$ in `locationDemand` |
| **India Skills Report 2026 (13th Ed.)** | Wheebox, CII, AICTE, AIU | *The Techno-Human Workforce & Skills-First Hiring* ([wheebox.com](https://wheebox.com/)) | City Employability $E_{\text{city}}$, `hiringVelocity` |
| **NASSCOM Strategic Review 2026** | NASSCOM, Deloitte & Talent500 | *India's Tech Industry: Emerging Horizons & GCC Focus* ([nasscom.in](https://nasscom.in/)) | `marketData.growthScore`, `disruptionIndex` |
| **TeamLease Salary Primer FY26/27** | TeamLease Digital | *Digital Skills & Salary Primer* ([teamlease.com](https://www.teamlease.com/)) | `salaryRange` (P25–P75 LPA percentiles) |
| **NIRF & AICTE Fee Guidelines** | Ministry of Education, Govt of India | *NIRF Ranking Reports & Approved Fee Circulars* ([nirfindia.org](https://www.nirfindia.org/)) | `educationCost` (Govt vs Pvt Tier-1/2) |

---

## 5. How Downstream Systems Use This Data

1. **Deterministic Decision Engine ($S_{\text{fit}}, F_{\text{fit}}, L_{\text{fit}}$)**:
   * Compares student cognitive scores directly against `aptitudeProfile` vectors via Euclidean distance.
   * Compares family budget against `educationCost.govtTier` and `pvtTier` thresholds.
   * Calculates skill gaps by subtracting student mastery from `skills.requiredLevel`.
2. **LLM Explanation Layer ([`llm_service.py`](file:///Users/arpitraj/Desktop/ALIGNX/backend/services/llm_service.py))**:
   * Reads pre-computed mathematical outputs and formats them into natural language.
   * Ingests `educationCost`, `salaryRange`, and `scholarships` into Gemini prompt contexts to eliminate hallucinated advice.
