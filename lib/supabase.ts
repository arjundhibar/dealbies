import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables");
}

let supabaseInstance: ReturnType<typeof createClient> | null = null;

// Helper function to check if error is a network error
export function isNetworkError(error: any): boolean {
  if (!error) return false;
  const errorMessage = error.message?.toLowerCase() || "";
  const errorString = String(error).toLowerCase();
  return (
    errorMessage.includes("failed to fetch") ||
    errorMessage.includes("network") ||
    errorMessage.includes("name_not_resolved") ||
    errorString.includes("err_name_not_resolved") ||
    errorMessage.includes("networkerror") ||
    errorMessage.includes("network request failed") ||
    errorMessage.includes("load failed")
  );
}

export function getSupabase(token?: string) {
  const baseOptions = {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: typeof window !== "undefined" ? window.localStorage : undefined,
      flowType: "pkce" as const,
    },
  };

  if (token) {
    return createClient(supabaseUrl, supabaseAnonKey, {
      ...baseOptions,
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
  }
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, baseOptions);
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
