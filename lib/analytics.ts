"use client";
export type AnalyticsEvent =
  | "pilot_cta_clicked"
  | "sample_started"
  | "sample_completed"
  | "request_started"
  | "request_submitted";
type Adapter = (event: AnalyticsEvent) => void;
let adapter: Adapter | null = null;
// Deliberately disabled. Configure a reviewed, consent-appropriate adapter before launch.
// No free text, names, email addresses, or action cards are accepted by this interface.
export function configureAnalytics(next: Adapter | null) {
  adapter = next;
}
export function track(event: AnalyticsEvent) {
  try {
    adapter?.(event);
  } catch {
    /* Measurement must not break the experience. */
  }
}
