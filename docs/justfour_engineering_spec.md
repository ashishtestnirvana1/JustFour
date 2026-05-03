# JustFour — Engineering Design Document

**Version 1.0 · May 2026**
**Audience:** Engineering team building the MVP
**Status:** Approved for build

---

## 1. What you are building

A web app where early-stage founders have a structured AI conversation that extracts everything on their mind, challenges each idea with one question — "what has to be true before this matters?" — and produces a dashboard with two zones: a focus wall (4 items max) and a parking lot (everything else, organised by category with reasons).

The product is not a to-do app. It is a discipline tool. The AI is opinionated and assertive. It names the "Founder's Trap" — the tendency to spend time on exciting but premature ideas — directly and without softening.

Total time from login to dashboard: under 10 minutes.

### Phases

| Phase | Scope | Users | Payment |
|-------|-------|-------|---------|
| **Validation** (build this) | Full Stage 0–4 flow | 20 founders, invite-only | Free — no payment gateway |
| Phase 1 (paid launch) | Same features, goes public | Open signup | Razorpay gateway added |
| Phase 2 | Task management, co-founder sharing, weekly check-in | — | — |

**You are building Validation phase only.** Phase 1 additions (Razorpay) are called out where they affect schema design, but are not implemented now.

### One dashboard per user

One dashboard per user, always. No "start a new dashboard" option. Enforce with a unique constraint on `user_id` in the sessions table.

---

## 2. Tech stack

### System architecture

```mermaid
graph LR
    subgraph "Your stack"
        B[Founder's browser\nReact + Zustand] -->|HTTP| N[Next.js on Vercel\nApp Router + AI SDK]
    end

    N -->|Streaming SSE| A[Anthropic API\nclaude-sonnet-4]
    N -->|SQL + Auth| S[Supabase\nPostgres + Auth\nMumbai region]
    N -->|Email| R[Resend\nMagic link emails]
    N -.->|Phase 1| P[Razorpay\nPayments]

    style A fill:#D4537E,color:#fff
    style S fill:#1D9E75,color:#fff
    style N fill:#534AB7,color:#fff
```

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **Next.js 16 (App Router)** | Streaming via Route Handlers, instrumentation hook for startup init |
| Hosting | **AWS EC2 t4g.micro + Docker Compose + Caddy** (~$8/month) — see `docs/aws-deployment-guide.md`. Vercel also works for serverless deploys. | EC2 gives persistent processes (required for in-memory rate limiting), Caddy handles auto-HTTPS |
| Database | **Supabase (Postgres, `justfour` schema)** | Free tier, Mumbai region (ap-south-1), magic link auth built-in, Row Level Security. Schema auto-initialised on app startup via `instrumentation.ts`. |
| Auth | **Supabase Auth** | Magic link out of the box via Resend SMTP (smtp.resend.com:465), JWT sessions, no passwords |
| AI | **Anthropic API** (`claude-opus-4-5`) + **AI SDK** (`ai` package) | `useChat` from `ai/react` handles streaming; `streamText` on the server side |
| Email | **Resend** | Free tier (3k/month), configured as Supabase SMTP provider |
| Payments | **Razorpay** (Phase 1 only) | India-first, INR support. During validation: manual payment link + DB flag |
| UI library | **Custom CSS-in-JS** | Inline styles matching the design system tokens |
| State mgmt | **React state + useChat** | `useChat` from `ai/react` manages message list and streaming state |
| Markdown | **react-markdown** + **remark-gfm** | Renders AI responses (bold, lists, emphasis) — raw markdown in UI looks broken |

### What NOT to use

- MUI, Chakra, Ant Design — too opinionated, fights the product's visual identity
- NextAuth — Supabase auth covers magic links natively, no need for a second auth layer
- Redux — overkill for this state shape; Zustand is sufficient
- Socket.io — Vercel AI SDK handles streaming over HTTP; WebSockets add deployment complexity on Vercel

---

## 3. Project structure

```
justfour/
├── app/
│   ├── layout.tsx                  # Root layout, Supabase provider, Zustand provider
│   ├── page.tsx                    # Homepage (pre-login)
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts            # Magic link callback handler
│   ├── onboard/
│   │   └── page.tsx                # Stages 0–3 (single page, stage-driven)
│   ├── dashboard/
│   │   └── page.tsx                # Stage 4 dashboard
│   └── api/
│       ├── chat/
│       │   └── route.ts            # POST — streaming AI endpoint
│       └── dashboard/
│           └── route.ts            # POST — generate dashboard from conversation
│
├── components/
│   ├── chat/
│   │   ├── ChatContainer.tsx       # Message list + input, handles streaming
│   │   ├── MessageBubble.tsx       # Single message with markdown rendering
│   │   └── StreamingIndicator.tsx  # "Thinking..." dot animation
│   ├── onboard/
│   │   ├── ArrivalScreen.tsx       # Stage 0
│   │   ├── CalibrationChips.tsx    # Stage 1 — chip select, one question at a time
│   │   └── BrainDumpArea.tsx       # Stage 2 — textarea + nudge chips + counter
│   ├── dashboard/
│   │   ├── TrapAlert.tsx           # Red banner, never dismissible
│   │   ├── FocusWall.tsx           # 4 items, each with goal + tag + tasks
│   │   ├── ThisWeek.tsx            # Static task list (read-only in MVP)
│   │   └── ParkingLot.tsx          # Categorised parked items with reasons
│   └── ui/                         # Shadcn components (Button, Input, Card, etc.)
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser Supabase client
│   │   ├── server.ts               # Server Supabase client (for Route Handlers)
│   │   └── middleware.ts           # Session refresh middleware
│   ├── ai/
│   │   ├── prompts.ts              # All system prompts, organised by stage
│   │   └── dashboard-schema.ts     # Zod schema for structured dashboard output
│   ├── store.ts                    # Zustand store (session stage, messages, dashboard)
│   └── constants.ts                # Stage enum, category list, token limits
│
├── middleware.ts                    # Auth guard — redirect unauthenticated to homepage
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # Full DDL (see Section 4)
└── .env.local                      # Local environment variables
```

### Key routing decisions

- `/` — Homepage. Public. Email input + CTA.
- `/onboard` — Protected. Handles Stages 0–3 as a single-page app. The `stage` value from the session row drives which component renders. No URL changes between stages — avoids back-button confusion.
- `/dashboard` — Protected. Renders from stored dashboard JSON. Includes a "Continue conversation" entry point (visually present, functionally stubbed in validation — wired in Phase 2).
- `/auth/callback` — Supabase magic link lands here, exchanges token, redirects to `/onboard` or `/dashboard` based on session state.

---

## 4. Database schema

### Full DDL

