/**
 * Walkthrough content.
 *
 * Adding one is a data change, not a code change: copy the shape below and list
 * the trigger phrases people actually type.
 *
 * `art` points at an image in assets/steps/. Steps 1 to 4 are real captures of
 * the portal with the target control ringed, taken from an internal account
 * with the account email and wallet balance hidden first. Step 5 is still a
 * drawing: the outbound dialog renders in a portal that the capture tool cannot
 * reach, and a drawing is honest where a blank screenshot would not be.
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
        art: "assets/steps/outbound-1.jpg",
        artAlt: "The left sidebar with Assistants selected.",
      },
      {
        title: "Open the assistant you want to call with",
        body: "Click its row in the list. The assistant opens on its Builder tab.",
        art: "assets/steps/outbound-2.jpg",
        artAlt: "The assistant list, with one row highlighted.",
      },
      {
        title: "Check it has a number",
        body:
          "Look at the bar above the tabs. If it says No number, outbound calling stays unavailable until you assign one. Assign a number first, then come back.",
        art: "assets/steps/outbound-3.jpg",
        artAlt: "The assistant header showing the number selector.",
      },
      {
        title: "Click the outbound call icon",
        body:
          "Top right, next to Publish, there is a phone icon with a small arrow leaving it. That is outbound. The plain icons beside it are for other actions.",
        art: "assets/steps/outbound-4.jpg",
        artAlt: "The icon row above Publish, with the outbound phone icon first.",
      },
      {
        title: "Enter the number and call",
        body:
          "Type the number in full international format, or search for a contact by name or email, then press Search. The call appears in your call history as soon as it connects.",
        art: "assets/steps/outbound-5.svg",
        artAlt: "The Outbound Call dialog: a search box for a number or contact, with a Search button.",
      },
    ],
  },
];
