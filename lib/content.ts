export const launch = {
  status: "prelaunch",
  offer: "One Action, 7 Days",
  proposedPrice: 199,
  currency: "INR",
  capacity: 10,
  dates: null,
  deliveryChannel: null,
  contactAddress: null,
  operatorIdentity: null,
  retentionPeriod: null,
  finalPayableAmount: null,
  refundTermsConfirmed: false,
} as const;

export const steps = [
  {
    number: "01",
    title: "Choose one action.",
    body: "Something you already want to do. Read a little. Clear a surface. Start that personal project.",
    icon: "seed",
  },
  {
    number: "02",
    title: "Make room for real life.",
    body: "Find a standard version, a smaller version, and an everyday cue that works in your routine.",
    icon: "sun",
  },
  {
    number: "03",
    title: "Try. Adjust. Try again.",
    body: "Test your plan, get private check-ins, and change what gets in the way. A miss is information.",
    icon: "loop",
  },
] as const;
export const curriculum = [
  {
    day: 0,
    title: "Choose your action and preferences.",
    short: "Start with your why.",
    body: "Choose one meaningful everyday action, look at your recent attempts, and agree on your check-in preferences.",
    output: "Your first action plan",
    time: "About 10 minutes",
  },
  {
    day: 1,
    title: "Make the action manageable.",
    short: "Small enough for an ordinary day.",
    body: "Define a standard version that takes 2–5 minutes and a minimum version of about one minute. Both do a real part of your chosen action.",
    output: "A standard + minimum version",
    time: "8–12 minutes, including your action",
  },
  {
    day: 2,
    title: "Choose an observable cue.",
    short: "Give your action a place to begin.",
    body: "Connect the action to an event you can notice. “After I put my dinner plate in the sink” gives you something more concrete than “when I feel motivated.”",
    output: "A cue and a location",
    time: "8–12 minutes, including your action",
  },
  {
    day: 3,
    title: "Remove one practical barrier.",
    short: "Make the next attempt easier.",
    body: "Look at the steps between your cue and the action. Change one avoidable obstacle, such as leaving your book by your chair instead of in your bag.",
    output: "One barrier removed",
    time: "8–12 minutes, including your action",
  },
  {
    day: 4,
    title: "Plan for a disrupted day.",
    short: "A backup, without the catch-up.",
    body: "Choose a feasible alternative for when your usual cue disappears. A missed day does not mean doing twice as much tomorrow.",
    output: "A realistic backup plan",
    time: "8–12 minutes, including your action",
  },
  {
    day: 5,
    title: "Review attempts and adjust.",
    short: "Change one thing. Learn from it.",
    body: "Look at what helped and what got in the way. Adjust one part of your plan: the cue, the location, or the size of the action.",
    output: "An updated action card",
    time: "8–12 minutes, including your action",
  },
  {
    day: 6,
    title: "Practice with less prompting.",
    short: "Try your plan on your own terms.",
    body: "Use your own cue or reminder and try the same chosen action. Notice which support you want to keep.",
    output: "An independent attempt",
    time: "8–12 minutes, including your action",
  },
  {
    day: 7,
    title: "Review and plan the following week.",
    short: "Keep what fits. Change what doesn’t.",
    body: "Review your attempts with a facilitator and decide what to keep, modify, or stop. Leave with a written plan for your next week.",
    output: "Your closing review + next-week plan",
    time: "Up to 15 minutes",
  },
] as const;
export const included = [
  [
    "A plan that starts with you",
    "Day 0 action-plan setup, built around your real day.",
  ],
  [
    "A little guidance, each day",
    "Seven short, original lesson cards. No prior reading needed.",
  ],
  [
    "Private, human check-ins",
    "Check-ins by agreement and brief facilitator replies as needed. You can pause or stop.",
  ],
  [
    "Something to take forward",
    "A written closing review and a plan for the following week.",
  ],
] as const;
export const faqs = [
  [
    "Is this a book summary?",
    "No. This is a guided practice sprint built around an action you want to take. The lessons are original, and no book purchase or prior reading is required.",
  ],
  [
    "Will I form a permanent habit in seven days?",
    "There’s no guarantee of that. Seven days gives you a small practice experiment: a chance to test a plan in your real routine and decide what to try next.",
  ],
  [
    "What if I miss a day?",
    "We look at what made the opportunity difficult and adjust the next attempt. There is no punishment and no required catch-up.",
  ],
  [
    "Why pay when advice is free?",
    "Free advice and free programs may work well for you. The proposed paid value here is feedback on your own plan and attempts, with a written review at the end. Try the sample before deciding.",
  ],
  [
    "Is my participation public?",
    "No. There is no public progress feed, leaderboard, or requirement to share proof photos. Check-ins are private.",
  ],
  [
    "Can I pause or stop check-ins?",
    "Yes. You choose the arrangement and can pause or stop without giving a reason.",
  ],
  [
    "When does the pilot start?",
    "Dates and delivery arrangements are not yet announced. Requesting details is an expression of interest, not enrollment or payment.",
  ],
] as const;
