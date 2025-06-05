import { MongoClient } from "mongodb";

const mongo = new MongoClient(process.env.MONGO_URI!);
const db = mongo.db("chatbot_history");
export const chatbotMemoryCollection = db.collection<{
  userId: string;
  history: { role: "user" | "assistant"; content: string }[];
}>("user_memory");
