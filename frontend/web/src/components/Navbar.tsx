import React from "react";
import { Sparkles, MessageSquare, LayoutTemplate } from "lucide-react";
import type { ActiveTab } from "../types";

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="h-9 w-9 rounded-xl bg-[#1428a0] border border-blue-500/30 flex items-center justify-center shadow-lg shadow-[#1428a0]/20">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-semibold tracking-tight text-zinc-200">
            Samsung Ecosystem AI
          </h1>
          <p className="text-xs text-zinc-400">
            Global Campaign Orchestration, Localization & Performance Scoring
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-1 text-xs">
          <button
            onClick={() => setActiveTab("generator")}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
              activeTab === "generator"
                ? "bg-[#1428a0] text-white font-medium shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Studio Generator
          </button>
          
          <button
            onClick={() => setActiveTab("html-studio")}
            className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "html-studio"
                ? "bg-[#1428a0] text-white font-medium shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <LayoutTemplate className="h-3 w-3" />
            <span>HTML Ad Studio</span>
          </button>

          <button
            onClick={() => setActiveTab("copilot")}
            className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "copilot"
                ? "bg-[#1428a0] text-white font-medium shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <MessageSquare className="h-3 w-3" />
            <span>Chat-with-Brief</span>
          </button>
        </div>

        <div className="hidden md:flex items-center space-x-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full text-xs text-zinc-300">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Pinecone RAG Active (3 Guidelines Loaded)</span>
        </div>
      </div>
    </header>
  );
};