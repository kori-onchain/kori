export function InvestidorPortfolio() {
  return (
    <>
      <div className="dm-scrh">Portfólio</div>
      <div className="dm-scrsub">posições abertas no portfólio</div>

      <div className="dm-balcard">
        <div className="lab">Patrimônio total</div>
        <div className="big">R$ 42.980,50</div>
        <div className="delta">▲ +14,8% no mês</div>
      </div>

      <div className="dm-stat2">
        <div className="s">
          <div className="l">Renda variável</div>
          <div className="v">R$ 28.540,00</div>
        </div>
        <div className="s">
          <div className="l">Crypto assets</div>
          <div className="v">R$ 14.440,50</div>
        </div>
      </div>

      <div className="dm-stat2">
        <div className="s">
          <div className="l">Rendimento mensal</div>
          <div className="v">+R$ 1.840</div>
          <div className="sub">↑ +4,5%</div>
        </div>
        <div className="s">
          <div className="l">Melhor ativo</div>
          <div className="v">RAY</div>
          <div className="sub">+24,6%</div>
        </div>
      </div>

      <div className="dm-stat2">
        <div className="s">
          <div className="l">Ativos na carteira</div>
          <div className="v">5</div>
          <div className="sub">diversificados</div>
        </div>
        <div className="s">
          <div className="l">Risco da carteira</div>
          <div className="v" style={{ color: "var(--ac)" }}>Moderado</div>
          <div className="sub">score 62/100</div>
        </div>
      </div>

      <div className="dm-secttl">Meus investimentos <a>ver tudo →</a></div>

      {[
        { name: "Solana", ti: "S", value: "R$ 8.240,00", change: "+12,4%", up: true, alloc: "57,2%" },
        { name: "Bitcoin", ti: "B", value: "R$ 3.200,00", change: "+8,1%", up: true, alloc: "22,2%" },
        { name: "Ethereum", ti: "E", value: "R$ 1.800,00", change: "-2,3%", up: false, alloc: "12,5%" },
        { name: "USDC", ti: "U", value: "R$ 1.000,00", change: "+0,1%", up: true, alloc: "6,9%" },
        { name: "Raydium", ti: "R", value: "R$ 200,50", change: "+24,6%", up: true, alloc: "1,4%" },
      ].map((a) => (
        <div className="dm-tx" key={a.name}>
          <div className="ti">{a.ti}</div>
          <div className="td">
            <b>{a.name}</b>
            <span>{a.value}</span>
            <div className="dm-track"><i style={{ width: a.alloc }} /></div>
          </div>
          {a.up ? (
            <div className="tv up">{a.change}</div>
          ) : (
            <div className="tv">{a.change}</div>
          )}
        </div>
      ))}

      <div className="dm-secttl">Resumo da carteira</div>

      <div className="dm-tx">
        <div className="td"><b>Investido total</b></div>
        <div className="tv">R$ 37.420,00</div>
      </div>
      <div className="dm-tx">
        <div className="td"><b>Lucro realizado</b></div>
        <div className="tv up">+R$ 3.280,50</div>
      </div>
      <div className="dm-tx">
        <div className="td"><b>Maior ganho</b></div>
        <div className="tv up">RAY +24,6%</div>
      </div>
      <div className="dm-tx">
        <div className="td"><b>Maior perda</b></div>
        <div className="tv">ETH -2,3%</div>
      </div>
    </>
  )
}
