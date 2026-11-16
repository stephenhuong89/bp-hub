/* PUB mode Learn page: platform and crest level tester, peak runoff calculator, sewer setback and corridor tester, earth control figures.
   Every number is copied from an entry in pub-data.js, named beside it. */
(function () {
  "use strict";
  if (window.BPMODE !== "pub") return;
  var D = window.BPDATA, box = document.getElementById("pub-learn"); if (!box) return;
  var $ = function (s) { return document.querySelector(s); };
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  var RULE = {}; D.entries.forEach(function (e) { RULE[e.id] = e; });
  function cite(id) { var r = RULE[id]; return r ? '<span class="ref mono">' + esc(r.ref) + "</span>" + (r.src ? ' <a href="' + esc(r.src) + '" target="_blank" rel="noopener">Source</a>' : "") : ""; }
  function slider(id, label, min, max, val, step, unit) { return '<label class="field"><span>' + esc(label) + ': <b id="' + id + '-v">' + val + "</b> " + unit + '</span><input type="range" id="' + id + '" min="' + min + '" max="' + max + '" value="' + val + '" step="' + step + '"></label>'; }
  function select(id, label, opts, def) { return '<label class="field"><span>' + esc(label) + '</span><select id="' + id + '">' + opts.map(function (o) { return '<option value="' + o[0] + '"' + (o[0] === def ? " selected" : "") + ">" + esc(o[1]) + "</option>"; }).join("") + "</select></label>"; }
  function val(id) { var el = document.getElementById(id), v = Number(el.value), o = document.getElementById(id + "-v"); if (o) o.textContent = v.toLocaleString("en-SG"); return v; }
  function big(a, label, ref) { return "<div><b>" + esc(a) + "</b><span>" + esc(label) + "</span><small>" + esc(ref) + "</small></div>"; }
  function chk(ok, head, text, id) { return '<div class="chk ' + (ok ? "ok" : "bad") + '"><b>' + esc(head) + "</b><span>" + esc(text) + '</span><span class="small">' + cite(id) + "</span></div>"; }

  /* ---------- 1. platform and crest ---------- */
  function lvDraw() {
    var type = $("#pl-type").value, coast = $("#pl-coast").value === "n" ? 4.5 : 4.0, road = val("pl-road"), plat = val("pl-plat"), crest = val("pl-crest");
    var add = type === "sp" ? 1 : type === "com" ? 0.6 : 0.3, cr = type === "gen" ? 0.15 : 0.3, mpl = Math.max(coast, road + add), mc = mpl + cr, okP = plat >= mpl - 1e-9, okC = crest >= mc - 1e-9;
    var lo = Math.min(road, 3) - 0.6, hi = Math.max(plat, crest, mc) + 0.8, k = 220 / (hi - lo), Y = function (l) { return 260 - (l - lo) * k; };
    var s = '<svg viewBox="0 0 600 290" class="dwg" role="img" aria-label="Section through the road, the platform and the basement ramp, showing the minimum platform and crest levels">';
    s += '<rect x="0" y="' + Y(road) + '" width="170" height="' + (290 - Y(road)) + '" class="road"/><text x="8" y="' + (Y(road) - 6) + '" class="t">road ' + road.toFixed(2) + " m</text>";
    s += '<rect x="170" y="' + Y(plat) + '" width="260" height="' + (290 - Y(plat)) + '" class="plot"/><text x="180" y="' + (Y(plat) - 6) + '" class="t">platform ' + plat.toFixed(2) + " m</text>";
    s += '<path d="M430 ' + Y(plat) + " L470 " + Y(crest) + " L510 " + Y(crest) + " L600 " + Y(lo + 0.2) + " V290 H430 Z" + '" class="bldg' + (okC ? "" : " bad") + '"/><text x="452" y="' + (Y(crest) - 6) + '" class="t">crest ' + crest.toFixed(2) + ' m</text><text x="528" y="' + (Y(lo + 0.2) - 30) + '" class="t">to basement</text>';
    s += '<line x1="150" y1="' + Y(mpl) + '" x2="440" y2="' + Y(mpl) + '" class="setb"/><text x="186" y="' + (Y(mpl) + 14) + '" class="t">minimum platform ' + mpl.toFixed(2) + " m</text>";
    s += '<line x1="440" y1="' + Y(mc) + '" x2="600" y2="' + Y(mc) + '" class="setb"/><text x="446" y="' + (Y(mc) + 14) + '" class="t">minimum crest ' + mc.toFixed(2) + ' m</text><text x="8" y="16" class="t">levels in metres above Singapore Height Datum</text></svg>';
    $("#pl-svg").innerHTML = s;
    $("#pl-out").innerHTML = '<div class="bigs">' + big(mpl.toFixed(2) + " m", "Minimum platform level", mpl === coast ? "coast level governs" : add * 1000 + " mm above the road") + big(mc.toFixed(2) + " m", "Minimum crest level", cr * 1000 + " mm above the platform level") + "</div>" +
      chk(okP, okP ? "Platform is high enough" : "Platform too low", plat.toFixed(2) + " m against " + mpl.toFixed(2) + " m." + (okP ? "" : " Raise it, or apply to PUB with flood barriers at every opening."), type === "gen" ? "pub-r-d-mpl" : type === "com" ? "pub-r-d-mpl-com" : "pub-r-d-mpl-sp") +
      chk(okC, okC ? "Crest is high enough" : "Crest too low", crest.toFixed(2) + " m against " + mc.toFixed(2) + " m. Every ramp, stair, lift and vent into the basement needs one.", "pub-r-d-crest");
  }

  /* ---------- 2. peak runoff ---------- */
  function prDraw() {
    var area = val("pr-a"), imp = val("pr-imp"), i = val("pr-i"), c = (imp * 1.0 + (100 - imp) * 0.45) / 100, q = c * i * area / 360, qa = 0.55 * i * area / 360, need = area >= 0.2, over = c > 0.55;
    var W = 520, k = W / Math.max(q, qa) / 1.1;
    $("#pr-svg").innerHTML = '<svg viewBox="0 0 600 130" class="dwg" role="img" aria-label="Bars comparing the developed peak runoff with the allowable peak runoff">' +
      '<text x="20" y="22" class="t">developed site, C = ' + c.toFixed(2) + '</text><rect x="20" y="28" width="' + (q * k) + '" height="26" style="fill:' + (over && need ? "var(--bad)" : "var(--ink-3)") + '"/><text x="' + (26 + q * k) + '" y="46" class="t">' + q.toFixed(3) + " m³/s</text>" +
      '<text x="20" y="82" class="t">allowed, C = 0.55</text><rect x="20" y="88" width="' + (qa * k) + '" height="26" class="water"/><text x="' + (26 + qa * k) + '" y="106" class="t">' + qa.toFixed(3) + " m³/s</text></svg>";
    $("#pr-out").innerHTML = '<div class="bigs">' + big(c.toFixed(2), "Weighted runoff coefficient", imp + "% paved at 1.00, rest at 0.45") + big(q.toFixed(3) + " m³/s", "Peak runoff as designed", "C x i x A / 360") + big(Math.max(0, q - qa).toFixed(3) + " m³/s", "To be held back", "above the 0.55 limit") + "</div>" +
      (!need ? chk(true, "Below 0.2 ha", "Peak runoff control does not apply to a site of " + area + " ha.", "pub-r-d-peak") : over ? chk(false, "Detention needed", "The site is " + area + " ha and its coefficient is above 0.55. A detention tank or other features must hold back the difference and empty within 4 hours.", "pub-r-d-peak") : chk(true, "Within the limit", "The weighted coefficient is 0.55 or less.", "pub-r-d-peak")) +
      '<p class="small">Take the rainfall intensity from PUB\'s curves for a 10-year storm and the site\'s time of concentration; the slider is only for illustration. The calculation must be endorsed by a PE (Civil). ' + cite("pub-r-d-c") + " · " + cite("pub-r-d-tank") + "</p>";
  }

  /* ---------- 3. sewer ---------- */
  function swDraw() {
    var dia = val("sw-d"), depth = val("sw-z"), dist = val("sw-x"), dtss = $("#sw-dtss").value === "y", Dm = dia / 1000;
    var set = dtss ? 0.5 * Dm + 6 : dia <= 600 ? (depth <= 3 ? 1.0 : depth <= 5 ? 1.5 : 2.0) : dia <= 1500 ? 0.5 * Dm + 2.5 : dia <= 2500 ? 0.5 * Dm + 3 : 0.5 * Dm + 4, cor = dtss ? 40 : dia >= 900 ? 20 : 10;
    var state = dist < set ? "bad" : dist <= cor ? "warn" : "ok", cx = 90, k = 480 / Math.max(cor * 1.15, dist + 4), gy = 70, py = Math.min(190, gy + depth * 12), r = Math.max(5, Math.min(26, Dm * 14));
    var s = '<svg viewBox="0 0 600 230" class="dwg" role="img" aria-label="Section across a public sewer showing the setback, the corridor and the position of the works">';
    s += '<rect x="0" y="' + gy + '" width="600" height="160" class="soil"/><line x1="0" y1="' + gy + '" x2="600" y2="' + gy + '" class="ln"/>';
    s += '<rect x="' + cx + '" y="' + (gy - 10) + '" width="' + (set * k) + '" height="10" class="zone bad" style="stroke:var(--bad)"/><rect x="' + (cx + set * k) + '" y="' + (gy - 10) + '" width="' + Math.max(0, (cor - set) * k) + '" height="10" style="fill:#F6E3B4;stroke:var(--ink-3)"/>';
    s += '<text x="' + cx + '" y="' + (gy - 16) + '" class="t">setback ' + set.toFixed(2) + ' m</text><text x="' + (cx + cor * k - 4) + '" y="' + (gy - 16) + '" class="t" text-anchor="end">corridor ' + cor + " m</text>";
    s += '<circle cx="' + cx + '" cy="' + py + '" r="' + r + '" class="water"/><text x="' + (cx - 60) + '" y="' + (py + 4) + '" class="t">' + dia + ' mm</text><line x1="' + cx + '" y1="' + gy + '" x2="' + cx + '" y2="' + (py - r) + '" class="ln dash"/>';
    var bx = cx + dist * k; s += '<rect x="' + bx + '" y="' + (gy - 64) + '" width="70" height="64" class="bld"/><rect x="' + (bx - 8) + '" y="' + gy + '" width="86" height="16" class="bldg' + (state === "bad" ? " bad" : "") + '"/><text x="' + (bx - 8) + '" y="' + (gy + 32) + '" class="t">footing edge, ' + dist + " m from the centreline</text></svg>";
    $("#sw-svg").innerHTML = s;
    $("#sw-out").innerHTML = '<div class="bigs">' + big(set.toFixed(2) + " m", "Setback, footing edge to centreline", dtss ? "deep tunnel sewer" : dia <= 600 ? "by depth" : "half the diameter plus an allowance") + big(cor + " m", "Corridor each side", dtss ? "deep tunnel sewer" : dia >= 900 ? "900 mm and above" : "under 900 mm") + "</div>" +
      (state === "bad" ? chk(false, "Inside the setback", "Nothing may be built here. Move the structure, footing included, at least " + set.toFixed(2) + " m from the centreline.", "pub-r-s-setback") : state === "warn" ? chk(false, "Inside the corridor", "Allowed only with a POWS approval. Excavation over 0.5 m, piling and any structure, even a site office, need a plan approved by PUB.", "pub-r-s-corr") : chk(true, "Outside the corridor", "No POWS submission is needed for this sewer.", "pub-r-s-corr")) +
      '<p class="small">Limits at the sewer during works: vibration 15 mm/s, crack width 0.1 mm. ' + cite("pub-r-s-impact") + "</p>";
  }

  box.innerHTML =
    '<h3>1. How high must the platform and the basement crest be</h3><p class="lead">The platform keeps the building above flood water. The crest keeps the water out of the basement.</p><div class="viz"><div class="panel">' + select("pl-type", "Development", [["gen", "Landed house or other general development"], ["com", "Commercial, industrial, institutional, multi-unit residential"], ["sp", "Special facility, or linked to underground MRT"]], "com") + select("pl-coast", "Coast", [["s", "Southern: 4.0 m SHD"], ["n", "Northern: 4.5 m SHD"]], "s") + slider("pl-road", "Adjacent road level", 2.5, 12, 4.2, 0.05, "m SHD") + slider("pl-plat", "Proposed platform level", 2.5, 13, 4.6, 0.05, "m SHD") + slider("pl-crest", "Proposed crest level", 2.5, 14, 4.9, 0.05, "m SHD") + '</div><div><div class="canvas" id="pl-svg"></div><div id="pl-out"></div></div></div>' +
    '<h3>2. How much rain may leave the site</h3><p class="lead">From 0.2 hectares the peak must be held to what a half-paved site would shed.</p><div class="viz"><div class="panel">' + slider("pr-a", "Site area", 0.05, 5, 0.6, 0.05, "ha") + slider("pr-imp", "Roofs, roads and paving", 0, 100, 80, 5, "% of the site") + slider("pr-i", "Rainfall intensity, for illustration", 50, 300, 180, 10, "mm/h") + '</div><div><div class="canvas" id="pr-svg"></div><div id="pr-out"></div></div></div>' +
    '<h3>3. How close may you build to a public sewer</h3><p class="lead">Two distances matter: the setback, where nothing may stand, and the corridor, where works need approval.</p><div class="viz"><div class="panel">' + slider("sw-d", "Sewer diameter", 150, 3000, 300, 50, "mm") + slider("sw-z", "Depth of the sewer", 1, 12, 4, 0.5, "m") + select("sw-dtss", "Deep tunnel sewer", [["n", "No"], ["y", "Yes"]], "n") + slider("sw-x", "Footing edge to the sewer centreline", 0, 50, 6, 0.5, "m") + '</div><div><div class="canvas" id="sw-svg"></div><div id="sw-out"></div></div></div>' +
    '<h3>4. Keeping silt on the site</h3><div class="bigs">' + big("50 mg/L", "Most silt allowed in the discharge", "total suspended solids") + big("5-year", "Storm the measures are designed for", "holding pond included") + big("10 hours", "To treat and empty after rain", "holding pond or sump") + big("0.2 ha", "Site area from which CCTV is needed", "linked to PUB's detection system") + big("Every rain", "When the measures are inspected", "and the QECP audits each stage") + '</div><p class="srcline">' + cite("pub-r-e-tss") + " · " + cite("pub-r-e-storm") + " · " + cite("pub-r-e-cctv") + "</p>";

  lvDraw(); prDraw(); swDraw();
  function redraw(e) { var id = e.target.id || ""; if (id.indexOf("pl-") === 0) lvDraw(); else if (id.indexOf("pr-") === 0) prDraw(); else if (id.indexOf("sw-") === 0) swDraw(); }
  box.addEventListener("input", redraw); box.addEventListener("change", redraw);
})();
