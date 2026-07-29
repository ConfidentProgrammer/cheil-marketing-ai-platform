export interface AssetMetadata {
  sku: string;
  altText: string;
  tags: string[];
}

export interface GenerationAudit {
  briefUsed: string;
  tone: string;
  ragRuleMatched: string;
  timestamp: string;
}

export interface Asset {
  id: number;
  title: string;
  format: string;
  score: string;
  url: string;
  language: string;
  predictedCTR: string;
  metadata: AssetMetadata;
  audit: GenerationAudit;
  masterProductName?: string;
}

export type ActiveTab = "generator" | "copilot";