import { useEffect, useRef, useState } from "react";
import type { Anime } from "@/data/anime";
import { nf, pct } from "@/lib/format";

type Props = {
  anime: Anime;
  collectionEpisodes: number;
  onClose: () => void;
};

const W = 1080;
const H = 1350;

const INK = "#070a12";
const FG = "#eaf0fb";
const PRIMARY = "#3f8cff";
const MUTED = "rgba(234,240,251,0.58)";

function proxied(src: string) {
  return src.startsWith("http") ? `/api/public/poster?url=${encodeURIComponent(src)}` : src;
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export function ShareCard({ anime, collectionEpisodes, onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const ink = INK;
      const fg = FG;
      const primary = PRIMARY;
      const muted = MUTED;

      ctx.fillStyle = ink;
      ctx.fillRect(0, 0, W, H);

      const glow = ctx.createRadialGradient(W / 2, 260, 40, W / 2, 380, 900);
      glow.addColorStop(0, anime.band + "66");
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      // poster
      const px = (W - 520) / 2;
      const py = 130;
      const pw = 520;
      const ph = 780;
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.9)";
      ctx.shadowBlur = 90;
      ctx.shadowOffsetY = 40;
      ctx.fillStyle = anime.spine;
      ctx.fillRect(px, py, pw, ph);
      ctx.restore();

      const img = anime.cover ? await loadImage(proxied(anime.cover)) : null;
      if (!alive) return;
      if (img) {
        const scale = Math.max(pw / img.width, ph / img.height);
        const dw = img.width * scale;
        const dh = img.height * scale;
        ctx.save();
        ctx.beginPath();
        ctx.rect(px, py, pw, ph);
        ctx.clip();
        ctx.drawImage(img, px + (pw - dw) / 2, py + (ph - dh) / 2, dw, dh);
        ctx.restore();
      } else {
        ctx.fillStyle = fg;
        ctx.font = "600 52px Georgia, serif";
        ctx.textAlign = "center";
        ctx.fillText(anime.title.slice(0, 18), W / 2, py + ph / 2);
      }
      ctx.fillStyle = anime.band;
      ctx.fillRect(px, py + ph - 10, pw, 10);

      // header
      ctx.textAlign = "center";
      ctx.fillStyle = primary;
      ctx.font = "600 26px ui-monospace, monospace";
      ctx.fillText("ABHI'S ANIME SHELF", W / 2, 80);

      // title
      ctx.fillStyle = fg;
      ctx.font = "700 72px Georgia, serif";
      const title = anime.title.length > 26 ? anime.title.slice(0, 25) + "…" : anime.title;
      ctx.fillText(title.toUpperCase(), W / 2, 1000);

      ctx.fillStyle = muted;
      ctx.font = "400 30px ui-monospace, monospace";
      ctx.fillText(
        `${anime.studio ?? "—"} · ${anime.year ?? "—"} · ${anime.genres.slice(0, 2).join(" / ")}`,
        W / 2,
        1046,
      );

      // stats row
      const minutes = anime.episodesWatched * anime.runtime;
      const stats: Array<[string, string]> = [
        [nf.format(anime.episodesWatched), anime.format === "movie" ? "VIEWING" : "EPISODES"],
        [`${Math.round(minutes / 60)}h`, "TIME GIVEN"],
        [`${pct(anime.episodesWatched, collectionEpisodes)}%`, "OF THE SHELF"],
      ];
      stats.forEach(([value, label], i) => {
        const cx = W / 2 + (i - 1) * 300;
        ctx.fillStyle = fg;
        ctx.font = "700 62px Georgia, serif";
        ctx.fillText(value, cx, 1180);
        ctx.fillStyle = muted;
        ctx.font = "500 22px ui-monospace, monospace";
        ctx.fillText(label, cx, 1218);
      });

      ctx.fillStyle = muted;
      ctx.font = "400 24px ui-monospace, monospace";
      ctx.fillText("abhi-anime-atlas.lovable.app", W / 2, 1300);

      try {
        setUrl(canvas.toDataURL("image/png"));
      } catch {
        setUrl(null);
      }
      setBusy(false);
    })();

    return () => {
      alive = false;
    };
  }, [anime, collectionEpisodes]);

  async function share() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/png"));
      if (!blob) return;
      const file = new File([blob], `${anime.id}-shelf-card.png`, { type: "image/png" });
      const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
      if (nav.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: anime.title });
      }
    } catch {
      /* ignore */
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Share card for ${anime.title}`}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label="Close share card"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-ink/85 backdrop-blur-xl"
      />
      <div className="relative z-10 w-full max-w-md rounded-xl border border-border bg-card/95 p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">Share card</p>
        <div className="mt-3 overflow-hidden rounded-lg border border-border bg-background">
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            className="block h-auto w-full"
            aria-label={`${anime.title} stats card`}
          />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <a
            href={url ?? "#"}
            download={`${anime.id}-shelf-card.png`}
            aria-disabled={!url}
            className={[
              "rounded-md bg-primary px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-primary-foreground transition-opacity hover:opacity-90",
              url ? "" : "pointer-events-none opacity-50",
            ].join(" ")}
          >
            {busy ? "Rendering…" : "Download"}
          </a>
          <button
            type="button"
            onClick={share}
            className="liquid-glass rounded-md px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-accent transition-colors hover:text-foreground"
          >
            Share
          </button>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto rounded-md border border-border bg-secondary px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
