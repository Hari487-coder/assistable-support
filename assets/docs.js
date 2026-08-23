/**
 * Help Docs content.
 *
 * Generated from the support knowledge base by scripts/build-docs.py. Do not
 * hand-edit: the next run overwrites it.
 *
 * Two filters run before anything lands here, and both matter.
 *
 * Anything marked `audience: internal` is dropped outright. Those entries are
 * written for whoever is working the ticket - they name internal tools, name
 * what not to promise, and describe how to escalate - and this file is served
 * to the public internet.
 *
 * `agentVoice: true` marks an answer that survived the first filter but still
 * addresses the reader as an agent rather than as the customer ("quote these",
 * "tell them"). It is published, because the facts in it are correct and useful,
 * and it is flagged, because the voice is wrong and somebody should rewrite it.
 * The page can show the flag; what it must never do is pretend it is not there.
 */
window.DOCS = [
  {
    "id": "orientation-two-wallets",
    "q": "Which wallet has to have money in it?",
    "group": "Billing & Subscription",
    "topic": "Credits & balance",
    "keywords": [
      "balance",
      "wallet",
      "credits",
      "out of funds",
      "top up",
      "no money"
    ],
    "answer": "There are **two** wallets, the workspace (agency) wallet and the sub-account wallet, and both must be positive for a call or message to go out.\n\nAn empty wallet is more common than a misconfiguration and less interesting to look for, which is exactly why it gets skipped. Check it early.\n\nIf rebilling is on for a sub-account, that sub-account's usage is charged to the sub-account's own card, not the workspace balance. Turning rebilling off makes that usage draw from the workspace balance instead.",
    "agentVoice": false
  },
  {
    "id": "orientation-publish-scope",
    "q": "What does Publish actually do?",
    "group": "AI Assistant Behavior",
    "topic": "Prompts & models",
    "keywords": [
      "publish",
      "republish",
      "unpublished changes",
      "do I need to publish"
    ],
    "answer": "Publish syncs the assistant to Telnyx, which is the **voice** path only.\n\nSo: a prompt change is live for chat and SMS the moment it is saved, and only reaches calls after Publish. If a customer's *call* behaviour does not match their prompt, Publish is a real fix. If their *chat* is quiet, Publish will change nothing and sends them looking in the wrong place.\n\nA brand-new or long-unused assistant that has never been published has nothing on the Telnyx side at all, which is one of the confirmed causes of outbound calls that never connect.",
    "agentVoice": false
  },
  {
    "id": "where-call-id",
    "q": "Where do I find the call ID for a call that went wrong?",
    "group": "Telephony & Voice",
    "topic": "Call failures",
    "keywords": [
      "call id",
      "call log",
      "call history",
      "which call",
      "find the call"
    ],
    "answer": "Sub-account → **Call Center → History**. Open the call in question and copy the ID from it. It looks like `call_1c03015f-341b-4a6c-894d-fbc5a0b1a833`.\n\nIf the call is not in the list at all, that is itself the finding: the call never got far enough to be recorded, which points at provisioning or wallet rather than anything on the call.\n\nIf the customer cannot find the specific call, ask them to run one test call and send that ID instead. A call ID is the single most useful thing on a voice ticket. It names the assistant, the account and the conversation on its own.",
    "agentVoice": true
  },
  {
    "id": "where-wallet",
    "q": "Where do I check the wallet balance?",
    "group": "Billing & Subscription",
    "topic": "Credits & balance",
    "keywords": [
      "balance",
      "wallet",
      "credits",
      "funds",
      "top up",
      "auto top up"
    ],
    "answer": "Workspace → **Settings → Billing → Wallet & usage** for the agency wallet, and the sub-account's own wallet for that account.\n\nBoth must be positive. If auto top-up is configured but the balance did not move, check that the threshold was actually crossed and that the card on file is still good. A failed top-up leaves the balance where it was without announcing itself.",
    "agentVoice": false
  },
  {
    "id": "where-remove-card",
    "q": "Where do I remove a card, or stop future charges?",
    "group": "Billing & Subscription",
    "topic": "Payments & refunds",
    "keywords": [
      "remove card",
      "stop charges",
      "payment method",
      "billing portal",
      "cancel card"
    ],
    "answer": "Workspace → **Settings → Billing → Wallet & usage → Go to portal**. That opens the payment portal where the card can be removed.\n\nRemoving the card alone does not stop everything. Recurring line items keep billing until the things generating them are gone. See the teardown order in the cancellation article.",
    "agentVoice": false
  },
  {
    "id": "where-phone-numbers",
    "q": "Where do I find the phone numbers attached to a workspace?",
    "group": "Telephony & Voice",
    "topic": "Numbers & SIP",
    "keywords": [
      "phone numbers",
      "my numbers",
      "list numbers",
      "delete number",
      "where are numbers"
    ],
    "answer": "Workspace → **Settings → Billing → Phone numbers**. Each number in the dropdown has an **Open** action that takes you to the account holding it, where it can be deleted.\n\nThis is the reliable way to find numbers that are still billing in accounts the customer has forgotten about, which is the usual explanation for \"I cancelled but I am still being charged\".",
    "agentVoice": true
  },
  {
    "id": "where-reconnect-ghl",
    "q": "Where do I reconnect or refresh a GHL connection?",
    "group": "Authentication & OAuth",
    "topic": "OAuth / reset",
    "keywords": [
      "reconnect ghl",
      "oauth",
      "connection error",
      "refresh token",
      "not connected"
    ],
    "answer": "Workspace → **Sub-accounts** → find the sub-account → **Actions → Connect To GHL**. That redirects to the GHL OAuth page; the customer must select **the same sub-account** there, which refreshes the tokens.\n\nSelecting a different location during that step is a common self-inflicted fault: it links the wrong location and the original one stays broken.\n\nA connection status showing `undefined` is an OAuth fault, not a display glitch.",
    "agentVoice": true
  },
  {
    "id": "where-archive",
    "q": "Where do I archive or unarchive a sub-account?",
    "group": "Account & Workspace",
    "topic": "Archive / access",
    "keywords": [
      "archive",
      "unarchive",
      "delete subaccount",
      "restore account",
      "bin"
    ],
    "answer": "Workspace → the sub-account → the **Bin icon** on the right archives it.\n\nUnarchiving is not immediately available to the customer: there is a **48-hour lock** after archiving. Support can unarchive inside that window on request. Collect the location id.\n\nBefore archiving an account the customer wants to stop paying for, delete its phone numbers and voice-enabled knowledge bases first. Archiving alone does not stop those charges.",
    "agentVoice": true
  },
  {
    "id": "where-test-assistant",
    "q": "Where do I test an assistant without calling it?",
    "group": "AI Assistant Behavior",
    "topic": "Prompts & models",
    "keywords": [
      "chat lab",
      "voice lab",
      "test assistant",
      "try it",
      "sandbox",
      "preview"
    ],
    "answer": "**Chat Lab** for text, **Voice Lab** for voice.\n\nOne trap worth knowing before you trust a Chat Lab result: **Chat Lab does not execute custom tools.** The model decides to call the tool correctly, the sandbox stops there, and the customer sees a **completely blank reply**. That looks exactly like a broken assistant and is not one. If an assistant goes blank in Chat Lab and only when a tool should fire, test on a real channel before calling it broken.\n\nVoice Lab needs a working microphone, so a customer reporting \"Voice Lab does nothing\" may have a browser permission problem rather than a platform one.",
    "agentVoice": true
  },
  {
    "id": "where-docs",
    "q": "Where is the product documentation?",
    "group": "Onboarding & How-to",
    "topic": "How-to / guidance",
    "keywords": [
      "docs",
      "documentation",
      "help",
      "guide",
      "how do i",
      "tutorial"
    ],
    "answer": "- **help.assistable.ai**: the public help site.\n- **Docs**, inside the sub-account: the in-product guides, with an AI you can ask questions directly.\n- The community and Discord for announcements and peer answers.\n\nAssume the customer has already read the docs. Answering with something they could have read themselves is not support. And several of the real causes in this knowledge base are traps precisely because the documentation never mentions them.",
    "agentVoice": true
  },
  {
    "id": "outbound-never-connects",
    "q": "My outbound calls do not connect, or ring once and hang up",
    "group": "Telephony & Voice",
    "topic": "Call failures",
    "keywords": [
      "does not call",
      "rings once",
      "hangs up",
      "no answer",
      "call fails immediately",
      "declined itself",
      "missed call"
    ],
    "answer": "Work these in order. The first four cover almost every confirmed case:\n\n1. **Get the exact error the call attempt returned.** The guards run in a fixed order and each returns a distinct message, so the error names the cause outright. The full table with line references is in `truth/01-outbound-call-errors.md`.\n2. **Is a phone number attached to the assistant?** This fails with `No from number - provide one or configure outboundNumberId on the assistant`. \"It calls and disconnects immediately, feels like a missed call\" has repeatedly turned out to be exactly this.\n3. **Has the assistant ever been published?** A new, archived or long-unused assistant has no copy on the telephony side. Publish once, then re-test. This is the confirmed fix for the `telnyxAgentId` error below.\n4. **Both wallets positive?** Workspace and sub-account.\n\nIf it still fails after all four, collect the call ID, assistant ID, sub-account id and the number dialled, and escalate. This pattern has a real platform defect behind it and is not always self-serve.",
    "agentVoice": true
  },
  {
    "id": "outbound-no-telnyx-agent-id",
    "q": "I get \"Assistant has no telnyxAgentId — cannot place an AI call\"",
    "group": "Telephony & Voice",
    "topic": "Call failures",
    "keywords": [
      "telnyxagentid",
      "no telnyx agent",
      "cannot place an ai call",
      "configure the telnyx convai assistant"
    ],
    "answer": "The full error is: *\"Assistant has no telnyxAgentId — cannot place an AI call. Configure the Telnyx ConvAI assistant on this row before calling.\"*\n\nIt means the assistant has never been provisioned on the telephony side, so there is nothing to run the call. It shows up most often on an assistant that was archived or left unused for a long time.\n\n**Fix: open the assistant, Publish it once, then place a test call.**\n\nIf publishing does not populate it, this needs engineering. Send the assistant ID, the sub-account id, and the timestamp of the failed attempt. On the reported cases the payload also showed an empty `location_id`, which points at the account link rather than the assistant.",
    "agentVoice": false
  },
  {
    "id": "outbound-plus-one-only",
    "q": "My calls to numbers outside the US and Canada fail",
    "group": "Telephony & Voice",
    "topic": "Call failures",
    "keywords": [
      "international",
      "+44",
      "+49",
      "country not supported",
      "cannot call abroad",
      "invalid phone number format"
    ],
    "answer": "Read which of the two errors came back, because they mean different things:\n\n- **\"Platform numbers can only call US/CA (+1) numbers\"** is the destination restriction. It is checked first and says so explicitly.\n- **\"Invalid phone number format\"** is a separate check that runs afterwards. It means the number genuinely failed validation. Do not tell the customer this one is really a country restriction, because it is not.\n\n**Imported numbers are exempt from the +1 restriction.** The guard passes when the from-number is imported, so a customer who needs international outbound can do it by importing their own number rather than using a platform number.\n\nThat is worth offering rather than closing as a hard limitation. Inbound on a non-`+1` number is a separate matter that depends on provisioning. See the legacy and imported numbers article.",
    "agentVoice": true
  },
  {
    "id": "outbound-voicemail-detection",
    "q": "The assistant hangs up as soon as the call is answered",
    "group": "Telephony & Voice",
    "topic": "Call failures",
    "keywords": [
      "hangs up immediately",
      "ends right away",
      "no conversation",
      "answers then ends",
      "voicemail"
    ],
    "answer": "Check **voicemail detection** before assuming a defect. When it is on and voicemail is detected, the assistant ends the call immediately by design. On a list where most numbers go to voicemail, that reads to the customer as \"every call ends instantly\".\n\nConfirm against the call history: if the calls that ended instantly are the ones that hit voicemail, this is working as configured. If the assistant should leave a message instead, it needs a voicemail message set. A fresh assistant has none, which is why it hangs up rather than speaking.\n\nIf the calls ended instantly on numbers a human answered, this is not the cause; go back to the connection checklist.",
    "agentVoice": true
  },
  {
    "id": "outbound-missing-recordings",
    "q": "My calls have no recording, transcript or post-call webhook",
    "group": "Telephony & Voice",
    "topic": "Call failures",
    "keywords": [
      "no recording",
      "no transcript",
      "missing summary",
      "post call webhook not firing",
      "call not completed"
    ],
    "answer": "There was a platform-wide defect where calls never reached a completed state, so the whole completion chain, recording, transcript, post-call notification and webhook, never ran. It was root-caused and patched around **26 May**.\n\nTwo things follow:\n\n- **Calls from before the patch were not backfilled.** Their recordings and transcripts do not exist and cannot be recovered. Say this directly rather than leaving the customer waiting for data that is never coming.\n- **Calls after the patch should be complete.** If they are not, that is a new fault: collect call IDs from after the patch date and escalate.",
    "agentVoice": true
  },
  {
    "id": "outbound-billing-unanswered",
    "q": "Am I charged for calls that were never answered?",
    "group": "Billing & Subscription",
    "topic": "Credits & balance",
    "keywords": [
      "charged for unanswered",
      "billed for dialing",
      "no answer charge",
      "call cost",
      "per minute"
    ],
    "answer": "Calls are billed on **connected duration**, not on dial attempts. If nobody answers and the call never connects, there should be no per-minute talk-time charge. Very short carrier connection attempts can appear, but they are not billed as conversation time.\n\nIf the usage does not match that, get the call IDs and the billing period and check the ledger against the call history rather than debating the principle. Base voice usage is $0.07 per minute.",
    "agentVoice": false
  },
  {
    "id": "inbound-legacy-number",
    "q": "My number gives a busy signal, or rings then disconnects, and it used to work",
    "group": "Telephony & Voice",
    "topic": "Call failures",
    "keywords": [
      "busy signal",
      "always busy",
      "ring then disconnect",
      "number stopped working",
      "legacy number",
      "imported number"
    ],
    "answer": "Ask one question first: **how long ago was this number added?**\n\nNumbers added roughly 7–8 months ago or earlier are **legacy numbers**, and some are affected by an emergency carrier migration. They give a busy signal, ring then disconnect, or stop accepting inbound. They need to be moved off the old carrier, which is not something the customer can do.\n\nDo not send them round the assistant configuration for this. Collect the number in full international format, the location id, and whether it is inbound, outbound or both, then escalate for carrier migration.\n\nFor an imported number specifically, also confirm the SIP trunk is still forwarding to the correct endpoint. The forwarding target is per-workspace and a stale entry produces exactly this symptom.",
    "agentVoice": true
  },
  {
    "id": "inbound-silent-assistant",
    "q": "My inbound assistant does not speak, or does not respond at all",
    "group": "Telephony & Voice",
    "topic": "Call failures",
    "keywords": [
      "not speaking",
      "no audio",
      "silence on inbound",
      "assistant does not answer",
      "dead air"
    ],
    "answer": "Check in this order:\n\n1. **Is a voice selected on the assistant, and has it been published since?** \"Select the voice for your assistant and publish it, then test\" resolves a real share of these on its own.\n2. **Is the assistant published at all?** Never published means the telephony side has nothing to run. Silence is the expected outcome.\n3. **Is the number actually routed to this assistant?**\n4. **Is the prompt very large, or does a tool have an invalid function name?** Both have been implicated in assistants that connect but never speak.\n\nIf the call does not appear in Call Center → History at all, the call never reached the platform. That is a number-routing or carrier problem, not an assistant problem.",
    "agentVoice": false
  },
  {
    "id": "numbers-cannot-purchase",
    "q": "I cannot buy a phone number, or the area code I want is unavailable",
    "group": "Telephony & Voice",
    "topic": "Numbers & SIP",
    "keywords": [
      "cannot buy number",
      "purchase failed",
      "area code unavailable",
      "no numbers available",
      "buy numbers"
    ],
    "answer": "Check first:\n\n- **Wallet balance.** A purchase against an empty wallet fails; numbers are $2.50 per month each.\n- **Permissions.** Buying a number needs sufficient role on the account; a member without it sees the option but cannot complete the purchase.\n- **Availability.** A specific area code may simply have no inventory. That is a carrier stock issue, not a fault.\n\nIf a number was recently deleted and the customer wants it back, have them search for it in the buy-numbers section. Recently released numbers sometimes reappear there.\n\nInternational number purchase is not generally available.",
    "agentVoice": true
  },
  {
    "id": "numbers-cannot-delete",
    "q": "I cannot delete a phone number. It says it is a legacy number",
    "group": "Account & Workspace",
    "topic": "Setup & migration",
    "keywords": [
      "cannot delete number",
      "legacy number that cannot be deleted",
      "contact support to delete",
      "remove number"
    ],
    "answer": "The exact message is: *\"This is a legacy number that cannot be deleted directly.\"*\n\nThe customer cannot resolve this themselves. It needs a backend deletion, after which they can remove it on their side. Collect the number in full international format and the location id.\n\nThis matters more than it looks on cancellation tickets: undeleted numbers keep billing at $2.50 per month each, so \"I cancelled and I am still being charged\" is frequently a number nobody could delete. Check for it proactively on any teardown.",
    "agentVoice": true
  },
  {
    "id": "numbers-transfer",
    "q": "How do I move phone numbers between accounts?",
    "group": "Billing & Subscription",
    "topic": "Plans & upgrades",
    "keywords": [
      "transfer number",
      "move number",
      "reassign number",
      "change location"
    ],
    "answer": "Numbers move **sub-account to sub-account**, not to a workspace.\n\nSend the mappings as text, one per line:\n\n```\n+13465971313 → destination location id\n```\n\nAsk for text rather than screenshots. A screenshot of twenty mappings is where transcription errors get introduced, and it slows the job down considerably.\n\nIf the destination is a workspace rather than a sub-account, the request is a sub-account transfer instead, which needs the destination workspace id.",
    "agentVoice": false
  },
  {
    "id": "numbers-byo-twilio",
    "q": "Can I use my own Twilio number instead of buying one here?",
    "group": "Telephony & Voice",
    "topic": "Numbers & SIP",
    "keywords": [
      "twilio number",
      "bring my own number",
      "import number",
      "use my number",
      "byo"
    ],
    "answer": "Yes. Import the Twilio number into Assistable and use it for calling. If the same number should also handle SMS through GHL, import it there as well.\n\nA common alternative setup: connect Assistable with GHL, let SMS go through the GHL numbers, and let calls run from the Assistable number. Which one is right depends on where they want the conversation history to live.\n\nBe aware that imported numbers have their own failure mode. See the legacy and imported numbers article if an imported number rings but never connects.",
    "agentVoice": false
  },
  {
    "id": "transfer-announce",
    "q": "The AI transfers without warning the caller",
    "group": "AI Assistant Behavior",
    "topic": "Prompts & models",
    "keywords": [
      "transfer without saying",
      "no warning",
      "abrupt transfer",
      "announce transfer",
      "human handoff"
    ],
    "answer": "This is prompt behaviour and it is fixable by the customer. Add an explicit handoff rule to the prompt:\n\n> Before transferring the caller to a human agent, always acknowledge the transfer with a short natural sentence, such as \"Please wait while I connect you to an agent\" or \"One moment while I connect you to a team member.\"\n\nThen **publish the assistant**. A prompt change only reaches calls after publishing.\n\nKeep the rule in its own clearly-marked section of the prompt rather than buried in narrative text. Instructions buried in prose are triggered unreliably; this is the same reason tool instructions get missed.",
    "agentVoice": true
  },
  {
    "id": "transfer-warm-cold",
    "q": "How do I switch between warm and cold transfers?",
    "group": "Telephony & Voice",
    "topic": "Call failures",
    "keywords": [
      "warm transfer",
      "cold transfer",
      "disable warm transfer",
      "transfer type"
    ],
    "answer": "Both are set on the assistant's transfer configuration. Warm announces the caller to the recipient before connecting; cold hands the call straight over.\n\nWhichever you choose, publish the assistant afterwards so the change reaches the voice path.\n\nKnow the trade-off before switching: cold transfer does not pass the original caller's ID through, so the recipient will not see who is calling. If the recipient screens calls by number, warm transfer is the safer choice.",
    "agentVoice": false
  },
  {
    "id": "voice-speaks-symbols",
    "q": "The assistant speaks vertical bars, symbols or formatting characters",
    "group": "Telephony & Voice",
    "topic": "Call failures",
    "keywords": [
      "vertical bars",
      "reads symbols",
      "pipe character",
      "speaks markdown",
      "weird characters"
    ],
    "answer": "Formatting characters are not being stripped before text-to-speech, so the assistant reads them aloud. Most often seen with pricing or tables, where a pipe character sits between values.\n\nThe platform-side gap is a real defect and worth reporting with a call ID.\n\nThe customer-side mitigation works immediately: **remove tables and pipe-delimited formatting from the prompt** for any assistant that speaks. Write prices and lists as plain sentences. Anything that looks like formatting in the prompt can end up as sound.",
    "agentVoice": true
  },
  {
    "id": "voice-says-undefined",
    "q": "The assistant says \"undefined\" where a name or address should be",
    "group": "AI Assistant Behavior",
    "topic": "Wrong / hallucination",
    "keywords": [
      "says undefined",
      "undefined address",
      "blank name",
      "wrong name",
      "variable not filled"
    ],
    "answer": "\"undefined\" means the variable resolved to nothing. The field is empty on the contact, or the variable name is wrong.\n\nTwo checks:\n\n1. **Is the field actually populated on that contact in GHL?** An empty field is the usual cause.\n2. **Is the variable spelled correctly?** Variables use underscores exactly, as `{{name}}`. `{{contact.firstname}}` is **not** a variable and prints literally, which is one of the things \"it got my name wrong\" turns out to mean.\n\nAdd a fallback instruction to the prompt for contacts where the field may be missing, so a gap produces a natural sentence rather than the word \"undefined\".",
    "agentVoice": false
  },
  {
    "id": "voice-dates-spoken",
    "q": "The assistant reads dates and times out as digits, or says them wrong",
    "group": "AI Assistant Behavior",
    "topic": "Prompts & models",
    "keywords": [
      "reads date wrong",
      "says numbers",
      "date format",
      "time wrong",
      "right_now",
      "current_date"
    ],
    "answer": "For anything **spoken**, use the `right_now` family. It is computed at speaking time and formatted for speech.\n\n- `{{current_date}}` gives `2026-02-27` and is read out as digits.\n- `{{right_now.current_date}}` gives \"February 27, 2026\".\n\nThe same applies to the time. This is a one-word change to the prompt and it fixes a complaint that sounds like a voice-engine problem.\n\nPublish the assistant afterwards so the change reaches calls.",
    "agentVoice": false
  },
  {
    "id": "voice-pronunciation",
    "q": "The assistant pronounces a word wrong",
    "group": "AI Assistant Behavior",
    "topic": "Prompts & models",
    "keywords": [
      "pronunciation",
      "says my name wrong",
      "mispronounces",
      "pronounce",
      "accent"
    ],
    "answer": "**Change the spelling in the prompt.** Write the word the way it should sound. That is the only thing that changes speech.\n\nDo not point the customer at the pronunciation dictionary. It is stored and read by nothing, so a change there does nothing at all. And sending them there is worse than saying you are unsure, because they stop looking for the real fix.\n\nPublish the assistant after the prompt change.",
    "agentVoice": true
  },
  {
    "id": "voice-wrong-language",
    "q": "My assistant answers in the wrong language",
    "group": "AI Assistant Behavior",
    "topic": "Prompts & models",
    "keywords": [
      "wrong language",
      "speaks english",
      "spanish",
      "german",
      "language setting",
      "does not understand me"
    ],
    "answer": "The **voice** and the **speech recognition language** are two different settings. Picking a Spanish-sounding voice does not tell the platform to *listen* in Spanish. Recognition defaults to US English, so a Spanish caller gets transcribed as garbled English and the assistant replies accordingly.\n\nSet the language processor to the caller's language as well as choosing the voice, then publish.\n\nFor a specific language's date and weekday handling, an explicit prompt rule helps. For example, requiring that all dates, weekdays and calendar responses be written and spoken in German, never using English weekday names.",
    "agentVoice": false
  },
  {
    "id": "voice-latency",
    "q": "The AI is slow to respond on calls, or talks over the caller",
    "group": "Telephony & Voice",
    "topic": "Voice quality",
    "keywords": [
      "slow response",
      "delay",
      "latency",
      "talks over me",
      "interrupts",
      "lag",
      "pause"
    ],
    "answer": "The call record carries a latency breakdown. Read it before changing anything. It says whether the delay is in speech recognition, the model's first token, or speech synthesis.\n\nThe two customer-side levers that actually move it:\n\n- **Prompt length.** A very long prompt raises first-token latency on every turn. Trimming it is the most reliable improvement.\n- **Interruption sensitivity.** This governs talking over the caller and being cut off mid-sentence.\n\nIf the breakdown shows the delay is on the model's first token and the prompt is already short, that is worth escalating with the call ID rather than tuning further.",
    "agentVoice": false
  },
  {
    "id": "chat-active-tag-race",
    "q": "The log says the message was skipped because no active tag was recognised",
    "group": "GHL Integration",
    "topic": "Sync & ingestion",
    "keywords": [
      "no active tag",
      "active tag not recognized",
      "skipped",
      "tag not applied",
      "first message ignored"
    ],
    "answer": "This is usually a **timing race, not a missing tag.**\n\nActive Tag routing decides which assistant replies. The tag is normally applied by the customer's own GHL workflow, which runs asynchronously and can take several seconds. The platform checks for the tag with only a short retry window. If the workflow is slower than that window, the first message is skipped. And by the time the customer looks, the tag is there, which makes it look like the platform ignored it.\n\nThe tell: it happens on the **first inbound message** of a conversation and not afterwards.\n\nWhat actually helps:\n\n- Have the tag applied as early as possible in the workflow, before any wait or condition steps.\n- Where possible, apply the tag at contact creation rather than on inbound message.\n- Re-save the Tag Tool and the assistant, then refresh the session and re-test: this clears a stale tool binding, which is a separate cause of the same message.",
    "agentVoice": true
  },
  {
    "id": "chat-double-messaging",
    "q": "The assistant sends the same message twice",
    "group": "Account & Workspace",
    "topic": "Setup & migration",
    "keywords": [
      "double message",
      "sends twice",
      "duplicate messages",
      "repeated message",
      "same message again"
    ],
    "answer": "Two known causes:\n\n1. **A tool that emits an intermediate message.** The date-resolution tool used for phrases like \"next Friday\" sends a holding message before the tool finishes, then the real answer after. Which reads as a duplicate. If the assistant uses date resolution, this is the likely cause.\n2. **A GHL workflow re-triggering.** A follow-up or workflow action firing alongside the assistant produces two sends from two different paths.\n\nGet the conversation ID and both message timestamps. A gap of a second or two points at the tool; a longer, regular gap points at a workflow.",
    "agentVoice": false
  },
  {
    "id": "ghl-connection-undefined",
    "q": "My GHL connection shows an error, or the status is \"undefined\"",
    "group": "Authentication & OAuth",
    "topic": "OAuth / reset",
    "keywords": [
      "connection error",
      "not connected",
      "undefined status",
      "oauth error",
      "reconnect",
      "token expired"
    ],
    "answer": "A status of `undefined` is an OAuth fault, not a display glitch.\n\nFix: Workspace → **Sub-accounts** → the sub-account → **Actions → Connect To GHL**. That redirects to the GHL OAuth page, where the customer must select **the same sub-account**. Selecting a different location links the wrong one and leaves the original broken.\n\nIf a plain reconnect does not hold, the account needs a **hard OAuth reset**, which is a documented procedure. It clears the stale authorisation rather than layering a new token over it. Use that when the connection keeps degrading after each reconnect.",
    "agentVoice": true
  },
  {
    "id": "ghl-custom-field-mapping",
    "q": "My contact fields are not being updated in GHL",
    "group": "GHL Integration",
    "topic": "Sync & ingestion",
    "keywords": [
      "custom field",
      "field not updating",
      "not saving to ghl",
      "extraction not working",
      "map custom fields"
    ],
    "answer": "Prompting alone will not write a field. Two things must both be true:\n\n1. **The target field exists in GHL and is mapped** under Map Custom Fields.\n2. **The assistant has a tool that writes it**. An update-contact or extraction tool. Without one there is no write path at all.\n\nThen check the tool instruction. On confirmed cases the instruction was buried in narrative prompt text and never triggered reliably. Give it its own clearly-marked section with an explicit rule for each field that must be collected and written.\n\nIf the tool is firing and the write still does not land, that is the tool-context defect. See the booking and tool-context article.",
    "agentVoice": false
  },
  {
    "id": "ghl-tags-behaviour",
    "q": "The AI added a tag I did not expect, or removed one",
    "group": "GHL Integration",
    "topic": "Sync & ingestion",
    "keywords": [
      "tag added",
      "ai-replying tag",
      "what tags",
      "tag removal",
      "unexpected tag"
    ],
    "answer": "The platform writes tags of its own. `ai-replying` is added to the contact when the AI responds.\n\nOne tag matters more than the rest: **`ai_off` switches the AI off for that contact, and it is matched exactly.** A variant such as `ai_off_temporarily` does **not** work, so a customer who thinks they disabled the AI with a near-miss tag has not.\n\nThe full lists are published on the help site under call tagging and the AI replying tag. Point customers there rather than listing tags from memory. They change.\n\nOne current caveat worth stating: call disposition tags are known to be applied incorrectly in some cases, including `ai replying` appearing on voice where it does not belong. If the customer is routing workflows off those tags, warn them that the routing may be firing on the wrong calls.",
    "agentVoice": true
  },
  {
    "id": "ghl-required",
    "q": "Do I need GoHighLevel to use Assistable?",
    "group": "Billing & Subscription",
    "topic": "Plans & upgrades",
    "keywords": [
      "do i need ghl",
      "without gohighlevel",
      "standalone",
      "required",
      "crm needed"
    ],
    "answer": "Yes, for now. GHL is the system of record for contacts and conversations, and Assistable runs on top of it. Standalone use without GHL is on the roadmap but is not available today.\n\nGive this answer plainly. Customers who discover the dependency after buying are a recurring source of cancellations, so an early, direct answer is cheaper than a refund.",
    "agentVoice": false
  },
  {
    "id": "ghl-domain-broken",
    "q": "My white-label domain is not working, or invitation links fail",
    "group": "Bug & Platform Error",
    "topic": "Platform error",
    "keywords": [
      "domain not working",
      "white label",
      "invitation link fails",
      "dns",
      "cannot accept invite",
      "custom domain"
    ],
    "answer": "Almost always the domain, not the platform. Two confirmed causes:\n\n1. **DNS records are not configured** at the customer's domain provider. Invitation links, portal access and the widget all fail together, which makes it look like an account fault.\n2. **The domain is already claimed by another project** at the hosting provider, so it cannot be added again until verification is completed on the original.\n\nAsk them to confirm the DNS records with their domain provider first, and to open the white-label domain directly in a browser. If the domain itself does not load, nothing on the platform side will fix it.\n\nCollect the exact domain and a screenshot of the error to tell the two causes apart.",
    "agentVoice": true
  },
  {
    "id": "sms-a2p-registration-failed",
    "q": "My A2P campaign or brand registration failed",
    "group": "SMS & Messaging",
    "topic": "A2P & SMS",
    "keywords": [
      "a2p",
      "campaign registration",
      "brand registration",
      "verification failed",
      "cannot send sms",
      "10dlc"
    ],
    "answer": "A2P registration is a carrier requirement for sending SMS to US numbers, and it is verified outside the platform. A failure blocks sending on that location entirely.\n\nThe status notification names the **location and the location id**, so start there rather than asking the customer which account is affected.\n\nWhat to check:\n\n- **Which stage failed**, brand or campaign. They fail for different reasons and a campaign cannot pass while the brand is unverified.\n- **The business details submitted**, which must match the registered entity exactly. Mismatched legal name, EIN or address is the most common rejection.\n- **The sample messages and use case**, which are rejected if they look promotional when registered as conversational.\n\nResubmission goes through the carrier registration flow. Set the expectation that this takes days, not hours, and is not something support can accelerate.",
    "agentVoice": true
  },
  {
    "id": "sms-conversation-summary",
    "q": "Can I get conversation summaries sent to my clients?",
    "group": "SMS & Messaging",
    "topic": "WhatsApp & social",
    "keywords": [
      "conversation summary",
      "send summary",
      "transcript to client",
      "notes",
      "recap"
    ],
    "answer": "Yes, through a custom tool built for this. It is documented on the help site under custom tools, as sending a conversation summary to your clients, and there is a community walkthrough covering the setup.\n\nPoint them at the documented tool rather than describing the steps from memory, because the configuration changes.\n\nOne known limitation to state up front: a post-call summary is sent on a fixed channel rather than following the channel the conversation actually used. If their conversation ran on WhatsApp, the summary may still arrive by SMS. That is recorded as a feature request.",
    "agentVoice": false
  },
  {
    "id": "tools-never-fires",
    "q": "My tool never fires",
    "group": "API & Custom Tools",
    "topic": "API & webhooks",
    "keywords": [
      "tool not firing",
      "tool not called",
      "never triggers",
      "tool does nothing",
      "function not called"
    ],
    "answer": "Check, in order:\n\n1. **Does the tool have a description?** A tool with no description gives the model nothing to decide on, and it will not be called. This is a frequent and immediate fix.\n2. **Is the instruction buried in narrative prompt text?** Give tool rules their own clearly-marked section with an explicit trigger condition, rather than describing them in prose.\n3. **Are you testing in Chat Lab?** **Chat Lab does not execute custom tools.** The model decides correctly, the sandbox stops, and you see a **completely blank reply**. That looks exactly like a broken assistant and is not one. Test on a real channel before concluding the tool is broken.\n4. **Is the tool actually attached to this assistant?**",
    "agentVoice": false
  },
  {
    "id": "booking-30-day-window",
    "q": "The AI can only book 30 days out",
    "group": "API & Custom Tools",
    "topic": "API & webhooks",
    "keywords": [
      "30 days",
      "cannot book further out",
      "calendar range",
      "availability limit",
      "book next month"
    ],
    "answer": "By default the AI reads 30 days of calendar availability and cannot see beyond that.\n\nTwo ways past it:\n\n- Extend the availability range using the developer version of the booking function.\n- Handle longer-range dates with an external automation tool and pass the result in.\n\nThe developer route is the cleaner option if they are comfortable with it. Say which one you are recommending rather than listing both and leaving the choice open.",
    "agentVoice": false
  },
  {
    "id": "tools-external-data",
    "q": "Can I pull data from a spreadsheet or an external system into the assistant?",
    "group": "API & Custom Tools",
    "topic": "API & webhooks",
    "keywords": [
      "spreadsheet",
      "excel",
      "google sheets",
      "external data",
      "api",
      "zapier",
      "n8n",
      "webhook",
      "catalogue"
    ],
    "answer": "There is no built-in importer for Excel files. The supported routes are:\n\n- **Google Sheets**, which can be synced directly.\n- **A custom tool** pointed at an API endpoint that returns the data: the most flexible option, and the right one for anything that changes.\n- **An automation platform** such as Zapier, Make or n8n as a bridge for systems without an API.\n\nFor a product catalogue specifically, artifacts are the built-in path. But be aware they match on token overlap in the title and tags rather than by meaning, so a customer searching by description will get poor results.",
    "agentVoice": false
  },
  {
    "id": "kb-chunking",
    "q": "My knowledge base gives bad answers, or misses facts that are in it",
    "group": "Knowledge Base",
    "topic": "KB & RAG",
    "keywords": [
      "bad answers",
      "misses information",
      "cannot find",
      "ignores knowledge base",
      "wrong answer",
      "rag"
    ],
    "answer": "**The first question is how the source is formatted**, not what the prompt says.\n\nThe same eight facts, written three ways:\n\n- **FAQ source**: 8 chunks, one per question. Clean.\n- **Text with a blank line between items**: 4 chunks. Items merged in pairs.\n- **Text with single newlines between items**: 2 chunks, split mid-sentence.\n\nSingle newlines are **not a separator**. A newline-separated list has its facts sliced in half, and no amount of prompt rewriting fixes it.\n\n**FAQ is the only format with one entry per chunk.** A retrieval returns a small fixed number of passages, so oversized chunks spend those slots on blobs instead of answers.\n\nFirst suggestion on any bad-answers ticket: rebuild the source as FAQ entries. If they must use a text source, insist on a blank line between every item.",
    "agentVoice": false
  },
  {
    "id": "kb-voice-not-enabled",
    "q": "The knowledge base works in chat but is ignored on calls",
    "group": "Knowledge Base",
    "topic": "KB & RAG",
    "keywords": [
      "ignored on calls",
      "not used on voice",
      "works in chat not calls",
      "voice rag",
      "voice knowledge base"
    ],
    "answer": "Voice on a knowledge base is **off by default**, and enabling it is a **subscription, not a toggle**. Voice-enabled knowledge bases are $15 per month each, while standard chat knowledge bases are free.\n\nThis is the normal state, not a fault, and it explains most \"the KB is ignored on calls\" tickets outright.\n\nTwo further points:\n\n- Only workspace **owners, admins or billing managers** can change voice subscription state. A member without that role will see the control and be refused.\n- Support cannot enable it on the customer's behalf, because it is a billing change. Give the diagnosis and tell them who in their workspace can action it.",
    "agentVoice": true
  },
  {
    "id": "kb-voice-toggle-location",
    "q": "I cannot find where to turn voice RAG on and off",
    "group": "Knowledge Base",
    "topic": "KB & RAG",
    "keywords": [
      "where is voice rag",
      "turn on voice",
      "cannot find setting",
      "voice toggle moved"
    ],
    "answer": "The control is on the knowledge base itself rather than beside the knowledge base list where it used to be.\n\nIt is also gated by role and by billing: only workspace owners, admins and billing managers can change it, because enabling voice starts a $15 per month subscription for that knowledge base.\n\nIf the customer has the right role and still cannot see it, get the knowledge base ID and the workspace id.",
    "agentVoice": true
  },
  {
    "id": "kb-detach",
    "q": "How do I remove a knowledge base from an assistant?",
    "group": "Knowledge Base",
    "topic": "KB & RAG",
    "keywords": [
      "remove knowledge base",
      "detach",
      "unassign",
      "stop using kb",
      "unlink"
    ],
    "answer": "Open the assistant and unselect the current knowledge base. That detaches it from the assistant without deleting the knowledge base itself.\n\nDeleting the knowledge base is a separate action, and a different thing to want. If they are trying to stop a charge, deleting is what they need. A voice-enabled knowledge base keeps billing at $15 per month while it exists, whether or not any assistant uses it.",
    "agentVoice": false
  },
  {
    "id": "kb-size-limits",
    "q": "Is there a character limit on knowledge base content?",
    "group": "Knowledge Base",
    "topic": "KB & RAG",
    "keywords": [
      "character limit",
      "size limit",
      "how much content",
      "large catalogue",
      "chunk size",
      "too big"
    ],
    "answer": "The limit that matters in practice is not the total size, it is **how the content is chunked and how many passages a retrieval returns**.\n\nA retrieval returns a small fixed number of passages. If the content is one large block, those slots get spent on a few oversized chunks and most of the knowledge base is unreachable regardless of how much is in it.\n\nSo for a large catalogue: many small FAQ entries beat one large document, every time. If the catalogue is genuinely large and changes often, a custom tool querying it live is a better fit than a knowledge base at all.",
    "agentVoice": false
  },
  {
    "id": "kb-csv",
    "q": "Can I upload a CSV of FAQs, or export what I have?",
    "group": "Feature Request",
    "topic": "Feature request",
    "keywords": [
      "csv upload",
      "bulk import",
      "export knowledge base",
      "faq import",
      "google sheet"
    ],
    "answer": "CSV import of FAQ entries and CSV export of an existing knowledge base are both requested and neither is available today. Record the request rather than implying it is coming.\n\nWhat works now: Google Sheets can be synced, which is the closest thing to a bulk path and is worth offering instead of a one-off manual rebuild.\n\nGiven that FAQ format is also the only chunking that retrieves well, the absence of a bulk FAQ import pushes customers towards the format that works worst. That is worth flagging internally, not just logging.",
    "agentVoice": false
  },
  {
    "id": "billing-rates",
    "q": "What does Assistable cost?",
    "group": "Billing & Subscription",
    "topic": "Plans & upgrades",
    "keywords": [
      "pricing",
      "how much",
      "cost",
      "rates",
      "per minute",
      "per message",
      "price list"
    ],
    "answer": "Base usage rates:\n\n- **AI chat message**: $0.02 each\n- **Voice**: $0.07 per minute\n- **Phone number**: $2.50 per month, each\n- **Standard chat knowledge base**: free\n- **Voice-enabled knowledge base**: $15 per month, each\n\nPlans start at the Solopreneur tier at **$97 per month**. There is **no pay-as-you-go plan**.\n\nQuote these as base costs. If the customer is a reseller, their own markup sits on top. It does not replace them.",
    "agentVoice": true
  },
  {
    "id": "billing-rebilling",
    "q": "How does rebilling work, and who gets charged?",
    "group": "Billing & Subscription",
    "topic": "Credits & balance",
    "keywords": [
      "rebilling",
      "markup",
      "reseller rate",
      "who pays",
      "charge my client",
      "sub-account billing"
    ],
    "answer": "Rebilling lets an agency pass usage costs to its clients and add a markup on top.\n\nTwo things customers get wrong:\n\n1. **The reseller rate fields are a markup, not a replacement.** They sit on top of the base costs. $0.07 per voice minute, $0.02 per message, $2.50 per number, $15 per voice knowledge base. To charge a client $0.04 per message, enter $0.04; we still charge $0.02.\n2. **Where the money lands.** When rebilling is on for a sub-account, that sub-account's top-ups go to **the agency's own Stripe account**. We do not charge the sub-account. Workspace top-ups are the ones charged by us.\n\nIf a sub-account's usage should draw from the workspace balance instead, turn rebilling off for it.",
    "agentVoice": false
  },
  {
    "id": "billing-cancel-teardown",
    "q": "I want to cancel. What actually stops the charges?",
    "group": "Billing & Subscription",
    "topic": "Payments & refunds",
    "keywords": [
      "cancel",
      "stop charging",
      "still being charged after cancelling",
      "close account",
      "unsubscribe"
    ],
    "answer": "Cancelling the subscription alone does **not** stop everything. Recurring line items keep billing until the things generating them are gone. Work the teardown in this order:\n\n1. **Delete every phone number** in the workspace. $2.50 per month each. Workspace → Settings → Billing → Phone numbers; each has an **Open** action that takes you to the account holding it. Numbers in forgotten sub-accounts are the single most common reason charges continue.\n2. **Delete every voice-enabled knowledge base**. $15 per month each.\n3. **Cancel the subscription.**\n4. **Remove the card**. Workspace → Settings → Billing → Wallet & usage → Go to portal.\n\nIf a number refuses to delete with a legacy-number error, it needs a backend deletion. Handle that before closing the ticket, or the charges continue and the customer comes back angrier.",
    "agentVoice": true
  },
  {
    "id": "billing-charged-after-cancel",
    "q": "I cancelled but I am still being charged",
    "group": "Billing & Subscription",
    "topic": "Payments & refunds",
    "keywords": [
      "still charged",
      "charged after cancellation",
      "keeps billing",
      "not using it but paying",
      "cancelled long ago"
    ],
    "answer": "Take this seriously and check before explaining. In the confirmed cases the charges were real and the teardown had failed. Most often numbers that could not be deleted, sometimes across a dozen or more sub-accounts.\n\nDo this:\n\n1. List every phone number and voice-enabled knowledge base still attached to the workspace.\n2. Delete them, escalating any that refuse with a legacy-number error.\n3. Confirm the subscription state, and whether the card is still on file.\n4. Say clearly what the last charge will be and when the charges stop.\n\nThen handle the refund question directly rather than waiting to be asked. A customer who has been charged for something they stopped using months ago should not have to chase the refund as a second ticket.",
    "agentVoice": false
  },
  {
    "id": "billing-cancel-button-broken",
    "q": "I cannot find the cancel button",
    "group": "Billing & Subscription",
    "topic": "Plans & upgrades",
    "keywords": [
      "cannot find cancel",
      "cancel button missing",
      "does not work",
      "cannot cancel",
      "where is workspace id"
    ],
    "answer": "**Customers can cancel their own subscription.** Never tell anyone it is not possible from their side.\n\nThe path: **Settings → Billing → the billing portal button**, which opens the secure payment portal. Cancellation lives inside that portal, not in the Assistable interface itself, which is why customers hunting for a cancel button on the billing page do not find one.\n\nGive the exact path rather than a vague gesture at the billing section. That single extra step is the whole reason this arrives as a ticket.\n\nTwo things to add unprompted:\n\n- **Cancelling stops the plan. It does not delete the account, the data or the wallet balance.** Customers frequently assume it does and hesitate for the wrong reason.\n- **It does not stop every charge.** Phone numbers and voice-enabled knowledge bases keep billing until they are deleted. Walk the teardown order with them.\n\nIf they mention their session timing out or the chat disappearing mid-request, that is a known widget fault and explains any duplicate tickets they opened. Do not treat those as the customer being difficult.",
    "agentVoice": true
  },
  {
    "id": "billing-auto-topup",
    "q": "My auto top-up is not firing",
    "group": "Billing & Subscription",
    "topic": "Credits & balance",
    "keywords": [
      "auto top up",
      "auto pay",
      "threshold",
      "balance not topping up",
      "did not recharge"
    ],
    "answer": "Check three things:\n\n1. **Was the threshold actually crossed?** The trigger is the threshold, not a schedule.\n2. **Is the card still good?** A failed top-up leaves the balance untouched and does not announce itself.\n3. **Which wallet?** Thresholds are configured separately at workspace and sub-account level, and a customer watching one while the other is empty sees nothing happen.\n\nIf all three check out and the balance still did not move, get the location id and the expected amount, and check the ledger directly.",
    "agentVoice": false
  },
  {
    "id": "billing-receipts",
    "q": "I cannot find my invoices or receipts",
    "group": "Billing & Subscription",
    "topic": "Payments & refunds",
    "keywords": [
      "invoice",
      "receipt",
      "missing invoices",
      "proof of payment",
      "statement",
      "billing history"
    ],
    "answer": "Past receipts can be sent on request. Collect the email on the account and the period needed.\n\nMore usefully, **automatic receipts can be enabled** so every successful payment emails a receipt going forward. Turn that on while resolving the ticket rather than only sending the back copies, so the customer does not return next month.\n\nRemember that billing search matches the **customer email only**. A workspace id or workspace name returns zero rows whether or not the customer has ever been charged, so get the email before concluding anything about their payment history.",
    "agentVoice": true
  },
  {
    "id": "billing-byok-models",
    "q": "Which AI models can I use, and can I bring my own key?",
    "group": "AI Assistant Behavior",
    "topic": "Prompts & models",
    "keywords": [
      "byok",
      "own api key",
      "openai key",
      "claude",
      "model selection",
      "which models",
      "anthropic"
    ],
    "answer": "Bring-your-own-key currently supports the **OpenAI API key only**. Selecting a different model family in the interface still routes usage through that key.\n\nThe billing consequence matters as much as the technical one: **a chat reply is free from Assistable only when the assistant's model belongs to a provider the customer has connected a key for.** Everything else bills at the standard per-reply rate. **Voice always uses platform keys**, so voice is never free regardless of what key they connect.\n\nTell customers this before they conclude their own provider account is broken. It is a real and confusing gap, and they will otherwise go looking at the wrong provider's dashboard, or budget for savings that will not appear.\n\nModel choice does matter for behaviour. When output quality is the complaint, switching models is a legitimate thing to test, and a provider has previously pointed at the model rather than the pipeline for output-quality issues.",
    "agentVoice": true
  },
  {
    "id": "workspace-transfer",
    "q": "How do I move a sub-account to another workspace?",
    "group": "Account & Workspace",
    "topic": "Setup & migration",
    "keywords": [
      "transfer subaccount",
      "move account",
      "change workspace",
      "migrate account",
      "bulk move"
    ],
    "answer": "The process now runs through an approval: **the destination workspace owner receives an email with the request and must approve it.** A customer who does not know that reads the pending state as a failure.\n\nCollect the sub-account / location id and the **destination workspace id**.\n\nTwo blockers to check for:\n\n- **\"This sub-account is already in your workspace.\"** Usually the account is linked somewhere the customer cannot see, including a deprecated workspace or an old vendor. It needs disassociating first, which is not self-serve.\n- **A pending request that does not appear.** If a transfer request already exists but is not showing, say so rather than having them submit it again.\n\nThere is no bulk transfer path. An agency moving many sub-accounts needs a list, and that is a manual job. Set that expectation early rather than after the third round trip.",
    "agentVoice": true
  },
  {
    "id": "workspace-permissions",
    "q": "I cannot give someone admin or owner permissions",
    "group": "Authentication & OAuth",
    "topic": "OAuth / reset",
    "keywords": [
      "admin access",
      "permissions",
      "cannot assign role",
      "owner",
      "add user",
      "member access"
    ],
    "answer": "Collect the **exact email address** and **which of the four roles** is wanted. \"Give them access\" is not actionable.\n\nTwo things that look like permission bugs and are not:\n\n- **A workspace member sees every tab regardless of their role.** This is deliberate, so that someone managing a deployment does not get locked out of it mid-task. To see what a restricted user actually sees, add an email that is *not* a workspace member as a sub-account user and check with that.\n- **A permission error when assigning admin** is a genuine fault. Support can set the role directly in the meantime: collect the email and the workspace id, and set it while the underlying issue is looked at.",
    "agentVoice": false
  },
  {
    "id": "workspace-unarchive",
    "q": "I archived an account and need it back",
    "group": "Account & Workspace",
    "topic": "Archive / access",
    "keywords": [
      "unarchive",
      "restore account",
      "archived by mistake",
      "get account back",
      "48 hours"
    ],
    "answer": "There is a **48-hour lock** before an archived account can be unarchived, and the interface does not mention it.\n\nSupport can unarchive inside that window. Collect the location id and do it rather than making them wait out the lock. This is a two-minute fix that otherwise costs the customer two days.\n\nConfirm afterwards which workspace it is connected under, since that is the next thing they will ask.",
    "agentVoice": true
  },
  {
    "id": "workspace-broken-links",
    "q": "Getting-started links or invitation links do not work",
    "group": "Bug & Platform Error",
    "topic": "Platform error",
    "keywords": [
      "link not working",
      "invitation fails",
      "getting started links",
      "cannot accept invite",
      "dns error"
    ],
    "answer": "Check the **white-label domain** first. If the workspace uses a custom domain and its DNS is misconfigured, or the domain is already claimed by another project at the hosting provider, then invitation links, portal access and getting-started links all fail together.\n\nHave them open the white-label domain directly in a browser. If it does not load, no change on our side will fix the links.\n\nIf there is no custom domain involved, get a screenshot of the failure and the exact link. A cache issue is worth ruling out with a hard refresh and an incognito window before escalating.",
    "agentVoice": false
  },
  {
    "id": "workspace-stale-ui",
    "q": "Something in the interface is stale, wrong, or shows the wrong state",
    "group": "Bug & Platform Error",
    "topic": "Platform error",
    "keywords": [
      "hard refresh",
      "cache",
      "wrong state",
      "stale",
      "showing old data",
      "ui bug",
      "not updating"
    ],
    "answer": "Have them hard refresh, then try an incognito or private window, then clear the browser cache. That resolves a real share of \"the setting will not save\" and \"it shows the wrong account\" reports.\n\nDo not stop there if it persists. A setting that reverts after a refresh is a persistence fault, not a cache one, and there are confirmed cases of settings that display as saved and are not.\n\nThe distinction to check: after a hard refresh, does the interface show the **old** value (cache) or the **new** value that then reverts later (persistence)? Say which one you observed when escalating.",
    "agentVoice": false
  },
  {
    "id": "account-cannot-login",
    "q": "I cannot log in",
    "group": "Account & Workspace",
    "topic": "Account general",
    "keywords": [
      "cannot login",
      "login failed",
      "locked out",
      "cannot access",
      "sign in",
      "wrong password"
    ],
    "answer": "Separate the three causes before resetting anything:\n\n1. **The domain.** If the workspace uses a white-label domain and its DNS is misconfigured, login fails for everyone on it. Have them open the domain directly. If it does not load, no account change will help.\n2. **The account.** Wrong email, an account on a different workspace, or an invitation never accepted.\n3. **The session.** A hard refresh and an incognito window rule out a stale session, and resolve a share of these.\n\nAsk which URL they are logging in at. Customers of a reseller often try the main site rather than their agency's domain, which fails in a way that looks like a bad password.",
    "agentVoice": false
  },
  {
    "id": "account-reset-email",
    "q": "I did not receive the password reset email",
    "group": "Account & Workspace",
    "topic": "Account general",
    "keywords": [
      "password reset",
      "no email",
      "did not receive",
      "reset link",
      "forgot password"
    ],
    "answer": "Check the obvious first, in this order: spam and junk, the exact address the account is under, and whether their mail provider blocks the sender.\n\nIf the address is correct and nothing arrives after a few minutes, this needs checking on our side. Collect the exact email address and roughly when they requested it.\n\nBe careful with the account address. A customer who signed up with one address and now uses another will never receive the reset, and no amount of resending fixes it. Confirm which address the account actually sits under before troubleshooting delivery.",
    "agentVoice": false
  }
];
