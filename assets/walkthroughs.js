/**
 * Walkthrough content.
 *
 * Adding one is a data change, not a code change: copy the shape below and list
 * the trigger phrases people actually type.
 *
 * `art` points at an illustration in assets/steps/, drawn in the brand palette
 * rather than captured from the portal. Illustrations do not leak another
 * customer's data, do not age out the moment the UI shifts a pixel, and can
 * point at the one control that matters instead of showing everything at once.
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
        art: "assets/steps/outbound-1.svg",
        artAlt: "The left sidebar with Assistants selected.",
      },
      {
        title: "Open the assistant you want to call with",
        body: "Click its row in the list. The assistant opens on its Builder tab.",
        art: "assets/steps/outbound-2.svg",
        artAlt: "The assistant list, with one row highlighted.",
      },
      {
        title: "Check it has a number",
        body:
          "Look at the bar above the tabs. If it says No number, outbound calling stays unavailable until you assign one. Assign a number first, then come back.",
        art: "assets/steps/outbound-3.svg",
        artAlt: "The assistant header showing the number selector.",
      },
      {
        title: "Click the outbound call icon",
        body:
          "Top right, next to Publish, there is a phone icon with a small arrow leaving it. That is outbound. The plain icons beside it are for other actions.",
        art: "assets/steps/outbound-4.svg",
        artAlt: "The icon row above Publish, with the outbound phone icon first.",
      },
      {
        title: "Enter the number and call",
        body:
          "Type the number in full international format, then start the call. It appears in your call history as soon as it connects.",
        art: "assets/steps/outbound-5.svg",
        artAlt: "The outbound call dialog with a number entered.",
      },
    ],
  },
];
