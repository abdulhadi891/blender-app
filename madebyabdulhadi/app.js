/* ============================================================
   madebyabdulhadi.com — gallery logic
   Data comes from data/projects.js  (window.PROJECTS)
   ============================================================ */

(function () {
  "use strict";

  var PROJECTS = Array.isArray(window.PROJECTS) ? window.PROJECTS.slice() : [];

  var grid       = document.getElementById("grid");
  var gridEmpty  = document.getElementById("gridEmpty");
  var filters    = document.getElementById("filters");
  var modal      = document.getElementById("modal");
  var modalImg   = document.getElementById("modalImg");
  var modalCat   = document.getElementById("modalCat");
  var modalTitle = document.getElementById("modalTitle");
  var modalYear  = document.getElementById("modalYear");
  var modalDesc  = document.getElementById("modalDesc");
  var modalSpecs = document.getElementById("modalSpecs");
  var modalThumbs= document.getElementById("modalThumbs");
  var modalDl    = document.getElementById("modalDl");
  var modalCount = document.getElementById("modalCounter");
  var prevBtn    = document.getElementById("prevImg");
  var nextBtn    = document.getElementById("nextImg");

  var activeFilter = "All";
  var current = null;      // project currently open
  var shot = 0;            // index of the visible image
  var lastFocused = null;

  /* ── Helpers ──────────────────────────────────────────── */

  // Shown when a render image is missing or hasn't been added yet.
  var PLACEHOLDER =
    "data:image/svg+xml;charset=utf-8," +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#1a1a20"/><stop offset="1" stop-color="#0d0d11"/>' +
      "</linearGradient></defs>" +
      '<rect width="800" height="600" fill="url(#g)"/>' +
      '<g fill="none" stroke="#3a3a46" stroke-width="6" stroke-linejoin="round">' +
      '<path d="M400 210l110 62v126l-110 62-110-62V272z"/>' +
      '<path d="M290 272l110 62 110-62"/><path d="M400 334v126"/></g>' +
      '<text x="400" y="512" fill="#55555f" font-family="monospace" font-size="21" ' +
      'text-anchor="middle">render coming soon</text></svg>'
    );

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function shots(p) {
    var list = [];
    if (p.cover) list.push(p.cover);
    (p.images || []).forEach(function (src) {
      if (list.indexOf(src) === -1) list.push(src);
    });
    return list.length ? list : [PLACEHOLDER];
  }

  function onImgError(img) {
    img.onerror = null;
    img.src = PLACEHOLDER;
  }

  /* ── Hero counters ────────────────────────────────────── */

  function paintStats() {
    var stats = document.getElementById("heroStats");

    // Nothing published yet — "0 projects" reads worse than no counter at all.
    if (!PROJECTS.length) { if (stats) stats.hidden = true; return; }
    if (stats) stats.hidden = false;

    var withBlend = PROJECTS.filter(function (p) {
      return p.blend && p.blend.url;
    }).length;
    var set = function (key, val) {
      var el = document.querySelector('[data-stat="' + key + '"]');
      if (el) el.textContent = val;
    };
    set("projects", PROJECTS.length);
    set("blends", withBlend);
  }

  /* ── Filters ──────────────────────────────────────────── */

  function paintFilters() {
    var cats = ["All"];
    PROJECTS.forEach(function (p) {
      if (p.category && cats.indexOf(p.category) === -1) cats.push(p.category);
    });
    if (cats.length <= 2) { filters.hidden = true; return; }

    filters.innerHTML = "";
    cats.forEach(function (cat) {
      var b = document.createElement("button");
      b.className = "filter" + (cat === activeFilter ? " is-active" : "");
      b.type = "button";
      b.textContent = cat;
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", cat === activeFilter ? "true" : "false");
      b.addEventListener("click", function () {
        activeFilter = cat;
        paintFilters();
        paintGrid();
      });
      filters.appendChild(b);
    });
  }

  /* ── Grid ─────────────────────────────────────────────── */

  function paintGrid() {
    var list = PROJECTS.filter(function (p) {
      return activeFilter === "All" || p.category === activeFilter;
    });

    grid.innerHTML = "";
    gridEmpty.hidden = list.length > 0;

    // "Click any piece…" makes no sense with an empty gallery.
    var sub = document.querySelector("#work .section__sub");
    if (sub) sub.hidden = !PROJECTS.length;

    list.forEach(function (p, i) {
      var card = document.createElement("button");
      card.type = "button";
      card.className = "card" + (p.featured ? " is-wide" : "");
      card.style.animationDelay = Math.min(i * 55, 480) + "ms";
      card.setAttribute("aria-label", "Open project: " + (p.title || "Untitled"));

      var hasBlend = !!(p.blend && p.blend.url);

      card.innerHTML =
        '<div class="card__media">' +
          '<img loading="lazy" alt="' + esc(p.title) + '" src="' + esc(shots(p)[0]) + '">' +
          '<div class="card__shade"></div>' +
          (p.category ? '<span class="card__tag">' + esc(p.category) + "</span>" : "") +
          (hasBlend
            ? '<span class="card__blend">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" ' +
              'stroke-linecap="round" stroke-linejoin="round">' +
              '<path d="M12 3v12"/><path d="M7 11l5 5 5-5"/><path d="M4 20h16"/></svg>' +
              ".blend</span>"
            : "") +
        "</div>" +
        '<div class="card__foot">' +
          "<div>" +
            '<h3 class="card__title">' + esc(p.title || "Untitled") + "</h3>" +
            '<p class="card__meta">' +
              esc([p.year, (p.software || [])[0]].filter(Boolean).join(" · ")) +
            "</p>" +
          "</div>" +
          '<span class="card__arrow">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
            'stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/>' +
            '<path d="M13 6l6 6-6 6"/></svg>' +
          "</span>" +
        "</div>";

      var img = card.querySelector("img");
      img.addEventListener("error", function () { onImgError(img); });

      card.addEventListener("click", function () { openProject(p, card); });
      grid.appendChild(card);
    });
  }

  /* ── Comments (giscus) ────────────────────────────────── */

  var CFG = window.COMMENTS || {};

  function commentsReady() {
    return !!(CFG.enabled && CFG.repo && CFG.repoId && CFG.categoryId &&
              CFG.repo.indexOf("YOUR-USERNAME") === -1);
  }

  // One discussion thread per project, keyed by title.
  function mountComments(project) {
    var mount = document.getElementById("commentsMount");
    if (!mount) return;
    mount.innerHTML = "";

    if (!commentsReady()) {
      mount.innerHTML =
        '<p class="comments__off">Comments open soon — see ' +
        "<code>data/comments.js</code> for setup.</p>";
      return;
    }

    var s = document.createElement("script");
    s.src = "https://giscus.app/client.js";
    s.crossOrigin = "anonymous";
    s.async = true;
    s.setAttribute("data-repo", CFG.repo);
    s.setAttribute("data-repo-id", CFG.repoId);
    s.setAttribute("data-category", CFG.category || "Announcements");
    s.setAttribute("data-category-id", CFG.categoryId);
    s.setAttribute("data-mapping", "specific");
    s.setAttribute("data-term", project.title || "Untitled");
    s.setAttribute("data-strict", "0");
    s.setAttribute("data-reactions-enabled", "1");
    s.setAttribute("data-emit-metadata", "0");
    s.setAttribute("data-input-position", CFG.inputPosition || "top");
    s.setAttribute("data-theme", "dark_dimmed");
    s.setAttribute("data-lang", "en");
    s.setAttribute("data-loading", "lazy");
    mount.appendChild(s);
  }

  function unmountComments() {
    var mount = document.getElementById("commentsMount");
    if (mount) mount.innerHTML = "";
  }

  /* ── Modal ────────────────────────────────────────────── */

  function showShot(i) {
    var list = shots(current);
    shot = (i + list.length) % list.length;
    modalImg.src = list[shot];
    modalImg.alt = (current.title || "Render") + " — image " + (shot + 1);
    modalImg.onerror = function () { onImgError(modalImg); };

    var many = list.length > 1;
    prevBtn.hidden = nextBtn.hidden = modalCount.hidden = !many;
    if (many) modalCount.textContent = (shot + 1) + " / " + list.length;

    Array.prototype.forEach.call(modalThumbs.children, function (t, n) {
      t.classList.toggle("is-active", n === shot);
    });
  }

  function openProject(p, trigger) {
    current = p;
    lastFocused = trigger || null;

    modalCat.textContent   = p.category || "";
    modalTitle.textContent = p.title || "Untitled";
    modalYear.textContent  = p.year || "";
    modalYear.hidden       = !p.year;
    modalDesc.textContent  = p.description || "";

    // Thumbnail strip (only when there is more than one image)
    var list = shots(p);
    modalThumbs.innerHTML = "";
    if (list.length > 1) {
      list.forEach(function (src, n) {
        var t = document.createElement("button");
        t.type = "button";
        t.className = "thumb";
        t.setAttribute("aria-label", "View image " + (n + 1));
        var im = document.createElement("img");
        im.src = src;
        im.alt = "";
        im.loading = "lazy";
        im.addEventListener("error", function () { onImgError(im); });
        t.appendChild(im);
        t.addEventListener("click", function () { showShot(n); });
        modalThumbs.appendChild(t);
      });
    }

    // Spec table
    var specs = [];
    if ((p.software || []).length) specs.push(["Software", p.software.join(", ")]);
    Object.keys(p.stats || {}).forEach(function (k) {
      specs.push([k, p.stats[k]]);
    });
    modalSpecs.innerHTML = specs.map(function (row) {
      return "<div><dt>" + esc(row[0]) + "</dt><dd>" + esc(row[1]) + "</dd></div>";
    }).join("");

    // Download row
    modalDl.innerHTML = "";
    if (p.blend && p.blend.url) {
      var a = document.createElement("a");
      a.className = "btn btn--primary";
      a.href = p.blend.url;
      // Same-origin files download directly; external hosts open in a new tab.
      if (/^https?:\/\//i.test(p.blend.url)) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      } else {
        a.setAttribute("download", "");
      }
      a.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
        'stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/>' +
        '<path d="M7 11l5 5 5-5"/><path d="M4 20h16"/></svg>' +
        "Download .blend" + (p.blend.size ? " · " + esc(p.blend.size) : "");
      modalDl.appendChild(a);

      if (p.blend.license) {
        var note = document.createElement("span");
        note.className = "dl-note";
        note.textContent = p.blend.license;
        modalDl.appendChild(note);
      }
    } else {
      var soon = document.createElement("span");
      soon.className = "dl-note";
      soon.textContent = "Project file not published for this piece.";
      modalDl.appendChild(soon);
    }

    showShot(0);
    mountComments(p);
    modal.hidden = false;
    document.body.classList.add("is-locked");
    document.querySelector(".modal__close").focus();
  }

  function closeProject() {
    modal.hidden = true;
    document.body.classList.remove("is-locked");
    modalImg.src = "";
    unmountComments();   // stop the giscus iframe when the modal closes
    current = null;
    if (lastFocused) lastFocused.focus();
  }

  /* ── Events ───────────────────────────────────────────── */

  modal.addEventListener("click", function (e) {
    if (e.target.hasAttribute && e.target.hasAttribute("data-close")) closeProject();
    if (e.target.closest && e.target.closest("[data-close]")) closeProject();
  });

  prevBtn.addEventListener("click", function () { showShot(shot - 1); });
  nextBtn.addEventListener("click", function () { showShot(shot + 1); });

  document.addEventListener("keydown", function (e) {
    if (modal.hidden) return;
    if (e.key === "Escape")     closeProject();
    if (e.key === "ArrowLeft")  showShot(shot - 1);
    if (e.key === "ArrowRight") showShot(shot + 1);
  });

  // Nav gets a border once the page scrolls.
  var nav = document.getElementById("nav");
  var onScroll = function () { nav.classList.toggle("is-stuck", window.scrollY > 12); };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Hide social links that still point at "#"
  document.querySelectorAll("[data-social]").forEach(function (a) {
    if (a.getAttribute("href") === "#") a.parentElement.style.display = "none";
  });

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ── Go ───────────────────────────────────────────────── */
  paintStats();
  paintFilters();
  paintGrid();

  // Lets admin.js swap the list in and repaint. Harmless for visitors —
  // reading it changes nothing, and admin.js only loads for you.
  window.Gallery = {
    get: function () { return PROJECTS; },
    set: function (list) {
      PROJECTS = Array.isArray(list) ? list : [];
      activeFilter = "All";
      paintStats();
      paintFilters();
      paintGrid();
    }
  };
})();
