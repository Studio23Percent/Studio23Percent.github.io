/* 23% — home page */
(function () {
  var S = window.S23;
  var el = S.el, reduce = S.reduce, fine = S.fine;
  var stage = document.getElementById("stage");

  /* ---------- Game cartridges ---------- */
  var carts = document.getElementById("carts");
  S.games.forEach(function (g, i) {
    var a = el("a", "cart");
    a.href = S.fixHref(g.page);
    a.style.setProperty("--c1", g.colors.accent);
    a.style.setProperty("--c2", g.colors.accent2);
    a.style.setProperty("--cink", g.colors.bg);

    var body = el("span", "cart-body");
    body.append(el("span", "cart-title", g.title), el("span", "cart-tag", g.tagline));
    var go = el("span", "cart-go");
    go.append(el("span", null, "▸ Enter"), el("span", null, g.platforms || ""));
    a.append(el("span", "cart-num", String(i + 1).padStart(2, "0")), S.iconTile(g, "", "cart-icon"), body, go);

    function tint() { stage.style.setProperty("--liquid", g.colors.accent); }
    function untint() { stage.style.removeProperty("--liquid"); }
    a.addEventListener("mouseenter", tint);
    a.addEventListener("focus", tint);
    a.addEventListener("mouseleave", untint);
    a.addEventListener("blur", untint);

    a.addEventListener("click", function (e) {
      if (!S.isPlainClick(e)) return;
      e.preventDefault();
      var p = S.clickPoint(e, a);
      S.wipeTo(a.getAttribute("href"), g.colors.accent, p[0], p[1]);
    });

    if (fine && !reduce) {
      a.addEventListener("mousemove", function (e) {
        var r = a.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        a.style.setProperty("--ry", (px * 14).toFixed(2) + "deg");
        a.style.setProperty("--rx", (-py * 14).toFixed(2) + "deg");
      });
      a.addEventListener("mouseleave", function () {
        a.style.removeProperty("--rx");
        a.style.removeProperty("--ry");
      });
    }
    carts.append(a);
  });
  document.getElementById("count").textContent = String(S.games.length).padStart(2, "0");

  /* ---------- Liquid "23%" ---------- */
  var wave = document.getElementById("wave");
  var mark = document.getElementById("mark");
  var BASE = 330, TOP = 52;               // glyph baseline / top in viewBox units
  var level = reduce ? 23 : 0, target = 23;
  var phase = 0, amp = 7, ampTarget = 7, shown = -1;

  function wavePath(lv) {
    var y0 = BASE - (BASE - TOP) * lv / 100;
    var d = "M-20 400";
    for (var x = -20; x <= 1020; x += 20) {
      var y = y0 + Math.sin(x * 0.0157 + phase) * amp + Math.sin(x * 0.0081 - phase * 1.6) * amp * 0.6;
      d += "L" + x + " " + y.toFixed(1);
    }
    return d + "L1020 400Z";
  }

  
  var lastT = performance.now();
  function frame(t) {
    var dt = Math.min(50, t - lastT) / 16.67;
    lastT = t;
    level += (target - level) * 0.045 * dt;
    ampTarget += (7 - ampTarget) * 0.03 * dt;
    amp += (ampTarget - amp) * 0.08 * dt;
    phase += 0.035 * dt;
    wave.setAttribute("d", wavePath(level));
    requestAnimationFrame(frame);
  }

  if (reduce) {
    wave.setAttribute("d", wavePath(23));
  } else {
    requestAnimationFrame(frame);
  }

  /* Easter egg: click the mark and we "try" 100% */
  var busy = false;
  mark.addEventListener("click", function () {
    if (reduce || busy) return;
    busy = true;
    target = 100; ampTarget = 22;
    setTimeout(function () { target = 23; ampTarget = 26; }, 1300);
    setTimeout(function () { busy = false; }, 4200);
  });

  /* ---------- Dot field + coordinates ---------- */
  var cv = document.getElementById("dots");
  var ctx = cv.getContext("2d");
  var GAP = 28, W = 0, H = 0, pts = [], mx = -999, my = -999, queued = false, lastX = null, lastY = null;

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    cv.style.width = W + "px"; cv.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    pts = [];
    for (var y = GAP / 2; y < H; y += GAP)
      for (var x = GAP / 2; x < W; x += GAP) pts.push([x, y, Math.random() < 0.23]);
    draw();
  }

  function draw() {
    queued = false;
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i];
      var k = Math.max(0, 1 - Math.hypot(p[0] - mx, p[1] - my) / 170);
      var r = 1.4 + k * 2.6;
      ctx.fillStyle = p[2]
        ? "rgba(212,255,58," + (0.16 + k * 0.7).toFixed(3) + ")"
        : "rgba(243,241,234," + (0.06 + k * 0.32).toFixed(3) + ")";
      ctx.fillRect(p[0] - r / 2, p[1] - r / 2, r, r);
    }
  }


  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", function (e) {
    mx = e.clientX; my = e.clientY;
    if (lastX !== null) {
      var speed = Math.hypot(mx - lastX, my - lastY);
      ampTarget = Math.min(24, Math.max(ampTarget, 7 + speed * 0.12));
    }
    lastX = mx; lastY = my;
    if (!queued) { queued = true; requestAnimationFrame(draw); }
  }, { passive: true });
  document.addEventListener("pointerleave", function () {
    mx = my = -999;
    if (!queued) { queued = true; requestAnimationFrame(draw); }
  });

  resize();
})();
