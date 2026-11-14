#!/usr/bin/env python3
"""Draw our own animated badges for every entry in the trophy rail, so the site stops hotlinking art whose URLs move.

    python3 scripts/badges.py            # writes assets/images/badges/<family>/<slug>.svg
    python3 scripts/badges.py --wire     # also points _data/achievements.yml and the badge posts at those files
    python3 scripts/badges.py --sheet F  # also writes one contact sheet SVG to F (for review)

Every drawing is original: one frame per family (ring, hexagon, pin, shield, seal, tile) and one scene per badge
built from the idea behind its name. Nothing is traced from an issuer's artwork and no issuer logo appears.
The motion is CSS inside each SVG, so it plays in a plain <img> with no script, and stops for readers who ask
for reduced motion. Without CSS (a static renderer) each badge is simply its finished drawing.
The REGISTRY at the bottom is the single list: family, file slug, the entry's name in achievements.yml, and the
post it belongs to (if any).
"""
import math, pathlib, random, re, sys
ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "images" / "badges"
BG, PANEL, INK, DIM = "#0A0D14", "#121A2E", "#EEF2FB", "#9AA3B8"
GREEN, CYAN, VIOLET, SKY, AMBER, RED = "#00E08A", "#22D3EE", "#8B5CF6", "#38BDF8", "#F5B301", "#FF4D2E"
TAU = 2 * math.pi
S = lambda c, w, extra="": f'fill="none" stroke="{c}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round" {extra}'
O2, O3, O5, O7 = 'stroke-opacity="0.25"', 'stroke-opacity="0.35"', 'stroke-opacity="0.5"', 'stroke-opacity="0.7"'
FAINT_DASH = O2 + ' stroke-dasharray="4 12"'
pt = lambda r, deg, cx=120, cy=120: (cx + r * math.cos(math.radians(deg)), cy + r * math.sin(math.radians(deg)))
def arc(r, a0, a1, cx=120, cy=120):
    (x0, y0), (x1, y1) = pt(r, a0, cx, cy), pt(r, a1, cx, cy)
    return f"M{x0:.1f} {y0:.1f}A{r} {r} 0 {1 if (a1 - a0) % 360 > 180 else 0} 1 {x1:.1f} {y1:.1f}"
def star4(cx, cy, r, c, d=0):                          # a four-point sparkle that twinkles
    k = r * 0.28
    return f'<path class="tw" style="animation-delay:{d}s" d="M{cx} {cy - r}Q{cx + k} {cy - k} {cx + r} {cy}Q{cx + k} {cy + k} {cx} {cy + r}Q{cx - k} {cy + k} {cx - r} {cy}Q{cx - k} {cy - k} {cx} {cy - r}Z" fill="{c}"/>'
def node(x, y, c, r=6, cls="", d=0): return f'<circle class="{cls}" style="animation-delay:{d}s" cx="{x}" cy="{y}" r="{r}" fill="{BG}" stroke="{c}" stroke-width="3"/>'
G = lambda cls, body, style="": f'<g class="{cls}" style="{style}">{body}</g>'
# small parts shared by several scenes
P = lambda d, c, w, extra="", cls="", style="": f'<path class="{cls}" style="{style}" d="{d}" {S(c, w, extra)}/>'
box = lambda x, y, w, h, rx, fill, stroke, sw=3.5, extra="": f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" {extra}/>'
dot = lambda x, y, r, c, cls="", d=0: f'<circle class="{cls}" style="animation-delay:{d}s" cx="{x}" cy="{y}" r="{r}" fill="{c}"/>'
def shield_d(cx, cy, s):                               # a heater shield, s = half width
    return (f"M{cx} {cy - 1.08 * s}C{cx + 0.3 * s} {cy - 0.9 * s} {cx + 0.65 * s} {cy - 0.8 * s} {cx + s} {cy - 0.8 * s}V{cy + 0.05 * s}"
            f"C{cx + s} {cy + 0.7 * s} {cx + 0.55 * s} {cy + 1.1 * s} {cx} {cy + 1.35 * s}C{cx - 0.55 * s} {cy + 1.1 * s} {cx - s} {cy + 0.7 * s} {cx - s} {cy + 0.05 * s}"
            f"V{cy - 0.8 * s}C{cx - 0.65 * s} {cy - 0.8 * s} {cx - 0.3 * s} {cy - 0.9 * s} {cx} {cy - 1.08 * s}Z")
