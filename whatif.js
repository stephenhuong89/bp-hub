/* "Switch the rules off" street scene. Pure illustration: no statistics are stated here. */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var SW = [
    ["st", "Structural check", "BCA", "Cracks, a lean, then collapse. Nobody inside chose the engineer."],
    ["fr", "Fire code", "SCDF", "One door, no protected stair, no way for a fire engine to reach it."],
    ["sf", "Safety rules", "BCA", "Open edges with no barrier. A fall from any floor."],
    ["ac", "Accessibility", "BCA", "Steps at the door. A wheelchair user cannot get in at all."],
    ["pb", "Drainage and sewers", "PUB, NEA", "Rain has nowhere to go. The street floods, then the ground floor."],
    ["ur", "Planning control", "URA", "Extra floors on top, towers built to the boundary, no light or air."],
    ["gr", "Roads and greenery", "LTA, NParks", "No parking, no trees, cars across the road and the fire lane."]
  ];
  var off = {};
  function win(x, y) { return '<rect x="' + x + '" y="' + y + '" width="34" height="30" class="win"/>'; }
  function flame(x, y) { return '<path d="M' + x + " " + y + ' q-14 -18 0 -34 q4 12 10 6 q10 14 0 28 z" class="flame"/>'; }
  function car(x, y, r, cls) { return '<g transform="translate(' + x + " " + y + ") rotate(" + r + ')"><rect x="-22" y="-9" width="44" height="18" rx="5" class="car ' + (cls || "") + '"/><rect x="-10" y="-9" width="18" height="18" class="carw"/></g>'; }
  function tree(x) { return '<circle cx="' + x + '" cy="296" r="24" class="tree"/><line x1="' + x + '" y1="320" x2="' + x + '" y2="340" class="ln"/>'; }
  function chair(x, y, cls) { return '<g class="chair ' + (cls || "") + '"><circle cx="' + x + '" cy="' + (y - 9) + '" r="9"/><circle cx="' + (x + 2) + '" cy="' + (y - 34) + '" r="5"/><path d="M' + (x + 2) + " " + (y - 29) + " v14 h12 l4 10\"/></g>"; }
  var wins = ""; [126, 184, 242].forEach(function (y) { [362, 433, 504].forEach(function (x) { wins += win(x, y); }); });
  var scene =
    '<svg viewBox="0 0 900 430" class="dwg sc" id="wi-svg" role="img" aria-label="Street scene that changes as each protection is switched off">' +
    '<rect x="0" y="0" width="900" height="340" class="sky"/><g class="off-ur"><rect x="0" y="0" width="900" height="340" class="shade"/></g>' +
    '<rect x="0" y="340" width="900" height="90" class="ground"/><rect x="0" y="372" width="900" height="36" class="road2"/><line x1="0" y1="390" x2="900" y2="390" class="ln dash"/>' +
    /* neighbours */
    '<g class="on-ur"><rect x="70" y="210" width="150" height="130" class="nb"/><rect x="690" y="190" width="150" height="150" class="nb"/></g>' +
    '<g class="off-ur"><rect x="196" y="34" width="142" height="306" class="nb jam"/><rect x="562" y="20" width="160" height="320" class="nb jam"/></g>' +
    /* main building */
    '<g id="wi-main"><g class="off-ur"><rect x="340" y="44" width="220" height="66" class="illegal"/><text x="450" y="82" class="t mid tagbad">extra floors</text></g>' +
    '<rect x="340" y="110" width="220" height="212" class="bld"/><rect x="336" y="322" width="228" height="18" class="core"/>' +
    '<line x1="340" y1="168" x2="560" y2="168" class="ln"/><line x1="340" y1="226" x2="560" y2="226" class="ln"/><line x1="340" y1="284" x2="560" y2="284" class="ln"/>' + wins +
    '<rect x="433" y="290" width="34" height="32" class="doorf"/>' +
    '<g class="ln thick"><line x1="560" y1="168" x2="600" y2="168"/><line x1="560" y1="226" x2="600" y2="226"/><line x1="560" y1="284" x2="600" y2="284"/></g>' +
    '<g class="on-sf rail"><path d="M600 168 v-22 h-40 M600 226 v-22 h-40 M600 284 v-22 h-40 M340 110 v-18 h220 v18"/><path d="M570 146 v22 M580 146 v22 M590 146 v22 M570 204 v22 M580 204 v22 M590 204 v22 M570 262 v22 M580 262 v22 M590 262 v22"/></g>' +
    '<g class="off-sf"><g class="fig"><circle cx="596" cy="196" r="5"/><path d="M596 201 v14 m0 0 l-5 11 m5 -11 l5 11"/></g><text x="612" y="206" class="t tagbad">no barrier</text></g>' +
    '<g class="off-st"><polyline points="352,118 392,170 372,214 430,262 408,300 452,322" class="crack"/><polyline points="548,122 512,176 536,230 498,270 520,318" class="crack"/><text x="450" y="104" class="t mid tagbad">cracking</text></g>' +
    '<g class="off-fr">' + flame(379, 214) + flame(450, 156) + flame(521, 272) + '<circle cx="455" cy="92" r="16" class="smoke"/><circle cx="478" cy="70" r="22" class="smoke"/><circle cx="512" cy="44" r="28" class="smoke"/></g>' +
    "</g>" +
    '<g class="on-fr"><polyline points="340,322 300,322 300,284 340,284 300,284 300,226 340,226 300,226 300,168 340,168" class="ln estair"/><path d="M300 322 L336 286 M300 264 L336 228 M300 206 L336 170" class="ln thin"/><text x="292" y="250" class="t" text-anchor="end">exit stair</text>' +
    '<g transform="translate(130 388)"><rect x="-46" y="-22" width="70" height="26" rx="3" class="engine"/><rect x="24" y="-16" width="24" height="20" rx="3" class="engine"/><circle cx="-28" cy="6" r="7" class="wheel"/><circle cx="30" cy="6" r="7" class="wheel"/><line x1="-40" y1="-26" x2="14" y2="-26" class="ln"/></g></g>' +
    '<g class="off-fr"><text x="292" y="250" class="t tagbad" text-anchor="end">no exit stair</text></g>' +
    /* access */
    '<g class="on-ac"><polygon points="470,322 470,340 600,340" class="ramp"/>' + chair(520, 330) + "</g>" +
    '<g class="off-ac"><rect x="425" y="328" width="50" height="6" class="core"/><rect x="419" y="334" width="62" height="6" class="core"/>' + chair(640, 340, "stuck") + '<text x="662" y="318" class="t tagbad">cannot enter</text></g>' +
    /* drainage */
    '<g class="on-pb"><rect x="0" y="344" width="900" height="7" class="drain"/></g>' +
    '<g class="off-pb"><path d="M0 318 q25 -10 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 V430 H0 z" class="flood"/><text x="760" y="336" class="t tagbad">flooded</text></g>' +
    /* roads and greenery */
    '<g class="on-gr">' + tree(262) + tree(644) + tree(868) + car(700, 398, 0) + car(770, 398, 0) + car(840, 398, 0) + "</g>" +
    '<g class="off-gr">' + car(250, 384, 24, "bad") + car(330, 396, -18, "bad") + car(420, 382, 80, "bad") + car(560, 394, -30, "bad") + car(690, 384, 12, "bad") + car(800, 396, -70, "bad") + '<text x="470" y="424" class="t mid tagbad">road blocked</text></g>' +
    "</svg>";

  function render() {
    var n = SW.filter(function (s) { return !off[s[0]]; }).length, svg = $("#wi-svg");
    SW.forEach(function (s) { svg.classList.toggle("no-" + s[0], !!off[s[0]]); });
    $("#wi-count").textContent = n + " of " + SW.length + " protections on";
    $("#wi-count").className = "wi-count " + (n === SW.length ? "ok" : n >= 4 ? "warn" : "bad");
    $("#wi-switches").innerHTML = SW.map(function (s) {
      var on = !off[s[0]];
      return '<button type="button" class="sw' + (on ? " on" : "") + '" data-k="' + s[0] + '" role="switch" aria-checked="' + on + '"><i></i><span><b>' + s[1] + "</b><small>" + (on ? s[2] : s[3]) + "</small></span></button>";
    }).join("");
    $("#wi-all").textContent = n === 0 ? "Switch everything back on" : "Switch them all off";
  }
  $("#wi-scene").innerHTML = scene;
  $("#wi-switches").addEventListener("click", function (e) { var b = e.target.closest(".sw"); if (!b) return; off[b.dataset.k] = !off[b.dataset.k]; render(); });
  $("#wi-all").addEventListener("click", function () { var allOff = SW.every(function (s) { return off[s[0]]; }); SW.forEach(function (s) { off[s[0]] = !allOff; }); render(); });
  render();
})();
