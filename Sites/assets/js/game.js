/* 23% — game page (content comes from games.js) */
(function () {
  var S = window.S23;
  var el = S.el, ICONS = S.ICONS, g = S.current;
  var main = document.getElementById("game");
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

  /* Optional screenshots */
  if (g.screenshots && g.screenshots.length) {
    var shots = el("section", "shots");
    shots.append(el("h2", "eyebrow", "// screens"));
    var row = el("div", "shots-row");
    g.screenshots.forEach(function (src, n) {
      var im = el("img");
      im.src = base + src;
      im.alt = g.title + " screenshot " + (n + 1);
      im.loading = "lazy";
      row.append(im);
    });
    shots.append(row);
    main.append(shots);
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
