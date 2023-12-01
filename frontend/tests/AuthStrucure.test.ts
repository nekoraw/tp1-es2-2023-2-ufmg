import { describe, expect, test } from "@jest/globals";
import {
  evaluatePossiblyUndefinedBoolean,
  verifyEmailRegex,
} from "../src/components/authentication/AuthStructure";

describe("tests authentication functions", () => {
  test("test if the email regex is valid by passing a valid email", () => {
    const res = verifyEmailRegex("example@example.com");
    expect(res).toBe(true);
  });

  test("test if the email regex is valid by passing a invalid email", () => {
    const res = verifyEmailRegex("this is definively not an email");
    expect(res).toBe(false);
  });

  test("test if the boolean evaluation function returns true if undefined is passed", () => {
    const res = evaluatePossiblyUndefinedBoolean(undefined);
    expect(res).toBe(true);
  });

  test("test if the boolean evaluation function returns boolean if undefined is not passed", () => {
    let res = evaluatePossiblyUndefinedBoolean(true);
    expect(res).toBe(true);

    res = evaluatePossiblyUndefinedBoolean(false);
    expect(res).toBe(false);
  });
});
