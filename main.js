"use strict";

// Small progressive-enhancement script. The site is fully readable without it.

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

  // Close the menu after tapping a link.
  navLinks.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      navLinks.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

// Highlight the nav link for whichever section is in view.
const linkFor = new Map();
document.querySelectorAll(".nav-links a").forEach((a) => {
  const id = a.getAttribute("href").slice(1);
  if (id) linkFor.set(id, a);
});

const sections = [...linkFor.keys()]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

if ("IntersectionObserver" in window && sections.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        linkFor.forEach((el) => el.classList.remove("is-active"));
        const active = linkFor.get(entry.target.id);
        if (active) active.classList.add("is-active");
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );
  sections.forEach((section) => observer.observe(section));
}
