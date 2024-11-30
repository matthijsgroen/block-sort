import { describe, expect, it } from "vitest";

import { mulberry32, pick, shuffle } from "./random";

describe(mulberry32, () => {
  it("returns a random number based on a seed", () => {
    const random = mulberry32(42);
    expect(random()).toBe(0.6011037519201636);
    expect(random()).toBe(0.44829055899754167);
    expect(random()).toBe(0.8524657934904099);
  });
});

describe(shuffle, () => {
  it("shuffles an array", () => {
    const array = [1, 2, 3, 4, 5];
    shuffle(array, mulberry32(42));
    expect(array).not.toEqual([1, 2, 3, 4, 5]);
    expect(array).toEqual([1, 5, 3, 2, 4]);
  });
});

describe(pick, () => {
  it("picks a random element from a list", () => {
    const random = mulberry32(42);
    const list = [1, 2, 3, 4, 5];
    expect(pick(list, random)).toBe(4);
    expect(pick(list, random)).toBe(3);
  });
});
