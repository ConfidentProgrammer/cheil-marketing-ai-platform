import React, { useState, type JSX } from "react";
import { AnimatePresence } from "framer-motion";
import { Navbar } from "./components/Navbar";
import { ControlPanel } from "./components/ControlPanel";
import { CopilotSidebar } from "./components/CopilotSidebar";
import { AssetGallery } from "./components/AssetGallery";
import { MetadataModal } from "./components/MetadataModal";
import type { Asset, ActiveTab } from "./types";
import { AssetPreviewModal } from "./components/AssetPreviewModal";

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

  const handleGenerate = () => {
    setIsGenerating(true);

    setTimeout(() => {
      // If user uploaded files, create variants for each product. Otherwise generate a standard batch.
      const productNames =
        uploadedFiles.length > 0
          ? uploadedFiles.map((f) => f.name.replace(/\.[^/.]+$/, ""))
          : ["Galaxy_Z_Flip6", "Galaxy_Watch_Ultra", "Neo_QLED_8K"];

      const formats = [
        "Instagram Story (9:16)",
        "Facebook Feed (1:1)",
        "Web Leaderboard (16:9)",
      ];

      // Generate a multi-product matrix batch (e.g. 10 variants per product)
      const newBatchAssets: Asset[] = [];
      let idCounter = Date.now();

      productNames.forEach((product, pIndex) => {
        formats.forEach((fmt, fIndex) => {
          newBatchAssets.push({
            id: idCounter++,
            title: `${product.replace(/[_]/g, " ")} - Variant ${fIndex + 1}`,
            format: fmt,
            score: `${Math.floor(92 + Math.random() * 7)}% Match`,
            url: uploadedFiles[pIndex]
              ? URL.createObjectURL(uploadedFiles[pIndex])
              : "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=800",
            language: selectedLanguage.split(" ")[0],
            predictedCTR: `+${(3.5 + Math.random() * 2.5).toFixed(1)}% CTR`,
            masterProductName: product,
            metadata: {
              sku: `SKU-${Math.floor(100000 + Math.random() * 900000)}`,
              altText: `Promotional asset for ${product} optimized for ${selectedLanguage}`,
              tags: [product, selectedTone, selectedLanguage, fmt],
            },
            audit: {
              briefUsed: briefText || "Default global showcase campaign brief",
              tone: selectedTone,
              ragRuleMatched: "Samsung_Multi_SKU_Compliance_2026",
              timestamp: "Just now (Batch Pipeline)",
            },
          });
        });
      });

      setAssets(newBatchAssets);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 max-w-[1600px] mx-auto w-full">
        <section className="lg:col-span-4 flex flex-col bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 backdrop-blur-sm">
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
