# Kora Design System

> Premium fintech Solana-native que não parece cripto.
> Versão 1.0 · Mobile-first · Dark theme base + White theme

---

## Índice

1. [Filosofia](#1-filosofia)
2. [Temas e tokens de cor](#2-temas-e-tokens-de-cor)
3. [Elevação (o efeito glossy)](#3-elevação-o-efeito-glossy)
4. [Tipografia](#4-tipografia)
5. [Espaçamento](#5-espaçamento)
6. [Raios](#6-raios)
7. [Regras de uso de cor](#7-regras-de-uso-de-cor)
8. [Iconografia](#8-iconografia)
9. [Componentes](#9-componentes)
10. [Navegação](#10-navegação)
11. [Grid e frame](#11-grid-e-frame)
12. [Do's & Don'ts](#12-dos--donts)
13. [Implementação (tokens prontos)](#13-implementação-tokens-prontos)

---

## 1. Filosofia

Quatro princípios guiam todas as decisões:

**Minimalismo com preto e branco.** A base é monocromática. Tela preta, texto branco, hierarquia por peso e tamanho, não por cor. Cor é exceção, nunca decoração.

**Cor com significado.** Cada cor tem um trabalho. Se uma cor não está comunicando um estado ou identidade, ela sai. Sem "salada de cor".

**Solana pela forma.** O app é Solana-native, mas a marca é Kora. A Solana aparece monocromática (a forma das 3 barras), nunca pelo gradiente roxo-verde, pra não competir com a identidade.

**Densidade que respira.** Fintech tem muito dado. A gente mostra muita informação, mas com espaçamento e agrupamento que deixa respirar. Stats inline em vez de seis cards, listas em vez de grids pesados.

---

## 2. Temas e tokens de cor

O DS tem dois temas. O dark é a base; o white é derivado. Toda cor é um token (CSS variable), então trocar tema é trocar o escopo das variáveis.

### 2.1 Backgrounds e superfícies

| Token | Dark | White | Uso |
|-------|------|-------|-----|
| `--bg` | `#0a0a0a` | `#f3f3f6` | Fundo da tela |
| `--bg-1` | `#111114` | `#ffffff` | Fundo de seções elevadas |
| `--bg-2` | `#16161a` | `#ffffff` | Base de cards/pills |
| `--bg-elev` | `#202026` | `#ffffff` | Superfícies mais altas |
| `--art-bg` | `#0e0e11` | `#eeeef1` | Fundo de "arte" (NFT, ícones internos) |

No dark, a elevação sobe escurecendo levemente + gradiente. No white, sobe clareando (card branco sobre fundo off-white) + sombra.

### 2.2 Texto (ink)

| Token | Dark | White | Uso |
|-------|------|-------|-----|
| `--ink` | `#fafafa` | `#0a0a0a` | Texto principal, valores hero |
| `--ink-dim` | `#9a9a9e` | `#5e5e64` | Texto secundário, descrições |
| `--ink-mute` | `#5a5a5e` | `#9a9aa0` | Labels mono, captions |
| `--ink-faint` | `#2f2f33` | `#c4c4c8` | Ícones inativos, divisores fortes |

### 2.3 Linhas

| Token | Dark | White |
|-------|------|-------|
| `--line` | `rgba(255,255,255,0.06)` | `rgba(0,0,0,0.07)` |
| `--line-2` | `rgba(255,255,255,0.10)` | `rgba(0,0,0,0.10)` |

### 2.4 Cores de sistema

| Token | Dark | White | Significado |
|-------|------|-------|-------------|
| `--orange` | `#ff6b3d` | `#e85a2c` | Marca / tempero / CTA pontual |
| `--orange-dark` | `#d94d20` | `#c4471d` | Gradiente do cartão |
| `--orange-soft` | `rgba(255,107,61,0.10)` | `rgba(232,90,44,0.10)` | Fundo de badge laranja |
| `--green` | `#4ade80` | `#16a34a` | Dinheiro entrando, live, risco baixo |
| `--sol` | `#9945ff` | `#9945ff` | On-chain / Web3 / NFT / anonimato |

> No white theme, laranja e verde escurecem para manter contraste em fundo claro. O roxo Solana se mantém (só aparece em contextos de destaque, raramente).

---

## 3. Elevação (o efeito glossy)

Esse é o coração visual do DS. Os cards e botões não são chapados nem 3D pesado: ficam num meio-termo com leve volume.

A receita tem três camadas:

1. **Gradiente vertical sutil** (mais claro no topo, escurece embaixo)
2. **Fio de luz no topo** (`inset` highlight branco translúcido)
3. **Sombra externa suave** (eleva do fundo)

### Tokens de elevação

```css
/* DARK */
--soft: linear-gradient(180deg, #1e1e23 0%, #16161a 100%);
--soft-shadow: inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 12px -6px rgba(0,0,0,0.45);
--soft-shadow-sm: inset 0 1px 0 rgba(255,255,255,0.05), 0 3px 9px -5px rgba(0,0,0,0.4);
--soft-border: 1px solid rgba(255,255,255,0.05);

/* WHITE */
--soft: linear-gradient(180deg, #ffffff 0%, #f8f8fa 100%);
--soft-shadow: inset 0 1px 0 rgba(255,255,255,0.9), 0 3px 10px -5px rgba(0,0,0,0.10);
--soft-shadow-sm: inset 0 1px 0 rgba(255,255,255,0.9), 0 2px 7px -4px rgba(0,0,0,0.08);
--soft-border: 1px solid rgba(0,0,0,0.06);
```

**Regra:** `--soft-shadow` para superfícies hero (botões, chart card, recipient). `--soft-shadow-sm` para superfícies de apoio (chips, list icons, cards pequenos). Nunca empilhar elevações fortes lado a lado.

---

## 4. Tipografia

Duas famílias, sem exceção:

- **Geist** (sans) → toda interface, valores, títulos, labels
- **Geist Mono** → dados técnicos: hashes, endereços, valores monetários secundários, labels uppercase, captions

> Nunca usar serif ou itálico. Nunca.

### Escala

| Papel | Tamanho | Peso | Tracking | Família | Exemplo |
|-------|---------|------|----------|---------|---------|
| Balance hero | 44–46px | 700 | -0.04em | Geist | `R$ 74.352` |
| Balance cents | 27–28px | 600 | -0.02em | Geist | `,93` |
| Amount hero | 34–46px | 700 | -0.03em | Geist | valor de envio |
| Section title | 19px | 700 | -0.02em | Geist | "Cartão", "Receber" |
| Card title / heading | 20–26px | 700 | -0.025em | Geist | nome de evento |
| Stat value | 17–19px | 700 | -0.02em | Geist | `847` |
| Body / item name | 12–14px | 500–600 | -0.01em | Geist | nome de transação |
| Button label | 14px | 600 | -0.01em | Geist | "Enviar" |
| Sub / descrição | 11–12px | 400 | normal | Geist | descrição de modalidade |
| Mono label | 8–10px | 400–500 | 0.10–0.24em UPPERCASE | Geist Mono | `TOTAL BALANCE` |
| Hash / endereço | 9–11px | 500 | normal | Geist Mono | `7xKj...9aBc` |
| Caption | 7–9px | 400 | 0.05–0.12em | Geist Mono | badges, tags |

**Padrão de label:** mono, uppercase, tracking alto (`0.12em` a `0.24em`), em `--ink-mute`. É a assinatura tipográfica do DS.

---

## 5. Espaçamento

Sistema base 2px, com valores recorrentes:

| Token | Valor | Uso |
|-------|-------|-----|
| `space-1` | 4px | Gap micro (dentro de pills) |
| `space-2` | 6px | Gap de chips, dots |
| `space-3` | 8px | Gap entre cards de grid |
| `space-4` | 10px | Gap entre botões |
| `space-5` | 12px | Gap interno de cards |
| `space-6` | 14px | Padding de cards, gap de seções |
| `space-7` | 16–18px | Padding de tela (`.pad`) |
| `space-8` | 22–28px | Margem entre blocos grandes |

**Padding de tela:** `14–18px` horizontal. **Padding de card:** `9–14px` conforme densidade. **Padding-bottom do scroll quando há bottom nav:** `90px`.

---

## 6. Raios

| Token | Valor | Uso |
|-------|-------|-----|
| `radius-pill` | `999px` | Chips, account switch, toggles, action buttons em formato pill |
| `radius-btn` | `14–15px` | Botões Enviar/Receber, CTA primário |
| `radius-card-sm` | `12–13px` | List items, controles, cards pequenos |
| `radius-card` | `14–16px` | Cards principais, chart, recipient |
| `radius-icon` | `8–11px` | Containers de ícone internos |
| `radius-screen` | `34–36px` | Tela do app |
| `radius-phone` | `42–44px` | Frame do dispositivo |

---

## 7. Regras de uso de cor

A regra de ouro: **a tela é preto e branco até provar o contrário.** Cada cor precisa justificar sua presença.

### Laranja (`--orange`) — marca e tempero

Usar SÓ em:
- Indicador da aba ativa na bottom nav (tracinho 26×3px com glow)
- Tier premium do score (label "Tier IV")
- O NFT da própria Kora (Founder), com borda sutil
- Seta `→` de links "ver mais" (só a seta, não o texto)
- Gradiente do cartão Mastercard Black (produto hero)
- Taxa vantajosa da Kora no Tap to Pay
- Recompensa de indicação ("+50 KORA")
- Tap to Pay presencial (por ser destaque de ação)

Nunca usar laranja em: fundos grandes, texto corrido, múltiplos elementos competindo na mesma tela.

### Verde (`--green`) — dinheiro e estado positivo

Usar SÓ em:
- Valor de dinheiro que entra (`+R$ 240`)
- Charts de yield/rendimento
- Toggles ativos (on)
- Selo de risco baixo
- Status "verificado on-chain", "live", "disponível"

### Roxo Solana (`--sol`) — on-chain de verdade

Usar SÓ em contextos literalmente Web3:
- Badge "NFT" em produtos
- Modo "receber via carteira" (anônimo)
- Toggle "Tornar Web3" no cadastro de produto
- Logo Solana (sempre monocromática quando é só identificação de rede; o roxo entra quando o Web3 é o ponto)

### Branco (`--ink`) — o herói

O branco é a cor de maior peso. Valores principais (saldo, score, preços) são brancos. É ele que carrega a hierarquia, não o laranja.

---

## 8. Iconografia

### Estilo

- **Outline**, stroke `1.5–1.8px` para ícones de interface, `2px` para ícones pequenos/setas
- `stroke-linecap: round`, `stroke-linejoin: round`
- viewBox `0 0 24 24` padrão
- Cor herda de `currentColor` (segue o tema)

### Tamanhos

| Contexto | Tamanho |
|----------|---------|
| Ícone em list item | 14px |
| Ícone em botão | 16px |
| Ícone em nav | 21px |
| Ícone em ação circular | 20px |
| Ícone em container de controle | 15–19px |
| Setas/chevrons | 11–15px |

### Logo K (marca)

Logo facetada/escultórica, viewBox `420 260 310 370`. Usos:
- Topbar (20–22px altura), monocromática `--ink`
- Avatar de conta/perfil
- Marca do cartão
- Centro de QR codes
- "Arte" de NFT Founder

### Logo Solana

3 barras paralelas inclinadas, viewBox `0 0 24 18`. **Sempre monocromática** (`--ink-dim`) quando indica rede. Aparece em: selo no avatar (14px), wallet line (13px), breakdown de transação, badge de token.

---

## 9. Componentes

### 9.1 Botões de ação (Enviar / Receber)

Dois botões pill lado a lado, grid `1fr 1fr`, gap 10px.

- **Primário (Enviar):** fundo branco com gloss (`linear-gradient(180deg,#fff,#f0f0f2)`), texto `#0a0a0a`. No white theme inverte: fundo preto, texto branco.
- **Secundário (Receber):** `--soft` + `--soft-border` + `--soft-shadow`, texto `--ink`.
- Padding 14px, radius 15px, font 14px/600, ícone 16px à esquerda do label.
- Ícones: seta diagonal pra cima (enviar), seta diagonal pra baixo (receber).

### 9.2 CTA primário (full width)

Botão branco com gloss, largura total, radius 14px, padding 15px, font 14px/600, ícone + label centralizados. Usado em "Confirmar com Face ID", "Publicar produto".

### 9.3 Account switcher

Pill com `--soft`. Avatar 28px (neutro pra PF, gradiente laranja pra PJ) + selo Solana 14px no canto + chevron 13px. Abre dropdown de troca de conta.

**Dropdown:** painel `#15151a`, radius 18px, sombra forte. Header mono "Trocar conta", itens de conta (avatar 40px + nome + tipo + check na ativa), e item "criar nova loja" com avatar dashed.

### 9.4 Chips (saldo)

Pill mono, `--soft` + `--soft-shadow-sm`, padding `6px 10px`, font 9px. Label em `--ink-dim`, valor (`<b>`) em `--ink`. Ex: `BRL R$ 64.680`.

### 9.5 Cards (soft)

Base de quase tudo. `--soft` + `--soft-shadow-sm` + `--soft-border`, radius 13–16px, padding 9–14px.

### 9.6 Stats inline

A forma canônica de mostrar métricas. Flex de N colunas, divisor vertical fino (`--line-2`, altura 30px) entre elas. Cada coluna: label mono 8px + valor 19px/700 + hint mono 8px. O hint do tier puxa laranja. **Preferir isto a múltiplos cards.**

### 9.7 List item

Linha com `border-bottom: var(--line)`. Esquerda: ícone container 30px (`--soft`) + nome 12px/500 + sub mono 9px. Direita: valor mono 12px/600 (verde se entrada).

### 9.8 Toggles

34×19px, radius 999px. On = `--green` (ou `--sol` para Web3), bolinha escura. Off = `--bg-elev`, bolinha `--ink-mute` à esquerda.

### 9.9 Segmented control

Container `#0e0e11` + border, padding 4px, radius 13px. Segmentos flex iguais, o ativo recebe `--soft` + shadow + `--ink`; inativos em `--ink-mute`.

### 9.10 Campos de formulário

Label mono 9px uppercase + input com `--soft` + `--soft-shadow-sm`, radius 12px, padding `12px 13px`, font 13px. Placeholder em `--ink-mute`. Select tem chevron à direita.

### 9.11 Cartão (kcard)

Único elemento com cor forte. Gradiente `135deg, --orange-dark → --orange → #1a1a1f`, pattern de losangos overlay, aspect 1.586/1, radius 16px, glow laranja na sombra. Chip metálico, marca KORA, número mono, mastercard.

### 9.12 QR code

Box branco 176px, radius 18px, padding 12px. QR em SVG preto. Logo K (ou Solana no modo carteira) num quadrado branco central 38px.

### 9.13 Gauge (score)

Círculo 150px, dois `<circle>` SVG (trilho `--ink-faint` + progresso `--orange`), rotacionado -90deg. Centro: valor 38px/800 + tier mono laranja + max.

### 9.14 Chart

Card `--soft`. Header com label mono + valor 24px + variação verde. SVG line (verde para yield) com gradiente de área e dot no fim. Eixo X mono 8px.

### 9.15 Modality / acquirer cards

Card `--soft` com ícone 40px + info + chevron. Selecionado: `inset 0 0 0 1.5px var(--orange)`. Acquirer mostra taxa grande à direita (Kora em laranja, vantajosa).

### 9.16 Product card

`--soft`, imagem 1.2/1 com `--art-bg`, tag de tipo (NFT puxa roxo Solana), nome 12px, preço 13px/700 + tipo mono.

### 9.17 NFC indicator (Tap to Pay)

Círculo 110px `--soft` com dois anéis externos laranja translúcidos (130px e 150px), ícone tap 42px laranja no centro.

---

## 10. Navegação

### Bottom nav (indicator line)

Barra fixa, fundo `--bnav-bg` com blur, border-top `--line`, padding `12px 8px 20px`, grid 5 colunas. Cada item: ícone 21px + label mono 8px, em `--ink-mute`.

**Ativo:** cor `--orange` + tracinho `26×3px` radius 2px com `box-shadow: 0 0 10px var(--orange)` posicionado `top: -12px`. Nunca usar pill flutuante; o indicador é sempre o tracinho colado.

**Variantes:**
- **PF:** home · cartão · yield · tickets · perfil
- **PJ (lojista):** loja · vendas · yield · receber · perfil

---

## 11. Grid e frame

- **Largura do app:** 340–360px (mobile-first)
- **Altura de referência:** 740–760px
- **Status bar:** 42–44px, mono 12px
- **Frame do device:** radius 42–44px, notch 88–92px × 24–26px
- Conteúdo scrollável; bottom nav fixa por cima

---

## 12. Do's & Don'ts

**Do**
- Preto e branco primeiro, cor por último
- Stats inline em vez de muitos cards
- Mono uppercase pra labels e dados técnicos
- Elevação meio-termo coerente em tudo
- Solana monocromática, pela forma
- Verde só pra dinheiro entrando; laranja só pra marca/tempero

**Don't**
- Não empilhar cores fortes na mesma tela (vira gororoba)
- Não usar gradiente glossy pesado de "botão 3D"
- Não usar serif, itálico, ou fontes fora de Geist/Geist Mono
- Não usar pill flutuante na bottom nav
- Não usar o roxo Solana como decoração; só onde é Web3 de verdade
- Não pôr laranja em texto corrido ou fundos grandes

---

## 13. Implementação (tokens prontos)

CSS variables para colar no `:root` (dark) e `.theme-light`:

```css
:root {
  /* cor */
  --orange: #ff6b3d;  --orange-dark: #d94d20;  --orange-soft: rgba(255,107,61,0.10);
  --bg: #0a0a0a;  --bg-1: #111114;  --bg-2: #16161a;  --bg-elev: #202026;  --art-bg: #0e0e11;
  --ink: #fafafa;  --ink-dim: #9a9a9e;  --ink-mute: #5a5a5e;  --ink-faint: #2f2f33;
  --line: rgba(255,255,255,0.06);  --line-2: rgba(255,255,255,0.10);
  --green: #4ade80;  --sol: #9945ff;
  /* elevação */
  --soft: linear-gradient(180deg, #1e1e23 0%, #16161a 100%);
  --soft-shadow: inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 12px -6px rgba(0,0,0,0.45);
  --soft-shadow-sm: inset 0 1px 0 rgba(255,255,255,0.05), 0 3px 9px -5px rgba(0,0,0,0.4);
  --soft-border: 1px solid rgba(255,255,255,0.05);
  --bnav-bg: rgba(10,10,10,0.92);
  /* tipo */
  --sans: "Geist", system-ui, sans-serif;
  --mono: "Geist Mono", ui-monospace, monospace;
  /* raio */
  --r-pill: 999px;  --r-btn: 15px;  --r-card: 16px;  --r-card-sm: 13px;  --r-icon: 10px;
}

.theme-light {
  --orange: #e85a2c;  --orange-dark: #c4471d;  --orange-soft: rgba(232,90,44,0.10);
  --bg: #f3f3f6;  --bg-1: #ffffff;  --bg-2: #ffffff;  --bg-elev: #ffffff;  --art-bg: #eeeef1;
  --ink: #0a0a0a;  --ink-dim: #5e5e64;  --ink-mute: #9a9aa0;  --ink-faint: #c4c4c8;
  --line: rgba(0,0,0,0.07);  --line-2: rgba(0,0,0,0.10);
  --green: #16a34a;  --sol: #9945ff;
  --soft: linear-gradient(180deg, #ffffff 0%, #f8f8fa 100%);
  --soft-shadow: inset 0 1px 0 rgba(255,255,255,0.9), 0 3px 10px -5px rgba(0,0,0,0.10);
  --soft-shadow-sm: inset 0 1px 0 rgba(255,255,255,0.9), 0 2px 7px -4px rgba(0,0,0,0.08);
  --soft-border: 1px solid rgba(0,0,0,0.06);
  --bnav-bg: rgba(255,255,255,0.92);
}
```

### Sugestão de mapeamento Tailwind (`tailwind.config`)

```js
theme: {
  extend: {
    colors: {
      bg: { DEFAULT: '#0a0a0a', 1: '#111114', 2: '#16161a', elev: '#202026' },
      ink: { DEFAULT: '#fafafa', dim: '#9a9a9e', mute: '#5a5a5e', faint: '#2f2f33' },
      orange: { DEFAULT: '#ff6b3d', dark: '#d94d20' },
      green: '#4ade80',
      sol: '#9945ff',
    },
    fontFamily: { sans: ['Geist', 'system-ui'], mono: ['Geist Mono', 'monospace'] },
    borderRadius: { pill: '999px', btn: '15px', card: '16px', 'card-sm': '13px' },
    boxShadow: {
      soft: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 12px -6px rgba(0,0,0,0.45)',
      'soft-sm': 'inset 0 1px 0 rgba(255,255,255,0.05), 0 3px 9px -5px rgba(0,0,0,0.4)',
    },
  }
}
```

> Fontes: importar Geist e Geist Mono (Google Fonts ou `geist` no npm para Next.js).

---

*Kora Design System v1.0 · @kc1t*