import { MongoClient } from "mongodb";
import { InsuranceChunk } from "@/app/types/InsuranceChunk"; // adjust path

const mongo = new MongoClient(process.env.MONGO_URI!);
const db = mongo.db("insurance_kb");
export const insuranceChunksCollection =
  db.collection<InsuranceChunk>("chunks");
