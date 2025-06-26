import { describe, expect, it } from "vitest";

import {
  createBlock,
  createBlocks,
  createBlockSeries,
  createBufferColumn,
  createHiddenBlocks,
  createLevelState,
  createPlacementColumn
} from "./factories";
import {
  allShuffled,
  canPlaceAmount,
  hasWon,
  isKeysReachable,
  isLockSolvable,
  isStuck
} from "./state";

describe(canPlaceAmount, () => {
  it("returns the amount that fits", () => {
    const level = createLevelState([
      createPlacementColumn(4, createBlocks("red", "white", "white"))
    ]);

    const result = canPlaceAmount(level, 0, [{ blockType: "red" }]);
    expect(result).toEqual(1);
  });

  it("returns 0 for a full column", () => {
    const level = createLevelState([
      createPlacementColumn(4, createBlocks("red", "red", "white", "white"))
    ]);

    const result = canPlaceAmount(level, 0, [{ blockType: "red" }]);
    expect(result).toEqual(0);
  });

  it("returns 1 for a 2 set if only 1 space is available", () => {
    const level = createLevelState([
      createPlacementColumn(4, createBlocks("red", "white", "white"))
    ]);

    const result = canPlaceAmount(level, 0, [
      { blockType: "red" },
      { blockType: "red" }
    ]);
    expect(result).toEqual(1);
  });

  it("returns amount of blocks to place when even more space left", () => {
    const level = createLevelState([createPlacementColumn(4)]);

    const result = canPlaceAmount(level, 0, createBlocks("red", "red"));
    expect(result).toEqual(2);
  });

  it("returns 0 on stacking mismatch", () => {
    const level = createLevelState([
      createPlacementColumn(4, [createBlock("white")])
    ]);

    const result = canPlaceAmount(level, 0, createBlocks("red", "red"));
    expect(result).toEqual(0);
  });

  it("returns 0 on conditional column", () => {
    const level = createLevelState([createPlacementColumn(4, [], "white")]);

    const result = canPlaceAmount(level, 0, createBlocks("red", "red"));
    expect(result).toEqual(0);
  });
});

describe(hasWon, () => {
  it("returns true if all columns are empty or locked", () => {
    const level = createLevelState([
      createPlacementColumn(
        4,
        createBlocks("white", "white", "white", "white"),
        undefined,
        true
      ),
      createPlacementColumn(
        4,
        createBlocks("green", "green", "green", "green"),
        undefined,
        true
      ),
      createPlacementColumn(4),
      createPlacementColumn(4)
    ]);
    const result = hasWon(level);
    expect(result).toBe(true);
  });

  it("returns false if not all columns are empty or locked", () => {
    const level = createLevelState([
      createPlacementColumn(
        4,
        createBlocks("white", "white", "green", "white"),
        undefined,
        true
      ),
      createPlacementColumn(
        4,
        createBlocks("green", "green", "green"),
        undefined,
        true
      ),
      createPlacementColumn(4, createBlocks("white")),
      createPlacementColumn(4)
    ]);
    const result = hasWon(level);
    expect(result).toBe(false);
  });
});

