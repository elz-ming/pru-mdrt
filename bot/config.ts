const dotenv = require("dotenv");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const SUPABASE_ADMIN = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = {
  TEST_BOT_TOKEN: process.env.TEST_BOT_TOKEN,
  supabaseAdmin: SUPABASE_ADMIN,
};
