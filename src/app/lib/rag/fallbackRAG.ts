// lib/rag/fallbackRAG.ts

import { cohereV1, cohereV2 } from "@/app/lib/llm/cohere";
import { qdrantClient } from "@/app/lib/qdrant/qdrantClient";
import { insuranceChunksCollection } from "@/app/lib/mongo/insuranceChunks";

export async function fallbackRAG(userMessage: string): Promise<string> {
  // Step 1: Get embedding from Cohere
  const embedResponse = await cohereV1.v2.embed({
    texts: [userMessage],
    model: "embed-v4.0",
    inputType: "search_query",
    embeddingTypes: ["float"],
    outputDimension: 1024,
  });

  const queryEmbedding = embedResponse.embeddings?.float?.[0];
  if (!queryEmbedding) {
    return "❌ Failed to generate embedding.";
  }

  // Step 2: Search Qdrant
  const searchResults = await qdrantClient.search("insurance_chunks", {
    vector: queryEmbedding,
    limit: 8,
  });

  const mongoIds = searchResults
    .map((r) => r.payload?.mongo_id)
    .filter((id): id is string => !!id) as string[];

  if (mongoIds.length === 0) {
    return "❌ No relevant documents found.";
  }

  // Step 3: Retrieve full text chunks from MongoDB
  const matchingDocs = await insuranceChunksCollection
    .find({ _id: { $in: mongoIds } })
    .toArray();

  const documents = matchingDocs.map((doc) => ({
    id: doc._id.toString(),
    data: { text: doc.text },
  }));

  // Step 4: Send context to Cohere chat
  const response = await cohereV2.chat({
    model: "command-a-03-2025",
    documents,
    messages: [
      {
        role: "system",
        content: "You are an insurance assistant.",
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
  });

  const contentArray = response.message?.content;

  if (!Array.isArray(contentArray)) {
    return "❌ Unexpected response format.";
  }

  const replyText = contentArray
    .filter((c) => c.type === "text")
    .map((c) => c.text)
    .join(" ")
    .trim();

  return replyText || "🤖 Sorry, no response.";
}
