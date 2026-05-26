/**
 * Dev-only flags. Set MOCK_AUTH to false before shipping.
 * When MOCK_AUTH is true, the app skips splash/onboarding/auth flows
 * and jumps straight into HomeScreen with MOCK_SESSION.
 */
export const MOCK_AUTH = true;

export const MOCK_SESSION = {
  name: 'Kauã Miguel',
  email: 'kauamigueldev@gmail.com',
  accountType: 'PJ' as const,
  username: 'kauamiguel',
};
