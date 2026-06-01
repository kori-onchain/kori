import { IC } from "@/components/demo/icons"

export function PessoaPerks() {
  return (
    <>
      <div className="dm-scrh">Experiências</div>
      <div className="dm-scrsub">Reputation points</div>

      <div className="dm-balcard">
        <div className="chip">BLACK</div>
        <div className="lab">Reputation points</div>
        <div className="big">24.850 PTS</div>
        <div className="delta">▲ Próximo nível: KORI Private</div>
      </div>

      <div className="dm-stat2">
        <div className="s">
          <div className="l">Faltam</div>
          <div className="v" style={{ color: 'var(--ac)' }}>5.150 pts</div>
          <div className="sub">para KORI Private</div>
        </div>
        <div className="s">
          <div className="l">Tier atual</div>
          <div className="v">BLACK</div>
          <div className="sub">83% concluído</div>
        </div>
      </div>

      <div className="dm-track"><i style={{ width: '83%' }} /></div>

      <div className="dm-secttl">Experiências disponíveis</div>

      <div className="dm-tx">
        <div className="ti">{IC.qr}</div>
        <div className="td"><b>Sala VIP Aeroportos</b><span>KORI Black</span></div>
        <span className="dm-pill pend">Ver</span>
      </div>
      <div className="dm-tx">
        <div className="ti">{IC.trend}</div>
        <div className="td"><b>Cashback Turbo 3%</b><span>4.500 pts</span></div>
        <span className="dm-pill ok">Resgatar</span>
      </div>
      <div className="dm-tx">
        <div className="ti">{IC.user}</div>
        <div className="td"><b>Concierge 24/7</b><span>KORI VIP</span></div>
        <span className="dm-pill pend">Ver</span>
      </div>
      <div className="dm-tx">
        <div className="ti">{IC.grid}</div>
        <div className="td"><b>KORI Collection Hotéis</b><span>8.000 pts</span></div>
        <span className="dm-pill ok">Resgatar</span>
      </div>
      <div className="dm-tx">
        <div className="ti">{IC.gear}</div>
        <div className="td"><b>Pré-vendas Exclusivas</b><span>2.500 pts</span></div>
        <span className="dm-pill ok">Resgatar</span>
      </div>

      <div className="dm-secttl">Benefícios Black</div>

      <div className="dm-tx">
        <div className="td"><b>Cashback padrão</b></div>
        <div className="tv">2,5%</div>
      </div>
      <div className="dm-tx">
        <div className="td"><b>Salas VIP</b></div>
        <div className="tv up">ilimitado</div>
      </div>
      <div className="dm-tx">
        <div className="td"><b>Concierge</b></div>
        <div className="tv up">24/7</div>
      </div>
      <div className="dm-tx">
        <div className="td"><b>Seguro viagem</b></div>
        <div className="tv up">incluso</div>
      </div>
      <div className="dm-tx">
        <div className="td"><b>Pontos por R$</b></div>
        <div className="tv">3x</div>
      </div>
    </>
  )
}
