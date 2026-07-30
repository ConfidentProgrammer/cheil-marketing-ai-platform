import React, { useState, type JSX } from "react";
import { AnimatePresence } from "framer-motion";
import { Navbar } from "./components/Navbar";
import { ControlPanel } from "./components/ControlPanel";
import { CopilotSidebar } from "./components/CopilotSidebar";
import { AssetGallery } from "./components/AssetGallery";
import { MetadataModal } from "./components/MetadataModal";
import type { Asset, ActiveTab } from "./types";
import { AssetPreviewModal } from "./components/AssetPreviewModal";
import { HtmlBannerStudio } from "./components/HtmlBannerStudio";

export default function App(): JSX.Element {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);
  const handlePreviewAsset = (asset: Asset) => {
    setPreviewAsset(asset);
  };
  const [briefText, setBriefText] = useState<string>(
    "Summer Launch - Galaxy Z Flip6 Campaign: Clean, minimalist beach lifestyle shoot with high-contrast neon accents.",
  );
  const [selectedFormat, setSelectedFormat] = useState<string>(
    "Instagram Story (9:16)",
  );
  const [selectedTone, setSelectedTone] = useState<string>("Modern & Premium");
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    "en-CA (Canadian English)",
  );

  const [activeTab, setActiveTab] = useState<ActiveTab>("generator");
  const [inspectingAsset, setInspectingAsset] = useState<Asset | null>(null);

  const [assets, setAssets] = useState<Asset[]>([
    {
      id: 1,
      title: "Lifestyle Beach Hero (CA-EN)",
      format: "Instagram Story",
      score: "98% Match",
      url: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80",
      language: "en-CA",
      predictedCTR: "+4.2% vs Benchmark",
      metadata: {
        sku: "SM-ZFLIP6-SUM26-EN",
        altText:
          "Samsung Galaxy Z Flip6 open on a minimalist sandy beach background under bright sunlight.",
        tags: ["#GalaxyZFlip6", "#SamsungSummer", "#TechLifestyle"],
      },
      audit: {
        briefUsed: briefText,
        tone: selectedTone,
        ragRuleMatched: "Samsung_Visual_ID_2026 & CA_Localization",
        timestamp: "Just now (v2.5 Pipeline)",
      },
    },
    {
      id: 2,
      title: "Product Folded Close-up (FR-CA)",
      format: "Facebook Feed",
      score: "95% Match",
      url: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80",
      language: "fr-CA",
      predictedCTR: "+3.8% vs Benchmark",
      metadata: {
        sku: "SM-ZFLIP6-SUM26-FR",
        altText:
          "Close up angled view of Samsung Galaxy Z Flip6 in folded posture on dark slate.",
        tags: ["#GalaxyZFlip6", "#Innovation", "#SamsungFR"],
      },
      audit: {
        briefUsed: briefText,
        tone: selectedTone,
        ragRuleMatched: "Samsung_Visual_ID_2026 & CA_Localization",
        timestamp: "Just now (v2.5 Pipeline)",
      },
    },
    {
      id: 3,
      title: "Minimalist Urban Banner",
      format: "Web Leaderboard",
      score: "99% Match",
      url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80",
      language: "en-US",
      predictedCTR: "+5.1% vs Benchmark",
      metadata: {
        sku: "SM-ZFLIP6-SUM26-WEB",
        altText:
          "Wide banner showing Galaxy Z Flip6 against an architectural urban backdrop.",
        tags: ["#DisplayAd", "#GalaxyAI", "#Samsung"],
      },
      audit: {
        briefUsed: briefText,
        tone: selectedTone,
        ragRuleMatched: "Samsung_Visual_ID_2026 & CA_Localization",
        timestamp: "Just now (v2.5 Pipeline)",
      },
    },
  ]);

  // Helper function to map frontend human-readable options to backend aspect ratios
  const parseAspectRatios = (formatStr: string): string => {
    if (formatStr.includes("Instagram")) return "9:16";
    if (formatStr.includes("Facebook")) return "1:1";
    if (formatStr.includes("Web")) return "16:9";
    // Default fallback for "All Formats"
    return "1:1,16:9,9:16";
  };

  const handleGenerate = async () => {
    setIsGenerating(true);

    try {
      const formData = new FormData();
      formData.append("campaign_brief", briefText);
      formData.append("aspect_ratios", parseAspectRatios(selectedFormat));

      // Append uploaded files if present, else fallback to default server test files if needed
      if (uploadedFiles.length > 0) {
        uploadedFiles.forEach((file) => {
          formData.append("files", file);
        });
      } else {
        // Optional: Alert or let backend use default if user didn't upload files
        console.warn("No files uploaded. Running with server-side defaults.");
      }

      const response = await fetch("https://literate-fishstick-77pp49g4v45hx4w-8000.app.github.dev/api/v1/assets/upload-and-generate", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to generate assets from FastAPI backend.");
      }

      // Map FastAPI batch output structure to your UI Asset type interface
// Map FastAPI batch output structure to your UI Asset type interface
const liveBatchAssets: Asset[] = data.results.map((item: any, index: number) => ({
  id: Date.now() + index,
  title: `${item.product || "Samsung Product"} (${item.aspect_ratio})`,
  format: item.aspect_ratio === "9:16" ? "Instagram Story" : item.aspect_ratio === "1:1" ? "Facebook Feed" : "Web Leaderboard",
  
  // Real score from Gemini Vision API backend
  score: item.score || "95% Match",
  
  url: item.status === "success" ? `https://literate-fishstick-77pp49g4v45hx4w-8000.app.github.dev${item.file_path}` : "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=800",
  language: selectedLanguage.split(" ")[0],
  
  // Real predicted CTR returned by Gemini audit pipeline!
  predictedCTR: item.predicted_ctr || "+5.0% vs Benchmark",
  masterProductName: item.product,
  
  metadata: {
    sku: `SKU-${Math.floor(100000 + Math.random() * 900000)}`,
    altText: item.status === "success" ? `Generated asset for ${item.product} with brief: ${briefText}` : `Error: ${item.error}`,
    tags: [item.product, selectedTone, selectedLanguage, item.aspect_ratio],
  },
  audit: {
    briefUsed: briefText,
    tone: selectedTone,
    // Real audit text description returned by Gemini Vision
    ragRuleMatched: item.audit_summary || "Samsung Multi-SKU Compliance 2026",
  }
}));
      console.log(liveBatchAssets)
      setAssets(liveBatchAssets);
    } catch (err) {
      console.error("Batch Generation Error:", err);
      alert("Error connecting to backend generation API. Ensure FastAPI server is running on port 8000.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-zinc-950 to-[#070d24] text-zinc-100 flex flex-col selection:bg-[#1428a0] selection:text-white relative overflow-x-hidden">
      {/* Ambient Samsung Glow Effects */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[300px] bg-[#1428a0]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

     <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 max-w-[1600px] mx-auto w-full relative z-10">
  {activeTab === "html-studio" ? (
    // Full width layout for HTML Studio
    <section className="lg:col-span-12 flex flex-col">
      <HtmlBannerStudio />
    </section>
  ) : (
    <>
      <section className="lg:col-span-4 flex flex-col bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 backdrop-blur-xl shadow-2xl">
        {activeTab === "generator" ? (
          <ControlPanel
            briefText={briefText}
            setBriefText={setBriefText}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            selectedFormat={selectedFormat}
            setSelectedFormat={setSelectedFormat}
            selectedTone={selectedTone}
            setSelectedTone={setSelectedTone}
            isGenerating={isGenerating}
            onGenerate={handleGenerate}
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
          />
        ) : (
          <CopilotSidebar />
        )}
      </section>

      <section className="lg:col-span-8 flex flex-col space-y-4">
        <AssetGallery
          assets={assets}
          onInspectAsset={setInspectingAsset}
          onPreviewAsset={handlePreviewAsset}
        />
      </section>
    </>
  )}
</main>

      <AnimatePresence>
        {inspectingAsset && (
          <MetadataModal
            asset={inspectingAsset}
            onClose={() => setInspectingAsset(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {previewAsset && (
          <AssetPreviewModal
            asset={previewAsset}
            onClose={() => setPreviewAsset(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}