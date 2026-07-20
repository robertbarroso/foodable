import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
);

console.log("URL exists:", !!process.env.SUPABASE_URL);
console.log("Service key exists:", !!process.env.SUPABASE_SERVICE_KEY);

export default supabase;
