---
name: ALIGNX Design System
description: The Precision Observatory — An architectural, crisp optical instrument for multi-dimensional career decision intelligence.
colors:
  primary: "#9E6B38"
  primary-light: "#B8824C"
  secondary: "#0071E3"
  neutral-bg: "#FFFFFF"
  neutral-surface: "#F5F5F7"
  neutral-elevated: "#FAFAFC"
  text-primary: "#1D1D1F"
  text-secondary: "#515154"
  text-muted: "#86868B"
  border-hairline: "rgba(0, 0, 0, 0.08)"
  border-subtle: "rgba(0, 0, 0, 0.14)"
typography:
  display:
    fontFamily: "Plus Jakarta Sans, -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Plus Jakarta Sans, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Syne, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Plus Jakarta Sans, -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "-0.011em"
  label:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.14em"
rounded:
  pill: "980px"
  card: "16px"
  keycap: "9px"
  sm: "6px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.pill}"
    padding: "13px 26px"
  button-primary-hover:
    backgroundColor: "{colors.primary-light}"
  button-roll:
    backgroundColor: "{colors.neutral-bg}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  card-floating:
    backgroundColor: "{colors.neutral-bg}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.card}"
    padding: "24px"
---

# Design System: ALIGNX

## Overview

**Creative North Star: "The Precision Observatory"**

ALIGNX’s visual identity is modeled as a high-precision optical instrument. Rather than an aggressive gaming HUD or a generic corporate dashboard, ALIGNX feels like an architectural observatory where complex human psychometrics, parental expectations, and labor market telemetry are brought into crisp, unambiguous focus.

The atmosphere is clean, editorial, and tactile. Surfaces are bathed in ceramic white and subtle slate tones, punctuated by warm desert titanium accents that convey institutional prestige and human warmth. Dense quantitative telemetry—such as 6-axis Holland RIASEC vectors, Parent-Student Conflict scores, and MoSPI compensation percentiles—is balanced with unhurried typography, disciplined hairlines, and physical keycap affordances.

**Key Characteristics:**
- **Ceramic Light Editorial Atmosphere**: High-luminance purity with crisp, legible contrast.
- **Desert Titanium Accents**: Calibrated warm metallic gold tones conveying trust, ambition, and precision.
- **Architectural Hairlines**: 1px structural gridlines and subtle hairlines that segment complex analytical modules.
- **Tactile Affordances**: 3D rolling text pills, physical keycaps with subtle depth, and smooth kinetic easing.

## Colors

The ALIGNX palette balances pristine ceramic neutrals with warm titanium metallic accents and technical signature blue.

### Primary
- **Desert Titanium Gold** (`#9E6B38`): The signature core accent for high-value recommendations, career DNA highlights, and primary actions.
- **Warm Gold Highlight** (`#B8824C`): Used on hover states, gradients, and active radar node vertices.

### Secondary
- **Apple Signature Blue** (`#0071E3`): Represents technical verification, active sliders, and mathematical telemetry badges.

### Neutral
- **Ceramic Pure White** (`#FFFFFF`): Primary application canvas and floating card backgrounds.
- **Neutral Surface Gray** (`#F5F5F7`): Card group backgrounds, keycap bases, and alternating data row fills.
- **Elevated Off-White** (`#FAFAFC`): Elevated interactive planes and modal containers.
- **Keynote Obsidian** (`#1D1D1F`): Primary typography, hero headlines, and authoritative data readouts.
- **Refined Slate Gray** (`#515154`): Secondary descriptions, methodology explanations, and table headers.
- **Precision Metadata Gray** (`#86868B`): Units, timestamps, benchmark badges, and subtle footnote labels.
- **Hairline Border** (`rgba(0, 0, 0, 0.08)`): Base module separators and structural framing.

### Named Rules
**The Rarity Rule.** The Desert Titanium primary accent is reserved for top recommendations and primary affirmative actions (≤10% of surface area). Its restraint is what signals institutional importance.  
**The Double-Border Rule.** High-priority floating cards pair a 1px subtle outer border (`rgba(0, 0, 0, 0.08)`) with an inner 1px inset highlight (`rgba(255, 255, 255, 0.9)`) to create crisp material realism.

## Typography

**Display Font:** `Plus Jakarta Sans` (with `-apple-system`, `SF Pro Display`, `sans-serif`)  
**Body Font:** `Plus Jakarta Sans` (with `SF Pro Text`, `sans-serif`)  
**Distinctive Title Font:** `Syne` (with `sans-serif`)  
**Label/Mono Font:** `JetBrains Mono` (with `monospace`)  

**Character:** Technical authority meets unhurried editorial clarity. Display headlines use tight negative tracking for muscular cohesion, while mono labels feature wide tracking for optical legibility.

### Hierarchy
- **Display** (Bold 700, `clamp(2rem, 5vw, 3.5rem)`, line-height `1.1`, tracking `-0.035em`): Hero section title and top career archetype announcements.
- **Headline** (SemiBold 600, `1.75rem`, line-height `1.25`, tracking `-0.025em`): Module headers and major section dividers.
- **Title** (SemiBold 600, `1.25rem`, line-height `1.35`, tracking `-0.015em`): Career cards, radar chart titles, and quadrant headers.
- **Body** (Regular 400, `1rem`, line-height `1.55`, tracking `-0.011em`, max-width `70ch`): Explanatory narratives, parent counseling summaries, and methodology copy.
- **Label / Eyebrow** (Medium 500, `0.75rem`, line-height `1.4`, tracking `0.14em`, uppercase): Metric badges, score categories, step counters (`01`, `02`), and slider units.

