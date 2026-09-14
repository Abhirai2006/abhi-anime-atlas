import { useMemo } from "react";
import { shelf, type Anime } from "@/data/anime";
import { nf } from "@/lib/format";

const TIERS = [
  { key: "S", label: "Lived in it", min: 100, tone: "from-accent to-primary" },
  { key: "A", label: "Full seasons deep", min: 40, tone: "from-primary to-accent/60" },
  { key: "B", label: "A solid run", min: 20, tone: "from-primary/70 to-primary/30" },
  { key: "C", label: "Short and sharp", min: 0, tone: "from-muted-foreground/50 to-border" },
] as const;

export function HallOfFame({ onOpen }: { onOpen: (id: string) => void }) {
  const rows = useMemo(() => {
    const sorted = [...shelf].sort((a, b) => b.episodesWatched - a.episodesWatched);
    return TIERS.map((t, i) => {
      const max = i === 0 ? Infinity : TIERS[i - 1]!.min;
      return { ...t, items: sorted.filter((a) => a.episodesWatched >= t.min && a.episodesWatched < max) };
    }).filter((t) => t.items.length > 0);
  }, []);

  return (
    <section id="hall-of-fame" className="border-t border-border/60">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:px-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
          Ranked by hours given
        </p>
        <h2 className="mt-2 font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-none tracking-wide">
          HALL OF FAME
        </h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          No made-up scores — the tiers are how much of my life each title actually took. Click any
          cover to open its case.
        </p>

        <div className="mt-12 space-y-4">
          {rows.map((t) => (
            <div
              key={t.key}
              className="flex flex-col gap-4 rounded-lg border border-border bg-card/40 p-4 sm:flex-row"
            >
              <div
                className={`flex shrink-0 items-center justify-center rounded-md bg-gradient-to-br ${t.tone} px-4 py-3 sm:w-28 sm:flex-col`}
              >
                <span className="font-display text-4xl leading-none text-background">{t.key}</span>
                <span className="ml-3 text-center font-mono text-[9px] uppercase leading-tight tracking-widest text-background/80 sm:ml-0 sm:mt-2">
                  {t.label}
                </span>
              </div>
              <ul className="flex flex-wrap gap-3">
                {t.items.map((a) => (
                  <li key={a.id}>
                    <TierCase anime={a} onOpen={onOpen} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TierCase({ anime, onOpen }: { anime: Anime; onOpen: (id: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(anime.id)}
      title={`${anime.title} — ${nf.format(anime.episodesWatched)} episodes`}
      className="tier-chip group relative block h-[104px] w-[70px] overflow-hidden rounded border border-border bg-secondary transition-transform hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {anime.cover ? (
        <img
          src={anime.cover}
          alt={`${anime.title} cover`}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="flex h-full items-center justify-center p-1 text-center font-display text-[11px] leading-tight">
          {anime.title}
        </span>
      )}
      <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/95 to-transparent px-1 pb-1 pt-4 font-mono text-[8px] uppercase tracking-widest text-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        {nf.format(anime.episodesWatched)} ep
      </span>
    </button>
  );
}
