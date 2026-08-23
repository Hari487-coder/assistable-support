/**
 * The mark, and the community line.
 *
 * The heart keeps its beat - two pumps and a long exhale, slow enough to
 * read as breathing rather than alarm - but it sits smaller now, above the
 * question, because on a control room the instruments outrank the badge.
 * What leaves it on each beat is a circular stroke, never a glow: a glow was
 * tried on this mark once before, on the desk, and rejected as sun-like.
 */
export function Heart({ mark }) {
  const el = document.createElement("span");
  el.className = "hub-heart";
  el.innerHTML = `
    <span class="hub-pulse" aria-hidden="true"></span>
    <img class="hub-mark" src="${mark}" alt="Assistable" width="48" height="48" />`;
  return el;
}

/**
 * Community, as a quiet line rather than a tile.
 *
 * Joining a Discord is not the same act as getting help, so it does not get
 * equal billing with the things that answer a question. It gets a footnote
 * that is easy to find and impossible to mistake for support.
 */
export function Community({ discord, skool }) {
  const el = document.createElement("p");
  el.className = "community";
  el.innerHTML = `
    <span class="community-k">Community</span>
    <a href="${discord}" target="_blank" rel="noopener noreferrer">Discord<span class="sr-only"> (opens in a new tab)</span></a>
    <span aria-hidden="true">&middot;</span>
    <a href="${skool}" target="_blank" rel="noopener noreferrer">Skool<span class="sr-only"> (opens in a new tab)</span></a>`;
  return el;
}
