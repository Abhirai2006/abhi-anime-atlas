import { useEffect, useState } from "react";
import type { Anime } from "@/data/anime";
import { nf, pct } from "@/lib/format";
import { ShareCard } from "@/components/shelf/ShareCard";

type Props = {
  anime: Anime;
  collectionEpisodes: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export function CaseDetail({ anime, collectionEpisodes, onClose, onPrev, onNext }: Props) {
  const [cardOpen, setCardOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  const minutes = anime.episodesWatched * anime.runtime;
  const share = pct(anime.episodesWatched, collectionEpisodes);
  const progress =
    anime.totalEpisodes && anime.totalEpisodes > 0
      ? Math.min(100, (anime.episodesWatched / anime.totalEpisodes) * 100)
      : 100;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={anime.title}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-ink/80 backdrop-blur-xl"
      />

      <div className="relative z-10 grid max-h-[88vh] w-full max-w-4xl grid-cols-1 gap-8 overflow-y-auto rounded-xl border border-border bg-card/95 p-6 shadow-[0_50px_120px_-40px_rgba(0,0,0,1)] sm:grid-cols-[240px_1fr] sm:p-9">
        <div>
          <div
            className="relative aspect-[2/3] w-full overflow-hidden rounded-md shadow-[0_30px_70px_-25px_rgba(0,0,0,1)]"
            style={{ backgroundColor: anime.spine }}
          >
            {anime.cover ? (
              <img
                src={anime.cover}
                alt={`${anime.title} key art`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center p-4 text-center">
                <span className="font-display text-2xl tracking-wide text-foreground/80">
                  {anime.title}
                </span>
              </div>
            )}
            <div
              className="absolute inset-x-0 bottom-0 h-1.5"
              style={{ backgroundColor: anime.band }}
            />
          </div>

          <div className="mt-4 space-y-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            <div className="flex justify-between">
              <span>Studio</span>
              <span className="text-foreground/85 normal-case">{anime.studio}</span>
            </div>
            <div className="flex justify-between">
              <span>Year</span>
              <span className="text-foreground/85">{anime.year ?? "—"}</span>
            </div>
            <div className="flex justify-between">
              <span>Format</span>
              <span className="text-foreground/85">
                {anime.format === "movie" ? "Film" : anime.case === "boxset" ? "Box set" : "Series"}
              </span>
            </div>
          </div>
        </div>

        <div className="min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary">
            {anime.status === "watching" ? "Still watching" : "Finished"}
          </p>
          <h2 className="mt-2 font-display text-4xl leading-none tracking-wide text-foreground sm:text-5xl">
            {anime.title}
          </h2>
          {anime.romaji && anime.romaji !== anime.title && (
            <p className="mt-1 font-mono text-xs text-muted-foreground">{anime.romaji}</p>
          )}

          {anime.first && (
            <p className="mt-3 font-hand text-lg text-accent">
              the one that started all of this
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            {anime.genres.map((g) => (
              <span
                key={g}
                className="rounded-full border border-border bg-secondary px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
              >
                {g}
              </span>
            ))}
          </div>

          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            {anime.synopsis || "No synopsis on file."}
          </p>

          <div className="mt-6 rounded-lg border border-border bg-background/60 p-4">
            <div className="flex items-end justify-between">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Watched
              </span>
              <span className="font-display text-3xl leading-none text-foreground">
                {nf.format(anime.episodesWatched)}
                <span className="ml-1 font-mono text-[11px] text-muted-foreground">
                  {anime.format === "movie" ? "viewing" : "episodes"}
                </span>
              </span>
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full transition-[width] duration-700"
                style={{
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, var(--primary), ${anime.band})`,
                }}
              />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <div>
                <span className="block text-sm normal-case tracking-normal text-foreground">
                  {Math.round(minutes / 60)}h
                </span>
                time given
              </div>
              <div>
                <span className="block text-sm normal-case tracking-normal text-foreground">
                  {share}%
                </span>
                of the shelf
              </div>
              <div>
                <span className="block text-sm normal-case tracking-normal text-foreground">
                  {anime.totalEpisodes ? nf.format(anime.totalEpisodes) : "ongoing"}
                </span>
                total
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2">
            <button
              type="button"
              onClick={onPrev}
              className="rounded-md border border-border bg-secondary px-3 py-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
            >
              ← Prev
            </button>
            <button
              type="button"
              onClick={onNext}
              className="rounded-md border border-border bg-secondary px-3 py-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
            >
              Next →
            </button>
            <button
              type="button"
              onClick={() => setCardOpen(true)}
              className="liquid-glass rounded-md px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-accent transition-colors hover:text-foreground"
            >
              ↗ Share card
            </button>
            <button
              type="button"
              onClick={onClose}
              className="ml-auto rounded-md bg-primary px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-primary-foreground transition-opacity hover:opacity-90"
            >
              Back to shelf
            </button>
          </div>
        </div>
      </div>

      {cardOpen && (
        <ShareCard
          anime={anime}
          collectionEpisodes={collectionEpisodes}
          onClose={() => setCardOpen(false)}
        />
      )}
    </div>
  );
}
