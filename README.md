<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/kori-onchain/kori">
    <img src="https://kori.kc1t.com/icon.svg" alt="Kori" width="96" height="96" />
  </a>

  <br />
  <br />

  <p align="center">
    Ecossistema financeiro on-chain para pagamentos, crédito, yield local e benefícios tokenizados na Solana.
    <br />
    <a href="app/DESIGN.MD" target="_blank">Ver Design System</a>
    |
    <a href="https://github.com/kori-onchain/kori/issues" target="_blank">Reportar Erro</a>
    |
    <a href="https://github.com/kori-onchain/kori/issues" target="_blank">Solicitar Features</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Sumário</summary>
  <ol>
    <li>
      <a href="#sobre-o-projeto">Sobre o Projeto</a>
      <ul>
        <li><a href="#problema">Problema</a></li>
        <li><a href="#onde-a-solana-entra">Onde a Solana entra</a></li>
        <li><a href="#arquitetura">Arquitetura</a></li>
        <li><a href="#funcionalidades">Funcionalidades</a></li>
        <li><a href="#feito-com">Tecnologias Utilizadas</a></li>
      </ul>
    </li>
    <li>
      <a href="#comecando">Começando</a>
      <ul>
        <li><a href="#pre-requisitos">Pré-requisitos</a></li>
        <li><a href="#instalacao">Instalação</a></li>
        <li><a href="#variaveis-de-ambiente">Variáveis de Ambiente</a></li>
      </ul>
    </li>
    <li><a href="#contratos-on-chain">Contratos On-Chain</a></li>
    <li><a href="#fluxo-on-chain">Fluxo On-Chain</a></li>
    <li><a href="#tutorial-do-sistema">Tutorial do Sistema</a></li>
    <li><a href="#diferencial">Diferencial</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#licenca">Licença</a></li>
    <li><a href="#contato">Contato</a></li>
  </ol>
</details>

## Sobre o Projeto

<div id="sobre-o-projeto"></div>

Kori é um ecossistema financeiro on-chain feito para o usuário brasileiro: a experiência é simples como os melhores apps financeiros, mas a infraestrutura de saldo, pagamentos, crédito, recebíveis e ativos tokenizados vive sobre Solana.

A Kori não se posiciona como banco. Ela combina conta, identidade, pagamentos, cartão, crédito, antecipação de recebíveis, yield local, ativos tokenizados e benefícios em uma única camada financeira verificável, com UX familiar e sem expor complexidade cripto para quem não quer lidar com wallet, seed phrase ou endereço.

O projeto nasceu para o Hackanation 2026 com uma tese simples: cripto não precisa aparecer como complexidade para o usuário final. A Kori abstrai carteira, seed phrase, endereço e transação através de **carteiras embutidas (embedded wallets) da Privy**, enquanto usa Solana para liquidação rápida, baixo custo, rastreabilidade e composabilidade financeira.

### Problema

<div id="problema"></div>

Pequenos negócios precisam de capital de giro e geralmente antecipam recebíveis com taxas altas, pouca transparência e intermediação pesada. Do outro lado, usuários pessoa física têm poucas formas simples de acessar yield ligado à economia real local sem cair em produtos opacos, burocráticos ou distantes.

A Kori conecta esses dois lados: lojistas tokenizam e antecipam recebíveis, e usuários financiam essas oportunidades com liquidação em USDC, dentro de uma conta digital que também resolve pagamentos, cartão, crédito e benefícios.

### Onde a Solana entra

<div id="onde-a-solana-entra"></div>

Solana é usada como camada de liquidação e registro para:

- Pagamentos instantâneos entre usuários via carteira ou `@username`.
- Saldo e liquidação em USDC.
- Tokenização de recebíveis de lojistas como cNFTs (Bubblegum / state compression).
- Pool de liquidez em USDC com tokens de share (kUSDC) para os investidores.
- Crédito on-chain: perfis de crédito, limites e compras parceladas liquidadas pelo pool.
- Antecipação de recebíveis paga pelo pool e liquidada na data de vencimento.

