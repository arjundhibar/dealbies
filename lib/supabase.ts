import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables");
}

let supabaseInstance: ReturnType<typeof createClient> | null = null;

export function getSupabase(token?: string) {
  if (token) {
    return createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
  }
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
}

export function getSupabaseAdmin() {
  if (!supabaseServiceRoleKey) {
    throw new Error("Missing Supabase admin credentials");
  }
  return createClient(supabaseUrl, supabaseServiceRoleKey);
}

export const supabase = getSupabase(); // for client-side use
