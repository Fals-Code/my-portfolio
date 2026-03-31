import { NextResponse } from "next/server";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

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

    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { reply: "Maaf, sepertinya konfigurasi AI sedang bermasalah. Coba lagi nanti ya!" },
        { status: 500 }
      );
    }

    // Prepare messages for Anthropic
    // Anthropic expects: system: "...", messages: [{role: "user", content: "..."}]
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: messages.map((m: any) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Anthropic API Error:", errorData);
      throw new Error("Anthropic API responded with an error");
    }

    const data = await response.json();
    const reply = data.content[0].text;

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API Route Error:", error);
    return NextResponse.json(
      { reply: "Maaf, saya sedang tidak bisa berpikir jernih. Tolong coba lagi beberapa saat lagi!" },
      { status: 500 }
    );
  }
}
