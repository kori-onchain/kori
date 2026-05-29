import type { ReactNode } from "react"

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="phone">
      <div className="phone-screen">
        <div className="sb">
          <span>9:41</span>
          <span className="sb-right">5G ◐ ▮</span>
        </div>
        {children}
      </div>
    </div>
  )
}

export function BottomNav({ active }: { active?: "home" | "card" | "yield" | "tickets" | "profile" }) {
  const items = [
    { k: "home" as const, icon: "i-home", label: "home" },
    { k: "card" as const, icon: "i-card", label: "cartão" },
    { k: "yield" as const, icon: "i-trend", label: "yield" },
    { k: "tickets" as const, icon: "i-ticket", label: "tickets" },
    { k: "profile" as const, icon: "i-user", label: "perfil" },
  ]
  return (
    <div className="bnav">
      {items.map((i) => (
        <div key={i.k} className={`nav${active === i.k ? " act" : ""}`}>
          <svg>
            <use href={`#${i.icon}`} />
          </svg>
          <span className="l">{i.label}</span>
        </div>
      ))}
    </div>
  )
}

function ScreenTop({ word = "KORI", icons }: { word?: string; icons: { id: string }[] }) {
  return (
    <div className="scr-top">
      <div className="brand-mini">
        <svg className="k">
          <use href="#kori-k" />
        </svg>
        <span className="word">{word}</span>
      </div>
      <div className="ico-btns">
        {icons.map((i) => (
          <div key={i.id} className="ico-btn">
            <svg>
              <use href={`#${i.id}`} />
            </svg>
          </div>
        ))}
      </div>
    </div>
  )
}

function NetStrip() {
  return (
    <div className="net-strip">
      <span className="npill live">Solana</span>
      <span className="divider" />
      <span className="npill wallet">
        <b>7xKj...9aBc</b>
      </span>
      <span className="divider" />
      <span className="npill gas">
        gas <b>$0.0001</b>
      </span>
    </div>
  )
}

function KCardMini() {
  return (
    <div className="kcard">
      <div className="row">
        <div className="chip-m" />
        <div className="brand-c">
          <svg className="k">
            <use href="#kori-k" />
          </svg>
          <span>KORI</span>
        </div>
      </div>
      <div className="num-m">•••• 0271</div>
      <div className="name-m">Kauã M. · Black</div>
      <div className="mc-m">
        <span />
        <span />
      </div>
    </div>
  )
}

function BalanceBlock() {
  return (
    <div className="balance-block">
      <div className="mono-lbl">Saldo</div>
      <div className="balance-big">
        R$ 12.847<span className="cents">,30</span>
      </div>
      <div className="chip-row">
        <span className="chip">
          BRL <b>R$ 8.225</b>
        </span>
        <span className="chip usdc">
          USDC <b>$924</b>
        </span>
      </div>
    </div>
  )
}

/* ===================================================
   Tela home — versão do hero (com stats-3)
   =================================================== */
export function ScreenHeroHome({ active = true }: { active?: boolean }) {
  return (
    <div className={`screen${active ? " active" : ""}`}>
      <ScreenTop icons={[{ id: "i-search" }, { id: "i-bell" }]} />
      <NetStrip />
      <KCardMini />
      <div className="stats-3">
        <div className="s">
          <div className="l">Cashback</div>
          <div className="v">R$ 184</div>
        </div>
        <div className="s">
          <div className="l">Limite</div>
          <div className="v">37%</div>
        </div>
        <div className="s">
          <div className="l">Vence</div>
          <div className="v">24d</div>
        </div>
      </div>
      <BalanceBlock />
    </div>
  )
}

/* ===================================================
   Tela home — versão do parallax (com lista de movimentos)
   =================================================== */
