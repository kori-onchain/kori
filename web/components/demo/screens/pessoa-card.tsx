import { IC } from "@/components/demo/icons"

export function PessoaCard() {
  return (
    <>
      <div className="dm-scrh">Meu cartão</div>
      <div className="dm-scrsub">Virtual · Mastercard</div>

      <div className="dm-creditcard">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, fontWeight: 600 }}>Kori · Virtual</span>
          {IC.card}
        </div>
        <div className="num">•••• •••• •••• 8294</div>
        <div className="ft">
          <span>ANA RIBEIRO</span>
          <span>08/29</span>
        </div>
      </div>

      <div className="dm-balcard">
        <div className="lab">Virtual · Mastercard</div>
        <div className="big">R$ 4.280,00</div>
        <div className="delta">▲ disponível para uso</div>
      </div>

      <div className="dm-stat2">
        <div className="s">
          <div className="l">Disponível</div>
          <div className="v" style={{ color: 'var(--ac)' }}>R$ 4.280</div>
          <div className="sub">71,3% do limite</div>
        </div>
        <div className="s">
          <div className="l">Gasto no mês</div>
          <div className="v">R$ 1.720</div>
          <div className="sub">28,7% utilizado</div>
        </div>
      </div>
      <div className="dm-stat2">
        <div className="s">
          <div className="l">Status</div>
          <div className="v" style={{ color: 'var(--ac)' }}>Ativo</div>
          <div className="sub">operando normalmente</div>
        </div>
        <div className="s">
          <div className="l">Fecha fatura</div>
          <div className="v">15 dias</div>
          <div className="sub">venc. 10 jul</div>
        </div>
      </div>

      <div className="dm-secttl">Controles do cartão</div>
      <div className="dm-setrow">
        <div className="si">{IC.qr}</div>
        <div className="sl">Compras online<div style={{ fontSize: 10, color: 'var(--dm-muted)' }}>ativo</div></div>
        <div className="sc">{IC.chev}</div>
      </div>
      <div className="dm-setrow">
        <div className="si">{IC.shield}</div>
        <div className="sl">Bloqueio temporário<div style={{ fontSize: 10, color: 'var(--dm-muted)' }}>cartão ativo</div></div>
        <div className="sc">{IC.chev}</div>
      </div>
      <div className="dm-setrow">
        <div className="si">{IC.transfer}</div>
        <div className="sl">Compras internacionais<div style={{ fontSize: 10, color: 'var(--dm-muted)' }}>ativo</div></div>
        <div className="sc">{IC.chev}</div>
      </div>
      <div className="dm-setrow">
        <div className="si">{IC.gear}</div>
        <div className="sl">Limite por compra<div style={{ fontSize: 10, color: 'var(--dm-muted)' }}>R$ 2.000,00</div></div>
        <div className="sc">{IC.chev}</div>
      </div>

      <div className="dm-secttl">Últimas compras <a>ver tudo →</a></div>
      {[
        { ti: "iF", name: "iFood", date: "hoje, 14:32", amount: "-R$ 67,50" },
        { ti: "Sp", name: "Spotify", date: "ontem", amount: "-R$ 21,90" },
        { ti: "Am", name: "Amazon", date: "24 mai", amount: "-R$ 349,00" },
        { ti: "ML", name: "Mercado Livre", date: "22 mai", amount: "-R$ 189,90" },
      ].map((tx) => (
        <div key={tx.name} className="dm-tx">
          <div className="ti">{tx.ti}</div>
          <div className="td"><b>{tx.name}</b><span>{tx.date}</span></div>
          <div className="tv">{tx.amount}</div>
        </div>
      ))}
    </>
  )
}
