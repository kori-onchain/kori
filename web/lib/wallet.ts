import { Keypair } from "@solana/web3.js"

const WALLET_KEY = "wallet_secret"

function storageKey(userId?: string): string {
  return userId ? `${WALLET_KEY}:${userId}` : WALLET_KEY
}

function readSecret(userId?: string): number[] | null {
  const scoped = localStorage.getItem(storageKey(userId))
  const raw = scoped || localStorage.getItem(WALLET_KEY)
  if (!raw) return null
  return JSON.parse(raw) as number[]
}

export function createWallet(userId?: string): string {
  const keypair = Keypair.generate()
  localStorage.setItem(storageKey(userId), JSON.stringify([...keypair.secretKey]))
  return keypair.publicKey.toBase58()
}

export function getPublicKey(userId?: string): string | null {
  const secret = readSecret(userId)
  if (!secret) return null
  const kp = Keypair.fromSecretKey(new Uint8Array(secret))
  return kp.publicKey.toBase58()
}

export function hasWallet(userId?: string): boolean {
  return readSecret(userId) !== null
}

export function getOrCreateWallet(userId?: string): string {
  return getPublicKey(userId) || createWallet(userId)
}

export function shortWallet(pubkey?: string | null): string {
  if (!pubkey) return "Wallet pendente"
  if (pubkey.length <= 12) return pubkey
  return `${pubkey.slice(0, 4)}...${pubkey.slice(-4)}`
}
