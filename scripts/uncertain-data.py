#!/usr/bin/env python3
"""Build assets/uncertain/commits.json, the score the "uncertain world" post plays through: every non-merge commit on
main, oldest first. Names and emails stay out; only who kind of author it was.

    python3 scripts/uncertain-data.py [REF]        (default origin/main)

Each commit is [day, minute, kind, added, removed, subject]:
    day      days since the initial commit (2022-05-12)
    minute   local time of day the commit was made, in minutes
    kind     0 a person (Jubeen), 1 an agent identity (Fidelo), 2 a bot (dependabot)
"""
import datetime as dt, json, pathlib, re, subprocess, sys
ref = sys.argv[1] if len(sys.argv) > 1 else "origin/main"
root = pathlib.Path(__file__).resolve().parent.parent
log = subprocess.run(["git", "-C", str(root), "log", ref, "--reverse", "--no-merges", "--format=%x00%aI%x09%an%x09%s", "--shortstat"],
                     capture_output=True, text=True, check=True).stdout
KIND = {"Fidelo": 1, "dependabot[bot]": 2}
rows, start = [], None
for chunk in log.split("\x00")[1:]:
    head, _, rest = chunk.partition("\n")
    when, who, subject = head.split("\t", 2)
    t = dt.datetime.fromisoformat(when); start = start or t.date()
    add = re.search(r"(\d+) insertion", rest); rem = re.search(r"(\d+) deletion", rest)
    rows.append([(t.date() - start).days, t.hour * 60 + t.minute, KIND.get(who, 0), int(add.group(1)) if add else 0, int(rem.group(1)) if rem else 0, subject])
out = root / "assets" / "uncertain" / "commits.json"
out.write_text(json.dumps({"start": str(start), "commits": rows}, ensure_ascii=False, separators=(",", ":")))
print(f"{len(rows)} commits, day 0..{rows[-1][0]}, {sum(r[2] == 1 for r in rows)} by the agent, {sum(r[2] == 2 for r in rows)} by the bot | {out.stat().st_size // 1024} KB")
