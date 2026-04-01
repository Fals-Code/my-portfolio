import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";

const google = createGoogleGenerativeAI({
  apiKey: process.env.MY_OWN_GEMINI_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export const dynamic = "force-dynamic";
export const maxDuration = 30;


export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    console.log("INCOMING MESSAGES:", JSON.stringify(messages, null, 2));

    if (!messages || !Array.isArray(messages)) {
      return new Response("No messages or invalid format", { status: 400 });
    }

    // IMPORTANT: Gemini requires the first message to be from the 'user'.
    // If the history starts with the 'assistant' welcome message, it will fail.
    // We filter out any leading assistant messages.
    const filteredMessages = messages.filter((m, index) => {
      if (index === 0 && m.role === "assistant") return false;
      return true;
    });

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY && !process.env.MY_OWN_GEMINI_KEY) {
      return new Response(
        JSON.stringify({ error: "API Key is missing in .env.local" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("SENDING REQUEST TO GEMINI...");
    console.log("FINAL MESSAGES SENT TO GOOGLE:", JSON.stringify(filteredMessages, null, 2));

    const result = await streamText({
      model: google("gemini-flash-latest"),
      system: `You are Falah's Assistant. Ahmad Mathlaul Falah: Mahasiswa aktif D4 Teknik Informatika di Universitas Airlangga (UNAIR) & Backend Developer. Tech: Laravel, Clean Architecture. Proyek: HIS (Sistem Antrian RS), Warehouse Inventory (Transaksi Database). Bersikap teknis & ringkas.`,
      messages: filteredMessages,
      temperature: 0,
      maxTokens: 500,
    });

    return result.toDataStreamResponse({
      headers: {
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "no-cache, no-transform",
        "X-Accel-Buffering": "no",
      }
    });

  } catch (error) {
    console.log("CHAT ERROR:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: "Chat Error", details: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}