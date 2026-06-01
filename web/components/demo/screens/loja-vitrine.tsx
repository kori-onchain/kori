"use client"

import { IC } from "@/components/demo/icons"

export function LojaVitrine() {
  return (
    <>
      <div className="dm-scrh">Vitrine</div>
      <div className="dm-scrsub">Loja Aurora · 6 produtos</div>

      <div className="dm-seg" style={{ marginTop: 10 }}>
        <button className="on">Tudo</button>
        <button>Smartphones</button>
        <button>Kitchen</button>
        <button>Games</button>
      </div>

      <div className="dm-sec"><h4>Produtos</h4></div>
      {[
        { name: "iPhone 15 Pro", brand: "APPLE · Smartphones", price: "R$ 6.999", off: "-12%" },
        { name: "AirFryer Turbo 5L", brand: "MONDIAL · Kitchen", price: "R$ 349", off: "-30%" },
        { name: "PlayStation 5 Slim", brand: "SONY · Games", price: "R$ 3.499", off: null },
        { name: "Galaxy S24 Ultra", brand: "SAMSUNG · Smartphones", price: "R$ 5.999", off: "-20%" },
        { name: "Switch OLED", brand: "NINTENDO · Games", price: "R$ 2.199", off: "-12%" },
      ].map((p) => (
        <div className="dm-li" key={p.name}>
          <div className="ic">{IC.bag}</div>
          <div className="tx"><b>{p.name}</b><span>{p.brand}</span></div>
          <div className="rt"><div className="a">{p.price}</div></div>
          {p.off ? <span className="dm-pill green" style={{ marginLeft: 8 }}>{p.off}</span> : null}
        </div>
      ))}

      <div className="dm-sec"><h4>Resumo</h4></div>
      <div className="dm-stats" style={{ marginTop: 2 }}>
        <div className="c grow"><div className="k">Produtos</div><div className="v" style={{ fontSize: 14 }}>6</div></div>
        <div className="div" />
        <div className="c grow"><div className="k">Com desconto</div><div className="v" style={{ fontSize: 14 }}>4</div></div>
        <div className="div" />
        <div className="c grow"><div className="k">Maior off</div><div className="v ac" style={{ fontSize: 14 }}>-30%</div></div>
      </div>

      <button className="dm-pri">{IC.plus} Novo produto</button>
    </>
  )
}
