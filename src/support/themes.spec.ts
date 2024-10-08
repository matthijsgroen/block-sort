import { describe, expect, it } from "vitest";

import { getActiveTheme } from "./themes";

describe(getActiveTheme, () => {
  it("returns default theme", () => {
    const date = new Date("2021-03-01");
    expect(getActiveTheme(date)).toBe("default");
  });

  describe("halloween", () => {
    it("returns halloween theme on 21 october", () => {
      const date = new Date("2023-10-21");
      expect(getActiveTheme(date)).toBe("halloween");
    });

    it("returns halloween theme early november", () => {
      const date = new Date("2023-11-02");
      expect(getActiveTheme(date)).toBe("halloween");
    });

    it("returns default theme mid november", () => {
      const date = new Date("2023-11-15");
      expect(getActiveTheme(date)).toBe("default");
    });
  });

  describe("winter", () => {
    it("returns winter theme mid december", () => {
      const date = new Date("2023-12-15");
      expect(getActiveTheme(date)).toBe("winter");
    });

    it("returns winter theme early january", () => {
      const date = new Date("2023-12-15");
      expect(getActiveTheme(date)).toBe("winter");
    });

    it("returns default theme end january", () => {
      const date = new Date("2023-01-30");
      expect(getActiveTheme(date)).toBe("default");
    });
  });
});
