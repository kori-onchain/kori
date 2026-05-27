import { PhoneFrame, ScreenCardVirtual, ScreenTicket } from "./phone-screens"

export function DualBlocks() {
  return (
    <section className="section">
      <span className="sec-label">S:02 / IN ACTION</span>
      <span className="corner bl" />
      <span className="corner br" />

      <div className="sec-head">
        <div className="sec-tag">Conceitos futuros</div>
        <h2 className="sec-title">
          Cartão e ingressos.
          <span className="dim">Roadmap, não promessa de demo.</span>
        </h2>
      </div>

      <div className="dual-blocks">
        <div className="dual-block left">
          <span className="block-tag">ROADMAP · Cartão</span>
          <h3>
            Cartão Kori.
            <span className="dim">Cashback em USDC.</span>
          </h3>
          <p>
            Cashback em USDC, em desenvolvimento via parceiro emissor. Conceito,
            não cartão emitido.
          </p>
          <div className="block-meta">
            <span>
              Status <b>em breve</b>
            </span>
            <span>
              Emissor <b>parceiro</b>
            </span>
            <span>
              Settlement <b>USDC</b>
            </span>
          </div>
          <div className="block-phone">
            <PhoneFrame>
              <ScreenCardVirtual />
            </PhoneFrame>
          </div>
        </div>

        <div className="dual-block right">
          <span className="block-tag">ROADMAP · Ingressos</span>
          <h3>
            Show vira NFT.
            <span className="dim">Cambista, never again.</span>
          </h3>
          <p>
            Ingressos NFT antifraude com QR rotativo e revenda P2P onchain.
            Roadmap.
          </p>
          <div className="block-meta">
            <span>
              QR <b>5s rotation</b>
            </span>
            <span>
              Revenda <b>P2P onchain</b>
            </span>
            <span>
              Mint <b>Metaplex</b>
            </span>
          </div>
          <div className="block-phone">
            <PhoneFrame>
              <ScreenTicket />
            </PhoneFrame>
          </div>
        </div>
      </div>
    </section>
  )
}
