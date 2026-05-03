# JustFour — Constitution
**Version 1.0 · May 2026**
**Authority: This document is the single source of truth for product identity, design constraints, and scope. When in doubt, this wins.**

---

## 1. What JustFour Is

A web app where early-stage founders have a structured AI conversation that:
1. Extracts everything on their mind (brain dump)
2. Challenges each idea with one question: *"What has to be true before this matters?"*
3. Produces a dashboard with exactly two zones: **Focus Wall** (4 items max) and **Parking Lot** (everything else, organised by category with reasons)

**It is not a to-do app. It is a discipline tool.**

The AI is opinionated and assertive. It names the Founder's Trap directly and without softening. It makes calls, states reasoning, and holds its ground — while remaining open to a founder pushing back with genuine evidence.

Total time from login to dashboard: **under 10 minutes**.

---

## 2. Product Principles (Non-Negotiable)

| Principle | What it means in practice |
|-----------|--------------------------|
| **One dashboard per user, always** | No "start a new dashboard" option. Unique constraint on `user_id` in sessions table. Remove only in Phase 2. |
| **Paid from day one** | No free tier, no freemium, no "free for founders". During validation (20 users), payment is manual — but the principle holds. |
| **No progress bars in Stage 3** | The conversation does the work, not UI chrome. Progress indicators during the challenge chat are explicitly banned. |
| **No Slack, no calendar integrations** | A focus tool must not integrate with distraction sources. Not in scope, ever (Phase 1–2). |
| **No back navigation between stages** | A founder cannot use the browser back button or any UI element to return to a previous stage. The only escape is "Start over" (resets to Stage 0). |
| **The Trap is named, not softened** | When a founder dwells on premature topics, the AI calls it "The Founder's Trap" by name. The phrase is product-level copy, not generic warning text. |
| **Empty space is intentional** | Stage 0 is sparse by design. The restraint communicates confidence and respect for the founder's time. Do not fill it. |
| **Minimum 2 focus items, maximum 4** | The AI must never let a founder exit Stage 3 with fewer than 2 focus items. The wall caps at 4 — something must come off before anything is added. |

---

## 3. Phases

| Phase | Scope | Users | Payment |
|-------|-------|-------|---------|
| **Validation** (build this) | Full Stage 0–4 flow | 20 founders, invite-only | Free — no payment gateway |
| Phase 1 | Same features, public | Open signup | Razorpay gateway |
| Phase 2 | Task management, co-founder sharing, weekly check-in | — | — |

**You are building Validation phase only.** See Section 10 for the full deferred-features list.

---

## 4. Design System (Locked — Do Not Change)

### Typography

| Role | Font | Usage |
|------|------|-------|
| Display / section headers | Libre Baskerville, serif | Headline copy, editorial weight, section titles |
| Body / UI | Outfit, sans-serif | All body text, buttons, labels, inputs |
| Tags / labels / metadata | JetBrains Mono, monospace | Tag badges, counters, metadata labels |

Google Fonts import:
```
@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
```

### Colour Palette

| Token | Hex | Usage |
|-------|-----|-------|
| surface | #F7F6F3 | Page background |
| surface2 | #EFEEE9 | Assistant bubble, avatar bg, magic link confirmation bg |
| ink | #1A1A1A | Primary text, CTA background |
| ink2 | #6B6B6B | Secondary text |
| ink3 | #9B9B9B | Tertiary / muted text |
| border | #E2E1DC | Card borders, dividers |
| border-light | #F0EFEA | Inner dividers, dropdown dividers |
| trap.bg | #FEF2F2 | Trap alert + persistent error background |
| trap.border | #FECACA | Trap alert + persistent error border |
| trap.text | #991B1B | Trap alert text |
| trap.accent | #DC2626 | Trap red, logout text, email validation error |

### Tag Colours (4 categories — fixed, never extend in Validation)

| Tag | Accent | Badge bg | Badge text | Badge border |
|-----|--------|----------|------------|--------------|
| Product | #7C3AED | #F3F0FF | #6D28D9 | #E0D8FD |
| Team | #2563EB | #EFF6FF | #1D4ED8 | #DBEAFE |
| Revenue | #059669 | #ECFDF5 | #047857 | #D1FAE5 |
| Operations | #D97706 | #FFFBEB | #B45309 | #FEF3C7 |

