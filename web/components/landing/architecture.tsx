const STEPS = [
  { step: "STEP 01", name: "User intent", active: true },
  { step: "STEP 02", name: "Score & KYC check" },
  { step: "STEP 03", name: "Solana submission" },
  { step: "STEP 04", name: "Atomic settlement" },
  { step: "STEP 05", name: "Reputation update" },
]

export function Architecture() {
  return (
    <section className="section">
      <span className="sec-label">S:06 / ARCHITECTURE</span>
      <span className="corner bl" />
      <span className="corner br" />

      <div className="sec-head">
        <div className="sec-tag">Architecture</div>
        <h2 className="sec-title">
          Como uma transação flui.
          <span className="dim">Do tap ao settlement em 2.1s.</span>
        </h2>
      </div>

      <div className="arch">
        <ul className="arch-list">
          {STEPS.map((s) => (
            <li key={s.step} className={s.active ? "active" : ""}>
              <div>
                <div className="step">{s.step}</div>
                <div className="name">{s.name}</div>
              </div>
            </li>
          ))}
        </ul>

        <div className="arch-canvas">
          <svg className="arch-svg" viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <marker
                id="arr"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto"
              >
                <path d="M0,0 L10,5 L0,10 Z" fill="#fafafa" />
              </marker>
            </defs>

            <g fontFamily="Geist Mono, monospace" fontSize="10" fill="#fafafa">
              <rect
                x="20"
                y="120"
                width="100"
                height="60"
                rx="6"
                fill="#16161a"
                stroke="#fafafa"
                strokeWidth="1"
              />
              <text x="70" y="148" textAnchor="middle">
                USER
              </text>
              <text x="70" y="162" textAnchor="middle" fill="#5a5a5e">
                tap to pay
              </text>

              <rect
                x="180"
                y="40"
                width="100"
                height="60"
                rx="6"
                fill="#16161a"
                stroke="rgba(255,255,255,0.13)"
              />
              <text x="230" y="64" textAnchor="middle">
                SCORE
              </text>
              <text x="230" y="78" textAnchor="middle" fill="#5a5a5e">
                on-chain
              </text>
              <text x="230" y="92" textAnchor="middle" fill="#5a5a5e">
                verify
              </text>

              <rect
                x="180"
                y="120"
                width="100"
                height="60"
                rx="6"
                fill="#16161a"
                stroke="#fafafa"
                strokeWidth="1"
              />
              <text x="230" y="148" textAnchor="middle">
                SOLANA
              </text>
              <text x="230" y="162" textAnchor="middle" fill="#5a5a5e">
                tx submit
              </text>

              <rect
                x="180"
                y="200"
                width="100"
                height="60"
                rx="6"
                fill="#16161a"
                stroke="rgba(255,255,255,0.13)"
              />
              <text x="230" y="224" textAnchor="middle">
                YIELD
              </text>
              <text x="230" y="238" textAnchor="middle" fill="#5a5a5e">
                cashback
              </text>
              <text x="230" y="252" textAnchor="middle" fill="#5a5a5e">
                routing
              </text>

              <rect
                x="340"
                y="120"
                width="120"
                height="60"
                rx="6"
                fill="#16161a"
                stroke="#fafafa"
                strokeWidth="1"
              />
              <text x="400" y="148" textAnchor="middle">
                SETTLEMENT
              </text>
              <text x="400" y="162" textAnchor="middle" fill="#5a5a5e">
                + rep update
              </text>
            </g>

            <g fill="none" stroke="#fafafa" strokeWidth="1">
              <path d="M120,150 L180,70" strokeOpacity="0.30" markerEnd="url(#arr)" />
              <path d="M120,150 L180,150" strokeOpacity="0.9" markerEnd="url(#arr)" />
              <path d="M120,150 L180,230" strokeOpacity="0.30" markerEnd="url(#arr)" />
              <path d="M280,70 L340,140" strokeOpacity="0.18" />
              <path d="M280,150 L340,150" strokeOpacity="0.9" markerEnd="url(#arr)" />
              <path d="M280,230 L340,160" strokeOpacity="0.18" />
            </g>
          </svg>
        </div>
      </div>
    </section>
  )
}
