import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Validation for url/keys

if (!supabaseKey || !supabaseKey) {
  throw new Error("ERROR: Supabase environment variables are missing (.env)");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
