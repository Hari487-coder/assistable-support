/**
 * Quick help: four ways in, and the split that matters.
 *
 * Two of these open reference material; two of them start a conversation
 * with something that can read the actual account. "Ask us" sits beside the
 * docs as an equal, not below them - a customer who already knows something
 * is broken should never be routed through documentation first.
 *
 * All four are buttons. The community links moved to their own quiet line,
 * because joining a Discord is not the same kind of act as getting help, and
 * putting them in one grid pretended it was.
 */

const ARROW = `<svg class="tile-arrow" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
  <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.1"
        stroke-linecap="round" stroke-linejoin="round" /></svg>`;

function tile(resource, onOpen) {
  const el = document.createElement("button");
  el.type = "button";
  el.className = `tile tile-${resource.id} at-${resource.corner}`;
  el.dataset.resource = resource.id;

  if (resource.kind === "expand") {
    // The panel grows out of this tile, and the tile says so to a screen
    // reader. Chat tiles have nothing to expand - they hand over to the chat.
    el.setAttribute("aria-expanded", "false");
  }
  el.addEventListener("click", () => onOpen(resource, el));

  el.innerHTML = `
    <span class="tile-icon" aria-hidden="true">${resource.icon}</span>
    <span class="tile-text">
      <span class="tile-label">${resource.label}</span>
      <span class="tile-blurb">${resource.blurb}</span>
    </span>
    ${ARROW}`;
  return el;
}

export function QuickHelp({ tiles, onOpen }) {
  const grid = document.createElement("div");
  grid.className = "tiles";
  grid.setAttribute("role", "list");

  for (const r of tiles) {
    const item = document.createElement("div");
    item.className = "cell";
    item.setAttribute("role", "listitem");
    item.appendChild(tile(r, onOpen));
    grid.appendChild(item);
  }
  return grid;
}
