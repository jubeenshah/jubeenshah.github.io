# jubeenshah.github.io

Personal site of Jubeen Shah — [jubeenshah.github.io](https://jubeenshah.github.io/).
A Jekyll blog styled as a terminal session: the homepage plays a short shell
animation (click or press any key to skip), posts render as `cat <file>.md`,
and the whole thing can be re-skinned from the theme menu (`--dark`,
`--light`, `--colour-blind-chums`, or `--the-intern-experience`, a Turbo
Vision-style DOS shell).

## Run locally

```sh
bundle install
bundle exec jekyll serve   # http://localhost:4000
```

## Writing a post

Create `_posts/YYYY-MM-DD-slug.md`. The layout is applied automatically
(see `defaults` in `_config.yml`) — no `layout:` line needed.

```yaml
---
title: "Human-readable title"
category: writing            # one of: writing | security | projects | certs | career
subcategory: personal        # free-form; filter buttons are generated from what exists
spanning: [opinion]          # cross-cutting tags: opinion | reflection | tutorial | series | open-source
---
```

Optional keys:

| Key            | Purpose                                                        |
| -------------- | -------------------------------------------------------------- |
| `nsfw: true`   | Marks the post `-rwsr--r--` and lets visitors filter it out    |
| `series`       | Groups posts into a series (adds series navigation)            |
| `series_order` | 1-based position within the series                             |
| `published: false` | Keeps a draft out of the built site                        |

The homepage filter bar (categories → subcategories → `#spanning` tags) is
built from post front matter at page load, so new subcategories and tags show
up without touching any code.

## Achievement badges

The about page shows a `ls ~/proof/` rail of badges, certs, and pins
(HTB, KC7, OffSec, …). Add entries in `_data/achievements.yml` — each item is
a `name` + public proof `url`, with optional badge `image` (remote URL or a
file under `assets/images/badges/`) and `desc`. Items without an image render
as text chips; empty groups stay hidden. Markup lives in
`_includes/achievements.html`, styling in `assets/achievements.css`.

## Repo map

```
_posts/          the writing
_data/           achievements.yml — badge/cert data for the about page
_layouts/        terminal-home (index), post-terminal, page-terminal, default
_includes/       header / footer
assets/          terminal.{js,css}, post-terminal.{js,css}, intern-shell.{js,css}, link-preview.{js,css}
_bibliography/   references for posts that cite sources (jekyll-scholar)
posts.json       build-time index powering hover previews and search
preview.html     "the intern experience" DOS shell
```

Read the [disclaimer](https://jubeenshah.github.io/disclaimer/). Hope you have a good time!
