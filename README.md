# madebyabdulhadi.com

My 3D work — renders, and the `.blend` files behind them.

Static site: plain HTML, CSS and JavaScript. No build step, no npm, no framework.
The folder you're looking at *is* the website — GitHub stores it, Cloudflare Pages
serves it.

```
index.html          the page
admin.js            the Manage panel (only visible to me)
add.html            tool that writes new entries for me
styles.css          all styling
app.js              gallery + lightbox
data/projects.js    ← MY WORK GOES HERE
data/comments.js    comment settings (off until filled in)
assets/renders/     ← IMAGES GO HERE
files/              ← .BLEND FILES GO HERE
404.html            not-found page
_headers            Cloudflare caching + download rules
```

`add.html` isn't linked from anywhere on the site and is marked `noindex`, so it
won't show up in Google. It's safe to leave in the repo — it only generates text,
it can't change anything. Delete it if you'd rather it wasn't reachable at all.

If the gallery is ever empty it shows a "coming soon" panel instead of a blank
page.

---

## The Manage panel (top-left button)

Open `index.html` on your computer and there's a **+ Manage** button in the
top-left corner. It lets you:

- **add** a piece — pick the image and the `.blend`, fill in the fields
- **delete** a piece — the × on its row
- **reorder** — the ↑ ↓ arrows

Changes appear in the real gallery immediately and are remembered in your
browser, so you can shuffle things around and see how it looks before
committing to anything.

When you're happy, the bottom of the panel gives you two buttons:

1. **Download projects.js** — the finished file
2. **Download the files, renamed** — your images and `.blend`, correctly named

Then on GitHub: drop `projects.js` into `data/` (same filename overwrites),
the images into `assets/renders/`, the `.blend` into `files/`, and commit.

**Why the download step?** The site is static files on Cloudflare — there's no
server behind it, so no web page here can write into your repo. Making a real
upload button work would mean putting a GitHub token inside the page, and
anyone could read it out of the page source and take over the repo. The panel
does everything else and hands you the finished files instead.

### On the live site

The button is simply there on `madebyabdulhadi.com` — no hash, no unlocking.

That does mean visitors see it too. It can't hurt anything: the panel writes
nothing to the site, only to whoever's own browser storage, so a stranger
clicking "delete" changes their own screen and nothing else. But they *can*
see it, so if it ever bothers you:

| | |
|---|---|
| Hide it on this device | `https://madebyabdulhadi.com/#admin-off` |
| Bring it back | `https://madebyabdulhadi.com/#admin` |

If you'd rather it were invisible to everyone but you, say so — it's a
two-line change back to being hidden unless you unlock it.

### Deleting on the live site — read this

Deleting in the panel while you're on the live domain only changes **your**
browser. Visitors still see everything. The panel says so in an orange banner
when you're not on localhost.

To actually remove something from the site:

1. Delete it in the panel
2. **Download projects.js** at the bottom of the panel
3. Upload that file into `data/` on GitHub (same name overwrites)
4. Delete its image in `assets/renders/` and any `.blend` in `files/`

Or skip the panel entirely and edit `data/projects.js` on GitHub directly —
see *Removing, editing or reordering a piece* below.

## Adding a render — the easy way

Open **`add.html`** (double-click it, or visit `/add.html` on the live site).

Drag in the image and the `.blend`, fill in the fields, hit **Copy code**, and
paste the result into `data/projects.js`. It writes the code for you, so there's
no syntax to get wrong.

It also does the checking automatically:

