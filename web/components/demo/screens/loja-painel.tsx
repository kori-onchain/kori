"use client"

import { IC } from "@/components/demo/icons"
import { fmt, recebivelPendente, splitBRL, useDemoLedger } from "@/components/demo/ledger"

export function LojaPainel() {
  const { state } = useDemoLedger()
  const aReceber = recebivelPendente(state)
  const [intp, cents] = splitBRL(state.loja.caixa)
  const vendaAna = state.fatura.itens[0]

  return (
    <>
      {/* Balance hero */}
      <div className="dm-bh">
        <div className="lbl">Saldo total</div>
        <div className="val">
          <span className="int dm-live" key={`i${intp}`}>{intp}</span>
          <span className="dec dm-live" key={`c${cents}`}>{cents}</span>
        </div>
        <div className="wallet">{IC.wallet} loja.aurora · PJ</div>
        <div className="dm-bh-actions">
          <button className="dm-pill-send"><span className="c">{IC.arrowUp}</span>Enviar</button>
          <button className="dm-pill-recv"><span className="c">{IC.arrowDown}</span>Receber</button>
        </div>
      </div>

      {/* Relatórios */}
      <div className="dm-sec">
        <h4>Relatórios</h4>
        <div className="dm-seg">
          <button>Hoje</button>
          <button className="on">7d</button>
          <button>30d</button>
        </div>
      </div>

      {/* Faturamento */}
      <div className="dm-card" style={{ padding: 16 }}>
        <div className="dm-ml" style={{ fontSize: 8.5, letterSpacing: "0.16em" }}>Faturamento</div>
        <div style={{ fontSize: 23, fontWeight: 700, letterSpacing: "-0.03em", marginTop: 5 }}>R$ 8.102,50</div>
        <div className="dm-ml" style={{ color: "var(--green)", fontSize: 10, marginTop: 6, textTransform: "none", letterSpacing: "0.02em" }}>
          +5% vs semana anterior
        </div>
        <div className="dm-spark">
          <svg viewBox="0 0 200 44" preserveAspectRatio="none">
            <polyline
              points="0,36 28,30 56,33 84,22 112,25 140,14 168,17 200,6"
              fill="none"
              stroke="var(--green)"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="dm-hr" />
        <div className="dm-stats" style={{ marginTop: 0 }}>
          <div className="c grow"><div className="k">Vendas</div><div className="v" style={{ fontSize: 14 }}>14</div></div>
          <div className="div" />
          <div className="c grow"><div className="k">Ticket médio</div><div className="v" style={{ fontSize: 14 }}>R$ 578</div></div>
          <div className="div" />
          <div className="c grow"><div className="k">Conversão</div><div className="v" style={{ fontSize: 14 }}>3,2%</div></div>
        </div>
      </div>

      {/* Saúde do negócio */}
      <div className="dm-card" style={{ padding: 16, marginTop: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h4 style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>Saúde do negócio</h4>
          <span className="dm-pill green">↑ subindo</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ flexShrink: 0 }}>
            <span style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.04em" }}>782</span>
            <span style={{ fontSize: 13, color: "var(--ink-mute)", fontWeight: 500 }}>/900</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span className="dm-ml" style={{ fontSize: 8.5, letterSpacing: "0.12em" }}>Score on-chain</span>
              <span className="dm-ml" style={{ fontSize: 9, color: "var(--green)" }}>BOM</span>
            </div>
            <div className="dm-bar" style={{ marginTop: 0 }}><i className="green" style={{ width: "78%" }} /></div>
          </div>
        </div>
        <div className="dm-hr" />
        <div style={{ fontSize: 11.5, lineHeight: 1.5, color: "var(--ink-mute)" }}>
          Seu histórico on-chain destravou antecipação a <b style={{ color: "var(--ink)" }}>3% a.m.</b> em vez de <b style={{ color: "var(--ink)" }}>8%</b>.
        </div>
      </div>

      {/* A receber */}
      <div className="dm-card" style={{ padding: 14, marginTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div className="dm-ml" style={{ fontSize: 8.5, letterSpacing: "0.16em" }}>A receber</div>
          <div className="dm-live" key={aReceber} style={{ fontSize: 21, fontWeight: 700, letterSpacing: "-0.02em", marginTop: 3 }}>{fmt(aReceber)}</div>
          <div style={{ fontSize: 10.5, color: "var(--ink-mute)", marginTop: 2 }}>recebíveis abertos</div>
        </div>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, border: "1px solid var(--ac)", color: "var(--ac)", borderRadius: 99, padding: "8px 12px", fontSize: 12, fontWeight: 600 }}>
          <span style={{ width: 13, height: 13, display: "inline-flex" }}>{IC.zap}</span>Antecipar
        </span>
      </div>

      {/* Vendas recentes */}
      <div className="dm-sec">
        <h4>Vendas recentes</h4>
        <span className="more">ver tudo <b>→</b></span>
      </div>
      {vendaAna ? (
        <div className="dm-li dm-tx-new">
          <div className="ic">AR</div>
          <div className="tx"><b>Ana Ribeiro</b><span>{vendaAna.installments} parcelas · crédito</span></div>
          <div className="rt"><div className="a green">+{fmt(vendaAna.amount)}</div><div className="s">Crédito</div></div>
        </div>
      ) : null}
      {[
        { ic: "MC", name: "Maria Costa", sub: "2 itens · Pix", amount: "+ R$ 348,00" },
        { ic: "JS", name: "João Silva", sub: "1 item · Pix", amount: "+ R$ 499,00" },
        { ic: "AL", name: "Ana Lima", sub: "3 itens · Pix", amount: "+ R$ 137,00" },
      ].map((s) => (
        <div className="dm-li" key={s.name}>
          <div className="ic">{s.ic}</div>
          <div className="tx"><b>{s.name}</b><span>{s.sub}</span></div>
          <div className="rt"><div className="a green">{s.amount}</div><div className="s">Pix</div></div>
        </div>
      ))}
    </>
  )
}
