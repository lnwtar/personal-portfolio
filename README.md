# Personal Resume & Portfolio

A responsive, recruiter-focused portfolio for Kantaphon Thanwisetuaong. The site is static, dependency-free, and compatible with direct local opening and GitHub Pages project URLs.

## Features

- Responsive minimal-white interface
- Accessible sticky navigation and mobile menu
- Data-driven project gallery with URL-synced category filters
- Reusable case-study page with thumbnail gallery, previous/next controls, captions, fullscreen lightbox, keyboard support, and touch swipe
- 56 verified local project images across 10 projects, optimized to WebP at 960 px and 1600 px
- Clearly labelled image-request placeholders where project evidence is still missing
- Downloadable PDF resume
- Keyboard focus styles and reduced-motion support
- Graceful handling for missing project links and images

## Technology

HTML5, CSS3, vanilla JavaScript, JSON, and a small Node.js validation script.

## Structure

```text
personal-portfolio/
├── index.html
├── style.css
├── script.js
├── data/projects.json
├── projects/project.html
├── projects/project-detail.js
├── assets/images/
├── assets/projects/<project-slug>/
├── assets/resume.pdf          # Legacy local copy; public buttons use Canva
├── tests/validate.mjs
├── tests/visual-test.mjs
├── robots.txt
└── .nojekyll
```

## Local development

Opening the HTML through `file://` cannot load JSON. Start a local server from this directory:

```powershell
python -m http.server 4173
```

Then open `http://127.0.0.1:4173/`.

Run the file and data checks with:

```powershell
node tests/validate.mjs
```

Run the responsive browser checks and screenshot capture after starting the local server:

```powershell
node tests/visual-test.mjs
```

## Updating personal information

- Main page content: `index.html`
- Project content: `data/projects.json`
- Project design and interactions: `style.css` and `script.js`
- Portrait: replace `assets/images/profile.png` while keeping the same filename
- Resume: update the Canva URL used in `index.html` and `projects/project.html`

## Adding a project

Add a new object to `data/projects.json`. Use a unique lowercase `slug`, one of the existing category keys, and only verified claims. Add gallery objects with `src`, `srcset`, `alt`, and `caption`; the main gallery and reusable project detail page update automatically without editing HTML.

## GitHub Pages deployment

GitHub CLI was not installed during the initial local build. After confirming the GitHub account and authorizing publication:

1. Create a repository named `personal-portfolio` without overwriting an existing repository.
2. Initialize this directory as a Git repository.
3. Commit the reviewed files and push the `main` branch.
4. In GitHub: **Settings → Pages → Build and deployment → Deploy from a branch**.
5. Select **main** and **/(root)**.
6. Confirm the generated URL and then add it to the SEO canonical metadata and sitemap.

Never commit access tokens or credentials.

## Remaining owner confirmations

- GitHub profile and repository URLs
- LinkedIn URL
- Study period and expected graduation date
- Individual role wording for group projects
- Public demo links and measurable project results
- Whether the Onshape model includes a perfume-bottle design