All tables live in the **`justfour`** schema (not `public`). The schema and all tables are created automatically on app startup via `instrumentation.ts` → `src/server/db/init.ts`. The DDL is fully idempotent (`CREATE IF NOT EXISTS`, `DO $$ ... IF NOT EXISTS $$`). You do not need to run migrations manually.

```sql
-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================================
-- USERS
-- Extended from Supabase auth.users. This table stores
-- application-level user data only.
-- ============================================================
create table justfour.users (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text not null unique,
  first_name    text,                          -- Collected optionally at signup
  is_paid       boolean not null default false, -- Manual flip during validation
  payment_ref   text,                          -- Nullable. Razorpay ref added Phase 1
  created_at    timestamptz not null default now()
);

-- ============================================================
-- SESSIONS
-- One session per user (enforced). Tracks which stage
-- the founder is in and stores calibration context.
-- ============================================================
create table public.sessions (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null unique references public.users(id) on delete cascade,
  stage         int not null default 0,         -- 0=arrival, 1=calibration, 2=braindump, 3=challenge, 4=dashboard
  context       jsonb not null default '{}',    -- Stage 1 answers: { startup_stage, has_prototype, has_cofounder, ... }
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Enforce one session per user
-- (The unique constraint on user_id above handles this.
--  Remove it in Phase 2 if multi-session is needed.)

-- ============================================================
-- MESSAGES
-- Every message in the conversation, saved as it arrives.
-- ============================================================
create table public.messages (
  id            uuid primary key default uuid_generate_v4(),
  session_id    uuid not null references public.sessions(id) on delete cascade,
  role          text not null check (role in ('user', 'assistant', 'system')),
  content       text not null,
  stage         int not null,                   -- Which stage this message belongs to
  token_count   int,                            -- Nullable. Populated for assistant messages for cost tracking
  created_at    timestamptz not null default now()
);

create index idx_messages_session on public.messages(session_id, created_at);

-- ============================================================
-- DASHBOARDS
-- Generated once at end of Stage 3. Stored as structured JSON.
-- Version increments if the dashboard is updated (Phase 2).
-- ============================================================
create table public.dashboards (
  id            uuid primary key default uuid_generate_v4(),
  session_id    uuid not null unique references public.sessions(id) on delete cascade,
  user_id       uuid not null unique references public.users(id) on delete cascade,
  focus_wall    jsonb not null default '[]',
  parking_lot   jsonb not null default '{}',
  this_week     jsonb not null default '[]',
  version       int not null default 1,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- Every user sees only their own data.
-- ============================================================
alter table public.users enable row level security;
alter table public.sessions enable row level security;
alter table public.messages enable row level security;
alter table public.dashboards enable row level security;

create policy "Users see own row"
  on public.users for select using (auth.uid() = id);

create policy "Sessions belong to user"
  on public.sessions for all using (auth.uid() = user_id);

create policy "Messages belong to user session"
  on public.messages for all using (
    session_id in (select id from public.sessions where user_id = auth.uid())
  );

create policy "Dashboards belong to user"
  on public.dashboards for all using (auth.uid() = user_id);

-- ============================================================
-- AUTO-UPDATE updated_at
-- ============================================================
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger sessions_updated_at
  before update on public.sessions
  for each row execute function public.update_updated_at();

create trigger dashboards_updated_at
  before update on public.dashboards
  for each row execute function public.update_updated_at();
```

### JSON shapes stored in the database

**`sessions.context`** — written at end of Stage 1:
```json
{
  "startup_stage": "ideation",
  "has_prototype": false,
  "has_spoken_to_customer": false,
  "has_cofounder": false,
  "funding_status": "self_funded"
}
```

**`dashboards.focus_wall`** — array of exactly 2–4 items:
```json
[
  {
    "id": "fw_1",
    "title": "Get the chassis moving",
    "subtitle": "Hardware prototype — flat surface only",
    "context": "You have no working prototype yet. This is the single most important unresolved question. Everything else depends on it.",
    "goal": "A robot that drives across a flat floor by end of week",
    "tag": "Product",
    "tasks": [
      "Visit T-works and assess available hardware",
      "Speak to Sharad about motor controller options",
      "Order wheels and base frame from RobotShop"
    ]
  }
]
```

> **Note on FocusItem shape:** The `goal` field in the original spec has been expanded. Each focus item now has `title` (short card heading), `subtitle` (one-line descriptor), `context` (why this is on the wall — 1–2 sentences), and `goal` (optional specific outcome). See `src/shared/types/index.ts` for the TypeScript definition and `src/server/ai/dashboard-schema.ts` for the Zod schema.

**`dashboards.parking_lot`** — object keyed by category:
```json
{
  "Technology": [
    { "id": "pk_1", "idea": "Voice interaction system", "reason": "Requires working prototype first" },
    { "id": "pk_2", "idea": "Face recognition in elevators", "reason": "Phase 2 feature, not launch-critical" }
  ],
  "Team & culture": [
    { "id": "pk_3", "idea": "Competitive dual sales teams", "reason": "Need a product before building sales org" }
  ],
  "Partnerships": [],
  "Fundraising & scale": [
    { "id": "pk_4", "idea": "Raise $100M", "reason": "No prototype, no pilot, no traction yet" }
  ],
  "Other": []
}
```

**`dashboards.this_week`** — flat array of tasks:
```json
[
  { "id": "tw_1", "task": "Visit T-works", "tag": "Product" },
  { "id": "tw_2", "task": "Send intro emails to Otis, Schindler, ThyssenKrupp India", "tag": "Operations" },
  { "id": "tw_3", "task": "Message 3 former colleagues about co-founder interest", "tag": "Team" }
]
```

---

## 5. Authentication flow

Supabase Auth handles the entire flow. No custom auth code except the callback route.

### Auth flow diagram

```mermaid
sequenceDiagram
    participant F as Founder
    participant App as Next.js
    participant SB as Supabase Auth
    participant R as Resend

    F->>App: Enter email + click CTA
    App->>SB: signInWithOtp({ email })
    SB->>R: Send magic link email
    R->>F: Email with login link
    F->>App: Click magic link → /auth/callback
    App->>SB: exchangeCodeForSession()
    SB-->>App: JWT session token
    App->>App: Check if users row exists
    alt New user
        App->>App: Create users + sessions row (stage=0)
        App-->>F: Redirect → /onboard
    else Returning user
        App->>App: Read sessions.stage
        alt stage = 4
            App-->>F: Redirect → /dashboard
        else stage 1–3
            App-->>F: Redirect → /onboard (resume)
        end
    end
```

