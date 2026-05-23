import type { ReactNode } from "react"

const FEATS: { num: string; title: string; body: string; icon: ReactNode }[] = [
  {
    num: "01",
    title: "Conta self-custody",
    body: "Onboarding sem seed phrase, carteira criada na demo e controle pelo usuário.",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="3" y="6" width="18" height="13" rx="2" />
        <path d="M3 10h18" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Yield de recebíveis",
    body: "Financiamento de comércio local com APR, prazo, risco e settlement em USDC.",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12 L11 15 L16 9" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "P2P em USDC",
    body: "Transferência entre contas usando a mesma base onchain do app.",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M4 18l5-5 4 4 7-9" />
        <path d="M14 8h6v6" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "Score onchain",
    body: "Reputation Token na carteira como base para limites e benefícios futuros.",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M3 7c0-1 1-2 2-2h14c1 0 2 1 2 2v3a2 2 0 100 4v3c0 1-1 2-2 2H5c-1 0-2-1-2-2v-3a2 2 0 100-4V7z" />
      </svg>
    ),
  },
  {
    num: "R1",
    title: "Cartão Kora",
    body: "Roadmap: cartão com cashback em USDC, em desenvolvimento via parceiro emissor.",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M12 2 L4 6 V12 c0 5 4 9 8 10 c4-1 8-5 8-10 V6 Z" />
        <path d="M9 12 l2 2 l4-4" />
      </svg>
    ),
  },
  {
    num: "R2",
    title: "BNPL, ingressos e lounges",
    body: "Roadmap: BNPL com score onchain, ingressos NFT antifraude e acesso VIP.",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
      </svg>
    ),
  },
]

export function Capabilities() {
  return (
    <section className="section">
      <span className="sec-label">S:05 / ROADMAP</span>
      <span className="corner bl" />
      <span className="corner br" />

      <div className="sec-head">
        <div className="sec-tag">Visão</div>
        <h2 className="sec-title">
          Hoje: yield onchain funcionando.
          <span className="dim">Amanhã: o banco inteiro na sua chave.</span>
        </h2>
        <p className="section-intro">
          Primeiro, recebíveis locais. Depois, cartão, BNPL e benefícios em cima
          da mesma conta self-custody.
        </p>
      </div>

      <div className="features">
        {FEATS.map((f) => (
          <div key={f.num} className="feat">
            <div className="feat-head">
              <span className="feat-num">{f.num}</span>
              <div className="feat-icon">{f.icon}</div>
            </div>
            <h3 className="feat-title">{f.title}</h3>
            <p className="feat-body">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
