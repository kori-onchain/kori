import type { ReactNode } from "react"

const FEATS: { num: string; title: string; body: string; icon: ReactNode }[] = [
  {
    num: "01",
    title: "Cartão Black metálico",
    body: "Mastercard real, aceita em 200+ países. 1.5% de cashback em USDC, pago direto na carteira.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="6" width="18" height="13" rx="2" />
        <path d="M3 10h18" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Reputation NFT",
    body: "Score público que vive como NFT na sua wallet. Sobe com pagamentos, stake e holdings antigos.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12 L11 15 L16 9" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Yield comércio local",
    body: "Empreste pra padaria, mercado, bar. APR fixo entre 13% e 22% a.a. Settlement em USDC.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 18l5-5 4 4 7-9" />
        <path d="M14 8h6v6" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "Ingresso NFT",
    body: "Compra de show vira NFT na sua wallet. QR rotativo antifraude, revenda P2P sem cambista.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 7c0-1 1-2 2-2h14c1 0 2 1 2 2v3a2 2 0 100 4v3c0 1-1 2-2 2H5c-1 0-2-1-2-2v-3a2 2 0 100-4V7z" />
      </svg>
    ),
  },
  {
    num: "05",
    title: "Self-custody real",
    body: "Chave no Secure Enclave. A Kora não tem acesso. Sem custódia intermediária, sem ordem judicial.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2 L4 6 V12 c0 5 4 9 8 10 c4-1 8-5 8-10 V6 Z" />
        <path d="M9 12 l2 2 l4-4" />
      </svg>
    ),
  },
  {
    num: "06",
    title: "VIP lounges globais",
    body: "Tier IV+ libera acesso ilimitado a lounges Carbon em 60+ aeroportos. NFC ou QR no celular.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
      </svg>
    ),
  },
]

export function Capabilities() {
  return (
    <section className="section">
      <span className="sec-label">S:05 / CAPABILITIES</span>
      <span className="corner bl" />
      <span className="corner br" />

      <div className="sec-head">
        <div className="sec-tag">Capabilities</div>
        <h2 className="sec-title">
          Banking programável,
          <span className="dim">construído pra você ser o dono.</span>
        </h2>
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
