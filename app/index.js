// IMPORTANT: must be first — polyfills globalThis.crypto for Hermes (jose/Supabase/Privy)
import "react-native-get-random-values";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

import { registerRootComponent } from "expo";
import App from "./App";

registerRootComponent(App);
