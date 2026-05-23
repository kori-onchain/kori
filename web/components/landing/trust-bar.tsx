export function TrustBar() {
  return (
    <section className="trust-bar">
      <div className="trust-grid">
        <div className="trust-item">
          <span className="lbl">Built on</span>
          <span className="val">
            <svg className="solana-mark">
              <use href="#solana" />
            </svg>
            Solana
            <span className="micro">· Devnet</span>
          </span>
        </div>
        <div className="trust-item">
          <span className="lbl">Demo</span>
          <span className="val">Hackanation 2026</span>
        </div>
        <div className="trust-item">
          <span className="lbl">Status</span>
          <span className="val">
            v1 on Devnet<span className="micro">· roadmap honesto</span>
          </span>
        </div>
      </div>
    </section>
  )
}
