// Toggle de autenticação.
//   true  → fluxo mockado, NÃO bate no Privy/Back-end (signup/login/PIN resolvem localmente).
//   false → autenticação real via Privy/Back-end (signup/login/sessão persistida).
export const MOCK_AUTH = false;


// Sessão usada quando MOCK_AUTH === true (login e PIN caem nesses dados).
export const MOCK_SESSION = {
  name: "Kauã Miguel",
  email: "kauamigueldev@gmail.com",
  accountType: "PJ" as const,
  username: "kauamiguel",
  businessName: "Studio Kauã",
};

// ─────────────────────────────────────────────────────────────────────────
// DEMO MODE — fluxo 100% mockado para gravação de vídeo.
//   true  → entra direto logado (sem Privy/back-end) e TODO o fluxo financeiro
//           (saldo, cobrança no cartão, antecipação, investimento, fatura)
//           roda offline contra o ledger mockado compartilhado (mockDemoLedger).
//           As 3 personas vivem no mesmo device: conta PF (pessoa + aba de
//           investimentos) e conta PJ (loja/vendedor), trocando localmente.
//   false → fluxo real (Privy + back-end + on-chain).
// Para reverter o vídeo, basta voltar para false.
export const MOCK_DEMO = true;

// Sessão da conta PF (pessoa que também investe).
export const DEMO_SESSION_PF = {
  name: "Ana Ribeiro",
  email: "ana.ribeiro@kori.app",
  accountType: "PF" as const,
  username: "ana.ribeiro",
  privyUserId: "demo-privy-user",
  businessName: undefined as string | undefined,
  store: null as { name?: string; username?: string; category?: string } | null,
};

// Sessão da conta PJ (loja / vendedor).
export const DEMO_SESSION_PJ = {
  name: "Loja Aurora",
  email: "ana.ribeiro@kori.app",
  accountType: "PJ" as const,
  username: "loja.aurora",
  privyUserId: "demo-privy-user",
  businessName: "Loja Aurora",
  store: { name: "Loja Aurora", username: "loja.aurora", category: "Moda & Acessórios" },
};

// Lista de contas usada pelo seletor de conta (troca PF ↔ PJ offline).
export const DEMO_ACCOUNTS = [
  {
    id: "demo-pf",
    name: DEMO_SESSION_PF.name,
    username: DEMO_SESSION_PF.username,
    email: DEMO_SESSION_PF.email,
    accountType: "PF" as const,
    walletIndex: 0,
    walletAddress: "7nxB2xT8aYqP9mZ1cR5vW4kL3jH6fD9gS8xV1nC4X1a",
    businessName: undefined as string | undefined,
    store: null as { name?: string; username?: string; category?: string } | null,
  },
  {
    id: "demo-pj",
    name: DEMO_SESSION_PJ.name,
    username: DEMO_SESSION_PJ.username,
    email: DEMO_SESSION_PJ.email,
    accountType: "PJ" as const,
    walletIndex: 1,
    walletAddress: "Aur0raSt0re5pQ2mZ1cR5vW4kL3jH6fD9gS8xV1nC4Z9b",
    businessName: DEMO_SESSION_PJ.businessName,
    store: DEMO_SESSION_PJ.store,
  },
];
