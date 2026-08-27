/* ============================================================
   COMMENTS SETTINGS

   Comments are powered by giscus — visitors' comments are stored as
   GitHub Discussions inside your own repo. Free, nothing to host, and
   you delete/block anyone from the GitHub Discussions page.

   Until you fill this in, the site shows a small "comments coming soon"
   note instead. Nothing breaks.

   ── HOW TO FILL IT IN ────────────────────────────────────────
   1. Push this site to GitHub first (the repo must be PUBLIC).
   2. On the repo: Settings → scroll to Features → tick "Discussions".
   3. Install the giscus app:  https://github.com/apps/giscus
      → Configure → pick your repo → Save.
   4. Go to  https://giscus.app  and type your repo name in the
      "repository" box. Scroll down — it prints a code block containing
      data-repo-id and data-category-id. Copy those two values here.
   5. Set enabled to true. Push. Done.
   ============================================================ */

window.COMMENTS = {

  enabled: false,                    // ← flip to true once filled in

  repo:       "abdulhadi891/blender-app",
  repoId:     "R_kgDOT2U8eA",              // read from GitHub's public API
  category:   "Announcements",             // the Discussions category to use
  categoryId: "",                          // e.g. "DIC_kwDOK1a2b3c4d5"

  // "top" puts the write-a-comment box above the comments, "bottom" below.
  inputPosition: "top"

};
