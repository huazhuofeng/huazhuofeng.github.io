# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Jekyll-based academic homepage and blog hosted on GitHub Pages at `huazhuofeng.top`. The site has two main sections:
- **Root path (`/`)**: Resume-style portfolio (profile, news, publications)
- **Blog path (`/blog/`)**: Academic blog with 博客园-style navigation

The site is bilingual (Chinese/English) with light/dark theme support.

## Development Commands

**Setup:**
```bash
gem install bundler
bundle install
```

**Local development (with live reload):**
```bash
bundle exec jekyll serve --livereload
```
Access at `http://127.0.0.1:4000/`. If port 4000 is in use, add `--port 4001`.

**Build and validation:**
```bash
bundle exec jekyll build    # Build to _site/
bundle exec jekyll doctor   # Check for configuration errors
```

## Architecture

### Data-Driven Content
Resume sections are powered by YAML files in `_data/`:
- `profile.yml` — Sidebar and hero information
- `publications.yml` — "Selected Publications" cards
- `news.yml` — "News & Updates" timeline

Edit these files to update resume content without touching templates.

### Blog Posts
Create files in `_posts/` with format `YYYY-MM-DD-slug.md`. Front matter:
```yaml
---
title: "Post title"
tags: [single-cell, reproducibility]
---
```

The blog listing at `/blog/` auto-generates from the `_posts/` directory.

### Layouts and Includes
- `_layouts/default.html` — Base layout with HTML structure
- `_layouts/home.html` — Homepage layout
- `_layouts/blog_index.html` — Blog listing layout
- `_layouts/post.html` — Individual post layout
- `_includes/` — Reusable components (head, header, nav, footer, sidebar)

### Theme and Language
- Theme toggle (light/dark) and language switcher (中文/EN) in `assets/js/site.js`
- Preferences persist via `localStorage`
- CSS variables in `assets/css/site.css` handle theming

### Jekyll Configuration
- Permalinks: `/blog/:year/:month/:day/:title/`
- Plugins: `jekyll-feed`, `jekyll-sitemap`
- Default layout for posts: `post`

## Plan Tracking

Significant architecture changes are documented in `plan/` with dated Markdown files (e.g., `plan/2026-01-22-v1.md`). Add a new plan file when making major structural changes.
