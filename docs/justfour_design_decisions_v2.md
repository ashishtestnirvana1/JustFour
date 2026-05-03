# JustFour — Design Decisions (Complete)
**Created: May 2026 · Final after design session 3**

---

## Status — All screens designed & locked

- **Homepage** — Logged-out landing page, validation-minimal (`homepage_final.jsx`)
- **Magic link confirmation** — Inline state after email submit (`homepage_final.jsx`)
- **Stage 0** — Arrival screen (`onboard_screens_final.jsx`)
- **Stage 1** — Calibration chips (`onboard_screens_final.jsx`)
- **Stage 2** — Brain dump area (`onboard_screens_final.jsx`)
- **Stage 3** — Challenge conversation chat interface (`stage3_chat_final.jsx`)
- **Stage 4** — Dashboard with focus cards + parking lot (`stage4_dashboard_final.jsx`)
- **Shell** — TopBar component (applied to all screens)
- **Return visit banner** — For stages 1–3 (`onboard_screens_final.jsx`)
- **Error states** — API error, rate limit, stream drop, persistent (`onboard_screens_final.jsx`)

**Nothing remains to design. Ready for engineering.**

---

## Design System (unchanged from session 1)

### Typography
- **Display / section headers:** Libre Baskerville, serif
- **Body / UI:** Outfit, sans-serif
- **Tags / labels / metadata:** JetBrains Mono, monospace

### Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| surface | #F7F6F3 | Page background |
| surface2 | #EFEEE9 | Assistant bubble, avatar bg |
| ink | #1A1A1A | Primary text, CTA bg |
| ink2 | #6B6B6B | Secondary text |
| ink3 | #9B9B9B | Tertiary / muted text |
| border | #E2E1DC | Card borders, dividers |
| border-light | #F0EFEA | Inner dividers |
| trap.bg | #FEF2F2 | Trap alert + persistent error bg |
| trap.border | #FECACA | Trap alert + persistent error border |
| trap.text | #991B1B | Trap alert text |
| trap.accent | #DC2626 | Trap red, logout text |

### Tag Colors (4 categories — unchanged)
| Tag | Accent | Badge bg | Badge text | Badge border |
|-----|--------|----------|------------|--------------|
| Product | #7C3AED | #F3F0FF | #6D28D9 | #E0D8FD |
| Team | #2563EB | #EFF6FF | #1D4ED8 | #DBEAFE |
| Revenue | #059669 | #ECFDF5 | #047857 | #D1FAE5 |
| Operations | #D97706 | #FFFBEB | #B45309 | #FEF3C7 |

---

## New Tokens (from design session 2)

### Calibration Chips

| Element | Token | Value |
|---------|-------|-------|
| Chip (unselected) | bg | #FFFFFF |
| | border | 1px solid #E2E1DC |
| | border-radius | 10px |
| | padding | 14px 18px |
| | hover bg | #FAFAF8 |
| | hover border | #C4C3BE |
| Chip (selected) | bg | #1A1A1A |
| | text | #FFFFFF |
| | border | 1px solid #1A1A1A |
| Chip description | font | Outfit 13px 400 |
| | color (unselected) | #9B9B9B |
| | color (selected) | rgba(255,255,255,0.6) |
| Answer chip | padding | 10px 20px |
| | border-radius | 8px |
| | font | Outfit 14px 500 |

### Category Nudge Chips (Brain Dump)

| Token | Value |
|-------|-------|
| bg | #FFFFFF |
| border | 1px dashed #D4D3CE |
| border-radius | 20px |
| padding | 8px 16px |
| font | Outfit 13px 500 |
| color | #6B6B6B |
| hover bg | #EFEEE9 |

### Idea Counter Badge

| Token | Value |
|-------|-------|
| font | JetBrains Mono 12px 500 |
| color | #047857 |
| bg | #ECFDF5 |
| border | 1px solid #D1FAE5 |
| border-radius | 6px |
| padding | 4px 10px |

### Return Visit Banner

| Token | Value |
|-------|-------|
| bg | #FFFBEB |
| border | 1px solid #FEF3C7 |
| border-radius | 12px |
| icon bg | #FEF3C7 |
| title color | #92400E |
| body color | #A16207 |

### Error States