```
1. Founder enters email on homepage
2. Frontend calls supabase.auth.signInWithOtp({ email })
3. Supabase sends magic link via Resend to founder's email
4. Founder clicks link → browser hits /auth/callback
5. Callback route:
   a. Exchanges the token via supabase.auth.exchangeCodeForSession()
   b. Checks if public.users row exists for this auth.uid()
   c. If not → creates users row + sessions row (stage=0)
   d. Reads session.stage:
      - stage < 4  → redirect to /onboard
      - stage == 4  → redirect to /dashboard
6. Supabase sets a session cookie (httpOnly, secure)
7. middleware.ts on every protected route:
   - Calls supabase.auth.getSession()
   - If no session → redirect to /
   - If valid → allow through
```

### Session persistence

Supabase Auth stores the session token in an httpOnly cookie. The founder stays logged in across browser closes. Session expires after 7 days by default (configurable in Supabase dashboard). On expiry, the founder re-enters their email — no password to remember.

### No first name collection at signup

The homepage only asks for email. First name is not collected. The greeting in Stage 0 is generic: "Let's figure out what you should actually be working on this week." If you later want to collect first name (e.g., in a post-signup screen), the `first_name` column is already in the schema.

---

## 6. The stage machine

The entire product is a 5-stage pipeline. The `sessions.stage` integer is the single source of truth for where the founder is.

### Stage flow diagram

```mermaid
flowchart LR
    S0[Stage 0\nArrival] -->|"Click 'Dump your list'"| S1[Stage 1\nCalibration]
    S1 -->|"All questions answered\nContext saved to JSON"| S2[Stage 2\nBrain dump]
    S2 -->|"'I'm done' + min 5 ideas\nSaved as message"| S3[Stage 3\nChallenge chat]
    S3 -->|"AI outputs dashboard JSON\nParsed + stored"| S4[Stage 4\nDashboard]

    S1 -.->|"Start over"| S0
    S2 -.->|"Start over"| S0
    S3 -.->|"Start over"| S0

    style S3 fill:#7F77DD,color:#fff
    style S4 fill:#1D9E75,color:#fff
```

### Stage transitions

```
Stage 0 (Arrival)
  → Founder clicks "Dump your list"
  → UPDATE sessions SET stage = 1

Stage 1 (Context calibration)
  → Founder answers all calibration questions via chip-select
  → Answers stored in sessions.context as JSON
  → UPDATE sessions SET stage = 2, context = {...}

Stage 2 (Brain dump)
  → Founder writes freeform text, clicks "Done" or "I'm done"
  → Brain dump text saved as a single user message (stage=2) in messages table
  → UPDATE sessions SET stage = 3

Stage 3 (Challenge conversation)
  → Streaming chat begins. Every message saved to messages table with stage=3.
  → AI works through categories, makes focus/park calls.
  → When AI determines all categories are covered:
    AI sends final summary message.
    AI sends a structured JSON block (the dashboard payload) as the last message.
  → Backend parses the JSON, writes to dashboards table.
  → UPDATE sessions SET stage = 4

Stage 4 (Dashboard)
  → Dashboard rendered from dashboards table.
  → No further stage transitions in MVP.
  → "Continue conversation" entry point is visible but functionally Phase 2.
```

### Stage values reference

| Value | Name | UI route | Can go back? |
|-------|------|----------|-------------|
| 0 | Arrival | `/onboard` | No |
| 1 | Calibration | `/onboard` | No |
| 2 | Brain dump | `/onboard` | No |
| 3 | Challenge | `/onboard` | No (but can restart to 0) |
| 4 | Dashboard | `/dashboard` | No |

"Can go back" means the user cannot navigate to a previous stage using browser back or any UI control. The only escape hatch is the "Start over" option during Stages 1–3, which resets to Stage 0 and soft-deletes all messages.

---

## 7. Return visit routing

When an authenticated user hits a protected route, the app reads `sessions.stage` and routes them.

### Routing flow diagram

```mermaid
flowchart TD
    A[User opens app] --> B{Authenticated?}
    B -->|No| C[Homepage\n"Enter your email"]
    B -->|Yes| D[Load session]
    D --> E{session.stage?}
    E -->|stage = 4| F["/dashboard\nRender from DB"]
    E -->|stage 1–3| G["/onboard\nResume conversation\n+ 'Start over' banner"]
    E -->|stage = 0| H["/onboard\nFresh Stage 0"]
    E -->|No session row| I["Create session\nstage = 0\n→ /onboard"]

    style F fill:#1D9E75,color:#fff
    style G fill:#BA7517,color:#fff
```

### Implementation (in `/auth/callback/route.ts` and `middleware.ts`)

```typescript
// Pseudocode — actual implementation uses Supabase server client
async function getRouteForUser(userId: string): Promise<string> {
  const session = await db.sessions.findUnique({ where: { user_id: userId } });

  if (!session) {
    // First visit — create session row
    await db.sessions.create({ user_id: userId, stage: 0 });
    return '/onboard';
  }

  if (session.stage === 4) {
    // Dashboard exists — always go there
    return '/dashboard';
  }

  if (session.stage >= 1 && session.stage <= 3) {
    // Mid-conversation — resume on /onboard
    // The onboard page reads session.stage and renders the right component
    // A "Start over" banner is shown
    return '/onboard';
  }

  // Stage 0 — treat as fresh start
  return '/onboard';
}
```

### "Start over" logic

When the founder clicks "Start over" (available during Stages 1–3):

```sql
-- Soft-delete messages (or hard-delete; for 20 users, hard-delete is fine)
DELETE FROM messages WHERE session_id = :session_id;

-- Reset stage
UPDATE sessions SET stage = 0, context = '{}', updated_at = now()
  WHERE id = :session_id;

-- Delete any partial dashboard (shouldn't exist, but defensive)
DELETE FROM dashboards WHERE session_id = :session_id;
```

The founder is then redirected to `/onboard` which renders Stage 0.

---

## 8. API routes

### POST `/api/chat`

The core endpoint. Handles all AI interactions in Stages 2–3.

### Chat streaming flow diagram

```mermaid
sequenceDiagram
    participant F as Frontend (useChat)
    participant API as /api/chat
    participant DB as Supabase DB
    participant AI as Anthropic API

    F->>DB: Save user message immediately
    F->>API: POST { messages, sessionId, stage }
    API->>DB: Validate session belongs to user
    API->>DB: Load sessions.context
    API->>AI: streamText({ system prompt + context, messages })
    AI-->>F: Stream tokens (SSE)
    Note over F: Tokens render character by character
    AI-->>API: Stream complete (onFinish callback)
    API->>DB: Save assistant message + token count
    alt Final Stage 3 message (contains dashboard JSON)
        API->>API: Extract + validate JSON (Zod)
        API->>DB: Write to dashboards table
        API->>DB: UPDATE sessions SET stage = 4
        API-->>F: Signal dashboard ready
    end
```

