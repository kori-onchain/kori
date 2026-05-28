import { supabase } from "./supabase";

export async function signUpWithEmail(
  email: string,
  password: string,
  metadata?: {
    name?: string;
    username?: string;
    account_type?: "PF" | "PJ";
    business_name?: string;
  },
) {
  return supabase.auth.signUp({
    email,
    password,
    options: metadata ? { data: metadata } : undefined,
  });
}

export async function signInWithEmail(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function resendSignupEmail(email: string) {
  return supabase.auth.resend({ type: "signup", email });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function getSession() {
  return supabase.auth.getSession();
}

export async function upsertProfile(
  userId: string,
  data: {
    name?: string;
    username?: string;
    account_type?: "PF" | "PJ";
    business_name?: string;
    wallet_pubkey?: string;
  },
) {
  return supabase.from("profiles").upsert({ id: userId, ...data });
}

export async function updateProfile(
  userId: string,
  data: {
    name?: string;
    username?: string;
    account_type?: "PF" | "PJ";
    business_name?: string;
    wallet_pubkey?: string;
  },
) {
  return supabase.from("profiles").update(data).eq("id", userId);
}

export async function getProfile(userId: string) {
  return supabase
    .from("profiles")
    .select("name, username, account_type, business_name, wallet_pubkey")
    .eq("id", userId)
    .single();
}
