export const availabilityOptions = ["yes", "unsure", "no"] as const;
export type Availability = (typeof availabilityOptions)[number];
export type SubmissionField =
  "firstName" | "email" | "action" | "sevenDays" | "consent";
export type SubmissionErrors = Partial<Record<SubmissionField, string>>;

export interface PilotRequest {
  firstName: string;
  email: string;
  action: string;
  sevenDays: Availability;
  consent: true;
  requestId: string;
}

export type ValidationResult =
  | { valid: true; data: PilotRequest }
  | { valid: false; errors: SubmissionErrors; message?: string };

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** The server repeats validation; browser validation is only a convenience. */
export function validateSubmission(input: unknown): ValidationResult {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return {
      valid: false,
      errors: {},
      message: "Please send the request form as JSON.",
    };
  }
  const value = input as Record<string, unknown>;
  const firstName =
    typeof value.firstName === "string" ? value.firstName.trim() : "";
  const email =
    typeof value.email === "string" ? value.email.trim().toLowerCase() : "";
  const action = typeof value.action === "string" ? value.action.trim() : "";
  const errors: SubmissionErrors = {};
  if (!firstName || firstName.length > 60 || /[\x00-\x1f]/.test(firstName)) {
    errors.firstName = "Enter your first name (up to 60 characters).";
  }
  if (!emailPattern.test(email) || email.length > 254) {
    errors.email = "Enter a valid email address.";
  }
  if (
    action.length < 3 ||
    action.length > 300 ||
    /[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(action)
  ) {
    errors.action = "Describe one everyday action in 3–300 characters.";
  }
  if (!availabilityOptions.includes(value.sevenDays as Availability)) {
    errors.sevenDays = "Choose yes, unsure, or no.";
  }
  if (value.consent !== true) {
    errors.consent = "Please agree to be contacted about this pilot.";
  }
  if (Object.keys(errors).length) return { valid: false, errors };
  if (
    typeof value.requestId !== "string" ||
    !uuidPattern.test(value.requestId)
  ) {
    return {
      valid: false,
      errors: {},
      message: "Please reload the form and try again.",
    };
  }
  return {
    valid: true,
    data: {
      firstName,
      email,
      action,
      sevenDays: value.sevenDays as Availability,
      consent: true,
      requestId: value.requestId,
    },
  };
}

export interface RequestPersistence {
  save(request: PilotRequest): Promise<void>;
}

/** Server use only. Supply credentials in the route, never in browser code. */
export function createSupabasePersistence(
  url: string,
  serviceRoleKey: string,
  fetcher: typeof fetch = fetch,
): RequestPersistence {
  const parsed = new URL(url);
  if (parsed.protocol !== "https:" || parsed.username || parsed.password) {
    throw new Error(
      "Supabase must use an HTTPS project URL without embedded credentials.",
    );
  }
  const endpoint = new URL(
    "/rest/v1/pilot_requests?on_conflict=request_id",
    parsed.origin,
  );
  return {
    async save(request) {
      const response = await fetcher(endpoint, {
        method: "POST",
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
          Prefer: "resolution=ignore-duplicates,return=minimal",
        },
        body: JSON.stringify({
          request_id: request.requestId,
          first_name: request.firstName,
          email: request.email,
          everyday_action: request.action,
          seven_days_possible: request.sevenDays,
          contact_consent: request.consent,
          consent_version: "pilot-contact-v1",
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(10_000),
      });
      if (!response.ok) {
        // Do not expose provider messages or personal data to the browser/logs.
        throw new Error(`Request storage returned HTTP ${response.status}.`);
      }
    },
  };
}
