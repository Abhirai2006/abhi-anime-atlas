import { useMemo, useState } from "react";
import { shelf } from "@/data/anime";

type Q = { q: string; options: { label: string; tags: string[] }[] };

const QUESTIONS: Q[] = [
  {
    q: "It's midnight and you press play. What are you after?",
    options: [
      { label: "A fight that shakes the ground", tags: ["Action", "Shounen"] },
      { label: "Something that quietly guts me", tags: ["Drama", "Slice of Life"] },
      { label: "A puzzle I can't stop turning over", tags: ["Mystery", "Psychological", "Thriller"] },
      { label: "Another world to disappear into", tags: ["Fantasy", "Adventure", "Isekai"] },
    ],
  },
  {
    q: "Pick your kind of main character.",
    options: [
      { label: "Loud, stubborn, never quits", tags: ["Shounen", "Action", "Sports"] },
      { label: "Too clever for their own good", tags: ["Psychological", "Mystery", "Thriller"] },
      { label: "Soft heart, heavy past", tags: ["Drama", "Romance", "Slice of Life"] },
      { label: "Absurdly overpowered", tags: ["Fantasy", "Isekai", "Supernatural"] },
    ],
  },
  {
    q: "How long should this last?",
    options: [
      { label: "Years. Give me a thousand episodes", tags: ["Adventure", "Shounen"] },
      { label: "One perfect season", tags: ["Drama", "Supernatural"] },
      { label: "A single sitting", tags: ["Romance", "Drama"] },
      { label: "However long it stays weird", tags: ["Comedy", "Supernatural", "Sci-Fi"] },
    ],
  },
  {
    q: "The ending you want.",
    options: [
      { label: "Earned, loud, everyone cheering", tags: ["Sports", "Shounen", "Action"] },
      { label: "Bittersweet and quiet", tags: ["Drama", "Romance", "Slice of Life"] },
      { label: "A twist I never saw coming", tags: ["Mystery", "Psychological", "Horror"] },
      { label: "Leaves the door open for more", tags: ["Fantasy", "Adventure"] },
    ],
  },
];

export function ShelfQuiz({ onOpen }: { onOpen: (id: string) => void }) {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<string[]>([]);

  const result = useMemo(() => {
    if (step < QUESTIONS.length) return null;
    const want = new Set(picked);
    const scored = shelf
      .map((a) => ({
        a,
        score:
          a.genres.filter((g) => want.has(g)).length * 10 + Math.random() * 6,
      }))
      .sort((x, y) => y.score - x.score);
    return scored[0]?.a ?? null;
  }, [step, picked]);

  const current = QUESTIONS[step];

  return (
    <section id="quiz" className="border-t border-border/60">
      <div className="mx-auto max-w-4xl px-6 py-20 sm:px-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
          Four questions
        </p>
        <h2 className="mt-2 font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-none tracking-wide">
          WHICH ONE OF MINE ARE YOU?
        </h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          Answer honestly. You get matched to a case that&apos;s already on the shelf.
        </p>

        {current ? (
          <div className="mt-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              {step + 1} / {QUESTIONS.length}
            </p>
            <h3 className="mt-3 font-display text-2xl tracking-wide sm:text-3xl">{current.q}</h3>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {current.options.map((o) => (
                <button
                  key={o.label}
                  type="button"
                  onClick={() => {
                    setPicked((p) => [...p, ...o.tags]);
                    setStep((s) => s + 1);
                  }}
                  className="rounded-lg border border-border bg-card/50 px-4 py-4 text-left text-sm transition-colors hover:border-primary hover:text-foreground"
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          result && (
            <div className="mt-10 flex flex-col items-start gap-6 rounded-lg border border-border bg-card/50 p-6 sm:flex-row">
              <div className="aspect-[2/3] w-32 shrink-0 overflow-hidden rounded bg-secondary">
                {result.cover ? (
                  <img
                    src={result.cover}
                    alt={`${result.title} cover`}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="flex h-full items-center justify-center p-2 text-center font-display text-base">
                    {result.title}
                  </span>
                )}
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
                  You are
                </p>
                <h3 className="mt-2 font-display text-3xl tracking-wide sm:text-4xl">
                  {result.title}
                </h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                  {result.genres.slice(0, 3).join(" · ")} — and yes, I&apos;ve watched all of it.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => onOpen(result.id)}
                    className="rounded-md bg-primary px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    Open the case
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPicked([]);
                      setStep(0);
                    }}
                    className="liquid-glass rounded-md px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-accent transition-colors hover:text-foreground"
                  >
                    Again
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}
