export const dynamic = "force-dynamic";

// In-memory store (reset on redeploy)
// Untuk production: ganti dengan Vercel KV / Upstash Redis
const visitorStore = new Map<string, boolean>();
let totalCount = 0;

export async function GET(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "anonymous";

  const isNewVisitor = !visitorStore.has(ip);
  if (isNewVisitor) {
    visitorStore.set(ip, true);
    totalCount++;
  }

  return new Response(
    JSON.stringify({
      total: totalCount,
      unique: visitorStore.size,
      isNew: isNewVisitor,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    }
  );
}