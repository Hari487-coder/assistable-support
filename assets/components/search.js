/**
 * The search hero: one box over everything we can answer.
 *
 * Guides and docs are one index here, because a customer typing "outbound
 * call" does not know or care which shelf we keep the answer on. Each result
 * says what it is - a guide with steps, or an answer with a read time - and
 * opening one grows the panel from the result row itself.
 *
 * A miss is never a dead end. The honest state of this desk is that the chat
 * can check the actual account, so every empty result says exactly that and
 * offers it, which is the loop the whole page is built around:
 * search -> chat -> account investigation.
 */
import { scoreDoc, readTime } from "./docs.js";

const esc = (s) =>
  String(s ?? "").replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/** Same loose matching the old ask box used, over the guide's trigger list. */
function scoreGuide(query, guide) {
  const q = query.toLowerCase().trim();
  if (!q) return 0;
  let best = 0;
  for (const t of [...(guide.triggers ?? []), guide.title.toLowerCase()]) {
    if (q === t) best = Math.max(best, 100);
    else if (q.includes(t)) best = Math.max(best, 72);
    else if (t.includes(q) && q.length >= 3) best = Math.max(best, 55);
  }
  return best;
}

export function SearchHero({ docs, guides, onOpenDoc, onOpenGuide, onAsk }) {
  const el = document.createElement("div");
  el.className = "hero-search";
  el.innerHTML = `
    <label class="searchbar">
      <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true">
        <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="2" />
        <path d="M16 16l4.5 4.5" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" /></svg>
      <input type="search" id="q" autocomplete="off"
             placeholder="Search guides, answers, fixes&hellip;"
             aria-label="Search guides, answers and fixes" />
    </label>
    <div class="results" id="results" hidden></div>
    <p class="sr-only" role="status" id="qStatus"></p>`;

  const input = el.querySelector("#q");
  const box = el.querySelector("#results");
  const status = el.querySelector("#qStatus");

  function find(q) {
    const hits = [
      ...guides.map((g) => ({ kind: "guide", s: scoreGuide(q, g), obj: g })),
      ...docs.map((d) => ({ kind: "doc", s: scoreDoc(q, d), obj: d })),
    ]
      .filter((h) => h.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 7);
    return hits;
  }

  function paint(q) {
    if (q.trim().length < 2) {
      box.hidden = true;
      box.textContent = "";
      status.textContent = "";
      return;
    }
    const hits = find(q);
    status.textContent = `${hits.length} result${hits.length === 1 ? "" : "s"}`;
    box.textContent = "";

    hits.forEach((h) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "hit";
      if (h.kind === "guide") {
        b.innerHTML = `
          <span class="hit-kind hit-kind-guide">Guide</span>
          <span class="hit-title">${esc(h.obj.title)}</span>
          <span class="hit-meta">${h.obj.steps.length} steps &middot; real screenshots</span>`;
        b.addEventListener("click", () => onOpenGuide(h.obj, b));
      } else {
        b.innerHTML = `
          <span class="hit-kind">${esc(h.obj.group)}</span>
          <span class="hit-title">${esc(h.obj.q)}</span>
          <span class="hit-meta">${readTime(h.obj.answer)} min read</span>`;
        b.addEventListener("click", () => onOpenDoc(h.obj, b));
      }
      box.appendChild(b);
    });

    // The miss - or the escape hatch under every result list. Both lead to
    // the thing documentation cannot do: reading the real account.
    const ask = document.createElement("button");
    ask.type = "button";
    ask.className = "hit hit-ask";
    ask.innerHTML = hits.length
      ? `<span class="hit-kind hit-kind-ask">Or</span>
         <span class="hit-title">Ask Assistable about your account</span>
         <span class="hit-meta">the AI checks what is actually configured</span>`
      : `<span class="hit-kind hit-kind-ask">No match</span>
         <span class="hit-title">Tell us what happened</span>
         <span class="hit-meta">we check your real account, not a FAQ</span>`;
    ask.addEventListener("click", onAsk);
    box.appendChild(ask);

    box.hidden = false;
  }

  let debounce;
  input.addEventListener("input", () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => paint(input.value), 120);
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      box.querySelector(".hit")?.click();
    }
    if (e.key === "Escape") {
      box.hidden = true;
    }
  });

  return el;
}
