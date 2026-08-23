/**
 * Help Docs.
 *
 * Search, categories and an article, over the customer-safe half of the support
 * knowledge base. What is here was filtered at build time, not at render time:
 * `assets/docs.js` never contains an internal entry, so a bug in this file
 * cannot leak one.
 *
 * Matching is keyword scoring, not a model. There are sixty-odd articles and
 * they carry hand-written keyword lists, which beats anything clever at this
 * size and costs nothing to run. When it finds nothing it says so and offers a
 * person, because a confident wrong article is worse than an honest miss.
 */

const esc = (s) =>
  String(s ?? "").replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/** Enough markdown for the answers we actually have: bold, code, lists, links. */
function markdown(src) {
  const lines = esc(src).split("\n");
  let html = "";
  let list = false;
  for (const raw of lines) {
    const line = raw.trimEnd();
    const bullet = /^[-*]\s+(.*)$/.exec(line);
    if (bullet) {
      if (!list) { html += "<ul>"; list = true; }
      html += `<li>${bullet[1]}</li>`;
      continue;
    }
    if (list) { html += "</ul>"; list = false; }
    if (!line) continue;
    html += `<p>${line}</p>`;
  }
  if (list) html += "</ul>";
  return html
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

function score(query, doc) {
  const q = query.toLowerCase().trim();
  if (!q) return 0;
  const hay = [doc.q.toLowerCase(), doc.topic.toLowerCase(), ...doc.keywords];
  let best = 0;
  for (const t of hay) {
    if (!t) continue;
    if (t === q) best = Math.max(best, 100);
    else if (t.includes(q)) best = Math.max(best, 70);
    else if (q.includes(t) && t.length >= 4) best = Math.max(best, 55);
  }
  // A word appearing in the question itself is weaker evidence than a keyword
  // somebody chose, so it scores below both.
  if (!best && doc.q.toLowerCase().includes(q)) best = 40;
  return best;
}

export function DocsPanel({ docs, onAsk }) {
  const groups = [...new Set(docs.map((d) => d.group))].sort();

  return function render(host) {
    host.innerHTML = `
      <div class="docs">
        <label class="docs-search asm asm-t" style="--i:0">
          <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="2" />
            <path d="M16 16l4.5 4.5" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" /></svg>
          <input type="search" id="dq" autocomplete="off"
                 placeholder="Search help" aria-label="Search help" />
        </label>
        <div class="docs-body" id="dbody"></div>
      </div>`;

    const body = host.querySelector("#dbody");
    const input = host.querySelector("#dq");

    function article(doc) {
      body.innerHTML = `
        <button type="button" class="back asm asm-l" style="--i:0" id="dBack">
          <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" stroke-width="2.2"
                  stroke-linecap="round" stroke-linejoin="round" /></svg>
          All help
        </button>
        <article class="doc asm asm-b" style="--i:1">
          <p class="doc-group">${esc(doc.group)}${doc.topic ? " &middot; " + esc(doc.topic) : ""}</p>
          <h3>${esc(doc.q)}</h3>
          ${doc.agentVoice ? `<p class="doc-flag">This answer is still written for
            our support team rather than for you. The facts are right; the wording
            is being rewritten.</p>` : ""}
          <div class="doc-body">${markdown(doc.answer)}</div>
          <p class="doc-foot">Did this not solve it?
            <button type="button" class="linkish" id="dAsk">Talk to support</button></p>
        </article>`;
      body.querySelector("#dBack").addEventListener("click", () => {
        input.value = "";
        home();
      });
      body.querySelector("#dAsk").addEventListener("click", onAsk);
      body.querySelector("#dBack").focus({ preventScroll: true });
    }

    function list(items, heading) {
      if (!items.length) {
        body.innerHTML = `<p class="empty">Nothing matches that yet.
          <button type="button" class="linkish" id="dAsk">Ask support</button></p>`;
        body.querySelector("#dAsk").addEventListener("click", onAsk);
        return;
      }
      body.innerHTML = `<p class="docs-heading">${esc(heading)}</p>
        <ul class="doc-list"></ul>`;
      const ul = body.querySelector(".doc-list");
      items.forEach((d) => {
        const li = document.createElement("li");
        const b = document.createElement("button");
        b.type = "button";
        b.className = "doc-row";
        b.innerHTML = `<span class="doc-q">${esc(d.q)}</span>
          <span class="doc-cat">${esc(d.topic || d.group)}</span>`;
        b.addEventListener("click", () => article(d));
        li.appendChild(b);
        ul.appendChild(li);
      });
    }

    function home() {
      body.innerHTML = `
        <p class="docs-heading asm asm-l" style="--i:1">Browse by topic</p>
        <div class="cats"></div>
        <p class="docs-heading asm asm-l" style="--i:2.5">Most asked</p>
        <ul class="doc-list" id="popular"></ul>`;

      const cats = body.querySelector(".cats");
      // Chips and rows carry fractional --i in two interleaved streams, so the
      // groups converge at once from different directions rather than queueing
      // behind each other - plates arriving together, not a bullet list.
      groups.forEach((g, j) => {
        const n = docs.filter((d) => d.group === g).length;
        const b = document.createElement("button");
        b.type = "button";
        b.className = "cat asm asm-b";
        b.style.setProperty("--i", String(1.5 + j * 0.4));
        b.innerHTML = `${esc(g)}<span>${n}</span>`;
        b.addEventListener("click", () =>
          list(docs.filter((d) => d.group === g), g));
        cats.appendChild(b);
      });

      // "Most asked" is the biggest clusters, which is the closest thing to a
      // popularity signal this data actually has. It is not view counts and is
      // not presented as though it were.
      const byGroup = {};
      docs.forEach((d) => (byGroup[d.group] = (byGroup[d.group] || 0) + 1));
      const popular = [...docs]
        .sort((a, b) => byGroup[b.group] - byGroup[a.group])
        .slice(0, 6);

      const ul = body.querySelector("#popular");
      popular.forEach((d, k) => {
        const li = document.createElement("li");
        const b = document.createElement("button");
        b.type = "button";
        b.className = `doc-row asm ${k % 2 ? "asm-r" : "asm-l"}`;
        b.style.setProperty("--i", String(3 + k * 0.6));
        b.innerHTML = `<span class="doc-q">${esc(d.q)}</span>
          <span class="doc-cat">${esc(d.topic || d.group)}</span>`;
        b.addEventListener("click", () => article(d));
        li.appendChild(b);
        ul.appendChild(li);
      });
    }

    let debounce;
    input.addEventListener("input", () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        const q = input.value.trim();
        if (!q) return home();
        const hits = docs
          .map((d) => ({ d, s: score(q, d) }))
          .filter((r) => r.s > 0)
          .sort((a, b) => b.s - a.s)
          .map((r) => r.d);
        list(hits, `${hits.length} result${hits.length === 1 ? "" : "s"} for "${q}"`);
      }, 120);
    });

    home();
  };
}
