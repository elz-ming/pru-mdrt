const { Telegraf } = require("telegraf");
const { CohereClient, CohereClientV2 } = require("cohere-ai");
const { QdrantClient } = require("@qdrant/js-client-rest");
const { MongoClient } = require("mongodb");
const {
  TEST_BOT_TOKEN,
  COHERE_API_KEY,
  QDRANT_URL,
  QDRANT_API_KEY,
  MONGO_URI,
} = require("./config");

// === Initialize Bot ===
const bot = new Telegraf(TEST_BOT_TOKEN);

// === Initialize Cohere ===
const cohereV1 = new CohereClient({
  token: COHERE_API_KEY,
});

const cohereV2 = new CohereClientV2({
  token: COHERE_API_KEY,
});

// === Initialize Qdrant ===
const qdrant = new QdrantClient({
  url: QDRANT_URL,
  apiKey: QDRANT_API_KEY,
});

// === Initialize MongoDB and get collection ===
const mongo = new MongoClient(MONGO_URI);
let mongo_collection: any;

const connectToMongo = async () => {
  await mongo.connect();
  const mongo_database = mongo.db("insurance_kb");
  mongo_collection = mongo_database.collection("chunks");
};

connectToMongo().then(() => {
  console.log("✅ Connected to MongoDB");
});

// Basic commandsAdd commentMore actions
bot.command("start", (ctx: any) => {
  ctx.reply("Welcome! 🚀\nUse /help to see available commands.");
});

bot.on("text", async (ctx: any) => {
  const userMessage = ctx.message?.text;

  console.log("Received text");

  if (!userMessage) {
    ctx.reply("❌ Message is not text.");
    return;
  }

  // STEP 1: Get the embedding
  const embedResponse = await cohereV1.v2.embed({
    texts: [userMessage],
    model: "embed-v4.0",
    inputType: "search_query",
    embeddingTypes: ["float"],
    output_dimension: 1024,
  });
  const queryEmbedding = embedResponse.embeddings.float[0];

  console.log("Got the embedding");

  // STEP 2: Search Qdrant
  const searchResults = await qdrant.search("insurance_chunks", {
    vector: queryEmbedding,
    limit: 10,
  });

  const mongoIds = searchResults
    .map((r: any) => r.payload?.mongo_id)
    .filter((id: any) => !!id);

  if (mongoIds.length === 0) {
    ctx.reply("❌ No relevant documents found.");
    return;
  }

  console.log("Got the mongoIds from QDrant");

  // STEP 3: Fetch full chunks from MongoDB
  const matchingDocs = await mongo_collection
    .find({ _id: { $in: mongoIds } })
    .toArray();

  const context = matchingDocs.map((doc: any) => doc.text).join("\n\n");

  console.log("Got the mongoDocs from MongoDB");

  // // STEP 4: Send context + message to Cohere
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

  const replyText = response.message.content
    .filter((c: any) => c.type === "text")
    .map((c: any) => c.text)
    .join(" ")
    .trim();

  ctx.reply(replyText || "🤖 Sorry, no response.");
});

bot.launch().then(() => {
  console.log("Bot is running...");
});

// Enable graceful stopAdd commentMore actions
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
