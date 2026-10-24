import { ArrowIcon } from "@/components/arrow-icon";
import type { Metadata } from "next";
import Link from "next/link";
import RequestForm from "@/components/request-form";
import { launch } from "@/lib/content";
import "./request.css";

export const metadata: Metadata = {
  title: "Request pilot details",
  description:
    "Find out about One Action, 7 Days, a small guided practice pilot by Do.Theory. Requesting details is not enrollment or payment.",
};

export const dynamic = "force-dynamic";

export default function RequestPage() {
  const demo = !(
    process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  return (
    <main id="main" className="request-page container">
      <div className="request-layout">
        <section className="request-intro">
          <Link className="text-link request-back" href="/">
            <ArrowIcon turn="back" /> Back to Do.Theory
          </Link>
          <p className="eyebrow">ONE ACTION, 7 DAYS</p>
          <h1>
            A little support.
            <br />A more workable <em>plan.</em>
          </h1>
          <p className="request-lead">
            Curious about the pilot? Leave your details and the one everyday
            action you would like to practice.
          </p>
          <div className="request-summary">
            <div>
              <span>THE EXPERIMENT</span>
              <p>
                One meaningful action.
                <br />
                Seven days of practice.
              </p>
            </div>
            <div>
              <span>THE PROPOSED PRICE</span>
              <p>
                ₹{launch.proposedPrice} once.
                <br />
                No automatic renewal.
              </p>
            </div>
          </div>
          <p className="request-note">
            We’re preparing a small, manually facilitated pilot. Dates and
            delivery arrangements are not announced. Requesting details is not
            enrollment, a booking, or payment.
          </p>
          <div className="request-mini-card" aria-hidden="true">
            <ArrowIcon />
            <p>
              Your action.
              <br />
              Your real day.
              <br />
              <em>Room to adjust.</em>
            </p>
          </div>
        </section>
        <section className="request-panel" aria-labelledby="request-title">
          <span className="request-panel-label">LET’S START SMALL</span>
          <h2 id="request-title">Request pilot details</h2>
          <p className="request-form-description">
            A few details, so we can share the offer when it is ready.
          </p>
          {demo && (
            <div className="request-demo-notice">
              <strong>You’re trying a local demo.</strong>
              <p>
                The request service is not connected. You can try the form, but
                no request will be sent or stored.
              </p>
            </div>
          )}
          <RequestForm demo={demo} />
        </section>
      </div>
    </main>
  );
}
