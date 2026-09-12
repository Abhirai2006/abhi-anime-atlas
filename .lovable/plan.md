# Abhi’s Anime Shelf — scroll-driven 3D gallery

## Direction

Replace the three separated shelf rows with one continuous curved cover carousel. Vertical page scrolling will move the collection through a cinematic 3D arc: the centered case faces the viewer, nearby cases rotate and recede, and distant cases fade into the room. This removes the large blank gaps while keeping the experience physical and exploratory.

## Experience changes

- Keep the existing opening, statistics, mood search, filters, case details, and visitor recommendations.
- Replace `Shelf 01 / 02 / 03` with one sticky gallery scene and a compact progress indicator.
- Map scroll position to the active case so scrolling smoothly advances through all titles.
- Make the centered case larger and readable; neighbouring covers remain visible as a curved “wall” of cases.
- Clicking any case still opens its full detail view; previous/next navigation recenters the gallery on that title.
- Filters and mood results will smoothly regroup the visible cases without leaving empty scroll space.
- On phones, use a touch-friendly snapping carousel with the same curved depth treatment rather than forcing a long pinned scroll.
- Respect reduced-motion settings by switching to a straightforward snapping row.

## Liquid glass treatment

Use the referenced `liquid-glass-js` idea selectively rather than placing WebGL effects on every case:

- Add a refractive glass treatment to the sticky gallery caption/progress controls and primary action surfaces.
- Keep cover art, spine labels, and detail text crisp.
- Build a lightweight CSS-first version matching the portfolio palette, with pointer-driven highlights and graceful fallback; avoid many WebGL canvases that would hurt mobile performance.
- Include attribution for the MIT-licensed reference where reused or adapted.

## Visual polish

- Add subtle shelf lighting that follows the centered cover’s existing color.
- Use depth, perspective, cover reflections, and restrained parallax rather than generic neon effects.
- Tighten the transition into “Recommend me one” so there is no dead vertical space.
- Verify desktop and mobile layouts, scrolling, clicking, keyboard navigation, filtering, dialogs, and reduced motion.

## Repository and documentation

- Rename the product presentation to **Abhi’s Anime Shelf**.
- Write a complete README covering the concept, feature tour, screenshots/visual description, local setup, environment requirements, architecture, data sources, privacy, and deployment.
- Prepare the project for a new private GitHub repository named `abhis-anime-shelf`. GitHub repository creation/sync will use Lovable’s connected GitHub flow so the repository remains private and the full history stays managed by Lovable.

## Technical notes

- Implement the gallery with React, CSS 3D transforms, measured item positions, and scroll progress; no Three.js is needed.
- Use a sticky desktop scene with a scroll-length wrapper computed from the filtered collection size.
- Keep the existing case data and cloud-backed recommendation behavior unchanged.
- Preserve the current route metadata and update it to the new product name where appropriate.
