/* ST mode Learn page: load path, appointments, excavation limit, borehole and pile-test calculators, contents of a good set.
   Every number is copied from an entry in st-data.js, named beside it. */
(function () {
  "use strict";
  if (window.BPMODE !== "st") return;
  var D = window.BPDATA, box = document.getElementById("st-learn"); if (!box) return;
  var $ = function (s) { return document.querySelector(s); };
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  var RULE = {}; D.entries.forEach(function (e) { RULE[e.id] = e; });
  function cite(id) { var r = RULE[id]; return r ? '<span class="ref mono">' + esc(r.ref) + "</span>" + (r.src ? ' <a href="' + esc(r.src) + '" target="_blank" rel="noopener">Source</a>' : "") : ""; }
  function slider(id, label, min, max, val, step, unit) { return '<label class="field"><span>' + esc(label) + ': <b id="' + id + '-v">' + val + "</b> " + unit + '</span><input type="range" id="' + id + '" min="' + min + '" max="' + max + '" step="' + (step || 1) + '" value="' + val + '"></label>'; }
  function val(id) { var el = document.getElementById(id), v = Number(el.value), o = document.getElementById(id + "-v"); if (o) o.textContent = v.toLocaleString("en-SG"); return v; }
  function big(n, label, ref) { return "<div><b>" + esc(n) + "</b><span>" + esc(label) + "</span><small>" + esc(ref) + "</small></div>"; }

  /* ---------- 1. load path ---------- */
  var LP = [
    { id: "slab", name: "Slab", does: "Carries the imposed load of the floor to the beams.", show: "Imposed load for each floor area, on a loading plan or on every framing plan.", wrong: "A change of use on the architect's plan that never reaches the loading plan.", rule: "st-r-load" },
    { id: "beam", name: "Beam", does: "Collects the slab load and takes it to the columns.", show: "A unique mark on the framing plan that matches the calculation index.", wrong: "A mark on the plan that appears on nobody's calculation page.", rule: "st-r-marks" },
    { id: "transfer", name: "Transfer beam", does: "Carries columns above that do not continue to the ground.", show: "Designed explicitly. A span over 10 m carrying 5 or more floors makes the building complex.", wrong: "Treated as an ordinary beam, with no pre-consultation.", rule: "st-r-complex" },
    { id: "column", name: "Column", does: "Takes every floor's load down to the foundation.", show: "Sizes and reinforcement by level. A key structural element, so the accredited checker recalculates it.", wrong: "Removing an existing column in A&A without treating it as complex.", rule: "st-kse" },
    { id: "wall", name: "Basement wall", does: "Holds the ground back during excavation and for life.", show: "Deflection limit on the plan as the work suspension level, alert at 70%.", wrong: "No limit set for the building next door.", rule: "st-r-zone" },
    { id: "cap", name: "Pile cap", does: "Shares the column load between the piles.", show: "Pile layout with type, capacity, settlement limits and load tests.", wrong: "A local pit deeper than 2 m dug without plan approval.", rule: "st-r-pilelay" },
    { id: "pile", name: "Pile", does: "Takes the load to ground that can carry it.", show: "Penetration, embedment, skin friction and end bearing. Shaft resistance at least 1.3 times the load.", wrong: "A pile more than 20% short accepted on site with no amendment plan.", rule: "st-r-shaft" },
    { id: "soil", name: "Ground", does: "Carries everything in the end.", show: "Boreholes to 5 m into hard stratum or 3 pile diameters below the toe.", wrong: "Too few boreholes, or boreholes that stop above the pile toe.", rule: "st-r-bhd" }
  ];
  function lpSvg(on) {
    var g = function (id, body, label, lx, ly) { return '<g class="lp' + (on === id ? " on" : "") + '" data-lp="' + id + '" tabindex="0" role="button" aria-label="' + label + '">' + body + '<text x="' + lx + '" y="' + ly + '" class="t">' + label + "</text></g>"; };
    var s = '<svg viewBox="0 0 620 470" class="dwg" role="img" aria-label="Section through a building showing how load travels from slab to ground">';
    s += '<rect x="0" y="250" width="620" height="220" class="soil"/><line x1="0" y1="250" x2="620" y2="250" class="ln"/>';
    s += g("soil", '<path d="M0 400 H620 V470 H0 Z"/>', "GROUND", 14, 440);
    [150, 300, 450].forEach(function (x, i) { s += (i === 1 ? g("pile", '<rect x="' + (x - 22) + '" y="320" width="12" height="110"/><rect x="' + (x + 10) + '" y="320" width="12" height="110"/>', "PILE", x + 30, 390) : '<rect x="' + (x - 22) + '" y="320" width="12" height="110" class="ftg"/><rect x="' + (x + 10) + '" y="320" width="12" height="110" class="ftg"/>'); });
    [150, 450].forEach(function (x) { s += '<rect x="' + (x - 34) + '" y="298" width="68" height="22" class="ftg"/>'; });
    s += g("cap", '<rect x="266" y="298" width="68" height="22"/>', "PILE CAP", 340, 314);
    s += g("wall", '<rect x="92" y="250" width="12" height="100"/>', "BASEMENT WALL", 4, 244);
    s += '<line x1="104" y1="298" x2="516" y2="298" class="ln"/><rect x="516" y="250" width="12" height="100" class="ftg"/>';
    /* columns: outer continuous, middle stops at transfer level */
    [150, 450].forEach(function (x, i) { s += (i === 0 ? g("column", '<rect x="' + (x - 8) + '" y="60" width="16" height="238"/>', "COLUMN", 96, 150) : '<rect x="' + (x - 8) + '" y="60" width="16" height="238" class="ftg"/>'); });
    s += '<rect x="292" y="210" width="16" height="88" class="ftg"/>';
    [225, 375].forEach(function (x) { s += '<rect x="' + (x - 7) + '" y="60" width="14" height="130" class="ftg"/>'; });
    s += g("transfer", '<rect x="142" y="190" width="316" height="20"/>', "TRANSFER BEAM", 464, 204);
    s += g("slab", '<rect x="142" y="52" width="316" height="8"/>', "SLAB", 464, 60);
    s += g("beam", '<rect x="142" y="120" width="316" height="12"/>', "BEAM", 464, 130);
    s += '<path d="M225 20 V52 M225 60 V190 H300 V298 V400" class="flow"/><path d="M219 40 l6 12 l6 -12" class="flow" style="stroke-dasharray:none"/><text x="236" y="26" class="t">load</text>';
    return s + "</svg>";
  }
  function lpDraw(id) {
    var p = LP.filter(function (x) { return x.id === id; })[0];
    $("#lp-svg").innerHTML = lpSvg(id);
    $("#lp-out").innerHTML = "<h3>" + esc(p.name) + '</h3><div class="chks"><div class="chk ok"><b>Job</b><span>' + esc(p.does) + '</span></div><div class="chk ok"><b>On the plan</b><span>' + esc(p.show) + '</span><span class="small">' + cite(p.rule) + '</span></div><div class="chk bad"><b>Goes wrong</b><span>' + esc(p.wrong) + "</span></div></div>";
  }

  /* ---------- 2. who must be appointed ---------- */
  function rolesUI() {
    return '<div class="viz"><div class="panel">' + slider("ro-ex", "Deepest excavation", 0, 30, 5, 0.5, "m") + slider("ro-val", "Value of building works", 1, 200, 12, 0.5, "S$ million") + slider("ro-st", "Storeys", 1, 60, 8, 1, "") +
      '<label class="field"><span>Works</span><select id="ro-type"><option value="major">New building or major A&A</option><option value="landed">Landed house, 3 storeys or less</option><option value="minor">A&A not affecting key structural elements</option></select></label></div><div><div class="roles" id="ro-out"></div><p class="small" id="ro-note"></p></div></div>';
  }
  function rolesDraw() {
    var ex = val("ro-ex"), v = val("ro-val"), st = val("ro-st"), type = $("#ro-type").value;
    var minor = type !== "major" && !(type === "landed" && st > 3), gbw = ex > 6 || st >= 30, ac = !minor || ex > 4 || gbw;
    var sup = v <= 7.5 ? "QP or site supervisor at critical works" : v <= 15 ? "1 RTO, full time" : v <= 30 ? "1 RE, full time" : v <= 75 ? "1 RE and 1 RTO" : v <= 150 ? "1 RE and 2 RTO" : "2 RE and 3 RTO";
    var roles = [[true, "Design QP", "PE, civil or structural"], [true, "Supervising QP", "Not the builder's employee on major works"], [ac, "Accredited checker", v > 15 ? "From a checking organisation" : "Individual checker allowed"], [ac && v > 15, "Checking organisation", "Above S$15 million"],
      [gbw, "PE (Geo)", "Designs and supervises the geotechnical works"], [gbw, "AC (Geo)", "Checks the geotechnical design"], [gbw, "Instrumentation builder", "Licensed specialist, independent monitoring"], [true, "Site supervision", sup], [v > 7.5, "Site supervision plan", "Submitted with the permit"]];
    $("#ro-out").innerHTML = roles.map(function (r) { return '<div class="role' + (r[0] ? " on" : "") + '"><b>' + esc(r[1]) + "</b><span>" + esc(r[0] ? r[2] : "Not required") + "</span></div>"; }).join("");
    $("#ro-note").innerHTML = (ex > 6 ? "Deeper than 6 m: geotechnical building works. " : ex > 4 ? "Above 4 m: outside the minor-works exemption. " : "") + (st >= 30 ? "30 storeys or more: the foundations are geotechnical building works. " : "") + cite("st-gbw") + " · " + cite("st-r-sup");
  }

  /* ---------- 3. excavation deflection ---------- */
  function exUI() {
    return '<div class="viz"><div class="canvas" id="ex-svg"></div><div class="panel"><h3>Retaining wall deflection limit</h3><p class="small">Set the excavation depth and how far the nearest existing building is. The limit goes on the plan as the work suspension level.</p>' +
      slider("ex-h", "Excavation depth H", 2, 30, 10, 0.5, "m") + slider("ex-x", "Distance to nearest existing structure", 0, 70, 6, 1, "m") +
      '<label class="field"><span>Ground beyond 2H</span><select id="ex-soil"><option value="stiff">Stiff ground</option><option value="soft">Soft clay</option></select></label>' + slider("ex-d", "Deflection measured on site", 0, 320, 30, 5, "mm") + '<div id="ex-out" class="chks"></div></div></div>';
  }
  function exDraw() {
    var H = val("ex-h"), x = val("ex-x"), soft = $("#ex-soil").value === "soft", d = val("ex-d");
    var zone = x <= H ? 1 : x <= 2 * H ? 2 : 3, pct = zone === 1 ? 0.5 : zone === 2 ? 0.7 : soft ? 1.0 : 0.7, lim = Math.round(H * 1000 * pct / 100), alert = Math.round(lim * 0.7);
    var wx = 170, gy = 110, k = Math.min(190 / H, (600 - wx - 20) / Math.max(2.2 * H, x + 6)), by = gy + H * k, state = d >= lim ? "bad" : d >= alert ? "warn" : "ok", col = state === "ok" ? "var(--ok)" : "var(--bad)";
    var zb = function (a, b, cls, label) { return '<rect x="' + (wx + a * k) + '" y="' + (gy - 12) + '" width="' + Math.max(0, Math.min(600 - wx - a * k, (b - a) * k)) + '" height="12" class="zone ' + cls + '" style="stroke:var(--ink-3)"/><text x="' + (wx + a * k + 6) + '" y="' + (gy + 16) + '" class="t">' + label + "</text>"; };
    var bx = wx + x * k, bulge = Math.max(3, Math.min(40, d / lim * 18));
    $("#ex-svg").innerHTML = '<svg viewBox="0 0 600 330" class="dwg" role="img" aria-label="Section through an excavation showing the wall, the deflection and the nearest building">' +
      '<rect x="' + wx + '" y="' + gy + '" width="' + (600 - wx) + '" height="260" class="soil"/><rect x="0" y="' + by + '" width="' + wx + '" height="' + (330 - by) + '" class="soil"/>' +
      '<line x1="' + wx + '" y1="' + gy + '" x2="600" y2="' + gy + '" class="ln"/>' + zb(0, H, "bad", "within H: 0.5%") + (wx + H * k < 600 ? zb(H, 2 * H, "ok", "H to 2H: 0.7%") : "") + (wx + 2 * H * k < 540 ? '<text x="' + (wx + 2 * H * k + 6) + '" y="' + (gy + 16) + '" class="t">beyond 2H</text>' : "") +
      '<line x1="' + wx + '" y1="' + gy + '" x2="' + wx + '" y2="' + (by + 24) + '" class="wallx"/><path d="M' + wx + " " + gy + " Q" + (wx - bulge * 2) + " " + (gy + H * k * 0.7) + " " + wx + " " + (by + 20) + '" class="defl" style="stroke:' + col + '"/>' +
      '<line x1="20" y1="' + (gy + H * k * 0.35) + '" x2="' + wx + '" y2="' + (gy + H * k * 0.35) + '" class="ln"/><line x1="20" y1="' + (gy + H * k * 0.7) + '" x2="' + wx + '" y2="' + (gy + H * k * 0.7) + '" class="ln"/>' +
      '<line x1="60" y1="' + gy + '" x2="60" y2="' + by + '" class="dim"/><text x="66" y="' + (gy + H * k / 2 - 6) + '" class="t">H ' + H + " m</text>" +
      '<rect x="' + Math.min(bx, 548) + '" y="' + (gy - 12 - 62) + '" width="50" height="62" class="bld"/><text x="' + (Math.min(bx, 548) + 25) + '" y="' + (gy - 12 - 68) + '" class="t mid">existing, ' + x + ' m away</text><text x="8" y="16" class="t">section, to scale</text></svg>';
    $("#ex-out").innerHTML = '<div class="bigs"><div><b>' + lim + ' mm</b><span>Work suspension level</span><small>' + pct + "% of H, zone " + zone + '</small></div><div><b>' + alert + ' mm</b><span>Alert level</span><small>70% of the limit</small></div></div>' +
      '<div class="chk ' + (state === "ok" ? "ok" : "bad") + '"><b>' + (state === "ok" ? "Carry on" : state === "warn" ? "Alert" : "Stop work") + "</b><span>" + d + " mm measured. " + (state === "ok" ? "Below the alert level." : state === "warn" ? "At or above the alert level: review, and act before the limit." : "At or above the work suspension level: work must stop.") + '</span><span class="small">' + cite("st-r-zone") + "</span></div>";
  }

  /* ---------- 4. boreholes and pile tests ---------- */
  function siUI() {
    return '<div class="viz"><div class="panel"><h3>Minimum boreholes and pile tests</h3>' + slider("si-st", "Storeys", 1, 60, 12, 1, "") + slider("si-area", "Site area", 200, 20000, 1500, 100, "m²") + slider("si-bl", "Blocks", 1, 12, 1, 1, "") + slider("si-p", "Working piles", 10, 1500, 200, 10, "") + slider("si-len", "Length of building", 10, 400, 60, 10, "m") + '</div><div><div class="bigs" id="si-out"></div><div class="canvas" id="si-svg"></div><p class="small" id="si-note"></p></div></div>';
  }
  function siDraw() {
    var st = val("si-st"), area = val("si-area"), bl = val("si-bl"), p = val("si-p"), len = val("si-len"), bh, out, note;
    if (st >= 10) { bh = Math.max(3, Math.ceil(area / 300), 2 * bl); out = big(bh, "boreholes, 10 to 30 m apart", "1 per 300 m², 2 per block, min 3") + big(Math.max(1, Math.ceil(p * 0.005)), "ultimate load tests", "1 or 0.5%") + big(Math.max(2, Math.ceil(p * 0.01), Math.ceil(len / 50)), "working load tests", "2, or 1%, or 1 per 50 m") + big(Math.max(2, Math.ceil(p * 0.02)), "integrity tests", "2 or 2%"); note = "10 storeys or more."; }
    else if (st >= 5) { bh = Math.max(2, bl); out = big(bh, "boreholes, 15 to 40 m apart", "1 per block, min 2") + big(Math.max(1, Math.ceil(p * 0.005)), "working load tests", "1 or 0.5%"); note = "5 to 9 storeys, footprint over 100 m²."; }
    else { bh = 0; out = big("QP", "decides the investigation", "No fixed minimum below 5 storeys in this circular"); note = "Below 5 storeys the circular sets no minimum number. The investigation must still be by an accredited body and PE-certified."; }
    $("#si-out").innerHTML = out;
    var cols = Math.ceil(Math.sqrt(bh * 1.6)) || 1, rows = Math.ceil(bh / cols) || 1, s = '<svg viewBox="0 0 400 190" class="dwg" role="img" aria-label="Site plan with the minimum number of boreholes"><rect x="20" y="16" width="360" height="158" class="bnd"/><text x="26" y="12" class="t">site, ' + area.toLocaleString("en-SG") + " m²</text>";
    for (var i = 0; i < bh; i++) { var cx = 20 + 360 * ((i % cols) + 0.5) / cols, cy = 16 + 158 * (Math.floor(i / cols) + 0.5) / rows; s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (bh > 40 ? 3.5 : 6) + '" style="fill:var(--sheet);stroke:var(--bad);stroke-width:2.5"/><line x1="' + (cx - 9) + '" y1="' + cy + '" x2="' + (cx + 9) + '" y2="' + cy + '" class="ln thin"/><line x1="' + cx + '" y1="' + (cy - 9) + '" x2="' + cx + '" y2="' + (cy + 9) + '" class="ln thin"/>'; }
    $("#si-svg").innerHTML = s + "</svg>";
    $("#si-note").innerHTML = esc(note) + " Depth: 5 m into ground with SPT N of 100 or more, or 3 pile diameters below the pile toe, whichever is deeper. " + cite("st-r-bh10");
  }

  /* ---------- 5. a good set ---------- */
  var SET = [
    ["First and last sheet", "QP certificate that loads from all the works were considered; accredited checker's certificate; sheet count 1 of n", "reg 9(1)"],
    ["General notes", "Material grades, design codes, foundation type", "reg 9(1)"],
    ["Loading plan", "Imposed load for each area of every floor", "reg 9(1)"],
    ["Framing plans", "Grid lines; every element with a unique mark matching the calculation index", "reg 9; Annex A1"],
    ["Column and wall schedule", "Sizes and reinforcement by level; transfer columns identified", "Annex A1"],
    ["Connection details", "Steel connections lettered and indexed to calculation pages; precast joints; prestress details", "Annex A1"],
    ["Cladding and barriers", "Fixing and framing details", "reg 9(1)"],
    ["Pile layout and schedule", "Type, location, penetration by zone, embedment, capacity, settlement and vibration limits, load tests", "reg 10"],
    ["Borehole plan and report", "Borehole positions on the pile layout; the minimum number; report in PDF and AGS", "reg 10; APPBCA-2016-08"],
    ["Excavation plans", "Instrumentation, impact assessment, geotechnical report, construction sequence", "reg 10A"],
    ["Calculations", "Contents page, design information sheet, structural summary, model input and output with an equilibrium check, software assumptions", "reg 9(2), 9(3); Annex B"],
    ["Summary sheet", "Every element type, its plan marks, the QP's calculation pages and the checker's", "Format guide Annex A1"]
  ];

  box.innerHTML =
    "<h3>1. Follow the load to the ground</h3><p class=\"lead\">A structural plan shows one thing: how every load reaches the ground. Click a part.</p><div class=\"viz\"><div class=\"canvas\" id=\"lp-svg\"></div><div class=\"panel\" id=\"lp-out\"></div></div>" +
    "<h3>2. Who must be appointed</h3><p class=\"lead\">Depth and value decide the team. Move the sliders.</p>" + rolesUI() +
    "<h3>3. How far may the wall move</h3>" + exUI() +
    "<h3>4. How many boreholes and pile tests</h3>" + siUI() +
    "<h3>5. What a complete ST set contains</h3><div class=\"panel\">" + SET.map(function (r) { return '<div class="setrow"><b>' + esc(r[0]) + "</b><span>" + esc(r[1]) + "</span><small>" + esc(r[2]) + "</small></div>"; }).join("") + '</div><p class="srcline">BCA publishes no template of standard general notes. This list holds only what the Regulations and the 2019 format guide require. <a href="' + esc((RULE["st-r-marks"] || {}).src || "") + '" target="_blank" rel="noopener">BCA/ACES/IES format guide</a></p>';

  lpDraw("transfer"); rolesDraw(); exDraw(); siDraw();
  var lp = $("#lp-svg"), pick = function (e) { var g = e.target.closest("[data-lp]"); if (!g) return; if (e.type === "keydown" && e.key !== "Enter") return; lpDraw(g.getAttribute("data-lp")); };
  lp.addEventListener("click", pick); lp.addEventListener("keydown", pick);
  box.addEventListener("input", function (e) { var id = e.target.id || ""; if (id.indexOf("ro-") === 0) rolesDraw(); else if (id.indexOf("ex-") === 0) exDraw(); else if (id.indexOf("si-") === 0) siDraw(); });
  box.addEventListener("change", function (e) { var id = e.target.id || ""; if (id === "ro-type") rolesDraw(); else if (id === "ex-soil") exDraw(); });
})();
