# Rizkie Pratama - Design System & Aesthetic Guide

This document outlines the core visual identity, design philosophy, and technical implementation details of the site's aesthetic. It serves as a blueprint for applying this unified "Cyberpunk / Persona" style to the rest of the website.

## 1. Core Vibe & Philosophy
- **Keywords:** Cyberpunk, Kinetic, Game-Menu, Edgy, Premium, Digital.
- **Inspiration:** Video game UI design (e.g., *Persona 5*, *Nier Automata*, *Cyberpunk 2077*). 
- **Philosophy:** Interfaces should feel physical, reactive, and dramatic. The user should feel like they are navigating a high-tech terminal or a stylish game menu rather than reading a standard web document. Avoid soft shadows, rounded corners, and gentle fades in favor of hard lines, sharp contrasts, and aggressive motion.

## 2. Color Palette
The aesthetic relies on extreme contrast.

*   **Base (Backgrounds):** Pure Black or near-black (`#080808`).
*   **Accent:** Catalyst Red (`var(--p-red)` which maps to `#e8192c`). This is used for all major highlights, swoops, and active states.
*   **Text (Primary):** Solid White (`#ffffff`) for maximum contrast against dark backgrounds and red highlights.
*   **Text (Secondary):** Muted Grey (`var(--p-muted)`) for metadata, indexes, and inactive menu items.
*   **Glitch Accents:** Cyan (`#0ff`) and Pure Red (`#f00`) are used strictly for the split-second glitch animation pseudo-elements.

## 3. Typography
*   **Headings (`var(--p-font-head)`):** Bold, heavy, sans-serif. Always `text-transform: uppercase`. Use negative letter-spacing (`letter-spacing: -1px` or `-2px`) to make large text feel tighter and more aggressive.
*   **Eyebrows & Metadata (`var(--p-font-mono)`):** Monospace fonts. Always uppercase. Use wide letter-spacing (`letter-spacing: 2px` to `4px`) to contrast with the tight headings.
*   **Styling Accents:** Use `<em>` tags to italicize specific words in headings and color them red for visual breaks.

## 4. UI Elements & Layout
*   **Geometry:** 0px border-radius everywhere. Buttons, containers, and highlights must have razor-sharp corners.
*   **Borders:** Use thin, 1px solid lines (`var(--p-border-2)`) to separate list items and structural blocks.
*   **Layout:** Favor full-screen (`100vh`) sections with absolute or flexbox positioning over infinitely scrolling long-form pages. Use grids and explicit column splits (e.g., 45% Hero / 55% Menu).

## 5. Textures: The Scanline Effect
To ground the aesthetic in a digital/CRT feel, a scanline overlay is consistently applied to backgrounds, hover states, and transition wipes.

**CSS Implementation:**
```css
background-image: repeating-linear-gradient(
  0deg, 
  transparent, 
  transparent 2px, 
  rgba(0,0,0,0.15) 2px, 
  rgba(0,0,0,0.15) 4px
);
```
*Note: Use `pointer-events: none;` on scanline overlays so they don't block mouse interactions.*

## 6. Motion & Interaction Design
Interactions are the most important part of this aesthetic. They must be fast, violent, and highly visible.

### A. The "Swoop" (Hover Backgrounds)
Instead of fading a background color in, a solid red block should physically slide across the element.
*   **Setup:** Position a pseudo-element or absolute div outside the container (`right: -100%`).
*   **Action:** On hover/focus, translate it into the container (`transform: translateX(-100%)`).
*   **Timing:** `transition: transform 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);`

### B. The "Push" (Text Movement)
When an element is hovered, the text should not just change color—it should be physically shoved by the incoming swoop.
*   **Action:** `transform: scale(1.05) translateX(30px);`
*   **Shadow:** Add a hard text-shadow to make it pop (`text-shadow: 2px 2px 0px rgba(0,0,0,0.3);`).

### C. The "Glitch" (Hover Feedback)
For high-priority links, triggering a hover state causes the text to aggressively glitch for a fraction of a second.
*   **Setup:** Use `::before` (Cyan) and `::after` (White/Red) pseudo-elements powered by `content: attr(data-text)`.
*   **Animation:** Use `clip-path: inset(top right bottom left)` to slice the text horizontally, translating the slices rapidly.
*   **Keyframes Example:**
```css
@keyframes glitch-flash-1 {
  0%   { opacity: 0; transform: translate(0); clip-path: inset(20% 0 80% 0); }
  20%  { opacity: 1; transform: translate(-3px, 1px); clip-path: inset(10% 0 60% 0); }
  40%  { opacity: 1; transform: translate(3px, -1px); clip-path: inset(50% 0 30% 0); }
  60%  { opacity: 1; transform: translate(-3px, 1px); clip-path: inset(30% 0 50% 0); }
  80%  { opacity: 1; transform: translate(3px, -1px); clip-path: inset(80% 0 10% 0); }
  100% { opacity: 0; transform: translate(0); clip-path: inset(100% 0 0 0); }
}
```

### D. State Persistence (`:focus` and Click-Locks)
Because Swup intercepts page transitions, standard hover states drop instantly on click. To make the interface feel responsive, hover states must be locked in until the new page loads.
*   **CSS:** Chain `:focus` and custom `.is-active-click` classes alongside `:hover`.
*   **HTML:** Add inline JavaScript to links: `<a href="..." onclick="this.classList.add('is-active-click')">`

## 7. Global Page Transitions (Swup)
The global page transition unifies the site.
1.  **The Wipe (`body::after`):** A solid red overlay containing the scanline texture sweeps across the entire viewport.
2.  **Layered Depth (`.transition-fade`):** While the wipe happens, the underlying page content physically sinks into the background using `transform: scale(0.94)` and `filter: brightness(0.2) blur(3px)`.
3.  **Prevention:** Prevent jittery elements (like scroll-reveals) from triggering during the wipe by forcing `transform: none !important` and `transition: none !important` on them via the `html.is-animating` state.
