import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  actionPresets,
  createActionCard,
  validateActionPlan,
} from "../lib/action-card";

describe("action plan", () => {
  it("includes the cue, place, real minimum action and backup in the generated card", () => {
    const card = createActionCard(actionPresets.reading.plan);
    assert.equal(
      card,
      "When I finish my evening tea in my favourite chair, I will read two pages. On a difficult day, I will read one paragraph. If my evening runs late, I will read one paragraph after brushing my teeth.",
    );
  });

  it("trims text and trailing punctuation without changing personal wording", () => {
    const plan = {
      ...actionPresets.reading.plan,
      standard: "  read two pages.  ",
      minimum: "read one paragraph!",
    };
    assert.ok(
      createActionCard(plan).includes(
        "I will read two pages. On a difficult day, I will read one paragraph.",
      ),
    );
  });

  it("accepts every usable preset and flags every missing custom field", () => {
    for (const choice of ["reading", "tidying", "project"] as const)
      assert.deepEqual(validateActionPlan(actionPresets[choice].plan), {});
    assert.equal(
      Object.keys(validateActionPlan(actionPresets.custom.plan)).length,
      8,
    );
  });

  it("rejects whitespace-only and overly long details", () => {
    const errors = validateActionPlan({
      ...actionPresets.reading.plan,
      why: "  ",
      location: "a".repeat(301),
    });
    assert.ok(errors.why);
    assert.ok(errors.location);
    assert.equal(Object.keys(errors).length, 2);
  });
});
