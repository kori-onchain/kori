"use client"

import { useState } from "react"

type Mode = "lojista" | "consumidor"

const fmt0 = (n: number) =>
  n.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  })

const fmt2 = (n: number) =>
  n.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

export function Calculator() {
  const [mode, setMode] = useState<Mode>("lojista")

  // Lojista — antecipação de recebível
  const [receivable, setReceivable] = useState(3000)
  const bankFee = receivable * 0.05
  const koriFee = receivable * 0.03
  const lojistaSavings = bankFee - koriFee

  // Consumidor — crédito parcelado
  const [credit, setCredit] = useState(1200)
  const [parcelas, setParcelas] = useState(6)
  const bankJuros = credit * Math.pow(1 + 0.12, parcelas) - credit
  const koriJuros = credit * Math.pow(1 + 0.025, parcelas) - credit
  const consumidorSavings = bankJuros - koriJuros

  return (
    <section id="calculadora" className="section" style={{ scrollMarginTop: 88 }}>
      <span className="sec-label">S:03 / CALCULADORA</span>
      <span className="corner bl" />
      <span className="corner br" />

      <div className="sec-head">
        <div className="sec-tag">Faça as contas</div>
        <h2 className="sec-title">
          O spread aparece
          <span className="dim">quando você mexe no valor.</span>
        </h2>
        <p className="section-intro">
          Compare a rota tradicional com uma operação mais direta. O resultado
          muda em tempo real.
        </p>
      </div>

      <div className="calc-layout">
        <div className="calc-story" aria-hidden="true">
          <div className="calc-route calc-route-bank">
            <span>Banco</span>
            <b>~5% / 12% a.m.</b>
          </div>
          <div className="calc-route-line">
            <span />
            <span />
            <span />
          </div>
          <div className="calc-route calc-route-kori">
            <span>Kori</span>
            <b>~3% / 2,5% a.m.</b>
          </div>
        </div>

        <div className="calc">
          <div className="calc-toggle" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={mode === "lojista"}
              className={mode === "lojista" ? "is-active" : ""}
              onClick={() => setMode("lojista")}
            >
              Sou lojista
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "consumidor"}
              className={mode === "consumidor" ? "is-active" : ""}
              onClick={() => setMode("consumidor")}
            >
              Sou consumidor
            </button>
          </div>

          {mode === "lojista" ? (
            <div className="calc-panel">
              <div className="calc-control">
                <div className="calc-control-head">
                  <span className="calc-label">Valor do recebível</span>
                  <span className="calc-value">{fmt0(receivable)}</span>
                </div>
                <input
                  type="range"
                  min={500}
                  max={50000}
                  step={100}
                  value={receivable}
                  onChange={(e) => setReceivable(Number(e.target.value))}
                  className="calc-slider"
                  aria-label="Valor do recebível"
                />
              </div>

              <div className="calc-results">
                <div className="calc-result">
                  <span className="calc-result-label">Banco</span>
                  <span className="calc-result-fee">taxa ~5%</span>
                  <span className="calc-result-val">{fmt2(receivable - bankFee)}</span>
                  <span className="calc-result-sub">você recebe</span>
                </div>
                <div className="calc-result is-kori">
                  <span className="calc-result-label">Kori</span>
                  <span className="calc-result-fee">taxa ~3%</span>
                  <span className="calc-result-val">{fmt2(receivable - koriFee)}</span>
                  <span className="calc-result-sub">você recebe</span>
                </div>
              </div>

              <div className="calc-savings">
                <span>No bolso</span>
                <strong>+{fmt2(lojistaSavings)}</strong>
                <span>a mais por antecipação</span>
              </div>
            </div>
          ) : (
            <div className="calc-panel">
              <div className="calc-control">
                <div className="calc-control-head">
                  <span className="calc-label">Valor do crédito</span>
                  <span className="calc-value">{fmt0(credit)}</span>
                </div>
                <input
                  type="range"
                  min={200}
                  max={20000}
                  step={100}
                  value={credit}
                  onChange={(e) => setCredit(Number(e.target.value))}
                  className="calc-slider"
                  aria-label="Valor do crédito"
                />
              </div>

              <div className="calc-parcelas">
                <span className="calc-label">Parcelas</span>
                <div className="calc-parcelas-opts">
                  {[3, 6, 12].map((p) => (
                    <button
                      key={p}
                      type="button"
                      className={parcelas === p ? "is-active" : ""}
                      onClick={() => setParcelas(p)}
                    >
                      {p}x
                    </button>
                  ))}
                </div>
              </div>

              <div className="calc-results">
                <div className="calc-result">
                  <span className="calc-result-label">Banco</span>
                  <span className="calc-result-fee">~12% a.m.</span>
                  <span className="calc-result-val">{fmt2(bankJuros)}</span>
                  <span className="calc-result-sub">de juros em {parcelas}x</span>
                </div>
                <div className="calc-result is-kori">
                  <span className="calc-result-label">Kori</span>
                  <span className="calc-result-fee">a partir de ~2,5% a.m.</span>
                  <span className="calc-result-val">{fmt2(koriJuros)}</span>
                  <span className="calc-result-sub">de juros em {parcelas}x</span>
                </div>
              </div>

              <div className="calc-savings">
                <span>Economia</span>
                <strong>{fmt2(consumidorSavings)}</strong>
                <span>em juros</span>
              </div>
            </div>
          )}

          <p className="audiences-note calc-note">
            Simulação ilustrativa. Valores reais variam por operação, prazo e risco;
            potencial, não garantido.
          </p>
        </div>
      </div>
    </section>
  )
}
