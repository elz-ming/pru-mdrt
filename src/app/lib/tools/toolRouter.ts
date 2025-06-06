import {
  AddTwoNumbersInput,
  MultiplyTwoNumbersInput,
  RetrieveInsuranceInfoInput,
} from "./toolTypes";
import { insuranceRAG } from "@/app/lib/rag/insuranceRAG";

export const toolRouter = {
  add_two_numbers: ({ num1, num2 }: AddTwoNumbersInput) =>
    `✅ Result: ${num1 + num2}`,

  multiply_two_numbers: ({ num1, num2 }: MultiplyTwoNumbersInput) =>
    `✅ Result: ${num1 * num2}`,

  retrieve_insurance_info: async ({ query }: RetrieveInsuranceInfoInput) => {
    return await insuranceRAG(query);
  },
};
