import { ToolInputMap } from "./toolTypes";
import { insuranceRAG } from "@/app/lib/rag/insuranceRAG";

export const toolRouter: {
  [K in keyof ToolInputMap]: (
    args: ToolInputMap[K]
  ) => Promise<string> | string;
} = {
  add_two_numbers: ({ num1, num2 }) => `${num1 + num2}`,
  multiply_two_numbers: ({ num1, num2 }) => `${num1 * num2}`,
  retrieve_insurance_info: async ({ query }) => {
    console.log("[toolRouter] Fallback RAG triggered with:", query);
    return await insuranceRAG(query);
  },
};
