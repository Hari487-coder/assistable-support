# Assistable support page

One page, two ways to get unstuck:

- **Show me how** — a visual walkthrough that advances one step at a time. Beta: one
  walkthrough (outbound calls) so far.
- **Something is broken** — the v2 intake assistant, embedded as a chat launcher. It
  raises a ticket and a support engineer opens the customer's live account.

## Run it

```bash
python -m http.server 4180 --directory assistable-support-page
```

Or `preview_start` the `support-page` config in the workspace `.claude/launch.json`.

## Adding a walkthrough

Content only, no code. Append to `assets/walkthroughs.js`:

```js
{
  id: "assign-a-number",
  title: "Assign a phone number",
  triggers: ["assign number", "phone number", "buy a number"],
  steps: [{ title: "...", body: "...", shot: "assets/steps/x.png", shotCaption: "..." }],
}
```

Matching is deliberate keyword scoring, not a model. With one walkthrough live, a
confident wrong answer is worse than an honest "not covered yet", and this costs nothing
to run.

## Screenshots

**The step images do not exist yet**, so every step renders a labelled "Screenshot
coming" block with a caption describing what the picture will show. Drop a PNG at the
`shot` path and it appears with no code change.

They are missing on purpose. The obvious captures from the live portal included a real
customer's prompt, the account balance and a support user's email address, none of which
belongs on a customer-facing page. Capture them from a clean demo sub-account, cropped to
the control being described.

## The embedded bot

`index.html` loads `botdisplay.com/chat-widget.js` with:

- `data-assistant-id` — the v2 intake assistant
- `data-account-id` — the sub-account id the chat endpoint accepts

Verified loading and rendering on localhost. Before this goes on a real domain, check
whether the widget enforces a hostname allow-list, and add the domain if so.
