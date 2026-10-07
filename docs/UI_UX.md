# ALIGNX — UI/UX Specification

> **Product:** ALIGNX — Aligning Talent With Opportunity  
> **Document:** UI/UX Specification  
> **Version:** 1.0

---

# 1. Purpose

This document defines the user experience, visual direction, screen structure, interaction patterns, and UI requirements for ALIGNX.

The goal is to make ALIGNX feel like an **interactive career discovery platform**, not a traditional questionnaire or form-heavy career portal.

---

# 2. UX Vision

ALIGNX should feel:

- Modern
- Intelligent
- Personal
- Interactive
- Trustworthy
- Clear
- Data-driven
- Encouraging
- Easy to understand

The experience should communicate:

> **"ALIGNX understands me, understands my situation, understands the market, and helps me make a better career decision."**

---

# 3. Core UX Principle

The user should progressively discover their career alignment.

```text id="c1kq3a"
Explore
  ↓
Understand Yourself
  ↓
Understand Family Context
  ↓
Understand Opportunity
  ↓
Discover Careers
  ↓
Understand Why
  ↓
Take Action
```

Do not show the user every piece of information at once.

---

# 4. Design Principles

## 4.1 Progressive Disclosure

Show information when it becomes relevant.

Example:

```text id="4y4a8s"
First:
"What kind of problems do you enjoy?"

Later:
"Your analytical score is 91."

Later:
"AI Engineering matches this strength."
```

---

## 4.2 One Meaningful Action at a Time

Assessment screens should avoid overwhelming the user.

Prefer:

```text id="h6bqby"
Question
Options
Progress
Continue
```

instead of:

```text id="9c1n5g"
50-question form
20 dropdowns
10 text fields
Submit
```

---

## 4.3 Explain Before Overwhelming

Complex outputs should be summarized first.

Example:

```text id="v6wkjl"
AI Engineer
91% Alignment

Why?
Strong analytical ability
+
Strong AI interest
+
High market demand
```

Detailed breakdown can be expanded.

---

## 4.4 Visualize Important Data

Use:

- Progress bars
- Radar charts where appropriate
- Score cards
- Comparison cards
- Timeline
- Skill-gap indicators
- Career maps
- Visual connections

Avoid visualizing everything.

---

# 5. Visual Identity

ALIGNX should have a clean technology-oriented visual identity.

Suggested direction:

```text id="t7x1yc"
Style:
Modern + Premium + Intelligent

Visual language:
Clean cards
Soft depth
Clear typography
Subtle gradients
Minimal borders
Smooth transitions
Data visualization
```

The exact color palette should be finalized by the UI/UX owner.

---

# 6. Typography

Use a modern sans-serif font.

Typography hierarchy:

```text id="2x7vyn"
Display Heading
      ↓
Page Heading
      ↓
Section Heading
      ↓
Card Heading
      ↓
Body
      ↓
Caption / Metadata
```

Maintain consistent:

- Font sizes
- Font weights
- Line heights
- Letter spacing

---

# 7. Layout System

Use a consistent spacing system.

Recommended spacing scale:

```text id="9s2vfl"
4
8
12
16
24
32
48
64
```

Components should avoid arbitrary spacing values unless necessary.

---

# 8. Responsive Design

ALIGNX must work across:

- Desktop
- Tablet
- Mobile

Priority:

```text id="um7vcn"
Desktop
   ↓
Tablet
   ↓
Mobile
```

The most important flows must remain usable on smaller screens.

---

# 9. Navigation

Primary student navigation can include:

```text id="3g8juy"
Home
Explore
My Careers
Roadmap
Profile
```

The exact navigation may evolve based on the final dashboard design.

During onboarding, navigation should be minimized to keep the user focused.

---

# 10. Landing Page

## Purpose

Communicate ALIGNX's value immediately.

### Recommended structure

```text id="y5e8r4"
Hero
  ↓
What ALIGNX Understands
  ↓
Student + Family + Market
  ↓
How It Works
  ↓
Key Features
  ↓
Example Career Insight
  ↓
Call To Action
```

