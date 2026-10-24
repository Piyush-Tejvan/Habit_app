"use client";

import { ArrowIcon } from "@/components/arrow-icon";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";

type Field = "firstName" | "email" | "action" | "sevenDays" | "consent";
type Errors = Partial<Record<Field, string>>;
type Fields = {
  firstName: string;
  email: string;
  action: string;
  sevenDays: string;
  consent: boolean;
  website: string;
};
const initialFields: Fields = {
  firstName: "",
  email: "",
  action: "",
  sevenDays: "",
  consent: false,
  website: "",
};

function validate(fields: Fields): Errors {
  const errors: Errors = {};
  if (!fields.firstName.trim())
    errors.firstName = "Please enter your first name.";
  else if (fields.firstName.trim().length > 60)
    errors.firstName = "Please keep your first name to 60 characters or fewer.";
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim()) ||
    fields.email.length > 254
  )
    errors.email = "Please enter a valid email address.";
  if (fields.action.trim().length < 3)
    errors.action =
      "Please name one everyday action you would like to practice.";
  else if (fields.action.trim().length > 300)
    errors.action = "Please keep your action to 300 characters or fewer.";
  if (!["yes", "unsure", "no"].includes(fields.sevenDays))
    errors.sevenDays = "Please choose yes, unsure, or no.";
  if (!fields.consent)
    errors.consent =
      "Please agree to be contacted about this pilot before continuing.";
  return errors;
}

