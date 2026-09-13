import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Theme = "dark" | "light";

const STORAGE_KEY = "abhi-anime-shelf-theme";

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("light", theme === "light");
  document.documentElement.style.colorScheme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", theme === "light" ? "#f9fafb" : "#07090e");
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const preferred = window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
    const initial = saved === "light" || saved === "dark" ? saved : preferred;
    setTheme(initial);
    applyTheme(initial);
    setReady(true);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    const update = () => {
      setTheme(next);
      applyTheme(next);
      window.localStorage.setItem(STORAGE_KEY, next);
    };

    if (document.startViewTransition) {
      document.documentElement.classList.toggle("theme-sweep-left", next === "dark");
      document.startViewTransition(update).finished.finally(() => {
        document.documentElement.classList.remove("theme-sweep-left");
      });
    } else {
      update();
    }
  };

  const label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <TooltipProvider delayDuration={250}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={label}
            onClick={toggle}
            className="h-8 w-8 rounded-full border border-border bg-background/70 text-muted-foreground shadow-none hover:bg-secondary hover:text-foreground"
          >
            {ready && theme === "light" ? <Moon aria-hidden /> : <Sun aria-hidden />}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}