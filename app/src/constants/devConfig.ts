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
