import { useState, useRef, useEffect } from "react";

// ─── Design Tokens ─────────────────────────────────────────────
// See stage3_chat_mockup.jsx for full token reference.
// New tokens for shell:
//
// Avatar:
//   size: 36px (desktop + mobile)
//   bg: #EFEEE9
//   bg-hover: #E2E1DC
//   text: #4B4B4B
//   font: Outfit 14px 600
//   border-radius: 50%
//
// Dropdown:
//   width: 220px
//   bg: #FFFFFF
//   border: 1px solid #E2E1DC
//   border-radius: 10px
//   shadow: 0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)
//   item padding: 10px 16px
//   item hover bg: #F7F6F3
//   divider: 1px solid #F0EFEA
//   logout text: #DC2626
//
// Touch targets: all interactive elements >= 44px tap area
// ────────────────────────────────────────────────────────────────

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
`;

const TAG_STYLES = {
  Product:    { bg: "#F3F0FF", text: "#6D28D9", border: "#E0D8FD" },
  Team:       { bg: "#EFF6FF", text: "#1D4ED8", border: "#DBEAFE" },
  Revenue:    { bg: "#ECFDF5", text: "#047857", border: "#D1FAE5" },
  Operations: { bg: "#FFFBEB", text: "#B45309", border: "#FEF3C7" },
};

// ─── SHELL: TopBar Component ──────────────────────────────────
// Maps to: shared component, used in layout.tsx or per-page
// File: components/shell/TopBar.tsx
//
// Props:
//   variant: "public" | "onboard" | "dashboard"
//   email?: string          (shown in menu when logged in)
//   onStartOver?: () => void (only for onboard variant)
//   menuItems?: MenuItem[]  (config-driven, scales to Phase 2)
//
// MenuItem shape:
//   { label: string, onClick: () => void, icon?: string, danger?: boolean }
//
// MVP menuItems:  [{ label: "Log out", danger: true }]
// Phase 1 adds:   [{ label: "Manage plan" }, ...]
// Phase 2 adds:   [{ label: "Share dashboard" }, ...]
//
// Same component, same layout, all screen sizes.
// The dropdown takes a config array — adding items is one line.

function TopBar({ variant = "dashboard", email = "ashish@robolane.in", onStartOver }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close on click outside
  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  // Get initial from email
  const initial = email ? email.charAt(0).toUpperCase() : "?";

  // ─── Menu items config ──────────────────────────────────
  // This array is the scaling mechanism.
  // Phase 1: add { label: "Manage plan", onClick: ... }
  // Phase 2: add { label: "Share dashboard", onClick: ... }
  const menuItems = [
    // { label: "Manage plan", onClick: () => {} },       // Phase 1
    // { label: "Share dashboard", onClick: () => {} },   // Phase 2
    { label: "Log out", onClick: () => {}, danger: true },
  ];

  const isLoggedIn = variant !== "public";

  return (
    <div style={{
      position: "sticky",
      top: 0,
      zIndex: 50,
      backgroundColor: "rgba(247, 246, 243, 0.92)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid #E2E1DC",
    }}>
      <div style={{
        maxWidth: 640,
        margin: "0 auto",
        padding: "10px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        minHeight: 44, // touch target
      }}>
        {/* Left: Wordmark */}
        <div style={{
          fontFamily: "'Libre Baskerville', serif",
          fontSize: 16,
          fontWeight: 700,
          color: "#1A1A1A",
          letterSpacing: "-0.02em",
        }}>
          JustFour
        </div>

        {/* Right: contextual action + avatar menu */}
        {isLoggedIn && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}>
            {/* "Start over" — only during onboard flow */}
            {variant === "onboard" && onStartOver && (
              <button
                onClick={onStartOver}
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 13,
                  color: "#9B9B9B",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "8px 8px",
                  borderRadius: 6,
                  minHeight: 44,
                  display: "flex",
                  alignItems: "center",
                  transition: "color 0.15s ease",
                }}
                onMouseEnter={(e) => e.target.style.color = "#6B6B6B"}
                onMouseLeave={(e) => e.target.style.color = "#9B9B9B"}
              >
                Start over
              </button>
            )}

            {/* Avatar + dropdown menu */}
            <div ref={menuRef} style={{ position: "relative" }}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  backgroundColor: menuOpen ? "#E2E1DC" : "#EFEEE9",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#4B4B4B",
                  transition: "background-color 0.15s ease",
                  // Ensure 44px touch target even though visual is 36px
                  padding: 0,
                  minWidth: 44,
                  minHeight: 44,
                }}
                onMouseEnter={(e) => { if (!menuOpen) e.currentTarget.style.backgroundColor = "#E2E1DC"; }}
                onMouseLeave={(e) => { if (!menuOpen) e.currentTarget.style.backgroundColor = "#EFEEE9"; }}
              >
                {initial}
              </button>

              {/* Dropdown */}
              {menuOpen && (
                <div style={{
                  position: "absolute",
                  top: "calc(100% + 6px)",
                  right: 0,
                  width: 220,
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E2E1DC",
                  borderRadius: 10,
                  boxShadow: "0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
                  overflow: "hidden",
                  animation: "dropdownIn 0.15s ease-out",
                }}>
                  {/* Email label (non-interactive) */}
                  <div style={{
                    padding: "12px 16px 10px",
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 13,
                    color: "#6B6B6B",
                    borderBottom: "1px solid #F0EFEA",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}>
                    {email}
                  </div>

                  {/* Menu items (config-driven) */}
                  {menuItems.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setMenuOpen(false);
                        item.onClick?.();
                      }}
                      style={{
                        width: "100%",
                        padding: "10px 16px",
                        backgroundColor: "transparent",
                        border: "none",
                        borderTop: i === menuItems.length - 1 && menuItems.length > 1
                          ? "1px solid #F0EFEA" : "none",
                        cursor: "pointer",
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: 14,
                        color: item.danger ? "#DC2626" : "#1A1A1A",
                        textAlign: "left",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        minHeight: 44,
                        transition: "background-color 0.1s ease",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#F7F6F3"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes dropdownIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ─── StreamingIndicator ───────────────────────────────────────
function StreamingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "12px 0" }}>
      <div style={{ display: "flex", gap: 4 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: "50%", backgroundColor: "#9B9B9B",
            animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

// ─── MessageBubble ────────────────────────────────────────────
function MessageBubble({ role, content }) {
  const isUser = role === "user";
  const renderContent = (text) => {
    if (isUser) return text;
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} style={{ fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
      }
      return part.split("\n").map((line, j) => (
        <span key={`${i}-${j}`}>{j > 0 && <br />}{line}</span>
      ));
    });
  };

  return (
    <div style={{
      display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", marginBottom: 16,
      animation: "fadeIn 0.3s ease-out",
    }}>
      <div style={{
        maxWidth: isUser ? "80%" : "88%",
        padding: isUser ? "10px 16px" : "14px 18px",
        borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
        backgroundColor: isUser ? "#1A1A1A" : "#EFEEE9",
        color: isUser ? "#FFFFFF" : "#1A1A1A",
        fontFamily: "'Outfit', sans-serif", fontSize: 15, lineHeight: 1.6,
        letterSpacing: "-0.01em",
      }}>
        {renderContent(content)}
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ─── TrapCallout ──────────────────────────────────────────────
function TrapCallout({ children }) {
  return (
    <div style={{
      margin: "16px 0", padding: "14px 18px", borderRadius: 12,
      backgroundColor: "#FEF2F2", borderLeft: "3px solid #DC2626",
      fontFamily: "'Outfit', sans-serif", fontSize: 14, lineHeight: 1.6, color: "#991B1B",
    }}>
      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6, letterSpacing: "0.02em", textTransform: "uppercase" }}>
        ⚠ Founder's Trap
      </div>
      {children}
    </div>
  );
}

// ─── DecisionCard ─────────────────────────────────────────────
function DecisionCard({ items }) {
  return (
    <div style={{ margin: "12px 0", display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((item, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "flex-start", gap: 10,
          padding: "10px 14px", borderRadius: 8,
          backgroundColor: item.type === "focus" ? "#F0FDF4" : "#F9FAFB",
          border: `1px solid ${item.type === "focus" ? "#BBF7D0" : "#E5E7EB"}`,
          fontSize: 14, fontFamily: "'Outfit', sans-serif", lineHeight: 1.5,
        }}>
          <span style={{
            fontSize: 12, fontWeight: 600, padding: "2px 8px", borderRadius: 4,
            flexShrink: 0, marginTop: 1,
            backgroundColor: item.type === "focus" ? "#DCFCE7" : "#F3F4F6",
            color: item.type === "focus" ? "#166534" : "#6B7280",
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.03em", textTransform: "uppercase",
          }}>
            {item.type === "focus" ? "Focus" : "Park"}
          </span>
          <span style={{ color: "#374151" }}>{item.text}</span>
        </div>
      ))}
    </div>
  );
}

// ─── DashboardReady ───────────────────────────────────────────
function DashboardReady() {
  return (
    <div style={{
      margin: "24px 0", padding: "32px 24px", borderRadius: 16,
      background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 50%, #F0FDFA 100%)",
      border: "1px solid #BBF7D0", textAlign: "center",
      animation: "scaleIn 0.5s ease-out",
    }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>✓</div>
      <div style={{
        fontFamily: "'Libre Baskerville', serif", fontSize: 20, fontWeight: 700,
        color: "#166534", marginBottom: 8,
      }}>Your dashboard is ready.</div>
      <div style={{
        fontFamily: "'Outfit', sans-serif", fontSize: 14, color: "#6B7280", marginBottom: 20,
      }}>4 focus items. 15 ideas parked. Everything has a place.</div>
      <button style={{
        fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 600,
        padding: "12px 32px", borderRadius: 10, border: "none",
        backgroundColor: "#1A1A1A", color: "#FFFFFF", cursor: "pointer",
        letterSpacing: "-0.01em",
      }}>See your dashboard →</button>
      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

// ─── Sample Messages ──────────────────────────────────────────
const SAMPLE_MESSAGES = [
  { role: "user", content: "Software / navigation stack, Elevator integration (KONE etc.), Pilot society — finding one, Team / hiring, Partnerships (delivery cos, RWAs), Branding / marketing, Fundraising / investors, Hardware / robot build, thinking about how I need to raise 100M$, how I will hire the best people, how it will be extremely difficult to get solutions adopted by RWAs" },
  { role: "assistant", content: "That's a lot — and that's the point. Let's go through these one by one.\n\nStarting with **product and tech** — the navigation stack and software side. What else is running through your head here, beyond what you've written?" },
  { role: "user", content: "Navigation stack — the QR code pasting on the ground idea, beautiful designs for the QR codes so no one can say no to pasting them. Software side — voice interactive conversations, remembering faces, saying hi when bumping into someone in the elevator." },
  {
    role: "assistant", content: "Got it. Here's where I land on the product and tech bucket:",
    decisions: [
      { type: "focus", text: "QR navigation approach — this is the thing that makes a prototype possible. Simple, testable, no hardware dependency." },
      { type: "park", text: "Voice interaction system — real idea, but requires a working prototype first." },
      { type: "park", text: "Face recognition in elevators — Phase 2 feature, not launch-critical." },
    ],
  },
  { role: "user", content: "Makes sense. The voice stuff is exciting but you're right, it's premature." },
  { role: "assistant", content: "Good. Now **hardware** — what's running through your head here?" },
  { role: "user", content: "Look has to be beautiful — people don't mind seeing it when passing by. LED-based eyes that can interact at child height, LCD screen where a customer care executive can be seen driving it when operationally stuck." },
  { role: "user", content: "Talk to Prabhat — expert in managing ops at scale. Find hardware engineers besides my friend. Also thinking about competitive culture — two sales teams competing, multiple hardware teams, ESOP structure..." },
  {
    role: "assistant", content: "",
    trap: "You just spent 30 seconds on sales team structure, parallel hardware teams, and ESOP frameworks — for a company with no prototype, no pilot, and no co-founder. This is the Founder's Trap. These are real questions. They're just not your questions yet.",
    trapFollowup: "Here's the split:",
    decisions: [
      { type: "focus", text: "Find a co-founder or committed technical collaborator — you can't build this solo. This is existential." },
      { type: "park", text: "Competitive sales culture, dual teams, ESOP structure — need a product first, then a team, then a culture." },
    ],
  },
];

// ─── Main Chat Container ─────────────────────────────────────
export default function Stage3ChatV2() {
  const [activeView, setActiveView] = useState("conversation");
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F7F6F3", fontFamily: "'Outfit', sans-serif" }}>
      <style>{FONTS}</style>

      {/* ─── Shell: TopBar (onboard variant) ─────────────── */}
      <TopBar variant="onboard" email="ashish@robolane.in" onStartOver={() => {}} />

      {/* ─── Mockup toggle ───────────────────────────────── */}
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "12px 20px 0" }}>
        <div style={{ display: "flex", gap: 1, backgroundColor: "#E2E1DC", borderRadius: 8, padding: 2, marginBottom: 8 }}>
          {[
            { id: "conversation", label: "Mid-conversation" },
            { id: "transition", label: "Dashboard ready" },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveView(tab.id)} style={{
              flex: 1, padding: "7px 12px", borderRadius: 6, border: "none",
              fontSize: 12, fontWeight: 500, fontFamily: "'JetBrains Mono', monospace",
              cursor: "pointer",
              backgroundColor: activeView === tab.id ? "#FFFFFF" : "transparent",
              color: activeView === tab.id ? "#1A1A1A" : "#9B9B9B",
            }}>{tab.label}</button>
          ))}
        </div>
        <div style={{ fontSize: 11, color: "#9B9B9B", fontFamily: "'JetBrains Mono', monospace", padding: "2px 4px 12px", borderBottom: "1px solid #E2E1DC", letterSpacing: "0.02em" }}>
          MOCKUP — Toggle shows both states. Click avatar to see user menu dropdown.
        </div>
      </div>

      {/* ─── Messages ────────────────────────────────────── */}
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "24px 20px 140px" }}>
        {activeView === "conversation" && (
          <>
            <div style={{
              marginBottom: 24, padding: "12px 16px", borderRadius: 10,
              backgroundColor: "#EFEEE9", border: "1px solid #E2E1DC",
              fontSize: 13, color: "#6B6B6B", lineHeight: 1.5,
            }}>
              <span style={{ fontWeight: 600, color: "#1A1A1A" }}>Your brain dump</span> — 14 ideas captured across 6 categories. Let's work through them.
            </div>
            {SAMPLE_MESSAGES.map((msg, i) => (
              <div key={i}>
                <MessageBubble role={msg.role} content={msg.content} />
                {msg.trap && (
                  <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 4, marginTop: -8 }}>
                    <div style={{ maxWidth: "88%" }}><TrapCallout>{msg.trap}</TrapCallout></div>
                  </div>
                )}
                {msg.trapFollowup && (
                  <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 4 }}>
                    <div style={{ maxWidth: "88%", padding: "8px 18px 4px", fontFamily: "'Outfit', sans-serif", fontSize: 15, color: "#1A1A1A", lineHeight: 1.6 }}>{msg.trapFollowup}</div>
                  </div>
                )}
                {msg.decisions && (
                  <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 16 }}>
                    <div style={{ maxWidth: "88%" }}><DecisionCard items={msg.decisions} /></div>
                  </div>
                )}
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "flex-start" }}><StreamingIndicator /></div>
            <div ref={messagesEndRef} />
          </>
        )}
        {activeView === "transition" && (
          <>
            <MessageBubble role="assistant" content="Here's where we landed: **4 things** that can actually move this week. Everything else is parked with a reason — not gone, just not now. Let's look at your dashboard." />
            <DashboardReady />
          </>
        )}
      </div>

      {/* ─── Input bar ───────────────────────────────────── */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        backgroundColor: "rgba(247, 246, 243, 0.95)",
        backdropFilter: "blur(12px)", borderTop: "1px solid #E2E1DC",
      }}>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "12px 20px 20px" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={activeView === "transition" ? "Your dashboard is ready above ↑" : "Tell me more about what you're thinking..."}
              disabled={activeView === "transition"}
              rows={1}
              style={{
                flex: 1, padding: "12px 16px", borderRadius: 12,
                border: "1px solid #E2E1DC",
                backgroundColor: activeView === "transition" ? "#F0F0ED" : "#FFFFFF",
                fontFamily: "'Outfit', sans-serif", fontSize: 15, color: "#1A1A1A",
                outline: "none", resize: "none", lineHeight: 1.5, boxSizing: "border-box",
              }}
            />
            <button
              disabled={!inputValue.trim() || activeView === "transition"}
              style={{
                padding: "12px 16px", borderRadius: 12, border: "none",
                backgroundColor: inputValue.trim() && activeView !== "transition" ? "#1A1A1A" : "#E2E1DC",
                color: inputValue.trim() && activeView !== "transition" ? "#FFFFFF" : "#9B9B9B",
                cursor: inputValue.trim() && activeView !== "transition" ? "pointer" : "default",
                flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                minHeight: 44, minWidth: 44,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
          <div style={{ fontSize: 11, color: "#9B9B9B", marginTop: 6, textAlign: "center", fontFamily: "'Outfit', sans-serif" }}>
            Push back on anything. You have the final say.
          </div>
        </div>
      </div>
    </div>
  );
}