O objetivo de UX é manter a tecnologia invisível quando ela atrapalha, e verificável quando ela gera confiança.

### Arquitetura

<div id="arquitetura"></div>

O repositório é um monorepo com quatro partes:

| Pasta        | O que é                        | Stack principal                                              |
| ------------ | ------------------------------ | ----------------------------------------------------------- |
| `web/`       | Landing page + dashboard demo  | Next.js 16, React 19, Tailwind CSS v4, shadcn/ui, Radix UI  |
| `app/`       | Aplicativo mobile              | Expo / React Native, NativeWind, Privy, Reanimated          |
| `api/`       | Backend e orquestração on-chain | NestJS 11, Prisma 7 (Postgres), Redis, Zod, Solana web3.js  |
| `programs/`  | Contratos Solana               | Anchor 0.30 / Rust, mpl-bubblegum (cNFTs)                    |

Fluxo geral: o **app mobile** autentica o usuário via **Privy** (carteira embutida) e fala com a **API NestJS**. A API mantém o estado off-chain (usuários, cartões, faturas, ledger de dupla entrada, recebíveis) no Postgres e orquestra as operações on-chain montando transações não assinadas (*intents*), que são assinadas pelo usuário ou por um *relayer* e submetidas aos três programas Anchor em `programs/`.

<div id="funcionalidades"></div>

### Funcionalidades

**MVP atual**

Mobile (Expo):
- [x] App mobile navegável com home de conta digital.
- [x] Onboarding com experiência de app financeiro moderno.
- [x] Autenticação e carteira embutida via **Privy** (login social/email, sem seed phrase exposta).
- [x] Contas Pessoa Física (PF) e Lojista (PJ), com troca de conta.
- [x] Tela de segurança com PIN, biometria digital e Face ID.
- [x] Tema claro e escuro com alternância em tempo real.
- [x] Envio e recebimento por `@username`, endereço de carteira, link e QR Code.
- [x] Leitura de QR Code de pagamento Kori.
- [x] Área de cartões com cartão Kori, cartão virtual, fatura e bloqueio temporário.
- [x] Histórico de transações e contatos recentes.
- [x] Abas de investimentos, NFTs e benefícios/experiências.
- [x] Fluxo do lojista (Kori Business) com painel de recebíveis e antecipação.

Backend (NestJS):
- [x] Sincronização de usuários e perfis PF/PJ via Privy (`/auth/sync`, `/auth/accounts`).
- [x] Ledger de dupla entrada (contas, lançamentos, saldos).
- [x] Cartões, faturas, parcelas e perfis de crédito.
- [x] Pagamentos internos e transferências Solana (intent + submit).
- [x] Lojas, produtos, vendas, recebíveis e antecipação de recebíveis.
- [x] Orquestração on-chain por *intents* + *relayer* Solana.

On-chain (Anchor):
- [x] `kora_pool` — pool de liquidez em USDC, shares kUSDC, antecipação e liquidação.
- [x] `kora_business` — registro de lojista, mint de recebíveis como cNFT, antecipação e settlement.
- [x] `kora_credit` — perfis de crédito, limites e compras parceladas liquidadas pelo pool.

**Roadmap funcional**
- [x] Deploy dos três programas em Solana Devnet.
- [ ] Deploy em Mainnet com mints reais de USDC.
- [ ] Marketplace Kori Yield para usuários financiarem recebíveis locais.
- [ ] Reputation Token (score on-chain) mintado na carteira do usuário.
- [ ] Integração com Solana Pay.
- [ ] On/off-ramp BRL <-> USDC.
- [ ] Validação de NF-e ou documentos de venda.
- [ ] Ingressos NFT com QR Code dinâmico antifraude.

<div id="feito-com"></div>

### Feito com