- reads the real file size and fills it in
- warns when a `.blend` is over Cloudflare's 25 MB limit, before you waste a push
- warns when an image is over 5 MB, and hard-flags one over 25 MB (won't deploy)
- fixes messy filenames (`Lamp Render.JPG` → `lamp-render.jpg`) and tells you to
  rename the file to match

Nothing gets uploaded — a static site has no server to upload *to*. The page is
just a code generator that runs in your browser.

### Or by hand

1. Save the image into `assets/renders/` — e.g. `lamp-01.jpg`
2. Save the file into `files/` — e.g. `lamp.blend`
3. Open `data/projects.js`, copy an existing block, change the values.
4. Commit and push. Cloudflare rebuilds by itself.

Newest work goes at the top of the list. Categories create their own filter
buttons — reuse the same word to group pieces together.

## Removing, editing or reordering a piece

Everything on the page comes from the list in `data/projects.js`. Each piece is
one block that starts with `{` and ends with `},`.

**To delete a piece** — open `data/projects.js` on GitHub, click the pencil,
and delete the whole block from its opening `{` down to its closing `},`
(including that comma). Commit. It's gone from the site in about a minute.

A trailing comma after the last block is valid — you don't need to tidy up the
commas after deleting. Just always remove *whole* blocks.

Then delete the leftover files so they're not sitting in the repo: click the
image in `assets/renders/`, then the **⋯** menu → **Delete file**. Same for the
`.blend` in `files/`.

**To hide something without deleting it**, wrap it in `/*` and `*/`:

```js
/*
  {
    title: "Not ready yet",
    ...
  },
*/
```

**To reorder**, cut and paste the blocks — the page shows them top to bottom in
list order.

**To edit**, just change the text inside a block. Descriptions, titles, specs
and licence notes are all plain text.

### If the gallery goes blank

You've almost certainly broken the syntax — a missing `}` or a stray comma. The
fix: open `index.html` on your computer by double-clicking it, press **F12**,
and look at the **Console** tab. It names the line. Nothing is lost; correct it
and commit again.

To avoid it entirely, check locally before you push: edit the files on your
computer, double-click `index.html`, confirm it looks right, *then* upload.

## Size limits

| Limit | Value |
|---|---|
| Cloudflare Pages — max single file | **25 MB** |
| GitHub — hard reject per file | 100 MB |

Anything over 25 MB won't deploy — that goes for images *and* `.blend` files.

**Renders:** export JPG, not PNG. A 4K PNG out of Blender is ~40 MB; the same
image as JPG at 90% is about 3 MB and looks identical. Resize to 2560px on the
long edge if it's still heavy.

**Blend files over 25 MB:**

- *File → Clean Up → Purge Unused Data* — run it two or three times
- Delete simulation caches and high-res multires sculpt levels
- *File → Save As* → tick **Compress** in the sidebar — often halves it
- Still too big? Upload it to Drive/Dropbox/Gumroad and paste the full link as
  the `url`. The site detects an `https://` link and opens it in a new tab
  instead of downloading.

## Before going live

- [ ] Real email address in `index.html` (currently `hello@madebyabdulhadi.com`)
- [ ] Social links at the bottom of `index.html` — they stay hidden while they
      still point at `#`
- [ ] Rewrite the About paragraphs
- [ ] Add `assets/og.jpg` (1200×630) — the preview image when the link gets
      pasted into WhatsApp, Discord or Twitter

---

## Putting it on GitHub

**Option A — no command line.** On github.com: New repository → name it →
Create. On the empty repo page click **uploading an existing file**, then drag
in *the contents* of this folder (all the files, not the folder itself) →
Commit changes.

**Option B — git.**

```bash
git init && git add -A && git commit -m "Initial site"
```

```bash
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git && git branch -M main && git push -u origin main
```

## Putting it on Cloudflare Pages

Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** →
**Connect to Git** → pick the repo.

| Setting | Value |
|---|---|
| Framework preset | **None** |
| Build command | *(leave it empty)* |
| Build output directory | `/` |

Hit **Save and Deploy**. It goes live on a `*.pages.dev` address in about a minute.

## Turning on comments

Comments use **giscus** — each visitor's comment is stored as a GitHub
Discussion inside this repo. No server, no database, free forever. Only you can
post work; anyone can reply.

Each project gets its own thread, shown at the bottom of its pop-up.

1. The repo must be **public** (Settings → General → Danger Zone if it isn't).
2. Repo **Settings → General → Features → tick "Discussions"**.
3. Install the app: <https://github.com/apps/giscus> → Configure → pick this
   repo → Save.
4. Go to <https://giscus.app>, type your repo name into the *repository* box.
   Scroll down to the generated code block and copy the two long IDs:
   `data-repo-id` and `data-category-id`.
5. Open [data/comments.js](data/comments.js), paste them in, set
   `enabled: true`, push.

Until then the site shows a quiet "comments open soon" note — nothing breaks.

**Worth knowing:** commenters need a free GitHub account. That keeps spam near
zero without you moderating, but it does put a small barrier in front of
non-technical visitors. If you'd rather anyone could comment with no login,
swap giscus for [Cusdis](https://cusdis.com) — same idea, free tier, no account
needed to post, but you moderate by email.

To delete a comment or block someone: the **Discussions** tab of your repo.

## Connecting the domain

In the Pages project → **Custom domains** → **Set up a custom domain** →
enter `madebyabdulhadi.com`. Repeat for `www.madebyabdulhadi.com`.

Since the domain was bought through Cloudflare, the DNS records get created
automatically and HTTPS turns on by itself.

From then on, every push to GitHub redeploys the site.
