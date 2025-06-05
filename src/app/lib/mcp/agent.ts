// lib/mcp/agent.ts

import { tools } from "@/app/lib/tools/toolRegistry";
import { toolRouter } from "@/app/lib/tools/toolRouter";
import { ToolInputMap } from "@/app/lib/tools/toolTypes";
import { getMemory, saveMemory } from "@/app/lib/memory/userMemory";
import { cohereV2 } from "@/app/lib/llm/cohere";
import { fallbackRAG } from "@/app/lib/rag/fallbackRAG";

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

  // 2. : Call Cohere chat with tools
  const response = await cohereV2.chat({
    model: "command-a-03-2025",
    tools, // tools must follow Cohere's { type: 'function', function: {...} } format
    messages: [
      {
        role: "system",
        content:
          "You are an assistant who helps users by either answering naturally or calling tools.",
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

  // 3.1. If no tool call, fallback
  if (!content) {
    const fallback = await fallbackRAG(userMessage);
    await saveMemory(userId, [
      newTurn,
      { role: "assistant", content: fallback },
    ]);
    return fallback;
  }

  console.log("[MCP] Raw tool candidate content:", content);

  // 3.2 Try to parse as a tool call
  try {
    const parsed = JSON.parse(content);

    if (parsed.tool && parsed.args) {
      const toolFn = toolRouter[parsed.tool as keyof ToolInputMap];

      if (!toolFn) {
        const fallback = `⚠️ Tool "${parsed.tool}" is not implemented.`;
        await saveMemory(userId, [
          newTurn,
          { role: "assistant", content: fallback },
        ]);
        return fallback;
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
    // Not a valid JSON, fallback to RAG
  }

  // 2. If it's just natural language or parsing fails, fallback to RAG
  const ragReply = await fallbackRAG(userMessage);
  await saveMemory(userId, [newTurn, { role: "assistant", content: ragReply }]);
  return ragReply;
}
