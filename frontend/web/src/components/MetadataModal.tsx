import React from "react";
import { motion } from "framer-motion";
import { Code2, X } from "lucide-react";
import type { Asset } from "../types";

interface MetadataModalProps {
  asset: Asset | null;
  onClose: () => void;
}

export const MetadataModal: React.FC<MetadataModalProps> = ({
  asset,
  onClose,
}) => {
  if (!asset) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative"
      >
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-zinc-200">
              AI Metadata & DAM Payload
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg bg-zinc-900 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <span className="text-zinc-400 font-medium">Selected Asset:</span>
            <p className="text-zinc-200">{asset.title}</p>
          </div>

          <div>
            <span className="text-zinc-400 font-medium">
              Accessibility Alt-Text:
            </span>
            <p className="text-zinc-300 bg-zinc-900/80 p-2.5 rounded-lg border border-zinc-800 mt-1">
              {asset.metadata.altText}
            </p>
          </div>

          <div>
            <span className="text-zinc-400 font-medium">
              Social Tags & Keywords:
            </span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {asset.metadata.tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-md text-[10px]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-zinc-400 font-medium">
              Generated JSON Payload (CMS Ready):
            </span>
            <pre className="bg-black border border-zinc-800 p-3 rounded-xl text-[10px] text-indigo-300 font-mono overflow-x-auto mt-1">
              {JSON.stringify(
                {
                  sku: asset.metadata.sku,
                  format: asset.format,
                  language: asset.language,
                  complianceScore: asset.score,
                  predictedCTR: asset.predictedCTR,
                  altText: asset.metadata.altText,
                  tags: asset.metadata.tags,
                  imageUrl: asset.url,
                },
                null,
                2,
              )}
            </pre>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded-xl text-xs transition-all cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </motion.div>
    </div>
  );
};
