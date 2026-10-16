#!/usr/bin/env python3
"""
photos-ingest.py — turn exported photos into gallery entries.

    python3 scripts/photos-ingest.py montenegro ~/Export/montenegro/*.jpg
    python3 scripts/photos-ingest.py film-roll-07 ~/Scans/roll07/ \
        --film "Kodak Portra 400" --camera "Holga 120N" --location "Raleigh, NC"

For every source image it writes:

    assets/photos/<album>/<slug>-480.webp     grid thumbnail (2x on a ~240px cell)
    assets/photos/<album>/<slug>-960.webp     phone / tablet full view
    assets/photos/<album>/<slug>-1920.jpg     desktop full view + OG image
    (the number is the long edge; srcset records the real width)
    _photos/<album>/<slug>.md                 front matter the layouts read

Derivatives carry NO metadata (no EXIF, so no GPS); only the ICC profile is
kept for colour. Camera/lens/exposure are read from the source once and
written into the front matter, where you can edit or delete them.

Existing .md files are left alone (captions survive re-runs) unless --force.
Originals never go into the repo — point this at Phocus/Lightroom exports.

Requires Pillow:  pip install Pillow
"""

import argparse
import hashlib
import re
import sys
from datetime import datetime
from fractions import Fraction
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit("Pillow is required:  pip install Pillow")

ROOT = Path(__file__).resolve().parent.parent
SIZES = ((480, "webp"), (960, "webp"), (1920, "jpg"))
EXTS = {".jpg", ".jpeg", ".png", ".tif", ".tiff", ".webp"}

EXIF_IFD = 0x8769
TAG = {
    "Make": 0x010F,
    "Model": 0x0110,
    "DateTimeOriginal": 0x9003,
    "ExposureTime": 0x829A,
    "FNumber": 0x829D,
    "ISO": 0x8827,
    "FocalLength": 0x920A,
    "LensModel": 0xA434,
}


def slugify(stem):
    slug = re.sub(r"[^a-z0-9]+", "-", stem.lower()).strip("-")
    return slug or "photo"


def titleize(slug):
    return " ".join(w.capitalize() for w in slug.split("-"))


def yaml_str(value):
    """Quote a scalar for YAML without pulling in a YAML dependency."""
    if value is None or value == "":
        return '""'
    value = str(value).replace("\\", "\\\\").replace('"', '\\"')
    return f'"{value}"'


def fmt_shutter(value):
    if value is None:
        return ""
    try:
        f = Fraction(value).limit_denominator(8000)
    except (TypeError, ValueError, ZeroDivisionError):
        return str(value)
    if f >= 1:
        return f"{float(f):g}s"
    return f"1/{round(1 / f)}"


def fmt_aperture(value):
    if value is None:
        return ""
    try:
        return f"f/{float(value):g}"
    except (TypeError, ValueError):
        return str(value)


def fmt_focal(value):
    if value is None:
        return ""
    try:
        return f"{float(value):g} mm"
    except (TypeError, ValueError):
        return str(value)


def clean(text):
    if text is None:
        return ""
    if isinstance(text, bytes):
        text = text.decode("utf-8", "ignore")
    return str(text).strip().strip("\x00")


def read_exif(im):
    """Return the handful of fields the gallery shows. Never GPS."""
    out = {}
    try:
        exif = im.getexif()
    except Exception:  # noqa: BLE001 — a broken EXIF block is not fatal
        return out
    ifd = {}
    try:
        ifd = exif.get_ifd(EXIF_IFD)
    except Exception:  # noqa: BLE001
        pass

    make = clean(exif.get(TAG["Make"]))
    model = clean(exif.get(TAG["Model"]))
    if model:
        # Hasselblad writes "Hasselblad" + "X2D 100C"; some vendors repeat the make
        out["camera"] = model if make.lower() in model.lower() else f"{make} {model}".strip()
    out["lens"] = clean(ifd.get(TAG["LensModel"]))
    out["focal"] = fmt_focal(ifd.get(TAG["FocalLength"]))
    out["aperture"] = fmt_aperture(ifd.get(TAG["FNumber"]))
    out["shutter"] = fmt_shutter(ifd.get(TAG["ExposureTime"]))
    iso = ifd.get(TAG["ISO"])
    if isinstance(iso, (tuple, list)):
        iso = iso[0] if iso else None
    out["iso"] = int(iso) if isinstance(iso, (int, float)) else ""
    taken = clean(ifd.get(TAG["DateTimeOriginal"]))
    if taken:
        try:
            out["date"] = datetime.strptime(taken[:19], "%Y:%m:%d %H:%M:%S").date()
        except ValueError:
            pass
    return out


def dominant_color(im):
    px = im.convert("RGB").resize((1, 1), Image.Resampling.BOX).getpixel((0, 0))
    return "#{:02x}{:02x}{:02x}".format(*px)


