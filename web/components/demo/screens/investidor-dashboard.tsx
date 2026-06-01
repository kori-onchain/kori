"use client"

import { IC } from "@/components/demo/icons"
import { fmt, investimentoTotal, poolDisponivel, splitBRL, useDemoLedger } from "@/components/demo/ledger"

export function InvestidorDashboard() {
  const { state } = useDemoLedger()
  const posicao = investimentoTotal(state)
  const [intp, cents] = splitBRL(posicao)

  // larguras dos segmentos (aporte laranja + rendimento verde)
  const total = Math.max(posicao, 1)
  const wAporte = (state.ana.investido / total) * 100
  const wRend = (state.ana.rendimento / total) * 100

  return (
    <>
      <div className="dm-earn-title">Seu investimento</div>
      <div className="dm-earn-val">
        <span className="i dm-live" key={`i${intp}`}>{intp}</span>
        <span className="c dm-live" key={`c${cents}`}>{cents}</span>
      </div>

      <div className="dm-bar" key={`bar${posicao}`}>
        <i style={{ width: `${wAporte}%` }} />
        <i className="green" style={{ width: `${wRend}%` }} />
      </div>

      <div className="dm-stats" style={{ marginTop: 12 }}>
        <div className="c grow">
          <div className="k">Aporte</div>
          <div className="v dm-live" key={`ap${state.ana.investido}`}>{fmt(state.ana.investido)}</div>
        </div>
        <div className="div" />
        <div className="c grow">
          <div className="k">Rendimento</div>
          <div className="v green dm-live" key={`re${state.ana.rendimento}`}>+{fmt(state.ana.rendimento)}</div>
        </div>
      </div>

      <div className="dm-cap">
        Saldo na conta <b style={{ color: "var(--ink)" }} className="dm-live" key={`sl${state.ana.saldo}`}>{fmt(state.ana.saldo)}</b> · rende ~14,8% a.a.
      </div>

      <div className="dm-btnrow">
        <button className="dm-pri">{IC.trend} Investir</button>
        <button className="dm-sec-btn">{IC.arrowDown} Resgatar</button>
      </div>

      <div className="dm-sec">
        <h4>Como o pool rende</h4>
      </div>
      <div className="dm-card" style={{ padding: "4px 13px" }}>
        <div className="dm-li">
          <div className="ic ac">{IC.shield}</div>
          <div className="tx"><b>Recebíveis de lojas</b><span>antecipação a 3% · risco baixo</span></div>
          <span className="dm-pill ok">lastreado</span>
        </div>
        <div className="dm-li">
          <div className="ic ac">{IC.trend}</div>
          <div className="tx"><b>Ágio na liquidação</b><span>+2% quando a fatura é paga</span></div>
          <span className="dm-pill green">+2%</span>
        </div>
        <div className="dm-li">
          <div className="ic ac">{IC.layers}</div>
          <div className="tx"><b>Liquidez do pool</b><span>{fmt(poolDisponivel(state))} disponível</span></div>
          <span className="dm-pill sol">24/7</span>
        </div>
      </div>

      <div className="dm-sec">
        <h4>Posições do fundo</h4>
        <span className="more">portfólio <b>→</b></span>
      </div>
      <div className="dm-li">
        <div className="ic">MS</div>
        <div className="tx"><b>Mercado São Jorge</b><span>aporte R$ 2.000 · APR 14,2%</span></div>
        <span className="dm-pill green"><span className="dot" />ativo</span>
      </div>
      <div className="dm-li">
        <div className="ic">OV</div>
        <div className="tx"><b>Ótica Visão</b><span>aporte R$ 1.500 · APR 16,5%</span></div>
        <span className="dm-pill green"><span className="dot" />ativo</span>
      </div>
      <div className="dm-li">
        <div className="ic">CC</div>
        <div className="tx"><b>Café Central</b><span>aporte R$ 1.500 · APR 13,8%</span></div>
        <span className="dm-pill pend">liquidando</span>
      </div>
    </>
  )
}
