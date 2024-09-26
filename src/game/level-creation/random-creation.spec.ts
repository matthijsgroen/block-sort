import { describe, expect, it } from "vitest";

import { mulberry32 } from "@/support/random";

import { createBlocks, createPlacementColumn } from "../factories";

import { generatePlayableLevel } from "./random-creation";

const TEST_SEED = 123456789;

describe(generatePlayableLevel, () => {
  it("generates a simple level", async () => {
    const random = mulberry32(TEST_SEED);
    const level = await generatePlayableLevel(
      {
        amountColors: 2,
        stackSize: 4,
        extraPlacementStacks: 2,
      },
      random
    );
    expect(level.colors).toEqual(["blue", "white"]);
    expect(level.columns).toEqual([
      createPlacementColumn(4, createBlocks("white", "white", "blue", "blue")),
      createPlacementColumn(4, createBlocks("blue", "white", "white", "blue")),
      createPlacementColumn(4),
      createPlacementColumn(4),
    ]);
  });

  it("generates a complex level", async () => {
    const random = mulberry32(TEST_SEED);
    const level = await generatePlayableLevel(
      {
        amountColors: 9,
        stackSize: 4,
        extraPlacementStacks: 2,
      },
      random
    );

    expect(level.colors).toHaveLength(9);
  });

  it("generates a complex level (buffers / force)", async () => {
    const random = mulberry32(TEST_SEED);
    const level = await generatePlayableLevel(
      {
        amountColors: 4,
        stackSize: 16,
        extraPlacementStacks: 1,
        extraPlacementLimits: 1,
        buffers: 3,
        bufferSizes: 4,
      },
      random
    );

    expect(level.colors).toHaveLength(4);
  });

  it("throws an error if it can't generate a playable level", () => {
    const random = mulberry32(TEST_SEED);
    expect(
      async () =>
        await generatePlayableLevel(
          {
            amountColors: 1,
            extraPlacementStacks: 0,
          },
          random
        )
    ).rejects.toThrow("Can't generate playable level");
  });
});
