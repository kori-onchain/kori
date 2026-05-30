<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/kori-onchain/KORI">
  </a>

  <h3 align="center">KORI</h3>

  <p align="center">
    Ecossistema financeiro on-chain para pagamentos, crédito, yield local e benefícios tokenizados na Solana.
    <br />
    <a href="DESIGN.MD" target="_blank">Ver Design System</a>
    |
    <a href="https://github.com/kori-onchain/KORI/issues" target="_blank">Reportar Erro</a>
    |
    <a href="https://github.com/kori-onchain/KORI/issues" target="_blank">Solicitar Features</a>
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
        <li><a href="#funcionalidades">Funcionalidades</a></li>
        <li><a href="#feito-com">Tecnologias Utilizadas</a></li>
      </ul>
    </li>
    <li>
      <a href="#comecando">Começando</a>
      <ul>
        <li><a href="#pre-requisitos">Pré-requisitos</a></li>
        <li><a href="#instalacao">Instalação</a></li>
      </ul>
    </li>
    <li><a href="#tutorial-do-sistema">Tutorial do Sistema</a></li>
    <li><a href="#diferencial">Diferencial</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#a-fazer">A Fazer</a></li>
    <li><a href="#licenca">Licença</a></li>
    <li><a href="#contato">Contato</a></li>
  </ol>
</details>

## Sobre o Projeto

<div id="sobre-o-projeto"></div>

Kori é um ecossistema financeiro on-chain feito para o usuário brasileiro: a experiência é simples como os melhores apps financeiros, mas a infraestrutura de saldo, pagamentos, reputação, recebíveis e ativos tokenizados vive sobre Solana.

A Kori não se posiciona como banco. Ela combina conta, identidade, pagamentos, antecipação de recebíveis, yield local, ativos tokenizados e benefícios em uma única camada financeira verificável, com UX familiar e sem expor complexidade cripto para quem não quer lidar com wallet, seed phrase ou endereço.

O projeto nasceu para o Hackanation 2026 com uma tese simples: cripto não precisa aparecer como complexidade para o usuário final. A Kori abstrai carteira, seed phrase, endereço e transação, enquanto usa Solana para liquidação rápida, baixo custo, rastreabilidade e composabilidade financeira.

### Problema

<div id="problema"></div>

Pequenos negócios precisam de capital de giro e geralmente antecipam recebíveis com taxas altas, pouca transparência e intermediação pesada. Do outro lado, usuários pessoa física têm poucas formas simples de acessar yield ligado à economia real local sem cair em produtos opacos, burocráticos ou distantes.

A Kori conecta esses dois lados: lojistas antecipam recebíveis tokenizados e usuários investem em oportunidades locais com liquidação em USDC, dentro de uma conta digital que também resolve pagamentos, cartão, score e benefícios.

### Onde a Solana entra

<div id="onde-a-solana-entra"></div>

Solana é usada como camada de liquidação e registro para:

- Pagamentos instantâneos entre usuários via carteira ou `@username`.
- Saldo e liquidação em USDC.
- Tokenização de recebíveis de lojistas para antecipação.
- Distribuição de yield para investidores.
- Reputation Token, um score on-chain baseado em histórico de pagamentos, stake e ativos elegíveis.
- Ingressos e benefícios em NFT com QR Code dinâmico antifraude.

O objetivo de UX é manter a tecnologia invisível quando ela atrapalha, e verificável quando ela gera confiança.

### Hospedagem

O projeto ainda está em fase de MVP/local. Links de produção devem ser adicionados quando o deploy estiver ativo.

Frontend web:
- Em desenvolvimento local: `http://localhost:3004`

Aplicativo mobile:
- Em desenvolvimento local via Expo: `npm start` dentro de `app/`

Backend:
- Autenticação, perfis (PF/PJ) e sessão usam Supabase (Postgres + Auth). O app possui um toggle `MOCK_AUTH` em `app/src/constants/devConfig.ts` para rodar todo o fluxo localmente sem bater no Supabase.
- A camada on-chain (contratos, RPC Solana, liquidação real) ainda não está implementada. A pasta `api/` permanece reservada para o backend/indexer on-chain.

<div id="funcionalidades"></div>

### Funcionalidades

**MVP atual**
- [x] Landing page web do produto Kori.
- [x] App mobile Expo com home de conta digital.
- [x] Onboarding com experiência de app financeiro moderno.
- [x] Cadastro e login com contas Pessoa Física (PF) e Lojista (PJ) via Supabase, com modo mock para desenvolvimento.
- [x] Tela de segurança com configuração de PIN, biometria digital e reconhecimento facial.
- [x] Geração real de carteira Solana (keypair) protegida por biometria e armazenada no Secure Store do dispositivo.
- [x] Tema claro e escuro com alternância em tempo real.
- [x] Envio e recebimento por `@username`, endereço de carteira, link e QR Code.
- [x] Leitura de QR Code de pagamento Kori.
- [x] Comprovante com hash de transação Solana simulado.
- [x] Área de cartões com cartão Kori, cartão virtual e bloqueio temporário.
- [x] Histórico de transações e contatos recentes.
- [x] Abas de investimentos, NFTs e benefícios/experiências.
- [x] Fluxo do lojista (Kori Business) com painel de recebíveis e antecipação simulada: seleção de recebíveis, taxa, valor líquido, confirmação e comprovante com protocolo.

