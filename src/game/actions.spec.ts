import { describe, expect, it } from "vitest";

import { mulberry32 } from "../support/random";

import { generateRandomLevel } from "./level-creation/generateRandomLevel";
import { generatePlayableLevel } from "./level-creation/tactics";
import { getNormalSettings } from "./level-types/normal";
import { moveBlocks, replayMoves, selectFromColumn } from "./actions";
import {
  createBlock,
  createBlocks,
  createBufferColumn,
  createHiddenBlocks,
  createLevelState,
  createPlacementColumn
} from "./factories";
import { hasWon } from "./state";
import type { LevelState } from "./types";

const TEST_SEED = 123456789;

describe(selectFromColumn, () => {
  it("selects the top of a column", () => {
    const random = mulberry32(TEST_SEED);
    const level = generateRandomLevel(
      {
        amountColors: 2,
        stackSize: 4,
        extraPlacementStacks: 1
      },
      random
    );
    const blocks = selectFromColumn(level, 1);
    expect(blocks).toEqual([createBlock("blue")]);
  });

  it("selects the top of a column with multiple of the same color", () => {
    const random = mulberry32(TEST_SEED);
    const level = generateRandomLevel(
      {
        amountColors: 2,
        stackSize: 4,
        extraPlacementStacks: 1
      },
      random
    );
    const blocks = selectFromColumn(level, 0);
    expect(blocks).toEqual([createBlock("white"), createBlock("white")]);
  });

  it("selects the top of a column (partially hidden)", () => {
    const level = createLevelState([
      createPlacementColumn(
        4,
        createHiddenBlocks("green", "black", "green", "green")
      ),
      createPlacementColumn(
        4,
        createHiddenBlocks("black", "black", "green", "black")
      ),
      createPlacementColumn(4)
    ]);
    const blocks = selectFromColumn(level, 1);
    expect(blocks).toEqual([createBlock("black")]);
  });

  it("cannot select the top of an empty column", () => {
    const random = mulberry32(TEST_SEED);
    const level = generateRandomLevel(
      {
        amountColors: 2,
        stackSize: 4,
        extraPlacementStacks: 1
      },
      random
    );
    const blocks = selectFromColumn(level, 2);
    expect(blocks).toEqual([]);
  });

  it("cannot select the top of an locked column", () => {
    const level = createLevelState([
      createPlacementColumn(
        4,
        createBlocks("white", "white", "white", "white"),
        undefined,
        true
      )
    ]);
    const blocks = selectFromColumn(level, 0);
    expect(blocks).toEqual([]);
  });

  it("cannot select a lock", () => {
    const level = createLevelState([
      createPlacementColumn(
        4,
        createBlocks("white", "white", "white", "ghost-lock"),
        undefined,
        true
      )
    ]);
    const blocks = selectFromColumn(level, 0);
    expect(blocks).toEqual([]);
  });
});

