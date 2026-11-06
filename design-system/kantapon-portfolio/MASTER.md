# Kantaphon Portfolio Design System

## Direction

- Tone: professional, calm, evidence-led web developer portfolio.
- Signature element: a large 16:9 project image with a thumbnail filmstrip on case-study pages.
- Visual hierarchy: web and interface work leads; project evidence stays ahead of decoration.
- Motion: one restrained hero entrance plus responsive state feedback; no repeated section reveals, parallax, or auto-rotating media.

## Foundations

- Primary / Midnight Blue: `#243746`
- Secondary / Dusty Blue: `#54758A`
- Detail accent / Sage Mist: `#93A9A3`
- Background / Warm Ivory: `#F5F1E8`
- CTA highlight / Sand Gold: `#D6BA93`
- Card surface: `#FFFFFF`
- Muted text on Warm Ivory: `#4F6F83` (an accessible, slightly darker derivative of Dusty Blue)
- Soft surface: `#FBF9F4`
- Strong surface: `#E7ECE9`
- Border: `#CBD5D1`
- Display type: Manrope
- Body type: DM Sans
- Radius: 12–18 px for interface surfaces; 26 px for the primary contact panel.

## Color Usage

- Keep Warm Ivory and white as the majority of every page.
- Use Midnight Blue for primary text, research/contact sections, and roughly 20–30% of the overall composition.
- Use Dusty Blue for navigation and links on white surfaces.
- Use Sage Mist for decorative lines, borders, and small details; never for normal text on Warm Ivory.
- Use Sand Gold sparingly for primary CTAs and highlights, always with Midnight Blue text.

## Layout

- Content width: 1180 px maximum with fluid side gutters.
- Cards: `repeat(auto-fit, minmax(min(100%, 330px), 1fr))`.
- The first visible project spans two columns on desktop to break card-grid monotony and establish a clear starting point.
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
- Do not publish empty experience placeholders, “add URL” labels, eyebrow text, or decorative section numbers.
- Web-relevant work appears first and the Web filter must always return real projects.
