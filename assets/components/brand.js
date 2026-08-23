/**
 * The middle of the page.
 *
 * The mark sits in a square of card, and it beats: two pumps and a long
 * exhale, slow enough to read as breathing rather than alarm. What leaves the
 * box on each beat is a stroke that echoes the box's own shape - never a glow.
 * A radial glow was tried on this mark once before, on the desk, and rejected
 * as sun-like; that ruling stands here.
 *
 * The centre also carries one line of function. The four cards are all
 * self-serve, and the fastest route for somebody whose account is broken -
 * tell us, we go in and fix it - is not one of them. That route lives in the
 * chat widget, so the centre names it rather than leaving it to a floating
 * button in the corner that people read as a bot.
 */
export function CenterBrand({ mark, onAsk }) {
  const el = document.createElement("div");
  el.className = "hub-brand";

  el.innerHTML = `
    <span class="hub-heart">
      <span class="hub-pulse" aria-hidden="true"></span>
      <img class="hub-mark" src="${mark}" alt="Assistable" width="54" height="54" />
    </span>
    <p class="hub-line">Whatever you need, start here.</p>
    <button type="button" class="hub-ask" id="hubAsk">
      Something broken? Tell us
    </button>`;

  el.querySelector("#hubAsk").addEventListener("click", onAsk);
  return el;
}
