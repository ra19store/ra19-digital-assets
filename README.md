# RA19 Digital Assets — Storefront

Static marketing + checkout storefront for **RA19 Digital Assets** (a small catalogue of
ready-to-use aviation annual-audit packages: ICAO / USOAP, IATA IOSA, and MRO & AOC
templates). Payments are handled by **Creem** (Merchant of Record). The site is a plain
static build deployed to **GitHub Pages** behind the custom domain
**https://ra19digitalassets.com**.

> This README is intentionally thorough so that a future developer or AI assistant can pick
> up the project without prior context. It is part of the published GitHub Pages artifact
> (the deploy uploads the whole repo), so **it must never contain secrets**. See
> [Credentials & Security](#credentials--security).

---

## 1. Live URLs

| Purpose | URL |
| --- | --- |
| Production site (canonical) | https://ra19digitalassets.com |
| Production `www` | https://www.ra19digitalassets.com → redirects to apex |
| GitHub Pages default URL | https://ra19store.github.io/ra19-digital-assets/ |
| GitHub repository | https://github.com/ra19store/ra19-digital-assets |
| Creem storefront (hosted) | https://creem.io/store/<store-name> *(optional, dashboard-managed)* |
| Gumroad (original source of the products) | A Gumroad storefront (link not published here) |

- **DNS / registrar:** Cloudflare (nameservers `novalee.ns.cloudflare.com`, `jasper.ns.cloudflare.com`).
- **Hosting:** GitHub Pages, built and deployed by GitHub Actions from `main`.
- **Payments:** Creem (live mode).

---

## 2. Tech stack & conventions

- **No framework, no build step.** Plain HTML + CSS + vanilla JS.
- Data lives in a single JS file (`products.js`) and is rendered client-side by `app.js`
  and small inline scripts per page.
- Design is a dark gradient theme defined in `styles.css` (CSS custom properties).
- Encoding: UTF-8. Line endings in the repo are LF (Git may warn about CRLF on Windows — this
  is harmless).
- Everything is served from the repository root by GitHub Pages.

---

## 3. Repository layout

```
ra19-digital-assets/
├─ index.html           Homepage: hero, featured products, catalogue by category, FAQ, footer
├─ product.html         Product detail page template (reads ?slug=<product-slug>)
├─ app.js               Shared logic: data helpers, link guard, toast, card builder
├─ products.js          SINGLE SOURCE OF TRUTH: brand, categories, products, faq
├─ styles.css           Design system (dark gradient theme) + .legal styles
├─ 404.html             Not-found page
├─ terms.html           Terms of Service (compliance)
├─ privacy.html         Privacy Policy (compliance)
├─ refunds.html         Refund Policy (compliance)
├─ CNAME                Contains: ra19digitalassets.com
├─ store-assets/        Images: logo.png, og-cover.png, product-*.png
└─ .github/workflows/
   └─ deploy.yml        GitHub Actions → GitHub Pages deployment
```

There is **no** `.nojekyll` file; GitHub Pages is configured with `build_type: workflow`
(see §6), and the workflow uploads the repository root with `actions/upload-pages-artifact`.

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
- Pushing to `main` triggers `.github/workflows/deploy.yml`:
  `configure-pages` → `upload-pages-artifact` (path `.`) → `deploy-pages`.
- GitHub Pages site config: `build_type: workflow`, `source: main /`, custom domain set,
  `https_enforced: true`.
- Manage Pages settings via the API (gh CLI authenticated as `ra19store`):

  ```powershell
  gh api repos/ra19store/ra19-digital-assets/pages
  gh api -X PUT repos/ra19store/ra19-digital-assets/pages -f cname=ra19digitalassets.com
  gh api -X PUT repos/ra19store/ra19-digital-assets/pages -F https_enforced=true
  ```

To deploy, just commit and push to `main`; the action publishes within ~1 minute.

---

## 7. Custom domain, DNS & HTTPS

- Custom domain: `ra19digitalassets.com` (also committed as the `CNAME` file).
- DNS records created in the Cloudflare zone (all **DNS-only / not proxied**):
  - `A` `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
  - `AAAA` `@` → `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
  - `CNAME` `www` → `ra19store.github.io`
  - No CAA record (intentionally, so GitHub can issue certificates).
- **HTTPS** is enforced; the GitHub-issued certificate covers `ra19digitalassets.com` and
  `www.ra19digitalassets.com`.

> **Gotcha:** if the GitHub Pages TLS certificate ever gets stuck (HTTPS fails with a
> wrong-principal / `000` error), clear and re-add the custom domain to restart issuance:
> `PUT .../pages -f cname=""` then `PUT .../pages -f cname=ra19digitalassets.com`. The cert
> then moves `new → authorized → approved` and HTTPS starts working.

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
