# Neuromeka AI Lab pages

Static site intended for GitHub Pages hosting. Content is markdown-first so updates are simple:

- **Hero copy**: `content/hero.md`
- **Core technology links**: adjust the `techItems` array inside `assets/script.js`.
- **Blog**: add Markdown posts under `posts/` and list them in `posts/posts.json`. Each post should include a `# Title`, `Authors:`, `Date:`, and `Image:` line followed by the content body.
- **Team**: edit `team/team.md` using `## Name | Role`, optional `Image:`, and bullet points.
- **Open sources**: update `sources/repos.json`.

Pages are optimized for a wide layout, white background, and a configurable blue accent via the `--accent` CSS variable in `assets/styles.css`.
