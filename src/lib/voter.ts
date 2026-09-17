const KEY = "abhi-anime-shelf-voter";
const VOTED = "abhi-anime-shelf-voted";

export function voterKey(): string {
  if (typeof window === "undefined") return "";
  let v = localStorage.getItem(KEY);
  if (!v) {
    v = crypto.randomUUID().replace(/-/g, "");
    localStorage.setItem(KEY, v);
  }
  return v;
}

export function votedIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(VOTED) ?? "[]") as string[];
  } catch {
    return [];
  }
}

export function markVoted(id: string) {
  if (typeof window === "undefined") return;
  const next = Array.from(new Set([...votedIds(), id]));
  localStorage.setItem(VOTED, JSON.stringify(next));
}
