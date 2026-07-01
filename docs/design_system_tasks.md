# Design System Standardization Tasks

This checklist tracks the refactoring progress of the design system. The Design Agent should mark tasks as complete (`[x]`) as it advances.

## Phase 1: CSS Custom Properties & Base Styles
- [x] Define semantic variables for profit/loss, exits, and alerts inside `:root` in [App.scss](file:///home/dev/projects/quantomate/packages/ui/client/src/styles/App.scss).
- [x] Align theme variables with Radix/Shadcn/Tailwind configuration properties in [tailwind.config.js](file:///home/dev/projects/quantomate/packages/ui/client/tailwind.config.js).
- [x] Unify standard background, border, and text rules in body resets to point to variable classes.

## Phase 2: Atomic Components Refactoring
- [x] Refactor [Button.tsx](file:///home/dev/projects/quantomate/packages/ui/client/src/components/atoms/Button.tsx) variants to use theme variables (`bg-primary`, `border-input`, etc.).
- [x] Refactor [Input.tsx](file:///home/dev/projects/quantomate/packages/ui/client/src/components/atoms/Input.tsx) classes to pointing to theme variables and clean up label margins.
- [x] Refactor [Select.tsx](file:///home/dev/projects/quantomate/packages/ui/client/src/components/atoms/Select.tsx) style definitions.

## Phase 3: Component SCSS Cleanup
- [x] Refactor [TradeList.scss](file:///home/dev/projects/quantomate/packages/ui/client/src/components/TradeList.scss) to use profit/loss/exit semantic variables and remove hardcoded hex values.
- [x] Refactor [Sidebar.scss](file:///home/dev/projects/quantomate/packages/ui/client/src/components/Sidebar.scss) layout, verifying the 72px width constraint is preserved.
- [x] Refactor [CollapsibleSection.scss](file:///home/dev/projects/quantomate/packages/ui/client/src/components/CollapsibleSection.scss) variables and border styles.
- [x] Refactor [PageToolbar.scss](file:///home/dev/projects/quantomate/packages/ui/client/src/components/PageToolbar.scss).

## Phase 4: Downstream UI & Chart Validation
- [x] Verify that [TradeList.tsx](file:///home/dev/projects/quantomate/packages/ui/client/src/components/TradeList.tsx) applies classes (e.g. `profit`, `loss`) pointing to variables correctly.
- [x] Ensure that [PriceChart.tsx](file:///home/dev/projects/quantomate/packages/ui/client/src/components/Charts/PriceChart.tsx) exit/trade lines reference the new semantic theme colors or variables rather than hardcoded colors.
- [x] Check layout margins and paddings for 4K monitor compatibility.
- [x] Verify there are no duplicate component creations.
