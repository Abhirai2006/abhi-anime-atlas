import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { addRecommendation, searchCatalogue, type CatalogueHit } from "@/lib/anime.functions";

type Props = {
  onClose: () => void;
  onSaved: () => void;
};

export function RecommendDialog({ onClose, onSaved }: Props) {
  const search = useServerFn(searchCatalogue);
  const save = useServerFn(addRecommendation);

  const [q, setQ] = useState("");
  const [hits, setHits] = useState<CatalogueHit[]>([]);
  const [searching, setSearching] = useState(false);
  const [picked, setPicked] = useState<CatalogueHit | null>(null);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  useEffect(() => {
    if (picked || q.trim().length < 2) {
      setHits([]);
      return;
    }
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        setHits(await search({ data: { q: q.trim() } }));
      } catch {
        setHits([]);
      } finally {
        setSearching(false);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [q, picked, search]);

  async function submit() {
    if (!picked) return;
    setSaving(true);
    setError(null);
    try {
      const res = await save({
        data: {
          catalogueId: picked.catalogueId,
          title: picked.title,
          romaji: picked.romaji,
          cover: picked.cover,
          year: picked.year,
          episodes: picked.episodes,
          synopsis: picked.synopsis,
          recommender: name.trim() || "Anonymous",
          note: note.trim() || null,
        },
      });
      if (!res.ok) {
        setError(res.reason);
      } else {
        setDone(true);
        onSaved();
      }
    } catch {
      setError("Could not save that right now.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Recommend an anime"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-ink/80 backdrop-blur-xl"
      />

      <div className="relative z-10 flex max-h-[86vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-border bg-card/95 shadow-[0_50px_120px_-40px_rgba(0,0,0,1)]">
        <div className="border-b border-border px-6 py-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
            Leave something behind
          </p>
          <h3 className="mt-1 font-display text-3xl leading-none tracking-wide">
            Put an anime on my shelf
          </h3>
        </div>

        {done ? (
          <div className="px-6 py-10 text-center">
            <p className="font-display text-2xl tracking-wide">It's on the shelf.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Thanks{name.trim() ? `, ${name.trim()}` : ""} — I'll get to it.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 rounded-md bg-primary px-5 py-2 font-mono text-[11px] uppercase tracking-widest text-primary-foreground"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {!picked ? (
              <>
                <label
                  htmlFor="rec-search"
                  className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
                >
                  Search every anime ever made
                </label>
                <input
                  id="rec-search"
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Vinland Saga, Monster, Clannad…"
                  className="mt-2 w-full rounded-md border border-border bg-input px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary"
                />

                <div className="mt-4 space-y-1.5">
                  {searching && (
                    <p className="py-6 text-center font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                      Searching…
                    </p>
                  )}
                  {!searching &&
                    hits.map((h) => (
                      <button
                        key={h.catalogueId}
                        type="button"
                        onClick={() => setPicked(h)}
                        className="flex w-full items-center gap-3 rounded-md border border-transparent bg-background/50 p-2 text-left transition-colors hover:border-primary/60 hover:bg-secondary"
                      >
                        <div className="h-16 w-11 shrink-0 overflow-hidden rounded bg-secondary">
                          {h.cover && (
                            <img src={h.cover} alt="" className="h-full w-full object-cover" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{h.title}</p>
                          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                            {h.year ?? "—"} · {h.subtype ?? "TV"}
                            {h.episodes ? ` · ${h.episodes} ep` : ""}
                          </p>
                        </div>
                      </button>
                    ))}
                  {!searching && q.trim().length >= 2 && hits.length === 0 && (
                    <p className="py-6 text-center font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                      Nothing found
                    </p>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 rounded-md border border-border bg-background/50 p-3">
                  <div className="h-24 w-16 shrink-0 overflow-hidden rounded bg-secondary">
                    {picked.cover && (
                      <img src={picked.cover} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{picked.title}</p>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {picked.year ?? "—"} · {picked.subtype ?? "TV"}
                    </p>
                    <button
                      type="button"
                      onClick={() => setPicked(null)}
                      className="mt-2 font-mono text-[10px] uppercase tracking-widest text-primary hover:underline"
                    >
                      Pick something else
                    </button>
                  </div>
                </div>

                <label
                  htmlFor="rec-name"
                  className="mt-5 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
                >
                  Your name
                </label>
                <input
                  id="rec-name"
                  value={name}
                  maxLength={60}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Anonymous"
                  className="mt-2 w-full rounded-md border border-border bg-input px-3 py-2.5 text-sm outline-none focus:border-primary"
                />

                <label
                  htmlFor="rec-note"
                  className="mt-4 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
                >
                  Why this one? <span className="normal-case tracking-normal">(optional)</span>
                </label>
                <textarea
                  id="rec-note"
                  value={note}
                  maxLength={400}
                  rows={3}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Trust me on this one…"
                  className="mt-2 w-full resize-none rounded-md border border-border bg-input px-3 py-2.5 text-sm outline-none focus:border-primary"
                />

                {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

                <button
                  type="button"
                  disabled={saving}
                  onClick={submit}
                  className="mt-5 w-full rounded-md bg-primary py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {saving ? "Shelving…" : "Add it to the shelf"}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
