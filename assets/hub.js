/**
 * Support hub, in assistable.ai's own language.
 *
 * Reverse-engineered from the live brand site rather than approximated:
 * Inter with big tight bold headlines, solid #0071eb actions, flat bordered
 * cards at 20px, and the signature filled grey panel at 24px - which this
 * page spends on the support route: tell us what happened, and the request
 * goes to the Assistable support team.
 */
import { Orbit } from "./components/orbit.js";
import { SupportPanel, CommunityPanel } from "./components/channels.js";
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

const SUPPORT_INTAKE = "52feed97d498@intake.linear.app";
const SUPPORT_BODY = [
  "Account email:",
  "Assistant or sub-account (if applicable):",
  "What happened?",
  "What did you expect instead?",
  "When did it happen?",
  "",
  "Please do not include passwords, API keys, or other secrets.",
].join("\n");
const SUPPORT_MAILTO = `mailto:${SUPPORT_INTAKE}?subject=${encodeURIComponent("Assistable support request")}&body=${encodeURIComponent(SUPPORT_BODY)}`;

/**
 * The community, and the link that finally works.
 *
 * Every invite this page has carried was dead: discord.gg/Puse4ka7, what
 * support agents were sending customers, and discord.gg/HPqCJWZU, the link on
 * assistable.ai itself. Both return Unknown Invite. The stand-in was the server
 * URL, which only opens for somebody already inside it, so for a new customer
 * it did nothing at all.
 *
 * This one is published in Assistable's own documentation and was checked
 * against Discord before being used here. If it ever stops working, check it
 * the same way rather than swapping in another guess.
 */
const COMMUNITY = {
  discord: "https://discord.gg/5v4WSM3YwP",
  skool: "https://www.skool.com/assistable",
};

const ICON_COMMUNITY = `<svg viewBox="0 0 24 24" width="20" height="20">
  <circle cx="9" cy="8" r="3.1" fill="none" stroke="currentColor" stroke-width="1.8"/>
  <path d="M3.5 19a5.5 5.5 0 0 1 11 0" fill="none" stroke="currentColor" stroke-width="1.8"
        stroke-linecap="round"/>
  <path d="M16 5.4a3.1 3.1 0 0 1 0 5.2M17.6 14.2A5.5 5.5 0 0 1 20.5 19"
        fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;

/**
 * The four ways in, clockwise from the top.
 *
 * Ordered by how many people need each one, not by how much we like it. Guides
 * and answers carry almost everything; email support is for when they do not;
 * community is where you go when you would rather ask a person.
 */
const WAYS = [
  {
    id: "guides", icon: ICONS.guides,
    label: "Visual guides",
    panelTitle: "Pictures of the real screens, with the button circled",
  },
  {
    id: "docs", icon: ICONS.docs,
    label: "Support docs",
    panelTitle: "Answers to what people actually ask us",
  },
  {
    id: "support", icon: ICONS.ask,
    label: "Email support",
    panelTitle: "Tell us what happened, and our team will help",
  },
  {
    id: "community", icon: ICON_COMMUNITY,
    label: "Community",
    panelTitle: "Where people building on Assistable talk",
  },
];

/**
 * Open a prefilled message to the verified Linear support intake. Replies
 * arrive from Assistable Support and remain on the same email thread.
 */
function openSupportRequest() {
  window.location.href = SUPPORT_MAILTO;
  const note = document.getElementById("hubNote");
  if (note) {
    note.textContent = `If your email app did not open, send your message to ${SUPPORT_INTAKE}.`;
    note.hidden = false;
    setTimeout(() => { note.hidden = true; }, 8000);
  }
  return true;
}

/**
 * Everything a reader can be shown, from both places it comes from.
 *
 * The knowledge base answers questions this team gets asked; the imported
 * documentation explains how the product works. They are different kinds of
 * writing and there is no point pretending otherwise, but a person searching
 * "why is my AI not replying" wants whichever one answers it, so search and
 * browsing run over the pair.
 *
 * The knowledge base goes first. Those entries were written in reply to a real
 * customer, so where both cover the same ground it is the one that answers the
 * question as asked.
 */
const allDocs = () => [...(window.DOCS || []), ...(window.DOCS_SITE || [])];

export function SupportHub(root) {
  const panel = ExpandedResourcePanel({ root });

  const render = {
    guides: GuidesPanel({
      guides: window.WALKTHROUGHS || [],
      onStuck: () => { panel.close(); openSupportRequest(); },
    }),
    docs: DocsPanel({
      docs: allDocs(),
      onAsk: () => { panel.close(); openSupportRequest(); },
    }),
    support: SupportPanel({ href: SUPPORT_MAILTO, email: SUPPORT_INTAKE }),
    community: CommunityPanel(COMMUNITY),
  };

  const wayFor = (id) => WAYS.find((w) => w.id === id);

  const orbit = Orbit({
    mark: "assets/brand/assistable-mark.png",
    ways: WAYS,
    /**
     * The panel grows out of the mark, not out of the button that was pressed.
     * That is the whole illusion: the centre becomes the thing you chose, while
     * the thing you chose travels in to meet it.
     */
    onChoose: (id, core) => {
      panel.show(wayFor(id), byId(id), (body, api) => render[id](body, api), {
        growFrom: core,
        topInset: orbit.railBottom(),
        /**
         * Only go home if this panel was actually closed.
         *
         * Choosing a second way in opens its panel, which closes the first
         * one on the way past. That close used to fire this and send the ring
         * back to the hub a frame after it had opened, so switching looked
         * right (the new panel was there) while the circles quietly sat in
         * their hub seats behind it. Being replaced is not being closed.
         */
        onClose: () => {
          if (orbit.active !== id) return;
          orbit.reset();
          orbit.focusWay(id);
        },
      });
    },
  });

  const byId = (id) => orbit.el.querySelector(`.sat[data-id="${id}"]`);

  const note = document.createElement("p");
  note.className = "hub-note";
  note.id = "hubNote";
  note.hidden = true;
  note.setAttribute("role", "status");

  root.append(orbit.el, note);

  /**
   * Counted from what is published, never claimed. The line sits under the
   * ring rather than inside it, so the centre stays the mark.
   */
  const docsAll = allDocs();
  const count = document.createElement("p");
  count.className = "orbit-count";
  count.textContent =
    `${docsAll.length} answers, ${new Set(docsAll.map((d) => d.group)).size} topics, ` +
    `${(window.WALKTHROUGHS || []).length} guide${(window.WALKTHROUGHS || []).length === 1 ? "" : "s"}`;
  orbit.el.appendChild(count);

  return { openSupportRequest, orbit };
}
