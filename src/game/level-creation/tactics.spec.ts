import { describe, expect, it } from "vitest";

import { mulberry32 } from "@/support/random";
import { timesMap } from "@/support/timeMap";

import { createBlock, createPlacementColumn } from "../factories";

import { generatePlayableLevel } from "./tactics";

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
    expect(level.colors).toEqual(["darkblue", "green"]);
    expect(level.columns).toEqual([
      createPlacementColumn(4, [
        createBlock("green"),
        createBlock("green"),
        createBlock("darkblue"),
        createBlock("darkblue"),
      ]),
      createPlacementColumn(4, [
        createBlock("darkblue"),
        createBlock("green"),
        createBlock("green"),
        createBlock("darkblue"),
      ]),
      createPlacementColumn(4),
      createPlacementColumn(4),
    ]);
    expect(level.moves).toHaveLength(4);
  });

  it("generates a medium level", async () => {
    const random = mulberry32(TEST_SEED);
    const level = await generatePlayableLevel(
      {
        amountColors: 5,
        stackSize: 4,
        extraPlacementStacks: 2,
      },
      random
    );
    expect(level.colors).toHaveLength(5);
    expect(level.moves).toHaveLength(17);
  });

  it("generates a complex level", async () => {
    const random = mulberry32(TEST_SEED);
    const level = await generatePlayableLevel(
      {
        amountColors: 10,
        stackSize: 8,
        extraPlacementStacks: 2,
        extraPlacementLimits: 1,
        buffers: 2,
        bufferSizes: 1,
      },
      random
    );
    expect(level.colors).toHaveLength(10);
    expect(level.moves).toHaveLength(121);
  });

  it("has around 30 of moves on average for 9 colors", async () => {
    const random = mulberry32(TEST_SEED);
    const results = await Promise.all(
      timesMap(
        10,
        async () =>
          (
            await generatePlayableLevel(
              {
                amountColors: 9,
                stackSize: 4,
                extraPlacementStacks: 2,
              },
              random
            )
          ).moves.length
      )
    );
    const average = results.reduce((r, i) => r + i, 0) / results.length;
    expect(average).toBeCloseTo(30.2, 3);
  });

  it("has around 70 of moves on average for 10 colors", async () => {
    const random = mulberry32(TEST_SEED);
    const results = await Promise.all(
      timesMap(
        10,
        async () =>
          (
            await generatePlayableLevel(
              {
                amountColors: 19,
                stackSize: 4,
                extraPlacementStacks: 2,
              },
              random
            )
          ).moves.length
      )
    );
    const average = results.reduce((r, i) => r + i, 0) / results.length;
    expect(average).toBeCloseTo(69.2, 3);
  });

  it("generates a hard level", async () => {
    const random = mulberry32(TEST_SEED);
    const level = await generatePlayableLevel(
      {
        amountColors: 10,
        stackSize: 5,
        extraPlacementStacks: 2,
        extraPlacementLimits: 1,
      },
      random
    );
    expect(level.colors).toHaveLength(10);
    expect(level.moves).toHaveLength(42);
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
    expect(level.moves).toHaveLength(419);
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
