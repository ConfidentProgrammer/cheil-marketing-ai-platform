# Samsung Ecosystem AI: Global Campaign Orchestration, Localization & Performance Scoring

An enterprise-grade, full-stack AI marketing orchestration platform designed to bridge the gap between creative design, brand compliance, and engineering execution. This project automates multi-format asset generation, RAG-powered brand compliance guardrails, real-time metadata tagging, and production-ready code synthesis.

---

## 🚀 Architectural Overview & Core Capabilities

The platform is engineered to eliminate the manual bottlenecks typically faced by marketing and development teams during major global product rollouts (such as Samsung Galaxy flagship launches).

### 1. Studio Generator & Batch Matrix

* **Multi-Format Scaling:** Automatically ingest a master asset brief and simultaneously generate optimized variants across multiple dimensions (Instagram Stories, social posts, web leaderboards, rectangles, and showcases).
* **Context-Aware Processing:** Powered by Gemini Vision pipelines to extract accurate product features, preventing asset hallucinations and ensuring device alignment (e.g., Galaxy Z Flip, Watch Ultra).

### 2. Pinecone RAG Brand Guardrails & Compliance Scorer

* **Vector-Grounded Compliance:** Integrates a Pinecone vector database pipeline to cross-reference every generated asset against official corporate brand guidelines.
* **Live Scoring Engine:** Instantly evaluates and outputs a quantitative compliance match score (e.g., 98% Match) and predicted performance benchmarks against industry standards.

### 3. AI Metadata, DAM Payload & CMS Export

* **Automated Asset Tagging:** Instantly generates accessibility alt-text, social tags, and target keywords.
* **CMS-Ready JSON Payloads:** Packages metadata, compliance metrics, and asset URLs into structured payloads for immediate ingestion into Digital Asset Management (DAM) and Content Management Systems.

### 4. HTML AI Banner Studio & Code Generator

* **Asset-Driven Code Synthesis:** Generates fully responsive, production-ready HTML/CSS ad suites across rigid aspect ratios (e.g., $728\times90$ leaderboards, $1200\times630$ showcases).
* **Dual-Mode Interactive Viewer:** Features live visual sandbox rendering with multi-axis scrolling alongside clean, inspectable source code views.

### 5. Chat-with-the-Brief Copilot

* **On-Demand Brand Strategist:** A conversational RAG copilot connected directly to visual identity handbooks and regional translation rules.
* **Instant Guidance:** Enables creative teams to query whitespace parameters, typography hierarchies, and localization rules instantly without manually scouring 100-page enterprise manuals.

---

## 🛠️ Technology Stack

* **Frontend:** React, Tailwind CSS, TypeScript, Vite.
* **Backend:** FastAPI, Python, asynchronous streaming endpoints.
* **AI & Retrieval:** Gemini Vision API, Pinecone Vector Database (RAG pipeline).
* **Infrastructure:** Docker containerization, responsive iframe isolation environments.

---

## 💡 Value Proposition for Enterprise Marketers

* **Eliminates Manual Overhead:** Reduces multi-week design and coding cycles into real-time, automated self-service workflows.
* **Mitigates Compliance Risk:** Real-time vector-backed auditing ensures zero off-brand releases before assets hit production ad servers.
* **Seamless Engineering Handoff:** Bridges design and development by instantly outputting clean JSON CMS payloads and responsive HTML code structures.
