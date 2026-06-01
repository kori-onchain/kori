const DEFAULT_DEVNET_RPC_URL = "https://api.devnet.solana.com";

export const KORA_USDC_MINT =
  process.env.EXPO_PUBLIC_USDC_MINT ||
  "BkiQkbtHqZp5hEDhvQg7cGVHhtgp5UVL55opCrUnrshx";

const SOLANA_RPC_URL =
  process.env.EXPO_PUBLIC_SOLANA_RPC_URL || DEFAULT_DEVNET_RPC_URL;

type ParsedTokenAccount = {
  account?: {
    data?: {
      parsed?: {
        info?: {
          tokenAmount?: {
            amount?: string;
            decimals?: number;
            uiAmount?: number | null;
            uiAmountString?: string;
          };
        };
      };
    };
  };
};

type TokenAccountsResponse = {
  result?: {
    value?: ParsedTokenAccount[];
  };
  error?: {
    message?: string;
  };
};

export async function getDevnetUsdcBalance(owner: string) {
  if (!owner) return 0;

  const response = await fetch(SOLANA_RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "kora-usdc-balance",
      method: "getTokenAccountsByOwner",
      params: [
        owner,
        { mint: KORA_USDC_MINT },
        { encoding: "jsonParsed", commitment: "confirmed" },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Solana RPC error ${response.status}`);
  }

  const body = (await response.json()) as TokenAccountsResponse;
  if (body.error) {
    throw new Error(body.error.message || "Solana RPC returned an error");
  }

  return (body.result?.value || []).reduce((sum, tokenAccount) => {
    const tokenAmount =
      tokenAccount.account?.data?.parsed?.info?.tokenAmount;
    const uiAmount =
      tokenAmount?.uiAmount ??
      Number.parseFloat(tokenAmount?.uiAmountString || "0");

    if (Number.isFinite(uiAmount)) return sum + uiAmount;

    const rawAmount = Number.parseFloat(tokenAmount?.amount || "0");
    const decimals = tokenAmount?.decimals ?? 6;
    return sum + rawAmount / 10 ** decimals;
  }, 0);
}
