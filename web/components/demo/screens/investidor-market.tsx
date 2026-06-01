import { IC } from "@/components/demo/icons"

export function InvestidorMarket() {
  const items = [
    { idx: 1, name: "Padaria Aurora", hash: "8Wnz...1kPm", receivable: "R$ 3.100", apr: "15,0%", fill: 28 },
    { idx: 2, name: "Floricultura Bela", hash: "6Tyu...9pLk", receivable: "R$ 1.800", apr: "14,5%", fill: 52 },
    { idx: 3, name: "Pet Shop Amigo", hash: "4Rew...2mNb", receivable: "R$ 2.300", apr: "13,9%", fill: 71 },
  ]

  return (
    <>
      <div className="dm-scrh">Comércios</div>
      <div className="dm-scrsub">recebíveis abertos no marketplace</div>

      <div className="dm-actions">
        <div className="dm-act"><div className="ico">{IC.shield}</div>Risco baixo</div>
        <div className="dm-act"><div className="ico">{IC.trend}</div>Maior APR</div>
      </div>

      {items.map((m) => (
        <div key={m.hash} className="dm-balcard">
          <div className="dm-tx">
            <div className="ti">{IC.grid}</div>
            <div className="td"><b>{m.name}</b><span>{m.hash}</span></div>
            <span className="dm-pill ok">baixo</span>
          </div>
          <div className="dm-stat2">
            <div className="s">
              <div className="l">Recebível</div>
              <div className="v">{m.receivable}</div>
            </div>
            <div className="s">
              <div className="l">APR</div>
              <div className="v" style={{ color: 'var(--ac)' }}>{m.apr}</div>
              <div className="sub">captação {m.fill}%</div>
            </div>
          </div>
          <div className="dm-track"><i style={{ width: `${m.fill}%` }} /></div>
        </div>
      ))}

      <button className="dm-cta">Financiar</button>
    </>
  )
}
