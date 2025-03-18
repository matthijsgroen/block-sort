import { describe, expect, it } from "vitest";

import {
  createBlocks,
  createBufferColumn,
  createLevelState,
  createPlacementColumn
} from "@/game/factories";
import { mulberry32 } from "@/support/random";

import { startColumn } from "./startColumn";

const TEST_SEED = 123456789;

describe(startColumn, () => {
  it("picks the color where most are off", () => {
    const random = mulberry32(TEST_SEED);
    const level = createLevelState([
      createPlacementColumn(4, createBlocks("aqua", "red", "green", "aqua")),
      createPlacementColumn(4, createBlocks("aqua", "red", "pink", "red")),
      createPlacementColumn(4, createBlocks("green", "pink", "red", "pink")),
      createPlacementColumn(4, createBlocks("pink", "aqua", "green", "green")),
      createPlacementColumn(4)
    ]);
    const moves = startColumn(level, random);

    expect(moves).toHaveLength(2);

    expect(moves[0].weight).toEqual(9);
    expect(moves[0].move).toEqual({ from: 0, to: 4 });

    expect(moves[1].weight).toEqual(9);
    expect(moves[1].move).toEqual({ from: 1, to: 4 });
  });

  it("returns multiple results if choice is equal", () => {
    const random = mulberry32(TEST_SEED);
    const level = createLevelState([
      createPlacementColumn(4, createBlocks("aqua", "red", "green", "green")),
      createPlacementColumn(4, createBlocks("aqua", "red", "pink", "red")),
      createPlacementColumn(4, createBlocks("pink", "aqua", "red", "pink")),
      createPlacementColumn(4, createBlocks("pink", "aqua", "green", "green")),
      createPlacementColumn(4)
    ]);
    const moves = startColumn(level, random);

    expect(moves).toHaveLength(4);

    expect(moves[0].weight).toEqual(9);
    expect(moves[0].move).toEqual({ from: 0, to: 4 });

    expect(moves[1].weight).toEqual(9);
    expect(moves[1].move).toEqual({ from: 1, to: 4 });

    expect(moves[2].weight).toEqual(9);
    expect(moves[2].move).toEqual({ from: 2, to: 4 });

    expect(moves[3].weight).toEqual(9);
    expect(moves[3].move).toEqual({ from: 3, to: 4 });
  });

  it("assigns more weight the more colors there are", () => {
    const random = mulberry32(TEST_SEED);
    const level = createLevelState([
      createPlacementColumn(4, createBlocks("aqua", "red", "green", "green")),
      createPlacementColumn(4, createBlocks("aqua", "red", "pink", "red")),
      createPlacementColumn(4, createBlocks("aqua", "pink", "red", "pink")),
      createPlacementColumn(4, createBlocks("pink", "aqua", "green", "green")),
      createPlacementColumn(4)
    ]);
    const moves = startColumn(level, random);

    expect(moves).toHaveLength(3);
    expect(moves[0].weight).toEqual(13);
    expect(moves[0].move).toEqual({ from: 0, to: 4 });

    expect(moves[1].weight).toEqual(13);
    expect(moves[1].move).toEqual({ from: 1, to: 4 });

    expect(moves[2].weight).toEqual(13);
    expect(moves[2].move).toEqual({ from: 2, to: 4 });
  });

  it("does not return moves when there is no empty column", () => {
    const random = mulberry32(TEST_SEED);
    const level = createLevelState([
      createPlacementColumn(4, createBlocks("aqua", "pink", "green", "aqua")),
      createPlacementColumn(4, createBlocks("aqua", "red", "pink", "red")),
      createPlacementColumn(4, createBlocks("red", "pink", "red", "green")),
      createPlacementColumn(4, createBlocks("pink", "aqua", "green", "green"))
    ]);
    const moves = startColumn(level, random);

    expect(moves).toHaveLength(0);
  });

  it("does not return moves when there is no empty column (inventory)", () => {
    const random = mulberry32(TEST_SEED);
    const level = createLevelState([
      createPlacementColumn(4, createBlocks("aqua", "pink", "green", "aqua")),
      createPlacementColumn(4, createBlocks("aqua", "red", "pink", "red")),
      createPlacementColumn(4, createBlocks("red", "pink", "red", "green")),
      createPlacementColumn(4, createBlocks("pink", "aqua", "green", "green")),
      createBufferColumn(1, undefined, [], "inventory")
    ]);
    const moves = startColumn(level, random);

    expect(moves).toHaveLength(0);
  });

  it("returns stacking moves when there is need to create new column", () => {
    const random = mulberry32(TEST_SEED);
    const level = createLevelState([
      createPlacementColumn(4, createBlocks("aqua", "pink", "green", "aqua")),
      createPlacementColumn(4, createBlocks("red", "pink", "red")),
      createPlacementColumn(4, createBlocks("red", "pink", "red", "green")),
      createPlacementColumn(4, createBlocks("pink", "aqua", "green", "green")),
      createPlacementColumn(4, createBlocks("aqua")),
      createPlacementColumn(4)
    ]);
    const moves = startColumn(level, random);

    expect(moves).toHaveLength(2);
    expect(moves[0].name).toEqual("stackColumn");
  });
});