### Layout Constants

- **Max width:** 640px, centered
- **Horizontal padding:** 20px
- **Touch targets:** minimum 44px on all interactive elements
- **TopBar height:** ~65px (sticky, `position: sticky; top: 0; z-index: 50`)

### Component-Level Tokens

**Calibration Chips (Stage 1)**

| State | Token | Value |
|-------|-------|-------|
| Unselected | bg | #FFFFFF |
| | border | 1px solid #E2E1DC |
| | border-radius | 10px |
| | padding | 14px 18px |
| | hover bg | #FAFAF8 |
| | hover border | #C4C3BE |
| Selected | bg | #1A1A1A |
| | text | #FFFFFF |
| | border | 1px solid #1A1A1A |
| Description (unselected) | color | #9B9B9B |
| Description (selected) | color | rgba(255,255,255,0.6) |
| Answer chip | padding | 10px 20px |
| | border-radius | 8px |
| | font | Outfit 14px 500 |

**Category Nudge Chips (Stage 2 Brain Dump)**

| Token | Value |
|-------|-------|
| bg | #FFFFFF |
| border | 1px dashed #D4D3CE |
| border-radius | 20px |
| padding | 8px 16px |
| font | Outfit 13px 500 |
| color | #6B6B6B |
| hover bg | #EFEEE9 |

**Idea Counter Badge (Stage 2)**

| Token | Value |
|-------|-------|
| font | JetBrains Mono 12px 500 |
| color | #047857 |
| bg | #ECFDF5 |
| border | 1px solid #D1FAE5 |
| border-radius | 6px |
| padding | 4px 10px |

**Email Input + CTA Button (Homepage)**

| Element | Token | Value |
|---------|-------|-------|
| Email input | height | 52px |
| | border-radius | 12px |
| | border | 1px solid #E2E1DC |
| | focus border | #1A1A1A |
| | font | Outfit 15px 400 |
| CTA button | height | 52px |
| | border-radius | 12px |
| | bg | #1A1A1A |
| | hover bg | #333333 |
| | font | Outfit 16px 600 |

**Magic Link Confirmation**

| Element | Value |
|---------|-------|
| Container bg | #EFEEE9 (surface2) |
| Container border-radius | 16px |
| Container padding | 36px 32px |
| Envelope icon | 56px square, white bg, 14px radius |
| Email display font | JetBrains Mono 14px 500 |
| Action links | Outfit 13px 500, #6B6B6B, hover #1A1A1A |
| Vertical divider | 1px × 16px, #D4D3CE |
| Resend success color | #047857 |

**Return Visit Banner**

| Token | Value |
|-------|-------|
| bg | #FFFBEB |
| border | 1px solid #FEF3C7 |
| border-radius | 12px |
| icon bg | #FEF3C7 |
| title color | #92400E |
| body color | #A16207 |

---

## 5. Component Map — Design → Engineering

Every component has a single locked design source and a single engineering destination. This table is authoritative.

| Component | Design source | Engineering file |
|-----------|--------------|-----------------|
| Homepage | `homepage_final.jsx` | `app/page.tsx` |
| Magic link confirmation | `homepage_final.jsx` | `components/auth/MagicLinkSent.tsx` |
| TopBar (all variants) | All mockup files | `components/shell/TopBar.tsx` |
| Stage 0 — Arrival | `onboard_screens_final.jsx` | `components/onboard/ArrivalScreen.tsx` |
| Stage 1 — Calibration | `onboard_screens_final.jsx` | `components/onboard/CalibrationChips.tsx` |
| Stage 2 — Brain Dump | `onboard_screens_final.jsx` | `components/onboard/BrainDumpArea.tsx` |
| Return Visit Banner | `onboard_screens_final.jsx` | `components/onboard/ReturnVisitBanner.tsx` |
| Error states (all 4) | `onboard_screens_final.jsx` | `components/chat/ErrorToast.tsx` |
| Stage 3 — Chat container | `stage3_chat_final.jsx` | `components/chat/ChatContainer.tsx` |
| Message bubble | `stage3_chat_final.jsx` | `components/chat/MessageBubble.tsx` |
| Streaming indicator | `stage3_chat_final.jsx` | `components/chat/StreamingIndicator.tsx` |
| Trap alert (dashboard) | `stage4_dashboard_final.jsx` | `components/dashboard/TrapAlert.tsx` |
| Focus wall | `stage4_dashboard_final.jsx` | `components/dashboard/FocusWall.tsx` |
| Parking lot | `stage4_dashboard_final.jsx` | `components/dashboard/ParkingLot.tsx` |

