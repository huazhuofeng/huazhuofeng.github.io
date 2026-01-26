# Huazhuo Feng's Academic Homepage
https://huazhuofeng.top

This repository hosts a Jekyll-based academic homepage and blog. It features a professional, clean design tailored for researchers, with integrated tools for content discovery and interaction.

## ✨ Key Features

- **Academic Portfolio**: Resume-style homepage showcasing profile, research interests, news, and publications.
- **Blog System**: Markdown-based blog under `/blog/` with tag support.
- **Data-Driven**: Content (Profile, News, Publications) is managed via simple YAML files in `_data/`.
- **Professional Design**: Inspired by top academic labs (e.g., Gu Lab), featuring a "Deep Slate Blue" color scheme and sticky sidebar.
- **Power Tools**:
    - **Command Palette**: Press `Ctrl + P` (or `Cmd + P`) to instantly search and navigate posts.
    - **AI Assistant**: Built-in DeepSeek AI chat widget for answering questions about the research (demo purpose).
- **Dark Mode**: Automatic system detection + manual toggle.

## 🚀 Development

1.  **Prerequisites**: Ruby + Bundler.
2.  **Install**:
    ```bash
    gem install bundler
    bundle install
    ```
3.  **Run**:
    ```bash
    bundle exec jekyll serve --livereload
    ```
4.  **Preview**: Visit `http://127.0.0.1:4000/`.

## 📝 Managing Content

| Section | Data Source | Description |
| :--- | :--- | :--- |
| **Profile** | `_data/profile.yml` | Sidebar info, Hero section text, Contact links. |
| **Publications** | `_data/publications.yml` | List of papers. Set `featured: true` to show on homepage. |
| **News** | `_data/news.yml` | "News & Updates" timeline items. |
| **Blog Posts** | `_posts/YYYY-MM-DD-slug.md` | Standard Jekyll posts. |

### Creating a Post
Create a file in `_posts/` (e.g., `2026-01-26-new-paper.md`):
```yaml
---
title: "Paper Published in Nature Medicine"
subtitle: "A breakthrough in pulmonary hypertension"
tags: [publication, research]
---
Content goes here...
```

## 🛠 Tech Stack

- **Engine**: Jekyll
- **Styling**: Custom CSS (No heavy frameworks), Glassmorphism effects.
- **Search**: `simple-jekyll-search` (Client-side).
- **AI**: DeepSeek API integration (Client-side fetch).
- **Comments**: Giscus (GitHub Discussions).

## 📄 License
MIT License. Feel free to fork and adapt for your own academic page.
