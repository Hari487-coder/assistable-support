# Assistable support page

The static support hub brings together product guides, support docs, community, and email
support. The support panel opens a prefilled email addressed to Assistable's support
intake. The customer sends it from their email app, and the support team can follow up by
email.

## Type

Outfit for display, Manrope for body.

Outfit is geometric and circle-based, which is the same construction as the Assistable
mark, so the headings echo the logo instead of sitting next to it. Manrope carries the
body: warmer and easier to read in a sentence than a display face would be.

The portal itself runs Inter. That is the correct choice inside a dense product UI and
the wrong one here, where the page has a handful of words and they have to do all the
work.


## Support intake

The support panel opens the visitor's configured email app with a request addressed to the
support intake. Its template asks for the customer's account email, affected assistant,
what happened, expected behavior, and timing. Customers can attach relevant files in their
email app. The page asks customers not to include passwords or API keys.

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

## Step art

The steps use drawn SVG illustrations (`assets/steps/*.svg`), not screenshots.

That is a deliberate choice. Captures from the live portal contained another customer's
prompt, the account balance and a support user's email address. Illustrations leak
nothing, survive a UI reshuffle, and can point at the single control that matters instead
of showing a whole busy screen. They are drawn in the brand palette so they read as
diagrams rather than as fake screenshots.

Brand assets live in `assets/brand/`. The mark is cropped from the supplied cover.

Placeholder names: the assistant names in step 2 were replaced with "Front desk assistant"
and "Sales assistant". The real ones were internal test names on our own account and had
no business on a customer-facing page. Only the labels changed; the screen is real.

The raw captures in `assets/steps/raw/` are gitignored - they are wider than the cropped
versions and show more of the account than a public page should.