describe(moveBlocks, () => {
  it("moves a block from one column to another", () => {
    const level = createLevelState([
      createPlacementColumn(
        4,
        createBlocks("white", "white", "black", "green")
      ),
      createPlacementColumn(
        4,
        createBlocks("black", "black", "white", "white")
      ),
      createPlacementColumn(
        4,
        createBlocks("green", "black", "green", "green")
      ),
      createPlacementColumn(4),
      createPlacementColumn(4)
    ]);

    const result = moveBlocks(level, { from: 0, to: 3 });
    const expected: LevelState = {
      blockTypes: ["black", "green", "white"],
      columns: [
        createPlacementColumn(4, createBlocks("black", "green")),
        createPlacementColumn(
          4,
          createBlocks("black", "black", "white", "white")
        ),
        createPlacementColumn(
          4,
          createBlocks("green", "black", "green", "green")
        ),
        createPlacementColumn(4, createBlocks("white", "white")),
        createPlacementColumn(4)
      ],
      moves: []
    };
    expect(result).toEqual(expected);
  });

  it("will not move if column full", () => {
    const level = createLevelState([
      createPlacementColumn(
        4,
        createBlocks("white", "white", "black", "green")
      ),
      createPlacementColumn(
        4,
        createBlocks("black", "black", "white", "white")
      ),
      createPlacementColumn(
        4,
        createBlocks("green", "black", "green", "green")
      ),
      createPlacementColumn(4),
      createPlacementColumn(4)
    ]);

    const result = moveBlocks(level, { from: 0, to: 1 });
    expect(result).toEqual(level);
  });

  it("will not move if column has restriction that is not met", () => {
    const level = createLevelState([
      createPlacementColumn(
        4,
        createBlocks("white", "white", "black", "green")
      ),
      createPlacementColumn(
        4,
        createBlocks("black", "black", "white", "white")
      ),
      createPlacementColumn(
        4,
        createBlocks("green", "black", "green", "green")
      ),
      createPlacementColumn(4, [], "black"),
      createPlacementColumn(4)
    ]);

    const result = moveBlocks(level, { from: 0, to: 3 });
    expect(result).toEqual(level);
  });

  it("will move if column has restriction that is met", () => {
    const level = createLevelState([
      createPlacementColumn(
        4,
        createBlocks("white", "white", "black", "green")
      ),
      createPlacementColumn(
        4,
        createBlocks("black", "black", "white", "white")
      ),
      createPlacementColumn(
        4,
        createBlocks("green", "black", "green", "green")
      ),
      createPlacementColumn(4, [], "white"),
      createPlacementColumn(4)
    ]);

    const result = moveBlocks(level, { from: 0, to: 3 });
    const expected: LevelState = {
      blockTypes: ["black", "green", "white"],
      columns: [
        createPlacementColumn(4, createBlocks("black", "green")),
        createPlacementColumn(
          4,
          createBlocks("black", "black", "white", "white")
        ),
        createPlacementColumn(
          4,
          createBlocks("green", "black", "green", "green")
        ),
        createPlacementColumn(4, createBlocks("white", "white"), "white"),
        createPlacementColumn(4)
      ],
      moves: []
    };
    expect(result).toEqual(expected);
  });

  it("will reveal hidden items underneath (single)", () => {
    const level = createLevelState([
      createPlacementColumn(
        4,
        createHiddenBlocks("white", "white", "black", "green")
      ),
      createPlacementColumn(
        4,
        createHiddenBlocks("black", "black", "white", "white")
      ),
      createPlacementColumn(
        4,
        createHiddenBlocks("green", "black", "green", "green")
      ),
      createPlacementColumn(4),
      createPlacementColumn(4)
    ]);

    const result = moveBlocks(level, { from: 0, to: 3 });
    const expected: LevelState = {
      blockTypes: ["black", "green", "white"],
      columns: [
        createPlacementColumn(4, createHiddenBlocks("white", "black", "green")),
        createPlacementColumn(
          4,
          createHiddenBlocks("black", "black", "white", "white")
        ),
        createPlacementColumn(
          4,
          createHiddenBlocks("green", "black", "green", "green")
        ),
        createPlacementColumn(4, [createBlock("white")]),
        createPlacementColumn(4)
      ],
      moves: []
    };
    expect(result).toEqual(expected);
  });

  it("will not reveal hidden items underneath if moved to same column", () => {
    const level = createLevelState([
      createPlacementColumn(
        4,
        createHiddenBlocks("white", "white", "black", "green")
      ),
      createPlacementColumn(
        4,
        createHiddenBlocks("black", "black", "white", "white")
      ),
      createPlacementColumn(4, createHiddenBlocks("green", "black", "green")),
      createPlacementColumn(4, createBlocks("green")),
      createPlacementColumn(4)
    ]);

    const result = moveBlocks(level, { from: 2, to: 2 });
    const expected: LevelState = {
      blockTypes: ["black", "green", "white"],
      columns: [
        createPlacementColumn(
          4,
          createHiddenBlocks("white", "white", "black", "green")
        ),
        createPlacementColumn(
          4,
          createHiddenBlocks("black", "black", "white", "white")
        ),
        createPlacementColumn(4, createHiddenBlocks("green", "black", "green")),
        createPlacementColumn(4, createBlocks("green")),
        createPlacementColumn(4)
      ],
      moves: []
    };
    expect(result).toEqual(expected);
  });

  it("will reveal hidden items underneath (multiple)", () => {
    const level = createLevelState([
      createPlacementColumn(
        4,
        createHiddenBlocks("white", "black", "black", "green")
      ),
      createPlacementColumn(
        4,
        createHiddenBlocks("black", "black", "white", "black")
      ),
      createPlacementColumn(
        4,
        createHiddenBlocks("green", "black", "green", "green")
      ),
      createPlacementColumn(4),
      createPlacementColumn(4)
    ]);
    const result = moveBlocks(level, { from: 0, to: 3 });

    const expected: LevelState = {
      blockTypes: ["black", "green", "white"],
      columns: [
        createPlacementColumn(4, [
          createBlock("black"),
          createBlock("black"),
          createBlock("green", true)
        ]),
        createPlacementColumn(4, [
          createBlock("black"),
          createBlock("black", true),
          createBlock("white", true),
          createBlock("black", true)
        ]),
        createPlacementColumn(4, [
          createBlock("green"),
          createBlock("black", true),
          createBlock("green", true),
          createBlock("green", true)
        ]),
        createPlacementColumn(4, [createBlock("white")]),
        createPlacementColumn(4)
      ],
      moves: []
    };
    expect(result).toEqual(expected);
  });

  it("locks placement column if complete", () => {
    const level = createLevelState([
      createPlacementColumn(
        4,
        createBlocks("white", "white", "black", "green")
      ),
      createPlacementColumn(4, createBlocks("black", "black")),
      createPlacementColumn(
        4,
        createBlocks("green", "black", "green", "green")
      ),
      createPlacementColumn(4, createBlocks("white", "white")),
      createPlacementColumn(4)
    ]);
    const result = moveBlocks(level, { from: 0, to: 3 });
    expect(result.columns[3].locked).toBe(true);
  });

  describe("locks and keys", () => {
    it("will not move lock", () => {
      const level = createLevelState([
        createPlacementColumn(
          4,
          createBlocks("ghost-lock", "white", "white", "black", "white")
        ),
        createPlacementColumn(4, [], "black"),
        createPlacementColumn(4)
      ]);

      const result = moveBlocks(level, { from: 0, to: 2 });
      expect(result).toEqual(level);
    });

    it("will not move a key into placement buffer", () => {
      const level = createLevelState([
        createPlacementColumn(
          4,
          createBlocks("ghost-key", "white", "white", "black", "white")
        ),
        createPlacementColumn(4, [], "black"),
        createPlacementColumn(4)
      ]);

      const result = moveBlocks(level, { from: 0, to: 2 });
      expect(result).toEqual(level);
    });

    it("will not move a key into buffer", () => {
      const level = createLevelState([
        createPlacementColumn(
          4,
          createBlocks("ghost-key", "white", "white", "black", "white")
        ),
        createPlacementColumn(4, [], "black"),
        createBufferColumn(4)
      ]);

      const result = moveBlocks(level, { from: 0, to: 2 });
      expect(result).toEqual(level);
    });

    it("will move a key into an inventory buffer", () => {
      const level = createLevelState([
        createPlacementColumn(
          4,
          createBlocks("ghost-key", "white", "white", "black", "white")
        ),
        createPlacementColumn(4, [], "black"),
        createBufferColumn(4, undefined, [], "inventory")
      ]);

      const expected = createLevelState([
        createPlacementColumn(
          4,
          createBlocks("white", "white", "black", "white")
        ),
        createPlacementColumn(4, [], "black"),
        createBufferColumn(4, undefined, createBlocks("ghost-key"), "inventory")
      ]);

      const result = moveBlocks(level, { from: 0, to: 2 });
      expect(result).toEqual(expected);
    });

    it("will stack a key into an inventory buffer", () => {
      const level = createLevelState([
        createPlacementColumn(
          4,
          createBlocks("ghost-key", "white", "white", "black", "white")
        ),
        createPlacementColumn(4, [], "black"),
        createBufferColumn(
          4,
          undefined,
          createBlocks("vampire-key"),
          "inventory"
        )
      ]);

      const expected = createLevelState([
        createPlacementColumn(
          4,
          createBlocks("white", "white", "black", "white")
        ),
        createPlacementColumn(4, [], "black"),
        createBufferColumn(
          4,
          undefined,
          createBlocks("ghost-key", "vampire-key"),
          "inventory"
        )
      ]);

      const result = moveBlocks(level, { from: 0, to: 2 });
      expect(result).toEqual(expected);
    });

    it("will refuse non-keys into an inventory buffer", () => {
      const level = createLevelState([
        createPlacementColumn(
          4,
          createBlocks("white", "white", "black", "white")
        ),
        createPlacementColumn(4, [], "black"),
        createBufferColumn(4, undefined, [], "inventory")
      ]);

      const result = moveBlocks(level, { from: 0, to: 2 });
      expect(result).toEqual(level);
    });

    it("will move a key on a matching lock", () => {
      const level = createLevelState([
        createPlacementColumn(
          4,
          createBlocks("ghost-key", "white", "white", "black", "white")
        ),
        createPlacementColumn(4, createBlocks("ghost-lock", "red")),
        createBufferColumn(4, undefined, [], "inventory")
      ]);

      const expected = createLevelState([
        createPlacementColumn(
          4,
          createBlocks("white", "white", "black", "white")
        ),
        createPlacementColumn(4, createBlocks("red")),
        createBufferColumn(4, undefined, [], "inventory")
      ]);

      const result = moveBlocks(level, { from: 0, to: 1 });
      expect(result.columns).toEqual(expected.columns);
    });
  });
});

describe(replayMoves, () => {
  it("executes a list of moves on a levelState", async () => {
    const random = mulberry32(TEST_SEED);
    const level = await generatePlayableLevel(getNormalSettings(1), { random });
    const finishedLevel = replayMoves(level, level.moves);
    expect(hasWon(finishedLevel)).toBe(true);
  });
});
