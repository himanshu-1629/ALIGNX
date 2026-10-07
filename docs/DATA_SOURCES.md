# ALIGNX — Data Provenance & Source Citations

> **Document:** Data Sources & Provenance  
> **Owner:** Arpit (Data & LLM Layer)  
> **Version:** 1.0 (DataQuest 3.0 / PRISM Engine)

---

## 1. Executive Summary

This document establishes the official data provenance for all attributes in the **ALIGNX Career Knowledge Base** (`database/seeds/careers.json`). Every numerical vector, cost band, salary tier, and market metric is grounded in verified, real-world primary sources and authoritative public datasets.

---

## 2. Upstream Data Sources & Formal Citations

### 2.1 Psychometric & Cognitive Aptitude Ground Truth
* **Source:** **O\*NET 31.0 Database** (U.S. Department of Labor / Employment and Training Administration)
* **Citation:** U.S. Department of Labor. (2026). *Occupational Information Network (O\*NET) Database Release 31.0*. [onetcenter.org](https://www.onetcenter.org/)
* **License:** Creative Commons Attribution 4.0 International (CC BY 4.0)
* **Files Used:**
  * `Interests.txt` — Standardized RIASEC dimensions (*Realistic, Investigative, Artistic, Social, Enterprising, Conventional*).
  * `Abilities.txt` — Cognitive Ability ratings (*Deductive & Inductive Reasoning, Mathematical Reasoning, Number Facility, Spatial Orientation, Verbal Comprehension*).
* **Mapping in ALIGNX:** 
  * Directly populates `aptitudeProfile` ($[L, N, A, S, V]$ normalized $0\text{–}100$) and `interestProfile` ($[R, I, A, S, E, C]$ normalized $0\text{–}100$) for Himanshu's Decision Engine ($S_{\text{fit}}$).

---

### 2.2 Macroeconomic & State-Level Employment Baseline
* **Source:** **Periodic Labour Force Survey (PLFS) Annual Report 2023–24**
* **Citation:** Ministry of Statistics and Programme Implementation (MoSPI), Government of India. (2024). *Annual Report: Periodic Labour Force Survey (July 2023 – June 2024)*. New Delhi: National Sample Survey Office. [mospi.gov.in](https://www.mospi.gov.in/) & [data.gov.in](https://data.gov.in/)
* **Metrics Used:**
  * State/UT-wise Labour Force Participation Rate (LFPR)
  * Worker Population Ratio (WPR)
  * Unemployment Rate (UR) across all 36 States/UTs (e.g., Karnataka LFPR 45.4%, UR 2.7%; Tamil Nadu LFPR 47.2%, UR 3.5%; Delhi LFPR 36.0%, UR 2.1%).
* **Mapping in ALIGNX:**
  * Calibrates baseline regional economic stability and state employment climate inside `locationDemand` and Location Fit ($L_{\text{fit}}$).

---

### 2.3 Indian Tech Market Hiring Velocity & AI Disruption
* **Source 1:** **NASSCOM Strategic Review & Tech Talent Reports (with Deloitte & Talent500)**
  * **Citation:** National Association of Software and Service Companies (NASSCOM). (2026). *India's Tech Industry: Resilience and Emerging Talent Horizons (AI & GCC Focus)*. [nasscom.in](https://nasscom.in/)
  * **Key Data Points:** 65% of new GCC roles require AI skills; AI/ML demand growing 45% YoY; 30%–40% wage premium for GenAI specializations; 2,100+ GCCs in India employing 2.36M professionals.
* **Source 2:** **India Skills Report 2026 (13th Edition)**
  * **Citation:** Wheebox, Confederation of Indian Industry (CII), AICTE, and AIU. (2026). *India Skills Report 2026: The Techno-Human Workforce & Skills-First Hiring*. [wheebox.com](https://wheebox.com/) & [ciiskills.in](https://ciiskills.in/)
  * **Key Data Points:** Overall youth employability at 56.35%; Computer Science employability leads at 80%, IT at 78%, Electronics at 75%, Mechanical at 63%. India holds 16% of the global AI workforce (600k+ professionals). Top employable cities: Lucknow (79.45%), Pune (78.92%), Bengaluru (77.84%), Kochi (76.56%).
* **Source 3:** **World Economic Forum (WEF) Future of Jobs Framework**
  * **Citation:** World Economic Forum. (2025/2026). *The Future of Jobs Report*. Geneva: WEF.
  * **Key Data Points:** Automation vulnerability vs. resilience indexing across technical vs. routine manual occupations.
* **Mapping in ALIGNX:**
  * Computes `marketData.hiringVelocity` ($0\text{–}100$), `marketData.growthScore` ($0\text{–}100$), and `marketData.disruptionIndex` ($0\text{–}100$) for Market Fit ($M_{\text{fit}}$).

---

### 2.4 Indian Salary Trajectories & Regional Hub Premiums
* **Source 1:** **TeamLease Digital Skills & Salary Primer FY26/FY27**
  * **Citation:** TeamLease Digital. (2026). *Digital Skills & Salary Primer: Specialization Premiums & GCC Hiring Trends*. [teamlease.com](https://www.teamlease.com/)
* **Source 2:** **AmbitionBox & Levels.fyi (India Engineering Benchmarks)**
  * **Citation:** AmbitionBox / Levels.fyi India Salary Database (2026). [ambitionbox.com](https://www.ambitionbox.com/) & [levels.fyi](https://www.levels.fyi/)
* **Source 3:** **Hugging Face Indian Job Market Dataset**
  * **Citation:** `muhammetakkurt/naukri-jobs-dataset`. Hugging Face Datasets. [huggingface.co/datasets/muhammetakkurt/naukri-jobs-dataset](https://huggingface.co/datasets/muhammetakkurt/naukri-jobs-dataset)
* **Verified Salary Bands (INR LPA):**
  * AI / ML Engineer: Entry ₹9.5L–₹14L | Mid ₹22L–₹35L | Senior ₹45L–₹75L+
  * Cloud / DevOps Architect: Entry ₹7L–₹11L | Mid ₹16L–₹26L | Senior ₹32L–₹50L
  * Robotics / Embedded Systems: Entry ₹5.5L–₹9L | Mid ₹14L–₹22L | Senior ₹28L–₹42L
  * Biotech / Bioinformatics: Entry ₹4.5L–₹7.5L | Mid ₹11L–₹18L | Senior ₹22L–₹36L
  * UI/UX Product Designer: Entry ₹6L–₹10L | Mid ₹15L–₹24L | Senior ₹28L–₹45L

---

### 2.5 Education Costs & Indian Institutional Benchmarks
* **Source:** **National Institutional Ranking Framework (NIRF) & AICTE Fee Regulatory Guidelines**
* **Citation:** Ministry of Education, Govt of India. (2025/2026). *NIRF India Rankings & Institutional Fee Schedules*. [nirfindia.org](https://www.nirfindia.org/) & [aicte-india.org](https://www.aicte-india.org/)
* **Cost Bands (Total 4-Year B.Tech/B.E. Cost of Attendance in INR):**
  * **Tier-1 Central Govt (IITs/NITs/IIITs):** ₹6.5 Lakh – ₹12 Lakh (Subsidized waivers: 100% waiver if family income < ₹1 LPA; 66% waiver for income ₹1L–₹5 LPA).
  * **Tier-1 Premium Private (BITS Pilani):** ₹25 Lakh – ₹32 Lakh.
  * **Tier-2 Private Deemed (VIT, SRM, Manipal):** ₹10 Lakh – ₹26 Lakh (Category rank-based tiers).
  * **State Government Colleges (VJTI, COEP, CEG):** ₹2.5 Lakh – ₹5 Lakh.
* **Mapping in ALIGNX:**
  * Directly evaluated by Himanshu's Financial Constraint Solver ($F_{\text{fit}}$).

---

### 2.6 Entrance Examinations & Financial Aid Discovery
* **Exams:** National Testing Agency (NTA - JEE Main/Advanced, NEET, CUET), UCEED (IIT Bombay), BITSAT, GATE.
* **Scholarships:** 
  * National Scholarship Portal ([scholarships.gov.in](https://scholarships.gov.in/)) — Central Sector Scheme, PM-USP.
  * DST INSPIRE Scholarship (Department of Science and Technology).
  * Reliance Foundation Undergraduate Scholarship (up to ₹2 Lakh over degree duration).
  * Siemens Scholarship for Government Engineering Students.
* **Mapping in ALIGNX:**
  * Displayed on career pathway UI cards and ingested into Gemini LLM prompts for hallucination-free guidance.

---

## 3. Field-by-Field Provenance Matrix

| JSON Field in `careers.json` | Type | Value Range | Primary Source | Normalization Method |
|---|---|---|---|---|
| `aptitudeProfile.logical` | Number | 0–100 | O\*NET Abilities (`Deductive/Inductive`) | Scaled to 0–100 percentile against STEAM benchmarks |
| `aptitudeProfile.numerical` | Number | 0–100 | O\*NET Abilities (`Mathematical Reasoning`) | Scaled to 0–100 percentile against STEAM benchmarks |
| `aptitudeProfile.spatial` | Number | 0–100 | O\*NET Abilities (`Spatial Orientation/Visualization`) | Scaled to 0–100 percentile against STEAM benchmarks |
| `aptitudeProfile.verbal` | Number | 0–100 | O\*NET Abilities (`Written/Oral Comprehension`) | Scaled to 0–100 percentile against STEAM benchmarks |
| `aptitudeProfile.analytical` | Number | 0–100 | O\*NET Abilities (`Information Ordering/Analysis`) | Scaled to 0–100 percentile against STEAM benchmarks |
| `interestProfile.*` | Number | 0–100 | O\*NET Interests (`RIASEC Holland Codes`) | Normalized 0–100 vector |
| `marketData.hiringVelocity` | Number | 0–100 | NASSCOM & TeamLease Talent Trackers | Derived from YoY hiring volume surge & time-to-fill |
| `marketData.disruptionIndex`| Number | 0–100 | WEF & NASSCOM AI Resilience Framework | Composite metric of AI automation resistance |
| `locationDemand.*` | Array | 0–100 | MoSPI PLFS 2023–24 & Wheebox City Employability | State UR & LFPR combined with City GCC density |
| `educationCost.*` | Object | INR (₹) | NIRF & Official College Circulars | Real 4-year tuition + hostel fee totals |
| `salaryRange.*` | Object | LPA (₹) | TeamLease FY27 & AmbitionBox Benchmarks | Verified Indian compensation percentiles (P25–P75) |
