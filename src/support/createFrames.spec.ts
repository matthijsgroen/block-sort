import { describe, expect, it } from "vitest";

import { createFrames, shiftRect } from "./createFrames";

const rect = (rect: {
  x: number;
  y: number;
  w: number;
  h: number;
}): DOMRect => ({
  x: rect.x,
  y: rect.y,
  width: rect.w,
  height: rect.h,
  top: rect.y,
  right: rect.x + rect.w,
  bottom: rect.y + rect.h,
  left: rect.x,
  toJSON: () => rect
});

describe(shiftRect, () => {
  it("shifts a rect by a given delta", () => {
    const result = shiftRect(rect({ x: 10, y: 20, w: 30, h: 40 }), 5, 10);
    expect(result).toEqual({ x: 15, y: 30, width: 30, height: 40 });
  });
});

describe(createFrames, () => {
  it("creates frames for a block moving from source to target (same height)", () => {
    const source = rect({ x: 10, y: 60, w: 40, h: 40 });
    const target = rect({ x: 70, y: 60, w: 40, h: 40 });

    const result = createFrames(source, target, 20, 20);
    expect(result).toEqual([
      { transform: "translate(0px, -40px)", offset: 0.2 },
      { transform: "translate(12px, -60px)", offset: 0.36 },
      { transform: "translate(30px, -70px)", offset: 0.5 },
      { transform: "translate(48px, -60px)", offset: 0.64 },
      { transform: "translate(60px, -40px)", offset: 0.8 },
      { transform: "translate(60px, 0px)", offset: 1 }
    ]);
  });

  it("creates frames for a block moving from source to target (lower target)", () => {
    const source = rect({ x: 10, y: 60, w: 40, h: 40 });
    const target = rect({ x: 70, y: 260, w: 40, h: 40 });

    const result = createFrames(source, target, 20, 20);
    expect(result).toEqual([
      { transform: "translate(0px, -40px)", offset: 0.1 },
      { transform: "translate(12px, -60px)", offset: 0.18 },
      { transform: "translate(30px, -70px)", offset: 0.25 },
      { transform: "translate(48px, -60px)", offset: 0.32 },
      { transform: "translate(60px, -40px)", offset: 0.4 },
      { transform: "translate(60px, 200px)", offset: 1 }
    ]);
  });

  it("creates frames for a block moving from source to target (higher target)", () => {
    const source = rect({ x: 70, y: 260, w: 40, h: 40 });
    const target = rect({ x: 10, y: 60, w: 40, h: 40 });

    const result = createFrames(source, target, 20, 20);
    expect(result).toEqual([
      { transform: "translate(0px, -240px)", offset: 0.6 },
      { transform: "translate(-12px, -260px)", offset: 0.68 },
      { transform: "translate(-30px, -270px)", offset: 0.75 },
      { transform: "translate(-48px, -260px)", offset: 0.82 },
      { transform: "translate(-60px, -240px)", offset: 0.9 },
      { transform: "translate(-60px, -200px)", offset: 1 }
    ]);
  });
});
