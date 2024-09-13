import { describe,expect, it } from "vitest";

import { mulberry32 } from "../../support/random";
import { createBlock, createPlacementColumn } from "../factories";

import { generateLevel, generatePlayableLevel } from "./random-creation";

const TEST_SEED = 123456789;

describe(generateLevel, () => {
  it("generates a simple level", () => {
    const random = mulberry32(TEST_SEED);
    const level = generateLevel(random, {
      amountColors: 2,
      stackSize: 4,
      extraPlacementStacks: 2,
    });
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

  it("can generate a hidden level", () => {
    const random = mulberry32(TEST_SEED);
    const level = generateLevel(random, {
      amountColors: 2,
      stackSize: 4,
      extraPlacementStacks: 2,
      hideBlockTypes: true,
    });
    expect(level.colors).toEqual(["black", "green"]);
    expect(level.columns).toEqual([
      createPlacementColumn(4, [
        createBlock("green"),
        createBlock("black", true),
        createBlock("green", true),
        createBlock("green", true),
      ]),
      createPlacementColumn(4, [
        createBlock("black"),
        createBlock("black", true),
        createBlock("green", true),
        createBlock("black", true),
      ]),
      createPlacementColumn(4),
      createPlacementColumn(4),
    ]);
  });
});

describe(generatePlayableLevel, () => {
  it("generates a simple level", async () => {
    const random = mulberry32(TEST_SEED);
    const level = await generatePlayableLevel(random, {
      amountColors: 2,
      stackSize: 4,
      extraPlacementStacks: 2,
    });
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

  it("generates a complex level", async () => {
    const random = mulberry32(TEST_SEED);
    const level = await generatePlayableLevel(random, {
      amountColors: 7,
      stackSize: 4,
      extraPlacementStacks: 2,
    });
    expect(level.colors).toHaveLength(7);
    expect(level.moves).toHaveLength(39);
  });

  it("generates a complex level (buffers / force)", async () => {
    const random = mulberry32(TEST_SEED);
    const level = await generatePlayableLevel(random, {
      amountColors: 4,
      stackSize: 16,
      extraPlacementStacks: 1,
      extraPlacementLimits: 1,
      buffers: 3,
      bufferSizes: 4,
    });
    expect(level.colors).toHaveLength(4);
    expect(level.moves).toHaveLength(259);
  });

  it("throws an error if it can't generate a playable level", () => {
    const random = mulberry32(TEST_SEED);
    expect(
      async () =>
        await generatePlayableLevel(random, {
          amountColors: 1,
          extraPlacementStacks: 0,
        })
    ).rejects.toThrow("Can't generate playable level");
  });
});