| Variant | bg | border | icon bg |
|---------|-----|--------|---------|
| api_error | #FFFFFF | #E2E1DC | #F3F4F6 |
| rate_limit | #FFFFFF | #E2E1DC | #FFFBEB |
| stream_drop | #FFFFFF | #E2E1DC | #FEF3C7 |
| persistent | #FEF2F2 | #FECACA | #FEE2E2 |

### Homepage

| Element | Token | Value |
|---------|-------|-------|
| Email input | height | 52px |
| | border-radius | 12px |
| | border | 1px solid #E2E1DC |
| | focus border | #1A1A1A |
| | bg | #FFFFFF |
| | font | Outfit 15px 400 |
| CTA button (hero) | height | 52px |
| | border-radius | 12px |
| | bg | #1A1A1A |
| | hover bg | #333333 |
| | font | Outfit 16px 600 |
| Recognition card | bg | #FFFFFF |
| | border | 1px solid #E2E1DC |
| | border-radius | 10px |
| | padding | 16px 20px |
| Divider dots | size | 4px circle |
| | color | #D4D3CE |

### Magic Link Confirmation

| Element | Token | Value |
|---------|-------|-------|
| Container | bg | #EFEEE9 (surface2) |
| | border-radius | 16px |
| | padding | 36px 32px |
| Envelope icon | size | 56px square |
| | bg | #FFFFFF |
| | border-radius | 14px |
| Email display | font | JetBrains Mono 14px 500 |
| Action links | font | Outfit 13px 500 |
| | color | #6B6B6B |
| | hover color | #1A1A1A |
| Divider between links | 1px × 16px, #D4D3CE |
| Resend success | color | #047857 |

---

## Screen-by-Screen Specs (Session 2 + 3)

### Homepage (`/`)

**File:** `app/page.tsx` — component in `homepage_final.jsx`

**TopBar variant:** `public` (wordmark only, no avatar, no menu)

**Layout:** Single column, 640px max-width. Content reads top to bottom in one scroll.

**Structure (5 sections):**

