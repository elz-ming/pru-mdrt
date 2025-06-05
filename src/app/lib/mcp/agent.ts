// lib/mcp/agent.ts

import { tools } from "@/app/lib/tools/toolRegistry";
import { toolRouter } from "@/app/lib/tools/toolRouter";
import { ToolInputMap } from "@/app/lib/tools/toolTypes";
import { getMemory, saveMemory } from "@/app/lib/memory/userMemory";
import { cohereV2 } from "@/app/lib/llm/cohere"; // wrap this if you haven’t yet

type Role = "user" | "assistant";

type MemoryMessage = {
  role: Role;
  content: string;
};

export async function handleMCP({
  userId,
  userMessage,
}: {
  userId: string;
  userMessage: string;
}): Promise<string> {
  // 1. Get last 10 messages from memory
  const memory: MemoryMessage[] = await getMemory(userId);
  const newTurn: MemoryMessage = { role: "user", content: userMessage };
  const fullConversation: MemoryMessage[] = [...memory, newTurn];

  // 2. Ask LLM whether to call a tool
  const toolCallPrompt = `
You are a smart assistant with access to tools. If the user's message matches a tool, respond in JSON format like:
{
  "tool": "<tool_name>",
  "args": { ... }
}
Else, answer naturally.

Available tools:
${tools.map((t) => `- ${t.name}: ${t.description}`).join("\n")}

User message: ${userMessage}
`;

  const response = await cohereV2.chat({
    model: "command-a-03-2025",
    messages: [
      {
        role: "system",
        content:
          "You are an assistant who helps users by either answering naturally or calling tools.",
      },
      ...fullConversation.map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: toolCallPrompt },
    ],
  });

  const contentArray = response.message?.content;
  const content = contentArray?.[0]?.text?.trim();

  if (!content) return "❌ No response from LLM.";

  // 3. Try to parse as a tool call
  try {
    const parsed = JSON.parse(content);

    if (parsed.tool && parsed.args) {
      const toolFn = toolRouter[parsed.tool as keyof ToolInputMap];

      if (!toolFn) {
        return `⚠️ Tool "${parsed.tool}" is not implemented.`;
      }

      const result = toolFn(parsed.args);

      // 4. Save both turns to memory
      await saveMemory(userId, [
        newTurn,
        { role: "assistant", content: result },
      ]);

      return result;
    }
  } catch {
    // Not a tool call, treat as natural language
  }

  // 5. Save user + assistant messages as normal
  await saveMemory(userId, [newTurn, { role: "assistant", content }]);

  return content;
}
