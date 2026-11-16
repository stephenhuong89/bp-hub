/* Spot the no-nos: a floor plan with eight deliberate mistakes. Limits come from the rule entries named on each item. */
(function () {
  "use strict";
  var D = window.BPDATA, $ = function (s, r) { return (r || document).querySelector(s); };
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  var RULE = {}; D.entries.forEach(function (e) { RULE[e.id] = e; });
  var ITEMS = [
    { id: "riser", box: [70, 190, 90, 110], at: [115, 245], title: "Stair riser 190 mm", why: "A riser may be at most 175 mm. At 190 every step is too tall.", rule: "AD-06" },
    { id: "exits", box: [70, 70, 90, 112], at: [115, 125], title: "Both exit stairs at the same end", why: "Two exits must be at least half the floor's longest diagonal apart, and never under 7 m. Side by side, one fire blocks both.", rule: "FC-18" },
    { id: "travel", box: [520, 70, 210, 150], at: [625, 150], title: "38 m to the exit with one way out", why: "An unsprinklered office allows 15 m where there is only one direction of escape. This room is a dead end.", rule: "FC-04" },
    { id: "door", box: [300, 260, 90, 140], at: [345, 330], title: "Accessible toilet door 750 mm", why: "The clear opening must be at least 850 mm. A wheelchair does not fit through 750.", rule: "COA-09" },
    { id: "barrier", box: [730, 90, 46, 110], at: [753, 145], title: "Balcony barrier 900 mm high", why: "A barrier at a drop of 1.0 m or more must be at least 1.0 m high.", rule: "AD-22" },
    { id: "ramp", box: [420, 400, 100, 48], at: [470, 424], title: "Entrance ramp at 1:8", why: "The steepest gradient allowed is 1:12, with a landing every 6 m.", rule: "COA-13" },
    { id: "head", box: [160, 220, 570, 40], at: [445, 240], title: "Corridor headroom 1900 mm under the beam", why: "Headroom must be at least 2.0 m, measured to the underside of the lowest beam, duct or fitting.", rule: "AD-01" },
    { id: "lot", box: [86, 406, 150, 42], at: [160, 427], title: "Car lots 2.2 m wide", why: "A car lot is 2.4 m by 4.8 m. At 2.2 m the doors cannot open.", rule: "LTA-01" }
  ];
  var found = {}, misses = 0, shown = false;
  function stair(y) { var s = ""; for (var i = 1; i < 9; i++) s += '<line x1="' + (70 + i * 10) + '" y1="' + (y + 6) + '" x2="' + (70 + i * 10) + '" y2="' + (y + 104) + '" class="ln thin"/>'; return '<rect x="70" y="' + y + '" width="90" height="110" class="core"/>' + s; }
  function draw() {
    var marks = ITEMS.map(function (it, i) {
      var on = found[it.id] || shown; if (!on) return "";
      return '<rect x="' + it.box[0] + '" y="' + it.box[1] + '" width="' + it.box[2] + '" height="' + it.box[3] + '" class="hit' + (found[it.id] ? "" : " late") + '"/><g class="hs L-fire on"><circle cx="' + it.at[0] + '" cy="' + it.at[1] + '" r="13"/><text x="' + it.at[0] + '" y="' + (it.at[1] + 4.5) + '">' + (i + 1) + "</text></g>";
    }).join("");
    $("#gm-plan").innerHTML = '<svg viewBox="0 0 800 500" class="dwg gm" id="gm-svg" role="img" aria-label="Floor plan containing eight mistakes to find">' +
      '<rect x="12" y="12" width="776" height="476" class="bnd"/><rect x="12" y="452" width="776" height="36" class="road"/>' +
      '<rect x="70" y="70" width="660" height="330" class="bld"/><line x1="160" y1="220" x2="730" y2="220" class="ln"/><line x1="160" y1="260" x2="730" y2="260" class="ln"/>' + stair(70) + stair(190) +
      '<line x1="160" y1="70" x2="160" y2="400" class="ln"/><line x1="330" y1="70" x2="330" y2="220" class="ln"/><line x1="520" y1="70" x2="520" y2="220" class="ln"/><line x1="300" y1="260" x2="300" y2="400" class="ln"/><line x1="390" y1="260" x2="390" y2="400" class="ln"/><line x1="560" y1="260" x2="560" y2="400" class="ln"/>' +
      '<rect x="730" y="90" width="40" height="110" class="bal"/><rect x="420" y="400" width="100" height="48" class="rampfill"/><path d="M470 440 v-30 m-6 8 l6 -8 l6 8" class="ln"/>' +
      '<rect x="90" y="410" width="44" height="34" class="lotr"/><rect x="138" y="410" width="44" height="34" class="lotr"/><rect x="186" y="410" width="44" height="34" class="lotr"/>' +
      '<path d="M330 262 a20 20 0 0 0 20 20" class="door"/><path d="M620 220 a22 22 0 0 1 22 -22" class="door"/><path d="M230 220 a22 22 0 0 1 22 -22" class="door"/><path d="M160 232 a20 20 0 0 1 20 20" class="door"/>' +
      '<polyline points="700,90 700,205 640,222 640,240 170,240" class="ln dash"/>' +
      '<g class="t"><text x="245" y="150" class="mid">OFFICE 1</text><text x="425" y="150" class="mid">OFFICE 2</text><text x="610" y="120" class="mid">OFFICE 3</text><text x="610" y="140" class="mid">38 m TO EXIT</text><text x="230" y="335" class="mid">OFFICE 4</text><text x="345" y="350" class="mid">ACC. WC</text><text x="345" y="300" class="mid">DOOR 750</text><text x="475" y="335" class="mid">PANTRY</text><text x="645" y="335" class="mid">LOBBY</text>' +
      '<text x="115" y="60" class="mid">STAIR B</text><text x="115" y="318" class="mid">STAIR A</text><text x="115" y="336" class="mid">R 190 T 275</text><text x="445" y="244" class="mid">CORRIDOR  CH 1900 U/S BEAM</text><text x="750" y="84" class="mid">BALCONY</text><text x="752" y="214" class="mid">H 900</text><text x="470" y="466" class="mid">RAMP 1:8</text><text x="160" y="466" class="mid">LOTS 2.2 x 4.8</text>' +
      '<text x="776" y="482" text-anchor="end">2ND STOREY OFFICE · NOT SPRINKLERED · NOT TO SCALE</text></g>' + marks + "</svg>";
  }
  function side(msg) {
    var n = Object.keys(found).length;
    $("#gm-side").innerHTML = '<div class="wi-count ' + (n === ITEMS.length ? "ok" : "warn") + '">' + n + " of " + ITEMS.length + ' found</div><p class="small">' + esc(msg || "Click the plan wherever you think something would be rejected. Read the dimensions and labels.") + (misses ? " Wrong clicks: " + misses + "." : "") + '</p><div class="chks">' +
      (n === ITEMS.length ? '<figure class="quote sm"><blockquote>\u201CThe engineer\u2019s work is out in the open where all men can see it.\u201D \u201CIf he makes a mistake, he cannot, like the doctor, bury it in a grave.\u201D</blockquote><figcaption><a href="https://hoover.blogs.archives.gov/2019/02/19/presidents-and-engineers" target="_blank" rel="noopener">Herbert Hoover, mining engineer and US President, Columbia University, 7 Nov 1951</a></figcaption></figure>' : "") +
      ITEMS.map(function (it, i) {
        var r = RULE["rule-" + it.rule];
        if (!found[it.id] && !shown) return '<div class="chk todo"><b>' + (i + 1) + "</b><span>Not found yet</span></div>";
        return '<div class="chk ' + (found[it.id] ? "ok" : "bad") + '"><b>' + (found[it.id] ? "Found" : "Missed") + "</b><span><strong>" + esc(it.title) + ".</strong> " + esc(it.why) + '</span><span class="small ref mono">' + esc(r ? r.ref : "") + "</span></div>";
      }).join("") + '</div><div class="row"><button type="button" class="btn ghost sm" id="gm-show">' + (shown ? "Hide the answers" : "Show me the rest") + '</button><button type="button" class="btn ghost sm" id="gm-reset">Start again</button></div>';
  }
  function render(msg) { draw(); side(msg); }
  $("#gm-plan").addEventListener("click", function (e) {
    var svg = $("#gm-svg"), r = svg.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * 800, y = (e.clientY - r.top) / r.height * 500, hit = null;
    ITEMS.forEach(function (it) { var b = it.box; if (!hit && x >= b[0] && x <= b[0] + b[2] && y >= b[1] && y <= b[1] + b[3]) hit = it; });
    if (!hit) { misses++; return render("Nothing wrong there. Look at the numbers written on the plan."); }
    if (found[hit.id]) return render("Already found: " + hit.title + ".");
    found[hit.id] = true;
    render(Object.keys(found).length === ITEMS.length ? "All eight found. This is what a checker does on every sheet." : "Yes. " + hit.title + ".");
  });
  $("#gm-side").addEventListener("click", function (e) {
    if (e.target.id === "gm-show") { shown = !shown; render(); }
    if (e.target.id === "gm-reset") { found = {}; misses = 0; shown = false; render(); }
  });
  render();
})();
