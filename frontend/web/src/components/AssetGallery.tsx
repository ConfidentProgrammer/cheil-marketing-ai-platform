import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
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
            Generated Asset Studio & Scorer
          </h3>
          <span className="text-xs bg-zinc-800 text-zinc-300 px-2.5 py-0.5 rounded-full">
            {assets.length} Optimized Variants
          </span>
        </div>
        <div className="flex items-center space-x-2 text-xs text-zinc-400">
          <Cpu className="h-3.5 w-3.5 text-indigo-400" />
          <span>Gemini Vision + Pinecone RAG Pipeline</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
        <AnimatePresence>
          {assets.map((asset: Asset, index: number) => (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group bg-zinc-900/30 border border-zinc-800/80 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all flex flex-col"
            >
              {/* Clickable Image Preview Container */}
              <div
                onClick={() => onPreviewAsset(asset)}
                className="relative aspect-4/5 bg-zinc-950 overflow-hidden cursor-pointer"
              >
                <img
                  src={asset.url}
                  alt={asset.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <span className="bg-zinc-900/90 text-zinc-200 text-xs px-3 py-1.5 rounded-full border border-zinc-700 flex items-center gap-1.5 shadow-lg">
                    <Eye className="h-3.5 w-3.5 text-indigo-400" />
                    Preview & Audit
                  </span>
                </div>

                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md border border-white/10 text-[10px] text-emerald-400 font-medium px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md pointer-events-none">
                  <CheckCircle2 className="h-3 w-3" />
                  {asset.score}
                </div>
                <div className="absolute top-3 right-3 bg-indigo-950/80 backdrop-blur-md border border-indigo-500/30 text-[10px] text-indigo-300 font-medium px-2 py-0.5 rounded-full flex items-center gap-1 pointer-events-none">
                  <TrendingUp className="h-3 w-3 text-indigo-400" />
                  {asset.predictedCTR}
                </div>
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md border border-white/10 text-[10px] text-zinc-300 px-2 py-0.5 rounded-full uppercase tracking-wider pointer-events-none">
                  {asset.language}
                </div>
              </div>

              <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
                <div>
                  <h4
                    onClick={() => onPreviewAsset(asset)}
                    className="text-xs font-medium text-zinc-200 group-hover:text-indigo-400 transition-colors cursor-pointer"
                  >
                    {asset.title}
                  </h4>
                  <p className="text-[11px] text-zinc-500 mt-0.5 truncate">
                    SKU: {asset.metadata.sku}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
                  <button
                    onClick={() => onInspectAsset(asset)}
                    className="flex items-center gap-1.5 text-[11px] text-zinc-400 hover:text-zinc-200 transition-colors bg-zinc-800/40 hover:bg-zinc-800 px-2.5 py-1.5 rounded-lg cursor-pointer"
                  >
                    <Tag className="h-3 w-3 text-indigo-400" />
                    <span>View JSON</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/10 hover:bg-indigo-500/20 px-2.5 py-1.5 rounded-lg border border-indigo-500/20 cursor-pointer">
                    <Download className="h-3 w-3" />
                    <span>Export CMS</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
