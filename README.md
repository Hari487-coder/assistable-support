# Assistable support page

The landing view is one decision, two doors, one line each:

**Show me how** — step-by-step guides. Beta: one guide (outbound calls).

**Something is broken** — opens the chat; a support engineer reads your account.

The subtitles say only the thing that actually separates them: whether anyone looks at
your account. Colour and artwork carry the rest, cool and stepped for guides, warm and
diagnostic for support. An earlier version listed four facts per door and read as a wall
of text to someone who is already stuck.

Picking the support door opens the chat and **stays on the landing view**, so closing the
chat leaves you where you started.

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
