import type { CSSProperties } from "react";
import type { Anime } from "@/data/anime";

type Props = {
  anime: Anime;
  index: number;
  dimmed?: boolean;
  onOpen: (id: string) => void;
};

const COVER_W = 164;

export function AnimeCase({ anime, index, dimmed, onOpen }: Props) {
  const rest = `rotateZ(${anime.lean}deg) translateZ(${anime.depth}px)`;
  const hover = `rotateZ(0deg) rotateY(36deg) translateZ(74px) translateY(-14px)`;

  const style = {
    width: anime.width,
    height: anime.height,
    "--t": rest,
    "--th": hover,
    animationDelay: `${Math.min(index * 26, 900)}ms`,
  } as CSSProperties;

  const base = anime.width >= 60 ? 18 : anime.width >= 44 ? 16 : 14;
  const len = anime.title.length;
  const titleSize = len > 38 ? base - 5 : len > 26 ? base - 3 : base;

  return (
    <button
      type="button"
      onClick={() => onOpen(anime.id)}
      aria-label={`${anime.title} — ${anime.episodesWatched} episodes watched`}
      style={style}
      className={[
        "group relative shrink-0 origin-bottom cursor-pointer select-none rounded-[3px] outline-none",
        "shelf-in focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4",
        "focus-visible:ring-offset-background",
        dimmed ? "opacity-25 saturate-0" : "opacity-100",
        "transition-[opacity,filter] duration-500",
      ].join(" ")}
    >
      <div className="case-3d absolute inset-0 origin-bottom [transform:var(--t)] group-hover:[transform:var(--th)] group-focus-visible:[transform:var(--th)]">
        {/* front cover, hinged on the left edge */}
        <div
          className="case-face case-cover-face rounded-[2px] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)]"
          style={{ width: COVER_W, backgroundColor: anime.spine }}
        >
          {anime.cover ? (
            <img
              src={anime.cover}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ink to-secondary p-3 text-center">
              <span className="font-display text-xl leading-none tracking-wide text-foreground/80">
                {anime.title}
              </span>
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/55 via-transparent to-black/25" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,transparent_35%,rgba(255,255,255,0.18)_48%,transparent_58%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
        </div>

        {/* top edge */}
        <div
          className="case-top absolute left-0 top-0 origin-top"
          style={{
            width: anime.width,
            height: COVER_W,
            background: `linear-gradient(180deg, ${anime.spine}, #05070b)`,
          }}
        />

        {/* spine — the face you actually see on the shelf */}
        <div
          className="case-face w-full overflow-hidden rounded-[2px]"
          style={{
            width: anime.width,
            backgroundColor: anime.spine,
            boxShadow:
              "inset 1px 0 0 rgba(255,255,255,0.09), inset -2px 0 6px rgba(0,0,0,0.7), 0 24px 40px -22px rgba(0,0,0,0.95)",
          }}
        >
          {anime.cover && (
            <img
              src={anime.cover}
              alt=""
              aria-hidden
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full scale-110 object-cover opacity-70 blur-[1.5px] saturate-[1.6] contrast-125"
            />
          )}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, ${anime.spine}99 0%, ${anime.spine}cc 40%, ${anime.spine}e6 78%, #060810 100%)`,
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.14),transparent_38%,transparent_72%,rgba(0,0,0,0.5))]" />
          {/* colour band */}
          <div
            className="absolute left-0 right-0 top-[14px] h-[3px]"
            style={{ backgroundColor: anime.band, opacity: 0.9 }}
          />
          <div
            className="absolute bottom-[34px] left-0 right-0 h-[2px]"
            style={{ backgroundColor: anime.band, opacity: 0.45 }}
          />

          {/* vertical title */}
          <div className="absolute inset-x-0 bottom-[44px] top-[26px] flex items-start justify-center">
            <span
              className="spine-title font-display leading-none text-foreground/92 [text-shadow:0_1px_3px_rgba(0,0,0,0.9)]"
              style={{ fontSize: titleSize, maxHeight: "100%", overflow: "hidden" }}
            >
              {anime.title}
            </span>
          </div>

          {/* episode count foot */}
          <div className="absolute inset-x-0 bottom-[9px] text-center">
            <span className="font-mono text-[9px] tracking-tight text-foreground/55">
              {anime.format === "movie" ? "FILM" : anime.episodesWatched}
            </span>
          </div>

          {anime.first && (
            <div
              className="absolute left-1/2 top-[24px] h-[7px] w-[7px] -translate-x-1/2 rotate-45"
              style={{ backgroundColor: "var(--accent)" }}
              title="The one that started it all"
            />
          )}

          {/* wear */}
          <div
            className="pointer-events-none absolute inset-0 mix-blend-overlay"
            style={{
              opacity: anime.wear,
              background:
                "linear-gradient(90deg, rgba(255,255,255,0.25), transparent 30%, transparent 70%, rgba(255,255,255,0.18))",
            }}
          />
        </div>
      </div>

      {/* hover nameplate */}
      <div className="pointer-events-none absolute -top-[68px] left-1/2 z-30 w-56 -translate-x-1/2 -translate-y-2 rounded-md border border-border/70 bg-card/90 px-3 py-2 text-center opacity-0 shadow-xl backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
        <p className="truncate font-sans text-[13px] font-semibold text-foreground">
          {anime.title}
        </p>
        <p className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {anime.format === "movie"
            ? `Film · ${anime.year ?? "—"}`
            : `${anime.episodesWatched} ep · ${anime.year ?? "—"}`}
        </p>
      </div>
    </button>
  );
}
