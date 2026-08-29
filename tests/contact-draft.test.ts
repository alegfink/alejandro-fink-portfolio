import { describe, expect, it } from "vitest";
import {
  CONTACT_DRAFT_TTL_MS,
  readContactDraft,
  serializeContactDraft,
  type ContactDraftFields,
} from "../lib/contact-draft";

describe("contact draft", () => {
  it("treats missing storage as an empty state", () => {
    expect(readContactDraft(null)).toEqual({ status: "empty" });
  });

  it("stores and restores only structured selections", () => {
    const source: ContactDraftFields = {
      goal: "validate",
      stage: "no-site",
      challenges: ["no-direction", "unclear-offer"],
      desiredAction: "contact",
      brandTraits: ["clear", "trustworthy"],
      needs: ["product", "strategy"],
      investment: "prefer-not",
      timeline: "1-3-months",
      decisionStage: "needs-definition",
    };

    const raw = serializeContactDraft(source, 1_000);
    expect(readContactDraft(raw, 2_000)).toMatchObject({
      status: "valid",
      resumeStep: 3,
      fields: { goal: "validate", needs: ["product", "strategy"] },
    });
  });

  it("refuses a draft candidate containing an unexpected personal field", () => {
    const unsafe = { goal: "validate", email: "ada@example.com" } as unknown as ContactDraftFields;
    expect(serializeContactDraft(unsafe, 1_000)).toBeNull();
  });

  it("restores an other selection but resumes where its private text is required", () => {
    const raw = serializeContactDraft({ goal: "other" }, 1_000);
    expect(readContactDraft(raw, 2_000)).toMatchObject({
      status: "valid",
      resumeStep: 0,
      fields: { goal: "other" },
    });
  });

  it("rejects malformed, unexpected and incompatible drafts", () => {
    expect(readContactDraft("not-json")).toEqual({ status: "invalid", reason: "corrupt" });
    expect(readContactDraft(JSON.stringify({ version: 2, savedAt: 1_000, fields: { goal: "validate" } }), 2_000))
      .toEqual({ status: "invalid", reason: "version" });
    expect(readContactDraft(JSON.stringify({ version: 1, savedAt: 1_000, fields: { goal: "validate", email: "stored@example.com" } }), 2_000))
      .toEqual({ status: "invalid", reason: "corrupt" });
  });

  it("expires a draft after two hours", () => {
    const raw = serializeContactDraft({ goal: "validate" }, 1_000);
    expect(readContactDraft(raw, 1_000 + CONTACT_DRAFT_TTL_MS + 1))
      .toEqual({ status: "invalid", reason: "expired" });
  });
});
