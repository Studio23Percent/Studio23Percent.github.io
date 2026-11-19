/* 23% — game page (content comes from games.js) */
(function () {
  var S = window.S23;
  var el = S.el, ICONS = S.ICONS, g = S.current;
  /* #game is the scroll container sitting above a background that never moves.
     All content (and the corner HUD) lives inside it. */
  var scroller = document.getElementById("game");
  var main = el("div", "game-inner");
  scroller.append(main);
  Array.prototype.forEach.call(document.querySelectorAll("body > .hud"), function (h) { main.append(h); });
  var base = document.body.dataset.root || "";

  if (!g) { main.append(el("p", "eyebrow", "Game not found.")); return; }

  var idx = S.games.indexOf(g);
  var num = String(idx + 1).padStart(2, "0");
  var total = String(S.games.length).padStart(2, "0");
  var links = g.links || {};
  var released = !!(links.googlePlay || links.appStore);

  /* HUD */
  document.getElementById("num").textContent = num;
  document.getElementById("total").textContent = total;

  var back = document.getElementById("back");
  back.addEventListener("click", function (e) {
    if (!S.isPlainClick(e)) return;
    e.preventDefault();
    var p = S.clickPoint(e, back);
    S.wipeTo(back.getAttribute("href"), "#d4ff3a", p[0], p[1]);
  });

  var nextLink = document.getElementById("next");
  if (S.games.length > 1) {
    var nx = S.games[(idx + 1) % S.games.length];
    nextLink.href = S.fixHref(base + nx.page);
    nextLink.append(el("span", null, "Next"), el("b", null, nx.title + " →"));
    nextLink.addEventListener("click", function (e) {
      if (!S.isPlainClick(e)) return;
      e.preventDefault();
      var p = S.clickPoint(e, nextLink);
      S.wipeTo(nextLink.getAttribute("href"), nx.colors.accent, p[0], p[1]);
    });
  } else {
    nextLink.remove();
  }

  /* Background marquee */
  var track = document.getElementById("marquee");
  for (var i = 0; i < 8; i++) track.append(el("span", null, g.title));

  /* Optional cover art */
  if (g.cover) {
    var cimg = new Image();
    cimg.onload = function () {
      var c = document.getElementById("cover");
      c.style.backgroundImage = 'url("' + cimg.src + '")';
      c.classList.add("is-on");
    };
    cimg.src = base + g.cover;
  }

  /* ---------- Hero ---------- */
  var hero = el("section", "game-hero");

  var art = el("div", "game-art");
  art.append(S.iconTile(g, base, "game-icon"));
  var ringText = (released ? "OUT NOW" : "COMING SOON") + " • " + g.title.toUpperCase() + " • 23% STUDIO • ";
  var badge = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  badge.setAttribute("class", "badge");
  badge.setAttribute("viewBox", "0 0 120 120");
  badge.setAttribute("aria-hidden", "true");
  badge.innerHTML =
    '<circle cx="60" cy="60" r="58"/>' +
    '<defs><path id="ring" d="M60,60 m-45,0 a45,45 0 1,1 90,0 a45,45 0 1,1 -90,0"/></defs>' +
    '<g class="badge-ring"><text textLength="280" lengthAdjust="spacing"><textPath href="#ring"></textPath></text></g>' +
    '<text class="badge-num" x="60" y="70" text-anchor="middle"></text>';
  badge.querySelector("textPath").textContent = ringText;
  badge.querySelector(".badge-num").textContent = num;
  art.append(badge);

  var info = el("div", "game-info");
  info.append(
    el("p", "eyebrow", "Game " + num + (g.platforms ? " · " + g.platforms : "")),
    el("h1", "game-title", g.title),
    el("p", "game-tagline", g.tagline || "")
  );
  var desc = el("div", "game-desc");
  (g.description || []).forEach(function (t) { desc.append(el("p", null, t)); });
  info.append(desc);

  /* Store buttons */
  function storeBtn(url, icon, small, big) {
    var b = el(url ? "a" : "span", "store" + (url ? "" : " is-soon"));
    if (url) { b.href = url; b.target = "_blank"; b.rel = "noopener"; }
    else b.setAttribute("aria-disabled", "true");
    b.innerHTML = icon;
    var txt = el("span", "store-txt");
    txt.append(el("small", null, url ? small : "Coming soon to"), el("b", null, big));
    b.append(txt);
    return b;
  }
  var stores = el("div", "stores");
  stores.append(
    storeBtn(links.googlePlay, ICONS.play, "Get it on", "Google Play"),
    storeBtn(links.appStore, ICONS.apple, "Download on the", "App Store")
  );
  info.append(stores);

  /* Socials — shown only if the game has them */
  var socialList = [
    ["telegram", "Telegram", ICONS.telegram],
    ["tiktok", "TikTok", ICONS.tiktok]
  ].filter(function (s) { return links[s[0]]; });

  if (socialList.length) {
    var soc = el("div", "socials");
    soc.append(el("span", "socials-label", "Follow the game"));
    socialList.forEach(function (s) {
      var a = el("a", "sticker");
      a.href = links[s[0]]; a.target = "_blank"; a.rel = "noopener";
      var ic = el("i");
      ic.innerHTML = s[2];
      a.append(ic, el("span", null, s[1]));
      soc.append(a);
    });
    info.append(soc);
  }

  hero.append(art, info);
  main.append(hero);

  /* Title always on one line: shrink it to the width of the text column */
  var titleEl = info.querySelector(".game-title");
  function fitTitle() {
    titleEl.style.fontSize = "";
    var max = parseFloat(getComputedStyle(titleEl).fontSize);
    var w = titleEl.scrollWidth, box = titleEl.clientWidth;
    if (w > box) titleEl.style.fontSize = Math.max(24, Math.floor(max * box / w)) + "px";
  }
  fitTitle();
  if (document.fonts) document.fonts.ready.then(fitTitle);
  var lastW = window.innerWidth;
  window.addEventListener("resize", function () {
    if (window.innerWidth === lastW) return; // mobile address bar only changes height
    lastW = window.innerWidth;
    fitTitle();
  });

  /* Optional screenshots */
  if (g.screenshots && g.screenshots.length) {
    var shots = el("section", "shots");
    var head = el("div", "shots-head");
    head.append(el("h2", "eyebrow", "// screens"), el("span", "shots-count", String(g.screenshots.length).padStart(2, "0") + " shots · swipe →"));
    shots.append(head);
    var row = el("div", "shots-row");
    var srcs = g.screenshots.map(function (s) { return base + s; });
    srcs.forEach(function (src, n) {
      var btn = el("button", "shot");
      btn.type = "button";
      btn.setAttribute("aria-label", "Open screenshot " + (n + 1));
      var im = el("img");
      im.src = src;
      im.alt = g.title + " screenshot " + (n + 1);
      im.loading = "lazy";
      im.decoding = "async";
      btn.append(im);
      btn.addEventListener("click", function () { openBox(n); });
      row.append(btn);
    });
    shots.append(row);
    main.append(shots);

    /* Mouse wheel scrolls the strip sideways, smoothly and without snapping back.
       At either end the page scrolls as usual. */
    var target = 0, raf = 0;
    function glide() {
      var d = target - row.scrollLeft;
      if (Math.abs(d) < 0.5) { row.scrollLeft = target; raf = 0; return; }
      row.scrollLeft += d * 0.18;
      raf = requestAnimationFrame(glide);
    }
    row.addEventListener("scroll", function () { if (!raf) target = row.scrollLeft; }, { passive: true });
    row.addEventListener("wheel", function (e) {
      if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // trackpad / zoom
      var dy = e.deltaMode === 1 ? e.deltaY * 40 : e.deltaMode === 2 ? e.deltaY * row.clientWidth : e.deltaY;
      var max = row.scrollWidth - row.clientWidth;
      if (!raf) target = row.scrollLeft;
      if ((dy < 0 && target <= 0) || (dy > 0 && target >= max - 1)) return;
      e.preventDefault();
      target = Math.max(0, Math.min(max, target + dy * 1.6));
      if (S.reduce) { row.scrollLeft = target; return; }
      if (!raf) raf = requestAnimationFrame(glide);
    }, { passive: false });

    /* Fullscreen viewer */
    var box = el("div", "lightbox");
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.hidden = true;
    var big = el("img");
    var prev = el("button", "lb-btn lb-prev", "←");
    var nextB = el("button", "lb-btn lb-next", "→");
    var close = el("button", "lb-btn lb-close", "✕");
    var counter = el("span", "lb-count");
    [prev, nextB, close].forEach(function (b) { b.type = "button"; });
    prev.setAttribute("aria-label", "Previous");
    nextB.setAttribute("aria-label", "Next");
    close.setAttribute("aria-label", "Close");
    box.append(big, prev, nextB, close, counter);
    document.body.append(box);

    var cur = 0, startX = null;
    function show(n) {
      cur = (n + srcs.length) % srcs.length;
      big.src = srcs[cur];
      big.alt = g.title + " screenshot " + (cur + 1);
      counter.textContent = (cur + 1) + " / " + srcs.length;
    }
    function openBox(n) {
      show(n);
      box.hidden = false;
      document.documentElement.classList.add("no-scroll");
      close.focus();
    }
    function closeBox() {
      box.hidden = true;
      document.documentElement.classList.remove("no-scroll");
      var b = row.children[cur];
      if (b) b.focus({ preventScroll: true });
    }
    prev.addEventListener("click", function (e) { e.stopPropagation(); show(cur - 1); });
    nextB.addEventListener("click", function (e) { e.stopPropagation(); show(cur + 1); });
    close.addEventListener("click", closeBox);
    box.addEventListener("click", function (e) { if (e.target === box) closeBox(); });
    document.addEventListener("keydown", function (e) {
      if (box.hidden) return;
      if (e.key === "Escape") closeBox();
      else if (e.key === "ArrowLeft") show(cur - 1);
      else if (e.key === "ArrowRight") show(cur + 1);
    });
    box.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
    box.addEventListener("touchend", function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      startX = null;
      if (Math.abs(dx) > 40) show(cur + (dx < 0 ? 1 : -1));
    });
  }

  /* Icon tilt follows the pointer */
  if (S.fine && !S.reduce) {
    var tile = art.querySelector(".game-icon");
    window.addEventListener("pointermove", function (e) {
      var px = e.clientX / window.innerWidth - 0.5;
      var py = e.clientY / window.innerHeight - 0.5;
      tile.style.setProperty("--ry", (px * 18).toFixed(2) + "deg");
      tile.style.setProperty("--rx", (-py * 18).toFixed(2) + "deg");
    }, { passive: true });
  }
})();
