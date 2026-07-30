import React, { useState, useRef } from "react";
import { Code, Eye, Download, CheckCircle2, Sparkles, LayoutTemplate, Database, Upload, Image as ImageIcon, X, Wand2 } from "lucide-react";
import { motion } from "framer-motion";

export const HtmlBannerStudio: React.FC = () => {
  const [briefText, setBriefText] = useState<string>(
    "Summer Launch - Galaxy Z Flip6 Campaign: Clean, minimalist beach lifestyle shoot with high-contrast neon accents and bold typography."
  );
  const [selectedTone, setSelectedTone] = useState<string>("Modern & Premium");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en-CA (Canadian English)");
  
  // File upload state for base asset brief
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>(
    "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80"
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Multi-format selection state
  const [selectedFormats, setSelectedFormats] = useState<string[]>([
    "Web Leaderboard (728x90)",
    "Medium Rectangle (300x250)"
  ]);

  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isSuggestingBrief, setIsSuggestingBrief] = useState<boolean>(false);
  const [generatedBanners, setGeneratedBanners] = useState<Array<{ format: string; html: string }>>([
    {
      format: "Web Leaderboard (728x90)",
      html: "<div style='color:#a1a1aa; padding:40px; font-family:sans-serif; text-align:center;'>Upload base asset, configure parameters, and click 'Synthesize HTML Ad Suite'...</div>"
    }
  ]);
  const [activePreviewIndex, setActivePreviewIndex] = useState<number>(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const toggleFormat = (format: string) => {
    if (selectedFormats.includes(format)) {
      if (selectedFormats.length > 1) {
        setSelectedFormats(selectedFormats.filter((f) => f !== format));
      }
    } else {
      setSelectedFormats([...selectedFormats, format]);
    }
  };

  const handleAISuggestion = async () => {
    setIsSuggestingBrief(true);
    try {
      const response = await fetch("https://literate-fishstick-77pp49g4v45hx4w-8000.app.github.dev/api/generate-brief", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: selectedLanguage,
          format: selectedFormats,
          tone: selectedTone,
        }),
      });

      const data = await response.json();
      if (data.success && data.brief) {
        setBriefText(data.brief);
      }
    } catch (error) {
      console.error("Failed to fetch Gemini brief suggestion:", error);
    } finally {
      setIsSuggestingBrief(false);
    }
  };

  const handleGenerateMultiBanners = async () => {
    setIsGenerating(true);
    try {
      const formData = new FormData();
      formData.append("headline", briefText);
      formData.append("selected_tone", selectedTone);
      formData.append("selected_language", selectedLanguage);
      formData.append("formats", selectedFormats.join(","));
      
      if (uploadedImageFile) {
        formData.append("image_file", uploadedImageFile);
      }

      const response = await fetch("https://literate-fishstick-77pp49g4v45hx4w-8000.app.github.dev/api/v1/html-studio/generate-suite", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success && data.results && data.results.length > 0) {
        setGeneratedBanners(data.results);
        setActivePreviewIndex(0);
      } else {
        throw new Error("Invalid response format received from backend.");
      }
    } catch (error) {
      console.error("Failed to generate HTML ad suite:", error);
      alert("Error generating banners via backend pipeline. Check console logs for details.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-[780px] bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-xl shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#1428a0]/20 border border-blue-500/30 text-blue-400 shadow-inner">
            <LayoutTemplate className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-zinc-100">HTML AI Banner Studio</h2>
            <p className="text-xs text-zinc-400">Asset-Driven Multi-Format Code Generation & RAG Guardrail Pipeline</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full font-medium flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5" /> Pinecone RAG Grounded
          </span>
          <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-medium flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Ready
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4 bg-zinc-950/60 p-5 rounded-xl border border-zinc-800/80 overflow-y-auto">
          {/* Base Image Upload Brief Section */}
          <div>
            <label className="text-xs font-medium text-zinc-300 block mb-1.5">Base Asset Image Brief</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-zinc-800 hover:border-blue-500/50 bg-zinc-900/40 rounded-xl p-3 flex items-center gap-3 cursor-pointer transition-all group"
            >
              <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                <img src={imagePreviewUrl} alt="Thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-zinc-200 truncate">
                  {uploadedImageFile ? uploadedImageFile.name : "Default_Beach_Lifestyle_v2.png"}
                </p>
                <p className="text-[10px] text-zinc-400">Click to upload custom asset brief</p>
              </div>
              <Upload className="w-4 h-4 text-zinc-500 group-hover:text-blue-400 transition-colors" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-zinc-300">Campaign Brief Context</label>
              <button
                type="button"
                onClick={handleAISuggestion}
                disabled={isSuggestingBrief}
                className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium transition-colors cursor-pointer disabled:opacity-50"
              >
                <Wand2 className={`w-3.5 h-3.5 ${isSuggestingBrief ? "animate-spin" : ""}`} />
                {isSuggestingBrief ? "Generating AI Brief..." : "Gemini Suggestion"}
              </button>
            </div>
            <textarea
              value={briefText}
              onChange={(e) => setBriefText(e.target.value)}
              rows={2}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-zinc-300 block mb-1.5">Tone of Voice</label>
              <select
                value={selectedTone}
                onChange={(e) => setSelectedTone(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-blue-500"
              >
                <option>Modern & Premium</option>
                <option>Vibrant & Youthful</option>
                <option>Minimalist Tech</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-300 block mb-1.5">Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-blue-500"
              >
                <option>en-CA (English)</option>
                <option>fr-CA (French)</option>
                <option>en-US (US)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-300 block mb-2">Select Formats to Generate Simultaneously</label>
            <div className="grid grid-cols-1 gap-2">
              {[
                "Web Leaderboard (728x90)",
                "Medium Rectangle (300x250)",
                "Half Page Display (300x600)"
              ].map((format) => {
                const isSelected = selectedFormats.includes(format);
                return (
                  <button
                    key={format}
                    type="button"
                    onClick={() => toggleFormat(format)}
                    className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-xs transition-all border cursor-pointer ${
                      isSelected
                        ? "bg-[#1428a0]/20 border-blue-500/50 text-white font-medium"
                        : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:bg-zinc-900"
                    }`}
                  >
                    <span>{format}</span>
                    <span className={`w-3.5 h-3.5 rounded-md flex items-center justify-center border ${isSelected ? "bg-blue-600 border-blue-500 text-white text-[10px]" : "border-zinc-700"}`}>
                      {isSelected && "✓"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleGenerateMultiBanners}
            disabled={isGenerating}
            className="mt-auto w-full bg-[#1428a0] hover:bg-blue-600 text-white py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-[#1428a0]/30 cursor-pointer disabled:opacity-50 transition-all"
          >
            <Sparkles className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`} />
            {isGenerating ? "Synthesizing Multi-Format Code..." : "Synthesize HTML Ad Suite"}
          </motion.button>
        </div>

        {/* Preview / Code Column (7 cols) */}
        <div className="lg:col-span-7 flex flex-col bg-zinc-950/60 rounded-xl border border-zinc-800/80 overflow-hidden">
          {/* Format Sub-tabs */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800/80 bg-zinc-900/40 overflow-x-auto">
            <div className="flex items-center gap-1.5">
              {generatedBanners.map((banner, idx) => (
                <button
                  key={banner.format}
                  onClick={() => setActivePreviewIndex(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                    activePreviewIndex === idx
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
                  }`}
                >
                  {banner.format.split(" ")[0]} ({banner.format.match(/\(([^)]+)\)/)?.[1]})
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                <button
                  onClick={() => setActiveTab("preview")}
                  className={`px-2.5 py-1 text-[11px] rounded transition-all ${
                    activeTab === "preview" ? "bg-zinc-800 text-white" : "text-zinc-400"
                  }`}
                >
                  Preview
                </button>
                <button
                  onClick={() => setActiveTab("code")}
                  className={`px-2.5 py-1 text-[11px] rounded transition-all ${
                    activeTab === "code" ? "bg-zinc-800 text-white" : "text-zinc-400"
                  }`}
                >
                  Source
                </button>
              </div>

              <button
                onClick={() => {
                  const currentHtml = generatedBanners[activePreviewIndex]?.html || "";
                  const blob = new Blob([currentHtml], { type: "text/html" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `GalaxyZFlip6_${generatedBanners[activePreviewIndex]?.format.split(" ")[0]}.html`;
                  a.click();
                }}
                className="flex items-center gap-1 text-[11px] bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Export
              </button>
            </div>
          </div>

          <div className="flex-1 p-6 flex items-center justify-center bg-zinc-950 overflow-hidden relative">
            {activeTab === "preview" ? (
              <div className="w-full h-full flex items-center justify-center border border-zinc-800/80 rounded-xl bg-zinc-900/30 overflow-hidden shadow-inner p-4">
                <iframe
                  srcDoc={generatedBanners[activePreviewIndex]?.html || ""}
                  title="Banner Preview"
                  className="w-full h-full border-0 rounded-lg shadow-2xl min-h-[350px]"
                  sandbox="allow-scripts"
                />
              </div>
            ) : (
              <div className="w-full h-full overflow-y-auto bg-zinc-950 font-mono text-xs text-zinc-300 p-4 rounded-xl border border-zinc-900">
                <pre className="whitespace-pre-wrap">{generatedBanners[activePreviewIndex]?.html || ""}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};