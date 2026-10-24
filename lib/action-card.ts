export type ActionChoice = "reading" | "tidying" | "project" | "custom";

export type ActionPlan = {
  action: string;
  why: string;
  standard: string;
  minimum: string;
  cue: string;
  location: string;
  disruption: string;
  backup: string;
};

export const actionPresets: Record<
  ActionChoice,
  { label: string; detail: string; plan: ActionPlan }
> = {
  reading: {
    label: "Read a little",
    detail: "A page, not a whole new personality.",
    plan: {
      action: "Read a little every day",
      why: "Make room for ideas I enjoy",
      standard: "read two pages",
      minimum: "read one paragraph",
      cue: "I finish my evening tea",
      location: "my favourite chair",
      disruption: "my evening runs late",
      backup: "read one paragraph after brushing my teeth",
    },
  },
  tidying: {
    label: "Clear some space",
    detail: "One small surface is a good start.",
    plan: {
      action: "Tidy a small part of my home",
      why: "Give myself a calmer place to start",
      standard: "clear a small table",
      minimum: "put away three items",
      cue: "I put my dinner plate in the sink",
      location: "the living room",
      disruption: "I get home later than planned",
      backup: "put away three items before getting ready for bed",
    },
  },
  project: {
    label: "Start that project",
    detail: "A small idea deserves a first sentence.",
    plan: {
      action: "Make a little progress on my personal project",
      why: "Spend some time on something that matters to me",
      standard: "write for five minutes",
      minimum: "write one sentence",
      cue: "I put my work laptop away",
      location: "my desk",
      disruption: "I cannot use my desk",
      backup: "write one sentence in my notebook after dinner",
    },
  },
  custom: {
    label: "Something of my own",
    detail: "Choose an everyday action that matters to you.",
    plan: {
      action: "",
      why: "",
      standard: "",
      minimum: "",
      cue: "",
      location: "",
      disruption: "",
      backup: "",
    },
  },
};

export type ActionPlanErrors = Partial<Record<keyof ActionPlan, string>>;

export function validateActionPlan(plan: ActionPlan): ActionPlanErrors {
  const errors: ActionPlanErrors = {};
  for (const key of Object.keys(plan) as (keyof ActionPlan)[]) {
    if (!plan[key].trim())
      errors[key] = "Add a few words so your plan is specific.";
    else if (plan[key].trim().length > 300)
      errors[key] = "Keep this to 300 characters or fewer.";
  }
  return errors;
}

export function createActionCard(plan: ActionPlan): string {
  const clean = (value: string) => value.trim().replace(/[.!?]+$/, "");
  return `When ${clean(plan.cue)} in ${clean(plan.location)}, I will ${clean(plan.standard)}. On a difficult day, I will ${clean(plan.minimum)}. If ${clean(plan.disruption)}, I will ${clean(plan.backup)}.`;
}
