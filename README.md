# Assistable support page

The landing view is one decision, two doors, one line each:

**Walk me through it** — follow the real screens at your own pace. Beta: one guide
(outbound calls).

**Something is broken in my account** — opens the chat; we go into the account directly
and make the fix.

The title is the customer's situation in their own words, and the line under it is the
promise. That is a confidence claim: it is the right one while a human works every ticket
and the escalation rate is near zero, so revisit it if volume ever outgrows that.

Each door carries a kicker, a title in the customer's voice, and one sentence saying what
actually happens. A version with only a title and four words under it was too bare to
choose from; a version with a four-item facts list per door was a wall of text.

The subtitles say only the thing that actually separates them: whether anyone goes into
your account. An earlier version listed four facts per door and read as a wall of text to
someone who is already stuck.

The two icons are deliberately the same object with a different instrument on it - the
same screen, pointed at for guides, put under a magnifier for support. That reads as one
system rather than two unrelated pictures, and it says what each door does without a
caption.

Picking the support door opens the chat and **stays on the landing view**, so closing the
chat leaves you where you started.

## Type

Outfit for display, Manrope for body.

Outfit is geometric and circle-based, which is the same construction as the Assistable
mark, so the headings echo the logo instead of sitting next to it. Manrope carries the
body: warmer and easier to read in a sentence than a display face would be.

The portal itself runs Inter. That is the correct choice inside a dense product UI and
the wrong one here, where the page has a handful of words and they have to do all the
work.

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

## Opening the chat

The "Something is broken in my account" chip opens the chat by clicking the widget's
launcher inside its shadow root, targeted as `button[aria-label="Open chat"]`.

Two traps here:

- A bare `button` selector hits the teaser toast's close button when a teaser is showing,
  which silently dismisses the toast and leaves the chat shut.
- The widget also exposes `window.__assistableWidget.reportBug()`, which opens a polished
  "Report a problem" form with a screenshot attached. Do not use it for this: it posts to
  Assistable's built-in bug channel, so it never reaches the intake assistant and never
  becomes a ticket an engineer picks up.

## The embedded bot

`index.html` loads the current Assistable widget:

```
https://createassistants.com/chat-widget-v2.js   data-widget-id=<widget record>
```

Not `botdisplay.com/chat-widget.js` - that is the older, separate widget and it ignores
the v2 widget record.

**Appearance is configured in the portal, not here.** The loader fetches
`api.assistable.ai/api/v1/widget-config/<widget-id>` and that config outranks the
`data-*` attributes (`autoOpen: config.appearance?.auto_open ?? attribute`). The
attributes are only a fallback for when the fetch fails, so edit the widget record to
change colour, auto-open, or the teaser copy.

**That config is cached server-side and takes minutes to refresh.** A cache-busting query
string does not help; the cache is keyed by widget id. After editing a widget, expect the
live page to show the old appearance for a few minutes. Verified end to end on localhost:
a message typed into the widget raised a real ticket in the queue.

Before this goes on a real domain, check whether the widget enforces a hostname
allow-list, and add the domain if so.
