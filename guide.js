/* Start-here visual guide: interactive drawings. Numbers are never hard-coded here; each hotspot pulls its rules from the hub's rule entries. */
(function () {
  "use strict";
  var A = window.BPAPP, $ = function (s, r) { return (r || document).querySelector(s); };
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function related(q, any) {
    var r = (any ? A.search(q, [], []) : A.search(q, ["rule"], []).filter(function (e) { return e.checkable !== false; })).slice(0, 2);
    return r.length ? '<span class="label">Rules in this hub</span><div class="list">' + r.map(A.entryHtml).join("") + '</div><a href="#search" data-q="' + esc(q) + '" class="jump">See every entry on this</a>'
      : '<p class="small">No rule entry in the hub covers this yet.</p>';
  }
  function dot(h, i) { return '<g class="hs L-' + h.layer + '" data-i="' + i + '" tabindex="0" role="button" aria-label="' + esc(h.title) + '"><circle cx="' + h.x + '" cy="' + h.y + '" r="13"/><text x="' + h.x + '" y="' + (h.y + 4.5) + '">' + (i + 1) + "</text></g>"; }

  /* ---------- 1. Why approval exists ---------- */
  var WHY = [
    { x: 400, y: 330, layer: "safety", title: "It must stand up", agency: "BCA", text: "A building plan approval exists because a building that fails kills people who had no say in how it was built. On 15 March 1986 the six-storey Hotel New World collapsed and 33 people died. The inquiry led to the Building Control Act 1989 and the accredited checker system: a second, independent engineer checks the structural design before BCA approves it.", how: "Structural plans by a PE, checked by an accredited checker for major works, approved by BCA before a permit to build is issued.", q: "accredited checker", any: true, src: "https://www.nas.gov.sg/archivesonline/data/pdfdoc/2000082503.htm" },
    { x: 520, y: 240, layer: "fire", title: "People must get out in a fire", agency: "SCDF", text: "Every occupied room needs a protected way out that is short enough to reach before smoke does, wide enough for everyone, and still standing while they use it. Fire engines also need to reach the building.", how: "Fire safety plans checked against the Fire Code: travel distance, number and width of exits, protected staircases, compartments, fire engine access.", q: "travel distance exit staircase" },
    { x: 300, y: 112, layer: "safety", title: "Nobody falls or hits their head", agency: "BCA", text: "Edges people can fall from need barriers of a set height with gaps a child cannot pass through. Stairs need even risers and treads. Rooms and stairs need enough headroom.", how: "Building plans checked against the Approved Document's acceptable solutions.", q: "barrier height staircase headroom" },
    { x: 250, y: 345, layer: "access", title: "Everyone can use it", agency: "BCA", text: "A person in a wheelchair, with a pram or with poor sight must be able to get from the boundary to the door, through the building and into a toilet.", how: "Building plans checked against the Code on Accessibility: ramps, door widths, accessible routes, toilets and lifts.", q: "accessible ramp toilet door width" },
    { x: 400, y: 392, layer: "other", title: "It stays healthy and drains", agency: "PUB and NEA", text: "Rooms need daylight and fresh air. Used water must reach the sewer, rain must leave the site without flooding it or the neighbours, and refuse needs somewhere to go.", how: "PUB clears drainage, sewerage and sanitary works. NEA clears refuse, toilets and pollution control.", q: "drainage sewer platform level refuse ventilation" },
    { x: 110, y: 200, layer: "planning", title: "It fits its plot and its neighbours", agency: "URA, LTA and NParks", text: "What the land may be used for, how much floor area, how tall and how close to the boundary are all controlled, so one owner's building does not take light, privacy, road capacity or greenery from everyone else.", how: "URA planning permission first, then LTA for roads and parking and NParks for trees and planting.", q: "setback GFA storey height plot ratio" }
  ];
  var whySvg = '<svg viewBox="0 0 800 430" class="dwg" role="img" aria-label="Section through a building showing what each authority protects">' +
    '<rect x="0" y="360" width="800" height="70" class="ground"/><line x1="0" y1="360" x2="800" y2="360" class="ln thick"/>' +
    '<line x1="150" y1="60" x2="150" y2="360" class="ln dash"/><text x="156" y="76" class="t">site boundary</text>' +
    '<rect x="20" y="230" width="90" height="130" class="nb"/><text x="65" y="300" class="t mid">neighbour</text>' +
    '<rect x="230" y="120" width="340" height="240" class="bld"/><line x1="230" y1="200" x2="570" y2="200" class="ln"/><line x1="230" y1="280" x2="570" y2="280" class="ln"/>' +
    '<line x1="470" y1="120" x2="470" y2="360" class="ln"/><polyline points="480,360 500,340 520,320 540,300 560,280 540,260 520,240 500,220 480,200 500,180 520,160 540,140 560,120" class="ln stair"/>' +
    '<line x1="230" y1="120" x2="230" y2="96" class="ln thick"/><line x1="570" y1="120" x2="570" y2="96" class="ln thick"/><line x1="230" y1="96" x2="570" y2="96" class="ln"/>' +
    '<rect x="270" y="225" width="46" height="34" class="win"/><rect x="350" y="225" width="46" height="34" class="win"/><rect x="270" y="145" width="46" height="34" class="win"/><rect x="350" y="145" width="46" height="34" class="win"/>' +
    '<rect x="330" y="300" width="50" height="60" class="win"/><polygon points="230,360 180,360 230,348" class="ramp"/>' +
    '<rect x="238" y="372" width="324" height="12" class="ftg"/><rect x="250" y="384" width="26" height="30" class="ftg"/><rect x="524" y="384" width="26" height="30" class="ftg"/><path d="M400 384 v22 h260" class="ln dash"/><text x="668" y="410" class="t">to sewer</text>' +
    '<line x1="150" y1="340" x2="230" y2="340" class="dim"/><text x="190" y="334" class="t mid">setback</text>' +
    '<rect x="620" y="338" width="110" height="22" class="road"/><text x="675" y="354" class="t mid">road</text>' +
    '<circle cx="185" cy="300" r="20" class="tree"/><line x1="185" y1="320" x2="185" y2="360" class="ln"/>' +
    WHY.map(dot).join("") + "</svg>";

  /* ---------- 2. Floor plan by authority ---------- */
  var LAYERS = [["fire", "Fire escape (SCDF)"], ["safety", "Safety (BCA)"], ["access", "Accessibility (BCA)"], ["planning", "Planning and site (URA, LTA)"]];
  var PLAN = [
    { layer: "fire", x: 330, y: 140, title: "Travel distance", text: "The red line is the walking route from the farthest corner of a room to the door of a protected exit staircase. The Fire Code caps its length, with a shorter limit where there is only one way out and a longer one where the building is sprinklered. It is measured along the route a person walks, around walls, not as the crow flies.", q: "travel distance" },
    { layer: "fire", x: 685, y: 262, title: "Protected exit staircase", text: "The staircase is a fire-rated shaft with a fire door. Once inside, a person is treated as having reached a place of relative safety and can walk down to the outside.", q: "exit staircase fire" },
    { layer: "fire", x: 160, y: 240, title: "A second way out", text: "The dashed line is the alternative route. Above a set number of occupants or a set travel distance, a floor needs at least two exits, far enough apart that one fire cannot block both.", q: "number of exits two exits" },
    { layer: "fire", x: 250, y: 240, title: "Corridor and exit width", text: "Exit doors, corridors and stairs are sized from the number of people on the floor, which is worked out from the floor area and the use of each room.", q: "exit width occupant load" },
    { layer: "fire", x: 400, y: 468, title: "Fire engine accessway", text: "A fire engine needs a hard-standing strip of set width alongside the building, within reach of access openings in the facade.", q: "fire engine accessway" },
    { layer: "safety", x: 115, y: 205, title: "Stair risers, treads and handrails", text: "Each step in a flight must be the same height and depth, within set limits, with a minimum clear width, handrails and headroom. Uneven steps are the commonest cause of falls.", q: "staircase riser tread" },
    { layer: "safety", x: 560, y: 48, title: "Barrier at a drop", text: "A balcony, roof edge or stair with a drop beyond needs a barrier of a minimum height, with openings small enough to stop a child and no footholds to climb.", q: "safety barrier height" },
    { layer: "safety", x: 240, y: 70, title: "Daylight and ventilation", text: "Rooms people occupy need openings to the outside sized as a share of the floor area, or mechanical ventilation in their place.", q: "natural ventilation lighting" },
    { layer: "access", x: 605, y: 425, title: "Ramp at the entrance", text: "Where the entrance is above ground level, a ramp of limited gradient with landings and handrails gives step-free access from the boundary to the door.", q: "ramp gradient" },
    { layer: "access", x: 345, y: 330, title: "Accessible toilet", text: "At least one toilet large enough to turn a wheelchair, with grab bars and an outward-opening or sliding door, on an accessible route.", q: "accessible toilet" },
    { layer: "access", x: 230, y: 260, title: "Door clear width", text: "Doors on the accessible route need a minimum clear opening and space beside the latch to operate them from a wheelchair.", q: "door clear width" },
    { layer: "access", x: 520, y: 330, title: "Lift", text: "A building with floors above ground that the public or occupants use needs a lift sized for a wheelchair, reached by the accessible route.", q: "lift accessible" },
    { layer: "planning", x: 41, y: 130, title: "Setback from the boundary", text: "The gap between the wall and the site boundary. It depends on the road category in front and the type of building, and it is the first thing URA measures.", q: "setback road buffer" },
    { layer: "planning", x: 685, y: 120, title: "Gross floor area", text: "URA counts the covered floor area of every storey against the plot's permitted intensity. What counts and what is exempt decides whether the scheme is allowed at all, and whether a charge is payable.", q: "GFA gross floor area" },
    { layer: "planning", x: 120, y: 468, title: "Parking and access", text: "LTA checks the number and size of parking lots against the use and floor area, and where the driveway meets the road.", q: "parking lot" },
    { layer: "planning", x: 435, y: 330, title: "Shelter", text: "New houses and flats need a household shelter, and some buildings a storey shelter, of a minimum size with thick reinforced walls positioned away from the external wall.", q: "household shelter" }
  ];
  var stairLines = function (x) { var s = ""; for (var i = 1; i < 9; i++) s += '<line x1="' + (x + i * 10) + '" y1="186" x2="' + (x + i * 10) + '" y2="294" class="ln thin"/>'; return s + '<line x1="' + x + '" y1="240" x2="' + (x + 90) + '" y2="240" class="ln"/>'; };
  var planSvg = '<svg viewBox="0 0 800 500" class="dwg" role="img" aria-label="Floor plan with clickable items for each authority">' +
    '<rect x="12" y="12" width="776" height="476" class="bnd"/><rect x="12" y="448" width="776" height="40" class="road"/><text x="700" y="473" class="t mid">road</text>' +
    '<rect x="70" y="70" width="660" height="330" class="bld"/>' +
    '<line x1="160" y1="220" x2="640" y2="220" class="ln"/><line x1="160" y1="260" x2="640" y2="260" class="ln"/>' +
    '<rect x="70" y="180" width="90" height="120" class="core"/><rect x="640" y="180" width="90" height="120" class="core"/>' + stairLines(70) + stairLines(640) +
    '<line x1="160" y1="70" x2="160" y2="180" class="ln"/><line x1="640" y1="70" x2="640" y2="180" class="ln"/><line x1="320" y1="70" x2="320" y2="220" class="ln"/><line x1="480" y1="70" x2="480" y2="220" class="ln"/>' +
    '<line x1="160" y1="300" x2="160" y2="400" class="ln"/><line x1="640" y1="300" x2="640" y2="400" class="ln"/><line x1="300" y1="260" x2="300" y2="400" class="ln"/><line x1="390" y1="260" x2="390" y2="400" class="ln"/><line x1="480" y1="260" x2="480" y2="400" class="ln"/><line x1="560" y1="260" x2="560" y2="400" class="ln"/>' +
    '<rect x="392" y="262" width="86" height="136" class="shl"/><rect x="495" y="300" width="50" height="60" class="lift"/><path d="M495 300 l50 60 M545 300 l-50 60" class="ln thin"/>' +
    '<rect x="480" y="40" width="160" height="30" class="bal"/><line x1="480" y1="40" x2="640" y2="40" class="ln thick"/>' +
    '<rect x="570" y="400" width="70" height="48" class="rampfill"/><path d="M605 440 v-30 m-6 8 l6 -8 l6 8" class="ln"/>' +
    '<path d="M385 220 a22 22 0 0 1 22 -22" class="door"/><path d="M215 260 a22 22 0 0 0 22 22" class="door"/><path d="M640 228 a22 22 0 0 0 -22 22" class="door"/><path d="M160 228 a22 22 0 0 1 22 22" class="door"/><path d="M590 400 a22 22 0 0 1 22 -22" class="door"/>' +
    '<rect x="200" y="67" width="80" height="6" class="win"/><rect x="360" y="67" width="80" height="6" class="win"/>' +
    '<g class="t"><text x="240" y="150" class="mid">Office 1</text><text x="400" y="110" class="mid">Office 2</text><text x="560" y="150" class="mid">Office 3</text><text x="230" y="340" class="mid">Office 4</text><text x="345" y="372" class="mid">Acc. WC</text><text x="435" y="372" class="mid">Shelter</text><text x="520" y="385" class="mid">Lift</text><text x="600" y="330" class="mid">Lobby</text><text x="115" y="312" class="mid">Stair A</text><text x="685" y="312" class="mid">Stair B</text><text x="560" y="62" class="mid">Balcony</text><text x="400" y="244" class="mid">Corridor</text></g>' +
    '<g class="L-fire lay"><polyline points="330,85 330,180 396,214 400,240 618,240" class="path"/><polyline points="400,240 182,240" class="path alt"/><rect x="200" y="452" width="400" height="32" class="fea"/></g>' +
    '<g class="L-planning lay"><line x1="12" y1="150" x2="70" y2="150" class="dim"/><rect x="72" y="72" width="656" height="326" class="gfa"/></g>' +
    PLAN.map(dot).join("") + "</svg>";

  /* ---------- 3. The drawing set ---------- */
  var tb = '<rect x="2" y="2" width="156" height="108" class="sht"/><rect x="118" y="86" width="40" height="24" class="tbk"/>';
  var SHEETS = [
    { name: "Site plan", svg: '<rect x="18" y="14" width="96" height="84" class="bnd"/><rect x="40" y="32" width="54" height="44" class="bld"/><path d="M134 18 v18 m-5 -10 l5 -8 l5 8" class="ln"/>', shows: ["Site boundary, lot number and adjoining roads", "Building outline with setbacks dimensioned to the boundary", "Platform levels, drains, sewer line and driveway", "North point and scale"], reads: "URA for setbacks and coverage, LTA for access, PUB for drainage and sewers, NParks for trees, SCDF for fire engine access.", look: "Is every setback dimensioned? Are existing and proposed levels shown?" },
    { name: "Floor plans", svg: '<rect x="16" y="18" width="100" height="74" class="bld"/><line x1="16" y1="52" x2="116" y2="52" class="ln thin"/><line x1="60" y1="18" x2="60" y2="52" class="ln thin"/><line x1="84" y1="52" x2="84" y2="92" class="ln thin"/>', shows: ["Every storey, with room names and uses", "Dimensions, wall types and door swings", "Staircases, exits, lifts, toilets and shelters", "Floor area of each room and storey"], reads: "BCA for stairs, barriers, accessibility and ventilation. SCDF for travel distance and exits. URA for use and GFA.", look: "Room uses named? Travel distances and exit widths marked? Accessible route continuous?" },
    { name: "Sections", svg: '<line x1="10" y1="92" x2="150" y2="92" class="ln"/><rect x="30" y="28" width="86" height="64" class="bld"/><line x1="30" y1="60" x2="116" y2="60" class="ln thin"/><polyline points="90,92 98,84 106,76 114,68 116,60" class="ln thin"/>', shows: ["Floor-to-floor and ceiling heights", "Stair risers, treads and headroom", "Barrier heights at balconies, roofs and voids", "Building height and levels against the ground"], reads: "BCA for headroom, stairs and barriers. URA for storey and overall height.", look: "Is headroom dimensioned on the stair? Is each barrier height given from finished floor level?" },
    { name: "Elevations", svg: '<line x1="10" y1="92" x2="150" y2="92" class="ln"/><rect x="28" y="30" width="90" height="62" class="bld"/><rect x="40" y="42" width="16" height="14" class="win"/><rect x="66" y="42" width="16" height="14" class="win"/><rect x="92" y="42" width="16" height="14" class="win"/><rect x="66" y="70" width="16" height="22" class="win"/>', shows: ["Each face of the building with openings", "Overall height and roof form", "External finishes, cladding and glazing", "Boundary walls and neighbouring levels"], reads: "URA for height and envelope. SCDF for unprotected openings near the boundary. BCA for glazing and cladding.", look: "Are openings near the boundary within the allowed area? Is the height taken from the right datum?" },
    { name: "Details and schedules", svg: '<rect x="14" y="16" width="44" height="34" class="bld"/><rect x="66" y="16" width="44" height="34" class="bld"/><g class="ln thin"><line x1="14" y1="62" x2="110" y2="62"/><line x1="14" y1="72" x2="110" y2="72"/><line x1="14" y1="82" x2="110" y2="82"/><line x1="14" y1="92" x2="110" y2="92"/></g>', shows: ["Staircase, barrier, ramp and toilet details at large scale", "Door, window and finishes schedules", "Fire-rated construction and fire door ratings", "GFA and occupant load calculation tables"], reads: "BCA and SCDF, to confirm what the small-scale plans only imply.", look: "Does the detail agree with the plan? Are fire ratings stated?" },
    { name: "Forms and calculations", svg: '<g class="ln thin"><line x1="16" y1="20" x2="110" y2="20"/><line x1="16" y1="32" x2="96" y2="32"/><line x1="16" y1="44" x2="110" y2="44"/><line x1="16" y1="56" x2="84" y2="56"/><line x1="16" y1="68" x2="110" y2="68"/></g><path d="M20 90 q10 -14 20 -2 t22 -4" class="ln"/>', shows: ["QP's certificate that he or she prepared the plans", "Application forms and fee computation", "Structural calculations and the accredited checker's certificate", "Waiver applications and agency clearances already obtained"], reads: "Each agency for its own part. Missing signatures and forms are a common cause of written directions.", look: "Every plan digitally signed? Fee paid? Superseded files removed?" }
  ];

  function detail(h) {
    return '<div class="panel"><div class="row"><h3>' + esc(h.title) + "</h3>" + (h.agency ? '<span class="badge acc">' + esc(h.agency) + "</span>" : "") + "</div><p>" + esc(h.text) + "</p>" +
      (h.how ? '<p class="small"><b>How it is checked:</b> ' + esc(h.how) + "</p>" : "") + (h.src ? '<p class="small"><a href="' + esc(h.src) + '" target="_blank" rel="noopener">Source: Government media release on the accredited checker system</a></p>' : "") + related(h.q, h.any) + "</div>";
  }
  var EXMAP = { "It must stand up": "grid", "People must get out in a fire": "travel", "Nobody falls or hits their head": "barrier", "Everyone can use it": "ramp", "It fits its plot and its neighbours": "setback", "Travel distance": "travel", "A second way out": "exits", "Protected exit staircase": "exits", "Stair risers, treads and handrails": "stair", "Barrier at a drop": "barrier", "Ramp at the entrance": "ramp", "Accessible toilet": "door", "Door clear width": "door", "Setback from the boundary": "setback", "Parking and access": "lot", "Daylight and ventilation": "head" };
  function wire(svgBox, items, out, exBox) {
    var pick = function (i) {
      Array.prototype.forEach.call(svgBox.querySelectorAll(".hs"), function (g) { g.classList.toggle("on", +g.dataset.i === i); });
      out.innerHTML = detail(items[i]); if (exBox) exBox.innerHTML = '<span class="label">Right and wrong on a drawing</span>' + window.BPEX(EXMAP[items[i].title]);
    };
    svgBox.addEventListener("click", function (e) { var g = e.target.closest(".hs"); if (g) pick(+g.dataset.i); });
    svgBox.addEventListener("keydown", function (e) { var g = e.target.closest(".hs"); if (g && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); pick(+g.dataset.i); } });
    return pick;
  }

  $("#g-why").innerHTML = whySvg; wire($("#g-why"), WHY, $("#g-why-out"), $("#g-why-ex"))(0);

  var layer = "fire";
  $("#g-plan").innerHTML = planSvg;
  var pickPlan = wire($("#g-plan"), PLAN, $("#g-plan-out"), $("#g-plan-ex"));
  function setLayer(l) {
    layer = l; $("#g-plan").setAttribute("data-layer", l);
    $("#g-layers").innerHTML = LAYERS.map(function (x) { return '<button type="button" class="chip" data-v="' + x[0] + '" aria-pressed="' + (x[0] === l) + '">' + x[1] + "</button>"; }).join("");
    for (var i = 0; i < PLAN.length; i++) if (PLAN[i].layer === l) { pickPlan(i); break; }
  }
  $("#g-layers").addEventListener("click", function (e) { var b = e.target.closest(".chip"); if (b) setLayer(b.dataset.v); });
  setLayer("fire");

  function showSheet(i) {
    var s = SHEETS[i];
    $("#g-sheets").innerHTML = SHEETS.map(function (x, k) { return '<button type="button" class="sheet' + (k === i ? " on" : "") + '" data-i="' + k + '"><svg viewBox="0 0 160 112" class="dwg">' + tb + x.svg + "</svg><span>" + esc(x.name) + "</span></button>"; }).join("");
    $("#g-sheet-out").innerHTML = '<div class="panel"><h3>' + esc(s.name) + '</h3><div class="grid"><div><span class="label">What it shows</span><ul>' + s.shows.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + '</ul></div><div><span class="label">Who reads it</span><p>' + esc(s.reads) + '</p><span class="label">First things to check</span><p>' + esc(s.look) + "</p></div></div></div>";
  }
  $("#g-sheets").addEventListener("click", function (e) { var b = e.target.closest(".sheet"); if (b) showSheet(+b.dataset.i); });
  showSheet(0);

  document.addEventListener("click", function (e) { var a = e.target.closest("a.jump"); if (a) A.setQuery(a.dataset.q); });
  $("#g-q").addEventListener("keydown", function (e) { if (e.key === "Enter" && this.value.trim()) { A.setQuery(this.value.trim()); location.hash = "#search"; } });
})();
