const { Telegraf } = require("telegraf");
const { TEST_BOT_TOKEN, supabaseAdmin } = require("./config");

// === Initialize Bot ===
const bot = new Telegraf(TEST_BOT_TOKEN);

const TIERS = ["bronze", "silver", "gold", "MDRT", "COT", "TOT"];
const DEMO_MILESTONES = ["followup_pro", "crm_master", "sales_closer"];

async function validateData(encodedUserId: string) {
  console.log(`✅ Validating demo data for: ${encodedUserId}`);

  // STEP 1: Assign random tier if missing
  const { data: userData, error: userFetchError } = await supabaseAdmin
    .from("users")
    .select("tier")
    .eq("encoded_id", encodedUserId)
    .single();

  if (!userFetchError && userData && !userData.tier) {
    const randomTier = TIERS[Math.floor(Math.random() * TIERS.length)];
    await supabaseAdmin
      .from("users")
      .update({ tier: randomTier })
      .eq("encoded_id", encodedUserId);
    console.log(`🎖️ Assigned tier "${randomTier}" to user.`);
  }

  // STEP 2: Insert demo user_milestones if not exists
  const { data: progressData, error: progressError } = await supabaseAdmin
    .from("user_milestones")
    .select("milestone_name")
    .eq("user_encoded_id", encodedUserId);

  if (!progressError && progressData.length === 0) {
    const demoProgress = DEMO_MILESTONES.slice(0, 2).map((name) => ({
      user_encoded_id: encodedUserId,
      milestone_name: name,
      completed_at: new Date().toISOString(),
    }));

    await supabaseAdmin.from("user_milestones").insert(demoProgress);
    console.log(`🏅 Inserted demo milestones for user.`);
  }

  // STEP 3: Add any future validations here
}

// Commands
bot.command("start", async (ctx: any) => {
  const userId = ctx.from?.id?.toString() ?? "";
  const username = ctx.from?.username ?? "";
  const encodedUserId = Buffer.from(userId).toString("base64");

  const photos = await ctx.telegram.getUserProfilePhotos(userId);

  if (photos.total_count === 0) {
    return ctx.reply("You don't have a Telegram profile photo.");
  }

  const fileId = photos.photos[0][0].file_id;
  const file = await ctx.telegram.getFile(fileId);
  const fileUrl = `https://api.telegram.org/file/bot${TEST_BOT_TOKEN}/${file.file_path}`;

  console.log(fileUrl);

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

  // await validateData(encodedUserId);

  ctx.reply(response);
});

bot.launch().then(() => {
  console.log("Bot is running...");
});

// Enable graceful stopAdd commentMore actions
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
