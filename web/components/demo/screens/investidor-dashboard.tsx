import { IC } from "@/components/demo/icons"

export function InvestidorDashboard() {
  return (
    <>
      <div className="dm-approw">
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div className="dm-avatar" style={{ background: "var(--ac)", color: "#0a0a0b" }}>KM</div>
          <div className="dm-hi">Bom te ver,<b>Kauã Miguel</b></div>
        </div>
        <div className="dm-iconbtn">{IC.bell}</div>
      </div>

      <div className="dm-balcard">
        <div className="lab">Patrimônio total</div>
        <div className="big">R$ 8.832,98</div>
        <div className="delta">▲ +R$ 412,80 · +4,9%</div>
      </div>

      <div className="dm-stat2">
        <div className="s">
          <div className="l">No fundo</div>
          <div className="v">R$ 8.420,18</div>
        </div>
        <div className="s">
          <div className="l">Disponível</div>
          <div className="v">R$ 412,80</div>
        </div>
      </div>
      <div className="dm-stat2">
        <div className="s">
          <div className="l">Rendimento total</div>
          <div className="v" style={{ color: "var(--ac)" }}>+R$ 412,80</div>
        </div>
        <div className="s">
          <div className="l">Rendimento no mês</div>
          <div className="v" style={{ color: "var(--ac)" }}>+R$ 138,40</div>
          <div className="sub">↑ +1,6%</div>
        </div>
      </div>

      <div className="dm-stat2">
        <div className="s">
          <div className="l">APR da carteira</div>
          <div className="v" style={{ color: "var(--ac)" }}>15,1%</div>
          <div className="sub">acima da média</div>
        </div>
        <div className="s">
          <div className="l">Posições ativas</div>
          <div className="v">12</div>
          <div className="sub">comércios</div>
        </div>
      </div>
      <div className="dm-stat2">
        <div className="s">
          <div className="l">Próx. liquidação</div>
          <div className="v">3 dias</div>
          <div className="sub">Café Central</div>
        </div>
        <div className="s">
          <div className="l">APR médio</div>
          <div className="v">14,8%</div>
          <div className="sub">do fundo</div>
        </div>
      </div>

      <div className="dm-actions">
        <div className="dm-act"><div className="ico">{IC.plus}</div>Depositar</div>
        <div className="dm-act"><div className="ico">{IC.transfer}</div>Resgatar</div>
      </div>

      <div className="dm-secttl">Minhas posições <a>portfólio completo →</a></div>

      <div className="dm-tx">
        <div className="ti">MS</div>
        <div className="td"><b>Mercado São Jorge</b><span>aporte R$ 2.000 · APR 14,2% · 12d</span></div>
        <span className="dm-pill ok">ativo</span>
      </div>
      <div className="dm-tx">
        <div className="ti">OV</div>
        <div className="td"><b>Ótica Visão</b><span>aporte R$ 1.500 · APR 16,5% · 28d</span></div>
        <span className="dm-pill ok">ativo</span>
      </div>
      <div className="dm-tx">
        <div className="ti">CC</div>
        <div className="td"><b>Café Central</b><span>aporte R$ 1.500 · APR 13,8% · 3d</span></div>
        <span className="dm-pill pend">liquidando</span>
      </div>

      <div className="dm-secttl">Já rendeu</div>
      <div className="dm-tx">
        <div className="ti">MS</div>
        <div className="td"><b>Mercado São Jorge</b><span>14,2% APR</span></div>
        <div className="tv up">+R$ 18,40</div>
      </div>
      <div className="dm-tx">
        <div className="ti">OV</div>
        <div className="td"><b>Ótica Visão</b><span>16,5% APR</span></div>
        <div className="tv up">+R$ 22,60</div>
      </div>
      <div className="dm-tx">
        <div className="ti">CC</div>
        <div className="td"><b>Café Central</b><span>13,8% APR</span></div>
        <div className="tv up">+R$ 14,10</div>
      </div>

      <div className="dm-secttl">Meus ativos <a>tudo →</a></div>
      <div className="dm-tx">
        <div className="ti" style={{ color: "var(--ac)" }}>{IC.chart}</div>
        <div className="td"><b>Cota do fundo</b><span>498,2 KFND · 95,3%</span></div>
        <div className="tv">R$ 8.420,18</div>
      </div>
      <div className="dm-tx">
        <div className="ti">U</div>
        <div className="td"><b>USDC</b><span>disponível · 4,4%</span></div>
        <div className="tv">R$ 412,80</div>
      </div>
      <div className="dm-tx">
        <div className="ti">S</div>
        <div className="td"><b>SOL</b><span>pra taxa de rede · 0,3%</span></div>
        <div className="tv">R$ 24,00</div>
      </div>

      <button className="dm-cta">Aplicar no fundo</button>
    </>
  )
}
