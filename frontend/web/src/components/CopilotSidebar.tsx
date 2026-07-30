import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Bot, User, Compass } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const QUICK_PROMPTS = [
  "What are the logo clear space rules?",
  "French Canadian translation guidelines?",
  "Nightography asset tone requirements?"
];

export const CopilotSidebar: React.FC = () => {
  const [copilotQuery, setCopilotQuery] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [copilotMessages, setCopilotMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hello! I'm your RAG Brand Copilot connected to Pinecone. Ask me anything about the Samsung Visual Identity guidelines.",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [copilotMessages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || copilotQuery;
    if (!query.trim()) return;

    const userMsg = query;
    setCopilotMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    if (!textToSend) setCopilotQuery("");
    setIsTyping(true);

    try {
      const res = await fetch("https://literate-fishstick-77pp49g4v45hx4w-8000.app.github.dev/api/copilot-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userMsg }),
      });

      const data = await res.json();
      let replyText = data.reply || "• Ensure standard brand guideline compliance.";

      setIsTyping(false);
      setCopilotMessages((prev) => [
        ...prev,
        { role: "assistant", text: replyText },
      ]);
    } catch (err) {
      setIsTyping(false);
      setCopilotMessages((prev) => [
        ...prev,
        { role: "assistant", text: "• Error connecting to RAG backend vector store." },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-[520px] max-h-[520px] bg-zinc-950/80 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-4 shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-zinc-100 flex items-center gap-1.5">
              Chat-with-the-Brief Copilot
            </h3>
            <p className="text-[10px] text-zinc-400">Pinecone RAG Active</p>
          </div>
        </div>
        <span className="flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          Live
        </span>
      </div>

      <div 
        ref={chatContainerRef}
        className="flex-1 min-h-0 overflow-y-auto space-y-3.5 py-3 pr-1 text-xs [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-zinc-800 [&::-webkit-scrollbar-thumb]:rounded-full"
      >
        {copilotMessages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`flex items-start gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${
              msg.role === "user" 
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30" 
                : "bg-zinc-800 border border-zinc-700 text-blue-400"
            }`}>
              {msg.role === "user" ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
            </div>

            <div
              className={`p-3 rounded-2xl max-w-[80%] leading-relaxed break-words whitespace-pre-line ${
                msg.role === "user" 
                  ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-none shadow-lg" 
                  : "bg-zinc-900/90 border border-zinc-800/80 text-zinc-200 rounded-tl-none shadow-inner"
              }`}
            >
              {msg.text}
            </div>
          </motion.div>
        ))}

        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-2.5"
            >
              <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-blue-400 flex-shrink-0">
                <Bot className="w-3 h-3" />
              </div>
              <div className="bg-zinc-900/90 border border-zinc-800/80 p-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                <motion.div className="w-1.5 h-1.5 bg-blue-400 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                <motion.div className="w-1.5 h-1.5 bg-blue-400 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                <motion.div className="w-1.5 h-1.5 bg-blue-400 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="py-2 flex items-center gap-1.5 overflow-x-auto flex-shrink-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <Compass className="w-3 h-3 text-zinc-500 flex-shrink-0 ml-0.5" />
        {QUICK_PROMPTS.map((promptText, i) => (
          <button
            key={i}
            onClick={() => handleSend(promptText)}
            className="text-[10px] bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 px-2.5 py-1 rounded-full whitespace-nowrap transition-all duration-150 active:scale-95 flex-shrink-0 cursor-pointer"
          >
            {promptText}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="pt-2 border-t border-zinc-800/80 flex items-center gap-2 flex-shrink-0"
      >
        <input
          type="text"
          value={copilotQuery}
          onChange={(e) => setCopilotQuery(e.target.value)}
          placeholder="Ask AI about logo whitespace, fonts, rules..."
          className="flex-1 bg-zinc-900/80 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white p-2.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-blue-600/25 flex items-center justify-center flex-shrink-0"
        >
          <Send className="h-3.5 w-3.5" />
        </motion.button>
      </form>
    </div>
  );
};