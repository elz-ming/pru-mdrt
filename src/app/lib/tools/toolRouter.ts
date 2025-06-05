import { ToolInputMap } from "./toolTypes";

export const toolRouter: {
  [K in keyof ToolInputMap]: (args: ToolInputMap[K]) => string;
} = {
  add_two_numbers: ({ num1, num2 }: { num1: number; num2: number }) => {
    return `The result of ${num1} + ${num2} is ${num1 + num2}.`;
  },
  multiply_two_numbers: ({ num1, num2 }: { num1: number; num2: number }) => {
    return `The result of ${num1} × ${num2} is ${num1 * num2}.`;
  },
};
