import { useState, useRef, useEffect } from "react";

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
`;

const TAG_CONFIG = {
  Product:    { accent: "#7C3AED", bg: "#F3F0FF", text: "#6D28D9", border: "#E0D8FD" },
  Team:       { accent: "#2563EB", bg: "#EFF6FF", text: "#1D4ED8", border: "#DBEAFE" },
  Revenue:    { accent: "#059669", bg: "#ECFDF5", text: "#047857", border: "#D1FAE5" },
  Operations: { accent: "#D97706", bg: "#FFFBEB", text: "#B45309", border: "#FEF3C7" },
};

// ─── SHELL: TopBar (same component as Stage 3) ────────────────
// This is a SHARED component — identical code in both files.
// In production: single file at components/shell/TopBar.tsx
function TopBar({ variant = "dashboard", email = "ashish@robolane.in", onStartOver }) {
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
    // { label: "Manage plan", onClick: () => {} },       // Phase 1
    // { label: "Share dashboard", onClick: () => {} },   // Phase 2
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
                      border: "none", borderTop: i === menuItems.length - 1 && menuItems.length > 1 ? "1px solid #F0EFEA" : "none",
                      cursor: "pointer", fontFamily: "'Outfit', sans-serif", fontSize: 14,
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

// ─── Components ───────────────────────────────────────────────

function TagBadge({ tag, size = "default" }) {
  const config = TAG_CONFIG[tag] || TAG_CONFIG.Product;
  const isSmall = size === "small";
  return (
    <span style={{
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: isSmall ? 10 : 11, fontWeight: 500, letterSpacing: "0.04em",
      padding: isSmall ? "2px 7px" : "3px 10px", borderRadius: 4,
      backgroundColor: config.bg, color: config.text,
      border: `1px solid ${config.border}`, textTransform: "uppercase",
    }}>{tag}</span>
  );
}

function Checkbox() {
  return <div style={{ width: 18, height: 18, borderRadius: 4, border: "1.5px solid #C4C3BE", flexShrink: 0, marginTop: 1 }} />;
}

function TrapAlert({ parkedCount }) {
  return (
    <div style={{
      backgroundColor: "#FEF2F2", border: "1px solid #FECACA",
      borderRadius: 12, padding: "20px 24px", marginBottom: 36,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, backgroundColor: "#FEE2E2",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, fontSize: 18,
        }}>⚠</div>
        <div>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 700, color: "#991B1B", marginBottom: 6 }}>Founder's Trap</div>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: "#991B1B", lineHeight: 1.6, opacity: 0.9 }}>
            If you are reading the parked section instead of doing the 4 focus items — close this tab and go do something.
          </div>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "#B91C1C", marginTop: 10, opacity: 0.7 }}>
            {parkedCount} ideas parked. Not gone — just not this week.
          </div>
        </div>
      </div>
    </div>
  );
}

function FocusCard({ item, number }) {
  const config = TAG_CONFIG[item.tag] || TAG_CONFIG.Product;
  return (
    <div style={{
      backgroundColor: "#FFFFFF", border: "1px solid #E2E1DC",
      borderLeft: `4px solid ${config.accent}`,
      borderRadius: "4px 12px 12px 4px", padding: "24px 24px 20px",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 4 }}>
        <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 700, color: "#1A1A1A", letterSpacing: "-0.02em", lineHeight: 1.3 }}>
          <span style={{ color: "#9B9B9B", fontWeight: 600 }}>{number}.</span> {item.title}
        </div>
        <TagBadge tag={item.tag} size="small" />
      </div>
      <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: "#6B6B6B", marginBottom: 16, lineHeight: 1.4 }}>{item.subtitle}</div>
      <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "#4B4B4B", lineHeight: 1.65, marginBottom: 18, paddingBottom: 16, borderBottom: "1px solid #F0EFEA" }}>{item.context}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: item.goal ? 18 : 0 }}>
        {item.tasks.map((task, ti) => (
          <div key={ti} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <Checkbox />
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: "#1A1A1A", lineHeight: 1.5, flex: 1 }}>{task}</div>
          </div>
        ))}
      </div>
      {item.goal && (
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8, paddingTop: 14, borderTop: "1px solid #F0EFEA" }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, color: config.text, backgroundColor: config.bg, border: `1px solid ${config.border}`, padding: "2px 6px", borderRadius: 3, letterSpacing: "0.04em", textTransform: "uppercase", flexShrink: 0, marginTop: 1 }}>Goal</span>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "#6B6B6B", lineHeight: 1.4, fontStyle: "italic" }}>{item.goal}</div>
        </div>
      )}
    </div>
  );
}

function ParkingCard({ item }) {
  return (
    <div style={{
      flex: "1 1 calc(50% - 6px)", minWidth: 180, maxWidth: "calc(50% - 6px)",
      padding: "14px 16px", backgroundColor: "#FFFFFF",
      border: "1px solid #E5E4DF", borderRadius: 8,
      cursor: "default", transition: "border-color 0.15s ease",
    }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = "#C4C3BE"}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = "#E5E4DF"}
    >
      <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 600, color: "#1A1A1A", lineHeight: 1.35, marginBottom: 4, letterSpacing: "-0.01em" }}>{item.idea}</div>
      <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: "#9B9B9B", lineHeight: 1.4 }}>{item.reason}</div>
    </div>
  );
}

function ContinueConversationStub() {
  const [clicked, setClicked] = useState(false);
  return (
    <div style={{ borderTop: "1px solid #E2E1DC", paddingTop: 24, marginBottom: 60 }}>
      {!clicked ? (
        <button onClick={() => setClicked(true)} style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
          gap: 10, padding: "16px 20px", backgroundColor: "#FAFAF8",
          border: "1px dashed #D4D3CE", borderRadius: 12, cursor: "pointer",
          fontFamily: "'Outfit', sans-serif", fontSize: 14, color: "#9B9B9B",
        }}>
          <span>💬</span> Continue conversation
        </button>
      ) : (
        <div style={{
          padding: "16px 20px", backgroundColor: "#FAFAF8", border: "1px solid #E2E1DC",
          borderRadius: 12, fontFamily: "'Outfit', sans-serif", fontSize: 14,
          color: "#6B6B6B", lineHeight: 1.6, textAlign: "center",
        }}>
          Coming soon — reach out to <span style={{ color: "#1A1A1A", fontWeight: 500 }}>hello@justfour.ai</span> to update your dashboard.
        </div>
      )}
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────

const FOCUS_DATA = [
  { id: "fw_1", title: "Prototype", subtitle: "Get something that moves", tag: "Product", context: "Order parts this week. Don't wait for your friend — start the chassis yourself.", tasks: ["Order chassis parts — ₹25k, 3 days", "Confirm friend's start date in writing"], goal: "Robot moves forward/backward by day 30" },
  { id: "fw_2", title: "Co-founder", subtitle: "Find a committed technical partner", tag: "Team", context: "You can't build this solo. Cast a wider net this week.", tasks: ["Message 3 former colleagues with a specific ask", "Have the commitment conversation with your friend"], goal: "One person says yes or gives a clear no by week 3" },
  { id: "fw_3", title: "Elevator path", subtitle: "Validate which integration approach works", tag: "Operations", context: "Two paths exist: API or robot-arm. Find out which elevator companies will talk to you.", tasks: ["Send intro emails to KONE, Otis, Schindler India", "Research which company has API-accessible controllers"], goal: "One elevator company responds with technical contact" },
  { id: "fw_4", title: "Society research", subtitle: "Listen to 2 RWA chairmen — don't pitch", tag: "Revenue", context: "You're not selling — you're learning what objections sound like in person.", tasks: ["Identify 2 societies with accessible chairmen", "Visit with spec doc and a Savioke robot video"], goal: "Understand the top 3 objections" },
];

const PARKING_DATA = {
  "Product & hardware": [
    { id: "pk_1", idea: "Voice & face recognition", reason: "Social AI, greets known faces — Phase 2 product" },
    { id: "pk_2", idea: "LED eyes & child interaction", reason: "Dual-height design — Phase 2 hardware" },
    { id: "pk_3", idea: "Beautiful QR trail designs", reason: "Branded stickers — after pilot confirmed" },
    { id: "pk_4", idea: "Suspension & terrain", reason: "Smooth on uneven paths — Phase 2 hardware" },
    { id: "pk_5", idea: "LCD remote teleop screen", reason: "Customer care fallback — needs working base" },
  ],
  "Team & culture": [
    { id: "pk_6", idea: "Dual competing sales teams", reason: "Need product before sales org" },
    { id: "pk_7", idea: "ESOP structure", reason: "No team to give ESOPs to yet" },
    { id: "pk_8", idea: "T-Works engineer poaching", reason: "Visit for prototype help, not hiring" },
  ],
  "Partnerships": [
    { id: "pk_9", idea: "Delivery co. integrations", reason: "Zepto, Blinkit — after pilot data" },
    { id: "pk_10", idea: "Elevator retrofit subsidy", reason: "Requires scale — 12+ months out" },
  ],
  "Fundraising & scale": [
    { id: "pk_11", idea: "Raise $100M", reason: "No prototype or traction yet" },
    { id: "pk_12", idea: "Global expansion", reason: "US, Europe, AUS — prove one building first" },
    { id: "pk_13", idea: "Investor vetting", reason: "Not raising yet" },
    { id: "pk_14", idea: "Bijaei as advisor", reason: "Cap table / sales — at fundraise stage" },
    { id: "pk_15", idea: "IP protection framework", reason: "Build something worth protecting first" },
  ],
};

const PARKED_COUNT = Object.values(PARKING_DATA).reduce((sum, items) => sum + items.length, 0);
const CATEGORY_ORDER = ["Product & hardware", "Team & culture", "Partnerships", "Fundraising & scale"];

// ─── Main Dashboard ───────────────────────────────────────────
export default function DashboardFinal() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F7F6F3", fontFamily: "'Outfit', sans-serif" }}>
      <style>{FONTS}</style>

      {/* ─── Shell: TopBar (dashboard variant) ───────────── */}
      <TopBar variant="dashboard" email="ashish@robolane.in" />

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "28px 20px" }}>

        <div style={{
          fontSize: 11, color: "#9B9B9B", fontFamily: "'JetBrains Mono', monospace",
          padding: "2px 4px 20px", letterSpacing: "0.02em",
          borderBottom: "1px solid #E2E1DC", marginBottom: 28,
        }}>
          FINAL MOCKUP — Shell + Focus cards + Compact parking lot. Click avatar for user menu.
        </div>

        <TrapAlert parkedCount={PARKED_COUNT} />

        {/* Just Four Things */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{
            fontFamily: "'Libre Baskerville', serif", fontSize: 22, fontWeight: 700,
            color: "#1A1A1A", letterSpacing: "-0.03em", margin: "0 0 24px 0",
          }}>Just four things:</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {FOCUS_DATA.map((item, i) => (
              <FocusCard key={item.id} item={item} number={i + 1} />
            ))}
          </div>
        </div>

        {/* Parked — compact card grid */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 500,
              color: "#9B9B9B", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4,
            }}>Parked — every idea, right here</div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "#B0B0B0" }}>
              {PARKED_COUNT} ideas captured. None lost. Not this week's job.
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {CATEGORY_ORDER.map((category) => {
              const items = PARKING_DATA[category] || [];
              if (items.length === 0) return null;
              return (
                <div key={category}>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 500,
                    color: "#9B9B9B", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 10,
                  }}>{category}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {items.map((item) => <ParkingCard key={item.id} item={item} />)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <ContinueConversationStub />
      </div>
    </div>
  );
}
