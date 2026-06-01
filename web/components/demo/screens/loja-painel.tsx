import { IC } from "@/components/demo/icons"

export function LojaPainel() {
  return (
    <>
      <div className="dm-approw">
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div className="dm-avatar" style={{ background: "var(--ac)", color: "#0a0a0b" }}>LA</div>
          <div className="dm-hi">Bom te ver,<b>Loja Aurora<span className="dm-pjb">PJ</span></b></div>
        </div>
        <div className="dm-iconbtn">{IC.bell}</div>
      </div>

      <div className="dm-balcard">
        <div className="chip">Hoje · 7d · 30d</div>
        <div className="lab">Receita no período</div>
        <div className="big">R$ 12.840,00</div>
        <div className="delta">▲ +18,2% vs período anterior</div>
      </div>

      <div className="dm-stat2">
        <div className="s">
          <div className="l">Vendas</div>
          <div className="v">84</div>
          <div className="sub">+12</div>
        </div>
        <div className="s">
          <div className="l">Ticket médio</div>
          <div className="v">R$ 152,86</div>
          <div className="sub">por compra</div>
        </div>
      </div>
      <div className="dm-stat2">
        <div className="s">
          <div className="l">Conversão</div>
          <div className="v">3,8%</div>
          <div className="sub">↑ 0,4%</div>
        </div>
        <div className="s">
          <div className="l">Produtos ativos</div>
          <div className="v">6</div>
          <div className="sub">na vitrine</div>
        </div>
      </div>

      <div className="dm-secttl">Mais vendidos <a>ver tudo →</a></div>
      {[
        { ti: "1", name: "iPhone 15 Pro", sub: "32 vendas", rev: "R$ 223.968" },
        { ti: "2", name: "PlayStation 5 Slim", sub: "18 vendas", rev: "R$ 62.982" },
        { ti: "3", name: "Galaxy S24 Ultra", sub: "14 vendas", rev: "R$ 83.986" },
        { ti: "4", name: "AirFryer Turbo 5L", sub: "12 vendas", rev: "R$ 4.188" },
        { ti: "5", name: "Switch OLED", sub: "8 vendas", rev: "R$ 17.592" },
      ].map((p) => (
        <div className="dm-tx" key={p.name}>
          <div className="ti">{p.ti}</div>
          <div className="td"><b>{p.name}</b><span>{p.sub}</span></div>
          <div className="tv">{p.rev}</div>
        </div>
      ))}

      <div className="dm-balcard">
        <div className="lab">A receber</div>
        <div className="big">R$ 8.420,00</div>
        <div className="delta">próxima entrada: 28 mai</div>
      </div>
      <button className="dm-cta">Antecipar</button>

      <div className="dm-secttl">Score on-chain</div>
      <div className="dm-stat2">
        <div className="s">
          <div className="l">Pontuação</div>
          <div className="v" style={{ color: "var(--ac)" }}>782</div>
          <div className="sub">/900 · Excelente</div>
        </div>
        <div className="s">
          <div className="l">Taxas</div>
          <div className="v">1,2%</div>
          <div className="sub">base 2,8%</div>
        </div>
      </div>
      <div className="dm-track"><i style={{ width: "87%" }} /></div>

      <div className="dm-secttl">Vendas recentes <a>ver tudo →</a></div>
      {[
        { ti: "MC", name: "Maria Costa", sub: "2 itens · Pix", amount: "R$ 7.348,00" },
        { ti: "JS", name: "João Silva", sub: "1 item · Pix", amount: "R$ 3.499,00" },
        { ti: "AL", name: "Ana Lima", sub: "3 itens · Pix", amount: "R$ 1.137,00" },
        { ti: "PR", name: "Pedro Rocha", sub: "1 item · Pix", amount: "R$ 5.999,00" },
        { ti: "CF", name: "Carla Ferreira", sub: "2 itens · Pix", amount: "R$ 2.548,00" },
      ].map((s) => (
        <div className="dm-tx" key={s.name}>
          <div className="ti">{s.ti}</div>
          <div className="td"><b>{s.name}</b><span>{s.sub}</span></div>
          <div className="tv up">{s.amount}</div>
        </div>
      ))}
    </>
  )
}
