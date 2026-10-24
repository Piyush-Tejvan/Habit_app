# Do.Theory publication checklist

The website is a local prelaunch MVP. It does not take payments, enroll participants,
send email/WhatsApp messages, or prove willingness to pay. Requests and sample
interactions indicate interest only, not paid demand or successful behavior change.
The source is the Do.Theory Week 2 report dated 7 October 2026.

## Before making a public launch

- Confirm the legal/operator identity and a working contact address. Replace the
  corresponding unresolved privacy details; do not invent them.
- Set actual cohort start/end dates, delivery channel, facilitator availability,
  final payable amount (including any taxes/fees), and practical capacity. Ten is
  the planned operating maximum, not a remaining-seat claim.
- Confirm check-in arrangements and a working manual process to pause or stop them.
- Decide and document a specific retention period for pilot-detail requests, how
  consent withdrawal/deletion is handled, who has database access, and the hosting
  and storage locations. These are publication blockers, not implemented automation.
- Configure a Supabase project, apply the migration, and add server-only
  SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the host's secure settings.
- Test a real request end to end with an address controlled by the operator. Check
  that the row exists, retrying the same request ID does not add a duplicate, and
  anon/authenticated keys cannot select or insert rows. Remove the test row manually.
- Confirm server logs and hosting access logs do not capture form bodies. Hosting
  may process technical request metadata; check its actual policies before launch.
- The endpoint's eight attempts per 15 minutes uses short-lived hashed address
  buckets in process memory. It is a basic single-instance safeguard; set trusted
  proxy headers correctly and add host-level shared rate limiting before a scaled
  deployment. It does not persist raw IP addresses.
- Confirm final privacy wording and add a verified contact route before collecting
  real personal data. No automated deletion, participant-log system, tracking
  pixels, or analytics provider is implied by this implementation.
- Test keyboard access, mobile layout, reduced motion, form errors and storage
  failures on the eventual host. An enabled analytics adapter must be reviewed for
  privacy first and must never receive names, email, action text, or generated cards.

## Proposed refund terms — internal, not live commitments

The report proposes a full refund on request through the end of Day 2, a full refund
if the organizer cancels, and processing within seven calendar days. The operator
must confirm the funding, actual payment/refund route, exact dates, final amount,
and contact process before presenting these as live customer commitments. This MVP
has no checkout and does not process refunds or payments.

## Database setup and privacy boundaries

Run `supabase/migrations/202610240001_pilot_requests.sql` in the Supabase SQL editor
(or apply with the Supabase CLI). The table enables row-level security, grants no
public policies, and explicitly revokes anon/authenticated access. Use the privileged
service-role key only on the server. The API sends writes via HTTPS to Supabase REST;
it does not expose public reads. There is no client Supabase SDK or public API key.

Stored fields: request ID, first name, email, chosen everyday action, seven-day
availability, explicit contact consent/version, and submission timestamp. Action
builder inputs remain in browser memory and are not submitted. Demo submissions are
validated but are neither written to disk nor sent to a storage provider. The API
has no outbound messaging. Failed storage requests show a retryable error rather
than a success claim. The request ID provides idempotency for retrying one submission;
a fresh form creates a new request ID, so it does not deduplicate by email.
