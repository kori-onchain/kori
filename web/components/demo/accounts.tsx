import type { ReactNode } from "react"

import { IC } from "./icons"

export interface DemoAccount {
  id: "investidor" | "pessoa" | "loja"
  label: string
  initials: string
  avTxt: string
  who: string
  hi: string
  pj?: string
  /** [label, iconKey] — exatamente 4 abas */
  tabs: [string, string][]
}

export const ACCOUNTS: DemoAccount[] = [
  {
    id: "investidor",
    label: "Investidor",
    initials: "KM",
    avTxt: "#0a0a0b",
    who: "Kauã Invest",
    hi: "Bem-vindo,",
    tabs: [
      ["Início", "home"],
      ["Oportun.", "grid"],
      ["Carteira", "chart"],
      ["Perfil", "user"],
    ],
  },
  {
    id: "pessoa",
    label: "Pessoa",
    initials: "AR",
    avTxt: "#0a0a0b",
    who: "Ana Ribeiro",
    hi: "Bem-vinda,",
    tabs: [
      ["Início", "home"],
      ["Cartões", "card"],
      ["Pix", "pix"],
      ["Perfil", "user"],
    ],
  },
  {
    id: "loja",
    label: "Loja",
    initials: "LA",
    avTxt: "#0a0a0b",
    who: "Loja Aurora",
    hi: "Comércio",
    pj: "PJ",
    tabs: [
      ["Início", "home"],
      ["Recebíveis", "grid"],
      ["Vendas", "chart"],
      ["Perfil", "user"],
    ],
  },
]

export const ACC_BY_ID = Object.fromEntries(ACCOUNTS.map((a) => [a.id, a])) as Record<string, DemoAccount>

function HeaderRow({ a }: { a: DemoAccount }) {
  return (
    <div className="dm-approw">
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <div className="dm-avatar" style={{ background: "var(--ac)", color: a.avTxt }}>
          {a.initials}
        </div>
        <div className="dm-hi">
          {a.hi}
          <b>
            {a.who}
            {a.pj ? <span className="dm-pjb">{a.pj}</span> : null}
          </b>
        </div>
      </div>
      <div className="dm-iconbtn">{IC.bell}</div>
    </div>
  )
}

function Actions({ items }: { items: [string, string][] }) {
  return (
    <div className="dm-actions">
      {items.map(([label, ico]) => (
        <div className="dm-act" key={label}>
          <div className="ico">{IC[ico]}</div>
          {label}
        </div>
      ))}
    </div>
  )
}

/* ---------------- INÍCIO ---------------- */
function HomeBody({ id }: { id: string }) {
  if (id === "pessoa")
    return (
      <>
        <div className="dm-balcard">
          <div className="chip">Pessoal</div>
          <div className="lab">Saldo disponível</div>
          <div className="big">R$ 4.280,00</div>
          <div className="delta">▲ R$ 320,00 esta semana</div>
        </div>
        <Actions
          items={[
            ["Pix", "pix"],
            ["Pagar", "card"],
            ["Transferir", "transfer"],
            ["Mais", "dots"],
          ]}
        />
        <div className="dm-secttl">
          Atividade recente <a>Ver tudo</a>
        </div>
        <div className="dm-tx">
          <div className="ti">{IC.card}</div>
          <div className="td">
            <b>Cafeteria Lila</b>
            <span>Hoje · 08:12</span>
          </div>
          <div className="tv">– R$ 18</div>
        </div>
        <div className="dm-tx">
          <div className="ti">{IC.trend}</div>
          <div className="td">
            <b>Salário</b>
            <span>Ontem</span>
          </div>
          <div className="tv up">+ R$ 3.200</div>
        </div>
        <div className="dm-tx">
          <div className="ti">{IC.pix}</div>
          <div className="td">
            <b>Pix · João M.</b>
            <span>Seg · 19:40</span>
          </div>
          <div className="tv">– R$ 80</div>
        </div>
      </>
    )
  if (id === "investidor")
    return (
      <>
        <div className="dm-balcard">
          <div className="chip">Investidor</div>
          <div className="lab">Patrimônio investido</div>
          <div className="big">R$ 18.940</div>
          <div className="delta">▲ 19% no mês</div>
        </div>
        <div className="dm-stat2">
          <div className="s">
            <div className="l">Rendimento mês</div>
            <div className="v" style={{ color: "var(--ac)" }}>
              R$ 1.240
            </div>
          </div>
          <div className="s">
            <div className="l">Posições</div>
            <div className="v">12</div>
          </div>
        </div>
        <Actions
          items={[
            ["Investir", "trend"],
            ["Aportar", "plus"],
            ["Resgatar", "transfer"],
            ["Mais", "dots"],
          ]}
        />
        <div className="dm-secttl">
          Oportunidades <a>Ver tudo</a>
        </div>
        <div className="dm-tx">
          <div className="ti">PC</div>
          <div className="td">
            <b>Padaria Central</b>
            <span>APR 14,2% · 30d</span>
          </div>
          <div className="tv up">+2,8%</div>
        </div>
        <div className="dm-tx">
          <div className="ti">MV</div>
          <div className="td">
            <b>Mercado Verde</b>
            <span>APR 13,8% · 45d</span>
          </div>
          <div className="tv up">+3,1%</div>
        </div>
      </>
    )
  return (
    <>
      <div className="dm-balcard">
        <div className="chip">Loja</div>
        <div className="lab">Caixa hoje</div>
        <div className="big">R$ 3.482,90</div>
        <div className="delta">▲ 38 vendas hoje</div>
      </div>
      <div className="dm-stat2">
        <div className="s">
          <div className="l">A receber</div>
          <div className="v" style={{ color: "var(--ac)" }}>
            R$ 6,1k
          </div>
        </div>
        <div className="s">
          <div className="l">Ticket médio</div>
          <div className="v">R$ 91</div>
        </div>
      </div>
      <Actions
        items={[
          ["Cobrar", "grid"],
          ["Antecipar", "trend"],
          ["Transferir", "transfer"],
          ["Mais", "dots"],
        ]}
      />
      <div className="dm-secttl">
        Recebíveis <a>Gerenciar</a>
      </div>
      <div className="dm-tx">
        <div className="ti">#21</div>
        <div className="td">
          <b>Tênis Air Pro</b>
          <span>Vence em 3 dias</span>
        </div>
        <span className="dm-pill pend">R$ 1.200</span>
      </div>
      <div className="dm-tx">
        <div className="ti">BT</div>
        <div className="td">
          <b>Beta Tech</b>
          <span>Pago hoje</span>
        </div>
        <span className="dm-pill ok">R$ 2.400</span>
      </div>
    </>
  )
}

