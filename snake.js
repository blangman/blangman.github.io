"use strict";

// A small, decorative snake game layered over the home page hero.
// The hero itself is the board; the tagline text and the headshot are
// the only walls (going off an edge wraps to the other side). Steer
// with arrow keys / WASD while the hero is in view. Progressive
// enhancement only — if this script fails to run, the hero still
// works exactly as a normal page.
(() => {
  const hero = document.querySelector(".hero");
  const tagline = document.querySelector(".tagline");
  const photo = document.querySelector(".photo-wrap");
  const layer = document.querySelector(".snake-layer");
  if (!hero || !tagline || !photo || !layer) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = layer.querySelector(".snake-canvas");
  const ctx = canvas && canvas.getContext("2d");
  const scoreEl = layer.querySelector(".snake-score");
  const msgEl = layer.querySelector(".snake-msg");
  if (!ctx || !scoreEl || !msgEl) return;

  const rootStyle = getComputedStyle(document.documentElement);
  const cssVar = (name, fallback) => (rootStyle.getPropertyValue(name).trim() || fallback);
  const COLOR_SNAKE = cssVar("--accent", "#8F7FE0");
  const COLOR_FOOD = cssVar("--ink", "#F2F0F6");
  const COLOR_EYE = cssVar("--bg", "#17151F");

  const CELL = 22;
  const TICK_MS = 140;
  const KEYS = {
    ArrowUp: { r: -1, c: 0 }, w: { r: -1, c: 0 },
    ArrowDown: { r: 1, c: 0 }, s: { r: 1, c: 0 },
    ArrowLeft: { r: 0, c: -1 }, a: { r: 0, c: -1 },
    ArrowRight: { r: 0, c: 1 }, d: { r: 0, c: 1 },
  };

  let cols, rows, obstacles;
  let snake, dir, nextDir, fruit, score, best, alive;

  try {
    best = Number(localStorage.getItem("snake-best")) || 0;
  } catch (e) {
    best = 0;
  }

  const cellKey = (cell) => `${cell.r},${cell.c}`;

  function rectToCells(rect, origin) {
    const left = rect.left - origin.left;
    const top = rect.top - origin.top;
    const c0 = Math.floor(left / CELL);
    const c1 = Math.floor((left + rect.width - 1) / CELL);
    const r0 = Math.floor(top / CELL);
    const r1 = Math.floor((top + rect.height - 1) / CELL);
    const cells = [];
    for (let r = r0; r <= r1; r++) {
      for (let c = c0; c <= c1; c++) cells.push(`${r},${c}`);
    }
    return cells;
  }

  // Nearest free (non-wall) cell to a preferred spot, spiraling outward.
  function freeCell(preferRow, preferCol) {
    for (let radius = 0; radius < cols + rows; radius++) {
      for (let dr = -radius; dr <= radius; dr++) {
        for (let dc = -radius; dc <= radius; dc++) {
          if (Math.abs(dr) !== radius && Math.abs(dc) !== radius) continue;
          const r = ((preferRow + dr) % rows + rows) % rows;
          const c = ((preferCol + dc) % cols + cols) % cols;
          const key = `${r},${c}`;
          if (!obstacles.has(key)) return { r, c };
        }
      }
    }
    return { r: 0, c: 0 };
  }

  function randomFreeCell(exclude) {
    for (let i = 0; i < cols * rows; i++) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);
      const key = `${r},${c}`;
      if (!obstacles.has(key) && !exclude.has(key)) return { r, c };
    }
    return freeCell(0, 0);
  }

  function setup() {
    const heroRect = hero.getBoundingClientRect();
    cols = Math.max(6, Math.floor(hero.clientWidth / CELL));
    rows = Math.max(6, Math.floor(hero.clientHeight / CELL));

    const dpr = window.devicePixelRatio || 1;
    canvas.width = cols * CELL * dpr;
    canvas.height = rows * CELL * dpr;
    canvas.style.width = `${cols * CELL}px`;
    canvas.style.height = `${rows * CELL}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    obstacles = new Set([
      ...rectToCells(tagline.getBoundingClientRect(), heroRect),
      ...rectToCells(photo.getBoundingClientRect(), heroRect),
    ]);

    reset();
    draw();
  }

  // A start cell with a genuinely clear run of rows both above it
  // (room for the starting tail) and below it (room to reach the
  // first fruit) — not just a free cell, since the tagline and photo
  // are wide enough that "free" alone doesn't mean "safe to sit in."
  // Scans column by column so it also copes with the stacked mobile
  // layout, where the tagline can span the full width.
  const START_LEN = 3;
  const RUNWAY = 5;
  function findStart() {
    for (let c = 0; c < cols; c++) {
      for (let r = START_LEN - 1; r <= rows - RUNWAY; r++) {
        let clear = true;
        for (let k = -(START_LEN - 1); k < RUNWAY; k++) {
          if (obstacles.has(`${r + k},${c}`)) { clear = false; break; }
        }
        if (clear) return { r, c };
      }
    }
    return freeCell(START_LEN - 1, Math.floor(cols / 2));
  }

  // Snake starts a little longer than a single dot, already moving
  // down, with a fruit already placed a few cells below the head (in
  // that same clear lane), so the very first tick shows what to do.
  function reset() {
    const start = findStart();
    snake = [];
    for (let i = 0; i < START_LEN; i++) {
      snake.push({ r: start.r - i, c: start.c });
    }
    dir = { r: 1, c: 0 };
    nextDir = dir;
    score = 0;
    alive = true;
    msgEl.hidden = true;
    scoreEl.textContent = "0";
    fruit = { r: Math.min(start.r + RUNWAY - 1, rows - 1), c: start.c };
  }

  function tick() {
    if (!alive) return;
    dir = nextDir;
    const head = snake[0];
    const newHead = {
      r: ((head.r + dir.r) % rows + rows) % rows,
      c: ((head.c + dir.c) % cols + cols) % cols,
    };
    const key = cellKey(newHead);
    const ateFruit = key === cellKey(fruit);

    const bodyKeys = new Set(snake.map(cellKey));
    if (!ateFruit) bodyKeys.delete(cellKey(snake[snake.length - 1]));

    if (obstacles.has(key) || bodyKeys.has(key)) {
      gameOver();
      return;
    }

    snake.unshift(newHead);
    if (ateFruit) {
      score += 1;
      scoreEl.textContent = String(score);
      if (score > best) {
        best = score;
        try { localStorage.setItem("snake-best", String(best)); } catch (e) {}
      }
      fruit = randomFreeCell(new Set(snake.map(cellKey)));
    } else {
      snake.pop();
    }

    draw();
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function draw() {
    ctx.clearRect(0, 0, cols * CELL, rows * CELL);

    ctx.fillStyle = COLOR_FOOD;
    ctx.beginPath();
    ctx.arc(fruit.c * CELL + CELL / 2, fruit.r * CELL + CELL / 2, CELL * 0.22, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = COLOR_SNAKE;
    snake.forEach((seg, i) => {
      const pad = i === 0 ? 1 : 3;
      roundRect(seg.c * CELL + pad, seg.r * CELL + pad, CELL - pad * 2, CELL - pad * 2, 6);
      ctx.fill();
    });

    // A couple of eye dots on the head, facing the direction of travel.
    const head = snake[0];
    const hx = head.c * CELL + CELL / 2;
    const hy = head.r * CELL + CELL / 2;
    const along = CELL * 0.18;
    const perp = { x: -dir.r, y: dir.c };
    ctx.fillStyle = COLOR_EYE;
    [-1, 1].forEach((s) => {
      ctx.beginPath();
      ctx.arc(
        hx + dir.c * along + perp.x * along * s,
        hy + dir.r * along + perp.y * along * s,
        CELL * 0.07, 0, Math.PI * 2
      );
      ctx.fill();
    });
  }

  function gameOver() {
    alive = false;
    const bestPart = best ? ` · best ${best}` : "";
    msgEl.textContent = `game over — score ${score}${bestPart} — press an arrow key to retry`;
    msgEl.hidden = false;
  }

  // Only steer (and stop page-scrolling on arrow keys) while the hero
  // is actually in view — once you've scrolled on to About, the keys
  // go back to being just keys.
  let heroVisible = true;
  if ("IntersectionObserver" in window) {
    heroVisible = false;
    new IntersectionObserver(
      ([entry]) => { heroVisible = entry.isIntersecting; },
      { threshold: 0.2 }
    ).observe(hero);
  }

  window.addEventListener("keydown", (e) => {
    const move = KEYS[e.key] || KEYS[e.key.toLowerCase()];
    if (!move || !heroVisible) return;
    e.preventDefault();
    if (!alive) {
      reset();
      draw();
      return;
    }
    if (snake.length > 1 && move.r === -dir.r && move.c === -dir.c) return;
    nextDir = move;
  });

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setup, 250);
  });

  setup();
  setInterval(tick, TICK_MS);
})();
