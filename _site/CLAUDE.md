# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Jekyll-based academic homepage and blog hosted on GitHub Pages at `huazhuofeng.top`. The site features a professional design inspired by **Guangzhou Medical University (GZHMU)** and integrates advanced features like AI chat and dynamic backgrounds.

### Key Features
- **Design System**: GZHMU-inspired "Deep Red/White" palette, sticky sidebar, glassmorphism cards.
- **Dynamic Background**: Randomly selects a background image (60% opacity) from `assets/img/background/` on load.
- **Power Tools**:
    - **Command Palette**: `Ctrl/Cmd + P` for instant search.
    - **AI Assistant**: DeepSeek-powered chat widget with Markdown support and secure backend proxy.
- **Content**: Data-driven (YAML) resume sections and Markdown blog posts.

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
Access at `http://127.0.0.1:4000/`.

**Build:**
```bash
bundle exec jekyll build
```

## Architecture

### Data-Driven Content
Resume sections are powered by YAML files in `_data/`:
- `profile.yml` — Sidebar, hero info, contact links.
- `publications.yml` — "Selected Publications" cards.
- `news.yml` — "News & Updates" timeline.

### AI & Backend (Cloudflare Workers)
- **Frontend**: `assets/js/site.js` handles the chat UI, streaming response, and auth state.
- **Backend**: `worker.js` (deployed to Cloudflare) handles:
    - **API Key Protection**: Hides the real DeepSeek Key.
    - **Rate Limiting**: Limits guests to 20 messages/day.
    - **Auth**: Supports "VIP Password" and "User API Key" to bypass limits.
- **Worker URL**: Configured in `assets/js/site.js` as `WORKER_URL`.

### Layouts & Styling
- **CSS**: `assets/css/site.css` uses CSS variables for theming (`--primary-red`, `--bg`, etc.). Supports Light/Dark mode.
- **Includes**:
    - `_includes/nav.html`: Header with Logo (`assets/img/logo/personal_logo.jpg`) and links.
    - `_includes/ai-chat.html`: The floating chat widget structure.
    - `_includes/search-modal.html`: The Command Palette structure.
    - `_includes/footer.html`: GZHMU-style red footer.

### Blog Posts
Create files in `_posts/` with format `YYYY-MM-DD-slug.md`:
```yaml
---
title: "Post title"
tags: [research, update]
---
```

## Plan Tracking
Significant architecture changes are documented in `plan/` with dated Markdown files.
