import { describe, expect, it } from "vitest";

import { mulberry32 } from "@/support/random";

import { createBlocks, createPlacementColumn } from "../factories";

import { generatePlayableLevel } from "./tactics";

const TEST_SEED = 123456789;

describe(generatePlayableLevel, () => {
  it("generates a simple level", async () => {
    const random = mulberry32(TEST_SEED);
    const level = await generatePlayableLevel(
      {
        amountColors: 2,
        stackSize: 4,
        extraPlacementStacks: 2
      },
      { random }
    );
    expect(level.blockTypes).toEqual(["red", "white"]);
    expect(level.columns).toEqual([
      createPlacementColumn(4, createBlocks("white", "white", "red", "white")),
      createPlacementColumn(4, createBlocks("white", "red", "red", "red")),
      createPlacementColumn(4),
      createPlacementColumn(4)
    ]);

    expect(level.generationInformation?.cost).toBeGreaterThan(812);
  });

  it("generates a medium level", async () => {
    const random = mulberry32(TEST_SEED);
    const level = await generatePlayableLevel(
      {
        amountColors: 5,
        stackSize: 4,
        extraPlacementStacks: 2
      },
      { random }
    );
    expect(level.blockTypes).toHaveLength(5);
    expect(level.generationInformation?.cost).toBeGreaterThan(815);
  });

  it("generates a hard level", async () => {
    const random = mulberry32(TEST_SEED);
    const level = await generatePlayableLevel(
      {
        amountColors: 10,
        stackSize: 5,
        extraPlacementStacks: 2,
        extraPlacementLimits: 1
      },
      { random, attempts: 10 }
    );
    expect(level.blockTypes).toHaveLength(10);
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
        bufferSizes: 4
      },
      { random }
    );
    expect(level.blockTypes).toHaveLength(4);
  }, 10_000);

  it("throws an error if it can't generate a playable level", async () => {
    const random = mulberry32(TEST_SEED);
    await expect(() =>
      generatePlayableLevel(
        {
          amountColors: 1,
          extraPlacementStacks: 0
        },
        { random }
      )
    ).rejects.toThrow("Can't generate playable level");
  });
});
