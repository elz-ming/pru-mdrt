import supabaseAdmin from "@/app/lib/supabaseAdmin";

import { Telegraf } from "telegraf";
import { NextRequest } from "next/server";
import { CohereClient, CohereClientV2 } from "cohere-ai";
import { MongoClient } from "mongodb";
import { QdrantClient } from "@qdrant/js-client-rest";

type InsuranceChunk = {
  _id: string;
  company: string;
  text: string;
  source: string;
  chunk_index: number;
};

// === Initialize Bot ===
const bot = new Telegraf(process.env.BOT_TOKEN!);

// === Initialize Cohere ===
const cohereV1 = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

const cohereV2 = new CohereClientV2({
  token: process.env.COHERE_API_KEY,
});

// === Initialize Qdrant ===
const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL!,
  apiKey: process.env.QDRANT_API_KEY,
});

// === Initialize MongoDB and get collection ===
const mongo = new MongoClient(process.env.MONGO_URI!);
await mongo.connect();
const mongo_database = mongo.db("insurance_kb");
const mongo_collection = mongo_database.collection<InsuranceChunk>("chunks");

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
  const userMessage = ctx.message.text;

  // STEP 1: Get the embedding
  const embedResponse = await cohereV1.v2.embed({
    texts: [userMessage],
    model: "embed-v4.0",
    inputType: "search_query",
    embeddingTypes: ["float"],
    outputDimension: 1024,
  });
  const queryEmbedding = embedResponse.embeddings?.float?.[0];

  if (!queryEmbedding) {
    ctx.reply("❌ Failed to generate embedding.");
    return;
  }

  console.log(queryEmbedding);

  // STEP 2: Search Qdrant
  const searchResults = await qdrant.search("insurance_chunks", {
    vector: queryEmbedding,
    limit: 10,
  });

  const mongoIds = searchResults
    .map((r) => r.payload?.mongo_id)
    .filter((id): id is string => !!id) as string[];

  if (mongoIds.length === 0) {
    ctx.reply("❌ No relevant documents found.");
    return;
  }

  console.log("Got the mongoIds from QDrant");

  // STEP 3: Fetch full chunks from MongoDB
  const matchingDocs = await mongo_collection
    .find({ _id: { $in: mongoIds } })
    .toArray();

  const context = matchingDocs.map((doc) => doc.text).join("\n\n");

  console.log("Got the mongoDocs from MongoDB");

  // STEP 4: Send context + message to Cohere
  const finalPrompt = `Answer based on the context below:\n\n${context}\n\nUser: ${userMessage}`;

  const response = await cohereV2.chat({
    model: "command-a-03-2025",
    messages: [
      {
        role: "system",
        content:
          "You are an insurance assistant. Keep your responses short and to the point.",
      },
      { role: "user", content: finalPrompt },
    ],
  });

  const contentArray = response.message?.content;

  if (!Array.isArray(contentArray)) {
    ctx.reply("❌ Unexpected response format.");
    return;
  }

  const replyText = contentArray
    .filter((c) => c.type === "text")
    .map((c) => c.text)
    .join(" ")
    .trim();

  ctx.reply(replyText || "🤖 Sorry, no response.");
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
