# RA19 Digital Assets — Storefront

Static marketing + checkout storefront for **RA19 Digital Assets** (a small catalogue of
ready-to-use aviation annual-audit packages: ICAO / USOAP, IATA IOSA, and MRO & AOC
templates). Payments are handled by **Creem** (Merchant of Record). The site is a plain
static build deployed to **Cloudflare Pages** behind the custom domain
**https://ra19digitalassets.com**.

> This README is intentionally thorough so that a future developer or AI assistant can pick
> up the project without prior context. It is part of the published site artifact
> (the deploy uploads the whole repo), so **it must never contain secrets**. See
> [Credentials & Security](#credentials--security).

---

## 1. Live URLs

| Purpose | URL |
| --- | --- |
| Production site (canonical) | https://ra19digitalassets.com |
| Production `www` | https://www.ra19digitalassets.com |
| Cloudflare Pages project URL | https://ra19-digital-assets.pages.dev |
| GitHub repository | https://github.com/ra19store/ra19-digital-assets |
| Creem storefront (hosted) | https://creem.io/store/<store-name> *(optional, dashboard-managed)* |
| Gumroad (original source of the products) | A Gumroad storefront (link not published here) |

- **DNS / registrar:** Cloudflare (nameservers `novalee.ns.cloudflare.com`, `jasper.ns.cloudflare.com`).
- **Hosting:** Cloudflare Pages, deployed by GitHub Actions from `main` (and directly via `wrangler`).
- **Payments:** Creem (live mode).

---

## 2. Tech stack & conventions

- **No framework, no build step.** Plain HTML + CSS + vanilla JS.
- Data lives in a single JS file (`products.js`) and is rendered client-side by `app.js`,
  `layout.js` (shared header/footer) and per-page scripts in `pages/`.
- Design is a dark gradient theme defined in `styles.css` (CSS custom properties).
- Encoding: UTF-8. Line endings in the repo are LF (Git may warn about CRLF on Windows — this
  is harmless).
- Everything is served from the repository root by Cloudflare Pages. Pages strips `.html`
  from URLs ("pretty URLs"), so internal links are **extensionless** (`/catalog`, not
  `/catalog.html`). Old `.html` URLs 301 via `_redirects`.

---

## 3. Repository layout

```
ra19-digital-assets/
├─ index.html           Homepage: hero, featured product, category cards, FAQ
├─ catalog.html         Full catalogue with category filter chips
├─ product.html         Product detail page (reads ?slug=<product-slug>)
├─ support.html         Support / contact page
├─ legal/
│  ├─ terms.html        Terms of Service (compliance)
│  ├─ privacy.html      Privacy Policy (compliance)
│  └─ refunds.html      Refund Policy (compliance)
├─ app.js               Shared logic: data helpers, link guard, toast, card builder
├─ layout.js            Shared header + footer renderer (mountLayout)
├─ pages/               Per-page scripts (home.js, catalog.js, product.js, support.js, legal.js, 404.js)
├─ products.js          SINGLE SOURCE OF TRUTH: brand, categories, products, faq
├─ styles.css           Design system (dark gradient theme) + .legal styles
├─ 404.html             Not-found page
├─ _headers             Cloudflare Pages security headers (CSP, HSTS, etc.)
├─ _redirects           Cloudflare Pages redirects (legacy .html -> clean URLs)
├─ robots.txt           Robots policy + sitemap pointer
├─ sitemap.xml          XML sitemap
├─ .well-known/
│  └─ security.txt      Security contact disclosure
├─ .gitignore           Blocks secrets (.env, keys, .creem/, .wrangler/)
├─ store-assets/        Images: logo.png, og-cover.png, product-*.png
├─ subdomains/          Notes for the future products.ra19digitalassets.com subdomain
└─ .github/workflows/
   └─ deploy.yml        GitHub Actions → Cloudflare Pages deployment
```

There is **no** `.nojekyll` file and no `CNAME` file — those were GitHub Pages-specific.
Cloudflare Pages applies `_headers` and `_redirects` automatically at the edge.

---

## 4. Data model (`products.js`)

`products.js` defines a single global object `STORE`:

```js
const STORE = {
  brand: {
    name, tagline, headline: [line1, line2], intro,
    supportEmail          // e.g. "support@ra19digitalassets.com"
  },
  categories: [ { id, name, short, tagline, icon, colors: [c1, c2] } ],
  products:   [ { ...product } ],
  faq:        [ { q, a } ]
};
```

### Product fields

| Field | Required | Notes |
| --- | --- | --- |
| `slug` | ✅ | Unique; used in `product.html?slug=<slug>` |
| `name` | ✅ | Product title |
| `category` | ✅ | Must match a `categories[].id` |
| `price` | ✅ | Display string, e.g. `"$149"` |
| `status` | ✅ | `"live"` (buyable) or `"coming"` (button disabled) |
| `checkout` | for live | Creem payment link: `https://creem.io/payment/prod_xxx` |
| `creemProductId` | for live | The Creem product id (kept for reference/admin) |
| `subtitle`, `summary`, `bullets[]`, `includes[]`, `specs{}`, `regulators[]` | – | Content |
| `image` | – | Path under `store-assets/` |
| `badge`, `oldPrice`, `featured` | – | Presentation |

**Helpers in `app.js`:** `productsIn()`, `featuredProducts()`, `findProduct()`,
`relatedProducts()`, `productUrl()`, `isLive()`, `guardLink()`, `toast()`,
`productCard()`, `categoryById()`, `escapeHtml()`, `bindCardActions()`, `year()`.

**Important:** a product only shows a working "Buy now" button when
`status === "live"` **and** `checkout` is set and does **not** contain the placeholder
`prod_REPLACE` (`UNSET_TOKEN` in `app.js`).

---

## 5. Product catalogue & Creem IDs (live)

| Product | Price | Creem product ID | Checkout link |
| --- | --- | --- | --- |
| Complete (ICAO + IOSA + MRO/AOC) | $399 | `prod_3iaUOlwgmlzUxkAxQV80tp` | https://creem.io/payment/prod_3iaUOlwgmlzUxkAxQV80tp |
| MRO & AOC (EASA / FAA / CAAP) | $199 | `prod_2LYaadOn6ArGnmOFi7tR0j` | https://creem.io/payment/prod_2LYaadOn6ArGnmOFi7tR0j |
| IOSA | $149 | `prod_4EWUyf0NzOktoiaqftfyg1` | https://creem.io/payment/prod_4EWUyf0NzOktoiaqftfyg1 |
| ICAO / USOAP CMA | $149 | `prod_1Au0D2vpjb7ZL4chscJZqM` | https://creem.io/payment/prod_1Au0D2vpjb7ZL4chscJZqM |

All four Creem products are configured with:
- `default_success_url` = `https://ra19digitalassets.com/`
- `image_urls` = `https://ra19digitalassets.com/store-assets/product-*.png`

**Ghost product:** `prod_VCWcdDDY91cpNmjLtr8YT` (old ICAO/USOAP) is in a broken state —
it appears in `GET /v1/products/search` but returns `404 Product not found` on GET/PATCH/
DELETE/archive. It is already `status: "archived"` (not sellable) but cannot be removed via
API. It must be purged by **Creem support**. It is no longer referenced anywhere in the site.

---

## 6. Deployment

- **Branch:** `main` (remote `origin` = `https://github.com/ra19store/ra19-digital-assets.git`).
- **Host:** Cloudflare Pages, project **`ra19-digital-assets`** (account id
  `8cd46e86027ee34a7b4d4b964eb75bcc`).
- Pushing to `main` triggers `.github/workflows/deploy.yml`, which runs
  `wrangler pages deploy . --project-name=ra19-digital-assets --branch=main`.
  It needs repo secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
- Manual deploy (local, from the repo root):

  ```powershell
  $env:CLOUDFLARE_API_TOKEN = "<token>"
  $env:CLOUDFLARE_ACCOUNT_ID  = "8cd46e86027ee34a7b4d4b964eb75bcc"
  & "$env:APPDATA\npm\wrangler.cmd" pages deploy . --project-name=ra19-digital-assets --branch=main
  ```

  (Requires `C:\Program Files\nodejs` on `$env:Path`; use `npm.cmd`/`wrangler.cmd`, not the
  `.ps1` shims.)

- Static config files applied automatically at the edge: `_headers` (security) and
  `_redirects` (legacy URL 301s).

---

## 7. Custom domain, DNS & HTTPS

- Custom domains on the Pages project: `ra19digitalassets.com` and `www.ra19digitalassets.com`
  (both `status: active`).
- DNS records in the Cloudflare zone (both **proxied / orange-cloud**):
  - `CNAME` `@` → `ra19-digital-assets.pages.dev` (Cloudflare flattens at the apex)
  - `CNAME` `www` → `ra19-digital-assets.pages.dev`
  - Email records (`MX`, SPF/DKIM `TXT`) are **untouched** — see §8.
- **HTTPS** is enforced; the certificate covers both hostnames. HSTS is sent via `_headers`
  (`max-age=63072000; includeSubDomains; preload`).

> **Note:** the site moved from GitHub Pages to Cloudflare Pages. The old GitHub Pages DNS
> (four `A` + four `AAAA` → `185.199.x.x`, `CNAME www → ra19store.github.io`) was replaced on
> 2026-10-20. A JSON snapshot of the previous DNS is kept locally (not in the repo).

---

## 8. Support email (Cloudflare Email Routing)

- Public support address on the website: **`support@ra19digitalassets.com`**
  (defined in `products.js` → `STORE.brand.supportEmail`; also present as static fallback in
  the HTML footers/legal pages and injected by JS into `#supportLink` and `[data-support]`).
- Routing: Cloudflare **Email Routing** on the `ra19digitalassets.com` zone:
  - MX: `route1/2/3.mx.cloudflare.net`
  - SPF TXT: `v=spf1 include:_spf.mx.cloudflare.net ~all`
  - DKIM TXT: `cf2024-1._domainkey`
  - Verified destination: a private inbox (not published in this file)
  - Rule (enabled): `support@ra19digitalassets.com` → forward to that private inbox
- **Verify the mail path** without sending a real message (SMTP probe to the MX, checking the
  `RCPT TO` response — should be `250` for a valid address, `550` for a random one).
- The link is a standard `mailto:` link. If a visitor's OS has no default mail handler,
  clicking it appears to "do nothing" — that is a client-side configuration issue, not a
  website defect.

---

## 9. Creem integration notes (for future work)

- Creem is the Merchant of Record; it handles tax, receipts, and delivery of the download link
  via `default_success_url` + email.
- **Base URLs:** `https://api.creem.io/v1` (live) and `https://test-api.creem.io/v1` (test).
  Auth header: `x-api-key: <creem key>`. Environments/keys are NOT interchangeable.
- **Useful endpoints:**
  - List/search products: `GET /v1/products/search` (note: `GET /v1/products` errors).
  - Get product: `GET /v1/products/{id}`
  - Update product: `PATCH /v1/products/{id}` with **snake_case** body
    (e.g. `{ "default_success_url": "...", "image_urls": ["..."] }`). `PUT` returns 404.
  - Create checkout: `POST /v1/checkouts` with **snake_case** body
    (`{ "product_id": "...", "success_url": "..." }`). camelCase is rejected.
- **Checkout link format:** use `https://creem.io/payment/prod_xxx` (not `/product/prod_xxx`).
- **Creem CLI:** `@creem_io/cli` (`creem.cmd` in `%APPDATA%\npm`). Requires Node on PATH
  (prepend `C:\Program Files\nodejs`). Use `npm.cmd` (npm.ps1 is blocked by execution policy).
  Commands: `products list|get|create|update|archive`, `checkouts create`, etc.
  `archive` requires `--yes` and `--environment live`.
- **Support email setting is NOT exposed via the API.** It is dashboard-only:
  **Settings → Business Details → Contact Email**. It must match the email shown on the
  website (this was an explicit compliance-review requirement).
- **Storefront** (optional): hosted at `creem.io/store/<name>`; configured in
  **Settings → Storefronts**. Creem custom domains must be a **subdomain** and only one per
  store.

---

## 10. Compliance review — history & status

Creem performed an account review. The first review returned **6 required changes**, all
resolved:

1. Publish a publicly reachable **Terms of Service** and link it from the footer → `terms.html`.
2. Publish a publicly reachable **Privacy Policy** and link it → `privacy.html`.
3. Replace placeholder support contact with a **real support email** → `support@ra19digitalassets.com`.
4. Move the storefront off the GitHub Pages project URL to a **production domain** → `ra19digitalassets.com`.
5. Make Terms / Privacy / Refund footer links point to their **own** pages (they previously all
   pointed at one page) → `terms.html`, `privacy.html`, `refunds.html`.
6. Fix the **"Buy now" → error page** — the original Creem checkout link used the wrong path
   (`/product/…`); corrected to `/payment/…`, and a broken product was rebuilt.

A second ("Changes Requested") round asked for one more thing:

7. The **Creem store settings support email** still listed the old Gmail address while the site
   showed `support@ra19digitalassets.com` — update **Settings → Business Details → Contact
   Email** in the Creem dashboard to match (dashboard-only; no API).

**Status:** the dashboard change was made and a **re-review has been requested** — awaiting the
result. Confirmed working deliverables: HTTPS site on the custom domain, legal pages, footer
links, support email forwarding, and four live Creem checkout products.

---

## 11. Development history (commit log)

| Commit | Summary |
| --- | --- |
| `fb0e068` | Initial commit: RA19 Digital Assets storefront |
| `80af421` | Rebuild as multi-category storefront: shared data, product detail pages, 404 |
| `a439a36` | Connect products to Creem: live checkout links for all 4 audit packages |
| `8106d66` | Add Terms, Privacy and Refund pages; real support email; fix Creem checkout links |
| `045f8e2` | Add CNAME for ra19digitalassets.com; canonical + absolute OG image URLs |
| `41c9726` | Trigger GitHub Pages certificate provisioning for custom domain (empty commit) |

> **History note:** On 2026-10-20 git history was rewritten (`git filter-repo`) to purge a
> personal Gmail address that had appeared in earlier commits. The old SHAs
> `fb0e068`/`80af421`/`a439a36`/`9b95fdc`/`9e6fc4c`/`33c9ba4`/`460d704` no longer exist
> remotely; the table above reflects the rewritten history.

---

## 12. Credentials & security

**Do NOT commit secrets to this repository — it is public** (GitHub Pages serves every file,
including this README). No keys or tokens are stored in the repo; they are exchanged
out-of-band and/or kept in the relevant dashboards:

| Credential | Where it lives | Notes |
| --- | --- | --- |
| Creem live API key | Creem dashboard → Developers | `x-api-key` for `api.creem.io`. Never commit. |
| Creem test API key | Creem dashboard → Developers | For `test-api.creem.io`. |
| Cloudflare API token(s) | Cloudflare → My Profile → API Tokens | Used for DNS + Email Routing automation. **Revoke after use.** |
| GitHub CLI auth | Local `gh` login as `ra19store` | Used for Pages settings. |
| Support inbox | A private mailbox (not published) | Destination of the forwarded support mail. |

Recommended hygiene: rotate/revoke any Cloudflare tokens created for one-off automation, and
keep the Creem key server-side only (it is never needed by the static site).

---

## 13. Open items / possible next steps

- Await the Creem re-review result; address any further feedback.
- Ask Creem support to delete the ghost product `prod_VCWcdDDY91cpNmjLtr8YT`.
- Optional: add more products/categories (copy an object in `products.js`).
- Optional: enable `Search Engine Indexing` in Creem storefront settings.
- Optional: use a subdomain (e.g. `pay.ra19digitalassets.com`) for the Creem storefront /
  custom domain. Note GitHub Pages allows only one custom domain per repo.

---

## 14. How to do common tasks

**Add a product**
1. Create the product in the Creem dashboard; copy its `prod_…` id.
2. In `products.js`, copy an existing product object and set `slug`, `name`, `category`,
   `price`, content fields, `image`, `status: "live"`, `creemProductId`, and
   `checkout: "https://creem.io/payment/prod_…"`.
3. Commit and push to `main`.

**Change the support email**
1. Update `STORE.brand.supportEmail` in `products.js` **and** the static fallbacks in the
   footers/legal pages (`index.html`, `product.html`, `terms.html`, `privacy.html`,
   `refunds.html`).
2. Update the same address in the **Creem dashboard → Settings → Business Details → Contact
   Email** so they match (compliance requirement).

**Deploy**
- `git push origin main` — GitHub Actions publishes automatically.
