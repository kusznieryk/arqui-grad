# Arqui ASM — Exercises Dark Theme Redesign

## TL;DR

> **Quick Summary**: Apply dark theme to exercises pages (preserving structure) and fix login/register validation to show only Zod errors (removing browser validation interference).
>
> **Deliverables**:
> - exercises/page.tsx → dark theme, no gradients/emojis
> - exercises/[id]/page.tsx → dark theme, no gradients/emojis
> - admin/page.tsx → dark theme styling
> - login/page.tsx → fix browser validation interference (remove type="email"/"password", use text)
> - register/page.tsx → remove required attributes that trigger browser validation
>
> **Estimated Effort**: Short
> **Parallel Execution**: YES — 4 waves
> **Critical Path**: Wave 1 → Wave 2 → Wave 3 → QA

---

## Context

### Original Request
User wants to update all pages with dark theme styling and fix login validation errors that show browser native errors instead of Zod-styled errors.

### Interview Summary
**Key Discussions**:
- Login validation: Browser shows native validation popups before Zod errors are ugly/not styled
- Exercises pages: Need dark theme but keep existing structure/layout
- No changes to layout/structure — only visual styling

---

## Work Objectives

### Core Objective
Unified dark theme across all pages + clean Zod-only validation UX

### Concrete Deliverables
- `src/app/exercises/page.tsx` — dark theme, keep structure
- `src/app/exercises/[id]/page.tsx` — dark theme, keep structure
- `src/app/admin/page.tsx` — dark theme
- `src/app/login/page.tsx` — remove type="email"/"password" to prevent browser validation
- `src/app/register/page.tsx` — remove required attributes

### Must Have
- All pages use CSS variables from globals.css (--color-bg, --color-surface, etc.)
- No emoji anywhere — SVG or text only
- No gradients on backgrounds
- Login/register only show Zod-styled errors, not browser popups

### Must NOT Have
- No (session as any) casts outside auth.ts pattern
- No emoji in code or UI
- No blob animations or bounce effects

---

## Verification Strategy

### QA Policy
Every task includes agent-executed QA scenarios verified via Playwright.

---

## TODOs

- [x] 1. **exercises/page.tsx — dark theme**

  **What to do**:
  - Replace `bg-gradient-to-br from-indigo-50 via-white to-purple-50` with `bg-[var(--color-bg)]`
  - Replace all white backgrounds with `bg-[var(--color-surface)]`
  - Replace gray text colors with `text-[var(--color-text-primary)]`, `text-[var(--color-text-secondary)]`
  - Replace `bg-white rounded-lg shadow-lg` cards with `bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)]`
  - Remove emoji from getPracticaStyle (lines 33, 41, 49, 57) — use text like "P1", "P2", "P3"
  - Replace emoji in UI (🎓, 🔍, 📝, 🏷️, 📚, 🔍 filters, 💡, 🎯) with SVG icons or text
  - Replace gradient headers with solid dark backgrounds
  - Replace `bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600` with `bg-[var(--color-surface)] border-b border-[var(--color-border)]`
  - Keep all filters, search, and grouping logic exactly the same

  **Must NOT do**:
  - Do not change any logic (filtering, search, grouping)
  - Do not remove any features

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`tailwind-v4-shadcn`]
    - tailwind-v4-shadcn: Dark theme token system matches shadcn/ui patterns

  **References**:
  - `src/app/page.tsx:1-80` — dark theme pattern for reference (same globals.css tokens)
  - `src/app/login/page.tsx:55-67` — card styling pattern

  **QA Scenarios**:
  ```
  Scenario: Exercises page loads with dark theme
    Tool: Playwright
    Preconditions: App running, logged in
    Steps:
      1. Navigate to http://localhost:3000/exercises
      2. Wait for page to load
      3. Check background color (should be #0e0e0e)
      4. Verify exercise cards have dark surface (#141414)
      5. Take screenshot
    Expected Result: Dark themed page, no white/gradient backgrounds
    Evidence: .sisyphus/evidence/task-1-exercises-dark.png

  Scenario: Filter functionality works
    Tool: Playwright
    Preconditions: Exercises page loaded
    Steps:
      1. Type "suma" in search box
      2. Verify results filter in real-time
      3. Select a tag filter
      4. Verify combined filtering works
    Expected Result: Filtering works exactly as before
    Evidence: .sisyphus/evidence/task-1-filter-works.png
  ```

- [x] 2. **exercises/[id]/page.tsx — dark theme**

  **What to do**:
  - Replace `bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50` with `bg-[var(--color-bg)]`
  - Replace `bg-white rounded-lg shadow-lg border border-gray-200` with `bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)]`
  - Replace gradient header with solid dark header
  - Replace emoji (📚, 💡, 📋, 📊, 🎯, 🔍) with SVG icons or text
  - Replace `bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500` header with `bg-[var(--color-surface)] border-b border-[var(--color-border)]`
  - Replace score colors (bg-red-100, text-red-800) with dark theme equivalents
  - Keep all submission logic and score display exactly the same
  - Keep getScoreStyle function but change colors to dark theme
  - Replace 404 error page gradient with dark theme

  **Must NOT do**:
  - Do not change submission logic
  - Do not modify getScoreStyle function signature

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`tailwind-v4-shadcn`]

  **References**:
  - `src/app/page.tsx:1-80` — dark theme pattern
  - `src/app/exercises/page.tsx` — exercises dark theme from Task 1

  **QA Scenarios**:
  ```
  Scenario: Exercise detail page dark themed
    Tool: Playwright
    Preconditions: App running
    Steps:
      1. Navigate to http://localhost:3000/exercises/add-two-ints
      2. Wait for content to load
      3. Check page background
      4. Verify header has dark surface background
    Expected Result: Dark themed exercise detail page
    Evidence: .sisyphus/evidence/task-2-exercise-detail-dark.png

  Scenario: Submission history displays
    Tool: Playwright
    Preconditions: Exercise with submissions
    Steps:
      1. Navigate to an exercise with history
      2. Verify score cards show correctly styled
      3. Check color coding for scores
    Expected Result: Score colors use dark theme palette
    Evidence: .sisyphus/evidence/task-2-score-colors.png
  ```

