/* DWG and DXF reader for the drawing check. Parses the file in the browser with LibreDWG (WebAssembly, loaded on first use),
   then draws each paper layout (title block plus its viewports onto model space) to a canvas in black on white.
   Not a plot: no plot styles, lineweights, hatch patterns or CAD fonts. Good enough to read a sheet. */
(function () {
  "use strict";
  var CDN = "https://cdn.jsdelivr.net/npm/@mlightcad/libredwg-web@0.8.9/", mod = null;
  function load() { if (!mod) mod = import(CDN + "dist/libredwg-web.js").catch(function (e) { mod = null; throw e; }); return mod; }

  function mul(m, n) { return [m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1], m[0] * n[2] + m[2] * n[3], m[1] * n[2] + m[3] * n[3], m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5]]; }
  function ap(m, x, y) { return [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]]; }
  function sc(m) { return Math.sqrt(Math.abs(m[0] * m[3] - m[1] * m[2])) || 0; }
  function num(v, d) { return typeof v === "number" && isFinite(v) ? v : d; }

  function clean(s) {
    return String(s == null ? "" : s).replace(/%%d/gi, "°").replace(/%%p/gi, "±").replace(/%%c/gi, "⌀").replace(/%%[uok]/gi, "").replace(/%%v/gi, " ").replace(/%%%/g, "%");
  }
  function mtextLines(s) {
    s = String(s == null ? "" : s).replace(/\\S([^;^#\/]*)[\^#\/]([^;]*);/g, "$1/$2").replace(/\\P/g, "\n").replace(/\\~/g, " ")
      .replace(/\\[fFHWCTQAp][^;\\]*;/g, "").replace(/\\[LlOoKk]/g, "").replace(/\\U\+([0-9A-Fa-f]{4})/g, function (_, h) { return String.fromCharCode(parseInt(h, 16)); })
      .replace(/\\([\\{}])/g, "\u0001$1").replace(/[{}]/g, "").replace(/\u0001/g, "");
    return clean(s).split("\n");
  }

  function Doc(db) {
    var blocks = {}, byHandle = {}, layers = {};
    (db.tables.BLOCK_RECORD.entries || []).forEach(function (b) { blocks[b.name] = b; byHandle[b.handle] = b; });
    (db.tables.LAYER.entries || []).forEach(function (l) { layers[l.name] = l; });
    this.db = db; this.blocks = blocks; this.byHandle = byHandle; this.layers = layers;
  }
  Doc.prototype.hidden = function (e) {
    if (e.isVisible === false) return true;
    var l = this.layers[e.layer]; return !!l && (l.off || l.frozen || l.plotFlag === 0);
  };
  /* out: { poly(pts, closed, fill), text(x, y, angle, hpx, str, align, base, xs, maxw) } in device coordinates */
  Doc.prototype.draw = function (ents, m, out, depth) {
    var self = this, k = sc(m);
    function P(p) { return ap(m, p.x, p.y); }
    function arc(cx, cy, rx, ry, rot, a0, a1, flip) {
      if (a1 <= a0) a1 += Math.PI * 2;
      var n = Math.max(8, Math.min(96, Math.ceil((a1 - a0) * Math.sqrt(Math.max(rx, ry) * k) / 2 + 4))), pts = [], cr = Math.cos(rot), sr = Math.sin(rot);
      for (var i = 0; i <= n; i++) { var a = a0 + (a1 - a0) * i / n, x = rx * Math.cos(a), y = ry * Math.sin(a), X = cx + x * cr - y * sr, Y = cy + x * sr + y * cr; pts.push(ap(m, flip ? -X : X, Y)); }
      return pts;
    }
    function verts(vs, closed) {
      var pts = [], n = vs.length;
      for (var i = 0; i < n; i++) {
        var a = vs[i]; pts.push(ap(m, a.x, a.y));
        var b = vs[(i + 1) % n], bl = a.bulge;
        if (bl && (i < n - 1 || closed)) {
          var dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy); if (!d) continue;
          var th = 4 * Math.atan(bl), r = d / (2 * Math.sin(th / 2)), h = r * Math.cos(th / 2), cx = (a.x + b.x) / 2 - dy / d * h, cy = (a.y + b.y) / 2 + dx / d * h;
          var a1 = Math.atan2(a.y - cy, a.x - cx), ns = Math.max(4, Math.ceil(Math.abs(th) / (Math.PI / 16)));
          for (var j = 1; j < ns; j++) { var t = a1 + th * j / ns; pts.push(ap(m, cx + Math.abs(r) * Math.cos(t), cy + Math.abs(r) * Math.sin(t))); }
        }
      }
      return pts;
    }
    function ang(rot) { var c = Math.cos(rot), s = Math.sin(rot); return Math.atan2(m[1] * c + m[3] * s, m[0] * c + m[2] * s); }
    function text(t) {
      var str = clean(t.text); if (!str || !str.trim()) return;
      var h = num(t.textHeight, 0) * k, ha = t.halign | 0, va = t.valign | 0, useEnd = (ha || va) && ha !== 3 && ha !== 5 && t.endPoint && (t.endPoint.x || t.endPoint.y);
      var p = P(useEnd ? t.endPoint : t.startPoint);
      out.text(p[0], p[1], ang(num(t.rotation, 0)), h, str, ha === 1 || ha === 4 ? "center" : ha === 2 ? "right" : "left", ha === 4 || va === 2 ? "middle" : va === 3 ? "top" : va === 1 ? "bottom" : "alphabetic", num(t.xScale, 1) || 1, 0);
    }
    (ents || []).forEach(function (e) {
      if (self.hidden(e)) return;
      var flip = e.extrusionDirection && e.extrusionDirection.z < 0;
      switch (e.type) {
        case "LINE": out.poly([P(e.startPoint), P(e.endPoint)], false, false); break;
        case "LWPOLYLINE": case "POLYLINE": case "POLYLINE2D": case "POLYLINE_2D":
          if (e.vertices && e.vertices.length > 1) { var cl = !!((e.flag | 0) & 1); out.poly(verts(e.vertices, cl), cl, false); } break;
        case "LEADER": if (e.vertices && e.vertices.length > 1) out.poly(e.vertices.map(P), false, false); break;
        case "CIRCLE": out.poly(arc(e.center.x, e.center.y, e.radius, e.radius, 0, 0, Math.PI * 2, flip), true, false); break;
        case "ARC": out.poly(arc(e.center.x, e.center.y, e.radius, e.radius, 0, e.startAngle, e.endAngle, flip), false, false); break;
        case "ELLIPSE":
          var mj = e.majorAxisEndPoint, rx = Math.hypot(mj.x, mj.y), s0 = num(e.startAngle, 0), s1 = num(e.endAngle, Math.PI * 2);
          if (rx) out.poly(arc(e.center.x, e.center.y, rx, rx * num(e.axisRatio, 1), Math.atan2(mj.y, mj.x), s0, s1, false), Math.abs(s1 - s0 - Math.PI * 2) < 1e-6, false);
          break;
        case "SPLINE":
          var sp = e.fitPoints && e.fitPoints.length > 1 ? e.fitPoints : e.controlPoints; if (sp && sp.length > 1) out.poly(sp.map(P), false, false); break;
        case "SOLID": case "TRACE":
          var c = [e.corner1, e.corner2, e.corner4 || e.corner3, e.corner3].filter(Boolean); if (c.length > 2) out.poly(c.map(P), true, true); break;
        case "HATCH":
          if (e.solidFill) (e.boundaryPaths || []).forEach(function (b) { if (b.vertices && b.vertices.length > 2) out.poly(verts(b.vertices, true), true, true); });
          break;
        case "TEXT": text(e); break;
        case "ATTRIB": if (e.text && typeof e.text === "object" && !((e.flags | 0) & 1)) text(e.text); break;
        case "MTEXT":
          var lines = mtextLines(e.text); if (!lines.join("").trim()) break;
          var ip = P(e.insertionPoint), d = e.direction && (e.direction.x || e.direction.y) ? Math.atan2(e.direction.y, e.direction.x) : num(e.rotation, 0), at = (e.attachmentPoint | 0) || 1;
          out.text(ip[0], ip[1], ang(d), num(e.textHeight, 0) * k, lines, ["left", "center", "right"][(at - 1) % 3], ["top", "middle", "bottom"][Math.floor((at - 1) / 3)] || "top", 1, num(e.rectWidth, 0) * k);
          break;
        case "INSERT":
          var b = self.blocks[e.name];
          if (b && depth < 10) {
            var r = num(e.rotation, 0), cr = Math.cos(r), sr = Math.sin(r), sx = num(e.xScale, 1) || 1, sy = num(e.yScale, 1) || 1, bp = b.basePoint || { x: 0, y: 0 }, ix = flip ? -e.insertionPoint.x : e.insertionPoint.x;
            var local = mul([cr * sx, sr * sx, -sr * sy, cr * sy, ix, e.insertionPoint.y], [1, 0, 0, 1, -num(bp.x, 0), -num(bp.y, 0)]);
            if (flip) local = mul([-1, 0, 0, 1, 0, 0], mul([1, 0, 0, 1, -2 * ix, 0], local));
            var nc = Math.max(1, e.columnCount | 0), nr = Math.max(1, e.rowCount | 0);
            for (var ci = 0; ci < Math.min(nc, 50); ci++) for (var ri = 0; ri < Math.min(nr, 50); ri++)
              self.draw(b.entities, mul(m, ci || ri ? mul([1, 0, 0, 1, (ci * num(e.columnSpacing, 0)) * cr - (ri * num(e.rowSpacing, 0)) * sr, (ci * num(e.columnSpacing, 0)) * sr + (ri * num(e.rowSpacing, 0)) * cr], local) : local), out, depth + 1);
          }
          if (e.attribs) self.draw(e.attribs, m, out, depth + 1);
          break;
        case "DIMENSION": var db2 = self.blocks[e.name]; if (db2 && depth < 10) self.draw(db2.entities, m, out, depth + 1); break;
        case "ACAD_TABLE": var tb = self.byHandle[e.blockRecordHandle] || self.blocks[e.name]; if (tb && depth < 10 && e.startPoint) self.draw(tb.entities, mul(m, [1, 0, 0, 1, e.startPoint.x, e.startPoint.y]), out, depth + 1); break;
      }
    });
  };

  function collector() {
    var xs = [], ys = [];
    return { xs: xs, ys: ys, poly: function (p) { for (var i = 0; i < p.length; i += Math.max(1, Math.floor(p.length / 6))) { xs.push(p[i][0]); ys.push(p[i][1]); } }, text: function (x, y) { xs.push(x); ys.push(y); } };
  }
  function box(c, lo, hi) {
    if (!c.xs.length) return null;
    var x = c.xs.slice().sort(function (a, b) { return a - b; }), y = c.ys.slice().sort(function (a, b) { return a - b; }), q = function (a, f) { return a[Math.round((a.length - 1) * f)]; };
    return [q(x, lo), q(y, lo), q(x, hi), q(y, hi)];
  }
  function painter(g, lw, texts) {
    return {
      poly: function (p, closed, fill) {
        if (p.length < 2) return; g.beginPath(); g.moveTo(p[0][0], p[0][1]); for (var i = 1; i < p.length; i++) g.lineTo(p[i][0], p[i][1]);
        if (closed) g.closePath(); if (fill) { g.fillStyle = "rgba(0,0,0,.10)"; g.fill(); } g.lineWidth = lw; g.stroke();
      },
      text: function (x, y, a, h, str, align, base, xs, maxw) {
        var lines = Array.isArray(str) ? str : [str]; if (texts) texts.push(lines.join(" "));
        if (h < 2.2 || h > 4000) return;
        g.save(); g.translate(x, y); g.rotate(a); g.scale(xs, 1); g.font = h * 1.18 + "px Arial, Helvetica, sans-serif"; g.fillStyle = "#000"; g.textAlign = align;
        if (lines.length === 1 && !maxw) { g.textBaseline = base; g.fillText(lines[0], 0, 0); g.restore(); return; }
        var wrapped = [];
        lines.forEach(function (ln) {
          if (!maxw || g.measureText(ln).width <= maxw * 1.02) { wrapped.push(ln); return; }
          var cur = ""; ln.split(/(\s+)/).forEach(function (w) { if (cur && g.measureText(cur + w).width > maxw) { wrapped.push(cur.trim()); cur = w.trim() ? w : ""; } else cur += w; }); if (cur.trim()) wrapped.push(cur.trim());
        });
        var lh = h * 1.6, H = wrapped.length * lh, y0 = base === "middle" ? -H / 2 : base === "bottom" ? -H : 0; g.textBaseline = "top";
        wrapped.forEach(function (ln, i) { g.fillText(ln, 0, y0 + i * lh); }); g.restore();
      }
    };
  }

  function sheetsOf(doc, name) {
    var out = [], model = doc.blocks["*Model_Space"] || doc.blocks["*MODEL_SPACE"], ment = model ? model.entities : [];
    ((doc.db.objects && doc.db.objects.LAYOUT) || []).forEach(function (lay) {
      var b = doc.byHandle[lay.paperSpaceTableId]; if (!b || !b.entities || /^model$/i.test(lay.layoutName || "")) return;
      var vps = b.entities.filter(function (e) { return e.type === "VIEWPORT" && e.handle !== lay.viewportId && e.viewportId !== 1 && e.status !== 0 && e.viewHeight > 0 && e.height > 0 && e.width > 0; });
      var rest = b.entities.filter(function (e) { return e.type !== "VIEWPORT"; });
      if (!rest.length && !vps.length) return;
      var c = collector(); doc.draw(rest, [1, 0, 0, 1, 0, 0], c, 0);
      var bb = box(c, 0.002, 0.998) || [Infinity, Infinity, -Infinity, -Infinity];
      vps.forEach(function (v) { bb = [Math.min(bb[0], v.viewportCenter.x - v.width / 2), Math.min(bb[1], v.viewportCenter.y - v.height / 2), Math.max(bb[2], v.viewportCenter.x + v.width / 2), Math.max(bb[3], v.viewportCenter.y + v.height / 2)]; });
      if (!isFinite(bb[0]) || bb[2] - bb[0] <= 0 || bb[3] - bb[1] <= 0) return;
      out.push({ name: name + " [" + (lay.layoutName || "layout") + "]", bb: bb, paper: rest, vps: vps, order: lay.tabOrder | 0 });
    });
    out.sort(function (a, b) { return a.order - b.order; });
    if (!out.length && ment.length) {
      var c2 = collector(); doc.draw(ment, [1, 0, 0, 1, 0, 0], c2, 0); var mb = box(c2, 0.01, 0.99);
      if (mb && mb[2] > mb[0] && mb[3] > mb[1]) out.push({ name: name + " [model]", bb: mb, paper: ment, vps: [] });
    }
    return out.map(function (s) {
      var pad = Math.max(s.bb[2] - s.bb[0], s.bb[3] - s.bb[1]) * 0.012, x0 = s.bb[0] - pad, y0 = s.bb[1] - pad, x1 = s.bb[2] + pad, y1 = s.bb[3] + pad;
      function render(edge, texts) {
        var k = edge / Math.max(x1 - x0, y1 - y0), cv = document.createElement("canvas"); cv.width = Math.max(1, Math.round((x1 - x0) * k)); cv.height = Math.max(1, Math.round((y1 - y0) * k));
        var g = cv.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, cv.width, cv.height); g.strokeStyle = "#000"; g.lineJoin = "round";
        var base = [k, 0, 0, -k, -x0 * k, y1 * k], pen = painter(g, Math.max(0.7, edge / 3600), texts);
        s.vps.forEach(function (v) {
          var f = v.height / v.viewHeight, tw = num(v.twistAngle, 0), ct = Math.cos(tw), st = Math.sin(tw), dc = v.displayCenter || { x: 0, y: 0 }, tp = v.targetPoint || { x: 0, y: 0 };
          var vm = mul(base, mul([f * ct, f * st, -f * st, f * ct, v.viewportCenter.x, v.viewportCenter.y], mul([1, 0, 0, 1, -dc.x, -dc.y], [1, 0, 0, 1, -num(tp.x, 0), -num(tp.y, 0)])));
          var a = ap(base, v.viewportCenter.x - v.width / 2, v.viewportCenter.y + v.height / 2);
          g.save(); g.beginPath(); g.rect(a[0], a[1], v.width * k, v.height * k); g.clip(); doc.draw(ment, vm, pen, 0); g.restore();
        });
        doc.draw(s.paper, base, pen, 0);
        return cv;
      }
      var texts = [], thumb = render(420, texts), seen = {}, uniq = texts.filter(function (t) { t = t.trim(); if (!t || seen[t]) return false; seen[t] = 1; return true; });
      return { name: s.name, thumb: thumb, text: uniq.join(" ").replace(/\s+/g, " ").slice(0, 60000), draw: function (edge) { return render(edge, null); } };
    });
  }

  window.BPDWG = {
    /* file: File. Resolves to [{ name, thumb: canvas, text, draw(edge) -> canvas }] */
    read: function (file) {
      return Promise.all([load(), file.arrayBuffer()]).then(function (r) {
        var m = r[0], isDxf = /\.dxf$/i.test(file.name);
        return m.LibreDwg.create(CDN + "wasm").then(function (lib) {
          var ptr = lib.dwg_read_data(isDxf ? new TextDecoder().decode(r[1]) : r[1], isDxf ? m.Dwg_File_Type.DXF : m.Dwg_File_Type.DWG);
          if (!ptr) throw new Error("not a readable " + (isDxf ? "DXF" : "DWG") + " file");
          var db = lib.convert(ptr); try { lib.dwg_free(ptr); } catch (e) {}
          (db.tables.BLOCK_RECORD.entries || []).forEach(function (b) { b.bmpPreview = null; (b.entities || []).forEach(function (e) { if (e.binaryData) e.binaryData = null; }); });
          db.entities = null;
          var sheets = sheetsOf(new Doc(db), file.name);
          if (!sheets.length) throw new Error("nothing drawable was found in it");
          return sheets;
        });
      });
    }
  };
})();
