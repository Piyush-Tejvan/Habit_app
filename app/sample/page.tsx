import type { Metadata } from "next";
import { ActionBuilder } from "../../components/action-builder";
import "./sample.css";

export const metadata: Metadata = {
  title: "Try a small action plan",
  description:
    "Try a free sample lesson. Make a realistic action card with a cue, a small version and a backup plan. No login needed.",
};

export default function SamplePage() {
  return (
    <main id="main" className="sample-page">
      <div className="container">
        <section className="sample-intro page-intro">
          <div className="sample-intro-copy">
            <p className="eyebrow">
              A little less theory. A little more doing.
            </p>
            <h1>
              Give your intention
              <br />a <em>place to start.</em>
            </h1>
            <p>
              Try a piece of Day 1. Choose something you want to do, make it
              small enough for a real day, and leave with your own action card.
            </p>
          </div>
          <div className="sample-time-note">
            <span>02—05</span>
            <p>
              minutes to make
              <br />a little plan
            </p>
          </div>
        </section>
        <ActionBuilder />
      </div>
    </main>
  );
}
