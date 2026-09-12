# Anime Shelf — an interactive collection, not a list

A standalone site styled to feel like a native wing of your portfolio, so you can link it from there as "Anime". Your 57 titles (3,653 episodes) become a physical shelf of Blu-ray cases you pull, tilt and open — the title text is the last thing you see, not the first.

## Matching your portfolio

I read your live portfolio and will reuse its exact look:

- Deep navy-black background, near-white text, electric blue as the main accent, a green secondary accent, muted slate for supporting text.
- Its existing fonts: Bebas Neue for big display type, Space Grotesk / Inter for text, JetBrains Mono for numbers and labels, Caveat for the handwritten touch it already uses.
- Same soft-glow, low-contrast card feel and the same easing on hovers, so nothing looks bolted on.

## The experience

**1. The arrival**
A dark room with a single shelf lit from above. A typed line in your voice appears, then a live-counted stat line: episodes, hours, days of your life — counting up from zero, computed from the data.

**2. The shelf**
A horizontally scrolling rail of Blu-ray/DVD cases seen edge-on. Each case:
- Real key art from AniList wrapped around the spine edge, with the spine colour drawn from that art.
- Width scales with how long the show is (log-scaled, so One Piece is a fat boxset and Suzume is a slim single-disc, without breaking the row). Height is near-constant like real cases, with tiny lean and depth jitter so the shelf looks lived-in.
- Boxset / steelbook / standard finishes, plus edge wear on the ones you've rewatched.

**3. Hover**
The case tilts and pulls toward you, its art lights the shelf around it, and a floating card shows studio, year, episodes watched, format and genres.

**4. Click**
The case physically slides out and rotates to face you: full key visual, synopsis, your progress bar, genres, and where it sits in your totals ("2.1% of everything you've watched"). Shelf blurs behind it. Arrow keys move to the neighbouring case, Escape puts it back.

**5. Finding things**
- A "what are you in the mood for?" bar that understands plain English — "something like Frieren but sadder", "long shonen with a real power system" — powered by AI, which re-sorts the shelf and says why it picked each one.
- Genre / format / length filter pills; unmatched cases dim and slide back into the shelf rather than disappearing.

**6. Recommend me an anime**
Visitors search the full AniList catalogue live (tens of thousands of titles), pick one, add a short note and their name. It saves, then animates onto a second shelf below: **"Recommended to me"** — visibly separate, with the recommender's name printed on the case band. Duplicate suggestions stack instead of repeating.

**7. Small touches**
- A shelf ambience toggle, keyboard navigation, and reduced-motion support.
- Mobile: the shelf becomes a swipeable, snapping rail with the same pull-out.

## Your data

I'll run all 57 titles through AniList to pull real cover art, studio, year, genre, total episodes and a clean synopsis, then store them as one static file so the shelf loads instantly.

Handled per your notes:
- `+1` entries (Naruto, Demon Slayer, JJK, Haikyuu) become two cases — the series and the film.
- `20+`, `30+`, `125+`, `24+` entries are marked "still watching" with a partial progress bar.
- Ratings stay blank for now; the design leaves a clean slot so I can fill them in when you send them.

Three titles I'll confirm with you once I see the AniList matches, rather than guessing:
- "The Aristocrat's Otherworldly Adventure: Serving Gods Who Go Too Far"
- Fullmetal Alchemist — Brotherhood vs 2003 (you wrote Brotherhood but 30+ eps)
- Dragon Ball — original vs Z

## Technical notes

- TanStack Start + Tailwind, theme tokens copied verbatim from the portfolio's `:root`.
- `src/data/anime.ts` — static typed array (id, title, studio, genres, cover, year, synopsis, episodesWatched, totalEpisodes, status, format, case, spine/band/ink, width/height/lean/depth/wear). Fetched from AniList GraphQL at build time by a one-off script, committed as data.
- 3D via CSS transforms (`preserve-3d`, per-case `rotateY`/`translateZ`) — no WebGL, so it stays fast.
- Lovable Cloud enabled for the recommendation feature: a `recommendations` table with public insert + public read, RLS on, rate-limited by IP, moderation flag column so you can hide anything odd.
- Live visitor anime search proxies AniList through a server function (no key needed, cached).
- Mood search runs server-side through Lovable AI over the shelf's own metadata, returning ranked ids + one-line reasons.
- Own head metadata, single H1, alt text on all key art, canonical URL.

## Build order

1. Data fetch + shelf physics + hover + pull-out detail (the core).
2. Filters, mood search.
3. Cloud + recommend-an-anime shelf.
