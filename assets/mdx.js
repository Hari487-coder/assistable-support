/**
 * Rendering the documentation the way it was written.
 *
 * The docs site is Mintlify, and its pages are MDX rather than plain markdown:
 * a hundred of the hundred and fourteen imported pages use components. There
 * are 566 `<Step>`s, 419 `<Card>`s and nearly two hundred callouts. Rendering
 * them with a markdown-only pass does not degrade gracefully - it prints the
 * tags as text and swallows the instructions inside them, which on a page
 * called "Dial Failed Errors" means the fix is the part that disappears.
 *
 * So the components are rendered rather than stripped, in the plainest HTML
 * that carries the same meaning: steps become an ordered list, callouts a
 * marked block, cards a list of links, accordions a native <details>. No
 * component library, no framework - this file is the whole dependency.
 *
 * Escaping happens before any of it. Every character of the source is escaped
 * first and the only unescaped HTML in the output is the markup this file
 * writes itself, so a doc cannot introduce a tag no matter what it contains.
 */

const esc = (s) =>
  String(s ?? "").replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/** Marks a line as markup this file produced, so the block pass leaves it be. */
const RAW = "";
const raw = (html) => RAW + html;

/** Callouts, and the one word each of them is actually saying. */
const CALLOUTS = {
  note: "Note",
  info: "Note",
  tip: "Tip",
  warning: "Warning",
  danger: "Warning",
  check: "Done",
  update: "Update",
};

/**
 * Pull an attribute out of an already-escaped tag.
 *
 * The value cannot be matched with `[^&]` even though that reads naturally:
 * escaping put `&quot;` around it, and a title like "Engine &amp; Streaming"
 * has more inside. Everything up to the closing quote entity, then.
 */
const attr = (tag, name) => {
  // Deliberately no character class. This pattern is assembled as a string,
  // and inside a template literal `\s` is not an escape at all - it collapses
  // to the letter "s", so `[\s\S]` silently becomes `[sS]` and every attribute
  // reads back empty. A lazy `.` needs no backslash and cannot be mangled.
  const m = new RegExp(name + "=&quot;(.*?)&quot;").exec(tag);
  return m ? m[1] : "";
};

/**
 * Links inside the docs point at the docs site, not at us.
 *
 * A card saying "see Knowledge Base Optimization" with href="/troubleshooting/…"
 * would resolve against this page and 404. They are sent to the page they were
 * written about instead.
 */
const DOCS = "https://docs.assistable.ai";
const absolute = (href) => (href.startsWith("/") ? DOCS + href : href);

/**
 * A card, which is not always a link.
 *
 * Some cards are written with no href at all - they describe a thing rather
 * than point at one. Rendering those as an anchor gives the reader something
 * that looks clickable and reloads the page when clicked, which is worse than
 * plain text in every way.
 */
function cardHtml(card) {
  const title = `<b>${card.title}</b>`;
  const body = card.body.join(" ").trim();
  const inner = title + (body ? `<span>${inline(body)}</span>` : "");
  return card.href
    ? `<a class="cx-card" href="${absolute(card.href)}" target="_blank" rel="noopener">${inner}</a>`
    : `<div class="cx-card is-flat">${inner}</div>`;
}

/** Inline markdown, applied to already-escaped text. */
function inline(s) {
  return s
    .replace(/!\[([^\]]*)\]\(([^)\s]+)[^)]*\)/g,
      (_, alt, src) => `<img src="${src}" alt="${alt}" loading="lazy">`)
    .replace(/\[([^\]]+)\]\(([^)\s]+)[^)]*\)/g,
      (_, text, href) => `<a href="${absolute(href)}" target="_blank" rel="noopener">${text}</a>`)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|\s)\*([^*\n]+)\*/g, "$1<em>$2</em>");
}

/**
 * Turn the MDX components into lines of plain HTML.
 *
 * Runs on escaped text, line by line, so a component that opens on its own
 * line and one written inline both end up as the same thing.
 */
