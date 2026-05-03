import { useState, useRef, useEffect, useCallback } from "react";

// ─── Design Tokens (inherited from locked design system) ──────
//
// Typography:
//   Display:  Libre Baskerville, serif (editorial, serious)
//   Body/UI:  Outfit, sans-serif (clean, geometric)
//   Meta:     JetBrains Mono, monospace
//
// Colors:
//   surface:      #F7F6F3
//   surface2:     #EFEEE9
//   ink:          #1A1A1A
//   ink2:         #6B6B6B
//   ink3:         #9B9B9B
//   border:       #E2E1DC
//   border-light: #F0EFEA
//   trap.bg:      #FEF2F2
//   trap.text:    #991B1B
//   trap.accent:  #DC2626
//   cta-bg:       #1A1A1A
//   cta-text:     #FFFFFF
//
// Layout:
//   max-width: 640px, centered
//   padding: 20px horizontal
//   touch targets: min 44px
//
// New tokens for onboard screens:
//
// Chip (unselected):
//   bg: #FFFFFF
//   border: 1px solid #E2E1DC
//   border-radius: 10px
//   padding: 14px 18px
//   hover bg: #FAFAF8
//   hover border: #C4C3BE
//
// Chip (selected):
//   bg: #1A1A1A
//   text: #FFFFFF
//   border: 1px solid #1A1A1A
//
// Chip description text:
//   font: Outfit 13px 400
//   color: #9B9B9B (unselected), rgba(255,255,255,0.6) (selected)
//
// Category nudge chip:
//   bg: #FFFFFF
//   border: 1px dashed #D4D3CE
//   border-radius: 20px
//   padding: 8px 16px
//   font: Outfit 13px 500
//   color: #6B6B6B
//   hover bg: #EFEEE9
//
// Idea counter badge:
//   font: JetBrains Mono 12px 500
//   color: #047857
//   bg: #ECFDF5
//   border: 1px solid #D1FAE5
//   border-radius: 6px
//   padding: 4px 10px
//
// Return visit banner:
//   bg: #FFFBEB
//   border: 1px solid #FEF3C7
//   border-radius: 12px
//   icon bg: #FEF3C7
//
// Error toast:
//   bg: #FFFFFF
//   border: 1px solid #E2E1DC
//   border-radius: 12px
//   shadow: 0 4px 24px rgba(0,0,0,0.1)
//
// Error (critical):
//   bg: #FEF2F2
//   border: 1px solid #FECACA
//   accent: #DC2626
//
// Category sweep nudge:
//   bg: #EFEEE9
//   border-radius: 10px
//   padding: 14px 18px
// ────────────────────────────────────────────────────────────────

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
`;

// ─── SHELL: TopBar (identical to locked component) ────────────
// File: components/shell/TopBar.tsx
// Copied verbatim from stage3_chat_final.jsx / stage4_dashboard_final.jsx
function TopBar({ variant = "onboard", email = "ashish@robolane.in", onStartOver }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    if (menuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const initial = email ? email.charAt(0).toUpperCase() : "?";
  const menuItems = [
    { label: "Log out", onClick: () => {}, danger: true },
  ];
  const isLoggedIn = variant !== "public";

  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 50,
      backgroundColor: "rgba(247, 246, 243, 0.92)",
      backdropFilter: "blur(12px)", borderBottom: "1px solid #E2E1DC",
    }}>
      <div style={{
        maxWidth: 640, margin: "0 auto", padding: "10px 20px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        minHeight: 44,
      }}>
        <div style={{
          fontFamily: "'Libre Baskerville', serif", fontSize: 16, fontWeight: 700,
          color: "#1A1A1A", letterSpacing: "-0.02em",
        }}>JustFour</div>

        {isLoggedIn && (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {variant === "onboard" && onStartOver && (
              <button onClick={onStartOver} style={{
                fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "#9B9B9B",
                background: "none", border: "none", cursor: "pointer",
                padding: "8px", borderRadius: 6, minHeight: 44,
                display: "flex", alignItems: "center",
                transition: "color 0.15s ease",
              }}
                onMouseEnter={(e) => e.target.style.color = "#6B6B6B"}
                onMouseLeave={(e) => e.target.style.color = "#9B9B9B"}
              >Start over</button>
            )}
            <div ref={menuRef} style={{ position: "relative" }}>
              <button onClick={() => setMenuOpen(!menuOpen)} style={{
                width: 36, height: 36, borderRadius: "50%",
                backgroundColor: menuOpen ? "#E2E1DC" : "#EFEEE9",
                border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 600,
                color: "#4B4B4B", padding: 0, minWidth: 44, minHeight: 44,
                transition: "background-color 0.15s ease",
              }}
                onMouseEnter={(e) => { if (!menuOpen) e.currentTarget.style.backgroundColor = "#E2E1DC"; }}
                onMouseLeave={(e) => { if (!menuOpen) e.currentTarget.style.backgroundColor = "#EFEEE9"; }}
              >{initial}</button>
              {menuOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 6px)", right: 0,
                  width: 220, backgroundColor: "#FFFFFF",
                  border: "1px solid #E2E1DC", borderRadius: 10,
                  boxShadow: "0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
                  overflow: "hidden", animation: "dropdownIn 0.15s ease-out",
                }}>
                  <div style={{
                    padding: "12px 16px 10px", fontFamily: "'Outfit', sans-serif",
                    fontSize: 13, color: "#6B6B6B", borderBottom: "1px solid #F0EFEA",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>{email}</div>
                  {menuItems.map((item, i) => (
                    <button key={i} onClick={() => { setMenuOpen(false); item.onClick?.(); }} style={{
                      width: "100%", padding: "10px 16px", backgroundColor: "transparent",
                      border: "none", cursor: "pointer", fontFamily: "'Outfit', sans-serif", fontSize: 14,
                      color: item.danger ? "#DC2626" : "#1A1A1A", textAlign: "left",
                      minHeight: 44, transition: "background-color 0.1s ease",
                    }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#F7F6F3"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                    >{item.label}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes dropdownIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// STAGE 0 — ARRIVAL SCREEN
// ═══════════════════════════════════════════════════════════════
// File: components/onboard/ArrivalScreen.tsx
//
// Trigger: Magic link clicked, user authenticated, first visit
// Content: Greeting + single framing line + CTA
// Rules: No product tour, no "how it works", no progress bar
//
// The screen is intentionally sparse — confidence through
// restraint. The empty space says "we respect your time."
// The serif headline carries the editorial weight.
// The CTA is the only interactive element.

function ArrivalScreen({ onStart }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{
      maxWidth: 640, margin: "0 auto", padding: "0 20px",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center",
      minHeight: "calc(100vh - 65px)", // full height minus TopBar
    }}>
      <div style={{
        textAlign: "center", maxWidth: 440,
        animation: "arrivalFadeUp 0.8s ease-out",
      }}>
        {/* Framing line */}
        <div style={{
          fontFamily: "'Libre Baskerville', serif",
          fontSize: 28,
          fontWeight: 700,
          color: "#1A1A1A",
          letterSpacing: "-0.03em",
          lineHeight: 1.3,
          marginBottom: 16,
        }}>
          Let's figure out what you should actually be working on this week.
        </div>

        {/* Subtext */}
        <div style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 15,
          color: "#9B9B9B",
          lineHeight: 1.6,
          marginBottom: 48,
        }}>
          10 minutes. One conversation. A clear plan.
        </div>

        {/* CTA button */}
        <button
          onClick={onStart}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 16,
            fontWeight: 600,
            padding: "16px 40px",
            borderRadius: 12,
            border: "none",
            backgroundColor: hovered ? "#333333" : "#1A1A1A",
            color: "#FFFFFF",
            cursor: "pointer",
            letterSpacing: "-0.01em",
            minHeight: 44,
            transition: "background-color 0.15s ease, transform 0.15s ease",
            transform: hovered ? "translateY(-1px)" : "translateY(0)",
          }}
        >
          Dump your list →
        </button>
      </div>

      <style>{`
        @keyframes arrivalFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// STAGE 1 — CALIBRATION CHIPS
