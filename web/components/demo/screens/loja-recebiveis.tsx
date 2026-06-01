export function LojaRecebiveis() {
  return (
    <>
      <div className="dm-scrh">Antecipações</div>
      <div className="dm-scrsub">Loja Aurora · antecipe seus recebíveis</div>

      <div className="dm-balcard">
        <div className="lab">Total disponível para antecipar</div>
        <div className="big">R$ 3.540,00</div>
        <div className="delta">▲ Líquido estimado R$ 3.433,80</div>
      </div>

      <div className="dm-stat2">
        <div className="s">
          <div className="l">Taxa</div>
          <div className="v" style={{ color: "var(--ac)" }}>3% a.m.</div>
          <div className="sub">sobre o bruto</div>
        </div>
        <div className="s">
          <div className="l">Saldo disponível</div>
          <div className="v">R$ 74.352,93</div>
          <div className="sub">na conta</div>
        </div>
      </div>

      <div className="dm-secttl">Recebíveis pendentes <a>selecionar todos →</a></div>

      <div className="dm-tx">
        <div className="ti">38</div>
        <div className="td"><b>Venda #3821 — Tênis Air Pro</b><span>Vence 02 jun 2026 · 3x de R$ 400,00</span></div>
        <div className="tv">R$ 1.200,00</div>
      </div>
      <div className="dm-tx">
        <div className="ti">38</div>
        <div className="td"><b>Venda #3822 — Camiseta Premium</b><span>Vence 08 jun 2026 · 2x de R$ 240,00</span></div>
        <div className="tv">R$ 480,00</div>
      </div>
      <div className="dm-tx">
        <div className="ti">38</div>
        <div className="td"><b>Venda #3819 — Kit Skincare</b><span>Vence 15 jun 2026 · 4x de R$ 222,50</span></div>
        <div className="tv">R$ 890,00</div>
      </div>
      <div className="dm-tx">
        <div className="ti">38</div>
        <div className="td"><b>Venda #3815 — Fone Bluetooth</b><span>Vence 22 jun 2026 · 1x de R$ 350,00</span></div>
        <div className="tv">R$ 350,00</div>
      </div>
      <div className="dm-tx">
        <div className="ti">38</div>
        <div className="td"><b>Venda #3808 — Mochila Urban</b><span>Vence 30 jun 2026 · 2x de R$ 310,00</span></div>
        <div className="tv">R$ 620,00</div>
      </div>

      <button className="dm-cta">Antecipar selecionados</button>
    </>
  )
}
