import { Telegraf } from "telegraf";
import { NextRequest } from "next/server";
import { CohereClient } from "cohere-ai";
import { MongoClient } from "mongodb";
import { QdrantClient } from "@qdrant/js-client-rest";

type InsuranceChunk = {
  _id: string;
  company: string;
  text: string;
  source: string;
  chunk_index: number;
};

const bot = new Telegraf(process.env.BOT_TOKEN!);

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

const mongo = new MongoClient(process.env.MONGO_URI!);
await mongo.connect();
const mongo_database = mongo.db("insurance_kb");
const mongo_collection = mongo_database.collection<InsuranceChunk>("chunks");

const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL!,
  apiKey: process.env.QDRANT_API_KEY,
});

// Commands
bot.command("start", async (ctx) => {
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
  const embedResponse = await cohere.embed({
    texts: [userMessage],
    model: "embed-v4.0",
    inputType: "classification",
    embeddingTypes: ["float"],
  });
  const queryEmbedding = (embedResponse.embeddings as number[][])[0];

  console.log(queryEmbedding);

  // STEP 2: Search Qdrant
  const searchResults = await qdrant.search("insurance_chunks", {
    vector: queryEmbedding,
    limit: 10,
  });

  // STEP 3: Fetch full chunks from MongoDB
  const mongoIds = searchResults
    .map((r) => r.payload?.mongo_id)
    .filter((id): id is string => !!id);
  const matchingDocs = await mongo_collection
    .find({ _id: { $in: mongoIds } })
    .toArray();
  const context = matchingDocs.map((doc) => doc.text).join("\n\n");

  // STEP 4: Send context + message to Cohere
  const finalPrompt = `You are an insurance assistant. Answer based on the context below:\n\n${context}\n\nUser: ${userMessage}`;

  const response = await cohere.chat({
    message: finalPrompt,
  });

  ctx.reply(response.text || "🤖 Sorry, no response.");
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
