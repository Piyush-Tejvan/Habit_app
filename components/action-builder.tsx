"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import {
  actionPresets,
  createActionCard,
  validateActionPlan,
  type ActionChoice,
  type ActionPlan,
  type ActionPlanErrors,
} from "../lib/action-card";
import { track } from "../lib/analytics";

const fields: {
  key: keyof ActionPlan;
  label: string;
  hint: string;
  placeholder: string;
  wide?: boolean;
}[] = [
  {
    key: "action",
    label: "The action I want to practice",
    hint: "Pick one ordinary, low-risk action.",
    placeholder: "Read a little every day",
    wide: true,
  },
  {
    key: "why",
    label: "Why it matters to me",
    hint: "Your reason can be simple.",
    placeholder: "Make a little space for myself",
    wide: true,
  },
  {
    key: "standard",
    label: "My standard version",
    hint: "Something you can do in about 2–5 minutes.",
    placeholder: "read two pages",
  },
  {
    key: "minimum",
    label: "My minimum version",
    hint: "About one minute. Still part of the action.",
    placeholder: "read one paragraph",
  },
  {
    key: "cue",
    label: "When will I start?",
    hint: "An event you can notice. Begin with “I…”.",
    placeholder: "I finish my evening tea",
  },
  {
    key: "location",
    label: "Where will I do it?",
    hint: "A place you can actually use.",
    placeholder: "my favourite chair",
  },
  {
    key: "disruption",
    label: "If the day gets disrupted…",
    hint: "Name one likely change to your routine.",
    placeholder: "my evening runs late",
  },
  {
    key: "backup",
    label: "…my backup will be",
    hint: "Include a small action and another cue.",
    placeholder: "read one paragraph after brushing my teeth",
  },
];

function ChoiceIcon({ choice }: { choice: ActionChoice }) {
  if (choice === "reading")
    return (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M16 25c-4-3-8-3-12-2V7c5-1 8 0 12 3m0 15c4-3 8-3 12-2V7c-5-1-8 0-12 3m0 15V10" />
      </svg>
    );
  if (choice === "tidying")
    return (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M6 13h20v13H6zm-2-5h24v5H4zm9 10h6M16 3v3m8-1 2-2M8 5 6 3" />
      </svg>
    );
  if (choice === "project")
    return (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="m8 24-1 3 3-1L26 10l-4-4L8 20v4Zm12-16 4 4M5 8h9M5 13h5M17 26h10" />
      </svg>
    );
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 5v22M5 16h22M8 8l16 16M8 24 24 8" />
    </svg>
  );
}

function ArrowIcon({ down = false }: { down?: boolean }) {
  return (
    <svg
      className="builder-arrow-icon"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d={down ? "M5 5v13h13m-6-6 6 6-6 6" : "M6 18 18 6M6 6h12v12"} />
    </svg>
  );
}

