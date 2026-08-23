/**
 * The middle of the page.
 *
 * The mark is the anchor and stays quiet: no ring, no glow, no orbit. Four
 * cards already point at it by sitting around it, and adding a device to say
 * "this is the centre" to something that is visibly the centre is the kind of
 * decoration this page is trying not to have.
 *
 * It does carry one line of function. The four cards are all self-serve, and
 * the fastest route for somebody whose account is broken - tell us, we go in
 * and fix it - is not one of them. That route still exists in the chat widget,
 * so the centre names it rather than leaving it to a floating button in the
 * corner that people read as a bot.
 */
export function CenterBrand({ mark, onAsk }) {
  const el = document.createElement("div");
  el.className = "hub-brand";

  el.innerHTML = `
    <img class="hub-mark" src="${mark}" alt="Assistable" width="60" height="60" />
    <p class="hub-line">Whatever you need, start here.</p>
    <button type="button" class="hub-ask" id="hubAsk">
      Something broken? Tell us
    </button>`;

  el.querySelector("#hubAsk").addEventListener("click", onAsk);
  return el;
}
