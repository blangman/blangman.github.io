# blangman.github.io

Personal site for Benjamin Langman. One page, plain HTML/CSS/JS, no build step.

Live at **https://blangman.github.io** once GitHub Pages is enabled
(Settings → Pages → Deploy from a branch → `main` / root).

## Files

| File | Purpose |
| --- | --- |
| `index.html` | All content. Editable regions are marked with `<!-- EDIT: ... -->` comments. |
| `styles.css` | Styling. Colors and spacing are CSS variables at the top (`:root`). |
| `main.js` | Optional niceties: mobile menu, active-nav highlight, footer year. Site works without it. |
| `assets/` | Photo, resume PDF, favicon — see `assets/README.md`. |

## Editing the text

Open `index.html` and edit the words between the tags. The comments point you
to each section:

- **Hero** — your name, one-line role, intro paragraph, and the email / GitHub /
  LinkedIn / resume links.
- **About** (`01`) — the two-paragraph "about me".
- **Experience** (`02`) — duplicate an `<article class="entry">` block to add a role.
- **Writing** (`03`) — add an excerpt with `<blockquote>` or a link inside a `.work` block.
- **Skills** (`04`) — edit the comma-separated lists.
- **Contact** (`05`) — the three links. Replace `YOUR-HANDLE` with your real
  LinkedIn slug (also in the hero).

## Changing the look

Everything visual keys off the variables in `:root` at the top of `styles.css` —
change `--accent` for a different accent color, `--maxw` for line width, etc.
Dark mode is handled automatically from the reader's system setting.

## Publishing changes

```bash
cd ~/blangman.github.io
git add -A
git commit -m "Update about section"
git push
```

GitHub Pages redeploys within a minute or two.
