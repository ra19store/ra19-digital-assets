/* RA19 — catalog page logic */
(function () {
  mountLayout("catalog");

  var bar = document.getElementById("filterBar");
  bar.innerHTML = '<button class="chip active" type="button" data-filter="all">All products</button>' +
    STORE.categories.map(function (c) {
      return '<button class="chip" type="button" data-filter="' + c.id + '">' + escapeHtml(c.short || c.name) + "</button>";
    }).join("");

  var out = document.getElementById("categorySections");
  var secHtml = "";
  STORE.categories.forEach(function (cat) {
    var items = productsIn(cat.id);
    secHtml +=
      '<div id="cat-' + cat.id + '" class="cat-block" data-cat="' + cat.id + '" style="margin-bottom:64px">' +
        '<div class="cat-head">' +
          '<div class="cat-title">' +
            '<div class="cat-icon" style="--c1:' + cat.colors[0] + ';--c2:' + cat.colors[1] + '">' + (cat.icon || "📦") + "</div>" +
            "<div><h2>" + escapeHtml(cat.name) + '</h2><div class="cat-tag">' + escapeHtml(cat.tagline || "") + "</div></div>" +
          "</div>" +
          '<span class="count-badge">' + items.length + " product" + (items.length === 1 ? "" : "s") + "</span>" +
        "</div>";
    secHtml += items.length
      ? '<div class="grid">' + items.map(productCard).join("") + "</div>"
      : '<p style="color:var(--muted)">New products are on the way — check back soon.</p>';
    secHtml += "</div>";
  });
  out.innerHTML = secHtml;
  bindCardActions(out);

  bar.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-filter]");
    if (!btn) return;
    bar.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("active"); });
    btn.classList.add("active");
    var f = btn.dataset.filter;
    out.querySelectorAll(".cat-block").forEach(function (b) {
      b.style.display = f === "all" || b.dataset.cat === f ? "" : "none";
    });
  });

  var hash = location.hash.replace("#cat-", "");
  if (hash && categoryById(hash)) {
    var chip = bar.querySelector('[data-filter="' + hash + '"]');
    if (chip) chip.click();
  }
})();