### Hero message

Suggested:

> **Your career should fit more than your interests.**

Supporting message:

> ALIGNX connects your strengths, family constraints, and real-world opportunities to help you discover a career path that actually fits.

Primary CTA:

> **Discover My Career Alignment**

Secondary CTA:

> **See How ALIGNX Works**

---

# 11. Student Onboarding

## Goal

Collect essential information without creating friction.

### Screen structure

```text id="v6e3aa"
Progress
       ↓
Basic Information
       ↓
Education
       ↓
Location
       ↓
Interests
       ↓
Skills
       ↓
Goals
```

### UX Requirements

- Show progress.
- Allow back navigation.
- Validate fields inline.
- Avoid unnecessary fields.
- Save progress where practical.

---

# 12. Career Discovery

This is one of ALIGNX's most important UX experiences.

It should feel like **interactive exploration**, not a Google Form.

---

## 12.1 Question Screen

```text id="yluys5"
┌─────────────────────────────────────┐
│          Career Discovery           │
│                                     │
│ Question 4 of 15                    │
│                                     │
│ You are given a difficult problem   │
│ with no obvious solution.           │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Break it into smaller problems  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Build a quick prototype         │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Research existing solutions     │ │
│ └─────────────────────────────────┘ │
│                                     │
│              ●●●●○○○               │
└─────────────────────────────────────┘
```

---

# 13. Aptitude Assessment UI

The aptitude assessment should feel different from Career Discovery.

Career Discovery:

> Scenario-based.

Aptitude:

> Question-based.

### Structure

```text id="4eujx1"
Question
    ↓
Problem
    ↓
Answer Options
    ↓
Next
```

Show:

- Question number
- Progress
- Timer only if intentionally required
- Answer options
- Next/previous controls

Avoid unnecessary pressure unless timing is part of the assessment design.

---

# 14. Assessment Completion

After completing an assessment, avoid immediately dumping raw scores.

Instead:

```text id="2w5z3b"
Assessment Complete
       ↓
Analyzing Your Responses...
       ↓
Your Career Profile Is Ready
       ↓
Reveal Career DNA
```

This creates a natural transition into the Career DNA experience.

---

# 15. Career DNA Reveal

Career DNA should be a memorable moment.

### Suggested flow

```text id="v8l1by"
Analyzing...
   ↓
Traits appear
   ↓
Primary identity revealed
   ↓
Secondary traits
   ↓
Explanation
```

Example:

```text id="x6by5v"
YOUR CAREER DNA

        ANALYTICAL
           91

       BUILDER
          84

      RESEARCH
          81

    ───────────────

    ANALYTICAL BUILDER
```

The reveal can use subtle animation.

---

# 16. Career DNA Dashboard

Show:

### Primary Identity

> Analytical Builder

### Strongest Traits

- Analytical
- Builder
- Research

### Supporting Traits

- Creative
- Risk

### Explanation

> You tend to enjoy understanding complex problems and turning ideas into practical solutions.

### Suitable Career Families

- AI / ML
- Software Engineering
- Robotics
- Data Science

---

# 17. Parent Addition Flow

The student should clearly understand why the parent is being added.

### Screen

```text id="ld7hqb"
Understand Your Career From Every Angle

Your career decision is also affected by:

✓ Education affordability
✓ Family expectations
✓ Risk tolerance
✓ Location preferences

Add a parent or guardian to include
your family's perspective.

[ Add Parent ]
```

---

# 18. Multiple Parent UI

Use a simple card-based interface.

```text id="gq9p8c"
Family

┌───────────────────────────┐
│ Father                    │
│ ✓ Completed               │
└───────────────────────────┘

┌───────────────────────────┐
│ Mother                    │
│ ○ Invitation Pending      │
└───────────────────────────┘

[ + Add Another Parent ]
```

Do not impose an arbitrary two-parent limit.

---

# 19. Parent Invitation

After adding a parent:

```text id="8imwbl"
Parent Added

Send this invitation to your parent.

┌─────────────────────────────┐
│ alignx.app/parent/8F29...   │
└─────────────────────────────┘

[ Copy Link ]

Invitation expires in 24 hours.
```

Provide clear feedback after copying.

---

# 20. Parent Form UX

The parent experience should be:

- Simple
- Short
- Mobile-friendly
- Non-technical
- Easy to understand

Suggested sections:

```text id="q3t0iw"
About You
   ↓
Financial Comfort
   ↓
Career Expectations
   ↓
Risk Preference
   ↓
Location Preference
   ↓
Submit
```

Avoid exposing unnecessary student information.

---

# 21. Family Analysis Screen

After parent data is complete:

```text id="5sjgjj"
FAMILY ALIGNMENT

Financial Fit
████████░░ 82

Family Alignment
█████████░ 88

Parent–Student Conflict
████░░░░░░ 24
```

Use neutral language.

Avoid:

> "Your parents are wrong."

Prefer:

> "You and your family have different preferences around career risk."

---

# 22. Conflict Visualization

The Conflict Index should focus on specific areas.

Example:

```text id="b73w4x"
Where You Agree

✓ Career field
✓ Location

Where You Differ

! Risk level
! Education budget
```

This makes the result actionable.

---

# 23. Market Intelligence Screen

Market information should be understandable to students.

Example:

```text id="3m7grx"
AI ENGINEER

Market Demand
█████████░ 92

Growth
████████░░ 89

Chennai
███████░░░ 78

Bangalore
█████████░ 92
```

Avoid presenting unexplained numbers.

Include labels such as:

> High demand

rather than only:

> 92.

---

# 24. Recommendation Reveal

The recommendation screen should feel like the main product payoff.

### Header

> **Your strongest career alignments**

### Career card

```text id="h91zmc"
┌──────────────────────────────────────┐
│ #1                                   │
│ AI Engineer                          │
│                                      │
│        91% ALIGNMENT                 │
│                                      │
│ Student Fit       94                │
│ Financial Fit     82                │
│ Family Alignment  88                │
│ Market Fit        95                │
│ Location Fit      86                │
│                                      │
│ [ Why this career? ]                 │
│ [ Explore Career ]                   │
└──────────────────────────────────────┘
```

---

# 25. Recommendation Explanation

Clicking:

> **Why this career?**

should reveal:

```text id="2owj3x"
Why ALIGNX recommends this

✓ Strong analytical aptitude
✓ Strong interest in AI
✓ Good programming foundation
✓ High market demand

Watch out for

! Machine learning skills need development
! Advanced education may increase cost
```

---

# 26. Career Comparison

Students should be able to compare multiple careers.

Example:

```text id="o5w8yb"
                    AI Engineer    Robotics
Student Fit             94            87
Financial Fit           82            79
Market Fit              95            84
Location Fit            86            81
Overall                 91            83
```

Keep comparisons visually simple.

---

# 27. Career Twin

The Career Twin should visually answer:

> **"How closely does this career resemble the career I am suited for?"**

Suggested structure:

```text id="ijv07n"
             YOU
              │
      ┌───────┼───────┐
      │       │       │
   Aptitude Interest Skills
      │       │       │
      └───────┼───────┘
              │
              ▼
         AI ENGINEER
              │
       91% ALIGNMENT
```

Show:

- Strong matches
- Skill gaps
- Career requirements
- Alignment areas

---

# 28. What-If Simulator

The simulator should look interactive.

Example:

```text id="k5f8e1"
WHAT IF?

Education Budget
₹5L ─────────●──── ₹15L

Location
[ Chennai ▼ ]

Risk Appetite
[ Low ▼ ]

Time to Employment
[ Flexible ▼ ]

        [ Run Simulation ]
```

After simulation:

```text id="zv7j1m"
YOUR RANKINGS CHANGED

AI Engineer
88 → 93  ↑

Data Scientist
84 → 87  ↑

Research Scientist
79 → 72  ↓
```