def gear(cx, cy, r, c, cls="spin", teeth=8):           # a ring with teeth, turning about its own centre
    t = "".join(f'<path d="M{pt(r * 0.72, a, cx, cy)[0]:.1f} {pt(r * 0.72, a, cx, cy)[1]:.1f}L{pt(r, a, cx, cy)[0]:.1f} {pt(r, a, cx, cy)[1]:.1f}" {S(c, r * 0.3)}/>' for a in range(0, 360, 360 // teeth))
    return G(cls, t + f'<circle cx="{cx}" cy="{cy}" r="{r * 0.66:.1f}" fill="{PANEL}" stroke="{c}" stroke-width="{r * 0.2:.1f}"/><circle cx="{cx}" cy="{cy}" r="{r * 0.2:.1f}" fill="{c}"/>')
def magnifier(cx, cy, r, c, cls="float", inner=""):
    hx, hy = pt(r, 45, cx, cy); ex, ey = pt(r + 20, 45, cx, cy)
    return G(cls, f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{BG}" fill-opacity="0.75" stroke="{c}" stroke-width="5"/>{inner}<path d="M{hx:.1f} {hy:.1f}L{ex:.1f} {ey:.1f}" {S(c, 7)}/>')
def doc(x, y, w, h, c, fill=PANEL):                    # a page with a folded corner
    return f'<path d="M{x} {y}H{x + w - 12}L{x + w} {y + 12}V{y + h}H{x}Z" fill="{fill}" stroke="{c}" stroke-width="3" stroke-linejoin="round"/><path d="M{x + w - 12} {y}V{y + 12}H{x + w}" {S(c, 3)}/>'
def padlock(x, y, c, open_=False):                     # small lock, x,y = centre of the body
    sh = f"M{x - 5} {y - 5}V{y - 10}A5 5 0 0 1 {x + 5} {y - 12}" if open_ else f"M{x - 5} {y - 5}V{y - 9}A5 5 0 0 1 {x + 5} {y - 9}V{y - 5}"
    return f'<path d="{sh}" {S(c, 3)}/><rect x="{x - 8}" y="{y - 5}" width="16" height="12" rx="3" fill="{c}"/>'
def host(x, y, c, fill=PANEL, cls="", d=0):            # a little computer, x,y = centre of the screen
    return (f'<rect class="{cls}" style="animation-delay:{d}s" x="{x - 17}" y="{y - 13}" width="34" height="26" rx="5" fill="{fill}" stroke="{c}" stroke-width="3"/>'
            f'<path d="M{x} {y + 13}V{y + 20}M{x - 9} {y + 20}H{x + 9}" {S(c, 3)}/>')
def cap(cx, cy, s=1.0):                                # a mortarboard that hovers, tassel swinging
    X = lambda v: cx + v * s; Y = lambda v: cy + v * s
    tassel = G("sway", f'<path d="M{X(44)} {Y(0)}V{Y(24)}" {S(CYAN, 3)}/><circle cx="{X(44)}" cy="{Y(28)}" r="{5 * s:.1f}" fill="{CYAN}"/>', f"transform-origin:{X(44)}px {Y(0)}px")
    return G("float", f'<path d="M{X(-24)} {Y(6)}V{Y(24)}C{X(-16)} {Y(34)} {X(16)} {Y(34)} {X(24)} {Y(24)}V{Y(6)}" fill="#6D45D8" stroke="{VIOLET}" stroke-width="3" stroke-linejoin="round"/>'
                      f'<polygon points="{X(0)},{Y(-18)} {X(44)},{Y(0)} {X(0)},{Y(18)} {X(-44)},{Y(0)}" fill="{VIOLET}" stroke="{INK}" stroke-width="2.5" stroke-linejoin="round"/>' + tassel)

CSS = """
.rot{transform-origin:120px 120px;animation:rot 60s linear infinite}
.orbit{transform-origin:120px 120px;animation:rot 16s linear infinite}
.spin{transform-box:fill-box;transform-origin:center;animation:rot 7s linear infinite}
.spinr{transform-box:fill-box;transform-origin:center;animation:rot 5s linear infinite reverse}
@keyframes rot{to{transform:rotate(360deg)}}
.float{animation:float 4s ease-in-out infinite}
@keyframes float{50%{transform:translateY(-5px)}}
.pulse{transform-box:fill-box;transform-origin:center;animation:pulse 2.4s ease-in-out infinite}
@keyframes pulse{50%{transform:scale(1.14)}}
.tw{transform-box:fill-box;transform-origin:center;animation:tw 2.6s ease-in-out infinite}
@keyframes tw{50%{transform:scale(.5);opacity:.35}}
.blink{animation:blink 2.4s ease-in-out infinite}
@keyframes blink{50%{opacity:.2}}
.glow{animation:glow 2.8s ease-in-out infinite}
@keyframes glow{50%{opacity:.35}}
.cursor{animation:cursor 1.1s steps(1) infinite}
@keyframes cursor{50%{opacity:0}}
.march{animation:march 1.4s linear infinite}
@keyframes march{to{stroke-dashoffset:var(--m)}}
.draw{animation:draw 3.4s ease-in-out infinite}
@keyframes draw{0%{stroke-dasharray:1;stroke-dashoffset:1}55%,100%{stroke-dasharray:1;stroke-dashoffset:0}}
.sway{animation:sway 3.4s ease-in-out infinite}
@keyframes sway{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}
.flick{transform-box:fill-box;transform-origin:50% 100%;animation:flick 1.3s ease-in-out infinite}
@keyframes flick{30%{transform:scale(.95,1.06) skewX(-2deg)}65%{transform:scale(1.04,.96) skewX(2deg)}}
.flash{animation:flash 2.8s linear infinite}
@keyframes flash{0%,44%,56%,66%,100%{opacity:1}50%{opacity:.1}61%{opacity:.3}}
.drift{transform-box:fill-box;transform-origin:center;animation:drift 3s ease-in-out infinite}
@keyframes drift{50%{transform:translate(6px,-5px) rotate(10deg)}}
.eye{transform-box:fill-box;transform-origin:center;animation:eye 4s linear infinite}
@keyframes eye{0%,91%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}
.needle{transform-origin:120px 122px;animation:needle .9s ease-in-out infinite}
@keyframes needle{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(7deg)}}
.seq{animation:seq 3.6s linear infinite backwards}
@keyframes seq{0%,100%{opacity:.2}8%,90%{opacity:1}}
.ox{animation:ox 4.5s cubic-bezier(.37,0,.63,1) infinite alternate}
.oy{animation:oy 4.5s cubic-bezier(.37,0,.63,1) infinite alternate;animation-delay:-2.25s}
@keyframes ox{to{transform:translateX(-144px)}}
@keyframes oy{from{transform:translateY(-30px)}to{transform:translateY(30px)}}
.steam{animation:steam 3s ease-in-out infinite}
@keyframes steam{0%{opacity:0;transform:translateY(6px)}40%{opacity:.9}100%{opacity:0;transform:translateY(-12px)}}
.eq{transform-box:fill-box;transform-origin:50% 100%;animation:eq 1.1s ease-in-out infinite}
@keyframes eq{50%{transform:scaleY(.35)}}
.wave{animation:wave 2.4s linear infinite}
@keyframes wave{to{transform:translateX(-28px)}}
.hop{animation:hop 3.2s steps(1) infinite}
@keyframes hop{25%{transform:translateX(30px)}50%{transform:translateX(60px)}75%{transform:translateX(90px)}}
.drop{animation:drop 2.6s ease-in infinite}
@keyframes drop{0%,100%{transform:translateY(-14px)}35%,80%{transform:translateY(0)}}
.scan{animation:scan 2.6s ease-in-out infinite alternate}
@keyframes scan{from{transform:translateY(-34px)}to{transform:translateY(34px)}}
.snap{animation:sway 1.1s ease-in-out infinite}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}
""".replace("\n", "")

# ---- HTB Academy: one scene per badge, drawn around the centre (120, 120) inside a radius of about 78 ----------
def academician():                                     # an open book; the mortarboard hovers, its tassel swings
    page = lambda s: (f'<path d="M120 152C{120 + s * 20} 140 {120 + s * 42} 138 {120 + s * 62} 144V98C{120 + s * 42} 92 {120 + s * 20} 94 120 106Z" fill="{PANEL}" {S(INK, 3)[12:]}/>'
                      + "".join(f'<path d="M{120 + s * 12} {112 + i * 11}C{120 + s * 26} {106 + i * 11} {120 + s * 40} {105 + i * 11} {120 + s * 52} {108 + i * 11}" {S(INK, 2, "stroke-opacity=\'0.45\'")}/>' for i in range(3)))
    tassel = G("sway", f'<path d="M164 64V88" {S(CYAN, 3)}/><circle cx="164" cy="92" r="5" fill="{CYAN}"/>', "transform-origin:164px 64px")
    cap = G("float", f'<path d="M96 70V88C104 98 136 98 144 88V70" fill="#6D45D8" {S(VIOLET, 3)[12:]}/>'
                     f'<polygon points="120,46 164,64 120,82 76,64" fill="{VIOLET}" stroke="{INK}" stroke-width="2.5" stroke-linejoin="round"/>' + tassel)
    return page(-1) + page(1) + f'<path d="M120 106V152" {S(INK, 3)}/>' + cap + star4(66, 84, 9, GREEN) + star4(178, 112, 6, CYAN, 1.2)

def anonymous_access():                                # a blank identity card that still opens the directory
    card = (f'<rect x="60" y="62" width="120" height="78" rx="12" fill="{PANEL}" stroke="{SKY}" stroke-width="3.5"/>'
            f'<g class="march" style="--m:-9"><circle cx="94" cy="92" r="13" {S(INK, 3, "stroke-dasharray=\'4 5\'")}/><path d="M74 128C76 112 112 112 114 128" {S(INK, 3, "stroke-dasharray=\'4 5\'")}/></g>'
            f'<path d="M128 86H166M128 100H156M128 114H162" {S(INK, 3, "stroke-opacity=\'0.5\'")}/>')
    lock = G("pulse", f'<circle cx="172" cy="64" r="17" fill="{BG}" stroke="{GREEN}" stroke-width="3"/><rect x="163" y="62" width="18" height="13" rx="3" fill="{GREEN}"/><path d="M166 62V57A6 6 0 0 1 178 55" {S(GREEN, 3)}/>')
    tree = (f'<path d="M120 140V156M120 156L86 176M120 156V182M120 156L154 176" {S(INK, 2.5, "stroke-opacity=\'0.6\'")}/>'
            + node(86, 176, CYAN, cls="blink") + node(120, 184, GREEN, cls="blink", d=0.4) + node(154, 176, CYAN, cls="blink", d=0.8))
    return tree + card + lock

def crawl_walk_run():                                  # three rising steps; the climb keeps moving up to the window
    steps = "".join(f'<rect x="{56 + i * 42}" y="{146 - i * 26}" width="42" height="{30 + i * 26}" fill="{c}" stroke="{SKY}" stroke-width="3" stroke-linejoin="round"/>'
                    for i, c in enumerate(("#16203A", "#1B2A4A", "#20345C")))
    window = G("pulse", f'<rect x="148" y="52" width="30" height="30" rx="4" fill="{PANEL}" stroke="{INK}" stroke-width="3"/><path d="M163 52V82M148 67H178" {S(INK, 2.5)}/>')
    climb = f'<path class="march" style="--m:-10" d="M58 134C74 112 92 104 104 100C118 96 130 84 142 70" {S(GREEN, 4, "stroke-dasharray=\'1 9\'")}/><path d="M132 70H144V82" {S(GREEN, 4)}/>'
    return steps + climb + window + "".join(f'<circle class="seq" style="animation-delay:{i * 0.5}s" cx="{77 + i * 42}" cy="{138 - i * 26}" r="4" fill="{GREEN}"/>' for i in range(3))

def guardian():                                        # a shield holding a directory graph; one path keeps being traced
    P = {"r": (120, 78), "a": (94, 108), "b": (146, 108), "c": (104, 140), "d": (136, 140), "e": (120, 168)}
    line = lambda a, b, o: f'<path d="M{P[a][0]} {P[a][1]}L{P[b][0]} {P[b][1]}" {S(INK, 2.5, f"stroke-opacity=\'{o}\'")}/>'
    shield = f'<path d="M120 46C138 57 158 62 178 62V114C178 152 152 176 120 190C88 176 62 152 62 114V62C82 62 102 57 120 46Z" fill="{PANEL}" stroke="url(#ring)" stroke-width="4" stroke-linejoin="round"/>'
    path = f'<path class="draw" pathLength="1" d="M120 78L146 108L136 140L120 168" {S(GREEN, 4)}/>'
    return (shield + line("r", "a", 0.45) + line("a", "c", 0.45) + line("c", "e", 0.45) + line("a", "d", 0.25) + path
            + "".join(node(*P[k], GREEN if k in "rbde" else DIM, cls="pulse" if k in "rbde" else "", d="rbde".find(k) * 0.35) for k in P))

def white_belt():                                      # a tied white belt, its ends swaying, over the start of a tree
    tree = (f'<path d="M120 58V74M120 74L94 88M120 74L146 88" {S(SKY, 2.5, "stroke-opacity=\'0.7\'")}/>'
            + node(120, 56, SKY, 5, "blink") + node(94, 90, SKY, 5, "blink", 0.4) + node(146, 90, SKY, 5, "blink", 0.8))
    left = G("sway", f'<polygon points="108,128 86,182 104,188 122,134" fill="{INK}" stroke="{DIM}" stroke-width="2.5" stroke-linejoin="round"/><path d="M90 172L107 178" {S(DIM, 2.5)}/>', "transform-origin:115px 130px")
    right = G("sway", f'<polygon points="132,128 154,182 136,188 118,134" fill="#D7DDEA" stroke="{DIM}" stroke-width="2.5" stroke-linejoin="round"/><path d="M150 172L133 178" {S(DIM, 2.5)}/>', "transform-origin:125px 130px;animation-delay:-1.1s")
    band = (f'<rect x="46" y="106" width="148" height="26" rx="7" fill="{INK}" stroke="{DIM}" stroke-width="2.5"/>'
            f'<path d="M56 113H100M140 113H184M56 125H100M140 125H184" {S(DIM, 1.5, "stroke-dasharray=\'5 4\'")}/>')
    knot = f'<rect x="104" y="103" width="32" height="32" rx="7" transform="rotate(45 120 119)" fill="#D7DDEA" stroke="{DIM}" stroke-width="2.5"/><path d="M110 119H130" {S(DIM, 2.5)}/>'
    return tree + left + right + band + knot

def apple():                                           # a whole green apple with a shell prompt; the cursor blinks, the leaf stirs
    body = f'<path d="M120 86C104 70 68 76 66 114C64 150 92 182 108 178C114 176 126 176 132 178C148 182 176 150 174 114C172 76 136 70 120 86Z" fill="url(#leaf)" stroke="{BG}" stroke-width="2"/>'
    shine = '<ellipse cx="92" cy="106" rx="9" ry="18" transform="rotate(24 92 106)" fill="#FFFFFF" fill-opacity="0.22"/>'
    leaf = G("sway", f'<path d="M131 62C144 50 160 52 166 60C154 72 140 72 131 62Z" fill="{CYAN}" stroke="{BG}" stroke-width="2"/><path d="M134 62C144 58 154 58 162 60" {S(BG, 1.5, "stroke-opacity=\'0.5\'")}/>', "transform-origin:131px 62px")
    return body + shine + f'<path d="M120 86C120 74 124 64 130 56" {S(DIM, 5)}/>' + leaf + f'<path d="M96 118L112 132L96 146" {S(BG, 7)}/><path class="cursor" d="M120 148H144" {S(BG, 7)}/>'

def philomath():                                       # a bulb that glows over a stack of books
    rays = "".join(f'<path class="blink" style="animation-delay:{i * 0.25}s" d="M{pt(50, a, 120, 92)[0]:.1f} {pt(50, a, 120, 92)[1]:.1f}L{pt(60, a, 120, 92)[0]:.1f} {pt(60, a, 120, 92)[1]:.1f}" {S(CYAN, 3.5)}/>' for i, a in enumerate((-150, -120, -90, -60, -30)))
    bulb = (f'<circle class="glow" cx="120" cy="92" r="46" fill="url(#glow)"/><path d="M96 110A32 32 0 1 1 144 110C140 116 136 120 136 128H104C104 120 100 116 96 110Z" fill="{PANEL}" stroke="{INK}" stroke-width="3.5" stroke-linejoin="round"/>'
            f'<g class="glow"><path d="M106 100L113 88L120 100L127 88L134 100" {S(GREEN, 3.5)}/><path d="M113 100V128M127 100V128" {S(GREEN, 2, "stroke-opacity=\'0.6\'")}/></g>'
            f'<rect x="106" y="128" width="28" height="8" rx="3" fill="{DIM}"/><rect x="110" y="138" width="20" height="6" rx="3" fill="{DIM}"/>')
    book = lambda x, y, w, c: f'<rect x="{x}" y="{y}" width="{w}" height="13" rx="3" fill="{c}" stroke="{BG}" stroke-width="2"/><path d="M{x + 10} {y + 2}V{y + 11}M{x + w - 14} {y + 6.5}H{x + w - 6}" {S(BG, 2, "stroke-opacity=\'0.55\'")}/>'
    return rays + bulb + book(78, 152, 84, VIOLET) + book(86, 166, 76, SKY) + book(74, 180, 92, GREEN)

def superior_intelligence():                           # a small neural network; signals keep running through it
    cols = [(70, (92, 124, 156)), (120, (76, 108, 140, 172)), (170, (92, 124, 156))]
    edges = "".join(f'<path d="M{x0} {y0}L{x1} {y1}" {S(INK, 1.5, "stroke-opacity=\'0.2\'")}/>' for (x0, a), (x1, b) in zip(cols, cols[1:]) for y0 in a for y1 in b)
    lit = (f'<path class="draw" pathLength="1" d="M70 124L120 108L170 92" {S(GREEN, 4)}/>'
           f'<path class="draw" pathLength="1" style="animation-delay:-1.7s" d="M70 156L120 108L170 124" {S(CYAN, 3, "stroke-opacity=\'0.8\'")}/>')
    nodes = "".join(node(x, y, CYAN, 8) for x, ys in cols for y in ys) + f'<circle class="pulse" cx="120" cy="108" r="9" fill="{GREEN}"/><circle class="pulse" style="animation-delay:.6s" cx="170" cy="92" r="9" fill="{GREEN}"/>'
    return edges + lit + nodes + star4(120, 48, 10, AMBER)

def synthetic_intelligence():                          # a chip with a shield at its core, its traces lighting in turn
    pins = "".join(f'<path d="M{a} 70V84M{a} 156V170M70 {a}H84M156 {a}H170" {S(INK, 3.5)}/>' for a in (100, 120, 140))
    traces = (f'<path d="M120 70V56L138 46M170 120H184L192 132M120 170V186L104 194M70 120H56L48 108" {S(VIOLET, 2.5)}/>'
              + "".join(f'<circle class="blink" style="animation-delay:{i * 0.6}s" cx="{x}" cy="{y}" r="4.5" fill="{VIOLET}"/>' for i, (x, y) in enumerate(((138, 46), (192, 132), (104, 194), (48, 108)))))
    chip = f'<rect x="84" y="84" width="72" height="72" rx="12" fill="{PANEL}" stroke="{CYAN}" stroke-width="3.5"/><rect x="94" y="94" width="52" height="52" rx="7" {S(CYAN, 1.5, "stroke-opacity=\'0.4\'")}/>'
    core = G("pulse", f'<path d="M120 102C126 106 132 107 138 107V122C138 132 130 138 120 142C110 138 102 132 102 122V107C108 107 114 106 120 102Z" fill="{GREEN}"/><path d="M112 121L118 127L129 115" {S(BG, 3.5)}/>')
    return traces + pins + chip + core

def model_breaker():                                   # a cube split by a crack; the bolt flashes, shards drift off
    cube = (f'<polygon points="120,78 166,101 120,124 74,101" fill="#2A3760" stroke="{SKY}" stroke-width="3" stroke-linejoin="round"/>'
            f'<polygon points="74,101 120,124 120,176 74,153" fill="#17203A" stroke="{SKY}" stroke-width="3" stroke-linejoin="round"/>'
            f'<polygon points="166,101 120,124 120,176 166,153" fill="#1E2A4C" stroke="{SKY}" stroke-width="3" stroke-linejoin="round"/>')
    crack = G("flash", f'<path d="M146 90L134 104L148 116L132 134L146 148L134 168" {S(RED, 4.5)}/><path d="M134 104L122 100M132 134L122 138" {S(RED, 3)}/>', "animation-delay:.15s")
    shard = (f'<polygon class="drift" points="172,66 190,76 176,88" fill="#2A3760" stroke="{SKY}" stroke-width="2.5" stroke-linejoin="round"/>'
             f'<polygon class="drift" style="animation-delay:-1.2s" points="184,98 194,104 186,112" fill="#1E2A4C" stroke="{SKY}" stroke-width="2" stroke-linejoin="round"/>')
    bolt = f'<polygon class="flash" points="100,42 84,76 98,74 86,102 118,62 102,64 110,42" fill="{AMBER}" stroke="{BG}" stroke-width="2" stroke-linejoin="round"/>'
    return cube + crack + shard + bolt

def prompt_phantom():                                  # a ghost bobbing inside the chat bubble, blinking, as text is injected
    bubble = f'<path d="M72 58H168A16 16 0 0 1 184 74V132A16 16 0 0 1 168 148H110L84 172V148H72A16 16 0 0 1 56 132V74A16 16 0 0 1 72 58Z" fill="{PANEL}" stroke="{VIOLET}" stroke-width="3.5" stroke-linejoin="round"/>'
    ghost = G("float", f'<path d="M94 136V104A26 26 0 0 1 146 104V136L137 128L128 136L120 128L112 136L103 128Z" fill="{INK}" stroke="{BG}" stroke-width="2" stroke-linejoin="round"/>'
                       f'<ellipse class="eye" cx="111" cy="104" rx="4.5" ry="7" fill="{BG}"/><ellipse class="eye" cx="129" cy="104" rx="4.5" ry="7" fill="{BG}"/><path d="M114 118Q120 123 126 118" {S(BG, 2.5)}/>')
    inject = f'<path class="march" style="--m:-10" d="M188 40L160 68" {S(GREEN, 3.5, "stroke-dasharray=\'2 8\'")}/><path d="M158 56V70H172" {S(GREEN, 3.5)}/>'
    return bubble + ghost + inject + f'<path class="cursor" d="M156 118L164 125L156 132" {S(GREEN, 3.5)}/><path d="M66 78H80" {S(INK, 3, "stroke-opacity=\'0.4\'")}/>'

def output_overdrive():                                # a gauge trembling deep in the red, output spilling over
    c = (120, 122)
    seg = lambda a0, a1, col: f'<path d="{arc(62, a0, a1, *c)}" {S(col, 11).replace("round", "butt", 1)}/>'
    ticks = "".join(f'<path d="M{pt(46, a, *c)[0]:.1f} {pt(46, a, *c)[1]:.1f}L{pt(51, a, *c)[0]:.1f} {pt(51, a, *c)[1]:.1f}" {S(INK, 2, "stroke-opacity=\'0.5\'")}/>' for a in range(180, 361, 20))
    nx, ny = pt(52, -22, *c)
    needle = G("needle", f'<path d="M{c[0]} {c[1]}L{nx:.1f} {ny:.1f}" {S(INK, 5)}/>') + f'<circle cx="{c[0]}" cy="{c[1]}" r="9" fill="{INK}"/><circle cx="{c[0]}" cy="{c[1]}" r="3.5" fill="{BG}"/>'
    rows = [(142, [(70, 22, INK), (96, 30, INK), (130, 18, INK), (152, 24, RED)]), (156, [(78, 30, INK), (112, 16, INK), (132, 34, RED)]), (170, [(90, 20, INK), (114, 40, RED)])]
    out = "".join(f'<rect class="{"cursor" if col == RED else ""}" style="animation-delay:{n * 0.25}s" x="{x}" y="{y}" width="{w}" height="8" rx="4" fill="{col}" fill-opacity="{1 if col == RED else 0.5}"/>' for n, (y, r) in enumerate(rows) for x, w, col in r)
    return seg(180, 238, GREEN) + seg(242, 298, CYAN) + seg(302, 360, RED) + ticks + needle + out

def unwavering_user():                                 # a flickering flame; the week below lights up day by day
    flame = (f'<path class="flick" d="M120 46C136 72 160 86 160 120C160 144 142 160 120 160C98 160 80 144 80 120C80 102 90 92 98 78C104 92 110 94 112 88C114 76 116 60 120 46Z" fill="url(#fire)" stroke="{BG}" stroke-width="2" stroke-linejoin="round"/>'
             f'<path class="flick" style="animation-duration:.9s;animation-direction:reverse" d="M120 96C128 108 138 114 138 130C138 142 130 150 120 150C110 150 102 142 102 130C102 118 112 112 120 96Z" fill="#FFE08A"/>')
    return flame + "".join(f'<circle class="seq" style="animation-delay:{i * 0.3}s" cx="{72 + i * 16}" cy="182" r="5.5" fill="{GREEN}" stroke="{BG}" stroke-width="2"/>' for i in range(7))

def constant_champion():                               # a trophy; its star twinkles and four streak marks light in turn
    cup = G("float", f'<path d="M86 74C62 74 62 108 90 110M154 74C178 74 178 108 150 110" {S(AMBER, 5.5)}/>'
            f'<path d="M86 60H154V96C154 122 140 136 120 136C100 136 86 122 86 96Z" fill="url(#gold)" stroke="{BG}" stroke-width="2" stroke-linejoin="round"/>'
            f'<path d="M98 70V98C98 110 104 118 110 122" {S("#FFF3C4", 4, "stroke-opacity=\'0.6\'")}/>'
            + '<polygon class="tw" points="' + " ".join(f"{pt(13 if i % 2 == 0 else 5.5, -90 + i * 36, 124, 94)[0]:.1f},{pt(13 if i % 2 == 0 else 5.5, -90 + i * 36, 124, 94)[1]:.1f}" for i in range(10)) + f'" fill="{BG}" fill-opacity="0.85"/>'
            + f'<rect x="113" y="136" width="14" height="18" fill="#C98F00"/><rect x="96" y="154" width="48" height="10" rx="3" fill="{AMBER}"/><rect x="88" y="164" width="64" height="10" rx="3" fill="#C98F00"/>',
            "animation-duration:5s")
    return cup + "".join(f'<rect class="seq" style="animation-delay:{i * 0.45}s" x="{93 + i * 15}" y="184" width="10" height="6" rx="3" fill="{GREEN}"/>' for i in range(4))

def cyber_rookie():                                    # one planet circling its sun: a year
    months = "".join(f'<path d="M{pt(72, a)[0]:.1f} {pt(72, a)[1]:.1f}L{pt(79, a)[0]:.1f} {pt(79, a)[1]:.1f}" {S(INK, 2.5, "stroke-opacity=\'0.45\'")}/>' for a in range(0, 360, 30))
    px, py = pt(56, -40)
    planet = f'<circle cx="{px:.1f}" cy="{py:.1f}" r="11" fill="{SKY}" stroke="{BG}" stroke-width="2"/><path d="M{px - 7:.1f} {py + 2:.1f}Q{px:.1f} {py - 6:.1f} {px + 8:.1f} {py - 2:.1f}" {S(GREEN, 3)}/><circle cx="{px + 17:.1f}" cy="{py - 12:.1f}" r="3.5" fill="{INK}"/>'
    lap = f'<circle cx="120" cy="120" r="56" {S(INK, 1.5, "stroke-opacity=\'0.25\' stroke-dasharray=\'3 6\'")}/>' + G("orbit", f'<path d="{arc(56, -30, 300)}" {S("url(#ring)", 4.5)}/>' + planet)
    sun = f'<circle class="glow" cx="120" cy="120" r="34" fill="url(#sun)"/><circle cx="120" cy="120" r="17" fill="{AMBER}"/><circle cx="114" cy="114" r="5" fill="#FFE08A"/>'
    return months + sun + lap

def binary_duo():                                      # two worlds on two orbits, with a little binary
    orbit = lambda rot, c: f'<ellipse cx="120" cy="120" rx="72" ry="30" transform="rotate({rot} 120 120)" {S(c, 3)}/>'
    # x follows a cosine and y a sine (two eased, alternating translations a quarter period apart), which is an ellipse
    world = lambda rot, c, d: (f'<g transform="rotate({rot} 120 120)"><g class="ox" style="animation-delay:{d}s"><g class="oy" style="animation-delay:{d - 2.25}s">'
                               f'<circle cx="192" cy="120" r="10" fill="{c}" stroke="{BG}" stroke-width="2"/><circle cx="189" cy="117" r="3" fill="#FFFFFF" fill-opacity="0.5"/></g></g></g>')
    bits = "".join((f'<circle class="blink" style="animation-delay:{n * 0.4}s" cx="{x}" cy="{y}" r="5" {S(INK, 2.5, "stroke-opacity=\'0.55\'")}/>' if b == "0" else
                    f'<path class="blink" style="animation-delay:{n * 0.4}s" d="M{x} {y - 6}V{y + 6}" {S(INK, 2.5, "stroke-opacity=\'0.55\'")}/>')
                   for n, (x, y, b) in enumerate(((66, 70, "1"), (78, 70, "0"), (166, 172, "0"), (178, 172, "1"), (120, 58, "1"), (120, 184, "0"))))
    core = f'<circle class="glow" cx="120" cy="120" r="26" fill="url(#glow)"/>' + star4(120, 120, 16, INK) + f'<circle cx="120" cy="120" r="4" fill="{BG}"/>'
    return bits + orbit(32, CYAN) + orbit(-32, VIOLET) + core + world(32, GREEN, -3.2) + world(-32, SKY, -7.5)

# ---- KC7: one scene per case, from what the case teaches -------------------------------------------------------
def k_seven_days():                                    # a week of evidence, a lens passing over it
    bars = "".join(f'<rect class="seq" style="animation-delay:{i * 0.3}s" x="{62 + i * 17}" y="{160 - h}" width="11" height="{h}" rx="3" fill="{SKY}"/>' for i, h in enumerate((30, 46, 38, 60, 52, 72, 64)))
    return P("M56 162H184", INK, 3, O5) + bars + magnifier(142, 96, 22, INK, inner=P("M132 96L139 103L152 89", GREEN, 4))

def k_dai_wok():                                       # a bowl still steaming, and a hook lowering a letter into it
    steam = "".join(P(f"M{x} 116C{x - 8} 106 {x + 8} 100 {x} 90", INK, 3, O7, "steam", f"animation-delay:{d}s") for x, d in ((100, 0), (120, 1), (140, 2)))
    bowl = f'<path d="M66 128H174C174 160 152 178 120 178C88 178 66 160 66 128Z" fill="{PANEL}" stroke="{AMBER}" stroke-width="3.5" stroke-linejoin="round"/>' + P("M78 142C92 150 148 150 162 142", AMBER, 2.5, O5)
    hook = G("sway", P("M168 44V74A9 9 0 0 1 150 74V70", INK, 3) + box(138, 78, 34, 24, 4, PANEL, RED, 3) + P("M140 81L155 92L170 81", RED, 2.5), "transform-origin:168px 44px")
    return steam + bowl + P("M72 70L128 126M86 62L136 124", DIM, 4) + hook

def k_rap_beef():                                      # a microphone and levels that will not sit still
    eq = "".join(f'<rect class="eq" style="animation-delay:{d}s" x="{x}" y="{150 - h}" width="9" height="{h}" rx="3" fill="{c}"/>' for x, h, d, c in
                 ((58, 34, 0, VIOLET), (71, 56, 0.3, CYAN), (160, 50, 0.15, CYAN), (173, 30, 0.5, VIOLET)))
    mic = (box(102, 60, 36, 60, 18, PANEL, INK) + P("M110 78H130M110 90H130M110 102H130", INK, 2, O5)
           + P("M90 104C90 142 150 142 150 104M120 134V160M100 162H140", INK, 3.5))
    return eq + mic + star4(164, 62, 9, RED)

def k_titan_shield():                                  # a shield under a moon, sand moving across it
    wind = "".join(P(f"M62 {y}C86 {y - 8} 110 {y + 8} 134 {y}C150 {y - 6} 166 {y + 4} 178 {y}", AMBER, 3, 'stroke-dasharray="14 10"', "march", f"--m:-24;animation-delay:{d}s") for y, d in ((150, 0), (164, 0.5)))
    moon = f'<path class="glow" d="M134 84A26 26 0 1 0 148 130A20 20 0 1 1 134 84Z" fill="{INK}"/>'
    return f'<path d="{shield_d(120, 114, 56)}" fill="{PANEL}" stroke="url(#ring)" stroke-width="4" stroke-linejoin="round"/>' + moon + wind + star4(96, 92, 5, INK, 0.8)

def k_hops():                                          # a mug with a shell prompt on it, bubbles still rising
    bubbles = "".join(dot(x, 74, r, INK, "steam", d) for x, r, d in ((96, 4, 0), (116, 5, 1.1), (132, 3.5, 2)))
    mug = box(76, 92, 70, 78, 10, PANEL, AMBER) + P("M146 108C172 108 172 152 146 152", AMBER, 3.5)
    foam = "".join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{INK}" stroke="{BG}" stroke-width="2"/>' for x, y, r in ((88, 92, 12), (110, 86, 14), (134, 92, 12)))
    return bubbles + mug + foam + P("M90 122L104 133L90 144", GREEN, 5) + P("M110 146H132", GREEN, 5, cls="cursor")

def k_crab():                                          # a crab, claws working
    legs = "".join(P(f"M{120 + s * 30} {132 + i * 8}L{120 + s * 54} {142 + i * 12}", RED, 4) for s in (-1, 1) for i in range(3))
    claw = lambda s, d: G("snap", P(f"M{120 + s * 32} 122L{120 + s * 54} 100", RED, 5) + f'<circle cx="{120 + s * 60}" cy="90" r="14" fill="{RED}" stroke="{BG}" stroke-width="2"/>'
                          f'<polygon points="{120 + s * 60},90 {120 + s * 78},74 {120 + s * 66},70" fill="{BG}"/>', f"transform-origin:{120 + s * 32}px 122px;animation-delay:{d}s")
    body = f'<ellipse cx="120" cy="136" rx="40" ry="26" fill="{RED}" stroke="{BG}" stroke-width="2"/>' + P("M100 146Q120 156 140 146", BG, 3, O5)
    eyes = "".join(P(f"M{x} 114V98", RED, 4) + f'<circle cx="{x}" cy="94" r="7" fill="{INK}"/><circle class="eye" cx="{x}" cy="94" r="3" fill="{BG}"/>' for x in (108, 132))
    return legs + claw(-1, 0) + claw(1, -0.5) + body + eyes

def k_envolve():                                       # a flask bubbling around a key
    glass = f'<path d="M108 58V96L78 160C74 170 80 180 92 180H148C160 180 166 170 162 160L132 96V58Z" fill="{PANEL}" stroke="{CYAN}" stroke-width="3.5" stroke-linejoin="round"/>'
    liquid = f'<path d="M92 132H148L160 160C164 170 158 178 148 178H92C82 178 76 170 80 160Z" fill="{GREEN}" fill-opacity="0.45"/>'
    key = G("float", f'<circle cx="108" cy="158" r="7" {S(INK, 3)}/>' + P("M115 158H138M130 158V165M137 158V164", INK, 3), "animation-duration:3s")
    bubbles = "".join(dot(x, y, r, INK, "steam", d) for x, y, r, d in ((112, 124, 3.5, 0), (126, 116, 4.5, 1), (120, 100, 3, 2)))
    return glass + liquid + P("M100 58H140", CYAN, 5) + key + bubbles

def k_castle():                                        # a sandcastle with a lock on the gate, the tide coming in
    tower = lambda x, y, h: box(x, y, 24, h, 2, PANEL, AMBER, 3) + P(f"M{x} {y}V{y - 8}H{x + 7}V{y}M{x + 17} {y}V{y - 8}H{x + 24}V{y}", AMBER, 3)
    flag = G("sway", P("M120 80V58", INK, 3) + f'<polygon points="120,58 138,64 120,70" fill="{RED}"/>', "transform-origin:120px 80px")
    sand = f'<path d="M50 172C80 156 160 156 190 172V178H50Z" fill="{AMBER}" fill-opacity="0.75"/>'
    gate = f'<path d="M112 164V146A8 8 0 0 1 128 146V164Z" fill="{BG}" stroke="{AMBER}" stroke-width="2.5"/>' + padlock(120, 130, RED)
    tide = P("M20 188Q34 180 48 188T76 188T104 188T132 188T160 188T188 188T216 188T244 188", SKY, 3.5, cls="wave")
    return tower(82, 108, 58) + tower(138, 108, 58) + tower(108, 88, 78) + flag + sand + gate + tide

def k_balloons():                                      # three balloons tethered to a beacon that keeps calling home
    b = lambda x, y, c, d: G("float", P(f"M{x} {y + 22}Q{x + (120 - x) * 0.3} {y + 60} 120 172", INK, 2, O5)
                             + f'<ellipse cx="{x}" cy="{y}" rx="18" ry="22" fill="{c}" stroke="{BG}" stroke-width="2"/><ellipse cx="{x - 6}" cy="{y - 8}" rx="4" ry="7" fill="#FFFFFF" fill-opacity="0.35"/>'
                             f'<polygon points="{x - 4},{y + 22} {x + 4},{y + 22} {x},{y + 28}" fill="{c}"/>', f"animation-delay:{d}s")
    beacon = box(98, 164, 44, 20, 5, PANEL, INK, 3) + dot(110, 174, 3.5, GREEN, "blink") + P("M120 174H134", INK, 2.5, O5)
    return b(88, 92, RED, 0) + b(152, 96, GREEN, -1.3) + b(120, 74, SKY, -2.6) + beacon

def k_valdorian():                                     # a front page, and a megaphone pushing one story
    page = box(60, 62, 88, 116, 6, INK, DIM, 2.5) + f'<rect x="68" y="70" width="72" height="13" fill="{BG}"/><rect x="68" y="92" width="32" height="28" fill="{DIM}"/>'
    lines = "".join(P(d, BG, 3, O5) for d in ("M108 94H140", "M108 104H140", "M108 114H132", "M68 130H140", "M68 140H140", "M68 150H124", "M68 160H136"))
    horn = f'<polygon points="140,140 176,122 176,172 140,154" fill="{VIOLET}" stroke="{BG}" stroke-width="2" stroke-linejoin="round"/>' + box(130, 138, 12, 18, 3, VIOLET, BG, 2)
    waves = "".join(P(f"M{184 + i * 8} {134 - i * 6}Q{192 + i * 10} 147 {184 + i * 8} {160 + i * 6}", VIOLET, 3.5, cls="blink", style=f"animation-delay:{i * 0.35}s") for i in range(2))
    return page + lines + horn + waves

# ---- OffSec learning badges ------------------------------------------------------------------------------------
def o_lateral_matrix():                                # a technique matrix; one cell keeps stepping sideways
    cells = "".join(box(66 + c * 30, 70 + r * 24, 22, 16, 4, PANEL, INK, 2, O3) for r in range(4) for c in range(4))
    return cells + f'<rect class="hop" x="66" y="94" width="22" height="16" rx="4" fill="{GREEN}"/>' + P("M70 172H164M154 164L164 172L154 180", GREEN, 3.5)

def o_resource():                                      # building blocks; the last one keeps being set in place
    blk = lambda x, y, c, cls="": f'<rect class="{cls}" x="{x}" y="{y}" width="36" height="30" rx="5" fill="{c}" stroke="{SKY}" stroke-width="3"/>'
    return blk(66, 132, "#17203A") + blk(102, 132, "#1E2A4C") + blk(138, 132, "#17203A") + blk(84, 102, "#20345C") + blk(120, 102, "#2A3760") + blk(102, 72, "#2A3760", "drop") + gear(160, 82, 16, AMBER)

def o_soc():                                           # a console watching one signal, an alert waiting
    return (box(60, 66, 120, 78, 9, PANEL, CYAN) + P("M72 106H96L104 86L116 126L124 106H168", GREEN, 3.5, 'pathLength="1"', "draw")
            + P("M120 144V158M98 160H142", CYAN, 3.5) + dot(168, 78, 5, RED, "cursor") + P("M72 132H110", INK, 2.5, O3))

# ---- OffSec skill-path pins ------------------------------------------------------------------------------------
def p_enumeration():                                   # a list being counted off under a lens
    rows = "".join(box(66, y - 7, 14, 14, 3, PANEL, INK, 2.5, f'class="seq" style="animation-delay:{i * 0.4}s"') + P(f"M90 {y}H{150 - (i % 2) * 14}", INK, 3, O5) for i, y in enumerate((82, 104, 126, 148)))
    return rows + magnifier(146, 118, 20, GREEN)

def p_idor():                                          # two records, one request that reaches the wrong one
    a = doc(62, 78, 44, 56, INK) + P("M70 100H96M70 112H90", INK, 2.5, O5) + padlock(84, 150, GREEN)
    b = doc(134, 78, 44, 56, RED) + P("M142 100H168M142 112H162", RED, 2.5, O5) + padlock(156, 150, RED, True)
    return a + G("blink", b) + P("M88 70Q120 44 152 70", GREEN, 3.5, 'stroke-dasharray="3 8"', "march", "--m:-11") + P("M144 60L153 70L141 74", GREEN, 3.5)

def p_lateral():                                       # three machines; the foothold moves along the row
    arcs = "".join(P(f"M{x} 96Q{x + 25} 62 {x + 50} 96", GREEN, 3.5, 'stroke-dasharray="3 8"', "march", "--m:-11") for x in (70, 120))
    return arcs + host(70, 118, GREEN) + host(120, 118, AMBER, cls="blink", d=0.4) + host(170, 118, RED, "#3A1410", "blink", 0.8) + dot(70, 118, 4, GREEN)

def p_xxe():                                           # markup that hands a file back out
    return (P("M92 82L66 118L92 154", INK, 6) + P("M148 82L174 118L148 154", INK, 6)
            + G("float", doc(106, 96, 28, 36, AMBER) + P("M112 112H128M112 122H124", AMBER, 2.5, O7), "animation-duration:2.6s")
            + P("M120 86V58", GREEN, 3.5, 'stroke-dasharray="3 7"', "march", "--m:-10") + P("M112 66L120 58L128 66", GREEN, 3.5))

def p_vuln():                                          # a scan line passing over something that should not be there
    legs = "".join(P(f"M{120 + s * 22} {110 + i * 14}L{120 + s * 40} {104 + i * 18}", RED, 3.5) for s in (-1, 1) for i in range(3))
    bug = legs + f'<ellipse cx="120" cy="122" rx="22" ry="30" fill="{PANEL}" stroke="{RED}" stroke-width="3.5"/>' + P("M120 96V150M110 92L102 80M130 92L138 80", RED, 3)
    frame = P("M64 80V68H76M164 68H176V80M176 160V172H164M76 172H64V160", INK, 3.5)
    return bug + frame + f'<path class="scan" d="M58 120H182" {S(GREEN, 3.5)}/>'

def p_user():                                          # an account, and the gear that changes what it may do
    user = f'<circle cx="104" cy="94" r="18" fill="{PANEL}" stroke="{INK}" stroke-width="3.5"/><path d="M70 160C72 130 136 130 138 160Z" fill="{PANEL}" stroke="{INK}" stroke-width="3.5" stroke-linejoin="round"/>'
    return user + gear(152, 138, 22, SKY) + P("M150 70V90M140 80H160", GREEN, 4, cls="blink")

def p_ssrf():                                          # a request the server forwards to a place the sender cannot reach
    inner = box(146, 96, 38, 48, 6, PANEL, RED, 3, 'stroke-dasharray="5 4"') + padlock(165, 124, RED)
    server = box(100, 82, 38, 76, 6, PANEL, SKY) + dot(110, 96, 3, GREEN, "blink") + P("M118 96H130M108 112H130M108 126H130", SKY, 2.5, O5)
    return (box(56, 100, 34, 40, 6, PANEL, INK, 3) + P("M64 114H82M64 124H76", INK, 2.5, O5) + server + inner
            + P("M90 120H100", GREEN, 3.5) + P("M138 108Q146 86 160 96", RED, 3.5, 'stroke-dasharray="3 6"', "march", "--m:-9") + P("M152 90L161 96L153 103", RED, 3))

def p_ad_pentest():                                    # a domain tree with a path walked up to the root
    N = {"r": (120, 70), "a": (88, 110), "b": (152, 110), "c": (70, 152), "d": (104, 152), "e": (136, 152), "f": (170, 152)}
    e = "".join(P(f"M{N[a][0]} {N[a][1]}L{N[b][0]} {N[b][1]}", INK, 2.5, O3) for a, b in ("ra", "rb", "ac", "ad", "be", "bf"))
    cross = G("spin", f'<circle cx="120" cy="70" r="17" {S(RED, 3)}/>' + P("M120 46V56M120 84V94M96 70H106M134 70H144", RED, 3))
    return e + P("M136 152L152 110L120 70", GREEN, 4, 'pathLength="1"', "draw") + "".join(node(*N[k], GREEN if k in "rbe" else DIM) for k in N) + cross

# ---- certifications --------------------------------------------------------------------------------------------
def c_osda():                                          # defence: a shield with a sweep always turning inside it
    sweep = G("rot", P("M120 122L120 88", GREEN, 3.5), "transform-origin:120px 122px;animation-duration:4s")
    return (f'<path d="{shield_d(120, 114, 54)}" fill="{PANEL}" stroke="url(#ring)" stroke-width="4" stroke-linejoin="round"/>'
            + f'<circle cx="120" cy="122" r="34" {S(GREEN, 2, O3)}/><circle cx="120" cy="122" r="18" {S(GREEN, 2, O3)}/>' + sweep + dot(138, 110, 4, GREEN, "blink") + dot(120, 122, 4, GREEN))

def c_oswa():                                          # the web, assessed: a browser with a target turning on the page
    win = box(58, 66, 124, 104, 10, PANEL, SKY) + P("M58 88H182", SKY, 3) + "".join(dot(70 + i * 11, 77, 3, c) for i, c in enumerate((RED, AMBER, GREEN))) + P("M108 77H170", INK, 3, O3)
    target = G("spin", f'<circle cx="120" cy="130" r="20" {S(RED, 3)}/>' + P("M120 102V114M120 146V158M92 130H104M136 130H148", RED, 3), "animation-duration:9s")
    return win + target + dot(120, 130, 4.5, RED, "blink") + P("M70 104H96M70 156H92", INK, 2.5, O3)

def c_rhce():                                          # an engineer's badge: gears that drive each other, a playbook running
    return gear(98, 108, 32, RED, "spin") + gear(150, 142, 22, INK, "spinr") + "".join(P(f"M140 {y}H{176 - i * 8}", GREEN, 3, cls="seq", style=f"animation-delay:{i * 0.4}s") for i, y in enumerate((72, 84, 96)))

def c_rhcsa():                                         # a root shell, waiting
    win = box(56, 66, 128, 108, 10, PANEL, INK) + P("M56 88H184", INK, 3, O5) + "".join(dot(68 + i * 11, 77, 3, DIM) for i in range(3))
    hash_ = P("M72 108V132M84 108V132M66 114H90M66 126H90", RED, 3.5)
    return win + hash_ + f'<rect class="cursor" x="100" y="108" width="12" height="24" rx="2" fill="{GREEN}"/>' + P("M68 148H150M68 160H124", INK, 2.5, O3)

def c_accredited():                                    # a medal on a ribbon
    tail = lambda pts, c, d: G("sway", f'<polygon points="{pts}" fill="{c}" stroke="{BG}" stroke-width="2" stroke-linejoin="round"/>', f"transform-origin:120px 120px;animation-delay:{d}s")
    star = " ".join(f"{pt(15 if i % 2 == 0 else 6.5, -90 + i * 36, 120, 102)[0]:.1f},{pt(15 if i % 2 == 0 else 6.5, -90 + i * 36, 120, 102)[1]:.1f}" for i in range(10))
    return (tail("100,122 86,178 104,168 116,182 124,126", RED, 0) + tail("140,122 154,178 136,168 124,182 116,126", "#C23A1E", -1.2)
            + f'<circle cx="120" cy="102" r="36" fill="url(#gold)" stroke="{BG}" stroke-width="2"/><circle cx="120" cy="102" r="27" {S(BG, 2, O3)}/><polygon class="tw" points="{star}" fill="{BG}" fill-opacity="0.85"/>')

def c_aws():                                           # an architect's sketch: a cloud feeding three services
    cloud = f'<path d="M88 108A20 20 0 0 1 92 68A28 28 0 0 1 146 62A23 23 0 0 1 150 108Z" fill="{PANEL}" stroke="{AMBER}" stroke-width="3.5" stroke-linejoin="round"/>'
    links = "".join(P(f"M120 108V124L{x} 140V148", AMBER, 2.5, 'stroke-dasharray="3 6"', "march", f"--m:-9;animation-delay:{d}s") for x, d in ((80, 0), (120, 0.3), (160, 0.6)))
    return cloud + links + "".join(box(x - 16, 148, 32, 24, 5, PANEL, INK, 3) + dot(x - 6, 160, 3, GREEN, "blink", i * 0.4) + P(f"M{x} 160H{x + 9}", INK, 2.5, O5) for i, x in enumerate((80, 120, 160)))

def c_splunk_power():                                  # search with power: a pipeline ending in a chart that keeps climbing
    bars = "".join(f'<rect class="eq" style="animation-delay:{i * 0.2}s" x="{84 + i * 20}" y="{164 - h}" width="13" height="{h}" rx="3" fill="{c}"/>' for i, (h, c) in enumerate(((28, VIOLET), (44, VIOLET), (58, CYAN), (76, GREEN))))
    return box(58, 62, 124, 26, 13, PANEL, INK, 3) + P("M70 70L78 75L70 80", GREEN, 3.5) + P("M88 75H128M140 68V82", INK, 3, O5) + P("M148 75H170", GREEN, 3, cls="cursor") + bars + P("M72 166H176", INK, 3, O5) + star4(72, 116, 8, AMBER)

def c_splunk_core():                                   # search: events scrolling by, one line caught
    rows = "".join(P(f"M70 {y}H{170 - (i * 23) % 40}", INK, 3, O3) for i, y in enumerate((104, 118, 132, 146, 160)))
    return box(58, 62, 124, 26, 13, PANEL, INK, 3) + P("M70 70L78 75L70 80", GREEN, 3.5) + P("M88 75H150", INK, 3, O5) + rows + f'<rect class="scan" x="62" y="125" width="116" height="14" rx="4" fill="{GREEN}" fill-opacity="0.28" stroke="{GREEN}" stroke-width="2"/>'

def c_splunk_fund():                                   # the basics: data in a store, and the first line drawn from it
    cyl = (f'<path d="M84 136V164C84 172 100 178 120 178C140 178 156 172 156 164V136" fill="{PANEL}" stroke="{VIOLET}" stroke-width="3.5"/>'
           f'<ellipse cx="120" cy="136" rx="36" ry="11" fill="{PANEL}" stroke="{VIOLET}" stroke-width="3.5"/>' + P("M84 150C84 158 100 164 120 164C140 164 156 158 156 150", VIOLET, 2.5, O5))
    return cyl + P("M66 112L92 92L112 104L140 72L172 84", GREEN, 4, 'pathLength="1"', "draw") + "".join(dot(x, y, 4.5, GREEN, "blink", i * 0.3) for i, (x, y) in enumerate(((92, 92), (140, 72), (172, 84))))

# ---- degrees and academic programmes ---------------------------------------------------------------------------
def a_mscs():                                          # a master's in computer science: the cap over a pair of braces
    brace = lambda s: P(f"M{120 + s * 30} 110C{120 + s * 44} 110 {120 + s * 34} 140 {120 + s * 48} 140C{120 + s * 34} 140 {120 + s * 44} 170 {120 + s * 30} 170", CYAN, 4.5)
    return brace(-1) + brace(1) + star4(120, 140, 13, AMBER) + cap(120, 76) + star4(66, 96, 6, GREEN, 1)

def a_btech():                                         # a degree in information technology: a scroll, sealed, traces running into it
    traces = "".join(P(f"M{x} 62V84", SKY, 2.5) + dot(x, 60, 4, SKY, "blink", i * 0.4) for i, x in enumerate((92, 120, 148)))
    scroll = box(60, 88, 120, 62, 8, INK, DIM, 2.5) + "".join(P(d, BG, 3, O5) for d in ("M74 104H166", "M74 116H166", "M74 128H132")) + f'<circle cx="60" cy="119" r="9" fill="{DIM}"/><circle cx="180" cy="119" r="9" fill="{DIM}"/>'
    seal = G("sway", f'<polygon points="146,150 140,178 152,170 164,178 158,150" fill="{RED}" stroke="{BG}" stroke-width="2" stroke-linejoin="round"/>', "transform-origin:152px 150px") + f'<circle class="pulse" cx="152" cy="142" r="13" fill="url(#gold)" stroke="{BG}" stroke-width="2"/>'
    return traces + scroll + seal

def a_hbs():                                           # business fundamentals: columns rising under a line that keeps being drawn
    bars = "".join(f'<rect class="eq" style="animation-delay:{i * 0.25}s;animation-duration:2.2s" x="{72 + i * 26}" y="{166 - h}" width="17" height="{h}" rx="3" fill="{c}"/>' for i, (h, c) in enumerate(((30, SKY), (46, SKY), (60, CYAN), (80, GREEN))))
    return bars + P("M62 168H180", INK, 3, O5) + P("M66 122L96 104L122 112L168 66", AMBER, 4, 'pathLength="1"', "draw") + P("M152 66H168V82", AMBER, 4) + f'<circle class="glow" cx="80" cy="76" r="13" fill="url(#gold)" stroke="{BG}" stroke-width="2"/>'

def a_bgu():                                           # a summer of security and machine learning in the desert
    rays = "".join(P(f"M{pt(40, a, 120, 142)[0]:.1f} {pt(40, a, 120, 142)[1]:.1f}L{pt(50, a, 120, 142)[0]:.1f} {pt(50, a, 120, 142)[1]:.1f}", AMBER, 3.5, cls="blink", style=f"animation-delay:{i * 0.2}s") for i, a in enumerate(range(-160, -10, 28)))
    sun = f'<circle class="glow" cx="120" cy="142" r="42" fill="url(#sun)"/><circle cx="120" cy="142" r="26" fill="{AMBER}"/>'
    dunes = f'<path d="M10 152C60 126 104 150 132 142C170 132 200 150 230 140V230H10Z" fill="#3A2C10"/><path d="M10 172C70 150 130 176 230 156V230H10Z" fill="#231A08"/>'
    net = P("M88 84L120 66L152 84M120 66V96M88 84L120 96L152 84", CYAN, 2.5, O5) + "".join(node(x, y, CYAN, 6, "blink", i * 0.35) for i, (x, y) in enumerate(((88, 84), (120, 66), (152, 84), (120, 96))))
    return rays + sun + dunes + net

REGISTRY = [  # family, file slug, name in achievements.yml, post it belongs to (file name after the date) or None, tint, scene
 ("htb", "academician", "Academician", "htb-academician", VIOLET, academician), ("htb", "anonymous-access", "Anonymous Access", "htb-anonymous-access", SKY, anonymous_access),
 ("htb", "crawl-walk-run", "Crawl, walk, run", "htb-crawl-walk-run", SKY, crawl_walk_run), ("htb", "the-guardian-of-active-directory", "The guardian of Active Directory", "htb-the-guardian-of-active-directory", GREEN, guardian),
 ("htb", "your-white-belt-training-begins", "Your white belt training begins", "htb-your-white-belt-training-begins", SKY, white_belt), ("htb", "an-apple-a-day", "An apple a day...", "htb-an-apple-a-day", GREEN, apple),
 ("htb", "philomath", "Philomath", "htb-philomath", CYAN, philomath), ("htb", "superior-intelligence", "Superior Intelligence", "htb-superior-intelligence", CYAN, superior_intelligence),
 ("htb", "synthetic-intelligence", "Synthetic Intelligence", "htb-synthetic-intelligence", VIOLET, synthetic_intelligence), ("htb", "model-breaker", "Model breaker", "htb-model-breaker", RED, model_breaker),
 ("htb", "prompt-phantom", "Prompt phantom", "htb-prompt-phantom", VIOLET, prompt_phantom), ("htb", "output-overdrive", "Output Overdrive", "htb-output-overdrive", RED, output_overdrive),
 ("htb", "unwavering-user", "Unwavering User", "htb-unwavering-user", AMBER, unwavering_user), ("htb", "constant-champion", "Constant Champion", "htb-constant-champion", AMBER, constant_champion),
 ("htb", "cyber-rookie-365", "Cyber Rookie 365", "htb-cyber-rookie-365", AMBER, cyber_rookie), ("htb", "binary-duo-explorer", "Binary Duo Explorer", "htb-binary-duo-explorer", CYAN, binary_duo),
 ("kc7", "7-total-days", "7 Total Days", "kc7-7-total-days", SKY, k_seven_days), ("kc7", "dai-wok-foods", "Dai Wok Foods", "kc7-dai-wok-foods", AMBER, k_dai_wok),
 ("kc7", "rap-beef", "Rap Beef", "kc7-rap-beef", VIOLET, k_rap_beef), ("kc7", "titan-shield", "Titan Shield", "kc7-titan-shield", CYAN, k_titan_shield),
 ("kc7", "hopsnstuff", "HopsNStuff", "kc7-hopsnstuff", AMBER, k_hops), ("kc7", "krusty-krab", "Krusty Krab", "kc7-krusty-krab", RED, k_crab),
 ("kc7", "envolve-labs", "Envolve Labs", "kc7-envolve-labs", GREEN, k_envolve), ("kc7", "castle-sand", "Castle & Sand", "kc7-castle-sand", AMBER, k_castle),
 ("kc7", "balloons-over-iowa", "Balloons Over Iowa", "kc7-balloons-over-iowa", SKY, k_balloons), ("kc7", "valdorian-times", "Valdorian Times", "kc7-valdorian-times", VIOLET, k_valdorian),
 ("offsec", "badge-mitre-attack-lateral-movement", "MITRE ATT&CK · Lateral Movement", "offsec-badge-mitre-attack-lateral-movement", GREEN, o_lateral_matrix),
 ("offsec", "badge-mitre-attack-resource-development", "MITRE ATT&CK · Resource Development", "offsec-badge-mitre-attack-resource-development", SKY, o_resource),
 ("offsec", "badge-security-operations-essentials", "Security Operations Essentials", "offsec-badge-security-operations-essentials", CYAN, o_soc),
 ("offsec", "pin-enumeration", "Enumeration", "offsec-pin-enumeration", GREEN, p_enumeration), ("offsec", "pin-idor-attacks", "IDOR Attacks", "offsec-pin-idor-attacks", RED, p_idor),
 ("offsec", "pin-lateral-movement", "Lateral Movement", "offsec-pin-lateral-movement", AMBER, p_lateral), ("offsec", "pin-xxe-attacks", "XXE Attacks", "offsec-pin-xxe-attacks", AMBER, p_xxe),
 ("offsec", "pin-vulnerability-detection", "Vulnerability Detection", "offsec-pin-vulnerability-detection", RED, p_vuln), ("offsec", "pin-user-account-management", "User Account Management", "offsec-pin-user-account-management", SKY, p_user),
 ("offsec", "pin-ssrf-attacks", "SSRF Attacks", "offsec-pin-ssrf-attacks", RED, p_ssrf), ("offsec", "pin-ad-penetration-testing", "AD Penetration Testing", "offsec-pin-ad-penetration-testing", GREEN, p_ad_pentest),
 ("certs", "osda", "OSDA", None, GREEN, c_osda), ("certs", "oswa", "OSWA", None, SKY, c_oswa), ("certs", "rhce", "RHCE", None, RED, c_rhce), ("certs", "rhcsa", "RHCSA", None, RED, c_rhcsa),
 ("certs", "red-hat-accredited-professional", "Accredited Professional", None, AMBER, c_accredited), ("certs", "aws-csa", "AWS CSA", None, AMBER, c_aws),
 ("certs", "splunk-power-user", "Power User", None, VIOLET, c_splunk_power), ("certs", "splunk-core-user", "Core User", None, GREEN, c_splunk_core), ("certs", "splunk-fundamentals", "Fundamentals", None, VIOLET, c_splunk_fund),
 ("academic", "mscs-ncsu", "MSCS · NCSU", None, VIOLET, a_mscs), ("academic", "btech-it-mpstme", "B.Tech IT · MPSTME", None, SKY, a_btech),
 ("academic", "hbs-core", "HBS CORe", None, AMBER, a_hbs), ("academic", "bgu-icsml", "BGU ICSML", None, AMBER, a_bgu),
]
SHAPE = {"htb": "ring", "kc7": "hex", "certs": "seal", "academic": "tile"}   # offsec: shield for learning badges, pin for skill pins

def frame(family, slug, tint, scene):
    kind = SHAPE.get(family) or ("pin" if slug.startswith("pin-") else "shield")
    hexpts = lambda r: " ".join(f"{pt(r, a)[0]:.1f},{pt(r, a)[1]:.1f}" for a in range(-90, 270, 60))
    gradient = f'stroke="url(#ring)" stroke-linejoin="round" stroke-linecap="round"'
    if kind == "ring":
        back, clip, reach, lift = '<circle cx="120" cy="120" r="100"', '<circle cx="120" cy="120" r="98"/>', 92, 0
        deco = G("rot", "".join(f'<path d="{arc(109, a, a + 96)}" {S("url(#ring)", 5)}/>' for a in (-78, 42, 162))
                 + "".join(f'<circle cx="{pt(109, a)[0]:.1f}" cy="{pt(109, a)[1]:.1f}" r="5" fill="{BG}" stroke="{c}" stroke-width="3"/>' for a, c in ((-90, VIOLET), (30, CYAN), (150, GREEN))))
        edge = f'<circle cx="120" cy="120" r="100" fill="none" stroke="{INK}" stroke-opacity="0.14" stroke-width="1.5"/>'
    elif kind == "hex":
        back, clip, reach, lift = f'<polygon points="{hexpts(106)}"', f'<polygon points="{hexpts(104)}"/>', 78, 0
        deco = "".join(f'<circle class="seq" style="animation-delay:{i * 0.6}s" cx="{pt(106, a)[0]:.1f}" cy="{pt(106, a)[1]:.1f}" r="6" fill="{BG}" stroke="{(VIOLET, CYAN, GREEN)[i % 3]}" stroke-width="3"/>' for i, a in enumerate(range(-90, 270, 60)))
        edge = f'<polygon points="{hexpts(106)}" fill="none" {gradient} stroke-width="5"/><polygon class="march" style="--m:-16" points="{hexpts(94)}" {S(INK, 1.5, FAINT_DASH)}/>'
    elif kind == "pin":
        back, clip, reach, lift = '<circle cx="120" cy="120" r="94"', '<circle cx="120" cy="120" r="92"/>', 84, 0
        deco = G("rot", "".join(f'<path d="M{pt(99, a)[0]:.1f} {pt(99, a)[1]:.1f}L{pt(104 if a % 30 else 108, a)[0]:.1f} {pt(104 if a % 30 else 108, a)[1]:.1f}" {S(INK, 2, O5)}/>' for a in range(0, 360, 10)), "animation-duration:90s")
        edge = f'<circle cx="120" cy="120" r="94" fill="none" {gradient} stroke-width="5"/><circle cx="120" cy="120" r="112" fill="none" {gradient} stroke-width="2.5"/>'
    elif kind == "shield":
        d = "M120 10C152 30 186 38 218 38V120C218 178 176 214 120 234C64 214 22 178 22 120V38C54 38 88 30 120 10Z"
        back, clip, reach, lift = f'<path d="{d}"', f'<path d="{d}"/>', 76, -6
        deco = "".join(f'<circle class="blink" style="animation-delay:{i * 0.5}s" cx="{x}" cy="{y}" r="6" fill="{BG}" stroke="{c}" stroke-width="3"/>' for i, (x, y, c) in enumerate(((120, 10, VIOLET), (218, 38, CYAN), (120, 234, GREEN), (22, 38, CYAN))))
        edge = f'<path d="{d}" fill="none" {gradient} stroke-width="5"/>'
    elif kind == "seal":
        pts = " ".join(f"{pt(112 if i % 2 == 0 else 103, i * 360 / 36)[0]:.1f},{pt(112 if i % 2 == 0 else 103, i * 360 / 36)[1]:.1f}" for i in range(36))
        back, clip, reach, lift = '<circle cx="120" cy="120" r="97"', '<circle cx="120" cy="120" r="95"/>', 84, 0
        deco = G("rot", f'<polygon points="{pts}" fill="{BG}" {gradient} stroke-width="4"/>', "animation-duration:80s")
        edge = f'<circle cx="120" cy="120" r="94" fill="none" stroke="{INK}" stroke-opacity="0.2" stroke-width="1.5" stroke-dasharray="2 6"/>'
    else:                                                # tile
        back, clip, reach, lift = '<rect x="14" y="14" width="212" height="212" rx="46"', '<rect x="16" y="16" width="208" height="208" rx="44"/>', 88, 0
        deco = "".join(f'<circle class="seq" style="animation-delay:{i * 0.9}s" cx="{x}" cy="{y}" r="5" fill="{c}"/>' for i, (x, y, c) in enumerate(((40, 40, VIOLET), (200, 40, CYAN), (200, 200, GREEN), (40, 200, CYAN))))
        edge = f'<rect x="14" y="14" width="212" height="212" rx="46" fill="none" {gradient} stroke-width="5"/><rect class="march" style="--m:-16" x="26" y="26" width="188" height="188" rx="36" {S(INK, 1.5, FAINT_DASH)}/>'
    rnd = random.Random(slug); M = []
    while len(M) < 16:                                   # a faint plexus behind the scene, different for every badge
        x, y = rnd.uniform(30, 210), rnd.uniform(30, 210)
        if math.hypot(x - 120, y - 120 - lift) < reach: M.append((x, y))
    mesh = "".join(f'<path d="M{a[0]:.1f} {a[1]:.1f}L{b[0]:.1f} {b[1]:.1f}" stroke="{tint}" stroke-opacity="0.16" stroke-width="1.2"/>' for i, a in enumerate(M) for b in M[i + 1:] if math.dist(a, b) < 62)
    mesh += "".join(f'<circle class="{"blink" if i % 4 == 0 else ""}" style="animation-delay:{i * 0.3}s" cx="{x:.1f}" cy="{y:.1f}" r="1.8" fill="{tint}" fill-opacity="0.4"/>' for i, (x, y) in enumerate(M))
    defs = (f'<linearGradient id="ring" gradientUnits="userSpaceOnUse" x1="10" y1="20" x2="230" y2="220"><stop offset="0" stop-color="{VIOLET}"/><stop offset="0.5" stop-color="{CYAN}"/><stop offset="1" stop-color="{GREEN}"/></linearGradient>'
            f'<radialGradient id="disc" cx="0.5" cy="0.42" r="0.62"><stop offset="0" stop-color="{tint}" stop-opacity="0.30"/><stop offset="1" stop-color="{tint}" stop-opacity="0"/></radialGradient>'
            f'<radialGradient id="glow"><stop offset="0" stop-color="{CYAN}" stop-opacity="0.45"/><stop offset="1" stop-color="{CYAN}" stop-opacity="0"/></radialGradient>'
            f'<radialGradient id="sun"><stop offset="0" stop-color="{AMBER}" stop-opacity="0.55"/><stop offset="1" stop-color="{AMBER}" stop-opacity="0"/></radialGradient>'
            f'<linearGradient id="leaf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3DF0A6"/><stop offset="1" stop-color="#00A868"/></linearGradient>'
            f'<linearGradient id="fire" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{AMBER}"/><stop offset="1" stop-color="{RED}"/></linearGradient>'
            f'<linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFD75A"/><stop offset="1" stop-color="#C98F00"/></linearGradient>'
            f'<clipPath id="in">{clip}</clipPath>')
    under = deco if kind == "seal" else ""               # the seal's scalloped edge sits behind the disc
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="240" height="240" role="img"><style>{CSS}</style><defs>{defs}</defs>'
            f'{under}{back} fill="{BG}"/>{back} fill="url(#disc)"/><g clip-path="url(#in)">{mesh}<g transform="translate(0 {lift})">{scene()}</g></g>{edge}{"" if kind == "seal" else deco}</svg>\n')

def wire(files):
    """Point achievements.yml and the badge posts at the generated files."""
    y = ROOT / "_data" / "achievements.yml"; t = y.read_text(); done = 0
    for family, slug, name, post, _, _ in REGISTRY:
        local = f"/assets/images/badges/{family}/{slug}.svg"
        m = re.search(rf"(?m)^(\s+)- name: {re.escape(name)}\n((?:\1  (?!image:).*\n)*)(?:\1  image: \S+\n)?", t)   # .* so folded lines stay with their key
        assert m, name
        t = t[:m.start()] + f"{m.group(1)}- name: {name}\n{m.group(2)}{m.group(1)}  image: {local}\n" + t[m.end():]; done += 1
        if post:
            hits = list((ROOT / "_posts").glob(f"*-{post}.md")); assert len(hits) == 1, post
            body = hits[0].read_text(); new, k = re.subn(r"(!\[[^\]]*\]\().+(\)\n\{: \.badge-art\})", rf"\g<1>{local}\g<2>", body)   # .+ not [^)]+: one URL has "(1)" in it
            assert k == 1, post
            if new != body: hits[0].write_text(new)
    y.write_text(t); return done

if __name__ == "__main__":
    made = {}
    for family, slug, name, post, tint, scene in REGISTRY:
        made[(family, slug)] = frame(family, slug, tint, scene)
        (OUT / family).mkdir(parents=True, exist_ok=True); (OUT / family / f"{slug}.svg").write_text(made[(family, slug)])
    if "--sheet" in sys.argv:                            # ids repeat across badges, so each cell gets its own prefix and its own nested <svg>
        cells = []; cols = 7
        for i, ((family, slug), svg) in enumerate(made.items()):
            body = svg[svg.index(">") + 1:svg.rindex("</svg>")]
            for n in ("ring", "disc", "glow", "sun", "leaf", "fire", "gold", "in"): body = body.replace(f'id="{n}"', f'id="{n}{i}"').replace(f"url(#{n})", f"url(#{n}{i})")
            x, y = 24 + (i % cols) * 272, 24 + (i // cols) * 300
            cells.append(f'<svg x="{x}" y="{y}" width="240" height="240" viewBox="0 0 240 240">{body}</svg><text x="{x + 120}" y="{y + 262}" text-anchor="middle" font-family="Menlo" font-size="13" fill="{DIM}">{(family + "/" + slug)[:32]}</text>')
        w, h = 24 + cols * 272, 24 + math.ceil(len(made) / cols) * 300
        pathlib.Path(sys.argv[sys.argv.index("--sheet") + 1]).write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}"><rect width="{w}" height="{h}" fill="#171f24"/>{"".join(cells)}</svg>')
    print("wrote", len(made), "badges under", OUT)
    if "--wire" in sys.argv: print("wired", wire(made), "entries in achievements.yml and their posts")