// ═══════════════════════════════════════════════════════════════
// File: components/onboard/CalibrationChips.tsx
//
// Format: One question at a time. Chip-select, NOT form fields.
// Progressive reveal — answer Q1, Q2 questions appear one by one.
//
// Question 1: "Where are you right now?" — 5 stage chips
// Question 2: Stage-adaptive yes/no questions, one at a time
//
// On completion: save all answers → advance to Stage 2
//
// Design principles:
//   - Each question animates in from below (stagger feel)
//   - Selected chip goes dark (#1A1A1A bg, white text)
//   - Unselected chips have subtle hover state
//   - Description text visible on each chip (not tooltip)
//   - Completed questions stay visible but dimmed (review trail)

const STAGE_OPTIONS = [
  { id: "ideation",      label: "Ideation",      desc: "Have an idea, haven't started building yet" },
  { id: "building",      label: "Building",       desc: "Actively prototyping, nothing in users' hands" },
  { id: "pre_revenue",   label: "Pre-revenue",    desc: "Have something to show, talking to customers, no revenue yet" },
  { id: "early_revenue", label: "Early revenue",  desc: "First paying customers" },
  { id: "scaling",       label: "Scaling",         desc: "Proven model, growing" },
];

const STAGE_QUESTIONS = {
  ideation: [
    { id: "has_prototype",  q: "Do you have any kind of working prototype, even rough?", options: ["Yes", "No"] },
    { id: "spoken_customer", q: "Have you spoken to a potential customer yet?", options: ["Yes", "No"] },
    { id: "has_cofounder",  q: "Is anyone else working on this with you?", options: ["Yes", "No"] },
  ],
  building: [
    { id: "has_cofounder",  q: "Do you have a co-founder or committed technical collaborator?", options: ["Yes", "No"] },
    { id: "shown_user",     q: "Have you shown anything to a potential user?", options: ["Yes", "No"] },
    { id: "funding_status", q: "Are you self-funded or do you have outside money?", options: ["Self-funded", "Outside money"] },
  ],
  pre_revenue: [
    { id: "paying_customer", q: "Do you have a paying customer or signed letter of intent?", options: ["Yes", "No"] },
    { id: "runway",          q: "How long is your runway?", options: ["< 6 months", "6–12 months", "12+ months"] },
    { id: "has_cofounder",   q: "Do you have a co-founder?", options: ["Yes", "No"] },
  ],
  early_revenue: [
    { id: "funding_status", q: "Funding status?", options: ["Bootstrapped", "Seed", "Series A+"] },
    { id: "team_size",      q: "Team size?", options: ["Solo", "2–5", "6+"] },
  ],
  scaling: [
    { id: "funding_status", q: "Funding status?", options: ["Bootstrapped", "Seed", "Series A+"] },
    { id: "team_size",      q: "Team size?", options: ["Solo", "2–5", "6+"] },
  ],
};

