import { CohereClient, CohereClientV2 } from "cohere-ai";

// === Initialize Cohere ===
export const cohereV1 = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

export const cohereV2 = new CohereClientV2({
  token: process.env.COHERE_API_KEY,
});
