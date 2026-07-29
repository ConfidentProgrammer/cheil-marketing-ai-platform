import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Upload, Layers, Globe, ShieldCheck, FileText, RefreshCw, Sparkles, X, Plus } from "lucide-react";

interface ControlPanelProps {
  briefText: string;
  setBriefText: (val: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (val: string) => void;
  selectedFormat: string;
  setSelectedFormat: (val: string) => void;
  selectedTone: string;
  setSelectedTone: (val: string) => void;
  isGenerating: boolean;
  onGenerate: () => void;
  uploadedFiles: File[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  briefText,
  setBriefText,
  selectedLanguage,
  setSelectedLanguage,
  selectedFormat,
  setSelectedFormat,
  selectedTone,
  setSelectedTone,
  isGenerating,
  onGenerate,
  uploadedFiles,
  setUploadedFiles,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDropzoneClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (indexToRemove: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadedFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Calculate total assets dynamically for the button
  const productCount = uploadedFiles.length > 0 ? uploadedFiles.length : 3; // defaults to 3 mock items if empty
  const formatCount = selectedFormat.includes("All") ? 3 : 1;
  const totalCalculatedAssets = productCount * formatCount;

  return (
    <div className="flex flex-col space-y-5">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <h2 className="text-sm font-medium text-zinc-200 flex items-center gap-2">
          <Layers className="h-4 w-4 text-indigo-400" />
          Batch Campaign & Multi-Product Studio
        </h2>
        <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-md">
          v3.0 Batch Engine
        </span>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept="image/png, image/webp, image/jpeg"
        className="hidden"
      />

      <div 
        onClick={handleDropzoneClick}
        className="border-2 border-dashed border-zinc-800 hover:border-indigo-500/50 transition-all rounded-xl p-4 text-center flex flex-col items-center justify-center bg-zinc-950/40 group cursor-pointer"
      >
        <div className="h-9 w-9 rounded-full bg-zinc-900 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-inner">
          <Upload className="h-4 w-4 text-zinc-400 group-hover:text-indigo-400 transition-colors" />
        </div>
        <p className="text-xs font-medium text-zinc-300">Drop multiple master product assets here</p>
        <p className="text-[10px] text-zinc-500 mt-0.5">Upload up to 5+ PNG cutouts for batch generation</p>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span>Master Assets Loaded:</span>
            <span className="text-indigo-400 font-medium">{uploadedFiles.length} Products</span>
          </div>
          <div className="grid grid-cols-3 gap-2 max-h-28 overflow-y-auto pr-1">
            {uploadedFiles.map((file, idx) => (
              <div key={idx} className="relative bg-zinc-900 border border-zinc-800 rounded-lg p-2 flex items-center space-x-2 group">
                <div className="h-8 w-8 bg-zinc-950 rounded border border-zinc-800 flex items-center justify-center shrink-0 overflow-hidden">
                  <img src={URL.createObjectURL(file)} alt={file.name} className="h-full w-full object-cover" />
                </div>
                <span className="text-[10px] text-zinc-300 truncate flex-1">{file.name}</span>
                <button 
                  onClick={(e) => removeFile(idx, e)}
                  className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-zinc-800 hover:bg-rose-500 text-zinc-400 hover:text-white rounded-full flex items-center justify-center transition-colors shadow-md"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </div>
            ))}
            <button 
              onClick={handleDropzoneClick}
              className="border border-dashed border-zinc-800 hover:border-indigo-500/50 rounded-lg p-2 flex items-center justify-center text-zinc-500 hover:text-indigo-400 transition-colors bg-zinc-950/20"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
          <Globe className="h-3.5 w-3.5 text-indigo-400" />
          Target Market & Language (RAG Localization)
        </label>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option>en-CA (Canadian English)</option>
          <option>fr-CA (French Canadian / OQLF)</option>
          <option>en-US (United States)</option>
          <option>en-GB (United Kingdom)</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-zinc-400">Campaign Brief Description</label>
        <textarea
          rows={2}
          value={briefText}
          onChange={(e) => setBriefText(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
          placeholder="Enter global campaign theme..."
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-zinc-400">Target Format</label>
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option>All Formats (Matrix Batch)</option>
            <option>Instagram Story (9:16)</option>
            <option>Facebook Feed (1:1)</option>
            <option>Web Leaderboard (16:9)</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-zinc-400">Visual Tone</label>
          <select
            value={selectedTone}
            onChange={(e) => setSelectedTone(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option>Modern & Premium</option>
            <option>Vibrant & Playful</option>
            <option>Sleek Corporate</option>
          </select>
        </div>
      </div>

      <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-3 space-y-1.5">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span className="flex items-center gap-1.5 font-medium text-zinc-300">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            Pinecone Guardrails & Multi-SKU Check
          </span>
          <span className="text-[10px] text-indigo-400">Active</span>
        </div>
        <div className="text-[11px] text-zinc-500 bg-zinc-900/60 p-2 rounded border border-zinc-800/50 flex items-center gap-2">
          <FileText className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
          <span className="truncate">Global_Brand_Matrix_2026.pdf</span>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={onGenerate}
        disabled={isGenerating}
        className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium py-3 rounded-xl shadow-lg shadow-indigo-600/20 text-xs flex items-center justify-center space-x-2 transition-all disabled:opacity-50 cursor-pointer"
      >
        {isGenerating ? (
          <>
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Executing Batch Matrix Generation...</span>
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            <span>Generate Batch Matrix ({totalCalculatedAssets} Assets)</span>
          </>
        )}
      </motion.button>
    </div>
  );
};