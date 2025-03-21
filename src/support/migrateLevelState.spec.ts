import { describe, expect, it } from "vitest";

import {
  createBlocks,
  createLevelState,
  createPlacementColumn
} from "@/game/factories";

import { migrateLevelState } from "./migrateLevelState";

describe(migrateLevelState, () => {
  it("returns the same value if it is already up to date", () => {
    const value = createLevelState([
      createPlacementColumn(4, createBlocks("red", "green", "blue"))
    ]);
    expect(migrateLevelState(value)).toEqual(value);
  });

  it("returns the an up to date version if version 1 is passed in", () => {
    const value = {
      colors: ["blue", "green", "red"],
      columns: [
        {
          type: "placement",
          locked: false,
          columnSize: 4,
          blocks: [
            { color: "red", revealed: true },
            { color: "green", revealed: true },
            { color: "blue", revealed: true }
          ]
        }
      ],
      moves: []
    } as unknown;

    const expectedResult = {
      blockTypes: ["blue", "green", "red"],
      columns: [
        {
          type: "placement",
          locked: false,
          columnSize: 4,
          blocks: [
            { blockType: "red", revealed: true },
            { blockType: "green", revealed: true },
            { blockType: "blue", revealed: true }
          ]
        }
      ],
      moves: []
    } as unknown;
    expect(migrateLevelState(value)).toEqual(expectedResult);
  });
});
