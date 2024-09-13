import { describe, expect, it } from "vitest";

import { mulberry32 } from "@/support/random";

import { createBlock, createPlacementColumn } from "../factories";

import { generateRandomLevel } from "./generateRandomLevel";

const TEST_SEED = 123456789;

describe(generateRandomLevel, () => {
  it("generates a simple level", () => {
    const random = mulberry32(TEST_SEED);
    const level = generateRandomLevel(
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

  it("can generate a hidden level", () => {
    const random = mulberry32(TEST_SEED);
    const level = generateRandomLevel(
      {
        amountColors: 2,
        stackSize: 4,
        extraPlacementStacks: 2,
        hideBlockTypes: true,
      },
      random
    );
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
