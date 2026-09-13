# Abhi's Anime Shelf

An interactive record of every anime Abhi has watched—designed as a cinematic collection rather than a data table. Scroll through a curved wall of cases, pull one forward for its story and watch history, ask the shelf for a mood-based pick, or leave a recommendation.

## What it does

- **Scroll-driven 3D collection:** 60 anime cases move through a curved, perspective gallery as the page scrolls.
- **Physical case details:** Cover art, spine color, thickness, wear, and presentation vary by title and watch length.
- **Collection details:** Open a case for synopsis, studio, year, genres, progress, viewing time, and its share of the full shelf.
- **Mood curator:** Describe a mood in plain language and receive a small set of fitting titles already on the shelf.
- **Visitor recommendations:** Search a live anime catalogue, add a note, and permanently leave a recommendation.
- **Responsive experience:** Desktop uses a pinned cinematic scroll scene; mobile uses a native swipe-and-snap gallery.
- **Portfolio-matched themes:** Dark and light modes share the portfolio palette and remember the visitor's choice.
- **Accessible motion:** Keyboard navigation, focus states, semantic controls, and a reduced-motion alternative are included.

## Visual direction

The site is a standalone extension of [Abhi's portfolio](https://portfolio-abhirai2006.lovable.app). It carries over the navy-black room, electric-blue light, green accent, display typography, quiet grain, and precise mono labels.

The gallery controls use a lightweight CSS interpretation of refractive glass. The treatment was inspired by [`dashersw/liquid-glass-js`](https://github.com/dashersw/liquid-glass-js) (MIT), but deliberately avoids a WebGL canvas per item so cover art remains crisp and scrolling stays smooth on phones.

## Tech stack

- TanStack Start and TanStack Router
- React 19 and TypeScript
- Tailwind CSS 4
- Lovable Cloud for persistent recommendations
- Lovable AI for mood curation
- Kitsu JSON:API for live catalogue search and collection metadata

## Local development

Requirements: Bun and a Lovable-connected environment.

```bash
bun install
bun run dev
```

The local site runs at `http://localhost:3000` unless another port is configured.

## Environment

The application expects server-side environment values for:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `LOVABLE_API_KEY`

Do not expose these values in browser code or commit private credentials. When the project runs inside Lovable, the connected services inject them automatically.

## Project structure

```text
src/
  components/shelf/   Gallery, case details, and recommendation experience
  data/anime.ts       Typed static collection data
  lib/                 Server functions and formatting helpers
  routes/index.tsx    Main collection page
  styles.css          Theme tokens, 3D transforms, glass, and motion
```

## Data and privacy

Watched counts come from Abhi's personal list. Public visitors can submit a display name and an optional recommendation note; these are shown publicly with the selected title. No account is required for browsing or recommending.

## Deployment

The project is built for Lovable hosting. Preview changes in the editor, then use **Publish → Update** to send frontend changes live. The recommendation data and server functions are provided by Lovable Cloud.

## Credits

- Anime metadata and search: [Kitsu](https://kitsu.io/)
- Refractive glass reference: [liquid-glass-js](https://github.com/dashersw/liquid-glass-js), MIT License
- Built with [Lovable](https://lovable.dev/)