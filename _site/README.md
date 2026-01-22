# Huazhuofeng.github.io

This repository hosts a Jekyll-based research homepage with a blog under `/blog/`. The root page is a resume-style portrait (resume + news + publications) while the `/blog/` path renders Markdown posts with a “博客园风格” navigation, bilingual prompts, and light/dark theme switching.

## Development

1. Install Ruby + Bundler (`gem install bundler`).
2. Run `bundle install`.
3. Launch the preview server:

```
bundle exec jekyll serve --livereload
```

4. Visit `http://127.0.0.1:4000/` to see the homepage. The blog lives at `/blog/`.

## Writing posts

Create a file under `_posts/` with the format `YYYY-MM-DD-slug.md`. The front matter already uses the shared `post` layout, so you only need:

```yaml
---
title: "Descriptive title"
tags: [single-cell, reproducibility]
---
```

Add Markdown content below the front matter. The blog list on `/blog/` regenerates automatically.

## Updating data-driven sections

- `_data/profile.yml` controls the sidebar and hero information.
- `_data/publications.yml` determines the “Selected Publications” cards.
- `_data/news.yml` drives the “News & Updates” timeline.

Adjust these files to update the resume content without touching templates.

## Theme & language

- The page respects the system color scheme. Click the moon/sun icon to toggle light/dark manually.
- Use the “中文 / EN” buttons to switch visibility between translations (the UI still shows both when “bilingual” mode is active).
- Preference choices persist via `localStorage`.

## Plan tracking

Every significant rewrite creates a Markdown note inside the `plan/` directory (e.g., `plan/2026-01-22-v1.md`) describing the decision set. Add new files there whenever the architecture or scope changes.
