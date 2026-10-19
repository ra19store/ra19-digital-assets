/* =====================================================================
   RA19 DIGITAL ASSETS — shared storefront logic
   Used by index.html and product.html. Data comes from products.js.
   ===================================================================== */

const UNSET_TOKEN = "prod_REPLACE";

/* ---- site config ----------------------------------------------------
   SITE_BASE = canonical origin. Products live at the same origin today;
   if products move to products.ra19digitalassets.com later, only this
   (and the checkout/image URLs in products.js) need to change.
   --------------------------------------------------------------------- */
const SITE_BASE = "https://ra19digitalassets.com";
const PRODUCTS_BASE = ""; /* empty = same origin; set to "https://products.ra19digitalassets.com" to split */

function siteUrl(path) {
  return SITE_BASE + "/" + String(path).replace(/^\/+/, "");
}
function productsUrl(path) {
  const base = PRODUCTS_BASE || SITE_BASE;
  return base + "/" + String(path).replace(/^\/+/, "");
}

/* ---- data helpers ---- */
function productsIn(categoryId) {
  return STORE.products.filter((p) => p.category === categoryId);
}
function featuredProducts() {
  return STORE.products.filter((p) => p.featured);
}
function findProduct(slug) {
  return STORE.products.find((p) => p.slug === slug);
}
function relatedProducts(product, limit = 3) {
  const same = STORE.products.filter(
    (p) => p.category === product.category && p.slug !== product.slug
  );
  const others = STORE.products.filter(
    (p) => p.category !== product.category && p.slug !== product.slug
  );
  return [...same, ...others].slice(0, limit);
}
function productUrl(product) {
  return "product?slug=" + encodeURIComponent(product.slug);
}
function productShareUrl(product) {
  return productsUrl("product/" + encodeURIComponent(product.slug) + "/");
}
function isLive(product) {
  return product.status === "live" && product.checkout && !product.checkout.includes(UNSET_TOKEN);
}

/* ---- link guard ---- */
function guardLink(event, product) {
  if (product.status !== "live") {
    event.preventDefault();
    toast(`"${product.name}" isn't available yet — set status to "live" once it's ready.`);
    return;
  }
  if (!product.checkout || product.checkout.includes(UNSET_TOKEN)) {
    event.preventDefault();
    toast(`Add your Creem checkout link for "${product.name}" in products.js (field: checkout).`);
  }
}

let toastTimer;
function toast(message) {
  let el = document.getElementById("toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "toast";
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 5000);
}

/* ---- markup builders ---- */
function productCard(p) {
  const live = isLive(p);
  const c = categoryById(p.category) || { colors: ["#22d3ee", "#ec4899"] };
  const action = live
    ? `<a class="btn btn-grad" href="${p.checkout}" data-slug="${p.slug}">Buy now →</a>`
    : p.status === "coming"
    ? `<button class="btn btn-ghost" type="button" data-coming="${p.slug}">Coming soon</button>`
    : `<button class="btn btn-ghost" type="button" data-slug="${p.slug}">Buy now →</button>`;

  return `
  <article class="card" style="--c1:${c.colors[0]};--c2:${c.colors[1]}">
    <a class="thumb" href="${productUrl(p)}">
      ${p.badge ? `<span class="badge">${p.badge}</span>` : ""}
      ${p.image ? `<img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy">` : `<span class="thumb-fallback">${c.icon || "📦"}</span>`}
    </a>
    <div class="card-body">
      <h3><a href="${productUrl(p)}">${escapeHtml(p.name)}</a></h3>
      ${p.subtitle ? `<p class="subtitle">${escapeHtml(p.subtitle)}</p>` : ""}
      <p class="desc">${escapeHtml(p.summary || "")}</p>
      <ul class="feat">${(p.bullets || []).slice(0, 3).map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>
      <div class="price-row">
        <span class="price">${escapeHtml(p.price)}<small>one-time</small></span>
        ${p.oldPrice ? `<span class="old-price">${escapeHtml(p.oldPrice)}</span>` : ""}
      </div>
      <div class="card-actions">
        ${action}
        <a class="link-sm" href="${productUrl(p)}">Details</a>
      </div>
    </div>
  </article>`;
}

function categoryById(id) {
  return STORE.categories.find((c) => c.id === id);
}

function escapeHtml(str) {
  return String(str == null ? "" : str).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[m]));
}

function bindCardActions(root) {
  root.querySelectorAll("[data-slug]").forEach((el) => {
    el.addEventListener("click", (e) => {
      const p = findProduct(el.dataset.slug);
      if (p) guardLink(e, p);
    });
  });
  root.querySelectorAll("[data-coming]").forEach((el) => {
    el.addEventListener("click", () => toast("This product is coming soon."));
  });
}

function year() {
  return new Date().getFullYear();
}
