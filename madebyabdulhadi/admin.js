/* ============================================================
   MANAGE PANEL  —  the button in the top-left corner

   What it does:
     · add a piece (pick the image + the .blend, fill in the fields)
     · delete a piece
     · reorder pieces
     · shows the result in the real gallery straight away

   What it CANNOT do — and why:
     This site is static files on Cloudflare. There is no server behind
     it, so nothing in a web page can write into your repo. A page that
     really uploaded would need your GitHub token embedded in it, and
     anyone could read it out of the page source and take the repo over.

     So instead, when you're done the panel hands you:
       1. a finished data/projects.js  (Download)
       2. every image and .blend, already renamed correctly  (Download)
     You drag those into GitHub. That's the last step, and it's ~30s.

   Only you ever see this. It shows up on your own computer
   (localhost / opening the file directly) and stays hidden on the live
   site unless you add #admin to the address.
   ============================================================ */

(function () {
  "use strict";

  /* ── Should the button exist at all? ──────────────────── */

  var host = location.hostname;
  var isLocal = host === "localhost" || host === "127.0.0.1" || host === "";
  if (!isLocal && location.hash.indexOf("admin") === -1) return;

  var LS_KEY = "mba_draft_v1";

  var list = [];          // the working list of projects
  var files = {};         // path -> File, for the renamed downloads
  var panel, listEl;

  /* ── Styles ───────────────────────────────────────────── */

  var css = document.createElement("style");
  css.textContent = [
    ".adm-open{position:fixed;top:14px;left:14px;z-index:60;display:inline-flex;",
      "align-items:center;gap:8px;padding:9px 15px;border-radius:999px;",
      "background:var(--accent);color:#14100c;border:0;cursor:pointer;",
      "font:inherit;font-size:13.5px;font-weight:700;",
      "box-shadow:0 6px 22px -8px rgba(255,122,47,.7)}",
    ".adm-open:hover{transform:translateY(-1px)}",
    ".adm-open svg{width:15px;height:15px}",
    // Nudge the header across so the button doesn't sit on the logo.
    "body.has-adm .nav{padding-left:136px}",
    "@media(max-width:560px){body.has-adm .nav{padding-left:118px}}",

    ".adm{position:fixed;inset:0;z-index:90;display:none}",
    ".adm.is-on{display:block}",
    ".adm__back{position:absolute;inset:0;background:rgba(4,4,6,.7);backdrop-filter:blur(4px)}",
    ".adm__panel{position:absolute;top:0;left:0;bottom:0;width:min(460px,100%);",
      "background:var(--bg-soft);border-right:1px solid var(--line);",
      "overflow-y:auto;padding:22px;animation:admIn .28s cubic-bezier(.22,.61,.36,1)}",
    "@keyframes admIn{from{transform:translateX(-30px);opacity:0}}",

    ".adm__head{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px}",
    ".adm__head h2{margin:0;font-size:19px;letter-spacing:-.02em}",
    ".adm__x{width:32px;height:32px;border-radius:50%;border:1px solid var(--line);",
      "background:none;color:var(--muted);cursor:pointer;font-size:17px;line-height:1}",
    ".adm__x:hover{border-color:var(--accent);color:var(--accent)}",
    ".adm__note{margin:0 0 18px;font-size:12.5px;color:var(--faint);line-height:1.55}",

    ".adm__item{display:flex;align-items:center;gap:10px;padding:9px;margin-bottom:8px;",
      "background:var(--panel);border:1px solid var(--line-soft);border-radius:12px}",
    ".adm__item img{width:52px;height:38px;object-fit:cover;border-radius:7px;",
      "background:#0c0c10;flex:none}",
    ".adm__meta{flex:1;min-width:0}",
    ".adm__meta b{display:block;font-size:14px;font-weight:600;overflow:hidden;",
      "text-overflow:ellipsis;white-space:nowrap}",
    ".adm__meta span{font-size:11.5px;color:var(--faint)}",
    ".adm__mini{width:26px;height:26px;border-radius:7px;border:1px solid var(--line);",
      "background:none;color:var(--muted);cursor:pointer;font-size:13px;line-height:1;flex:none}",
    ".adm__mini:hover{border-color:var(--accent);color:var(--accent)}",
    ".adm__mini--del:hover{border-color:#ff5a5a;color:#ff5a5a}",
    ".adm__empty{padding:26px;text-align:center;color:var(--faint);font-size:13.5px;",
      "border:1px dashed var(--line);border-radius:12px}",

    ".adm__sec{margin-top:22px;padding-top:18px;border-top:1px solid var(--line-soft)}",
    ".adm__sec h3{margin:0 0 12px;font-size:12px;letter-spacing:.11em;",
      "text-transform:uppercase;color:var(--faint)}",
    ".adm label.f{display:block;font-size:11.5px;letter-spacing:.08em;text-transform:uppercase;",
      "color:var(--faint);margin:0 0 6px}",
    ".adm input[type=text],.adm textarea{width:100%;padding:10px 12px;margin-bottom:12px;",
      "background:#0c0c10;color:var(--text);border:1px solid var(--line);border-radius:9px;",
      "font:inherit;font-size:14px}",
    ".adm textarea{min-height:74px;resize:vertical}",
    ".adm input:focus,.adm textarea:focus{outline:none;border-color:var(--accent)}",
    ".adm__row{display:grid;grid-template-columns:1fr 1fr;gap:10px}",
    ".adm__pick{display:block;padding:14px;margin-bottom:10px;border:1px dashed var(--line);",
      "border-radius:10px;text-align:center;color:var(--muted);font-size:13px;cursor:pointer}",
    ".adm__pick:hover{border-color:var(--accent);background:rgba(255,122,47,.05)}",
    ".adm__pick input{display:none}",
    ".adm__pick b{color:var(--text)}",
    ".adm__chk{display:flex;align-items:center;gap:9px;font-size:13.5px;color:var(--muted);",
      "margin-bottom:14px;cursor:pointer}",
    ".adm__chk input{width:16px;height:16px;accent-color:var(--accent)}",
    ".adm__warn{padding:11px 13px;margin-bottom:12px;border-radius:9px;font-size:12.5px;",
      "line-height:1.5;background:rgba(255,122,47,.09);border:1px solid rgba(255,122,47,.3);color:#ffc691}",
    ".adm__dl{display:flex;flex-direction:column;gap:8px}",
    ".adm__dl a,.adm__dl button{width:100%;justify-content:center}",
    ".adm__saved{font-size:12.5px;color:#6ee7a8;margin:10px 0 0}",
    ".adm__steps{margin:14px 0 0;padding-left:19px;font-size:12.5px;color:var(--muted);line-height:1.65}"
  ].join("");
  document.head.appendChild(css);

  /* ── Helpers (shared shape with add.html) ─────────────── */

  function tidy(n) {
    return String(n).toLowerCase().replace(/[\s_]+/g, "-").replace(/[^a-z0-9.\-]/g, "");
  }
  function fmtSize(b) {
    if (b < 1024) return b + " B";
    if (b < 1048576) return Math.round(b / 1024) + " KB";
    return (b / 1048576).toFixed(b < 10485760 ? 1 : 0) + " MB";
  }
  function q(s) {
    return '"' + String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
  }
  function wrapStr(text, indent) {
    var words = text.split(/\s+/), lines = [], line = "";
    words.forEach(function (w) {
      if ((line + " " + w).length > 62) { lines.push(line); line = w; }
      else { line = line ? line + " " + w : w; }
    });
    if (line) lines.push(line);
    return lines.map(function (l, i) {
      return indent + q(l + (i < lines.length - 1 ? " " : ""));
    }).join(" +\n");
  }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  /* ── Draft storage ────────────────────────────────────── */

  function saveDraft() {
    // Blob URLs die on reload, so don't persist them — after a refresh the
    // real path is used, which shows a placeholder until you upload the file.
    var clean = list.map(function (p) {
      var c = {};
      Object.keys(p).forEach(function (k) { if (k !== "_preview") c[k] = p[k]; });
      return c;
    });
    try { localStorage.setItem(LS_KEY, JSON.stringify(clean)); } catch (e) {}
  }
  function loadDraft() {
    try {
      var raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  // The gallery shows the file you just picked; the exported projects.js
  // keeps the real assets/renders/... path. So `_preview` is swapped in
  // for display only, and never written to the file.
  function forDisplay() {
    return list.map(function (p) {
      if (!p._preview) return p;
      var copy = {};
      Object.keys(p).forEach(function (k) { copy[k] = p[k]; });
      copy.cover = p._preview;
      copy.images = [];
      return copy;
    });
  }

  function apply() {
    window.Gallery.set(forDisplay());
    saveDraft();
    renderList();
  }

  /* ── Serialise the whole projects.js file ─────────────── */

  function toFile() {
    var out = [
      "/* ============================================================",
      "   MY WORK",
      "",
      "   Written by the Manage panel. You can also edit this by hand —",
      "   each piece is one block from { to },",
      "   ============================================================ */",
      "",
      "window.PROJECTS = [",
      ""
    ];

    list.forEach(function (p, idx) {
      var L = [];
      L.push("  {");
      L.push("    title: " + q(p.title || "Untitled") + ",");
      if (p.year)     L.push("    year: " + q(p.year) + ",");
      if (p.category) L.push("    category: " + q(p.category) + ",");
      if (p.featured) L.push("    featured: true,");

      if (p.cover) {
        L.push("");
        L.push("    cover: " + q(p.cover) + ",");
        if (p.images && p.images.length) {
          L.push("    images: [");
          L.push(p.images.map(function (s) { return "      " + q(s); }).join(",\n"));
          L.push("    ],");
        }
      }
      if (p.description) {
        L.push("");
        L.push("    description:");
        L.push(wrapStr(p.description, "      ") + ",");
      }
      if (p.software && p.software.length) {
        L.push("");
        L.push("    software: [" + p.software.map(q).join(", ") + "],");
      }
      if (p.stats && Object.keys(p.stats).length) {
        L.push("");
        L.push("    stats: {");
        L.push(Object.keys(p.stats).map(function (k) {
          return "      " + q(k) + ": " + q(p.stats[k]);
        }).join(",\n"));
        L.push("    },");
      }
      if (p.blend && p.blend.url) {
        L.push("");
        L.push("    blend: {");
        L.push("      url: " + q(p.blend.url) + ",");
        if (p.blend.size)    L.push("      size: " + q(p.blend.size) + ",");
        if (p.blend.license) L.push("      license: " + q(p.blend.license) + ",");
        L[L.length - 1] = L[L.length - 1].replace(/,$/, "");
        L.push("    }");
      } else {
        L[L.length - 1] = L[L.length - 1].replace(/,$/, "");
      }
      L.push("  }" + (idx < list.length - 1 ? "," : ""));
      out.push(L.join("\n"));
      out.push("");
    });

    out.push("];");
    out.push("");
    return out.join("\n");
  }

  function download(name, blob) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  }

  /* ── The list of current work ─────────────────────────── */

  function renderList() {
    listEl.innerHTML = "";
    if (!list.length) {
      listEl.appendChild(el("div", "adm__empty", "Nothing yet. Add your first piece below."));
      return;
    }
    list.forEach(function (p, i) {
      var row = el("div", "adm__item");

      var img = document.createElement("img");
      img.src = p._preview || p.cover || "";
      img.alt = "";
      img.onerror = function () { this.style.visibility = "hidden"; };
      row.appendChild(img);

      row.appendChild(el("div", "adm__meta",
        "<b>" + (p.title || "Untitled") + "</b><span>" +
        [p.category, p.year, (p.blend && p.blend.url) ? ".blend" : "no file"]
          .filter(Boolean).join(" · ") + "</span>"));

      var up = el("button", "adm__mini", "&uarr;");
      up.title = "Move up";
      up.onclick = function () {
        if (i === 0) return;
        list.splice(i - 1, 0, list.splice(i, 1)[0]); apply();
      };
      var dn = el("button", "adm__mini", "&darr;");
      dn.title = "Move down";
      dn.onclick = function () {
        if (i === list.length - 1) return;
        list.splice(i + 1, 0, list.splice(i, 1)[0]); apply();
      };
      var del = el("button", "adm__mini adm__mini--del", "&times;");
      del.title = "Delete";
      del.onclick = function () {
        if (!confirm('Delete "' + (p.title || "Untitled") + '" from the site?')) return;
        list.splice(i, 1); apply();
      };

      row.appendChild(up); row.appendChild(dn); row.appendChild(del);
      listEl.appendChild(row);
    });
  }

  /* ── Build the panel ──────────────────────────────────── */

  function build() {
    var btn = el("button", "adm-open",
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" ' +
      'stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg> Manage');
    btn.onclick = function () { panel.classList.add("is-on"); };
    document.body.appendChild(btn);
    document.body.classList.add("has-adm");

    panel = el("div", "adm");
    var back = el("div", "adm__back");
    back.onclick = function () { panel.classList.remove("is-on"); };
    panel.appendChild(back);

    var box = el("div", "adm__panel");

    var head = el("div", "adm__head", "<h2>Manage work</h2>");
    var x = el("button", "adm__x", "&times;");
    x.onclick = function () { panel.classList.remove("is-on"); };
    head.appendChild(x);
    box.appendChild(head);

    box.appendChild(el("p", "adm__note",
      "Changes show in the gallery straight away and are kept in this browser. " +
      "When you're happy, download below and put the files on GitHub."));

    listEl = el("div");
    box.appendChild(listEl);

    /* ── Add form ── */
    var sec = el("div", "adm__sec", "<h3>Add a piece</h3>");

    var fTitle = el("input"); fTitle.type = "text"; fTitle.placeholder = "Title";
    sec.appendChild(fTitle);

    var row = el("div", "adm__row");
    var fYear = el("input"); fYear.type = "text"; fYear.value = new Date().getFullYear();
    var fCat = el("input"); fCat.type = "text"; fCat.placeholder = "Category";
    row.appendChild(fYear); row.appendChild(fCat);
    sec.appendChild(row);

    var fDesc = el("textarea"); fDesc.placeholder = "Description";
    sec.appendChild(fDesc);

    var fSw = el("input"); fSw.type = "text"; fSw.value = "Blender";
    sec.appendChild(fSw);

    var imgLab = el("label", "adm__pick", "<b>Choose render image(s)</b><br>first one is the cover");
    var imgIn = document.createElement("input");
    imgIn.type = "file"; imgIn.accept = "image/*"; imgIn.multiple = true;
    imgLab.appendChild(imgIn);
    sec.appendChild(imgLab);

    var blendLab = el("label", "adm__pick", "<b>Choose .blend</b><br>optional");
    var blendIn = document.createElement("input");
    blendIn.type = "file"; blendIn.accept = ".blend,.zip";
    blendLab.appendChild(blendIn);
    sec.appendChild(blendLab);

    var warnBox = el("div");
    sec.appendChild(warnBox);

    var chkWrap = el("label", "adm__chk", "<span>Feature it (double-width card)</span>");
    var fFeat = document.createElement("input"); fFeat.type = "checkbox";
    chkWrap.insertBefore(fFeat, chkWrap.firstChild);
    sec.appendChild(chkWrap);

    var picked = { images: [], blend: null };

    function checkFiles() {
      warnBox.innerHTML = "";
      var msgs = [];
      picked.images.concat(picked.blend ? [picked.blend] : []).forEach(function (f) {
        if (f.size > 25 * 1024 * 1024) {
          msgs.push("<b>" + f.name + "</b> is " + fmtSize(f.size) +
            " — over Cloudflare's 25 MB cap, it won't deploy.");
        }
      });
      if (msgs.length) warnBox.appendChild(el("div", "adm__warn", msgs.join("<br>")));
      imgLab.innerHTML = "<b>" + (picked.images.length
        ? picked.images.length + " image(s) chosen"
        : "Choose render image(s)") + "</b><br>first one is the cover";
      imgLab.appendChild(imgIn);
      blendLab.innerHTML = "<b>" + (picked.blend
        ? tidy(picked.blend.name) + " · " + fmtSize(picked.blend.size)
        : "Choose .blend") + "</b><br>optional";
      blendLab.appendChild(blendIn);
    }

    imgIn.onchange = function () {
      picked.images = Array.prototype.slice.call(imgIn.files);
      checkFiles();
    };
    blendIn.onchange = function () {
      picked.blend = blendIn.files[0] || null;
      checkFiles();
    };

    var addBtn = el("button", "btn btn--primary", "Add to the site");
    addBtn.style.width = "100%";
    addBtn.onclick = function () {
      if (!fTitle.value.trim()) { alert("Give it a title first."); return; }
      if (!picked.images.length) { alert("Pick at least one image."); return; }

      var paths = picked.images.map(function (f) {
        var p = "assets/renders/" + tidy(f.name);
        files[p] = f;
        return p;
      });

      var p = {
        title: fTitle.value.trim(),
        year: fYear.value.trim(),
        category: fCat.value.trim(),
        cover: paths[0],
        images: paths.slice(1),
        description: fDesc.value.trim(),
        software: fSw.value.split(",").map(function (s) { return s.trim(); }).filter(Boolean)
      };
      if (fFeat.checked) p.featured = true;
      if (picked.blend) {
        var bp = "files/" + tidy(picked.blend.name);
        files[bp] = picked.blend;
        p.blend = {
          url: bp,
          size: fmtSize(picked.blend.size),
          license: "Free to use · credit appreciated"
        };
      }

      // Preview straight away using the file the user just picked.
      p._preview = URL.createObjectURL(picked.images[0]);
      list.unshift(p);
      apply();

      fTitle.value = ""; fDesc.value = ""; fCat.value = "";
      fFeat.checked = false;
      imgIn.value = ""; blendIn.value = "";
      picked = { images: [], blend: null };
      checkFiles();
      box.scrollTop = 0;
    };
    sec.appendChild(addBtn);
    box.appendChild(sec);

    /* ── Export ── */
    var out = el("div", "adm__sec", "<h3>Save to your site</h3>");
    var dl = el("div", "adm__dl");

    var dlJs = el("button", "btn btn--primary", "1 · Download projects.js");
    dlJs.onclick = function () {
      download("projects.js", new Blob([toFile()], { type: "text/javascript" }));
    };
    dl.appendChild(dlJs);

    var dlAssets = el("button", "btn btn--ghost", "2 · Download the files, renamed");
    dlAssets.onclick = function () {
      var keys = Object.keys(files);
      if (!keys.length) {
        alert("No new files this session — you've already got them.");
        return;
      }
      keys.forEach(function (path, i) {
        setTimeout(function () {
          download(path.split("/").pop(), files[path]);
        }, i * 400);   // stagger, browsers block rapid-fire downloads
      });
    };
    dl.appendChild(dlAssets);
    out.appendChild(dl);

    out.appendChild(el("ol", "adm__steps",
      "<li>Put the downloaded <code>projects.js</code> into <code>data/</code> on GitHub " +
        "(Add file ▸ Upload files — same name overwrites).</li>" +
      "<li>Put the images into <code>assets/renders/</code> and any <code>.blend</code> " +
        "into <code>files/</code>.</li>" +
      "<li>Commit. Cloudflare redeploys in about a minute.</li>" +
      "<li>Deleted something? Also delete its old image and .blend on GitHub " +
        "so they're not left behind.</li>"));

    var reset = el("button", "linkbtn", "Discard my local changes");
    reset.style.cssText = "background:none;border:0;color:var(--faint);cursor:pointer;" +
      "font:inherit;font-size:12.5px;margin-top:14px;text-decoration:underline";
    reset.onclick = function () {
      if (!confirm("Throw away local changes and go back to what's published?")) return;
      localStorage.removeItem(LS_KEY);
      location.reload();
    };
    out.appendChild(reset);

    box.appendChild(out);
    panel.appendChild(box);
    document.body.appendChild(panel);
  }

  /* ── Start ────────────────────────────────────────────── */

  function start() {
    if (!window.Gallery) return;              // app.js hasn't run
    var draft = loadDraft();
    list = draft || (window.Gallery.get() || []).slice();
    build();
    if (draft) window.Gallery.set(list.slice());
    renderList();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
