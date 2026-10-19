/* RA19 — legal page logic */
(function () {
  mountLayout("");
  document.querySelectorAll("[data-brand]").forEach(function (el) { el.textContent = STORE.brand.name; });
  document.querySelectorAll("[data-support]").forEach(function (el) { el.textContent = STORE.brand.supportEmail; });
})();
