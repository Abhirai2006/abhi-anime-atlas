export const nf = new Intl.NumberFormat("en-US");

export function minutesToSpan(minutes: number) {
  const days = minutes / 1440;
  return {
    hours: Math.round(minutes / 60),
    days: Math.round(days * 10) / 10,
    weeks: Math.round((days / 7) * 10) / 10,
  };
}

export function pct(part: number, whole: number) {
  if (!whole) return 0;
  return Math.round((part / whole) * 1000) / 10;
}

export function stripTags(html: string) {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
