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
            <span className="micro">· Mainnet</span>
          </span>
        </div>
        <div className="trust-item">
          <span className="lbl">Audited by</span>
          <span className="val">
            Trail of Bits<span className="micro">· Spearbit · Zellic</span>
          </span>
        </div>
        <div className="trust-item">
          <span className="lbl">Source</span>
          <span className="val">
            Open · MIT<span className="micro">· github.com/kora</span>
          </span>
        </div>
      </div>
    </section>
  )
}
