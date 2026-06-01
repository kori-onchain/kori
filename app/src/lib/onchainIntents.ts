import { Buffer } from "buffer";
import {
  OnchainIntentKind,
  OnchainSubmitResponse,
  koraApi,
} from "./koraApi";
import { signSerializedTransactionWithPrivy } from "./privySolanaSigner";

export const isOnchainAnchorEnabled =
  process.env.EXPO_PUBLIC_ONCHAIN_ANCHOR === "true";

export type OnchainExecutionStatus =
  | "idle"
  | "aguardando assinatura"
  | "enviando"
  | "confirmado"
  | "falhou";

export async function executeOnchainIntent(params: {
  kind: OnchainIntentKind;
  payload: Record<string, unknown>;
  walletState: any;
  walletIndex: number;
  onStatus?: (status: OnchainExecutionStatus) => void;
}): Promise<OnchainSubmitResponse> {
  const { kind, payload, walletState, walletIndex, onStatus } = params;
  const wallet =
    walletState?.wallets?.find((item: any) => item.walletIndex === walletIndex) ||
    walletState?.wallets?.[walletIndex] ||
    walletState?.wallets?.[0];

  if (!wallet?.getProvider) {
    throw new Error("Carteira Solana Privy nao encontrada para esta conta.");
  }

  onStatus?.("aguardando assinatura");
  const intent = await koraApi.onchain.createIntent(kind, payload);
  const provider = await wallet.getProvider();
  const rawTransaction = Uint8Array.from(Buffer.from(intent.transaction, "base64"));
  const signedTransactionBytes = await signSerializedTransactionWithPrivy({
    provider,
    transaction: rawTransaction,
    signerAddress: wallet.address,
  });
  const signedTransaction = Buffer.from(signedTransactionBytes).toString("base64");

  onStatus?.("enviando");
  const result = await koraApi.onchain.submit({
    intentId: intent.intentId,
    signedTransaction,
  });
  onStatus?.(result.status === "CONFIRMED" ? "confirmado" : "falhou");
  return result;
}
