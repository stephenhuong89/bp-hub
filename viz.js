/* Interactive testers and diagrams. Every limit used here is copied from a rule entry in rules.js or data.js, named beside it. */
(function () {
  "use strict";
  var D = window.BPDATA, A = window.BPAPP, $ = function (s, r) { return (r || document).querySelector(s); };
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  var RULE = {}; D.entries.forEach(function (e) { RULE[e.id] = e; });
  function cite(id) { var r = RULE["rule-" + id]; return r ? '<span class="ref mono">' + esc(r.ref) + "</span>" + (r.status === "web" ? ' <span class="badge acc">Official page</span>' : r.status === "verified" ? ' <span class="badge ok">Verified</span>' : ' <span class="badge warn">Unverified</span>') : ""; }
  function check(ok, label, need, id) { return '<div class="chk ' + (ok ? "ok" : "bad") + '"><b>' + (ok ? "Comply" : "Not comply") + "</b><span>" + esc(label) + '</span><span class="small">Required: ' + esc(need) + " " + cite(id) + "</span></div>"; }
  function slider(id, label, min, max, val, step, unit) { return '<label class="field"><span>' + esc(label) + ': <b id="' + id + '-v">' + val + "</b> " + unit + '</span><input type="range" id="' + id + '" min="' + min + '" max="' + max + '" step="' + (step || 1) + '" value="' + val + '"></label>'; }
  function val(id) { var el = document.getElementById(id); var v = Number(el.value); var o = document.getElementById(id + "-v"); if (o) o.textContent = v; return v; }

  /* ---------- Stair and barrier tester ---------- */
  var TREAD = { unit: [225, "inside a residential unit"], ind: [250, "industrial building"], other: [275, "all other stairs, including residential common stairs"] };
  function stairUI() {
    return '<div class="viz"><div class="canvas" id="t-stair-svg"></div><div class="panel"><h3>Staircase and barrier</h3><p class="small">Move the sliders to the dimensions on the architect\'s section. The drawing redraws to scale.</p>' +
      '<label class="field"><span>Where the stair is</span><select id="s-type"><option value="other">Common or public stair</option><option value="unit">Inside a residential unit</option><option value="ind">Industrial building</option></select></label>' +
      slider("s-r", "Riser", 120, 220, 175, 5, "mm") + slider("s-t", "Tread", 200, 320, 275, 5, "mm") + slider("s-w", "Clear width", 700, 1500, 1000, 50, "mm") + slider("s-h", "Headroom above pitch line", 1700, 2400, 2000, 50, "mm") + slider("s-b", "Barrier height at the landing edge", 700, 1200, 1000, 50, "mm") +
      '<div id="s-out" class="chks"></div></div></div>';
  }
  function stairDraw() {
    var R = val("s-r"), T = val("s-t"), W = val("s-w"), H = val("s-h"), B = val("s-b"), type = $("#s-type").value, need = TREAD[type];
    var k = 0.12, n = 4, ox = 50, oy = 400, okR = R <= 175, okT = T >= need[0], okH = H >= 2000, okB = B >= 1000, okW = W >= 1000;
    var pts = [[ox, oy]], x = ox, y = oy;
    for (var i = 0; i < n; i++) { y -= R * k; pts.push([x, y]); x += T * k; pts.push([x, y]); }
    var lx = x + 150, top = y, c = function (ok) { return ok ? "var(--ok)" : "var(--bad)"; };
    var soff = H * k, px = ox + T * k * 1.5, py = oy - R * k * 2;
    var man = 1750 * k, mx = ox + T * k * 2.5, my = oy - R * k * 3;
    $("#t-stair-svg").innerHTML = '<svg viewBox="0 0 400 430" class="dwg" role="img" aria-label="Section through a staircase drawn to the entered dimensions">' +
      '<polyline points="' + pts.map(function (p) { return p.join(","); }).join(" ") + " " + lx + "," + top + " " + lx + "," + (top + 60) + '" class="ln thick"/>' +
      '<line x1="' + ox + '" y1="' + (oy - soff) + '" x2="' + x + '" y2="' + (top - soff) + '" class="ln" style="stroke:' + c(okH) + '"/><line x1="' + x + '" y1="' + (top - soff) + '" x2="' + lx + '" y2="' + (top - soff) + '" class="ln" style="stroke:' + c(okH) + '"/>' +
      '<line x1="' + px + '" y1="' + py + '" x2="' + px + '" y2="' + (py - soff) + '" class="dim" style="stroke:' + c(okH) + '"/><text x="' + (px + 6) + '" y="' + (py - soff / 2) + '" class="t" style="fill:' + c(okH) + '">headroom ' + H + "</text>" +
      '<line x1="' + lx + '" y1="' + top + '" x2="' + lx + '" y2="' + (top - B * k) + '" class="ln thick" style="stroke:' + c(okB) + '"/><line x1="' + (lx - 40) + '" y1="' + (top - B * k) + '" x2="' + lx + '" y2="' + (top - B * k) + '" class="ln" style="stroke:' + c(okB) + '"/><text x="' + (lx - 4) + '" y="' + (top - B * k - 8) + '" class="t" text-anchor="end" style="fill:' + c(okB) + '">barrier ' + B + "</text>" +
      '<text x="' + (ox - 6) + '" y="' + (oy - R * k / 2 + 4) + '" class="t" text-anchor="end" style="fill:' + c(okR) + '">R ' + R + '</text><text x="' + (ox + T * k / 2) + '" y="' + (oy - R * k - 6) + '" class="t mid" style="fill:' + c(okT) + '">T ' + T + "</text>" +
      '<g class="man"><circle cx="' + mx + '" cy="' + (my - man + 12) + '" r="12"/><line x1="' + mx + '" y1="' + (my - man + 24) + '" x2="' + mx + '" y2="' + (my - 60) + '"/><line x1="' + mx + '" y1="' + (my - 60) + '" x2="' + (mx - 10) + '" y2="' + my + '"/><line x1="' + mx + '" y1="' + (my - 60) + '" x2="' + (mx + 12) + '" y2="' + my + '"/><line x1="' + (mx - 16) + '" y1="' + (my - man + 70) + '" x2="' + (mx + 18) + '" y2="' + (my - man + 55) + '"/></g>' +
      '<text x="' + (mx + 22) + '" y="' + (my - man + 16) + '" class="t">person 1.75 m</text><text x="10" y="16" class="t">section, to scale</text></svg>';
    $("#s-out").innerHTML = check(okR, "Riser " + R + " mm", "not more than 175 mm", "AD-06") + check(okT, "Tread " + T + " mm", "at least " + need[0] + " mm for " + need[1], "AD-07") + check(okW, "Clear width " + W + " mm", "at least 1,000 mm", "AD-05") +
      check(okH, "Headroom " + H + " mm", "no projection within 2,000 mm above the pitch line", "AD-11") + check(okB, "Barrier " + B + " mm", "at least 1,000 mm where the drop is 1.0 m or more", "AD-22");
  }

  /* ---------- Travel distance tester ---------- */
  var TD = [["FC-04", "Offices", 15, 30, 45, 75], ["FC-05", "Shops, schools, car parks, places of public resort", 15, 25, 45, 60], ["FC-06", "Factories and warehouses", 15, 25, 30, 60], ["FC-08", "Hotels, hostels, dormitories", 15, 20, 30, 60], ["FC-09", "Inpatient healthcare", 15, 25, 30, 45], ["FC-07", "High hazard", 10, 20, 20, 35]];
  function travelUI() {
    return '<div class="viz"><div class="canvas" id="t-travel-svg"></div><div class="panel"><h3>Escape travel distance</h3><p class="small">Measure the walking route on the plan from the farthest point of the room to the exit door, then enter it here.</p>' +
      '<label class="field"><span>Use of the floor</span><select id="td-use">' + TD.map(function (r, i) { return '<option value="' + i + '">' + esc(r[1]) + "</option>"; }).join("") + "</select></label>" +
      '<div class="grid"><label class="field"><span>Sprinklered</span><select id="td-sp"><option value="0">No</option><option value="1">Yes</option></select></label><label class="field"><span>Ways out from that point</span><select id="td-way"><option value="1">One direction only</option><option value="2">Two directions</option></select></label></div>' +
      slider("td-d", "Distance measured on the drawing", 5, 90, 28, 1, "m") + '<div id="td-out" class="chks"></div></div></div>';
  }
  function travelDraw() {
    var r = TD[+$("#td-use").value], sp = +$("#td-sp").value, two = $("#td-way").value === "2", d = val("td-d");
    var lim = r[(two ? 4 : 2) + sp], ok = d <= lim, k = 500 / 90, x0 = 50, y = 110, c = ok ? "var(--ok)" : "var(--bad)";
    var ticks = ""; for (var m = 0; m <= 90; m += 15) ticks += '<line x1="' + (x0 + m * k) + '" y1="150" x2="' + (x0 + m * k) + '" y2="158" class="ln thin"/><text x="' + (x0 + m * k) + '" y="172" class="t mid">' + m + " m</text>";
    $("#t-travel-svg").innerHTML = '<svg viewBox="0 0 600 190" class="dwg" role="img" aria-label="Travel distance compared with the limit">' +
      '<rect x="' + x0 + '" y="70" width="' + (lim * k) + '" height="80" class="zone ok"/><rect x="' + (x0 + lim * k) + '" y="70" width="' + ((90 - lim) * k) + '" height="80" class="zone bad"/>' +
      '<line x1="' + (x0 + lim * k) + '" y1="40" x2="' + (x0 + lim * k) + '" y2="150" class="ln dash"/><text x="' + (x0 + lim * k) + '" y="32" class="t mid">limit ' + lim + " m</text>" +
      '<circle cx="' + x0 + '" cy="' + y + '" r="7" style="fill:var(--ink)"/><text x="' + x0 + '" y="62" class="t mid">farthest point</text>' +
      '<line x1="' + x0 + '" y1="' + y + '" x2="' + (x0 + d * k) + '" y2="' + y + '" class="path" style="stroke:' + c + '"/>' +
      '<rect x="' + (x0 + d * k - 3) + '" y="88" width="16" height="44" style="fill:var(--sheet);stroke:' + c + ';stroke-width:3"/><text x="' + (x0 + d * k + 5) + '" y="84" class="t mid" style="fill:' + c + '">exit ' + d + " m</text>" + ticks + "</svg>";
    $("#td-out").innerHTML = check(ok, d + " m to the exit, " + (two ? "two directions" : "one direction") + ", " + (sp ? "sprinklered" : "not sprinklered"), "not more than " + lim + " m", r[0]) +
      '<p class="small">The same floor allows ' + r[2] + " m one-way and " + r[4] + " m two-way without sprinklers, " + r[3] + " m and " + r[5] + " m with them. " + (ok ? "" : (two ? "Options: add an exit closer to this point, or sprinkler the floor." : "Options: give this point a second direction of escape, add a nearer exit, or sprinkler the floor.")) + " Flats and maisonettes follow a separate table that is not yet verified in this hub.</p>";
  }

  /* ---------- Ramp tester ---------- */
  var RUN = { 12: 6, 14: 9, 16: 12, 20: 15, 24: 18 };
  function rampUI() {
    return '<div class="viz"><div class="canvas" id="t-ramp-svg"></div><div class="panel"><h3>Accessible ramp</h3><p class="small">Enter the level difference the ramp has to climb. The steeper the gradient, the shorter each run may be before a landing.</p>' +
      slider("rp-rise", "Level difference", 100, 2000, 600, 25, "mm") + '<label class="field"><span>Gradient</span><select id="rp-g"><option value="12">1:12 (steepest allowed)</option><option value="14">1:14</option><option value="16">1:16</option><option value="20">1:20</option><option value="24">1:24</option></select></label>' +
      '<label class="field"><span>Length available on the drawing: <b id="rp-len-v">9</b> m</span><input type="range" id="rp-len" min="2" max="60" step="0.5" value="9"></label><div id="rp-out" class="chks"></div></div></div>';
  }
  function rampDraw() {
    var rise = val("rp-rise"), g = +$("#rp-g").value, len = val("rp-len"), run = rise * g / 1000, maxRun = RUN[g], segs = Math.max(1, Math.ceil(run / maxRun - 1e-9)), total = run + (segs - 1) * 1.5, ok = len >= total;
    var k = 500 / Math.max(total, len, 6), vk = k * 3, x = 50, y = 170, d = "M" + x + " " + y, segRun = run / segs, segRise = rise / 1000 / segs;
    for (var i = 0; i < segs; i++) { x += segRun * k; y -= segRise * vk; d += " L" + x + " " + y; if (i < segs - 1) { x += 1.5 * k; d += " L" + x + " " + y; } }
    $("#t-ramp-svg").innerHTML = '<svg viewBox="0 0 600 220" class="dwg" role="img" aria-label="Ramp profile for the entered rise and gradient">' +
      '<line x1="30" y1="170" x2="580" y2="170" class="ln thin"/><path d="' + d + " L" + (x + 40) + " " + y + '" class="ln thick" style="stroke:' + (ok ? "var(--ok)" : "var(--bad)") + '"/>' +
      '<line x1="' + x + '" y1="' + y + '" x2="' + x + '" y2="170" class="ln dash"/><text x="' + (x + 6) + '" y="' + ((y + 170) / 2) + '" class="t">rise ' + rise + " mm</text>" +
      '<line x1="50" y1="190" x2="' + (50 + len * k) + '" y2="190" class="dim"/><text x="' + (50 + len * k / 2) + '" y="206" class="t mid">space available ' + len + ' m</text><text x="10" y="16" class="t">profile; height drawn 3 times larger</text></svg>';
    $("#rp-out").innerHTML = check(ok, "Ramp needs " + total.toFixed(1) + " m overall; " + len + " m available", run.toFixed(1) + " m of ramp at 1:" + g + " in " + segs + " run" + (segs > 1 ? "s with " + (segs - 1) + " landing" + (segs > 2 ? "s" : "") + " of 1.5 m" : ""), "COA-13") +
      '<p class="small">At 1:' + g + " a single run may be at most " + maxRun + " m between landings. " + (rise > 175 ? "With a rise above 175 mm, handrails are needed on both sides at 800 to 900 mm, with a 75 mm edge kerb. " + cite("COA-15") : "") + "</p>";
  }

  var TESTS = [["stair", "Stairs and barriers", stairUI, stairDraw], ["travel", "Escape distance", travelUI, travelDraw], ["ramp", "Ramps", rampUI, rampDraw]];
  function showTest(id) {
    var t = TESTS.filter(function (x) { return x[0] === id; })[0];
    $("#g-tests").innerHTML = TESTS.map(function (x) { return '<button type="button" class="chip" data-v="' + x[0] + '" aria-pressed="' + (x[0] === id) + '">' + x[1] + "</button>"; }).join("");
    var box = $("#g-test"); box.innerHTML = t[2](); box.oninput = t[3]; box.onchange = t[3]; t[3]();
  }
  $("#g-tests").addEventListener("click", function (e) { var b = e.target.closest(".chip"); if (b) showTest(b.dataset.v); });
  showTest("stair");

  /* ---------- Process map ---------- */
  var COL = { classify: 0, appoint: 0, preconsult: 1, ura: 2, "ura-lodge": 2, dc: 2, dg: 2, pg: 3, bp: 3, st: 3, scdf: 3, cg: 4, permit: 5, build: 6, fsc: 7, top: 8, csc: 9 };
  var LANES = ["Project team", "URA", "BCA", "SCDF", "Other agencies"];
  function lanesOf(s) { if (s.id === "dg") return [1, 4]; if (s.id === "cg") return [1, 4]; if (s.id === "top" || s.id === "csc") return [2, 4]; if (/^(All)$/.test(s.agency)) return [0, 0]; if (/URA/.test(s.agency)) return [1, 1]; if (/SCDF/.test(s.agency)) return [3, 3]; if (/LTA|NEA|PUB/.test(s.agency) && !/BCA/.test(s.agency)) return [4, 4]; return [2, 2]; }
  function processMap(track) {
    var steps = D.steps.filter(function (s) { return s.tracks.indexOf(track) >= 0; });
    var cols = []; steps.forEach(function (s) { if (cols.indexOf(COL[s.id]) < 0) cols.push(COL[s.id]); }); cols.sort(function (a, b) { return a - b; });
    var cw = 118, lh = 54, x0 = 96, y0 = 28, W = x0 + cols.length * cw + 8, Hh = y0 + LANES.length * lh + 8, used = {};
    var svg = '<svg viewBox="0 0 ' + W + " " + Hh + '" class="dwg pmap" style="min-width:' + Math.min(W, 900) + 'px" role="img" aria-label="Map of the submission steps by authority">';
    LANES.forEach(function (l, i) { svg += '<rect x="0" y="' + (y0 + i * lh) + '" width="' + W + '" height="' + lh + '" class="lane' + (i % 2 ? " alt" : "") + '"/><text x="6" y="' + (y0 + i * lh + lh / 2 + 4) + '" class="t">' + l.split(" ").slice(0, 2).join(" ") + (l.split(" ").length > 2 ? "…" : "") + "</text>"; });
    steps.forEach(function (s, n) {
      var ci = cols.indexOf(COL[s.id]), ln = lanesOf(s), key = ci + ":" + ln[0], off = used[key] || 0; used[key] = off + 1;
      var x = x0 + ci * cw + 4, y = y0 + ln[0] * lh + 5 + off * 0, h = (ln[1] - ln[0] + 1) * lh - 10, w = cw - 8;
      if (off && ln[0] === ln[1]) { h = lh / 2 - 4; y += lh / 2 - 3; }
      var words = s.title.replace(/ and .*$| for the .*$| \(.*$/, "").split(" "), l1 = "", l2 = "";
      words.forEach(function (wd) { if ((l1 + " " + wd).length <= 17 && !l2) l1 += (l1 ? " " : "") + wd; else l2 += (l2 ? " " : "") + wd; });
      if (l2.length > 18) l2 = l2.slice(0, 17) + "…";
      svg += '<g class="pnode" data-id="' + s.id + '" tabindex="0" role="button" aria-label="' + esc(s.title) + '"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="3"/><text x="' + (x + w / 2) + '" y="' + (y + h / 2 - (l2 && h > 30 ? 3 : -4)) + '" class="t mid">' + esc(l1) + "</text>" + (l2 && h > 30 ? '<text x="' + (x + w / 2) + '" y="' + (y + h / 2 + 10) + '" class="t mid">' + esc(l2) + "</text>" : "") + (s.tatMax && h > 60 ? '<text x="' + (x + w / 2) + '" y="' + (y + h - 8) + '" class="t mid tat">' + s.tatMax + " wd</text>" : "") + "</g>";
    });
    $("#p-map").innerHTML = svg + "</svg>";
  }
  $("#p-map").addEventListener("click", function (e) { var g = e.target.closest(".pnode"); if (!g) return; var card = document.querySelector('.step[data-id="' + g.dataset.id + '"] details'); if (card) { card.open = true; card.scrollIntoView({ behavior: "smooth", block: "center" }); } });
  $("#p-map").addEventListener("keydown", function (e) { if (e.key === "Enter") e.target.dispatchEvent(new MouseEvent("click", { bubbles: true })); });

  /* ---------- Who board ---------- */
  function whoBoard() {
    var G = [["pe", "PE only", "Part I of the Third Schedule"], ["either", "PE or architect", "Part II of the Third Schedule"], ["architect", "Architect for building plans", "Everything else"]];
    var bca = D.who.options.filter(function (o) { return !o.agency && ["pe", "either", "architect"].indexOf(o.verdict) >= 0 && !/Structural|Lightning|stability/i.test(o.label); });
    $("#who-board").innerHTML = '<div class="board">' + G.map(function (g) {
      return '<div class="bucket b-' + g[0] + '"><h3>' + g[1] + '</h3><span class="label">' + g[2] + '</span><div class="chips">' + bca.filter(function (o) { return o.verdict === g[0]; }).map(function (o) { return '<button type="button" class="chip" data-id="' + o.id + '">' + esc(o.label) + "</button>"; }).join("") + "</div></div>"; }).join("") + '</div><p class="small">Structural plans are by a PE in every column. Click a project type to see the clause.</p>';
  }
  $("#who-board").addEventListener("click", function (e) { var b = e.target.closest(".chip"); if (!b) return; var sel = $("#who-sel"); sel.value = b.dataset.id; sel.dispatchEvent(new Event("change")); $("#who-result").scrollIntoView({ behavior: "smooth", block: "center" }); });
  whoBoard();

  /* ---------- Fee bar ---------- */
  var FC = { BCA: "var(--accent)", URA: "var(--ok)", SCDF: "var(--bad)", PUB: "var(--warn)", NEA: "var(--ink-2)", NParks: "var(--ink-3)", LTA: "var(--line)" };
  function feeBar(parts) {
    var by = {}, total = 0; parts.forEach(function (p) { by[p.agency] = (by[p.agency] || 0) + p.amount; total += p.amount; });
    var ks = Object.keys(by).filter(function (k) { return by[k] > 0; });
    $("#fee-bar").innerHTML = total ? '<span class="label">Share of the total by authority</span><div class="fbar">' + ks.map(function (k) { return '<i style="flex:' + by[k] + ";background:" + (FC[k] || "var(--ink-3)") + '" title="' + k + '"></i>'; }).join("") + '</div><div class="row">' + ks.map(function (k) { return '<span class="lg"><i style="background:' + (FC[k] || "var(--ink-3)") + '"></i>' + k + " S$" + by[k].toLocaleString("en-SG") + " (" + Math.round(by[k] / total * 100) + "%)</span>"; }).join("") + "</div>" : "";
  }

  (function gates() {
    var AG = ["URA", "BCA", "SCDF", "LTA", "PUB", "NEA", "NParks"], el = $("#p-gates"); if (!el) return;
    var ag = function (x) { return AG.map(function (a, i) { return '<rect x="' + x + '" y="' + (14 + i * 30) + '" width="62" height="22" rx="3" class="gnode"/><text x="' + (x + 31) + '" y="' + (29 + i * 30) + '" class="t mid">' + a + "</text>"; }).join(""); };
    var before = "", after = "", i, k;
    for (i = 0; i < 7; i++) for (k = 0; k < 3; k++) before += '<path d="M70 ' + (100 + k * 16) + " C 170 " + (100 + k * 16) + ", 180 " + (19 + i * 30 + k * 6) + ", 268 " + (19 + i * 30 + k * 6) + '" class="gl old"/>';
    ["Design", "Construction", "Completion"].forEach(function (g, j) {
      var gy = 44 + j * 66;
      after += '<path d="M70 116 C 100 116, 100 ' + (gy + 14) + ", 122 " + (gy + 14) + '" class="gl new"/><rect x="122" y="' + gy + '" width="92" height="28" rx="3" class="gate"/><text x="168" y="' + (gy + 18) + '" class="t mid gt">' + g + "</text>";
      for (i = 0; i < 7; i++) after += '<path d="M214 ' + (gy + 14) + " C 244 " + (gy + 14) + ", 244 " + (25 + i * 30) + ", 268 " + (25 + i * 30) + '" class="gl thin"/>';
    });
    var proj = '<rect x="6" y="96" width="64" height="40" rx="3" class="gate"/><text x="38" y="120" class="t mid gt">Project</text>';
    el.innerHTML = '<div><h3>Before: every agency separately</h3><svg viewBox="0 0 340 232" class="dwg gates">' + before + proj + ag(268) + '</svg><p class="small">Each QP submitted to each agency at each stage, and chased each reply.</p></div>' +
      '<div><h3>CORENET X: three gateways</h3><svg viewBox="0 0 340 232" class="dwg gates">' + after + proj + ag(268) + '</svg><p class="small">One coordinated submission per gateway. All seven agencies answer together within 20 working days.</p></div>';
  })();

  window.BPVIZ = { process: processMap, fees: feeBar };
  A.refresh();
})();
