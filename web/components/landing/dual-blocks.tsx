import { PhoneFrame, ScreenCardVirtual, ScreenTicket } from "./phone-screens"

export function DualBlocks() {
  return (
    <section className="section">
      <span className="sec-label">S:02 / IN ACTION</span>
      <span className="corner bl" />
      <span className="corner br" />

      <div className="sec-head">
        <div className="sec-tag">In Action</div>
        <h2 className="sec-title">
          Cada peça com peso próprio.
          <span className="dim">Não tem feature de marketing.</span>
        </h2>
      </div>

      <div className="dual-blocks">
        <div className="dual-block left">
          <span className="block-tag">01 · Cartão</span>
          <h3>
            Black metálico.
            <span className="dim">Cashback em USDC.</span>
          </h3>
          <p>
            Mastercard real, aceito em 200+ países. 1.5% de cashback pago direto na sua carteira em
            USDC, a cada compra.
          </p>
          <div className="block-meta">
            <span>
              Cashback <b>1.5%</b>
            </span>
            <span>
              Aceitação <b>200+ países</b>
            </span>
            <span>
              Liquidação <b>2.1s</b>
            </span>
          </div>
          <div className="block-phone">
            <PhoneFrame>
              <ScreenCardVirtual />
            </PhoneFrame>
          </div>
        </div>

        <div className="dual-block right">
          <span className="block-tag">02 · Ingressos</span>
          <h3>
            Show vira NFT.
            <span className="dim">Cambista, never again.</span>
          </h3>
          <p>
            QR rotativo antifraude renova a cada 5 segundos. Revenda P2P direto na blockchain depois
            de 7 dias do mint.
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
