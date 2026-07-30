import React, { useRef, useState } from "react";
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
  const [isGeneratingBrief, setIsGeneratingBrief] = useState(false);

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

  // API Call to FastAPI backend which triggers Gemini, incorporating product_name context
  const handleAISuggestion = async () => {
    setIsGeneratingBrief(true);
    try {
      // Map through all uploaded files, clean their extensions/underscores, and join them
      const productNames = uploadedFiles.length > 0
        ? uploadedFiles.map(file => file.name.replace(/\.[^/.]+$/, "").replace(/[_]/g, " ")).join(", ")
        : "Samsung Galaxy Device";

      const response = await fetch("https://literate-fishstick-77pp49g4v45hx4w-8000.app.github.dev/api/generate-brief", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: selectedLanguage,
          format: selectedFormat,
          tone: selectedTone,
          product_name: productNames, // Now sends all filenames as a combined string
        }),
      });

      const data = await response.json();
      if (data.success && data.brief) {
        setBriefText(data.brief);
      }
    } catch (error) {
      console.error("Failed to fetch Gemini brief suggestion:", error);
    } finally {
      setIsGeneratingBrief(false);
    }
  };

  // Calculate total assets dynamically for the button
  const productCount = uploadedFiles.length > 0 ? uploadedFiles.length : 3;
  const formatCount = selectedFormat.includes("All") ? 3 : 1;
  const totalCalculatedAssets = productCount * formatCount * 10;

  return (
    <div className="flex flex-col space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <h2 className="text-sm font-medium text-zinc-100 flex items-center gap-2">
          <Layers className="h-4 w-4 text-[#1428a0]" />
          Cheil Studio // Samsung Ecosystem AI
        </h2>
        <span className="text-xs bg-[#1428a0]/10 text-blue-400 border border-[#1428a0]/30 px-2 py-0.5 rounded-md">
          v3.0 Enterprise
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

      {/* Dropzone */}
      <div 
        onClick={handleDropzoneClick}
        className="border-2 border-dashed border-zinc-800 hover:border-[#1428a0] transition-all rounded-xl p-4 text-center flex flex-col items-center justify-center bg-zinc-950/40 group cursor-pointer"
      >
        <div className="h-9 w-9 rounded-full bg-zinc-900 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-inner">
          <Upload className="h-4 w-4 text-zinc-400 group-hover:text-blue-400 transition-colors" />
        </div>
        <p className="text-xs font-medium text-zinc-300">Drop Samsung Master Assets here</p>
        <p className="text-[10px] text-zinc-500 mt-0.5">Galaxy S26 Ultra, Watch Ultra cutouts & PNGs</p>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span>Master Assets Loaded:</span>
            <span className="text-blue-400 font-medium">{uploadedFiles.length} Products</span>
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
              className="border border-dashed border-zinc-800 hover:border-[#1428a0] rounded-lg p-2 flex items-center justify-center text-zinc-500 hover:text-blue-400 transition-colors bg-zinc-950/20"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Target Market */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
          <Globe className="h-3.5 w-3.5 text-blue-400" />
          Target Market & Language (RAG Localization)
        </label>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-[#1428a0]"
        >
          <option>en-CA (Canadian English)</option>
          <option>fr-CA (French Canadian / OQLF)</option>
          <option>en-US (United States)</option>
          <option>en-GB (United Kingdom)</option>
        </select>
      </div>

      {/* Campaign Brief with Embedded Gemini AI Magic Button */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-zinc-400">Campaign Brief Description</label>
          <span className="text-[10px] text-zinc-500">Gemini API Powered</span>
        </div>
        <div className="relative">
          <textarea
            rows={3}
            value={briefText}
            onChange={(e) => setBriefText(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 pb-9 text-xs text-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#1428a0]/50 transition-all resize-none"
            placeholder="Global launch campaign for Galaxy S26 Ultra emphasizing Nightography & AI productivity..."
          />
          <div className="absolute bottom-2.5 right-2.5">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAISuggestion}
              disabled={isGeneratingBrief}
              className="bg-[#1428a0]/20 hover:bg-[#1428a0]/40 text-blue-300 border border-[#1428a0]/40 px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-50"
              title="Generate intelligent brief using Gemini API"
            >
              {isGeneratingBrief ? (
                <RefreshCw className="h-3 w-3 animate-spin text-blue-400" />
              ) : (
                <Sparkles className="h-3 w-3 text-blue-400" />
              )}
              <span>{isGeneratingBrief ? "Thinking..." : "Gemini Suggest"}</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Format & Tone */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-zinc-400">Target Format</label>
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-[#1428a0]"
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
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-[#1428a0]"
          >
            <option>Samsung Sleek & Minimalist</option>
            <option>Dynamic Ecosystem</option>
            <option>High-End Enterprise</option>
          </select>
        </div>
      </div>

      {/* Guardrails Box */}
      <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-3 space-y-1.5">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span className="flex items-center gap-1.5 font-medium text-zinc-300">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            Samsung Brand Guidelines & Pinecone Guardrails
          </span>
          <span className="text-[10px] text-blue-400">Active</span>
        </div>
        <div className="text-[11px] text-zinc-500 bg-zinc-900/60 p-2 rounded border border-zinc-800/50 flex items-center gap-2">
          <FileText className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
          <span className="truncate">Samsung_Global_Brand_Matrix_2026.pdf</span>
        </div>
      </div>

      {/* Generate Action Button */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={onGenerate}
        disabled={isGenerating}
        className="w-full bg-[#1428a0] hover:bg-[#0057b8] text-white font-medium py-3 rounded-xl shadow-lg shadow-[#1428a0]/20 text-xs flex items-center justify-center space-x-2 transition-all disabled:opacity-50 cursor-pointer"
      >
        {isGenerating ? (
          <>
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Executing Samsung Matrix Generation...</span>
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