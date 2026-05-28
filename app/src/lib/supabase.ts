import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MOCK_AUTH } from "../constants/devConfig";

const SUPABASE_URL = "https://rpvdoxbrhprmeqdievgf.supabase.co";
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_ANON_KEY) {
  throw new Error("Missing EXPO_PUBLIC_SUPABASE_ANON_KEY");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: MOCK_AUTH ? undefined : AsyncStorage,
    autoRefreshToken: !MOCK_AUTH,
    persistSession: !MOCK_AUTH,
    detectSessionInUrl: false,
  },
});