**Mobile (`app/`):**
- Expo / React Native
- TypeScript
- NativeWind (Tailwind CSS para React Native)
- React Native Reanimated
- Privy (`@privy-io/expo`) — autenticação e carteira embutida
- Solana Web3.js
- Expo Local Authentication (biometria) / Expo Camera / Expo Secure Store
- React Native SVG + QR Code

**Frontend web (`web/`):**
- Next.js 16 (App Router, Turbopack)
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui + Radix UI
- Lucide React

**Backend (`api/`):**
- NestJS 11
- Prisma 7 + PostgreSQL
- Redis (ioredis)
- Zod / nestjs-zod
- Solana Web3.js + SPL Token
- `@coral-xyz/anchor`
- Autenticação via Privy (verificação de token no guard)

**On-chain (`programs/`):**
- Rust + Anchor 0.30
- `mpl-bubblegum` (cNFTs / state compression) para recebíveis
- SPL Token / USDC

<p align="right">(<a href="#readme-top">Voltar ao Topo</a>)</p>

## Começando

<div id="comecando"></div>

### Pré-requisitos

<div id="pre-requisitos"></div>

- Node.js 20+
- npm (ou bun)
- Docker + Docker Compose (Postgres + Redis para a API)
- Expo CLI via `npx expo` (mobile)
- Rust + Solana CLI + Anchor 0.30 (apenas para os contratos)

```sh
npm install npm@latest -g
```

### Instalação

<div id="instalacao"></div>

Clone o repositório:

```bash
git clone https://github.com/kori-onchain/kori.git
cd kori
```

#### Backend (`api/`)

```bash
cd api
npm install
cp .env.example .env          # ajuste as variáveis
docker compose up -d          # sobe Postgres + Redis
npx prisma migrate dev        # cria o schema
npm run seed:demo             # (opcional) dados de demonstração
npm run start:dev
```

A API sobe em `http://localhost:3333`.

Comandos úteis:

```bash
npm run lint
npm run typecheck
npm run onchain:env:check     # valida as variáveis on-chain
npm run relayer:create        # gera um keypair de relayer Solana
npm run onchain:setup         # inicializa pool/business/credit on-chain
```

#### Frontend web (`web/`)

```bash
cd web
npm install
npm run dev
```

O frontend roda em `http://localhost:3004`.

```bash
npm run lint
npm run typecheck
npm run build
```

#### App mobile (`app/`)

```bash
cd app
npm install
npm start
```

Configure o `apiUrl` (e os IDs da Privy) em `app/app.json` apontando para o IP da máquina onde a API roda (ex.: `http://192.168.x.x:3333`). Para abrir direto em uma plataforma:

```bash
npm run android
npm run ios
npm run web
```

#### Contratos (`programs/`)

```bash
cd programs
anchor build
anchor test
```

### Variáveis de Ambiente

<div id="variaveis-de-ambiente"></div>

A API usa variáveis de ambiente (veja `api/.env.example`):

```env
# api/
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/kora?schema=public"

PRIVY_APP_ID=""

SOLANA_CLUSTER=localnet
SOLANA_LOCALNET_RPC_URL=http://127.0.0.1:8899
SOLANA_DEVNET_RPC_URL=https://api.devnet.solana.com
SOLANA_RELAYER_SECRET_KEY=

KORA_POOL_PROGRAM_ID=...
KORA_BUSINESS_PROGRAM_ID=...
KORA_CREDIT_PROGRAM_ID=...

USDC_MINT=
KUSDC_MINT=
```

O app mobile lê o ID da Privy e a URL da API a partir de `app/app.json` (`extra.privyAppId`, `extra.apiUrl`).

<p align="right">(<a href="#readme-top">Voltar ao Topo</a>)</p>

## Contratos On-Chain

<div id="contratos-on-chain"></div>

### Programas publicados (Devnet)

Os três programas Anchor estão publicados na **Solana Devnet**:

