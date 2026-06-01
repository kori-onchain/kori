"use client"

import { IC, KoriGlyph } from "@/components/demo/icons"
import { cardDisponivel, fmt, useDemoLedger } from "@/components/demo/ledger"

export function PessoaCard() {
  const { state } = useDemoLedger()
  const disponivel = cardDisponivel(state)
  const usoPct = Math.min(100, Math.round((state.card.usado / state.card.limiteTotal) * 100))
  const temFatura = state.fatura.pendente > 0

  return (
    <>
      {/* Fatura + limite (SoftCard) */}
      <div className="dm-card" style={{ overflow: "hidden" }}>
        <div className="dm-invref">
          <div className="lab">Total da fatura este mês</div>
          <div className="big dm-live" key={state.fatura.total}>{fmt(state.fatura.total)}</div>
          <div className="sub">de <b>{fmt(state.card.limiteTotal)}</b> de limite</div>

          <div className="dm-invref-bar">
            <i className="dm-live" key={usoPct} style={{ width: `${usoPct}%` }} />
          </div>
          <div className="dm-invref-legend">
            <span className="l">Sua fatura</span>
            <span className="r dm-live" key={disponivel}>{fmt(disponivel)} restante</span>
          </div>

          <button className="dm-sec-btn" style={{ marginTop: 0, marginBottom: 16, opacity: temFatura ? 1 : 0.55 }}>
            {IC.arrowUp} {temFatura ? "Pagar fatura" : "Fatura em dia"}
          </button>
        </div>

        <div className="dm-savings">
          <div className="t">Você economizou <b>R$ 1.200</b> este mês</div>
          <div className="badge">{IC.trend} x3</div>
        </div>
      </div>

      {/* Cartão de crédito */}
      <div className="dm-cc" style={{ marginTop: 16 }}>
        <div className="dm-cc-top">
          <span className="glyph"><KoriGlyph size={18} /></span>
          <span className="dm-cc-badge">Crédito digital</span>
        </div>
        <div className="dm-cc-holder">ANA RIBEIRO</div>
        <div className="dm-cc-bottom">
          <div className="k">Número</div>
          <div className="num">•••• •••• •••• 8294</div>
          <div className="dm-cc-row">
            <div>
              <div className="k">Validade</div>
              <div className="num" style={{ fontSize: 12 }}>08/29</div>
            </div>
            <div>
              <div className="k">CVV</div>
              <div className="num" style={{ fontSize: 12 }}>•••</div>
            </div>
            <span className="visa">VISA</span>
          </div>
        </div>
      </div>

      {/* Transações da fatura */}
      <div className="dm-sec">
        <h4>Transações da fatura</h4>
      </div>
      {state.fatura.itens.map((it) => (
        <div key={it.id} className="dm-li dm-tx-new">
          <div className="ic">{IC.bag}</div>
          <div className="tx"><b>{it.label}</b><span>Loja Aurora · {it.installments}x parcelas</span></div>
          <div className="rt"><div className="a">-{fmt(it.amount)}</div><div className="s">crédito</div></div>
        </div>
      ))}
      {[
        { ic: "iF", name: "iFood", date: "hoje · 14h32", amount: "-R$ 67,50" },
        { ic: "Sp", name: "Spotify", date: "ontem", amount: "-R$ 21,90" },
        { ic: "Am", name: "Amazon", date: "24 mai", amount: "-R$ 349,00" },
      ].map((tx) => (
        <div key={tx.name} className="dm-li">
          <div className="ic">{tx.ic}</div>
          <div className="tx"><b>{tx.name}</b><span>{tx.date}</span></div>
          <div className="rt"><div className="a">{tx.amount}</div><div className="s">à vista</div></div>
        </div>
      ))}
    </>
  )
}
