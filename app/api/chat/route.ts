import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

// Simple in-memory rate limiting (Best-effort on serverless)
const rateLimitMap = new Map<string, { count: number, resetTime: number }>();
const RATE_LIMIT_MAX = 5; // 5 requests
const RATE_LIMIT_WINDOW = 60 * 1000; // per minute

export async function POST(req: Request) {
  try {
    // 1. Origin Validation
    const origin = req.headers.get("origin") || req.headers.get("referer") || "";
    // Allow localhost for dev, falah.com for prod (add other domain aliases if necessary)
    if (process.env.NODE_ENV === "production" && origin) {
      try {
        const url = new URL(origin);
        if (url.hostname !== "falah.com" && url.hostname !== "www.falah.com" && url.hostname !== "localhost") {
          return new Response(JSON.stringify({ error: "Forbidden: Invalid Origin" }), { status: 403 });
        }
      } catch (e) {
        return new Response(JSON.stringify({ error: "Forbidden: Malformed Origin" }), { status: 403 });
      }
    }

    // 2. Light In-Memory Rate Limiting
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown-ip";
    const now = Date.now();
    let clientLimit = rateLimitMap.get(ip);
    
    if (!clientLimit || now > clientLimit.resetTime) {
      clientLimit = { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
    }
    clientLimit.count++;
    rateLimitMap.set(ip, clientLimit);

    if (clientLimit.count > RATE_LIMIT_MAX) {
      return new Response(JSON.stringify({ error: "Too Many Requests" }), { 
        status: 429, 
        headers: { "Content-Type": "application/json" } 
      });
    }

    const { messages } = await req.json();
    console.log(`[${ip}] INCOMING MESSAGES:`, messages.length);

    const apiKey = process.env.MY_OWN_GEMINI_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      console.error("CRITICAL: API Key is missing!");
      return new Response(
        JSON.stringify({ error: "API Key is missing in .env.local" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const google = createGoogleGenerativeAI({ apiKey });

    if (!messages || !Array.isArray(messages)) {
      return new Response("No messages or invalid format", { status: 400 });
    }

    // Filter pesan pertama agar selalu dari 'user' (Requirement Gemini)
    const filteredMessages = messages.filter((m, index) => {
      if (index === 0 && m.role === "assistant") return false;
      return true;
    });

    console.log("SENDING REQUEST TO GEMINI AS FALAH BOT...");

    const result = await streamText({
      model: google("gemini-2.5-flash"),
      system: `
        Kamu adalah **Falah Bot** — asisten virtual cerdas dan profesional milik Ahmad Mathlaul Falah.
        Tugasmu adalah menjawab pertanyaan pengunjung portofolio dengan akurat, natural, dan personal — seperti Falah sendiri yang berbicara.

        ### 👤 PROFIL LENGKAP
        - **Nama**: Ahmad Mathlaul Falah (Falah).
        - **Status**: Mahasiswa D4 Teknik Informatika, Universitas Airlangga (UNAIR), Angkatan 2024.
        - **Domisili**: Gresik — Surabaya, Jawa Timur.
        - **Role**: Backend Developer (Laravel & PHP Specialist).
        - **Kontak**: ahmadmathlaulfalah14@gmail.com | GitHub: Fals-Code | IG: @falahh.am.

        ### 🧠 BEHAVIORAL GUIDELINES
        - **Bahasa**: Gunakan bahasa yang sama dengan user (Indonesia/English/Campuran).
        - **Gaya Bicara**: Conversational, tidak robotic. Gunakan paragraf mengalir. Hindari bullet-point kaku jika tidak perlu.
        - **Karakter**: Antusias soal backend, jujur soal proses belajar, humble tapi percaya diri.
        - **Filosofi**: Fokus pada sistem yang kokoh, maintainable, dan scalable (ACID compliance, Clean Architecture).
        - **Hobi**: Kulineran (kopi & lokal) dan main PES 21 (Local Match).

        ### 🛠️ TECH STACK
        - **Expert**: PHP, Laravel, Eloquent ORM.
        - **Advanced**: MySQL, PostgreSQL, Git/GitHub, RESTful API.
        - **Intermediate/Learning**: Docker, Livewire V3, TypeScript, React/Next.js.

        ### 📁 PROYEK UNGGULAN
        1. **RSHP (Hospital Info System) - 2025**: Digitalisasi manajemen RS. Solusi: Smart Scheduling & Real-time queue sync menggunakan Laravel.
        2. **Warehouse Inventory System - 2025**: Manajemen stok otomatis. Solusi: Laravel Database Transactions untuk mencegah race condition (ACID Compliance).
        3. **Book Collection Manager (WIP) - 2026**: Eksplorasi TALL Stack (Tailwind, Alpine, Laravel, Livewire V3).

        ### 🚫 BATASAN & PENOLAKAN
        - Jika ditanya di luar topik portofolio (resep, politik, dsb), tolak dengan sopan. 
        - Contoh: "Wah itu di luar bidang saya hehe. Ada yang bisa saya ceritakan soal proyek atau skill Falah?"
        - Jangan mengarang fakta. Jika tidak ada di data, katakan tidak tahu atau arahkan ke kontak Falah.

        *Falah Bot v2.0 — Powered by Gemini | Portfolio: falah.com*
      `,
      messages: filteredMessages,
      temperature: 0.2, // Sedikit dinaikkan dari 0.1 agar jawaban lebih natural/tidak kaku
      maxTokens: 600,
      maxRetries: 2,
    });

    return result.toDataStreamResponse();

  } catch (error) {
    console.log("CHAT ERROR:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: "Chat Error", details: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}