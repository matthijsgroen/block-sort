import { describe, expect, it } from "vitest";

import { mulberry32, pickWeighted } from "./random";

const TEST_SEED = 123456789;

describe(pickWeighted, () => {
  it("return item if only single item there", () => {
    const random = mulberry32(TEST_SEED);

    const result = pickWeighted([{ item: "low", weight: 1 }], random);

    expect(result.item).toEqual("low");
  });

  it("return a random item if multiple items there", () => {
    const random = mulberry32(TEST_SEED);

    const result = pickWeighted(
      [
        { item: "low", weight: 1 },
        { item: "medium", weight: 4 },
        { item: "high", weight: 12 },
      ],
      random
    );

    expect(result.item).toEqual("medium");
  });
});
