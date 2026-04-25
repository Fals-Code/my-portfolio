export const dynamic = "force-dynamic";

let statusCache: any = null;
let lastStatusTime = 0;
const STATUS_CACHE_DURATION = 2 * 60 * 1000; // 2 menit

export async function GET() {
  try {
    const now = Date.now();
    if (statusCache && (now - lastStatusTime < STATUS_CACHE_DURATION)) {
      return new Response(JSON.stringify(statusCache), {
        status: 200,
        headers: { "Content-Type": "application/json", "X-Cache": "HIT" }
      });
    }

    const wakatimeKey = process.env.WAKATIME_API_KEY;
    const githubToken = process.env.GITHUB_TOKEN;

    let isOnline = false;
    let isCoding = false;
    let lastSeen: string | null = null;
    let source = "github";

    // Coba WakaTime dulu (lebih akurat)
    if (wakatimeKey) {
      try {
        const encoded = Buffer.from(wakatimeKey).toString("base64");
        const res = await fetch(
          "https://wakatime.com/api/v1/users/current/status_bar/today",
          {
            headers: { Authorization: `Basic ${encoded}` },
            next: { tags: ["wakatime-data"], revalidate: 60 },
          }
        );
        if (res.ok) {
          const data = await res.json();
          const d = data.data;
          if (d?.heartbeat_at) {
            const lastHeartbeat = new Date(d.heartbeat_at);
            const diffMinutes =
              (Date.now() - lastHeartbeat.getTime()) / 1000 / 60;
            isCoding = diffMinutes <= 10; // aktif coding dalam 10 menit terakhir
            isOnline = diffMinutes <= 30; // online dalam 30 menit terakhir
            lastSeen = d.heartbeat_at;
            source = "wakatime";
          }
        }
      } catch (e) {
        console.warn("WakaTime status check failed, falling back to GitHub");
      }
    }

    // Fallback: cek aktivitas GitHub terakhir
    if (!lastSeen && githubToken) {
      try {
        const { GITHUB_USERNAME } = await import("@/lib/constants");
        const res = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/events?per_page=1`,
          {
            headers: {
              Authorization: `Bearer ${githubToken}`,
              Accept: "application/vnd.github.v3+json",
            },
            next: { tags: ["github-data"], revalidate: 300 },
          }
        );
        if (res.ok) {
          const events = await res.json();
          if (events?.[0]?.created_at) {
            const lastEvent = new Date(events[0].created_at);
            const diffHours =
              (Date.now() - lastEvent.getTime()) / 1000 / 60 / 60;
            isOnline = diffHours <= 24;
            lastSeen = events[0].created_at;
          }
        }
      } catch (e) {
        console.warn("GitHub event check failed");
      }
    }

    statusCache = { isOnline, isCoding, lastSeen, source };
    lastStatusTime = Date.now();

    return new Response(
      JSON.stringify(statusCache),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "s-maxage=60, stale-while-revalidate=30",
          "X-Cache": "MISS"
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ isOnline: false, isCoding: false, lastSeen: null }),
      { status: 200 }
    );
  }
}