def sha256_of(path):
    h = hashlib.sha256()
    with open(path, "rb") as fh:
        for chunk in iter(lambda: fh.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def write_derivatives(im, out_dir, slug):
    """Resize to each target width (never upscale).

    Returns ({target_width: (path, actual_width)}, (w, h) of the largest).
    The file is named for its target width; srcset uses the real width, so a
    1600px source still gets a correct "-1920.jpg 1600w" entry.
    """
    icc = im.info.get("icc_profile")
    paths = {}
    full_w, full_h = im.size
    long_edge = max(im.width, im.height)
    for width, ext in SIZES:
        target = out_dir / f"{slug}-{width}.{ext}"
        scale = min(1.0, width / long_edge)  # cap the long edge, so portraits don't balloon
        size = (max(1, round(im.width * scale)), max(1, round(im.height * scale)))
        resized = im.resize(size, Image.Resampling.LANCZOS) if scale < 1 else im.copy()
        resized = resized.convert("RGB")
        kwargs = {"icc_profile": icc} if icc else {}
        if ext == "webp":
            resized.save(target, "WEBP", quality=82, method=6, **kwargs)
        else:
            resized.save(target, "JPEG", quality=86, optimize=True, progressive=True, **kwargs)
        paths[width] = (target, resized.width)
        if width == 1920:
            full_w, full_h = resized.size
    return paths, (full_w, full_h)


def rel(path):
    return "/" + path.relative_to(ROOT).as_posix()


def front_matter(meta):
    srcset = ", ".join(
        f"{rel(path)} {actual}w" for _, (path, actual) in sorted(meta["paths"].items())
    )
    iso = meta.get("iso")
    iso_yaml = str(iso) if iso not in ("", None) else '""'
    lines = [
        "---",
        f"title: {yaml_str(meta['title'])}",
        f"date: {meta['date'].isoformat()}",
        f"album: {meta['album']}",
        "tags: []",
        f"location: {yaml_str(meta.get('location'))}",
        'caption: ""',
        f"camera: {yaml_str(meta.get('camera'))}",
        f"lens: {yaml_str(meta.get('lens'))}",
        f"focal: {yaml_str(meta.get('focal'))}",
        f"aperture: {yaml_str(meta.get('aperture'))}",
        f"shutter: {yaml_str(meta.get('shutter'))}",
        f"iso: {iso_yaml}",
        f"film: {yaml_str(meta.get('film'))}",
        "image:",
        f"  path: {rel(meta['paths'][1920][0])}",
        f"  width: {meta['width']}",
        f"  height: {meta['height']}",
        f"  alt: {yaml_str(meta['title'])}",
        f"thumb: {rel(meta['paths'][480][0])}",
        f"srcset: {yaml_str(srcset)}",
        f"color: {yaml_str(meta['color'])}",
        f"sha256: {meta['sha256']}",
        "---",
        "",
    ]
    return "\n".join(lines)


def collect(sources):
    for src in sources:
        p = Path(src).expanduser()
        if p.is_dir():
            yield from sorted(q for q in p.iterdir() if q.suffix.lower() in EXTS)
        elif p.suffix.lower() in EXTS:
            yield p
        else:
            print(f"skip (not an image): {p}", file=sys.stderr)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("album", help="album slug, e.g. montenegro (becomes _photos/<album>/ and assets/photos/<album>/)")
    ap.add_argument("sources", nargs="+", help="exported JPEG/TIFF/PNG files or directories")
    ap.add_argument("--camera", help="override camera (film scans: the camera, not the scanner)")
    ap.add_argument("--lens", help="override lens")
    ap.add_argument("--film", help="film stock, e.g. 'Kodak Portra 400' — marks the entry as film")
    ap.add_argument("--location", help="where, e.g. 'Kotor, Montenegro'")
    ap.add_argument("--force", action="store_true", help="rewrite existing _photos/*.md entries")
    args = ap.parse_args()

    album = slugify(args.album)
    out_dir = ROOT / "assets" / "photos" / album
    md_dir = ROOT / "_photos" / album
    out_dir.mkdir(parents=True, exist_ok=True)
    md_dir.mkdir(parents=True, exist_ok=True)

    count = 0
    for src in collect(args.sources):
        slug = slugify(src.stem)
        with Image.open(src) as raw:
            im = ImageOps.exif_transpose(raw)
            exif = read_exif(raw)
            if args.film:
                # a scanned negative's EXIF describes the scanner, not the shot:
                # drop it and take the camera from --camera (or leave it blank)
                exif.pop("camera", None)
                exif["lens"] = exif["focal"] = exif["aperture"] = exif["shutter"] = exif["iso"] = ""
            paths, (w, h) = write_derivatives(im, out_dir, slug)
            color = dominant_color(im)

        meta = {
            "title": titleize(slug),
            "date": exif.get("date") or datetime.fromtimestamp(src.stat().st_mtime).date(),
            "album": album,
            "location": args.location or "",
            "camera": args.camera or exif.get("camera", ""),
            "lens": args.lens or exif.get("lens", ""),
            "focal": exif.get("focal", ""),
            "aperture": exif.get("aperture", ""),
            "shutter": exif.get("shutter", ""),
            "iso": exif.get("iso", ""),
            "film": args.film or "",
            "paths": paths,
            "width": w,
            "height": h,
            "color": color,
            "sha256": sha256_of(paths[1920][0]),
        }

        md = md_dir / f"{slug}.md"
        if md.exists() and not args.force:
            print(f"keep  {md.relative_to(ROOT)}  (derivatives refreshed; --force to rewrite)")
        else:
            md.write_text(front_matter(meta), encoding="utf-8")
            print(f"write {md.relative_to(ROOT)}")
        count += 1

    print(f"{count} photo(s) → {out_dir.relative_to(ROOT)}/ and {md_dir.relative_to(ROOT)}/")


if __name__ == "__main__":
    main()