- [x] 3. **admin/page.tsx — dark theme**

  **What to do**:
  - Wrap content in `bg-[var(--color-bg)]` container
  - Style the stats in cards with `bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)]`
  - Style button with `bg-[var(--color-accent)] text-[var(--color-bg)]`
  - Style link with accent color

  **Must NOT do**:
  - Do not change any functionality

  **References**:
  - `src/app/login/page.tsx` — dark card styling pattern

  **QA Scenarios**:
  ```
  Scenario: Admin page dark themed
    Tool: Playwright
    Preconditions: Logged in as admin
    Steps:
      1. Navigate to http://localhost:3000/admin
      2. Verify dark background
      3. Check button and link styling
    Expected Result: Dark themed admin page
    Evidence: .sisyphus/evidence/task-3-admin-dark.png
  ```

- [x] 4. **login/page.tsx — fix browser validation**

  **What to do**:
  - Change `type="email"` input to `type="text"` input (removes browser email validation)
  - Change `type="password"` input to `type="text"` input (removes browser password validation)
  - Add `autoComplete="email"` and `autoComplete="current-password"` for browser autofill without validation popup
  - Keep `noValidate` on form
  - Keep all Zod validation logic exactly the same
  - This ensures only Zod errors display, styled properly

  **Must NOT do**:
  - Do not change any validation logic
  - Do not remove error display

  **References**:
  - `src/lib/zod.ts:20-23` — LoginSchema for reference
  - `src/app/login/page.tsx` — current implementation

  **QA Scenarios**:
  ```
  Scenario: Empty email shows Zod error, not browser popup
    Tool: Playwright
    Preconditions: Login page loaded
    Steps:
      1. Click email field, type invalid email "notanemail"
      2. Click away (blur)
      3. Click Submit without filling anything
      4. Verify Zod error appears below field
      5. Verify browser popup does NOT appear
    Expected Result: Styled Zod error, no browser popup
    Evidence: .sisyphus/evidence/task-4-login-no-browser-popup.png

  Scenario: Invalid password shows Zod error
    Tool: Playwright
    Preconditions: Login page loaded
    Steps:
      1. Type valid email
      2. Type short password "123"
      3. Submit
      4. Verify "Contraseña requerida" error appears
    Expected Result: Zod error "Contraseña requerida" styled correctly
    Evidence: .sisyphus/evidence/task-4-login-zod-error.png
  ```

- [x] 5. **register/page.tsx — remove required attributes**

  **What to do**:
  - Remove `required` attribute from email input
  - Remove `required` attribute from password input
  - Remove `required` attribute from confirmPassword input
  - Keep all Zod validation and error display logic exactly the same
  - Keep noValidate on form (already present)

  **Must NOT do**:
  - Do not change any validation logic
  - Do not change error display styling

  **References**:
  - `src/app/register/page.tsx:131-140` — email input with required
  - `src/app/register/page.tsx:150-159` — password input with required
  - `src/app/register/page.tsx:184-193` — confirmPassword input with required

  **QA Scenarios**:
  ```
  Scenario: Empty register form shows only Zod errors
    Tool: Playwright
    Preconditions: Register page loaded
    Steps:
      1. Click Submit with all fields empty
      2. Verify no browser popup appears
      3. Verify Zod errors appear below fields
    Expected Result: Zod errors displayed, no browser popup
    Evidence: .sisyphus/evidence/task-5-register-no-browser-popup.png
  ```

- [x] F1. **Final QA — All pages dark themed, validation fixed**

  **What to do**:
  - Verify all 5 pages load with dark theme
  - Verify login/register only show Zod errors
  - Take comprehensive screenshots

  **QA Scenarios**:
  ```
  Scenario: Full site dark theme audit
    Tool: Playwright
    Preconditions: App running
    Steps:
      1. Visit / — verify dark theme
      2. Visit /login — verify dark + Zod validation
      3. Visit /register — verify dark + Zod validation
      4. Visit /exercises — verify dark theme
      5. Visit /exercises/add-two-ints — verify dark theme
      6. Visit /admin — verify dark theme
    Expected Result: All pages dark themed, consistent design
    Evidence: .sisyphus/evidence/final-audit.png
  ```

---

## Final Verification Wave

- [x] F1. **Design Consistency Check** — `oracle`
- [x] F2. **Build Verification** — `unspecified-high`
- [x] F3. **Cross-Page Navigation QA** — `unspecified-high` + `playwright`

---

## Success Criteria

- [ ] All 6 pages use dark theme CSS variables
- [ ] No emoji anywhere
- [ ] Login shows Zod errors, not browser popups
- [ ] Register shows Zod errors, not browser popups
- [ ] exercises/page.tsx structure preserved, styling dark
- [ ] exercises/[id]/page.tsx structure preserved, styling dark
- [ ] admin/page.tsx dark themed
- [ ] npm run build passes
