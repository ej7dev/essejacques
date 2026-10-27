#!/usr/bin/env bash
# Builds the static site and publishes it to the Hostinger web space over SSH.
# Usage: DEPLOY_HOST=... DEPLOY_USER=... ./deploy.sh   (optional: DEPLOY_PORT, DEPLOY_PATH)
set -euo pipefail
: "${DEPLOY_HOST:?set DEPLOY_HOST}" "${DEPLOY_USER:?set DEPLOY_USER}"
PORT="${DEPLOY_PORT:-65002}"
DEST="${DEPLOY_PATH:-domains/essejacques.me/public_html}"

cd "$(dirname "$0")"
python3 scripts/prepare-media.py
npx nuxi generate
rsync -az --delete --exclude ".well-known" -e "ssh -p $PORT" .output/public/ "$DEPLOY_USER@$DEPLOY_HOST:$DEST/"

for path in / /about /portfolio /portfolio/cauris-pay /sitemap.xml; do
  printf "%-28s %s\n" "$path" "$(curl -s -o /dev/null -w '%{http_code}' "https://essejacques.me$path")"
done
printf "%-28s %s (expected 404)\n" "/page-that-does-not-exist" "$(curl -s -o /dev/null -w '%{http_code}' https://essejacques.me/page-that-does-not-exist)"
