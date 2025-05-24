import { Telegraf } from "telegraf";
import { NextRequest } from "next/server";

const bot = new Telegraf(process.env.BOT_TOKEN!);

// Commands
bot.command("start", (ctx) => {
  ctx.reply("Welcome to PruMDRT Bot! 🚀\nUse /help to see available commands.");
});

bot.command("help", (ctx) => {
  ctx.reply(
    "Available commands:\n" +
      "/start - Start the bot\n" +
      "/help - Show this help message\n" +
      "/webapp - Open the Mini App"
  );
});

bot.command("webapp", (ctx) => {
  const chatId = ctx.chat.id;
  const encodedGroupId = Buffer.from(chatId.toString()).toString("base64");
  const webAppUrl = process.env.WEBAPP_URL!;
  ctx.reply("🔓 Open Web App", {
    reply_markup: {
      inline_keyboard: [[{ text: "Just a Button", callback_data: "x" }]],
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
