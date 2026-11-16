/* BP, ST or URA. The same engine renders each hub; this file picks the data set before the engine starts.
   A mode only appears in the chooser once its data set (st-data.js, ura-data.js) is present. */
(function () {
  "use strict";
  var saved = null; try { saved = localStorage.getItem("bp.mode"); } catch (e) {}
  var SETS = { st: "ST", ura: "URA", scdf: "SCDF", pub: "PUB" };
  var modes = ["bp"].concat(Object.keys(SETS).filter(function (m) { return !!window[SETS[m] + "DATA"]; }));
  var mode = modes.indexOf(saved) >= 0 ? saved : "bp";
  var NAMES = {
    bp: ["BP", "Building plan submission", "Architectural plans: fire escape, safety, accessibility, planning. For the team managing the architect."],
    st: ["ST", "Structural plan submission", "Structural plans, calculations, the accredited checker, piling, excavation and supervision. CVC's own submissions."],
    ura: ["URA", "Planning permission", "Use, plot ratio, height and setbacks under the Planning Act. The first approval, before any building plan."],
    scdf: ["SCDF", "Fire safety submission", "Fire safety plans, minor A&A lodgment, the Registered Inspector and the Fire Safety Certificate."],
    pub: ["PUB", "Drainage, sewerage and water", "Surface water drainage, earth control, sewerage and sanitary works, and water services. Civil submissions CVC signs itself."]
  };
  window.BPMODE = mode; window.BPTAG = NAMES[mode][0]; document.documentElement.setAttribute("data-mode", mode);
  if (mode !== "bp") {
    var P = SETS[mode];
    window.BPDATA = window[P + "DATA"]; window.BPSTATS = window[P + "STATS"] || null; window.BPCASES = window[P + "CASES"] || [];
    window.BPMIST = window[P + "MIST"] || null; window.BPQUIZ = window[P + "QUIZ"] || null; window.BPNUM = window[P + "NUM"] || null;
  }
  window.BPSETMODE = function (m) { try { localStorage.setItem("bp.mode", m); } catch (e) {} if (location.hash) history.replaceState(null, "", location.pathname + location.search); location.reload(); };
  if (modes.length < 2) return;

  var sw = document.getElementById("modesw");
  if (sw) {
    sw.hidden = false; sw.setAttribute("aria-label", "Choose the submission");
    sw.innerHTML = modes.map(function (m) { return '<button type="button" data-mode="' + m + '" aria-pressed="' + (m === mode) + '" title="' + NAMES[m][1] + '">' + NAMES[m][0] + "</button>"; }).join("");
    sw.addEventListener("click", function (e) { var b = e.target.closest("[data-mode]"); if (b && b.dataset.mode !== mode) window.BPSETMODE(b.dataset.mode); });
  }
  var brand = document.querySelector("a.brand span"); if (brand) brand.textContent = NAMES[mode][0] + " Submission Hub";
  document.title = "CVC " + NAMES[mode][0] + " Submission Hub";

  var TXT = {
    st: [
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
    ],
    ura: [
      ['#nav a[href="#story"]', "Why URA"], ['#nav a[href="#who"]', "Is permission needed"], ['#nav a[href="#playbook"]', "Managing the application"],
      ["#v-story .hero .label", "Why planning permission exists"], ["#v-story .hero h1", "First the land. Then the building."], ["#v-story .hero .lead", "Before anyone asks whether a building is safe, URA asks whether it may stand there at all: what use, how much floor area, how high, how close to the boundary."],
      ["#v-story > .grid .navcard:nth-child(1) b", "Learn the numbers"], ["#v-story > .grid .navcard:nth-child(1) span", "Plot ratio and setback testers"], ["#v-story > .grid .navcard:nth-child(2) b", "Is permission needed"], ["#v-story > .grid .navcard:nth-child(2) span", "Exempt, lodgment or full application"], ["#v-story > .grid .navcard:nth-child(4) span", "AI screen of a planning set"],
      ["#v-guide .view-head h2", "Learn to read a site the way URA does"], ["#v-guide .view-head .lead", "Zoning, plot ratio, storeys and setbacks, each with a calculator."], ["#v-guide > h3", "Twelve numbers every planning submission turns on"],
      ["#v-guide > .grid .navcard:nth-child(1) b", "Is permission needed"], ["#v-guide > .grid .navcard:nth-child(1) span", "By type of works"], ["#v-guide > .grid .navcard:nth-child(4) span", "Upload a planning set for an AI screen"],
      ["#v-mistakes .view-head h2", "Why planning applications stall"], ["#v-mistakes .view-head .lead", "Where development applications get queried or refused, from URA's guidelines and circulars and from the courts. Pick a stage."],
      ["#v-search .view-head h2", "Search Singapore planning permission rules"],
      ["#v-who .view-head h2", "Is planning permission needed: authorised, lodgment or full application"], ["#v-who .view-head .lead", "Which works need no application, which can be lodged by a qualified person, and which need URA's written permission."],
      ["#v-process .view-head h2", "From site check to written permission"], ["#v-process .view-head .lead", "The planning sequence: who acts, what goes in, what comes back, how long URA takes, and what usually stalls it."],
      ["#v-fees .view-head .lead", "URA's processing fee computed from the published schedule. The Land Betterment Charge is assessed separately by SLA and is outside this estimate."],
      ["#v-check .view-head .lead", "Upload the planning drawings. Each sheet is read against the URA rule set in this hub and every finding is reported as comply, not comply, or cannot tell from the sheet, with the clause and where it was seen."], ["#drop b", "Drop the planning drawings here"],
      ["#v-playbook .view-head h2", "Managing a planning application, stage by stage"], ["#v-playbook .view-head .lead", "What to ask for, what to check and what to chase at each stage."]
    ]
  };
  TXT.scdf = [
    ['#nav a[href="#story"]', "Why SCDF"], ['#nav a[href="#who"]', "Which route"], ['#nav a[href="#playbook"]', "Managing the submission"],
    ["#v-story .hero .label", "Why fire safety approval exists"], ["#v-story .hero h1", "Everyone out. Then the firefighters in."], ["#v-story .hero .lead", "A fire safety plan answers two questions: can every person reach a safe place in time, and can the fire engine and its crew reach the fire."],
    ["#v-story > .grid .navcard:nth-child(1) b", "Learn the numbers"], ["#v-story > .grid .navcard:nth-child(1) span", "Travel distance and exit testers"], ["#v-story > .grid .navcard:nth-child(2) b", "Which route"], ["#v-story > .grid .navcard:nth-child(2) span", "Plan approval, minor A&A or waiver"], ["#v-story > .grid .navcard:nth-child(4) span", "AI screen of a fire safety plan"],
    ["#v-guide .view-head h2", "Learn to read a floor plan the way SCDF does"], ["#v-guide .view-head .lead", "Travel distance, exit width and what height triggers, each with a calculator."], ["#v-guide > h3", "Twelve numbers every fire safety plan turns on"],
    ["#v-guide > .grid .navcard:nth-child(1) b", "Which route"], ["#v-guide > .grid .navcard:nth-child(1) span", "By type of works"], ["#v-guide > .grid .navcard:nth-child(4) span", "Upload a fire safety plan for an AI screen"],
    ["#v-mistakes .view-head h2", "Why fire safety submissions stall"], ["#v-mistakes .view-head .lead", "Where fire safety plans, site works and certificates go wrong, from SCDF's pages and from enforcement. Pick a stage."],
    ["#v-search .view-head h2", "Search Singapore fire safety submission rules"],
    ["#v-who .view-head h2", "Which route: plan approval, minor A&A lodgment or waiver"], ["#v-who .view-head .lead", "Which fire safety works need SCDF's approval first, which can be lodged, and who must sign."],
    ["#v-process .view-head h2", "From fire safety plan to Fire Safety Certificate"], ["#v-process .view-head .lead", "The fire safety sequence: who acts, what goes in, what comes back, how long SCDF takes, and what usually stalls it."],
    ["#v-fees .view-head .lead", "SCDF's plan fees computed from the published schedule. The Registered Inspector, the fire safety engineer and testing are commercial costs outside this estimate."],
    ["#v-check .view-head .lead", "Upload the fire safety plans. Each sheet is read against the Fire Code rule set in this hub and every finding is reported as comply, not comply, or cannot tell from the sheet, with the clause and where it was seen."], ["#drop b", "Drop the fire safety plans here"],
    ["#v-playbook .view-head h2", "Managing a fire safety submission, stage by stage"], ["#v-playbook .view-head .lead", "What to ask for, what to check and what to chase at each stage."]
  ];
  TXT.pub = [
    ['#nav a[href="#story"]', "Why PUB"], ['#nav a[href="#who"]', "Which submission"], ['#nav a[href="#playbook"]', "Managing the submission"],
    ["#v-story .hero .label", "Why PUB clearance exists"], ["#v-story .hero h1", "Rain in. Used water out. Nothing muddy leaves the site."], ["#v-story .hero .lead", "Every site sits inside two public networks: the drains that carry storm water away and the sewers that carry used water to treatment. PUB's submissions protect both."],
    ["#v-story > .grid .navcard:nth-child(1) b", "Learn the numbers"], ["#v-story > .grid .navcard:nth-child(1) span", "Platform level, runoff and sewer testers"], ["#v-story > .grid .navcard:nth-child(2) b", "Which submission"], ["#v-story > .grid .navcard:nth-child(2) span", "Drainage, earth control, sewerage, water"], ["#v-story > .grid .navcard:nth-child(4) span", "AI screen of a civil drawing"],
    ["#v-guide .view-head h2", "Learn to read a site the way PUB does"], ["#v-guide .view-head .lead", "Platform levels, peak runoff, silt and sewer setbacks, each with a calculator."], ["#v-guide > h3", "Twelve numbers every PUB submission turns on"],
    ["#v-guide > .grid .navcard:nth-child(1) b", "Which submission"], ["#v-guide > .grid .navcard:nth-child(1) span", "By type of works"], ["#v-guide > .grid .navcard:nth-child(4) span", "Upload civil drawings for an AI screen"],
    ["#v-mistakes .view-head h2", "Why PUB submissions stall"], ["#v-mistakes .view-head .lead", "Where drainage, earth control and sewerage submissions and sites go wrong, from PUB's codes and its enforcement. Pick a stage."],
    ["#v-search .view-head h2", "Search Singapore drainage, sewerage and water rules"],
    ["#v-who .view-head h2", "Which submission: drainage, earth control, sewerage or water"], ["#v-who .view-head .lead", "Which works need which PUB clearance, and who must sign."],
    ["#v-process .view-head h2", "From development control clearance to TOP"], ["#v-process .view-head .lead", "The PUB sequence: who acts, what goes in, what comes back, how long PUB takes, and what usually stalls it."],
    ["#v-fees .view-head .lead", "PUB's charges for submissions and connections, from the published schedules. Earth control measures, CCTV surveys and testing are commercial costs outside this estimate."],
    ["#v-check .view-head .lead", "Upload the civil drawings. Each sheet is read against the PUB rule set in this hub and every finding is reported as comply, not comply, or cannot tell from the sheet, with the clause and where it was seen."], ["#drop b", "Drop the civil drawings here"],
    ["#v-playbook .view-head h2", "Managing a PUB submission, stage by stage"], ["#v-playbook .view-head .lead", "What to ask for, what to check and what to chase at each stage."]
  ];
  var PLACE = { pub: "Try: platform level, detention tank, silt, sewer setback, inspection chamber, grease trap", scdf: "Try: travel distance, exit staircase, rising main, minor A&A, registered inspector, fire safety certificate", st: "Try: accredited checker, borehole, pile load test, deflection, site supervisor, amendment", ura: "Try: plot ratio, GFA, setback, plan lodgment, change of use, land betterment charge" };
  if (TXT[mode]) {
    TXT[mode].forEach(function (t) { var el = document.querySelector(t[0]); if (el) el.textContent = t[1]; });
    var qi = document.querySelector("#q"); if (qi) qi.placeholder = PLACE[mode];
    var nx = document.querySelectorAll("#v-guide > h3"); if (nx.length) nx[nx.length - 1].textContent = "Where to go next";
  }

  if (modes.indexOf(saved) < 0) {
    var o = document.createElement("div"); o.className = "chooser"; o.setAttribute("role", "dialog"); o.setAttribute("aria-label", "Choose the submission");
    o.innerHTML = '<div class="chin"><img src="logo.png" alt="CVC Engineers Pte Ltd" width="72" height="72"><h1>Which submission are you working on?</h1><div class="chgrid">' +
      modes.map(function (m) { return '<button type="button" class="chtile ch-' + m + '" data-mode="' + m + '"><b>' + NAMES[m][0] + "</b><strong>" + NAMES[m][1] + "</strong><span>" + NAMES[m][2] + "</span></button>"; }).join("") +
      '</div><p>You can switch at any time with the ' + modes.map(function (m) { return NAMES[m][0]; }).join(" | ") + ' control at the top.</p></div>';
    document.body.appendChild(o);
    o.addEventListener("click", function (e) { var b = e.target.closest("[data-mode]"); if (b) window.BPSETMODE(b.dataset.mode); });
  }
})();
