#!/usr/bin/env python3
"""Build assets/globe/globe.json for the about-page globe from public-domain Natural Earth data.

    python3 scripts/globe-data.py DIR

DIR holds three TopoJSON files (any mirror of the npm packages will do):
    land-110m.json, land-50m.json   from world-atlas@2   (Natural Earth, public domain)
    states-10m.json                 from us-atlas@3      (US Census, public domain)

Only coastlines go in. There are no country borders in the output, on purpose: a land outline is
uncontested, a political boundary is not. The one internal line is North Carolina's.
Output (all coordinates are [lon, lat] pairs in hundredths of a degree, flattened):
    coast            world coastline as polylines                       (110m)
    dots             a grid of points that fall on land, about 2.2 deg apart
    regions.NAME     {box, coast, dots}: a finer coastline and denser dots for a zoomed-in view  (50m)
    nc               North Carolina's outline
"""
import json, math, pathlib, sys
SRC = pathlib.Path(sys.argv[1]); OUT = pathlib.Path(__file__).resolve().parent.parent / "assets" / "globe" / "globe.json"
REGIONS = {"india": (60, 4, 100, 38), "usa": (-102, 22, -62, 50)}   # lon0, lat0, lon1, lat1

def rings_of(path, obj, only=None):
    """TopoJSON -> list of rings, each a list of (lon, lat)."""
    t = json.loads((SRC / path).read_text()); (sx, sy), (tx, ty) = t["transform"]["scale"], t["transform"]["translate"]
    arcs = []
    for a in t["arcs"]:
        x = y = 0; line = []
        for dx, dy in a: x += dx; y += dy; line.append((x * sx + tx, y * sy + ty))
        arcs.append(line)
    def ring(ids):
        out = []
        for i in ids:
            seg = arcs[i] if i >= 0 else arcs[~i][::-1]
            out += seg[1:] if out else seg
        return out
    rings = []
    for g in t["objects"][obj]["geometries"]:
        if only and g.get("id") != only: continue
        polys = g["arcs"] if g["type"] == "MultiPolygon" else [g["arcs"]]
        rings += [ring(r) for p in polys for r in p]
    return rings

def on_land(rings):
    """Even-odd point-in-polygon over every ring; rings carry a bounding box so most are skipped."""
    boxed = [(min(p[0] for p in r), min(p[1] for p in r), max(p[0] for p in r), max(p[1] for p in r), r) for r in rings]
    def test(x, y):
        inside = False
        for x0, y0, x1, y1, r in boxed:
            if not (x0 <= x <= x1 and y0 <= y <= y1): continue
            j = len(r) - 1
            for i in range(len(r)):
                (xi, yi), (xj, yj) = r[i], r[j]
                if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / (yj - yi) + xi: inside = not inside
                j = i
        return inside
    return test

def polylines(rings, box=None, tol=0.0):
    """Rings -> open polylines: cut at the antimeridian and the south-pole edge (those are seams, not coast),
    keep only what lies inside box, and thin with Douglas-Peucker."""
    out = []
    for r in rings:
        line = []
        for lon, lat in r + r[:1]:
            seam = abs(lon) > 179.9 or lat < -89.9
            inside = box is None or (box[0] <= lon <= box[2] and box[1] <= lat <= box[3])
            if seam or not inside:
                if len(line) > 1: out.append(line)
                line = []
            else: line.append((lon, lat))
        if len(line) > 1: out.append(line)
    return [simplify(l, tol) for l in out] if tol else out

def simplify(line, tol):
    if len(line) < 3: return line
    keep = [False] * len(line); keep[0] = keep[-1] = True; stack = [(0, len(line) - 1)]
    while stack:
        a, b = stack.pop(); (ax, ay), (bx, by) = line[a], line[b]; best, far = -1, tol
        for i in range(a + 1, b):
            px, py = line[i]; dx, dy = bx - ax, by - ay; n = math.hypot(dx, dy)
            d = abs(dx * (ay - py) - (ax - px) * dy) / n if n else math.hypot(px - ax, py - ay)
            if d > far: best, far = i, d
        if best > 0: keep[best] = True; stack += [(a, best), (best, b)]
    return [p for p, k in zip(line, keep) if k]

def grid(test, step, box=(-180, -84, 180, 84)):
    """Points on land, evenly spread: the longitude step widens toward the poles so dots keep their spacing."""
    pts = []; lat = box[1] + step / 2
    while lat < box[3]:
        dl = step / max(math.cos(math.radians(lat)), 0.2); lon = box[0] + dl / 2
        while lon < box[2]:
            if test(lon, lat): pts.append((lon, lat))
            lon += dl
        lat += step
    return pts

flat = lambda pts: [round(v * 100) for p in pts for v in p]
land110, land50 = rings_of("land-110m.json", "land"), rings_of("land-50m.json", "land")
data = {"coast": [flat(l) for l in polylines(land110)], "dots": flat(grid(on_land(land110), 2.2)), "regions": {}}
fine = on_land(land50)
for name, box in REGIONS.items():
    data["regions"][name] = {"box": list(box), "coast": [flat(l) for l in polylines(land50, box, 0.02)], "dots": flat(grid(fine, 0.75, box))}
data["nc"] = [flat(l) for l in polylines(rings_of("states-10m.json", "states", "37"), tol=0.01)]
OUT.parent.mkdir(parents=True, exist_ok=True); OUT.write_text(json.dumps(data, separators=(",", ":")))
count = lambda ls: sum(len(l) // 2 for l in ls)
print(f"coast {count(data['coast'])} pts in {len(data['coast'])} lines | dots {len(data['dots']) // 2}"
      + "".join(f" | {n}: coast {count(r['coast'])} pts, dots {len(r['dots']) // 2}" for n, r in data["regions"].items())
      + f" | nc {count(data['nc'])} pts | {OUT.stat().st_size // 1024} KB")
