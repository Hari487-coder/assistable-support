/**
 * Walkthrough content.
 *
 * Adding one is a data change, not a code change: copy the shape below, list
 * the trigger phrases people actually type, and drop matching screenshots into
 * assets/steps/. A step with a missing image still renders, using `shotCaption`
 * to say what the picture will show.
 */
window.WALKTHROUGHS = [
  {
    id: "outbound-call",
    title: "Make an outbound call",
    // What a person types when they want this. Matched loosely.
    triggers: [
      "outbound call",
      "outbound",
      "make a call",
      "call out",
      "place a call",
      "call a customer",
      "dial",
      "phone someone",
    ],
    steps: [
      {
        title: "Open Assistants",
        body: "In your sub-account, click Assistants in the left sidebar. It sits under BUILD.",
        shot: "assets/steps/outbound-1-assistants.png",
        shotCaption: "The left sidebar with Assistants selected.",
      },
      {
        title: "Open the assistant you want to call with",
        body: "Click its row in the list. The assistant opens on its Builder tab.",
        shot: "assets/steps/outbound-2-select.png",
        shotCaption: "The assistant list, with one row highlighted.",
      },
      {
        title: "Check it has a number",
        body:
          "Look at the bar above the tabs. If it says No number, outbound calling stays unavailable until you assign one. Assign a number first, then come back.",
        shot: "assets/steps/outbound-3-number.png",
        shotCaption: "The assistant header showing the number selector.",
      },
      {
        title: "Click the outbound call icon",
        body:
          "Top right, next to Publish, there is a phone icon with a small arrow leaving it. That is outbound. The plain icons beside it are for other actions.",
        shot: "assets/steps/outbound-4-icon.png",
        shotCaption: "The icon row above Publish, with the outbound phone icon first.",
      },
      {
        title: "Enter the number and call",
        body:
          "Type the number in full international format, then start the call. It appears in your call history as soon as it connects.",
        shot: "assets/steps/outbound-5-dial.png",
        shotCaption: "The outbound call dialog with a number entered.",
      },
    ],
  },
];
