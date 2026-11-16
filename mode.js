/* BP or ST. The same engine renders either hub; this file picks the data set before the engine starts.
   The chooser only appears once the ST data set (st-data.js) is present. */
(function () {
  "use strict";
  var saved = null; try { saved = localStorage.getItem("bp.mode"); } catch (e) {}
  var hasST = !!window.STDATA, mode = hasST && saved === "st" ? "st" : "bp";
  window.BPMODE = mode; document.documentElement.setAttribute("data-mode", mode);
  if (mode === "st") {
    window.BPDATA = window.STDATA; window.BPSTATS = window.STSTATS || null; window.BPCASES = window.STCASES || [];
    window.BPMIST = window.STMIST || null; window.BPQUIZ = window.STQUIZ || null; window.BPNUM = window.STNUM || null;
  }
  window.BPSETMODE = function (m) { try { localStorage.setItem("bp.mode", m); } catch (e) {} if (location.hash) history.replaceState(null, "", location.pathname + location.search); location.reload(); };
  if (!hasST) return;

  var NAMES = { bp: ["BP", "Building plan submission", "Architectural plans: fire escape, safety, accessibility, planning. For the team managing the architect."], st: ["ST", "Structural plan submission", "Structural plans, calculations, the accredited checker, piling, excavation and supervision. CVC's own submissions."] };
  var sw = document.getElementById("modesw");
  if (sw) {
    sw.hidden = false;
    sw.innerHTML = ["bp", "st"].map(function (m) { return '<button type="button" data-mode="' + m + '" aria-pressed="' + (m === mode) + '" title="' + NAMES[m][1] + '">' + NAMES[m][0] + "</button>"; }).join("");
    sw.addEventListener("click", function (e) { var b = e.target.closest("[data-mode]"); if (b && b.dataset.mode !== mode) window.BPSETMODE(b.dataset.mode); });
  }
  var brand = document.querySelector("a.brand span"); if (brand) brand.textContent = NAMES[mode][0] + " Submission Hub";
  document.title = "CVC " + NAMES[mode][0] + " Submission Hub";

  if (mode === "st") {
    var q = function (s) { return document.querySelector(s); };
    var TXT = [
      ['#nav a[href="#story"]', "Why ST"], ['#nav a[href="#who"]', "Who is appointed"], ['#nav a[href="#playbook"]', "Managing the job"],
      ["#v-story .hero .label", "Why structural plan approval exists"], ["#v-story .hero h1", "Designed once. Checked twice. Watched while it is built."], ["#v-story .hero .lead", "Three engineers sign for every major structure. This is what each one answers for."],
      ["#v-story > .grid .navcard:nth-child(1) b", "Learn the numbers"], ["#v-story > .grid .navcard:nth-child(1) span", "Calculators and testers"], ["#v-story > .grid .navcard:nth-child(2) b", "Who is appointed"], ["#v-story > .grid .navcard:nth-child(2) span", "QP, checker, geotechnical team"], ["#v-story > .grid .navcard:nth-child(4) span", "AI screen of a structural set"],
      ["#v-guide .view-head h2", "Learn to read a structural submission the way BCA does"], ["#v-guide .view-head .lead", "The thresholds, the minimum tests and the limits, each with a calculator."], ["#v-guide > h3", "Twelve numbers every structural engineer knows"],
      ["#v-guide > .grid .navcard:nth-child(1) b", "Who is appointed"], ["#v-guide > .grid .navcard:nth-child(1) span", "By type and size of works"], ["#v-guide > .grid .navcard:nth-child(4) span", "Upload a structural set for an AI screen"],
      ["#v-mistakes .view-head h2", "Why structural submissions fail"], ["#v-mistakes .view-head .lead", "Where structural designs, checks and sites go wrong, from BCA's guides and circulars and from the courts. Pick a stage."],
      ["#v-search .view-head h2", "Search Singapore structural plan submission rules"],
      ["#v-who .view-head h2", "Who must be appointed: QP, accredited checker, geotechnical team"], ["#v-who .view-head .lead", "Which works need an accredited checker, a checking organisation, or the full geotechnical team."],
      ["#v-process .view-head h2", "From design basis to the life of the building"], ["#v-process .view-head .lead", "The structural sequence: who acts, what goes in, what comes back, how long BCA takes, and what usually stalls it."],
      ["#v-fees .view-head .lead", "BCA's plan fee computed from the published schedule. The accredited checker, site supervisors, site investigation and testing are commercial costs outside this estimate."],
      ["#v-check .view-head .lead", "Upload the structural drawings. Each sheet is read against the ST rule set in this hub and every finding is reported as comply, not comply, or cannot tell from the sheet, with the clause and where it was seen."], ["#drop b", "Drop the structural drawings here"],
      ["#v-playbook .view-head h2", "Managing a structural job: seven stages, seven real cases"], ["#v-playbook .view-head .lead", "Every stage has gone wrong for someone in Singapore. Follow the stages."]
    ];
    TXT.forEach(function (t) { var el = q(t[0]); if (el) el.textContent = t[1]; });
    var qi = q("#q"); if (qi) qi.placeholder = "Try: accredited checker, borehole, pile load test, deflection, site supervisor, amendment";
    var nx = document.querySelectorAll("#v-guide > h3"); if (nx.length) nx[nx.length - 1].textContent = "Where to go next";
  }

  if (!saved) {
    var o = document.createElement("div"); o.className = "chooser"; o.setAttribute("role", "dialog"); o.setAttribute("aria-label", "Choose BP or ST");
    o.innerHTML = '<div class="chin"><img src="logo.png" alt="CVC Engineers Pte Ltd" width="72" height="72"><h1>Which submission are you working on?</h1><div class="chgrid">' +
      ["bp", "st"].map(function (m) { return '<button type="button" class="chtile ch-' + m + '" data-mode="' + m + '"><b>' + NAMES[m][0] + "</b><strong>" + NAMES[m][1] + "</strong><span>" + NAMES[m][2] + "</span></button>"; }).join("") +
      '</div><p>You can switch at any time with the BP | ST control at the top.</p></div>';
    document.body.appendChild(o);
    o.addEventListener("click", function (e) { var b = e.target.closest("[data-mode]"); if (b) window.BPSETMODE(b.dataset.mode); });
  }
})();
