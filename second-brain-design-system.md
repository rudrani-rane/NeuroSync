# Second Brain Platform - Design System & UI/UX Documentation

**Version:** 1.0  
**Date:** January 31, 2026  
**Product:** AI-Powered Second Brain Platform  

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Component Library](#component-library)
6. [Page Layouts](#page-layouts)
7. [User Flows](#user-flows)
8. [Interaction Patterns](#interaction-patterns)
9. [Responsive Design](#responsive-design)
10. [Accessibility](#accessibility)

---

## Design Philosophy

### Core Principles

#### 1. **Clarity & Focus**
- Clean, uncluttered interfaces that reduce cognitive load
- Information hierarchy guides users naturally
- White space as a design element, not empty space

#### 2. **Intelligence Visibility**
- AI processing should be transparent but not intrusive
- Show confidence levels and reasoning paths
- Celebrate AI insights with subtle, delightful interactions

#### 3. **Speed & Efficiency**
- Zero-friction knowledge capture
- Smart defaults reduce decision fatigue
- Keyboard shortcuts for power users

#### 4. **Trust & Reliability**
- Always show sources and citations
- Clear error states with actionable recovery
- Consistent, predictable behavior

#### 5. **Scalability**
- Design accommodates growth from 10 to 10,000 memories
- Progressive disclosure of complexity
- Adaptive layouts for different data densities

---

## Color System

### Brand Colors

#### Primary Palette
```
Primary Blue (Brand)
- Primary-50:  #EFF6FF
- Primary-100: #DBEAFE
- Primary-200: #BFDBFE
- Primary-300: #93C5FD
- Primary-400: #60A5FA
- Primary-500: #3B82F6  ← Main brand color
- Primary-600: #2563EB
- Primary-700: #1D4ED8
- Primary-800: #1E40AF
- Primary-900: #1E3A8A
```

**Usage:**
- Primary actions (buttons, links)
- Active states
- Focus indicators
- Brand moments

#### Secondary Palette (Purple - AI/Intelligence)
```
Secondary Purple
- Purple-50:  #FAF5FF
- Purple-100: #F3E8FF
- Purple-200: #E9D5FF
- Purple-300: #D8B4FE
- Purple-400: #C084FC
- Purple-500: #A855F7  ← AI accent
- Purple-600: #9333EA
- Purple-700: #7E22CE
- Purple-800: #6B21A8
- Purple-900: #581C87
```

**Usage:**
- AI-generated content indicators
- Processing states
- Analyst insights
- Smart suggestions

#### Accent Colors

**Success Green**
```
- Green-50:  #F0FDF4
- Green-500: #22C55E  ← Success actions
- Green-600: #16A34A
```

**Warning Amber**
```
- Amber-50:  #FFFBEB
- Amber-500: #F59E0B  ← Warnings
- Amber-600: #D97706
```

**Error Red**
```
- Red-50:  #FEF2F2
- Red-500: #EF4444  ← Errors
- Red-600: #DC2626
```

**Info Cyan**
```
- Cyan-50:  #ECFEFF
- Cyan-500: #06B6D4  ← Information
- Cyan-600: #0891B2
```

### Neutral Palette

```
Neutrals (Gray scale)
- Gray-50:  #F9FAFB  ← Backgrounds
- Gray-100: #F3F4F6  ← Secondary backgrounds
- Gray-200: #E5E7EB  ← Borders
- Gray-300: #D1D5DB  ← Disabled elements
- Gray-400: #9CA3AF  ← Placeholder text
- Gray-500: #6B7280  ← Secondary text
- Gray-600: #4B5563  ← Body text
- Gray-700: #374151  ← Headings
- Gray-800: #1F2937  ← Strong headings
- Gray-900: #111827  ← Maximum contrast
```

### Semantic Color Usage

| Context | Color | Hex |
|---------|-------|-----|
| **Backgrounds** |
| Page background | Gray-50 | #F9FAFB |
| Card background | White | #FFFFFF |
| Sidebar background | Gray-900 | #111827 |
| Hover background | Gray-100 | #F3F4F6 |
| **Text** |
| Primary text | Gray-900 | #111827 |
| Secondary text | Gray-600 | #4B5563 |
| Disabled text | Gray-400 | #9CA3AF |
| Link text | Primary-600 | #2563EB |
| **Borders** |
| Default border | Gray-200 | #E5E7EB |
| Input border | Gray-300 | #D1D5DB |
| Focus border | Primary-500 | #3B82F6 |
| **Status** |
| Processing | Purple-500 | #A855F7 |
| Success | Green-500 | #22C55E |
| Warning | Amber-500 | #F59E0B |
| Error | Red-500 | #EF4444 |

### Brain Scope Colors

Each brain type has a unique color for visual identification:

```
Personal Brain:    Primary-500  (#3B82F6)  - Blue
Engineering Brain: Cyan-600     (#0891B2)  - Cyan
HR Brain:          Purple-500   (#A855F7)  - Purple
Finance Brain:     Green-600    (#16A34A)  - Green
Legal Brain:       Gray-700     (#374151)  - Gray
Marketing Brain:   Red-500      (#EF4444)  - Red
Sales Brain:       Amber-600    (#D97706)  - Amber
Operations Brain:  Cyan-500     (#06B6D4)  - Light Cyan
```

### Gradient System

#### Hero Gradients
```css
/* Primary Gradient - Brand moments */
.gradient-brand {
  background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%);
}

/* AI Gradient - Intelligence features */
.gradient-ai {
  background: linear-gradient(135deg, #A855F7 0%, #EC4899 100%);
}

/* Success Gradient */
.gradient-success {
  background: linear-gradient(135deg, #22C55E 0%, #14B8A6 100%);
}
```

#### Subtle Background Gradients
```css
/* Light gradient for cards */
.gradient-card {
  background: linear-gradient(180deg, #FFFFFF 0%, #F9FAFB 100%);
}

/* Sidebar gradient */
.gradient-sidebar {
  background: linear-gradient(180deg, #111827 0%, #1F2937 100%);
}
```

---

## Typography

### Font Family

**Primary Font:** Inter (Google Fonts)
- Clean, modern sans-serif
- Excellent readability at all sizes
- Wide range of weights

**Monospace Font:** JetBrains Mono
- Code snippets
- Technical data
- Memory IDs

### Type Scale

```css
/* Font Sizes */
--text-xs:   0.75rem;   /* 12px */
--text-sm:   0.875rem;  /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg:   1.125rem;  /* 18px */
--text-xl:   1.25rem;   /* 20px */
--text-2xl:  1.5rem;    /* 24px */
--text-3xl:  1.875rem;  /* 30px */
--text-4xl:  2.25rem;   /* 36px */
--text-5xl:  3rem;      /* 48px */

/* Line Heights */
--leading-tight:  1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;

/* Font Weights */
--font-normal:    400;
--font-medium:    500;
--font-semibold:  600;
--font-bold:      700;
```

### Typography System

| Element | Size | Weight | Line Height | Color | Usage |
|---------|------|--------|-------------|-------|-------|
| **Display 1** | 3rem (48px) | Bold (700) | 1.2 | Gray-900 | Hero headlines |
| **Display 2** | 2.25rem (36px) | Bold (700) | 1.25 | Gray-900 | Page titles |
| **Heading 1** | 1.875rem (30px) | Semibold (600) | 1.3 | Gray-900 | Section headers |
| **Heading 2** | 1.5rem (24px) | Semibold (600) | 1.4 | Gray-800 | Card headers |
| **Heading 3** | 1.25rem (20px) | Semibold (600) | 1.4 | Gray-800 | Sub-sections |
| **Heading 4** | 1.125rem (18px) | Medium (500) | 1.4 | Gray-700 | Small headers |
| **Body Large** | 1.125rem (18px) | Normal (400) | 1.75 | Gray-700 | Important body |
| **Body** | 1rem (16px) | Normal (400) | 1.5 | Gray-600 | Default text |
| **Body Small** | 0.875rem (14px) | Normal (400) | 1.5 | Gray-600 | Secondary text |
| **Caption** | 0.75rem (12px) | Normal (400) | 1.5 | Gray-500 | Metadata, labels |
| **Overline** | 0.75rem (12px) | Semibold (600) | 1.5 | Gray-500 | Category labels |
| **Code** | 0.875rem (14px) | Normal (400) | 1.5 | Purple-600 | Inline code |

### Typography Examples

```css
/* Display 1 - Hero Headline */
.text-display-1 {
  font-size: 3rem;
  font-weight: 700;
  line-height: 1.2;
  color: #111827;
  letter-spacing: -0.02em;
}

/* Heading 2 - Card Header */
.text-heading-2 {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.4;
  color: #1F2937;
}

/* Body Text */
.text-body {
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #4B5563;
}

/* Caption */
.text-caption {
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.5;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

### Font Loading

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

---

## Spacing & Layout

### Spacing Scale

Based on 8px grid system:

```css
--spacing-0:   0;
--spacing-1:   0.25rem;  /* 4px */
--spacing-2:   0.5rem;   /* 8px */
--spacing-3:   0.75rem;  /* 12px */
--spacing-4:   1rem;     /* 16px */
--spacing-5:   1.25rem;  /* 20px */
--spacing-6:   1.5rem;   /* 24px */
--spacing-8:   2rem;     /* 32px */
--spacing-10:  2.5rem;   /* 40px */
--spacing-12:  3rem;     /* 48px */
--spacing-16:  4rem;     /* 64px */
--spacing-20:  5rem;     /* 80px */
--spacing-24:  6rem;     /* 96px */
```

### Container Widths

```css
--container-sm:  640px;   /* Small devices */
--container-md:  768px;   /* Medium devices */
--container-lg:  1024px;  /* Large devices */
--container-xl:  1280px;  /* Extra large */
--container-2xl: 1536px;  /* Maximum width */
```

### Border Radius

```css
--radius-none: 0;
--radius-sm:   0.25rem;  /* 4px */
--radius-md:   0.5rem;   /* 8px */
--radius-lg:   0.75rem;  /* 12px */
--radius-xl:   1rem;     /* 16px */
--radius-2xl:  1.5rem;   /* 24px */
--radius-full: 9999px;   /* Fully rounded */
```

### Shadows

```css
/* Elevation system */
--shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

/* Colored shadows for focus states */
--shadow-focus-primary: 0 0 0 3px rgba(59, 130, 246, 0.2);
--shadow-focus-error: 0 0 0 3px rgba(239, 68, 68, 0.2);
--shadow-focus-success: 0 0 0 3px rgba(34, 197, 94, 0.2);
```

### Z-Index Scale

```css
--z-0:    0;     /* Base level */
--z-10:   10;    /* Dropdowns */
--z-20:   20;    /* Sticky headers */
--z-30:   30;    /* Modals backdrop */
--z-40:   40;    /* Modals content */
--z-50:   50;    /* Tooltips */
--z-60:   60;    /* Notifications */
--z-max:  9999;  /* Critical overlays */
```

### Layout Grid

**12-Column Grid System**

```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem; /* 24px */
  padding: 0 1.5rem;
  max-width: 1536px;
  margin: 0 auto;
}

/* Column spans */
.col-span-1  { grid-column: span 1; }
.col-span-2  { grid-column: span 2; }
.col-span-3  { grid-column: span 3; }
.col-span-4  { grid-column: span 4; }
.col-span-6  { grid-column: span 6; }
.col-span-8  { grid-column: span 8; }
.col-span-12 { grid-column: span 12; }
```

---

## Component Library

### 1. Buttons

#### Primary Button
```css
.btn-primary {
  background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
  color: #FFFFFF;
  padding: 0.75rem 1.5rem; /* 12px 24px */
  border-radius: 0.5rem; /* 8px */
  font-size: 1rem; /* 16px */
  font-weight: 600;
  border: none;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-primary:disabled {
  background: #D1D5DB;
  cursor: not-allowed;
  transform: none;
}
```

#### Secondary Button
```css
.btn-secondary {
  background: #FFFFFF;
  color: #3B82F6;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  border: 1px solid #E5E7EB;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: #F9FAFB;
  border-color: #3B82F6;
}
```

#### Ghost Button
```css
.btn-ghost {
  background: transparent;
  color: #4B5563;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease;
}

.btn-ghost:hover {
  background: #F3F4F6;
}
```

#### Icon Button
```css
.btn-icon {
  background: transparent;
  color: #6B7280;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-icon:hover {
  background: #F3F4F6;
  color: #111827;
}
```

#### Button Sizes
```css
.btn-sm {
  padding: 0.5rem 1rem; /* 8px 16px */
  font-size: 0.875rem; /* 14px */
}

.btn-md {
  padding: 0.75rem 1.5rem; /* 12px 24px */
  font-size: 1rem; /* 16px */
}

.btn-lg {
  padding: 1rem 2rem; /* 16px 32px */
  font-size: 1.125rem; /* 18px */
}
```

### 2. Input Fields

#### Text Input
```css
.input-text {
  width: 100%;
  padding: 0.75rem 1rem; /* 12px 16px */
  font-size: 1rem;
  color: #111827;
  background: #FFFFFF;
  border: 1px solid #D1D5DB;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.input-text:focus {
  outline: none;
  border-color: #3B82F6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-text:disabled {
  background: #F3F4F6;
  color: #9CA3AF;
  cursor: not-allowed;
}

.input-text.error {
  border-color: #EF4444;
}

.input-text.error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}
```

#### Search Input
```css
.input-search {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem; /* Leave space for icon */
  font-size: 1rem;
  background: #F9FAFB url('search-icon.svg') no-repeat 1rem center;
  border: 1px solid #E5E7EB;
  border-radius: 0.75rem; /* More rounded for search */
  transition: all 0.2s ease;
}

.input-search:focus {
  outline: none;
  background-color: #FFFFFF;
  border-color: #3B82F6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
```

#### Textarea
```css
.textarea {
  width: 100%;
  min-height: 120px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-family: 'Inter', sans-serif;
  line-height: 1.5;
  color: #111827;
  background: #FFFFFF;
  border: 1px solid #D1D5DB;
  border-radius: 0.5rem;
  resize: vertical;
  transition: all 0.2s ease;
}

.textarea:focus {
  outline: none;
  border-color: #3B82F6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
```

### 3. Cards

#### Basic Card
```css
.card {
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 0.75rem; /* 12px */
  padding: 1.5rem; /* 24px */
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}
```

#### Memory Card
```css
.memory-card {
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 0.75rem;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.memory-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: #3B82F6; /* Brain color indicator */
  border-radius: 0.75rem 0 0 0.75rem;
}

.memory-card:hover {
  border-color: #3B82F6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.memory-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.memory-card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.memory-card-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #6B7280;
  margin-bottom: 0.75rem;
}

.memory-card-content {
  font-size: 0.875rem;
  color: #4B5563;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

#### Stat Card
```css
.stat-card {
  background: linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%);
  border: 1px solid #E5E7EB;
  border-radius: 0.75rem;
  padding: 1.5rem;
}

.stat-card-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.stat-card-value {
  font-size: 2.25rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.25rem;
}

.stat-card-change {
  font-size: 0.875rem;
  color: #22C55E; /* Green for positive change */
}