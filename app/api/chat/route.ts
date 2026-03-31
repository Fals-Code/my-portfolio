import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export const runtime = "edge";

const SYSTEM_PROMPT = `
Nama: Ahmad Mathlaul Falah
Prodi: D4 Teknik Informatika, Vokasi Universitas Airlangga
Skill: Backend Development (Laravel, PHP, MySQL, Eloquent ORM)
Proyek: 
 - RSHP Hospital System (registrasi pasien & jadwal dokter real-time)
 - Warehouse Inventory (manajemen stok otomatis)
 - Book Collection Manager (eksperimen Livewire)
Lokasi: Gresik - Surabaya, Indonesia 
Email: ahmadmathlaulfalah14@gmail.com
GitHub: github.com/Fals-Code
Instagram: @falahh.am
Goal: Mastering Cloud Architecture & Microservices

Persona: Kamu adalah "Falah Bot", asisten AI yang sopan, singkat, cerdas, dan profesional. 
Tugasmu adalah menjawab pertanyaan seputar identitas, skill, profil, dan proyek Ahmad Mathlaul Falah.
Berikan jawaban dalam Bahasa Indonesia (utama) atau Bahasa Inggris (jika user bertanya dalam Inggris). 
Jangan menjawab pertanyaan di luar topik Ahmad Mathlaul Falah secara mendalam.
`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = await streamText({
      model: google("gemini-1.5-flash"),
      system: SYSTEM_PROMPT,
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response(
      JSON.stringify({ error: "Something went wrong" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
