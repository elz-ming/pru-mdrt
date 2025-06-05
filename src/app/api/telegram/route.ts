import supabaseAdmin from "@/app/lib/supabaseAdmin";
import { validateData } from "@/app/lib/validateData";
import { Telegraf } from "telegraf";
import { NextRequest } from "next/server";
import { handleMCP } from "@/app/lib/mcp/agent";

// === Initialize Bot ===
const bot = new Telegraf(process.env.BOT_TOKEN!);

// Commands
bot.command("start", async (ctx) => {
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
      "Welcome to PruMDRT Bot! 🚀\n\nThis is a prototype create by Team 1B. All data are artificial and solely for demonstration purpose.\n\n";
  } else {
    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update({ updated_at: new Date().toISOString() })
      .eq("encoded_id", encodedUserId);

    if (updateError) console.error("UPDATE error:", updateError);

    response =
      "Welcome BACK to PruMDRT Bot! 🚀\n\nThis is a prototype create by Team 1B. All data are artificial and solely for demonstration purpose.\n\n";
  }

  response += "Click the button below to open the web app:";

  await validateData(encodedUserId);

  ctx.reply(response, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Open App",
            url: `${process.env.WEBAPP_URL!}?startapp=${encodedUserId}`,
          },
        ],
      ],
    },
  });
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
            url: `${process.env.WEBAPP_URL!}?startapp=${encodedUserId}`,
          },
        ],
      ],
    },
  });
});

// Respond to any plain text message
bot.on("text", async (ctx) => {
  const userId = ctx.from?.id?.toString() ?? "";
  const encodedUserId = Buffer.from(userId).toString("base64");
  const userMessage = ctx.message.text;

  const reply = await handleMCP({
    userId: encodedUserId,
    userMessage,
  });

  ctx.reply(reply);
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
