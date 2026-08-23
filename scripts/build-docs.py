"""
Turn the support knowledge base into the page's Help Docs data.

Run from the repo root, with the knowledge base checked out alongside it:

    python scripts/build-docs.py ../assistable-support-kb/kb

Two filters, and the first one is the reason this script exists rather than a
copy step. Anything marked `audience: internal` is dropped: those entries name
internal tools, say what not to promise, and describe how to escalate, and this
output is served to the public internet.

The second filter flags rather than drops. An answer that still addresses the
reader as an agent is published with `agentVoice: true`, because the facts are
right and useful, and marked, because the voice is wrong. Publishing it silently
would be the mistake; hiding it would lose real answers.
"""
import glob, io, json, os, re, sys

AGENT_TELLS = re.compile(
    r"\b(the customer|quote these|tell them|ask them|the agent|escalate|internal|"
    r"we should|do not promise|reassure)\b", re.I)

src = sys.argv[1] if len(sys.argv) > 1 else "../assistable-support-kb/kb"
out = os.path.join(os.path.dirname(__file__), "..", "assets", "docs.js")

docs, dropped, flagged = [], 0, 0
for path in sorted(glob.glob(os.path.join(src, "*.md"))):
    txt = io.open(path, encoding="utf-8").read()
    for block in re.split(r"^### Q: ", txt, flags=re.M)[1:]:
        q = block.split("\n")[0].strip()
        get = lambda k: (re.search(r"^%s:\s*(.+)$" % k, block, re.M) or [None, ""])[1].strip()
        parts = block.split("\nA:\n", 1)
        answer = parts[1].strip() if len(parts) > 1 else ""
        if get("audience") not in ("customer", "both") or not answer:
            dropped += 1
            continue
        cluster = get("cluster")
        needs_pass = bool(AGENT_TELLS.search(answer))
        flagged += needs_pass
        docs.append({
            "id": get("id") or q[:40].lower().replace(" ", "-"),
            "q": q,
            "group": cluster.split("::")[0].strip() or "General",
            "topic": cluster.split("::")[1].strip() if "::" in cluster else "",
            "keywords": [k.strip() for k in get("keywords").split(",") if k.strip()],
            "answer": answer,
            "agentVoice": needs_pass,
        })

banner = io.open(out, encoding="utf-8").read().split("window.DOCS =")[0] if os.path.exists(out) else ""
io.open(out, "w", encoding="utf-8").write(banner + "window.DOCS = " +
                                          json.dumps(docs, indent=2, ensure_ascii=False) + ";\n")
print("published %d, dropped %d as internal, flagged %d for a rewrite" % (len(docs), dropped, flagged))
