# blangman.github.io

Personal site for Benjamin Langman. Plain HTML/CSS/JS, no build step, hosted on
GitHub Pages at **https://blangman.github.io**.

## Pages

| File | Page |
| --- | --- |
| `index.html` | Home — landing with photo, intro, and three cards into the site |
| `about.html` | About — the bio |
| `writing.html` | Writing — Hasty Pudding, The Harvard Lampoon, the novel |
| `cv.html` | CV — education, experience, skills, résumé PDF |
| `contact.html` | Contact — email, GitHub, LinkedIn |
| `404.html` | Shown for any unknown URL |

Shared: `styles.css`, `main.js`, and the `assets/` folder (see
`assets/README.md`). `robots.txt` and `sitemap.xml` help search engines index
the site under your name.

## Editing text

Open the relevant `.html` file and edit the words between the tags. Editable
spots are marked with `<!-- EDIT: ... -->`.

**The nav and footer are copied into every page.** If you change a nav link or
the footer, change it in all six HTML files (they're marked with a comment).

## Previewing before you publish

Open the file directly — changes show on reload, nothing goes live:

```bash
open ~/blangman.github.io/index.html
```

## Publishing

```bash
cd ~/blangman.github.io
git add -A
git commit -m "Update about page"
git push
```

GitHub Pages redeploys within a minute or two. Hard-reload (`Cmd+Shift+R`) if
the browser shows a stale version.

## Look and feel

All colors, widths, and fonts are CSS variables in `:root` at the top of
`styles.css`. Change `--accent` for a different accent color, `--measure` for
text width, etc. Dark mode follows the reader's system setting automatically.

## Two easter eggs

1. The period after "Benjamin Langman" in the footer is a link to this repo.
2. There's a message in the browser console (`main.js`).
