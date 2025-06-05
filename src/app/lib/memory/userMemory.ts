import { MongoClient } from "mongodb";

const mongo = new MongoClient(process.env.MONGO_URI!);
const db = mongo.db("chatbot_history");

const collection = db.collection<{
  sessionId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  history: { role: "user" | "assistant"; content: string }[];
}>("user_memory");

function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now();
}

const SESSION_EXPIRY_MINUTES = 10;

export async function getSession(userId: string): Promise<string> {
  const now = new Date();
  const cutoff = new Date(
    now.getTime() - SESSION_EXPIRY_MINUTES * 60000
  ).toISOString();

  const existing = await collection.findOne({
    userId,
    updatedAt: { $gte: cutoff },
  });

  if (existing) {
    return existing.sessionId;
  }

  // Start a new session
  const sessionId = generateSessionId();
  const timestamp = now.toISOString();

  await collection.insertOne({
    sessionId,
    userId,
    createdAt: timestamp,
    updatedAt: timestamp,
    history: [],
  });

  return sessionId;
}

export async function getMemory(sessionId: string) {
  const doc = await collection.findOne({ sessionId });
  return doc?.history?.slice(-10) ?? [];
}

export async function saveMemory(
  sessionId: string,
  newTurns: { role: "user" | "assistant"; content: string }[]
) {
  const doc = await collection.findOne({ sessionId });
  const updated = [...(doc?.history ?? []), ...newTurns].slice(-10);

  await collection.updateOne(
    { sessionId },
    {
      $set: {
        history: updated,
        updatedAt: new Date().toISOString(),
      },
    },
    { upsert: true }
  );
}
