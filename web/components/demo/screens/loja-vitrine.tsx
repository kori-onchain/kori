import { IC } from "@/components/demo/icons"

export function LojaVitrine() {
  return (
    <>
      <div className="dm-scrh">Vitrine</div>
      <div className="dm-scrsub">Loja Aurora</div>

      <div className="dm-actions">
        <div className="dm-act"><div className="ico">{IC.grid}</div>Tudo</div>
        <div className="dm-act"><div className="ico">{IC.user}</div>Smartphones</div>
        <div className="dm-act"><div className="ico">{IC.home}</div>Kitchen</div>
        <div className="dm-act"><div className="ico">{IC.chart}</div>Game Consoles</div>
      </div>

      <div className="dm-secttl">Produtos</div>

      <div className="dm-tx">
        <div className="ti">{IC.grid}</div>
        <div className="td"><b>iPhone 15 Pro</b><span>APPLE · Smartphones</span></div>
        <div className="tv">R$ 6.999</div>
        <span className="dm-pill ok">-12%</span>
      </div>
      <div className="dm-tx">
        <div className="ti">{IC.grid}</div>
        <div className="td"><b>AirFryer Turbo 5L</b><span>MONDIAL · Kitchen</span></div>
        <div className="tv">R$ 349</div>
        <span className="dm-pill ok">-30%</span>
      </div>
      <div className="dm-tx">
        <div className="ti">{IC.grid}</div>
        <div className="td"><b>PlayStation 5 Slim</b><span>SONY · Game Consoles</span></div>
        <div className="tv">R$ 3.499</div>
        <span className="dm-pill pend">sem desc.</span>
      </div>
      <div className="dm-tx">
        <div className="ti">{IC.grid}</div>
        <div className="td"><b>Galaxy S24 Ultra</b><span>SAMSUNG · Smartphones</span></div>
        <div className="tv">R$ 5.999</div>
        <span className="dm-pill ok">-20%</span>
      </div>
      <div className="dm-tx">
        <div className="ti">{IC.grid}</div>
        <div className="td"><b>Conjunto Panelas Inox</b><span>TRAMONTINA · Kitchen</span></div>
        <div className="tv">R$ 289</div>
        <span className="dm-pill ok">-25%</span>
      </div>
      <div className="dm-tx">
        <div className="ti">{IC.grid}</div>
        <div className="td"><b>Switch OLED</b><span>NINTENDO · Game Consoles</span></div>
        <div className="tv">R$ 2.199</div>
        <span className="dm-pill ok">-12%</span>
      </div>

      <div className="dm-secttl">Resumo da vitrine</div>
      <div className="dm-stat2">
        <div className="s">
          <div className="l">Total de produtos</div>
          <div className="v">6</div>
        </div>
        <div className="s">
          <div className="l">Com desconto</div>
          <div className="v">5</div>
        </div>
      </div>
      <div className="dm-stat2">
        <div className="s">
          <div className="l">Preço médio</div>
          <div className="v">R$ 3.222</div>
        </div>
        <div className="s">
          <div className="l">Maior desconto</div>
          <div className="v" style={{ color: 'var(--ac)' }}>-30%</div>
        </div>
      </div>

      <div className="dm-secttl">Por categoria</div>
      <div className="dm-tx">
        <div className="td"><b>Smartphones</b></div>
        <div className="tv">2 produtos</div>
      </div>
      <div className="dm-tx">
        <div className="td"><b>Kitchen</b></div>
        <div className="tv">2 produtos</div>
      </div>
      <div className="dm-tx">
        <div className="td"><b>Game Consoles</b></div>
        <div className="tv">2 produtos</div>
      </div>

      <button className="dm-cta">Novo produto</button>
    </>
  )
}