### Named Rules
**The Monospace Eyebrow Rule.** Every primary section headline is prefaced by an uppercase monospace eyebrow badge in wide tracking (`letter-spacing: 0.14em`) providing taxonomic orientation.

## Layout

ALIGNX follows an 80px architectural grid with disciplined responsive container widths:
- **Maximum App Container:** `1600px` centered with `24px` horizontal padding.
- **Content Reading Column:** `1200px` for multi-column dashboards; `800px` for conversational reading flows.
- **Spacing Rhythm:** Built on an 8px base scale (`8px`, `16px`, `24px`, `32px`, `48px`, `64px`).
- **Responsive Stacking:** Multi-column comparison grids (e.g. Student vs. Parent) remain side-by-side down to `1024px`, then gracefully stack into sequential comparison tabs on mobile.

## Elevation & Depth

Surfaces are tactile and physical rather than flat or excessively blurry. The system utilizes subtle ambient lifts and directional hairlines.

### Shadow Vocabulary
- **Card Ambient Rest** (`box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05)`): Standard card resting elevation.
- **Card Interactive Hover** (`box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)`): Interactive card hover lift with `-2px` Y-translation.
- **Tactile Keycap** (`box-shadow: 0 2px 0 rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.95)`): Physical mechanical key feeling.
- **Primary Accent Glow** (`box-shadow: 0 4px 16px rgba(158, 107, 56, 0.28)`): Reserved for top-rank recommendation badges and primary CTA triggers.

### Named Rules
**The Kinetic Easing Rule.** All state transitions utilize Apple-grade cubic bezier curve `cubic-bezier(0.16, 1, 0.3, 1)` with durations between `180ms` (snappy clicks) and `380ms` (card unfolds).

## Shapes

- **Signature Pill Radius** (`980px`): Primary buttons, roll buttons, category chips, and filter toggles.
- **Container Radius** (`16px`): Dashboard cards, radar chart visualizer backdrops, and What-If parameter control panels.
- **Tactile Keycap Radius** (`9px`): Keyboard shortcuts, option selector buttons, and micro-steppers.
- **Hairlines**: 1px crisp borders defined strictly via `border-hairline` (`rgba(0, 0, 0, 0.08)`).

## Components

### Buttons
- **Shape:** Signature pill (`980px`).
- **Primary:** Desert Titanium gradient (`linear-gradient(180deg, #B8824C 0%, #9E6B38 100%)`), white text, 1px `#8C5828` border, padding `13px 26px`.
- **3D Roll Button:** Dual-plane text track with overflow hidden. On hover, the primary label rolls upward by `100%` revealing a secondary state label smoothly.
- **Outline / Ghost:** Translucent background (`rgba(0, 0, 0, 0.03)`), hairline border, hover shifts to titanium accent tint.

### Tactile Keycaps (`.alignx-key`)
- **Style:** Clean mechanical key base (`linear-gradient(180deg, #FFFFFF 0%, #F5F5F7 100%)`), 1px subtle border, inset highlight.
- **Active State:** Desert Titanium warm tint (`#FAF4ED`), darker border, `1.5px` active pressed depression.

### Cards & Analytical Containers
- **Style:** Pure white card surface, `16px` corner radius, 1px subtle hairline, 2px ambient resting shadow.
- **Hover:** Lifts `-2px` with expanded diffuse shadow and subtle accent border glow.

### Interactive Sliders (What-If Module)
- **Track:** 6px rounded track in neutral surface gray with active track fill in Desert Titanium or Blue.
- **Thumb:** 20px circular ceramic white thumb with 1px border and 2px drop shadow. Hover scales to 22px.

### Navigation Header
- **Style:** Sticky top bar with `rgba(255, 255, 255, 0.88)` background, `blur(20px)` frosted glass backdrop filter, 1px bottom hairline, and numeric step badges (`00` to `09`).

## Do's and Don'ts

### Do:
- **Do** format all financial metrics with explicit Rupee denomination (e.g. `₹8.5L`, `₹25,000/mo`, `₹1.2Cr`).
- **Do** preface complex quantitative scores with diagnostic status badges (`Feasible`, `High Congruence`, `Attention Needed`).
- **Do** maintain high typographic contrast between headings (`#1D1D1F`) and metadata labels (`#86868B`).
- **Do** use `var(--ease-apple)` (`cubic-bezier(0.16, 1, 0.3, 1)`) for all interactive transitions.

### Don't:
- **Don't** use neon or saturated purple/green cyberpunk palettes; ALIGNX is an authoritative, architectural observatory.
- **Don't** display black-box percentages without the underlying 5D dimensional breakdown ($S_{\text{fit}}, F_{\text{fit}}, A_{\text{family}}, M_{\text{fit}}, L_{\text{fit}}$).
- **Don't** use sharp 0px corners on interactive buttons; use the signature `980px` pill radius or `9px` keycap radius.
- **Don't** allow slider handles to overlap labels on mobile viewports; enforce responsive vertical stacking below `768px`.
