/**
 * Support hub, in assistable.ai's own language.
 *
 * Reverse-engineered from the live brand site rather than approximated:
 * Inter with big tight bold headlines, solid #0071eb actions, flat bordered
 * cards at 20px, and the signature filled grey panel at 24px - which this
 * page spends on the one thing that makes this desk different: tell us what
 * broke, and we check your real account.
 *
 * The chat widget itself is deliberately untouched. It is the route that
 * ends with an engineer inside the customer's account; the hub only borrows
 * its launcher. What the widget says once open lives on the widget record
 * and the intake assistant's prompt, not in this file.
 */
import { Heart, Community } from "./components/brand.js";
import { QuickHelp } from "./components/resource-grid.js";
import { SearchHero } from "./components/search.js";
import { ExpandedResourcePanel } from "./components/expanded-panel.js";
import { GuidesPanel } from "./components/guides.js";
import { DocsPanel } from "./components/docs.js";

const ICONS = {
  guides: `<svg viewBox="0 0 24 24" width="20" height="20">
    <rect x="3" y="4" width="18" height="13" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M8 21h8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <circle cx="12" cy="10.5" r="2.6" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M12 13.1v2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  docs: `<svg viewBox="0 0 24 24" width="20" height="20">
    <path d="M6 3h8l4 4v14H6z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M14 3v4h4M9 12h6M9 16h4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  ask: `<svg viewBox="0 0 24 24" width="20" height="20">
    <path d="M4 6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H9l-5 4z"
          fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M9 8.5h6M9 11.5h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
};

/**
 * INTERIM Discord destination. Every known invite is dead - discord.gg/Puse4ka7
 * (what support agents were sending customers) and discord.gg/HPqCJWZU (the
 * link on assistable.ai itself, broken for everyone) both return Unknown
 * Invite, and the guild widget is disabled so no invite can be minted from
 * outside. This is the server itself: members land in it; non-members need
 * the permanent invite only an admin can create. Swap the moment one exists.
 */
const COMMUNITY = {
  discord: "https://discord.com/channels/1495316624108945479",
  skool: "https://www.skool.com/assistable",
};

const TILES = [
  {
    id: "guides", corner: "tl", kind: "expand", icon: ICONS.guides,
    label: "Guides",
    blurb: "Learn how, with pictures of the real screens.",
    panelTitle: "Pictures of the real screens, with the button circled",
  },
  {
    id: "docs", corner: "tl", kind: "expand", icon: ICONS.docs,
    label: "Help docs",
    blurb: "Answers to what people actually ask us.",
    panelTitle: "Answers to what people actually ask us",
  },
  {
    id: "ask", corner: "tr", kind: "chat", icon: ICONS.ask,
    label: "Ask us",
    blurb: "A question? Tell us. No forms, no queue.",
  },
];

/**
 * Open the support chat by clicking the widget's own launcher inside its
 * shadow root. Targeted by label: a bare "button" selector picks up the
 * teaser toast's close button whenever a teaser is showing, which dismisses
 * the toast and leaves the chat shut - a real bug in an earlier build.
 */
function openSupportChat() {
  const api = window.__assistableWidget;
  const shadow = api && api.shadow;
  const launcher =
    (shadow &&
      (shadow.querySelector('button[aria-label="Open chat"]') ||
        shadow.querySelector("button[aria-label*='chat' i]"))) ||
    document.querySelector('#assistable-chat-widget button[aria-label*="chat" i]');

  if (launcher) {
    launcher.click();
    return true;
  }
  const note = document.getElementById("hubNote");
  if (note) {
    note.textContent = "The support chat is still loading. Give it a moment and try again.";
    note.hidden = false;
    setTimeout(() => { note.hidden = true; }, 6000);
  }
  return false;
}

