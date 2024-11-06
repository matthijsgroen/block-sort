import { describe, expect, it } from "vitest";

import {
  createBlocks,
  createLevelState,
  createPlacementColumn
} from "@/game/factories";
import { mulberry32 } from "@/support/random";

import { stackColumn } from "./stackColumn";

const TEST_SEED = 123456789;

describe(stackColumn, () => {
  it("prefers stacking items on existing columns", () => {
    const random = mulberry32(TEST_SEED);
    const level = createLevelState([
      createPlacementColumn(4, createBlocks("aqua", "pink", "green", "aqua")),
      createPlacementColumn(4, createBlocks("red", "pink", "red")),
      createPlacementColumn(4, createBlocks("red", "pink", "red", "green")),
      createPlacementColumn(4, createBlocks("pink", "aqua", "green", "green")),
      createPlacementColumn(4, createBlocks("aqua")),
      createPlacementColumn(4)
    ]);
    const moves = stackColumn(level, random);

    expect(moves).toHaveLength(2);
    expect(moves[0].weight).toEqual(35);
    expect(moves[0].move.from).toEqual(2);

    expect(moves[1].weight).toEqual(44);
    expect(moves[1].move.from).toEqual(0);
  });

  it("prefers stacking items on existing columns (longer stack)", () => {
    const random = mulberry32(TEST_SEED);
    const level = createLevelState([
      createPlacementColumn(
        4,
        createBlocks("green", "yellow", "yellow", "red")
      ),
      createPlacementColumn(4, createBlocks("aqua", "aqua", "aqua", "purple")),
      createPlacementColumn(4, createBlocks("black", "black")),
      createPlacementColumn(4, createBlocks("blue", "green", "green")),
      createPlacementColumn(4, createBlocks("black", "black", "aqua", "white")),
      createPlacementColumn(4, createBlocks("pink", "pink", "pink")),
      createPlacementColumn(4, createBlocks("purple", "purple")),
      createPlacementColumn(4, createBlocks("white", "white", "white")),
      createPlacementColumn(4, createBlocks("red", "red", "red"))
    ]);
    const moves = stackColumn(level, random);

    expect(moves).toHaveLength(1);
    expect(moves[0].weight).toEqual(48);
    expect(moves[0].move.from).toEqual(4);
  });
});
