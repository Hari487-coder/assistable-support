/**
 * Visual Guides.
 *
 * Two states inside one panel: the shelf of guides, and one guide being walked.
 * The player is a port of the one that shipped before this redesign, kept
 * behaviour-for-behaviour: images are pulled down when the guide opens rather
 * than per step, and the previous frame is held until the next has decoded, so
 * a step never flashes empty between pictures.
 *
 * The thumbnail is the guide's own first screenshot. A generic icon would be
 * quicker and would throw away the only thing that makes these guides worth
 * having, which is that they are photographs of the real product.
 */

const esc = (s) =>
  String(s ?? "").replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function preload(guide) {
  guide.steps.forEach((step) => {
    const img = new Image();
    img.src = step.art;
  });
}

/** One guide, walked a step at a time. */
function player(host, guide, { onBack, onStuck }) {
  let i = 0;
  host.innerHTML = `
    <div class="walk">
      <div class="walk-top">
        <button type="button" class="back" id="gBack">
          <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" stroke-width="2.2"
                  stroke-linecap="round" stroke-linejoin="round" /></svg>
          All guides
        </button>
        <h3>${esc(guide.title)}</h3>
        <span class="counter" id="gCount"></span>
      </div>
      <ol class="rail" id="gRail" aria-label="Progress"></ol>
      <div class="stage" id="gStage">
        <figure class="art"><img id="gArt" alt="" /></figure>
        <div class="say"><h4 id="gTitle"></h4><p id="gBody"></p></div>
      </div>
      <div class="walk-foot">
        <button type="button" class="btn ghost" id="gPrev">Back</button>
        <div class="foot-right">
          <button type="button" class="btn quiet" id="gStuck">This did not work</button>
          <button type="button" class="btn primary" id="gNext">Next step</button>
        </div>
      </div>
    </div>`;

  const $ = (id) => host.querySelector("#" + id);
  const rail = $("gRail");
  const art = $("gArt");
  const stage = $("gStage");

  rail.textContent = "";
  guide.steps.forEach((_, n) => {
    const li = document.createElement("li");
    const node = document.createElement("span");
    node.className = "rail-node";
    node.textContent = String(n + 1);
    li.appendChild(node);
    if (n < guide.steps.length - 1) {
      const wire = document.createElement("span");
      wire.className = "rail-wire";
      li.appendChild(wire);
    }
    rail.appendChild(li);
  });

  function render() {
    const step = guide.steps[i];
    const last = i === guide.steps.length - 1;

    $("gCount").textContent = `${i + 1} / ${guide.steps.length}`;
    $("gTitle").textContent = step.title;
    $("gBody").textContent = step.body;

    /**
     * Hold the previous frame until the next has decoded, so a step never
     * flashes empty between pictures - but never wait forever for it.
     *
     * `decode()` can sit unresolved indefinitely when the tab is hidden or the
     * renderer is throttled, and the whole value of these guides is the
     * screenshot. A picture that arrives slightly early is a worse outcome than
     * no picture at all only in theory; in practice the timeout is the floor.
     */
    art.alt = step.artAlt || step.title;
    const next = new Image();
    next.src = step.art;
    let swapped = false;
    const swapIn = () => {
      if (swapped) return;
      swapped = true;
      if (art.getAttribute("src") !== step.art) art.src = step.art;
    };
    if (next.decode) {
      next.decode().then(swapIn, swapIn);
      setTimeout(swapIn, 400);
    } else {
      swapIn();
    }

    [...rail.children].forEach((li, n) => {
      li.className = n < i ? "is-done" : n === i ? "is-current" : "";
    });

    $("gPrev").disabled = i === 0;
    $("gNext").textContent = last ? "Done" : "Next step";

    stage.classList.remove("swap");
    void stage.offsetWidth; // restart the swap
    stage.classList.add("swap");
  }

  $("gBack").addEventListener("click", onBack);
  $("gStuck").addEventListener("click", onStuck);
  $("gPrev").addEventListener("click", () => {
    if (i > 0) { i--; render(); }
  });
  $("gNext").addEventListener("click", () => {
    if (i < guide.steps.length - 1) { i++; render(); }
    else onBack();
  });

  preload(guide);
  render();
  $("gNext").focus({ preventScroll: true });
}

/** The shelf. */
function shelf(host, guides, open) {
  if (!guides.length) {
    host.innerHTML = `<p class="empty">No guides published yet. The chat below can
      still get you to a person.</p>`;
    return;
  }
  host.innerHTML = `<div class="shelf"></div>`;
  const row = host.querySelector(".shelf");

  guides.forEach((g) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "guide";
    b.innerHTML = `
      <span class="guide-shot">
        <img src="${esc(g.steps[0].art)}" alt="" loading="lazy" />
      </span>
      <span class="guide-text">
        <span class="guide-title">${esc(g.title)}</span>
        <span class="guide-meta">${g.steps.length} steps &middot; real screenshots</span>
      </span>`;
    b.addEventListener("click", () => open(g));
    row.appendChild(b);
  });
}

export function GuidesPanel({ guides, onStuck }) {
  return function render(host) {
    const show = () => shelf(host, guides, (g) =>
      player(host, g, { onBack: show, onStuck }));
    show();
  };
}
