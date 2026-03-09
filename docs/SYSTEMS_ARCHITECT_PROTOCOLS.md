# Systems Architect Protocols

This file serves as the definitive engineering standard for the `PNG-Pro-Converter` SaaS repository.

## 1. The Anti-"God Document" Rule

We do not accept monolithic files. This applies to both code and documentation.

- Knowledge must be fragmented logically.
- `ARCHITECTURE.md` at the root is forbidden. It must be broken down into atomic markdown files within `docs/architecture/`.
- UI/UX specs live in their own atomic scopes.

## 2. Global UI / Styling Standards

- **Source of Truth**: All UI guidelines are strictly governed by `docs/ui-style-guide.md`.
- **Framework**: Tailwind CSS exclusively. No inline styles. No raw CSS files outside of the entry point injects.
- **Accessibility**: UI elements must pass the WCAG AAA contrast ratio standards.

## 3. Branching Strategy

We enforce strict semantic branching models:

- `chore/...` - Structural setups, protocols, dependency bumps.
- `feat/...` - New measurable features that impact MRR or user capabilities.
- `fix/...` - Regression patching and CI lifecycle patches.
- `refactor/...` - Atomizing code, moving logic to hooks, performance scaling (WASM/Workers).

## 4. Code Autonomy (The FSD Island Concept)

- **Hooks**: Logic always lives in custom hooks (`/hooks`). Components should ONLY consume state, not calculate it.
- **Components**: Never exceed 150 lines. If a component exceeds this, shatter it into subcomponents (`/components/features/...`).

*All developers and AI agents must actively reference this protocol before submitting a Pull Request.*
