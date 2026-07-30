import React, { useState } from "react";
import { MessageSquare, Send } from "lucide-react";

interface Message {
  role: string;
  text: string;
}

export const CopilotSidebar: React.FC = () => {
  const [copilotQuery, setCopilotQuery] = useState<string>("");
  const [copilotMessages, setCopilotMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hello! I'm your RAG Brand Copilot connected to Pinecone. Ask me anything about the Samsung Visual Identity guidelines or logo placement rules.",
    },
  ]);

  const handleSendCopilot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotQuery.trim()) return;
    const userMsg = copilotQuery;
    setCopilotMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setCopilotQuery("");

    setTimeout(() => {
      let reply =
        "Based on section 4.2 of the Samsung Visual Identity guidelines stored in Pinecone, maintain a minimum clear space equal to 2x the height of the Samsung wordmark.";
      if (
        userMsg.toLowerCase().includes("french") ||
        userMsg.toLowerCase().includes("canada")
      ) {
        reply =
          "For Canadian French localization, colloquial tech phrasing must adhere to OQLF guidelines while retaining global campaign punchiness.";
      }
      setCopilotMessages((prev) => [
        ...prev,
        { role: "assistant", text: reply },
      ]);
    }, 800);
  };

  return (
    <div className="flex flex-col h-[520px] justify-between">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <h3 className="text-sm font-medium text-zinc-200 flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-blue-400" />
          Chat-with-the-Brief Copilot
        </h3>
        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
          RAG Live
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1 text-xs">
        {copilotMessages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`p-3 rounded-xl max-w-[85%] ${msg.role === "user" ? "bg-[#1428a0] text-white" : "bg-zinc-950 border border-zinc-800 text-zinc-300"}`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSendCopilot}
        className="pt-2 border-t border-zinc-800 flex items-center gap-2"
      >
        <input
          type="text"
          value={copilotQuery}
          onChange={(e) => setCopilotQuery(e.target.value)}
          placeholder="Ask about logo whitespace, fonts, rules..."
          className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-[#1428a0]"
        />
        <button
          type="submit"
          className="bg-[#1428a0] hover:bg-[#0057b8] text-white p-2.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-[#1428a0]/20"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  );
};