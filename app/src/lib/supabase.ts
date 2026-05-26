import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MOCK_AUTH } from "../constants/devConfig";

const SUPABASE_URL = "https://rpvdoxbrhprmeqdievgf.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_W2ahdI2AIOOv22RaOamwCA__WBpTcHT";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: MOCK_AUTH ? undefined : AsyncStorage,
    autoRefreshToken: !MOCK_AUTH,
    persistSession: !MOCK_AUTH,
    detectSessionInUrl: false,
  },
});
