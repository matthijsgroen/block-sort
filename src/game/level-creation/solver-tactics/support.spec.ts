import { describe, expect, it } from "vitest";

import {
  createBlocks,
  createOversizedColumn,
  createPlacementColumn
} from "@/game/factories";

import { isColumnCorrectlySorted } from "./support";

describe(isColumnCorrectlySorted, () => {
  it("returns false for an empty column", () => {
    const col = createPlacementColumn(4, []);
    expect(isColumnCorrectlySorted(col)).toBe(false);
  });

  it("returns true for a fully sorted placement column", () => {
    const col = createPlacementColumn(
      4,
      createBlocks("white", "white", "white", "white")
    );
    expect(isColumnCorrectlySorted(col)).toBe(true);
  });

  it("returns false for a column with mixed colors", () => {
    const col = createPlacementColumn(
      4,
      createBlocks("white", "blue", "white", "white")
    );
    expect(isColumnCorrectlySorted(col)).toBe(false);
  });

  it("returns false for a partially filled oversized column even when all blocks are the same colour", () => {
    // An oversized column with size 8 but only 4 blocks — not done yet
    const col = createOversizedColumn(8, "white");
    col.blocks = createBlocks("white", "white", "white", "white");
    expect(isColumnCorrectlySorted(col)).toBe(false);
  });

  it("returns true for a fully filled oversized column where all blocks are the same colour", () => {
    const col = createOversizedColumn(8, "white");
    col.blocks = createBlocks(
      "white",
      "white",
      "white",
      "white",
      "white",
      "white",
      "white",
      "white"
    );
    expect(isColumnCorrectlySorted(col)).toBe(true);
  });
});
