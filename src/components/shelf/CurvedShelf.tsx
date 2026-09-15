import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import type { Anime } from "@/data/anime";

type Props = {
  items: Anime[];
  onOpen: (id: string) => void;
};

const MAX_VISIBLE_DISTANCE = 7;

export function CurvedShelf({ items, onOpen }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const [position, setPosition] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reducedMotion || items.length < 2) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const travel = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / travel));
      setPosition(progress * (items.length - 1));
    };
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [items.length, reducedMotion]);

  const activeIndex = Math.min(items.length - 1, Math.max(0, Math.round(position)));
  const active = items[activeIndex];
  const sectionHeight = Math.max(360, Math.min(1180, items.length * 18));

  const goTo = useCallback(
    (index: number) => {
      const section = sectionRef.current;
      if (!section || items.length < 2) return;
      const target = Math.min(items.length - 1, Math.max(0, index));
      const top = window.scrollY + section.getBoundingClientRect().top;
      const travel = section.offsetHeight - window.innerHeight;
      window.scrollTo({
        top: top + (target / (items.length - 1)) * travel,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    },
    [items.length, reducedMotion],
  );

  const mobileItems = useMemo(() => items, [items]);

  if (!items.length) return null;

  if (reducedMotion) {
    return <SwipeShelf items={mobileItems} onOpen={onOpen} />;
  }

  return (
    <>
      <section
        ref={sectionRef}
        aria-label="Scroll through the anime collection"
        className="relative hidden md:block"
        style={{ height: `${sectionHeight}vh` }}
      >
        <div className="sticky top-[49px] h-[calc(100svh-49px)] min-h-[520px] overflow-hidden">
          <div
            className="gallery-aura absolute inset-0 transition-[background] duration-700"
            style={{ "--active-spine": active?.spine ?? "var(--primary)" } as CSSProperties}
          />
          <div className="pointer-events-none absolute inset-x-0 top-[9%] text-center">
            <p className="font-hand text-xl text-accent">scroll to browse</p>
            <h2 className="mt-1 font-display text-5xl tracking-wide text-foreground lg:text-7xl">
              THE COLLECTION
            </h2>
          </div>

          <div className="curved-stage absolute inset-x-0 top-[22%] h-[52%]">
            {items.map((anime, index) => {
              const offset = index - position;
              const distance = Math.abs(offset);
              const hidden = distance > MAX_VISIBLE_DISTANCE;
              const x = offset * 142;
              const y = Math.min(distance * distance * 5.5, 130);
              const z = -Math.min(distance * 108, 700);
              const rotate = -offset * 12;
              const scale = Math.max(0.62, 1 - distance * 0.055);
              const opacity = hidden ? 0 : Math.max(0.12, 1 - distance * 0.12);
              const style = {
                "--gallery-x": `${x}px`,
                "--gallery-y": `${y}px`,
                "--gallery-z": `${z}px`,
                "--gallery-r": `${rotate}deg`,
                "--gallery-scale": scale,
                opacity,
                zIndex: Math.max(1, 100 - Math.round(distance * 10)),
                pointerEvents: hidden ? "none" : "auto",
              } as CSSProperties;

              return (
                <button
                  key={anime.id}
                  type="button"
                  aria-label={`Open ${anime.title}`}
                  aria-current={index === activeIndex ? "true" : undefined}
                  tabIndex={hidden ? -1 : 0}
                  onClick={() => onOpen(anime.id)}
                  className="gallery-case group absolute left-1/2 top-1/2 aspect-[2/3] h-[clamp(240px,38vh,500px)] rounded-[5px] outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  style={style}
                >
                  <div className="gallery-case-shell relative h-full w-full overflow-hidden rounded-[5px] border border-foreground/10 bg-card shadow-2xl">
                    {anime.cover ? (
                      <img
                        src={anime.cover}
                        alt=""
                        loading={distance < 3 ? "eager" : "lazy"}
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div
                        className="flex h-full w-full items-center justify-center p-5 text-center"
                        style={{ backgroundColor: anime.spine }}
                      >
                        <span className="font-display text-3xl leading-none text-case-foreground">
                          {anime.title}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-foreground/5" />
                    <div className="case-glint absolute inset-0" />
                    <div className="absolute inset-x-0 bottom-0 p-4 text-left">
                      <p className="line-clamp-2 font-display text-2xl leading-none text-case-foreground">
                        {anime.title}
                      </p>
                      <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-case-foreground/65">
                        {anime.format === "movie" ? "Film" : `${anime.episodesWatched} episodes`}
                      </p>
                    </div>
                  </div>
                  <div className="case-reflection absolute left-0 top-full h-24 w-full overflow-hidden opacity-25">
                    {anime.cover && <img src={anime.cover} alt="" aria-hidden className="h-full w-full object-cover" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="absolute bottom-5 left-1/2 z-[120] w-[min(92vw,560px)] -translate-x-1/2">
          <div className="liquid-glass flex w-full items-center gap-4 px-4 py-3">
            <button
              type="button"
              aria-label="Previous anime"
              onClick={() => goTo(activeIndex - 1)}
              disabled={activeIndex === 0}
              className="glass-icon-button"
            >
              <ChevronLeft aria-hidden size={18} />
            </button>
            <div className="min-w-0 flex-1 text-center">
              <p className="truncate text-sm font-semibold text-foreground">{active?.title}</p>
              <div className="mx-auto mt-2 h-px w-full overflow-hidden bg-foreground/10">
                <div
                  className="h-full bg-primary transition-[width] duration-150"
                  style={{ width: `${((activeIndex + 1) / items.length) * 100}%` }}
                />
              </div>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                {String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
              </p>
            </div>
            <button
              type="button"
              aria-label="Next anime"
              onClick={() => goTo(activeIndex + 1)}
              disabled={activeIndex === items.length - 1}
              className="glass-icon-button"
            >
              <ChevronRight aria-hidden size={18} />
            </button>
          </div>
          </div>
        </div>
      </section>

      <div className="md:hidden">
        <SwipeShelf items={mobileItems} onOpen={onOpen} />
      </div>
    </>
  );
}

function SwipeShelf({ items, onOpen }: Props) {
  return (
    <section className="py-16" aria-label="Anime collection">
      <div className="px-6">
        <p className="font-hand text-xl text-accent">swipe to browse</p>
        <h2 className="mt-1 font-display text-5xl leading-none text-foreground">THE COLLECTION</h2>
      </div>
      <div className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto px-[calc(50vw-118px)] pb-20 pt-4">
        {items.map((anime) => (
          <button
            key={anime.id}
            type="button"
            onClick={() => onOpen(anime.id)}
            className="group w-[236px] shrink-0 snap-center text-left outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <div className="relative aspect-[2/3] overflow-hidden rounded-[5px] border border-border bg-card shadow-2xl">
              {anime.cover ? (
                <img src={anime.cover} alt="" loading="lazy" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center p-5 text-center font-display text-3xl">
                  {anime.title}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="font-display text-2xl leading-none text-case-foreground">{anime.title}</p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-case-foreground/65">
                  {anime.format === "movie" ? "Film" : `${anime.episodesWatched} episodes`}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}