**Request body:**
```json
{
  "messages": [
    { "role": "user", "content": "I want to build a delivery robot..." },
    { "role": "assistant", "content": "Let's go through your product ideas..." }
  ],
  "sessionId": "uuid",
  "stage": 3
}
```

**What it does:**

1. Validates the session belongs to the authenticated user.
2. Loads `sessions.context` (calibration answers from Stage 1).
3. Constructs the system prompt based on stage (see Section 9).
4. Prepends the calibration context to the system prompt so the AI knows the founder's situation.
5. Calls the Anthropic API with streaming enabled via Vercel AI SDK.
6. Streams the response to the frontend token-by-token.
7. After the stream completes: saves the full assistant message to the `messages` table with the token count from the API response metadata.
8. If this is the final message of Stage 3 (AI signals completion — see Section 9 for how): triggers dashboard generation.

**Streaming implementation (Vercel AI SDK):**

```typescript
// app/api/chat/route.ts
import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages, sessionId, stage } = await req.json();

  // 1. Auth check
  const user = await getAuthenticatedUser(req);
  const session = await getSession(sessionId, user.id);

  // 2. Build system prompt
  const systemPrompt = buildSystemPrompt(stage, session.context);

  // 3. Stream response
  const result = streamText({
    model: anthropic('claude-opus-4-5'),
    system: systemPrompt,
    messages: messagesForClaude,  // Brain dump prepended — see below
    maxTokens: 4000,  // Per-response ceiling — raised from 1500 to allow full dashboard JSON
    onFinish: async ({ text, usage }) => {
      // 4. Save assistant message to DB
      await saveMessage({
        sessionId,
        role: 'assistant',
        content: text,
        stage,
        tokenCount: usage.completionTokens,
      });

      // 5. Check if this was the final Stage 3 message
      if (stage === 3 && text.includes('```dashboard')) {
        await generateDashboard(sessionId, user.id, text);
        await updateSessionStage(sessionId, 4);
      }
    },
  });

  return result.toDataStreamResponse();
}
```

**Brain dump prepend (critical for Stage 3 context):**

The Stage 2 brain dump text is saved as a `user` message with `stage=2`. At Stage 3, the API route fetches it and prepends it to the messages array before sending to Claude. This ensures Claude always has the full context, even if the UI only shows Stage 3 messages.

```typescript
// In /api/chat — fetch brain dump and prepend
const { data: brainDumpRow } = await supabase
  .from('messages')
  .select('content')
  .eq('session_id', sessionId)
  .eq('stage', 2)
  .eq('role', 'user')
  .order('created_at', { ascending: true })
  .limit(1)
  .single()

const messagesForClaude = brainDumpRow
  ? [{ role: 'user', content: brainDumpRow.content }, ...messages]
  : messages
```

**Frontend (`useChat` from `ai/react`):**

> **Important:** Use `useChat` from `ai/react` (the `ai` package), NOT from `@ai-sdk/react`. The `@ai-sdk/react` package has a completely different API and removes `setInput`, `input`, and the `append` signature. Importing from the wrong package causes `TypeError: setInput is not a function` and `TypeError: append is not a function`.

```typescript
// In ChatContainer.tsx
import { useChat } from 'ai/react';  // NOT from '@ai-sdk/react'

const { messages, append, status } = useChat({
  api: '/api/chat',
  body: { sessionId, stage },
  initialMessages,
});

// Manage input with own state — do not rely on useChat's input/setInput
const [inputText, setInputText] = useState('')
const isLoading = status === 'streaming' || status === 'submitted'
```

### POST `/api/dashboard`

Called internally (not by the frontend directly) when Stage 3 completes.

**What it does:**
1. Parses the structured dashboard JSON from the final AI message.
2. Validates it against the Zod schema (Section 9).
3. Writes to the `dashboards` table.
4. Updates `sessions.stage` to 4.

If parsing fails (malformed AI output), retry the AI call once with a stricter prompt asking for JSON only. If it fails again, log the error and keep the session at Stage 3 — the founder can continue the conversation.

---

## 9. AI integration

### System prompts

All system prompts live in `lib/ai/prompts.ts`. They are hardcoded strings in the codebase for validation phase. Move them to a database table with version tracking in Phase 1.

#### Stage 2 — Brain dump prompt

This prompt is NOT sent to the AI as a chat message. Stage 2 is a pure frontend experience (a text area). The AI's role begins at Stage 3.

The brain dump text the founder writes is captured as a single `user` message and sent to the AI at the start of Stage 3.

#### Stage 3 — Challenge conversation system prompt

This is the most critical prompt in the product. It must produce specific behaviours:

```typescript
export function buildChallengePrompt(context: SessionContext): string {
  return `
You are a startup discipline coach. You are direct, opinionated, and not afraid to
tell a founder that their idea is premature. You are not mean — you are precise.

## Founder context
- Startup stage: ${context.startup_stage}
- Has a working prototype: ${context.has_prototype ? 'Yes' : 'No'}
- Has spoken to a potential customer: ${context.has_spoken_to_customer ? 'Yes' : 'No'}
- Has a co-founder or committed collaborator: ${context.has_cofounder ? 'Yes' : 'No'}
- Funding status: ${context.funding_status}

## Your task
The founder has done a brain dump of everything on their mind. You will now work
through it category by category. For each category:

1. DRAW OUT MORE — Ask what else they are thinking about in this area before
   making any calls. Founders hold back the ideas they know are premature.
   Surface them.

2. MAKE YOUR CALL — For each idea, decide:
   - FOCUS WALL: This matters right now given the founder's stage. State why.
   - PARK: This is a real idea but premature. State what has to be true before
     it matters. Use one sentence.
   - SPLIT: The full strategy gets parked, but a lightweight action stays live.
     State the split clearly.

3. ASSERT, DON'T ASK — You make the call and state your reasoning. The founder
   can push back. If they do, consider it — sometimes concede, sometimes hold firm.
   Never present a menu of options.

## Behavioural rules

- Maximum 4 items on the focus wall. When it hits 4, tell the founder directly:
  "Your focus wall is full. Something has to come off before we add anything."
  The founder decides what to cut, not you.

- When the founder dwells on premature topics (fundraising, org design, global
  expansion, hiring plans) before fundamentals are in place, name it:
  "This is the Founder's Trap. These are real questions. They're just not your
  questions yet." One paragraph. Then move on.

- Work through these categories in order. For each one, ask if there is more
  before making your calls:
  1. Product / Technology
  2. Team & co-founder
  3. Partnerships
  4. Branding & marketing
  5. Fundraising & investors
  6. Operations

- Never let the founder exit Stage 3 with fewer than 2 focus items.

- When all categories are covered, give a short summary of the focus wall
  and transition:
  "Here's where we landed: [N] things that can actually move this week.
  Everything else is parked with a reason — not gone, just not now."

## Dashboard generation

After your final summary, output a structured JSON block inside a fenced code
block tagged \`\`\`dashboard. This is the machine-readable output that will
be parsed to build the dashboard.

The JSON must conform exactly to this structure:
{
  "focus_wall": [
    {
      "id": "fw_1",
      "title": "string — short heading (5–8 words)",
      "subtitle": "string — one-line descriptor",
      "context": "string — why this is on the wall (1–2 sentences)",
      "goal": "string — optional specific outcome for the week",
      "tag": "Product | Team | Revenue | Operations",
      "tasks": ["string", "string", "string"]
    }
  ],
  "parking_lot": {
    "Technology": [
      { "id": "pk_1", "idea": "string", "reason": "string — one sentence" }
    ],
    "Team & culture": [],
    "Partnerships": [],
    "Fundraising & scale": [],
    "Other": []
  },
  "this_week": [
    { "id": "tw_1", "task": "string", "tag": "Product | Team | Revenue | Operations" }
  ]
}

Rules for the JSON:
- focus_wall: minimum 2, maximum 4 items
- Each focus item must have exactly 3 tasks
- parking_lot: all 5 categories must be present (empty array if nothing parked)
- this_week: 3–6 tasks, drawn from the focus wall's tasks
- Tags must be exactly one of: Product, Team, Revenue, Operations
- IDs must be unique across the whole JSON (fw_1, pk_1, tw_1 etc.)
`.trim();
}
```

### Dashboard JSON extraction

The AI's final Stage 3 message contains the dashboard JSON inside a fenced code block. The backend extracts it:

```typescript
// lib/ai/dashboard-schema.ts
import { z } from 'zod';

const FocusItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string(),
  context: z.string(),
  goal: z.string().optional(),
  tag: z.enum(['Product', 'Team', 'Revenue', 'Operations']),
  tasks: z.array(z.string()).length(3),
});

const ParkedItemSchema = z.object({
  id: z.string(),
  idea: z.string(),
  reason: z.string(),
});

const TaskSchema = z.object({
  id: z.string(),
  task: z.string(),
  tag: z.enum(['Product', 'Team', 'Revenue', 'Operations']),
});

export const DashboardSchema = z.object({
  focus_wall: z.array(FocusItemSchema).min(2).max(4),
  parking_lot: z.object({
    'Technology': z.array(ParkedItemSchema),
    'Team & culture': z.array(ParkedItemSchema),
    'Partnerships': z.array(ParkedItemSchema),
    'Fundraising & scale': z.array(ParkedItemSchema),
    'Other': z.array(ParkedItemSchema),
  }),
  this_week: z.array(TaskSchema).min(3).max(6),
});

export function extractDashboardJSON(aiResponse: string) {
  const match = aiResponse.match(/```dashboard\n([\s\S]*?)\n```/);
  if (!match) throw new Error('No dashboard JSON block found in AI response');

  const parsed = JSON.parse(match[1]);
  return DashboardSchema.parse(parsed); // Throws ZodError if invalid
}
```

### Token budgeting

| Limit | Value | Enforced where |
|-------|-------|---------------|
| Max output tokens per AI response | 4,000 | `maxTokens` param in `streamText()` — must be high enough to fit the full dashboard JSON block |
| Max total session tokens (all messages) | ~20,000 input + output combined | Soft limit — track via `messages.token_count` |
| Max messages per session | 50 | Application code — after 50 messages, force dashboard generation |
| Estimated cost per session | $0.10–0.20 | Monitoring only during validation |

### Rate limiting

For validation (20 users), rate limiting is simple:

- Max 3 concurrent AI requests per user: enforce in the `/api/chat` route handler using a per-user in-memory counter (Map). This prevents runaway loops if the frontend has a bug.
- Max 10 AI requests per minute globally: use Vercel's built-in rate limiting headers or a simple in-memory sliding window. At 20 users, collisions are unlikely.

No Redis needed during validation. If you scale past 50 concurrent users, add Upstash Redis ($0/month for 10k requests/day).

---

## 10. Frontend — page by page

### Homepage (`/`)

**Components:** Email input, CTA button, Founder's Trap narrative (see landing page content in the project files for exact copy).

**Behaviour:**
1. Founder enters email, clicks "Dump your list →"
2. Call `supabase.auth.signInWithOtp({ email })`
3. Show confirmation: "Check your email for a magic link"
4. No loading spinner on the button — disable it and change text to "Link sent"

**Design rules:**
- No feature lists
- No pricing during validation
- No free tier messaging — but no payment gate either during validation
- Single-column layout, max-width 640px, centered

### Onboard page (`/onboard`)

This is a single route that renders different components based on `sessions.stage`. No URL changes between stages.

**On mount:**
```typescript
// Pseudocode
const session = await loadSession(user.id);
const messages = await loadMessages(session.id);

if (session.stage === 4) redirect('/dashboard');

