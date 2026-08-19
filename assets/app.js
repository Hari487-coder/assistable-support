/**
 * Support console.
 *
 * One card, two views: ask, and the walkthrough. "Something is broken" does not
 * explain where the chat is, it opens it.
 *
 * Matching a typed question to a walkthrough is deliberate keyword scoring, not
 * a model. With one walkthrough live, a confident wrong answer is worse than an
 * honest "not covered yet", and this costs nothing to run.
 */
(function () {
  "use strict";

  var walkthroughs = window.WALKTHROUGHS || [];
  var el = function (id) {
    return document.getElementById(id);
  };

  var viewDoors = el("viewDoors");
  var viewAsk = el("viewAsk");
  var viewPlay = el("viewPlay");
  var ask = el("ask");
  var miss = el("miss");
  var rail = el("rail");
  var stage = el("stage");
  var art = el("art");

  var current = null;
  var index = 0;

  /* ---------- opening the support bot ---------- */

  /**
   * Opens the chat, by clicking the widget's own launcher inside its shadow
   * root.
   *
   * Deliberately not the widget's reportBug() flow, tempting as it looks: that
   * posts into Assistable's built-in bug channel, so it never reaches the
   * intake assistant and never becomes a ticket an engineer picks up. Chat is
   * the path that ends in someone reading the account.
   */
  function openSupportBot() {
    var api = window.__assistableWidget;

    // Target the launcher by its label. A bare "button" selector picks up the
    // teaser toast's close button when a teaser is showing, which dismisses the
    // toast and leaves the chat shut.
    var shadow = api && api.shadow;
    var launcher =
      (shadow &&
        (shadow.querySelector('button[aria-label="Open chat"]') ||
          shadow.querySelector("button[aria-label*='chat' i]"))) ||
      document.querySelector('#assistable-chat-widget button[aria-label*="chat" i]');

    if (launcher) {
      launcher.click();
      return true;
    }

    miss.hidden = false;
    miss.textContent =
      "The support chat has not finished loading. Give it a moment and try again.";
    return false;
  }

  /* ---------- the three views ---------- */

  function show(view) {
    viewDoors.hidden = view !== viewDoors;
    viewAsk.hidden = view !== viewAsk;
    viewPlay.hidden = view !== viewPlay;
  }

  el("doorAnswer").addEventListener("click", function () {
    show(viewAsk);
    ask.focus();
  });

  // The debug door opens the chat and stays on the landing view, so closing the
  // chat leaves the person where they started rather than somewhere new.
  el("doorDebug").addEventListener("click", openSupportBot);
  el("missToBot").addEventListener("click", openSupportBot);
  el("stuck").addEventListener("click", openSupportBot);
  el("askBack").addEventListener("click", function () {
    show(viewDoors);
  });

  /* ---------- matching ---------- */

  function score(query, wt) {
    var q = query.toLowerCase().trim();
    if (!q) return 0;
    var best = 0;
    var candidates = wt.triggers.concat([wt.title.toLowerCase()]);
    for (var i = 0; i < candidates.length; i++) {
      var t = candidates[i];
      if (q === t) best = Math.max(best, 100);
      else if (q.indexOf(t) !== -1) best = Math.max(best, 70);
      else if (t.indexOf(q) !== -1 && q.length >= 4) best = Math.max(best, 50);
    }
    return best;
  }

  function findMatch(query) {
    var ranked = walkthroughs
      .map(function (wt) {
        return { wt: wt, s: score(query, wt) };
      })
      .filter(function (r) {
        return r.s > 0;
      })
      .sort(function (a, b) {
        return b.s - a.s;
      });
    return ranked.length ? ranked[0].wt : null;
  }

  function submit() {
    var found = findMatch(ask.value);
    if (found) start(found);
    else miss.hidden = false;
  }

  el("send").addEventListener("click", submit);
  ask.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  });
  ask.addEventListener("input", function () {
    miss.hidden = true;
  });

  // One chip per walkthrough.
  var chips = el("chips");
  walkthroughs.forEach(function (wt) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.textContent = wt.title;
    b.addEventListener("click", function () {
      start(wt);
    });
    chips.appendChild(b);
  });

  /* ---------- the walkthrough ---------- */

  function start(wt) {
    current = wt;
    index = 0;
    miss.hidden = true;
    show(viewPlay);
    el("wtTitle").textContent = wt.title;
    buildRail(wt.steps.length);
    render();
  }

  function exit() {
    show(viewAsk);
    ask.focus();
  }

  el("exit").addEventListener("click", exit);

  function buildRail(count) {
    rail.textContent = "";
    for (var i = 0; i < count; i++) {
      var li = document.createElement("li");
      var node = document.createElement("span");
      node.className = "rail-node";
      node.textContent = String(i + 1);
      li.appendChild(node);
      if (i < count - 1) {
        var wire = document.createElement("span");
        wire.className = "rail-wire";
        li.appendChild(wire);
      }
      rail.appendChild(li);
    }
  }

  function render() {
    var step = current.steps[index];
    var last = index === current.steps.length - 1;

    el("counter").textContent = index + 1 + " / " + current.steps.length;
    el("stepTitle").textContent = step.title;
    el("stepBody").textContent = step.body;
    art.src = step.art;
    art.alt = step.artAlt || step.title;

    var items = rail.children;
    for (var i = 0; i < items.length; i++) {
      items[i].className = i < index ? "is-done" : i === index ? "is-current" : "";
    }

    el("prev").disabled = index === 0;
    el("nextBtn").textContent = last ? "Done" : "Next step";

    stage.classList.remove("swap");
    void stage.offsetWidth; // restart the animation
    stage.classList.add("swap");
  }

  el("nextBtn").addEventListener("click", function () {
    if (index < current.steps.length - 1) {
      index++;
      render();
    } else {
      exit();
    }
  });

  el("prev").addEventListener("click", function () {
    if (index > 0) {
      index--;
      render();
    }
  });
})();
