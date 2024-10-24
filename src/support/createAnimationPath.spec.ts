import { describe, expect, it } from "vitest";

import { createAnimationPath, pathBuilder } from "./createAnimationPath";

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

describe(createAnimationPath, () => {
  it("calculates the correct path (target right same level)", () => {
    const block = rect({ x: 50, y: 330, w: 40, h: 40 });
    const target = rect({ x: 300, y: 480, w: 40, h: 40 });
    const sourceColumnTop = 280;
    const targetColumnTop = 280;

    const result = createAnimationPath(
      block,
      target,
      sourceColumnTop,
      targetColumnTop
    );

    const expectedResult = pathBuilder()
      .move(20, 0)
      .vertical(-50)
      .cubicBezier([0, -50], [250, -50], [250, 0])
      .vertical(200)
      .build();

    expect(result).toBe(expectedResult);
  });

  it("calculates the correct path (target left same level)", () => {
    const block = rect({ x: 300, y: 330, w: 40, h: 40 });
    const target = rect({ x: 50, y: 480, w: 40, h: 40 });
    const sourceColumnTop = 280;
    const targetColumnTop = 280;

    const result = createAnimationPath(
      block,
      target,
      sourceColumnTop,
      targetColumnTop
    );

    const expectedResult = pathBuilder()
      .move(20, 0)
      .vertical(-50)
      .cubicBezier([0, -50], [-250, -50], [-250, 0])
      .vertical(200)
      .build();

    expect(result).toBe(expectedResult);
  });

  it("calculates the correct path (target left lower level)", () => {
    const block = rect({ x: 300, y: 230, w: 40, h: 40 });
    const target = rect({ x: 50, y: 580, w: 40, h: 40 });
    const sourceColumnTop = 180;
    const targetColumnTop = 380;

    const result = createAnimationPath(
      block,
      target,
      sourceColumnTop,
      targetColumnTop
    );

    const expectedResult = pathBuilder()
      .move(20, 0)
      .vertical(-50) // move up to source column top
      .cubicBezier([0, -50], [-250, -50], [-250, 0]) // align with target column top
      .vertical(200) // move down to target column top
      .vertical(200)
      .build();

    expect(result).toBe(expectedResult);
  });

  it("calculates the correct path (target right higher level)", () => {
    const block = rect({ x: 50, y: 580, w: 40, h: 40 });
    const target = rect({ x: 300, y: 230, w: 40, h: 40 });
    const sourceColumnTop = 380;
    const targetColumnTop = 180;

    const result = createAnimationPath(
      block,
      target,
      sourceColumnTop,
      targetColumnTop
    );

    const expectedResult = pathBuilder()
      .move(20, 0)
      .vertical(-200) // move up to source column top
      .vertical(-200) // move up to target column top
      .cubicBezier([0, -50], [250, -50], [250, 0]) // align with target column top
      .vertical(50)
      .build();

    expect(result).toBe(expectedResult);
  });
});
