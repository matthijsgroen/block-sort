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
    const target = rect({ x: 100, y: 60, w: 40, h: 40 });

    const result = createFrames(source, target, 20, 20, 10);
    expect(result).toEqual([
      { transform: "translate(0px, 0px)" },
      { transform: "translate(0px, -40px)", offset: 0.16 },
      { transform: "translate(18px, -60px)", offset: 0.312 },
      { transform: "translate(45px, -80px)", offset: 0.5 },
      { transform: "translate(72px, -60px)", offset: 0.688 },
      { transform: "translate(90px, -40px)", offset: 0.84, zIndex: 10 },
      { transform: "translate(90px, 0px)", offset: 1, zIndex: 10 }
    ]);
  });

  it("creates frames for a block moving from source to target (lower target)", () => {
    const source = rect({ x: 10, y: 60, w: 40, h: 40 });
    const target = rect({ x: 110, y: 240, w: 40, h: 40 });

    const result = createFrames(source, target, 20, 20, 10);
    expect(result).toEqual([
      { transform: "translate(0px, 0px)" },
      {
        transform: "translate(0px, -40px)",
        offset: expect.closeTo(0.16, 0.01)
      },
      {
        transform: "translate(20px, -60px)",
        offset: expect.closeTo(0.18, 0.01)
      },
      {
        transform: "translate(50px, -80px)",
        offset: expect.closeTo(0.29, 0.01)
      },
      {
        transform: "translate(80px, -60px)",
        offset: expect.closeTo(0.32, 0.01)
      },
      { transform: "translate(100px, -40px)", offset: 0.5, zIndex: 10 },
      { transform: "translate(100px, 180px)", offset: 1, zIndex: 10 }
    ]);
  });

  it("creates frames for a block moving from source to target (higher target)", () => {
    const source = rect({ x: 70, y: 260, w: 40, h: 40 });
    const target = rect({ x: 10, y: 60, w: 40, h: 40 });

    const result = createFrames(source, target, 20, 20, 10);
    expect(result).toEqual([
      { transform: "translate(0px, 0px)" },
      {
        transform: "translate(0px, -240px)",
        offset: expect.closeTo(0.57, 0.01)
      },
      {
        transform: "translate(-12px, -260px)",
        offset: expect.closeTo(0.64, 0.01)
      },
      {
        transform: "translate(-30px, -280px)",
        offset: expect.closeTo(0.73, 0.01)
      },
      {
        transform: "translate(-48px, -260px)",
        offset: expect.closeTo(0.82, 0.01)
      },
      {
        transform: "translate(-60px, -240px)",
        offset: expect.closeTo(0.9, 0.01),
        zIndex: 10
      },
      { transform: "translate(-60px, -200px)", offset: 1, zIndex: 10 }
    ]);
  });
});
