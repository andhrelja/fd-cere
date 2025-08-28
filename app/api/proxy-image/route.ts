import { NextRequest } from "next/server"

const ALLOWED_HOSTS = [
  "lh3.googleusercontent.com",
  "lh4.googleusercontent.com",
  "lh5.googleusercontent.com",
  "lh6.googleusercontent.com",
  "drive.google.com",
  "www.googleapis.com",
]

function isAllowedHost(hostname: string): boolean {
  if (!hostname) return false
  return ALLOWED_HOSTS.includes(hostname) || hostname.endsWith(".googleusercontent.com")
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const target = searchParams.get("url")

    if (!target) {
      return new Response("Missing url parameter", { status: 400 })
    }

    const targetUrl = new URL(target)

    if (!isAllowedHost(targetUrl.hostname)) {
      return new Response("Host not allowed", { status: 400 })
    }

    // Optional: forward size hint to Google if present
    const width = searchParams.get("w")
    if (width && /\d+/.test(width)) {
      // Many Google thumbnail links accept size via "=s{w}" or "&sz=w{w}"; we won't rewrite aggressively here
      // but leaving hook in case upstream already supports it.
    }

    const upstream = await fetch(targetUrl.toString(), {
      headers: {
        Accept: "image/avif,image/webp,image/*,*/*;q=0.8",
        // Set a UA to avoid some providers treating it as a bot
        "User-Agent": "Mozilla/5.0 (compatible; fd-cere/1.0; +https://example.com)",
      },
      // Cache at the Next.js layer to reduce repeated hits
      next: { revalidate: 86400 }, // 24h
    })

    if (!upstream.ok) {
      return new Response(`Upstream error: ${upstream.status}`, { status: upstream.status })
    }

    const contentType = upstream.headers.get("content-type") || "application/octet-stream"

    // Stream the body through with caching headers for both browser and CDN
    return new Response(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        // Cache browser 1h, CDN 24h, allow stale while revalidating
        "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
      },
    })
  } catch (e) {
    return new Response("Proxy error", { status: 500 })
  }
} 