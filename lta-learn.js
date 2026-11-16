/* LTA mode Learn page: parking bay and aisle tester, ramp tester, parking range calculator, railway zone tester.
   Every number is copied from an entry in lta-data.js, named beside it. */
(function () {
  "use strict";
  if (window.BPMODE !== "lta") return;
  var D = window.BPDATA, box = document.getElementById("lta-learn"); if (!box) return;
  var $ = function (s) { return document.querySelector(s); };
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  var RULE = {}; D.entries.forEach(function (e) { RULE[e.id] = e; });
  function cite(id) { var r = RULE[id]; return r ? '<span class="ref mono">' + esc(r.ref) + "</span>" + (r.src ? ' <a href="' + esc(r.src) + '" target="_blank" rel="noopener">Source</a>' : "") : ""; }
  function slider(id, label, min, max, val, step, unit) { return '<label class="field"><span>' + esc(label) + ': <b id="' + id + '-v">' + val + "</b> " + unit + '</span><input type="range" id="' + id + '" min="' + min + '" max="' + max + '" value="' + val + '" step="' + step + '"></label>'; }
  function select(id, label, opts, def) { return '<label class="field"><span>' + esc(label) + '</span><select id="' + id + '">' + opts.map(function (o) { return '<option value="' + o[0] + '"' + (o[0] === def ? " selected" : "") + ">" + esc(o[1]) + "</option>"; }).join("") + "</select></label>"; }
  function val(id) { var el = document.getElementById(id), v = Number(el.value), o = document.getElementById(id + "-v"); if (o) o.textContent = v.toLocaleString("en-SG"); return v; }
  function n(x) { return Math.round(x).toLocaleString("en-SG"); }
  function big(a, label, ref) { return "<div><b>" + esc(a) + "</b><span>" + esc(label) + "</span><small>" + esc(ref) + "</small></div>"; }
  function chk(ok, head, text, id) { return '<div class="chk ' + (ok ? "ok" : "bad") + '"><b>' + esc(head) + "</b><span>" + esc(text) + '</span><span class="small">' + cite(id) + "</span></div>"; }

  /* ---------- 1. bays and aisle: [one-way with bays both sides, two-way] ---------- */
  var AISLE = { "90": [6.0, 6.6], "60": [4.8, 6.6], "45": [4.8, 6.3], "30": [4.2, 6.3], "0": [3.6, 6.0] };
  function pkDraw() {
    var ang = $("#pk-a").value, two = $("#pk-f").value === "2", w = val("pk-w"), a = AISLE[ang][two ? 1 : 0], t = ang * Math.PI / 180;
    var depth = ang === "0" ? 2.4 : 4.8 * Math.sin(t) + 2.4 * Math.cos(t), pitch = ang === "0" ? 5.4 : 2.4 / Math.sin(t), mod = 2 * depth + a, ok = w >= mod - 1e-9;
    var k = Math.min(520 / 30, 230 / Math.max(mod, w)), x0 = 40, y0 = 20, s = '<svg viewBox="0 0 600 290" class="dwg" role="img" aria-label="Plan of two rows of parking bays with the aisle between them">';
    s += '<rect x="' + x0 + '" y="' + y0 + '" width="520" height="' + (w * k) + '" class="plot" style="fill:' + (ok ? "#F3F5F6" : "#F4C9CB") + '"/>';
    var bays = Math.floor(520 / (pitch * k)), top = y0 + (w * k - mod * k) / 2;
    for (var i = 0; i < bays; i++) { var bx = x0 + i * pitch * k; s += '<rect x="' + bx + '" y="' + top + '" width="' + (pitch * k) + '" height="' + (depth * k) + '" class="bay"/><rect x="' + bx + '" y="' + (top + (depth + a) * k) + '" width="' + (pitch * k) + '" height="' + (depth * k) + '" class="bay"/>'; }
    var ay = top + depth * k; s += '<rect x="' + x0 + '" y="' + ay + '" width="520" height="' + (a * k) + '" class="road"/><text x="300" y="' + (ay + a * k / 2 + 4) + '" class="t mid">aisle ' + a.toFixed(1) + " m, " + (two ? "two-way" : "one-way") + "</text>";
    s += '<text x="' + x0 + '" y="' + (y0 + w * k + 16) + '" class="t">width available ' + w.toFixed(1) + " m · needed " + mod.toFixed(2) + " m</text></svg>";
    $("#pk-svg").innerHTML = s;
    $("#pk-out").innerHTML = '<div class="bigs">' + big(a.toFixed(1) + " m", "Aisle width", (ang === "0" ? "parallel" : ang + " degrees") + ", " + (two ? "two-way" : "one-way")) + big(depth.toFixed(2) + " m", "Depth of each row", ang === "0" ? "2.4 m lot" : "2.4 x 4.8 m lot, angled") + big(mod.toFixed(2) + " m", "Two rows and the aisle", "wall to wall") + "</div>" +
      chk(ok, ok ? "It fits" : "Too narrow", w.toFixed(1) + " m is available and " + mod.toFixed(2) + " m is needed for two rows." + (ok ? "" : " Try a flatter angle or one-way flow."), "lta-r-p-aisle") +
      '<p class="small">A lot beside a column or wall widens to 2.7 m, or 3.0 m with one on each side. ' + cite("lta-r-p-lot") + "</p>";
  }

  /* ---------- 2. ramp ---------- */
  function rmDraw() {
    var rise = val("rm-h"), len = val("rm-l"), head = val("rm-c"), g = len / rise, okG = g >= 8.3, pref = g >= 10, okH = head >= 2.2;
    var k = Math.min(500 / len, 150 / rise), x0 = 50, y0 = 230;
    $("#rm-svg").innerHTML = '<svg viewBox="0 0 600 260" class="dwg" role="img" aria-label="Section of a car park ramp showing its gradient and headroom">' +
      '<line x1="20" y1="' + y0 + '" x2="' + x0 + '" y2="' + y0 + '" class="ln thick"/><line x1="' + x0 + '" y1="' + y0 + '" x2="' + (x0 + len * k) + '" y2="' + (y0 - rise * k) + '" class="ln thick" style="stroke:' + (okG ? "var(--ink)" : "var(--bad)") + '"/><line x1="' + (x0 + len * k) + '" y1="' + (y0 - rise * k) + '" x2="590" y2="' + (y0 - rise * k) + '" class="ln thick"/>' +
      '<line x1="' + x0 + '" y1="' + (y0 + 14) + '" x2="' + (x0 + len * k) + '" y2="' + (y0 + 14) + '" class="dim"/><text x="' + (x0 + len * k / 2) + '" y="' + (y0 + 28) + '" class="t mid">' + len + ' m long</text><text x="' + (x0 + len * k + 8) + '" y="' + (y0 - rise * k / 2) + '" class="t">' + rise.toFixed(1) + " m rise</text>" +
      '<line x1="20" y1="' + (y0 - head * 30) + '" x2="140" y2="' + (y0 - head * 30) + '" class="ln dash" style="stroke:' + (okH ? "var(--ink-3)" : "var(--bad)") + '"/><text x="22" y="' + (y0 - head * 30 - 6) + '" class="t">lowest fitting, ' + head.toFixed(2) + " m</text></svg>";
    $("#rm-out").innerHTML = '<div class="bigs">' + big("1 in " + g.toFixed(1), "Gradient of the ramp", (100 / g).toFixed(1) + "%") + big((rise * 10).toFixed(1) + " m", "Length for 1 in 10", "the preferred gradient") + big((rise * 8.3).toFixed(1) + " m", "Shortest allowed", "1 in 8.3") + "</div>" +
      chk(okG, pref ? "At the preferred gradient or flatter" : okG ? "Allowed, but steeper than preferred" : "Too steep", "1 in " + g.toFixed(1) + " against a maximum of 1 in 8.3 and a preferred 1 in 10. Transitions are needed at the floor levels.", "lta-r-p-ramp") +
      chk(okH, okH ? "Headroom is enough" : "Headroom too low", head.toFixed(2) + " m against 2.2 m, measured under beams, signs and sprinklers.", "lta-r-p-head");
  }

  /* ---------- 3. number of lots ---------- */
  var RNG = { res: ["Flats or condominium", [[2, 1.25], [1.25, 1], [1.25, 1]], "homes"], office: ["Office", [[950, 590], [530, 330], [260, 210]], "m² GFA"], shop: ["Shops", [[840, 530], [420, 210], [200, 160]], "m² GFA"], fact: ["Multi-user factory", [[460, 370], [460, 370], [460, 370]], "m² GFA"] };
  function nmDraw() {
    var u = $("#nm-u").value, z = Number($("#nm-z").value) - 1, q = val("nm-q"), p = val("nm-p"), r = RNG[u][1][z], lo = Math.round(q / r[0]), hi = Math.round(q / r[1]), st = p < lo ? "low" : p > hi ? "high" : "ok";
    var max = Math.max(hi * 1.25, p * 1.05, 10), k = 520 / max, x0 = 40;
    $("#nm-svg").innerHTML = '<svg viewBox="0 0 600 120" class="dwg" role="img" aria-label="Bar showing the allowed range of parking lots and the number proposed">' +
      '<rect x="' + x0 + '" y="40" width="520" height="26" class="plot" style="fill:#F3F5F6"/><rect x="' + (x0 + lo * k) + '" y="40" width="' + Math.max(2, (hi - lo) * k) + '" height="26" style="fill:var(--ok-soft);stroke:var(--ok);stroke-width:2"/>' +
      '<text x="' + (x0 + lo * k) + '" y="32" class="t" text-anchor="end">lower ' + n(lo) + '</text><text x="' + (x0 + hi * k + 4) + '" y="32" class="t">upper ' + n(hi) + "</text>" +
      '<line x1="' + (x0 + p * k) + '" y1="30" x2="' + (x0 + p * k) + '" y2="78" style="stroke:' + (st === "ok" ? "var(--ink)" : "var(--bad)") + ';stroke-width:4"/><text x="' + (x0 + p * k) + '" y="96" class="t mid">proposed ' + n(p) + "</text></svg>";
    $("#nm-out").innerHTML = '<div class="bigs">' + big(n(lo), "Lower bound", u === "res" ? "1 lot per " + r[0] + " homes" : "1 lot per " + r[0] + " m²") + big(n(hi), "Upper bound", u === "res" ? "1 lot per " + r[1] + " home" + (r[1] === 1 ? "" : "s") : "1 lot per " + r[1] + " m²") + (st === "low" ? big("S$" + n((lo - p) * 16000), "Deficiency charge", (lo - p) + " lots x S$16,000 (2019 rate)") : "") + "</div>" +
      (st === "ok" ? chk(true, "Within the range", "No further approval is needed for the number of lots.", "lta-r-p-num") : st === "low" ? chk(false, "Below the lower bound", "LTA must review the shortfall of " + (lo - p) + " lots, and a deficiency charge applies.", "lta-r-p-num") : chk(false, "Above the upper bound", (p - hi) + " lots more than the range allows. They need justification.", "lta-r-p-num")) +
      '<p class="small">Zone 1 is the city and Marina Bay, Zone 2 is within 400 m of an MRT or LRT station, Zone 3 is the rest. In a mixed development each use is rounded before adding. ' + cite("lta-pfee") + "</p>";
  }

  /* ---------- 4. railway ---------- */
  function rlDraw() {
    var d = val("rl-d"), base = $("#rl-b").value === "y", cx = 110, k = 9, gy = 80, inRpz = d <= 40, first = d <= 6;
    var s = '<svg viewBox="0 0 600 240" class="dwg" role="img" aria-label="Section across a railway tunnel showing the first reserve, the protection zone and the position of the works">';
    s += '<rect x="0" y="' + gy + '" width="600" height="160" class="soil"/><line x1="0" y1="' + gy + '" x2="600" y2="' + gy + '" class="ln"/>';
    s += '<rect x="' + (cx + 22) + '" y="' + (gy - 12) + '" width="' + (6 * k) + '" height="12" class="zone bad" style="stroke:var(--bad)"/><rect x="' + (cx + 22 + 6 * k) + '" y="' + (gy - 12) + '" width="' + (34 * k) + '" height="12" class="zone warn" style="stroke:var(--ink-3)"/>';
    s += '<text x="' + (cx + 22) + '" y="' + (gy - 18) + '" class="t">first reserve, about 6 m</text><text x="' + (cx + 22 + 40 * k - 4) + '" y="' + (gy - 18) + '" class="t" text-anchor="end">protection zone, 40 m</text>';
    s += '<circle cx="' + cx + '" cy="' + (gy + 80) + '" r="22" class="bay" style="stroke-width:4"/><rect x="' + (cx - 10) + '" y="' + (gy + 92) + '" width="20" height="4" class="rail"/><text x="' + (cx - 34) + '" y="' + (gy + 124) + '" class="t">railway tunnel</text>';
    var bx = Math.min(520, cx + 22 + d * k); s += '<rect x="' + bx + '" y="' + (gy - 70) + '" width="60" height="70" class="bld"/>' + (base ? '<rect x="' + bx + '" y="' + gy + '" width="60" height="50" class="bldg' + (inRpz ? " bad" : "") + '"/>' : "") + '<text x="' + bx + '" y="' + (gy - 76) + '" class="t">works, ' + d + " m away</text></svg>";
    $("#rl-svg").innerHTML = s;
    $("#rl-out").innerHTML = '<div class="bigs">' + big("15 mm", "Most the railway may move", "total movement") + big("1 in 1,000", "Differential movement", "or 15 mm if less") + big("15 mm/s", "Vibration limit", "peak particle velocity") + "</div>" +
      (!inRpz ? chk(true, "Outside the protection zone", "No railway protection submission is needed for this line.", "lta-r-r-zone")
        : first ? chk(false, "In the first reserve", "No piling, no ground anchors and no site office here. A crane within 6 m needs LTA's special approval. A full development proposal, building proposal and permit are needed.", "lta-r-r-pile")
        : d > 20 && !base ? chk(false, "In the zone: lodgement may apply", "With no basement, and if the site boundary is also more than 20 m from the structure, the proposal may be lodged and is acknowledged within 3 working days.", "lta-lodge")
        : chk(false, "In the protection zone", "A development proposal, then a building proposal and a permit, before any engineering work. " + (base ? "A PE (Geo) is needed for the basement excavation." : ""), "lta-r-r-zone")) +
      '<p class="small">The exact reserve lines come from the figures in the code and LTA\'s railway protection plan for the site. ' + cite("lta-r-r-move") + " · " + cite("lta-r-r-anchor") + "</p>";
  }

  box.innerHTML =
    '<h3>1. Do two rows of bays and an aisle fit</h3><p class="lead">The parking angle and the traffic direction set the aisle. The aisle and two rows set the width you need.</p><div class="viz"><div class="panel">' + select("pk-a", "Parking angle", [["90", "90 degrees"], ["60", "60 degrees"], ["45", "45 degrees"], ["30", "30 degrees"], ["0", "Parallel"]], "90") + select("pk-f", "Aisle", [["1", "One-way"], ["2", "Two-way"]], "2") + slider("pk-w", "Clear width available", 8, 22, 16, 0.1, "m") + '</div><div><div class="canvas" id="pk-svg"></div><div id="pk-out"></div></div></div>' +
    '<h3>2. Is the ramp too steep</h3><p class="lead">Rise over length gives the gradient. The headroom is measured under the lowest fitting.</p><div class="viz"><div class="panel">' + slider("rm-h", "Rise between floors", 1.5, 5, 3, 0.1, "m") + slider("rm-l", "Length of the ramp", 10, 60, 27, 0.5, "m") + slider("rm-c", "Clear height under the lowest fitting", 1.9, 3, 2.25, 0.05, "m") + '</div><div><div class="canvas" id="rm-svg"></div><div id="rm-out"></div></div></div>' +
    '<h3>3. How many car lots</h3><p class="lead">The number must fall inside a range that depends on the use and on how close the site is to a station.</p><div class="viz"><div class="panel">' + select("nm-u", "Use", Object.keys(RNG).map(function (k) { return [k, RNG[k][0]]; }), "res") + select("nm-z", "Zone", [["1", "Zone 1: city and Marina Bay"], ["2", "Zone 2: within 400 m of a station"], ["3", "Zone 3: rest of the island"]], "3") + slider("nm-q", "Homes, or m² of GFA", 50, 40000, 400, 50, "") + slider("nm-p", "Car lots proposed", 0, 800, 300, 5, "") + '</div><div><div class="canvas" id="nm-svg"></div><div id="nm-out"></div></div></div>' +
    '<h3>4. How close are the works to a railway</h3><p class="lead">Inside 40 m, nothing starts without LTA\'s written permission.</p><div class="viz"><div class="panel">' + slider("rl-d", "Distance from the railway structure", 0, 55, 12, 1, "m") + select("rl-b", "Basement", [["n", "No"], ["y", "Yes"]], "y") + '</div><div><div class="canvas" id="rl-svg"></div><div id="rl-out"></div></div></div>';

  pkDraw(); rmDraw(); nmDraw(); rlDraw();
  function redraw(e) { var id = e.target.id || ""; if (id.indexOf("pk-") === 0) pkDraw(); else if (id.indexOf("rm-") === 0) rmDraw(); else if (id.indexOf("nm-") === 0) nmDraw(); else if (id.indexOf("rl-") === 0) rlDraw(); }
  box.addEventListener("input", redraw); box.addEventListener("change", redraw);
})();
