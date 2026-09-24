#!/usr/bin/env bash
set -euo pipefail
gh auth status
printf 'Enter your Cloudflare API token at the hidden prompt below.\n'
gh secret set CLOUDFLARE_API_TOKEN --repo laurawp-wise/lighthouse --app actions
printf 'Enter your Cloudflare account ID at the hidden prompt below.\n'
gh secret set CLOUDFLARE_ACCOUNT_ID --repo laurawp-wise/lighthouse --app actions
printf 'Both GitHub Actions secrets have been saved.\n'
