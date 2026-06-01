import { IC } from "@/components/demo/icons"

export function PessoaPayments() {
  return (
    <>
      <div className="dm-scrh">Para quem enviar?</div>
      <div className="dm-scrsub">Saldo disponível: R$ 4.280,00</div>

      <button className="dm-cta">Buscar @username ou wallet</button>

      <div className="dm-secttl">Contatos</div>
      <div className="dm-tx">
        <div className="ti">MO</div>
        <div className="td">
          <b>Maria Oliveira</b>
          <span>@mari_o</span>
        </div>
        <div className="sc">{IC.chev}</div>
      </div>
      <div className="dm-tx">
        <div className="ti">LS</div>
        <div className="td">
          <b>Lucas Silva</b>
          <span>@lucas_s</span>
        </div>
        <div className="sc">{IC.chev}</div>
      </div>
      <div className="dm-tx">
        <div className="ti">RR</div>
        <div className="td">
          <b>Rafael Rocha</b>
          <span>@rafa_r</span>
        </div>
        <div className="sc">{IC.chev}</div>
      </div>
      <div className="dm-tx">
        <div className="ti">{IC.user}</div>
        <div className="td">
          <b>Anônimo</b>
          <span>@anon-843</span>
        </div>
        <div className="sc">{IC.chev}</div>
      </div>
      <div className="dm-tx">
        <div className="ti">BC</div>
        <div className="td">
          <b>Beatriz Costa</b>
          <span>@bia_c</span>
        </div>
        <div className="sc">{IC.chev}</div>
      </div>
      <div className="dm-tx">
        <div className="ti">GL</div>
        <div className="td">
          <b>Gabriela Lima</b>
          <span>@gabi_l</span>
        </div>
        <div className="sc">{IC.chev}</div>
      </div>

      <div className="dm-secttl">Receber</div>
      <div className="dm-setrow">
        <div className="si">{IC.qr}</div>
        <div className="sl">
          Sua wallet Kori
          <div style={{ fontSize: 10, color: "var(--dm-muted)" }}>8Wnz…1kPm</div>
        </div>
        <div className="sc">{IC.chev}</div>
      </div>

      <div className="dm-secttl">Pagamentos recentes</div>
      <div className="dm-tx">
        <div className="ti">LS</div>
        <div className="td">
          <b>Lucas Silva</b>
          <span>Hoje, 14:30</span>
        </div>
        <div className="tv">- R$ 143,82</div>
      </div>
      <div className="dm-tx">
        <div className="ti">{IC.transfer}</div>
        <div className="td">
          <b>Câmbio BRL → USD</b>
          <span>Hoje, 12:08</span>
        </div>
        <div className="tv">- R$ 2.450,80</div>
      </div>
      <div className="dm-tx">
        <div className="ti">{IC.user}</div>
        <div className="td">
          <b>Anônimo</b>
          <span>Ontem, 16:15</span>
        </div>
        <div className="tv up">+ R$ 389,45</div>
      </div>
      <div className="dm-tx">
        <div className="ti">MO</div>
        <div className="td">
          <b>Maria Oliveira</b>
          <span>Ontem, 09:15</span>
        </div>
        <div className="tv up">+ R$ 88,20</div>
      </div>
    </>
  )
}
