// Cliente HTTP para a API NestJS (mesmo contrato do app mobile).
// Token Privy + headers X-Wallet-Index / X-Account-Type são injetados via getters.

const BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333"
).replace(/\/+$/, "")

let _getToken: (() => Promise<string | null>) | null = null
let _getWalletIndex: (() => number) | null = null
let _getAccountType: (() => "PF" | "PJ") | null = null

export function setPrivyTokenGetter(fn: () => Promise<string | null>) {
  _getToken = fn
}
export function setWalletIndexGetter(fn: () => number) {
  _getWalletIndex = fn
}
export function setAccountTypeGetter(fn: () => "PF" | "PJ") {
  _getAccountType = fn
}
export function setActiveAccountContext(accountType: "PF" | "PJ") {
  const walletIndex = accountType === "PJ" ? 1 : 0
  _getAccountType = () => accountType
  _getWalletIndex = () => walletIndex
}

export class ApiError extends Error {
  status?: number
  path: string
  method: string
  constructor(p: { method: string; path: string; status?: number; message?: string }) {
    super(p.message || `[${p.method} ${p.path}] ${p.status ?? "NETWORK"}`)
    this.name = "ApiError"
    this.method = p.method
    this.path = p.path
    this.status = p.status
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const token = _getToken ? await _getToken() : null
  const walletIndex = _getWalletIndex ? _getWalletIndex() : 0
  const accountType = _getAccountType
    ? _getAccountType()
    : walletIndex === 1
      ? "PJ"
      : "PF"

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Wallet-Index": walletIndex.toString(),
    "X-Account-Type": accountType,
  }
  if (token) headers["Authorization"] = `Bearer ${token}`

  let res: Response
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch (err) {
    throw new ApiError({
      method,
      path,
      message: err instanceof Error ? err.message : "Network request failed",
    })
  }

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new ApiError({ method, path, status: res.status, message: text })
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export const apiClient = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
  put: <T>(path: string, body?: unknown) => request<T>("PUT", path, body),
  patch: <T>(path: string, body?: unknown) => request<T>("PATCH", path, body),
  delete: <T>(path: string) => request<T>("DELETE", path),
  baseUrl: BASE_URL,
}

// ── helpers cents ↔ BRL ──────────────────────────────────────────────
export const centsToBrl = (cents?: number | null) => (cents ?? 0) / 100
export const brlToCents = (brl: number) => Math.round(brl * 100)
