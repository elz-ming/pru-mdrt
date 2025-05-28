import { createClient } from "@supabase/supabase-js";

// ❗ Only use this server-side: API routes, actions, cron jobs
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, // still the same URL
  process.env.SUPABASE_SERVICE_ROLE_KEY! // private key
);

export default supabaseAdmin;
