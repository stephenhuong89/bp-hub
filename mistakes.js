/* Common mistakes by authority, as each authority has published them, and a subpar-versus-good drawing comparison
   built on Building Control Regulations 2003 reg 6 and reg 8. Compiled 16 Nov 2026. */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  var A = [
    { id: "bca", name: "BCA plans", by: "BCA, Understanding the Approved Document v3.0 (June 2024), site observations", src: "https://isomer-user-content.by.gov.sg/338/2f5ef8a0-f407-4728-a756-473964dcb077/understanding-the-approved-document-v3-0.pdf", items: [
      ["Headroom lost to something hung later", "Signs, slanted structures, the underside of a stair, or a window swinging into a walkway bring headroom under 2.0 m (2.2 m on a driveway).", "head"],
      ["Risers that are not all the same", "Irregular risers are a frequent finding. A stair that is not finished at inspection is treated as non-compliant.", "stair"],
      ["Handrails that cannot be gripped", "Discontinuous, square in section, or too close to the wall. The clear gap is 40 mm on a smooth wall and 60 mm on a rough one.", "stair"],
      ["Barriers a child can climb", "A planter or ledge wider than 150 mm beside the barrier becomes a step, and toeholds near the floor do the same.", "barrier"],
      ["Glass overhead that is not laminated", "Glass above 2.4 m must be laminated.", "check"],
      ["Maintenance stairs with no nosings", "Nosings are missed on stairs used only for maintenance.", "stair"]] },
    { id: "ura", name: "URA", by: "URA best-practice articles on EDA forms, plans, CAD files, GFA and LUSH", src: "https://www.ura.gov.sg/guidelines/best-practices/edaform-daplans/", items: [
      ["GFA on the form does not match the plans", "The figure typed into the application form and the figure on the calculation plans must be the same number.", "mismatch"],
      ["The firm signs instead of the QP", "The declaration is the qualified person's own. A firm's signature is not accepted.", "falsedoc"],
      ["Wrong colours on the plans", "Magenta for proposed, cyan for existing or approved, yellow for deleted. Other colours get the plans returned.", "check"],
      ["CAD and BIM files named wrongly", "URA says about 60% of files it receives are misnamed. Non-compliant files are returned.", "nostamp"],
      ["GFA exemptions not shown clearly", "Areas claimed as exempt must be marked and worked out on the plan, not just deducted.", "check"],
      ["Strata boundaries not verged", "Each strata lot's boundary must be outlined.", "check"],
      ["A wrong lodgment declaration", "URA may reject the lodgment and refuse later lodgments for the same proposal from the same QP and firm.", "gavel"]] },
    { id: "scdf", name: "SCDF", by: "SCDF, Sharing of Common Audit Issues (September 2026)", src: "https://www.scdf.gov.sg/docs/default-source/fire-safety-docs/downloads/forms/sharing-of-common-audit-issues.pdf", items: [
      ["No QP endorsement or Fire Code edition on the plan", "The plan must say which edition of the Fire Code it was designed to and carry the QP's endorsement.", "nostamp"],
      ["Hose reel coverage drawn as a circle", "A 36 m circle is not the test. Coverage follows the route the hose actually takes around walls. Fire Code cl. 6.2.8d.", "check"],
      ["Fire engine accessway types not told apart", "The plan must distinguish the kinds of accessway, and turf on bends is a finding. Fire Code cl. 4.2.2k.", "check"],
      ["Storage, diesel tanks and batteries not detailed", "What is stored and how much decides the fire requirements, so it must be on the plan.", "fire"],
      ["Car park ventilation blocked", "Obstructions to natural ventilation openings are ignored on the drawing. Fire Code cl. 3.2.8.", "check"],
      ["Compartment size on a change of use", "The cubical extent allowed for the new use is not rechecked. Fire Code cl. 3.2.2a.", "check"]] },
    { id: "lta", name: "LTA", by: "LTA Quick Guide 12 and Lodgement Guidebook; Quick Guide 8 for parking", src: "https://www.lta.gov.sg/content/dam/ltagov/who_we_are/statistics_and_publications/quick_guide_for_development_proposals/quick_guide_12rev.pdf", items: [
      ["The engineer's plan does not match the architect's layout", "LTA names this directly. The street plan and the site layout must be the same drawing underneath.", "mismatch"],
      ["Turning kerbs not lined up with the gate post", "The entrance kerb geometry must meet the gate post.", "check"],
      ["Encroaching on the road reserve", "Nothing may be built past the road reserve line.", "extra"],
      ["Missing railings and drop-inlet chambers", "Type B railing and drop-inlet chambers are left off, and culvert levels and finish are wrong.", "check"],
      ["Parking sums and lot sizes wrong", "Provision computed wrongly or lots drawn under size.", "check"],
      ["A fee from the fourth submission", "The first three street plan submissions are free. From the fourth it is $300 or $1,200 each.", "money"]] },
    { id: "pub", name: "PUB", by: "PUB Quick Submission Guides, commonly made mistakes", src: "https://www.pub.gov.sg/Professionals/Requirements/Qualified-Persons/Quick-Submission-Guides", items: [
      ["No cover letter, or the wrong CORENET form", "The submission is incomplete before anyone reads the drawings.", "nostamp"],
      ["Drainage works classed wrongly", "Minor drainage works and other drainage works follow different routes.", "check"],
      ["Endorsements or checklist documents missing", "Every plan needs its endorsement and the checklist documents attached.", "falsedoc"]] },
    { id: "forms", name: "BCA forms and TOP", by: "BCA e-guide for C-Forms; CSC/TOP Form Companion (April 2026)", src: "https://isomer-user-content.by.gov.sg/338/9a2232df-a641-4786-9d27-053944d5ae63/eguide_for_c-forms.pdf", items: [
      ["\"No deviation\" declared with record plans attached", "If record plans are attached there were deviations. The declaration must say so.", "falsedoc"],
      ["Partial completion declared as full", "The form must describe what is actually complete.", "falsedoc"],
      ["An ST number that was never approved", "Only approved structural plan numbers may be declared.", "nostamp"],
      ["Only the main BP number entered", "Every BP number for the works belongs on the form, including amendments.", "check"],
      ["Missing PE stamp, date or UEN", "Small blanks that send the form back.", "nostamp"],
      ["Pages that do not add up, or wrong encryption", "Page counts must tally and the package must be encrypted by the right QP.", "check"]] },
    { id: "cx", name: "CORENET X", by: "BCA slides on common mistakes; CORENET X Good Practices Guidebook (Dec 2025)", src: "https://info.corenet.gov.sg/docs/default-source/default-document-library/part-2a_common-mistakes-and-good-practices-for-cx-projects.pdf?Status=Master&sfvrsn=d8644825_2", items: [
      ["The model and the drawings disagree", "BCA's example: a pile 8.6 m long in the model and 78.5 m on the drawing.", "mismatch"],
      ["A column added without telling the engineer", "The architect changes the layout and the structural model never hears of it.", "mismatch"],
      ["Replies that do not answer the comment", "Some teams still fail to address agency comments after two rounds.", "falsedoc"],
      ["Design changes during submission", "Each change can reset the review.", "clock"],
      ["Old files left in the resubmission", "Superseded models and plans must be removed.", "nostamp"],
      ["Plans not digitally signed", "Every plan needs the QP's digital signature.", "nostamp"]] }
  ];
  var cur = "bca";
  function pic(k) { var ex = window.BPEXALL && window.BPEXALL[k]; return ex ? ex[3] : (window.BPPIC ? window.BPPIC(k) : ""); }
  function render() {
    var a = A.filter(function (x) { return x.id === cur; })[0];
    $("#mk-tabs").innerHTML = A.map(function (x) { return '<button type="button" class="stn' + (x.id === cur ? " on" : "") + '" data-id="' + x.id + '"><b>' + x.items.length + "</b><span>" + esc(x.name) + "</span><small>published mistakes</small></button>"; }).join("");
    $("#mk-list").innerHTML = a.items.map(function (it, i) { return '<article class="mkc"><div class="mkp">' + pic(it[2]) + '</div><div><span class="mkn">' + (i + 1) + "</span><h3>" + esc(it[0]) + "</h3><p>" + esc(it[1]) + "</p></div></article>"; }).join("");
    $("#mk-src").innerHTML = 'Source: <a href="' + esc(a.src) + '" target="_blank" rel="noopener">' + esc(a.by) + "</a>. NEA, NParks and the professional bodies have published no list of common submission errors that could be found.";
  }
  $("#mk-tabs").addEventListener("click", function (e) { var b = e.target.closest(".stn"); if (b) { cur = b.dataset.id; render(); } });

  /* ---------- subpar versus good sheet ---------- */
  function base(extra) { return '<rect x="6" y="6" width="788" height="488" class="sht2"/>' + extra; }
  var SUB = base('<rect x="170" y="110" width="420" height="250" class="ln thick" fill="none"/><path d="M170 240 h420 M330 110 v130 M460 240 v120" class="ln"/><text x="250" y="180" class="t mid">room</text><text x="520" y="310" class="t mid">room</text><rect x="620" y="420" width="160" height="64" class="tbk2"/><text x="700" y="458" class="t mid">TBC</text><text x="80" y="60" class="t">N.T.S.</text>');
  var GOOD = base('<rect x="90" y="60" width="580" height="350" class="bndv"/><rect x="170" y="110" width="420" height="250" class="ln thick" fill="none"/><path d="M170 240 h420 M330 110 v130 M460 240 v120" class="ln"/>' +
    '<g class="gl2"><path d="M170 86 v290 M330 86 v290 M460 86 v290 M590 86 v290 M146 110 h460 M146 240 h460 M146 360 h460"/></g><g class="gb2"><circle cx="170" cy="78" r="10"/><circle cx="330" cy="78" r="10"/><circle cx="460" cy="78" r="10"/><circle cx="590" cy="78" r="10"/><circle cx="138" cy="110" r="10"/><circle cx="138" cy="240" r="10"/><circle cx="138" cy="360" r="10"/></g>' +
    '<g class="t mid"><text x="170" y="82">A</text><text x="330" y="82">B</text><text x="460" y="82">C</text><text x="590" y="82">D</text><text x="138" y="114">1</text><text x="138" y="244">2</text><text x="138" y="364">3</text>' +
    '<text x="250" y="170">OFFICE 1</text><text x="250" y="186">33.6 m²</text><text x="460" y="170">OFFICE 2</text><text x="460" y="186">54.6 m²</text><text x="315" y="296">STORE</text><text x="315" y="312">61 m²</text><text x="525" y="296">LOBBY</text><text x="525" y="312">FFL +104.50</text>' +
    '<text x="380" y="398">8400</text><text x="630" y="240">5000</text><text x="130" y="52">3000</text></g>' +
    '<path d="M170 386 h420 M606 110 v250 M90 60 h80" class="dim2"/><path d="M380 360 v30 m-6 -8 l6 8 l6 -8" class="ln"/><text x="380" y="428" class="t mid">ENTRY</text>' +
    '<path d="M716 60 v40 m-9 -26 l9 -14 l9 14" class="ln"/><text x="716" y="118" class="t mid">N</text>' +
    '<rect x="560" y="420" width="220" height="64" class="tbk2"/><g class="t"><text x="568" y="436">LOT 1234 MK 18 · 2ND STOREY PLAN</text><text x="568" y="452">SCALE 1:100 · SHEET 2 OF 12</text><text x="568" y="468">QP: signed and endorsed</text></g>' +
    '<g><rect x="20" y="428" width="14" height="10" style="fill:#e0218a"/><text x="40" y="437" class="t">proposed</text><rect x="110" y="428" width="14" height="10" style="fill:#12a5c9"/><text x="130" y="437" class="t">existing</text><rect x="200" y="428" width="14" height="10" style="fill:#e8c300"/><text x="220" y="437" class="t">deleted</text></g>');
  var REQ = [["Boundary lines clearly verged, with lot and MK number", "reg 8(a)(i), (iii)"], ["Distance from the building to the lot boundary", "reg 8(a)(iv)"], ["North point", "reg 8(a)(iii)"], ["Purpose of every room or space", "reg 8(b)(i)"], ["Grid lines or dimensions between columns, corridors and walls", "reg 8(b)(iii)"], ["Existing and proposed platform levels", "reg 8(a)(vi)"], ["Ingress and egress", "reg 8(a)(vii)"], ["New works told apart from existing and deleted works", "reg 6(e), (f)"], ["Sheets numbered 1 of n", "reg 6(g)"], ["Prepared and signed by the appropriate QP", "reg 6"]];
  $("#cmp").innerHTML = '<div class="cmpbox"><svg viewBox="0 0 800 500" class="dwg cmpa" aria-label="A subpar drawing sheet">' + SUB + '</svg><svg viewBox="0 0 800 500" class="dwg cmpb" id="cmpb" aria-label="A good drawing sheet">' + GOOD + '</svg><i id="cmph"></i><span class="cl l">Subpar</span><span class="cl r">Good</span></div>' +
    '<label class="field"><span>Drag to compare</span><input type="range" id="cmpr" min="0" max="100" value="55" aria-label="Reveal the good sheet"></label>';
  $("#cmp-req").innerHTML = REQ.map(function (r) { return '<div class="chk ok"><b>Required</b><span>' + esc(r[0]) + '</span><span class="small ref mono">Building Control Regulations 2003, ' + esc(r[1]) + "</span></div>"; }).join("");
  function slide() { var v = +$("#cmpr").value; $("#cmpb").style.clipPath = "inset(0 0 0 " + v + "%)"; $("#cmph").style.left = v + "%"; }
  $("#cmpr").addEventListener("input", slide); slide();
  render();
})();
