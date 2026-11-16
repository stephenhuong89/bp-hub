/* Knowledge quiz. Every answer is tied to a rule entry, a statute or a published source already in the hub. */
(function () {
  "use strict";
  var D = window.BPDATA, EX = window.BPEXALL || {}, $ = function (s, r) { return (r || document).querySelector(s); };
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  var RULE = {}; D.entries.forEach(function (e) { RULE[e.id] = e; });
  function ref(id) { var r = RULE["rule-" + id]; return r ? r.ref.replace(/ \(read from.*$/, "") : id; }
  /* [topic, question, correct answer, wrong answers, why, source] */
  var Q = window.BPQUIZ ? window.BPQUIZ.slice() : [
    ["Numbers", "What is the tallest a stair riser may be?", "175 mm", ["150 mm", "190 mm", "200 mm"], "Every riser, and all the same height.", ref("AD-06")],
    ["Numbers", "The shallowest tread allowed on a common staircase?", "275 mm", ["225 mm", "250 mm", "300 mm"], "225 mm applies only inside a residential unit and 250 mm in an industrial building.", ref("AD-07")],
    ["Numbers", "A balcony has a 3 m drop. The lowest barrier allowed?", "1.0 m", ["0.9 m", "1.1 m", "1.2 m"], "A barrier is needed once the drop is 1.0 m or more, and it must be at least 1.0 m high.", ref("AD-22")],
    ["Numbers", "The biggest gap allowed in a barrier in a home or office?", "A 100 mm sphere must not pass", ["A 75 mm sphere must not pass", "A 125 mm sphere must not pass", "A 150 mm sphere must not pass"], "150 mm applies in industrial buildings.", ref("AD-23")],
    ["Numbers", "Minimum headroom on a walkway, and what is it measured to?", "2.0 m, to the lowest beam, duct or fitting", ["2.0 m, to the slab", "2.1 m, to the ceiling board", "1.9 m, to the lowest beam"], "A beam or duct that hangs below the slab is what counts.", ref("AD-01")],
    ["Numbers", "The narrowest clear opening for a door on an accessible route?", "850 mm", ["750 mm", "800 mm", "900 mm"], "Measured from the door face to the stop with the door open at 90 degrees.", ref("COA-09")],
    ["Numbers", "The steepest accessible ramp?", "1:12", ["1:8", "1:10", "1:20"], "And at 1:12 a run may be no longer than 6 m before a landing.", ref("COA-13")],
    ["Numbers", "An unsprinklered office room with one way out. The longest travel distance?", "15 m", ["20 m", "30 m", "45 m"], "It rises to 30 m with sprinklers, and to 45 m where there are two directions of escape.", ref("FC-04")],
    ["Numbers", "How far apart must two exits be on an unsprinklered floor?", "Half the longest diagonal, and never under 7 m", ["One third of the longest diagonal", "At least 3 m", "Anywhere on different walls"], "One third applies only when the floor is sprinklered.", ref("FC-18")],
    ["Numbers", "A standard car parking lot is:", "2.4 m by 4.8 m", ["2.2 m by 4.8 m", "2.4 m by 4.5 m", "2.5 m by 5.0 m"], "Wider where it sits beside a wall or column.", ref("LTA-01")],
    ["Numbers", "Glass above what height must be laminated?", "2.4 m", ["1.8 m", "2.0 m", "3.0 m"], "BCA lists unlaminated overhead glass as a frequent finding.", "BCA, Understanding the Approved Document v3.0"],
    ["Who and process", "Who can submit the building plans for a brand-new landed house?", "An architect", ["A PE alone", "Either a PE or an architect", "The builder"], "A new house is on neither list in the Third Schedule, so an architect prepares the building plans. The PE does the structural plans.", "Building Control Regulations 2003, Third Schedule para 1(c)"],
    ["Who and process", "Who can submit the building plans for an extension to a terrace house?", "A PE or an architect", ["An architect only", "A PE only", "Nobody, it is exempt"], "Alterations, additions and extensions to landed houses are on the shared list.", "Third Schedule Part II item 1"],
    ["Who and process", "A client says a PE can replace the architect if added GFA is under 20%. True?", "False. No such rule exists", ["True for landed houses", "True up to 20%, then an architect is needed", "True if BCA agrees"], "The test is the type of project. The Regulations contain no GFA percentage for this.", "Building Control Regulations 2003, reg 6 and Third Schedule"],
    ["Who and process", "Who prepares the plans for a retaining wall?", "A PE only", ["An architect only", "Either", "The builder's draughtsman"], "Retaining walls and earth stabilising structures are in Part I.", "Third Schedule Part I item 10"],
    ["Who and process", "From what size must a new project use the CORENET X gateways?", "5,000 m² GFA", ["Every project", "2,000 m² GFA", "30,000 m² GFA"], "Since 1 October 2026. Smaller projects can still use CORENET 2.0.", "BCA/URA joint circular, 23 Jul 2026"],
    ["Who and process", "URA provisional permission lapses after:", "6 months", ["3 months", "1 year", "2 years"], "Written permission lapses after 2 years.", "URA, extend planning permission"],
    ["Who and process", "Who applies for the permit to carry out structural works?", "The developer, the QP and the builder, jointly", ["The builder alone", "The QP alone", "The architect"], "It must be in hand before any structural work starts.", "BCA, permit for structural works"],
    ["Who and process", "Does a three-storey landed house need an accredited checker?", "No", ["Yes, always", "Only above S$15 million", "Only if piled"], "Landed houses of three storeys or less are exempt.", "Building Control Regulations 2003, Fourth Schedule"],
    ["Who and process", "How long does a CORENET X gateway take to answer each round?", "Up to 20 working days", ["7 working days", "14 working days", "30 working days"], "Each resubmission starts another round.", "CORENET X Code of Practice, 4th Edition"],
    ["Mistakes", "On a URA plan, what colour shows proposed works?", "Magenta", ["Red", "Cyan", "Yellow"], "Cyan is existing or approved and yellow is deleted.", "URA best practices, CP 83 colours"],
    ["Mistakes", "SCDF says hose reel coverage must not be shown as:", "A 36 m circle", ["A dimension along the route", "A table of lengths", "A note on the plan"], "Coverage follows the route the hose takes around walls.", "SCDF, Sharing of Common Audit Issues, cl. 6.2.8d"],
    ["Mistakes", "LTA starts charging for street plan submissions from the:", "Fourth submission", ["First submission", "Second submission", "Third submission"], "The first three are free. After that it is $300 or $1,200 each.", "Street Works Regulations, Second Schedule"],
    ["Mistakes", "A planter 300 mm wide sits against a balcony barrier. Why does BCA object?", "It is a step that makes the barrier climbable", ["It blocks drainage", "It overloads the slab", "It reduces headroom"], "A ledge wider than 150 mm beside a barrier becomes a stepping surface.", "BCA, Understanding the Approved Document v3.0"],
    ["Mistakes", "Record plans are attached to a completion form. Which declaration is wrong?", "\"No deviation from approved plans\"", ["\"Works completed\"", "\"Supervised by the QP\"", "\"Plans numbered 1 of n\""], "Record plans exist because there were deviations.", "BCA e-guide for C-Forms"],
    ["Mistakes", "The architect adds a column after the structural plans are in. What must happen?", "Tell the structural QP so both sets match", ["Nothing, it is architectural", "Note it at TOP", "Hide it in the wall"], "BCA names this as a cause of written directions.", "BCA, common mistakes in CORENET X projects"],
    ["Real cases", "At Balestier Road in 2021, what did the builder and developer do?", "Cast footings to plans BCA had rejected, then hid them", ["Built without any architect", "Occupied without a TOP", "Used the wrong concrete supplier"], "The High Court raised the fines to S$140,000 and S$90,000.", "PP v ZH Builders [2025] SGHC 227"],
    ["Real cases", "Why was the PIE viaduct's accredited checker jailed?", "He certified corbels he had never checked", ["He designed the temporary works", "He was not registered", "He was absent from site"], "Six months. The court said one part of the system cannot rely on the vigilance of another.", "Leong Sow Hon v PP [2020] SGHC 228"],
    ["Real cases", "What did Parliament say went wrong at Hotel New World?", "The design was done by an unqualified person under an engineer who did not supervise", ["The concrete was substandard", "An earthquake", "The owner added floors"], "33 people died. The Building Control Act and accredited checkers followed in 1989.", "Hansard, quoted in [2020] SGHC 228"],
    ["Real cases", "After the Toh Guan Road fire, what had been wrong with the cladding?", "It was sold after its fire certification was cancelled", ["It was installed upside down", "It was too heavy", "It had no drainage"], "SCDF traced the same stock to 40 buildings.", "SCDF release, 24 Aug 2017"]
  ];
  var PICKS = [["travel", "Which drawing measures travel distance correctly?"], ["exits", "Which floor has its two exits placed correctly?"], ["barrier", "Which barrier complies?"], ["stair", "Which staircase complies?"], ["ramp", "Which ramp complies?"], ["door", "Which door is wide enough for an accessible route?"], ["head", "Which section has enough headroom?"], ["setback", "Which building respects the setback?"]];
  if (!window.BPQUIZ) PICKS.forEach(function (p) { var e = EX[p[0]]; if (e) Q.push(["Spot the right drawing", p[1], "__pic", [], e[2], ref(e[0]), e]); });

  function neutral(s) { return s.replace(/var\(--(ok|bad)\)/g, "var(--ink)").replace(/var\(--bad-soft\)/g, "transparent").replace(/<text[^>]*>(all equal|one taller|not on ST plan)<\/text>/g, ""); }
  var TOPICS = ["Mixed"].concat(Q.map(function (x) { return x[0]; }).filter(function (t, i, a) { return a.indexOf(t) === i; })), topic = "Mixed", set = [], i = 0, score = 0, streak = 0, answered = false, wrong = {};
  function best() { try { return JSON.parse(localStorage.getItem("bp.quiz") || "{}"); } catch (e) { return {}; } }
  function shuffle(a) { a = a.slice(); for (var k = a.length - 1; k > 0; k--) { var j = Math.floor(Math.random() * (k + 1)), t = a[k]; a[k] = a[j]; a[j] = t; } return a; }
  function start(t) { topic = t; var pool = t === "Mixed" ? Q : Q.filter(function (q) { return q[0] === t; }); set = shuffle(pool).slice(0, Math.min(10, pool.length)); i = 0; score = 0; streak = 0; wrong = {}; show(); }
  function head() {
    var b = best();
    return '<div class="strip" role="tablist">' + TOPICS.map(function (t) { var n = t === "Mixed" ? Q.length : Q.filter(function (q) { return q[0] === t; }).length; return '<button type="button" class="stn' + (t === topic ? " on" : "") + '" data-t="' + esc(t) + '"><b>' + (b[t] != null ? b[t] + "%" : n) + "</b><span>" + esc(t) + "</span><small>" + (b[t] != null ? "your best" : "questions") + "</small></button>"; }).join("") + "</div>";
  }
  function show() {
    answered = false;
    var q = set[i], box = $("#quiz"), opts;
    if (q[2] === "__pic") { var e = q[6], ok = Math.random() < 0.5; opts = '<div class="qpics">' + [0, 1].map(function (k) { var good = (k === 0) === ok; return '<button type="button" class="qpk" data-ok="' + good + '"><span>' + (k ? "B" : "A") + "</span>" + neutral(good ? e[1] : e[3]) + "</button>"; }).join("") + "</div>"; }
    else opts = '<div class="qopts">' + shuffle([q[2]].concat(q[3])).map(function (o) { return '<button type="button" class="qopt" data-ok="' + (o === q[2]) + '">' + esc(o) + "</button>"; }).join("") + "</div>";
    box.innerHTML = head() + '<div class="qcard"><div class="qtop"><span class="label">' + esc(q[0]) + " · question " + (i + 1) + " of " + set.length + '</span><span class="qscore">' + score + " right" + (streak > 1 ? " · " + streak + " in a row" : "") + '</span></div><div class="qbar"><i style="width:' + (i / set.length * 100) + '%"></i></div><h2>' + esc(q[1]) + "</h2>" + opts + '<div id="qfb"></div></div>';
  }
  function finish() {
    var pct = Math.round(score / set.length * 100), b = best(); if (b[topic] == null || pct > b[topic]) { b[topic] = pct; try { localStorage.setItem("bp.quiz", JSON.stringify(b)); } catch (e) {} }
    var weak = Object.keys(wrong).sort(function (x, y) { return wrong[y] - wrong[x]; });
    $("#quiz").innerHTML = head() + '<div class="qcard"><span class="label">' + esc(topic) + ' · result</span><div class="qresult"><b>' + score + " / " + set.length + "</b><span>" + (pct === 100 ? "Every one right. You can check a drawing set." : pct >= 70 ? "Solid. Review the ones you missed and go again." : "Go through the Learn page, then try again.") + "</span></div>" +
      (weak.length ? '<p class="small">Missed most in: ' + esc(weak.join(", ")) + ".</p>" : "") + '<div class="row"><button type="button" class="btn" id="qagain">Another ten</button><a class="btn ghost" href="#guide">Open the Learn page</a></div></div>';
  }
  $("#quiz").addEventListener("click", function (e) {
    var t = e.target.closest("[data-t]"), o = e.target.closest("[data-ok]");
    if (t) return start(t.dataset.t);
    if (e.target.id === "qagain") return start(topic);
    if (e.target.id === "qnext") { i++; return i >= set.length ? finish() : show(); }
    if (!o || answered) return;
    answered = true; var q = set[i], ok = o.dataset.ok === "true";
    Array.prototype.forEach.call($("#quiz").querySelectorAll("[data-ok]"), function (b) { b.disabled = true; b.classList.add(b.dataset.ok === "true" ? "right" : b === o ? "wrong" : "dim"); });
    if (ok) { score++; streak++; } else { streak = 0; wrong[q[0]] = (wrong[q[0]] || 0) + 1; }
    $("#qfb").innerHTML = '<div class="chk ' + (ok ? "ok" : "bad") + '"><b>' + (ok ? "Right" : "Not quite") + "</b><span>" + esc(q[4]) + '</span><span class="small ref mono">' + esc(q[5]) + '</span></div><button type="button" class="btn" id="qnext">' + (i + 1 >= set.length ? "See the result" : "Next question") + "</button>";
    $("#qnext").focus();
  });
  start("Mixed");
})();
