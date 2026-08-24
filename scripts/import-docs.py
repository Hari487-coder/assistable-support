"""
Bring docs.assistable.ai onto the support page.

    python scripts/import-docs.py                # fetch and build
    python scripts/import-docs.py --cache-only   # rebuild from what is on disk

The docs site publishes every page as plain markdown next to its HTML, and an
index of all of them at /llms.txt. That is what this reads. It is deliberately
not a scrape of the rendered pages: the markdown is the source the site itself
is built from, so an import that reads it stays right when the theme changes.

Two things it does not do, both on purpose.

It does not summarise. Every page is carried across whole, because a support
answer that has been through a paraphrase is an answer nobody can rely on.

It does not silently publish claims this team already knows to be wrong. A few
pages describe mechanisms that do not exist in the platform - the AI call error
tags are the known case - and those are marked `unverified` so the page can say
so rather than presenting them as fact. Dropping them would lose real content;
publishing them unmarked would repeat a documented mistake.
"""
import io, json, os, re, sys, urllib.parse, urllib.request
from concurrent.futures import ThreadPoolExecutor

# The docs host refuses urllib's default agent outright. Saying who we are is
# both what gets a 200 and the polite thing to do.
AGENT = "assistable-support-page docs importer (+https://assistable.ai)"


def get(url, timeout=30):
    req = urllib.request.Request(urllib.parse.quote(url, safe=":/"), headers={"User-Agent": AGENT})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read().decode("utf-8", "replace")

INDEX = "https://docs.assistable.ai/llms.txt"
BASE = "https://docs.assistable.ai/"
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
CACHE = os.path.join(ROOT, ".docs-cache")

# The banner every page carries, telling a crawler where the index is. It is
# navigation for machines, not content, and it is identical on all 241 pages.
BANNER = re.compile(r"\A(?:>[^\n]*\n)+\s*", re.M)

# Sections, in the order a person in trouble would want them. Anything not
# named here keeps its own path segment, so a new section on the docs site
# appears rather than vanishing into "General".
SECTIONS = {
    "troubleshooting": "Troubleshooting",
    "how-to-guides": "How-to guides",
    "build": "Build",
    "deploy": "Deploy",
    "monitor": "Monitor",
    "platform": "Platform",
    "integrations": "Integrations",
    "get-started": "Get started",
    "variables": "Variables",
    "direct": "Assistable Direct",
    "v3": "Developers",
    "api-reference": "API reference",
    "changelog": "Changelog",
}

TOPICS = {
    "chat-ai": "Chat AI", "voice-ai": "Voice AI", "custom-tools": "Custom tools",
    "flow-builder": "Flow Builder", "prompting": "Prompting", "telephony": "Telephony",
    "widgets": "Widgets", "webhooks": "Webhooks",
}

# Pages whose mechanism this team has checked against the platform source and
# found missing. Marked, not dropped: the rest of the page is still useful.
UNVERIFIED = {
    "monitor/error-tags": "The ai_call_error_* tags described here were not found in the "
                          "platform. Call errors are recorded on the call record instead.",
}


def slug(rel):
    return rel[:-3].replace("/", "-")


def fetch(url):
    """Download one page, cached on disk so a rebuild costs nothing."""
    rel = url[len(BASE):]
    path = os.path.join(CACHE, rel.replace("/", "__"))
    if os.path.exists(path) and os.path.getsize(path):
        return rel, io.open(path, encoding="utf-8").read()
    try:
        # The index contains at least one title with an em dash in its path.
        text = get(url)
    except Exception as err:
        print(f"  could not fetch {rel}: {err}")
        return rel, None
    os.makedirs(CACHE, exist_ok=True)
    io.open(path, "w", encoding="utf-8").write(text)
    return rel, text


