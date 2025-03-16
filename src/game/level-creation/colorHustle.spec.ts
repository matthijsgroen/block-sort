import { describe, expect, it } from "vitest";

import { mulberry32 } from "@/support/random";

import {
  createBlocks,
  createLevelState,
  createPlacementColumn
} from "../factories";
import type { LevelState } from "../types";

import { colorHustle } from "./colorHustle";

describe(colorHustle, () => {
  it("changes the colors of the blocks", () => {
    const random = mulberry32(123);
    const state: LevelState = createLevelState([
      createPlacementColumn(4, createBlocks("red", "green", "blue", "red")),
      createPlacementColumn(4, createBlocks("green", "blue", "red", "green"))
    ]);
    const newState = colorHustle(state, random);

    expect(newState.columns[0].blocks).toEqual(
      createBlocks("red", "blue", "green", "red")
    );
    expect(newState.columns[1].blocks).toEqual(
      createBlocks("blue", "green", "red", "blue")
    );
  });
});
