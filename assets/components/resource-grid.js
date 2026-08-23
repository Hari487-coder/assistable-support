/**
 * The four ways in, around the mark.
 *
 * Two of them expand in place and two leave the site, and that difference is
 * the only thing a person needs to predict before clicking. So it is carried by
 * the element itself rather than by styling: a card that expands is a <button>,
 * a card that leaves is an <a> with a real href. Screen readers announce the
 * difference, middle-click and "open in new tab" work on the ones that go
 * somewhere, and nothing has to be explained in copy.
 *
 * Corner placement is a grid area, not a position. On a narrow screen the same
 * four elements reflow into one column with no second markup path, because two
 * markup paths for one list is how the mobile version quietly rots.
 */

const ARROW = `<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
  <path d="M5 12h13M12 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.2"
        stroke-linecap="round" stroke-linejoin="round" /></svg>`;

const LEAVES = `<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
  <path d="M14 5h5v5M19 5l-8 8M18 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
        stroke-linejoin="round" /></svg>`;

function card(resource, onOpen) {
  const opens = resource.kind === "expand";
  const el = document.createElement(opens ? "button" : "a");

  el.className = `card card-${resource.id} at-${resource.corner}`;
  el.dataset.resource = resource.id;

  if (opens) {
    el.type = "button";
    // The panel is built on demand, so it cannot be pointed at until it exists.
    // aria-expanded is the honest half of the contract and is kept in sync by
    // the panel itself.
    el.setAttribute("aria-expanded", "false");
    el.addEventListener("click", () => onOpen(resource, el));
  } else {
    el.href = resource.href;
    el.target = "_blank";
    el.rel = "noopener noreferrer";
  }

  el.innerHTML = `
    <span class="card-icon" aria-hidden="true">${resource.icon}</span>
    <span class="card-label">${resource.label}</span>
    <span class="card-blurb">${resource.blurb}</span>
    <span class="card-go" aria-hidden="true">
      ${opens ? resource.action + ARROW : resource.action + LEAVES}
    </span>`;

  if (!opens) {
    // The visual cue is decorative; the fact has to reach a screen reader too.
    const note = document.createElement("span");
    note.className = "sr-only";
    note.textContent = " (opens in a new tab)";
    el.appendChild(note);
  }
  return el;
}

export function ResourceGrid({ resources, onOpen }) {
  const grid = document.createElement("div");
  grid.className = "grid";
  grid.setAttribute("role", "list");

  for (const r of resources) {
    const item = document.createElement("div");
    item.className = `cell at-${r.corner}`;
    item.setAttribute("role", "listitem");
    item.appendChild(card(r, onOpen));
    grid.appendChild(item);
  }
  return grid;
}
