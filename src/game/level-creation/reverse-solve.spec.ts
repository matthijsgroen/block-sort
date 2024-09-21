import { describe, it } from "vitest";

import { generateLevel } from "./reverse-solve";

describe.skip(generateLevel, () => {
  it("generates a simple level", async () => {
    // const random = mulberry32(TEST_SEED);
    // const level = generateLevel(random, {
    //   amountColors: 2,
    //   stackSize: 4,
    //   extraPlacementStacks: 2,
    //   amountShuffles: 20,
    // });
    // expect(level.colors).toEqual(["black", "green"]);
    // expect(level.columns).toEqual([
    //   createPlacementColumn(4, [
    //     createBlock("green"),
    //     createBlock("black"),
    //     createBlock("green"),
    //     createBlock("green"),
    //   ]),
    //   createPlacementColumn(4, [
    //     createBlock("black"),
    //     createBlock("black"),
    //     createBlock("green"),
    //     createBlock("black"),
    //   ]),
    //   createPlacementColumn(4),
    //   createPlacementColumn(4),
    // ]);
  });

  it("generates a complex level", async () => {
    // const random = mulberry32(TEST_SEED);
    // const level = generateLevel(random, {
    //   amountColors: 9,
    //   stackSize: 4,
    //   extraPlacementStacks: 2,
    //   amountShuffles: 200,
    // });
    // expect(level.colors).toHaveLength(7);
    // expect(level.moves).toHaveLength(39);
  });

  it("generates a complex level (buffers / force)", async () => {
    // const random = mulberry32(TEST_SEED);
    // const level = generateLevel(random, {
    //   amountColors: 4,
    //   stackSize: 16,
    //   extraPlacementStacks: 1,
    //   extraPlacementLimits: 1,
    //   buffers: 3,
    //   bufferSizes: 4,
    // });
    // expect(level.colors).toHaveLength(4);
    // expect(level.moves).toHaveLength(259);
  });
});
