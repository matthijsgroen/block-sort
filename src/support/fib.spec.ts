import { describe, expect, it } from "vitest";

import { fib } from "./fib";

describe(fib, () => {
  it("returns the fibonacci sequence", () => {
    expect(fib(1, 10)).toEqual([1, 2, 3, 5, 8, 13, 21, 34, 55]);
  });

  it("can change the step size", () => {
    expect(fib(3, 10)).toEqual([3, 6, 9, 15, 24, 39, 63, 102, 165]);
  });
});
