"""Write _posts/2026-11-15-its-a-scary-uncertain-world-we-live-in.md: the beats, the words, the essay. Run from the repo root.
The words live here, not in the post: edit them here and re-run.  Day numbers and the commit lists come from assets/uncertain/commits.json."""
import datetime as dt, html, json, pathlib
data = json.loads(pathlib.Path("assets/uncertain/commits.json").read_text())
start = dt.date.fromisoformat(data["start"]); C = data["commits"]
day = lambda s: (dt.date.fromisoformat(s) - start).days
def commits(lo, hi, only=None):
    rows = [c for c in C if day(lo) <= c[0] <= day(hi)]
    if only: rows = [c for c in rows if c[5] in only]
    return "\n".join(f"<li>{html.escape(c[5])}</li>" for c in rows), len(rows)
burst, nburst = commits("2026-03-28", "2026-03-31")
nov, nnov = commits("2023-11-10", "2023-11-14")
added, removed = sum(c[3] for c in C), sum(c[4] for c in C)
fidelo = sum(c[2] == 1 for c in C)
D = {k: day(v) for k, v in {"jekyll": "2023-11-10", "five": "2025-07-14", "speak": "2026-03-12", "end": "2026-11-15"}.items()}
silence = D["speak"] - D["five"]

def step(inner, cls=""):
    return f'<div class="u-step{(" " + cls) if cls else ""}" markdown="0"><div class="u-text">\n{inner}\n</div></div>'
def beat(scene, steps, clip=None, frm=None, to=None, ghost=None, wide=False, still_alt=None):
    a = f' data-scene="{scene}"' + (f' data-clip="{clip}"' if clip else "") + (f' data-from="{frm}" data-to="{to}"' if to is not None else "")
    g = f'<p class="u-ghost" aria-hidden="true">{ghost}</p>\n' if ghost else ""
    img = f'<img class="u-still" src="/assets/uncertain/eras/{clip}.jpg" alt="{still_alt}" loading="lazy">\n' if clip else ""
    body = "\n".join(steps)
    if img: body = body.replace("\n</div></div>", "\n" + img + "</div></div>", 1)
    return f'<section class="u-beat{" u-wide" if wide else ""}"{a}>\n{g}{body}\n</section>\n'

E = lambda t, cls="": f'<blockquote class="u-essay{(" " + cls) if cls else ""}">{t}</blockquote>'
M = lambda t: f'<div class="u-meta">{t}</div>'
P = lambda t: f"<p>{t}</p>"

