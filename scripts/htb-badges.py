#!/usr/bin/env python3
"""Draw our own animated badges for the HTB Academy achievements, so the site stops hotlinking art whose URLs keep moving.

    python3 scripts/htb-badges.py            # writes assets/images/badges/htb/<slug>.svg
    python3 scripts/htb-badges.py --sheet F  # also writes one contact sheet SVG to F (for review)

Every drawing is original: a shared mesh-and-ring frame, and one scene per badge built from the idea behind its
name. The motion is CSS inside each SVG, so it plays in a plain <img> with no script, and stops for readers who
ask for reduced motion. Without CSS (a static renderer) each badge is simply its finished drawing.
Slugs match the post file names (_posts/*-htb-<slug>.md) and the names in _data/achievements.yml.
"""
import math, pathlib, random, sys
OUT = pathlib.Path(__file__).resolve().parent.parent / "assets" / "images" / "badges" / "htb"
BG, PANEL, INK, DIM = "#0A0D14", "#121A2E", "#EEF2FB", "#9AA3B8"
GREEN, CYAN, VIOLET, SKY, AMBER, RED = "#00E08A", "#22D3EE", "#8B5CF6", "#38BDF8", "#F5B301", "#FF4D2E"
TAU = 2 * math.pi
S = lambda c, w, extra="": f'fill="none" stroke="{c}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round" {extra}'
pt = lambda r, deg, cx=120, cy=120: (cx + r * math.cos(math.radians(deg)), cy + r * math.sin(math.radians(deg)))
def arc(r, a0, a1, cx=120, cy=120):
    (x0, y0), (x1, y1) = pt(r, a0, cx, cy), pt(r, a1, cx, cy)
    return f"M{x0:.1f} {y0:.1f}A{r} {r} 0 {1 if (a1 - a0) % 360 > 180 else 0} 1 {x1:.1f} {y1:.1f}"
def star4(cx, cy, r, c, d=0):                          # a four-point sparkle that twinkles
    k = r * 0.28
    return f'<path class="tw" style="animation-delay:{d}s" d="M{cx} {cy - r}Q{cx + k} {cy - k} {cx + r} {cy}Q{cx + k} {cy + k} {cx} {cy + r}Q{cx - k} {cy + k} {cx - r} {cy}Q{cx - k} {cy - k} {cx} {cy - r}Z" fill="{c}"/>'
def node(x, y, c, r=6, cls="", d=0): return f'<circle class="{cls}" style="animation-delay:{d}s" cx="{x}" cy="{y}" r="{r}" fill="{BG}" stroke="{c}" stroke-width="3"/>'
G = lambda cls, body, style="": f'<g class="{cls}" style="{style}">{body}</g>'

CSS = """
.rot{transform-origin:120px 120px;animation:rot 60s linear infinite}
.orbit{transform-origin:120px 120px;animation:rot 16s linear infinite}
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
@media (prefers-reduced-motion:reduce){*{animation:none!important}}
""".replace("\n", "")

# ---- one scene per badge, drawn around the centre (120, 120) inside a radius of about 78 -----------------------
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

