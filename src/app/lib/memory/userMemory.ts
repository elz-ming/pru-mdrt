// lib/memory/userMemory.ts
import { MongoClient } from "mongodb";

const mongo = new MongoClient(process.env.MONGO_URI!);
const db = mongo.db("chatbot_history");
const collection = db.collection<{
  userId: string;
  history: { role: "user" | "assistant"; content: string }[];
}>("user_memory");

export async function getMemory(userId: string) {
  const doc = await collection.findOne({ userId });
  return doc?.history?.slice(-10) ?? [];
}

export async function saveMemory(
  userId: string,
  newTurns: { role: "user" | "assistant"; content: string }[]
) {
  const doc = await collection.findOne({ userId });
  const updated = [...(doc?.history ?? []), ...newTurns].slice(-10);

  await collection.updateOne(
    { userId },
    { $set: { history: updated } },
    { upsert: true }
  );
}
