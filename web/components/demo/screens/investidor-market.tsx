"use client"

import { IC } from "@/components/demo/icons"

export function InvestidorMarket() {
  const items = [
    { name: "Padaria Aurora", hash: "8Wnz…1kPm", receivable: "R$ 3.100", apr: "15,0%", fill: 28 },
    { name: "Floricultura Bela", hash: "6Tyu…9pLk", receivable: "R$ 1.800", apr: "14,5%", fill: 52 },
    { name: "Pet Shop Amigo", hash: "4Rew…2mNb", receivable: "R$ 2.300", apr: "13,9%", fill: 71 },
  ]

  return (
    <>
      <div className="dm-scrh">Comércios</div>
      <div className="dm-scrsub">recebíveis abertos no marketplace</div>

      <div className="dm-actions">
        <div className="dm-act"><span className="ico">{IC.shield}</span>Risco baixo</div>
        <div className="dm-act"><span className="ico">{IC.trend}</span>Maior APR</div>
      </div>

      {items.map((m) => (
        <div key={m.hash} className="dm-card" style={{ padding: 14, marginTop: 12 }}>
          <div className="dm-li" style={{ padding: 0, borderBottom: "none" }}>
            <div className="ic ac">{IC.grid}</div>
            <div className="tx"><b>{m.name}</b><span>{m.hash}</span></div>
            <span className="dm-pill green"><span className="dot" />baixo</span>
          </div>
          <div className="dm-stats" style={{ marginTop: 12 }}>
            <div className="c grow"><div className="k">Recebível</div><div className="v" style={{ fontSize: 14 }}>{m.receivable}</div></div>
            <div className="div" />
            <div className="c grow"><div className="k">APR</div><div className="v ac" style={{ fontSize: 14 }}>{m.apr}</div></div>
          </div>
          <div className="dm-bar"><i style={{ width: `${m.fill}%` }} /></div>
          <div className="dm-ml" style={{ fontSize: 8.5, marginTop: 6, textTransform: "none" }}>captação {m.fill}%</div>
        </div>
      ))}

      <button className="dm-pri">{IC.trend} Financiar</button>
    </>
  )
}
