import { Keypair } from "@solana/web3.js";
import * as SecureStore from "expo-secure-store";
import * as LocalAuth from "expo-local-authentication";

const WALLET_KEY = "wallet_secret";

export async function createWallet(): Promise<string> {
  const keypair = Keypair.generate();
  await SecureStore.setItemAsync(
    WALLET_KEY,
    JSON.stringify([...keypair.secretKey]),
  );
  return keypair.publicKey.toBase58();
}

export async function loadWallet(): Promise<Keypair> {
  const auth = await LocalAuth.authenticateAsync({
    promptMessage: "Confirme pra acessar sua carteira",
  });
  if (!auth.success) throw new Error("Biometria negada");

  const raw = await SecureStore.getItemAsync(WALLET_KEY);
  if (!raw) throw new Error("Wallet não encontrada");
  return Keypair.fromSecretKey(new Uint8Array(JSON.parse(raw)));
}

export async function getPublicKey(): Promise<string | null> {
  const raw = await SecureStore.getItemAsync(WALLET_KEY);
  if (!raw) return null;
  const kp = Keypair.fromSecretKey(new Uint8Array(JSON.parse(raw)));
  return kp.publicKey.toBase58();
}

export async function hasWallet(): Promise<boolean> {
  const raw = await SecureStore.getItemAsync(WALLET_KEY);
  return raw !== null;
}
