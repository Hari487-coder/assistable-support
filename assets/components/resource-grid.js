/**
 * The four ways in, on a ring around the mark.
 *
 * Same system as the internal desk's Overview, because that is the design
 * this page grew out of: a small orb on a visible track, its name written
 * underneath, not a card big enough to need a paragraph inside it.
 *
 * Two of them expand in place and two leave the site, and that difference is
 * carried by the element itself rather than by styling: an orb that expands
 * is a <button>, an orb that leaves is an <a> with a real href. Screen
 * readers announce the difference, middle-click and "open in new tab" work on
 * the ones that go somewhere, and nothing has to be explained in copy.
 *
 * Each orb sits inside a zero-size .pos point that owns its place on the
 * ring. Position and animation live on different elements on purpose: a CSS
 * animation on the element that carries the positioning transform replaces
 * that transform outright, and the orb lands at the centre of the page.
 */

function card(resource, onOpen) {
  const opens = resource.kind === "expand";
  const el = document.createElement(opens ? "button" : "a");

  el.className = `card card-${resource.id}`;
  el.dataset.resource = resource.id;

  if (opens) {
    el.type = "button";
    el.setAttribute("aria-expanded", "false");
    el.addEventListener("click", () => onOpen(resource, el));
  } else {
    el.href = resource.href;
    el.target = "_blank";
    el.rel = "noopener noreferrer";
  }

  // The blurb is for screen readers now - the ring says it visually with a
  // name alone, the way the desk's orbs do.
  el.innerHTML = `
    <span class="card-icon" aria-hidden="true">${resource.icon}</span>
    <span class="card-label">${resource.label}</span>
    <span class="card-blurb">${resource.blurb}</span>`;

  if (!opens) {
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
    item.className = "cell";
    item.setAttribute("role", "listitem");

    const pos = document.createElement("div");
    pos.className = `pos at-${r.corner}`;
    pos.appendChild(card(r, onOpen));

    item.appendChild(pos);
    grid.appendChild(item);
  }
  return grid;
}