Then explain:

> Increasing your education budget improved the financial fit of careers requiring more specialized training.

---

# 29. Skill Gap UI

Example:

```text id="9hmxcn"
SKILL GAP

AI Engineer

Python
█████████░ 85 / 80
✓ Strong

Machine Learning
████░░░░░░ 40 / 85
! Priority

Statistics
█████░░░░░ 52 / 80
! Improve
```

Use clear labels:

- Strong
- Developing
- Priority

---

# 30. Roadmap UI

The roadmap should be visual and sequential.

```text id="4yx9so"
YOUR AI ENGINEER ROADMAP

01 ─ Foundation
    Python
    Mathematics

        ↓

02 ─ Machine Learning
    ML fundamentals
    Projects

        ↓

03 ─ Portfolio
    Build 2–3 projects

        ↓

04 ─ Experience
    Internship
    Open source

        ↓

05 ─ Career Entry
    Apply
    Interview preparation
```

---

# 31. Dashboard

The dashboard should provide a quick overview.

Recommended structure:

```text id="m3xjri"
Good morning, Himanshu

Your Career DNA
┌──────────────────────────┐
│ Analytical Builder       │
│ 91 Analytical            │
│ 84 Builder               │
└──────────────────────────┘

Top Career Alignments
┌──────────────────────────┐
│ AI Engineer       91%    │
│ Data Scientist     86%   │
│ Robotics Engineer  83%   │
└──────────────────────────┘

Family
Parent 1 ✓
Parent 2 ○

Your Next Step
Improve Machine Learning

[ View Roadmap ]
```

---

# 32. Component System

Create reusable components.

Examples:

```text id="s0k3qs"
Button
Card
Modal
Input
Select
ProgressBar
ScoreCard
CareerCard
ParentCard
AssessmentOption
TraitChart
SkillGapCard
RoadmapItem
StatusBadge
EmptyState
LoadingState
ErrorState
```

Avoid creating separate versions of the same component unnecessarily.

---

# 33. Button Hierarchy

### Primary

Used for the main action.

Examples:

- Start Discovery
- Continue
- Generate Recommendations
- Run Simulation

### Secondary

Used for supporting actions.

Examples:

- Explore
- Compare
- View Details

### Tertiary

Used for low-priority actions.

Examples:

- Skip
- Learn More
- Back

---

# 34. Forms

Forms should:

- Use clear labels.
- Use appropriate input types.
- Validate inline.
- Show errors close to the field.
- Avoid unnecessary required fields.
- Preserve user input after validation errors.

Example:

```text id="slod0t"
Education Budget

₹ [ 300000 ]

✓ Looks good
```

---

# 35. Loading States

Never leave users staring at a blank screen.

Example:

```text id="gpxb0f"
Analyzing your profile...

✓ Understanding your strengths
✓ Checking family constraints
● Comparing career opportunities
○ Preparing your roadmap
```

For LLM calls, show an appropriate progress state without pretending that a specific step has completed if it has not.

---

# 36. Empty States

Example:

```text id="0d7r3b"
No recommendations yet.

Complete your Career Discovery and
Aptitude Assessment to unlock your
career alignments.

[ Continue Assessment ]
```

---

# 37. Error States

Errors should explain what happened and what the user can do.

Bad:

> Error 500.

Better:

> We couldn't load your recommendations right now.

> Please try again.

[ Retry ]

---

# 38. Accessibility

ALIGNX should support:

- Keyboard navigation.
- Sufficient color contrast.
- Readable font sizes.
- Visible focus states.
- Descriptive labels.
- Accessible form controls.
- Meaningful error messages.
- Screen-reader-friendly structure where practical.

Do not rely only on color to communicate status.

---

# 39. Animation Guidelines

Animation should support understanding rather than distract.

Good uses:

- Career DNA reveal
- Progress transitions
- Score loading
- Career card entrance
- Roadmap transitions
- What-If comparison

Avoid:

- Excessive page transitions
- Constant movement
- Slow animations that block interaction
- Decorative animations everywhere

