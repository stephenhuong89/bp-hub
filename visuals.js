/* Visual replacements for text-heavy sections: numbers poster, who flowchart, Gantt, clearance diagram, playbook stepper. */
(function () {
  "use strict";
  var D = window.BPDATA, A = window.BPAPP, $ = function (s, r) { return (r || document).querySelector(s); };
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  var RULE = {}; D.entries.forEach(function (e) { RULE[e.id] = e; });
  var ICON = window.BPEXOK || {};

  /* ---------- 1. Numbers poster ---------- */
  var NUM = window.BPNUM || [
    ["175", "mm", "Tallest stair riser", "stair", "AD-06", "staircase riser"],
    ["275", "mm", "Shallowest tread on a common stair", "stair", "AD-07", "tread"],
    ["1.0", "m", "Lowest barrier at a drop", "barrier", "AD-22", "barrier height"],
    ["100", "mm", "Biggest gap in a barrier", "barrier", "AD-23", "barrier openings"],
    ["2.0", "m", "Least headroom, to the lowest beam", "head", "AD-01", "headroom"],
    ["850", "mm", "Narrowest accessible door, clear", "door", "COA-09", "door clear opening"],
    ["1:12", "", "Steepest accessible ramp", "ramp", "COA-13", "ramp gradient"],
    ["15", "m", "Escape with one way out, office, no sprinklers", "travel", "FC-04", "travel distance"],
    ["45", "m", "Escape with two ways out, office, no sprinklers", "travel", "FC-04", "travel distance"],
    ["½", "", "of the longest diagonal: least distance between two exits", "exits", "FC-18", "remoteness of exits"],
    ["2.4 × 4.8", "m", "Car parking lot", "lot", "LTA-01", "car lot size"],
    ["1,000", "mm", "Narrowest staircase, clear", "stair", "AD-05", "stair width"]
  ];
  var poster = $("#g-numbers");
  if (poster) {
    poster.innerHTML = NUM.map(function (n) {
      var r = RULE["rule-" + n[4]] || { ref: n[4] };
      return '<a class="numcard" href="#search" data-q="' + esc(n[5]) + '">' + (ICON[n[3]] || "") + '<b>' + esc(n[0]) + (n[1] ? "<small>" + n[1] + "</small>" : "") + "</b><span>" + esc(n[2]) + '</span><em class="ref mono">' + esc(r ? r.ref.replace(/ \(read from.*$/, "") : "") + "</em></a>";
    }).join("");
    poster.addEventListener("click", function (e) { var a = e.target.closest(".numcard"); if (a) A.setQuery(a.dataset.q); });
  }

  /* ---------- 2. Who can submit flowchart ---------- */
  function q(x, y, l1, l2, l3) { return '<rect x="' + x + '" y="' + y + '" width="230" height="86" rx="4" class="fq"/><text x="' + (x + 115) + '" y="' + (y + 28) + '" class="ft mid b">' + l1 + '</text><text x="' + (x + 115) + '" y="' + (y + 50) + '" class="ft mid">' + l2 + '</text><text x="' + (x + 115) + '" y="' + (y + 68) + '" class="ft mid">' + l3 + "</text>"; }
  function res(x, y, cls, l1, l2) { return '<rect x="' + x + '" y="' + y + '" width="230" height="62" rx="31" class="fr ' + cls + '"/><text x="' + (x + 115) + '" y="' + (y + 27) + '" class="ft mid b">' + l1 + '</text><text x="' + (x + 115) + '" y="' + (y + 46) + '" class="ft mid">' + l2 + "</text>"; }
  function house(x, y) { return '<path d="M' + x + " " + (y + 22) + " l22 -18 l22 18 v22 h-44 z M" + (x + 16) + " " + (y + 44) + ' v-12 h12 v12" class="ic"/>'; }
  function factory(x, y) { return '<path d="M' + x + " " + (y + 44) + " v-26 l14 8 v-8 l14 8 v-8 l14 8 v18 z M" + (x + 34) + " " + (y + 18) + ' v-14 h6 v18" class="ic"/>'; }
  function tower(x, y) { return '<path d="M' + (x + 8) + " " + (y + 44) + " v-40 h24 v40 z M" + (x + 14) + " " + (y + 12) + " h12 M" + (x + 14) + " " + (y + 20) + " h12 M" + (x + 14) + " " + (y + 28) + " h12 M" + (x + 14) + " " + (y + 36) + ' h12" class="ic"/>'; }
  function wall(x, y) { return '<path d="M' + x + " " + (y + 44) + " h44 M" + (x + 16) + " " + (y + 44) + " v-34 h8 v34 M" + (x + 24) + " " + (y + 14) + " l18 6 M" + (x + 24) + " " + (y + 24) + " l18 6 M" + (x + 24) + " " + (y + 34) + ' l18 6" class="ic"/>'; }
  var flow = $("#who-flow");
  if (flow) flow.innerHTML = '<svg viewBox="0 0 900 340" class="dwg flow" role="img" aria-label="Flowchart: who can submit building plans">' +
    '<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" class="ahd"/></marker></defs>' +
    q(20, 30, "Is it an engineering structure?", "retaining wall, foundation, bridge,", "cladding, tank, crane gantry") + q(335, 30, "Is it on the shared list?", "landed A&amp;A, A&amp;A inside a building,", "factory, warehouse, substation") +
    '<line x1="250" y1="73" x2="333" y2="73" class="fa" marker-end="url(#ah)"/><text x="292" y="64" class="ft mid">No</text><line x1="565" y1="73" x2="648" y2="73" class="fa" marker-end="url(#ah)"/><text x="607" y="64" class="ft mid">No</text>' +
    '<line x1="135" y1="116" x2="135" y2="196" class="fa" marker-end="url(#ah)"/><text x="150" y="160" class="ft">Yes</text><line x1="450" y1="116" x2="450" y2="196" class="fa" marker-end="url(#ah)"/><text x="465" y="160" class="ft">Yes</text>' +
    res(20, 198, "pe", "PE only", "CVC submits everything") + res(335, 198, "either", "PE or architect", "CVC can be the sole QP") + res(650, 42, "arch", "Architect", "for the building plans") +
    wall(112, 278) + house(404, 278) + factory(456, 278) + tower(742, 116) +
    '<text x="765" y="194" class="ft mid">new house, flats, office,</text><text x="765" y="212" class="ft mid">shop, school, hotel</text><text x="765" y="300" class="ft mid b">Structural plans: always a PE</text></svg>';
  var hl = $("#who-headline");
  if (hl) { var p = hl.querySelector(".panel"); if (p) { var d = document.createElement("details"); d.className = "more"; d.innerHTML = "<summary>Read the legal basis</summary>"; p.parentNode.insertBefore(d, p); d.appendChild(p); } }
  var wn = $("#who-notes");
  if (wn && wn.innerHTML) { wn.innerHTML = '<details class="more"><summary>Points to confirm with BCA, and other limits</summary><div class="prose">' + wn.innerHTML + "</div></details>"; }

  /* ---------- 3. Gantt ---------- */
  var COL = { classify: 0, appoint: 0, preconsult: 1, ura: 2, "ura-lodge": 2, dc: 2, dg: 2, pg: 3, bp: 3, st: 3, scdf: 3, cg: 4, permit: 5, build: 6, fsc: 7, top: 8, csc: 9 };
  function gantt(track) {
    var el = $("#p-gantt"); if (!el) return;
    var steps = D.steps.filter(function (s) { return s.tracks.indexOf(track) >= 0 && !s.untimed && s.id !== "build" && s.id !== "classify" && s.id !== "appoint"; });
    var stages = {}, STUB = 6;
    steps.forEach(function (s) { var c = s.col != null ? s.col : COL[s.id]; stages[c] = Math.max(stages[c] || 0, s.tatMax || STUB); });
    var order = Object.keys(stages).map(Number).sort(function (a, b) { return a - b; }), start = {}, t = 0;
    order.forEach(function (c) { start[c] = t; t += stages[c]; });
    var x0 = 300, W = 900, k = (W - x0 - 80) / t, rh = 26, H = 34 + steps.length * rh + 26;
    var s = '<svg viewBox="0 0 ' + W + " " + H + '" class="dwg gantt" style="min-width:560px" role="img" aria-label="Gantt chart of authority processing time">';
    for (var d = 0; d <= t; d += 20) s += '<line x1="' + (x0 + d * k) + '" y1="22" x2="' + (x0 + d * k) + '" y2="' + (H - 22) + '" class="grid"/><text x="' + (x0 + d * k) + '" y="14" class="t mid">' + (d ? d + " wd" : "day 0") + "</text>";
    var built = false;
    steps.forEach(function (st, i) {
      var c = st.col != null ? st.col : COL[st.id], y = 30 + i * rh, w = (st.tatMax || STUB) * k, x = x0 + start[c] * k;
      if (!built && c > 5) { built = true; s += '<line x1="' + (x - 6) + '" y1="24" x2="' + (x - 6) + '" y2="' + (H - 22) + '" class="brk"/><text x="' + (x - 10) + '" y="' + (H - 6) + '" class="t" text-anchor="end">construction happens here</text>'; }
      s += '<text x="' + (x0 - 8) + '" y="' + (y + 15) + '" class="t" text-anchor="end">' + esc(st.title.replace(/ and .*$| for the .*$| \(.*$/, "").slice(0, 44)) + '</text><rect x="' + x + '" y="' + y + '" width="' + Math.max(4, w) + '" height="18" rx="4" class="gb' + (st.tatMax ? "" : " un") + '"><title>' + esc(st.title + ": " + (st.tatNote || "no published time")) + '</title></rect><text x="' + (x + Math.max(4, w) + 6) + '" y="' + (y + 14) + '" class="t">' + (st.tatMax ? st.tatMax + " wd" : "not published") + "</text>";
    });
    el.innerHTML = s + '</svg>';
    $("#p-gantt-note").textContent = !t ? "No authority on this track publishes a processing time, so no total is shown. Hatched bars have no published processing time." : "About " + t + " working days of authority time if every step ran once with no resubmission. Rows that start together run in parallel. Hatched bars have no published processing time.";
  }
  if (window.BPVIZ) { var old = window.BPVIZ.process; window.BPVIZ.process = function (tr) { old(tr); gantt(tr); }; }

  /* ---------- 4. TOP and CSC clearances ---------- */
  var cl = $("#p-clear");
  if (cl) {
    var chip = function (a, sub, cls) { return '<span class="stamp ' + (cls || "") + '"><b>' + a + "</b><small>" + sub + "</small></span>"; };
    cl.innerHTML = '<div class="gatebox"><h3>To move in: TOP</h3><div class="stamps">' + chip("BCA", "inspection") + chip("URA", "planning") + chip("NEA", "refuse, pollution") + chip("PUB", "drains, sewers") + chip("SCDF", "temporary fire permit") + "</div></div>" +
      '<div class="gatearrow" aria-hidden="true">+</div><div class="gatebox"><h3>To close out: CSC</h3><div class="stamps">' + chip("LTA", "roads, parking", "late") + chip("NParks", "trees, planting", "late") + chip("SCDF", "fire safety certificate", "late") + chip("All", "every defect cleared", "late") + "</div></div>";
  }

  /* ---------- 5. Playbook stepper ---------- */
  var pb = $("#playbook"), stage = 0;
  function playbook() {
    var p = D.playbook[stage], col = function (cls, name, items) { return '<div class="pbcol ' + cls + '"><h3>' + name + "<small>" + items.length + "</small></h3><ul>" + items.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>"; };
    pb.innerHTML = '<div class="stepper" role="tablist">' + D.playbook.map(function (x, i) { return '<button type="button" role="tab" aria-selected="' + (i === stage) + '" class="stp' + (i === stage ? " on" : i < stage ? " done" : "") + '" data-i="' + i + '"><i>' + (i + 1) + "</i><span>" + esc(x.stage.replace(/^\d+\. /, "")) + "</span></button>"; }).join("") + "</div>" +
      '<div class="pbgrid">' + col("ask", "Ask for", p.ask) + col("chk2", "Check", p.check) + col("chase", "Chase", p.chase) + "</div>" +
      '<div class="row"><button type="button" class="btn ghost sm" data-go="-1"' + (stage === 0 ? " disabled" : "") + '>Previous stage</button><button type="button" class="btn sm" data-go="1"' + (stage === D.playbook.length - 1 ? " disabled" : "") + ">Next stage</button></div>";
  }
  if (pb && !(window.BPCASES && window.BPCASES.length)) {
    pb.addEventListener("click", function (e) { var b = e.target.closest(".stp"), g = e.target.closest("[data-go]"); if (b) stage = +b.dataset.i; else if (g) stage = Math.max(0, Math.min(D.playbook.length - 1, stage + +g.dataset.go)); else return; playbook(); });
    playbook();
  }
  A.refresh();
})();