describe(isStuck, () => {
  it("returns false if a move changes the surface", () => {
    const level = createLevelState([
      createPlacementColumn(
        4,
        createBlocks("white", "white", "green", "white"),
        undefined,
        true
      ),
      createPlacementColumn(
        4,
        createBlocks("green", "green", "green"),
        undefined,
        true
      ),
      createPlacementColumn(4, createBlocks("white")),
      createPlacementColumn(4)
    ]);
    const result = isStuck(level);
    expect(result).toBe(false);
  });

  it("returns false if a move reveals something", () => {
    const level = createLevelState([
      createPlacementColumn(
        4,
        createHiddenBlocks("white", "white", "green", "white")
      ),
      createPlacementColumn(4, createHiddenBlocks("green", "green", "green")),
      createPlacementColumn(4, createHiddenBlocks("white", "pink", "pink")),
      createPlacementColumn(4, createHiddenBlocks("pink", "pink"))
    ]);
    const result = isStuck(level);
    expect(result).toBe(false);
  });

  it("returns false if you can store a key", () => {
    const level = createLevelState([
      createPlacementColumn(
        4,
        createBlocks("vampire-key", "white", "green", "white")
      ),
      createPlacementColumn(4, createBlocks("green", "green", "green")),
      createPlacementColumn(4, createBlocks("white", "pink", "pink")),
      createBufferColumn(1, undefined, [], "inventory")
    ]);
    const result = isStuck(level);
    expect(result).toBe(false);
  });

  it("returns false if a lock can be removed", () => {
    const level = createLevelState([
      createPlacementColumn(4, createBlocks("pink", "vampire-lock", "red")),
      createPlacementColumn(
        4,
        createBlocks("vampire-lock", "vampire-key", "red")
      ),
      createPlacementColumn(4, createBlocks("yellow", "yellow", "pink", "red")),
      createPlacementColumn(4, createBlocks("red", "pink")),
      createPlacementColumn(
        4,
        createBlocks("brown", "pink", "brown", "yellow")
      ),
      createPlacementColumn(
        4,
        createBlocks("brown", "brown", "yellow", "orange")
      ),
      createPlacementColumn(4, createBlocks("orange", "orange", "orange")),
      createBufferColumn(1, undefined, createBlocks("vampire-key"), "inventory")
    ]);
    const result = isStuck(level);

    expect(result).toBe(false);
  });

  it("returns false if you can divide a stack over other columns", () => {
    const level = createLevelState([
      createPlacementColumn(
        6,
        createBlocks("white", "white", "green", "green", "green")
      ),
      createPlacementColumn(
        6,
        createBlocks("white", "white", "green", "green", "green")
      ),
      createPlacementColumn(
        6,
        createBlocks("white", "white", "pink", "pink", "pink")
      ),
      createPlacementColumn(6, createBlocks("pink", "pink", "pink"))
    ]);
    // You can divide the 2 white blocks of column 2 to column 1 and 0, to access the pink column
    const result = isStuck(level);
    expect(result).toBe(false);
  });

  it("returns true if a move makes no difference", () => {
    const level = createLevelState([
      createPlacementColumn(
        4,
        createBlocks("white", "white", "green", "white"),
        undefined,
        true
      ),
      createPlacementColumn(
        4,
        createBlocks("white", "green", "green"),
        undefined,
        true
      ),
      createPlacementColumn(4, createBlocks("green", "red", "red")),
      createPlacementColumn(4, createBlocks("red", "red"))
    ]);
    const result = isStuck(level);
    expect(result).toBe(true);
  });

  it("returns true if column is blocked by an obstacle", () => {
    const level = createLevelState([
      createPlacementColumn(13, [
        ...createBlockSeries(10, "yellow"),
        ...createBlocks("red", "yellow")
      ]),
      createPlacementColumn(13, createBlocks("ghost-lock", "red", "green")),
      createPlacementColumn(13, [
        ...createBlockSeries(9, "blue"),
        ...createBlocks("yellow", "red", "blue")
      ]),
      createPlacementColumn(13, [
        ...createBlockSeries(9, "green"),
        ...createBlocks("ghost-key", "red", "yellow", "blue")
      ]),
      createBufferColumn(3, "green", createBlocks("green")),
      createBufferColumn(3, undefined, []),
      createBufferColumn(2, undefined, []),
      createBufferColumn(1, undefined, [], "inventory"),
      createBufferColumn(3, undefined, createBlocks("red", "red", "red")),
      createBufferColumn(3, undefined, createBlocks("red", "red", "red")),
      createBufferColumn(3, undefined, createBlocks("red", "red", "red"))
    ]);
    const result = isStuck(level);
    expect(result).toBe(true);
  });

  it("returns true if a move makes no difference (locked columns)", () => {
    const level = createLevelState([
      createPlacementColumn(4, createBlocks("white")),
      createPlacementColumn(4, createBlocks("red")),
      createPlacementColumn(4, createBlocks("black", "black", "red", "white")),
      createPlacementColumn(
        4,
        createBlocks("black", "green", "green", "brown")
      ),
      createPlacementColumn(
        4,
        createBlocks("black", "white", "white", "brown")
      ),
      createBufferColumn(4, "brown", createBlocks("brown", "brown")),
      createBufferColumn(3, "green", createBlocks("green", "green")),
      createBufferColumn(2, "red", createBlocks("red", "red"))
    ]);
    const result = isStuck(level);
    expect(result).toBe(true);
  });

  it("returns true if a move makes no difference (locks and keys)", () => {
    const level = createLevelState([
      createPlacementColumn(
        5,
        createBlocks("white", "red", "dinosaur-key", "blue", "white")
      ),
      createPlacementColumn(
        5,
        createBlocks("yellow", "yellow", "dragon-lock", "darkblue", "blue")
      ),
      createPlacementColumn(
        5,
        createBlocks("dinosaur-lock", "brown", "dinosaur-key", "green")
      ),
      createPlacementColumn(
        5,
        createBlocks("white", "blue", "darkblue", "dinosaur-lock", "darkblue")
      ),
      createPlacementColumn(5, createBlocks("darkblue", "white", "brown")),
      createPlacementColumn(
        5,
        createBlocks("yellow", "yellow", "yellow", "darkblue")
      ),
      createPlacementColumn(5, createBlocks("brown", "brown", "brown")),
      createBufferColumn(1, undefined, [], "inventory"),
      createBufferColumn(1, undefined, createBlocks("dragon-key"), "inventory")
    ]);
    const result = isStuck(level);
    expect(result).toBe(true);
  });

  it("returns false if move would clear a buffer", () => {
    const level = createLevelState([
      createPlacementColumn(4, createBlocks("black", "white")),
      createPlacementColumn(4, createBlocks("white", "white", "white", "red")),
      createPlacementColumn(4, createBlocks("red", "red", "red", "black")),
      createBufferColumn(2, undefined, createBlocks("black", "black"))
    ]);
    const result = isStuck(level);
    expect(result).toBe(false);
  });

  it("returns true if move would not fit in a buffer", () => {
    const level = createLevelState([
      createPlacementColumn(
        4,
        createBlocks("black", "black", "black", "white")
      ),
      createPlacementColumn(4, createBlocks("white", "white", "white", "red")),
      createPlacementColumn(4, createBlocks("red", "red", "red", "black")),
      createBufferColumn(2, undefined)
    ]);
    const result = isStuck(level);
    expect(result).toBe(true);
  });

  it("returns true if move would not fit in a buffer (2)", () => {
    const level = createLevelState([
      createPlacementColumn(7, [
        ...createBlockSeries(3, "white"),
        ...createBlocks("purple", "yellow", "yellow", "white")
      ]),
      createPlacementColumn(7, [
        ...createBlockSeries(6, "blue"),
        ...createBlocks("purple")
      ]),
      createPlacementColumn(7, createBlockSeries(3, "aqua")),
      createPlacementColumn(7, [
        ...createBlockSeries(4, "black"),
        ...createBlocks("darkgreen", "aqua", "aqua")
      ]),
      createPlacementColumn(7, createBlockSeries(5, "darkgreen")),
      createPlacementColumn(7, [
        ...createBlockSeries(6, "brown"),
        ...createBlocks("white")
      ]),
      createPlacementColumn(7, [
        ...createBlockSeries(4, "yellow"),
        ...createBlocks("brown", "aqua")
      ]),
      createPlacementColumn(7, [
        ...createBlockSeries(4, "darkblue"),
        ...createBlocks("yellow", "black", "blue")
      ]),
      createPlacementColumn(7, [
        ...createBlockSeries(3, "purple"),
        ...createBlocks("darkgreen", "white", "purple")
      ]),
      createPlacementColumn(7, [
        ...createBlockSeries(3, "darkblue"),
        ...createBlocks("aqua", "black", "white", "purple")
      ]),
      createPlacementColumn(7, createBlockSeries(7, "red"), "red", true),

      createBufferColumn(2, undefined, createBlocks("black")),
      createBufferColumn(2, undefined)
    ]);
    const result = isStuck(level);
    expect(result).toBe(true);
  });

  it("returns true if move would not fit in multiple buffer", () => {
    const level = createLevelState([
      createPlacementColumn(6, [
        ...createBlockSeries(5, "black"),
        ...createBlocks("white")
      ]),
      createPlacementColumn(6, [
        ...createBlockSeries(5, "red"),
        ...createBlocks("black")
      ]),
      createPlacementColumn(6, [
        ...createBlockSeries(5, "white"),
        ...createBlocks("red")
      ]),
      createBufferColumn(2, undefined),
      createBufferColumn(2, undefined)
    ]);
    const result = isStuck(level);
    expect(result).toBe(true);
  });

  it("returns false if move could free buffer", () => {
    const level = createLevelState([
      createPlacementColumn(6, [
        ...createBlockSeries(5, "black"),
        ...createBlocks("white")
      ]),
      createPlacementColumn(6, [
        ...createBlockSeries(5, "red"),
        ...createBlocks("black")
      ]),
      createPlacementColumn(6, [
        ...createBlockSeries(3, "white"),
        ...createBlocks("red")
      ]),
      createBufferColumn(2, undefined, createBlockSeries(2, "white")),
      createBufferColumn(2, undefined)
    ]);
    const result = isStuck(level);
    expect(result).toBe(false);
  });

  it("returns false if series can be combined in buffer", () => {
    const s = createBlockSeries;
    const b = createBlocks;
    const level = createLevelState([
      createPlacementColumn(7, s(6, "blue")),
      createPlacementColumn(7, [
        ...s(3, "darkblue"),
        ...b("purple", "darkblue", "red")
      ]),
      createPlacementColumn(7, [...s(3, "red"), ...b("aqua")]),
      createPlacementColumn(7, [...s(5, "darkgreen"), ...b("aqua")]),
      createPlacementColumn(7, [...s(5, "aqua"), ...b("blue")]),
      createPlacementColumn(7, [...s(5, "pink"), ...b("red", "black")]),
      createPlacementColumn(7, [...s(5, "purple"), ...b("yellow", "red")]),
      createPlacementColumn(7, [
        ...s(3, "brown"),
        ...s(2, "darkgreen"),
        ...b("purple", "darkblue")
      ]),
      createPlacementColumn(7, [
        // ...s(3, "black"),
        ...b("pink", "darkblue", "darkblue")
      ]),
      createPlacementColumn(7, [
        ...s(4, "brown"),
        ...b("black", "red", "pink")
      ]),
      createPlacementColumn(7, s(6, "yellow"), "yellow"),
      createBufferColumn(2, undefined, createBlocks("black")),
      createBufferColumn(3, undefined, createBlocks("black", "black"))
    ]);
    const result = isStuck(level);
    expect(result).toBe(false);
  });

  it("returns true if series can not be distributed over free buffers", () => {
    const s = createBlockSeries;
    const b = createBlocks;
    const level = createLevelState([
      createPlacementColumn(7, s(6, "blue")),
      createPlacementColumn(7, [
        ...s(3, "darkblue"),
        ...b("purple", "darkblue", "red")
      ]),
      createPlacementColumn(7, [...s(3, "red"), ...b("aqua")]),
      createPlacementColumn(7, [...s(5, "darkgreen"), ...b("aqua")]),
      createPlacementColumn(7, [...s(5, "aqua"), ...b("blue")]),
      createPlacementColumn(7, [...s(5, "pink"), ...b("red", "black")]),
      createPlacementColumn(7, [...s(5, "purple"), ...b("yellow", "red")]),
      createPlacementColumn(7, [
        ...s(3, "brown"),
        ...s(2, "darkgreen"),
        ...b("purple", "darkblue")
      ]),
      createPlacementColumn(7, [
        ...s(3, "black"),
        ...b("pink", "darkblue", "darkblue")
      ]),
      createPlacementColumn(7, [
        ...s(4, "brown"),
        ...b("black", "red", "pink")
      ]),
      createPlacementColumn(7, s(6, "yellow"), "yellow"),
      createBufferColumn(2, undefined),
      createBufferColumn(2, undefined, createBlocks("black", "black"))
    ]);
    const result = isStuck(level);
    expect(result).toBe(true);
  });

  it("returns false if series can be distributed over free buffers", () => {
    const s = createBlockSeries;
    const b = createBlocks;
    const level = createLevelState([
      createPlacementColumn(7, s(6, "blue")),
      createPlacementColumn(7, [
        ...s(3, "darkblue"),
        ...b("purple", "darkblue", "red")
      ]),
      createPlacementColumn(7, [...s(3, "red"), ...b("aqua")]),
      createPlacementColumn(7, [...s(5, "darkgreen"), ...b("aqua")]),
      createPlacementColumn(7, [...s(5, "aqua"), ...b("blue")]),
      createPlacementColumn(7, [...s(5, "pink"), ...b("red", "black")]),
      createPlacementColumn(7, [...s(5, "purple"), ...b("yellow", "red")]),
      createPlacementColumn(7, [
        ...s(3, "brown"),
        ...s(2, "darkgreen"),
        ...b("purple", "darkblue")
      ]),
      createPlacementColumn(7, [
        ...s(3, "black"),
        ...b("pink", "darkblue", "darkblue")
      ]),
      createPlacementColumn(7, [
        ...s(4, "brown"),
        ...b("black", "red", "pink")
      ]),
      createPlacementColumn(7, s(6, "yellow"), "yellow"),
      createBufferColumn(2, undefined),
      createBufferColumn(3, undefined, createBlocks("black", "black"))
    ]);
    const result = isStuck(level);
    expect(result).toBe(false);
  });

  it("returns false if series can be distributed over free buffers and columns", () => {
    const s = createBlockSeries;
    const b = createBlocks;
    const level = createLevelState([
      createPlacementColumn(7, s(6, "blue")),
      createPlacementColumn(7, [
        ...s(3, "darkblue"),
        ...b("purple", "darkblue", "red")
      ]),
      createPlacementColumn(7, [...s(3, "red"), ...b("aqua")]),
      createPlacementColumn(7, [...s(5, "darkgreen"), ...b("aqua")]),
      createPlacementColumn(7, [...s(5, "aqua"), ...b("blue")]),
      createPlacementColumn(7, [...b("black"), ...s(4, "pink"), ...b("red")]),
      createPlacementColumn(7, [...s(5, "purple"), ...b("yellow", "red")]),
      createPlacementColumn(7, [
        ...s(3, "brown"),
        ...s(2, "darkgreen"),
        ...b("purple", "darkblue")
      ]),
      createPlacementColumn(7, [
        ...s(3, "black"),
        ...b("pink", "darkblue", "darkblue")
      ]),
      createPlacementColumn(7, [
        ...s(4, "brown"),
        ...b("black", "red", "pink")
      ]),
      createPlacementColumn(7, s(6, "yellow"), "yellow"),
      createBufferColumn(2, undefined),
      createBufferColumn(2, undefined, createBlocks("black", "black"))
    ]);
    const result = isStuck(level);
    expect(result).toBe(false);
  });

  it("returns false if move can clear buffers", () => {
    const s = createBlockSeries;
    const b = createBlocks;
    const level = createLevelState([
      createPlacementColumn(7, s(6, "blue")),
      createPlacementColumn(7, [
        ...s(3, "darkblue"),
        ...b("purple", "darkblue", "red")
      ]),
      createPlacementColumn(7, [...s(3, "red"), ...b("aqua")]),
      createPlacementColumn(7, [...s(5, "darkgreen"), ...b("aqua")]),
      createPlacementColumn(7, [...s(5, "aqua"), ...b("blue")]),
      createPlacementColumn(7, [...s(4, "pink"), ...b("red")]),
      createPlacementColumn(7, [...s(5, "purple"), ...b("yellow", "red")]),
      createPlacementColumn(7, [
        ...s(3, "brown"),
        ...s(2, "darkgreen"),
        ...b("purple", "darkblue")
      ]),
      createPlacementColumn(7, [...s(4, "black"), ...b("darkblue")]),
      createPlacementColumn(7, [
        ...s(4, "brown"),
        ...b("black", "red", "pink")
      ]),
      createPlacementColumn(7, s(6, "yellow"), "yellow"),
      createBufferColumn(2, undefined),
      createBufferColumn(2, undefined, createBlocks("black", "black"))
    ]);
    const result = isStuck(level);
    expect(result).toBe(false);
  });

  it("returns false if series would be able to redistribute", () => {
    const level = createLevelState([
      createPlacementColumn(4, createBlocks("black", "white")),
      createPlacementColumn(4, createBlocks("white", "white", "white", "red")),
      createPlacementColumn(4, createBlocks("red", "red", "red", "black")),
      createBufferColumn(2, undefined, createBlocks("black", "black")),
      createBufferColumn(2)
    ]);
    const result = isStuck(level);
    expect(result).toBe(false);
  });

  it("returns false if buffers contents are moved to free more space", () => {
    const level = createLevelState([
      createPlacementColumn(
        6,
        createBlocks("black", "black", "black", "black", "white")
      ),
      createPlacementColumn(
        6,
        createBlocks("white", "white", "white", "white", "white", "red")
      ),
      createPlacementColumn(
        6,
        createBlocks("red", "red", "red", "red", "red", "black")
      ),
      createBufferColumn(1, undefined, createBlocks("green")),
      createBufferColumn(2, undefined, createBlocks("black", "black")),
      createBufferColumn(3, undefined, createBlocks()),
      createBufferColumn(
        4,
        undefined,
        createBlocks("turquoise", "turquoise", "turquoise")
      )
    ]);
    const result = isStuck(level);
    expect(result).toBe(false);
  });
});