function StageChip({ option, selected, onSelect, dimmed }) {
  const [hovered, setHovered] = useState(false);
  const isSelected = selected === option.id;

  return (
    <button
      onClick={() => onSelect(option.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%",
        padding: "14px 18px",
        borderRadius: 10,
        border: `1px solid ${isSelected ? "#1A1A1A" : hovered ? "#C4C3BE" : "#E2E1DC"}`,
        backgroundColor: isSelected ? "#1A1A1A" : hovered ? "#FAFAF8" : "#FFFFFF",
        cursor: dimmed ? "default" : "pointer",
        textAlign: "left",
        transition: "all 0.15s ease",
        minHeight: 44,
        opacity: dimmed && !isSelected ? 0.4 : 1,
        pointerEvents: dimmed ? "none" : "auto",
      }}
    >
      <div style={{
        fontFamily: "'Outfit', sans-serif",
        fontSize: 15,
        fontWeight: 600,
        color: isSelected ? "#FFFFFF" : "#1A1A1A",
        marginBottom: 3,
        letterSpacing: "-0.01em",
      }}>
        {option.label}
      </div>
      <div style={{
        fontFamily: "'Outfit', sans-serif",
        fontSize: 13,
        color: isSelected ? "rgba(255,255,255,0.6)" : "#9B9B9B",
        lineHeight: 1.4,
      }}>
        {option.desc}
      </div>
    </button>
  );
}

function AnswerChip({ label, selected, onSelect }) {
  const [hovered, setHovered] = useState(false);
  const isSelected = selected === label;

  return (
    <button
      onClick={() => onSelect(label)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "10px 20px",
        borderRadius: 8,
        border: `1px solid ${isSelected ? "#1A1A1A" : hovered ? "#C4C3BE" : "#E2E1DC"}`,
        backgroundColor: isSelected ? "#1A1A1A" : hovered ? "#FAFAF8" : "#FFFFFF",
        cursor: "pointer",
        fontFamily: "'Outfit', sans-serif",
        fontSize: 14,
        fontWeight: 500,
        color: isSelected ? "#FFFFFF" : "#1A1A1A",
        transition: "all 0.15s ease",
        minHeight: 44,
        letterSpacing: "-0.01em",
      }}
    >
      {label}
    </button>
  );
}