export function ActionBuilder() {
  const [choice, setChoice] = useState<ActionChoice>("reading");
  const [plan, setPlan] = useState<ActionPlan>({
    ...actionPresets.reading.plan,
  });
  const [errors, setErrors] = useState<ActionPlanErrors>({});
  const [generated, setGenerated] = useState<ActionPlan | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "fallback">(
    "idle",
  );
  const started = useRef(false);
  const completed = useRef(false);
  const resultRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fallbackRef = useRef<HTMLTextAreaElement>(null);

  function begin() {
    if (!started.current) {
      track("sample_started");
      started.current = true;
    }
  }

  function selectChoice(value: ActionChoice) {
    begin();
    setChoice(value);
    setPlan({ ...actionPresets[value].plan });
    setErrors({});
    setCopyState("idle");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    begin();
    const nextErrors = validateActionPlan(plan);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      const first = Object.keys(nextErrors)[0];
      formRef.current
        ?.querySelector<HTMLInputElement>(`#plan-${first}`)
        ?.focus();
      return;
    }
    setGenerated({ ...plan });
    setCopyState("idle");
    if (!completed.current) {
      track("sample_completed");
      completed.current = true;
    }
    requestAnimationFrame(() => {
      resultRef.current?.focus({ preventScroll: true });
      resultRef.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "center",
      });
    });
  }

  async function copyCard() {
    if (!generated) return;
    const text = `${generated.action}\nWhy: ${generated.why}\n\n${createActionCard(generated)}\n\nMy Do.Theory action card`;
    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(text);
      setCopyState("copied");
    } catch {
      setCopyState("fallback");
      requestAnimationFrame(() => {
        fallbackRef.current?.focus();
        fallbackRef.current?.select();
      });
    }
  }

  function editCard() {
    formRef.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "start",
    });
    formRef.current
      ?.querySelector<HTMLInputElement>("#plan-action")
      ?.focus({ preventScroll: true });
  }

  return (
    <>
      <div className="builder-privacy">
        <ArrowIcon down />
        <p>
          No account, no submission. Your answers stay in this page&apos;s
          memory and disappear when you leave or refresh.
        </p>
      </div>
      <form
        className="builder-form"
        ref={formRef}
        onSubmit={submit}
        noValidate
        onFocus={begin}
      >
        <section className="builder-step">
          <div className="builder-step-heading">
            <span className="builder-step-number">01</span>
            <div>
              <p className="eyebrow">Start where you are</p>
              <h2>What would you like to do?</h2>
            </div>
          </div>
          <fieldset className="builder-choices">
            <legend className="builder-sr-only">
              Choose an everyday action
            </legend>
            {(Object.keys(actionPresets) as ActionChoice[]).map((value) => (
              <label
                key={value}
                className={`builder-choice${choice === value ? " is-selected" : ""}`}
              >
                <input
                  type="radio"
                  name="action-choice"
                  value={value}
                  checked={choice === value}
                  onChange={() => selectChoice(value)}
                />
                <span className="builder-choice-top">
                  <ChoiceIcon choice={value} />
                  <span className="builder-radio-mark" aria-hidden="true">
                    {choice === value ? "✓" : ""}
                  </span>
                </span>
                <strong>{actionPresets[value].label}</strong>
                <span>{actionPresets[value].detail}</span>
              </label>
            ))}
          </fieldset>
        </section>
        <section className="builder-step builder-details">
          <div className="builder-step-heading">
            <span className="builder-step-number">02</span>
            <div>
              <p className="eyebrow">Make room in a real day</p>
              <h2>A small plan. In your own words.</h2>
            </div>
          </div>
          <div className="builder-lesson-note">
            <ArrowIcon down />
            <p>
              <strong>Small still means doing.</strong> Opening a book is
              preparation. Reading one paragraph is a minimum action. Keep your
              minimum small, but make it count.
            </p>
          </div>
          <div className="builder-fields">
            {fields.map((field) => (
              <div
                key={field.key}
                className={`builder-field${field.wide ? " builder-field-wide" : ""}`}
              >
                <label htmlFor={`plan-${field.key}`}>{field.label}</label>
                <p id={`hint-${field.key}`}>{field.hint}</p>
                <input
                  id={`plan-${field.key}`}
                  value={plan[field.key]}
                  maxLength={300}
                  placeholder={field.placeholder}
                  required
                  aria-invalid={!!errors[field.key]}
                  aria-describedby={`hint-${field.key}${errors[field.key] ? ` error-${field.key}` : ""}`}
                  onChange={(event) => {
                    setPlan((previous) => ({
                      ...previous,
                      [field.key]: event.target.value,
                    }));
                    if (errors[field.key])
                      setErrors((previous) => ({
                        ...previous,
                        [field.key]: undefined,
                      }));
                  }}
                />
                {errors[field.key] && (
                  <span className="builder-error" id={`error-${field.key}`}>
                    {errors[field.key]}
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="builder-submit">
            <p>A useful first draft. You can adjust it as you go.</p>
            <button className="button button-primary" type="submit">
              {generated ? "Update my action card" : "Make my action card"}
              <ArrowIcon />
            </button>
          </div>
        </section>
      </form>
      {generated && (
        <section
          className="builder-result"
          ref={resultRef}
          tabIndex={-1}
          aria-label="Your generated action card"
        >
          <div className="builder-result-label">
            <p className="eyebrow">Made for your real life</p>
            <span>Do.Theory / Action card 01</span>
          </div>
          <div className="builder-card-print">
            <p className="eyebrow">One thing. A little more possible.</p>
            <h2>{generated.action}</h2>
            <p className="builder-card-why">Because: {generated.why}</p>
            <div className="builder-card-rule" />
            <p className="builder-card-text">
              When{" "}
              <strong>{generated.cue.trim().replace(/[.!?]+$/, "")}</strong> in{" "}
              <strong>
                {generated.location.trim().replace(/[.!?]+$/, "")}
              </strong>
              , I will{" "}
              <strong>
                {generated.standard.trim().replace(/[.!?]+$/, "")}
              </strong>
              .
            </p>
            <p className="builder-card-text">
              On a difficult day, I will{" "}
              <strong>{generated.minimum.trim().replace(/[.!?]+$/, "")}</strong>
              .
            </p>
            <p className="builder-card-text">
              If{" "}
              <strong>
                {generated.disruption.trim().replace(/[.!?]+$/, "")}
              </strong>
              , I will{" "}
              <strong>{generated.backup.trim().replace(/[.!?]+$/, "")}</strong>.
            </p>
            <p className="builder-card-footer">
              A plan to try, not a promise to be perfect. <span>do.theory</span>
            </p>
          </div>
          <div className="builder-card-actions">
            <button
              type="button"
              className="button button-primary"
              onClick={copyCard}
            >
              {copyState === "copied" ? "Copied ✓" : "Copy my card"}
            </button>
            <button
              type="button"
              className="button button-secondary"
              onClick={() => window.print()}
            >
              Print card
            </button>
            <button type="button" className="text-link" onClick={editCard}>
              Edit my plan <ArrowIcon />
            </button>
          </div>
          <p className="builder-copy-status" role="status">
            {copyState === "copied"
              ? "Your card is copied and ready to keep somewhere useful."
              : copyState === "fallback"
                ? "Clipboard access is unavailable. Your card is selected below: use your device’s Copy command."
                : ""}
          </p>
          {copyState === "fallback" && (
            <div className="builder-copy-fallback">
              <label htmlFor="action-card-copy">Copy your action card</label>
              <textarea
                id="action-card-copy"
                ref={fallbackRef}
                readOnly
                value={`${generated.action}\nWhy: ${generated.why}\n\n${createActionCard(generated)}`}
                rows={7}
              />
            </div>
          )}
        </section>
      )}
      <section className="sample-next">
        <div>
          <p className="eyebrow">A plan is a place to begin</p>
          <h2>
            Want help testing this
            <br />
            <em>for seven days?</em>
          </h2>
          <p>
            The pilot adds private check-ins, help after a miss, and a next-week
            plan. This sample is not enrollment or a validated assessment.
          </p>
        </div>
        <Link className="button button-primary" href="/request">
          Request pilot details <ArrowIcon />
        </Link>
      </section>
    </>
  );
}
