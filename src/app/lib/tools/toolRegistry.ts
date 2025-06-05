export const tools = [
  {
    name: "add_two_numbers",
    description: "Adds two numbers and returns the result.",
    parameters: {
      type: "object",
      properties: {
        a: {
          type: "number",
          description: "The first number to add",
        },
        b: {
          type: "number",
          description: "The second number to add",
        },
      },
      required: ["a", "b"],
    },
  },
  {
    name: "multiply_two_numbers",
    description: "Multiplies two numbers and returns the result.",
    parameters: {
      type: "object",
      properties: {
        x: {
          type: "number",
          description: "The first number to multiply",
        },
        y: {
          type: "number",
          description: "The second number to multiply",
        },
      },
      required: ["a", "b"],
    },
  },
];
