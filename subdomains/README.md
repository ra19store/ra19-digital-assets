# Subdomain setup — `products.ra19digitalassets.com`

This folder documents how to stand up the **products subdomain** for future
product lines / dedicated product apps, without disturbing the main store.

## The model

| Host | Purpose | Hosted by |
| --- | --- | --- |
| `ra19digitalassets.com` | Main storefront (this repo) | Cloudflare Pages project **`ra19-digital-assets`** |
| `www.ra19digitalassets.com` | Redirects to apex | same project |
| `products.ra19digitalassets.com` | Future product apps / separate catalog | separate Cloudflare Pages project |

Cloudflare Pages allows **unlimited custom domains per project** and unlimited
projects on the free tier, so no Re this costs nothing.

## Two ways to enable the subdomain

### Option 1 — Same project, additional domain (simplest)
If the subdomain should serve the **same site**, add it as a custom domain to the
existing Pages project:

1. Cloudflare dashboard → **Workers & Pages → ra19-digital-assets → Custom domains**.
2. Add `products.ra19digitalassets.com`.
3. Pages creates the DNS record automatically (if the zone is in the same account);
   otherwise add a `CNAME products` → `ra19-digital-assets.pages.dev` in DNS.

No code change needed. The subdomain serves identical content.

### Option 2 — Separate project (for independent products)
If the subdomain will host **different** content (a separate app, a new product
line), create a second Pages project:

1. Push the new product's repo (or a subfolder via `--project-name`).
2. Create the Pages project, e.g. `ra19-products`.
3. Add custom domain `products.ra19digitalassets.com` to that project.
4. Point `products` DNS CNAME → `ra19-products.pages.dev`.

Then set `PRODUCTS_BASE` in this repo's `app.js` to
`"https://products.ra19digitalassets.com"` so product links cross over cleanly.

## DNS record (manual, if not auto-created)

```
Type   Name        Content                       Proxy
CNAME  products    ra19-digital-assets.pages.dev  Proxied
```

## Verified guards

- The main site's `_headers` applies strict security headers on **all** domains
  including the subdomain when using Option 1.
- `PRODUCTS_BASE` in `app.js` is the single switch for product-origin URLs.
