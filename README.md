# Do.Theory

A prelaunch website for **One Action, 7 Days**, based on the Do.Theory Week 2 report (7 October 2026). Built with Next.js App Router, TypeScript, React, and Tailwind CSS. Original SVG illustrations and CSS motion keep the experience light; reduced-motion preferences are respected. No account, checkout, public tracker, or outbound messaging.

## Run locally

Use Node.js 20.9+ (validated with Node 24) and npm.

```sh
npm ci
npm run dev
```

The dev server uses port 3000. `/` explains the pilot, `/sample` builds a personal action card, `/request` demonstrates the request flow, and `/privacy` describes actual handling and unresolved launch details.

```sh
npm run build
npm start
npm run typecheck
npm run lint
npm test
```

`npm test` runs focused action-card, server-validation, persistence-adapter, and endpoint tests. Persistence tests use mocks; they do not establish that a live Supabase project works.

Browser tests: `npx playwright install chromium`, then `npm run test:e2e`. To use system Chromium, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium`. Set `PLAYWRIGHT_BASE_URL` to test an already-running server; otherwise the tests start a development server on port 3100.

## Storage configuration

Without both variables, the request page is a clearly labelled demo: the server validates the request and returns a demo response without persisting personal data. A real confirmation appears only after server persistence succeeds.

1. Create a Supabase project.
2. Apply [the database migration](supabase/migrations/202610240001_pilot_requests.sql) in its SQL editor.
3. Copy `.env.example` to `.env.local` and supply `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`, or set them securely in your host. Never commit values or prefix the key with `NEXT_PUBLIC_`.
4. Restart the server and test an operator-controlled request end to end. Verify row creation, duplicate request-ID handling, and denied reads/inserts with anon and authenticated credentials.

The adapter uses server-side HTTPS REST writes. The table enables RLS and revokes public access; no client SDK or public-read endpoint exists. Form errors are retryable; repeating unchanged details uses the same request ID. Rate limiting is process-local, not a distributed abuse-prevention service.

Sample plans live only in page memory, not local storage or the database. Copy and print are visitor-controlled. Names, emails, free text, and action cards are excluded from the analytics interface. Analytics is disabled until an adapter is deliberately configured in `lib/analytics.ts`; demo requests never emit `request_submitted`.

## Content and launch settings

`lib/content.ts` holds the offer settings, curriculum, inclusions, FAQs, and process copy. Dates, channel, contact/operator identity, request-retention policy, and final payable amount remain unset. See [the publication checklist](docs/launch.md), including the report’s proposed refund terms requiring operational confirmation. Requests show interest, not paid demand or evidence of behavior change.

The privacy page is an explicit draft. Do not open public data collection until operator identity, privacy contact, request retention, live storage, and the delivery arrangement have been confirmed. No deployment, payment, or external messaging was performed.

Tooling note: ESLint 9 matches the declared peer ranges of Next.js’s import, React, and accessibility plugins. npm currently reports a deprecation notice for it; revisit this pin when those plugins support ESLint 10.
