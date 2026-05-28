# Kori — Backlog técnico (auth, factoring, web parity)

## Contexto do projeto

Monorepo informal em `D:\kauam\Documents\Github\Kora\`:

- **`app/`** — App mobile Expo / React Native (NativeWind + StyleSheet). Design system próprio (`SoftCard`, `Button`, tokens em `src/theme/tokens.ts`, fontes Geist).
- **`web/`** — App web Next.js 16 + shadcn/ui + Tailwind. Tokens `ds-*` em `web/app/globals.css`.
- **Supabase** compartilhado: `https://rpvdoxbrhprmeqdievgf.supabase.co`. Tabela `profiles` (hoje: `id`, `name`, `wallet_pubkey`).

### Estado atual da autenticação

- Mobile tem toggle `MOCK_AUTH` em `app/src/constants/devConfig.ts`:
  - `true` → fluxo mockado, não bate no Supabase (estado atual).
  - `false` → auth real via Supabase (signup/login/sessão persistida, PIN como unlock local).
- Camada de auth: `app/src/lib/authService.ts`, `app/src/lib/pinService.ts`, `app/src/hooks/useAuth.ts`, `app/src/hooks/useAuthLogic.ts`, `app/src/screens/Auth/AuthScreen.tsx`, `app/App.tsx`.
- Web já tem auth Supabase funcionando (`web/lib/supabase/*`, `web/middleware.ts`, `web/app/dashboard/layout.tsx`).

### Fluxo de factoring (antecipação de recebíveis)

- Mobile: `app/src/screens/Merchant/AntecipacoesScreen.tsx` + `app/src/hooks/useReceivables.ts`.
- Web: `web/app/dashboard/antecipacoes/page.tsx` + `web/components/dashboard/antecipacoes-view.tsx`.

---

## P0 — Bloqueiam o auth real (`MOCK_AUTH = false`)

### 1. Rodar a migration da tabela `profiles`
As colunas novas não existem ainda. Sem elas, `upsertProfile`/`getProfile` falham.

```sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS account_type text DEFAULT 'PF' CHECK (account_type IN ('PF','PJ'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS business_name text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS username text UNIQUE;
```
Rodar no SQL Editor do Supabase. Conferir que existem RLS policies de `SELECT`/`UPDATE` para `id = auth.uid()`.

### 2. Confirmação de e-mail bloqueia a sessão pós-signup
Por padrão o Supabase tem "Confirm email" ligado, então `supabase.auth.signUp()` retorna o `user` mas **não cria sessão** até o e-mail ser confirmado.
- Fluxo atual em `app/src/hooks/useAuthLogic.ts` (efeito do stage `wallet`) assume signup → logado direto.
- **Decidir e implementar uma das opções:**
  - (a) Desligar "Confirm email" no painel Supabase (Auth → Providers → Email), ou
  - (b) Tratar o estado "confirme seu e-mail" na UI (tela intermediária + reenviar e-mail) e só seguir pro Home quando houver sessão.

### 3. Criação do `profiles` row sob RLS
Logo após o signup (sem sessão ativa) `auth.uid()` é null, então o `upsert` em `profiles` viola a policy `id = auth.uid()`.
- Padrão Supabase: criar o profile via **trigger de banco** em `auth.users` insert, não no client.
- **Tarefa:** criar (ou confirmar que existe) trigger/função tipo:
```sql
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, name) values (new.id, new.raw_user_meta_data->>'name');
  return new;
end; $$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
```
- Depois, ajustar `useAuthLogic` para fazer `update` (não `upsert`) do profile já com sessão válida, OU passar `name`/`username`/`account_type` no `options.data` do `signUp` e o trigger preencher.

