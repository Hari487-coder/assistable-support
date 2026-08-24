/**
 * The two ways in that are not a library of answers.
 *
 * Both are short on purpose. A panel whose only job is to hand somebody to a
 * chat or to a community should not make them read a page first.
 */

const esc = (s) =>
  String(s ?? "").replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

/**
 * The debugging bot.
 *
 * The chat itself is the platform's own widget, and it stays that way. It is
 * a fixed overlay owned by another script, so lifting it into this panel would
 * mean reparenting somebody else's DOM and re-breaking it on every update of
 * theirs. It already opens over this page without leaving it, which is the
 * thing that actually matters, so this panel is the doorway and the widget is
 * the room.
 *
 * The list is here because the bot reads real accounts. What it can find
 * depends almost entirely on whether it was told which account to look in, and
 * a customer who knows that up front gets an answer in one message instead of
 * four.
 */
export function BotPanel({ onOpenChat }) {
  return function render(body) {
    body.innerHTML = `
      <div class="chan">
        <p class="chan-lede">Describe what went wrong and the assistant opens your
          actual account, reads the configuration, and tells you what it finds.
          It shows the evidence before it changes anything, and it changes
          nothing until you say yes.</p>

        <div class="chan-help">
          <h4>It gets there faster if you include</h4>
          <ul>
            <li>The email on your Assistable account</li>
            <li>Which assistant or sub-account it happened in</li>
            <li>Roughly when, and what you expected instead</li>
          </ul>
        </div>

        <button type="button" class="btn-brand chan-go" id="chanChat">
          Tell us what happened
        </button>
        <p class="chan-foot">A real engineer reviews every change the assistant
          proposes. Nothing is applied on your account without that.</p>
      </div>`;

    body.querySelector("#chanChat").addEventListener("click", onOpenChat);
  };
}

/**
 * The community.
 *
 * One destination, said plainly. Every invite this page has carried until now
 * was dead, including the one on assistable.ai itself, so the link is the only
 * part of this panel worth being careful about.
 */
export function CommunityPanel({ discord, skool }) {
  return function render(body) {
    body.innerHTML = `
      <div class="chan">
        <p class="chan-lede">Where the people building on Assistable talk to each
          other. Someone has usually hit your problem already, and the answers
          arrive faster than a ticket does.</p>

        <a class="btn-brand chan-go" href="${esc(discord)}" target="_blank" rel="noopener noreferrer">
          Join the Discord<span class="sr-only"> (opens in a new tab)</span>
        </a>

        <div class="chan-help">
          <h4>Good places to start</h4>
          <ul>
            <li>Ask in the help channel, with your account email left out</li>
            <li>Search first: most questions have been answered in there</li>
            <li>Anything account-specific belongs in the chat, not the server</li>
          </ul>
        </div>

        <p class="chan-foot">There is a course community too, if you want the
          longer material.
          <a href="${esc(skool)}" target="_blank" rel="noopener noreferrer">Skool<span
            class="sr-only"> (opens in a new tab)</span></a>.</p>
      </div>`;
  };
}
