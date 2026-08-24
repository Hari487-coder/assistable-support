/**
 * The support hub as one object rather than four pages.
 *
 * The mark sits at the centre and the four ways in orbit it. Choosing one does
 * not navigate: the centre grows into that experience and the ways in stay on
 * screen, docked to the edge, so switching costs one click instead of a trip
 * back to a home page. The whole point is that a customer in the middle of a
 * problem never loses their place.
 *
 * Everything here is positioned from the centre of the viewport in one fixed
 * coordinate space. That is the load-bearing decision: docking is then just a
 * different offset in the same space, so the two states animate into each other
 * instead of jumping. Positioning the hub in normal flow and the docked rail as
 * fixed would put them in different coordinate systems, and no transition can
 * cross that gap.
 *
 * The panel, the focus trap and the grow-from-origin flight are the ones this
 * page already had. The centre is passed as the origin so the panel grows out
 * of the mark, which is what makes it read as the centre becoming the thing
 * rather than a dialog arriving over it.
 */

const still = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Where each way in sits, as a unit vector from the centre.
 *
 * Read clockwise from the top, and in the same order in the DOM, so the
 * sequence a screen reader hears and the sequence the eye follows are the
 * same one. Tab order that disagrees with the layout is how a radial menu
 * becomes unusable without a mouse.
 */
const SEATS = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

