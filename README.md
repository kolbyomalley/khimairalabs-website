# khimairalabs.com

Marketing and product-directory website for Khimaira Labs.

A static site served by nginx inside Docker. No build step required to run — the
`src/` directory is served directly. `pnpm` is only used to manage the self-hosted
Inter font files (dev dependency, committed output).

## Stack

| Layer | Technology |
|-------|-----------|
| Site | Static HTML / CSS / JS |
| Fonts | Self-hosted Inter (woff2) |
| Server | nginx 1.27 (Alpine) |
| Container | Docker Compose |
| SSL / routing | Gateway project (`../gateway`) |

## Local development

Serve the site locally on port 3001 (does not require the gateway):

```bash
docker compose up -d
# visit http://localhost:3001   (add -p 3001:80 to docker-compose.yml for local override)
```

Or with any static file server:
```bash
cd src && python3 -m http.server 3001
```

## Updating fonts

Fonts are committed to `src/fonts/inter/` and only need to be refreshed when
updating `@fontsource/inter`:

```bash
pnpm install
pnpm fonts        # copies woff2 files from node_modules → src/fonts/inter/
git add src/fonts/
```

Before bumping the font package version, verify it was published ≥ 7 days ago
(see `SECURITY.md`).

## Deploying

Deployment is handled by the root Docker Compose network.

### First deploy (new server)

```bash
# 1. Create the shared proxy network (once per server)
docker network create proxy

# 2. Start the gateway
cd ../gateway && docker compose up -d

# 3. Start this site
cd ../khimairalabs && docker compose up -d
```

### Updating content

```bash
# Edit files in src/, then:
docker compose exec nginx nginx -s reload
# or restart the container:
docker compose restart nginx
```

### Updating the nginx image

1. Pull: `docker pull nginx:1.27-alpine`
2. Get new digest: `docker inspect nginx:1.27-alpine --format '{{index .RepoDigests 0}}'`
3. Update digest in `docker-compose.yml`
4. Redeploy: `docker compose up -d --force-recreate`

## Adding a new product tile

Edit `src/index.html`. Copy the `.product-card--live` block and update:
- The `href` attribute
- The category tag text
- The `<h2>` name
- The `<p>` description
- The `.product-card__url` text

No build step needed — save and reload nginx.

## Files

```
khimairalabs/
├── docker-compose.yml    Container definition (nginx, networks)
├── nginx.conf            nginx config (security headers, caching, gzip)
├── package.json          pnpm config (dev deps: fonts only)
├── .npmrc                save-exact=true, engine-strict=true
├── scripts/
│   └── copy-fonts.js     Copies woff2 files from node_modules → src/fonts/
├── SECURITY.md           Dependency policy (pinning, 7-day delay, auditing)
├── AGENTS.md             Guide for AI agents working in this repo
└── src/
    ├── index.html
    ├── css/styles.css
    ├── js/main.js
    └── fonts/inter/      Committed woff2 files (latin 400/500/700)
```
