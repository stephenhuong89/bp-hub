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

  if (!saved) {
    var o = document.createElement("div"); o.className = "chooser"; o.setAttribute("role", "dialog"); o.setAttribute("aria-label", "Choose BP or ST");
    o.innerHTML = '<div class="chin"><img src="logo.png" alt="CVC Engineers Pte Ltd" width="72" height="72"><h1>Which submission are you working on?</h1><div class="chgrid">' +
      ["bp", "st"].map(function (m) { return '<button type="button" class="chtile ch-' + m + '" data-mode="' + m + '"><b>' + NAMES[m][0] + "</b><strong>" + NAMES[m][1] + "</strong><span>" + NAMES[m][2] + "</span></button>"; }).join("") +
      '</div><p>You can switch at any time with the BP | ST control at the top.</p></div>';
    document.body.appendChild(o);
    o.addEventListener("click", function (e) { var b = e.target.closest("[data-mode]"); if (b) window.BPSETMODE(b.dataset.mode); });
  }
})();
