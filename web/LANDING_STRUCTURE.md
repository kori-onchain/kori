# Estrutura da landing Kori

Base analisada: `web/app/page.tsx`, componentes em `web/components/landing` e estilos em `web/app/landing.css`.

## Visao geral

A landing e um app Next/React. A pagina principal renderiza tudo dentro de:

- `.landing`: tema visual escuro, tokens de cor e tipografia.
- `.page`: cria as hachuras laterais fixas.
- `.frame`: container central com largura maxima de `1280px`, bordas laterais e fundo preto.

Ordem real renderizada:

1. `SiteNav`
2. `Hero`
3. `TrustBar`
4. `ProblemSection`
5. `HowItWorks`
6. `LightSection`
7. `Capabilities`
8. `ParallaxFeatures`
9. `Architecture`
10. `Faq`
11. `Cta`
12. `SiteFooter`

## Assets e imagens

- `public/hero-phone.png`: imagem principal da hero, mostrando o app Kori em um celular.
- `public/preview-home.png`: imagem grande usada na secao clara de produto.
- Varios elementos visuais sao feitos via CSS/SVG inline: logo Kori, icones, marca Solana, cards, mockups de celular, mapa e diagrama de arquitetura.

## Animacoes e movimento global

- A hero usa `.reveal` com `fadeUp`: elementos entram com opacidade e `translateY(16px)` para `translateY(0)`.
- A bolinha de status `.dot` usa `pulse` infinito, alternando opacidade.
- Botoes e cards tem hover com `translateY(-1px)`, mudanca de fundo, borda e sombra.
- O FAQ abre/fecha com transicao em `grid-template-rows`, opacidade e leve deslocamento vertical.
- O unico parallax real da pagina esta em `ParallaxFeatures`, feito com `position: sticky`, `IntersectionObserver`, evento de scroll e `requestAnimationFrame`.

## Secoes

### 1. Navegacao (`SiteNav`)

Conteudo:

- Logo Kori com simbolo SVG.
- Links: `App`, `Yield`, `Score`, `Cartao`, `Docs`.
- Pill de status: `DEVNET · Hackanation 2026`.
- Icones sociais: GitHub e YouTube.

Visual/movimento:

- Navbar sticky no topo.
- Fundo semi-transparente com blur.
- Links e icones tem hover suave.
- A bolinha verde do status pulsa continuamente.

Imagem:

- Nao usa imagem bitmap; usa SVG inline para logo e icones.

Parallax:

- Nao.

### 2. Hero (`Hero`)

Conteudo:

- Label interna: `S:00`.
- Eyebrow: `v1` + `Demo Hackanation 2026 · Devnet`.
- H1:
  - `Renda fixa do bairro.`
  - `Caixa pro comercio local.`
- Subtitulo: `Financie recebiveis locais a partir de R$50. Prazo definido, rendimento claro, settlement em USDC.`
- CTAs:
  - `Baixar app Android`
  - `Ver demo`
- Imagem: mockup do app em `/hero-phone.png`.

Como esta a hero:

- Hero centralizada, escura, alta, ocupando quase a primeira dobra.
- O texto vem em coluna: eyebrow, titulo, subtitulo, botoes e celular.
- Tem um glow radial laranja atras do celular/texto via `hero::before`.
- O celular fica abaixo dos CTAs, com drop-shadow forte, parecendo sair da dobra inferior.
- A hero nao usa um componente de telefone em CSS; usa uma imagem pronta (`next/image`).

Visual/movimento:

- Eyebrow, H1, subtitulo, CTAs e celular usam animacao de entrada `fadeUp`.
- Os delays sao escalonados: `d1`, `d2`, `d3`, `d4`.
- Existe keyframe `float`, mas ele nao esta aplicado na imagem atual da hero.

Imagem:

- Sim: `/hero-phone.png`.

Parallax:

- Nao.

### 3. Trust bar (`TrustBar`)

Conteudo:

- `Built on`: Solana, meta `Devnet`.
- `Demo`: Hackanation 2026, meta `v1 publica`.
- `Status`: v1 on Devnet, meta `roadmap honesto`.

Visual/movimento:

- Barra horizontal com tres colunas.
- Tem bordas e leve radial highlight.
- A marca Solana vem de SVG symbol.

Imagem:

- Nao usa bitmap.

Parallax:

- Nao.

### 4. Problema (`ProblemSection`)

Conteudo:

