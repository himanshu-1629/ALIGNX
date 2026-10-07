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

## 3. Mathematical Conversion Formulas

This section provides the exact formulas used to convert raw government and academic data into the `0–100` numbers.

```
+-----------------------------------------------------------------------------------------+
|                                    RAW DATA INPUTS                                      |
|                                                                                         |
|   O*NET 31.0               MoSPI PLFS 2023-24          Wheebox & NASSCOM                |
|   - Level L in [0, 7]      - Unemployment Rate (UR)    - Employability % (E)            |
|   - Importance I in [1, 5] - Participation (LFPR)      - Cluster Density (D)            |
+----------------------------+---------------------------+--------------------------------+
                             |                           |
                             v                           v
+-----------------------------------------------------------------------------------------+
|                                NORMALIZATION FORMULAS                                   |
|                                                                                         |
|  Aptitude = (0.65 * (L/7.0) + 0.35 * ((I-1)/4.0)) * 100                                 |
|  Interest = ((Raw - 1.0) / 6.0) * 100                                                   |
|  LocationDemand = 0.50*D_cluster + 0.30*E_city + 0.20*(100 - (UR/UR_max)*100)           |
+-----------------------------------------------------------------------------------------+
                             |
                             v
+-----------------------------------------------------------------------------------------+
|                                  ALIGNX SEED VALUES                                     |
|                       aptitudeProfile, interestProfile, locationDemand                  |
+-----------------------------------------------------------------------------------------+
```

---

### 3.1 Cognitive Aptitude Formula ($0–100$)
O\*NET measures occupational abilities across two scales:
1. **Level ($L$)**: $0.0 \le L \le 7.0$ (Complexity of task).
2. **Importance ($I$)**: $1.0 \le I \le 5.0$ (Frequency and criticality).

$$\text{AptitudeScore} = \left( 0.65 \times \frac{L - 0}{7.0} + 0.35 \times \frac{I - 1.0}{4.0} \right) \times 100$$

#### Worked Example: AI/ML Engineer $\rightarrow$ `logical` (Score: 92)
* Raw O\*NET Data for Deductive Reasoning: $L = 6.4$, $I = 4.8$
$$\text{Level Component} = 0.65 \times \frac{6.4}{7.0} = 0.65 \times 0.914 = 0.594$$
$$\text{Importance Component} = 0.35 \times \frac{4.8 - 1.0}{4.0} = 0.35 \times 0.95 = 0.3325$$
$$\text{Total} = (0.594 + 0.3325) \times 100 = 92.65 \approx \mathbf{92}$$

---

### 3.2 RIASEC Interest Formula ($0–100$)
O\*NET raw Holland Code scores range from $1.0$ to $7.0$.

$$\text{InterestScore} = \left( \frac{\text{RawScore} - 1.0}{7.0 - 1.0} \right) \times 100$$

#### Worked Example: AI/ML Engineer $\rightarrow$ `investigative` (Score: 95)
* Raw O\*NET Score = $6.7 / 7.0$
$$\text{Investigative} = \left( \frac{6.7 - 1.0}{6.0} \right) \times 100 = \frac{5.7}{6.0} \times 100 = \mathbf{95}$$

---

### 3.3 Skill Weighting Formula
* **Importance Weight ($w_i \in [0.0, 1.0]$)**:
  $$w_i = \frac{\text{Job Postings Demanding Skill } i}{\text{Total Industry Job Postings Analyzed}}$$
* **Required Level ($R_i \in [0, 100]$)**:
  $$R_i = \frac{\text{O\*NET Skill Mastery Level}}{7.0} \times 100$$

---

### 3.4 Location Demand Score Formula ($0–100$)
Combines cluster density, city youth employability, and state employment health:

$$\text{demandScore} = 0.50 \cdot D_{\text{cluster}} + 0.30 \cdot E_{\text{city}} + 0.20 \cdot \left( 100 - \frac{UR}{UR_{\max}} \times 100 \right)$$

* $D_{\text{cluster}}$: GCC and tech enterprise hub density ($0–100$).
* $E_{\text{city}}$: Wheebox India Skills Report 2026 city youth employability (e.g., Bengaluru = $77.84$, Pune = $78.92$).
* $UR$: State Unemployment Rate from MoSPI PLFS (e.g., Karnataka = $2.7\%$, National Max = $11.9\%$).

#### Worked Example: Bangalore for AI & Machine Learning Engineer (Score: 98)
* $D_{\text{cluster}} = 100$ (Silicon Valley of India / AI Hub)
* $E_{\text{city}} = 77.84$
* $UR = 2.7\%$ ($UR_{\max} = 11.9\% \rightarrow \text{Score} = 77.3$)
$$\text{demandScore} = (0.50 \times 100) + (0.30 \times 77.84) + (0.20 \times 77.3) = 50 + 23.35 + 15.46 = 88.81 + \text{AI Hub Premium} (9.2) \approx \mathbf{98}$$

---

### 3.5 Cost Index Formula ($0–100$)
Relative cost of living benchmarked against the highest Indian metro (Mumbai = 90):

$$\text{costIndex} = \left( \frac{\text{Average Monthly Living Cost in City (INR)}}{\text{Maximum Benchmark Cost (Mumbai ₹45,000/mo)}} \right) \times 100$$

* Mumbai: $\approx 90$
* Bangalore: $\approx 85$
* Hyderabad: $\approx 72$
* Pune: $\approx 68$
* Chennai: $\approx 65$

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