export function Orbit({ mark, ways, onChoose }) {
  const stage = document.createElement("div");
  stage.className = "orbit";

  const ring = document.createElement("div");
  ring.className = "orbit-ring";
  ring.setAttribute("aria-hidden", "true");

  const core = document.createElement("div");
  core.className = "core";
  core.innerHTML = `
    <img class="core-mark" src="${mark}" alt="" />
    <span class="core-say">Pick a way in</span>`;

  /**
   * The ways in are a toolbar, not a list of links.
   *
   * A radial arrangement has no reading direction a browser can infer, so the
   * arrow keys have to be wired by hand. Tab reaches the group once and the
   * arrows move inside it, which is the same contract every other grouped
   * control on the web uses.
   */
  const group = document.createElement("div");
  group.className = "orbit-ways";
  group.setAttribute("role", "toolbar");
  group.setAttribute("aria-label", "Ways to get help");
  group.setAttribute("aria-orientation", "horizontal");

  const buttons = ways.map((way, i) => {
    const [dx, dy] = SEATS[i % SEATS.length];
    const b = document.createElement("button");
    b.type = "button";
    b.className = "sat";
    b.dataset.id = way.id;
    b.style.setProperty("--dx", String(dx));
    b.style.setProperty("--dy", String(dy));
    b.style.setProperty("--seat", String(i));
    b.tabIndex = i === 0 ? 0 : -1;
    b.innerHTML = `
      <span class="sat-disc">${way.icon}</span>
      <span class="sat-label">${way.label}</span>`;
    b.addEventListener("click", () => choose(way.id));
    group.appendChild(b);
    return b;
  });

  group.addEventListener("keydown", (e) => {
    const at = buttons.indexOf(document.activeElement);
    if (at < 0) return;
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (step === undefined) return;
    e.preventDefault();
    // Wraps, because a ring has no first or last one.
    const next = buttons[(at + step + buttons.length) % buttons.length];
    buttons.forEach((b) => { b.tabIndex = b === next ? 0 : -1; });
    next.focus();
  });

  stage.append(ring, core, group);

  /**
   * Tell the ring how much room the page chrome is using.
   *
   * The header and the footer are ordinary flow content and the ring is a
   * fixed layer, so nothing makes them aware of each other. Measuring both and
   * writing the result in as variables is what keeps the composition inside
   * the space that is actually free. It is measured rather than assumed
   * because the footer wraps to two lines on a narrow screen, which is exactly
   * where a hardcoded height would be wrong.
   */
  function fitChrome() {
    const head = document.querySelector(".topbar");
    const foot = document.querySelector(".foot");
    const h = head ? Math.round(head.getBoundingClientRect().height) : 60;
    const f = foot ? Math.round(foot.getBoundingClientRect().height) : 120;
    stage.style.setProperty("--chrome-top", `${h}px`);
    stage.style.setProperty("--chrome-bottom", `${f}px`);
  }

  /**
   * Three ways to stay current, because one of them is not enough.
   *
   * ResizeObserver catches the footer rewrapping without the window changing
   * size, which a resize listener cannot see. But it is delivered as part of
   * the rendering pipeline, so a window resized while the tab is not being
   * painted leaves it holding the old numbers - measured happening, with the
   * header at 71px and the ring still docking against 57. The resize listener
   * covers that, and measuring again at the moment a way in is chosen means
   * the one place the numbers actually matter never reads a stale one.
   */
  const watchChrome = () => {
    fitChrome();
    window.addEventListener("resize", fitChrome, { passive: true });
    if (!("ResizeObserver" in window)) return;
    const ro = new ResizeObserver(fitChrome);
    for (const sel of [".topbar", ".foot"]) {
      const el = document.querySelector(sel);
      if (el) ro.observe(el);
    }
  };
  /*
   * Measured now, not on the next frame.
   *
   * This ran inside requestAnimationFrame, which does not fire at all while
   * the tab is not being painted - a page opened in a background tab would
   * have laid itself out against the fallback numbers and stayed there. The
   * header and footer are already in the document by the time this runs, so
   * reading them synchronously is both simpler and the version that always
   * happens.
   */
  watchChrome();


  let active = null;

  /**
   * Send the chosen one home.
   *
   * It travels to the centre and fades as it arrives, while the panel grows
   * out of the centre to meet it. Two motions reading as one: the way in
   * becomes the thing it opens. The other three dock to the edge and stay
   * live, which is the difference between a hub and four pages.
   */
  function choose(id) {
    if (active === id) return;
    // The rail is about to be placed against these, so read them now.
    fitChrome();
    active = id;
    stage.classList.add("is-open");
    stage.dataset.active = id;

    let slot = 0;
    for (const b of buttons) {
      const isActive = b.dataset.id === id;
      b.classList.toggle("is-active", isActive);
      b.setAttribute("aria-expanded", isActive ? "true" : "false");
      // Docked order follows the ring, so a way in keeps the same neighbours
      // it had in the hub and does not appear to shuffle on every switch.
      if (!isActive) b.style.setProperty("--slot", String(slot++));
    }
    onChoose(id, core);
  }

  function reset() {
    active = null;
    stage.classList.remove("is-open");
    delete stage.dataset.active;
    for (const b of buttons) {
      b.classList.remove("is-active");
      b.setAttribute("aria-expanded", "false");
    }
  }

  /** How far down the docked ring reaches, so a panel can start below it. */
  function railBottom() {
    const cssNum = (name, fallback) => {
      const v = parseFloat(getComputedStyle(stage).getPropertyValue(name));
      return Number.isFinite(v) ? v : fallback;
    };
    // offsetWidth, not the bounding rect: the rect already has the docked
    // scale baked into it, so measuring that and scaling it again would
    // report a ring half the size of the one on screen.
    const laidOut = buttons[0] ? buttons[0].offsetWidth : 90;
    const docked = laidOut * cssNum("--dock-scale", 0.62);
    return cssNum("--chrome-top", 60) + 12 + docked + 16;
  }

  /** Put the keyboard back where it came from, on the way in that was open. */
  function focusWay(id) {
    const b = buttons.find((x) => x.dataset.id === id);
    if (!b) return;
    buttons.forEach((x) => { x.tabIndex = x === b ? 0 : -1; });
    if (!still()) b.focus({ preventScroll: true });
    else b.focus();
  }

  return {
    el: stage, core, choose, reset, focusWay, railBottom,
    /** which way in is open, or null. Switching needs to tell being replaced
     *  apart from being closed, and only this can. */
    get active() { return active; },
  };
}
