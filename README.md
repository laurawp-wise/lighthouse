# Lighthouse

The lighthouse game rebuilt with Next.js App Router and TypeScript. The original
HTML prototype is preserved in `prototype/`; its styles, artwork, navigation and
room transitions are retained in the app.

## Local development

Use Node.js 22 or later.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Use the direction buttons or arrow keys to move.

## Validation and Workers preview

```sh
npm run lint
npm test
npm run typecheck
npm run build:worker
npm run preview
```

`build:worker` runs the Next.js production build and packages it using
`@opennextjs/cloudflare`. `preview` builds and serves it in the local Workers runtime.
`npm run deploy` deploys the already-built Worker through OpenNext.
`typecheck` generates Next.js route types before checking TypeScript, so it also
works in a fresh checkout without an existing build.

## Deployment

Every push to `main` runs `.github/workflows/deploy.yml`. Tests, lint and type
checking run as three separate jobs. The deployment job depends on all three
succeeding before it builds with OpenNext and deploys to Cloudflare Workers.
If any check fails, deployment is skipped.
The repository secrets are `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
To configure them interactively, run `bash scripts/setup-cloudflare-secrets.sh`.

The Worker name remains `lighthouse` and the live URL remains
https://lighthouse.lauraawp.workers.dev. No R2 cache or image service is required by
this client-side game. Do not commit secrets or generated build directories.