describe(allShuffled, () => {
  it("returns false if a column has all same color", () => {
    const level = createLevelState([
      createPlacementColumn(
        4,
        createBlocks("white", "white", "white", "white"),
        undefined,
        true
      ),
      createPlacementColumn(
        4,
        createBlocks("green", "green", "green"),
        undefined,
        true
      ),
      createPlacementColumn(4, createBlocks("green")),
      createPlacementColumn(4)
    ]);
    const result = allShuffled(level);
    expect(result).toBe(false);
  });

  it("returns true if all columns are shuffled", () => {
    const level = createLevelState([
      createPlacementColumn(
        4,
        createBlocks("white", "white", "green", "white"),
        undefined,
        true
      ),
      createPlacementColumn(
        4,
        createBlocks("white", "green", "green"),
        undefined,
        true
      ),
      createPlacementColumn(4, createBlocks("green", "red", "red")),
      createPlacementColumn(4, createBlocks("red", "red"))
    ]);
    const result = isStuck(level);
    expect(result).toBe(true);
  });
});

describe(isLockSolvable, () => {
  it("returns true if bottom blocks are not locks", () => {
    const level = createLevelState([
      createPlacementColumn(4, createBlocks("white")),
      createPlacementColumn(
        4,
        createBlocks("black", "green", "green", "brown")
      ),
      createBufferColumn(3, "green", createBlocks("green", "green")),
      createBufferColumn(2, "red", createBlocks("red", "red"))
    ]);
    const result = isLockSolvable(level);
    expect(result).toBe(true);
  });

  it("returns false if one of the columns has a lock as bottom block", () => {
    const level = createLevelState([
      createPlacementColumn(4, createBlocks("white")),
      createPlacementColumn(
        4,
        createBlocks("black", "green", "green", "vampire-lock")
      ),
      createBufferColumn(3, "green", createBlocks("green", "green")),
      createBufferColumn(2, "red", createBlocks("red", "red")),
      createPlacementColumn(4, createBlocks("black", "green", "ghost-lock"))
    ]);
    const result = isLockSolvable(level);
    expect(result).toBe(false);
  });

  it("returns true if keys are not directly above locks", () => {
    const level = createLevelState([
      createPlacementColumn(4, createBlocks("white")),
      createPlacementColumn(
        4,
        createBlocks("ghost-key", "green", "ghost-lock", "brown")
      ),
      createBufferColumn(3, "green", createBlocks("green", "green")),
      createBufferColumn(2, "red", createBlocks("red", "red"))
    ]);
    const result = isLockSolvable(level);
    expect(result).toBe(true);
  });

  it("returns false if keys are directly above locks", () => {
    const level = createLevelState([
      createPlacementColumn(4, createBlocks("white")),
      createPlacementColumn(
        4,
        createBlocks("ghost-key", "ghost-lock", "brown")
      ),
      createBufferColumn(3, "green", createBlocks("green", "green")),
      createBufferColumn(2, "red", createBlocks("red", "red"))
    ]);
    const result = isLockSolvable(level);
    expect(result).toBe(false);
  });
});
describe(isKeysReachable, () => {
  it("returns true if all keys are reachable", () => {
    const level = createLevelState([
      createPlacementColumn(4, createBlocks("white", "red", "dinosaur-key")),
      createPlacementColumn(4, createBlocks("yellow", "yellow", "dragon-lock")),
      createPlacementColumn(4, createBlocks("dinosaur-lock", "brown")),
      createPlacementColumn(4, createBlocks("white", "blue", "darkblue")),
      createBufferColumn(1, undefined, [], "inventory"),
      createBufferColumn(1, undefined, createBlocks("dragon-key"), "inventory")
    ]);
    const result = isKeysReachable(level);
    expect(result).toBe(true);
  });

  it("returns true if a lock can be unlocked by a key", () => {
    const level = createLevelState([
      createPlacementColumn(4, createBlocks("white", "red", "dinosaur-key")),
      createPlacementColumn(4, createBlocks("yellow", "yellow", "dragon-lock")),
      createPlacementColumn(
        4,
        createBlocks("dinosaur-lock", "brown", "dinosaur-key")
      ),
      createPlacementColumn(4, createBlocks("white", "blue", "darkblue")),
      createBufferColumn(1, undefined, [], "inventory"),
      createBufferColumn(1, undefined, createBlocks("dragon-key"), "inventory")
    ]);
    const result = isKeysReachable(level);
    expect(result).toBe(true);
  });

  it("returns true if keys are above their corresponding locks", () => {
    const level = createLevelState([
      createPlacementColumn(4, createBlocks("white", "red", "dinosaur-key")),
      createPlacementColumn(4, createBlocks("yellow", "yellow", "dragon-lock")),
      createPlacementColumn(
        4,
        createBlocks("dinosaur-key", "brown", "dinosaur-lock")
      ),
      createPlacementColumn(4, createBlocks("white", "blue", "darkblue")),
      createBufferColumn(1, undefined, [], "inventory"),
      createBufferColumn(1, undefined, createBlocks("dragon-key"), "inventory")
    ]);
    const result = isKeysReachable(level);
    expect(result).toBe(true);
  });

  it("returns false if a key is blocked by another lock", () => {
    const level = createLevelState([
      createPlacementColumn(
        4,
        createBlocks("dragon-lock", "red", "dinosaur-key")
      ),
      createPlacementColumn(
        4,
        createBlocks("dinosaur-lock", "yellow", "dragon-key")
      )
    ]);
    const result = isKeysReachable(level);
    expect(result).toBe(false);
  });

  it("returns true if there are no keys", () => {
    const level = createLevelState([
      createPlacementColumn(4, createBlocks("white", "red")),
      createPlacementColumn(4, createBlocks("yellow", "yellow")),
      createPlacementColumn(4, createBlocks("brown")),
      createPlacementColumn(4, createBlocks("white", "blue", "darkblue"))
    ]);
    const result = isKeysReachable(level);
    expect(result).toBe(true);
  });
});
