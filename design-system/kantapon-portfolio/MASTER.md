# Kantaphon Portfolio Design System

## Direction

- Tone: professional, calm, evidence-led technical portfolio.
- Signature element: a large 16:9 project image with a thumbnail filmstrip on case-study pages.
- Visual hierarchy: project evidence first; decoration remains secondary.
- Motion: short opacity/translate reveals and restrained hover feedback only; no parallax or auto-rotating media.

## Foundations

- Background: `#FFFFFF`
- Surface: `#F6F8FB`
- Ink: `#172235`
- Muted text: `#5D6B7E`
- Accent: `#295FBD`
- Border: `#DCE3EC`
- Display type: Manrope
- Body type: DM Sans
- Radius: 12–18 px for interface surfaces; 26 px for the primary contact panel.

## Layout

- Content width: 1180 px maximum with fluid side gutters.
- Cards: `repeat(auto-fit, minmax(min(100%, 330px), 1fr))`.
- Project covers: 16:9, `object-fit: contain` so UI screenshot text is not cropped.
- Responsive breakpoints: 820 px for navigation and major columns; 620 px for compact mobile controls; 360 px for 320-wide devices.
- Never hide global horizontal overflow; fix overflow at the component that causes it.

## Interaction

- Minimum primary target height: 44 px; primary CTA: 48 px.
- Visible `:focus-visible` ring on every interactive control.
- Gallery supports buttons, thumbnails, Left/Right arrows in fullscreen, Escape, focus restoration, and horizontal swipe.
- Filter state is stored in the URL query string.
- Respect `prefers-reduced-motion`.

## Content Rules

- Use only verified project images and claims.
- If imagery is missing, show a labelled request describing the exact screenshot or photo needed.
- GitHub links appear only when a verified repository URL exists.
- Every gallery item needs a concise alt description and visible caption.
