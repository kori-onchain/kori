import { Buffer } from "buffer";
import { koraApi } from "./koraApi";
import { PaymentIntent } from "@type/payment";
import { signSerializedTransactionWithPrivy } from "./privySolanaSigner";

export const moneyToBrlCents = (value?: string) => {
  const parsed = Number.parseFloat((value || "0").replace(/\./g, "").replace(",", "."));
  if (!Number.isFinite(parsed) || parsed <= 0) return 0;
  return Math.max(1, Math.round(parsed * 100));
};

export async function executeSolanaPayment(params: {
  intent: PaymentIntent;
  walletState: any;
  walletIndex: number;
}) {
  const { intent, walletState, walletIndex } = params;
  const recipient = intent.recipient;

  if (recipient.type === "pix") {
    throw new Error("Pix permanece indisponivel nesta etapa.");
  }

  const wallet =
    walletState?.wallets?.find((item: any) => item.walletIndex === walletIndex) ||
    walletState?.wallets?.[walletIndex] ||
    walletState?.wallets?.[0];

  if (!wallet?.getProvider) {
    throw new Error("Carteira Solana Privy nao encontrada para esta conta.");
  }

  const recipientType = recipient.type === "wallet" ? "wallet" : "username";
  const recipientId =
    recipient.type === "wallet"
      ? recipient.walletAddress
      : (recipient.userId || recipient.displayName).replace(/^@/, "");

  if (!recipientId) {
    throw new Error("Destinatario invalido.");
  }

  const amountCents = moneyToBrlCents(intent.amount);
  if (amountCents <= 0) {
    throw new Error("Informe um valor maior que zero.");
  }

  const intentResponse = await koraApi.payments.solanaIntent({
    recipientType,
    recipient: recipientId,
    amountCents,
    anonymous: recipient.type === "wallet" || recipient.isAnonymous,
  });

  const provider = await wallet.getProvider();
  const rawTransaction = Uint8Array.from(
    Buffer.from(intentResponse.transaction, "base64"),
  );
  const signedTransactionBytes = await signSerializedTransactionWithPrivy({
    provider,
    transaction: rawTransaction,
    signerAddress: wallet.address,
  });
  const signedTransaction = Buffer.from(signedTransactionBytes).toString("base64");

  return koraApi.payments.solanaSubmit({
    paymentId: intentResponse.paymentId,
    signedTransaction,
  });
}
