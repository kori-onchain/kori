export function TrustBar() {
  const items = [
    {
      label: "Built on",
      value: "Solana",
      meta: "Devnet",
      solana: true,
    },
    {
      label: "Demo",
      value: "Hackanation 2026",
      meta: "v1 pública",
    },
    {
      label: "Status",
      value: "v1 on Devnet",
      meta: "roadmap honesto",
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
