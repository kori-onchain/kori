"use client"

import { useState } from "react"

type Merchant = {
  id: string
  name: string
  hash: string
  area: string
  apr: string
  prazo: string
  min: string
  rest: string
  risk: string
  riskTone: "good" | "neutral"
  pin: { x: number; y: number; labelY: number }
  aprDisplay: string
}

const MERCHANTS: Merchant[] = [
  {
    id: "1",
    name: "Padaria Central",
    hash: "Vila Mariana · 7Hpb...2nQa",
    area: "Vila Mariana",
    apr: "14,2%",
    prazo: "30 dias",
    min: "R$ 50",
    rest: "R$ 8.2K",
    risk: "● Baixo · A+",
    riskTone: "good",
    pin: { x: 660, y: 410, labelY: 438 },
    aprDisplay: "14,2%",
  },
  {
    id: "2",
    name: "Mercado Verde",
    hash: "Pinheiros · 9Vmq...8tKr",
    area: "Pinheiros",
    apr: "13,8%",
    prazo: "45 dias",
    min: "R$ 100",
    rest: "R$ 12.4K",
    risk: "● Baixo · A",
    riskTone: "good",
    pin: { x: 260, y: 340, labelY: 368 },
    aprDisplay: "13,8%",
  },
  {
    id: "3",
    name: "Bistrô Lisboa",
    hash: "Higienópolis · 3Fxc...5wDp",
    area: "Higienópolis",
    apr: "19,4%",
    prazo: "90 dias",
    min: "R$ 200",
    rest: "R$ 4.8K",
    risk: "● Médio · B+",
    riskTone: "neutral",
    pin: { x: 500, y: 130, labelY: 115 },
    aprDisplay: "19,4%",
  },
  {
    id: "4",
    name: "Café Suplicy",
    hash: "Jardins · 5Tyu...1nRm",
    area: "Jardins",
    apr: "12,8%",
    prazo: "30 dias",
    min: "R$ 50",
    rest: "R$ 18.6K",
    risk: "● Baixo · A+",
    riskTone: "good",
    pin: { x: 480, y: 420, labelY: 448 },
    aprDisplay: "12,8%",
  },
  {
    id: "5",
    name: "Bar do Juca",
    hash: "Vila Madalena · 8Lkj...4dXz",
    area: "Vila Madalena",
    apr: "16,5%",
    prazo: "60 dias",
    min: "R$ 150",
    rest: "R$ 20.0K",
    risk: "● Baixo · A",
    riskTone: "good",
    pin: { x: 170, y: 130, labelY: 115 },
    aprDisplay: "16,5%",
  },
]