---

# 40. Trust & Transparency

Because ALIGNX deals with important career decisions, the UI should communicate that recommendations are guidance.

Use language such as:

> **Career Alignment: 91%**

instead of:

> **You should become an AI Engineer.**

Add context:

> ALIGNX uses your profile, family context, and opportunity data to estimate career alignment.

---

# 41. Score Presentation

Never show a score without context.

Bad:

```text
91
```

Better:

```text
91% Career Alignment
Strong match
```

Best:

```text
91% Career Alignment

Strong student fit
Good financial feasibility
High market opportunity
```

---

# 42. Mobile UX

Mobile users should be able to complete the full core journey.

Important screens:

- Onboarding
- Career Discovery
- Aptitude
- Parent invitation
- Parent form
- Recommendations
- What-If
- Roadmap

Interactive cards should be large enough for touch interaction.

---

# 43. Parent Mobile UX

The parent workflow should be especially mobile-friendly because the parent may open the invitation from messaging apps.

Optimize for:

```text id="6cy03f"
Open Link
   ↓
Understand Purpose
   ↓
Answer Questions
   ↓
Submit
```

Avoid requiring desktop-only interactions.

---

# 44. Responsive Breakpoints

Use the project's chosen responsive framework conventions.

Conceptually:

```text id="1ip4v5"
Mobile
   < 640px

Tablet
   640px – 1024px

Desktop
   > 1024px
```

Exact breakpoints can follow the frontend framework's defaults.

---

# 45. UI Data Ownership

Frontend displays data; it should not become the source of truth.

Example:

```text id="h9ud8f"
❌ Frontend calculates:
Overall Score = ...

✓ Backend returns:
Overall Score = 91

Frontend:
Displays 91
```

---

# 46. Design Handoff

Daksh should provide:

- Wireframes
- Component definitions
- Screen states
- Responsive behavior
- Interaction descriptions
- Empty/loading/error states

Assets should be stored under:

```text id="cx7g9m"
assets/
├── wireframes/
├── diagrams/
└── screenshots/
```

---

# 47. Screen Inventory

The MVP should contain approximately:

```text id="5p8grn"
01. Landing
02. Student Onboarding
03. Career Discovery
04. Aptitude Assessment
05. Assessment Result
06. Career DNA Reveal
07. Career DNA Details
08. Add Parent
09. Parent Status
10. Parent Invitation
11. Parent Form
12. Family Analysis
13. Recommendation Dashboard
14. Career Details
15. Career Comparison
16. Career Twin
17. What-If Simulator
18. Skill Gap
19. Roadmap
20. Profile / Settings
```

The exact number of screens may change during implementation if the user flow remains intact.

---

# 48. UX Priority

## P0

- Landing
- Onboarding
- Career Discovery
- Aptitude
- Career DNA
- Parent flow
- Recommendations
- Dashboard

## P1

- Career Twin
- Skill Gap
- Roadmap
- Family Analysis

## P2

- What-If Simulator
- Advanced visualizations
- Hyper-local opportunity map

---

# 49. UX Quality Checklist

Before considering a screen complete:

- [ ] Clear purpose
- [ ] Clear primary action
- [ ] Responsive
- [ ] Loading state
- [ ] Error state
- [ ] Empty state where required
- [ ] Validation
- [ ] Accessible controls
- [ ] Consistent spacing
- [ ] Consistent typography
- [ ] Consistent components
- [ ] No unnecessary information
- [ ] Works on mobile

---

# 50. Final UX Principle

ALIGNX should not feel like:

```text id="u3j2g5"
Form
↓
Form
↓
Form
↓
Score
```

It should feel like:

```text id="y1c8qk"
Explore
   ↓
Discover
   ↓
Understand
   ↓
Connect
   ↓
Compare
   ↓
Simulate
   ↓
Decide
   ↓
Act
```

> **The UI should make a complex multi-dimensional decision feel simple, personal, and understandable without hiding the underlying reasoning.**