export function ScreenHome({ active = false, dataScreen }: { active?: boolean; dataScreen?: string }) {
  return (
    <div className={`screen${active ? " active" : ""}`} data-screen={dataScreen}>
      <ScreenTop icons={[{ id: "i-search" }, { id: "i-bell" }]} />
      <NetStrip />
      <KCardMini />
      <BalanceBlock />
      <div className="sec-mini-label">
        <span className="mono-lbl">Hoje · 2 movs</span>
        <span style={{ fontFamily: "var(--KORI-mono)", fontSize: 8, color: "var(--green)" }}>
          +R$ 207,50
        </span>
      </div>
      <div className="li">
        <div className="info">
          <div className="ic in">
            <svg style={{ width: 9, height: 9 }}>
              <use href="#i-arrow-l" />
            </svg>
          </div>
          <div>
            <div className="nm">@anaclara</div>
            <div className="sub">P2P · 5KJp...3wWf</div>
          </div>
        </div>
        <span className="v in">+R$ 240</span>
      </div>
      <div className="li">
        <div className="info">
          <div className="ic">
            <svg style={{ width: 9, height: 9 }}>
              <use href="#i-card" />
            </svg>
          </div>
          <div>
            <div className="nm">Padaria Central</div>
            <div className="sub">9Hpb...2nQa</div>
          </div>
        </div>
        <span className="v">−R$ 32,50</span>
      </div>
    </div>
  )
}

/* ===================================================
   Tela score
   =================================================== */
export function ScreenScore({ active = false, dataScreen }: { active?: boolean; dataScreen?: string }) {
  return (
    <div className={`screen${active ? " active" : ""}`} data-screen={dataScreen}>
      <ScreenTop word="Score" icons={[{ id: "i-share" }]} />
      <div className="score-card">
        <div className="mono-lbl" style={{ fontSize: 8 }}>
          REPUTATION TOKEN
        </div>
        <div className="gauge-wrap">
          <svg viewBox="0 0 110 110" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="55" cy="55" r="48" fill="none" stroke="#202026" strokeWidth="7" />
            <circle
              cx="55"
              cy="55"
              r="48"
              fill="none"
              stroke="#ff6b3d"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray="301"
              strokeDashoffset="45"
            />
          </svg>
          <div className="gauge-num">
            847<span className="of">de 1000</span>
          </div>
        </div>
        <div className="score-tier">Tier IV · Premium</div>
        <div className="score-mint">mint 8a7d...4f2c ↗</div>
      </div>
      <div className="sec-mini-label">
        <span className="mono-lbl">Por que subiu</span>
        <span style={{ fontFamily: "var(--KORI-mono)", fontSize: 8, color: "var(--green)" }}>
          +47 últ. 30d
        </span>
      </div>
      <div className="li">
        <div className="info">
          <div className="ic in">
            <svg style={{ width: 9, height: 9 }}>
              <use href="#i-check" />
            </svg>
          </div>
          <div>
            <div className="nm">12 dias sem atraso</div>
            <div className="sub">auto USDC</div>
          </div>
        </div>
        <span className="v in">+18</span>
      </div>
      <div className="li">
        <div className="info">
          <div className="ic in">
            <svg style={{ width: 9, height: 9 }}>
              <use href="#i-trend" />
            </svg>
          </div>
          <div>
            <div className="nm">Stake 1.250 KORI</div>
            <div className="sub">epoch 487</div>
          </div>
        </div>
        <span className="v in">+15</span>
      </div>
      <div className="li">
        <div className="info">
          <div className="ic in">
            <svg style={{ width: 9, height: 9 }}>
              <use href="#i-ticket" />
            </svg>
          </div>
          <div>
            <div className="nm">Founder NFT</div>
            <div className="sub">holding 4m</div>
          </div>
        </div>
        <span className="v in">+14</span>
      </div>
    </div>
  )
}

/* ===================================================
   Tela yield
   =================================================== */
