<div align="center">

# 🛡️ Structura V2 (Next.js Edition)
### *The Type-Safe Data Architect for the Modern Web*

[![Next.js](https://img.shields.io/badge/Next.js_15-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vercel AI SDK](https://img.shields.io/badge/Vercel_AI_SDK-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://sdk.vercel.ai/docs)
[![Zod](https://img.shields.io/badge/Zod-Validation-3068B7?style=for-the-badge&logo=zod&logoColor=white)](https://zod.dev/)

[View Live Demo](#-live-demo) • [System Architecture](#-system-architecture) • [Deploy](#-deployment)

</div>

---

## ⚡ The Evolution: Python to Full-Stack
While **Structura V1** proved the concept of "Unbreakable Extraction" using Python, **Structura V2** brings that power to the Edge.

Re-engineered using **Next.js 15** and the **Vercel AI SDK**, this version delivers:
*   **⚡ Zero-Latency Streaming:** UI updates in real-time as the AI generates JSON.
*   **🛡️ Edge-Ready:** Runs on Serverless functions, removing the need for heavy Docker containers.
*   **💎 Modern UI:** Built with **Tailwind CSS** and **Shadcn/UI** for a premium user experience.

## 🧠 The Tech Stack
| Component | Technology | Why? |
| :--- | :--- | :--- |
| **Framework** | **Next.js 15 (App Router)** | React Server Components for optimal performance. |
| **AI Runtime** | **Vercel AI SDK** | The industry standard for streaming AI responses in JS/TS. |
| **Validation** | **Zod** | TypeScript-native schema validation (The "Pydantic" of the web). |
| **Intelligence** | **Gemini 2.5 Flash** | Fast, cost-effective inference. |
| **Styling** | **Tailwind CSS** | Utility-first styling for rapid UI development. |

## ⚙️ How it Works
1.  **Input:** User pastes unstructured text (Invoice, Email, Logs).
2.  **Schema Definition:** We define a strict `Zod` schema in `app/api/extract/route.ts`.
3.  **Generation:** The Vercel AI SDK's `generateObject` function forces Gemini to adhere to the schema.
4.  **Validation:** If the AI output doesn't match the Zod type, it auto-corrects or fails gracefully.

## 🚀 Quick Start

### Prerequisites
*   Node.js 18+
*   Google Gemini API Key

### Installation
```bash
git clone https://github.com/Eatosin/Structura-NextJS.git
cd Structura-NextJS
npm install
```

### Configuration
Create a `.env.local` file:
```env
GOOGLE_GENERATIVE_AI_API_KEY=your_key_here
```

### Run
```bash
npm run dev
```

---

## 👨‍💻 Author
**Owadokun Tosin Tobi**
*Full-Stack AI Engineer*

*   **Portfolio:** [GitHub](https://github.com/eatosin)
*   **Connect:** [LinkedIn](https://www.linkedin.com/in/owadokun-tosin-tobi-6159091a3)

🔗 **Prefer the original Python version?** Check out **[Structura v1 (FastHTML + PydanticAI)](https://github.com/Eatosin/Structura)** — Lightweight, mobile-friendly, zero-cost prototype.
