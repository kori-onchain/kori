"use client"

import { IC } from "@/components/demo/icons"
import { fmt, recebivelPendente, useDemoLedger } from "@/components/demo/ledger"

export function LojaRecebiveis() {
  const { state } = useDemoLedger()
  const pendentes = state.receivables.filter((r) => r.status === "PENDING")
  const bruto = recebivelPendente(state)
  const liquido = pendentes.reduce((t, r) => t + r.liquido, 0)
  const sel = pendentes.length

  return (
    <>
      <div className="dm-scrh">Antecipações</div>
      <div className="dm-scrsub">Loja Aurora · receba agora</div>

      {/* Hero */}
      <div className="dm-card" style={{ padding: 16, marginTop: 6 }}>
        <div className="dm-ml" style={{ fontSize: 8.5, letterSpacing: "0.16em" }}>Total disponível para antecipar</div>
        <div className="dm-live" key={bruto} style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", marginTop: 6 }}>{fmt(bruto)}</div>
        <div className="dm-stats" style={{ marginTop: 14 }}>
          <div className="c grow">
            <div className="k">Líquido estimado</div>
            <div className="v green dm-live" key={liquido} style={{ fontSize: 14 }}>{fmt(liquido)}</div>
          </div>
          <div className="div" />
          <div className="c grow">
            <div className="k">Taxa</div>
            <div className="v ac" style={{ fontSize: 14 }}>3% a.m.</div>
          </div>
        </div>
      </div>

      <div className="dm-sec">
        <h4>Recebíveis pendentes</h4>
        <span className="more"><b>{sel > 0 ? "selecionar todos" : ""}</b></span>
      </div>

      {pendentes.length > 0 ? (
        pendentes.map((r) => (
          <div className="dm-card dm-rec on dm-tx-new" key={r.id}>
            <div className="dm-rec-top">
              <span className="dm-check on">{IC.check}</span>
              <div className="info">
                <b>{r.label}</b>
                <span>Ana Ribeiro · crédito</span>
              </div>
              <div className="amt">
                <div className="g">{fmt(r.bruto)}</div>
                <div className="n">liq. {fmt(r.liquido)}</div>
              </div>
            </div>
            <div className="dm-rec-foot">{IC.calendar} Vence em 30 dias</div>
          </div>
        ))
      ) : (
        <div className="dm-empty">Nenhum recebível pendente — tudo antecipado.</div>
      )}

      {/* Provedores */}
      <div className="dm-sec">
        <h4>Quem financia</h4>
      </div>
      <div className="dm-prov">
        <div className="p">
          <span className="pic">{IC.zap}</span>
          <span className="pt">Kori</span>
          <span className="ps">Liquidez imediata</span>
          <span className="pr">4,5% a.m.</span>
        </div>
        <div className="p on">
          <span className="pic">{IC.layers}</span>
          <span className="pt">Pool</span>
          <span className="ps">Investidores Kori</span>
          <span className="pr">3% a.m.</span>
        </div>
        <div className="p">
          <span className="pic">{IC.users}</span>
          <span className="pt">P2P</span>
          <span className="ps">Leilão</span>
          <span className="pr">2,2% a.m.</span>
        </div>
      </div>

      <button className="dm-pri">{IC.zap} Antecipar {sel > 0 ? `${sel} recebíveis` : "recebíveis"}</button>
    </>
  )
}
