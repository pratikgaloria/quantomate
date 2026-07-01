# Implementation Plan - Design System Modernization & Standardization

This document outlines the design system standard and refactoring plan for `packages/ui/client`. It serves as the specification for the Design Agent to reconstruct the styles using a CSS Custom Properties (variables) approach integrated with Tailwind and Radix primitives.

---

## 1. Centralized Theme Variables (`:root`)

We will clean up and restructure the CSS custom properties in [App.scss](file:///home/dev/projects/quantomate/packages/ui/client/src/styles/App.scss). All variables should be defined in `:root` (with standard HSL values mapped to Tailwind utility classes) and follow a structure that makes adding dark mode later trivial.

### Theme Variables to Implement/Unify:
1. **Primary Theme & Accents**:
   - `--primary`, `--primary-foreground` (Active controls, primary CTA)
   - `--accent`, `--accent-foreground` (Hover selections, tab active highlights)
   - `--border`, `--input` (Standard inputs, select boxes, section divisions)
2. **Trading P&L Indicators**:
   - `--color-profit` (default `#10b981`) -> profit text and positive direction icons.
   - `--color-profit-bg` (default `#e8f5e9`) -> background for long badges/success cards.
   - `--color-loss` (default `#ef4444`) -> loss text and negative direction icons.
   - `--color-loss-bg` (default `#fef2f2`) -> background for short badges/error messages.
3. **Execution Exit Reasons**:
   - `--color-exit-sl` (default `#b91c1c`, background `#fef2f2`, border `#fecaca`) -> Stop-loss exits.
   - `--color-exit-tp` (default `#1d4ed8`, background `#eff6ff`, border `#bfdbfe`) -> Take-profit exits.
   - `--color-exit-strat` (default `#c2410c`, background `#fff7ed`, border `#fed7aa`) -> Strategy exits.

*Rule: The Design Agent must replace all raw hex code declarations (`#10b981`, `#ef4444`, etc.) with these variables across the entire client source code.*

---

## 2. Refactoring Atomic Components

Update the core atomic elements in [packages/ui/client/src/components/atoms](file:///home/dev/projects/quantomate/packages/ui/client/src/components/atoms) to eliminate hardcoded values and leverage Tailwind variable utilities.

### [Button.tsx](file:///home/dev/projects/quantomate/packages/ui/client/src/components/atoms/Button.tsx)
- Replace static styles (`bg-[#111]`, `border-[#ddd]`, etc.) with semantic classes (`bg-primary`, `text-primary-foreground`, `border-input`, `hover:bg-accent`).
- Support class overrides cleanly via `className` prop using `cn(...)`.

### [Input.tsx](file:///home/dev/projects/quantomate/packages/ui/client/src/components/atoms/Input.tsx)
- Replace `border-[#ddd]`, `text-[#555]`, and label colors with standard Tailwind border/text/placeholder variables.
- Ensure focus states use `--ring` or `--primary` styles dynamically.

### [Select.tsx](file:///home/dev/projects/quantomate/packages/ui/client/src/components/atoms/Select.tsx)
- Replace `border-[#ddd]` and native option styles with theme vars.

---

## 3. Reorganizing Component SCSS Modules

Component-level styling files (e.g. `TradeList.scss`, `Sidebar.scss`, `CollapsibleSection.scss`) should remain distinct but must be refactored to consume the variables defined in [App.scss](file:///home/dev/projects/quantomate/packages/ui/client/src/styles/App.scss).

- Replace hardcoded background colors, borders, and text colors with variables.
- Remove redundant spacing declarations to support the required high-density layout.

---

## 4. Layout Density & Monitor Optimization (4K Screens)

- Ensure the shell layout operates with high space efficiency.
- Restrict sidebar width strictly to `var(--sidebar-w)` (`72px`) and icon-only content.
- Restrict margins and paddings globally to maintain a compact dashboard that groups charts, tables, and controls cleanly without wasting screen space.
