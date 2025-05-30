const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

module.exports = {
  TEST_BOT_TOKEN: process.env.TEST_BOT_TOKEN,
  COHERE_API_KEY: process.env.COHERE_API_KEY,
  QDRANT_URL: process.env.QDRANT_URL,
  QDRANT_API_KEY: process.env.QDRANT_API_KEY,
  MONGO_URI: process.env.MONGO_URI,
};

// const mongo = new MongoClient(process.env.MONGO_URI!);
// await mongo.connect();
// const mongo_database = mongo.db("insurance_kb");
// const mongo_collection = mongo_database.collection<InsuranceChunk>("chunks");

// const qdrant = new QdrantClient({
//   url: process.env.QDRANT_URL!,
//   apiKey: process.env.QDRANT_API_KEY,
// });
