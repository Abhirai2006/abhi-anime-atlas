import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { shelf, allGenres, totalEpisodes, totalMinutes } from "@/data/anime";
import { CaseDetail } from "@/components/shelf/CaseDetail";
import { CurvedShelf } from "@/components/shelf/CurvedShelf";
import { RecommendDialog } from "@/components/shelf/RecommendDialog";
import { ThemeToggle } from "@/components/shelf/ThemeToggle";
import { listRecommendations, moodSearch, type Recommendation } from "@/lib/anime.functions";
import { nf, minutesToSpan } from "@/lib/format";

const SITE = "https://abhi-anime-atlas.lovable.app";
const OG_IMAGE = `${SITE}/og-cover.jpg`;
const TITLE = "Abhi's Anime Shelf — 3,600+ Episodes Watched";
const DESC =
  "A 3D shelf of every anime Abhi has watched: 3,600+ episodes as cases you can pull off the rack, a mood curator, and an open slot for your recommendation.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      {
        name: "keywords",
        content:
          "anime shelf, anime collection, watched anime list, anime tracker, anime recommendations, 3D anime gallery",
      },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Abhi's Anime Shelf" },
      { property: "og:url", content: `${SITE}/` },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "A curved wall of anime cases in a dark lit room" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE}/` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: TITLE,
          description: DESC,
          url: `${SITE}/`,
          image: OG_IMAGE,
          inLanguage: "en",
          author: {
            "@type": "Person",
            name: "Abhishek Rai A",
            url: "https://portfolio-abhirai2006.lovable.app",
          },
          about: { "@type": "Thing", name: "Anime" },
          mainEntity: {
            "@type": "ItemList",
            name: "Anime watched by Abhishek Rai A",
            numberOfItems: shelf.length,
            itemListElement: shelf.slice(0, 20).map((a, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "TVSeries",
                name: a.title,
                ...(a.cover ? { image: a.cover } : {}),
              },
            })),
          },
        }),
      },
    ],
  }),
  component: ShelfPage,
});

type Filter = { genre: string | null; format: "all" | "tv" | "movie" };

function ShelfPage() {
  const [filter, setFilter] = useState<Filter>({ genre: null, format: "all" });
  const [openId, setOpenId] = useState<string | null>(null);
  const [mood, setMood] = useState("");
  const [moodIds, setMoodIds] = useState<string[] | null>(null);
  const [moodLine, setMoodLine] = useState("");
  const [moodBusy, setMoodBusy] = useState(false);
  const [moodError, setMoodError] = useState<string | null>(null);
  const [recOpen, setRecOpen] = useState(false);
  const [recs, setRecs] = useState<Recommendation[]>([]);

  const askMood = useServerFn(moodSearch);
  const fetchRecs = useServerFn(listRecommendations);

  const loadRecs = useCallback(() => {
    fetchRecs({})
      .then(setRecs)
      .catch(() => setRecs([]));
  }, [fetchRecs]);

  useEffect(() => {
    loadRecs();
  }, [loadRecs]);

  const visible = useMemo(() => {
    const set = moodIds ? new Set(moodIds) : null;
    return shelf.filter((a) => {
      if (set) return set.has(a.id);
      if (filter.genre && !a.genres.includes(filter.genre)) return false;
      if (filter.format !== "all" && a.format !== filter.format) return false;
      return true;
    });
  }, [filter, moodIds]);

  const span = minutesToSpan(totalMinutes);
  const longest = useMemo(
    () => [...shelf].sort((a, b) => b.episodesWatched - a.episodesWatched)[0]!,
    [],
  );

  const open = visible.find((a) => a.id === openId) ?? shelf.find((a) => a.id === openId) ?? null;

  const step = (dir: 1 | -1) => {
    const list = visible.length ? visible : shelf;
    const i = list.findIndex((a) => a.id === openId);
    const next = list[(i + dir + list.length) % list.length];
    if (next) setOpenId(next.id);
  };

  const pullRandom = useCallback(() => {
    const list = visible.length ? visible : shelf;
    const pick = list[Math.floor(Math.random() * list.length)];
    if (pick) setOpenId(pick.id);
  }, [visible]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && /^(INPUT|TEXTAREA)$/.test(t.tagName)) return;
      if (e.key === "r" || e.key === "R") pullRandom();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pullRandom]);

  async function runMood(e: React.FormEvent) {
    e.preventDefault();
    if (mood.trim().length < 2) return;
    setMoodBusy(true);
    setMoodError(null);
    try {
      const res = await askMood({ data: { mood: mood.trim() } });
      if (res.error) {
        setMoodError(res.error);
        setMoodIds(null);
      } else {
        setMoodIds(res.ids);
        setMoodLine(res.line);
      }
    } catch {
      setMoodError("The curator could not answer just now.");
    } finally {
      setMoodBusy(false);
    }
  }

  function clearAll() {
    setMoodIds(null);
    setMoodLine("");
    setMoodError(null);
    setMood("");
    setFilter({ genre: null, format: "all" });
  }

  const filtering = moodIds !== null || filter.genre !== null || filter.format !== "all";

  return (
    <div className="grain room-light min-h-screen overflow-x-clip">
      {/* ---- top bar ---- */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 sm:px-10">
          <a
            href="https://portfolio-abhirai2006.lovable.app"
            className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Abhishek Rai A
          </a>
          <div className="flex items-center gap-3">
            <span className="hidden font-mono text-[11px] uppercase tracking-[0.25em] text-primary sm:inline">
              The Anime Shelf
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ---- hero ---- */}
      <section className="mx-auto max-w-7xl px-6 pb-10 pt-16 sm:px-10 sm:pt-24">
        <p className="font-hand text-2xl text-accent">not a list —</p>
        <h1 className="mt-1 font-display text-[clamp(3.2rem,11vw,9rem)] leading-[0.82] tracking-wide text-foreground">
          A SHELF OF
          <br />
          <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            EVERYTHING I&apos;VE WATCHED
          </span>
        </h1>
        <p className="mt-6 max-w-xl text-balance text-base leading-relaxed text-muted-foreground">
          Every series I&apos;ve finished lives here as a case in motion. Scroll through the arc,
          then click a cover to pull it forward.
        </p>

        <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
          <Stat k="Titles" v={nf.format(shelf.length)} sub="on the rack" />
          <Stat k="Episodes" v={nf.format(totalEpisodes)} sub="watched end to end" />
          <Stat k="Hours" v={nf.format(span.hours)} sub={`${span.days} days of screen`} />
          <Stat k="Longest" v={nf.format(longest.episodesWatched)} sub={longest.title} />
        </dl>
      </section>

      {/* ---- controls ---- */}
      <section className="mx-auto max-w-7xl px-6 sm:px-10">
        <form onSubmit={runMood} className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <input
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="Tell me a mood — 'something that will wreck me', 'dumb fun after a bad day'…"
              className="w-full rounded-md border border-border bg-input px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary"
              aria-label="Describe a mood"
            />
          </div>
          <button
            type="submit"
            disabled={moodBusy}
            className="rounded-md bg-primary px-6 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {moodBusy ? "Thinking…" : "Ask the shelf"}
          </button>
          <button
            type="button"
            onClick={pullRandom}
            className="liquid-glass rounded-md px-6 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-accent transition-colors hover:text-foreground"
            title="Pull a random case (press R)"
          >
            🎲 Surprise me
          </button>
        </form>

        {moodLine && moodIds && (
          <p className="mt-4 font-hand text-xl text-accent">
            &ldquo;{moodLine}&rdquo;<span className="caret ml-0.5">|</span>
          </p>
        )}
        {moodError && <p className="mt-4 text-sm text-destructive">{moodError}</p>}

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Chip
            active={filter.format === "all" && !filter.genre && !moodIds}
            onClick={clearAll}
            label="Everything"
          />
          <Chip
            active={filter.format === "tv"}
            onClick={() => {
              setMoodIds(null);
              setFilter((f) => ({ ...f, format: f.format === "tv" ? "all" : "tv" }));
            }}
            label="Series"
          />
          <Chip
            active={filter.format === "movie"}
            onClick={() => {
              setMoodIds(null);
              setFilter((f) => ({ ...f, format: f.format === "movie" ? "all" : "movie" }));
            }}
            label="Films"
          />
          <span className="mx-1 h-4 w-px bg-border" />
          {allGenres.map((g) => (
            <Chip
              key={g}
              active={filter.genre === g}
              onClick={() => {
                setMoodIds(null);
                setFilter((f) => ({ ...f, genre: f.genre === g ? null : g }));
              }}
              label={g}
            />
          ))}
        </div>

        <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          {filtering
            ? `${visible.length} of ${shelf.length} pulled forward`
            : `${shelf.length} cases · left to right, longest runs first`}
        </p>
      </section>

      {/* ---- scroll-driven collection ---- */}
      <div className="mt-4">
        <CurvedShelf items={visible} onOpen={setOpenId} />
      </div>

      {/* ---- recommendations ---- */}
      <section className="border-t border-border/60 bg-card/20">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-10">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
                The empty slot
              </p>
              <h2 className="mt-2 font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-none tracking-wide">
                RECOMMEND ME ONE
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                There&apos;s always room for one more case. Search any anime ever made, leave your
                name and a line about why — it stays on the shelf until I watch it.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setRecOpen(true)}
              className="liquid-glass rounded-md px-6 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-accent transition-colors hover:text-foreground"
            >
              + Add to the shelf
            </button>
          </div>

          {recs.length > 0 ? (
            <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
              {recs.map((r) => (
                <article
                  key={r.id}
                  className="drift group rounded-lg border border-border bg-card/70 p-3 transition-colors hover:border-primary/70"
                >
                  <div className="aspect-[2/3] w-full overflow-hidden rounded bg-secondary">
                    {r.cover ? (
                      <img
                        src={r.cover}
                        alt={`${r.title} key art`}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center p-2 text-center font-display text-lg">
                        {r.title}
                      </div>
                    )}
                  </div>
                  <h3 className="mt-3 truncate text-sm font-semibold">{r.title}</h3>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {r.year ?? "—"}
                    {r.episodes ? ` · ${r.episodes} ep` : ""}
                  </p>
                  {r.note && (
                    <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                      &ldquo;{r.note}&rdquo;
                    </p>
                  )}
                  <p className="mt-2 font-hand text-base text-accent">— {r.recommender}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-12 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
              The slot is empty. Be the first.
            </p>
          )}
        </div>
      </section>

      <footer className="border-t border-border/60 py-10 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          {nf.format(totalEpisodes)} episodes · {nf.format(span.hours)} hours · still going
        </p>
        <a
          href="https://portfolio-abhirai2006.lovable.app"
          className="mt-3 inline-block font-hand text-xl text-primary hover:underline"
        >
          back to the portfolio
        </a>
      </footer>

      {open && (
        <CaseDetail
          anime={open}
          collectionEpisodes={totalEpisodes}
          onClose={() => setOpenId(null)}
          onPrev={() => step(-1)}
          onNext={() => step(1)}
        />
      )}
      {recOpen && <RecommendDialog onClose={() => setRecOpen(false)} onSaved={loadRecs} />}
    </div>
  );
}

function Stat({ k, v, sub }: { k: string; v: string; sub: string }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        {k}
      </dt>
      <dd className="mt-1 font-display text-5xl leading-none tracking-wide text-foreground">{v}</dd>
      <dd className="mt-1 truncate text-xs text-muted-foreground">{sub}</dd>
    </div>
  );
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-secondary text-muted-foreground hover:border-primary/60 hover:text-foreground",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
