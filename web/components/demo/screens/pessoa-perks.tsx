"use client"

import { IC } from "@/components/demo/icons"

export function PessoaPerks() {
  return (
    <>
      <div className="dm-scrh">Experiências</div>
      <div className="dm-scrsub">Reputation points</div>

      <div className="dm-card dm-valcard">
        <div className="lab">Reputation points</div>
        <div className="big">24.850 <span className="cents">pts</span></div>
        <div className="delta">▲ próximo nível: KORI Private</div>
      </div>

      <div className="dm-stats" style={{ marginTop: 14 }}>
        <div className="c grow"><div className="k">Faltam</div><div className="v ac" style={{ fontSize: 14 }}>5.150 pts</div></div>
        <div className="div" />
        <div className="c grow"><div className="k">Tier atual</div><div className="v" style={{ fontSize: 14 }}>BLACK</div></div>
      </div>
      <div className="dm-bar"><i style={{ width: "83%" }} /></div>

      <div className="dm-sec"><h4>Experiências disponíveis</h4></div>
      {[
        { ic: IC.qr, name: "Sala VIP Aeroportos", sub: "KORI Black", pill: "Ver", cls: "pend" },
        { ic: IC.trend, name: "Cashback Turbo 3%", sub: "4.500 pts", pill: "Resgatar", cls: "green" },
        { ic: IC.user, name: "Concierge 24/7", sub: "KORI VIP", pill: "Ver", cls: "pend" },
        { ic: IC.grid, name: "KORI Hotéis", sub: "8.000 pts", pill: "Resgatar", cls: "green" },
      ].map((e) => (
        <div className="dm-li" key={e.name}>
          <div className="ic ac">{e.ic}</div>
          <div className="tx"><b>{e.name}</b><span>{e.sub}</span></div>
          <span className={`dm-pill ${e.cls}`}>{e.pill}</span>
        </div>
      ))}

      <div className="dm-sec"><h4>Benefícios Black</h4></div>
      {[
        ["Cashback padrão", "2,5%", false],
        ["Salas VIP", "ilimitado", true],
        ["Concierge", "24/7", true],
        ["Pontos por R$", "3x", false],
      ].map(([k, v, up]) => (
        <div className="dm-li" key={k as string}>
          <div className="tx"><b>{k}</b></div>
          <div className="rt"><div className={`a${up ? " green" : ""}`}>{v}</div></div>
        </div>
      ))}
    </>
  )
}
