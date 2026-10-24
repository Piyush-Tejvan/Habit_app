import { ArrowIcon } from "@/components/arrow-icon";
import Link from "next/link";
import { PilotCTA } from "@/components/cta";
import { Curriculum } from "@/components/curriculum";
import { faqs, included, launch, steps } from "@/lib/content";
function Leaf({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="134"
      height="140"
      viewBox="0 0 134 140"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M66 131C64 92 68 60 81 24"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M72 79C39 82 21 61 22 34C52 34 73 46 72 79Z"
        fill="currentColor"
      />
      <path
        d="M76 59C75 27 94 12 119 12C119 40 102 60 76 59Z"
        fill="currentColor"
      />
      <path
        d="M67 111C42 109 30 95 32 75C54 77 69 90 67 111Z"
        fill="currentColor"
      />
    </svg>
  );
}
function HeroArtwork() {
  return (
    <div
      className="hero-art"
      aria-label="Illustrative reading action plan: after dinner, read two pages; on a difficult day, one paragraph."
    >
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <span className="art-star star-one" aria-hidden="true">
        ✳
      </span>
      <span className="art-star star-two" aria-hidden="true">
        ✧
      </span>
      <div className="floating-tag">
        <span className="small-dot" /> Made for your real day
      </div>
      <div className="action-paper">
        <div className="paper-top">
          <span>ONE ACTION, 7 DAYS</span>
          <ArrowIcon />
        </div>
        <div className="book-illustration" aria-hidden="true">
          <svg width="164" height="110" viewBox="0 0 164 110" fill="none">
            <path
              d="M82 29C61 11 32 14 13 22L22 89C43 82 62 84 84 101C104 87 128 83 151 89L157 22C130 14 102 15 82 29Z"
              fill="#d7dfcb"
              stroke="#234a36"
              strokeWidth="2"
            />
            <path
              d="M82 30L84 99M25 30C42 25 61 29 71 37M27 41C44 36 60 40 72 48M29 52C46 47 61 51 73 59M31 63C48 59 61 63 73 71M94 38C110 28 130 28 144 32M94 49C111 39 130 39 143 43M95 60C112 50 128 50 142 54M95 71C110 62 127 61 140 65"
              stroke="#234a36"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M109 17V49L119 42L128 48V17"
              fill="#e9b997"
              stroke="#234a36"
              strokeWidth="1.5"
            />
          </svg>
        </div>
        <p className="paper-label">MY SMALL ACTION</p>
        <h2>
          Two pages.
          <br />
          <em>After dinner.</em>
        </h2>
        <p className="paper-body">
          When my plate is in the sink,
          <br />
          I’ll read two pages in my favourite chair.
        </p>
        <div className="paper-minimum">
          <ArrowIcon turn="down" />
          <div>
            <span>ON A DIFFICULT DAY</span>
            <strong>One paragraph is still reading.</strong>
          </div>
        </div>
        <div className="paper-bottom">
          <span>A plan, not a perfect streak.</span>
          <span aria-hidden="true">✳</span>
        </div>
      </div>
      <div className="little-note">
        <ArrowIcon turn="down" /> small counts, too.
      </div>
      <Leaf className="hero-leaf" />
      <span className="art-caption">AN EXAMPLE, NOT A PARTICIPANT RESULT</span>
    </div>
  );
}
export default function Home() {
  return (
    <main id="main">
      <section className="hero container">
        <div className="hero-copy">
          <div className="eyebrow status">
            <span className="small-dot" /> A SMALL PILOT. A REAL-LIFE
            EXPERIMENT.
          </div>
          <h1>
            Keep starting
            <br />
            and <em>stopping?</em>
            <span className="hero-subhead">
              Test one small action
              <br />
              for seven days.
            </span>
          </h1>
          <p className="hero-description">
            Choose one thing you want to do. Make it fit your day. Get private
            check-ins, help adjusting after a miss, and a plan for the following
            week.
          </p>
          <div className="hero-actions">
            <PilotCTA />
            <Link className="text-link" href="/sample">
              Try a sample lesson <ArrowIcon />
            </Link>
          </div>
          <p className="hero-price">
            One Action, 7 Days <span>·</span> Proposed pilot price{" "}
            <strong>₹{launch.proposedPrice} once</strong>
          </p>
          <p className="hero-fine">
            Prelaunch · Dates not yet announced · No automatic renewal
          </p>
        </div>
        <HeroArtwork />
      </section>
      <div className="principles-strip">
        <div className="container">
          <span>
            <ArrowIcon /> One action, chosen by you
          </span>
          <span>
            <span aria-hidden="true">◷</span> 8–12 minutes a day
          </span>
          <span>
            <span aria-hidden="true">⌁</span> Private, human check-ins
          </span>
          <span>
            <ArrowIcon turn="down" /> Room to begin again
          </span>
        </div>
      </div>
      <section className="problem section container">
        <div className="section-kicker">
          <span className="eyebrow">SOUND A LITTLE FAMILIAR?</span>
          <span className="section-index">01 / THE STARTING POINT</span>
        </div>
        <div className="problem-grid">
          <h2>
            You had the intention.
            <br />
            <em>Then life happened.</em>
          </h2>
          <div>
            <p>
              You decide to read every evening. The first few days feel good.
              Then a late meeting, a busy evening, a book left in your bag.
              Starting again feels bigger than it should.
            </p>
            <p>
              You might not need a bigger promise. You might need a smaller
              action, a clearer cue, and a little help adjusting the plan.
            </p>
            <span className="handwritten">Let’s work with your day.</span>
          </div>
        </div>
      </section>
      <section id="how-it-works" className="how-section section">
        <div className="container">
          <div className="section-kicker">
            <span className="eyebrow">LESS OVERTHINKING. MORE TRYING.</span>
            <span className="section-index">02 / HOW IT WORKS</span>
          </div>
          <div className="section-heading">
            <h2>
              Your action. Your real day.
              <br />
              <em>A plan you can adjust.</em>
            </h2>
            <p>
              Choose it. Make it manageable.
              <br />
              Test it, then review what to keep.
            </p>
          </div>
          <div className="steps-grid">
            {steps.map((step, index) => (
              <article className="step-card" key={step.number}>
                <div className="step-top">
                  <span>{step.number}</span>
                  <span
                    className={`step-symbol symbol-${index}`}
                    aria-hidden="true"
                  >
                    {index === 0 ? "✳" : index === 1 ? "◒" : "↻"}
                  </span>
                </div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
          <p className="section-footnote">
            Seven days is a practice experiment. It’s not a promise of a
            permanent habit.
          </p>
        </div>
      </section>
      <section className="included-section section container">
        <div className="included-intro">
          <span className="eyebrow">
            A LITTLE STRUCTURE. A HUMAN ON YOUR SIDE.
          </span>
          <h2>
            Small by design.
            <br />
            <em>Personal in practice.</em>
          </h2>
          <p>
            No content mountain to climb. Just a little guidance for the action
            that matters to you.
          </p>
          <div className="time-note">
            <span aria-hidden="true">◷</span>
            <p>
              <strong>Designed to fit, not take over.</strong>
              <br />
              About 10 minutes to set up. 8–12 minutes daily, including the
              action and check-in. Up to 15 minutes for your final review.
            </p>
          </div>
        </div>
        <div className="included-list">
          {included.map(([title, body], index) => (
            <article key={title}>
              <span className="included-number">0{index + 1}</span>
              <div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
              <ArrowIcon />
            </article>
          ))}
        </div>
      </section>
      <section id="your-week" className="curriculum-section section container">
        <div className="section-kicker">
          <span className="eyebrow">
            ONE ACTION. A DIFFERENT LENS EACH DAY.
          </span>
          <span className="section-index">03 / YOUR SEVEN DAYS</span>
        </div>
        <div className="section-heading">
          <h2>
            A week of doing.
            <br />
            <em>Not just knowing.</em>
          </h2>
          <p>
            Short lessons. One chosen action.
            <br />A useful next step, every day.
          </p>
        </div>
        <Curriculum />
      </section>
      <section className="sample-section section">
        <div className="container sample-teaser">
          <div className="sample-mini-card">
            <span className="eyebrow">A TINY PREVIEW</span>
            <span className="mini-flower" aria-hidden="true">
              ✳
            </span>
            <h3>
              “Read more” is an idea.
              <br />
              <em>
                “Two pages after dinner”
                <br />
                is a plan.
              </em>
            </h3>
            <div>
              <span>STANDARD</span>
              <strong>Read two pages</strong>
            </div>
            <div>
              <span>MINIMUM</span>
              <strong>Read one paragraph</strong>
            </div>
          </div>
          <div className="sample-teaser-copy">
            <span className="eyebrow">TRY BEFORE YOU DECIDE</span>
            <h2>
              Make your first
              <br />
              <em>small-action plan.</em>
            </h2>
            <p>
              Try a short sample lesson. Choose reading, tidying, a personal
              project, or something of your own. Leave with an action card you
              can actually use.
            </p>
            <Link href="/sample" className="button button-primary">
              Try a sample lesson <ArrowIcon />
            </Link>
            <span className="sample-promise">
              No email. No account. Just a useful little plan.
            </span>
          </div>
        </div>
      </section>
      <section className="offer-section section container" id="pilot">
        <div className="offer-card">
          <div>
            <span className="eyebrow">
              <span className="small-dot" /> THE FIRST DO.THEORY PILOT ·
              PRELAUNCH
            </span>
            <h2>
              One action.
              <br />
              Seven days.
              <br />
              <em>Let’s see what fits.</em>
            </h2>
            <p>
              A small, manually facilitated practice sprint.
              <br />
              An experiment we’re building with care.
            </p>
            <span className="capacity-note">
              Planned capacity: up to {launch.capacity} people per cohort.
              <br />
              That’s our support capacity, not a count of places left.
            </span>
          </div>
          <div className="offer-details">
            <span className="eyebrow">PROPOSED PILOT PRICE</span>
            <div className="price">
              ₹{launch.proposedPrice}
              <span>once</span>
            </div>
            <p>
              No automatic renewal.
              <br />
              No payment collected on this website.
            </p>
            <ul>
              <li>One action, shaped around your day</li>
              <li>Seven short lesson cards</li>
              <li>Private check-ins by agreement</li>
              <li>A written review + your next-week plan</li>
            </ul>
            <PilotCTA className="button button-apricot" />
            <span className="offer-disclaimer">
              Dates and delivery arrangements are not yet announced. Requesting
              details is not enrollment or payment.
            </span>
          </div>
        </div>
      </section>
      <section className="faq-section section container">
        <div>
          <span className="eyebrow">A FEW THINGS YOU MIGHT BE WONDERING</span>
          <h2>
            Good questions.
            <br />
            <em>Honest answers.</em>
          </h2>
          <p>
            This is an unvalidated pilot.
            <br />
            We’re testing the offer, too.
          </p>
        </div>
        <div className="faq-list">
          {faqs.map(([question, answer]) => (
            <details key={question}>
              <summary>
                {question}
                <span className="faq-plus" aria-hidden="true">
                  +
                </span>
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="closing-section">
        <div className="container closing-inner">
          <span className="closing-flower" aria-hidden="true">
            ✳
          </span>
          <span className="eyebrow">YOU DON’T HAVE TO REINVENT YOUR DAY.</span>
          <h2>
            Just find a little room
            <br />
            <em>for one thing that matters.</em>
          </h2>
          <PilotCTA />
          <p>Start with curiosity. Keep what works.</p>
        </div>
      </section>
    </main>
  );
}