| Programa        | Pasta                 | Program ID (Devnet)                            | Explorer                                                                                                |
| --------------- | --------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `kora_pool`     | `programs/kora_pool`     | `8Y4VvUgJddUw5BSvv152EhPRueF6kKXp5eBzmo6cBXTG`  | [ver](https://explorer.solana.com/address/8Y4VvUgJddUw5BSvv152EhPRueF6kKXp5eBzmo6cBXTG?cluster=devnet)  |
| `kora_business` | `programs/kora_business` | `8mTdaiDoGCZEfZs1fkvND7NYqv39qZV9HX12j8seeCz2`  | [ver](https://explorer.solana.com/address/8mTdaiDoGCZEfZs1fkvND7NYqv39qZV9HX12j8seeCz2?cluster=devnet)  |
| `kora_credit`   | `programs/kora_credit`   | `HvnPdZpLDcpwYMxppuF43UXMNZNpmerKvrn1AMRNA5wT`  | [ver](https://explorer.solana.com/address/HvnPdZpLDcpwYMxppuF43UXMNZNpmerKvrn1AMRNA5wT?cluster=devnet)  |

> **Nota sobre o nome.** Os programas foram publicados sob o nome original do projeto, **"Kora"**. A renomeação para **"Kori"** aconteceu por conflito de identidade com uma ferramenta da Solana Foundation. A migração dos identificadores on-chain (program IDs) está prevista para uma próxima versão.

Para configurar a API contra a Devnet, use esses program IDs nas variáveis `KORA_POOL_PROGRAM_ID`, `KORA_BUSINESS_PROGRAM_ID` e `KORA_CREDIT_PROGRAM_ID` (veja [Variáveis de Ambiente](#variaveis-de-ambiente)) e defina `SOLANA_CLUSTER=devnet`.

### Programas

Três programas Anchor compõem a camada on-chain (os program IDs de localnet ficam em `programs/Anchor.toml`):

### `kora_pool`
Pool de liquidez compartilhada em USDC.
- `initialize_pool`, `initialize_liquidity_vault`, `initialize_share_mint`
- `deposit_liquidity` / `redeem_liquidity` — investidores entram/saem recebendo shares **kUSDC**
- `withdraw_for_anticipation` — libera USDC para antecipar um recebível
- `receive_settlement` — recebe a liquidação do recebível na data de vencimento
- `set_authorized_caller` — autoriza os programas `kora_business` e `kora_credit` a movimentar o pool

### `kora_business`
Recebíveis de lojistas como cNFTs (via `mpl-bubblegum`).
- `initialize_business`, `register_merchant`
- `mint_receivable_cnft` — tokeniza um recebível de venda
- `anticipate_cnft` — antecipa o recebível usando liquidez do pool
- `mark_settled` — marca o recebível como liquidado

### `kora_credit`
Crédito e parcelamento liquidados pelo pool.
- `initialize_credit`
- `create_profile` / `set_credit_limit` — perfil e limite de crédito do usuário
- `purchase` — compra parcelada (até 32 parcelas)
- `pay_invoice` — pagamento de fatura/parcela

<p align="right">(<a href="#readme-top">Voltar ao Topo</a>)</p>

## Fluxo On-Chain

<div id="fluxo-on-chain"></div>

A API não custodia chaves do usuário. Operações on-chain seguem o padrão de **intent**:

1. O cliente pede uma operação (ex.: `POST /onchain/intents/receivable-advance`).
2. A API monta a **transação não assinada** e persiste um `OnchainIntent` com status `PENDING_SIGNATURE`.
3. A transação é assinada — pela carteira embutida da Privy (usuário) ou pelo **relayer** da plataforma, conforme o caso.
4. O cliente chama `POST /onchain/submit`, a API envia para a Solana e atualiza o status (`SUBMITTED` → `CONFIRMED` / `FAILED`).
5. O estado off-chain (ledger, recebíveis, faturas) é reconciliado com o `txHash` confirmado.

`GET /onchain/programs/status` retorna o estado de configuração dos programas on-chain.

<p align="right">(<a href="#readme-top">Voltar ao Topo</a>)</p>

## Tutorial do Sistema

<div id="tutorial-do-sistema"></div>

### Fluxo principal do usuário

1. O usuário passa pelo onboarding e cria sua conta Kori (login via Privy, carteira gerada nos bastidores).
2. A experiência apresenta uma conta digital com saldo, identidade, carteira e ações de envio/recebimento.
3. O usuário pode pagar por QR Code, digitar um `@username` ou informar um endereço de carteira Solana.
4. A Kori mostra revisão, processamento e comprovante com identificador de transação.
5. Na mesma experiência, o usuário acessa cartão, crédito, investimentos, NFTs e benefícios.

### Fluxo do lojista (Kori Business)

1. O lojista acessa o Kori Business e tem suas vendas e recebíveis futuros listados.
2. O lojista seleciona recebíveis para antecipar.
3. A Kori tokeniza o recebível como cNFT (`kora_business`) e libera o adiantamento usando liquidez do pool (`kora_pool`).
4. Na data de vencimento, o recebível é liquidado e o valor retorna ao pool, distribuindo rendimento aos investidores.

<p align="right">(<a href="#readme-top">Voltar ao Topo</a>)</p>

## Diferencial

<div id="diferencial"></div>

**Diferencial técnico:** a Kori transforma pagamentos, crédito, recebíveis e yield em ativos verificáveis na Solana, sem obrigar o usuário comum a operar como usuário cripto — a carteira é embutida e a assinatura é abstraída.

**Diferencial econômico:** lojistas acessam antecipação de recebíveis com distribuição direta para investidores via pool de liquidez, enquanto usuários ganham acesso a yield lastreado em economia real local.

**Diferencial de UX:** a interface se comporta como um ecossistema financeiro familiar: `@username`, QR Code, cartão, saldo, crédito, yield e benefícios. A carteira e a blockchain aparecem apenas quando agregam confiança, verificabilidade ou interoperabilidade.

> A Kori tokeniza recebíveis e crédito na escala que só Solana viabiliza, dando capital mais eficiente para lojistas e yield local acessível para usuários.

<p align="right">(<a href="#readme-top">Voltar ao Topo</a>)</p>

## Roadmap

<div id="roadmap"></div>

**Fase 1 - MVP Hackanation** ✅
- App mobile navegável com Privy.
- Landing page e dashboard demo.
- Backend NestJS com ledger, cartões, crédito, pagamentos e recebíveis.
- Três programas Anchor (pool, business, credit) com testes em localnet e publicados em Devnet.

**Fase 2 - 3 a 6 meses**
- Deploy em Mainnet com USDC real.
- Solana Pay.
- Portal de lojistas em produção.
- Validação documental de vendas.

**Fase 3 - 6 a 12 meses**
- Reputation Token on-chain.
- Marketplace de yield com risco e filtros.
- Ingressos NFT com antifraude.
- Integrações de on/off-ramp.
- Pilotos com comércios locais.

**Visão 24 meses**
- Um ecossistema financeiro brasileiro com pagamentos, cartão, crédito, investimentos locais e benefícios tokenizados, liquidado em Solana e simples o suficiente para usuários que nunca abriram uma wallet.

<p align="right">(<a href="#readme-top">Voltar ao Topo</a>)</p>

## Licença

<div id="licenca"></div>

Distribuído sob a licença MIT. Veja `LICENSE.txt` para mais detalhes quando o arquivo de licença for adicionado ao repositório.

<p align="right">(<a href="#readme-top">Voltar ao Topo</a>)</p>

## Contato

<div id="contato"></div>

Time Kori - https://github.com/kori-onchain

Repositório: [https://github.com/kori-onchain/kori](https://github.com/kori-onchain/kori)

<p align="right">(<a href="#readme-top">Voltar ao Topo</a>)</p>