BADGES = [  # slug, tint behind the scene, scene
 ("academician", VIOLET, academician), ("anonymous-access", SKY, anonymous_access), ("crawl-walk-run", SKY, crawl_walk_run),
 ("the-guardian-of-active-directory", GREEN, guardian), ("your-white-belt-training-begins", SKY, white_belt), ("an-apple-a-day", GREEN, apple),
 ("philomath", CYAN, philomath), ("superior-intelligence", CYAN, superior_intelligence), ("synthetic-intelligence", VIOLET, synthetic_intelligence),
 ("model-breaker", RED, model_breaker), ("prompt-phantom", VIOLET, prompt_phantom), ("output-overdrive", RED, output_overdrive),
 ("unwavering-user", AMBER, unwavering_user), ("constant-champion", AMBER, constant_champion), ("cyber-rookie-365", AMBER, cyber_rookie),
 ("binary-duo-explorer", CYAN, binary_duo),
]
def frame(slug, tint, scene):
    rnd = random.Random(slug); P = []
    while len(P) < 16:                                   # a faint plexus inside the disc, different for every badge
        x, y = rnd.uniform(30, 210), rnd.uniform(30, 210)
        if math.hypot(x - 120, y - 120) < 92: P.append((x, y))
    mesh = "".join(f'<path d="M{a[0]:.1f} {a[1]:.1f}L{b[0]:.1f} {b[1]:.1f}" stroke="{tint}" stroke-opacity="0.16" stroke-width="1.2"/>' for i, a in enumerate(P) for b in P[i + 1:] if math.dist(a, b) < 62)
    mesh += "".join(f'<circle class="{"blink" if i % 4 == 0 else ""}" style="animation-delay:{i * 0.3}s" cx="{x:.1f}" cy="{y:.1f}" r="1.8" fill="{tint}" fill-opacity="0.4"/>' for i, (x, y) in enumerate(P))
    ring = "".join(f'<path d="{arc(109, a, a + 96)}" {S("url(#ring)", 5)}/>' for a in (-78, 42, 162))
    ring += "".join(f'<circle cx="{pt(109, a)[0]:.1f}" cy="{pt(109, a)[1]:.1f}" r="5" fill="{BG}" stroke="{c}" stroke-width="3"/>' for a, c in ((-90, VIOLET), (30, CYAN), (150, GREEN)))
    defs = (f'<linearGradient id="ring" gradientUnits="userSpaceOnUse" x1="10" y1="20" x2="230" y2="220"><stop offset="0" stop-color="{VIOLET}"/><stop offset="0.5" stop-color="{CYAN}"/><stop offset="1" stop-color="{GREEN}"/></linearGradient>'
            f'<radialGradient id="disc" cx="0.5" cy="0.42" r="0.62"><stop offset="0" stop-color="{tint}" stop-opacity="0.30"/><stop offset="1" stop-color="{tint}" stop-opacity="0"/></radialGradient>'
            f'<radialGradient id="glow"><stop offset="0" stop-color="{CYAN}" stop-opacity="0.45"/><stop offset="1" stop-color="{CYAN}" stop-opacity="0"/></radialGradient>'
            f'<radialGradient id="sun"><stop offset="0" stop-color="{AMBER}" stop-opacity="0.55"/><stop offset="1" stop-color="{AMBER}" stop-opacity="0"/></radialGradient>'
            f'<linearGradient id="leaf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3DF0A6"/><stop offset="1" stop-color="#00A868"/></linearGradient>'
            f'<linearGradient id="fire" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{AMBER}"/><stop offset="1" stop-color="{RED}"/></linearGradient>'
            f'<linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFD75A"/><stop offset="1" stop-color="#C98F00"/></linearGradient>'
            '<clipPath id="in"><circle cx="120" cy="120" r="98"/></clipPath>')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="240" height="240" role="img"><style>{CSS}</style><defs>{defs}</defs>'
            f'<circle cx="120" cy="120" r="100" fill="{BG}"/><circle cx="120" cy="120" r="100" fill="url(#disc)"/><g clip-path="url(#in)">{mesh}</g>'
            f'<circle cx="120" cy="120" r="100" fill="none" stroke="{INK}" stroke-opacity="0.14" stroke-width="1.5"/><g>{scene()}</g><g class="rot">{ring}</g></svg>\n')

if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True); made = {}
    for slug, tint, scene in BADGES:
        made[slug] = frame(slug, tint, scene); (OUT / f"{slug}.svg").write_text(made[slug])
    if "--sheet" in sys.argv:                            # ids repeat across badges, so each cell gets its own prefix and its own nested <svg>
        cells = []
        for i, (slug, svg) in enumerate(made.items()):
            body = svg[svg.index(">") + 1:svg.rindex("</svg>")]
            for name in ("ring", "disc", "glow", "sun", "leaf", "fire", "gold", "in"): body = body.replace(f'id="{name}"', f'id="{name}{i}"').replace(f"url(#{name})", f"url(#{name}{i})")
            x, y = 30 + (i % 4) * 300, 30 + (i // 4) * 330
            cells.append(f'<svg x="{x}" y="{y}" width="240" height="240" viewBox="0 0 240 240">{body}</svg><text x="{x + 120}" y="{y + 268}" text-anchor="middle" font-family="Menlo" font-size="15" fill="{DIM}">{slug[:28]}</text>')
        pathlib.Path(sys.argv[sys.argv.index("--sheet") + 1]).write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1230 1350" width="1230" height="1350"><rect width="1230" height="1350" fill="#171f24"/>{"".join(cells)}</svg>')
    print("wrote", len(made), "badges to", OUT)