**1. Hero** (paddingTop 80px, marginBottom 64px)
- Headline: "Stop doing everything." (Libre Baskerville 36px 700, -0.03em, line-height 1.15)
- Subheadline: "Four things. This week. That's it." (Outfit 18px, #6B6B6B)
- Animates: fadeUp 0.8s ease-out

**2. Recognition — 3 cards** (marginBottom 48px)
- Three stacked cards, 10px gap, each with emoji + text
- Card: white bg, #E2E1DC border, 10px radius, 16px 20px padding
- Text: Outfit 14px, #1A1A1A
- Closing line below cards: "This is the Founder's Trap. Every founder falls in. Most never notice." (Outfit 14px 600, #991B1B, centered)
- Animates: fadeUp 0.8s ease-out, 0.15s delay

**3. Divider** — three 4px dots, #D4D3CE, centered, 48px margin

**4. Insight** (marginBottom 56px)
- Italic opening: "Not all your ideas are wrong. Most of them are just early." (Libre Baskerville 17px italic, #4B4B4B, line-height 1.7)
- Body paragraph: (Outfit 15px, #6B6B6B, line-height 1.7, marginTop 16px)
- Animates: fadeUp 0.8s ease-out, 0.3s delay

**5. CTA area** (animation: fadeUp 0.8s, 0.45s delay)
- Header: "Ready to find out?" (Libre Baskerville 20px 700)
- Subtext: "One conversation. Under 10 minutes. A plan you can actually act on." (Outfit 14px, #9B9B9B)
- Input row: email input (flex: 1, 52px height) + CTA button ("Dump your list →", Outfit 15px 600)
- Input focus: border transitions to #1A1A1A
- Validation error: "Enter a valid email" in red below input, input border turns #DC2626
- Submit: button text changes to "Sending...", bg to #6B6B6B, disabled state

**6. Footer** (marginTop 80px, borderTop #E2E1DC)
- Left: "JustFour © 2026" (Outfit 13px, #9B9B9B)
- Right: "Built for founders who are ready to be honest about this week." (Outfit 13px italic, #B0B0B0)

**What's NOT here (deferred to Phase 1 full landing page):**
- Product tease / dashboard screenshot
- Testimonial quotes
- "How it works" section
- Pricing
- Secondary CTA at bottom

---

### Magic Link Confirmation

**File:** `components/auth/MagicLinkSent.tsx` — component in `homepage_final.jsx`

**Trigger:** Email submitted successfully on homepage.

**Position:** Inline replacement of the CTA area. NOT a separate page or modal. The rest of the homepage content above is visible but dimmed (opacity 0.3, pointer-events none) so the confirmation card is the clear focal point.

**Design:** Rounded card (#EFEEE9 bg, 16px radius, 36px 32px padding), centered text.

**Content (top to bottom):**
1. **Envelope icon** — ✉ in a 56px white square with 14px radius. Scale-pops in (0.7 → 1, 0.6s ease, 0.2s delay).
2. **Headline** — "Check your email." (Libre Baskerville 20px 700)
3. **Email address** — shown in monospace (JetBrains Mono 14px 500, #1A1A1A) so the founder can verify it's correct. Word-break on long addresses.
4. **Instruction** — "We sent a magic link. Click it to get started — no password needed." (Outfit 14px, #6B6B6B, max-width 320px centered)
5. **Actions** — two text links separated by a 1px vertical divider:
   - "Resend link" — on click: shows "Sending..." then "✓ Sent again" (green #047857). Resets on next click.
   - "Different email" — returns to the email input state, clears the field, focuses the input.

**Entry animation:** scale(0.96) → scale(1) + opacity, 0.5s ease-out.

**Eng spec alignment:**
- The eng spec says: "No loading spinner on the button — disable it and change text to 'Link sent'". The design extends this: instead of just changing the button text, the entire CTA area morphs into the confirmation card. The button text change ("Sending...") happens during the API call, then the card replaces the area.

---

### Stage 0 — Arrival Screen

**File:** `components/onboard/ArrivalScreen.tsx`

**Layout:** Vertically + horizontally centered in the viewport (below TopBar). Max-width 440px on text content.

**Content (top to bottom):**
1. **Headline** (Libre Baskerville 28px 700, -0.03em tracking): "Let's figure out what you should actually be working on this week."
2. **Subtext** (Outfit 15px, #9B9B9B): "10 minutes. One conversation. A clear plan."
3. **CTA** (Outfit 16px 600, #1A1A1A bg, white text, 12px radius, 16px 40px padding): "Dump your list →"

**Behaviour:**
- Entire content block fades up on mount (0.8s ease-out)
- CTA has subtle translateY(-1px) hover lift
- Click → update session stage to 1, render CalibrationChips

**What's NOT here:**
- No product tour
- No "here's how it works"
- No progress bar
- No first name (not collected at signup)
- No "Start over" in TopBar (this is stage 0 — nothing to start over from)

**Design rationale:** The screen is intentionally sparse. The empty space communicates confidence and respect for the founder's time. The serif headline carries editorial weight. One button, one action.

---

### Stage 1 — Calibration Chips

**File:** `components/onboard/CalibrationChips.tsx`

**Layout:** Single column, top-aligned (paddingTop 60px). Questions reveal progressively downward.

**Question 1 — Startup stage:**
- Header: "Where are you right now?" (Libre Baskerville 22px 700)
- Subtext: "This calibrates the conversation to your stage." (Outfit 14px, #9B9B9B)
- 5 full-width chip buttons, stacked vertically, 8px gap
- Each chip shows: label (Outfit 15px 600) + description line (Outfit 13px, #9B9B9B)
- Selected chip: #1A1A1A bg, white text, description at 60% opacity
- Once selected: all chips dim to 0.4 opacity except the selected one (non-interactive)

**Question 2 — Stage-adaptive:**
- Questions appear one at a time below Question 1
- Each question animates in (translateY 16px → 0, 0.4s ease)
- Answer chips are horizontal (flex-wrap), not full-width
- Once answered: question dims to 0.5 opacity, next question appears
- Answer chip options match the PM spec exactly per stage

**Completion transition:**
- When all questions answered: green confirmation text ("Got it. Let's get everything out of your head.") + pulsing dots
- 800ms pause → auto-advance to Stage 2

**State shape saved to `sessions.context`:**
```json
{
  "startup_stage": "ideation",
  "has_prototype": "No",
  "spoken_customer": "No",
  "has_cofounder": "No"
}
```

**Design rationale:** One-at-a-time progressive reveal avoids the "survey feel" that causes bounce. Dimming answered questions creates a vertical trail of decisions — the founder can glance back but the focus is always forward.

---

### Stage 2 — Brain Dump Area

**File:** `components/onboard/BrainDumpArea.tsx`

**Layout:** Single column with fixed bottom bar.

**Header row (flex, space-between):**
- Left: "Everything you're thinking about doing in the next 30 days." (Libre Baskerville 18px 700)
- Right: Idea counter badge (appears after first idea, JetBrains Mono 12px on green badge)

**Subtext:** "Product, fundraising, team, sales, admin, random ideas, worries. Don't edit yourself." (Outfit 14px, #9B9B9B)

**Textarea:**
- Full width, min-height 200px, auto-grow
- 12px border-radius, 16px 18px padding
- White bg, #E2E1DC border, focus border #C4C3BE
- Outfit 15px, line-height 1.7
- Placeholder shows example ideas (multi-line, in gray)

**Idea counter logic:**
- Split text on newlines and commas
- Filter fragments < 4 chars
- Display: "{N} ideas" or "{N} idea"

**Category nudge chips:**
- Appear after 30 seconds of no typing (3s in mockup for demo)
- Only show categories NOT mentioned in text (keyword matching)
- Label "What about..." in #9B9B9B above the chip row
- Pill-shaped (20px radius), dashed border, horizontal wrap
- Tapping inserts `\n{Category label}: ` at cursor and refocuses textarea
- Categories: Product / Tech, Team & co-founder, Fundraising, Partnerships, Branding & marketing, Operations

**Category keyword matching (client-side, no AI):**
| Category | Match keywords |
|----------|---------------|
| Product / Tech | product, tech, build, prototype, software, hardware, code, develop, feature, mvp, app |
| Team & co-founder | team, hire, co-founder, cofounder, engineer, recrui, people, talent |
| Fundraising | fund, invest, rais, capital, money, seed, series, vc, angel |
| Partnerships | partner, collab, alliance, deal, integrat, vendor, supplier |
| Branding & marketing | brand, market, logo, design, social, content, launch, pr, advertising |
| Operations | ops, operat, admin, legal, compliance, process, logistics, sales, customer, pilot |

**"I'm done" fixed bottom bar:**
- Left: progress text
  - Below 5 ideas: "Keep going — {N} more ideas to unlock the next step" (#9B9B9B)
  - 5+ ideas: "{N} ideas captured — ready when you are" (#6B6B6B)
- Right: "I'm done" button
  - Disabled (gray) below 5 ideas
  - Active (#1A1A1A) at 5+ ideas

**Category sweep (after "I'm done"):**
- If unmentioned categories exist: show inline nudge card (#EFEEE9 bg, 10px radius)
- Copy: "You haven't mentioned {category} — anything there, even half-formed thoughts?"
- Two actions: "Yes, let me add" (inserts category label, returns to editing) | "Nothing there" (moves to next unmentioned category)
- After all categories swept (or no unmentioned): advance to Stage 3

**What's saved:** Full textarea text as a single `user` message with stage=2.

---

### Return Visit Banner

**File:** `components/onboard/ReturnVisitBanner.tsx`

**Trigger:** Returning authenticated user at session stage 1, 2, or 3.

**Position:** Below TopBar, above the stage content. 16px top padding.

**Design:** Amber-toned card (#FFFBEB bg, #FEF3C7 border, 12px radius). Left-aligned icon (↩ in #FEF3C7 circle, 36px, 10px radius).

**Copy by stage:**
| Stage | Title | Body |
|-------|-------|------|
| 1 | "Welcome back." | "You were setting up — want to continue where you left off?" |
| 2 | "You were mid-brain-dump." | "Your ideas are still here. Pick up where you left off, or start fresh." |
| 3 | "You left mid-conversation." | "Your progress is saved. Continue from where you stopped, or start over." |

**Actions:**
- **Continue** (Outfit 13px 600, #1A1A1A bg, white text, 8px radius): dismisses banner, shows current stage content with existing state
- **Start over** (Outfit 13px 500, transparent bg, #9B9B9B text): triggers session reset to stage 0, deletes messages, reloads

**Animation:** Slides in from top (translateY -12px → 0, 0.4s ease).

**Note:** The TopBar's "Start over" text link (in the onboard variant) is a second path to the same reset action. The banner is the gentle nudge; the TopBar link is the persistent escape hatch.

---

### Error States

**File:** `components/chat/ErrorToast.tsx`

**Position:** Inline in the chat message flow, below the last message. NOT a browser toast or modal.

**4 variants:**

#### 1. API Error (`api_error`)
- **Trigger:** Anthropic API returns 5xx
- **Icon:** ↻ in #F3F4F6 circle
- **Title:** "Something went wrong."
- **Body:** "Your conversation is saved. Tap to try again."
- **Action:** "Retry" button
- **Behaviour:** 1 automatic retry with 2s delay, then show this state

#### 2. Rate Limit (`rate_limit`)
- **Trigger:** Anthropic API returns 429
- **Icon:** ⏳ in #FFFBEB circle
- **Title:** "Busy right now."
- **Body:** "Lots of founders thinking hard today. Try again in a moment."
- **Action:** "Try again" button
- **Behaviour:** Exponential backoff: 5s, 15s, 30s

#### 3. Stream Drop (`stream_drop`)
- **Trigger:** SSE connection drops mid-response
- **Icon:** ⚡ in #FEF3C7 circle
- **Title:** "Connection lost."
- **Body:** "Your last message was saved. Tap to pick up where we left off."
- **Action:** "Continue" button
- **Special:** Shows partial AI message above the error card, with a blinking cursor at the truncation point. The partial message uses the standard assistant bubble style (#EFEEE9, left-aligned).
- **Behaviour:** On retry, re-send full message history — partial response is NOT saved to DB

#### 4. Persistent Failure (`persistent`)
- **Trigger:** 3 consecutive failures of any type
- **Icon:** ⚠ in #FEE2E2 circle
- **Title:** "We're having trouble right now."
- **Body:** "Your conversation is saved — come back in a few minutes and you'll pick up exactly where you left off."
- **Action:** None (no retry button)
- **Special:** Uses trap palette (#FEF2F2 bg, #FECACA border, #991B1B text). Input field is disabled and shows "Conversation paused."
- **Design:** Red-tinted to signal severity without panic

**Shared error card design:**
- White bg (or red-tinted for persistent), 12px radius, standard border
- Icon: 32px square, 8px radius, left-aligned
- Title: Outfit 14px 600
- Body: Outfit 13px, #6B6B6B (or #991B1B for persistent)
- Retry button: 8px radius, #FAFAF8 bg, 13px 600. Hover inverts to #1A1A1A bg + white text.
- Entry animation: translateY 8px → 0, 0.3s ease

---

## Component Map (complete)

| Eng spec component | Design file | Status |
|--------------------|-------------|--------|
| `app/page.tsx` (Homepage) | homepage_final.jsx | ✅ Locked |
| `components/auth/MagicLinkSent.tsx` | homepage_final.jsx | ✅ Locked |
| `components/shell/TopBar.tsx` | All mockup files | ✅ Locked |
| `components/onboard/ArrivalScreen.tsx` | onboard_screens_final.jsx | ✅ Locked |
| `components/onboard/CalibrationChips.tsx` | onboard_screens_final.jsx | ✅ Locked |
| `components/onboard/BrainDumpArea.tsx` | onboard_screens_final.jsx | ✅ Locked |
| `components/onboard/ReturnVisitBanner.tsx` | onboard_screens_final.jsx | ✅ Locked |
| `components/chat/ErrorToast.tsx` | onboard_screens_final.jsx | ✅ Locked |
| `components/chat/ChatContainer.tsx` | stage3_chat_final.jsx | ✅ Locked |
| `components/chat/MessageBubble.tsx` | stage3_chat_final.jsx | ✅ Locked |
| `components/chat/StreamingIndicator.tsx` | stage3_chat_final.jsx | ✅ Locked |
| `components/dashboard/TrapAlert.tsx` | stage4_dashboard_final.jsx | ✅ Locked |
| `components/dashboard/FocusWall.tsx` | stage4_dashboard_final.jsx | ✅ Locked |
| `components/dashboard/ParkingLot.tsx` | stage4_dashboard_final.jsx | ✅ Locked |

---

## Spec Changes from Design Session 2

These are new deviations from the engineering spec discovered during design.

### 1. Stage 1 auto-advances to Stage 2
- No explicit "Next" button. When the last calibration question is answered, a 800ms pause + green confirmation text + auto-transition.
- **Eng impact:** The frontend handles this — after all Q2 answers collected, save context, update stage, render BrainDumpArea.

### 2. Brain dump counter uses simple splitting
- Idea count = text split on `\n` and `,`, filtered for length > 3 chars.
- Client-side only. No AI call for counting.

### 3. Category sweep is inline, not a modal
- After "I'm done", if unmentioned categories exist, a nudge card appears inline below the textarea (not a popup).
- One category at a time. "Nothing there" advances to next. "Yes, let me add" inserts the category label and returns to editing mode.
- After all categories swept → advance to Stage 3.

### 4. Error states are inline, not toasts
- All error states render as cards inside the chat message flow.
- They are NOT browser-level toasts, snackbars, or modals.
- The stream_drop variant shows the partial AI message with a blinking cursor, then the error card below it.

### 5. Persistent error disables input
- When 3 consecutive failures occur, the input field is disabled and shows "Conversation paused" as placeholder text.
- No retry button. The founder must close and return later.

### 6. Homepage is validation-minimal, not the full landing page
- The landing page content doc has 7 sections. The homepage design uses only: Hero, Recognition (3 cards), Insight (1 paragraph), and CTA.
- Product tease, testimonials, "how it works", and pricing are all deferred to Phase 1.
- **Eng impact:** None — the eng spec already describes a minimal homepage.

### 7. Magic link confirmation is an inline morph, not a page
- The eng spec says "change text to 'Link sent'". The design instead morphs the entire CTA area into a confirmation card.
- The rest of the homepage above dims to 0.3 opacity (pointer-events none) so the confirmation card is the clear focal point.
- Two actions: "Resend link" (with success state) and "Different email" (returns to input state).
- **Eng impact:** The homepage is a single component with two states (input vs. confirmation), not two routes.

### 8. Email validation is client-side
- Basic regex check before calling `signInWithOtp`. Error text appears below the input field in #DC2626.
- No server-side email validation beyond what Supabase provides.

---

## Mockup Files Reference (complete)

| File | Screens | Status |
|------|---------|--------|
| `homepage_final.jsx` | Homepage, Magic link confirmation | ✅ Use this |
| `onboard_screens_final.jsx` | Stage 0, Stage 1, Stage 2, Return visit, Errors | ✅ Use this |
| `stage3_chat_final.jsx` | Stage 3 chat | ✅ Use this |
| `stage4_dashboard_final.jsx` | Stage 4 dashboard | ✅ Use this |

All earlier mockup versions (stage3_chat_mockup, stage4_dashboard_mockup, v2, v3, v4) remain superseded.

---

## Open Items

None. All screens from Homepage through Stage 4 are designed and locked. The design system is complete. Ready for engineering.

---

## Implementation Decisions (added post-build)

These decisions were made during the engineering build phase and deviate from or extend the original design/eng spec.

### Stage 4 — FocusItem card shape extended

The original spec had a single `goal` field per focus item. The implementation uses:
- `title` — short card heading (5–8 words)
- `subtitle` — one-line descriptor  
- `context` — why this item is on the wall (1–2 sentences)
- `goal` — optional specific outcome for the week

Cards display the title in the header, subtitle in muted text below, context as a paragraph, then tasks. If `goal` is present, it is shown with a "Goal" tag badge.

### Stage 4 — TrapAlert uses parked item count, not custom message

`TrapAlert` receives `parkedCount: number`. The copy is fixed: "If you are reading the parked section instead of doing the 4 focus items — close this tab and go do something." The subtext is dynamically generated: "{N} ideas parked. Not gone — just not this week."

The alert is always rendered (even with 0 parked items) — the condition from the original spec (`parkedCount >= 5`) was removed.

### Stage 4 — ContinueConversationStub click state

Clicking the "Continue conversation" button does not navigate or open a modal. It replaces itself with: "Coming soon — reach out to hello@justfour.ai". This avoids a dead link while communicating Phase 2 intent.

### Auth — Stale refresh token handling

When Supabase returns `Invalid Refresh Token`, middleware clears all `sb-*` cookies and redirects to `/`. This prevents the error persisting across page loads. Authenticated users hitting `/` directly are redirected to `/onboard` — a deliberate routing layer in the middleware to ensure the homepage is never shown to logged-in users.

### Resend SMTP — configuration location

Magic link emails are sent via Resend, configured as a custom SMTP provider in Supabase Auth settings (`smtp.resend.com:465`). The Supabase default SMTP is not used. The `RESEND_API_KEY` env var is required server-side.

---

*Design is complete. This document plus the 4 mockup files above are the full bridge from design → engineering.*
