// lib/mcp/agent.ts

import { tools } from "@/app/lib/tools/toolRegistry";
import { toolRouter } from "@/app/lib/tools/toolRouter";
import { ToolInputMap } from "@/app/lib/tools/toolTypes";
import { getMemory, saveMemory } from "@/app/lib/memory/userMemory";
import { cohereV2 } from "@/app/lib/llm/cohere";

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

  console.log("[MCP] Handling user", userId, ":", userMessage);

  // 2. : Call Cohere chat with tools
  const response = await cohereV2.chat({
    model: "command-a-03-2025",
    tools,
    messages: [
      {
        role: "system",
        content:
          "You are a smart assistant. If the user's message matches a tool description, respond with a valid JSON tool call. Otherwise, reply normally.",
      },
      ...fullConversation.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    ],
  });

  const contentArray = response.message?.content;
  const content = contentArray?.[0]?.text?.trim();

  console.log("[MCP] Raw tool candidate content:", content);

  // 3. If tool call is present, try to parse and route it
  if (content) {
    try {
      const parsed = JSON.parse(content);

      if (parsed.tool && parsed.args) {
        const toolFn = toolRouter[parsed.tool as keyof ToolInputMap];

        if (!toolFn) {
          const error = `⚠️ Tool "${parsed.tool}" is not implemented.`;
          await saveMemory(userId, [
            newTurn,
            { role: "assistant", content: error },
          ]);
          return error;
        }

        const result = await toolFn(parsed.args);

        await saveMemory(userId, [
          newTurn,
          { role: "assistant", content: result },
        ]);
        return result;
      }
    } catch (_err) {
      console.warn("[MCP] Failed to parse tool response as JSON");
    }
  }

  // 4. Fallback to RAG if no tool or failed JSON parse
  const fallback = await toolRouter["retrieve_insurance_info"]({
    query: userMessage,
  });

  await saveMemory(userId, [newTurn, { role: "assistant", content: fallback }]);
  return fallback;
}
