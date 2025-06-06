import supabaseAdmin from "@/app/lib/supabaseAdmin";
import { validateData } from "@/app/lib/validateData";
import { Telegraf } from "telegraf";
import { NextRequest } from "next/server";
import { put } from "@vercel/blob";

// === Initialize Bot ===
const bot = new Telegraf(process.env.BOT_TOKEN!);
const TELEGRAM_API_BASE = `https://api.telegram.org/bot${process.env.BOT_TOKEN}`;

// Commands
bot.command("start", async (ctx) => {
  const userId = ctx.from?.id?.toString() ?? "";
  const username = ctx.from?.username ?? "";
  const encodedUserId = Buffer.from(userId).toString("base64");

  const firstName = ctx.from?.first_name ?? "";
  const lastName = ctx.from?.last_name ?? "";
  const displayName = `${firstName} ${lastName}`.trim();

  let response: string;

  // Check if user exists
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("encoded_id", encodedUserId)
    .maybeSingle();

  if (error) console.error("SELECT error:", error);

  // If not exist, insert new user
  if (error || !data) {
    // === Try to fetch Telegram profile photo ===
    let profilePicUrl: string | null = null;

    try {
      const photosRes = await fetch(
        `${TELEGRAM_API_BASE}/getUserProfilePhotos?user_id=${userId}&limit=1`
      );
      const photosData = await photosRes.json();
      const fileId = photosData.result?.photos?.[0]?.[0]?.file_id;

      if (fileId) {
        const filePathRes = await fetch(
          `${TELEGRAM_API_BASE}/getFile?file_id=${fileId}`
        );
        const filePathData = await filePathRes.json();
        const filePath = filePathData.result.file_path;
        const fileUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${filePath}`;

        const fileResponse = await fetch(fileUrl);
        const buffer = Buffer.from(await fileResponse.arrayBuffer());

        const uploaded = await put(`${encodedUserId}.jpg`, buffer, {
          access: "public",
          allowOverwrite: true,
        });

        profilePicUrl = uploaded.url;
      }
    } catch (err) {
      console.warn("⚠️ Could not fetch or upload Telegram profile photo:", err);
    }

    const { error: insertError } = await supabaseAdmin.from("users").insert([
      {
        encoded_id: encodedUserId,
        telegram_username: username,
        display_name: displayName,
        profile_pic_url: profilePicUrl,
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
