/**
 * Support hub.
 *
 * Four ways in around one mark. Two of them expand in place; two leave for the
 * community. The page holds no state beyond which panel is open, because there
 * is nothing else worth remembering.
 *
 * The chat widget is deliberately untouched. It is the route that ends with an
 * engineer inside the customer's account, it was working before this redesign,
 * and a redesign is not a reason to re-plumb the one path that matters most.
 * The hub only borrows its launcher.
 */
import { Heart, HubFooter } from "./components/brand.js";
import { ResourceGrid } from "./components/resource-grid.js";
import { ExpandedResourcePanel } from "./components/expanded-panel.js";
import { GuidesPanel } from "./components/guides.js";
import { DocsPanel } from "./components/docs.js";

const ICONS = {
  guides: `<svg viewBox="0 0 24 24" width="22" height="22">
    <rect x="3" y="4" width="18" height="13" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M8 21h8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <circle cx="12" cy="10.5" r="2.6" fill="none" stroke="currentColor" stroke-width="1.8"/>
    <path d="M12 13.1v2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  docs: `<svg viewBox="0 0 24 24" width="22" height="22">
    <path d="M6 3h8l4 4v14H6z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M14 3v4h4M9 12h6M9 16h4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  discord: `<svg viewBox="0 0 24 24" width="22" height="22">
    <path d="M9 5.5a13 13 0 0 0-4.2 1.2C3.2 9.4 2.7 12 2.9 14.7A13 13 0 0 0 7 16.7l.9-1.4"
          fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M15 5.5a13 13 0 0 1 4.2 1.2c1.6 2.7 2.1 5.3 1.9 8a13 13 0 0 1-4.1 2l-.9-1.4"
          fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
    <ellipse cx="9.2" cy="12.2" rx="1.5" ry="1.8" fill="currentColor"/>
    <ellipse cx="14.8" cy="12.2" rx="1.5" ry="1.8" fill="currentColor"/></svg>`,
  skool: `<svg viewBox="0 0 24 24" width="22" height="22">
    <path d="M12 4L2.5 9 12 14l9.5-5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M6 11.5V16c0 1.4 2.7 2.6 6 2.6s6-1.2 6-2.6v-4.5"
          fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
};

const RESOURCES = [
  {
    id: "guides", label: "Visual Guides", corner: "tl", kind: "expand",
    blurb: "Step-by-step guides to help you get things done.",
    action: "Browse guides", icon: ICONS.guides,
    panelTitle: "Pictures of the real screens, with the button circled",
  },
  {
    id: "docs", label: "Help Docs", corner: "tr", kind: "expand",
    blurb: "Find answers, documentation and troubleshooting guides.",
    action: "Search help", icon: ICONS.docs,
    panelTitle: "Answers to what people actually ask us",
  },
  {
    id: "discord", label: "Discord", corner: "bl", kind: "link",
    href: "https://discord.gg/Puse4ka7",
    blurb: "Talk with the Assistable community.",
    action: "Open Discord", icon: ICONS.discord,
  },
  {
    id: "skool", label: "Skool", corner: "br", kind: "link",
    href: "https://www.skool.com/assistable",
    blurb: "Learn, share and grow with the community.",
    action: "Open Skool", icon: ICONS.skool,
  },
];

/**
 * Open the support chat by clicking the widget's own launcher inside its shadow
 * root.
 *
 * Targeted by label. A bare "button" selector picks up the teaser toast's close
 * button whenever a teaser is showing, which dismisses the toast and leaves the
 * chat shut - carried over from the previous build, where that was a real bug.
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
  // Say so out loud. Silently doing nothing is how somebody decides the page is
  // broken and leaves.
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

  const renderers = {
    guides: GuidesPanel({
      guides: window.WALKTHROUGHS || [],
      onStuck: () => { panel.close(); openSupportChat(); },
    }),
    docs: DocsPanel({
      docs: window.DOCS || [],
      onAsk: () => { panel.close(); openSupportChat(); },
    }),
  };

  // The cluster: four cards docked at the corners of the heart itself, laid
  // out by one grid so the narrow screen is a re-flow, not a second design.
  const cluster = document.createElement("div");
  cluster.className = "cluster";
  cluster.append(
    ResourceGrid({
      resources: RESOURCES,
      onOpen: (resource, card) => panel.show(resource, card, renderers[resource.id]),
    }),
    Heart({ mark: "assets/brand/assistable-mark.png" }),
  );

  const stage = document.createElement("div");
  stage.className = "hub";
  stage.append(cluster, HubFooter({ onAsk: openSupportChat }));

  const note = document.createElement("p");
  note.className = "hub-note";
  note.id = "hubNote";
  note.hidden = true;
  note.setAttribute("role", "status");

  root.append(stage, note);
  return { openSupportChat };
}
