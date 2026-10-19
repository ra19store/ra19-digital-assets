/* =====================================================================
   RA19 DIGITAL ASSETS — shared layout (header + footer + nav)
   Included by every page so navigation and legal links stay in sync.
   ===================================================================== */

function renderHeader(active) {
  const b = STORE.brand;
  const nav = [
    { href: "index.html", label: "Home", key: "home" },
    { href: "catalog.html", label: "Catalog", key: "catalog" }
  ];
  let catLinks = STORE.categories
    .map((c) => `<a href="catalog#cat-${c.id}">${escapeHtml(c.short || c.name)}</a>`)
    .join("");
  nav.push({ html: `<div class="dropdown"><a href="catalog">Products</a><div class="dropdown-menu">${catLinks}</div></div>`, key: "products" });
  nav.push({ href: "support.html", label: "Support", key: "support" });

  const links = nav
    .map((n) => {
      if (n.html) return n.html;
      const cls = n.key === active ? ' style="color:#fff"' : "";
      return `<a href="${n.href}"${cls}>${escapeHtml(n.label)}</a>`;
    })
    .join("");

  return `
  <header class="nav">
    <div class="wrap nav-in">
      <a href="./" class="logo"><img src="store-assets/logo.png" alt="${escapeHtml(b.name)}" /> <span>${escapeHtml(b.name)}</span></a>
      <nav class="nav-links">${links}</nav>
      <a href="catalog" class="btn btn-grad btn-sm">Browse products</a>
    </div>
  </header>`;
}

function renderFooter() {
  const b = STORE.brand;
  return `
  <footer>
    <div class="wrap foot">
      <small>© <span class="js-year"></span> ${escapeHtml(b.name)}. All rights reserved.</small>
      <div class="foot-links">
        <a href="legal/terms">Terms</a>
        <a href="legal/privacy">Privacy</a>
        <a href="legal/refunds">Refund policy</a>
        <a href="support">Support</a>
        <a href="mailto:${escapeHtml(b.supportEmail)}">${escapeHtml(b.supportEmail)}</a>
      </div>
      <small>Payments powered by <b>Creem</b></small>
    </div>
  </footer>`;
}

function mountLayout(active) {
  const headerEl = document.getElementById("site-header");
  const footerEl = document.getElementById("site-footer");
  if (headerEl) headerEl.innerHTML = renderHeader(active);
  if (footerEl) footerEl.innerHTML = renderFooter();
  document.querySelectorAll(".js-year").forEach((el) => (el.textContent = year()));
}
