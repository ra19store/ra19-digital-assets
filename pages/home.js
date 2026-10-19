/* RA19 — homepage logic */
(function () {
  mountLayout("home");
  var b = STORE.brand;
  document.title = b.name + " — Premium Templates & Digital Toolkits";
  document.getElementById("heroTag").textContent = b.tagline;
  document.getElementById("heroIntro").textContent = b.intro;
  document.getElementById("heroHeadline").innerHTML =
    escapeHtml(b.headline[0]) + "<br /><span class=\"grad-text\">" + escapeHtml(b.headline[1] || "") + "</span>";

  document.getElementById("categoryCards").innerHTML = STORE.categories.map(function (c) {
    var count = productsIn(c.id).length;
    return '<a class="card" href="catalog#cat-' + c.id + '" style="--c1:' + c.colors[0] + ';--c2:' + c.colors[1] + '">' +
      '<div class="card-body" style="padding:30px 26px">' +
        '<div class="cat-icon" style="--c1:' + c.colors[0] + ';--c2:' + c.colors[1] + ';margin-bottom:16px">' + (c.icon || "📦") + "</div>" +
        "<h3>" + escapeHtml(c.name) + "</h3>" +
        '<p class="desc" style="flex:none;margin-top:8px">' + escapeHtml(c.tagline || "") + "</p>" +
        '<div class="price-row" style="border:0;padding-top:14px;margin-bottom:0"><span class="count-badge">' + count + " product" + (count === 1 ? "" : "s") + "</span><span class=\"link-sm\">Explore →</span></div>" +
      "</div></a>";
  }).join("");

  var tags = [];
  STORE.products.forEach(function (p) {
    (p.regulators || []).forEach(function (r) { if (tags.indexOf(r) === -1) tags.push(r); });
  });
  if (!tags.length) tags = ["Instant delivery", "Lifetime updates", "Secure checkout"];
  document.getElementById("marquee").innerHTML =
    tags.concat(tags).map(function (t) { return "<span>" + escapeHtml(t) + "</span>"; }).join("");

  var feat = featuredProducts();
  if (feat.length) {
    document.getElementById("featured").style.display = "";
    var p = feat[0];
    var live = isLive(p);
    var action = live
      ? '<a class="btn btn-grad btn-lg" href="' + p.checkout + '" data-slug="' + p.slug + '">Get it now →</a>'
      : '<a class="btn btn-ghost btn-lg" href="' + productUrl(p) + '">View details →</a>';
    document.getElementById("featuredWrap").innerHTML =
      '<div class="featured-banner">' +
        '<div class="featured-img">' + (p.image ? '<img src="' + p.image + '" alt="' + escapeHtml(p.name) + '">' : "") + "</div>" +
        '<div class="featured-body">' +
          "<h3>" + escapeHtml(p.name) + "</h3>" +
          "<p>" + escapeHtml(p.summary || "") + "</p>" +
          '<div class="regulator-row">' + (p.regulators || []).map(function (r) {
            return '<span class="reg-chip">' + escapeHtml(r) + "</span>";
          }).join("") + "</div>" +
          '<div class="feat">' + (p.bullets || []).map(function (x) { return "<li>" + escapeHtml(x) + "</li>"; }).join("") + "</div>" +
          '<div class="featured-cta">' +
            '<div><span class="old-price">' + escapeHtml(p.oldPrice || "") + '</span> <span class="price grad-text">' + escapeHtml(p.price) + '<small style="font-size:1rem"> one-time</small></span></div>' +
            action +
          "</div>" +
        "</div>" +
      "</div>";
    bindCardActions(document.getElementById("featuredWrap"));
  }

  document.getElementById("faqList").innerHTML = STORE.faq.map(function (item, i) {
    return "<details" + (i === 0 ? " open" : "") + "><summary>" + escapeHtml(item.q) + "</summary><p>" + escapeHtml(item.a) + "</p></details>";
  }).join("");
})();