export function SupportHub(root) {
  const panel = ExpandedResourcePanel({ root });

  const renderGuides = GuidesPanel({
    guides: window.WALKTHROUGHS || [],
    onStuck: () => { panel.close(); openSupportChat(); },
  });
  const renderDocs = DocsPanel({
    docs: window.DOCS || [],
    onAsk: () => { panel.close(); openSupportChat(); },
  });

  const tileFor = (id) => TILES.find((t) => t.id === id);
  function openPanel(id, origin, start) {
    const renderer = id === "guides" ? renderGuides : renderDocs;
    panel.show(tileFor(id), origin, (body, api) => renderer(body, api, start));
  }

  // ── hero: the brand site's type-led opening, with our one signature ────
  const heart = Heart({ mark: "assets/brand/assistable-mark.png" });

  const h1 = document.createElement("h1");
  h1.className = "hero-h1";
  h1.textContent = "How can we help?";

  const sub = document.createElement("p");
  sub.className = "hero-sub";
  sub.textContent =
    "Search the answers, or tell us what broke. We check your actual account, not a FAQ.";

  const search = SearchHero({
    docs: window.DOCS || [],
    guides: window.WALKTHROUGHS || [],
    onOpenDoc: (doc, row) => openPanel("docs", row, { doc }),
    onOpenGuide: (guide, row) => openPanel("guides", row, { guide }),
    onAsk: openSupportChat,
  });

  // Counted from what is actually published, not claimed.
  const docsAll = window.DOCS || [];
  const stats = document.createElement("div");
  stats.className = "stats";
  const groupsN = new Set(docsAll.map((d) => d.group)).size;
  for (const [n, label] of [
    [docsAll.length, "Answers"],
    [groupsN, "Topics"],
    [(window.WALKTHROUGHS || []).length, "Guides"],
  ]) {
    const el = document.createElement("span");
    el.className = "stat";
    el.innerHTML = `<b>${n}</b><span>${label}</span>`;
    stats.appendChild(el);
  }

  // ── self-serve row ──────────────────────────────────────────────────
  const quickHead = document.createElement("p");
  quickHead.className = "section-k";
  quickHead.textContent = "Quick help";

  const tiles = QuickHelp({
    tiles: TILES,
    onOpen: (resource, el) =>
      resource.kind === "expand" ? openPanel(resource.id, el) : openSupportChat(),
  });

  // ── the filled panel: the brand site's signature block, spent on the ──
  //    one thing that makes this desk different.
  const feature = document.createElement("section");
  feature.className = "feature";
  feature.innerHTML = `
    <h2>Something broken?<br>We check your real account.</h2>
    <p>Tell us what happened. The AI opens your actual configuration, finds
       what is wrong, shows you the evidence, and only changes anything after
       you say yes. Every fix is verified by a real engineer.</p>
    <button type="button" class="btn-brand" id="featureAsk">Tell us what happened</button>`;
  feature.querySelector("#featureAsk").addEventListener("click", openSupportChat);

  // ── topics + community ────────────────────────────────────────────────
  const docs = window.DOCS || [];
  const counts = {};
  docs.forEach((d) => (counts[d.group] = (counts[d.group] || 0) + 1));
  const topGroups = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const topicsHead = document.createElement("p");
  topicsHead.className = "section-k";
  topicsHead.textContent = "Popular topics";

  const topics = document.createElement("div");
  topics.className = "topics";
  topGroups.forEach(([g, n]) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "cat";
    b.innerHTML = `${g}<span>${n}</span>`;
    b.addEventListener("click", () => openPanel("docs", b, { group: g }));
    topics.appendChild(b);
  });

  const note = document.createElement("p");
  note.className = "hub-note";
  note.id = "hubNote";
  note.hidden = true;
  note.setAttribute("role", "status");

  const stage = document.createElement("div");
  stage.className = "hub";
  stage.append(heart, h1, sub, search, stats, quickHead, tiles, feature,
               topicsHead, topics, Community(COMMUNITY), note);
  root.append(stage);
  return { openSupportChat };
}
