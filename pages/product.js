/* RA19 — product detail page logic */
(function () {
  mountLayout("catalog");
  var b = STORE.brand;

  var slug = new URLSearchParams(location.search).get("slug");
  var p = slug ? findProduct(slug) : null;
  var main = document.getElementById("main");

  if (!p) {
    document.title = "Product not found — " + b.name;
    main.innerHTML =
      '<div class="wrap not-found">' +
        "<h1>Product not found</h1>" +
        "<p>That product doesn't exist or may have been moved.</p>" +
        '<a class="btn btn-grad" href="catalog.html">Browse all products</a>' +
      "</div>";
    return;
  }

  var cat = categoryById(p.category) || { name: "", colors: ["#22d3ee", "#ec4899"], icon: "📦" };
  var live = isLive(p);
  document.title = p.name + " — " + b.name;

  var buyBtn = live
    ? '<a class="btn btn-grad btn-lg" href="' + p.checkout + '" data-slug="' + p.slug + '">Buy now — ' + escapeHtml(p.price) + "</a>"
    : p.status === "coming"
    ? '<button class="btn btn-ghost btn-lg" type="button" data-coming="1">Coming soon</button>'
    : '<button class="btn btn-ghost btn-lg" type="button" data-slug="' + p.slug + '">Buy now — ' + escapeHtml(p.price) + "</button>";

  var related = relatedProducts(p, 3);

  main.innerHTML =
    '<section class="pdp">' +
      '<div class="blob blob-1" style="top:-300px;left:-200px"></div>' +
      '<div class="blob blob-2" style="top:-100px;right:-200px"></div>' +
      '<div class="wrap" style="position:relative;z-index:1">' +
        '<div class="crumbs">' +
          '<a href="index.html">Home</a><span class="sep">/</span>' +
          '<a href="catalog.html">Catalog</a><span class="sep">/</span>' +
          '<a href="catalog.html#cat-' + cat.id + '">' + escapeHtml(cat.name) + "</a>" +
          '<span class="sep">/</span><span>' + escapeHtml(p.name) + "</span>" +
        "</div>" +
        '<div class="pdp-grid">' +
          '<div class="pdp-media" style="--c1:' + cat.colors[0] + ';--c2:' + cat.colors[1] + '">' +
            (p.image
              ? '<img src="' + p.image + '" alt="' + escapeHtml(p.name) + '">'
              : '<div class="thumb"><span class="thumb-fallback">' + (cat.icon || "📦") + "</span></div>") +
          "</div>" +
          '<div class="pdp-info">' +
            (p.badge ? '<span class="badge" style="position:static;display:inline-block">' + escapeHtml(p.badge) + "</span>" : "") +
            '<div class="sub" style="margin-top:10px">' + escapeHtml(p.subtitle || cat.name) + "</div>" +
            "<h1>" + escapeHtml(p.name) + "</h1>" +
            '<p class="summary">' + escapeHtml(p.summary || "") + "</p>" +
            '<div class="regulator-row">' + (p.regulators || []).map(function (r) {
              return '<span class="reg-chip">' + escapeHtml(r) + "</span>";
            }).join("") + "</div>" +
            '<div class="pdp-price">' +
              '<span class="price grad-text">' + escapeHtml(p.price) + "</span>" +
              (p.oldPrice ? '<span class="old-price">' + escapeHtml(p.oldPrice) + "</span>" : "") +
              '<span style="color:var(--muted);font-size:.9rem">one-time payment</span>' +
            "</div>" +
            (p.bullets && p.bullets.length
              ? '<div class="feat">' + p.bullets.map(function (x) { return "<li>" + escapeHtml(x) + "</li>"; }).join("") + "</div>"
              : "") +
            '<div class="buy-card">' + buyBtn +
              '<div class="buy-note">Instant download · Secure checkout by Creem · Cards, PayPal, Apple &amp; Google Pay</div>' +
            "</div>" +
            (p.includes && p.includes.length
              ? '<div class="panel"><h3>📦 What\'s included</h3><ul>' +
                  p.includes.map(function (x) { return "<li>" + escapeHtml(x) + "</li>"; }).join("") +
                "</ul></div>"
              : "") +
            (p.specs && Object.keys(p.specs).length
              ? '<div class="panel"><h3>📋 Details</h3><table class="spec-table">' +
                  Object.keys(p.specs).map(function (k) {
                    return "<tr><td>" + escapeHtml(k) + "</td><td>" + escapeHtml(p.specs[k]) + "</td></tr>";
                  }).join("") +
                "</table></div>"
              : "") +
          "</div>" +
        "</div>" +
      "</div>" +
    "</section>" +
    (related.length
      ? '<section style="padding-top:0"><div class="wrap">' +
          '<div class="sec-head"><span class="eyebrow">Keep exploring</span><h2>Related products</h2></div>' +
          '<div class="related">' + related.map(productCard).join("") + "</div>" +
        "</div></section>"
      : "");

  bindCardActions(main);
})();
