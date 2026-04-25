export const dynamic = "force-dynamic";
export const revalidate = 3600; // 1 jam

// Simple In-Memory Cache to prevent slow dev reloads
let cache: any = null;
let lastCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 menit

export async function GET() {
  try {
    const now = Date.now();
    if (cache && (now - lastCacheTime < CACHE_DURATION)) {
      return new Response(JSON.stringify(cache), {
        status: 200,
        headers: { "Content-Type": "application/json", "X-Cache": "HIT" }
      });
    }

    const apiKey = process.env.WAKATIME_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "WAKATIME_API_KEY not configured" }),
        { status: 503 }
      );
    }

    const encoded = Buffer.from(apiKey).toString("base64");
    const headers = { Authorization: `Basic ${encoded}` };

    // Fetch stats last 7 days
    const [statsRes, todayRes] = await Promise.allSettled([
      fetch("https://wakatime.com/api/v1/users/current/stats/last_7_days", {
        headers,
        next: { revalidate: 3600 },
      }),
      fetch("https://wakatime.com/api/v1/users/current/status_bar/today", {
        headers,
        next: { revalidate: 60 }, // refresh tiap 1 menit untuk status live
      }),
    ]);

    let weeklyStats = null;
    let todayStatus = null;

    if (statsRes.status === "fulfilled" && statsRes.value.ok) {
      const data = await statsRes.value.json();
      const d = data.data;
      weeklyStats = {
        totalSeconds: d.total_seconds,
        dailyAvgSeconds: d.daily_average,
        languages: (d.languages || []).slice(0, 6).map((l: any) => ({
          name: l.name,
          percent: l.percent,
          text: l.text,
        })),
        editors: (d.editors || []).slice(0, 3).map((e: any) => ({
          name: e.name,
          percent: e.percent,
          text: e.text,
        })),
        projects: (d.projects || []).slice(0, 5).map((p: any) => ({
          name: p.name,
          text: p.text,
          percent: p.percent,
        })),
        categories: (d.categories || []).map((c: any) => ({
          name: c.name,
          text: c.text,
          percent: c.percent,
        })),
      };
    }

    if (todayRes.status === "fulfilled" && todayRes.value.ok) {
      const data = await todayRes.value.json();
      const d = data.data;
      todayStatus = {
        isCoding: d.is_coding_activity_visible !== false && !!d.heartbeat_at,
        currentProject: d.project || null,
        currentLanguage: d.language || null,
        lastHeartbeatAt: d.heartbeat_at || null,
        todayTotal: d.grand_total?.text || "0 mins",
      };
    }

    cache = { weeklyStats, todayStatus };
    lastCacheTime = Date.now();

    return new Response(
      JSON.stringify(cache),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "s-maxage=60, stale-while-revalidate",
          "X-Cache": "MISS"
        },
      }
    );
  } catch (error) {
    console.error("WakaTime API Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch WakaTime data" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}