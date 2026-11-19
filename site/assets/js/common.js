/* 23% — shared helpers (loaded in <head>) */
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(pointer: fine)").matches;
  var isFile = location.protocol === "file:";
  var games = window.GAMES || [];

  /* Locally (file://) folder links open a directory listing — point them at index.html */
  function fixHref(href) {
    if (isFile && href && !/^[a-z]+:|^#|^\/\//i.test(href) && /\/$/.test(href)) return href + "index.html";
    return href;
  }

  function applyTheme(node, g) {
    var c = g.colors || {};
    if (c.accent) node.style.setProperty("--accent", c.accent);
    if (c.accent2) node.style.setProperty("--accent-2", c.accent2);
    if (c.bg) node.style.setProperty("--game-bg", c.bg);
  }

  /* Theme the game page before first paint */
  var current = null;
  for (var i = 0; i < games.length; i++) if (games[i].id === root.dataset.game) current = games[i];
  if (current) applyTheme(root, current);

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function initials(t) {
    return t.split(/\s+/).map(function (w) { return w.charAt(0); }).join("").slice(0, 2).toUpperCase();
  }

  /* Game icon: generated gradient tile, replaced by the real image once it loads */
  function iconTile(g, base, cls) {
    var wrap = el("span", "icon-tile " + (cls || ""));
    wrap.style.setProperty("--c1", g.colors.accent);
    wrap.style.setProperty("--c2", g.colors.accent2);
    wrap.append(el("span", "icon-fallback", initials(g.title)));
    if (g.icon) {
      var img = new Image();
      img.alt = g.title + " icon";
      img.decoding = "async";
      img.onload = function () { wrap.classList.add("has-img"); };
      img.onerror = function () { img.remove(); };
      img.src = base + g.icon;
      wrap.append(img);
    }
    return wrap;
  }

  /* Circular colour wipe, then navigate */
  function wipeTo(url, color, x, y) {
    url = fixHref(url);
    var w = document.querySelector(".wipe");
    if (!w || reduce) { location.href = url; return; }
    w.style.transition = "none";
    w.classList.remove("is-intro", "is-full");
    w.style.setProperty("--wipe", color);
    w.style.setProperty("--x", x + "px");
    w.style.setProperty("--y", y + "px");
    void w.offsetWidth;
    w.style.transition = "";
    requestAnimationFrame(function () { w.classList.add("is-full"); });
    var done = false;
    function go() { if (!done) { done = true; location.href = url; } }
    w.addEventListener("transitionend", go, { once: true });
    setTimeout(go, 800);
  }

  function isPlainClick(e) {
    return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
  }

  function clickPoint(e, node) {
    if (e.detail === 0 || (!e.clientX && !e.clientY)) {
      var r = node.getBoundingClientRect();
      return [r.left + r.width / 2, r.top + r.height / 2];
    }
    return [e.clientX, e.clientY];
  }

  /* Returning via the back button (bfcache) — hide the wipe again */
  window.addEventListener("pageshow", function (e) {
    if (!e.persisted) return;
    var w = document.querySelector(".wipe");
    if (!w) return;
    w.style.transition = "none";
    w.classList.remove("is-full", "is-intro");
    void w.offsetWidth;
    w.style.transition = "";
  });

  document.addEventListener("DOMContentLoaded", function () {
    if (isFile) {
      document.querySelectorAll("a[href]").forEach(function (a) {
        a.setAttribute("href", fixHref(a.getAttribute("href")));
      });
    }
    document.querySelectorAll(".year").forEach(function (n) { n.textContent = new Date().getFullYear(); });
  });

  var ICONS = {
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.6 2.4c-.4.3-.6.8-.6 1.4v16.4c0 .6.2 1.1.6 1.4l9.1-9.6-9.1-9.6Zm10.5 8.1 2.6-2.7L6.6 1.5c-.3-.2-.7-.2-1 0l9.5 9Zm0 3-9.5 9c.3.2.7.2 1 0l11.1-6.3-2.6-2.7Zm4.1-4.8-3 3.3 3 3.3 2.7-1.6c1-.6 1-2.1 0-2.6l-2.7-2.4Z"/></svg>',
    apple: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.4 12.7c0-2.5 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 2.9-.4 7.3 1.2 9.7.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.2-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8 0 0-2.6-1-2.6-3.8ZM14 5.4c.7-.8 1.1-1.9 1-3-.9 0-2.1.6-2.8 1.4-.6.7-1.2 1.9-1 3 1.1.1 2.1-.6 2.8-1.4Z"/></svg>',
    telegram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.2 3.3 2.6 10.5c-1.2.5-1.2 1.2-.2 1.5l4.8 1.5 1.8 5.6c.2.6.4.8.9.8.4 0 .6-.2.9-.4l2.3-2.2 4.7 3.5c.9.5 1.5.2 1.7-.8l3.1-14.5c.3-1.3-.5-1.8-1.4-1.4Zm-3.4 4.1-8.4 7.6-.3 3.4-1.6-5.1 10-6.3c.4-.3.8-.1.3.4Z"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.6 2h-3.4v13.3a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .9.1V9a6.3 6.3 0 1 0 5.4 6.3V8.6a7.9 7.9 0 0 0 4.6 1.5V6.7a4.6 4.6 0 0 1-4.6-4.7Z"/></svg>'
  };

  window.S23 = {
    games: games, current: current, reduce: reduce, fine: fine,
    el: el, iconTile: iconTile, wipeTo: wipeTo, fixHref: fixHref,
    isPlainClick: isPlainClick, clickPoint: clickPoint, ICONS: ICONS
  };
})();
