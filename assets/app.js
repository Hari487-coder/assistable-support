/**
 * Support page behaviour.
 *
 * Two intents, one page: a walkthrough player for "show me how", and a handoff
 * to the embedded support bot for "something is broken". Matching a question to
 * a walkthrough is deliberately dumb keyword scoring - there is one walkthrough
 * today, and a wrong confident answer is worse than an honest "not covered yet".
 */
(function () {
  "use strict";

  var walkthroughs = window.WALKTHROUGHS || [];

  var el = function (id) {
    return document.getElementById(id);
  };

  var routeHow = el("routeHow");
  var routeBroken = el("routeBroken");
  var howPanel = el("howPanel");
  var brokenPanel = el("brokenPanel");
  var picker = el("picker");
  var player = el("player");
  var ask = el("ask");
  var suggestions = el("suggestions");
  var nomatch = el("nomatch");

  var rail = el("rail");
  var stepEl = el("step");
  var stepCount = el("stepCount");
  var stepTitle = el("stepTitle");
  var stepBody = el("stepBody");
  var shotWrap = el("shotWrap");
  var shot = el("shot");
  var shotCap = el("shotCap");
  var backBtn = el("back");
  var nextBtn = el("next");
  var doneBox = el("done");

  var current = null;
  var index = 0;

  /* ---------- routing between the two intents ---------- */

  function showHow() {
    howPanel.hidden = false;
    brokenPanel.hidden = true;
    routeHow.setAttribute("aria-pressed", "true");
    routeBroken.setAttribute("aria-pressed", "false");
    howPanel.scrollIntoView({ behavior: "smooth", block: "start" });
    ask.focus({ preventScroll: true });
  }

  function showBroken() {
    brokenPanel.hidden = false;
    howPanel.hidden = true;
    routeBroken.setAttribute("aria-pressed", "true");
    routeHow.setAttribute("aria-pressed", "false");
    brokenPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  routeHow.addEventListener("click", showHow);
  routeBroken.addEventListener("click", showBroken);
  el("toBrokenFromMiss").addEventListener("click", showBroken);
  el("toBrokenFromDone").addEventListener("click", showBroken);

  /* ---------- opening the embedded bot ---------- */

  /**
   * The bot is a third-party bundle that mounts its own launcher, so we click
   * its button rather than reach into its internals. If it has not loaded, say
   * so instead of leaving a dead button.
   */
  el("openWidget").addEventListener("click", function () {
    var launcher = document.querySelector(
      ".chat-widget-container button, .chat-widget-container [role='button'], .chat-widget-container",
    );
    if (launcher && typeof launcher.click === "function") {
      launcher.click();
      return;
    }
    el("widgetHint").textContent =
      "The support chat has not loaded. Refresh the page, and if it still does not appear, email support.";
  });

  /* ---------- matching a question to a walkthrough ---------- */

  function score(query, wt) {
    var q = query.toLowerCase().trim();
    if (!q) return 0;
    var best = 0;
    var candidates = wt.triggers.concat([wt.title.toLowerCase()]);
    for (var i = 0; i < candidates.length; i++) {
      var t = candidates[i].toLowerCase();
      if (q === t) best = Math.max(best, 100);
      else if (q.indexOf(t) !== -1) best = Math.max(best, 70);
      else if (t.indexOf(q) !== -1 && q.length >= 4) best = Math.max(best, 50);
    }
    return best;
  }

  function match(query) {
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

  ask.addEventListener("keydown", function (e) {
    if (e.key !== "Enter") return;
    e.preventDefault();
    var found = match(ask.value);
    if (found) start(found);
    else {
      nomatch.hidden = false;
      player.hidden = true;
    }
  });

  walkthroughs.forEach(function (wt) {
    var li = document.createElement("li");
    var b = document.createElement("button");
    b.type = "button";
    b.textContent = wt.title;
    b.addEventListener("click", function () {
      start(wt);
    });
    li.appendChild(b);
    suggestions.appendChild(li);
  });

  /* ---------- the player ---------- */

  function start(wt) {
    current = wt;
    index = 0;
    nomatch.hidden = true;
    player.hidden = false;
    el("wtTitle").textContent = wt.title;
    buildRail(wt.steps.length);
    render();
    player.scrollIntoView({ behavior: "smooth", block: "start" });
  }

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

  function paintRail() {
    var items = rail.children;
    for (var i = 0; i < items.length; i++) {
      items[i].className = i < index ? "is-done" : i === index ? "is-current" : "";
    }
  }

  function render() {
    var step = current.steps[index];

    stepCount.textContent = "Step " + (index + 1) + " of " + current.steps.length;
    stepTitle.textContent = step.title;
    stepBody.textContent = step.body;

    // Show a real screenshot when one exists; otherwise say what it will show
    // rather than rendering a broken image.
    shotWrap.className = "shot";
    shot.hidden = false;
    shot.alt = step.shotCaption || step.title;
    shot.onerror = function () {
      shot.hidden = true;
      shotWrap.className = "shot pending";
      shotCap.innerHTML = "";
      var note = document.createElement("span");
      note.className = "shot-pending-note";
      note.textContent = "Screenshot coming";
      var spacer = document.createElement("span");
      spacer.className = "shot-spacer";
      shotWrap.insertBefore(spacer, shotCap);
      shotCap.appendChild(note);
      shotCap.appendChild(document.createTextNode(step.shotCaption || ""));
    };
    var spacers = shotWrap.querySelectorAll(".shot-spacer");
    for (var i = 0; i < spacers.length; i++) spacers[i].remove();
    shotCap.textContent = step.shotCaption || "";
    shot.src = step.shot;

    paintRail();

    backBtn.disabled = index === 0;
    var last = index === current.steps.length - 1;
    nextBtn.hidden = last;
    doneBox.hidden = !last;

    stepEl.classList.remove("swap");
    void stepEl.offsetWidth; // restart the animation
    stepEl.classList.add("swap");
  }

  nextBtn.addEventListener("click", function () {
    if (index < current.steps.length - 1) {
      index++;
      render();
    }
  });

  backBtn.addEventListener("click", function () {
    if (index > 0) {
      index--;
      render();
    }
  });

  el("restart").addEventListener("click", function () {
    index = 0;
    render();
  });
})();
