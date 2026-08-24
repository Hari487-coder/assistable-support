/**
 * The card becoming the destination.
 *
 * Not a modal that appears over a card. The panel starts life at the card's
 * exact rectangle and grows from there, so the thing you clicked is the thing
 * you are now looking at. That is done by measuring both rectangles and
 * animating between them - a first-last-invert - because the start position is
 * wherever that card happens to be on this viewport, and CSS cannot know it.
 *
 * Closing runs the same journey backwards and lands on the card, which is why
 * the layout underneath is never disturbed: nothing moved, so there is nothing
 * to restore.
 *
 * Everything a dialog owes a keyboard user is here and none of it is optional:
 * focus moves in, Tab is trapped, Escape closes, focus returns to the card that
 * opened it. A panel that traps focus without returning it strands people.
 */

const SPRING = "cubic-bezier(.22, 1, .28, 1)";
const OPEN_MS = 460;
const CLOSE_MS = 320;

const FOCUSABLE = [
  "a[href]", "button:not([disabled])", "input:not([disabled])",
  "select:not([disabled])", "textarea:not([disabled])", "[tabindex]:not([tabindex='-1'])",
].join(",");

const stillness = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function ExpandedResourcePanel({ root }) {
  let open = null;      // { resource, card, el, scrim, restoreTo, onKey }

  function focusables(el) {
    return [...el.querySelectorAll(FOCUSABLE)].filter(
      (n) => n.offsetParent !== null || n === document.activeElement,
    );
  }

  /**
   * The panel opens centred.
   *
   * Corner-anchoring made sense when the cards were docked around the mark;
   * on the brand layout the tiles sit low on the page, so an anchored panel
   * hugged the bottom edge and read as misplaced. The dialog now takes the
   * centre of the viewport - the FLIP still grows it out of whatever was
   * pressed, so the connection to the origin survives the move.
   */
  /**
   * Centred in the room it actually has.
   *
   * `topInset` is whatever is parked above the panel and must stay reachable:
   * on the orbital hub that is the docked ring, which is the way out of this
   * panel and into the next one. Centring on the whole window put the panel
   * underneath it, so the ways in were visible and unclickable.
   */
  function place(el, topInset = 0) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const { width: w, height: h } = el.getBoundingClientRect();
    el.style.left = Math.max(10, (vw - w) / 2) + "px";
    el.style.top = topInset + Math.max(10, (vh - topInset - h) / 2) + "px";
  }

  /** Grow from the pressed element's rectangle to the panel's own. */
  function flip(el, from, fromRadius) {
    const to = el.getBoundingClientRect();
    if (stillness()) return null;

    const dx = from.left - to.left;
    const dy = from.top - to.top;
    const sx = Math.max(from.width / to.width, 0.05);
    const sy = Math.max(from.height / to.height, 0.05);

    // Born in the shape of whatever was pressed - a circle, a tile, a search
    // result row - and squaring off as it grows. The pressed thing becomes
    // the sheet; a sheet does not replace it.
    return el.animate(
      [
        { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, opacity: 0.35, borderRadius: fromRadius },
        { transform: "none", opacity: 1, borderRadius: "20px" },
      ],
      { duration: OPEN_MS, easing: SPRING, fill: "both" },
    );
  }

  function close() {
    if (!open) return;
    const { el, scrim, card, grower, restoreTo, onKey, fromRadius, onClose } = open;
    const from = (grower ?? card).getBoundingClientRect();
    const to = el.getBoundingClientRect();

    document.removeEventListener("keydown", onKey, true);
    card.setAttribute("aria-expanded", "false");
    root.classList.remove("is-expanded");
    scrim.style.opacity = "0";

    /**
     * Tear-down must not depend on the animation finishing.
     *
     * It was hung off `onfinish`, which never fires if the tab is hidden, if the
     * animation is cancelled, or if the browser declines to run it at all. The
     * panel then stays in the document with focus trapped inside it and no way
     * out but a reload - the worst failure this component has, and invisible
     * until somebody switches tab mid-close.
     *
     * So the animation is decoration and the timer is the contract. Whichever
     * arrives first wins, and it runs exactly once.
     */
    let torn = false;
    const done = () => {
      if (torn) return;
      torn = true;
      el.remove();
      scrim.remove();
      // Back to the card that opened it, so a keyboard user resumes where they
      // were rather than at the top of the document.
      // The caller goes first: it may want to move focus somewhere better than
      // the control that opened this, and it cannot once focus has landed.
      if (onClose) onClose();
      else if (restoreTo && document.contains(restoreTo)) restoreTo.focus();
    };

    open = null;

    if (stillness()) return done();

    const flight = el.animate(
      [
        { transform: "none", opacity: 1, borderRadius: "20px" },
        {
          transform: `translate(${from.left - to.left}px, ${from.top - to.top}px)
                      scale(${from.width / to.width}, ${from.height / to.height})`,
          opacity: 0.25,
          borderRadius: fromRadius,
        },
      ],
      { duration: CLOSE_MS, easing: "cubic-bezier(.4, 0, .2, 1)", fill: "both" },
    );
    flight.addEventListener("finish", done);
    flight.addEventListener("cancel", done);
    setTimeout(done, CLOSE_MS + 120);
  }

  /**
   * `card` is the control that opened this: it carries `aria-expanded` and it
   * gets the keyboard back on close. `opts.growFrom` is the rectangle the panel
   * flies out of, which is not always the same element - the orbital hub opens
   * from a button on the ring but grows out of the mark in the middle, so the
   * centre reads as becoming the thing rather than a dialog arriving over it.
   * `opts.onClose` lets whatever opened the panel put itself back.
   */
  function show(resource, card, render, opts = {}) {
    if (open) close();

    const grower = opts.growFrom ?? card;
    const from = grower.getBoundingClientRect();

    const scrim = document.createElement("div");
    scrim.className = "scrim";
    scrim.addEventListener("click", close);

    const el = document.createElement("section");
    el.className = `panel panel-${resource.id}`;
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("aria-label", resource.label);
    el.tabIndex = -1;

    const head = document.createElement("header");
    head.className = "panel-head";
    // Title from the left, close from the right: the first two plates land
    // together from opposite sides.
    head.innerHTML = `
      <div class="asm asm-l" style="--i:0">
        <p class="panel-kicker">${resource.label}</p>
        <h2 class="panel-title">${resource.panelTitle}</h2>
      </div>`;

    const shut = document.createElement("button");
    shut.type = "button";
    shut.className = "panel-close asm asm-r";
    shut.style.setProperty("--i", "0");
    // Labelled, not just an icon: "close" alone does not say what closes.
    shut.setAttribute("aria-label", `Close ${resource.label}`);
    shut.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2.2"
            stroke-linecap="round" /></svg><span>Close</span>`;
    shut.addEventListener("click", close);
    head.appendChild(shut);

    const body = document.createElement("div");
    body.className = "panel-body";

    el.append(head, body);
    document.body.append(scrim, el);

    // Content is rendered after the panel is in the document, so anything that
    // measures itself measures the real thing. Placement happens before the
    // FLIP measures its destination, or it would animate to the wrong spot.
    render(body, { close });
    place(el, opts.topInset ?? 0);

    const fromRadius = getComputedStyle(grower).borderRadius || "16px";
    requestAnimationFrame(() => scrim.classList.add("on"));
    flip(el, from, fromRadius);

    card.setAttribute("aria-expanded", "true");
    root.classList.add("is-expanded");

    const onKey = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables(el);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      // Wrap, so Tab never walks out of the dialog into the page behind it.
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey, true);

    open = { resource, card, grower, el, scrim, restoreTo: card, onKey, fromRadius,
             onClose: opts.onClose };

    // Into the panel, on the first thing worth reaching rather than the close
    // button - landing on Close reads as "the way out is the main action".
    const target = focusables(body)[0] || el;
    target.focus({ preventScroll: true });
  }

  return { show, close, get isOpen() { return Boolean(open); } };
}
