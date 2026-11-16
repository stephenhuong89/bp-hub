/* SCDF mode Learn page: travel distance tester, exit staircase calculator, what height triggers.
   Every number is copied from a Fire Code entry in the data set, named beside it. */
(function () {
  "use strict";
  if (window.BPMODE !== "scdf") return;
  var D = window.BPDATA, box = document.getElementById("scdf-learn"); if (!box) return;
  var $ = function (s) { return document.querySelector(s); };
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  var RULE = {}; D.entries.forEach(function (e) { RULE[e.id] = e; });
  function cite(id) { var r = RULE[id]; return r ? '<span class="ref mono">' + esc(String(r.ref).split(" (read")[0]) + "</span>" + (r.src ? ' <a href="' + esc(r.src) + '" target="_blank" rel="noopener">Source</a>' : "") : ""; }
  function slider(id, label, min, max, val, step, unit) { return '<label class="field"><span>' + esc(label) + ': <b id="' + id + '-v">' + val + "</b> " + unit + '</span><input type="range" id="' + id + '" min="' + min + '" max="' + max + '" value="' + val + '" step="' + step + '"></label>'; }
  function select(id, label, opts, def) { return '<label class="field"><span>' + esc(label) + '</span><select id="' + id + '">' + opts.map(function (o) { return '<option value="' + o[0] + '"' + (o[0] === def ? " selected" : "") + ">" + esc(o[1]) + "</option>"; }).join("") + "</select></label>"; }
  function val(id) { var el = document.getElementById(id), v = Number(el.value), o = document.getElementById(id + "-v"); if (o) o.textContent = v.toLocaleString("en-SG"); return v; }
  function n(x) { return Math.round(x).toLocaleString("en-SG"); }
  function big(a, label, ref) { return "<div><b>" + esc(a) + "</b><span>" + esc(label) + "</span><small>" + esc(ref) + "</small></div>"; }
  function chk(ok, head, text, id) { return '<div class="chk ' + (ok ? "ok" : "bad") + '"><b>' + esc(head) + "</b><span>" + esc(text) + '</span><span class="small">' + cite(id) + "</span></div>"; }

  /* ---------- 1. travel distance: [one-way unsprinklered, one-way sprinklered, two-way unsprinklered, two-way sprinklered, rule id] ---------- */
  var TD = { office: [15, 30, 45, 75, "rule-FC-04", "Office"], shop: [15, 25, 45, 60, "rule-FC-05", "Shop, restaurant, school, car park"], factory: [15, 25, 30, 60, "rule-FC-06", "Factory or warehouse"], hotel: [15, 20, 30, 60, "rule-FC-08", "Hotel, hostel or dormitory"], ward: [15, 25, 30, 45, "rule-FC-09", "Inpatient healthcare"], hazard: [10, 20, 20, 35, "rule-FC-07", "High hazard"] };
  function tdDraw() {
    var u = TD[$("#sd-use").value], spr = $("#sd-spr").value === "y", two = $("#sd-exits").value === "2", d = val("sd-d"), lim = u[(two ? 2 : 0) + (spr ? 1 : 0)], ok = d <= lim;
    var W = 520, x0 = 40, k = W / Math.max(80, d * 1.1, lim * 1.15), y = 120;
    var s = '<svg viewBox="0 0 600 220" class="dwg" role="img" aria-label="Plan of a room showing the travel distance from the furthest point to the exit">';
    s += '<rect x="' + x0 + '" y="40" width="' + W + '" height="140" class="bld"/>';
    s += '<rect x="' + (x0 - 6) + '" y="' + (y - 16) + '" width="12" height="32" style="fill:var(--ok)"/><text x="' + (x0 - 30) + '" y="' + (y + 4) + '" class="t">EXIT</text>';
    if (two) s += '<rect x="' + (x0 + W - 6) + '" y="56" width="12" height="32" style="fill:var(--ok)"/><text x="' + (x0 + W + 10) + '" y="76" class="t">EXIT</text>';
    s += '<line x1="' + (x0 + lim * k) + '" y1="40" x2="' + (x0 + lim * k) + '" y2="180" class="ln dash"/><text x="' + (x0 + lim * k + 4) + '" y="36" class="t">limit ' + lim + " m</text>";
    s += '<path d="M' + (x0 + 6) + " " + y + " H" + Math.min(x0 + W - 10, x0 + d * k) + '" class="exitp' + (ok ? "" : " bad") + '"/><circle cx="' + Math.min(x0 + W - 10, x0 + d * k) + '" cy="' + y + '" r="7" class="fire" style="fill:' + (ok ? "var(--ink)" : "var(--bad)") + '"/>';
    s += '<text x="' + Math.min(x0 + W - 120, x0 + d * k + 12) + '" y="' + (y - 12) + '" class="t">furthest point, ' + d + ' m</text><text x="' + x0 + '" y="204" class="t">' + (two ? "two exits, in different directions" : "one way out") + "</text></svg>";
    $("#sd-svg").innerHTML = s;
    $("#sd-out").innerHTML = '<div class="bigs">' + big(lim + " m", "Travel distance limit", (two ? "two-way" : "one-way") + ", " + (spr ? "sprinklered" : "not sprinklered")) + big((spr ? 20 : 15) + " m", "Longest dead end", spr ? "sprinklered" : "not sprinklered") + big(n(lim * 2 / 3) + " m", "Direct distance, open floor", "two-thirds of the limit") + "</div>" +
      chk(ok, ok ? "Within the limit" : "Too far", d + " m against " + lim + " m for " + u[5].toLowerCase() + ". " + (ok ? "" : two ? "Add an exit, or sprinkler the floor if it is not." : "A second exit in another direction raises the limit to " + u[2 + (spr ? 1 : 0)] + " m."), u[4]) +
      '<p class="small">Travel distance follows the route a person walks, around walls and furniture. ' + cite("rule-FC-11") + " · " + cite("rule-FC-12") + "</p>";
  }

  /* ---------- 2. exits: [m2 per person, persons per unit of stair width, label] ---------- */
  var OC = { office: [10, 60, "Office"], shop: [5, 60, "Shop or supermarket"], rest: [1.5, 60, "Restaurant"], bar: [1, 60, "Bar or pub"], class: [1.5, 60, "Classroom"], gym: [3.5, 60, "Gymnasium"], hotel: [15, 45, "Hotel or hostel"] };
  function exDraw() {
    var u = OC[$("#se-use").value], area = val("se-area"), occ = Math.ceil(area / u[0]), stairs = 2, per;
    for (;;) { per = Math.max(2, Math.ceil(occ / (u[1] * stairs) * 2) / 2); if (per <= 4 || stairs >= 12) break; stairs++; }
    var width = { 2: 1000, 2.5: 1250, 3: 1500, 3.5: 1750, 4: 2000 }[per] || 2000;
    var s = '<svg viewBox="0 0 600 150" class="dwg" role="img" aria-label="Exit staircases needed, drawn to relative width">';
    for (var i = 0; i < stairs; i++) { var x = 30 + i * (540 / stairs), w = Math.min(540 / stairs - 14, width / 30); s += '<rect x="' + x + '" y="30" width="' + w + '" height="80" class="bldg"/>'; for (var t = 1; t < 7; t++) s += '<line x1="' + x + '" y1="' + (30 + t * 11.4) + '" x2="' + (x + w) + '" y2="' + (30 + t * 11.4) + '" class="ln thin"/>'; s += '<text x="' + x + '" y="128" class="t">' + width + " mm</text>"; }
    s += "</svg>";
    $("#se-svg").innerHTML = s;
    $("#se-out").innerHTML = '<div class="bigs">' + big(n(occ), "People to design for", n(area) + " m² at " + u[0] + " m² each") + big(String(stairs), "Exit staircases", "at least two per storey") + big(width + " mm", "Width of each", per + " units of 500 mm") + big(n(u[1] * per * stairs), "People they can take", u[1] + " per unit") + "</div>" +
      '<p class="small">A staircase is at least 1,000 mm wide and counts for at most 2,000 mm. This sizes the staircases for one storey only; doors, corridors and the storeys above need their own check. ' + cite("rule-FC-02") + " · " + cite("rule-FC-13") + " · " + cite("rule-FC-17") + "</p>";
  }

  /* ---------- 3. height ---------- */
  function htDraw() {
    var h = val("sh-h"), res = $("#sh-pg").value === "res", gy = 280, top = 20, k = (gy - top) / 200, y = gy - h * k;
    var mark = function (m, label) { return '<line x1="150" y1="' + (gy - m * k) + '" x2="430" y2="' + (gy - m * k) + '" class="ln dash"/><text x="436" y="' + (gy - m * k + 4) + '" class="t">' + label + "</text>"; };
    $("#sh-svg").innerHTML = '<svg viewBox="0 0 600 300" class="dwg" role="img" aria-label="Elevation of a building against the heights that trigger fire safety systems">' +
      '<line x1="0" y1="' + gy + '" x2="600" y2="' + gy + '" class="ln"/><rect x="250" y="' + y + '" width="90" height="' + (gy - y) + '" class="bldg"/>' + mark(10, "10 m: rising main") + mark(24, "24 m: sprinklers, fire lift") + mark(60, "60 m: wet rising main") +
      '<text x="20" y="' + (gy - 6) + '" class="t">fire engine accessway level</text><text x="295" y="' + Math.max(14, y - 6) + '" class="t mid">' + h + " m to the highest habitable floor</text></svg>";
    var R = [[h > 10 && h <= 60, "Dry rising main", "Above 10 m, up to 60 m", "rule-FC-36"], [h > 60, "Wet rising main", "Above 60 m", "rule-FC-36"], [h > 24 && !res, "Sprinklers on every storey", res ? "Not for residential unless required elsewhere" : "Above 24 m", "rule-FC-38"],
      [h > 24, res ? "Fire lift, at least 1" : "Fire lifts, at least 2", "Above 24 m", "rule-FC-39"], [h > 24 && !res, "Evacuation lift", "Above 24 m", "rule-FC-40"], [true, "Fire engine accessway " + (h > 50 ? "7 m" : "6 m") + " wide", h > 50 ? "Above 50 m" : "Up to 50 m", "rule-FC-34"],
      [h > 24, "Compartments of 2,000 m², one storey each", "Above 24 m", "rule-FC-27"]];
    $("#sh-out").innerHTML = '<div class="roles">' + R.map(function (r) { return '<div class="role' + (r[0] ? " on" : "") + '"><b>' + esc(r[1]) + "</b><span>" + esc(r[0] ? r[2] : "Not triggered at this height") + "</span></div>"; }).join("") + '</div><p class="small">Habitable height is measured from the lowest fire engine accessway to the floor of the highest habitable storey. A basement needs a dry rising main at any height, and other clauses can require sprinklers lower down. ' + cite("rule-FC-03") + " · " + cite("rule-FC-36") + " · " + cite("rule-FC-39") + "</p>";
  }

  box.innerHTML =
    '<h3>1. How far may a person walk to an exit</h3><p class="lead">The limit depends on the use, on sprinklers, and on whether there is a second way out.</p><div class="viz"><div class="panel">' + select("sd-use", "Use", Object.keys(TD).map(function (k) { return [k, TD[k][5]]; }), "office") + select("sd-spr", "Sprinklered", [["n", "No"], ["y", "Yes"]], "n") + select("sd-exits", "Ways out", [["1", "One way out"], ["2", "Two exits in different directions"]], "2") + slider("sd-d", "Distance from the furthest point", 5, 100, 38, 1, "m") + '</div><div><div class="canvas" id="sd-svg"></div><div id="sd-out"></div></div></div>' +
    '<h3>2. How many staircases, and how wide</h3><p class="lead">Floor area gives the number of people. The people give the staircase width.</p><div class="viz"><div class="panel">' + select("se-use", "Use", Object.keys(OC).map(function (k) { return [k, OC[k][2]]; }), "office") + slider("se-area", "Floor area of the storey", 100, 6000, 1500, 50, "m²") + '</div><div><div class="canvas" id="se-svg"></div><div id="se-out"></div></div></div>' +
    '<h3>3. What height triggers</h3><p class="lead">Each threshold adds a system. Raise the building and watch them switch on.</p><div class="viz"><div class="panel">' + slider("sh-h", "Habitable height", 3, 200, 30, 1, "m") + select("sh-pg", "Building", [["other", "Office, shop, hotel, factory and other uses"], ["res", "Flats and condominiums"]], "other") + '</div><div><div class="canvas" id="sh-svg"></div><div id="sh-out"></div></div></div>';

  tdDraw(); exDraw(); htDraw();
  function redraw(e) { var id = e.target.id || ""; if (id.indexOf("sd-") === 0) tdDraw(); else if (id.indexOf("se-") === 0) exDraw(); else if (id.indexOf("sh-") === 0) htDraw(); }
  box.addEventListener("input", redraw); box.addEventListener("change", redraw);
})();
