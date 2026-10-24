import { ArrowIcon } from "@/components/arrow-icon";
import type { Metadata } from "next";
import Link from "next/link";
import "../request/request.css";

export const metadata: Metadata = {
  title: "Draft privacy notice",
  description:
    "How the Do.Theory pilot website handles sample plans and pilot-detail requests.",
};

export default function PrivacyPage() {
  return (
    <main id="main" className="container privacy-page">
      <p className="eyebrow">A NOTE ABOUT YOUR INFORMATION</p>
      <h1>
        Your plan is personal.
        <br />
        <em>Let’s keep it that way.</em>
      </h1>
      <p className="privacy-lead">
        This draft explains the website as it works today. Do.Theory is
        preparing an unvalidated, manually facilitated pilot called One Action,
        7 Days.
      </p>
      <div className="privacy-draft">
        <p>
          <strong>Draft — not ready for public collection.</strong> The legal
          operator’s identity, a working privacy contact, and the retention
          period for requests must be confirmed before the live request service
          is opened. These are publication blockers, not features that already
          exist.
        </p>
      </div>
      <section>
        <h2>The sample lesson stays in your browser session.</h2>
        <p>
          The action-plan builder keeps your answers in page memory. It does not
          submit or save your action, reasons, or generated card to a server or
          browser storage. Refreshing or leaving the page clears the plan.
          Copying or printing creates a copy that you control.
        </p>
      </section>
      <section>
        <h2>What the request form asks for</h2>
        <p>
          The form asks for your first name, email address, one everyday action,
          whether a small version is realistic for seven consecutive days, and
          your agreement to be contacted about this pilot. Please do not include
          sensitive personal information. We do not ask for a phone number,
          payment information, or proof photos.
        </p>
        <p>
          When the server is connected to Supabase, a valid request is saved in
          a private database for the purpose of responding with pilot details. A
          request identifier and submission time are saved to support reliable
          processing. Browser visitors cannot read the submission table.
        </p>
      </section>
      <section>
        <h2>In demo mode, no request is sent.</h2>
        <p>
          When the storage service is not configured, the form is labelled as a
          local demo. Submitting it does not save your personal information
          locally or in a database. The server returns a demo message, not a
          registration confirmation. No email or other message is sent by this
          website in either mode.
        </p>
      </section>
      <section>
        <h2>Cookies, analytics, and basic protection</h2>
        <p>
          This website does not add advertising cookies or run third-party
          analytics by default. A small analytics adapter exists but is disabled
          until deliberately configured. If enabled later, its permitted events
          describe actions such as opening the sample or a confirmed request;
          names, emails, action text, and generated cards must not be included.
        </p>
        <p>
          Basic spam protection uses a hidden form field and temporary
          request-rate counters. Hosting and database providers may process
          technical request information under their own service settings. Their
          production logging and retention settings must be reviewed before
          launch.
        </p>
      </section>
      <section>
        <h2>Retention, access, and your choices</h2>
        <p>
          The operator must set and publish a specific retention period for
          request details and a working way to ask for access, correction,
          deletion, or withdrawal of contact consent before opening live
          collection. There is no automated deletion or participant-log
          retention system in this website.
        </p>
        <p>
          Requesting details does not enroll you in the pilot. Any future
          participant check-ins need their own agreed arrangements; you can
          pause or stop them. No public progress feed is planned.
        </p>
      </section>
      <section>
        <h2>Before this notice becomes final</h2>
        <ul>
          <li>Confirm the legal operator and privacy contact address.</li>
          <li>
            Set request retention, deletion handling, and authorized database
            access.
          </li>
          <li>
            Review hosting and Supabase processing arrangements and production
            logs.
          </li>
          <li>
            Test live submissions and consent handling, then update this notice
            to match the deployed service.
          </li>
        </ul>
      </section>
      <Link href="/request" className="privacy-back">
        <ArrowIcon turn="back" /> Back to request details
      </Link>
    </main>
  );
}
