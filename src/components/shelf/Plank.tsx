import type { ReactNode } from "react";

export function Plank({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="relative">
      <div className="shelf-stage no-scrollbar overflow-x-auto overflow-y-visible px-6 sm:px-10">
        <div className="flex min-w-max items-end gap-[3px] pb-0 pt-24">{children}</div>
      </div>

      {/* the plank */}
      <div className="relative mt-0 h-6">
        <div
          className="h-3 w-full"
          style={{
            background:
              "linear-gradient(180deg, var(--plank-edge) 0%, var(--plank) 45%, #05070c 100%)",
            boxShadow: "0 18px 40px -18px rgba(0,0,0,1), inset 0 1px 0 rgba(255,255,255,0.07)",
          }}
        />
        <div
          className="h-3 w-full opacity-70"
          style={{
            background: "linear-gradient(180deg, rgba(0,0,0,0.7), transparent)",
          }}
        />
        <span className="pointer-events-none absolute -bottom-1 left-6 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/70 sm:left-10">
          {label}
        </span>
      </div>
    </section>
  );
}
