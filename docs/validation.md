# Validation — 24 October 2026

Prepared and checked in the cloud environment using Node 24.19.0, npm 11.9.0,
Next.js 16.4.3, and system Chromium.

- Frozen installation: `npm ci --cache /workspace/.npm-cache --no-audit --no-fund` passed.
- Production build and TypeScript check passed.
- ESLint passed without source warnings/errors. npm reports an ESLint 9 deprecation; see README for the plugin compatibility pin.
- 12 focused tests passed: action-card generation/validation, submission validation,
  private persistence payload/idempotency, endpoint errors, demo/saved distinction,
  spam protections, and rate limiting.
- 8 Playwright tests passed against the production server on port 3001. These cover
  all four pages at 360, 390, 768, and 1440px; keyboard navigation; curriculum;
  FAQs; mobile menu; sample presets/generation/editing/copy and fallback; print
  media; reduced motion; request errors, demo, loading, retries and success focus.
- Axe-core WCAG 2 A/AA and 2.1 AA checks reported zero violations on each initial
  page at desktop width. This is an automated audit, not a complete conformance
  certification or assistive-technology audit.
- Actual A4 PDF output: one-page action card, containing only the generated plan.
  Privacy printing after navigating from the sample was also verified, to catch
  retained stylesheet conflicts.
- Desktop and mobile screenshots inspected; examples are in this folder.

## Explicit limits

Supabase credentials were absent. Real demo requests were exercised and no
personal data was saved. Live persistence success, provider failure handling, and
idempotency were tested with mocks, not with a real Supabase project. Migration
policies were reviewed but have not been applied or tested against a live database.

Browser checks used Chromium only. Safari, Firefox, a screen reader, and real
mobile hardware were not tested. Analytics remains disabled. No messages, payments,
site deployment, or GitHub push occurred. Operator identity, contact, retention,
actual pilot dates/channel, and commercial commitments remain launch prerequisites.

The development environment installation/startup fields were saved as a draft;
publishing that environment snapshot is a user action, separate from website deployment.
