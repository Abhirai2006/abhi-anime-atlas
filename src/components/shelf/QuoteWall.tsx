import { useEffect, useState } from "react";
import { shelf } from "@/data/anime";

type Line = { id: string; quote: string; who: string };

const LINES: Line[] = [
  { id: "naruto", quote: "Hard work is worthless for those that don't believe in themselves.", who: "Naruto Uzumaki" },
  { id: "one-piece", quote: "When do you think people die? When they are forgotten.", who: "Dr. Hiluluk" },
  { id: "fullmetal-alchemist-brotherhood", quote: "A lesson without pain is meaningless.", who: "Edward Elric" },
  { id: "hunter-x-hunter", quote: "You should enjoy the little detours to the fullest.", who: "Gon Freecss" },
  { id: "death-note", quote: "I am justice.", who: "Light Yagami" },
  { id: "attack-on-titan", quote: "If you win, you live. If you lose, you die. If you don't fight, you can't win.", who: "Eren Yeager" },
  { id: "your-lie-in-april", quote: "Maybe there's no such thing as an angel.", who: "Kousei Arima" },
  { id: "jujutsu-kaisen", quote: "Throughout heaven and earth, I alone am the honored one.", who: "Ryomen Sukuna" },
  { id: "frieren-beyond-journeys-end", quote: "It's only a mere ten years to me. But it's a lifetime to you.", who: "Frieren" },
  { id: "one-punch-man", quote: "I'm just a guy who's a hero for fun.", who: "Saitama" },
  { id: "demon-slayer-kimetsu-no-yaiba", quote: "Set your heart ablaze.", who: "Kyojuro Rengoku" },
  { id: "haikyu", quote: "Being weak means you have room to grow.", who: "Tobio Kageyama" },
  { id: "tokyo-ghoul", quote: "It's not the world that's messed up; it's those of us in it.", who: "Ken Kaneki" },
  { id: "princess-mononoke", quote: "Life is suffering. It is hard. The world is cursed. But still, you find reasons to keep on living.", who: "Ashitaka" },
];

export function QuoteWall({ onOpen }: { onOpen: (id: string) => void }) {
  const pool = LINES.filter((l) => shelf.some((a) => a.id === l.id));
  const [i, setI] = useState(0);
  const [on, setOn] = useState(true);

  useEffect(() => {
    if (pool.length < 2) return;
    const t = setInterval(() => {
      setOn(false);
      setTimeout(() => {
        setI((n) => (n + 1) % pool.length);
        setOn(true);
      }, 550);
    }, 6500);
    return () => clearInterval(t);
  }, [pool.length]);

  const line = pool[i];
  if (!line) return null;
  const anime = shelf.find((a) => a.id === line.id)!;

  return (
    <section className="relative overflow-hidden border-t border-border/60">
      <div className="mx-auto flex min-h-[280px] max-w-4xl flex-col items-center justify-center px-6 py-20 text-center sm:px-10">
        <blockquote
          className={`quote-fade ${on ? "is-on" : ""} font-display text-[clamp(1.8rem,5vw,3.4rem)] leading-[1.05] tracking-wide text-balance text-foreground`}
        >
          &ldquo;{line.quote}&rdquo;
        </blockquote>
        <p className={`quote-fade ${on ? "is-on" : ""} mt-5 font-hand text-xl text-accent`}>
          — {line.who}
        </p>
        <button
          type="button"
          onClick={() => onOpen(anime.id)}
          className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
        >
          {anime.title}
        </button>
      </div>
    </section>
  );
}
