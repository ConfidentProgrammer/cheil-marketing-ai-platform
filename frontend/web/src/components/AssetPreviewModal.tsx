import React from "react";
import { motion } from "framer-motion";
import { X, Sparkles, ShieldCheck, FileText, Globe, Layers, TrendingUp } from "lucide-react";
import type { Asset } from "../types";

interface AssetPreviewModalProps {
  asset: Asset | null;
  onClose: () => void;
}

export const AssetPreviewModal: React.FC<AssetPreviewModalProps> = ({ asset, onClose }) => {
  if (!asset) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4 bg-zinc-900/50">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">{asset.title}</h3>
              <p className="text-[11px] text-zinc-400">SKU: {asset.metadata.sku} • Format: {asset.format}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-y-auto">
          {/* Left: Larger Image View */}
          <div className="md:col-span-6 bg-black p-6 flex items-center justify-center border-r border-zinc-800">
            <div className="relative rounded-xl overflow-hidden shadow-2xl max-h-[500px] border border-zinc-800">
              <img 
                src={asset.url} 
                alt={asset.title} 
                className="object-contain max-h-[480px] w-full"
              />
              <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-xs text-emerald-400 border border-emerald-500/30 font-medium">
                Score: {asset.score}
              </div>
            </div>
          </div>

          {/* Right: How it was generated / Audit Trail */}
          <div className="md:col-span-6 p-6 space-y-5 bg-zinc-950 text-xs">
            <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
              <h4 className="font-semibold text-zinc-200 flex items-center gap-2">
                <Layers className="h-4 w-4 text-indigo-400" />
                Generation Audit & RAG Pipeline
              </h4>
              <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded">
                {asset.audit.timestamp}
              </span>
            </div>

            {/* Brief Used */}
            <div className="space-y-1.5">
              <span className="text-zinc-400 font-medium flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-zinc-400" />
                Campaign Brief Input:
              </span>
              <p className="text-zinc-300 bg-zinc-900/80 p-3 rounded-xl border border-zinc-800 leading-relaxed italic">
                "{asset.audit.briefUsed}"
              </p>
            </div>

            {/* RAG Rule & Tone */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800 space-y-1">
                <span className="text-zinc-400 text-[10px] flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-emerald-400" />
                  Pinecone RAG Rule
                </span>
                <p className="text-zinc-200 font-medium truncate">{asset.audit.ragRuleMatched}</p>
              </div>
              <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800 space-y-1">
                <span className="text-zinc-400 text-[10px] flex items-center gap-1">
                  <Globe className="h-3 w-3 text-indigo-400" />
                  Localization Target
                </span>
                <p className="text-zinc-200 font-medium">{asset.language}</p>
              </div>
            </div>

            {/* Performance Prediction */}
            <div className="bg-indigo-950/30 border border-indigo-500/20 p-3 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-indigo-400" />
                <span className="text-indigo-200 font-medium">Predicted Engagement</span>
              </div>
              <span className="text-emerald-400 font-bold">{asset.predictedCTR}</span>
            </div>

            {/* Accessibility & Tags */}
            <div className="space-y-2">
              <span className="text-zinc-400 font-medium">Generated Alt-Text (CMS Ready):</span>
              <p className="text-zinc-300 bg-zinc-900/50 p-2.5 rounded-lg border border-zinc-800/80 text-[11px]">
                {asset.metadata.altText}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-zinc-800 px-6 py-3 bg-zinc-900/50 flex justify-end">
          <button 
            onClick={onClose}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2 rounded-xl text-xs transition-all cursor-pointer shadow-lg shadow-indigo-600/20"
          >
            Close Preview
          </button>
        </div>
      </motion.div>
    </div>
  );
};