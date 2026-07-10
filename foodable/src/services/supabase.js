import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Validation for url/keys

if (!supabaseUrl || !supabaseKey) {
  throw new Error("ERROR: Supabase environment variables are missing (.env)");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