/* ---------------- ABA 2 ---------------- */
function TwoBody({ id }: { id: string }) {
  if (id === "pessoa")
    return (
      <>
        <div className="dm-scrh">Seus cartões</div>
        <div className="dm-creditcard">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 11, fontWeight: 600 }}>Kori</span>
            {IC.card}
          </div>
          <div className="num">•••• •••• •••• 4280</div>
          <div className="ft">
            <span>ANA RIBEIRO</span>
            <span>12/29</span>
          </div>
        </div>
        <div className="dm-secttl">Limite</div>
        <div style={{ fontSize: 12, color: "var(--dm-muted)", display: "flex", justifyContent: "space-between" }}>
          <span>R$ 1.350 usados</span>
          <span>de R$ 3.000</span>
        </div>
        <div className="dm-track">
          <i style={{ width: "45%" }} />
        </div>
        <div className="dm-setrow">
          <div className="si">{IC.shield}</div>
          <div className="sl">Cartão virtual</div>
          <div className="sc">{IC.chev}</div>
        </div>
        <div className="dm-setrow">
          <div className="si">{IC.gear}</div>
          <div className="sl">Bloquear cartão</div>
          <div className="sc">{IC.chev}</div>
        </div>
      </>
    )
  if (id === "investidor")
    return (
      <>
        <div className="dm-scrh">Oportunidades</div>
        <div className="dm-scrsub">recebíveis locais · liquidação em USDC</div>
        <button className="dm-cta">Investir agora</button>
        <div className="dm-tx">
          <div className="ti">PC</div>
          <div className="td">
            <b>Padaria Central</b>
            <span>Vila Mariana · 30d</span>
          </div>
          <div className="tv">14,2%</div>
        </div>
        <div className="dm-tx">
          <div className="ti">MV</div>
          <div className="td">
            <b>Mercado Verde</b>
            <span>Pinheiros · 45d</span>
          </div>
          <div className="tv">13,8%</div>
        </div>
        <div className="dm-tx">
          <div className="ti">BL</div>
          <div className="td">
            <b>Bistrô Lisboa</b>
            <span>Higienópolis · 90d</span>
          </div>
          <div className="tv">19,4%</div>
        </div>
      </>
    )
  return (
    <>
      <div className="dm-scrh">Recebíveis</div>
      <div className="dm-scrsub">5 em aberto · R$ 3.540</div>
      <button className="dm-cta">Antecipar selecionados</button>
      <div className="dm-tx">
        <div className="ti">#21</div>
        <div className="td">
          <b>Tênis Air Pro</b>
          <span>Vence em 3 dias</span>
        </div>
        <div className="tv">R$ 1.200</div>
      </div>
      <div className="dm-tx">
        <div className="ti">#22</div>
        <div className="td">
          <b>Camiseta Premium</b>
          <span>Vence em 8 dias</span>
        </div>
        <div className="tv">R$ 480</div>
      </div>
      <div className="dm-tx">
        <div className="ti">#19</div>
        <div className="td">
          <b>Kit Skincare</b>
          <span>Vence em 15 dias</span>
        </div>
        <div className="tv">R$ 890</div>
      </div>
    </>
  )
}

