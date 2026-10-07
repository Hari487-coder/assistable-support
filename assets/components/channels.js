/**
 * The support and community paths that are not a library of answers.
 *
 * Both are short on purpose. A panel whose job is to hand somebody to support
 * or to a community should not make them read a page first.
 */

const esc = (s) =>
  String(s ?? "").replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

/**
 * Human support through the Linear email intake. The customer sends a
 * prefilled email and can continue the same ticket by replying to the receipt.
 */
export function SupportPanel({ href, email }) {
  return function render(body) {
    body.innerHTML = `
      <div class="chan">
        <p class="chan-lede">Email our support team. This opens a draft addressed
          to our support intake. Send the email to submit your request; our team
          can follow up by email.</p>

        <div class="chan-help">
          <h4>Include these details so we can investigate</h4>
          <ul>
            <li>The email on your Assistable account</li>
            <li>Which assistant or sub-account it happened in</li>
            <li>What happened, when, and what you expected instead</li>
          </ul>
        </div>

        <a class="btn-brand chan-go" href="${esc(href)}">
          Write to support
        </a>
        <p class="chan-foot">Your email app opens with a message template. Do not
          include passwords, API keys, or other secrets. If no email app opens,
          copy the intake address: <a href="mailto:${esc(email)}">${esc(email)}</a>.</p>
      </div>`;
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
            <li>For anything account-specific, contact support by email</li>
          </ul>
        </div>

        <p class="chan-foot">There is a course community too, if you want the
          longer material.
          <a href="${esc(skool)}" target="_blank" rel="noopener noreferrer">Skool<span
            class="sr-only"> (opens in a new tab)</span></a>.</p>
      </div>`;
  };
}
