import { GITHUB_USERNAME } from "@/lib/constants";
import { GitHubStats, GitHubLanguage } from "@/types";
import { revalidateTag } from "next/cache";

const CACHE_DURATION_SECONDS = 300;

export async function GET() {
  try {
    const token = process.env.GITHUB_TOKEN;
    const headers: HeadersInit = {
      "Accept": "application/vnd.github.v3+json",
      ...(token && { "Authorization": `Bearer ${token}` })
    };

    // 1. User profile
    const userRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
      headers,
      next: { tags: ["github-data"], revalidate: CACHE_DURATION_SECONDS }
    });
    if (!userRes.ok) throw new Error("Failed to fetch user data");
    const userData = await userRes.json();

    // 2. All repositories
    const reposRes = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
      { headers, next: { tags: ["github-data"], revalidate: CACHE_DURATION_SECONDS } }
    );
    if (!reposRes.ok) throw new Error("Failed to fetch repositories");
    const reposData = await reposRes.json();

    // 3. Aggregate Stats
    let totalStars = 0;
    const languagesMap: Record<string, number> = {};

    reposData.forEach((repo: any) => {
      totalStars += repo.stargazers_count;
      if (repo.language) {
        const size = repo.size * 1024;
        languagesMap[repo.language] = (languagesMap[repo.language] || 0) + size;
      }
    });

    const stats: GitHubStats = {
      repositories: userData.public_repos,
      followers: userData.followers,
      stars: totalStars,
      createdAt: userData.created_at,
    };

    // 4. Language Distribution
    const LANGUAGE_COLORS: Record<string, string> = {
      PHP: "#4F5D95", JavaScript: "#f1e05a", Blade: "#f7523f",
      CSS: "#563d7c", HTML: "#e34c26", TypeScript: "#3178c6",
      Vue: "#41b883", React: "#61dafb",
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
      .slice(0, 8);

    // 5. Projects dari repos (filter repo non-fork yang punya description)
    const projects = reposData
      .filter((repo: any) => !repo.fork && repo.description)
      .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6)
      .map((repo: any) => ({
        id: repo.name,
        title: repo.name
          .replace(/-/g, " ")
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c: string) => c.toUpperCase()),
        description: repo.description || "",
        tech: repo.topics || [],
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
        github: repo.html_url,
        homepage: repo.homepage || null,
        updatedAt: repo.updated_at,
        isPrivate: repo.private,
      }));

    // 6. Last activity (untuk "sedang coding" status)
    const lastPushAt = reposData
      .filter((r: any) => !r.fork)
      .sort((a: any, b: any) =>
        new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
      )[0]?.pushed_at || null;

    return new Response(
      JSON.stringify({ stats, languages, projects, lastPushAt }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": `s-maxage=${CACHE_DURATION_SECONDS}, stale-while-revalidate`,
        },
      }
    );
  } catch (error) {
    console.error("GitHub API Route Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch from GitHub" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}