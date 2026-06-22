import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { "Content-Type": "application/json" },
});

export async function streamChat(
  messages: { role: string; content: string }[],
  conversationId: string | undefined,
  onChunk: (text: string) => void,
  onDone: (conversationId: string) => void,
  onError: (error: string) => void,
  courseContext?: { courseId?: string; courseTitle?: string }
) {
  const response = await fetch(`${API_URL}/api/ai/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, conversationId, courseContext }),
  });

  if (!response.ok) {
    onError(`Request failed: ${response.status}`);
    return;
  }

  const reader = response.body?.getReader();
  if (!reader) {
    onError("No response stream");
    return;
  }

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          const data = JSON.parse(line.slice(6));
          if (data.type === "chunk") onChunk(data.content);
          else if (data.type === "done") onDone(data.conversationId);
          else if (data.type === "error") onError(data.error);
        } catch {
          /* ignore parse errors */
        }
      }
    }
  }
}
