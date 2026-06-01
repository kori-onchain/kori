"use client"

import { IC } from "@/components/demo/icons"

export function InvestidorPortfolio() {
  return (
    <>
      <div className="dm-scrh">Portfólio</div>
      <div className="dm-scrsub">posições abertas</div>

      <div className="dm-card dm-valcard">
        <div className="lab">Patrimônio total</div>
        <div className="big">R$ 42.980<span className="cents">,50</span></div>
        <div className="delta">▲ +14,8% no mês</div>
      </div>

      <div className="dm-stats" style={{ marginTop: 14 }}>
        <div className="c grow"><div className="k">Renda fixa</div><div className="v" style={{ fontSize: 14 }}>R$ 28.540</div></div>
        <div className="div" />
        <div className="c grow"><div className="k">Crypto</div><div className="v" style={{ fontSize: 14 }}>R$ 14.440</div></div>
        <div className="div" />
        <div className="c grow"><div className="k">Melhor ativo</div><div className="v green" style={{ fontSize: 14 }}>RAY +24%</div></div>
      </div>

      <div className="dm-sec">
        <h4>Meus ativos</h4>
        <span className="more">ver tudo <b>→</b></span>
      </div>
      {[
        { ti: "S", name: "Solana", value: "R$ 8.240,00", change: "+12,4%", up: true, alloc: 57 },
        { ti: "B", name: "Bitcoin", value: "R$ 3.200,00", change: "+8,1%", up: true, alloc: 22 },
        { ti: "E", name: "Ethereum", value: "R$ 1.800,00", change: "-2,3%", up: false, alloc: 12 },
        { ti: "U", name: "USDC", value: "R$ 1.000,00", change: "+0,1%", up: true, alloc: 7 },
        { ti: "R", name: "Raydium", value: "R$ 200,50", change: "+24,6%", up: true, alloc: 2 },
      ].map((a) => (
        <div className="dm-li" key={a.name}>
          <div className="ic">{a.ti}</div>
          <div className="tx">
            <b>{a.name}</b>
            <span>{a.value}</span>
            <div className="dm-bar" style={{ marginTop: 5, height: 5 }}><i style={{ width: `${a.alloc}%` }} /></div>
          </div>
          <div className="rt"><div className={`a${a.up ? " green" : ""}`}>{a.change}</div></div>
        </div>
      ))}
    </>
  )
}