export function ScreenYield({ active = false, dataScreen }: { active?: boolean; dataScreen?: string }) {
  return (
    <div className={`screen${active ? " active" : ""}`} data-screen={dataScreen}>
      <ScreenTop word="Yield" icons={[{ id: "i-filter" }]} />
      <div style={{ padding: "2px 0" }}>
        <div
          style={{
            fontWeight: 700,
            fontSize: 18,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
          }}
        >
          Crédito que
          <br />
          move o bairro.
        </div>
        <div
          style={{ fontSize: 11, color: "var(--ink-dim)", marginTop: 5, lineHeight: 1.5 }}
        >
          comércios locais antecipando recebíveis.
        </div>
      </div>
      <div className="filter-row">
        <span className="filter-chip act">Tudo</span>
        <span className="filter-chip">Padaria</span>
        <span className="filter-chip">Mercado</span>
        <span className="filter-chip">Bar</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {[
          { name: "Padaria Central", area: "Vila Mariana", apr: "14,2%", prazo: "30d", min: "R$50", risk: "low" },
          { name: "Mercado Verde", area: "Pinheiros", apr: "13,8%", prazo: "45d", min: "R$100", risk: "low" },
          { name: "Bistrô Lisboa", area: "Higienópolis", apr: "19,4%", prazo: "90d", min: "R$200", risk: "med" },
        ].map((o) => (
          <div key={o.name} className="opp">
            <div className="top">
              <div>
                <div className="merchant">{o.name}</div>
                <div className="hash">{o.area}</div>
              </div>
              <span className={`risk ${o.risk}`}>● {o.risk === "low" ? "baixo" : "médio"}</span>
            </div>
            <div className="row-stats">
              <div className="s">
                <div className="l">APR</div>
                <div className="v">{o.apr}</div>
              </div>
              <div className="s">
                <div className="l">Prazo</div>
                <div className="v">{o.prazo}</div>
              </div>
              <div className="s">
                <div className="l">Mín</div>
                <div className="v">{o.min}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ScreenYieldMarketplace({ active = false, dataScreen }: { active?: boolean; dataScreen?: string }) {
  return (
    <div className={`screen${active ? " active" : ""}`} data-screen={dataScreen}>
      <ScreenTop word="Recebíveis" icons={[{ id: "i-filter" }]} />
      <div style={{ padding: "2px 0" }}>
        <div
          style={{
            fontWeight: 700,
            fontSize: 18,
            lineHeight: 1.15,
          }}
        >
          Oportunidades
          <br />
          locais.
        </div>
        <div style={{ fontSize: 11, color: "var(--ink-dim)", marginTop: 5, lineHeight: 1.5 }}>
          Recebíveis com prazo, risco e rendimento potencial.
        </div>
      </div>
      <div className="filter-row">
        <span className="filter-chip act">Tudo</span>
        <span className="filter-chip">30d</span>
        <span className="filter-chip">Baixo risco</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {[
          {
            name: "Padaria Central",
            area: "Vila Mariana",
            raised: "R$ 8.500 captados",
            yield: "2,8%",
            prazo: "30d",
            risk: "med",
          },
          {
            name: "Mercado Verde",
            area: "Pinheiros",
            raised: "R$ 12.200 captados",
            yield: "3,1%",
            prazo: "45d",
            risk: "low",
          },
          {
            name: "Bistrô Lisboa",
            area: "Higienópolis",
            raised: "R$ 6.900 captados",
            yield: "4,7%",
            prazo: "60d",
            risk: "med",
          },
        ].map((o) => (
          <div key={o.name} className="opp">
            <div className="top">
              <div>
                <div className="merchant">{o.name}</div>
                <div className="hash">{o.area} · {o.raised}</div>
              </div>
              <span className={`risk ${o.risk}`}>● {o.risk === "low" ? "baixo" : "moderado"}</span>
            </div>
            <div className="row-stats">
              <div className="s">
                <div className="l">Potencial</div>
                <div className="v">{o.yield}</div>
              </div>
              <div className="s">
                <div className="l">Prazo</div>
                <div className="v">{o.prazo}</div>
              </div>
              <div className="s">
                <div className="l">Mín</div>
                <div className="v">R$50</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ScreenInvestmentConfirm({ active = false, dataScreen }: { active?: boolean; dataScreen?: string }) {
  return (
    <div className={`screen${active ? " active" : ""}`} data-screen={dataScreen}>
      <ScreenTop word="Investir" icons={[{ id: "i-check" }]} />
      <div className="score-card">
        <div className="mono-lbl" style={{ fontSize: 8 }}>
          PADARIA CENTRAL
        </div>
        <div style={{ fontWeight: 800, fontSize: 30, marginTop: 16 }}>R$ 50</div>
        <div style={{ color: "var(--ink-dim)", fontSize: 11, marginTop: 5 }}>
          aporte mínimo nesta operação
        </div>
        <div className="score-tier">Recebimento estimado: R$ 51,40</div>
        <div className="score-mint">liquidado em USDC</div>
      </div>
      <div className="sec-mini-label">
        <span className="mono-lbl">Resumo</span>
        <span style={{ fontFamily: "var(--KORI-mono)", fontSize: 8, color: "var(--orange)" }}>
          confirmar
        </span>
      </div>
      {[
        ["Prazo", "30 dias"],
        ["Rendimento potencial", "2,8%"],
        ["Risco", "Moderado"],
      ].map(([label, value]) => (
        <div className="li" key={label}>
          <div className="info">
            <div className="ic in">
              <svg style={{ width: 9, height: 9 }}>
                <use href="#i-check" />
              </svg>
            </div>
            <div>
              <div className="nm">{label}</div>
              <div className="sub">antes da assinatura</div>
            </div>
          </div>
          <span className="v in">{value}</span>
        </div>
      ))}
    </div>
  )
}

export function ScreenInvestmentStatus({ active = false, dataScreen }: { active?: boolean; dataScreen?: string }) {
  return (
    <div className={`screen${active ? " active" : ""}`} data-screen={dataScreen}>
      <ScreenTop word="Operação" icons={[{ id: "i-share" }]} />
      <div className="score-card">
        <div className="mono-lbl" style={{ fontSize: 8 }}>
          CAPITAL LIBERADO
        </div>
        <div className="gauge-wrap">
          <svg viewBox="0 0 110 110" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="55" cy="55" r="48" fill="none" stroke="#202026" strokeWidth="7" />
            <circle
              cx="55"
              cy="55"
              r="48"
              fill="none"
              stroke="#ff6b3d"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray="301"
              strokeDashoffset="74"
            />
          </svg>
          <div className="gauge-num">
            30<span className="of">dias</span>
          </div>
        </div>
        <div className="score-tier">Comércio recebeu</div>
        <div className="score-mint">contrato ativo · vencimento claro</div>
      </div>
      {["Aporte registrado", "Capital liberado", "Recebível em aberto"].map((item, i) => (
        <div className="li" key={item}>
          <div className="info">
            <div className="ic in">
              <svg style={{ width: 9, height: 9 }}>
                <use href="#i-check" />
              </svg>
            </div>
            <div>
              <div className="nm">{item}</div>
              <div className="sub">etapa {i + 1} de 4</div>
            </div>
          </div>
          <span className="v in">ok</span>
        </div>
      ))}
    </div>
  )
}

export function ScreenInvestmentPortfolio({ active = false, dataScreen }: { active?: boolean; dataScreen?: string }) {
  return (
    <div className={`screen${active ? " active" : ""}`} data-screen={dataScreen}>
      <ScreenTop word="Portfolio" icons={[{ id: "i-search" }]} />
      <div className="score-card">
        <div className="mono-lbl" style={{ fontSize: 8 }}>
          RECEBIDO
        </div>
        <div style={{ fontWeight: 800, fontSize: 30, marginTop: 16 }}>R$ 51,40</div>
        <div className="score-tier">Padaria Central · 30 dias</div>
        <div className="score-mint">principal + rendimento distribuídos</div>
      </div>
      <div className="li">
        <div className="info">
          <div className="ic in">
            <svg style={{ width: 9, height: 9 }}>
              <use href="#i-arrow-l" />
            </svg>
          </div>
          <div>
            <div className="nm">Principal</div>
            <div className="sub">aporte inicial</div>
          </div>
        </div>
        <span className="v in">R$ 50,00</span>
      </div>
      <div className="li">
        <div className="info">
          <div className="ic in">
            <svg style={{ width: 9, height: 9 }}>
              <use href="#i-trend" />
            </svg>
          </div>
          <div>
            <div className="nm">Rendimento</div>
            <div className="sub">proporcional</div>
          </div>
        </div>
        <span className="v in">R$ 1,40</span>
      </div>
      <div className="li">
        <div className="info">
          <div className="ic">
            <svg style={{ width: 9, height: 9 }}>
              <use href="#i-card" />
            </svg>
          </div>
          <div>
            <div className="nm">Saldo Kori</div>
            <div className="sub">USDC liquidado</div>
          </div>
        </div>
        <span className="v in">+R$ 51,40</span>
      </div>
    </div>
  )
}

/* ===================================================
   Tela card virtual (dual-block left)
   =================================================== */
export function ScreenCardVirtual() {
  return (
    <div className="scr-cardview">
      <div className="card-top-bar">
        <div className="back-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </div>
        <div className="ttl">Virtual</div>
        <div className="back-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
      </div>
      <div className="kcard-big">
        <div className="row">
          <div className="chip-m" />
          <div className="brand-c">
            <svg className="k">
              <use href="#kori-k" />
            </svg>
            <span>KORI · VIRTUAL</span>
          </div>
        </div>
        <div className="num-m">5421 •• •• 8294</div>
        <div className="name-m">Kauã M.</div>
        <div className="mc-m">
          <span />
          <span />
        </div>
      </div>
      <div className="vcv-grid">
        <div className="vcv-cell">
          <div className="l">Validade</div>
          <div className="v">08/29</div>
        </div>
        <div className="vcv-cell">
          <div className="l">CVV</div>
          <div className="v">•••</div>
        </div>
      </div>
      <div className="ctrl-row">
        <div className="ctrl-ico">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
          </svg>
        </div>
        <div className="ctrl-info">
          <div className="n">Compras online</div>
          <div className="s">● ativo</div>
        </div>
        <div className="ctrl-toggle" />
      </div>
      <div className="ctrl-row">
        <div className="ctrl-ico off">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <rect x="7" y="5" width="3" height="14" />
            <rect x="14" y="5" width="3" height="14" />
          </svg>
        </div>
        <div className="ctrl-info">
          <div className="n">Bloqueio temporário</div>
          <div className="s off">tap pra pausar</div>
        </div>
        <div className="ctrl-toggle off" />
      </div>
    </div>
  )
}

/* ===================================================
   Tela ingresso NFT (dual-block right)
   =================================================== */
export function ScreenTicket() {
  return (
    <div className="scr-cardview">
      <div className="card-top-bar">
        <div className="back-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </div>
        <div className="ttl">Meu ingresso</div>
        <div className="back-btn">
          <svg>
            <use href="#i-share" />
          </svg>
        </div>
      </div>
      <div className="ticket-card-mock">
        <div className="info">
          <div className="lab">22 MAR 2026 · 14H</div>
          <div className="nm">Lollapalooza Brasil</div>
          <div className="date">Autódromo Interlagos · Comfort</div>
        </div>
        <div className="stub">
          <span className="price">R$ 480 · NFT</span>
          <span className="mint">3Vmq...8tKr ↗</span>
        </div>
      </div>
      <div className="qr-mock">
        <div className="qr-pattern" />
        <div className="qr-center">
          <svg className="k">
            <use href="#kori-k" />
          </svg>
        </div>
      </div>
      <div className="qr-info">
        <div className="qr-row">
          <span className="lk">Token ID</span>
          <span className="vk">#0847</span>
        </div>
        <div className="qr-row">
          <span className="lk">Mint</span>
          <span className="vk">3Vmq...8tKr ↗</span>
        </div>
        <div className="qr-row">
          <span className="lk">Status</span>
          <span className="vk ok">● válido</span>
        </div>
      </div>
    </div>
  )
}