**Roadmap funcional**
- [ ] Smart contract para tokenização de recebíveis em Solana Devnet.
- [ ] Pool de liquidez em USDC.
- [ ] Liquidação automática de recebíveis on-chain.
- [ ] Portal Kori Business para lojistas anteciparem recebíveis.
- [ ] Marketplace Kori Yield para usuários financiarem recebíveis locais.
- [ ] Reputation Token mintado na carteira do usuário.
- [ ] Integração real com Solana Pay.
- [ ] On/off-ramp BRL <-> USDC.
- [ ] Validação de NF-e ou documentos de venda.
- [ ] Ingressos NFT com QR Code dinâmico.

<div id="feito-com"></div>

### Feito com

**Mobile:**
- Expo
- React Native
- TypeScript
- NativeWind (Tailwind CSS para React Native)
- React Native Reanimated
- React Native Safe Area Context
- Supabase JS (auth e perfis)
- Solana Web3.js (geração de carteira)
- Expo Local Authentication (biometria)
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

**Backend atual:**
- Supabase (Postgres + Auth) para cadastro, login e perfis PF/PJ

**Backend / on-chain planejado:**
- Solana
- USDC
- SPL Tokens ou cNFTs para tokenização
- Backend/indexer em Node.js ou TypeScript
- Base off-chain para dados de produto, perfis e documentos

**Dados:**

O app mobile já consome o Supabase para autenticação e perfis. A chave anônima é lida de variável de ambiente (`app/.env`):

```env
# app/ (Expo)
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

Para a camada on-chain e o backend/indexer futuros, use variáveis de ambiente em vez de credenciais fixas no código:

```env
DATABASE_URL=
SOLANA_RPC_URL=
USDC_MINT=
```

<p align="right">(<a href="#readme-top">Voltar ao Topo</a>)</p>

## Começando

<div id="comecando"></div>

### Pré-requisitos

<div id="pre-requisitos"></div>

- Node.js 20+
- npm
- Expo CLI via `npx expo`

```sh
npm install npm@latest -g
```

### Instalação

<div id="instalacao"></div>

Clone o repositório:

```bash
git clone https://github.com/kori-onchain/KORI.git
cd kori
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

Comandos úteis:

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

A pasta `api/` existe como placeholder para o backend/indexer. No estado atual do repositório, não há scripts de instalação ou execução nessa pasta.

<p align="right">(<a href="#readme-top">Voltar ao Topo</a>)</p>

## Tutorial do Sistema

### Fluxo principal do usuário

1. O usuário passa pelo onboarding e cria sua conta Kori.
2. A experiência apresenta uma conta digital com saldo, identidade, carteira e ações de envio/recebimento.
3. O usuário pode pagar por QR Code, digitar um `@username` ou informar um endereço de carteira Solana.
4. A Kori mostra revisão, processamento e comprovante com identificador de transação.
5. Na mesma experiência, o usuário acessa cartão, investimentos, NFTs e benefícios.

### Fluxo do lojista proposto

1. O lojista acessa o Kori Business.
2. O painel mostra vendas e recebíveis futuros.
3. O lojista seleciona recebíveis para antecipar.
4. A Kori tokeniza esses recebíveis e disponibiliza a oportunidade no Kori Yield.
5. Usuários aportam USDC e recebem rendimento conforme a liquidação.

<p align="right">(<a href="#readme-top">Voltar ao Topo</a>)</p>

## Diferencial

<div id="diferencial"></div>

**Diferencial técnico:** a Kori transforma pagamentos, score, recebíveis, yield e ingressos em ativos verificáveis na Solana, sem obrigar o usuário comum a operar como usuário cripto.

**Diferencial econômico:** lojistas acessam antecipação de recebíveis com distribuição direta para investidores, enquanto usuários ganham acesso a yield lastreado em economia real local.

**Diferencial de UX:** a interface se comporta como um ecossistema financeiro familiar: `@username`, QR Code, cartão, saldo, yield, recebíveis e benefícios. A carteira e a blockchain aparecem apenas quando agregam confiança, verificabilidade ou interoperabilidade.

Frase consolidada:

> A Kori tokeniza recebíveis e reputação financeira na escala que só Solana viabiliza, dando capital mais eficiente para lojistas e yield local acessível para usuários.

<p align="right">(<a href="#readme-top">Voltar ao Topo</a>)</p>

## Roadmap

<div id="roadmap"></div>

**Fase 1 - MVP Hackanation**
- App mobile navegável.
- Landing page do produto.
- Fluxos simulados de pagamento, cartão, investimentos, NFTs e segurança.
- Preparação para primeira transação real em Solana Devnet.

**Fase 2 - 3 a 6 meses**
- Contratos de recebíveis em Devnet/Mainnet.
- Solana Pay real.
- Pool de liquidez em USDC.
- Portal de lojistas.
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

## A Fazer

- [ ] Implementar backend/indexer.
- [ ] Definir contratos Solana do MVP.
- [ ] Conectar app ao RPC Solana.
- [ ] Trocar hash simulado por transação real em Devnet.
- [ ] Persistir contatos e transações no backend (usuários/perfis já usam Supabase).
- [ ] Levar o fluxo de antecipação de recebíveis (hoje simulado no app) para contratos on-chain.
- [ ] Criar documentação técnica dos contratos.
- [ ] Adicionar capturas ou vídeo da demo.

<p align="right">(<a href="#readme-top">Voltar ao Topo</a>)</p>

## Licença

Distribuído sob a licença MIT. Veja `LICENSE.txt` para mais detalhes quando o arquivo de licença for adicionado ao repositório.

<p align="right">(<a href="#readme-top">Voltar ao Topo</a>)</p>

## Contato

Time Kori - https://github.com/kori-onchain

Repositório: [https://github.com/kori-onchain/KORI](https://github.com/kori-onchain/KORI)

<p align="right">(<a href="#readme-top">Voltar ao Topo</a>)</p>