function CalibrationChips({ onComplete }) {
  const [stage, setStage] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQ, setCurrentQ] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const stageQuestions = stage ? (STAGE_QUESTIONS[stage] || []) : [];
  const allQuestionsAnswered = stage && currentQ >= stageQuestions.length;

  // Auto-advance after chip selection
  const handleStageSelect = (id) => {
    setStage(id);
    setCurrentQ(0);
    setAnswers({});
  };

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    // Small delay, then show next question
    setTimeout(() => {
      setCurrentQ(prev => prev + 1);
    }, 300);
  };

  // Auto-complete when all questions answered
  useEffect(() => {
    if (allQuestionsAnswered && !transitioning) {
      setTransitioning(true);
      setTimeout(() => {
        onComplete?.({ startup_stage: stage, ...answers });
      }, 800);
    }
  }, [allQuestionsAnswered, transitioning]);

  return (
    <div style={{
      maxWidth: 640, margin: "0 auto", padding: "0 20px",
      minHeight: "calc(100vh - 65px)",
      display: "flex", flexDirection: "column",
      paddingTop: 60, paddingBottom: 80,
    }}>
      {/* Question 1 — Startup stage */}
      <div style={{
        marginBottom: 48,
        animation: "questionIn 0.5s ease-out",
        opacity: stage ? 0.5 : 1,
        transition: "opacity 0.4s ease",
      }}>
        <div style={{
          fontFamily: "'Libre Baskerville', serif",
          fontSize: 22,
          fontWeight: 700,
          color: "#1A1A1A",
          letterSpacing: "-0.03em",
          marginBottom: 8,
        }}>
          Where are you right now?
        </div>
        <div style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 14,
          color: "#9B9B9B",
          marginBottom: 20,
        }}>
          This calibrates the conversation to your stage.
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {STAGE_OPTIONS.map((opt) => (
            <StageChip
              key={opt.id}
              option={opt}
              selected={stage}
              onSelect={handleStageSelect}
              dimmed={!!stage}
            />
          ))}
        </div>
      </div>

      {/* Question 2 — Stage-adaptive, one at a time */}
      {stage && stageQuestions.map((sq, i) => {
        if (i > currentQ) return null; // not yet revealed
        const isActive = i === currentQ;
        const isAnswered = answers[sq.id] !== undefined;

        return (
          <div
            key={sq.id}
            style={{
              marginBottom: 36,
              animation: "questionIn 0.4s ease-out",
              opacity: isActive ? 1 : 0.5,
              transition: "opacity 0.4s ease",
            }}
          >
            <div style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 16,
              fontWeight: 600,
              color: "#1A1A1A",
              marginBottom: 14,
              lineHeight: 1.4,
              letterSpacing: "-0.01em",
            }}>
              {sq.q}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {sq.options.map((opt) => (
                <AnswerChip
                  key={opt}
                  label={opt}
                  selected={answers[sq.id]}
                  onSelect={(ans) => {
                    if (isActive && !isAnswered) {
                      handleAnswerSelect(sq.id, ans);
                    }
                  }}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* Completion transition */}
      {allQuestionsAnswered && (
        <div style={{
          textAlign: "center",
          padding: "24px 0",
          animation: "questionIn 0.5s ease-out",
        }}>
          <div style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 15,
            color: "#047857",
            fontWeight: 500,
          }}>
            Got it. Let's get everything out of your head.
          </div>
          <div style={{
            display: "flex", justifyContent: "center", gap: 4,
            marginTop: 16,
          }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: "50%",
                backgroundColor: "#047857",
                animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
              }} />
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes questionIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// STAGE 2 — BRAIN DUMP
// ═══════════════════════════════════════════════════════════════
// File: components/onboard/BrainDumpArea.tsx
//
// Opening prompt (static text above textarea)
// Large textarea — autogrow, no char limit
// Running counter (top right): "N ideas captured"
// Category nudge chips — appear after 30s of no typing
//   Only show chips for categories NOT mentioned
//   Tapping inserts label into textarea
// "I'm done" button — disabled until 5+ ideas
// Category sweep: after "I'm done", nudge on uncovered categories
//
// Interaction feel: napkin, not spreadsheet.
// The counter should feel encouraging, not measuring.

const CATEGORIES = [
  { id: "product",     label: "Product / Tech",     keywords: ["product", "tech", "build", "prototype", "software", "hardware", "code", "develop", "feature", "mvp", "app"] },
  { id: "team",        label: "Team & co-founder",  keywords: ["team", "hire", "co-founder", "cofounder", "engineer", "recrui", "people", "talent"] },
  { id: "fundraising", label: "Fundraising",        keywords: ["fund", "invest", "rais", "capital", "money", "seed", "series", "vc", "angel"] },
  { id: "partnerships",label: "Partnerships",       keywords: ["partner", "collab", "alliance", "deal", "integrat", "vendor", "supplier"] },
  { id: "branding",    label: "Branding & marketing",keywords: ["brand", "market", "logo", "design", "social", "content", "launch", "pr", "advertising"] },
  { id: "operations",  label: "Operations",          keywords: ["ops", "operat", "admin", "legal", "compliance", "process", "logistics", "sales", "customer", "pilot"] },
];

function countIdeas(text) {
  if (!text.trim()) return 0;
  // Split on newlines and commas, filter out empties and very short fragments
  return text
    .split(/[\n,]/)
    .map(s => s.trim())
    .filter(s => s.length > 3)
    .length;
}

function getMentionedCategories(text) {
  const lower = text.toLowerCase();
  return CATEGORIES.filter(cat =>
    cat.keywords.some(kw => lower.includes(kw))
  ).map(cat => cat.id);
}

function BrainDumpArea({ onDone, resumeText = "" }) {
  const [text, setText] = useState(resumeText);
  const [showNudges, setShowNudges] = useState(false);
  const [sweepPhase, setSweepPhase] = useState(null); // null | "sweeping" | "done"
  const [sweepCategory, setSweepCategory] = useState(null);
  const textareaRef = useRef(null);
  const timerRef = useRef(null);
  const ideaCount = countIdeas(text);
  const mentioned = getMentionedCategories(text);
  const unmentioned = CATEGORIES.filter(c => !mentioned.includes(c.id));

  // Auto-grow textarea
  const autoGrow = useCallback(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.max(200, ta.scrollHeight) + "px";
    }
  }, []);

  // Show nudges after 30s of no typing
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (text.trim().length > 10 && unmentioned.length > 0) {
      timerRef.current = setTimeout(() => setShowNudges(true), 3000); // 3s for demo, 30s in prod
    }
    return () => clearTimeout(timerRef.current);
  }, [text]);

  const insertCategory = (label) => {
    const insertion = `\n${label}: `;
    setText(prev => prev + insertion);
    setTimeout(() => {
      textareaRef.current?.focus();
      autoGrow();
    }, 50);
  };

  const handleDone = () => {
    if (unmentioned.length > 0 && sweepPhase === null) {
      // Start category sweep
      setSweepPhase("sweeping");
      setSweepCategory(unmentioned[0]);
    } else {
      onDone?.(text);
    }
  };

  const handleSweepSkip = () => {
    const currentIdx = unmentioned.findIndex(c => c.id === sweepCategory?.id);
    if (currentIdx < unmentioned.length - 1) {
      setSweepCategory(unmentioned[currentIdx + 1]);
    } else {
      setSweepPhase("done");
      setTimeout(() => onDone?.(text), 500);
    }
  };

  const handleSweepAdd = () => {
    insertCategory(sweepCategory.label);
    setSweepPhase(null);
    setSweepCategory(null);
    // Let them type, they can hit "I'm done" again
  };

  return (
    <div style={{
      maxWidth: 640, margin: "0 auto", padding: "0 20px",
      minHeight: "calc(100vh - 65px)",
      display: "flex", flexDirection: "column",
      paddingTop: 40, paddingBottom: 120,
    }}>
      {/* Header row: prompt + counter */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        marginBottom: 20, gap: 16,
      }}>
        <div style={{
          fontFamily: "'Libre Baskerville', serif",
          fontSize: 18,
          fontWeight: 700,
          color: "#1A1A1A",
          letterSpacing: "-0.02em",
          lineHeight: 1.4,
          flex: 1,
        }}>
          Everything you're thinking about doing in the next 30 days.
        </div>

        {/* Idea counter */}
        {ideaCount > 0 && (
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            fontWeight: 500,
            color: "#047857",
            backgroundColor: "#ECFDF5",
            border: "1px solid #D1FAE5",
            borderRadius: 6,
            padding: "4px 10px",
            whiteSpace: "nowrap",
            flexShrink: 0,
            animation: "fadeIn 0.3s ease-out",
          }}>
            {ideaCount} {ideaCount === 1 ? "idea" : "ideas"}
          </div>
        )}
      </div>

      {/* Subtext */}
      <div style={{
        fontFamily: "'Outfit', sans-serif",
        fontSize: 14,
        color: "#9B9B9B",
        marginBottom: 20,
        lineHeight: 1.5,
      }}>
        Product, fundraising, team, sales, admin, random ideas, worries. Don't edit yourself.
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setShowNudges(false);
          autoGrow();
        }}
        placeholder="Navigation stack for the robot&#10;Find a co-founder&#10;Elevator API integration&#10;Talk to potential customers&#10;Figure out pricing..."
        style={{
          width: "100%",
          minHeight: 200,
          padding: "16px 18px",
          borderRadius: 12,
          border: "1px solid #E2E1DC",
          backgroundColor: "#FFFFFF",
          fontFamily: "'Outfit', sans-serif",
          fontSize: 15,
          color: "#1A1A1A",
          lineHeight: 1.7,
          outline: "none",
          resize: "none",
          boxSizing: "border-box",
          transition: "border-color 0.15s ease",
        }}
        onFocus={(e) => e.target.style.borderColor = "#C4C3BE"}
        onBlur={(e) => e.target.style.borderColor = "#E2E1DC"}
      />

      {/* Category nudge chips — appear after inactivity */}
      {showNudges && unmentioned.length > 0 && sweepPhase === null && (
        <div style={{
          marginTop: 16,
          animation: "questionIn 0.4s ease-out",
        }}>
          <div style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 13,
            color: "#9B9B9B",
            marginBottom: 10,
          }}>
            What about...
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {unmentioned.map((cat) => (
              <button
                key={cat.id}
                onClick={() => insertCategory(cat.label)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 20,
                  border: "1px dashed #D4D3CE",
                  backgroundColor: "#FFFFFF",
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#6B6B6B",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  minHeight: 36,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#EFEEE9";
                  e.currentTarget.style.borderColor = "#C4C3BE";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#FFFFFF";
                  e.currentTarget.style.borderColor = "#D4D3CE";
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category sweep nudge */}
      {sweepPhase === "sweeping" && sweepCategory && (
        <div style={{
          marginTop: 20,
          padding: "14px 18px",
          backgroundColor: "#EFEEE9",
          borderRadius: 10,
          animation: "questionIn 0.4s ease-out",
        }}>
          <div style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 14,
            color: "#1A1A1A",
            marginBottom: 12,
            lineHeight: 1.5,
          }}>
            You haven't mentioned <strong>{sweepCategory.label.toLowerCase()}</strong> — anything there, even half-formed thoughts?
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={handleSweepAdd}
              style={{
                padding: "8px 16px", borderRadius: 8,
                border: "1px solid #E2E1DC", backgroundColor: "#FFFFFF",
                fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 500,
                color: "#1A1A1A", cursor: "pointer", minHeight: 36,
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#F7F6F3"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#FFFFFF"}
            >
              Yes, let me add
            </button>
            <button
              onClick={handleSweepSkip}
              style={{
                padding: "8px 16px", borderRadius: 8,
                border: "none", backgroundColor: "transparent",
                fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 500,
                color: "#9B9B9B", cursor: "pointer", minHeight: 36,
              }}
            >
              Nothing there
            </button>
          </div>
        </div>
      )}

      {/* "I'm done" bar — fixed at bottom */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        backgroundColor: "rgba(247, 246, 243, 0.95)",
        backdropFilter: "blur(12px)", borderTop: "1px solid #E2E1DC",
      }}>
        <div style={{
          maxWidth: 640, margin: "0 auto", padding: "14px 20px 22px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          {ideaCount < 5 ? (
            <div style={{
              fontFamily: "'Outfit', sans-serif", fontSize: 13,
              color: "#9B9B9B", lineHeight: 1.4,
            }}>
              Keep going — {5 - ideaCount} more {5 - ideaCount === 1 ? "idea" : "ideas"} to unlock the next step
            </div>
          ) : (
            <div style={{
              fontFamily: "'Outfit', sans-serif", fontSize: 13,
              color: "#6B6B6B", lineHeight: 1.4,
            }}>
              {ideaCount} ideas captured — ready when you are
            </div>
          )}
          <button
            onClick={handleDone}
            disabled={ideaCount < 5}
            style={{
              padding: "12px 28px",
              borderRadius: 10,
              border: "none",
              backgroundColor: ideaCount >= 5 ? "#1A1A1A" : "#E2E1DC",
              color: ideaCount >= 5 ? "#FFFFFF" : "#9B9B9B",
              fontFamily: "'Outfit', sans-serif",
              fontSize: 14,
              fontWeight: 600,
              cursor: ideaCount >= 5 ? "pointer" : "default",
              minHeight: 44,
              letterSpacing: "-0.01em",
              transition: "all 0.15s ease",
              flexShrink: 0,
            }}
          >
            I'm done
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes questionIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// RETURN VISIT BANNER
// ═══════════════════════════════════════════════════════════════
// File: components/onboard/ReturnVisitBanner.tsx
//
// Shown when a returning user is at Stage 1–3.
// Warm amber tone — not an error, not a celebration.
// Two actions: Continue (primary) and Start over (secondary).
//
// For Stage 2 return: "You were in the middle of your brain dump"
// For Stage 3 return: "You left mid-conversation"
//
// Positioned at top of content area, below TopBar.
// Dismisses on "Continue" (close banner, show current stage).
// "Start over" triggers reset to Stage 0.

function ReturnVisitBanner({ stage, onContinue, onStartOver }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const messages = {
    1: { title: "Welcome back.", body: "You were setting up — want to continue where you left off?" },
    2: { title: "You were mid-brain-dump.", body: "Your ideas are still here. Pick up where you left off, or start fresh." },
    3: { title: "You left mid-conversation.", body: "Your progress is saved. Continue from where you stopped, or start over." },
  };
  const msg = messages[stage] || messages[3];

  return (
    <div style={{
      maxWidth: 640, margin: "0 auto", padding: "16px 20px 0",
      animation: "bannerSlideIn 0.4s ease-out",
    }}>
      <div style={{
        padding: "18px 20px",
        backgroundColor: "#FFFBEB",
        border: "1px solid #FEF3C7",
        borderRadius: 12,
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            backgroundColor: "#FEF3C7",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, fontSize: 16,
          }}>↩</div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 700,
              color: "#92400E", marginBottom: 4,
            }}>{msg.title}</div>
            <div style={{
              fontFamily: "'Outfit', sans-serif", fontSize: 14,
              color: "#A16207", lineHeight: 1.5, marginBottom: 14,
            }}>{msg.body}</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => { setDismissed(true); onContinue?.(); }}
                style={{
                  padding: "8px 20px", borderRadius: 8,
                  border: "none", backgroundColor: "#1A1A1A",
                  fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 600,
                  color: "#FFFFFF", cursor: "pointer", minHeight: 36,
                  transition: "background-color 0.15s ease",
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#333333"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#1A1A1A"}
              >Continue</button>
              <button
                onClick={() => { setDismissed(true); onStartOver?.(); }}
                style={{
                  padding: "8px 16px", borderRadius: 8,
                  border: "none", backgroundColor: "transparent",
                  fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 500,
                  color: "#9B9B9B", cursor: "pointer", minHeight: 36,
                }}
              >Start over</button>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes bannerSlideIn {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// ERROR STATES
// ═══════════════════════════════════════════════════════════════
// File: components/chat/ErrorToast.tsx
//
// 4 error variants:
//   1. api_error    — "Something went wrong. Tap to retry."
//   2. rate_limit   — "Busy right now. Try again in a moment."
//   3. stream_drop  — "Connection lost. Tap to continue."
//   4. persistent   — "We're having trouble. Come back in a few."
//
// Positioned inline in the chat, below the last message.
// Not a browser toast — it's part of the message flow.
// Errors 1–3 have a retry button. Error 4 does not.
//
// Design: white card with subtle border, icon left-aligned.
// Persistent error: red-tinted background (trap palette).

function ErrorState({ variant = "api_error", onRetry, partialMessage }) {
  const configs = {
    api_error: {
      icon: "↻",
      title: "Something went wrong.",
      body: "Your conversation is saved. Tap to try again.",
      bg: "#FFFFFF",
      border: "#E2E1DC",
      iconBg: "#F3F4F6",
      titleColor: "#1A1A1A",
      bodyColor: "#6B6B6B",
      retryLabel: "Retry",
    },
    rate_limit: {
      icon: "⏳",
      title: "Busy right now.",
      body: "Lots of founders thinking hard today. Try again in a moment.",
      bg: "#FFFFFF",
      border: "#E2E1DC",
      iconBg: "#FFFBEB",
      titleColor: "#1A1A1A",
      bodyColor: "#6B6B6B",
      retryLabel: "Try again",
    },
    stream_drop: {
      icon: "⚡",
      title: "Connection lost.",
      body: "Your last message was saved. Tap to pick up where we left off.",
      bg: "#FFFFFF",
      border: "#E2E1DC",
      iconBg: "#FEF3C7",
      titleColor: "#1A1A1A",
      bodyColor: "#6B6B6B",
      retryLabel: "Continue",
    },
    persistent: {
      icon: "⚠",
      title: "We're having trouble right now.",
      body: "Your conversation is saved — come back in a few minutes and you'll pick up exactly where you left off.",
      bg: "#FEF2F2",
      border: "#FECACA",
      iconBg: "#FEE2E2",
      titleColor: "#991B1B",
      bodyColor: "#991B1B",
      retryLabel: null,
    },
  };

  const c = configs[variant];

  return (
    <div style={{ animation: "errorIn 0.3s ease-out" }}>
      {/* Partial message (stream drop only) */}
      {variant === "stream_drop" && partialMessage && (
        <div style={{
          display: "flex", justifyContent: "flex-start", marginBottom: 8,
        }}>
          <div style={{
            maxWidth: "88%", padding: "14px 18px",
            borderRadius: "18px 18px 18px 4px",
            backgroundColor: "#EFEEE9",
            fontFamily: "'Outfit', sans-serif", fontSize: 15,
            color: "#1A1A1A", lineHeight: 1.6,
            position: "relative",
          }}>
            {partialMessage}
            <span style={{
              display: "inline-block",
              width: 2, height: 16,
              backgroundColor: "#9B9B9B",
              marginLeft: 2, verticalAlign: "text-bottom",
              animation: "blink 1s step-end infinite",
            }} />
          </div>
        </div>
      )}

      {/* Error card */}
      <div style={{
        padding: "16px 20px",
        backgroundColor: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: 12,
        marginBottom: 16,
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            backgroundColor: c.iconBg,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, fontSize: 15,
          }}>{c.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 600,
              color: c.titleColor, marginBottom: 4,
            }}>{c.title}</div>
            <div style={{
              fontFamily: "'Outfit', sans-serif", fontSize: 13,
              color: c.bodyColor, lineHeight: 1.5,
              opacity: variant === "persistent" ? 0.85 : 1,
            }}>{c.body}</div>
            {c.retryLabel && (
              <button
                onClick={onRetry}
                style={{
                  marginTop: 12, padding: "8px 20px", borderRadius: 8,
                  border: variant === "persistent" ? "1px solid #FECACA" : "1px solid #E2E1DC",
                  backgroundColor: variant === "persistent" ? "#FFFFFF" : "#FAFAF8",
                  fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 600,
                  color: "#1A1A1A", cursor: "pointer", minHeight: 36,
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#1A1A1A";
                  e.currentTarget.style.color = "#FFFFFF";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = variant === "persistent" ? "#FFFFFF" : "#FAFAF8";
                  e.currentTarget.style.color = "#1A1A1A";
                }}
              >{c.retryLabel}</button>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes errorIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// MAIN — MOCKUP VIEWER
// ═══════════════════════════════════════════════════════════════
// Toggle between all screen states to review the designs.

const VIEWS = [
  { id: "stage0",       label: "Stage 0 · Arrival" },
  { id: "stage1",       label: "Stage 1 · Calibration" },
  { id: "stage2",       label: "Stage 2 · Brain dump" },
  { id: "stage2_sweep", label: "Stage 2 · Sweep" },
  { id: "return_s2",    label: "Return · Brain dump" },
  { id: "return_s3",    label: "Return · Chat" },
  { id: "err_api",      label: "Error · API" },
  { id: "err_rate",     label: "Error · Rate limit" },
  { id: "err_stream",   label: "Error · Stream drop" },
  { id: "err_persist",  label: "Error · Persistent" },
];

export default function OnboardScreensMockup() {
  const [activeView, setActiveView] = useState("stage0");

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F7F6F3", fontFamily: "'Outfit', sans-serif" }}>
      <style>{FONTS}</style>

      {/* TopBar — uses onboard variant for all screens here */}
      <TopBar
        variant={activeView === "stage0" ? "onboard" : "onboard"}
        email="ashish@robolane.in"
        onStartOver={activeView !== "stage0" ? () => setActiveView("stage0") : undefined}
      />

      {/* ─── Mockup tab selector ──────────────────────────── */}
      <div style={{
        maxWidth: 640, margin: "0 auto", padding: "12px 20px 0",
      }}>
        <div style={{
          display: "flex", gap: 4, flexWrap: "wrap",
          padding: "4px 0 12px",
          borderBottom: "1px solid #E2E1DC",
        }}>
          {VIEWS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              style={{
                padding: "5px 10px", borderRadius: 6, border: "none",
                fontSize: 11, fontWeight: 500, fontFamily: "'JetBrains Mono', monospace",
                cursor: "pointer", whiteSpace: "nowrap",
                backgroundColor: activeView === tab.id ? "#1A1A1A" : "transparent",
                color: activeView === tab.id ? "#FFFFFF" : "#9B9B9B",
                transition: "all 0.15s ease",
              }}
            >{tab.label}</button>
          ))}
        </div>
        <div style={{
          fontSize: 11, color: "#9B9B9B", fontFamily: "'JetBrains Mono', monospace",
          padding: "8px 4px 0", letterSpacing: "0.02em",
        }}>
          MOCKUP — {VIEWS.find(v => v.id === activeView)?.label}. All screens use the locked TopBar + design tokens.
        </div>
      </div>

      {/* ─── Screen content ───────────────────────────────── */}

      {activeView === "stage0" && (
        <ArrivalScreen onStart={() => setActiveView("stage1")} />
      )}

      {activeView === "stage1" && (
        <CalibrationChips onComplete={(ctx) => {
          console.log("Calibration complete:", ctx);
          setActiveView("stage2");
        }} />
      )}

      {activeView === "stage2" && (
        <BrainDumpArea onDone={(text) => console.log("Brain dump:", text)} />
      )}

      {activeView === "stage2_sweep" && (
        <BrainDumpArea
          resumeText={"Navigation stack — QR codes on the ground\nElevator integration with KONE\nFind a pilot society\nHardware — chassis needs to move\nVoice interaction for the robot\nFace recognition in elevators\nRaise $100M funding"}
          onDone={(text) => console.log("Brain dump:", text)}
        />
      )}

      {activeView === "return_s2" && (
        <>
          <ReturnVisitBanner
            stage={2}
            onContinue={() => {}}
            onStartOver={() => setActiveView("stage0")}
          />
          <BrainDumpArea
            resumeText={"Navigation stack — QR codes\nElevator integration\nFind a co-founder\nHardware prototype"}
            onDone={(text) => console.log("Brain dump:", text)}
          />
        </>
      )}

      {activeView === "return_s3" && (
        <>
          <ReturnVisitBanner
            stage={3}
            onContinue={() => {}}
            onStartOver={() => setActiveView("stage0")}
          />
          {/* Simulated chat with last messages */}
          <div style={{ maxWidth: 640, margin: "0 auto", padding: "24px 20px 80px" }}>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
              <div style={{
                maxWidth: "80%", padding: "10px 16px",
                borderRadius: "18px 18px 4px 18px",
                backgroundColor: "#1A1A1A", color: "#FFFFFF",
                fontFamily: "'Outfit', sans-serif", fontSize: 15, lineHeight: 1.6,
              }}>Navigation stack — the QR code pasting on the ground idea, beautiful designs so no one can say no.</div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 16 }}>
              <div style={{
                maxWidth: "88%", padding: "14px 18px",
                borderRadius: "18px 18px 18px 4px",
                backgroundColor: "#EFEEE9",
                fontFamily: "'Outfit', sans-serif", fontSize: 15, lineHeight: 1.6, color: "#1A1A1A",
              }}>Got it. The QR approach is smart — it's the one thing that makes a prototype possible without hardware dependencies. <strong style={{ fontWeight: 600 }}>Focus wall.</strong> Now what about the voice interaction and face recognition ideas?</div>
            </div>
            {/* Input bar */}
            <div style={{
              position: "fixed", bottom: 0, left: 0, right: 0,
              backgroundColor: "rgba(247, 246, 243, 0.95)",
              backdropFilter: "blur(12px)", borderTop: "1px solid #E2E1DC",
            }}>
              <div style={{ maxWidth: 640, margin: "0 auto", padding: "12px 20px 20px", display: "flex", gap: 10, alignItems: "flex-end" }}>
                <div style={{
                  flex: 1, padding: "12px 16px", borderRadius: 12,
                  border: "1px solid #E2E1DC", backgroundColor: "#FFFFFF",
                  fontFamily: "'Outfit', sans-serif", fontSize: 15, color: "#9B9B9B",
                  lineHeight: 1.5, minHeight: 44, display: "flex", alignItems: "center",
                }}>Continue the conversation...</div>
                <div style={{
                  padding: "12px 16px", borderRadius: 12, backgroundColor: "#E2E1DC",
                  color: "#9B9B9B", minHeight: 44, minWidth: 44,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </div>
              </div>
              <div style={{ fontSize: 11, color: "#9B9B9B", textAlign: "center", fontFamily: "'Outfit', sans-serif", paddingBottom: 8, marginTop: -6 }}>
                Push back on anything. You have the final say.
              </div>
            </div>
          </div>
        </>
      )}

      {/* Error states — shown inline as if in chat */}
      {activeView.startsWith("err_") && (
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "24px 20px 80px" }}>
          {/* Simulated preceding messages */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
            <div style={{
              maxWidth: "80%", padding: "10px 16px",
              borderRadius: "18px 18px 4px 18px",
              backgroundColor: "#1A1A1A", color: "#FFFFFF",
              fontFamily: "'Outfit', sans-serif", fontSize: 15, lineHeight: 1.6,
            }}>I'm also thinking about hiring — competitive culture, two sales teams competing...</div>
          </div>

          {activeView === "err_api" && (
            <ErrorState variant="api_error" onRetry={() => {}} />
          )}
          {activeView === "err_rate" && (
            <ErrorState variant="rate_limit" onRetry={() => {}} />
          )}
          {activeView === "err_stream" && (
            <ErrorState
              variant="stream_drop"
              partialMessage="You just spent 30 seconds on sales team structure, parallel hardware teams, and ESOP frameworks — for a company with no prototype, no pilot, and no co-foun"
              onRetry={() => {}}
            />
          )}
          {activeView === "err_persist" && (
            <ErrorState variant="persistent" />
          )}

          {/* Chat input bar */}
          <div style={{
            position: "fixed", bottom: 0, left: 0, right: 0,
            backgroundColor: "rgba(247, 246, 243, 0.95)",
            backdropFilter: "blur(12px)", borderTop: "1px solid #E2E1DC",
          }}>
            <div style={{ maxWidth: 640, margin: "0 auto", padding: "12px 20px 20px", display: "flex", gap: 10, alignItems: "flex-end" }}>
              <div style={{
                flex: 1, padding: "12px 16px", borderRadius: 12,
                border: "1px solid #E2E1DC",
                backgroundColor: activeView === "err_persist" ? "#F0F0ED" : "#FFFFFF",
                fontFamily: "'Outfit', sans-serif", fontSize: 15,
                color: "#9B9B9B", lineHeight: 1.5, minHeight: 44,
                display: "flex", alignItems: "center",
              }}>{activeView === "err_persist" ? "Conversation paused" : "Tell me more..."}</div>
              <div style={{
                padding: "12px 16px", borderRadius: 12,
                backgroundColor: "#E2E1DC", color: "#9B9B9B",
                minHeight: 44, minWidth: 44,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
