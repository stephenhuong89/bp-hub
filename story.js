/* "Why BP" story page: charts and infographics from window.BPSTATS. Every figure shows its source. */
(function () {
  "use strict";
  var S = window.BPSTATS; if (!S) return;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function src(u, name) { return u ? '<a href="' + esc(u) + '" target="_blank" rel="noopener">' + esc(name || "Source") + "</a>" : esc(name || ""); }
  function sec(title, sub, body, source) { return '<section class="st"><h2>' + esc(title) + "</h2>" + (sub ? '<p class="lead">' + sub + "</p>" : "") + body + (source ? '<p class="srcline">' + source + "</p>" : "") + "</section>"; }
  function fmt(n) { return Number(n).toLocaleString("en-SG"); }

  /* horizontal bar chart: one series, one row emphasised */
  function bars(rows, opt) {
    var max = Math.max.apply(null, rows.map(function (r) { return r.v; }));
    return '<div class="hb" role="img" aria-label="' + esc(opt.aria) + '">' + rows.map(function (r) {
      return '<div class="hb-row' + (r.em ? " em" : "") + '" title="' + esc(r.c + ": " + fmt(r.v) + (opt.unit || "")) + '"><span class="hb-l">' + esc(r.c) + '</span><span class="hb-t"><i style="width:' + Math.max(1.5, r.v / max * 100) + '%"></i></span><span class="hb-v">' + fmt(r.v) + (opt.unit || "") + "</span></div>";
    }).join("") + "</div>";
  }
  function chart(title, note, rows, opt) { return '<div class="panel"><h3>' + esc(title) + "</h3>" + bars(rows, opt) + '<p class="small">' + note + "</p></div>"; }

  function bubbles() {
    var W = 900, H = 250, x0 = 40, x1 = 870, y = { collapse: 86, fire: 176 };
    var mo = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
    var X = function (d) { var m = mo[d.date.split(" ")[1]] || 0; return x0 + ((d.year + m / 12) - 1985) / (2027 - 1985) * (x1 - x0); };
    var s = '<svg viewBox="0 0 ' + W + " " + H + '" class="dwg bub" role="img" aria-label="Timeline of building failures and fires, circle size showing deaths">';
    for (var yr = 1985; yr <= 2025; yr += 5) { var gx = x0 + (yr - 1985) / 42 * (x1 - x0); s += '<line x1="' + gx + '" y1="24" x2="' + gx + '" y2="226" class="grid"/><text x="' + gx + '" y="244" class="t mid">' + yr + "</text>"; }
    s += '<text x="4" y="18" class="t">COLLAPSES (top row) AND FIRES (bottom row)</text>'; var lab = { collapse: 0, fire: 0 };
    S.disasters.map(function (d, i) { return { d: d, i: i }; }).sort(function (a, b) { return b.d.deaths - a.d.deaths; }).forEach(function (o) {
      var d = o.d, r = Math.sqrt(d.deaths) * 2.3;
      s += '<g class="bb k-' + d.type + '" data-i="' + o.i + '" tabindex="0" role="button" aria-label="' + esc(d.name + ", " + d.country + ", " + d.year + ", " + (d.label || d.deaths) + " deaths") + '"><title>' + esc(d.name + ", " + d.country + " (" + d.year + "): " + (d.label || d.deaths) + " deaths") + '</title><circle cx="' + X(d) + '" cy="' + y[d.type] + '" r="' + r + '"/>' + (d.deaths >= 96 || d.country === "Singapore" ? '<text x="' + X(d) + '" y="' + (lab[d.type]++ % 2 ? y[d.type] + r + 14 : y[d.type] - r - 5) + '" class="t mid">' + esc(d.name.split(" ").slice(0, 2).join(" ") + " " + (d.label || d.deaths)) + "</text>" : "") + "</g>";
    });
    return s + '</svg><p class="small">Each circle is one event; its area shows the number of deaths.</p>';
  }
  function quote(k) {
    var q = (S.quotes || {})[k]; if (!q) return "";
    return '<figure class="quote wide"><div class="qmain">' + (q.lead ? '<span class="label">' + esc(q.lead) + "</span>" : "") + "<blockquote>" + (q.paraphrase ? "" : "\u201C") + esc(q.text) + (q.paraphrase ? "" : "\u201D") + (q.tail ? ' <span class="qtail">' + esc(q.tail) + "</span>" : "") + "</blockquote><figcaption>" + src(q.src, q.by) + '</figcaption></div><div class="qside"><div class="qpic" data-pic="' + esc(q.pic || "check") + '"></div><b>' + esc(q.n || "") + "</b><span>" + esc(q.nl || "") + "</span></div></figure>";
  }
  var out = quote("hammurabi");

  /* 1. hero numbers */
  if (S.tiles && S.tiles.length) out += sec(S.tilesTitle || "Singapore in numbers", S.tilesSub || "", '<div class="tiles">' + S.tiles.map(function (t) {
    return '<div class="tile' + (/^Not/.test(t.n) ? ' na' : '') + '"><b>' + esc(t.n) + "</b><span>" + esc(t.label) + '</span><small>' + esc(t.year || "") + " · " + src(t.src, t.by) + "</small></div>"; }).join("") + "</div>");

  /* 2. time series as columns */
  if (S.series && S.series.length) out += sec(S.seriesTitle, S.seriesSub, '<div class="grid2">' + S.series.map(function (se) {
    var max = Math.max.apply(null, se.pts.map(function (p) { return p[1]; }));
    return '<div class="panel"><h3>' + esc(se.title) + '</h3><div class="cols" role="img" aria-label="' + esc(se.title) + '">' + se.pts.map(function (p, i) {
      return '<div class="col-b' + (i === se.pts.length - 1 ? " em" : "") + '" title="' + esc(p[0] + ": " + fmt(p[1])) + '"><span class="cv">' + fmt(p[1]) + '</span><i style="height:' + Math.max(2, p[1] / max * 100) + '%"></i><span class="cl">' + esc(String(p[0]).slice(2)) + "</span></div>"; }).join("") + '</div><p class="small">' + esc(se.note) + " " + src(se.src, se.by) + "</p></div>"; }).join("") + "</div>");

  out += quote("fire");

  /* 3. law timeline */
  if (S.timeline && S.timeline.length) out += sec("Each rule was written after something went wrong", "Singapore's building laws, in the order they arrived.", '<ol class="tl">' + S.timeline.map(function (t) {
    return '<li class="' + (t.bad ? "bad" : "") + '"><span class="yr">' + esc(t.year) + "</span><div><b>" + esc(t.event) + "</b>" + (t.law ? "<span>" + esc(t.law) + "</span>" : "") + "<small>" + src(t.src, t.by) + "</small></div></li>"; }).join("") + "</ol>");

  /* 4. disasters */
  if (S.disasters) {
    var dmax = Math.max.apply(null, S.disasters.map(function (d) { return d.deaths; }));
    out += sec("What happens when the check is skipped", S.disasters.length + " building failures and fires in Southeast Asia since 1986. Almost every inquiry found the same things: floors added without approval, exits that were never built, permits signed off anyway. Click a row.",
      '<div class="panel">' + bubbles() + '<div class="legend"><span class="lg"><i class="k-collapse"></i>Collapse</span><span class="lg"><i class="k-fire"></i>Fire</span></div><div class="dz" id="dz">' + S.disasters.map(function (d, i) {
        return '<button type="button" class="dz-row k-' + d.type + '" data-i="' + i + '"><span class="dz-y">' + d.year + '</span><span class="dz-n">' + esc(d.name) + '<small>' + esc(d.country) + " · " + (d.type === "fire" ? "Fire" : "Collapse") + '</small></span><span class="dz-t"><i style="width:' + Math.max(2, d.deaths / dmax * 100) + '%"></i></span><span class="dz-v">' + esc(d.label || d.deaths) + "</span></button>"; }).join("") + '</div><div id="dz-out" class="dz-out"></div></div>',
      "Deaths as reported. Most accounts were read on Wikipedia pages that cite the official inquiry or court record; rows marked \"reported\" come from a single news report.");
  }

  out += quote("thai");

  /* 5. comparison charts */
  if (S.db) {
    var by = function (k, asc) { return S.db.slice().sort(function (a, b) { return asc ? a[k] - b[k] : b[k] - a[k]; }).map(function (r) { return { c: r.c, v: r[k], em: r.c === "Singapore" }; }); };
    out += sec("How Singapore compares with its neighbours", "The same warehouse, the same paperwork, measured by the World Bank in each country.",
      '<div class="grid2">' + chart("Days to get a construction permit", "Fewer is faster. Doing Business 2020.", by("days", true), { unit: " days", aria: "Days to get a construction permit by country" }) +
      chart("Number of procedures", "Each one is a separate visit, form or inspection.", by("proc", true), { aria: "Procedures by country" }) + "</div>" +
      (S.burn ? '<div class="grid2">' + chart("Deaths from fire and burns per 100,000 people", "All burn deaths, not only building fires. WHO estimates, 2021.", S.burn.slice().sort(function (a, b) { return a.v - b.v; }).map(function (r) { return { c: r.c, v: r.v, em: r.c === "Singapore" }; }), { aria: "Fire and burn deaths per 100,000 by country" }) +
      (S.bready ? chart("World Bank business location score, 2025", "Out of 100. Covers building permits, property transfer and environmental permits. Singapore ranked 2nd of 101 economies.", S.bready.slice().sort(function (a, b) { return b.v - a.v; }).map(function (r) { return { c: r.c, v: r.v, em: r.c === "Singapore" }; }), { aria: "Business location score by country" }) : "") + "</div>" : ""),
      "Doing Business 2020 was the last edition; the World Bank discontinued it in 2021 after data irregularities were found in two editions. Malaysia ranked 2nd and Singapore 5th overall. " + src(S.dbSrc, "World Bank Doing Business archive") + " · " + src(S.burnSrc, "Our World in Data, from WHO") + " · " + src(S.breadySrc, "World Bank B-READY 2025"));
  }

  /* 6. systems matrix */
  if (S.systems) {
    var mark = function (v) { return v === "yes" ? '<span class="mk y">Yes</span>' : v === "part" ? '<span class="mk p">Partly</span>' : v === "no" ? '<span class="mk n">No</span>' : '<span class="mk u">Not confirmed</span>'; };
    out += sec("Same job, six different systems", "What makes Singapore unusual is one national regulator and a second engineer who must check every major structure.",
      '<div class="tw"><table class="sys"><thead><tr><th>Country</th><th>Who approves</th><th>Independent structural checker</th><th>Occupation certificate</th><th>Online submission</th><th>BIM required</th></tr></thead><tbody>' + S.systems.map(function (r) {
        return "<tr" + (r.c === "Singapore" ? ' class="em"' : "") + "><td><b>" + esc(r.c) + "</b><small>" + esc(r.law) + "</small></td><td>" + esc(r.approver) + "</td><td>" + mark(r.checker) + "<small>" + esc(r.checkerNote || "") + "</small></td><td>" + esc(r.occ) + "</td><td>" + mark(r.online) + "<small>" + esc(r.onlineNote || "") + "</small></td><td>" + mark(r.bim) + "<small>" + esc(r.bimNote || "") + "</small></td></tr>"; }).join("") + "</tbody></table></div>",
      "\"Not confirmed\" means no reliable source was found either way, not that the country lacks it. Most neighbour entries rest on single secondary sources.");
  }

  /* 7. drivers */
  if (S.drives && S.drives.length) out += sec(S.drivesTitle || "What drives Singapore", S.drivesSub || "", '<div class="tiles">' + S.drives.map(function (t) {
    return '<div class="tile' + (/^Not/.test(t.n) ? ' na' : '') + '"><b>' + esc(t.n) + "</b><span>" + esc(t.label) + "</span><small>" + esc(t.year || "") + " · " + src(t.src, t.by) + "</small></div>"; }).join("") + "</div>");

  out += quote("bca");
  $("#story").innerHTML = out;
  if (window.BPPIC) Array.prototype.forEach.call(document.querySelectorAll("[data-pic]"), function (el) { el.innerHTML = window.BPPIC(el.getAttribute("data-pic")); });

  var dz = $("#dz");
  if (dz) {
    var show = function (i) {
      var d = S.disasters[i];
      Array.prototype.forEach.call(dz.children, function (b, k) { b.classList.toggle("on", k === i); });
      Array.prototype.forEach.call(document.querySelectorAll(".bb"), function (g) { g.classList.toggle("on", +g.dataset.i === i); });
      $("#dz-out").innerHTML = "<b>" + esc(d.date + " · " + d.name + ", " + d.country) + "</b><p>" + esc(d.found) + '</p><p class="small">' + (d.grade ? esc(d.grade) + " · " : "") + src(d.src, "Source") + "</p>";
    };
    dz.addEventListener("click", function (e) { var b = e.target.closest(".dz-row"); if (b) show(+b.dataset.i); });
    var bub = document.querySelector(".bub");
    if (bub) { var pick = function (e) { var g = e.target.closest(".bb"); if (!g) return; if (e.type === "keydown" && e.key !== "Enter") return; show(+g.dataset.i); document.getElementById("dz-out").scrollIntoView({ behavior: "smooth", block: "nearest" }); }; bub.addEventListener("click", pick); bub.addEventListener("keydown", pick); }
    show(0);
  }
})();
