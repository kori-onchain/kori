<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/kora-onchain/kora">
    <img src="text-logo.svg" alt="Kora" width="280" height="80">
  </a>

  <h3 align="center">Kora</h3>

  <p align="center">
    Conta digital on-chain para pagamentos, credito, yield local e beneficios tokenizados na Solana.
    <br />
    <a href="DESIGN.MD" target="_blank">Ver Design System</a>
    |
    <a href="https://github.com/kora-onchain/kora/issues" target="_blank">Reportar Erro</a>
    |
    <a href="https://github.com/kora-onchain/kora/issues" target="_blank">Solicitar Features</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Sumario</summary>
  <ol>
    <li>
      <a href="#sobre-o-projeto">Sobre o Projeto</a>
      <ul>
        <li><a href="#problema">Problema</a></li>
        <li><a href="#onde-a-solana-entra">Onde a Solana entra</a></li>
        <li><a href="#funcionalidades">Funcionalidades</a></li>
        <li><a href="#feito-com">Tecnologias Utilizadas</a></li>
      </ul>
    </li>
    <li>
      <a href="#comecando">Comecando</a>
      <ul>
        <li><a href="#pre-requisitos">Pre-requisitos</a></li>
        <li><a href="#instalacao">Instalacao</a></li>
      </ul>
    </li>
    <li><a href="#tutorial-do-sistema">Tutorial do Sistema</a></li>
    <li><a href="#diferencial">Diferencial</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#a-fazer">A Fazer</a></li>
    <li><a href="#licenca">Licenca</a></li>
    <li><a href="#contato">Contato</a></li>
  </ol>
</details>

## Sobre o Projeto

<div id="sobre-o-projeto"></div>

Kora e uma proposta de banking on-chain feita para o usuario brasileiro: a experiencia parece a de um banco digital comum, mas a infraestrutura de saldo, pagamentos, reputacao, recebiveis e ativos tokenizados vive sobre Solana.

O projeto nasceu para o Hackanation 2026 com uma tese simples: cripto nao precisa aparecer como complexidade para o usuario final. A Kora abstrai carteira, seed phrase, endereco e transacao, enquanto usa Solana para liquidacao rapida, baixo custo, rastreabilidade e composabilidade financeira.

### Problema

<div id="problema"></div>

Pequenos negocios precisam de capital de giro e geralmente antecipam recebiveis com taxas altas, pouca transparencia e intermediacao pesada. Do outro lado, usuarios pessoa fisica tem poucas formas simples de acessar yield ligado a economia real local sem cair em produtos opacos, burocraticos ou distantes.

A Kora conecta esses dois lados: lojistas antecipam recebiveis tokenizados e usuarios investem em oportunidades locais com liquidacao em USDC, dentro de uma conta digital que tambem resolve pagamentos, cartao, score e beneficios.

### Onde a Solana entra

<div id="onde-a-solana-entra"></div>

Solana e usada como camada de liquidacao e registro para:

- Pagamentos instantaneos entre usuarios via carteira ou `@username`.
- Saldo e liquidacao em USDC.
- Tokenizacao de recebiveis de lojistas para antecipacao.
- Distribuicao de yield para investidores.
- Reputation Token, um score on-chain baseado em historico de pagamentos, stake e ativos elegiveis.
- Ingressos e beneficios em NFT com QR Code dinamico antifraude.

O objetivo de UX e manter a tecnologia invisivel quando ela atrapalha, e verificavel quando ela gera confianca.

### Hospedagem

O projeto ainda esta em fase de MVP/local. Links de producao devem ser adicionados quando o deploy estiver ativo.

Frontend web:
- Em desenvolvimento local: `http://localhost:3004`

Aplicativo mobile:
- Em desenvolvimento local via Expo: `npm start` dentro de `app/`

API:
- Pasta `api/` reservada para backend/indexer. Ainda nao ha servidor implementado neste repositorio.

<div id="funcionalidades"></div>

### Funcionalidades

**MVP atual**
- [x] Landing page web do produto Kora.
- [x] App mobile Expo com home de conta digital.
- [x] Onboarding com experiencia de banco digital.
- [x] Tela de seguranca com PIN/biometria como conceito de protecao.
- [x] Envio e recebimento por `@username`, endereco de carteira, link e QR Code.
- [x] Leitura de QR Code de pagamento Kora.
- [x] Comprovante com hash de transacao Solana simulado.
- [x] Area de cartoes com cartao Kora, cartao virtual e bloqueio temporario.
- [x] Historico de transacoes e contatos recentes.
- [x] Abas de investimentos, NFTs e beneficios/experiencias.

**Roadmap funcional**
- [ ] Smart contract para tokenizacao de recebiveis em Solana Devnet.
- [ ] Pool de liquidez em USDC.
- [ ] Liquidacao automatica de recebiveis on-chain.
- [ ] Portal Kora Business para lojistas anteciparem recebiveis.
- [ ] Marketplace Kora Yield para usuarios financiarem recebiveis locais.
- [ ] Reputation Token mintado na carteira do usuario.
- [ ] Integracao real com Solana Pay.
- [ ] On/off-ramp BRL <-> USDC.
- [ ] Validacao de NF-e ou documentos de venda.
- [ ] Ingressos NFT com QR Code dinamico.

<div id="feito-com"></div>

### Feito com

**Mobile:**
- Expo
- React Native
- TypeScript
- Expo Camera
- Expo Clipboard
- Expo Secure Store
- React Native SVG
- React Native QR Code SVG

**Frontend web:**
- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Radix UI
- Lucide React

