import { Telegraf } from "telegraf";
import "dotenv/config";

const bot = new Telegraf(process.env.BOT_TOKEN!);

bot.telegram.setWebhook(`${process.env.WEBAPP_URL}/api/telegram`).then(() => {
  console.log("✅ Webhook set!");
});
