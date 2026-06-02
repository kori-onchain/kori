// Conteúdo do blog da Kori. Mesmo padrão de dados hardcoded usado em
// `faq.tsx` (FAQS) e `site-footer.tsx` (COLS): um array TS tipado, sem
// dependência externa. O corpo de cada post é uma lista de blocos tipados
// renderizada por `components/blog/blog-blocks.tsx`.

export type BlogBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "callout"; title?: string; text: string }
  | { type: "stat"; value: string; label: string }
  | { type: "quote"; text: string; cite?: string }

export type BlogAccent = "orange" | "green" | "sol"

export type BlogPost = {
  slug: string
  title: string
  /** Subtítulo curto usado em cards e no `<head>`. */
  excerpt: string
  /** Rótulo da categoria (mono, uppercase nos cards). */
  category: string
  /** ISO date (AAAA-MM-DD). */
  date: string
  /** Ex.: "6 min de leitura". */
  readingTime: string
  author: string
  /** Marca os 3 posts exibidos na seção da landing. */
  featured?: boolean
  accent?: BlogAccent
  body: BlogBlock[]
}

// Tom: direto, factual, números reais do deck. Negrito com **markup** em
// trechos-chave (parseado em blog-blocks). pt-BR.
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "pedagio-financeiro",
    title: "O pedágio financeiro: por que se paga caro dos dois lados",
    excerpt:
      "Lojista dá deságio pra antecipar, consumidor paga ágio embutido no preço. No meio, uma muralha de intermediários cobrando a cada etapa.",
    category: "Tese",
    date: "2026-05-28",
    readingTime: "7 min de leitura",
    author: "Kori Labs",
    featured: true,
    accent: "orange",
    body: [
      {
        type: "paragraph",
        text: "Todo pagamento no Brasil carrega um pedágio invisível. Quem vende paga pra receber mais cedo; quem compra paga um preço inflado pra cobrir o custo do crédito. É o mesmo dinheiro sendo tributado privadamente nas duas pontas — e quase ninguém percebe.",
      },
      { type: "heading", text: "De um lado: quem precisa do dinheiro hoje" },
      {
        type: "paragraph",
        text: "O lojista vende parcelado e recebe ao longo de meses. Pra antecipar esse fluxo de caixa, aceita um **deságio de até 15%** sobre o que já é seu. É crédito caro disfarçado de conveniência.",
      },
      {
        type: "paragraph",
        text: "Do lado do consumidor, o custo do crédito e das taxas é simplesmente **repassado ao preço final** — um **ágio de 10% a 15%** embutido no consumo. Você paga a maquininha mesmo quando paga à vista.",
      },
      {
        type: "stat",
        value: "R$ 614 bi/ano",
        label: "movimentados em antecipação e custo de crédito no varejo brasileiro",
      },
      { type: "heading", text: "No meio: uma muralha de intermediários" },
      {
        type: "paragraph",
        text: "Entre quem paga e quem recebe existe uma cadeia que cobra em cada etapa. Cada elo é um custo que volta pro preço:",
      },
      {
        type: "list",
        items: [
          "**Adquirente** — cobra o MDR sobre cada transação.",
          "**Gateway** — taxa de processamento por operação.",
          "**Bandeira** — network fee a cada passagem do cartão.",
          "**Banco emissor** — intercâmbio sobre o crédito concedido.",
        ],
      },
      {
        type: "callout",
        title: "O ponto cego dos bancos digitais",
        text: "Os bancos digitais resolveram a interface — o app ficou bonito. Mas continuam operando sobre os mesmos sistemas custosos e cheios de intermediários. Mudaram a fachada, não a estrutura.",
      },
      { type: "heading", text: "A Kori ataca a estrutura, não a fachada" },
      {
        type: "paragraph",
        text: "A proposta da Kori é remover a muralha em vez de redecorá-la: liquidação on-chain em stablecoin, recebíveis tokenizados e regras em contrato — conectando capital diretamente a quem precisa dele, sem cada elo cobrando seu pedágio.",
      },
      {
        type: "quote",
        text: "Onde o dinheiro encontra quem precisa dele.",
        cite: "Kori",
      },
    ],
  },
  {
    slug: "credito-privado-acesso",
    title: "R$ 1 trilhão e só 331 mil pessoas: o acesso travado ao crédito privado",
    excerpt:
      "O crédito privado movimenta bilhões no Brasil, mas a porta de entrada é estreita. Do outro lado, investidores buscando rendimento sem caminho pra chegar lá.",
    category: "Mercado",
    date: "2026-05-25",
    readingTime: "5 min de leitura",
    author: "Kori Labs",
    accent: "orange",
    body: [
      {
        type: "paragraph",
        text: "Se de um lado há quem precisa do dinheiro hoje, do outro há quem tem o dinheiro e procura onde colocá-lo pra render. O problema é que esses dois lados quase nunca se encontram.",
      },
      { type: "heading", text: "Demanda reprimida nas duas pontas" },
      {
        type: "paragraph",
        text: "Investidores procuram alto rendimento e não têm um caminho claro pra chegar lá. O mercado de crédito privado movimenta bilhões no Brasil, mas o acesso é restrito a poucos.",
      },
      {
        type: "stat",
        value: "331 mil",
        label: "pessoas com acesso ao mercado de crédito privado no Brasil (Anbima · 2025)",
      },
      {
        type: "paragraph",
        text: "Num país com dezenas de milhões de investidores e mais de 9 milhões de CNPJs, **331 mil** é praticamente nada. O capital existe, a demanda por crédito existe — falta a ponte.",
      },
      {
        type: "callout",
        title: "Os dois lados do mesmo mercado",
        text: "Lojista pagando 8% a.m. pra antecipar e investidor sem onde render bem são o mesmo problema visto de ângulos opostos. Conectá-los diretamente derruba o custo de um e melhora o retorno do outro.",
      },
      { type: "heading", text: "Por que ninguém resolveu ainda" },
      {
        type: "paragraph",
        text: "Conectar capital pulverizado a recebíveis pulverizados exige liquidação barata, rastreável e instantânea. Com a infraestrutura bancária tradicional, o custo por operação inviabiliza o ticket pequeno. É exatamente esse gargalo que a Kori remove ao levar a operação pra on-chain.",
      },
    ],
  },
  {
    slug: "ecossistema-dois-mundos",
    title: "Um ecossistema que conecta os dois mundos",
    excerpt:
      "Conta, Pix, cartão, antecipação e investimento num só lugar — com o poder da infraestrutura cripto e a simplicidade do fiat.",
    category: "Produto",
    date: "2026-05-22",
    readingTime: "6 min de leitura",
    author: "Kori Labs",
    accent: "orange",
    body: [
      {
        type: "paragraph",
        text: "A Kori não é mais um banco digital. É um ecossistema que liga a oferta de capital global à demanda da economia local — com cara de app comum e Web3 invisível por baixo.",
      },
      { type: "heading", text: "Conta, Pix e cartão" },
      {
        type: "paragraph",
        text: "Na superfície, é o que todo mundo já sabe usar: conta com saldo, transferência via Pix, cartão de crédito digital. Onboarding rápido e transferências internacionais sem taxa. Carteira, chaves e taxas de rede ficam nos bastidores.",
      },
      {
        type: "callout",
        title: "O poder da infraestrutura cripto, a simplicidade do fiat",
        text: "Por dentro, o saldo é stablecoin e a liquidação é on-chain. Por fora, é só um app de banco. O usuário nunca precisa saber a diferença.",
      },
      { type: "heading", text: "Cinco perfis, um só app" },
      {
        type: "list",
        items: [
          "**Conta · Todos** — onboarding rápido e transferências internacionais sem taxa.",
          "**BNPL & Cartão · Consumidor** — crédito com taxas competitivas e aceitação global.",
          "**Experiências · Lifestyle** — ticketing via NFT e reservas exclusivas, blindadas contra fraude e cambismo.",
          "**Lojista · Vendedor** — ecossistema integrado pra vendas físicas e e-commerce nativo.",
          "**Investimentos · Investidor** — acesso direto a um portfólio global de renda fixa, ações e RWAs.",
        ],
      },
      {
        type: "paragraph",
        text: "Conta, crédito, gestão financeira, vendas, antecipação e investimentos reunidos em um só lugar. O mesmo app serve o lojista que quer antecipar e o investidor que quer render — porque os dois operam sobre a mesma pool.",
      },
      {
        type: "quote",
        text: "Um ecossistema que conecta os dois mundos.",
        cite: "Kori",
      },
    ],
  },
  {
    slug: "vendedor-antecipacao",
    title: "Vendedor: antecipe recebíveis e receba na hora",
    excerpt:
      "Acompanhe o caixa, antecipe parcelas e receba na hora — com taxa que cai conforme seu histórico on-chain melhora.",
    category: "Lojista",
    date: "2026-05-19",
    readingTime: "6 min de leitura",
    author: "Kori Labs",
    featured: true,
    accent: "green",
    body: [
      {
        type: "paragraph",
        text: "Pro lojista, fluxo de caixa é sobrevivência. A Kori transforma cada venda parcelada num recebível que pode ser acompanhado, antecipado e liquidado na hora — sem ligar pra ninguém.",
      },
      { type: "heading", text: "Veja o caixa em tempo real" },
      {
        type: "paragraph",
        text: "Faturamento, ticket médio, conversão e o que está a receber nos próximos dias, tudo num painel só. Cada recebível pendente aparece com valor bruto, líquido estimado e data de vencimento.",
      },
      { type: "heading", text: "Antecipe só o que precisar" },
      {
        type: "paragraph",
        text: "Selecione os recebíveis, confira o líquido e confirme. A liquidação acontece on-chain em segundos — o dinheiro cai na conta sem o ritual de dias úteis do sistema tradicional.",
      },
      {
        type: "stat",
        value: "3% a.m.",
        label: "taxa de antecipação para bom histórico, contra ~8% a.m. do mercado",
      },
      { type: "heading", text: "Seu histórico vira taxa melhor" },
      {
        type: "paragraph",
        text: "Cada operação fica registrada on-chain, construindo um **score** transparente do seu negócio. Quanto melhor o histórico, menor o deságio: o vendedor que mantém as vendas em dia destrava **3% a.m. em vez de 8%**.",
      },
      {
        type: "callout",
        title: "Crédito que recompensa quem opera bem",
        text: "No modelo tradicional, todo lojista paga caro porque o risco é opaco. Com histórico auditável on-chain, o bom pagador deixa de subsidiar o risco dos outros.",
      },
    ],
  },
  {
    slug: "investidor-yield-onchain",
    title: "Investidor: rendimento real com liquidez on-chain",
    excerpt:
      "Escolha onde investir, acompanhe os rendimentos e desfrute da rentabilidade que a blockchain destrava — direto na economia real.",
    category: "Investidor",
    date: "2026-05-16",
    readingTime: "6 min de leitura",
    author: "Kori Labs",
    accent: "green",
    body: [
      {
        type: "paragraph",
        text: "Do lado da oferta, a Kori abre pro investidor um mercado que era de poucos: crédito privado lastreado em recebíveis reais, com liquidação e liquidez on-chain.",
      },
      { type: "heading", text: "Rendimento lastreado em operação real" },
      {
        type: "paragraph",
        text: "O capital aplicado vai pra pools que financiam a antecipação de lojistas. O rendimento não vem de tokenomics — vem do spread de uma operação de crédito que existe de verdade.",
      },
      {
        type: "stat",
        value: "198% do CDI",
        label: "rentabilidade de referência nos últimos 12 meses na demo (~15% no período)",
      },
      { type: "heading", text: "Transparência que o banco não te dá" },
      {
        type: "paragraph",
        text: "Cada posição mostra onde o capital está aplicado, quanto já rendeu, o APR e quando liquida. Dá pra filtrar por produto, classe, liquidez e ativos — e acompanhar a evolução do patrimônio em tempo real.",
      },
      {
        type: "list",
        items: [
          "Aplicação e resgate direto no app, em USDC ou BRL.",
          "Liquidação prevista em poucos dias, não semanas.",
          "Portfólio global de renda fixa, ações e RWAs num só lugar.",
        ],
      },
      {
        type: "callout",
        title: "Acesso direto, sem a porta estreita",
        text: "Onde antes só 331 mil pessoas chegavam, a Kori abre o crédito privado pra qualquer um com o app — com o ticket pequeno que só existe porque a liquidação é barata.",
      },
    ],
  },
  {
    slug: "por-que-solana",
    title: "Por que Solana: o custo quase zero que faz o ticket de R$50 existir",
    excerpt:
      "Microtransação a custo desprezível e liquidação em ~400ms. É o que permite tokenizar um recebível de R$50 e ainda fechar a conta.",
    category: "Infra",
    date: "2026-05-12",
    readingTime: "7 min de leitura",
    author: "Kori Labs",
    featured: true,
    accent: "sol",
    body: [
      {
        type: "paragraph",
        text: "A escolha da Solana não é estética nem hype. É aritmética: pra antecipar um recebível pequeno e ainda lucrar, o custo de cada transação precisa ser desprezível. Nenhum trilho tradicional entrega isso.",
      },
      {
        type: "stat",
        value: "$0,00025",
        label: "custo por transação on-chain",
      },
      {
        type: "stat",
        value: "~400ms",
        label: "liquidação final on-chain",
      },
      {
        type: "paragraph",
        text: "Microtransação a custo quase zero — o **ticket de R$50** só existe por causa disso. Num trilho que cobra centavos ou mais por operação, antecipar valores pequenos simplesmente não fecha a conta.",
      },
      { type: "heading", text: "Como a Kori usa a Solana" },
      {
        type: "list",
        ordered: true,
        items: [
          "**Gateway — movimentação em USDC.** Saldo e pagamentos em stablecoin, com liquidação instantânea e auditável.",
          "**Tokenização — recebíveis como cNFTs.** Cada recebível vira um Compressed NFT (Metaplex Bubblegum), rastreável on-chain.",
          "**Lógica — pool & escrow on-chain.** Pool, escrow e regras em programas Anchor (Rust): invioláveis e justos.",
        ],
      },
      {
        type: "callout",
        title: "Compressed NFTs: tokenizar barato",
        text: "Tokenizar milhões de recebíveis individualmente só é viável com compressão. Os cNFTs do Bubblegum cortam o custo de cunhagem em ordens de magnitude — é o que permite tratar cada parcela como um ativo próprio.",
      },
      {
        type: "paragraph",
        text: "O resultado: cada recebível é um ativo rastreável, cada regra de pool vive num contrato auditável, e o usuário final só vê um saldo em reais. Web3 invisível, garantias on-chain.",
      },
    ],
  },
  {
    slug: "como-a-kori-monetiza",
    title: "Como a Kori ganha dinheiro: 4 fontes de receita reais",
    excerpt:
      "Quatro fontes que crescem com o produto, todas vindas de operação real — não de tokenomics.",
    category: "Negócio",
    date: "2026-05-08",
    readingTime: "5 min de leitura",
    author: "Kori Labs",
    accent: "orange",
    body: [
      {
        type: "paragraph",
        text: "Sustentabilidade de um produto financeiro se mede pela receita que vem da operação, não da emissão de token. A Kori tem quatro fontes que amadurecem junto com o produto.",
      },
      { type: "heading", text: "Fase 1 · hoje" },
      {
        type: "list",
        items: [
          "**Spread de crédito (~10% margem líq.)** — capta a 15–18% a.a. e empresta a 5–7% a.m.",
          "**Antecipação (~1–3% por operação)** — factoring on-chain, com take rate no leilão P2P de recebíveis.",
        ],
      },
      { type: "heading", text: "Fase 2 · cartão" },
      {
        type: "list",
        items: [
          "**Interchange (~1% por gasto)** — MDR do cartão Kori, via BaaS da Pomelo.",
        ],
      },
      { type: "heading", text: "Fase 3 · escala" },
      {
        type: "list",
        items: [
          "**Performance fee (~10–20% do rendimento)** — sobre o excedente do pool institucional.",
        ],
      },
      {
        type: "callout",
        title: "Receita que cresce com o uso",
        text: "Cada fonte está amarrada a um comportamento real — antecipar, gastar no cartão, render no pool. Quanto mais o ecossistema opera, mais cada take rate compõe. Sem depender de preço de token.",
      },
    ],
  },
  {
    slug: "mercado-concorrencia-parceiros",
    title: "Mercado, concorrência e parceiros regulados",
    excerpt:
      "Um TAM de R$ 7,2 tri, concorrentes fortes em cada eixo (mas nenhum na sobreposição dos três) e cinco parceiros cobrindo o ciclo do on-chain ao banco regulado.",
    category: "Estratégia",
    date: "2026-05-04",
    readingTime: "8 min de leitura",
    author: "Kori Labs",
    accent: "orange",
    body: [
      { type: "heading", text: "Espaço pra crescer" },
      {
        type: "list",
        items: [
          "**R$ 7,2 tri** de crédito no SFN brasileiro (BCB 2026) — o TAM.",
          "**R$ 1 tri/ano** em antecipação de recebíveis hoje, podendo chegar a R$ 13 tri com a duplicata escritural.",
          "**90%** dos 9 milhões de CNPJs negativados são PMEs sem acesso a crédito justo.",
          "BNPL no Brasil cresce **14% a.a.** (~R$ 240 bi).",
        ],
      },
      {
        type: "stat",
        value: "R$ 5 bi",
        label: "SOM — fatia inicial endereçável (SAM de R$ 1 tri/ano, TAM de R$ 7,2 tri)",
      },
      { type: "heading", text: "Concorrência: forte em cada eixo, sozinha na interseção" },
      {
        type: "paragraph",
        text: "Há concorrentes diretos em cada eixo isolado — mas nenhum cobre os três ao mesmo tempo: Web3 invisível, ponte Pix↔on-chain e os dois lados (oferta e demanda) no mesmo produto.",
      },
      {
        type: "list",
        items: [
          "**Fintechs / bancos digitais** — ganham no Web3 invisível, mas não fazem a ponte on-chain nem servem os dois lados.",
          "**Antecipadoras de lojista** — boa experiência, sem on-chain e sem o lado investidor.",
          "**Crédito / crowdfunding web3** — parciais na ponte, fracos na experiência.",
          "**Tokenizadoras** — fortes em on-chain, fracas no Web3 invisível.",
          "**Wallets / exchanges cripto** — parciais na ponte, longe do varejo brasileiro.",
        ],
      },
      { type: "heading", text: "Parceiros regulados cobrindo o ciclo inteiro" },
      {
        type: "paragraph",
        text: "A Kori não tenta ser banco, custodiante e corretora sozinha. Apoia-se em parceiros regulados (CVM, SEC, Bacen) cobrindo liquidação, custódia e emissão:",
      },
      {
        type: "list",
        items: [
          "**Solana** — liquidação on-chain eficiente, baixo custo e auditoria pública.",
          "**Liqi** — motor de tokenização (RWA) com base em CVM e Sandbox do BC.",
          "**Privy** — wallet-as-a-service com MPC, biometria e custódia invisível.",
          "**Pomelo** — banking-as-a-service regulado pra Pix, liquidação e emissão de cartões.",
          "**DriveWealth** — ordens de ações e ETFs internacionais via USDC, em corretora regulada pela SEC.",
        ],
      },
      {
        type: "callout",
        title: "Do on-chain ao banco regulado",
        text: "Cinco parceiros cobrindo o ciclo inteiro — da liquidação on-chain à camada regulada. É o que permite oferecer Web3 por baixo com conformidade por cima.",
      },
      { type: "heading", text: "Roadmap: de MVP a padrão de mercado" },
      {
        type: "list",
        ordered: true,
        items: [
          "**Fase 1 · hoje (jun 2026)** — programa Solana publicado (Devnet), app ponta a ponta (conta, Pix, cartão), site no ar e demo on-chain auditável.",
          "**Fase 2 · Q3 2026** — deploy em Mainnet, parcerias Pomelo + Liqi ativas, KYC integrado e onboarding em waitlist controlada.",
          "**Fase 3 · Q4 2026** — lançamento público, pool institucional ativo, cartão Kori físico via Pomelo e investimentos globais via DriveWealth.",
        ],
      },
    ],
  },
  {
    slug: "o-app-da-kori",
    title: "O app da Kori: conta digital com Web3 invisível",
    excerpt:
      "Onboarding sem seed phrase, envio por @username ou QR, cartão, investimentos e o painel do lojista — tudo num app com cara de banco.",
    category: "Produto",
    date: "2026-05-30",
    readingTime: "5 min de leitura",
    author: "Kori Labs",
    accent: "orange",
    body: [
      {
        type: "paragraph",
        text: "O app da Kori parece um banco digital comum — e essa é a intenção. Por baixo, saldo, pagamentos e ativos vivem na Solana; por cima, ninguém precisa saber o que é carteira, chave ou endereço.",
      },
      { type: "heading", text: "Onboarding sem seed phrase" },
      {
        type: "paragraph",
        text: "O login é via **Privy**: e-mail ou conta social, e a carteira embutida é gerada nos bastidores. Sem seed phrase pra anotar, sem extensão pra instalar. Dá pra ter conta **Pessoa Física** e **Lojista (PJ)** e alternar entre elas.",
      },
      { type: "heading", text: "Enviar e receber do jeito que você já conhece" },
      {
        type: "list",
        items: [
          "Por **@username**, endereço de carteira, link ou **QR Code**.",
          "Leitura de QR de pagamento Kori direto pela câmera.",
          "Revisão, processamento e comprovante com identificador da transação.",
        ],
      },
      {
        type: "callout",
        title: "Segurança nativa do celular",
        text: "PIN, biometria digital e Face ID protegem o acesso e a confirmação de operações — a mesma camada que você já usa nos apps do dia a dia.",
      },
      { type: "heading", text: "Mais que pagamentos" },
      {
        type: "paragraph",
        text: "O mesmo app reúne **cartão** (Kori e virtual, com fatura e bloqueio temporário), **histórico** e contatos recentes, e abas de **investimentos, NFTs e benefícios**. Tema claro e escuro com troca em tempo real.",
      },
      {
        type: "paragraph",
        text: "Pro vendedor, o **Kori Business** lista vendas e recebíveis futuros e permite antecipar com poucos toques. É o mesmo ecossistema servindo os dois lados da operação.",
      },
    ],
  },
  {
    slug: "cartao-kori",
    title: "Cartão Kori: crédito liquidado pela pool (e o que ainda é roadmap)",
    excerpt:
      "No app já existe a área de cartão e o crédito parcelado liquidado on-chain. O cartão físico via emissor parceiro é o próximo passo.",
    category: "Roadmap",
    date: "2026-05-31",
    readingTime: "4 min de leitura",
    author: "Kori Labs",
    accent: "orange",
    body: [
      {
        type: "paragraph",
        text: "Cartão é uma das peças mais sensíveis de um produto financeiro — envolve emissor, licença e bandeira. A Kori começou pela parte que dá pra entregar de verdade e deixou o resto explícito no roadmap.",
      },
      { type: "heading", text: "O que já está no app" },
      {
        type: "list",
        items: [
          "Área de cartões com **cartão Kori** e **cartão virtual**.",
          "**Fatura** e **bloqueio temporário** do cartão.",
          "Compra parcelada (até 32 parcelas) liquidada pela pool de liquidez, via o programa **kora_credit** on-chain.",
        ],
      },
      {
        type: "callout",
        title: "Crédito que sai da mesma pool",
        text: "O parcelamento não vem de um banco no meio: é a própria pool de liquidez da Kori que financia a compra e recebe de volta no pagamento da fatura. Mesma infraestrutura da antecipação de recebíveis.",
      },
      { type: "heading", text: "O que ainda é roadmap" },
      {
        type: "paragraph",
        text: "O **cartão físico real** depende de um emissor regulado (BaaS) e de BIN de bandeira — por isso fica para uma fase seguinte, via parceiro como a **Pomelo**. A receita aí vem do **interchange (~1% por gasto)**, não de tokenomics.",
      },
      {
        type: "quote",
        text: "Entregar o que é real e deixar o resto explícito no roadmap.",
        cite: "Kori",
      },
    ],
  },
  {
    slug: "score-on-chain",
    title: "Score on-chain: seu histórico vira taxa melhor",
    excerpt:
      "Cada operação registrada na blockchain constrói um histórico auditável — e quem opera bem destrava crédito mais barato. O Reputation Token é o próximo passo.",
    category: "Crédito",
    date: "2026-06-01",
    readingTime: "4 min de leitura",
    author: "Kori Labs",
    accent: "green",
    body: [
      {
        type: "paragraph",
        text: "No crédito tradicional o risco é opaco: todo mundo paga caro porque o bom pagador acaba subsidiando o risco de quem ninguém consegue avaliar. A Kori inverte isso com histórico transparente.",
      },
      { type: "heading", text: "Histórico que ninguém maquia" },
      {
        type: "paragraph",
        text: "Cada antecipação, pagamento e liquidação fica registrada **on-chain**. Isso constrói um retrato auditável do seu negócio — verificável por qualquer parte, sem depender da palavra de uma instituição.",
      },
      {
        type: "stat",
        value: "3% a.m.",
        label: "taxa de antecipação para bom histórico, contra ~8% a.m. do mercado",
      },
      {
        type: "paragraph",
        text: "Quanto melhor o histórico, menor o deságio: o vendedor que mantém as vendas em dia destrava **3% a.m. em vez de 8%**. O bom pagador para de pagar pelo risco dos outros.",
      },
      {
        type: "callout",
        title: "Reputation Token (roadmap)",
        text: "O próximo passo é transformar esse histórico num score on-chain mintado na carteira do usuário — um Reputation Token portável. Está no roadmap, ainda não no app.",
      },
      {
        type: "paragraph",
        text: "A ideia é que reputação financeira deixe de ser refém de um birô fechado e passe a ser um ativo do próprio usuário, que ele carrega entre operações.",
      },
    ],
  },
]

export function getAllPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug)
}

export function getFeaturedPosts(limit = 3): BlogPost[] {
  const featured = getAllPosts().filter((post) => post.featured)
  return (featured.length ? featured : getAllPosts()).slice(0, limit)
}
