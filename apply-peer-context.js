(function () {
  "use strict";

  var CONTEXT = {
    intro: {
      title: "You are in the right place",
      body:
        "Peer supporters listen, relate, and signpost — they are not therapists. This step is about who you are so we can stay in touch and match you thoughtfully.",
      tips: [
        "You can save progress by continuing through each step.",
        "Everything here helps us understand fit and safeguarding — not to judge.",
        "The reflection box is optional but helps us hear your voice.",
      ],
    },
    photo: {
      title: "Your profile photo",
      body:
        "A clear, friendly photo helps students recognise you in the app. It is only visible after you are accepted and onboarded.",
      tips: [
        "Use good light and a neutral background if you can.",
        "Face visible — similar to a student ID or LinkedIn headshot.",
        "You can change it later with the team’s help.",
      ],
    },
    contact: {
      title: "Name and contact",
      body:
        "We use this to reach you about your application and training. Your email becomes your main login identifier if you join.",
      tips: [
        "Use an email you check regularly (university or personal is fine).",
        "Phone is optional but helps for quick scheduling or welfare checks.",
        "We never sell your data — see our privacy policy for details.",
      ],
    },
    demographics: {
      title: "Demographics",
      body:
        "Age range, location, and gender help us balance teams and match students who prefer peers with shared lived context. You can choose “prefer not to say” where offered.",
      tips: [
        "City-level location is enough; you do not need to give your full address.",
        "This data supports inclusion reporting in aggregate.",
        "Mismatches with students are normal — we care about skills and boundaries.",
      ],
    },
    languages: {
      title: "Languages",
      body:
        "Many students are multilingual. Telling us what you speak helps coordinators propose fair matches.",
      tips: [
        "Tick every language you could comfortably support a conversation in.",
        "Fluency levels can be discussed at interview.",
        "More languages can mean more opportunities — but never more than you want.",
      ],
    },
  };

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function render(key) {
    var data = CONTEXT[key] || CONTEXT.intro;
    var panel = document.getElementById("apply-context-panel");
    if (!panel) return;

    var titleEl = panel.querySelector("[data-context-title]");
    var bodyEl = panel.querySelector("[data-context-body]");
    var tipsEl = panel.querySelector("[data-context-tips]");

    if (titleEl) titleEl.textContent = data.title;
    if (bodyEl) bodyEl.textContent = data.body;

    if (tipsEl) {
      tipsEl.innerHTML = "";
      (data.tips || []).forEach(function (tip) {
        var li = document.createElement("li");
        li.textContent = tip;
        tipsEl.appendChild(li);
      });
    }

    panel.classList.add("is-active-focus");
    clearTimeout(panel._focusTimer);
    panel._focusTimer = setTimeout(function () {
      panel.classList.remove("is-active-focus");
    }, 600);
  }

  function contextKeyFromTarget(target) {
    if (!target || !target.closest) return "intro";
    var section = target.closest("[data-context]");
    if (section && section.dataset.context) return section.dataset.context;
    return "intro";
  }

  function init() {
    var main = document.querySelector(".apply-split__main");
    var panel = document.getElementById("apply-context-panel");
    if (!main || !panel) return;

    render("intro");

    main.addEventListener(
      "focusin",
      function (e) {
        render(contextKeyFromTarget(e.target));
      },
      true
    );

    main.addEventListener(
      "change",
      function (e) {
        var t = e.target;
        if (t && (t.tagName === "SELECT" || t.tagName === "INPUT")) {
          render(contextKeyFromTarget(t));
        }
      },
      true
    );

    /* Touch: tapping a section without focusable child still updates panel */
    main.addEventListener("click", function (e) {
      var section = e.target.closest("[data-context]");
      if (section && section.dataset.context) {
        render(section.dataset.context);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
