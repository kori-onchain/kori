import * as SecureStore from "expo-secure-store";
import * as Crypto from "expo-crypto";

export type SecurityMethod = "digital" | "facial" | "pin";

const PIN_KEY = "kori_pin_hash";
const SECURITY_METHOD_KEY = "kori_security_method";
const BIOMETRIC_LOCK_KEY = "kori_biometric_lock_enabled";

async function hashPin(pin: string): Promise<string> {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `kori_pin_${pin}`,
  );
}

export async function savePin(pin: string): Promise<void> {
  const hash = await hashPin(pin);
  await SecureStore.setItemAsync(PIN_KEY, hash);
}

export async function saveSecurityMethod(method: SecurityMethod): Promise<void> {
  await SecureStore.setItemAsync(SECURITY_METHOD_KEY, method);
}

export async function getSecurityMethod(): Promise<SecurityMethod | null> {
  const method = await SecureStore.getItemAsync(SECURITY_METHOD_KEY);
  return method === "digital" || method === "facial" || method === "pin"
    ? method
    : null;
}

export async function hasSecurityMethod(): Promise<boolean> {
  return (await getSecurityMethod()) !== null;
}

export async function saveBiometricLockEnabled(): Promise<void> {
  await SecureStore.setItemAsync(BIOMETRIC_LOCK_KEY, "true");
}

export async function hasBiometricLockEnabled(): Promise<boolean> {
  const stored = await SecureStore.getItemAsync(BIOMETRIC_LOCK_KEY);
  return stored === "true";
}

export async function clearBiometricLockEnabled(): Promise<void> {
  await SecureStore.deleteItemAsync(BIOMETRIC_LOCK_KEY);
}

export async function verifyPin(pin: string): Promise<boolean> {
  const stored = await SecureStore.getItemAsync(PIN_KEY);
  if (!stored) return false;
  const hash = await hashPin(pin);
  return hash === stored;
}

export async function hasPin(): Promise<boolean> {
  const stored = await SecureStore.getItemAsync(PIN_KEY);
  return stored !== null;
}

export async function clearPin(): Promise<void> {
  await SecureStore.deleteItemAsync(PIN_KEY);
}

export async function clearSecurityMethod(): Promise<void> {
  await SecureStore.deleteItemAsync(SECURITY_METHOD_KEY);
}
