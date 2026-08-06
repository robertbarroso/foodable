import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Creates a client from Supabase init
// Used for data queries (like posts, profiles of users, etc).
const supabaseService = createClient(supabaseUrl, supabaseServiceKey);

// When we need another one later (primarily for social feed), this will return a new client.
function createSupabaseAuthClient() {
  return createClient(supabaseUrl, supabaseServiceKey);
}

// Debug console logs
console.log("URL exists:", !!supabaseUrl);
console.log("Service key exists:", !!supabaseServiceKey);

export { supabaseService, createSupabaseAuthClient };
export default supabaseService;
