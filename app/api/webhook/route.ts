import { revalidateTag } from "next/cache";
import crypto from "crypto";

export const dynamic = "force-dynamic";

function verifySignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hmac = crypto.createHmac("sha256", secret);
  const digest = "sha256=" + hmac.update(payload).digest("hex");
  try {
    return crypto.timingSafeEqual(
      Buffer.from(digest, "utf8"),
      Buffer.from(signature, "utf8")
    );
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  try {
    const secret = process.env.GITHUB_WEBHOOK_SECRET;
    if (!secret) {
      return new Response("Webhook secret not configured", { status: 500 });
    }

    const signature = req.headers.get("x-hub-signature-256") || "";
    const event = req.headers.get("x-github-event") || "";
    const body = await req.text();

    if (!verifySignature(body, signature, secret)) {
      return new Response("Invalid signature", { status: 401 });
    }

    const payload = JSON.parse(body);
    console.log(`[Webhook] GitHub event: ${event}`, {
      repo: payload.repository?.name,
      ref: payload.ref,
    });

    // Revalidate cache saat ada push ke main/master
    if (
      event === "push" &&
      (payload.ref === "refs/heads/main" ||
        payload.ref === "refs/heads/master")
    ) {
      revalidateTag("github-data", "tag");
      console.log("[Webhook] Cache revalidated: github-data");
    }

    // Revalidate saat repo dibuat/diupdate
    if (event === "repository" || event === "create" || event === "delete") {
      revalidateTag("github-data", "tag");
    }

    return new Response(JSON.stringify({ ok: true, event }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[Webhook] Error:", error);
    return new Response("Internal error", { status: 500 });
  }
}