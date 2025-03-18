import { describe, expect, it } from "vitest";

import {
  createBlocks,
  createBufferColumn,
  createLevelState,
  createPlacementColumn
} from "@/game/factories";
import { mulberry32 } from "@/support/random";

import { generateRandomLevel } from "../generateRandomLevel";

import { removeLock, storeKey } from "./lockAndKey";

const TEST_SEED = 123456789;

describe(storeKey, () => {
  it("returns no moves if no inventory", () => {
    const random = mulberry32(TEST_SEED);
    const level = generateRandomLevel(
      {
        amountColors: 4,
        stackSize: 4,
        extraPlacementStacks: 2
      },
      random
    );
    const moves = storeKey(level, random);

    expect(moves).toHaveLength(0);
  });

  it("suggests to store the key", () => {
    const random = mulberry32(TEST_SEED);
    const level = createLevelState([
      createPlacementColumn(4, createBlocks("aqua", "pink", "green", "aqua")),
      createPlacementColumn(4, createBlocks("red", "pink", "red")),
      createPlacementColumn(
        4,
        createBlocks("vampire-key", "pink", "red", "green")
      ),
      createPlacementColumn(4, createBlocks("pink", "aqua", "green", "green")),
      createPlacementColumn(4, createBlocks("aqua")),
      createPlacementColumn(4),
      createBufferColumn(1, undefined, [], "inventory")
    ]);
    const moves = storeKey(level, random);

    expect(moves).toHaveLength(1);
    expect(moves[0].weight).toEqual(15);
    expect(moves[0].move.from).toEqual(2);
    expect(moves[0].move.to).toEqual(6);
  });
});

describe(removeLock, () => {
  it("returns no moves if no lock or key on top", () => {
    const random = mulberry32(TEST_SEED);
    const level = createLevelState([
      createPlacementColumn(4, createBlocks("aqua", "pink", "green", "aqua")),
      createPlacementColumn(4, createBlocks("red", "pink", "red")),
      createPlacementColumn(
        4,
        createBlocks("vampire-key", "pink", "red", "green")
      ),
      createPlacementColumn(
        4,
        createBlocks("pink", "aqua", "vampire-lock", "green")
      ),
      createPlacementColumn(4, createBlocks("aqua")),
      createPlacementColumn(4),
      createBufferColumn(1, undefined, [], "inventory")
    ]);
    const moves = removeLock(level, random);

    expect(moves).toHaveLength(0);
  });

  it("suggests to remove lock", () => {
    const random = mulberry32(TEST_SEED);
    const level = createLevelState([
      createPlacementColumn(4, createBlocks("aqua", "pink", "green", "aqua")),
      createPlacementColumn(4, createBlocks("red", "pink", "red")),
      createPlacementColumn(
        4,
        createBlocks("vampire-key", "pink", "red", "green")
      ),
      createPlacementColumn(4, createBlocks("pink", "aqua", "green", "green")),
      createPlacementColumn(4, createBlocks("vampire-lock")),
      createPlacementColumn(4),
      createBufferColumn(1, undefined, [], "inventory")
    ]);
    const moves = removeLock(level, random);

    expect(moves).toHaveLength(1);
    expect(moves[0].weight).toEqual(30);
    expect(moves[0].move.from).toEqual(2);
    expect(moves[0].move.to).toEqual(4);
  });

  it("suggests to remove lock with different weights", () => {
    const random = mulberry32(TEST_SEED);
    const level = createLevelState([
      createPlacementColumn(4, createBlocks("aqua", "pink", "green", "aqua")),
      createPlacementColumn(4, createBlocks("red", "pink", "red")),
      createPlacementColumn(
        4,
        createBlocks("vampire-key", "pink", "red", "green")
      ),
      createPlacementColumn(4, createBlocks("pink", "aqua", "green", "green")),
      createPlacementColumn(4, createBlocks("vampire-lock")),
      createPlacementColumn(4),
      createBufferColumn(1, undefined, createBlocks("vampire-key"), "inventory")
    ]);
    const moves = removeLock(level, random);

    expect(moves).toHaveLength(2);
    expect(moves[0].weight).toEqual(30);
    expect(moves[0].move.from).toEqual(2);
    expect(moves[0].move.to).toEqual(4);

    expect(moves[1].weight).toEqual(20);
    expect(moves[1].move.from).toEqual(6);
    expect(moves[1].move.to).toEqual(4);
  });
});
