import { ChatAssistant } from "@/components/chat/chat-assistant";

export default function ChatPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">AI Tutor</h1>
      <p className="text-muted-foreground mb-6">
        Your personal learning assistant — ask about any tech topic or course material.
      </p>
      <ChatAssistant className="min-h-[600px]" />
    </div>
  );
}