def parse(rel, text):
    body = BANNER.sub("", text, count=1).strip()

    title = ""
    m = re.match(r"#\s+(.+)", body)
    if m:
        title = m.group(1).strip()
        body = body[m.end():].lstrip()

    # A one-line blockquote straight after the heading is the page's own
    # summary. Worth keeping separately: it is what a search result should show.
    summary = ""
    m = re.match(r">\s*(.+?)\n\s*\n", body + "\n\n")
    if m:
        summary = m.group(1).strip()
        body = body[m.end():].lstrip() if m.end() <= len(body) else ""

    parts = rel[:-3].split("/")
    section = SECTIONS.get(parts[0], parts[0].replace("-", " ").title())
    topic = TOPICS.get(parts[1], parts[1].replace("-", " ").title()) if len(parts) > 2 else ""

    if not title:
        title = parts[-1].replace("-", " ").capitalize()

    doc = {
        "id": slug(rel),
        "q": title,
        "group": section,
        "topic": topic,
        # Headings are what a page is actually about, and they are the words a
        # person searches with far more often than the prose around them.
        "keywords": sorted({
            w.lower() for w in re.findall(r"^#{2,3}\s+(.+)$", body, re.M)
            for w in re.findall(r"[A-Za-z_][\w-]{3,}", w)
        })[:14],
        "summary": summary,
        "answer": body,
        "source": "docs",
        "href": BASE + rel[:-3],
    }
    warn = UNVERIFIED.get(rel[:-3])
    if warn:
        doc["unverified"] = warn
    return doc


def main():
    cache_only = "--cache-only" in sys.argv
    with_api = "--with-api" in sys.argv

    if cache_only and os.path.isdir(CACHE):
        urls = [BASE + f.replace("__", "/") for f in sorted(os.listdir(CACHE))]
    else:
        index = get(INDEX)
        urls = sorted(set(re.findall(r"https://docs\.assistable\.ai/[^\s)\]]+\.md", index)))
    print(f"{len(urls)} pages in the index")

    with ThreadPoolExecutor(max_workers=12) as pool:
        pages = list(pool.map(fetch, urls))

    docs, missed = [], 0
    for rel, text in pages:
        if not text:
            missed += 1
            continue
        doc = parse(rel, text)
        if not doc["answer"]:
            missed += 1
            continue
        docs.append(doc)

    api = [d for d in docs if d["group"] == "API reference"]
    support = [d for d in docs if d["group"] != "API reference"]

    # The endpoint reference is generated from the OpenAPI spec and is five
    # times the weight of everything else. It is written for somebody holding
    # an API key, not somebody whose assistant stopped replying, and putting it
    # in the same index buries the pages that answer that question.
    chosen = docs if with_api else support
    order = list(SECTIONS.values())
    chosen.sort(key=lambda d: (order.index(d["group"]) if d["group"] in order else 99, d["q"]))

    out = os.path.join(ROOT, "assets", "docs-site.js")
    head = (io.open(out, encoding="utf-8").read().split("window.DOCS_SITE =")[0]
            if os.path.exists(out) else BANNER_TEXT)
    io.open(out, "w", encoding="utf-8").write(
        head + "window.DOCS_SITE = " + json.dumps(chosen, indent=1, ensure_ascii=False) + ";\n")

    print(f"published {len(chosen)} pages ({len(support)} support"
          + (f" + {len(api)} api reference" if with_api else f", {len(api)} api reference held back")
          + f"), {missed} unreadable")
    print(f"flagged unverified: {sum(1 for d in chosen if d.get('unverified'))}")
    print(f"wrote {out} ({os.path.getsize(out)/1024:.0f} KB)")


BANNER_TEXT = '''/**
 * The Assistable documentation, as the support page reads it.
 *
 * Generated by scripts/import-docs.py from docs.assistable.ai. Do not
 * hand-edit: the next run overwrites it. Every page is carried across whole
 * rather than summarised, because an answer that has been through a
 * paraphrase is one nobody can rely on.
 *
 * Anything marked `unverified` describes a mechanism this team checked
 * against the platform and could not find. It is shown with that warning
 * rather than dropped, because the rest of the page is still worth reading.
 */
'''

if __name__ == "__main__":
    main()
