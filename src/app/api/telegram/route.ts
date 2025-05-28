import { Telegraf } from "telegraf";
import { NextRequest } from "next/server";

const bot = new Telegraf(process.env.BOT_TOKEN!);
const webAppUrl = process.env.WEBAPP_URL!;
const syncUserUrl = `${process.env.SITE_URL}/api/sync-user`;

// Commands
bot.command("start", async (ctx) => {
  const telegramUser = ctx.from;
  if (!telegramUser) return;

  const userId = telegramUser.id.toString();
  const encodedUserId = Buffer.from(userId).toString("base64");

  // 🔽 Call your own API to insert this user into Supabase
  try {
    await fetch(syncUserUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        telegramId: telegramUser.id,
        encodedId: encodedUserId,
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name,
        username: telegramUser.username,
        languageCode: telegramUser.language_code,
      }),
    });
  } catch (err) {
    console.error("❌ Failed to sync user with Supabase:", err);
  }

  ctx.reply("Welcome to PruMDRT Bot! 🚀\nUse /webapp to open the Mini App.");
});

bot.command("webapp", (ctx) => {
  const userId = ctx.from?.id?.toString() ?? "";
  const encodedUserId = Buffer.from(userId).toString("base64");

  ctx.reply("🔓 Open Web App", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Open App",
            url: `${webAppUrl}?startapp=${encodedUserId}`,
          },
        ],
      ],
    },
  });
});

// Handle Telegram POST updates
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("🔥 Telegram update received:", JSON.stringify(body, null, 2));
    await bot.handleUpdate(body);
    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("Telegram bot error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// Optional GET for Vercel check
export function GET() {
  return new Response("🤖 Telegram webhook is live.");
}
