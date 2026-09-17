import { createFileRoute } from "@tanstack/react-router";

const ALLOWED = new Set(["media.kitsu.app", "media.kitsu.io", "kitsu.io"]);

export const Route = createFileRoute("/api/public/poster")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const raw = new URL(request.url).searchParams.get("url");
        if (!raw) return new Response("Missing url", { status: 400 });

        let target: URL;
        try {
          target = new URL(raw);
        } catch {
          return new Response("Bad url", { status: 400 });
        }
        if (target.protocol !== "https:" || !ALLOWED.has(target.hostname)) {
          return new Response("Host not allowed", { status: 403 });
        }

        const upstream = await fetch(target.toString());
        if (!upstream.ok || !(upstream.headers.get("content-type") ?? "").startsWith("image/")) {
          return new Response("Not an image", { status: 502 });
        }

        return new Response(upstream.body, {
          status: 200,
          headers: {
            "content-type": upstream.headers.get("content-type") ?? "image/jpeg",
            "cache-control": "public, max-age=86400",
          },
        });
      },
    },
  },
});