// Render based on stage
switch (session.stage) {
  case 0: return <ArrivalScreen />;
  case 1: return <CalibrationChips context={session.context} />;
  case 2: return <BrainDumpArea />;
  case 3: return <ChatContainer messages={messages} />;
}
```

**If Stage 1–3 (return visit), show a banner:**
> "You left mid-conversation. Pick up where you left off, or start fresh."
> [Continue] [Start over]

"Start over" triggers the reset logic from Section 7.

#### Stage 0 — ArrivalScreen

- Greeting: "Let's figure out what you should actually be working on this week."
- Single button: "Dump your list"
- Click → update session to stage 1, re-render

#### Stage 1 — CalibrationChips

One question at a time. The founder taps a chip to answer, and the next question appears. This is NOT a form. It is a vertical sequence of questions that reveals progressively.

**Question 1 — Startup stage:**
Display: "Where are you right now?"
Chips: Ideation | Building | Pre-revenue | Early revenue | Scaling
Each chip shows a short description on hover/focus.

**Question 2 — Stage-adaptive yes/no questions:**
Displayed one at a time after Question 1 is answered.

For "Ideation":
- "Do you have any kind of working prototype, even rough?" → Yes / No
- "Have you spoken to a potential customer yet?" → Yes / No
- "Is anyone else working on this with you?" → Yes / No

For "Building":
- "Do you have a co-founder or committed technical collaborator?" → Yes / No
- "Have you shown anything to a potential user?" → Yes / No
- "Are you self-funded or do you have outside money?" → Self-funded / Outside money

For "Pre-revenue":
- "Do you have a paying customer or signed letter of intent?" → Yes / No
- "How long is your runway?" → < 6 months / 6–12 months / 12+ months
- "Do you have a co-founder?" → Yes / No

For "Early revenue" / "Scaling":
- "Funding status?" → Bootstrapped / Seed / Series A+
- "Team size?" → Solo / 2–5 / 6+
- "What's the one thing slowing you down most?" → Free text (short input, not textarea)

**On completion:** Save all answers to `sessions.context` as JSON. Update stage to 2.

#### Stage 2 — BrainDumpArea

**UI components:**
1. Opening prompt (static text): "Everything you're thinking about doing in the next 30 days — product, fundraising, team, sales, admin, random ideas, worries. Don't edit yourself."
2. Large textarea — no character limit, autogrow, min-height 200px
3. Running counter (top right): counts rough "ideas" by splitting on newlines and commas. Display: "8 ideas captured"
4. Category nudge chips — appear after 30 seconds of no typing. Only show chips for categories NOT mentioned in the text. Categories: Product / Tech, Team & co-founder, Fundraising, Partnerships, Branding & marketing, Operations. Tapping a chip inserts `\nTeam: ` at the cursor position.
5. "I'm done" button — disabled until at least 5 ideas detected

**On "I'm done":**
1. The AI does a category sweep. For each category not mentioned in the text, display a nudge message below the textarea: "You haven't mentioned fundraising — anything there, even half-formed thoughts?"
2. If the founder adds more, update the counter.
3. If they confirm done: save the full text as a single `user` message (stage=2). Update session to stage 3.

**Implementation note:** The category sweep can be done client-side with simple keyword matching (check if the text contains "fund", "invest", "rais" for Fundraising; "team", "hire", "co-founder" for Team; etc.). It does NOT need an AI call.

#### Stage 3 — ChatContainer (the challenge conversation)

**This is the core experience. Get this right before anything else.**

**On mount:**
1. Load all messages from DB (there will be at least one: the brain dump text).
2. Construct the initial AI prompt by combining:
   - System prompt (from Section 9, with calibration context injected)
   - The brain dump text as the first user message
3. If this is a fresh Stage 3 entry (no assistant messages yet), automatically trigger the first AI response.
4. If resuming (assistant messages exist), render the full conversation history and wait for the founder to type.

**Message rendering:**
- User messages: right-aligned, darker background, no markdown
- Assistant messages: left-aligned, rendered with `react-markdown` + `remark-gfm`
- The `\`\`\`dashboard` JSON block in the final message should NOT be rendered in the chat. Strip it before display.

**Streaming UX:**
- While the AI is streaming: show a subtle pulsing dot indicator before the first token arrives
- Tokens appear character by character in the assistant message bubble
- Auto-scroll to the bottom during streaming
- If the user scrolls up (to re-read), stop auto-scrolling. Resume auto-scroll when they scroll back to the bottom.
- Input field is disabled while streaming (the founder cannot send a new message until the AI finishes)

**Saving messages:**
- User message: saved to DB immediately when the founder hits send (before the AI responds)
- Assistant message: saved to DB after the stream completes (in the `onFinish` callback)
- This ensures conversation state survives a page refresh mid-stream

**Dashboard transition:**
When the AI's final message contains the `\`\`\`dashboard` block:
1. Backend parses it, writes to `dashboards` table, updates stage to 4
2. Frontend detects stage change (via a polling check or returned header)
3. Frontend shows a transition: "Your dashboard is ready." with a button: "See your dashboard"
4. Click → navigate to `/dashboard`

Do NOT auto-navigate. The founder should feel the moment of transition.

### Dashboard page (`/dashboard`)

**On mount:**
1. Load dashboard from `dashboards` table by `user_id`
2. If no dashboard exists (edge case — should not happen), redirect to `/onboard`

**Layout — single column, full vertical read, no left-right split:**

```
┌──────────────────────────────────────────────────┐
│  ⚠ FOUNDER'S TRAP ALERT                         │
│  If you are reading the parking lot instead of   │
│  doing the 4 focus items — close this tab and    │
│  go do something. Big ideas feel productive.     │
│  They are not.                                   │
│                                                  │
│  [N] ideas parked. They're not gone — they're    │
│  just not this week's problem.                   │
└──────────────────────────────────────────────────┘

FOCUS WALL ───────────────────────────────────────
┌──────────────────────────────────────────────────┐
│ [Product]                                        │
│ Get a basic chassis moving on a flat surface     │
│                                                  │
│ • Visit T-works and assess available hardware    │
│ • Speak to Sharad about motor controller options │
│ • Order wheels and base frame                    │
└──────────────────────────────────────────────────┘
(repeat for items 2–4)

THIS WEEK ────────────────────────────────────────
  ○ Visit T-works                       [Product]
  ○ Send intro emails to elevator cos   [Operations]
  ○ Message 3 former colleagues         [Team]
  ○ Research KONE API documentation     [Product]

(Static list. Circles are decorative, not checkboxes.
 Read-only in MVP. Checkboxes come in Phase 2.)

PARKING LOT ──────────────────────────────────────
  Technology
    Voice interaction system
    — Requires working prototype first
    Face recognition in elevators
    — Phase 2 feature, not launch-critical

  Team & culture
    Competitive dual sales teams
    — Need a product before building sales org

  (etc.)

──────────────────────────────────────────────────
  💬 Continue conversation (Phase 2)
```

**Design rules for dashboard:**
- Trap alert: red/warning background, bold, top of page, never dismissible, no close button
- Focus wall items: card-style, each with tag badge (coloured pill), goal in bold, tasks as a plain list
- Parking lot: quieter treatment — gray text, smaller font, indented under category headers. Present but not competing with the focus wall.
- "Continue conversation" at the bottom: styled as a subtle text link or collapsed chat input. Visually present in validation; clicking it shows a message: "Coming soon — for now, reach out to [founder email] to update your dashboard." Replace with functional chat in Phase 2.

---

## 11. Error handling

### AI call failures

| Failure | User experience | Technical action |
|---------|----------------|-----------------|
| Anthropic API returns 5xx | "Something went wrong. Tap to retry." | 1 automatic retry with 2s delay, then surface error |
| Anthropic API returns 429 (rate limit) | "Busy right now. Try again in a moment." | Exponential backoff: 5s, 15s, 30s |
| Stream drops mid-response | Show partial message + "Connection lost. Tap to continue." | On retry, re-send the full message history — the partial response is NOT saved to DB |
| AI output missing dashboard JSON | Keep session at Stage 3. Show: "Let's wrap up — tell me if anything is missing." | Send a follow-up system message asking the AI to output the dashboard JSON |
| Dashboard JSON fails Zod validation | Same as above | Log the malformed JSON for debugging. Retry once with a stricter prompt |

