// IMPORTANT: must be first — polyfills globalThis.crypto for Hermes (jose/Supabase/Privy)
import "react-native-get-random-values";
import * as WebBrowser from "expo-web-browser";
import { LogBox } from "react-native";

// Silence Privy's noisy token auto-refresh error when AsyncStorage native module
// isn't in the dev build. Cosmetic only — remove after rebuilding with async-storage.
const SILENCED = ["Auto refresh tick failed", "AsyncStorageError", "cannot access legacy storage"];
LogBox.ignoreLogs(SILENCED);
const shouldSilence = (args) =>
  args.some((a) => typeof a === "string" && SILENCED.some((s) => a.includes(s)));
const originalError = console.error;
console.error = (...args) => {
  if (shouldSilence(args)) return;
  originalError(...args);
};
const originalWarn = console.warn;
console.warn = (...args) => {
  if (shouldSilence(args)) return;
  originalWarn(...args);
};

WebBrowser.maybeCompleteAuthSession();

import { registerRootComponent } from "expo";
import App from "./App";

registerRootComponent(App);
