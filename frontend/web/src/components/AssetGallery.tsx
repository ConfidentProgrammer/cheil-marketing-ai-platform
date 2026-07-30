import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Tag,
  Download,
  Cpu,
  Eye,
} from "lucide-react";
import type { Asset } from "../types";

interface AssetGalleryProps {
  assets: Asset[];
  onInspectAsset: (asset: Asset) => void;
  onPreviewAsset: (asset: Asset) => void;
}

// Helper function to extract score numbers and return matching styling & icon
const getScoreBadgeStyles = (scoreStr: string) => {
  const numericScore = parseInt(scoreStr, 10) || 95;

  if (numericScore >= 90) {
    return {
      bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
      icon: <CheckCircle2 className="h-3 w-3 text-emerald-400" />,
    };
  } else if (numericScore >= 80) {
    return {
      bg: "bg-amber-500/10 border-amber-500/30 text-amber-400",
      icon: <AlertTriangle className="h-3 w-3 text-amber-400" />,
    };
  } else if (numericScore >= 70) {
    return {
      bg: "bg-orange-500/10 border-orange-500/30 text-orange-400",
      icon: <AlertTriangle className="h-3 w-3 text-orange-400" />,
    };
  } else {
    return {
      bg: "bg-rose-500/10 border-rose-500/30 text-rose-400",
      icon: <XCircle className="h-3 w-3 text-rose-400" />,
    };
  }
};

export const AssetGallery: React.FC<AssetGalleryProps> = ({
  assets,
  onInspectAsset,
  onPreviewAsset,
}) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <h3 className="text-sm font-medium text-zinc-200">
            Cheil Studio // Generated Asset Scorer
          </h3>
          <span className="text-xs bg-zinc-800 text-zinc-300 px-2.5 py-0.5 rounded-full">
            {assets.length} Samsung Optimized Variants
          </span>
        </div>
        <div className="flex items-center space-x-2 text-xs text-zinc-400">
          <Cpu className="h-3.5 w-3.5 text-blue-400" />
          <span>Gemini Vision + Pinecone RAG Pipeline</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr overflow-y-auto pr-1">
        <AnimatePresence>
          {assets.map((asset: Asset, index: number) => {
            const badgeStyle = getScoreBadgeStyles(asset.score);

            return (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group bg-zinc-900/30 border border-zinc-800/80 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all flex flex-col h-full"
              >
                {/* Clickable Image Preview Container */}
                <div
                  onClick={() => onPreviewAsset(asset)}
                  className="relative h-56 w-full bg-zinc-950 overflow-hidden cursor-pointer shrink-0"
                >
                  <img
                    src={asset.url}
                    alt={asset.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <span className="bg-zinc-900/90 text-zinc-200 text-xs px-3 py-1.5 rounded-full border border-zinc-700 flex items-center gap-1.5 shadow-lg">
                      <Eye className="h-3.5 w-3.5 text-blue-400" />
                      Preview & Audit
                    </span>
                  </div>

                  {/* Dynamic Score Badge Color */}
                  <div
                    className={`absolute top-3 left-3 backdrop-blur-md border text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md pointer-events-none ${badgeStyle.bg}`}
                  >
                    {badgeStyle.icon}
                    {asset.score}
                  </div>

                  <div className="absolute top-3 right-3 bg-[#1428a0]/80 backdrop-blur-md border border-[#1428a0]/30 text-[10px] text-blue-200 font-medium px-2 py-0.5 rounded-full flex items-center gap-1 pointer-events-none">
                    <TrendingUp className="h-3 w-3 text-blue-400" />
                    {asset.predictedCTR}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md border border-white/10 text-[10px] text-zinc-300 px-2 py-0.5 rounded-full uppercase tracking-wider pointer-events-none">
                    {asset.language}
                  </div>
                </div>

                {/* Card body content */}
                <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
                  <div>
                    <h4
                      onClick={() => onPreviewAsset(asset)}
                      className="text-xs font-medium text-zinc-200 group-hover:text-blue-400 transition-colors cursor-pointer line-clamp-1"
                    >
                      {asset.title}
                    </h4>
                    <p className="text-[11px] text-zinc-500 mt-0.5 truncate">
                      SKU: {asset.metadata.sku}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 mt-auto">
                    <button
                      onClick={() => onInspectAsset(asset)}
                      className="flex items-center gap-1.5 text-[11px] text-zinc-400 hover:text-zinc-200 transition-colors bg-zinc-800/40 hover:bg-zinc-800 px-2.5 py-1.5 rounded-lg cursor-pointer"
                    >
                      <Tag className="h-3 w-3 text-blue-400" />
                      <span>View JSON</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-[11px] text-blue-400 hover:text-blue-300 transition-colors bg-[#1428a0]/10 hover:bg-[#1428a0]/20 px-2.5 py-1.5 rounded-lg border border-[#1428a0]/30 cursor-pointer">
                      <Download className="h-3 w-3" />
                      <span>Export CMS</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};