(function () {
  "use strict";
  var D = window.BPDATA;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k)); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }
  function money(n) { return "S$" + Number(n).toLocaleString("en-SG", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function srcLink(src, text) { return src ? '<a href="' + esc(src) + '" target="_blank" rel="noopener">' + esc(text || "Source") + "</a>" : ""; }
  function statusBadge(st) { return st === "verified" ? '<span class="badge ok">Verified</span>' : st === "web" ? '<span class="badge acc" title="Read from the official web page; spot-check table values">Official page</span>' : '<span class="badge warn">Unverified</span>'; }
  function list(a) { return a && a.length ? "<ul>" + a.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" : '<p class="small">None recorded.</p>'; }

  /* ---------- index: every entry in one searchable list ---------- */
  var KIND = { rule: "Rule", step: "Process step", fee: "Fee", role: "Who submits", hurdle: "Hurdle", term: "Term", playbook: "Architect management" };
  var ALL = [];
  D.entries.forEach(function (e) { ALL.push(e); });
  D.steps.forEach(function (s) {
    ALL.push({ id: "step-" + s.id, kind: "step", title: s.title, agency: s.agency, ref: s.ref, src: s.src, status: s.status,
      body: (s.what || []).join(" ") + (s.tatNote ? " Processing time: " + s.tatNote : ""), evidence: "", tags: (s.hurdles || []).join(" ") + " " + (s.out || []).join(" "), go: "process" });
  });
  D.who.options.forEach(function (o) {
    ALL.push({ id: "who-" + o.id, kind: "role", title: o.label, agency: o.agency || "BCA", ref: o.ref, src: o.src, status: o.confidence === "High" ? "verified" : o.confidence === "Medium" ? "web" : "unverified",
      body: o.qp + ". " + (o.basis || ""), tags: "qualified person QP architect professional engineer PE submit " + (o.tags || ""), go: "who" });
  });
  D.fees.items.forEach(function (f) {
    ALL.push({ id: "fee-" + f.id, kind: "fee", title: f.label, agency: f.agency, ref: f.ref, src: f.src, status: f.status, body: f.desc || "", tags: "fee cost charge " + (f.tags || ""), go: "fees" });
  });
  D.playbook.forEach(function (p, i) {
    ALL.push({ id: "pb-" + i, kind: "playbook", title: p.stage, agency: "Team", status: "verified", internal: true,
      body: [].concat(p.ask || [], p.check || [], p.chase || []).join(" "), tags: "architect manage chase checklist", go: "playbook" });
  });
  ALL.forEach(function (e) { e._t = (e.title || "").toLowerCase(); e._b = ((e.body || "") + " " + (e.evidence || "")).toLowerCase(); e._g = ((e.tags || "") + " " + (e.topic || "") + " " + (e.ref || "") + " " + (e.agency || "") + " " + e.id).toLowerCase(); });

  var SYN = D.synonyms || {};
  function terms(q) {
    var out = [];
    q.toLowerCase().split(/[^a-z0-9.%&+]+/).filter(function (w) { return w.length > 1; }).forEach(function (w) {
      var alts = [w]; if (SYN[w]) alts = alts.concat(SYN[w]);
      if (w.length > 4 && /s$/.test(w)) alts.push(w.slice(0, -1));
      out.push(alts);
    });
    return out;
  }
  function search(q, kinds, agencies) {
    var ts = terms(q || "");
    var res = [];
    ALL.forEach(function (e) {
      if (kinds.length && kinds.indexOf(e.kind) < 0) return;
      if (agencies.length && agencies.indexOf(e.agency) < 0) return;
      var score = 0, hitAll = true;
      ts.forEach(function (alts) {
        var best = 0;
        alts.forEach(function (w, i) {
          var k = i === 0 ? 1 : 0.7, s = 0;
          if (e._t.indexOf(w) >= 0) s += 6; if (e._g.indexOf(w) >= 0) s += 3; if (e._b.indexOf(w) >= 0) s += 1.5;
          best = Math.max(best, s * k);
        });
        if (!best) hitAll = false; score += best;
      });
      if (ts.length && (!score || (!hitAll && ts.length <= 2))) return;
      res.push({ e: e, s: score + (hitAll ? 4 : 0) });
    });
    if (ts.length) res.sort(function (a, b) { return b.s - a.s; });
    return res.map(function (r) { return r.e; });
  }
  function entryHtml(e) {
    return '<article class="entry"><div class="tb"><span class="ag">' + esc(e.agency || "") + '</span><span class="badge acc">' + esc(KIND[e.kind] || e.kind) + "</span>" +
      (e.internal ? '<span class="badge">CVC practice</span>' : statusBadge(e.status)) + '</div><div class="bd"><h3>' + esc(e.title) + "</h3><p>" + esc(e.body) + "</p>" +
      (e.evidence ? '<p class="ev"><b>On the drawing:</b> ' + esc(e.evidence) + "</p>" : "") +
      '<div class="row">' + (e.ref ? '<span class="ref">' + esc(e.ref) + "</span>" : "") + srcLink(e.src) + (e.go ? '<a href="#' + e.go + '">Open in ' + esc(KIND[e.kind]) + "</a>" : "") + "</div></div></article>";
  }

  var fKinds = [], fAgencies = [];
  function chips(el, items, sel, onchange) {
    el.innerHTML = items.map(function (it) { return '<button type="button" class="chip" data-v="' + esc(it.v) + '" aria-pressed="' + (sel.indexOf(it.v) >= 0) + '">' + esc(it.l) + "</button>"; }).join("");
    el.onclick = function (ev) {
      var b = ev.target.closest(".chip"); if (!b) return;
      var v = b.dataset.v, i = sel.indexOf(v); if (i >= 0) sel.splice(i, 1); else sel.push(v);
      b.setAttribute("aria-pressed", i < 0); onchange();
    };
  }
  function renderSearch() {
    var q = $("#q").value.trim();
    var res = search(q, fKinds, fAgencies);
    var shown = res.slice(0, 60);
    $("#count").textContent = (q || fKinds.length || fAgencies.length) ? res.length + " of " + ALL.length + " entries" + (res.length > 60 ? ", showing the first 60" : "") : ALL.length + " entries in the hub. Type to search, or filter by type and agency.";
    $("#results").innerHTML = shown.length ? shown.map(entryHtml).join("") : '<div class="panel"><b>No entry matches "' + esc(q) + '".</b><p class="small">The hub does not cover this yet. Try a simpler term, or check the authority\'s own site before answering a client.</p></div>';
    return res;
  }

  /* ---------- AI capability ---------- */
  var sample = null, db = null, lessons = [], aiReady = false;
  function errCopy(e) {
    var c = e && e.code;
    return ({ not_granted: "Claude access was not allowed for this page, so AI features are off for this visit.", rate_limited: "Usage limit reached. Wait a while and try again.", session_expired: "Sign in to claude.ai again, then retry.",
      refused: "Claude declined this request. Change the input and try again.", invalid_json: "The reply could not be read as a structured result. Try again.", image_rejected: "A drawing image was rejected (too large or unreadable). Try a different file.",
      images_unavailable: "This view cannot send images to Claude.", sampling_disabled: "Claude is not available for this account.", prompt_too_large: "Too much text for one request. Select fewer sheets.", cancelled: "Stopped." })[c] || "The request failed (" + (c || "unknown") + "). Try again.";
  }
  var askCtl = null;
  function askAI() {
    var q = $("#q").value.trim(); if (!q || !sample) return;
    var ctx = search(q, [], []).slice(0, 14);
    var out = $("#ask-out"); $("#ask-panel").hidden = false; out.textContent = "Thinking...";
    if (askCtl) askCtl.abort(); askCtl = new AbortController();
    var prompt = "You answer questions for staff of a Singapore civil and structural engineering firm about building plan (BP) and architectural submissions.\n" +
      "Use ONLY the hub entries below. Cite the entry id in square brackets after each claim. If the entries do not answer the question, say plainly that the hub does not cover it and name which authority to check. " +
      "If an entry is marked unverified, say so. Do not add rules, numbers or thresholds from memory. Answer in at most 180 words, plain text, no markdown.\n\nQUESTION: " + q + "\n\nHUB ENTRIES:\n" +
      ctx.map(function (e) { return "[" + e.id + "] (" + (e.agency || "") + ", " + (e.status || "") + ") " + e.title + ": " + e.body + (e.ref ? " Ref: " + e.ref : ""); }).join("\n");
    sample(prompt, { signal: askCtl.signal, onText: function (u) { out.textContent = u.text; } })
      .then(function (r) { out.textContent = r.text; })
      .catch(function (e) { if (e.code !== "cancelled") out.textContent = (e.text ? e.text + "\n\n" : "") + errCopy(e); });
  }

  /* ---------- WHO ---------- */
  var VERDICT = { pe: ["ok", "PE can submit"], architect: ["bad", "Architect required"], either: ["ok", "Architect or PE"], depends: ["warn", "Depends"], none: ["acc", "No submission"] };
  function whoResult(o) {
    var v = VERDICT[o.verdict] || VERDICT.depends;
    return '<div class="finding ' + (o.verdict === "architect" ? "non_comply" : o.verdict === "depends" ? "unclear" : "comply") + '"><div class="hd"><b>' + esc(o.qp) + '</b><span class="badge ' + v[0] + '">' + v[1] + '</span><span class="badge">Confidence: ' + esc(o.confidence) + "</span></div><p>" + esc(o.basis) + "</p>" +
      (o.detail ? "<p>" + esc(o.detail) + "</p>" : "") + '<div class="row"><span class="ref">' + esc(o.ref || "") + "</span>" + srcLink(o.src) + "</div></div>";
  }
  function renderWho() {
    $("#who-headline").innerHTML = D.who.headlineHtml;
    $("#who-notes").innerHTML = D.who.notesHtml || "";
    var sel = $("#who-sel");
    sel.innerHTML = D.who.options.map(function (o) { return '<option value="' + esc(o.id) + '">' + esc(o.label) + "</option>"; }).join("");
    var show = function () { var o = D.who.options.filter(function (x) { return x.id === sel.value; })[0]; $("#who-result").innerHTML = whoResult(o); };
    sel.onchange = show; show();
    $("#who-table").innerHTML = "<thead><tr><th>Work</th><th>Who can be QP</th><th>Verdict</th><th>Confidence</th><th>Basis</th></tr></thead><tbody>" +
      D.who.options.map(function (o) { var v = VERDICT[o.verdict] || VERDICT.depends; return "<tr><td>" + esc(o.label) + "</td><td>" + esc(o.qp) + '</td><td><span class="badge ' + v[0] + '">' + v[1] + "</span></td><td>" + esc(o.confidence) + '</td><td><span class="ref mono">' + esc(o.ref || "") + "</span> " + srcLink(o.src) + "</td></tr>"; }).join("") + "</tbody>";
  }

  /* ---------- PROCESS ---------- */
  var track = store("bp.track") || D.tracks[0].id;
  function renderProcess() {
    var el = $("#track-chips");
    el.innerHTML = D.tracks.map(function (t) { return '<button type="button" class="chip" data-v="' + t.id + '" aria-pressed="' + (t.id === track) + '">' + esc(t.label) + "</button>"; }).join("");
    el.onclick = function (ev) { var b = ev.target.closest(".chip"); if (!b) return; track = b.dataset.v; store("bp.track", track); renderProcess(); };
    var steps = D.steps.filter(function (s) { return s.tracks.indexOf(track) >= 0; });
    var lo = 0, hi = 0, timed = steps.filter(function (s) { return s.tatMax; });
    timed.forEach(function (s) { lo += s.tatMin || 0; hi += s.tatMax || 0; });
    $("#durbar").innerHTML = timed.map(function (s) { return '<i style="flex:' + s.tatMax + '" title="' + esc(s.title + ": " + (s.tatNote || "")) + '"></i>'; }).join("");
    $("#durtext").textContent = timed.length ? "If each stated step ran once, back to back: about " + lo + " to " + hi + " working days of authority time across " + timed.length + " timed steps. Several run in parallel in practice, and each resubmission restarts that step's clock." : "No stated processing times recorded for this track.";
    $("#steps").innerHTML = steps.map(function (s, i) {
      return '<div class="step" data-id="' + s.id + '"><div class="rail"><span class="no">' + (i + 1) + '</span></div><details class="card"' + (i === 0 ? " open" : "") + "><summary><h3>" + esc(s.title) + '</h3><span class="badge acc">' + esc(s.agency) + "</span>" +
        (s.tatNote ? '<span class="tat">' + esc(s.tatNote) + "</span>" : "") + statusBadge(s.status) + '</summary><div class="inner">' +
        '<div><span class="label">Who leads</span><p>' + esc(s.lead || "") + "</p></div>" +
        '<div><span class="label">What goes in</span>' + list(s.what) + "</div>" +
        '<div><span class="label">What comes back</span>' + list(s.out) + "</div>" +
        '<div><span class="label">Usual hurdles</span>' + list(s.hurdles) + "</div>" +
        '<div><span class="label">Ask the architect</span>' + list(s.ask) + "</div>" +
        '<div><span class="label">Reference</span><p class="ref mono">' + esc(s.ref || "") + "</p>" + srcLink(s.src) + "</div></div></details></div>";
    }).join("");
    $("#process-notes").innerHTML = D.processNotesHtml || "";
    if (window.BPVIZ) window.BPVIZ.process(track);
  }

  /* ---------- generic form ---------- */
  function formHtml(fields, vals, prefix) {
    return fields.map(function (f) {
      var id = prefix + f.id, v = vals[f.id] != null ? vals[f.id] : f.def;
      if (f.type === "select") return '<label class="field"><span>' + esc(f.label) + '</span><select id="' + id + '">' + f.options.map(function (o) { return '<option value="' + esc(o[0]) + '"' + (String(v) === String(o[0]) ? " selected" : "") + ">" + esc(o[1]) + "</option>"; }).join("") + "</select></label>";
      if (f.type === "text") return '<label class="field"><span>' + esc(f.label) + '</span><input type="text" id="' + id + '" value="' + esc(v || "") + '"></label>';
      return '<label class="field"><span>' + esc(f.label) + '</span><input type="number" min="0" step="any" id="' + id + '" value="' + esc(v == null ? "" : v) + '"></label>';
    }).join("");
  }
  function formRead(fields, prefix) {
    var p = {};
    fields.forEach(function (f) { var el = document.getElementById(prefix + f.id); if (!el) return; p[f.id] = (f.type === "select" || f.type === "text") ? el.value : (el.value === "" ? null : Number(el.value)); });
    return p;
  }

  /* ---------- FEES ---------- */
  function renderFees() {
    var vals = store("bp.fees") || {};
    $("#fee-form").innerHTML = formHtml(D.fees.fields, vals, "fee-");
    $("#fee-notes").innerHTML = D.fees.notesHtml || "";
    var calc = function () {
      var p = formRead(D.fees.fields, "fee-"); store("bp.fees", p);
      var total = 0, anyUnv = false, rows = "", parts = [];
      D.fees.items.forEach(function (it) {
        if (it.when && !it.when(p)) return;
        var r = it.calc(p); if (!r) return;
        if (typeof r.amount === "number") { total += r.amount; parts.push({ agency: it.agency, amount: r.amount }); }
        if (it.status !== "verified") anyUnv = true;
        rows += "<tr><td>" + esc(it.agency) + "</td><td><b>" + esc(it.label) + '</b><div class="small">' + esc(r.basis || "") + '</div></td><td class="num">' + (typeof r.amount === "number" ? money(r.amount) : esc(r.amount || "n/a")) + "</td><td>" + statusBadge(it.status) + ' <span class="ref mono">' + esc(it.ref || "") + "</span> " + srcLink(it.src) + "</td></tr>";
      });
      $("#fee-table").innerHTML = "<thead><tr><th>Agency</th><th>Fee and how it was worked out</th><th class=\"num\">Amount</th><th>Schedule</th></tr></thead><tbody>" + (rows || '<tr><td colspan="4">Enter the project figures above.</td></tr>') +
        '</tbody><tfoot><tr><td></td><td>Total of the fees listed' + (anyUnv ? " (includes unverified items)" : "") + '</td><td class="num">' + money(total) + "</td><td></td></tr></tfoot>";
    if (window.BPVIZ) window.BPVIZ.fees(parts);
    };
    $("#fee-form").oninput = calc; calc();
  }

  /* ---------- PLAYBOOK ---------- */
  function renderPlaybook() {
    $("#playbook").innerHTML = '<div class="list">' + D.playbook.map(function (p) {
      return '<div class="panel"><h3>' + esc(p.stage) + '</h3><div class="grid"><div><span class="label">Ask for</span>' + list(p.ask) + '</div><div><span class="label">Check on receipt</span>' + list(p.check) + '</div><div><span class="label">Chase</span>' + list(p.chase) + "</div></div></div>";
    }).join("") + "</div>";
  }

  /* ---------- CHECKER ---------- */
  var sheets = [];      // {id, name, thumb, selected, text, getImages()}
  var runCtl = null, maxImages = 0, current = null;
  function log(msg) { var el = $("#rv-log"); el.hidden = false; el.textContent += (el.textContent ? "\n" : "") + msg; el.scrollTop = el.scrollHeight; }
  function facts() { var p = formRead(D.facts, "fact-"); p.notes = $("#f-notes").value; return p; }
  function renderPathway() {
    var p = facts(); store("bp.facts", p);
    var items = D.pathway(p);
    $("#pathway").innerHTML = items.length ? '<span class="label">Pathway pre-check from the facts above</span><div class="list" style="margin-top:6px">' + items.map(function (x) {
      return '<div class="note ' + (x.level === "bad" ? "bad" : x.level === "info" ? "info" : "") + '">' + esc(x.text) + (x.ref ? ' <span class="ref mono">' + esc(x.ref) + "</span>" : "") + "</div>"; }).join("") + "</div>" : "";
  }
  function canvasBlob(c, q) { return new Promise(function (res) { c.toBlob(function (b) { res(b); }, "image/jpeg", q || 0.86); }); }
  function scaled(src, maxEdge) {
    var k = Math.min(1, maxEdge / Math.max(src.width, src.height));
    var c = document.createElement("canvas"); c.width = Math.round(src.width * k); c.height = Math.round(src.height * k);
    var g = c.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height); g.drawImage(src, 0, 0, c.width, c.height); return c;
  }
  // overview + overlapping tiles so dimensions stay legible after the platform downsizes each image
  function tileImages(src, budget) {
    var land = src.width >= src.height, grid = budget >= 7 ? [3, 2] : budget >= 5 ? [2, 2] : budget >= 3 ? [2, 1] : null;
    var jobs = [canvasBlob(scaled(src, 1500))];
    if (grid) {
      var cols = land ? grid[0] : grid[1], rows = land ? grid[1] : grid[0], ov = 0.08;
      var tw = src.width / cols, th = src.height / rows;
      for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) {
        var x = Math.max(0, tw * c - tw * ov), y = Math.max(0, th * r - th * ov);
        var w = Math.min(src.width - x, tw * (1 + 2 * ov)), h = Math.min(src.height - y, th * (1 + 2 * ov));
        var t = document.createElement("canvas"); t.width = Math.round(w); t.height = Math.round(h);
        var g = t.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, t.width, t.height); g.drawImage(src, x, y, w, h, 0, 0, t.width, t.height);
        jobs.push(canvasBlob(t));
      }
    }
    return Promise.all(jobs).then(function (b) { return { blobs: b, grid: grid ? (land ? grid : [grid[1], grid[0]]) : null }; });
  }
  function renderPdfPage(page, edge) {
    var vp1 = page.getViewport({ scale: 1 }), s = edge / Math.max(vp1.width, vp1.height), vp = page.getViewport({ scale: s });
    var c = document.createElement("canvas"); c.width = Math.round(vp.width); c.height = Math.round(vp.height);
    var g = c.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height);
    return page.render({ canvasContext: g, viewport: vp, intent: "print" }).promise.then(function () { return c; });
  }
  function addFiles(files) {
    var chain = Promise.resolve();
    Array.prototype.forEach.call(files, function (file) {
      chain = chain.then(function () {
        if (file.type === "application/pdf" || /\.pdf$/i.test(file.name)) {
          if (!window.pdfjsLib) { log("PDF reader did not load. Upload PNG or JPG sheets instead."); return; }
          return file.arrayBuffer().then(function (buf) { return window.pdfjsLib.getDocument({ data: buf }).promise; }).then(function (pdf) {
            var p = Promise.resolve();
            for (var i = 1; i <= pdf.numPages; i++) (function (n) {
              p = p.then(function () { return pdf.getPage(n); }).then(function (page) {
                return renderPdfPage(page, 420).then(function (tc) {
                  return page.getTextContent().then(function (tc2) { return tc2.items.map(function (it) { return it.str; }).join(" ").replace(/\s+/g, " ").trim(); }).catch(function () { return ""; }).then(function (text) {
                    sheets.push({ id: file.name + "#" + n, name: file.name + " p." + n, thumb: tc.toDataURL("image/jpeg", 0.7), selected: pdf.numPages <= 8, text: text,
                      getCanvas: function () { return pdf.getPage(n).then(function (pg) { return renderPdfPage(pg, 4000); }); } });
                    renderThumbs();
                  });
                });
              });
            })(i);
            return p;
          }).catch(function (e) { log("Could not read " + file.name + ": " + (e && e.message || e)); });
        }
        if (/^image\//.test(file.type)) {
          return createImageBitmap(file).then(function (bmp) {
            var c = scaled(bmp, 4000);
            sheets.push({ id: file.name, name: file.name, thumb: scaled(c, 420).toDataURL("image/jpeg", 0.7), selected: true, text: "", getCanvas: function () { return Promise.resolve(c); } });
            renderThumbs();
          }).catch(function () { log("Could not read image " + file.name); });
        }
        log("Skipped " + file.name + ": only PDF, PNG and JPG are read.");
      });
    });
    return chain;
  }
  function renderThumbs() {
    $("#thumbs").innerHTML = sheets.map(function (s, i) { return '<div class="thumb' + (s.selected ? " on" : "") + '" data-i="' + i + '" role="checkbox" aria-checked="' + s.selected + '" tabindex="0"><img alt="" src="' + s.thumb + '"><span>' + esc(s.name) + (s.text ? "" : " (no text layer)") + "</span></div>"; }).join("");
    var n = sheets.filter(function (s) { return s.selected; }).length;
    $("#thumb-bar").hidden = !sheets.length;
    $("#sel-count").textContent = n + " of " + sheets.length + " sheets selected";
    $("#rv-run").disabled = !n || !aiReady || !!runCtl;
    $("#rv-hint").textContent = !aiReady ? "AI review is not available in this view." : !n ? "Select at least one sheet." : n > 12 ? "That is a lot of sheets. Each one is a separate request on your Claude usage." : "Each sheet is one request, plus one to combine the results.";
  }
  function rulesFor(scope) {
    return D.entries.filter(function (e) { return e.kind === "rule" && e.checkable !== false && (scope === "all" || e.scope === scope); });
  }
  function ruleLine(e) { return e.id + " | " + (e.agency || "") + " | " + e.title + ": " + e.body + (e.evidence ? " | Look for: " + e.evidence : "") + (e.status === "unverified" ? " | (unverified rule)" : ""); }
  function lessonText() {
    if (!lessons.length) return "";
    return "\n\nCORRECTIONS FROM THE TEAM ON EARLIER REVIEWS (apply them):\n" + lessons.slice(0, 30).map(function (l) { return "- Rule " + l.rule + ": checker said " + l.said + ", team marked it " + (l.right ? "right" : "WRONG") + (l.note ? ". Note: " + l.note : ""); }).join("\n");
  }
  function sheetPrompt(s, p, rules, grid) {
    return "You are screening one sheet of a Singapore building plan (BP) drawing set for a civil and structural engineering firm. This is a first-pass technical screen, not a statutory approval.\n\n" +
      "IMAGES: image 1 is the whole sheet." + (grid ? " The following images are enlarged tiles of the same sheet in reading order, " + grid[0] + " columns by " + grid[1] + " rows, left to right then top to bottom, with slight overlap. Read dimensions, levels and notes from the tiles." : "") + "\n" +
      "SHEET NAME: " + s.name + "\n" + (s.text ? "TEXT EXTRACTED FROM THE PDF (unordered, may include dimensions and notes):\n" + s.text.slice(0, 7000) + "\n" : "No text layer was available; read everything from the images.\n") +
      "\nPROJECT FACTS GIVEN BY THE USER:\n" + JSON.stringify(p) + "\n\nRULES (id | agency | requirement | what to look for):\n" + rules.map(ruleLine).join("\n") + lessonText() +
      "\n\nINSTRUCTIONS:\n- Report a finding ONLY for rules this sheet gives evidence about. Skip rules the sheet cannot show.\n- status is \"comply\" only when you can read a value or feature on the sheet that meets the rule; \"non_comply\" only when you can read one that fails it; otherwise \"unclear\" and say what is missing.\n" +
      "- Quote the value you read (with units) and where on the sheet (room, grid, tile). Never invent a dimension. If a dimension is illegible say so.\n- Do not apply rules that are not in the list. If you notice a likely issue outside the list, put it in other_observations.\n" +
      "- Also list which standard BP sheet contents are present or missing on this sheet (title block, scale, north point, QP endorsement, dimensions, levels, room names).\n\n" +
      'Reply with only JSON: {"sheet":{"title":string,"type":"site plan|floor plan|section|elevation|roof plan|detail|schedule|other","scale":string,"legibility":"good|partial|poor"},' +
      '"findings":[{"rule_id":string,"status":"comply|non_comply|unclear","value_found":string,"location":string,"reason":string}],"other_observations":[string],"missing_on_sheet":[string]}';
  }
  function synthPrompt(p, per, rules) {
    return "You are combining a sheet-by-sheet screening of a Singapore building plan drawing set into one report for a civil and structural engineering firm's team, who manage the architect. Be technical and direct.\n\n" +
      "PROJECT FACTS: " + JSON.stringify(p) + "\n\nRULES CHECKED (id | agency | requirement):\n" + rules.map(function (e) { return e.id + " | " + e.agency + " | " + e.title; }).join("\n") +
      "\n\nPER-SHEET RESULTS:\n" + JSON.stringify(per).slice(0, 150000) + lessonText() +
      "\n\nTASK:\n1. Merge duplicate findings for the same rule (keep the clearest evidence, list the sheets). A non_comply on any sheet outweighs comply on another unless they are different locations.\n" +
      "2. missing_information: what the set as a whole does not show that a BP submission needs (sheets or data absent).\n3. hurdles: the specific things most likely to draw a written direction or delay clearance, most serious first, each with the agency.\n" +
      "4. outlook: for BP/plan approval and for TOP/CSC, a band (\"likely to clear\", \"likely to draw queries\", \"likely to be rejected or need redesign\", \"cannot assess\") and one or two sentences of reasons grounded in the findings. This is a screening judgment from the sheets reviewed, not a prediction of the authority's decision.\n" +
      "5. questions_for_architect: precise questions or requests the team should send the architect.\nUse only what the per-sheet results contain. Do not invent values.\n\n" +
      'Reply with only JSON: {"summary":string,"findings":[{"rule_id":string,"status":"comply|non_comply|unclear","value_found":string,"location":string,"sheets":[string],"reason":string}],' +
      '"missing_information":[string],"hurdles":[{"agency":string,"issue":string,"severity":"high|medium|low"}],"outlook":{"bp":{"band":string,"reason":string},"top_csc":{"band":string,"reason":string}},"questions_for_architect":[string]}';
  }
  function runReview() {
    var sel = sheets.filter(function (s) { return s.selected; }); if (!sel.length || !sample) return;
    var p = facts(), scope = $("#rv-scope").value, tier = $("#rv-depth").value, rules = rulesFor(scope);
    runCtl = new AbortController(); var signal = runCtl.signal;
    $("#rv-log").textContent = ""; $("#rv-run").disabled = true; $("#rv-stop").hidden = false; $("#report").innerHTML = "";
    log("Checking " + sel.length + " sheet(s) against " + rules.length + " rules. Allow Claude access if asked.");
    var per = [], chain = Promise.resolve();
    sel.forEach(function (s, i) {
      chain = chain.then(function () {
        if (signal.aborted) return;
        log("Sheet " + (i + 1) + "/" + sel.length + ": " + s.name + " - rendering");
        return s.getCanvas().then(function (c) { return tileImages(c, maxImages); }).then(function (t) {
          log("  sending " + t.blobs.length + " image(s)" + (s.text ? " and " + Math.min(7000, s.text.length) + " characters of text" : "") + ", reading...");
          return sample.json(sheetPrompt(s, p, rules, t.grid), { images: t.blobs, modelTier: tier, signal: signal, cache: false });
        }).then(function (r) {
          r = r || {}; r.name = s.name; r.findings = Array.isArray(r.findings) ? r.findings : []; per.push(r);
          log("  " + r.findings.length + " finding(s); legibility " + ((r.sheet && r.sheet.legibility) || "not stated"));
        }).catch(function (e) {
          if (e && e.code === "cancelled") throw e;
          if (e && (e.code === "not_granted" || e.code === "rate_limited" || e.code === "sampling_disabled" || e.code === "session_expired")) throw e;
          log("  could not review this sheet: " + errCopy(e)); per.push({ name: s.name, error: errCopy(e), findings: [] });
        });
      });
    });
    chain.then(function () {
      if (signal.aborted) throw { code: "cancelled" };
      if (!per.some(function (x) { return !x.error; })) throw { code: "none", message: "No sheet could be reviewed." };
      log("Combining results...");
      return sample.json(synthPrompt(p, per, rules), { modelTier: tier, signal: signal, cache: false });
    }).then(function (rep) {
      rep = rep || {}; rep.findings = Array.isArray(rep.findings) ? rep.findings : [];
      current = { id: "r" + Date.now(), at: new Date().toISOString(), facts: p, scope: scope, sheets: sel.map(function (s) { return s.name; }), report: rep, perSheet: per.map(function (x) { return { name: x.name, sheet: x.sheet, error: x.error, other_observations: x.other_observations, missing_on_sheet: x.missing_on_sheet }; }) };
      log("Done."); renderReport(current); saveReview(current);
    }).catch(function (e) {
      log(e && e.code === "none" ? e.message : errCopy(e));
      if (e && (e.code === "not_granted" || e.code === "sampling_disabled")) { aiReady = false; $("#ai-off").hidden = false; }
    }).then(function () { runCtl = null; $("#rv-stop").hidden = true; renderThumbs(); });
  }
  var RULE = {}; D.entries.forEach(function (e) { RULE[e.id] = e; });
  var ST = { non_comply: ["bad", "Not comply"], comply: ["ok", "Comply"], unclear: ["warn", "Cannot tell"] };
  function bandClass(b) { b = (b || "").toLowerCase(); return b.indexOf("reject") >= 0 ? "bad" : b.indexOf("quer") >= 0 ? "warn" : b.indexOf("clear") >= 0 ? "ok" : ""; }
  function renderReport(rv) {
    var rep = rv.report, f = rep.findings, n = { non_comply: 0, comply: 0, unclear: 0 };
    f.forEach(function (x) { if (n[x.status] != null) n[x.status]++; });
    var order = { non_comply: 0, unclear: 1, comply: 2 };
    var sorted = f.slice().sort(function (a, b) { return (order[a.status] || 0) - (order[b.status] || 0); });
    var o = rep.outlook || {}, html = '<div class="view">' +
      '<div class="view-head"><h2>Review result</h2><p class="small">' + esc((rv.facts.name || "Untitled project") + " · " + rv.sheets.length + " sheet(s) · " + new Date(rv.at).toLocaleString("en-SG")) + "</p></div>" +
      '<div class="note">This is a first-pass screen by an AI reading the sheets you selected. It can misread a dimension or miss one. A finding is not an authority decision and does not replace the QP\'s own check.</div>' +
      '<div class="kpis"><div class="kpi"><b style="color:var(--bad)">' + n.non_comply + '</b><span class="small">Not comply</span></div><div class="kpi"><b style="color:var(--warn)">' + n.unclear + '</b><span class="small">Cannot tell</span></div><div class="kpi"><b style="color:var(--ok)">' + n.comply + '</b><span class="small">Comply</span></div></div>' +
      '<div class="panel"><p>' + esc(rep.summary || "") + '</p><div class="grid">' +
      ["bp", "top_csc"].map(function (k) { var x = o[k] || {}; return '<div><span class="label">' + (k === "bp" ? "Plan approval outlook" : "TOP / CSC outlook") + '</span><p><span class="badge ' + bandClass(x.band) + '">' + esc(x.band || "cannot assess") + "</span></p><p class=\"small\">" + esc(x.reason || "") + "</p></div>"; }).join("") + "</div></div>";
    if ((rep.hurdles || []).length) html += '<h3>Hurdles, most serious first</h3><div class="tw"><table><thead><tr><th>Agency</th><th>Issue</th><th>Severity</th></tr></thead><tbody>' + rep.hurdles.map(function (h) { return "<tr><td>" + esc(h.agency) + "</td><td>" + esc(h.issue) + '</td><td><span class="badge ' + (h.severity === "high" ? "bad" : h.severity === "medium" ? "warn" : "") + '">' + esc(h.severity) + "</span></td></tr>"; }).join("") + "</tbody></table></div>";
    html += '<h3>Findings by rule</h3><div class="list">' + (sorted.length ? sorted.map(function (x, i) {
      var r = RULE[x.rule_id], st = ST[x.status] || ST.unclear;
      return '<div class="finding ' + esc(x.status) + '"><div class="hd"><b>' + esc(r ? r.title : x.rule_id) + '</b><span class="badge ' + st[0] + '">' + st[1] + '</span><span class="badge">' + esc(r ? r.agency : "") + "</span>" + (r && r.status === "unverified" ? '<span class="badge warn">Rule unverified</span>' : "") + "</div>" +
        "<p>" + esc(x.reason || "") + "</p>" + (x.value_found ? "<p><b>Read from sheet:</b> " + esc(x.value_found) + (x.location ? " at " + esc(x.location) : "") + "</p>" : "") +
        (r ? '<p class="small"><b>Requirement:</b> ' + esc(r.body) + ' <span class="ref mono">' + esc(r.ref || "") + "</span> " + srcLink(r.src) + "</p>" : "") +
        ((x.sheets || []).length ? '<p class="small">Sheets: ' + esc(x.sheets.join(", ")) + "</p>" : "") +
        '<div class="fb" data-i="' + i + '" data-rule="' + esc(x.rule_id) + '" data-said="' + esc(x.status) + '"><span class="small">Was the checker right?</span><button type="button" class="btn ghost sm" data-fb="1">Right</button><button type="button" class="btn ghost sm" data-fb="0">Wrong</button><input type="text" id="fbn-' + i + '" placeholder="What should it have said? (optional)" aria-label="Correction note"></div></div>';
    }).join("") : '<div class="panel">No rule in the selected set could be assessed from these sheets.</div>') + "</div>";
    if ((rep.missing_information || []).length) html += '<h3>Missing from the set</h3><div class="panel">' + list(rep.missing_information) + "</div>";
    if ((rep.questions_for_architect || []).length) html += '<h3>Send to the architect</h3><div class="panel">' + list(rep.questions_for_architect) + '<div class="row"><button type="button" class="btn ghost sm" id="copy-q">Copy as text</button></div></div>';
    var obs = []; (rv.perSheet || []).forEach(function (s) { (s.other_observations || []).forEach(function (t) { obs.push(s.name + ": " + t); }); (s.missing_on_sheet || []).forEach(function (t) { obs.push(s.name + ": missing " + t); }); if (s.error) obs.push(s.name + ": not reviewed. " + s.error); });
    if (obs.length) html += '<h3>Other observations per sheet</h3><div class="panel">' + list(obs) + "</div>";
    $("#report").innerHTML = html + "</div>";
    var cq = $("#copy-q"); if (cq) cq.onclick = function () {
      var txt = rep.questions_for_architect.map(function (q, i) { return (i + 1) + ". " + q; }).join("\n");
      navigator.clipboard.writeText(txt).then(function () { cq.textContent = "Copied"; }).catch(function () { cq.textContent = "Select the list and copy it manually"; });
    };
  }
  $("#report").addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-fb]"); if (!b) return;
    var box = b.closest(".fb"), note = $("input", box).value.trim();
    var l = { rule: box.dataset.rule, said: box.dataset.said, right: b.dataset.fb === "1", note: note, at: new Date().toISOString() };
    $$("button", box).forEach(function (x) { x.disabled = true; });
    if (!db) { lessons.unshift(l); renderLessons(); box.insertAdjacentHTML("beforeend", '<span class="small">Kept for this visit only.</span>'); return; }
    db.collection("lessons").add(l).then(function () { box.insertAdjacentHTML("beforeend", '<span class="small">Saved. Later reviews will use it.</span>'); })
      .catch(function () { $$("button", box).forEach(function (x) { x.disabled = false; }); box.insertAdjacentHTML("beforeend", '<span class="small">Could not save. You may have view-only access.</span>'); });
  });
  function renderLessons() {
    $("#lessons").innerHTML = lessons.length ? "<ul>" + lessons.slice(0, 40).map(function (l) { var r = RULE[l.rule]; return "<li><b>" + esc(r ? r.title : l.rule) + "</b>: checker said " + esc((ST[l.said] || [0, l.said])[1]) + ", marked " + (l.right ? "right" : "wrong") + (l.note ? ". " + esc(l.note) : "") + "</li>"; }).join("") + "</ul>" : "No corrections recorded yet.";
  }
  var saved = [];
  function saveReview(rv) {
    if (!db) return;
    var doc = JSON.parse(JSON.stringify(rv));
    db.collection("reviews").doc(rv.id).set(doc).catch(function () { log("The review could not be saved to the shared list (view-only access or store unavailable)."); });
  }
  function renderSaved() {
    $("#saved").innerHTML = saved.length ? '<div class="tw"><table><thead><tr><th>Project</th><th>When</th><th>Sheets</th><th>Not comply</th><th></th></tr></thead><tbody>' + saved.map(function (r, i) {
      var nc = ((r.report && r.report.findings) || []).filter(function (x) { return x.status === "non_comply"; }).length;
      return "<tr><td>" + esc((r.facts && r.facts.name) || "Untitled project") + "</td><td>" + esc(new Date(r.at).toLocaleString("en-SG")) + '</td><td class="num">' + ((r.sheets || []).length) + '</td><td class="num">' + nc + '</td><td><button type="button" class="btn ghost sm" data-open="' + i + '">Open</button></td></tr>'; }).join("") + "</tbody></table></div>" : "No saved reviews yet. A review is saved here when it finishes, so the team can reopen it.";
  }
  $("#saved").addEventListener("click", function (ev) { var b = ev.target.closest("[data-open]"); if (!b) return; current = saved[+b.dataset.open]; renderReport(current); $("#report").scrollIntoView({ behavior: "smooth" }); });

  function initChecker() {
    $("#facts-form").innerHTML = formHtml(D.facts, store("bp.facts") || {}, "fact-");
    $("#f-notes").value = (store("bp.facts") || {}).notes || "";
    $("#facts-form").oninput = renderPathway; $("#f-notes").oninput = renderPathway; renderPathway();
    $("#rv-scope").innerHTML = D.scopes.map(function (s) { return '<option value="' + s.id + '">' + esc(s.label) + " (" + rulesFor(s.id).length + " rules)</option>"; }).join("");
    var drop = $("#drop"), file = $("#file");
    drop.onclick = function () { file.click(); };
    drop.onkeydown = function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); file.click(); } };
    file.onchange = function () { addFiles(file.files).then(function () { file.value = ""; }); };
    ["dragenter", "dragover"].forEach(function (t) { drop.addEventListener(t, function (e) { e.preventDefault(); drop.classList.add("over"); }); });
    ["dragleave", "drop"].forEach(function (t) { drop.addEventListener(t, function (e) { e.preventDefault(); drop.classList.remove("over"); }); });
    drop.addEventListener("drop", function (e) { if (e.dataTransfer && e.dataTransfer.files) addFiles(e.dataTransfer.files); });
    var toggle = function (ev) { var t = ev.target.closest(".thumb"); if (!t) return; if (ev.type === "keydown" && ev.key !== " " && ev.key !== "Enter") return; ev.preventDefault(); sheets[+t.dataset.i].selected = !sheets[+t.dataset.i].selected; renderThumbs(); };
    $("#thumbs").addEventListener("click", toggle); $("#thumbs").addEventListener("keydown", toggle);
    $("#sel-all").onclick = function () { sheets.forEach(function (s) { s.selected = true; }); renderThumbs(); };
    $("#sel-none").onclick = function () { sheets.forEach(function (s) { s.selected = false; }); renderThumbs(); };
    $("#files-clear").onclick = function () { sheets = []; renderThumbs(); };
    $("#rv-run").onclick = runReview;
    $("#rv-stop").onclick = function () { if (runCtl) runCtl.abort(); };
    renderThumbs();
  }

  /* ---------- routing + boot ---------- */
  var VIEWS = ["guide", "search", "who", "process", "fees", "check", "playbook"];
  window.BPAPP = { refresh: function () { renderProcess(); renderFees(); }, search: search, entryHtml: entryHtml, setQuery: function (q) { $("#q").value = q; $("#ask-panel").hidden = true; renderSearch(); } };
  function route() {
    var v = (location.hash || "").replace("#", ""); if (VIEWS.indexOf(v) < 0) v = "guide";
    VIEWS.forEach(function (n) { $("#v-" + n).hidden = n !== v; });
    $$("#nav a").forEach(function (a) { if (a.getAttribute("href") === "#" + v) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", route);

  var agencies = []; ALL.forEach(function (e) { if (e.agency && agencies.indexOf(e.agency) < 0) agencies.push(e.agency); });
  var kindsPresent = Object.keys(KIND).filter(function (k) { return ALL.some(function (e) { return e.kind === k; }); });
  chips($("#kind-chips"), kindsPresent.map(function (k) { return { v: k, l: KIND[k] }; }), fKinds, renderSearch);
  chips($("#agency-chips"), agencies.map(function (a) { return { v: a, l: a }; }), fAgencies, renderSearch);
  $("#q").addEventListener("input", function () { $("#ask-panel").hidden = true; renderSearch(); });
  $("#q").addEventListener("keydown", function (e) { if (e.key === "Enter" && sample) askAI(); });
  $("#ask-btn").onclick = askAI;
  renderSearch(); renderWho(); renderProcess(); renderFees(); renderPlaybook(); initChecker(); route();
  $("#foot").innerHTML = esc(D.meta.note) + " Rules last compiled " + esc(D.meta.asOf) + ". " + ALL.filter(function (e) { return !e.internal && e.status === "verified"; }).length + " entries verified against a primary source, " + ALL.filter(function (e) { return !e.internal && e.status === "web"; }).length + " read from the official web page, " + ALL.filter(function (e) { return !e.internal && e.status === "unverified"; }).length + " not yet verified.";

  if (window.pdfjsLib && window.pdfjsLib.GlobalWorkerOptions) { try { window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"; } catch (e) {} }

  var C = window.claude;
  if (C && C.use) {
    C.use("sample").then(function (s) {
      if (!s) { $("#ai-off").hidden = false; return; }
      sample = s; $("#ask-btn").hidden = false;
      return s.limits().catch(function () { return null; }).then(function (lim) {
        maxImages = lim && lim.images ? lim.images.maxCount : 0;
        aiReady = maxImages > 0; if (!aiReady) $("#ai-off").hidden = false; renderThumbs();
      });
    });
    C.use("db").then(function (d) {
      if (!d) return; db = d;
      d.collection("lessons").orderBy("at", "desc").limit(60).onSnapshot(function (snap) { lessons = snap.docs.map(function (x) { return x.data(); }); renderLessons(); }, function () {});
      d.collection("reviews").orderBy("at", "desc").limit(30).onSnapshot(function (snap) { saved = snap.docs.map(function (x) { return x.data(); }); renderSaved(); }, function () {});
    });
  } else { $("#ai-off").hidden = false; }
})();
