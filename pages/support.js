/* RA19 — support page logic */
(function () {
  mountLayout("support");
  document.querySelectorAll("[data-support]").forEach(function (el) {
    el.href = "mailto:" + STORE.brand.supportEmail;
    el.textContent = STORE.brand.supportEmail;
  });
  document.getElementById("supportFaq").innerHTML = STORE.faq.map(function (item) {
    return "<li><b>" + escapeHtml(item.q) + "</b> " + escapeHtml(item.a) + "</li>";
  }).join("");
})();