export function YieldMap() {
  const [activeId, setActiveId] = useState("1")
  const active = MERCHANTS.find((m) => m.id === activeId) ?? MERCHANTS[0]
  const riskColor = active.riskTone === "good" ? "var(--green)" : "var(--ink-dim)"

  return (
    <section className="section">
      <span className="sec-label">S:03 / YIELD MAP</span>
      <span className="corner bl" />
      <span className="corner br" />

      <div className="sec-head">
        <div className="sec-tag">Yield Map</div>
        <h2 className="sec-title">
          Comércios verificados,
          <span className="dim">no seu bairro.</span>
        </h2>
      </div>

      <div className="map-layout">
        <div className="map-canvas">
          <div className="map-overlay tl">SP · ZONA OESTE</div>
          <div className="map-overlay tr">LIVE</div>
          <div className="compass">
            <span className="arrow" />
            <span>N</span>
          </div>
          <div className="map-overlay bl">
            <div className="scale" />
            <span>500m</span>
          </div>
          <div className="map-overlay br">
            <span>5 ATIVOS</span>
            <br />
            <b>R$ 64K</b> disponível
          </div>

          <svg
            className="map-svg"
            viewBox="0 0 800 600"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
          >
            <g opacity="0.4">
              <path
                d="M50,80 L320,60 L380,240 L120,280 Z"
                fill="rgba(255,255,255,0.018)"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
              />
              <path
                d="M380,240 L120,280 L180,500 L420,470 Z"
                fill="rgba(255,255,255,0.025)"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
              />
              <path
                d="M320,60 L600,90 L640,280 L380,240 Z"
                fill="rgba(255,255,255,0.018)"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
              />
              <path
                d="M640,280 L380,240 L420,470 L680,440 Z"
                fill="rgba(255,255,255,0.012)"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
              />
              <path
                d="M600,90 L750,100 L740,300 L640,280 Z"
                fill="rgba(255,255,255,0.025)"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
              />
              <path
                d="M740,300 L640,280 L680,440 L750,420 Z"
                fill="rgba(255,255,255,0.018)"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
              />
            </g>

            <path
              d="M-20,200 Q150,180 250,260 T520,360 T800,420"
              fill="none"
              stroke="rgba(123, 145, 255, 0.18)"
              strokeWidth="14"
              strokeLinecap="round"
            />

            <g stroke="rgba(255,255,255,0.22)" fill="none" strokeLinecap="round">
              <path d="M120,90 L640,140" strokeWidth="1.8" />
              <path d="M60,260 L500,380" strokeWidth="1.5" />
              <path d="M380,80 L420,500" strokeWidth="1.4" />
              <path d="M540,90 L580,500" strokeWidth="1.2" />
              <path
                d="M-20,200 Q150,180 250,260 T520,360 T800,420"
                strokeWidth="0.8"
                strokeOpacity="0.6"
              />
            </g>

            <g stroke="rgba(255,255,255,0.06)" fill="none">
              <line x1="200" y1="50" x2="220" y2="550" />
              <line x1="280" y1="50" x2="300" y2="550" />
              <line x1="460" y1="50" x2="480" y2="550" />
              <line x1="700" y1="50" x2="720" y2="550" />
              <line x1="50" y1="160" x2="780" y2="180" />
              <line x1="50" y1="320" x2="780" y2="340" />
              <line x1="50" y1="430" x2="780" y2="450" />
            </g>

            <g opacity="0.3">
              <circle cx="180" cy="200" r="22" fill="rgba(74, 222, 128, 0.18)" />
              <circle cx="500" cy="200" r="18" fill="rgba(74, 222, 128, 0.18)" />
              <ellipse cx="680" cy="380" rx="26" ry="18" fill="rgba(74, 222, 128, 0.15)" />
            </g>

            <g
              fontFamily="Geist Mono, monospace"
              fontSize="9"
              fill="#5a5a5e"
              letterSpacing="0.1em"
            >
              <text x="160" y="160" textAnchor="middle">
                VILA MADALENA
              </text>
              <text x="270" y="380" textAnchor="middle">
                PINHEIROS
              </text>
              <text x="490" y="160" textAnchor="middle">
                HIGIENÓPOLIS
              </text>
              <text x="500" y="380" textAnchor="middle">
                JARDINS
              </text>
              <text x="690" y="180" textAnchor="middle">
                CONSOLAÇÃO
              </text>
              <text x="690" y="380" textAnchor="middle">
                VILA MARIANA
              </text>
            </g>

            {MERCHANTS.map((m) => {
              const isActive = m.id === activeId
              return (
                <g key={`pin-${m.id}`}>
                  <g
                    className={`pin${isActive ? " active" : ""}`}
                    transform={`translate(${m.pin.x}, ${m.pin.y})`}
                    onClick={() => setActiveId(m.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <circle className="pin-pulse" cx="0" cy="0" r="10" />
                    <circle className="pin-ring" cx="0" cy="0" r="11" />
                    <circle className="pin-dot" cx="0" cy="0" r="4" />
                  </g>
                  <text
                    className={`pin-label${isActive ? " active" : ""}`}
                    x={m.pin.x}
                    y={m.pin.labelY}
                    textAnchor="middle"
                  >
                    {m.name} · {m.aprDisplay}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        <div className="map-sidebar">
          <div className="map-detail">
            <div className="md-label">Selecionado</div>
            <div className="md-name">{active.name}</div>
            <div className="md-hash">{active.hash}</div>
            <div className="md-stats">
              <div>
                <div className="l">APR fixo</div>
                <div className="v">{active.apr}</div>
              </div>
              <div>
                <div className="l">Prazo</div>
                <div className="v">{active.prazo}</div>
              </div>
              <div>
                <div className="l">Mínimo</div>
                <div className="v">{active.min}</div>
              </div>
              <div>
                <div className="l">Restante</div>
                <div className="v">{active.rest}</div>
              </div>
            </div>
            <div className="md-risk">
              <span className="l">Risk score</span>
              <span className="v" style={{ color: riskColor }}>
                {active.risk}
              </span>
            </div>
            <button type="button" className="md-cta">
              Investir agora →
            </button>
          </div>

          <div className="map-list">
            <div className="map-list-label">
              <span>Todas</span>
              <span>5 ativas</span>
            </div>
            {MERCHANTS.map((m) => (
              <div
                key={m.id}
                role="button"
                tabIndex={0}
                onClick={() => setActiveId(m.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setActiveId(m.id)
                }}
                className={`map-row${m.id === activeId ? " active" : ""}`}
              >
                <span className="map-row-pin" />
                <div className="map-row-info">
                  <div className="map-row-name">{m.name}</div>
                  <div className="map-row-sub">{m.area}</div>
                </div>
                <div className="map-row-apr">{m.aprDisplay}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