**Superseded files (do not use):** `stage3_chat_mockup`, `stage4_dashboard_mockup`, `v2`, `v3`, `v4` variants. Use only the `_final` files.

---

## 6. TopBar Variants

The TopBar is a single shared component (`components/shell/TopBar.tsx`) with three variants controlled by a `variant` prop.

| Variant | When used | What's shown |
|---------|-----------|-------------|
| `public` | Homepage (pre-login) | Wordmark only. No avatar, no menu. |
| `onboard` | Stages 0–3 | Wordmark + "Start over" text link (when applicable) + avatar menu |
| `dashboard` | Stage 4 | Wordmark + avatar menu (no "Start over") |

**"Start over" rule:** Only rendered during Stages 1–3 (not Stage 0 — there's nothing to start over from). Same action as the Return Visit Banner's "Start over" button.

---

## 7. The Stage Machine

`sessions.stage` (integer) is the single source of truth for where a founder is. There are no other indicators.

| Value | Name | Route | Back possible? |
|-------|------|-------|----------------|
| 0 | Arrival | `/onboard` | No |
| 1 | Calibration | `/onboard` | No |
| 2 | Brain dump | `/onboard` | No |
| 3 | Challenge chat | `/onboard` | No |
| 4 | Dashboard | `/dashboard` | No |

**Transitions:**
- `0 → 1`: Founder clicks "Dump your list →"
- `1 → 2`: All calibration questions answered (800ms pause + auto-advance)
- `2 → 3`: "I'm done" clicked with ≥5 ideas + category sweep complete
- `3 → 4`: AI outputs `\`\`\`dashboard` JSON block, backend parses + validates + writes to DB

**Reset path:** "Start over" (Stages 1–3 only) → hard-delete messages + reset stage to 0 + clear context JSON → redirect to `/onboard`

---

## 8. Behaviour Rules (AI)

These are product-level constraints on the AI's behaviour. They must be encoded in the Stage 3 system prompt and must not drift.

1. **Maximum 4 items on the Focus Wall.** When it hits 4, the AI must say directly: *"Your focus wall is full. Something has to come off before we add anything."* The founder decides what to cut.
2. **Minimum 2 items on the Focus Wall.** Never let a founder exit Stage 3 with fewer than 2 focus items.
3. **Name the Founder's Trap.** When a founder dwells on premature topics (fundraising before traction, org design before product, global expansion before a pilot), the AI says: *"This is the Founder's Trap. These are real questions. They're just not your questions yet."* One paragraph. Then move on.
4. **Assert, don't ask.** The AI makes its call and states reasoning. The founder can push back. The AI considers it — sometimes concedes, sometimes holds firm. Never presents a menu of options.
5. **Work categories in order:** Product/Technology → Team & co-founder → Partnerships → Branding & marketing → Fundraising & investors → Operations.
6. **Draw out more before making calls.** For each category, ask what else the founder is thinking before deciding focus vs. park.

---

## 9. What Is and Is Not on the Homepage

The homepage is validation-minimal. It is **not** the full landing page.

**What's on the homepage:**
- Hero (headline + subheadline)
- Recognition cards (3 cards showing founder pain)
- Insight (italic opening + body paragraph)
- CTA (email input + button)
- Footer

**Explicitly deferred to Phase 1 landing page:**
- Product tease / dashboard screenshot
- Testimonial quotes
- "How it works" section
- Pricing section
- Secondary CTA at bottom

**Homepage copy variants:** `homepage_variants.jsx` contains 5 narrative variants (JustFour, Week, Trap, Staircase, Club) for A/B testing. The locked default is the `justfour` variant. Design and structure are identical across all 5.

---

## 10. What Is Not In Scope (Validation Phase)

Do not build, design for, or scaffold these features.

| Feature | When |
|---------|------|
| Editable task list (checkboxes, sub-items) | Phase 2 |
| Ongoing conversation from dashboard | Phase 2 |
| Weekly check-in | Phase 2 |
| Co-founder sharing | Phase 2 |
| Razorpay subscriptions | Phase 1 |
| Mobile-optimised layout | Phase 1 (don't break it, don't optimise it) |
| PostHog / Sentry / error tracking | Phase 1 |
| Prompt versioning (DB-stored) | Phase 1 |
| Admin panel | Phase 1 |
| Data export / deletion | Phase 1 |
| Multiple dashboards per user | Never |
| Free tier / freemium | Never |
| Progress bars in Stage 3 | Never |
| Slack / calendar integrations | Never |

---

## 11. Key Decisions (Rationale Preserved)

| # | Decision | Why |
|---|----------|-----|
| 1 | One session per user (unique constraint on `user_id`) | One dashboard is a design decision, not a limitation. Remove in Phase 2 if multi-session needed. |
| 2 | Stage stored as integer, not enum | Simpler queries, easier to extend (Stage 5 needs no migration). |
| 3 | Calibration answers stored as JSON, not columns | Schema varies by startup stage. JSON avoids N nullable columns. |
| 4 | Dashboard stored as JSON, not normalised tables | Read-heavy, write-once. Normalising adds complexity with no benefit at this scale. |
| 5 | Messages saved immediately (user) / after stream (assistant) | Conversation survives browser crash. Partial AI responses are not saved — they re-generate on retry. |
| 6 | No WebSockets | Vercel AI SDK uses SSE (HTTP streaming). WebSockets add deployment complexity on Vercel serverless. |
| 7 | Magic link confirmation is an inline morph, not a page | The CTA area morphs into the confirmation card. The rest of the page dims to opacity 0.3 (pointer-events none). |
| 8 | Category sweep is inline, not a modal | After "I'm done", unmentioned category nudge appears below the textarea. One category at a time. No popups. |
| 9 | Error states are inline in the chat flow | Not browser toasts, not modals. Cards inside the message flow. |
| 10 | Persistent error disables input | After 3 consecutive failures, input shows "Conversation paused" and is disabled. No retry button. |
| 11 | Brain dump counter is client-side only | Split text on `\n` and `,`, filter fragments < 4 chars. No AI call for counting. |
| 12 | Dashboard transition is not auto-navigate | When the dashboard is ready, show "Your dashboard is ready." + a button. Do NOT auto-redirect. The founder must feel the moment. |
| 13 | System prompts in code, not DB | For 20 users, a deploy is fast enough for prompt changes. Migrate to DB in Phase 1. |
| 14 | No Sentry during validation | 20 users + Vercel's built-in logs is sufficient. Add before Phase 1. |

---

## 12. Spec Deviations from Engineering Spec (Design Wins)

The following design decisions deviate from the original engineering spec. The design version is what gets built.

| # | Topic | Eng spec said | Design decision |
|---|-------|--------------|-----------------|
| 1 | Stage 1 → Stage 2 transition | Explicit "Next" button | Auto-advance after last answer: 800ms pause + green confirmation text |
| 2 | Magic link confirmation | Change button text to "Link sent" | Entire CTA area morphs into confirmation card. Rest of page dims to 0.3 opacity. |
| 3 | Category sweep | Not specified | Inline below textarea, one category at a time, two actions: "Yes, let me add" / "Nothing there" |
| 4 | Error states | "Show error" | Inline cards in the chat message flow — NOT browser toasts or modals |
| 5 | Persistent error | Not specified | Input field disabled, placeholder shows "Conversation paused", no retry button |

---

*This constitution is complete as of May 2026. It covers the full Validation phase scope.*
*Update this document when product decisions change — not just the engineering spec.*