/* ---------------- ABA 3 ---------------- */
function FeatBody({ id }: { id: string }) {
  if (id === "pessoa")
    return (
      <>
        <div className="dm-scrh">Área Pix</div>
        <div style={{ display: "flex", gap: 9, marginTop: 6, alignItems: "center" }}>
          <button className="dm-cta" style={{ flex: 1, marginTop: 0 }}>
            Transferir
          </button>
          <div className="dm-act" style={{ width: 54 }}>
            <div className="ico" style={{ width: 48, height: 48 }}>
              {IC.qr}
            </div>
          </div>
        </div>
        <div className="dm-secttl">Contatos recentes</div>
        {[
          ["JM", "João Martins", "Pix · CPF"],
          ["CL", "Carla Lopes", "Pix · e-mail"],
          ["RS", "Rafael Souza", "Pix · telefone"],
        ].map(([ini, nome, sub]) => (
          <div className="dm-tx" key={ini}>
            <div className="ti">{ini}</div>
            <div className="td">
              <b>{nome}</b>
              <span>{sub}</span>
            </div>
            <div className="sc">{IC.chev}</div>
          </div>
        ))}
      </>
    )
  if (id === "investidor")
    return (
      <>
        <div className="dm-scrh">Carteira</div>
        <div className="dm-scrsub">rendimento · últimos 7 meses</div>
        <div className="dm-bars">
          {[55, 68, 60, 76, 70, 84, 95].map((h, i) => (
            <i key={i} style={{ height: `${h}%` }} />
          ))}
        </div>
        <div className="dm-stat2" style={{ marginTop: 14 }}>
          <div className="s">
            <div className="l">Aplicado</div>
            <div className="v" style={{ color: "var(--ac)" }}>
              R$ 16,2k
            </div>
          </div>
          <div className="s">
            <div className="l">Rendimento</div>
            <div className="v">+ R$ 2,7k</div>
          </div>
        </div>
        <div className="dm-setrow">
          <div className="si">{IC.chart}</div>
          <div className="sl">Exportar extrato</div>
          <div className="sc">{IC.chev}</div>
        </div>
      </>
    )
  return (
    <>
      <div className="dm-scrh">Vendas</div>
      <div className="dm-scrsub">faturamento · últimos 7 meses</div>
      <div className="dm-bars">
        {[50, 62, 58, 70, 66, 80, 92].map((h, i) => (
          <i key={i} style={{ height: `${h}%` }} />
        ))}
      </div>
      <div className="dm-stat2" style={{ marginTop: 14 }}>
        <div className="s">
          <div className="l">Mês</div>
          <div className="v" style={{ color: "var(--ac)" }}>
            R$ 44,3k
          </div>
        </div>
        <div className="s">
          <div className="l">Meta</div>
          <div className="v">74%</div>
        </div>
      </div>
      <div className="dm-setrow">
        <div className="si">{IC.chart}</div>
        <div className="sl">Exportar CSV</div>
        <div className="sc">{IC.chev}</div>
      </div>
    </>
  )
}

/* ---------------- PERFIL ---------------- */
function ProfileBody({ a }: { a: DemoAccount }) {
  return (
    <>
      <div className="dm-profile">
        <div className="pa" style={{ background: "var(--ac)", color: a.avTxt }}>
          {a.initials}
        </div>
        <div className="pn">{a.who}</div>
        <div className="pp">Conta {a.label}</div>
      </div>
      {[
        ["user", "Dados da conta"],
        ["shield", "Segurança"],
        ["gear", "Preferências"],
        ["card", "Plano e cobrança"],
      ].map(([ico, label], i) => (
        <div className="dm-setrow" key={label} style={i === 0 ? { marginTop: 14 } : undefined}>
          <div className="si">{IC[ico]}</div>
          <div className="sl">{label}</div>
          <div className="sc">{IC.chev}</div>
        </div>
      ))}
    </>
  )
}

export function Screen({ id, tab }: { id: string; tab: number }): ReactNode {
  const a = ACC_BY_ID[id]
  if (tab === 3) return <ProfileBody a={a} />
  return (
    <>
      <HeaderRow a={a} />
      {tab === 0 ? <HomeBody id={id} /> : null}
      {tab === 1 ? <TwoBody id={id} /> : null}
      {tab === 2 ? <FeatBody id={id} /> : null}
    </>
  )
}
