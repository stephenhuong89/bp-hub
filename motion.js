/* Motion layer (Motion One). Everything rests in its final state: if the library is blocked, the viewer prefers
   reduced motion, or the page is not being painted, nothing here runs and the page is complete as it stands. */
(function () {
  "use strict";
  var M = window.Motion;
  if (!M || !M.animate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var seen = new WeakSet(), EASE = [0.2, 0.8, 0.2, 1], SPRING = M.spring ? M.spring({ stiffness: 260, damping: 18 }) : EASE;
  function run(target, kf, opt) {
    var a = M.animate(target, kf, opt), ms = ((opt && opt.duration || 0.3) + (opt && opt.delay || 0)) * 1000 + 450;
    setTimeout(function () { try { a.finish(); } catch (e) {} }, ms);
    return a;
  }
  function all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function fresh(els) { return els.filter(function (el) { if (seen.has(el)) return false; seen.add(el); return true; }); }
  function onView(el, fn) { if (M.inView) M.inView(el, function () { fn(); }, { margin: "0px 0px -8% 0px" }); else fn(); }
  function idx(el) { var i = 0, p = el; while ((p = p.previousElementSibling)) i++; return i; }

  function rise(el) { onView(el, function () { run(el, { opacity: [0, 1], transform: ["translateY(22px)", "translateY(0)"] }, { duration: 0.55, delay: Math.min(idx(el), 7) * 0.06, easing: EASE }); }); }
  function pop(el, delay) { run(el, { transform: ["scale(0)", "scale(1)"], opacity: [0, 1] }, { duration: 0.6, delay: delay || 0, easing: SPRING }); }
  function grow(el, axis, delay) { el.style.transformOrigin = axis === "Y" ? "50% 100%" : "0 50%"; run(el, { transform: ["scale" + axis + "(0)", "scale" + axis + "(1)"] }, { duration: 0.8, delay: delay || 0, easing: EASE }); }
  function draw(el, delay, dur) {
    var len = 0; try { len = el.getTotalLength(); } catch (e) { return; } if (!len) return;
    var keep = el.style.strokeDasharray; el.style.strokeDasharray = len + " " + len;
    run(el, { strokeDashoffset: [len, 0] }, { duration: dur || 0.9, delay: delay || 0, easing: "ease-in-out" }).finished.then(function () { el.style.strokeDasharray = keep; el.style.strokeDashoffset = ""; }).catch(function () { el.style.strokeDasharray = keep; });
  }
  function count(el) {
    var txt = el.firstChild && el.firstChild.nodeType === 3 ? el.firstChild.nodeValue : null; if (!txt) return;
    var m = txt.match(/^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/); if (!m || /[×:½]/.test(txt)) return;
    var end = parseFloat(m[2].replace(/,/g, "")), dec = (m[2].split(".")[1] || "").length; if (!(end > 0) || (/^\d{4}$/.test(m[2]) && end > 1800 && end < 2100)) return;
    onView(el, function () { run(function (p) { el.firstChild.nodeValue = m[1] + (end * p).toLocaleString("en-SG", { minimumFractionDigits: dec, maximumFractionDigits: dec }) + m[3]; }, { duration: 1.1, easing: "ease-out" }); });
  }
  function words(h) {
    if (h.dataset.split) return; h.dataset.split = "1";
    h.innerHTML = h.textContent.split(" ").map(function (w) { return '<span class="w">' + w + "</span>"; }).join(" ");
    all(".w", h).forEach(function (w, i) { run(w, { opacity: [0, 1], transform: ["translateY(0.6em) rotate(4deg)", "translateY(0) rotate(0deg)"] }, { duration: 0.6, delay: 0.08 + i * 0.045, easing: EASE }); });
  }

  function scan() {
    fresh(all(".tile, .numcard, .quote, .tl li, .frame, .cost, .bucket, .pbcol, .ex, .alsoc, .navcard, .st > h2, .panel, .step, .sheet, .gatebox")).forEach(rise);
    fresh(all(".tile b, .cost b")).forEach(count);
    fresh(all(".hb-row")).forEach(function (r, i) { onView(r, function () { var b = r.querySelector(".hb-t i"); if (b) grow(b, "X", (idx(r) % 10) * 0.05); }); });
    fresh(all(".dz-row")).forEach(function (r) { onView(r, function () { var b = r.querySelector(".dz-t i"); if (b) grow(b, "X", 0.05); }); });
    fresh(all(".col-b")).forEach(function (c) { onView(c, function () { var b = c.querySelector("i"); if (b) grow(b, "Y", idx(c) * 0.05); }); });
    fresh(all(".bub")).forEach(function (s) { onView(s, function () { all(".bb circle", s).forEach(function (c, i) { pop(c, i * 0.05); }); }); });
    fresh(all(".flow")).forEach(function (s) { onView(s, function () { all(".fq", s).forEach(function (r, i) { pop(r, i * 0.25); }); all(".fa", s).forEach(function (l, i) { draw(l, 0.25 + i * 0.15, 0.5); }); all(".fr", s).forEach(function (r, i) { pop(r, 0.6 + i * 0.15); }); }); });
    fresh(all(".gates")).forEach(function (s) { onView(s, function () { all(".gl", s).forEach(function (l, i) { draw(l, i * 0.025, 0.7); }); }); });
    fresh(all(".gantt")).forEach(function (s) { onView(s, function () { all(".gb", s).forEach(function (b, i) { grow(b, "X", i * 0.07); }); }); });
    fresh(all(".road")).forEach(function (s) {
      var box = document.getElementById("playbook"); if (box.dataset.drawn) return; box.dataset.drawn = "1";
      onView(s, function () { all(".rd", s).forEach(function (p) { draw(p, 0, 1.4); }); all(".stn circle", s).forEach(function (c, i) { pop(c, 0.15 + i * 0.16); }); });
    });
    fresh(all(".hero h1")).forEach(words);
    fresh(all(".pic")).forEach(function (s) { all(".pb, .pok", s).forEach(function (p, i) { draw(p, 0.35 + i * 0.1, 0.6); }); });
  }

  function boot() {
    document.documentElement.classList.add("mo");
    var bar = document.createElement("div"); bar.className = "progress"; document.body.appendChild(bar);
    if (M.scroll) M.scroll(M.animate(bar, { transform: ["scaleX(0)", "scaleX(1)"] }, { easing: "linear" }));
    scan();
    var t; new MutationObserver(function () { clearTimeout(t); t = setTimeout(scan, 30); }).observe(document.querySelector("main"), { childList: true, subtree: true, attributes: true, attributeFilter: ["hidden"] });
    window.addEventListener("hashchange", function () { var v = document.querySelector(".view:not([hidden])"); if (v) run(v, { transform: ["translateY(14px)", "translateY(0)"] }, { duration: 0.35, easing: EASE }); });
  }
  /* only start once the page is actually being painted, so nothing can be left mid-animation */
  requestAnimationFrame(function () { requestAnimationFrame(boot); });
})();
