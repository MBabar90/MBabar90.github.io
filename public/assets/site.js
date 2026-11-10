/* Portfolio draft 1: slow, continuous motion only while on screen; everything still with reduced motion. */
(function () {
  "use strict";
  var doc = document.documentElement; doc.classList.add("js");
  if (/[?&]mark\b/.test(location.search)) doc.classList.add("show-suggest");
  var mq = matchMedia("(prefers-reduced-motion: reduce)"), still = function () { return mq.matches; };
  var $ = function (s, r) { return (r || document).querySelector(s); }, $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var hasIO = "IntersectionObserver" in window;

  var nav = $("#nav"); if (nav) addEventListener("scroll", function () { nav.classList.toggle("scrolled", scrollY > 8); }, { passive: true });

  /* reveal + play-while-visible */
  var rv = $$(".rv");
  if (!hasIO || still()) rv.forEach(function (e) { e.classList.add("in"); });
  else { var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { rootMargin: "0px 0px -8% 0px" }); rv.forEach(function (e) { io.observe(e); }); }
  var pio = hasIO ? new IntersectionObserver(function (es) { es.forEach(function (e) { e.target.classList.toggle("play", e.isIntersecting); }); }, { rootMargin: "80px 0px" }) : null;
  $$("[data-play]").forEach(function (s) { if (pio) pio.observe(s); else s.classList.add("play"); });

  /* the climber on the hero summit: one light walks the dotted trail to the flag, slowly, again and again */
  var tp = $("#climbPath"), wk = $("#walker"), wh = $("#walkerHalo");
  if (tp && wk) {
    var L = tp.getTotalLength(), run = false, t0 = null;
    var put = function (u) { var p = tp.getPointAtLength(u * L), o = Math.min(1, u / 0.06, (1 - u) / 0.06); [wk, wh].forEach(function (e) { e.setAttribute("cx", p.x); e.setAttribute("cy", p.y); e.style.opacity = o.toFixed(3); }); };
    put(0.62);
    var loop = function (now) { if (!run) return; if (t0 === null) t0 = now - 0.62 * 26000; put(((now - t0) / 26000) % 1); requestAnimationFrame(loop); };
    var host = tp.closest("[data-play]");
    if (hasIO && host) new IntersectionObserver(function (es) { var on = es[0].isIntersecting && !still(); if (on && !run) { run = true; t0 = null; requestAnimationFrame(loop); } else if (!on) run = false; }).observe(host);
  }

  /* Off the CV: switchback trail inked as you read */
  var trail = $("#trail"), notes = trail ? $$(".note", trail) : [], swB = $("#swBase"), swI = $("#swInk"), swLen = 0, swCur = 0, swGoal = 0, swRun = false;
  function pt(n) { var d = $(".dot", n); return [n.offsetLeft + d.offsetLeft + d.offsetWidth / 2, n.offsetTop + d.offsetTop + d.offsetHeight / 2]; }
  function buildTrail() {
    if (!trail || !swB) return; var d = "";
    notes.forEach(function (n, i) { var p = pt(n); if (i === 0) d = "M" + p[0] + " " + p[1]; else { var q = pt(notes[i - 1]), my = (q[1] + p[1]) / 2; d += " C" + q[0] + " " + my + " " + p[0] + " " + my + " " + p[0] + " " + p[1]; } });
    swB.setAttribute("d", d); swI.setAttribute("d", d);
    try { swLen = swI.getTotalLength(); } catch (e) { swLen = 0; }
    swI.style.strokeDasharray = swLen; paintTrail();
  }
  function paintTrail() { if (swI) swI.style.strokeDashoffset = (swLen * (1 - swCur)).toFixed(1); }
  function goalTrail() { if (!trail) return; var t = trail.getBoundingClientRect(); swGoal = still() ? 1 : Math.max(0, Math.min(1, (innerHeight * 0.65 - t.top) / t.height)); }

  /* logbook rails */
  var rails = $$(".route-wrap").map(function (w) { return { w: w, ink: $(".rail-ink", w), camps: $$(".camp", w), cur: 0, goal: 0 }; });
  function goalRails() {
    var mark = innerHeight * 0.6;
    rails.forEach(function (r) {
      var b = r.w.getBoundingClientRect(); r.goal = still() ? b.height : Math.max(0, Math.min(b.height, mark - b.top));
      r.camps.forEach(function (c, i) {
        var hit = still() || $(".pin", c).getBoundingClientRect().top < mark, last = i === r.camps.length - 1 && r.w.hasAttribute("data-now");
        c.classList.toggle("reached", hit && !last); c.classList.toggle("now", hit && last);
      });
    });
  }
  var anim = false;
  function step() {
    var moving = false;
    swCur += (swGoal - swCur) * 0.1; if (Math.abs(swGoal - swCur) > 0.001) moving = true; else swCur = swGoal; paintTrail();
    rails.forEach(function (r) { r.cur += (r.goal - r.cur) * 0.1; if (Math.abs(r.goal - r.cur) > 0.5) moving = true; else r.cur = r.goal; if (r.ink) r.ink.setAttribute("y2", r.cur.toFixed(1)); });
    if (moving) requestAnimationFrame(step); else anim = false;
  }
  function onScroll() { goalTrail(); goalRails(); if (still()) { swCur = swGoal; rails.forEach(function (r) { r.cur = r.goal; if (r.ink) r.ink.setAttribute("y2", r.cur); }); paintTrail(); return; } if (!anim) { anim = true; requestAnimationFrame(step); } }
  buildTrail(); onScroll();
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", function () { buildTrail(); onScroll(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { buildTrail(); onScroll(); });

  /* count-up figures and .watch elements */
  var fmt = function (n) { return n.toLocaleString("en-US"); };
  var cio = hasIO && !still() ? new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return; cio.unobserve(e.target);
      if (e.target.classList.contains("watch")) { e.target.classList.add("seen"); return; }
      var el = e.target, n = +el.dataset.n, pre = el.dataset.pre || "", suf = el.dataset.suf || "", s0 = null;
      var f = function (t) { s0 = s0 || t; var p = Math.min(1, (t - s0) / 1400), v = Math.round(n * (1 - Math.pow(1 - p, 3))); el.textContent = pre + fmt(v) + suf; if (p < 1) requestAnimationFrame(f); };
      requestAnimationFrame(f);
    });
  }, { threshold: 0.35 }) : null;
  if (cio) { $$("[data-n]").forEach(function (el) { cio.observe(el); }); $$(".watch").forEach(function (el) { cio.observe(el); }); }
  else $$(".watch").forEach(function (el) { el.classList.add("seen"); });

  /* copy email */
  var copy = $("#copy");
  if (copy) copy.addEventListener("click", function () {
    var b = this, el = $("#mail");
    var ok = function () { b.textContent = "Copied"; setTimeout(function () { b.textContent = "Copy"; }, 1600); };
    var sel = function () { var r = document.createRange(); r.selectNodeContents(el); var s = getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent = "Selected"; };
    try { navigator.clipboard.writeText(el.textContent).then(ok, sel); } catch (e) { sel(); }
  });
})();
