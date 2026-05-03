import { useState, useRef } from "react";

// ─── Design Tokens (unchanged — locked system) ────────────────
// All tokens from homepage_final.jsx apply identically.
// This file is purely a COPY variant test — structure and
// design are identical across all 5 versions.
// ────────────────────────────────────────────────────────────────

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
`;

// ─── TopBar (public variant) ──────────────────────────────────
function TopBar() {
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
      </div>
    </div>
  );
}

// ─── MagicLinkSent (shared across all variants) ───────────────
function MagicLinkSent({ email, onResend, onChangeEmail, resending }) {
  const [resent, setResent] = useState(false);
  const handleResend = () => {
    setResent(false);
    onResend?.();
    setTimeout(() => setResent(true), 1500);
  };
  return (
    <div style={{
      padding: "36px 32px", backgroundColor: "#EFEEE9",
      borderRadius: 16, textAlign: "center",
      animation: "confirmIn 0.5s ease-out",
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 14, backgroundColor: "#FFFFFF",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 20px", fontSize: 26,
        animation: "envelopePop 0.6s ease-out 0.2s both",
      }}>✉</div>
      <div style={{
        fontFamily: "'Libre Baskerville', serif", fontSize: 20, fontWeight: 700,
        color: "#1A1A1A", letterSpacing: "-0.02em", marginBottom: 8,
      }}>Check your email.</div>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 500,
        color: "#1A1A1A", marginBottom: 8, wordBreak: "break-all",
      }}>{email}</div>
      <div style={{
        fontFamily: "'Outfit', sans-serif", fontSize: 14, color: "#6B6B6B",
        lineHeight: 1.5, maxWidth: 320, margin: "0 auto 24px",
      }}>We sent a magic link. Click it to get started — no password needed.</div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 20 }}>
        <button onClick={handleResend} disabled={resending} style={{
          fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 500,
          color: resent ? "#047857" : resending ? "#9B9B9B" : "#6B6B6B",
          background: "none", border: "none",
          cursor: resending ? "default" : "pointer", padding: "8px 4px", minHeight: 36,
        }}
          onMouseEnter={(e) => { if (!resending && !resent) e.target.style.color = "#1A1A1A"; }}
          onMouseLeave={(e) => { if (!resending && !resent) e.target.style.color = "#6B6B6B"; }}
        >{resent ? "✓ Sent again" : resending ? "Sending..." : "Resend link"}</button>
        <div style={{ width: 1, height: 16, backgroundColor: "#D4D3CE" }} />
        <button onClick={onChangeEmail} style={{
          fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 500, color: "#6B6B6B",
          background: "none", border: "none", cursor: "pointer", padding: "8px 4px", minHeight: 36,
        }}
          onMouseEnter={(e) => e.target.style.color = "#1A1A1A"}
          onMouseLeave={(e) => e.target.style.color = "#6B6B6B"}
        >Different email</button>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// VARIANT CONTENT — 5 narratives, same skeleton
// ═══════════════════════════════════════════════════════════════
//
// Each variant defines:
//   headline, sub, cards (3), closing, insightItalic,
//   insightBody, ctaHeader, ctaSub, ctaButton, footerTagline
//
// The structural layout is IDENTICAL across all 5.
// Only the words change. That's the whole experiment.

const VARIANTS = {
  justfour: {
    id: "justfour",
    tab: "JustFour",
    narrative: "Primary · Direct & assertive",
    headline: "Stop doing everything.",
    sub: "Four things. This week. That's it.",
    cards: [
      { emoji: "🗂", text: "You have 23 tabs open — none of them are your product." },
      { emoji: "📊", text: "You spent Tuesday on your pitch deck. You have no customers yet." },
      { emoji: "😴", text: "You went to bed exhausted. Nothing moved." },
    ],
    closing: "This is the Founder's Trap. Every founder falls in. Most never notice.",
    insightItalic: "Not all your ideas are wrong. Most of them are just early.",
    insightBody: "The difference between a founder who moves and one who spins isn't intelligence or effort — it's knowing which week you're in. What's today's job? What's next month's job? Getting that wrong is how good startups die quietly.",
    ctaHeader: "Ready to find out?",
    ctaSub: "One conversation. Under 10 minutes. A plan you can actually act on.",
    ctaButton: "Dump your list →",
    footerTagline: "Built for founders who are ready to be honest about this week.",
  },

  week: {
    id: "week",
    tab: "The Week",
    narrative: "Time-focused · This week vs. next month",
    headline: "The problem isn't your idea.",
    headlineLine2: "The problem is this week.",
    sub: "You're doing next month's job today.",
    cards: [
      { emoji: "📅", text: "You're fundraising before you have a product." },
      { emoji: "👥", text: "You're hiring before you have a customer." },
      { emoji: "🏗", text: "You're designing org charts for a company of one." },
    ],
    closing: "It feels like work. Your brain rewards you for it. Nothing moved.",
    insightItalic: "What has to be true before this matters?",
    insightBody: "That's the only question. Every idea on your list is real — but most of them have a prerequisite you haven't met yet. Until you have, they're next month's job dressed up as today's emergency. JustFour finds the ones that are actually this week's job.",
    ctaHeader: "What's actually this week's job?",
    ctaSub: "10 minutes to cut through the noise.",
    ctaButton: "Find out →",
    footerTagline: "Stop doing next year's job today.",
  },

  trap: {
    id: "trap",
    tab: "Invisible Trap",
    narrative: "Emotional · Self-recognition moment",
    headline: "You went to bed exhausted.",
    headlineLine2: "Nothing moved.",
    sub: "The most dangerous work feels the most important.",
    cards: [
      { emoji: "💰", text: "You spent three hours on cap table structure. You have no paying customer." },
      { emoji: "🎨", text: "You redesigned your logo twice. Your product isn't built yet." },
      { emoji: "🌍", text: "You researched the Australian market. You haven't proven one building." },
    ],
    closing: "This is the Founder's Trap. It's invisible because it feels like progress.",
    insightItalic: "Most founders don't fail because the idea was bad. They fail because they worked on the right things at the wrong time.",
    insightBody: "Fundraising feels like progress. Hiring plans feel responsible. Global expansion feels ambitious. But none of them move the needle until the fundamentals are in place. The trap is invisible precisely because it feels like work.",
    ctaHeader: "What did you actually work on this week?",
    ctaSub: "One honest conversation. It takes 10 minutes.",
    ctaButton: "Be honest →",
    footerTagline: "Big ideas feel productive. They are not.",
  },

  staircase: {
    id: "staircase",
    tab: "Staircase",
    narrative: "Warm · Mentor voice",
    headline: "You're not unfocused.",
    headlineLine2: "You're just trying to climb the whole staircase at once.",
    sub: "One step at a time.",
    cards: [
      { emoji: "💡", text: "Every idea on your list is real. Every ambition is valid." },
      { emoji: "🪜", text: "But a staircase only works one step at a time." },
      { emoji: "🏃", text: "The founders who move fastest know which step they're actually on." },
    ],
    closing: "Always be on Step One.",
    closingColor: "#047857", // green instead of red — warm, not alarming
    insightItalic: "Your ideas aren't wrong. They're just not this week.",
    insightBody: "The hardest part of building isn't having too few ideas — it's having too many good ones. JustFour doesn't kill your ideas. It parks them safely and tells you which step you're actually on right now. The rest will still be there when their week comes.",
    ctaHeader: "Find your Step One.",
    ctaSub: "A conversation that helps you see which step you're on.",
    ctaButton: "Start climbing →",
    footerTagline: "Your brain can let go. We'll hold the rest.",
  },

  club: {
    id: "club",
    tab: "The Club",
    narrative: "Bold · Identity & belonging",
    headline: "JustFour founders build.",
    headlineLine2: "Everyone else plans.",
    sub: "Are you a member yet?",
    cards: [
      { emoji: "🔨", text: "While others are drafting pitch decks, JustFour founders are shipping." },
      { emoji: "🎯", text: "While others have 40 priorities, JustFour founders have four." },
      { emoji: "🚀", text: "While others are planning their Series B, JustFour founders have their first customer." },
    ],
    closing: "The choice is yours. Build or dream.",
    closingColor: "#1A1A1A", // black, not red — statement, not warning
    insightItalic: "You're either in the JustFour club, or you're in the Founder's Trap.",
    insightBody: "JustFour founders don't do less. They do the right things. Four things. This week. Every week. The parking lot holds every other idea — named, safe, not forgotten. But not this week. That discipline is the difference.",
    ctaHeader: "Join the club.",
    ctaSub: "10 minutes to find your four things.",
    ctaButton: "I'm in →",
    footerTagline: "JustFour founders build. Everyone else plans.",
  },
};

const VARIANT_ORDER = ["justfour", "week", "trap", "staircase", "club"];


// ═══════════════════════════════════════════════════════════════
// HOMEPAGE RENDERER — data-driven from variant
// ═══════════════════════════════════════════════════════════════

function HomepageVariant({ v }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");
  const inputRef = useRef(null);

  const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleSubmit = () => {
    if (!isValidEmail(email)) { setEmailError("Enter a valid email"); return; }
    setEmailError("");
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setSubmitted(true); }, 1200);
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") { e.preventDefault(); handleSubmit(); } };

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 20px", paddingBottom: 80 }}>

      {/* ─── HERO ──────────────────────────────────────────── */}
      <div style={{ paddingTop: 72, marginBottom: 56, animation: "fadeUp 0.8s ease-out" }}>
        <h1 style={{
          fontFamily: "'Libre Baskerville', serif", fontSize: 36, fontWeight: 700,
          color: "#1A1A1A", letterSpacing: "-0.03em", lineHeight: 1.15,
          margin: 0,
        }}>
          {v.headline}
          {v.headlineLine2 && (
            <>
              <br />
              <span>{v.headlineLine2}</span>
            </>
          )}
        </h1>
        <div style={{
          fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 400,
          color: "#6B6B6B", letterSpacing: "-0.01em", marginTop: 16,
        }}>
          {v.sub}
        </div>
      </div>

      {/* ─── RECOGNITION — 3 cards ─────────────────────────── */}
      <div style={{
        display: "flex", flexDirection: "column", gap: 10,
        marginBottom: 48, animation: "fadeUp 0.8s ease-out 0.15s both",
      }}>
        {v.cards.map((item, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "flex-start", gap: 14,
            padding: "16px 20px", backgroundColor: "#FFFFFF",
            border: "1px solid #E2E1DC", borderRadius: 10,
          }}>
            <span style={{ fontSize: 20, flexShrink: 0, lineHeight: 1.4 }}>{item.emoji}</span>
            <span style={{
              fontFamily: "'Outfit', sans-serif", fontSize: 14,
              color: "#1A1A1A", lineHeight: 1.5, letterSpacing: "-0.01em",
            }}>{item.text}</span>
          </div>
        ))}

        {/* Closing line */}
        <div style={{
          fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 600,
          color: v.closingColor || "#991B1B",
          textAlign: "center", padding: "12px 0 0", letterSpacing: "-0.01em",
        }}>
          {v.closing}
        </div>
      </div>

      {/* ─── DIVIDER ──────────────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 48 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: "#D4D3CE" }} />
        ))}
      </div>

      {/* ─── INSIGHT ──────────────────────────────────────── */}
      <div style={{ marginBottom: 56, animation: "fadeUp 0.8s ease-out 0.3s both" }}>
        <div style={{
          fontFamily: "'Libre Baskerville', serif", fontSize: 17,
          fontWeight: 400, fontStyle: "italic",
          color: "#4B4B4B", lineHeight: 1.7, letterSpacing: "-0.01em",
        }}>
          {v.insightItalic}
        </div>
        <div style={{
          fontFamily: "'Outfit', sans-serif", fontSize: 15,
          color: "#6B6B6B", lineHeight: 1.7, marginTop: 16,
        }}>
          {v.insightBody}
        </div>
      </div>

      {/* ─── CTA AREA ─────────────────────────────────────── */}
      <div style={{ animation: "fadeUp 0.8s ease-out 0.45s both" }}>
        {!submitted ? (
          <div>
            <div style={{
              fontFamily: "'Libre Baskerville', serif", fontSize: 20, fontWeight: 700,
              color: "#1A1A1A", letterSpacing: "-0.02em", marginBottom: 6,
            }}>{v.ctaHeader}</div>
            <div style={{
              fontFamily: "'Outfit', sans-serif", fontSize: 14,
              color: "#9B9B9B", marginBottom: 20,
            }}>{v.ctaSub}</div>

            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1, position: "relative" }}>
                <input
                  ref={inputRef}
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                  onKeyDown={handleKeyDown}
                  placeholder="you@startup.com"
                  style={{
                    width: "100%", height: 52, padding: "0 16px", borderRadius: 12,
                    border: `1px solid ${emailError ? "#DC2626" : "#E2E1DC"}`,
                    backgroundColor: "#FFFFFF", fontFamily: "'Outfit', sans-serif",
                    fontSize: 15, color: "#1A1A1A", outline: "none", boxSizing: "border-box",
                    transition: "border-color 0.15s ease",
                  }}
                  onFocus={(e) => { if (!emailError) e.target.style.borderColor = "#1A1A1A"; }}
                  onBlur={(e) => { if (!emailError) e.target.style.borderColor = "#E2E1DC"; }}
                />
                {emailError && (
                  <div style={{
                    position: "absolute", bottom: -22, left: 2,
                    fontFamily: "'Outfit', sans-serif", fontSize: 12, color: "#DC2626",
                  }}>{emailError}</div>
                )}
              </div>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  height: 52, padding: "0 28px", borderRadius: 12, border: "none",
                  backgroundColor: submitting ? "#6B6B6B" : "#1A1A1A",
                  color: "#FFFFFF", fontFamily: "'Outfit', sans-serif",
                  fontSize: 15, fontWeight: 600,
                  cursor: submitting ? "default" : "pointer",
                  letterSpacing: "-0.01em", whiteSpace: "nowrap", flexShrink: 0, minWidth: 44,
                  transition: "background-color 0.15s ease",
                }}
                onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.backgroundColor = "#333333"; }}
                onMouseLeave={(e) => { if (!submitting) e.currentTarget.style.backgroundColor = "#1A1A1A"; }}
              >{submitting ? "Sending..." : v.ctaButton}</button>
            </div>
          </div>
        ) : (
          <MagicLinkSent
            email={email}
            onResend={() => { setSubmitting(true); setTimeout(() => setSubmitting(false), 1500); }}
            onChangeEmail={() => { setSubmitted(false); setEmail(""); setTimeout(() => inputRef.current?.focus(), 100); }}
            resending={submitting}
          />
        )}
      </div>

      {/* ─── FOOTER ───────────────────────────────────────── */}
      <div style={{
        marginTop: 80, paddingTop: 24, borderTop: "1px solid #E2E1DC",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 8,
      }}>
        <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "#9B9B9B" }}>JustFour © 2026</div>
        <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "#B0B0B0", fontStyle: "italic" }}>
          {v.footerTagline}
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes confirmIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes envelopePop {
          from { opacity: 0; transform: scale(0.7); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// MAIN — VARIANT SELECTOR
// ═══════════════════════════════════════════════════════════════

export default function HomepageVariants() {
  const [activeVariant, setActiveVariant] = useState("justfour");
  // Reset key forces re-mount so animations replay on variant switch
  const [resetKey, setResetKey] = useState(0);

  const switchVariant = (id) => {
    setActiveVariant(id);
    setResetKey(k => k + 1);
  };

  const v = VARIANTS[activeVariant];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F7F6F3", fontFamily: "'Outfit', sans-serif" }}>
      <style>{FONTS}</style>

      <TopBar />

      {/* ─── Variant selector ─────────────────────────────── */}
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "12px 20px 0" }}>
        {/* Tabs */}
        <div style={{
          display: "flex", gap: 4, flexWrap: "wrap",
          padding: "4px 0 8px",
        }}>
          {VARIANT_ORDER.map((id) => {
            const vt = VARIANTS[id];
            return (
              <button
                key={id}
                onClick={() => switchVariant(id)}
                style={{
                  padding: "6px 12px", borderRadius: 6, border: "none",
                  fontSize: 12, fontWeight: 500, fontFamily: "'JetBrains Mono', monospace",
                  cursor: "pointer", whiteSpace: "nowrap",
                  backgroundColor: activeVariant === id ? "#1A1A1A" : "transparent",
                  color: activeVariant === id ? "#FFFFFF" : "#9B9B9B",
                  transition: "all 0.15s ease",
                }}
              >{vt.tab}</button>
            );
          })}
        </div>

        {/* Variant description */}
        <div style={{
          fontSize: 11, color: "#9B9B9B", fontFamily: "'JetBrains Mono', monospace",
          padding: "4px 4px 14px", borderBottom: "1px solid #E2E1DC", letterSpacing: "0.02em",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span>VARIANT {VARIANT_ORDER.indexOf(activeVariant) + 1} OF 5 — {v.narrative}</span>
        </div>
      </div>

      {/* ─── Homepage content ─────────────────────────────── */}
      <HomepageVariant key={resetKey} v={v} />
    </div>
  );
}
