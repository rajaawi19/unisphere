## Goal

Full rewrite of `src/routes/index.tsx` with a fresh, professional-portal layout that looks distinctly different from existing platforms — new structure, new copy angles, new sections, new visual language. No backend or auth changes.

## Visual direction

Professional portal aesthetic — think a polished product workspace landing, not a marketing brochure:

- Split, console-like hero with a live preview panel on the right
- Calm neutral surface + a single confident accent (kept from current tokens)
- Tight grid system, uppercase eyebrows, monospaced metadata labels, subtle dividers
- Bento-style information density instead of stacked equal sections
- All colors via existing semantic tokens in `src/styles.css` (no hardcoded colors)

## New section order (top → bottom)

1. **Top utility bar** — slim strip with status dot ("Onboarding open · Spring batch"), quick links (Explore, Projects, Hackathons), Sign in / Join.
2. **Console hero** (split layout)
  - Left: eyebrow tag, large headline ("The professional portal where students build, before they graduate."), subcopy, primary + secondary CTA, trust row.
  - Right: a mock "workspace" card — tabs (Feed · Projects · Teammates), a fake teammate match result, a fake project card, a typing chat bubble. Static mock, no logic.
3. **Live activity ticker** — horizontal auto-scrolling marquee of mock events ("Aarav joined Team Helios", "New project: CampusEats shipped v1", "Hackathon RoundUp registrations open"). Pure CSS keyframes marquee, pauses on hover.
4. **Smart features bento** — asymmetric 6-tile grid covering smart capabilities:
  - Smart matchmaking (large tile)
  - Real-time chat
  - Project rooms with tasks
  - Verified college badge
  - Hackathon hub
  - Portfolio export
   Each tile uses an icon, short title, one-line outcome, mini visual (mock chip / progress bar / avatar stack).
5. **Interactive teammate-finder demo** — visitor picks: Role (Dev / Designer / PM), Skill chips (toggle), Year. Below, three mock student cards re-render based on selection (filter from a local array — no network). Reinforces the "smart matching" promise.
6. **Project showcase wall** — bento grid of 6 mock student-built projects: cover gradient/illustration, title, stack chips, team avatar stack, "view case" link. Mixed tile sizes for rhythm.
7. **How it works (4 steps, horizontal rail)** — numbered rail with connecting line, condensed copy. Replaces old vertical "Journey" cards.
8. **Manifesto / founder note** — long-form typographic block on a contrasting surface: short letter ("Why we built UniSphere"), signed off, with a small avatar group at the end. Distinct typographic treatment vs the rest.
9. **Built-for marquee** — second marquee of role labels (Developers, Designers, Founders, Researchers, Open-source, Hackathon teams, Product managers, Data folks).
10. **Testimonials reinvented** — staggered masonry of 5 quotes with varied tile sizes, college tag, and a small "verified student" badge — replaces the old equal 3-card row.
11. **FAQ — two-column compact** — left column: category nav (Verification, OTP, Privacy, Matching, Pricing, Account). Right column: filtered accordion. All current 8 Q&As preserved. Replaces stacked accordion.
12. **Final CTA strip** — full-width band, single line headline, two buttons, micro trust line. Distinct from old rounded card.
13. **Footer** — multi-column (Product, For students, Company, Legal) + brand block. Replaces single centered footer.

## Technical details

- Single file rewrite: `src/routes/index.tsx`. No new components, no new routes, no dependencies.
- Reuse `Logo`, `Button`, `Accordion*`, lucide icons already imported.
- Keep existing `beforeLoad` redirect to `/feed` when session exists.
- Marquees: pure CSS via inline `<style>` block or Tailwind arbitrary keyframes (`animate-[marquee_30s_linear_infinite]`) — no library.
- Interactive teammate finder: local `useState`, mock array of ~8 students, filter client-side.
- All colors via tokens: `bg-background`, `bg-surface`, `bg-primary`, `text-muted-foreground`, `border`, `text-success`, `text-warning`, `bg-accent`, `bg-primary/10`, etc.
- Responsive: mobile single-column; bento grids collapse to 1–2 cols under `md`. Hero workspace card hides below `lg` and a simplified preview shows instead.
- Accessibility: semantic landmarks, single H1, alt text on decorative icons via `aria-hidden`, marquee respects `prefers-reduced-motion` (pause animation).
- SEO: keep title/meta as-is unless you want copy updates.

## Out of scope

- No edits to auth pages, app shell, mocks, or routes other than `index.tsx`.
- No new images generated unless you ask — using gradients, icons, and CSS illustrations.
- No analytics, no real backend hooks.

## Deliverable

One updated file: `src/routes/index.tsx` with all 13 sections above wired and styled.

Remainder : Not to do any changes in langing page . Do all changes in Home page (after login page) 