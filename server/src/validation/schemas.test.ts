import { describe, expect, it } from "vitest";
import {
  contactSchema,
  isHoneypotTripped,
  newsletterSchema,
  prayerRequestSchema,
  testimonySchema,
} from "./schemas.js";

describe("isHoneypotTripped", () => {
  it("is false when the honeypot field is empty", () => {
    expect(isHoneypotTripped({ website: "" })).toBe(false);
  });

  it("is false when the honeypot field is undefined", () => {
    expect(isHoneypotTripped({})).toBe(false);
  });

  it("is true when a bot fills in the honeypot field", () => {
    expect(isHoneypotTripped({ website: "http://spam.example" })).toBe(true);
  });
});

describe("newsletterSchema", () => {
  it("accepts a valid email", () => {
    expect(newsletterSchema.safeParse({ email: "listener@example.com" }).success).toBe(true);
  });

  it("rejects an invalid email", () => {
    expect(newsletterSchema.safeParse({ email: "not-an-email" }).success).toBe(false);
  });
});

describe("contactSchema", () => {
  const validContact = {
    name: "Grace O.",
    email: "grace@example.com",
    subject: "Question about programming",
    message: "I wanted to ask about the Tuesday night schedule.",
  };

  it("accepts a fully valid contact submission", () => {
    expect(contactSchema.safeParse(validContact).success).toBe(true);
  });

  it("rejects a message that is too short", () => {
    expect(contactSchema.safeParse({ ...validContact, message: "hi" }).success).toBe(false);
  });

  it("rejects a missing name", () => {
    const { name: _name, ...rest } = validContact;
    expect(contactSchema.safeParse(rest).success).toBe(false);
  });
});

describe("prayerRequestSchema", () => {
  it("requires explicit consent (true)", () => {
    const result = prayerRequestSchema.safeParse({
      category: "healing",
      request: "Please pray for my family during this season.",
      consent: false,
    });
    expect(result.success).toBe(false);
  });

  it("accepts an anonymous submission without name or email", () => {
    const result = prayerRequestSchema.safeParse({
      category: "guidance",
      request: "Please pray for direction in my career.",
      anonymous: true,
      consent: true,
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid category", () => {
    const result = prayerRequestSchema.safeParse({
      category: "not-a-real-category",
      request: "Please pray for me.",
      consent: true,
    });
    expect(result.success).toBe(false);
  });
});

describe("testimonySchema", () => {
  it("rejects testimony text under 20 characters", () => {
    expect(testimonySchema.safeParse({ text: "Too short" }).success).toBe(false);
  });

  it("accepts a sufficiently detailed testimony", () => {
    expect(
      testimonySchema.safeParse({
        text: "God provided for my family in a way I never expected during a really hard year.",
        anonymous: true,
      }).success
    ).toBe(true);
  });
});
