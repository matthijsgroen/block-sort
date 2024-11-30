import { describe, expect, it } from "vitest";

import { getAutoMoveCount } from "./autoMove";

describe(getAutoMoveCount, () => {
  it("returns 0 when lostCounter is less than minLoseCount", () => {
    expect(getAutoMoveCount(14, 100)).toBe(0);
  });

  describe("standard hint mode", () => {
    it("returns 5 auto moves after the minLoseCount", () => {
      expect(getAutoMoveCount(15, 100)).toBe(5);
    });

    it("increases by 5 moves after 3 extra fails", () => {
      expect(getAutoMoveCount(18, 100)).toBe(10);
    });

    it("increases till half the solve solve is shown", () => {
      expect(getAutoMoveCount(48, 100)).toBe(50);
    });
  });

  describe("eager hint mode", () => {
    it("returns 5 auto moves after 5 fails", () => {
      expect(getAutoMoveCount(5, 100, "eager")).toBe(5);
    });

    it("increases by 3 moves after each extra fail", () => {
      expect(getAutoMoveCount(6, 100, "eager")).toBe(8);
    });

    it("increases till 95% of the solve solve is shown", () => {
      expect(getAutoMoveCount(48, 100, "eager")).toBe(95);
    });
  });

  describe("hint mode: off", () => {
    it("returns 0 auto moves after 5 fails", () => {
      expect(getAutoMoveCount(5, 100, "off")).toBe(0);
    });

    it("stays 0 even after 100 fails", () => {
      expect(getAutoMoveCount(100, 100, "off")).toBe(0);
    });
  });
});
