# Neuromeka AI Lab pages

Static site intended for GitHub Pages hosting. Content is markdown-first so updates are simple:

- **Home config**: `content/home.json` (hero media + core tech items; supports images/videos via `mediaType` or file extension, using `path`, plus optional `poster` and `heroCopyUrl`)
- **Hero copy**: `content/hero.md` (optional first line `MaxWidth: 900px` to control hero text width)
- **Header/nav**: `assets/header.html` (shared top bar across pages)
- **Media assets**: `media/` (logo, hero images)
- **Blog**: add Markdown posts under `posts/` and list them in `posts/posts.json`. Each post should include a `# Title`, `Authors:`, `Date:`, and `Image:` line followed by the content body.
- **Team**: edit `team/team.md` using `## Name | Role`, optional `Image:`, and bullet points.
- **Open sources**: update `sources/repos.json`.

Pages are optimized for a wide layout, white background, and a configurable blue accent via the `--color-accent` CSS variable in `assets/css/styles.css`.

## Run locally

This site is static. Serve the repo root with any local web server, for example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.
