"use strict";

// Current year in the footer.
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// A hello for anyone who opens the console.
console.log(
  "%cIf you're reading this, you're my kind of person. Say hello: langmanbd@gmail.com",
  "font-size:13px;color:#453C7C"
);
