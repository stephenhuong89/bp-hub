/* Managing the architect, told through real cases. Facts live in cases.js with their sources. */
(function () {
  "use strict";
  var D = window.BPDATA, C = window.BPCASES, $ = function (s, r) { return (r || document).querySelector(s); };
  if (!C || !C.length) return;
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  /* pictograms, 160 x 110 */
  var P = {
    draft: '<rect x="62" y="22" width="78" height="56" class="pp"/><path d="M72 62 l14 -22 l12 14 l10 -20 l18 28" class="pl"/><circle cx="34" cy="38" r="10" class="pl"/><path d="M34 48 v26 m0 -18 l22 -8 m-22 26 l-10 22 m10 -22 l10 22" class="pl"/><text x="101" y="94" class="pt">no licence</text>',
    collapse: '<line x1="10" y1="96" x2="150" y2="96" class="pl"/><g transform="rotate(14 80 96)"><rect x="52" y="30" width="56" height="66" class="pp"/><path d="M52 52 h56 M52 74 h56" class="pl"/><path d="M60 34 l16 22 l-10 14 l20 24" class="pb"/></g><path d="M22 96 l10 -10 l8 10 M120 96 l8 -8 l10 8" class="pl"/>',
    mismatch: '<rect x="12" y="24" width="60" height="62" class="pp"/><rect x="88" y="24" width="60" height="62" class="pp"/><g class="pd"><circle cx="28" cy="40" r="4"/><circle cx="56" cy="40" r="4"/><circle cx="28" cy="70" r="4"/><circle cx="56" cy="70" r="4"/><circle cx="104" cy="40" r="4"/><circle cx="132" cy="40" r="4"/><circle cx="104" cy="70" r="4"/><circle cx="132" cy="70" r="4"/></g><circle cx="118" cy="55" r="6" class="pbf"/><text x="42" y="100" class="pt">ARCHI</text><text x="118" y="100" class="pt">STRUCT</text><text x="80" y="60" class="pt b">≠</text>',
    viaduct: '<line x1="8" y1="100" x2="152" y2="100" class="pl"/><rect x="26" y="52" width="12" height="48" class="pp"/><rect x="122" y="52" width="12" height="48" class="pp"/><path d="M8 44 h36 v8 h-36 z M116 44 h36 v8 h-36 z" class="pp"/><path d="M46 46 l34 34 l34 -30" class="pb"/><rect x="38" y="52" width="8" height="6" class="pbf"/><rect x="114" y="52" width="8" height="6" class="pbf"/>',
    stamp: '<rect x="42" y="12" width="76" height="90" class="pp"/><path d="M54 30 h52 M54 44 h52 M54 58 h34" class="pl"/><circle cx="96" cy="80" r="15" class="pok"/><path d="M88 80 l6 6 l11 -12" class="pok"/>',
    nostamp: '<rect x="42" y="12" width="76" height="90" class="pp"/><path d="M54 30 h52 M54 44 h52 M54 58 h34" class="pl"/><circle cx="96" cy="80" r="15" class="pb"/><path d="M87 71 l18 18 M105 71 l-18 18" class="pb"/>',
    falsedoc: '<rect x="42" y="12" width="76" height="90" class="pp"/><path d="M54 30 h52 M54 44 h52" class="pl"/><path d="M52 78 q10 -16 18 0 t18 0 t16 -4" class="pb"/><text x="80" y="66" class="pt b">CERTIFIED</text>',
    gavel: '<rect x="30" y="86" width="100" height="10" class="pp"/><g transform="rotate(-32 80 50)"><rect x="52" y="34" width="44" height="22" rx="3" class="pp"/><rect x="72" y="56" width="6" height="40" class="pp"/></g>',
    jail: '<rect x="34" y="16" width="92" height="80" class="pp"/><path d="M52 16 v80 M70 16 v80 M88 16 v80 M106 16 v80" class="pl"/><circle cx="80" cy="50" r="9" class="pb"/><path d="M80 59 v20" class="pb"/>',
    money: '<circle cx="80" cy="56" r="38" class="pp"/><text x="80" y="68" class="pt xl">S$</text>',
    extra: '<line x1="10" y1="98" x2="150" y2="98" class="pl"/><rect x="48" y="56" width="64" height="42" class="pp"/><rect x="48" y="24" width="64" height="32" class="pbd"/><text x="80" y="45" class="pt b">not approved</text><rect x="72" y="74" width="16" height="24" class="pl"/>',
    occupy: '<line x1="10" y1="98" x2="150" y2="98" class="pl"/><rect x="40" y="22" width="80" height="76" class="pp"/><path d="M40 48 h80 M40 72 h80" class="pl"/><g class="pb"><circle cx="58" cy="60" r="4"/><circle cx="80" cy="36" r="4"/><circle cx="102" cy="84" r="4"/><circle cx="64" cy="84" r="4"/></g><rect x="112" y="10" width="40" height="18" class="pbd"/><text x="132" y="23" class="pt b">NO TOP</text>',
    fire: '<line x1="10" y1="98" x2="150" y2="98" class="pl"/><rect x="46" y="26" width="68" height="72" class="pp"/><path d="M46 26 v72 M114 26 v72" class="pb"/><path d="M80 90 q-22 -26 0 -52 q6 18 14 8 q14 22 -14 44 z" class="pbf"/>',
    deepex: '<path d="M10 30 h40 v66 h60 v-66 h40" class="pp"/><path d="M50 46 h60 M50 64 h60 M50 82 h60" class="pl"/><path d="M50 64 l20 -8 l14 12 l26 -8" class="pb"/><text x="80" y="20" class="pt">30 m deep</text>',
    clock: '<circle cx="80" cy="56" r="38" class="pp"/><path d="M80 30 v26 l18 12" class="pb"/>',
    crane: '<line x1="10" y1="98" x2="150" y2="98" class="pl"/><path d="M48 98 v-78 h70 M48 20 l-16 14 M48 34 l28 -14 M104 20 v30" class="pl"/><rect x="96" y="50" width="16" height="12" class="pbf"/><rect x="70" y="70" width="60" height="28" class="pbd"/>',
    panel: '<line x1="10" y1="98" x2="150" y2="98" class="pl"/><rect x="34" y="14" width="56" height="84" class="pp"/><path d="M34 42 h56 M34 70 h56 M62 14 v84" class="pl"/><g transform="rotate(24 118 62)"><rect x="104" y="48" width="28" height="28" class="pbf"/></g><path d="M118 20 v14 M112 26 l6 8 l6 -8" class="pb"/>',
    check: '<rect x="30" y="16" width="70" height="82" class="pp"/><path d="M42 34 h46 M42 48 h46 M42 62 h30" class="pl"/><circle cx="104" cy="70" r="18" class="pok"/><path d="M117 83 l16 16" class="pok"/>'
  };
  function pic(k) { return '<svg viewBox="0 0 160 110" class="dwg pic" aria-hidden="true">' + (P[k] || P.check) + "</svg>"; }

  var stage = 0, box = $("#playbook");
  function road() {
    var n = C.length, x = function (i) { return 62 + i * (776 / (n - 1)); }, y = function (i) { return i % 2 ? 96 : 52; }, d = "M" + x(0) + " " + y(0);
    for (var i = 1; i < n; i++) { var mx = (x(i - 1) + x(i)) / 2; d += " C " + mx + " " + y(i - 1) + ", " + mx + " " + y(i) + ", " + x(i) + " " + y(i); }
    var s = '<svg viewBox="0 0 900 190" class="dwg road" style="min-width:640px" role="tablist" aria-label="Stages of managing the architect"><path d="' + d + '" class="rd"/><path d="' + d + '" class="rdl"/>';
    C.forEach(function (c, k) {
      var up = k % 2 === 0, ty = up ? y(k) - 34 : y(k) + 44;
      s += '<g class="stn' + (k === stage ? " on" : k < stage ? " done" : "") + '" data-i="' + k + '" role="tab" tabindex="0" aria-selected="' + (k === stage) + '" aria-label="' + esc(c.stage + ": " + c.title) + '"><circle cx="' + x(k) + '" cy="' + y(k) + '" r="21"/><text x="' + x(k) + '" y="' + (y(k) + 6) + '" class="sn">' + (k + 1) + '</text><text x="' + x(k) + '" y="' + ty + '" class="sl b">' + esc(c.stage) + '</text><text x="' + x(k) + '" y="' + (ty + 15) + '" class="sl">' + esc(c.tag) + "</text></g>";
    });
    return s + "</svg>";
  }
  function render() {
    var c = C[stage], p = D.playbook[stage] || { ask: [], check: [], chase: [] };
    var col = function (cls, name, items) { return '<div class="pbcol ' + cls + '"><h3>' + name + "<small>" + items.length + "</small></h3><ul>" + items.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>"; };
    box.innerHTML = '<div class="tw" style="border:0;background:none">' + road() + "</div>" +
      '<article class="case"><header><span class="label">Stage ' + (stage + 1) + " · " + esc(c.stage) + " · real case" + (c.grade ? " · " + esc(c.grade) : "") + "</span><h2>" + esc(c.title) + '</h2><p class="small">' + esc(c.when + " · " + c.where) + "</p></header>" +
      '<div class="frames">' + c.story.map(function (f, i) { return '<figure class="frame"><span class="fno">' + ["What happened", "What was missed", "What it cost"][i] + "</span>" + pic(f[0]) + "<figcaption>" + esc(f[1]) + "</figcaption></figure>"; }).join("") + "</div>" +
      '<div class="costs">' + c.big.map(function (b) { return '<div class="cost"><b>' + esc(b[0]) + "</b><span>" + esc(b[1]) + "</span></div>"; }).join("") + "</div>" +
      '<figure class="quote sm lesson"><span class="label">The lesson for whoever manages the architect</span><blockquote>' + esc(c.lesson) + "</blockquote></figure>" +
      (c.also ? '<div><span class="label">Also at this stage</span><div class="also">' + c.also.map(function (a) { return '<a class="alsoc" href="' + esc(a[2]) + '" target="_blank" rel="noopener"><b>' + esc(a[0]) + "</b><span>" + esc(a[1]) + "</span></a>"; }).join("") + "</div></div>" : "") +
      '<p class="srcline">Sources: ' + c.src.map(function (s) { return '<a href="' + esc(s[1]) + '" target="_blank" rel="noopener">' + esc(s[0]) + "</a>"; }).join(" · ") + "</p></article>" +
      '<h3>What CVC does at this stage so it does not happen to us</h3><div class="pbgrid">' + col("ask", "Ask for", p.ask) + col("chk2", "Check", p.check) + col("chase", "Chase", p.chase) + "</div>" +
      '<div class="row"><button type="button" class="btn ghost sm" data-go="-1"' + (stage === 0 ? " disabled" : "") + '>Previous case</button><button type="button" class="btn sm" data-go="1"' + (stage === C.length - 1 ? " disabled" : "") + ">Next case</button></div>";
  }
  box.addEventListener("click", function (e) {
    var s = e.target.closest(".stn"), g = e.target.closest("[data-go]");
    if (s) stage = +s.dataset.i; else if (g) stage = Math.max(0, Math.min(C.length - 1, stage + +g.dataset.go)); else return;
    render(); box.scrollIntoView({ block: "start" });
  });
  box.addEventListener("keydown", function (e) { var s = e.target.closest(".stn"); if (s && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); stage = +s.dataset.i; render(); } });
  render();
})();
