"use strict";

// Small progressive-enhancement script. Every page works without it.

// Current year in the footer.
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Mobile navigation toggle.
const toggle = document.querySelector(".nav-toggle");
const navLinks = document.getElementById("nav-links");

if (toggle && navLinks) {
  toggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  navLinks.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      navLinks.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

// A hello for anyone who opens the console. Easter egg #2.
console.log(
  "%cHi. If you're reading this, you're my kind of person. Say hello: langmanbd@gmail.com",
  "font-size:13px;color:#c05a34"
);