### 4. Anon key hardcoded
`app/src/lib/supabase.ts` tem `SUPABASE_ANON_KEY` no código.
- Mover pra env var (`app.config`/`expo-constants` ou `.env` + `EXPO_PUBLIC_`).
- Confirmar que é a mesma key do web (`web/.env.local` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`).

---

## P1 — Gaps funcionais

### 5. OAuth é fake
`app/src/components/auth/steps/WelcomeStep.tsx`: botões Apple/Google chamam `startSignup()` (fluxo de e-mail).
- Implementar OAuth real (`supabase.auth.signInWithOAuth`) ou esconder os botões até existir.
- Conferir os botões Google/GitHub equivalentes no web (`web/components/auth/login-screen.tsx`).

### 6. Factoring não credita nada
Mobile e web mostram o recibo mas não atualizam saldo nem histórico de transações.
- `app/src/hooks/useReceivables.ts` → `confirmAdvance` só marca `status: "antecipado"` e gera recibo.
- Integrar com o saldo/histórico (mesmo que mockado) pra refletir o valor líquido creditado.

### 7. `BusinessNameDrawer` redundante no signup PJ
No cadastro PJ o usuário já digita o nome da loja, mas o drawer (`app/src/components/merchant/BusinessNameDrawer.tsx`) aparece de novo depois.
- Causa: `resolveSignupData` (`app/src/utils/authUtils.ts`) não popula `businessName` no `AuthUserData`.
- Corrigir: propagar `storeName` → `businessName` no signup PJ; o drawer deve disparar **só** quando PJ sem `business_name` (ex.: conta que trocou pra PJ).

### 8. `handleSwitchAccount` simplificado
`app/App.tsx`: ao alternar PF↔PJ agora só muda `accountType`. A lógica antiga trocava `username` (`_pj`)/`name`.
- Validar o que o `HomeScreen` espera; reintroduzir a transformação se necessário.

### 9. Web parity parcial
Só foram adicionadas as páginas **Pagamentos** e **Antecipações** no web. Faltam paridades com o mobile:
- QR real de receber (hoje é só ícone placeholder em `web/components/dashboard/payments-view.tsx`).
- NFT holdings, contatos recentes, modal de transações completo, tickets de experiências com QR.

---

## P2 — Qualidade / dívida técnica

### 10. Erros de TypeScript pré-existentes
`npx tsc --noEmit` no `app/` não passa limpo. Principais ofensores:
- `app/src/components/cards/CardsPanel.tsx` — chaves duplicadas no StyleSheet, `styles.card` inexistente, `perspective`, `width: string` em ViewStyle.
- Também: `ProfileModal`, `ReceiveDrawer`, `Categories`, `Opportunities`, `PayingScreen` (ViewStyle inválidos).

### 11. Mock data duplicado
`app/src/data/*` (mobile) e `web/lib/mock-data.ts` (web) são cópias separadas que divergem (ex.: acento "Tênis").
- Considerar um pacote/arquivo compartilhado ou pelo menos manter sincronizado.

### 12. Overlay "Em breve" dos cartões
`app/src/components/cards/CardsPanel.tsx`: confirmar que o overlay realmente bloqueia o toque no carrossel atrás (em RN uma `View` simples nem sempre intercepta toque dos irmãos). Adicionar `pointerEvents` se preciso.

### 13. PIN sem salt
`app/src/lib/pinService.ts` usa SHA-256 puro de um PIN de 5 dígitos (100k combinações).
- Para unlock local em SecureStore é aceitável, mas avaliar salt/derivação por device.

### 14. Tratamento de erro + testes
- `app/App.tsx`: o auto-login chama `getProfile` sem try/catch.
- Não há testes automatizados em nenhuma parte do fluxo (auth, factoring, web).

---

## Como validar no fim

1. **Auth real:** setar `MOCK_AUTH = false`, rodar migration + trigger, criar conta nova → conferir linha em `auth.users` e `profiles`; fechar/reabrir app → auto-login; PIN → unlock; logout limpa tudo.
2. **Factoring:** selecionar recebíveis → confirmar → recibo; itens somem da lista; saldo/histórico refletem (após #6).
3. **Web:** navegar Pagamentos e Antecipações como PF e PJ; toggle de conta na sidebar; `npx tsc --noEmit` limpo no `web/`.
