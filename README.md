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

## Photos

`/photos/` is `feh -t ~/photos/`: a thumbnail grid, one box per photo, the
file name in the bottom rail, a double border on the selected cell. Arrows or
`hjkl` move, Enter opens, `e` (feh's own exif key) drops an `exiftool` pane
under the grid. Each photo page is `feh <file>` followed by `exiftool <file>`
and `sha256sum`. The exiftool output is the real format: 32-column tag names,
`Directory : .`, `Aperture : 4.0`, not `f/4`.

Photos are a collection — one markdown file per photo, no body needed:

```
_photos/<album>/<slug>.md          front matter only (schema below)
assets/photos/<album>/<slug>-480.webp   grid thumbnail
assets/photos/<album>/<slug>-960.webp   phone / tablet view
assets/photos/<album>/<slug>-1920.jpg   desktop view + OG image
```

Don't write these by hand. Export JPEGs (Phocus, Lightroom, a scanner) and run:

```sh
pip install Pillow
python3 scripts/photos-ingest.py montenegro ~/Export/montenegro/
python3 scripts/photos-ingest.py roll-07 ~/Scans/roll07/ \
    --film "Kodak Portra 400" --camera "Holga 120N" --location "Raleigh, NC"
```

The script resizes (never upscales), strips all metadata from the derivatives
(no EXIF, so no GPS — only the ICC profile is kept), reads camera/lens/exposure
from the source once, and writes the front matter. Existing `.md` files are
kept (captions survive re-runs) unless `--force`. Originals never enter the
repo; GitHub Pages serves only the derivatives.

```yaml
---
title: "Kotor Bay"
date: 2026-09-14 18:02:00  # camera clock; _config.yml pins UTC to keep it
album: montenegro        # the grid's filter buttons come from this
tags: []
location: "Kotor, Montenegro"
caption: ""              # shown under the photo as a `# comment`
camera: "Hasselblad X2D 100C"
lens: "XCD 80mm f/1.9"
focal: "80 mm"
aperture: "f/8"
shutter: "1/250"
iso: 64
film: ""                 # film stock for scans; the script blanks the exposure fields
image: { path: /assets/photos/montenegro/kotor-bay-1920.jpg, width: 1920, height: 1280, alt: "Kotor Bay" }
thumb: /assets/photos/montenegro/kotor-bay-480.webp
srcset: "...-480.webp 480w, ...-960.webp 960w, ...-1920.jpg 1920w"
color: "#678782"         # dominant colour, painted behind the thumbnail while it loads
sha256: "<hash of the 1920px file>"
---
```

A photo can carry a song. The page prints `music play "<title>" &` (a made-up
CLI) linking to `url`, with the `embed` player under it:

```yaml
song:
  title: "Anuv Jain - Antariksh"
  url: "https://music.apple.com/us/album/antariksh/1687717623?i=1687717625"
  embed: "https://embed.music.apple.com/us/album/antariksh/1687717623?i=1687717625"
```

Apple Music plays a 30-second preview, or the whole song for a signed-in
subscriber. Nothing autoplays with sound. Most official YouTube uploads refuse
embedding (player error 150), so `embed` is optional and the link is the part
that always works.

Grid order is newest first. `published: false` hides an entry. `/photos.json`
is the machine-readable index. Layouts: `photos/index.html` (grid) and
`_layouts/photo.html` (single); behaviour in `assets/photos.js`, styling in
`assets/photos.css`.

## Repo map

```
_posts/          the writing
_photos/         one front-matter file per photo (see Photos)
scripts/         photos-ingest.py — exports → derivatives + front matter
_data/           achievements.yml — badge/cert data for the about page
_layouts/        terminal-home (index), post-terminal, page-terminal, photo, default
_includes/       header / footer
assets/          terminal.{js,css}, post-terminal.{js,css}, photos.{js,css}, intern-shell.{js,css}, link-preview.{js,css}
assets/photos/   generated derivatives (commit these; originals stay out)
_bibliography/   references for posts that cite sources (jekyll-scholar)
posts.json       build-time index powering hover previews and search
photos.json      build-time index of the gallery
preview.html     "the intern experience" DOS shell
```

Read the [disclaimer](https://jubeenshah.github.io/disclaimer/). Hope you have a good time!
