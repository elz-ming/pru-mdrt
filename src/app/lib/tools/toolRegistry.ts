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
          a: { type: "number", description: "The first number" },
          b: { type: "number", description: "The second number" },
        },
        required: ["a", "b"],
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
          x: { type: "number", description: "The first number" },
          y: { type: "number", description: "The second number" },
        },
        required: ["x", "y"],
      },
    },
  },
];
