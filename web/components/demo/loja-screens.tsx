/* ===================================================
   Telas mock da persona LOJA (não existem em phone-screens.tsx).
   Reutilizam exatamente as classes do landing.css.
   Assinatura ({ active }) p/ plugar no sistema .screen/.screen.active.
   =================================================== */
import { MOCK_RECEIVABLES } from "@/lib/mock-data"

function LojaTop({ word, icons }: { word: string; icons: { id: string }[] }) {
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

type ScreenProps = { active?: boolean; dataScreen?: string }

/* Home da loja — caixa de hoje + indicadores + vendas recebidas */
export function ScreenLojaHome({ active = false, dataScreen }: ScreenProps) {
  return (
    <div className={`screen${active ? " active" : ""}`} data-screen={dataScreen}>
      <LojaTop word="Loja Aurora" icons={[{ id: "i-search" }, { id: "i-bell" }]} />
      <div className="balance-block">
        <div className="mono-lbl">Caixa hoje</div>
        <div className="balance-big">
          R$ 3.482<span className="cents">,90</span>
        </div>
        <div className="chip-row">
          <span className="chip">
            Pix <b>R$ 2.140</b>
          </span>
          <span className="chip usdc">
            Cartão <b>R$ 1.342</b>
          </span>
        </div>
      </div>
      <div className="stats-3">
        <div className="s">
          <div className="l">Vendas</div>
          <div className="v">38</div>
        </div>
        <div className="s">
          <div className="l">Ticket méd</div>
          <div className="v">R$ 91</div>
        </div>
        <div className="s">
          <div className="l">A receber</div>
          <div className="v">R$ 6,1k</div>
        </div>
      </div>
      <div className="sec-mini-label">
        <span className="mono-lbl">Recebido agora</span>
        <span style={{ fontFamily: "var(--kori-mono)", fontSize: 8, color: "var(--green)" }}>
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
            <div className="nm">Venda #3841</div>
            <div className="sub">Pix · @cliente_x</div>
          </div>
        </div>
        <span className="v in">+R$ 124</span>
      </div>
      <div className="li">
        <div className="info">
          <div className="ic in">
            <svg style={{ width: 9, height: 9 }}>
              <use href="#i-card" />
            </svg>
          </div>
          <div>
            <div className="nm">Venda #3840</div>
            <div className="sub">Cartão · 2x</div>
          </div>
        </div>
        <span className="v in">+R$ 83,50</span>
      </div>
    </div>
  )
}

/* Antecipar recebíveis — lista de recebíveis em aberto (mock-data) */
export function ScreenLojaAntecipar({ active = false, dataScreen }: ScreenProps) {
  return (
    <div className={`screen${active ? " active" : ""}`} data-screen={dataScreen}>
      <LojaTop word="Antecipar" icons={[{ id: "i-filter" }]} />
      <div style={{ padding: "2px 0" }}>
        <div style={{ fontWeight: 700, fontSize: 18, lineHeight: 1.15, letterSpacing: "-0.02em" }}>
          Receba hoje
          <br />o que vence depois.
        </div>
        <div style={{ fontSize: 11, color: "var(--ink-dim)", marginTop: 5, lineHeight: 1.5 }}>
          recebíveis em aberto, liquidação na hora.
        </div>
      </div>
      <div className="filter-row">
        <span className="filter-chip act">Tudo</span>
        <span className="filter-chip">30d</span>
        <span className="filter-chip">45d</span>
        <span className="filter-chip">60d</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {MOCK_RECEIVABLES.slice(0, 3).map((r) => (
          <div key={r.id} className="opp">
            <div className="top">
              <div>
                <div className="merchant">{r.description.split("—")[1]?.trim() ?? r.description}</div>
                <div className="hash">vence {r.dueDate}</div>
              </div>
              <span className="risk low">● em aberto</span>
            </div>
            <div className="row-stats">
              <div className="s">
                <div className="l">Bruto</div>
                <div className="v">{r.grossAmount}</div>
              </div>
              <div className="s">
                <div className="l">Líquido</div>
                <div className="v">{r.netAmount}</div>
              </div>
              <div className="s">
                <div className="l">Parc.</div>
                <div className="v">{r.installments.split(" ")[0]}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* Confirmação de adiantamento */
export function ScreenLojaConfirm({ active = false, dataScreen }: ScreenProps) {
  return (
    <div className={`screen${active ? " active" : ""}`} data-screen={dataScreen}>
      <LojaTop word="Adiantar" icons={[{ id: "i-check" }]} />
      <div className="score-card">
        <div className="mono-lbl" style={{ fontSize: 8 }}>
          ADIANTAMENTO
        </div>
        <div style={{ fontWeight: 800, fontSize: 30, marginTop: 16 }}>R$ 2.493</div>
        <div style={{ color: "var(--ink-dim)", fontSize: 11, marginTop: 5 }}>
          líquido de 3 recebíveis selecionados
        </div>
        <div className="score-tier">Liberação: hoje, na hora</div>
        <div className="score-mint">liquidado em USDC</div>
      </div>
      <div className="sec-mini-label">
        <span className="mono-lbl">Resumo</span>
        <span style={{ fontFamily: "var(--kori-mono)", fontSize: 8, color: "var(--orange)" }}>
          confirmar
        </span>
      </div>
      {[
        ["Valor bruto", "R$ 2.570,00"],
        ["Taxa (3%)", "− R$ 77,10"],
        ["Prazo médio", "38 dias"],
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
              <div className="sub">antes da liberação</div>
            </div>
          </div>
          <span className="v in">{value}</span>
        </div>
      ))}
    </div>
  )
}

/* Vendas — meta do mês (gauge) + vendas recentes */
export function ScreenLojaVendas({ active = false, dataScreen }: ScreenProps) {
  return (
    <div className={`screen${active ? " active" : ""}`} data-screen={dataScreen}>
      <LojaTop word="Vendas" icons={[{ id: "i-share" }]} />
      <div className="score-card">
        <div className="mono-lbl" style={{ fontSize: 8 }}>
          META DO MÊS
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
              strokeDashoffset="78"
            />
          </svg>
          <div className="gauge-num">
            74<span className="of">% de R$ 60k</span>
          </div>
        </div>
        <div className="score-tier">R$ 44.380 vendidos</div>
        <div className="score-mint">faltam 9 dias pro fechamento</div>
      </div>
      <div className="sec-mini-label">
        <span className="mono-lbl">Top produtos</span>
        <span style={{ fontFamily: "var(--kori-mono)", fontSize: 8, color: "var(--green)" }}>
          +18% vs mês ant.
        </span>
      </div>
      {[
        ["Tênis Air Pro", "21 vendas", "R$ 25.200"],
        ["Camiseta Premium", "34 vendas", "R$ 8.160"],
        ["Kit Skincare", "12 vendas", "R$ 10.680"],
      ].map(([name, qty, total]) => (
        <div className="li" key={name}>
          <div className="info">
            <div className="ic in">
              <svg style={{ width: 9, height: 9 }}>
                <use href="#i-trend" />
              </svg>
            </div>
            <div>
              <div className="nm">{name}</div>
              <div className="sub">{qty}</div>
            </div>
          </div>
          <span className="v in">{total}</span>
        </div>
      ))}
    </div>
  )
}
