import Constants from "expo-constants";
import { Platform } from "react-native";

const configuredBaseUrl = process.env.EXPO_PUBLIC_API_URL;
const extraApiUrl = (Constants.expoConfig?.extra as any)?.apiUrl;

function hostFromExpo() {
  const candidates = [
    Constants.expoConfig?.hostUri,
    (Constants as any).expoGoConfig?.debuggerHost,
    (Constants.manifest as any)?.debuggerHost,
    (Constants.manifest as any)?.hostUri,
    (Constants.manifest2 as any)?.extra?.expoGo?.debuggerHost,
  ];

  for (const candidate of candidates) {
    if (typeof candidate !== "string" || !candidate.trim()) continue;
    const host = candidate
      .replace(/^https?:\/\//, "")
      .replace(/^exp:\/\//, "")
      .split(":")[0]
      .trim();
    if (host && host !== "localhost" && host !== "127.0.0.1") return host;
  }

  return null;
}

let BASE_URL =
  configuredBaseUrl ||
  (typeof extraApiUrl === "string" ? extraApiUrl : null) ||
  "http://localhost:3333";

if (__DEV__ && !configuredBaseUrl && BASE_URL.includes("localhost")) {
  const devHost = hostFromExpo();

  if (devHost && devHost !== "localhost" && devHost !== "127.0.0.1") {
    BASE_URL = `http://${devHost}:3333`;
  } else if (Platform.OS === "android") {
    BASE_URL = BASE_URL.replace("localhost", "10.0.2.2");
  }
}

// Remove trailing slash to avoid double slashes when concatenating paths (e.g. "//users/...")
BASE_URL = BASE_URL.replace(/\/+$/, "");

if (__DEV__) {
  console.log(`[apiClient] Backend URL: ${BASE_URL}`);
}

let _getToken: (() => Promise<string | null>) | null = null;
let _getWalletIndex: (() => number) | null = null;
let _getAccountType: (() => "PF" | "PJ") | null = null;

export class ApiClientError extends Error {
  status?: number;
  path: string;
  method: string;
  body?: string;

  constructor(params: {
    method: string;
    path: string;
    status?: number;
    body?: string;
    message?: string;
  }) {
    super(
      params.message ||
        `[${params.method} ${params.path}] ${params.status ?? "NETWORK"}: ${
          params.body || "Network request failed"
        }`,
    );
    this.name = "ApiClientError";
    this.method = params.method;
    this.path = params.path;
    this.status = params.status;
    this.body = params.body;
  }
}

export function setPrivyTokenGetter(fn: () => Promise<string | null>) {
  _getToken = fn;
}

export function setWalletIndexGetter(fn: () => number) {
  _getWalletIndex = fn;
}

export function setAccountTypeGetter(fn: () => "PF" | "PJ") {
  _getAccountType = fn;
}

export function setActiveAccountContext(accountType: "PF" | "PJ") {
  const walletIndex = accountType === "PJ" ? 1 : 0;
  _getAccountType = () => accountType;
  _getWalletIndex = () => walletIndex;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const token = _getToken ? await _getToken() : null;
  const walletIndex = _getWalletIndex ? _getWalletIndex() : 0;
  const accountType = _getAccountType ? _getAccountType() : (walletIndex === 1 ? "PJ" : "PF");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Wallet-Index": walletIndex.toString(),
    "X-Account-Type": accountType,
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (error: any) {
    throw new ApiClientError({
      method,
      path,
      message: error?.message || "Network request failed",
    });
  }

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new ApiClientError({ method, path, status: res.status, body: text });
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
  put: <T>(path: string, body?: unknown) => request<T>("PUT", path, body),
  patch: <T>(path: string, body?: unknown) => request<T>("PATCH", path, body),
  delete: <T>(path: string) => request<T>("DELETE", path),
  baseUrl: BASE_URL,
};
