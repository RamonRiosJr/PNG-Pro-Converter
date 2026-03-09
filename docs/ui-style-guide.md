# UI & System Style Guide

Because `PNG-Pro-Converter` is pivoting from a simple utility into an elite SaaS product, the UI must reflect a premium ("Elon Musk / NEXT") aesthetic—dark, minimalist, hyper-responsive, and physics-driven.

## 1. Color Palette (Tailwind)

We operate in a strict dark mode environment to reduce eye strain and signal "Pro" utility.

- **Backgrounds**: Deep, rich darks. Primary backgrounds should be `bg-slate-950` with surface elevations on `bg-slate-900` or `bg-slate-800/50`.
- **Accents**: Neon energetic colors that signal action. `text-blue-400` or `text-cyan-400` for primary clicks, `text-emerald-400` for success markers.
- **Borders**: Sharp, thin separating lines (`border-slate-800` or `border-slate-700`).

## 2. Typography & Spacing

- Maintain standard system sans-serif (`font-sans`), leaning heavily into tracking (letter spacing) and varied weights to establish hierarchy.
- Use generous, consistent padding. Cards and file-uploader targets should breathe. Do not cramp elements.

## 3. Micro-Interactions (Physics)

Buttons and drag-and-drop zones must feel tactile.

- Include `transition-all duration-300` on any interactable element.
- Use `hover:shadow-lg hover:shadow-blue-500/20` to create a "glow" effect upon hover.

## 4. Component Structure

- A component file should render HTML. It should NOT manage complex business logic.
- UI must be "dumb". It should receive props (`onUpload`, `isProcessing`) and react purely visually.

## 5. Accessibility (Global Requirement)

- Screen reader text must be embedded using `sr-only` classes if visual text breaks the minimalist aesthetic.
- Color contrasts must strictly adhere to the AI persona matrix (`docs/architect-daily-prompt/08-ui-ux-accessibility-auditor.md`).
