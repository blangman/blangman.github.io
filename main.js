"use strict";

// Small progressive-enhancement script. Every page works without it.

// Current year in the footer.
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Mobile navigation toggle.
const toggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("nav");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  nav.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

// A hello for anyone who opens the console.
console.log(
  "%cIf you're reading this, you're my kind of person. Say hello: langmanbd@gmail.com",
  "font-family:Georgia,serif;font-size:13px;color:#a5352b"
);
