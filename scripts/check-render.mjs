/**
 * Render every imported page and refuse to ship anything that came out wrong.
 *
 * Static import checks are not enough for this: a page can parse cleanly and
 * still render as a wall of literal `<Step>` tags, which is exactly what a
 * markdown-only pass does to MDX. So the test is the rendered HTML.
 *
 *     node scripts/check-render.mjs
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { renderDoc } from "../assets/mdx.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (f) => readFileSync(join(ROOT, f), "utf8");

/**
 * Both sources, because one renderer now serves both.
 *
 * The knowledge base answers were written as plain markdown and rendered by a
 * much smaller function before this. Swapping the renderer under them without
 * checking would be the easiest way to break the sixty-three entries that were
 * already working.
 */
const load = (file, name) =>
  JSON.parse(read(file).split(name + " =")[1].trim().replace(/;$/, ""))
    .map((d) => ({ ...d, from: name }));

const docs = [
  ...load("assets/docs.js", "window.DOCS"),
  ...load("assets/docs-site.js", "window.DOCS_SITE"),
];

const PAIRED = ["ol", "ul", "div", "details", "table", "pre", "li", "a"];
const count = (html, re) => (html.match(re) || []).length;

const problems = [];
let biggest = 0;

for (const doc of docs) {
  const html = renderDoc(doc.answer);
  biggest = Math.max(biggest, html.length);
  const say = (what) => problems.push(`${doc.id}: ${what}`);

  // Code spans hold sample values like `<UNKNOWN>` and `<subaccount-id>`.
  // Those are content that is correctly escaped, not components that escaped.
  const prose = html.replace(/<code>[\s\S]*?<\/code>|<pre[\s\S]*?<\/pre>/g, "");
  const leaked = prose.match(/&lt;\/?[A-Z][A-Za-z]*/g);
  if (leaked) say(`MDX left as text: ${[...new Set(leaked)].slice(0, 4).join(" ")}`);

  if (!html.trim()) say("rendered empty");
  if (/[]/.test(html)) say("internal marker reached the output");

  for (const tag of PAIRED) {
    const open = count(html, new RegExp(`<${tag}(?=[\\s>])`, "g"));
    const close = count(html, new RegExp(`</${tag}>`, "g"));
    if (open !== close) say(`<${tag}> ${open} open vs ${close} closed`);
  }

  // Every link has to go somewhere. A card whose href never parsed renders as
  // a link to this page, which looks like a working link and is not.
  for (const href of html.match(/<a class="cx-card" href="([^"]*)"/g) || []) {
    if (/href=""$/.test(href)) say("card link has no destination");
  }
}

console.log(`rendered ${docs.length} pages (both sources), largest ${(biggest / 1024).toFixed(0)} KB`);
if (!problems.length) {
  console.log("no problems");
} else {
  console.log(`${problems.length} problem(s):`);
  for (const p of problems.slice(0, 20)) console.log("  " + p);
  process.exitCode = 1;
}
