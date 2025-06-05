import { ToolInputMap } from "./toolTypes";

export const toolRouter: {
  [K in keyof ToolInputMap]: (args: ToolInputMap[K]) => string;
} = {
  add_two_numbers: ({ a, b }: { a: number; b: number }) => {
    return `The result of ${a} + ${b} is ${a + b}.`;
  },
  multiply_two_numbers: ({ a, b }: { a: number; b: number }) => {
    return `The result of ${a} × ${b} is ${a * b}.`;
  },
};
