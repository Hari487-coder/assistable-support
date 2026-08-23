/**
 * The middle of the page, in two pieces.
 *
 * The heart - the beating mark in its circle - lives inside the cluster grid
 * so the four orbs can dock around it, and is built apart from the tagline
 * and the ask button that sit below the whole cluster.
 *
 * The beat itself: two pumps and a long exhale, slow enough to read as
 * breathing rather than alarm. What leaves the box on each beat is a stroke
 * that echoes the box's own shape - never a glow. A radial glow was tried on
 * this mark once before, on the desk, and rejected as sun-like; that ruling
 * stands here.
 */
export function Heart({ mark }) {
  const el = document.createElement("span");
  el.className = "hub-heart";
  el.innerHTML = `
    <span class="hub-pulse" aria-hidden="true"></span>
    <img class="hub-mark" src="${mark}" alt="Assistable" width="54" height="54" />`;
  return el;
}

/**
 * One line of function under the cluster.
 *
 * The four cards are all self-serve, and the fastest route for somebody whose
 * account is broken - tell us, we go in and fix it - is not one of them. That
 * route lives in the chat widget, so the page names it here rather than
 * leaving it to a floating button in the corner that people read as a bot.
 */
export function HubFooter({ onAsk }) {
  const el = document.createElement("div");
  el.className = "hub-footer";
  el.innerHTML = `
    <p class="hub-line">Whatever you need, start here.</p>
    <button type="button" class="hub-ask" id="hubAsk">
      Something broken? Tell us
    </button>`;
  el.querySelector("#hubAsk").addEventListener("click", onAsk);
  return el;
}
