import { useMemo } from "react";
import { shelf, totalEpisodes, totalMinutes } from "@/data/anime";
import { nf, minutesToSpan } from "@/lib/format";

export function WatchDNA() {
  const dna = useMemo(() => {
    const genre = new Map<string, number>();
    const studio = new Map<string, number>();
    for (const a of shelf) {
      for (const g of a.genres) genre.set(g, (genre.get(g) ?? 0) + a.episodesWatched);
      studio.set(a.studio, (studio.get(a.studio) ?? 0) + a.episodesWatched);
    }
    const genres = [...genre.entries()].sort((x, y) => y[1] - x[1]).slice(0, 8);
    const top = genres[0]?.[1] ?? 1;
    const studios = [...studio.entries()].sort((x, y) => y[1] - x[1]).slice(0, 3);
    const longest = [...shelf].sort((a, b) => b.episodesWatched - a.episodesWatched)[0]!;
    const first = shelf.find((a) => a.first) ?? null;
    const films = shelf.filter((a) => a.format === "movie").length;
    const oldest = [...shelf]
      .filter((a) => a.year)
      .sort((a, b) => (a.year ?? 0) - (b.year ?? 0))[0]!;
    const span = minutesToSpan(totalMinutes);
    return { genres, top, studios, longest, first, films, oldest, span };
  }, []);

  return (
    <section id="watch-dna" className="border-t border-border/60 bg-card/20">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:px-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
          The shape of it
        </p>
        <h2 className="mt-2 font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-none tracking-wide">
          MY WATCH DNA
        </h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          Every episode counted and sorted. This is what {nf.format(dna.span.hours)} hours of
          watching actually looks like.
        </p>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          {/* genre strands */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Episodes by genre
            </p>
            <ul className="mt-6 space-y-4">
              {dna.genres.map(([g, n], i) => (
                <li key={g}>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-sm font-medium text-foreground">{g}</span>
                    <span className="font-mono text-[10px] tracking-widest text-muted-foreground">
                      {nf.format(n)} ep · {Math.round((n / totalEpisodes) * 100)}%
                    </span>
                  </div>
                  <div className="mt-2 h-[6px] w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="dna-strand h-full rounded-full bg-gradient-to-r from-primary to-accent"
                      style={{
                        width: `${Math.max(4, (n / dna.top) * 100)}%`,
                        animationDelay: `${i * 90}ms`,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* markers */}
          <dl className="grid grid-cols-2 gap-x-8 gap-y-8 self-start">
            <Marker
              k="First ever"
              v={dna.first?.title ?? "—"}
              sub={dna.first ? `${dna.first.year ?? ""} · where it started` : ""}
            />
            <Marker
              k="Longest run"
              v={dna.longest.title}
              sub={`${nf.format(dna.longest.episodesWatched)} episodes`}
            />
            <Marker
              k="Home studio"
              v={dna.studios[0]?.[0] ?? "—"}
              sub={`${nf.format(dna.studios[0]?.[1] ?? 0)} episodes of theirs`}
            />
            <Marker k="Films" v={`${dna.films}`} sub="one-sitting stories" />
            <Marker k="Oldest case" v={dna.oldest.title} sub={`${dna.oldest.year}`} />
            <Marker
              k="Time given"
              v={`${nf.format(dna.span.days)} days`}
              sub={`${nf.format(totalEpisodes)} episodes deep`}
            />
          </dl>
        </div>
      </div>
    </section>
  );
}

function Marker({ k, v, sub }: { k: string; v: string; sub: string }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        {k}
      </dt>
      <dd className="mt-2 font-display text-2xl leading-tight tracking-wide text-foreground">
        {v}
      </dd>
      <dd className="mt-1 text-xs text-muted-foreground">{sub}</dd>
    </div>
  );
}
