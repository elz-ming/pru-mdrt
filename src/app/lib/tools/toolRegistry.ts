// lib/tools/toolRegistry.ts

type ToolDefinition = {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: {
      type: "object";
      properties: Record<string, { type: string; description: string }>;
      required?: string[];
    };
  };
};

export const tools: ToolDefinition[] = [
  {
    type: "function",
    function: {
      name: "add_two_numbers",
      description: "Adds two numbers and returns the result.",
      parameters: {
        type: "object",
        properties: {
          num1: { type: "number", description: "The first number" },
          num2: { type: "number", description: "The second number" },
        },
        required: ["num1", "num2"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "multiply_two_numbers",
      description: "Multiplies two numbers and returns the result.",
      parameters: {
        type: "object",
        properties: {
          num1: { type: "number", description: "The first number" },
          num2: { type: "number", description: "The second number" },
        },
        required: ["num1", "num2"],
      },
    },
  },
];
