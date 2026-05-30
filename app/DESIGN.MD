# KORI Design System — React Native (Expo + NativeWind)

> Implementação Android-first. Dark theme.
> Esta é a versão de código do DS. Para a doc conceitual/web, ver `KORI-design-system.md`.

---

## Índice

1. [Setup](#1-setup)
2. [Tokens (tailwind.config.js)](#2-tokens-tailwindconfigjs)
3. [Fontes](#3-fontes)
4. [Pegadinhas do RN vs web](#4-pegadinhas-do-rn-vs-web)
5. [Elevação: o SoftCard](#5-elevação-o-softcard)
6. [Primitivos](#6-primitivos)
7. [Regras de cor](#7-regras-de-cor)
8. [Tipografia](#8-tipografia)
9. [Ícones (react-native-svg)](#9-ícones-react-native-svg)
10. [Checklist de migração de tela](#10-checklist-de-migração-de-tela)

---

## 1. Setup

```bash
npx expo install expo-linear-gradient react-native-svg
npx expo install @expo-google-fonts/geist expo-font
```

Libs do DS (não adicionar outras pra estilo):
- **expo-linear-gradient** → gradiente do glossy, cartão, banner
- **react-native-svg** → logos e ícones
- **@expo-google-fonts/geist** → Geist + Geist Mono

Sem `expo-blur`: a bottom nav usa fundo sólido (blur custa caro no Android e o ganho visual no dark é nulo).

---

## 2. Tokens (tailwind.config.js)

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bg:      { DEFAULT: '#0a0a0a', 1: '#111114', 2: '#16161a', elev: '#202026', art: '#0e0e11' },
        ink:     { DEFAULT: '#fafafa', dim: '#9a9a9e', mute: '#5a5a5e', faint: '#2f2f33' },
        orange:  { DEFAULT: '#ff6b3d', dark: '#d94d20' },
        green:   '#4ade80',
        sol:     '#9945ff',
        line:    'rgba(255,255,255,0.06)',
        line2:   'rgba(255,255,255,0.10)',
      },
      borderRadius: { pill: 999, btn: 15, card: 16, cardSm: 13, icon: 10 },
      fontFamily: { sans: ['Geist'], mono: ['GeistMono'] },
    },
  },
  plugins: [],
};
```

Constantes que o NativeWind não cobre bem (gradiente, sombras) ficam num módulo TS:

```ts
// theme/tokens.ts
export const GLOSSY = ['#1e1e23', '#16161a'] as const;   // gradiente do SoftCard
export const HAIRLINE = 'rgba(255,255,255,0.06)';        // fio de luz no topo
export const ORANGE = '#ff6b3d';
export const GREEN = '#4ade80';
export const SOL = '#9945ff';

// letterSpacing em RN é PX absoluto (não em). Pré-calculado:
export const TRACK = {
  balance: -1.8,   // -0.04em @ 44px
  title:   -0.4,   // -0.02em @ 19px
  stat:    -0.4,   // -0.02em @ 19px
  labelLg: 2.4,    // 0.24em @ 10px (TOTAL BALANCE)
  label:   1.2,    // 0.12em @ 9px
};
```

---

## 3. Fontes

```tsx
// app/_layout.tsx
import { useFonts, Geist_400Regular, Geist_500Medium, Geist_600SemiBold, Geist_700Bold } from '@expo-google-fonts/geist';
import { GeistMono_400Regular, GeistMono_500Medium } from '@expo-google-fonts/geist-mono';

export default function RootLayout() {
  const [loaded] = useFonts({
    Geist: Geist_400Regular,
    'Geist-Medium': Geist_500Medium,
    'Geist-SemiBold': Geist_600SemiBold,
    'Geist-Bold': Geist_700Bold,
    GeistMono: GeistMono_400Regular,
    'GeistMono-Medium': GeistMono_500Medium,
  });
  if (!loaded) return null;
  return /* ...navigation */;
}
```

> RN não tem `font-weight` que pega variações automáticas como na web. Cada peso é uma família carregada. Use `style={{ fontFamily: 'Geist-Bold' }}` para 700, etc. Se preferir className, mapeie no config (`fontFamily: { sans:['Geist'], bold:['Geist-Bold'], ... }`).

---

## 4. Pegadinhas do RN vs web

Estas diferenças quebram o DS se ignoradas:

| Web | React Native (Android) |
|-----|------------------------|
| `box-shadow: inset` (fio de luz) | **Não existe.** Simular com `<View>` hairline absoluta no topo |
| `box-shadow` externo | `elevation` (Android). `shadowColor` só pinta a sombra do elevation no Android |
| `backdrop-filter: blur` | Não existe sem BlurView. Usar fundo sólido translúcido |
| `linear-gradient()` em CSS | `<LinearGradient>` (expo) como filho absoluto |
| `letter-spacing: -0.04em` | `letterSpacing: -1.8` (px absoluto, pré-calcular) |
| `line-height: 1.2` (unitless) | `lineHeight: 22` (px absoluto) |
| `<symbol>/<use>` SVG | Cada ícone é um componente `react-native-svg` |
| `font-weight: 700` | `fontFamily: 'Geist-Bold'` (peso = família) |
| `currentColor` | passar `color` por prop e repassar pro `stroke/fill` |

---

## 5. Elevação: o SoftCard

A peça central do DS. Tudo que é card, chip, pill ou container de ícone usa isso. Combina três camadas porque RN não tem inset shadow.

```tsx
// components/ui/SoftCard.tsx
import { View, ViewProps, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GLOSSY, HAIRLINE } from '@/theme/tokens';

type Props = ViewProps & {
  radius?: number;
  strong?: boolean;        // sombra hero vs apoio
  glowColor?: string;      // ex: laranja pro cartão
};

export function SoftCard({ children, style, radius = 16, strong = false, glowColor, ...rest }: Props) {
  return (
    <View
      style={[
        {
          borderRadius: radius,
          backgroundColor: '#16161a',          // fallback enquanto o gradiente monta
          elevation: strong ? 8 : 4,
          shadowColor: glowColor ?? '#000',    // glowColor pinta a sombra (cartão laranja)
        },
        style,
      ]}
      {...rest}
    >
      {/* clip interno separado da sombra: overflow hidden não corta o elevation */}
      <View style={{ borderRadius: radius, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' }}>
        <LinearGradient colors={GLOSSY} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFill} />
        {/* fio de luz no topo */}
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, backgroundColor: HAIRLINE }} />
        {children}
      </View>
    </View>
  );
}
```

**Regra:** `strong` (elevation 8) para hero (cartão, chart, recipient). Default (elevation 4) para apoio (chips, ícones, list cards). Nunca dois `strong` colados.

---

## 6. Primitivos

### 6.1 Button (Enviar / Receber / CTA)

```tsx
// components/ui/Button.tsx
import { Pressable, Text, View } from 'react-native';
import { SoftCard } from './SoftCard';

type Variant = 'primary' | 'soft';
export function Button({ variant = 'primary', label, icon, onPress }:{
  variant?: Variant; label: string; icon?: React.ReactNode; onPress?: () => void;
}) {
  if (variant === 'primary') {
    // branco, texto preto — ação primária (Enviar)
    return (
      <Pressable onPress={onPress}
        className="flex-row items-center justify-center gap-2 bg-ink rounded-btn py-3.5 px-4"
        style={{ elevation: 4 }}>
        {icon}
        <Text style={{ fontFamily: 'Geist-SemiBold', fontSize: 14, color: '#0a0a0a' }}>{label}</Text>
      </Pressable>
    );
  }
  // soft escuro, texto branco (Receber)
  return (
    <SoftCard radius={15}>
      <Pressable onPress={onPress} className="flex-row items-center justify-center gap-2 py-3.5 px-4">
        {icon}
        <Text style={{ fontFamily: 'Geist-SemiBold', fontSize: 14, color: '#fafafa' }}>{label}</Text>
      </Pressable>
    </SoftCard>
  );
}
```

Uso na home (lado a lado):
```tsx
<View className="flex-row gap-2.5">
  <View className="flex-1"><Button variant="primary" label="Enviar" icon={<IconSend color="#0a0a0a" />} /></View>
  <View className="flex-1"><Button variant="soft" label="Receber" icon={<IconReceive color="#fafafa" />} /></View>
</View>
```

> Ícone do Enviar é PRETO (sobre branco), do Receber é BRANCO. Sem círculo de fundo colorido.

### 6.2 BalanceHero

```tsx
// components/ui/BalanceHero.tsx
import { View, Text } from 'react-native';
import { TRACK } from '@/theme/tokens';

export function BalanceHero({ reais, cents }: { reais: string; cents: string }) {
  return (
    <View className="items-center py-7">
      <Text style={{ fontFamily: 'GeistMono', fontSize: 10, color: '#5a5a5e', letterSpacing: TRACK.labelLg }}>
        TOTAL BALANCE
      </Text>
      <View className="flex-row items-baseline mt-3">
        <Text style={{ fontFamily: 'Geist-Bold', fontSize: 44, color: '#fafafa', letterSpacing: TRACK.balance }}>
          R$ {reais}
        </Text>
        <Text style={{ fontFamily: 'Geist-SemiBold', fontSize: 27, color: '#5a5a5e' }}>,{cents}</Text>
      </View>
    </View>
  );
}
```

> Branco sólido, sem shine. Centavos em `ink-mute`.

### 6.3 Chip

```tsx
export function Chip({ label, value }: { label: string; value: string }) {
  return (
    <SoftCard radius={999}>
      <View className="flex-row gap-1.5 px-2.5 py-1.5">
        <Text style={{ fontFamily: 'GeistMono', fontSize: 9, color: '#9a9a9e' }}>{label}</Text>
        <Text style={{ fontFamily: 'GeistMono-Medium', fontSize: 9, color: '#fafafa' }}>{value}</Text>
      </View>
    </SoftCard>
  );
}
```

### 6.4 StatInline (forma canônica de métricas)

```tsx
export function StatInline({ items }: { items: { label: string; value: string; hint?: string; tier?: boolean }[] }) {
  return (
    <View className="flex-row mt-5 py-1.5">
      {items.map((it, i) => (
        <View key={it.label} className="flex-1 items-center px-1.5"
          style={i > 0 ? { borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.10)' } : undefined}>
          <Text style={{ fontFamily: 'GeistMono', fontSize: 8, color: '#5a5a5e', letterSpacing: TRACK.label }}>
            {it.label.toUpperCase()}
          </Text>
          <Text style={{ fontFamily: 'Geist-Bold', fontSize: 19, color: '#fafafa', marginTop: 5, letterSpacing: TRACK.stat }}>
            {it.value}
          </Text>
          {it.hint && (
            <Text style={{ fontFamily: 'GeistMono', fontSize: 8, marginTop: 2, color: it.tier ? '#ff6b3d' : '#5a5a5e' }}>
              {it.hint}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
}
```

> Divisor é `borderLeft` no item (não View separada). Preferir isto a múltiplos cards.

### 6.5 AccountSwitch

```tsx
export function AccountSwitch({ label, isPJ, onPress }: { label: string; isPJ?: boolean; onPress?: () => void }) {
  return (
    <SoftCard radius={999}>
      <Pressable onPress={onPress} className="flex-row items-center gap-1.5 pl-1 pr-2 py-1">
        <View className="w-7 h-7 rounded-full items-center justify-center border border-line"
          style={{ backgroundColor: isPJ ? undefined : '#202026' }}>
          {isPJ
            ? <LinearGradient colors={['#d94d20','#ff6b3d']} className="absolute inset-0 rounded-full" />
            : null}
          <IconK color="#fafafa" size={14} />
          {/* selo Solana no canto */}
          <View className="absolute -bottom-0.5 -right-1 w-3.5 h-3.5 rounded-full bg-bg border border-line2 items-center justify-center">
            <IconSol color="#9a9a9e" size={8} />
          </View>
        </View>
        <Text style={{ fontFamily: 'Geist-SemiBold', fontSize: 12, color: '#fafafa' }}>{label}</Text>
        <IconChevronDown color="#9a9a9e" size={13} />
      </Pressable>
    </SoftCard>
  );
}
```

### 6.6 BottomNav (indicator line)

```tsx
export function BottomNav({ active }: { active: string }) {
  const tabs = [
    { id: 'home', label: 'inicio', icon: IconHome },
    { id: 'card', label: 'cartao', icon: IconCard },
    { id: 'yield', label: 'invest', icon: IconTrend },
    { id: 'xp', label: 'experiencias', icon: IconCompass },
  ];
  return (
    <View
      className="absolute bottom-0 left-0 right-0 flex-row border-t border-line"
      style={{ backgroundColor: 'rgba(10,10,10,0.92)', paddingTop: 12, paddingBottom: 20, paddingHorizontal: 8 }}>
      {tabs.map((t) => {
        const on = t.id === active;
        const Icon = t.icon;
        return (
          <Pressable key={t.id} className="flex-1 items-center" style={{ gap: 4 }}>
            {on && (
              <View style={{ position: 'absolute', top: -12, width: 26, height: 3, borderRadius: 2,
                backgroundColor: '#ff6b3d', shadowColor: '#ff6b3d', elevation: 6 }} />
            )}
            <Icon color={on ? '#ff6b3d' : '#5a5a5e'} size={21} />
            <Text style={{ fontFamily: 'GeistMono', fontSize: 8, color: on ? '#ff6b3d' : '#5a5a5e' }}>{t.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
```

> Indicator é a `View` 26x3 acima do ícone, com glow via `shadowColor + elevation`. Nunca pill flutuante.

### 6.7 ListItem

```tsx
export function ListItem({ icon, name, sub, value, incoming }: {
  icon: React.ReactNode; name: string; sub: string; value: string; incoming?: boolean;
}) {
  return (
    <View className="flex-row justify-between items-center py-2.5 border-b border-line">
      <View className="flex-row items-center gap-2.5">
        <SoftCard radius={8}><View className="w-[30px] h-[30px] items-center justify-center">{icon}</View></SoftCard>
        <View>
          <Text style={{ fontFamily: 'Geist-Medium', fontSize: 12, color: '#fafafa' }}>{name}</Text>
          <Text style={{ fontFamily: 'GeistMono', fontSize: 9, color: '#5a5a5e', marginTop: 1 }}>{sub}</Text>
        </View>
      </View>
      <Text style={{ fontFamily: 'GeistMono-Medium', fontSize: 12, color: incoming ? '#4ade80' : '#fafafa' }}>{value}</Text>
    </View>
  );
}
```

---

## 7. Regras de cor

A tela é PRETO E BRANCO por padrão. Cor só com significado.

- **Laranja** (`orange`): marca/tempero. Só em indicator da nav, badge de recompensa, valor de recompensa, seta de "ver mais", tier do score, gradiente do cartão, taxa Kori, Tap to Pay. Nunca em fundo grande ou texto corrido.
- **Verde** (`green`): só dinheiro entrando, charts de yield, toggle on, risco baixo, "verificado/live".
- **Roxo Solana** (`sol`): só Web3 real (badge NFT, modo carteira anônimo, toggle Web3). **Nunca em promo/recompensa/card de indicação.**
- **Branco** (`ink`): o herói. Valores principais são brancos.

Nunca empilhar cores fortes competindo na mesma tela.

---

## 8. Tipografia

| Papel | fontFamily | size | letterSpacing (px) | color |
|-------|-----------|------|--------------------|-------|
| Balance | Geist-Bold | 44 | -1.8 | ink |
| Balance cents | Geist-SemiBold | 27 | 0 | ink-mute |
| Section title | Geist-Bold | 19 | -0.4 | ink |
| Stat value | Geist-Bold | 19 | -0.4 | ink |
| Body/nome | Geist-Medium | 12-14 | 0 | ink |
| Button | Geist-SemiBold | 14 | 0 | depende |
| Sub | Geist | 11-12 | 0 | ink-dim |
| Mono label | GeistMono | 8-10 | 1.2-2.4 | ink-mute (UPPERCASE) |
| Hash/endereço | GeistMono | 9-11 | 0 | ink-mute |

> `letterSpacing` é px absoluto: pré-calculado em `TRACK`. `lineHeight` (se usar) também é px.

---

## 9. Ícones (react-native-svg)

Padrão de componente (stroke outline, cor por prop):

```tsx
import Svg, { Path } from 'react-native-svg';

export const IconSend = ({ color = '#fafafa', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M7 17L17 7M9 7h8v8" stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const IconReceive = ({ color = '#fafafa', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M17 7L7 17M15 17H7V9" stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Logo K — viewBox "420 260 310 370", fill currentColor -> fill={color}
export const IconK = ({ color = '#fafafa', size = 16 }) => (
  <Svg width={size} height={size * 1.2} viewBox="420 260 310 370">
    <Path fill={color} d="M687.256 312.792L687.761 313.037C688.903 315.6 688.347 361.277 688.339 367.642C652.186 405.264 616.554 443.385 581.454 481.992C596.939 497.772 613.443 513.652 629.23 529.243L721.187 620.099C694.536 620.373 667.338 620.067 640.644 620.039L619.604 620.015C615.524 616.35 611.238 612.134 607.351 608.236C572.133 572.923 534.645 539.223 499.818 503.592C561.731 439.438 624.213 375.836 687.256 312.792Z" />
    <Path fill={color} d="M534.163 269.695C535.193 272.855 535.005 300.957 535.035 306.33C535.232 347.907 535.157 389.485 534.81 431.061C499.36 468.415 464.208 506.052 429.359 543.968C427.97 541.752 428.245 525.221 428.252 521.631L428.336 488.556L428.251 378.795C444.034 361.651 460.488 345.217 476.753 328.524L534.163 269.695Z" />
  </Svg>
);

// Logo Solana mono — 3 barras
export const IconSol = ({ color = '#9a9a9e', size = 13 }) => (
  <Svg width={size} height={size * 0.75} viewBox="0 0 24 18">
    <Path fill={color} d="M5 2.5 L21.5 2.5 L19 5.2 L2.5 5.2 Z" />
    <Path fill={color} d="M2.5 7.6 L19 7.6 L21.5 10.3 L5 10.3 Z" />
    <Path fill={color} d="M5 12.8 L21.5 12.8 L19 15.5 L2.5 15.5 Z" />
  </Svg>
);
```

Tamanhos: list 14, button 16, nav 21, ação circular 20, chevron 11-15. Stroke 1.6-1.8 (interface) / 2 (setas).

---

## 10. Checklist de migração de tela

Pra cada tela que você for batendo depois da home:

- [ ] Tela usa só tokens do config (zero hex hardcoded)
- [ ] Todo card/chip/pill é `SoftCard` (nunca `View` chapada com bg sólido)
- [ ] Ações primárias = `Button primary` (branco); secundárias = `Button soft`
- [ ] Métricas em `StatInline`, não em grid de cards
- [ ] Topbar: título da seção (ou logo na home) + `AccountSwitch` à direita
- [ ] `BottomNav` com indicator line laranja na aba ativa
- [ ] Cor só onde tem significado (revisar contra a seção 7)
- [ ] Ícones via `react-native-svg`, cor por prop
- [ ] Texto técnico em `GeistMono`; resto em `Geist`
- [ ] `letterSpacing` em px (usar `TRACK`), nunca em "em"
- [ ] Fluxos/dados/navegação intocados (só a casca mudou)

---

*KORI DS · React Native (Expo + NativeWind) · Android-first · @kc1t*