### Key principle

Never leave the founder in a broken state. Every error path has a recovery action. If the AI call fails 3 times consecutively, show: "We're having trouble right now. Your conversation is saved — come back in a few minutes and you'll pick up exactly where you left off."

### Conversation state is always safe

User messages are saved to DB immediately on send. Assistant messages are saved after stream completion. This means:
- If the browser crashes mid-stream: the user's last message is saved, the partial AI response is lost. On return, the conversation replays up to the last saved message and the AI re-generates.
- If the server crashes mid-write: the assistant message may be lost. Same recovery — the user returns, sees conversation up to the last saved point, and the AI continues.

---

## 12. Environment variables

### `.env.local` (local development)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...    # Server-side only, never expose to client

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Resend (for magic link emails — configured in Supabase Auth → SMTP Settings)
RESEND_API_KEY=re_...

# Database (direct Postgres connection for schema init via pg package)
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Vercel environment variables (production)

Same keys, set in the Vercel dashboard under Project → Settings → Environment Variables. Mark `SUPABASE_SERVICE_ROLE_KEY` and `ANTHROPIC_API_KEY` as sensitive (they won't appear in build logs).

**Never commit `.env.local` to git.** Add it to `.gitignore`.

---

## 13. Deployment

### Local development

```bash
# Install dependencies
npm install

# Run Supabase locally (optional — can use hosted Supabase free tier)
npx supabase start

# Run the schema migration
npx supabase db push

# Start Next.js dev server
npm run dev
```

### Production (AWS EC2 + Docker Compose)

See **`docs/aws-deployment-guide.md`** for the full step-by-step guide. Summary:

1. EC2 t4g.micro (ARM, ~$6/month) or t2.micro (free tier for 12 months)
2. Docker Compose runs two containers: `justfour_app` (Next.js) + `justfour_caddy` (reverse proxy)
3. Caddy auto-provisions TLS via Let's Encrypt — no cert management needed
4. Deploy: `docker compose --env-file .env.production up -d --build`

**Schema initialisation:** On first startup, `instrumentation.ts` calls `ensureSchema()` which creates the `justfour` schema and all tables if they don't exist. No manual SQL migration needed.

### Supabase setup

1. Create a project on supabase.com — select **South Asia (Mumbai)** region
2. Go to Authentication → Providers → Email → Enable magic link
3. Configure Resend as the SMTP provider: **Authentication → SMTP Settings**
   - Host: `smtp.resend.com`, Port: `465`, Username: `resend`, Password: your Resend API key
4. Set Site URL and Redirect URLs: **Authentication → URL Configuration**
   - Site URL: `https://justfour.ai`
   - Redirect URLs: `https://justfour.ai/auth/callback`
5. The `justfour` schema + tables are created automatically on app startup — no SQL Editor step needed

### Domain

**justfour.ai** — pointed to EC2 Elastic IP. Caddy handles HTTPS automatically.

---

## 14. Build order

Build and ship in this order. Each step is deployable and testable independently.

```mermaid
gantt
    title Build order — 6 weeks to validation launch
    dateFormat  YYYY-MM-DD
    axisFormat  Week %W

    section Core
    Challenge conversation (Stage 3)     :a1, 2026-05-05, 10d
    Dashboard output (Stage 4)           :a2, after a1, 7d

    section Flow
    Brain dump (Stage 2)                 :a3, after a1, 5d
    Calibration (Stage 1) + Arrival      :a4, after a3, 5d

    section Container
    Auth + Homepage + Magic link         :a5, after a2, 7d
    Return visit routing                 :a5b, after a5, 3d

    section Launch
    Polish + error handling              :a6, after a5b, 5d
    Validation launch (20 founders)      :milestone, after a6, 0d
```

### Sprint 1 (Week 1–2): The conversation engine

**Goal:** A working AI chat that can challenge a founder's brain dump and produce structured output.

Build:
- `/api/chat` route with Anthropic streaming
- `ChatContainer` component with `useChat` hook
- System prompt for Stage 3 (challenge conversation)
- Dashboard JSON extraction + Zod validation
- Basic message persistence (save/load from Supabase)

Test: Manually paste a brain dump into the chat input. The AI should challenge it category by category and output a valid dashboard JSON at the end.

**This is the core value. If this doesn't work brilliantly, nothing else matters.**

### Sprint 2 (Week 2–3): Dashboard + database

**Goal:** The AI's output renders as a real dashboard page.

Build:
- Database schema (full DDL from Section 4)
- `dashboards` table write on Stage 3 completion
- `/dashboard` page with all 4 sections (Trap alert, Focus wall, This Week, Parking lot)
- Stage transition from 3 → 4 with the "Your dashboard is ready" moment

Test: Complete a full conversation → see a populated dashboard. Return to the app → land on the dashboard.

### Sprint 3 (Week 3–4): Brain dump + calibration

**Goal:** Stages 0–2 are complete. The full flow works end-to-end.

Build:
- Stage 0 (ArrivalScreen)
- Stage 1 (CalibrationChips) — chip-select, one question at a time, context saved to DB
- Stage 2 (BrainDumpArea) — textarea, counter, nudge chips, category sweep
- Stage transitions 0→1→2→3

Test: Full flow from "Dump your list" to dashboard. 10 minutes or less.

### Sprint 4 (Week 4–5): Auth + homepage + polish

**Goal:** A complete product a founder can use end-to-end.

Build:
- Homepage with email input + magic link
- Supabase Auth integration (magic link, callback route, middleware)
- Return visit routing (resume mid-conversation, "Start over" flow)
- Error states (API failure, stream drop, retry)
- Responsive basics (not mobile-optimised, but not broken on mobile)

Test: Send magic links to 3 test emails. Complete the full flow on each. Close the browser mid-conversation, reopen, confirm resume works.

### Sprint 5 (Week 5–6): Validation launch prep

- Load testing: simulate 5 concurrent users (Supabase free tier, Vercel free tier)
- Populate test accounts for the 20 founders
- Send invite emails with magic links
- Monitor: set up Vercel Analytics (built-in, free) for basic page-view and Web Vital tracking
- Bug fixes from internal testing

---

## 15. Cost projection

### Validation (20 founders, free)

| Service | Monthly cost |
|---------|-------------|
| Vercel (free tier) | $0 |
| Supabase (free tier, Mumbai) | $0 |
| Anthropic API (~20 sessions × $0.15) | $3 |
| Resend (free tier, 3k emails) | $0 |
| Domain (justfour.ai) | ~$12/year |
| **Total** | **~$3/month** |

### Post-validation (100–200 weekly users)

| Service | Monthly cost |
|---------|-------------|
| Vercel Pro | $20 |
| Supabase Pro (point-in-time recovery) | $25 |
| Anthropic API (~800 sessions × $0.15) | $120 |
| Resend (Pro) | $20 |
| Razorpay | % of revenue |
| **Total** | **~$185/month** |

No architecture change needed. Same stack, same code, upgraded plan tiers.

---

## 16. What is NOT in scope

These are real features that are explicitly deferred. Do not build them. Do not design for them beyond what is already in the schema.

| Feature | Phase | Why not now |
|---------|-------|------------|
| Editable task list (checkboxes, sub-items, tab indent) | Phase 2 | Static list is sufficient for validation |
| Ongoing conversation (chat from dashboard that updates focus wall) | Phase 2 | Entry point is designed, but the AI logic for incremental updates is complex |
| Weekly check-in | Phase 2 | Requires recurring scheduling + email sequences |
| Commitment ritual | Phase 2 | Depends on check-in flow |
| Co-founder sharing | Phase 2 | Requires access control model |
| Stripe/Razorpay subscriptions | Phase 1 | Manual payment for 20 users |
| Mobile-optimised layout | Phase 1 | Don't break on mobile, but optimise later |
| Observability (PostHog, error tracking) | Phase 1 | Add after 20 data points exist |
| Prompt versioning (DB-stored prompts) | Phase 1 | Config file is fine for validation |
| BYOK (Bring Your Own Key) | Phase 2 | $3 total API cost during validation |
| Admin panel | Phase 1 | Use Supabase dashboard + raw SQL for 20 users |
| Data export / deletion | Phase 1 | Compliance requirement, not validation blocker |
| Multiple dashboards per user | Never (Phase 1) | One dashboard is a design decision, not a limitation |
| Free tier / freemium | Never | Paid from day one is a product principle |
| Progress bars during challenge conversation | Never | Conversation does the work, not UI chrome |
| Slack / calendar integrations | Never (Phase 1–2) | Focus tool should not integrate with distraction sources |

---

## 17. Security — minimum viable for validation

| Concern | What to do now | What to do later |
|---------|---------------|-----------------|
| Auth | Supabase Auth handles sessions, CSRF, token refresh | N/A — already handled |
| RLS | Enabled on all 4 tables (see DDL) — users only see their own data | N/A — already handled |
| API key storage | Server-side env vars only. `ANTHROPIC_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` never exposed to client | Phase 1: if BYOK, encrypt user keys at rest |
| CORS | Next.js API routes are same-origin by default. No CORS config needed. | Phase 1: if you add a mobile app, add explicit CORS allowlist |
| Prompt injection | The system prompt is prepended server-side. User input is always in the `user` role, never in `system`. This is the baseline defence. | Phase 1: add input sanitisation (strip markdown code blocks, limit input length to 5000 chars) |
| Rate limiting | In-memory counter: 3 concurrent AI requests per user | Phase 1: Upstash Redis for distributed rate limiting |
| HTTPS | Vercel enforces HTTPS on all deployments | N/A — already handled |
| Content moderation | Anthropic's built-in moderation catches most harmful content | Phase 1: add a moderation check on user input before sending to AI |

---

## 18. Key decisions log

Decisions made during planning that the engineer should know about, with rationale.

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | One session per user (unique constraint) | One dashboard is a product design decision. Remove constraint in Phase 2 if multi-session needed. |
| 2 | Stage stored as integer, not enum | Simpler queries, easier to extend (add Stage 5 without a migration). |
| 3 | Calibration stored as JSON, not normalised columns | Schema varies by startup stage. JSON avoids N nullable columns. |
| 4 | Dashboard stored as JSON, not normalised tables | Dashboard is read-heavy, write-once. Normalising into focus_items + parking_items tables adds complexity with no benefit at this scale. |
| 5 | Messages saved immediately (user) / on completion (assistant) | Ensures conversation survives browser crash. Partial AI responses are not saved — they re-generate on retry. |
| 6 | No WebSockets | Vercel AI SDK uses HTTP streaming (SSE). WebSockets add deployment complexity on Vercel's serverless architecture. SSE is sufficient for this use case. |
| 7 | No Pages Router | App Router handles streaming natively and is the default for new Next.js projects. Pages Router is legacy. |
| 8 | System prompts in code, not DB | For 20 users, a code deploy is fast enough for prompt changes. DB-stored prompts add a caching layer and admin UI requirement. Migrate in Phase 1. |
| 9 | No Sentry / error tracking during validation | 20 users + Vercel's built-in logs is sufficient. Add Sentry before Phase 1 launch. |
| 10 | Manual payment for validation | Building Razorpay webhooks for 20 free users is wasted engineering time. |
| 11 | No separate staging environment | Vercel preview deploys per branch serve the same purpose for 20 users. Add a dedicated staging Supabase project before Phase 1. |
| 12 | Static task list in MVP | Editable tasks with checkboxes, sub-items, and localStorage sync is Phase 2 scope. The AI generates the task list; the founder reads it. |
| 13 | `useChat` from `ai/react`, not `@ai-sdk/react` | `@ai-sdk/react` removes `setInput`, changes `append` signature, and breaks existing patterns. `ai/react` is the stable API. Use `// eslint-disable-next-line @typescript-eslint/no-deprecated` if needed. |
| 14 | Own input state in ChatContainer | `useChat`'s built-in `input`/`setInput` can return `undefined`. Using a separate `useState` for input text is more reliable. |
| 15 | Brain dump prepended server-side, hidden from UI | Stage 3 UI only shows stage=3 messages (clean conversation). API route fetches the stage=2 brain dump from DB and prepends it to Claude's messages array. If missing, Claude has no context and produces a minimal response. |
| 16 | Dashboard transition is a button, not auto-redirect | Constitution §11 decision #12: "Do NOT auto-navigate. The founder should feel the moment of transition." Shows a green "Your dashboard is ready." card with "View your dashboard →" button. |
| 17 | `justfour` PostgreSQL schema, not `public` | Avoids polluting the Supabase public schema. Auto-created by `src/server/db/init.ts` on startup via `instrumentation.ts`. The `DATABASE_URL` env var is required for direct Postgres access during init. |
| 18 | Middleware clears stale refresh tokens | `Invalid Refresh Token` errors from Supabase are caught in middleware: all `sb-*` cookies are cleared and the user is redirected to `/`. Authenticated users hitting `/` are immediately redirected to `/onboard`. |
| 19 | Nginx replaced by Caddy | Caddy auto-provisions Let's Encrypt TLS, eliminating manual cert management. Simpler config, no `nginx.conf` to maintain. |

---

*Document version: 1.1 · May 2026 — updated to reflect implementation*
*Next review: after Sprint 2 completion — validate dashboard generation works end-to-end before proceeding.*
