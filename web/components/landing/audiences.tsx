const AUDIENCES = [
  {
    num: "01",
    who: "Consumidor",
    title: "Crédito mais justo.",
    body: "Pague e parcele com condições melhores que o banco digital. Sem seed phrase.",
    estimate: "~2,5% a.m. (estimado)",
  },
  {
    num: "02",
    who: "Lojista",
    title: "Receba hoje.",
    body: "Antecipe o recebível com taxa menor e liquidez no mesmo dia.",
    estimate: "~3–5% (estimado)",
  },
  {
    num: "03",
    who: "Investidor",
    title: "Financie a economia real.",
    body: "Crédito brasileiro em USDC, liquidez 24/7 e tudo auditável on-chain.",
    estimate: "15–18% a.a. (potencial)",
  },
]

export function Audiences() {
  return (
    <section className="section">
      <span className="sec-label">S:02 / PARA QUEM</span>
      <span className="corner bl" />
      <span className="corner br" />

      <div className="sec-head">
        <div className="sec-tag">Para quem é</div>
        <h2 className="sec-title">
          Três públicos,
          <span className="dim">uma ponte.</span>
        </h2>
        <p className="section-intro">
          Capital global que busca rendimento. Economia local que precisa de
          crédito. O Kori liga os dois.
        </p>
      </div>

      <div className="features">
        {AUDIENCES.map((a) => (
          <div key={a.num} className="feat">
            <div className="feat-head">
              <span className="feat-num">{a.num}</span>
              <span className="feat-num">{a.who}</span>
            </div>
            <h3 className="feat-title">{a.title}</h3>
            <p className="feat-body">{a.body}</p>
            <span className="feat-estimate">{a.estimate}</span>
          </div>
        ))}
      </div>

      <p className="audiences-note">
        Valores ilustrativos. Variam por operação, prazo e risco — potencial, não
        garantido.
      </p>
    </section>
  )
}