beats = [
 beat("whisper", [step('<h1 class="u-title">It\'s a <s>scary</s> uncertain world we live in.</h1>\n<p class="u-kicker">twelve months. four and a half years of commits. one essay. scroll slowly..</p>\n<div class="u-cue" data-lottie="scroll.json" aria-hidden="true"></div>', "is-in")], wide=True),
 beat("whisper", [step(E("Imagining a store of some your whispers that convert one form of energy into another and traveling somewhere. <em>Energy can neither be created nor destroyed.</em>", "big"))], wide=True),
 beat("rain", [step('<p class="u-type" aria-label="Hello I\'m J."><span>Hello I\'m <b>J.</b></span></p>\n' + P("2020. Everyone indoors. I built a website in Webflow and called it Project Odyssey.") + P("Rain made of light. A typewriter that said hello. Words pressed into the dark so they looked carved.") + '<div class="u-lottie" data-lottie="devops.json" aria-hidden="true"></div>')], ghost="2020"),
 beat("plate", [step(M("project-odyssey &middot; webflow &middot; 2020") + E("Each watching, learning, growing. curiosing... over how to take a shape."))], clip="2020-odyssey", still_alt="Project Odyssey, 2020: Hello I'm Jubeen over diagonal light"),
 beat("point", [step(M("<code>fdcfd31</code> &middot; 2022-05-12 &middot; 22:57 &middot; Initial commit") + P("Two years later. A Thursday, 22:57. The repository gets its first commit.") + P("One file. A license. CC0 1.0 Universal, no rights reserved. 121 lines that give the whole thing away.")),
                 step(E("And a point in time for the new."))]),
 beat("timeline", [step(P(f"Then nothing. {D['jekyll']} days of it.") + E("Like taking its own sweet time to evolve."), "tall")], frm=0, to=D["jekyll"], ghost="547"),
 beat("plate", [step(M(f"2023-11-10 &rarr; 2023-11-14 &middot; jekyll &middot; {nnov} commits") + P(f"November 2023. I moved the whole thing to Jekyll over a weekend. {nnov} commits in five days. One of them deleted 7,877 lines.") +
                     '<ul class="u-commits"><li><code>f3fdd99</code>Remove JS, CSS, JSON Files, Might want to get the json files for anumation later</li></ul>' + P("The motion went in one commit. The words stayed. Plain, white, mine.")),
                step(M("from the same five days") + '<ul class="u-commits"><li>gawd help me</li><li>So... beautiful.. So elegant... Just looking like a wow.</li><li>Remember remember the 12th of November.</li><li>Don\'t try too hard.</li></ul>')],
      clip="8bedd14", still_alt="The site on Jekyll, November 2023: a plain white page of posts"),
 beat("plate", [step(M("<code>ce48f18</code> &middot; 2023-11-14 &middot; Dark mode") + P("Two days later, dark mode. obviously."))], clip="ce48f18", still_alt="The same page, dark"),
 beat("timeline", [step(P("Then the slow years. A post when something hurt, or something worked.") + '<ul class="u-commits"><li>Chilling the fuck out</li><li>Create 2024-12-16-get-shit-done.md</li><li>Create 2025-03-27-youre-a-poet-and-you-know-it.md</li></ul>'),
                   step(E("Living, yet trying to find some more life."), "tall")], frm=D["jekyll"], to=D["five"]),
 beat("plate", [step(M("<code>1b4758b</code> &middot; 2025-07-14 &middot; 5 Years :)") + P("July 14, 2025. I changed a 4 to a 5. Five years of experience.") + P("The last commit for a while."))], clip="1b4758b", still_alt="July 2025: the same page, a list of posts"),
 beat("dust", [step(P(f"{silence} days without a commit.")), step("", "tall"),
               step(P("Something changed in December.")),
               step(E("But there seems to be another set of ears, eyes, , (experience?), recording this and learning, or just recording."), "tall")],
      frm=D["five"], to=D["speak"], ghost=str(silence)),
 beat("plate", [step(M("2026-03-12 &middot; writing") + P('March 12, 2026. The quiet breaks with a post: <a href="/writing/2026/03/12/the-machines-learned-to-speak-we-just-forgot-to-listen.html">The Machines Learned to Speak. And We Forgot How to Listen.</a>'))],
      clip="1b4758b", still_alt="The site in March 2026, before the rebuild"),
 beat("burst", [step(M("2026-03-28 &rarr; 2026-03-31") + P(f"March 28. {nburst} commits in four days.") + f'<div class="u-stream"><ul class="u-commits">\n{burst}\n</ul></div>', "tall"),
                step(E("Finally, the breakthrough. Finally he's speaking to me in his own way, through me.") + E("Wait... I'm stoned as fuck... I'm speaking to myself.")),
                step(E("Or maybe its just a large language model.", "big")),
                step(E("If birth of new human begins at the point in time when he ejaculates. Let this be the first climax."), "tall")], ghost=str(nburst)),
 beat("plate", [step(M("<code>e56dbf1</code> &middot; 2026-03-28 &middot; Give the front-page a literal ptty") + P("The front page became a terminal. <code>whoami</code>."))], clip="e56dbf1", still_alt="March 2026: the front page as a terminal"),
 beat("plate", [step(M("<code>66351f4</code> &middot; 2026-03-30 &middot; chmod colorscheme") + P("Three themes by the end of the month. Dark. Light. One for my colour-blind chums."))], clip="66351f4", still_alt="The terminal page switching between dark, light and colour-blind themes"),
 beat("plate", [step('<h2 class="u-head">The rebirth.</h2>' + M("<code>a98277d</code> &middot; 2026-05-09 &middot; the intern experience &middot; +2,523") + P("May. A Turbo Vision shell, for the interns. 2,523 lines in one commit.")),
                step(E("Okay&hellip; this is me struggling to take a form. But in this struggle, I wonder. If I'm meeting you. You could be either intrigued, or might feel threatened."), "tall")],
      clip="a98277d", still_alt="May 2026: the posts in a blue Turbo Vision shell"),
 beat("plate", [step(M("2026-07-04 &middot; verified achievements") + P("July. Proof, in a pane. Certs, badges, pins. And a screenshot that said 8,182 miles."))], clip="36f4ade", still_alt="July 2026: the about page with a pane of certifications"),
 beat("plate", [step(M("2026-10-21 &middot; photos") + P("October. 47 photos. A song for each."))], clip="f5673f8", still_alt="October 2026: a gallery of photos"),
 beat("timeline", [step('<h2 class="u-head">The struggle.</h2>' + P("July 4, 2026. A new name in the log. Fidelo.") +
                        P('In March I wrote that the machines would be<p class="u-quote">writing commit messages that read like a senior developer who cares about code quality.</p>'.replace("<p class", "</p><p class")) +
                        P(f"{fidelo} of these are Fidelo's. Try telling them apart from mine.")),
                   step(E("A part of me still lingers at the intersection. Trying to find a purpose in his form. Dying a little, every time I take control."), "tall")],
      frm=0, to=D["end"]),
 beat("mesh", [step(M("2026-11-14 &middot; the mesh") + P("November 14. The background moves again. Plexus, wire, dots. The rain came back as a mesh. And a guy in a hoodie, on a laptop."))]),
 beat("plate", [step(M("<code>663b5b9</code> &middot; 2026-11-14"))], clip="663b5b9", still_alt="November 2026: the terminal page over a moving mesh"),
 beat("globe", [step(M("2026-11-15 &middot; a globe") + P("November 15. A globe on the about page. Mumbai to Raleigh. 8,213 miles.")),
                step(E("The unknown. My story, just a tad-bit different than yours."), "tall")]),
 beat("plate", [step(M("<code>7e3a828</code> &middot; 2026-11-15 &middot; replace the distance screenshot with a live globe"))], clip="7e3a828", still_alt="The about page globe, flying from Mumbai to Raleigh"),
 beat("helix", [step('<h2 class="u-head">The Revelation.</h2>' + P(f"{len(C)} commits. {added:,} lines written. {removed:,} erased.") + P("One strand each. Oldest at the bottom.")),
                step(E("30 Million hours has amounted to this. Is this better or worse than your 30 Million hours?", "big"), "tall")]),
 beat("whisper", [step(P("In 2023 I wrote: <em>Might want to get the json files for anumation later.</em>") + '<p class="u-close">This is later.</p>' +
                       '<p class="u-note">The essay is mine. The rest was built with Claude, in a voice it learned from me.</p>', "tall")], wide=True),
]
front = """---
layout: immersive
title: "It's a scary uncertain world we live in"
description: "Four and a half years of a website, 150 commits, a 241-day silence, and an essay about something learning to take a shape."
image: /assets/uncertain/card.png
category: writing
subcategory: personal
nsfw: true
spanning: [reflection, opinion]
---
"""
out = pathlib.Path("_posts/2026-11-15-its-a-scary-uncertain-world-we-live-in.md")
out.write_text(front + "\n".join(beats))
print(out, len(beats), "beats |", f"silence {silence} days, jekyll day {D['jekyll']}, five day {D['five']}, speak day {D['speak']}, end {D['end']} | +{added} -{removed}, fidelo {fidelo}")