function components(text) {
  // Single-line forms first: <Note>…</Note> written all on one line.
  text = text.replace(
    /&lt;(Note|Info|Tip|Warning|Danger|Check|Update)&gt;([\s\S]*?)&lt;\/\1&gt;/g,
    (_, kind, body) => {
      const k = kind.toLowerCase();
      return `\n${raw(`<div class="cx cx-${k}"><b>${CALLOUTS[k]}</b>`)}\n${body.trim()}\n${raw("</div>")}\n`;
    });

  const out = [];
  // Cards carry their link text as a child, so the opening tag is held until
  // the body that names it has been read.
  let card = null;

  for (const line of text.split("\n")) {
    const t = line.trim();

    // Attributes are escaped, so they are full of `&`. Read to the first
    // closing bracket entity instead of to the first ampersand.
    const open = /^&lt;([A-Z][\w]*)((?:(?!&gt;)[\s\S])*)&gt;/.exec(t);
    const close = /^&lt;\/([A-Z][\w]*)&gt;$/.exec(t);

    if (card !== null) {
      if (close && close[1] === "Card") {
        out.push(raw(cardHtml(card)));
        card = null;
        continue;
      }
      if (!open) { card.body.push(t); continue; }
    }

    if (close) {
      const tag = close[1];
      if (tag === "Steps") out.push(raw("</ol>"));
      else if (tag === "Step") out.push(raw("</li>"));
      else if (tag === "Accordion") out.push(raw("</details>"));
      else if (["Note", "Info", "Tip", "Warning", "Danger", "Check", "Update"].includes(tag))
        out.push(raw("</div>"));
      else if (tag === "CardGroup") out.push(raw("</div>"));
      // Frame, AccordionGroup, Tabs and anything else are containers with no
      // meaning of their own; their children have already been kept.
      continue;
    }

    if (open) {
      const [, tag, rest] = open;
      const k = tag.toLowerCase();
      if (tag === "Steps") { out.push(raw('<ol class="cx-steps">')); continue; }
      if (tag === "Step") {
        const title = attr(rest, "title");
        out.push(raw(`<li>${title ? `<b>${title}</b>` : ""}`));
        // A self-closing step has its whole content in the title.
        if (rest.trim().endsWith("/")) out.push(raw("</li>"));
        continue;
      }
      if (tag === "Card") {
        card = { title: attr(rest, "title"), href: attr(rest, "href") || "", body: [] };
        // Self-closing cards never get a closing tag to trigger the flush.
        if (rest.trim().endsWith("/")) {
          out.push(raw(cardHtml(card)));
          card = null;
        }
        continue;
      }
      if (tag === "CardGroup") { out.push(raw('<div class="cx-cards">')); continue; }
      if (tag === "Accordion") {
        out.push(raw(`<details class="cx-fold"><summary>${attr(rest, "title") || "More"}</summary>`));
        continue;
      }
      if (CALLOUTS[k]) {
        out.push(raw(`<div class="cx cx-${k}"><b>${CALLOUTS[k]}</b>`));
        continue;
      }
      if (tag === "Tab") {
        const title = attr(rest, "title");
        if (title) out.push(raw(`<p class="cx-tab">${title}</p>`));
        continue;
      }
      // Frame, AccordionGroup, Tabs, Columns: containers we unwrap.
      continue;
    }

    // A bare <img> inside a Frame, and anything else the docs hand-wrote.
    const img = /^&lt;img\s((?:(?!&gt;)[\s\S])*)/.exec(t);
    if (img) {
      const src = attr(img[1], "src");
      if (src) out.push(raw(`<img src="${src}" alt="${attr(img[1], "alt")}" loading="lazy">`));
      continue;
    }

    out.push(line);
  }
  return out.join("\n");
}

/** A markdown pipe table, given its lines. */
function table(rows) {
  const cells = (r) => r.replace(/^\||\|$/g, "").split("|").map((c) => inline(c.trim()));
  const head = cells(rows[0]);
  const body = rows.slice(2).map(cells);
  return (
    '<div class="cx-tablewrap"><table><thead><tr>' +
    head.map((c) => `<th>${c}</th>`).join("") +
    "</tr></thead><tbody>" +
    body.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("") +
    "</tbody></table></div>"
  );
}

/**
 * Markdown blocks: headings, tables, lists, quotes, paragraphs.
 *
 * Headings start at h4. The article already owns the h3, and a page whose own
 * headings outrank their article's title reads as a different document to
 * anything following the outline.
 */
function blocks(text) {
  const lines = text.split("\n");
  const out = [];
  let list = null;

  const closeList = () => { if (list) { out.push(`</${list}>`); list = null; } };
  const openList = (kind) => {
    if (list !== kind) { closeList(); out.push(`<${kind}>`); list = kind; }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith(RAW)) { closeList(); out.push(line.slice(1)); continue; }

    const t = line.trim();
    if (!t) { closeList(); continue; }

    const h = /^(#{2,6})\s+(.*)$/.exec(t);
    if (h) {
      closeList();
      const level = Math.min(6, h[1].length + 2);
      out.push(`<h${level}>${inline(h[2])}</h${level}>`);
      continue;
    }

    // A table needs its separator row to be a table at all.
    if (t.startsWith("|") && /^\|[\s:|-]+\|?$/.test((lines[i + 1] || "").trim())) {
      closeList();
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) rows.push(lines[i++].trim());
      i--;
      out.push(table(rows));
      continue;
    }

    const ol = /^\d+[.)]\s+(.*)$/.exec(t);
    if (ol) { openList("ol"); out.push(`<li>${inline(ol[1])}</li>`); continue; }

    const ul = /^[-*+]\s+(.*)$/.exec(t);
    if (ul) { openList("ul"); out.push(`<li>${inline(ul[1])}</li>`); continue; }

    const quote = /^&gt;\s*(.*)$/.exec(t);
    if (quote) { closeList(); out.push(`<blockquote>${inline(quote[1])}</blockquote>`); continue; }

    closeList();
    out.push(`<p>${inline(t)}</p>`);
  }
  closeList();
  return out.join("\n");
}

/**
 * One documentation page, as HTML.
 *
 * Code blocks are lifted out before anything else touches the text and put
 * back at the very end, because every rule in here would otherwise reformat
 * the sample somebody is meant to copy.
 */
export function renderDoc(src) {
  const code = [];
  let text = String(src ?? "").replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, body) => {
    code.push(`<pre class="cx-code"><code>${esc(body.replace(/\n$/, ""))}</code></pre>`);
    return `\n${RAW}${code.length - 1}\n`;
  });

  text = blocks(components(esc(text)));
  return text.replace(/(\d+)/g, (_, i) => code[Number(i)]);
}

export { esc };