- Tag: `O problema`.
- Titulo: `Dois lados, o mesmo intermediario caro.`
- Card 1, `A padaria`: vendeu a prazo, recebe depois, precisa de caixa agora, antecipar no banco custa caro.
- Card 2, `Voce`: tem dinheiro parado, quer rendimento melhor, mas produtos bons nao foram feitos para ticket pequeno.

Visual/movimento:

- Secao escura padrao.
- Dois cards lado a lado no desktop, empilhados no mobile.
- Cards com gradiente sutil e borda.

Imagem:

- Nao.

Parallax:

- Nao.

### 5. Como funciona (`HowItWorks`)

Conteudo:

- Tag: `Como funciona`.
- Titulo: `Do recebivel ao rendimento, em 3 passos.`
- Passos:
  - `01 Comercio antecipa`: uma fatura entra na vitrine com desconto.
  - `02 Voce financia`: escolhe risco, prazo e retorno antes de entrar.
  - `03 Todos recebem`: contrato distribui principal e rendimento no pagamento final.

Visual/movimento:

- Grid de cards `.features`.
- Hover muda o fundo dos cards.

Imagem:

- Nao.

Parallax:

- Nao.

### 6. Secao clara de produto (`LightSection`)

Conteudo:

- Label: `S:04 / ONCHAIN BRL`.
- Eyebrow: `Devnet` + `Yield local, settled on Solana`.
- Titulo:
  - `Capital local.`
  - `Settlement onchain.`
- Subtitulo: conta self-custody, marketplace de recebiveis e transferencias P2P em USDC na Solana Devnet.
- CTAs:
  - `Baixar pra Android ->`
  - `Como funciona`
- Imagem grande do app.

Visual/movimento:

- Quebra o ritmo escuro com fundo claro.
- Usa imagem grande centralizada em `.product-hero`.
- Tem glow radial atras da imagem.
- Botoes escuros/claros com hover.

Imagem:

- Sim: `/preview-home.png`.

Parallax:

- Nao.

### 7. Capacidades / roadmap (`Capabilities`)

Conteudo:

- Label: `S:05 / ROADMAP`.
- Tag: `Visao`.
- Titulo: `Hoje: yield onchain funcionando. Amanha: o banco inteiro na sua chave.`
- Intro: primeiro recebiveis locais; depois cartao, BNPL e beneficios na mesma conta self-custody.
- Cards:
  - `Conta self-custody`
  - `Yield de recebiveis`
  - `P2P em USDC`
  - `Score onchain`
  - `Cartao Kori`
  - `BNPL, ingressos e lounges`

Visual/movimento:

- Grid 3x2 no desktop.
- Cada card tem numero, icone SVG e texto.
- Hover altera o fundo.

Imagem:

- Nao usa bitmap; icones sao SVG inline.

Parallax:

- Nao.

### 8. Features com parallax (`ParallaxFeatures`)

Conteudo:

- Label: `S:06 / SCORE`.
- Layout dividido em duas colunas:
  - Esquerda: celular mockado fixo/sticky.
  - Direita: tres blocos de texto, cada um ocupando uma altura de viewport.
- Blocos:
  - `SCORE 01`: historico vira reputacao publica, portatil e sua.
  - `APP 02`: conta self-custody sem seed phrase no onboarding.
  - `YIELD 03`: empreste para comercio do bairro com APR fixo e prazo definido.

Como funciona o parallax:

- A coluna do celular usa `position: sticky; top: 0; height: 100vh`.
- Cada bloco `.parallax-step` tem `min-height: 100vh`.
- Conforme o usuario rola, o texto passa pela direita enquanto o celular fica preso na esquerda.
- Um `IntersectionObserver` troca a tela ativa do celular quando cada bloco passa de 50% de visibilidade.
- Um listener de scroll calcula progresso da secao e aplica no telefone:
  - `translateY` de ate aproximadamente `-12px`.
  - `rotateY` entre cerca de `-3deg` e `3deg`.

Telas do telefone:

- Ativo no passo 1: `ScreenHome`, com saldo, cartao, Solana, carteira, gas e movimentos.
- Ativo no passo 2: `ScreenScore`, com Reputation Token, gauge 847/1000 e motivos de aumento.
- Ativo no passo 3: `ScreenYield`, com vitrine de oportunidades como Padaria Central, Mercado Verde e Bistro Lisboa.

Imagem:

- Nao usa bitmap; o celular e as telas sao mockups em HTML/CSS/SVG.

Parallax:

- Sim, e e o principal efeito de scroll da landing.

