import { GITHUB_USERNAME } from "@/lib/constants";
import { GitHubStats, GitHubLanguage } from "@/types";

const CACHE_DURATION_SECONDS = 300;

export async function GET() {
  try {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      console.warn("No GITHUB_TOKEN provided");
    }

    const headers: HeadersInit = {
      "Accept": "application/vnd.github.v3+json",
      ...(token && { "Authorization": `Bearer ${token}` })
    };

    // 1. Fetch user profile
    const userRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, { headers });
    if (!userRes.ok) throw new Error("Failed to fetch user data");
    const userData = await userRes.json();

    // 2. Fetch all repositories
    const reposRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`, { headers });
    if (!reposRes.ok) throw new Error("Failed to fetch repositories");
    const reposData = await reposRes.json();

    // 3. Aggregate Stats
    let totalStars = 0;
    const languagesMap: Record<string, number> = {};
    
    reposData.forEach((repo: any) => {
      totalStars += repo.stargazers_count;
      
      if (repo.language) {
        const lang = repo.language;
        const size = repo.size * 1024; // approx bytes
        languagesMap[lang] = (languagesMap[lang] || 0) + size;
      }
    });

    const stats: GitHubStats = {
      repositories: userData.public_repos,
      followers: userData.followers,
      stars: totalStars,
    };

    // 4. Calculate Language Distribution
    const LANGUAGE_COLORS: Record<string, string> = {
      PHP: "#4F5D95",
      JavaScript: "#f1e05a",
      Blade: "#f7523f",
      CSS: "#563d7c",
      HTML: "#e34c26",
      TypeScript: "#3178c6",
      Vue: "#41b883",
      React: "#61dafb",
    };

    const totalBytes = Object.values(languagesMap).reduce((a, b) => a + b, 0);
    const languages: GitHubLanguage[] = Object.entries(languagesMap)
      .map(([name, bytes]) => ({
        name,
        color: LANGUAGE_COLORS[name] || "#888888",
        percentage: totalBytes > 0 ? (bytes / totalBytes) * 100 : 0,
        bytes,
      }))
      .sort((a, b) => b.bytes - a.bytes)
      .slice(0, 8); // Top 8

    return new Response(JSON.stringify({ stats, languages }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": `s-maxage=${CACHE_DURATION_SECONDS}, stale-while-revalidate`,
      },
    });
  } catch (error) {
    console.error("GitHub API Route Error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch from GitHub" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
