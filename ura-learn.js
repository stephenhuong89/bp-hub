/* URA mode Learn page: plot ratio tester, landed plot plan, flats storey and unit guide, deadlines.
   Every number is copied from an entry in ura-data.js, named beside it. */
(function () {
  "use strict";
  if (window.BPMODE !== "ura") return;
  var D = window.BPDATA, box = document.getElementById("ura-learn"); if (!box) return;
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

  /* ---------- 1. plot ratio ---------- */
  function prDraw() {
    var site = val("ur-site"), gpr = val("ur-gpr"), gfa = val("ur-gfa"), allow = site * gpr, cap = allow * 1.1, over = gfa / allow - 1;
    var W = 560, max = Math.max(cap * 1.15, gfa * 1.05), k = W / max, x0 = 20;
    $("#ur-svg").innerHTML = '<svg viewBox="0 0 600 150" class="dwg" role="img" aria-label="Bar comparing proposed GFA with the allowable GFA and the bonus cap">' +
      '<rect x="' + x0 + '" y="50" width="' + (allow * k) + '" height="34" class="bldg"/><rect x="' + (x0 + allow * k) + '" y="50" width="' + ((cap - allow) * k) + '" height="34" class="bldg" style="fill:#F6E3B4"/>' +
      '<rect x="' + x0 + '" y="92" width="' + (gfa * k) + '" height="20" style="fill:' + (gfa > cap ? "var(--bad)" : gfa > allow ? "var(--warn)" : "var(--ok)") + '"/>' +
      '<line x1="' + (x0 + allow * k) + '" y1="36" x2="' + (x0 + allow * k) + '" y2="120" class="ln"/><text x="' + (x0 + allow * k - 4) + '" y="30" class="t" text-anchor="end">Master Plan limit ' + n(allow) + ' m²</text>' +
      '<line x1="' + (x0 + cap * k) + '" y1="36" x2="' + (x0 + cap * k) + '" y2="120" class="ln dash"/><text x="' + (x0 + cap * k + 4) + '" y="46" class="t">+10% bonus cap</text>' +
      '<text x="' + x0 + '" y="132" class="t">proposed ' + n(gfa) + " m²</text></svg>";
    $("#ur-out").innerHTML = '<div class="bigs">' + big(n(allow) + " m²", "Allowable GFA", "GPR x site area") + big((gfa / site).toFixed(2), "Plot ratio proposed", "GFA / site area") + big(n(cap) + " m²", "With every bonus", "10% cap") + "</div>" +
      (over <= 0 ? chk(true, "Within the Master Plan", "Uses " + (gfa / allow * 100).toFixed(0) + "% of the allowable GFA. Setbacks and height may still stop you reaching it.", "ura-r-gfa-gpr")
        : over <= 0.1 ? chk(false, "Needs bonus GFA", (over * 100).toFixed(1) + "% above the limit. Only named bonus schemes can cover it, up to 10% in total.", "ura-r-gfa-bonus")
        : chk(false, "Above the bonus cap", (over * 100).toFixed(1) + "% above the limit. Reduce the GFA, or test a higher plot ratio with an outline application.", "ura-outline"));
  }

  /* ---------- 2. landed plot ---------- */
  var BUF = { "1": [24, 5], "2": [12, 5], "3": [7.5, 3], "4": [7.5, 3], "5": [7.5, 0] };
  function ldDraw() {
    var w = val("ul-w"), d = val("ul-d"), cat = $("#ul-road").value, gcba = $("#ul-gcba").value === "y", three = $("#ul-area").value === "3";
    var b = BUF[cat], side = gcba ? 3 : 2, bw = w - 2 * side, bd = d - b[0] - side, ok = bw > 0 && bd > 0, area = w * d, foot = ok ? bw * bd : 0;
    var minA = gcba ? 1400 : 400, minW = gcba ? 18.5 : 10;
    var k = Math.min(380 / w, 250 / d), px = 300 - w * k / 2, py = 20, ry = py + d * k;
    var s = '<svg viewBox="0 0 600 330" class="dwg" role="img" aria-label="Plan of a landed house plot showing the road buffer, the setbacks and the area that can be built on">';
    s += '<rect x="0" y="' + ry + '" width="600" height="' + (330 - ry) + '" class="road"/><text x="10" y="' + Math.min(322, ry + 18) + '" class="t">Category ' + cat + " road · road reserve line</text>";
    s += '<rect x="' + px + '" y="' + py + '" width="' + (w * k) + '" height="' + (d * k) + '" class="plot"/>';
    if (b[1]) s += '<rect x="' + px + '" y="' + (ry - b[1] * k) + '" width="' + (w * k) + '" height="' + (b[1] * k) + '" style="fill:var(--ok-soft);stroke:var(--ok);stroke-width:1"/><text x="' + (px + 6) + '" y="' + (ry - b[1] * k / 2 + 4) + '" class="t">green buffer ' + b[1] + " m</text>";
    s += '<line x1="' + px + '" y1="' + (ry - b[0] * k) + '" x2="' + (px + w * k) + '" y2="' + (ry - b[0] * k) + '" class="setb"/><text x="' + (px + w * k + 6) + '" y="' + (ry - b[0] * k + 4) + '" class="t">' + b[0] + " m buffer</text>";
    if (ok) s += '<rect x="' + (px + side * k) + '" y="' + (py + side * k) + '" width="' + (bw * k) + '" height="' + (bd * k) + '" class="bldg"/><text x="300" y="' + (py + side * k + bd * k / 2 + 4) + '" class="t mid">may build here · ' + n(foot) + " m²</text>";
    s += '<text x="' + (px + w * k / 2) + '" y="14" class="t mid">' + w + " m wide · " + side + " m side and rear setbacks</text></svg>";
    $("#ul-svg").innerHTML = s;
    $("#ul-out").innerHTML = '<div class="bigs">' + big(n(area) + " m²", "Plot area", "width x depth") + big(ok ? n(foot) + " m²" : "0", "Area inside the setbacks", ok ? (foot / area * 100).toFixed(0) + "% of the plot" : "nothing left") + big(three ? "15.5 m" : "12 m", "Envelope height", three ? "3-storey area" : "2-storey area") + "</div>" +
      chk(area >= minA && w >= minW, area >= minA && w >= minW ? "Plot is large enough" : "Plot is too small", (gcba ? "A Good Class Bungalow" : "A detached house") + " needs at least " + n(minA) + " m² and " + minW + " m of width. This plot is " + n(area) + " m² and " + w + " m wide.", gcba ? "ura-r-l-gcba" : "ura-r-l-plot") +
      '<p class="small">Drawn for a detached house. Semi-detached and terrace houses share a wall, so one or both side setbacks fall away. Site coverage limits apply as well. ' + cite("ura-r-l-road") + " · " + cite("ura-r-l-side") + "</p>";
  }

  /* ---------- 3. flats ---------- */
  var ST = { "1.4": 5, "1.6": 12, "2.1": 24, "2.8": 36 };
  function flDraw() {
    var gpr = $("#uf-gpr").value, site = val("uf-site"), div = Number($("#uf-div").value), cat = $("#uf-road").value, st = ST[gpr], gfa = Number(gpr) * site;
    var buf = st >= 6 ? { "1": 30, "2": 15, "3": 10, "4": 7.5, "5": 7.5 }[cat] : { "1": 24, "2": 12, "3": 7.5, "4": 7.5, "5": 7.5 }[cat];
    var h = 5 + (st - 1) * 3.6 + (Number(gpr) >= 1.6 ? 1.4 : 0), k = 250 / Math.max(h, 40), gy = 290, bw = 70, s = '<svg viewBox="0 0 600 310" class="dwg" role="img" aria-label="Elevation showing the number of storeys the plot ratio guide allows">';
    s += '<line x1="0" y1="' + gy + '" x2="600" y2="' + gy + '" class="ln"/>';
    for (var i = 0; i < st; i++) { var fh = (i === 0 || (i === st - 1 && Number(gpr) >= 1.6) ? 5 : 3.6) * k, y = gy - (5 + Math.max(0, i - 1) * 3.6 + (i > 0 ? 3.6 : 0)) * k - (i === st - 1 && Number(gpr) >= 1.6 && i > 0 ? 1.4 * k : 0); s += '<rect x="265" y="' + y + '" width="' + bw + '" height="' + fh + '" class="bldg"/>'; }
    s += '<text x="300" y="' + (gy - h * k - 8) + '" class="t mid">' + st + " storeys · about " + h.toFixed(0) + ' m</text><line x1="' + (265 - buf * 3) + '" y1="' + (gy + 8) + '" x2="265" y2="' + (gy + 8) + '" class="dim"/><text x="' + (265 - buf * 3) + '" y="' + (gy + 20) + '" class="t">' + buf + " m road buffer, Category " + cat + "</text></svg>";
    $("#uf-svg").innerHTML = s;
    $("#uf-out").innerHTML = '<div class="bigs">' + big(String(st), "Storeys, by the guide", "GPR " + gpr) + big(n(gfa) + " m²", "Allowable GFA", "GPR x site area") + big(n(Math.floor(gfa / div)), "Most dwelling units", "GFA / " + div + " m²") + big(n(site * 0.5) + " m²", "Largest footprint", "50% site coverage") + "</div>" +
      '<p class="small">First storey 5.0 m, others 3.6 m. Street block plans, technical height limits and conservation can override the guide. ' + cite("ura-r-f-storey") + " · " + cite("ura-r-f-du") + " · " + cite("ura-r-f-cov") + "</p>";
  }

  var CAT = [["1", "Category 1"], ["2", "Category 2"], ["3", "Category 3"], ["4", "Category 4"], ["5", "Category 5"]];
  box.innerHTML =
    '<h3>1. How much floor area may the site carry</h3><p class="lead">Plot ratio times site area is the ceiling. Move the sliders.</p><div class="viz"><div class="panel">' + slider("ur-site", "Nett site area", 200, 20000, 2000, 50, "m²") + slider("ur-gpr", "Master Plan plot ratio", 0.5, 8, 2.1, 0.1, "") + slider("ur-gfa", "Proposed GFA", 100, 60000, 4400, 100, "m²") + '</div><div><div class="canvas" id="ur-svg"></div><div id="ur-out"></div></div></div>' +
    '<h3>2. Where on the plot may a landed house stand</h3><p class="lead">The road buffer and the setbacks leave a smaller rectangle than the plot.</p><div class="viz"><div class="panel">' + slider("ul-w", "Plot width", 6, 45, 16, 0.5, "m") + slider("ul-d", "Plot depth", 15, 80, 30, 1, "m") + select("ul-road", "Road in front", CAT, "5") + select("ul-area", "Landed housing area", [["2", "2-storey area"], ["3", "3-storey area"]], "2") + select("ul-gcba", "Good Class Bungalow Area", [["n", "No"], ["y", "Yes"]], "n") + '</div><div><div class="canvas" id="ul-svg"></div><div id="ul-out"></div></div></div>' +
    '<h3>3. How tall, and how many units, for flats</h3><p class="lead">For a residential site the plot ratio sets the storeys.</p><div class="viz"><div class="panel">' + select("uf-gpr", "Master Plan plot ratio", [["1.4", "1.4"], ["1.6", "1.6"], ["2.1", "2.1"], ["2.8", "2.8"]], "2.1") + slider("uf-site", "Nett site area", 1000, 40000, 6000, 100, "m²") + select("uf-div", "Unit divisor", [["85", "85 m², most areas outside the Central Area"], ["100", "100 m², the estates URA lists"]], "85") + select("uf-road", "Road in front", CAT, "3") + '</div><div><div class="canvas" id="uf-svg"></div><div id="uf-out"></div></div></div>' +
    '<h3>4. The dates that lapse</h3><div class="bigs">' + big("6 months", "Provisional permission lapses", "from grant") + big("2 years", "Written permission lapses", "from grant") + big("2 months", "Before expiry, to apply to extend", "written permission") + big("60 days", "To appeal to the Minister", "after a refusal") + big("1 month", "To pay the Land Betterment Charge", "after the liability order") + '</div><p class="srcline">' + cite("ura-s-valid") + " · " + cite("ura-s-appeal") + " · " + cite("ura-s-lbc") + "</p>";

  prDraw(); ldDraw(); flDraw();
  function redraw(e) { var id = e.target.id || ""; if (id.indexOf("ur-") === 0) prDraw(); else if (id.indexOf("ul-") === 0) ldDraw(); else if (id.indexOf("uf-") === 0) flDraw(); }
  box.addEventListener("input", redraw); box.addEventListener("change", redraw);
})();
