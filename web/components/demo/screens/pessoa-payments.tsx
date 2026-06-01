"use client"

import { IC } from "@/components/demo/icons"
import { fmt, useDemoLedger } from "@/components/demo/ledger"

export function PessoaPayments() {
  const { state } = useDemoLedger()
  return (
    <>
      <div className="dm-scrh">Para quem enviar?</div>
      <div className="dm-scrsub">Saldo disponível: {fmt(state.ana.saldo)}</div>

      <button className="dm-sec-btn" style={{ marginTop: 12 }}>{IC.qr} Buscar @username ou wallet</button>

      <div className="dm-sec"><h4>Contatos</h4></div>
      {[
        { ic: "MO", name: "Maria Oliveira", h: "@mari_o" },
        { ic: "LS", name: "Lucas Silva", h: "@lucas_s" },
        { ic: "RR", name: "Rafael Rocha", h: "@rafa_r" },
        { ic: "BC", name: "Beatriz Costa", h: "@bia_c" },
      ].map((c) => (
        <div className="dm-li" key={c.h}>
          <div className="ic">{c.ic}</div>
          <div className="tx"><b>{c.name}</b><span>{c.h}</span></div>
          <div className="chev">{IC.chev}</div>
        </div>
      ))}

      <div className="dm-sec"><h4>Pagamentos recentes</h4></div>
      <div className="dm-li">
        <div className="ic">LS</div>
        <div className="tx"><b>Lucas Silva</b><span>hoje · 14h30</span></div>
        <div className="rt"><div className="a">- R$ 143,82</div><div className="s">Pix</div></div>
      </div>
      <div className="dm-li">
        <div className="ic">{IC.transfer}</div>
        <div className="tx"><b>Câmbio BRL → USD</b><span>hoje · 12h08</span></div>
        <div className="rt"><div className="a">- R$ 2.450,80</div><div className="s">Swap</div></div>
      </div>
      <div className="dm-li">
        <div className="ic">{IC.user}</div>
        <div className="tx"><b>Anônimo</b><span>ontem · 16h15</span></div>
        <div className="rt"><div className="a green">+ R$ 389,45</div><div className="s">Pix</div></div>
      </div>
      <div className="dm-li">
        <div className="ic">MO</div>
        <div className="tx"><b>Maria Oliveira</b><span>ontem · 09h15</span></div>
        <div className="rt"><div className="a green">+ R$ 88,20</div><div className="s">Pix</div></div>
      </div>
    </>
  )
}
