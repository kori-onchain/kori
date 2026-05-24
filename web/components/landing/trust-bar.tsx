export function TrustBar() {
  const items = [
    {
      label: "Built on",
      value: "Solana",
      meta: "Devnet",
      solana: true,
    },
    {
      label: "Hackanation",
      value: "2026",
      meta: "RWA + DeFi",
    },
    {
      label: "MVP",
      value: "Android-first",
      meta: "demo pública",
    },
  ]

  return (
    <section className="trust-bar">
      <div className="trust-grid">
        {items.map((item) => (
          <div className="trust-item" key={item.label}>
            <span className="lbl">{item.label}</span>
            <span className="val">
              {item.solana ? (
                <svg className="solana-mark" aria-hidden="true">
                  <use href="#solana" />
                </svg>
              ) : null}
              {item.value}
            </span>
            <span className="micro">{item.meta}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
