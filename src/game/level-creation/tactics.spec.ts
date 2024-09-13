import { describe, expect, it } from "vitest";

import { mulberry32 } from "@/support/random";

import { createBlock, createPlacementColumn } from "../factories";

import { generatePlayableLevel } from "./tactics";

const TEST_SEED = 123456789;

describe(generatePlayableLevel, () => {
  it("generates a simple level", async () => {
    const random = mulberry32(TEST_SEED);
    const level = generatePlayableLevel(
      {
        amountColors: 2,
        stackSize: 4,
        extraPlacementStacks: 2,
      },
      random
    );
    expect(level.colors).toEqual(["black", "green"]);
    expect(level.columns).toEqual([
      createPlacementColumn(4, [
        createBlock("green"),
        createBlock("black"),
        createBlock("green"),
        createBlock("green"),
      ]),
      createPlacementColumn(4, [
        createBlock("black"),
        createBlock("black"),
        createBlock("green"),
        createBlock("black"),
      ]),
      createPlacementColumn(4),
      createPlacementColumn(4),
    ]);
  });

  it.skip("generates a complex level", async () => {
    const random = mulberry32(TEST_SEED);
    const level = generatePlayableLevel(
      {
        amountColors: 9,
        stackSize: 4,
        extraPlacementStacks: 2,
      },
      random
    );
    expect(level.colors).toHaveLength(7);
    expect(level.moves).toHaveLength(39);
  });

  it.skip("generates a complex level (buffers / force)", async () => {
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
    expect(level.moves).toHaveLength(259);
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
