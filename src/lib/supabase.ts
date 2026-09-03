import { createClient } from "@supabase/supabase-js";

// Read from import.meta.env as this will be used by Vite/React code.
const supabaseUrl = import.meta.env["VITE_SUPABASE_URL"];
const supabaseAnonKey = import.meta.env["VITE_SUPABASE_ANON_KEY"];

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase URL or Anon Key in environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
