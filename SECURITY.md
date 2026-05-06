# Security Policy

## Dependency management

### Version pinning

All npm/pnpm dependencies are pinned to exact versions — no `^` or `~` ranges.
This is enforced via `.npmrc` (`save-exact=true`) and verified by code review.

To add a new package:
```bash
pnpm add <package>@<exact-version>
```
The `.npmrc` setting ensures the version is recorded without a range prefix.

### 7-day publish delay

Do not add a new package until it has been published for at least **7 days**.
This protects against typosquatting and "poisoned release" supply-chain attacks
where a malicious version is published and then quickly corrected.

Before running `pnpm add <package>@<version>`, verify the publish date:
```bash
pnpm info <package>@<version> time
# or check https://www.npmjs.com/package/<package>?activeTab=versions
```

If the version was published fewer than 7 days ago, pin to the previous stable
release until the waiting period passes.

### Lockfile

`pnpm-lock.yaml` is always committed. Never bypass it with `--no-frozen-lockfile`
in production or CI without an explicit review.

To update dependencies:
1. Run `pnpm update --latest`
2. Verify each bumped package was published ≥ 7 days ago
3. Run `pnpm audit`
4. Commit the updated `pnpm-lock.yaml`

## Docker image pinning

All Docker images in `docker-compose.yml` are pinned to SHA256 digests.
To update an image:
```bash
docker pull <image>:<tag>
docker inspect <image>:<tag> --format '{{index .RepoDigests 0}}'
# paste the new digest into docker-compose.yml
```

## No external CDN dependencies

The site has zero third-party script or font CDN calls. All assets are
self-hosted. This eliminates a class of supply-chain and privacy risks.

## Reporting a vulnerability

Email security@khimairalabs.com. We aim to respond within 48 hours.
