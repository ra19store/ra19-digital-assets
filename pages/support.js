/* RA19 — support page logic */
(function () {
  mountLayout("support");
  document.querySelectorAll("[data-support]").forEach(function (el) {
    el.href = "mailto:" + STORE.brand.supportEmail;
    el.textContent = STORE.brand.supportEmail;
  });

  var faq = STORE.faq.map(function (item, i) {
    return "<details" + (i === 0 ? " open" : "") + ">" +
      "<summary>" + escapeHtml(item.q) + "</summary>" +
      "<p>" + escapeHtml(item.a) + "</p>" +
    "</details>";
  }).join("");
  document.getElementById("supportFaq").innerHTML = faq;
})();
