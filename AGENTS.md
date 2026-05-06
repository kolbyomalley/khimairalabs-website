# Agent guide — khimairalabs.com

This file is for AI agents working in this repository. It describes the project
layout, conventions, and how to perform common tasks without breaking things.

---

## What this repo is

The public marketing website for Khimaira Labs (`khimairalabs.com`).
A fully static site — plain HTML, CSS, and a few lines of JS. No framework,
no build step. nginx serves the `src/` directory.

---

## Server infrastructure

This site runs on a shared VPS alongside other Khimaira Labs products.
The network topology is:

```
Internet
    │
    ▼ ports 80 / 443
[ gateway ]  /root/Documents/gateway/
    │  routes by domain; terminates SSL
    │
    └── khimairalabs.com ──► [ this container ]  khimairalabs-nginx:80
                                  nginx / Docker
                              /root/Documents/khimairalabs/
```

The `proxy` Docker network is the bridge between the gateway and this container.
The `khimairalabs_internal` network is isolated (no outbound internet) and
reserved for future internal services.

Other active sites on this server:
- `/root/Documents/tariffclassify/` — tariffclassify.ai (Next.js + Python API)
- `/root/Documents/gateway/` — shared reverse proxy (do not modify without care)

---

## Adding a product

Edit `src/index.html`. Find the `.product-grid` section and copy the
`.product-card--live` block. Update:
- `href` — the product URL
- `.tag` text — category label
- `.product-card__name` — product name
- `.product-card__desc` — one or two sentence description
- `.product-card__url` — bare domain (no https://)

No build step. Reload nginx after saving:
```bash
docker compose exec nginx nginx -s reload
```

---

## Styling

All CSS lives in `src/css/styles.css`. It uses CSS custom properties
(`--accent`, `--text-muted`, etc.) defined in `:root`. Match existing
patterns — do not introduce a CSS framework or preprocessor.

Design tokens:
| Token | Value | Use |
|-------|-------|-----|
| `--accent` | `#4f8ef7` | Links, tags, hover states |
| `--text` | `#e2e8f0` | Primary text |
| `--text-muted` | `#8892a4` | Secondary text |
| `--surface` | `#12161f` | Card backgrounds |
| `--border` | `#1e2736` | Card/section borders |

---

## JavaScript

`src/js/main.js` has one job: add `.nav--solid` to the `#nav` element on scroll.
Do not add third-party libraries. Keep interactivity to CSS where possible.

---

## Fonts

Inter is self-hosted in `src/fonts/inter/` (three woff2 files, committed).
Do not add Google Fonts or any external font CDN — the CSP blocks it and the
security policy forbids it.

To refresh fonts after a package version bump:
```bash
pnpm install
pnpm fonts
git add src/fonts/
```

---

## Dependencies

- All packages are pinned to exact versions (`save-exact=true` in `.npmrc`)
- Do not add packages published fewer than 7 days ago (see `SECURITY.md`)
- Run `pnpm audit` before committing any dependency change
- `pnpm-lock.yaml` must always be committed

---

## Docker

The container is defined in `docker-compose.yml`. Relevant details:
- Image: `nginx:1.27-alpine` pinned to SHA256
- No host port bindings — only reachable via the `proxy` network
- Volume mounts: `nginx.conf` (read-only) and `src/` (read-only)

To apply config changes without downtime:
```bash
docker compose exec nginx nginx -t          # validate config first
docker compose exec nginx nginx -s reload   # graceful reload
```

To redeploy after an image update:
```bash
docker compose up -d --force-recreate
```

---

## What NOT to touch

- `../gateway/` — modifying the gateway affects all sites on the server
- `../tariffclassify/` — separate project, separate team
- `src/fonts/inter/` — generated; edit `package.json` + run `pnpm fonts` instead
- Security headers in `nginx.conf` — any loosening needs an explicit decision

---

## Commit conventions

```
feat: add new product tile for <name>
fix: correct typo in CTA copy
style: adjust hero headline spacing
deps: bump @fontsource/inter 5.2.8 → 5.x.x
chore: update nginx image digest
```