export default function RequestForm({ demo }: { demo: boolean }) {
  const [fields, setFields] = useState<Fields>(initialFields);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<
    "idle" | "loading" | "error" | "demo" | "saved"
  >("idle");
  const [message, setMessage] = useState("");
  const requestId = useRef<string | null>(null);
  const submitting = useRef(false);
  const started = useRef(false);
  const form = useRef<HTMLFormElement>(null);
  const result = useRef<HTMLDivElement>(null);
  const pendingErrorFocus = useRef<Field | null>(null);

  useEffect(() => {
    if (status === "saved") result.current?.focus();
    if (status === "error" && pendingErrorFocus.current) {
      // Wait for the loading fieldset to be enabled in the committed render.
      form.current?.querySelector<HTMLElement>(`[name="${pendingErrorFocus.current}"]`)?.focus();
      pendingErrorFocus.current = null;
    }
  }, [status]);

  function update<K extends keyof Fields>(key: K, value: Fields[K]) {
    setFields((current) => ({ ...current, [key]: value }));
    if (key !== "website")
      setErrors((current) => ({ ...current, [key]: undefined }));
    if (status === "demo") {
      setStatus("idle");
      setMessage("");
    }
    // An edit creates a different request. A retry of unchanged data retains its ID.
    requestId.current = null;
    if (!started.current) {
      started.current = true;
      if (!demo) track("request_started");
    }
  }

  function focusFirstError(nextErrors: Errors) {
    const first = Object.keys(nextErrors)[0];
    const element = form.current?.querySelector<HTMLElement>(
      `[name="${first}"]`,
    );
    element?.focus();
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const nextErrors = validate(fields);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      focusFirstError(nextErrors);
      return;
    }
    submitting.current = true;
    pendingErrorFocus.current = null;
    setStatus("loading");
    setMessage("");
    requestId.current ??= crypto.randomUUID();
    try {
      const response = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fields,
          firstName: fields.firstName.trim(),
          email: fields.email.trim(),
          action: fields.action.trim(),
          requestId: requestId.current,
        }),
        signal: AbortSignal.timeout(20000),
      });
      const data = await response.json();
      if (!response.ok || data.status === "error") {
        if (data.errors && typeof data.errors === "object") {
          const safeErrors: Errors = {};
          for (const key of [
            "firstName",
            "email",
            "action",
            "sevenDays",
            "consent",
          ] as Field[]) {
            if (typeof data.errors[key] === "string")
              safeErrors[key] = data.errors[key];
          }
          setErrors(safeErrors);
          pendingErrorFocus.current = (Object.keys(safeErrors)[0] as Field | undefined) ?? null;
        }
        setStatus("error");
        setMessage(
          response.status === 429
            ? "Too many attempts just now. Please wait a little before trying again."
            : "We couldn’t confirm your request. Please review the form and try again. No booking or payment has been made.",
        );
      } else if (data.status === "saved") {
        setStatus("saved");
        setMessage(
          "Your request has been received. This is not a booking or payment. We’ll contact you with pilot details when they are ready.",
        );
        track("request_submitted");
        setFields(initialFields);
      } else if (data.status === "demo") {
        setStatus("demo");
        setMessage(
          "Demo complete. No request was sent or stored. The pilot request service needs to be connected before it can receive your details.",
        );
      } else {
        throw new Error("Unconfirmed response");
      }
    } catch {
      setStatus("error");
      setMessage(
        "We couldn’t confirm your request. Check your connection and try again. Retrying the same details won’t create a second request.",
      );
    } finally {
      submitting.current = false;
    }
  }

  if (status === "saved")
    return (
      <div ref={result} tabIndex={-1} className="request-success" role="status">
        <span className="request-success-icon" aria-hidden="true">
          ✓
        </span>
        <h3>One small step, taken.</h3>
        <p>{message}</p>
        <Link className="button button-primary" href="/sample">
          Try the sample lesson <ArrowIcon />
        </Link>
      </div>
    );

  const error = (field: Field) =>
    errors[field] ? (
      <p className="request-field-error" id={`${field}-error`}>
        {errors[field]}
      </p>
    ) : null;
  const busy = status === "loading";
  return (
    <form
      ref={form}
      method="post"
      action="/api/request"
      onSubmit={submit}
      noValidate
      className="request-form"
      aria-busy={busy}
    >
      <fieldset disabled={busy} className="request-fields">
        <div className="request-field">
          <label htmlFor="firstName">
            First name <span aria-hidden="true">*</span>
          </label>
          <input
            id="firstName"
            name="firstName"
            autoComplete="given-name"
            maxLength={60}
            value={fields.firstName}
            onChange={(event) => update("firstName", event.target.value)}
            aria-invalid={!!errors.firstName}
            aria-describedby={errors.firstName ? "firstName-error" : undefined}
            required
            placeholder="What should we call you?"
          />
          {error("firstName")}
        </div>
        <div className="request-field">
          <label htmlFor="email">
            Email address <span aria-hidden="true">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={254}
            value={fields.email}
            onChange={(event) => update("email", event.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            required
            placeholder="you@example.com"
          />
          {error("email")}
        </div>
        <div className="request-field">
          <label htmlFor="action">
            What would you like to practice? <span aria-hidden="true">*</span>
          </label>
          <textarea
            id="action"
            name="action"
            rows={3}
            maxLength={300}
            value={fields.action}
            onChange={(event) => update("action", event.target.value)}
            aria-invalid={!!errors.action}
            aria-describedby={`action-hint${errors.action ? " action-error" : ""}`}
            required
            placeholder="For example, reading two pages after dinner"
          />
          <p className="request-field-hint" id="action-hint">
            One everyday action is enough. Please leave out sensitive personal
            details.
          </p>
          {error("action")}
        </div>
        <fieldset
          className="request-radio-group"
          aria-describedby={errors.sevenDays ? "sevenDays-error" : undefined}
          aria-invalid={!!errors.sevenDays}
        >
          <legend>
            Could a small version fit into seven consecutive days?{" "}
            <span aria-hidden="true">*</span>
          </legend>
          <div className="request-radio-options">
            {[
              ["yes", "Yes"],
              ["unsure", "Unsure"],
              ["no", "No"],
            ].map(([value, label]) => (
              <label
                key={value}
                className={fields.sevenDays === value ? "selected" : ""}
              >
                <input
                  name="sevenDays"
                  type="radio"
                  value={value}
                  checked={fields.sevenDays === value}
                  onChange={() => update("sevenDays", value)}
                  required
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
          <p className="request-field-hint">
            An honest “unsure” or “no” is welcome.
          </p>
          {error("sevenDays")}
        </fieldset>
        <div className="request-trap" aria-hidden="true">
          <label htmlFor="website">Leave this field empty</label>
          <input
            id="website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={fields.website}
            onChange={(event) => update("website", event.target.value)}
          />
        </div>
        <div className="request-consent">
          <label>
            <input
              name="consent"
              type="checkbox"
              checked={fields.consent}
              onChange={(event) => update("consent", event.target.checked)}
              aria-invalid={!!errors.consent}
              aria-describedby={`consent-hint${errors.consent ? " consent-error" : ""}`}
              required
            />
            <span>
              I agree to be contacted by Do.Theory about this pilot.{" "}
              <span aria-hidden="true">*</span>
            </span>
          </label>
          <p id="consent-hint" className="request-field-hint">
            Your progress won’t be public. Read our{" "}
            <Link href="/privacy">draft privacy notice</Link> before sending.
          </p>
          {error("consent")}
        </div>
        <button
          className="button button-primary request-submit"
          type="submit"
          disabled={busy}
        >
          {busy
            ? "Checking your request…"
            : demo
              ? "Try the demo form"
              : "Request pilot details"}
          {busy ? <span aria-hidden="true">◌</span> : <ArrowIcon />}
        </button>
      </fieldset>
      {message && (
        <div
          className={`request-result request-result-${status}`}
          role={status === "error" ? "alert" : "status"}
        >
          {message}
        </div>
      )}
      <p className="request-bottom-note">
        No payment. No commitment. No automatic enrollment.
      </p>
    </form>
  );
}