### 9. Arquitetura (`Architecture`)

Conteudo:

- Label: `S:06 / ARCHITECTURE`.
- Tag: `Architecture`.
- Titulo: `Como uma transacao flui. Do tap ao settlement em Devnet.`
- Lista de fluxo:
  - `01 Intent`
  - `02 Risk check`
  - `03 Transaction`
  - `04 Settlement`
  - `05 Reputation`
- Diagrama `Runtime map` com nodes:
  - `KORI App`
  - `Score Engine`
  - `Solana Program`
  - `USDC Settlement`
  - `Reputation Token`
- Payloads: `amount, receiver, nonce` e `USDC + reputation update`.

Visual/movimento:

- Layout em lista + canvas/diagrama.
- Cards da lista tem hover com leve subida.
- Linhas do diagrama sao CSS/SVG-like via spans e divs.

Imagem:

- Nao usa bitmap.

Parallax:

- Nao.

### 10. FAQ (`Faq`)

Conteudo:

- Label: `S:08 / FAQ`.
- Tag: `FAQ`.
- Titulo: `Sem enrolar. O que o jurado vai perguntar.`
- Perguntas:
  - O que a Kori financia?
  - Por que Solana importa aqui?
  - O que ja esta na demo?
  - Os comercios da vitrine sao reais?

Visual/movimento:

- Usa `<details>` e `<summary>`.
- Painel abre com transicao de altura, opacidade e deslocamento vertical.
- Sinal muda de `+` para `-`.

Imagem:

- Nao.

Parallax:

- Nao.

### 11. CTA final (`Cta`)

Conteudo:

- Titulo:
  - `Pare de pedir permissao`
  - `pro seu proprio dinheiro.`
- Texto: conta self-custody em 30 segundos, chave e controle do usuario, demo em Solana Devnet.
- CTAs:
  - `Baixar pra Android`
  - `Ver demo`

Visual/movimento:

- Secao centralizada, grande e escura.
- Glow radial claro atras do conteudo.
- Botoes com hover.

Imagem:

- Nao.

Parallax:

- Nao.

### 12. Footer (`SiteFooter`)

Conteudo:

- Logo KORI.
- Descricao: `Yield local e conta self-custody para o Brasil. Settled on Solana Devnet. Demo Hackanation 2026.`
- Colunas:
  - Produto: App, Yield, Score, Cartao (roadmap)
  - Recursos: Documentacao
  - Hackanation: GitHub
- Rodape:
  - `© 2026 KORI LABS · MIT LICENSE`
  - `Powered by Solana`
  - `Devnet · Hackanation 2026`

Visual/movimento:

- Links com hover.
- Bolinha de status pulsa.

Imagem:

- Nao usa bitmap; usa SVG para logo/Solana.

Parallax:

- Nao.

## Componentes existentes mas nao renderizados na pagina atual

Estes arquivos existem em `components/landing`, mas nao aparecem na ordem de `app/page.tsx` atualmente:

- `YieldMap`: mapa interativo de oportunidades de yield, com pins pulsando, sidebar e selecao de comercios.
- `WhySolana`: secao clara explicando que ticket pequeno precisa de taxa pequena.
- `DualBlocks`: dois blocos de roadmap com mockups de telefone para Cartao Kori e Ingressos NFT.

Observacao: eles estao prontos no codigo, mas a landing atual nao importa nem renderiza esses componentes.

## Resumo rapido de animacao, imagem e parallax por secao

| Secao | Animacao/interacao | Imagem bitmap | Parallax |
| --- | --- | --- | --- |
| Nav | Sticky, hover, bolinha pulsando | Nao | Nao |
| Hero | Entrada `fadeUp`, hover nos botoes | Sim, `hero-phone.png` | Nao |
| TrustBar | Bolinha/visual estatico, SVG Solana | Nao | Nao |
| Problema | Cards responsivos | Nao | Nao |
| Como funciona | Hover nos cards | Nao | Nao |
| LightSection | Hover nos botoes | Sim, `preview-home.png` | Nao |
| Capabilities | Hover nos cards, icones SVG | Nao | Nao |
| ParallaxFeatures | Sticky phone, scroll transform, troca de tela | Nao | Sim |
| Architecture | Hover nos itens, diagrama CSS | Nao | Nao |
| FAQ | Abertura animada do accordion | Nao | Nao |
| CTA | Hover nos botoes, glow radial | Nao | Nao |
| Footer | Hover nos links, bolinha pulsando | Nao | Nao |
