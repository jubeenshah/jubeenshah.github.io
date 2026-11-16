#!/usr/bin/env python3
"""Turn the SolidCraft commit helix (GLB) into assets/uncertain/helix.bin for the post's last scene.

    python3 scripts/uncertain-helix.py helix.glb

The GLB comes from SolidCraft (the script that builds it is assets/uncertain/helix.solidcraft.json; run it with
`solidcraft-cli run assets/uncertain/helix.solidcraft.json --out helix.glb`). Every body is thinned by vertex
clustering, with a cell an eighth of the body's size, so a bead sphere drops from 25,000 triangles to a few hundred, and
moved into the stage's units: 100 mm is 1, the history runs up y from -1.5 to 1.5, as the particle helix does.

helix.bin: uint32 vertices, uint32 indices, then int16 positions (x 1e-4), int8 normals, uint8 tags, uint16 indices.
Tags: 0 strand written, 1 strand erased, 2 bead written, 3 bead erased, 4 rung (person), 5 rung (agent).
"""
import json, math, pathlib, struct, sys
src = pathlib.Path(sys.argv[1]); out = pathlib.Path(__file__).resolve().parent.parent / "assets" / "uncertain" / "helix.bin"
b = src.read_bytes(); n = struct.unpack_from("<I", b, 12)[0]; g = json.loads(b[20:20 + n]); binoff = 20 + n + 8
def read(acc):
    a = g["accessors"][acc]; v = g["bufferViews"][a["bufferView"]]; off = binoff + v.get("byteOffset", 0) + a.get("byteOffset", 0)
    k = {"SCALAR": 1, "VEC3": 3}[a["type"]]; f = {5126: "f", 5125: "I", 5123: "H"}[a["componentType"]]
    return list(struct.iter_unpack("<" + f * k, b[off: off + a["count"] * k * struct.calcsize(f)]))
TAG = lambda name: {"strand-written": 0, "strand-erased": 1}.get(name, 2 if name.startswith("bead-written") else 3 if name.startswith("bead-erased") else 5 if name.startswith("rung-agent") else 4)
P, N, Tg, I = [], [], [], []
for node in g["nodes"]:
    if "mesh" not in node: continue
    tag = TAG(node["name"])
    for prim in g["meshes"][node["mesh"]]["primitives"]:
        pos = read(prim["attributes"]["POSITION"]); nor = read(prim["attributes"]["NORMAL"]); idx = [i[0] for i in read(prim["indices"])]
        lo = [min(p[k] for p in pos) for k in range(3)]; hi = [max(p[k] for p in pos) for k in range(3)]
        thin = tag in (2, 3)                                                    # only the beads: strands and rungs stay as SolidCraft made them
        cell = max(hi[k] - lo[k] for k in range(3)) / 8
        cells, remap = {}, []
        for p, q in zip(pos, nor):
            key = tuple(round(p[k] / cell) for k in range(3)) if thin else (p, q)
            if key not in cells: cells[key] = [len(cells), [0.0] * 3, [0.0] * 3, 0]
            c = cells[key]; c[3] += 1
            for k in range(3): c[1][k] += p[k]; c[2][k] += q[k]
            remap.append(c[0])
        base = len(P); order = sorted(cells.values(), key=lambda c: c[0])
        for c in order:
            x, y, z = (c[1][k] / c[3] for k in range(3)); m = math.sqrt(sum(v * v for v in c[2])) or 1
            P.append((x / 100, z / 100 - 1.5, -y / 100)); N.append((c[2][0] / m, c[2][2] / m, -c[2][1] / m)); Tg.append(tag)
        for t in range(0, len(idx), 3):
            a, bb, cc = remap[idx[t]], remap[idx[t + 1]], remap[idx[t + 2]]
            if a != bb and bb != cc and a != cc: I += [base + a, base + bb, base + cc]
pad = lambda data: data + b"\0" * (-len(data) % 4)
import collections; print('vertices by tag', dict(sorted(collections.Counter(Tg).items())))
assert len(P) < 65536, f"{len(P)} vertices: too many for 16-bit indices"
blob = struct.pack("<II", len(P), len(I))
blob += pad(struct.pack(f"<{len(P) * 3}h", *(max(-32767, min(32767, round(v * 1e4))) for p in P for v in p)))
blob += pad(struct.pack(f"<{len(N) * 3}b", *(round(v * 127) for q in N for v in q)))
blob += pad(bytes(Tg)) + struct.pack(f"<{len(I)}H", *I)
out.write_bytes(blob)
print(f"{len(P)} vertices, {len(I) // 3} triangles -> {out.name} {len(blob) // 1024} KB")
