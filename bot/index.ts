const { Telegraf } = require("telegraf");
const { TEST_BOT_TOKEN, supabaseAdmin } = require("./config");

// === Initialize Bot ===
const bot = new Telegraf(TEST_BOT_TOKEN);

// Commands
bot.command("start", async (ctx: any) => {
  const userId = ctx.from?.id?.toString() ?? "";
  const username = ctx.from?.username ?? "";
  const encodedUserId = Buffer.from(userId).toString("base64");

  let response: string;

  // Check if user exists
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("encoded_id", encodedUserId)
    .single();

  if (error) console.error("SELECT error:", error);

  // If not exist, insert new user
  if (error || !data) {
    const { error: insertError } = await supabaseAdmin.from("users").insert([
      {
        encoded_id: encodedUserId,
        telegram_username: username,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    if (insertError) console.error("INSERT error:", insertError);

    response =
      "Welcome to PruMDRT Bot! 🚀\n\nThis is a prototype create by Team 1B. All data are artificial and solely for demonstration purpose.\n\nAs a first time user, a profile is created for you:\n\n";
  } else {
    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update({ updated_at: new Date().toISOString() })
      .eq("encoded_id", encodedUserId);

    if (updateError) console.error("UPDATE error:", updateError);

    response =
      "Welcome BACK to PruMDRT Bot! 🚀\n\nThis is a prototype create by Team 1B. All data are artificial and solely for demonstration purpose.\n\nAs a recurring user, your profile is as below:\n\n";
  }

  ctx.reply(response);
});

bot.launch().then(() => {
  console.log("Bot is running...");
});

// Enable graceful stopAdd commentMore actions
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