**Backend / on-chain planejado:**
- Solana
- USDC
- SPL Tokens ou cNFTs para tokenizacao
- Backend/indexer em Node.js ou TypeScript
- Banco off-chain para dados de produto, perfis e documentos

**Banco de Dados:**

Ainda nao implementado. Para ambientes futuros, a aplicacao deve usar variaveis de ambiente em vez de credenciais fixas no codigo:

```env
DATABASE_URL=
SOLANA_RPC_URL=
USDC_MINT=
```

<p align="right">(<a href="#readme-top">Voltar ao Topo</a>)</p>

## Comecando

<div id="comecando"></div>

### Pre-requisitos

<div id="pre-requisitos"></div>

- Node.js 20+
- npm
- Expo CLI via `npx expo`

```sh
npm install npm@latest -g
```

### Instalacao

<div id="instalacao"></div>

Clone o repositorio:

```bash
git clone https://github.com/kora-onchain/kora.git
cd kora
```

#### Frontend web

```bash
cd web
npm install
npm run dev
```

O frontend roda em:

```text
http://localhost:3004
```

Comandos uteis:

```bash
npm run lint
npm run typecheck
npm run build
```

#### App mobile

```bash
cd app
npm install
npm start
```

Para abrir diretamente em uma plataforma:

```bash
npm run android
npm run ios
npm run web
```

#### Backend

```bash
cd api
```

A pasta `api/` existe como placeholder para o backend/indexer. No estado atual do repositorio, nao ha scripts de instalacao ou execucao nessa pasta.

<p align="right">(<a href="#readme-top">Voltar ao Topo</a>)</p>

## Tutorial do Sistema

### Fluxo principal do usuario

1. O usuario passa pelo onboarding e cria sua conta Kora.
2. A experiencia apresenta uma conta digital com saldo, identidade, carteira e acoes de envio/recebimento.
3. O usuario pode pagar por QR Code, digitar um `@username` ou informar um endereco de carteira Solana.
4. A Kora mostra revisao, processamento e comprovante com identificador de transacao.
5. Na mesma experiencia, o usuario acessa cartao, investimentos, NFTs e beneficios.

### Fluxo do lojista proposto

1. O lojista acessa o Kora Business.
2. O painel mostra vendas e recebiveis futuros.
3. O lojista seleciona recebiveis para antecipar.
4. A Kora tokeniza esses recebiveis e disponibiliza a oportunidade no Kora Yield.
5. Usuarios aportam USDC e recebem rendimento conforme a liquidacao.

<p align="right">(<a href="#readme-top">Voltar ao Topo</a>)</p>

## Diferencial

<div id="diferencial"></div>

**Diferencial tecnico:** a Kora transforma pagamentos, score, recebiveis, yield e ingressos em ativos verificaveis na Solana, sem obrigar o usuario comum a operar como usuario cripto.

**Diferencial economico:** lojistas acessam antecipacao de recebiveis com distribuicao direta para investidores, enquanto usuarios ganham acesso a yield lastreado em economia real local.

**Diferencial de UX:** a interface se comporta como banco digital: `@username`, QR Code, cartao, saldo e beneficios. A carteira e a blockchain aparecem apenas quando agregam confianca, verificabilidade ou interoperabilidade.

Frase consolidada:

> A Kora tokeniza recebiveis e reputacao financeira na escala que so Solana viabiliza, dando capital mais eficiente para lojistas e yield local acessivel para usuarios.

<p align="right">(<a href="#readme-top">Voltar ao Topo</a>)</p>

## Roadmap

<div id="roadmap"></div>

**Fase 1 - MVP Hackanation**
- App mobile navegavel.
- Landing page do produto.
- Fluxos simulados de pagamento, cartao, investimentos, NFTs e seguranca.
- Preparacao para primeira transacao real em Solana Devnet.

**Fase 2 - 3 a 6 meses**
- Contratos de recebiveis em Devnet/Mainnet.
- Solana Pay real.
- Pool de liquidez em USDC.
- Portal de lojistas.
- Validacao documental de vendas.

**Fase 3 - 6 a 12 meses**
- Reputation Token on-chain.
- Marketplace de yield com risco e filtros.
- Ingressos NFT com antifraude.
- Integracoes de on/off-ramp.
- Pilotos com comercios locais.

**Visao 24 meses**
- Uma conta digital brasileira com pagamentos, cartao, credito, investimentos locais e beneficios tokenizados, liquidada em Solana e simples o suficiente para usuarios que nunca abriram uma wallet.

<p align="right">(<a href="#readme-top">Voltar ao Topo</a>)</p>

## A Fazer

- [ ] Implementar backend/indexer.
- [ ] Definir contratos Solana do MVP.
- [ ] Conectar app ao RPC Solana.
- [ ] Trocar hash simulado por transacao real em Devnet.
- [ ] Persistir usuarios, contatos e transacoes.
- [ ] Criar portal Kora Business.
- [ ] Criar documentacao tecnica dos contratos.
- [ ] Adicionar capturas ou video da demo.

<p align="right">(<a href="#readme-top">Voltar ao Topo</a>)</p>

## Licenca

Distribuido sob a licenca MIT. Veja `LICENSE.txt` para mais detalhes quando o arquivo de licenca for adicionado ao repositorio.

<p align="right">(<a href="#readme-top">Voltar ao Topo</a>)</p>

## Contato

Time Kora - https://github.com/kora-onchain

Repositorio: [https://github.com/kora-onchain/kora](https://github.com/kora-onchain/kora)

<p align="right">(<a href="#readme-top">Voltar ao Topo</a>)</p>
