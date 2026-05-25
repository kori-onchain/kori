import { Keypair } from "@solana/web3.js"

const WALLET_KEY = "wallet_secret"

export function createWallet(): string {
  const keypair = Keypair.generate()
  localStorage.setItem(WALLET_KEY, JSON.stringify([...keypair.secretKey]))
  return keypair.publicKey.toBase58()
}

export function getPublicKey(): string | null {
  const raw = localStorage.getItem(WALLET_KEY)
  if (!raw) return null
  const kp = Keypair.fromSecretKey(new Uint8Array(JSON.parse(raw)))
  return kp.publicKey.toBase58()
}

export function hasWallet(): boolean {
  return localStorage.getItem(WALLET_KEY) !== null
}
