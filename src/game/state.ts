import { produce } from "immer";

import type { Key, Lock } from "./level-creation/lock-n-key";
import { keys, locks } from "./level-creation/lock-n-key";
import { moveBlocks, selectFromColumn } from "./actions";
import type { BlockColor, BlockType } from "./blocks";
import type { Block, LevelState } from "./types";

export const canPlaceAmount = (
  level: LevelState,
  columnIndex: number,
  blocks: Block[]
): number => {
  const column = level.columns[columnIndex];
  const spaceLeft = column.columnSize - column.blocks.length;

  if (isKey(blocks[0])) {
    if (column.type === "inventory") {
      return Math.min(spaceLeft, blocks.length);
    }

    if (column.blocks[0]) {
      const lock = matchingLockFor(blocks[0]);
      return column.blocks[0]?.blockType === lock ? 1 : 0;
    }

    return 0;
  }
  if (column.type === "inventory") {
    return 0;
  }

  if (column.type === "buffer" && column.limitColor === "rainbow") {
    return Math.min(spaceLeft, blocks.length);
  }

  const setColor = blocks[0].blockType;
  if (column.limitColor && column.limitColor !== setColor) {
    return 0;
  }
  if (column.blocks[0] && column.blocks[0].blockType !== setColor) {
    return 0;
  }
  return Math.min(spaceLeft, blocks.length);
};

export const hasWon = (level: LevelState): boolean =>
  level.columns.every(
    (col) =>
      (col.type === "placement" &&
        col.columnSize === col.blocks.length &&
        col.blocks.every((b) => b.blockType === col.blocks[0].blockType)) ||
      col.blocks.length === 0
  );

const createSignature = (level: LevelState) =>
  level.columns.map((c) => {
    const block = c.blocks[0];
    if (c.type === "inventory") return "inventory";
    if (block && isKey(block)) return "inventory";
    return block ? block.blockType : c.limitColor;
  });

const countHidden = (level: LevelState) =>
  level.columns.reduce(
    (r, c) => r + c.blocks.filter((b) => b.revealed === true).length,
    0
  );

const blockedByPlacement = (level: LevelState) => {
  const bufferSeries: [BlockType, amount: number, index: number][] = [];
  level.columns.forEach((col, index) => {
    if (col.blocks.length === 0) return;
    if (col.type !== "buffer") return;
    const countSame = selectFromColumn(level, index).length;
    bufferSeries.push([col.blocks[0].blockType, countSame, index]);
  });

  const placementSpaceForColor = (blockColor: BlockType, index: number) =>
    level.columns.reduce((acc, col, i) => {
      if (i === index) return acc;
      if (
        col.type === "placement" &&
        (col.limitColor === blockColor ||
          col.blocks[0]?.blockType === blockColor ||
          (col.limitColor === undefined && col.blocks.length === 0))
      ) {
        return acc + col.columnSize - col.blocks.length;
      }
      if (col.type === "buffer" && col.limitColor === "rainbow") {
        return acc + col.columnSize - col.blocks.length;
      }
      if (
        col.type === "buffer" &&
        (col.limitColor === blockColor ||
          col.blocks[0]?.blockType === blockColor)
      ) {
        return acc + col.columnSize - col.blocks.length;
      }
      return acc;
    }, 0);

  const hasPlacementSpace = bufferSeries.some(([color, _amount, index]) => {
    const largestFreeBufferSpace = placementSpaceForColor(color, index);
    return largestFreeBufferSpace > 0;
  });
  if (!hasPlacementSpace) return true;

  const canFit = bufferSeries.some(([color, amount, index]) => {
    const largestFreeBufferSpace = placementSpaceForColor(color, index);
    return amount <= largestFreeBufferSpace;
  });

  return !canFit;
};

const blockedByBuffer = (level: LevelState) => {
  const placementSeries: [BlockType, amount: number, index: number][] = [];
  const bufferSeries: [BlockType, amount: number, index: number][] = [];

  level.columns.forEach((col, index) => {
    if (col.blocks.length === 0 || col.type !== "placement" || col.locked)
      return;
    const countSame = selectFromColumn(level, index).length;
    if (countSame > 0) {
      placementSeries.push([col.blocks[0].blockType, countSame, index]);
    }
  });

  level.columns.forEach((col, index) => {
    if (col.blocks.length === 0 || col.type !== "buffer" || col.locked) return;
    const countSame = selectFromColumn(level, index).length;
    if (countSame > 0) {
      bufferSeries.push([col.blocks[0].blockType, countSame, index]);
    }
  });

  const bufferSpaceForColor = (blockColor: BlockType, index: number) =>
    level.columns.reduce((acc, col, i) => {
      if (i === index) return acc;
      if (
        col.type === "buffer" &&
        col.limitColor === undefined &&
        col.blocks.length === 0
      ) {
        return acc + col.columnSize;
      }
      if (col.type === "buffer" && col.limitColor === "rainbow") {
        return acc + col.columnSize - col.blocks.length;
      }
      if (
        col.type === "buffer" &&
        (col.limitColor === blockColor ||
          col.blocks[0]?.blockType === blockColor)
      ) {
        return acc + col.columnSize - col.blocks.length;
      }
      if (
        col.type === "placement" &&
        (col.limitColor === blockColor ||
          col.blocks[0]?.blockType === blockColor ||
          (col.limitColor === undefined && col.blocks.length === 0))
      ) {
        return acc + col.columnSize - col.blocks.length;
      }
      return acc;
    }, 0);

  const hasBufferSpace = placementSeries.some(([color, _amount, index]) => {
    const largestFreeBufferSpace = bufferSpaceForColor(color, index);
    return largestFreeBufferSpace > 0;
  });
  if (!hasBufferSpace) return true;

  const canFitFromPlacement = placementSeries.some(([color, amount, index]) => {
    const largestFreeBufferSpace = bufferSpaceForColor(color, index);

    return amount <= largestFreeBufferSpace;
  });

  const canMoveToSmallerBuffer = bufferSeries.some(([color, amount, index]) => {
    const currentColSize = level.columns[index].columnSize;
    if (level.columns[index].limitColor === color) return false;
    return level.columns.some(
      (col, bufIndex) =>
        col.type === "buffer" &&
        (col.limitColor === "rainbow" ||
          col.limitColor === color ||
          col.blocks[0]?.blockType === color ||
          (col.blocks.length === 0 && col.limitColor === undefined)) &&
        col.columnSize - col.blocks.length >= amount &&
        bufIndex !== index &&
        col.columnSize < currentColSize
    );
  });

  return !canFitFromPlacement && !canMoveToSmallerBuffer;
};

const countCompleted = (level: LevelState) =>
  level.columns.filter(
    (col) =>
      col.type === "placement" &&
      col.columnSize === col.blocks.length &&
      col.blocks.every((b) => b.blockType === col.blocks[0].blockType)
  ).length;

const countLocks = (level: LevelState) =>
  level.columns.reduce(
    (c, col) => c + col.blocks.filter((b) => isLock(b)).length,
    0
  );

const keyLockSolves = (level: LevelState) => {
  const locks = level.columns.filter((col) => isLock(col.blocks[0]));
  const keys = level.columns.filter((col) => isKey(col.blocks[0]));
  return locks.some((lock) =>
    keys.some((key) => isMatch(key.blocks[0], lock.blocks[0]))
  );
};

const keyStores = (level: LevelState) => {
  const chests = level.columns.filter(
    (col) => col.type === "inventory" && col.columnSize > col.blocks.length
  );
  const keys = level.columns.filter(
    (col) => col.type !== "inventory" && isKey(col.blocks[0])
  );
  return keys.length > 0 && chests.length > 0;
};

export const isStuck = (level: LevelState): boolean => {
  const topSignature = createSignature(level);
  const originalHidden = countHidden(level);
  const originalCompleted = countCompleted(level);
  const originalLocks = countLocks(level);

  const hasBuffers = level.columns.some(
    (c) => c.type === "buffer" || c.type === "inventory"
  );

  const initialBlocked =
    hasBuffers &&
    blockedByBuffer(level) &&
    blockedByPlacement(level) &&
    !keyLockSolves(level) &&
    !keyStores(level);

  if (initialBlocked) return true;

  return level.columns.every((_source, sourceIndex) => {
    let playLevel = level;

    const didChange = level.columns.some((_dest, destIndex) => {
      if (sourceIndex === destIndex) return false;
      playLevel = moveBlocks(playLevel, { from: sourceIndex, to: destIndex });
      const resultSig = createSignature(playLevel);
      const resultHidden = countHidden(playLevel);
      const resultCompleted = countCompleted(playLevel);
      const resultLocks = countLocks(playLevel);

      if (
        resultHidden !== originalHidden ||
        resultCompleted !== originalCompleted ||
        resultLocks !== originalLocks ||
        resultSig.some((c, i) => c !== topSignature[i]) ||
        hasWon(playLevel)
      ) {
        return true;
      }
      return false;
    });

    return !didChange;
  });
};

export const isLock = (block?: Block) => !!block?.blockType?.endsWith("-lock");
export const isKey = (block?: Block) => !!block?.blockType?.endsWith("-key");

export const isLockType = (blockType: BlockType): blockType is Lock =>
  locks.find((lk) => lk.name === blockType) !== undefined;
export const isKeyType = (blockType: BlockType): blockType is Key =>
  keys.find((lk) => lk.name === blockType) !== undefined;
export const isColorType = (blockType: BlockType): blockType is BlockColor =>
  !isKeyType(blockType) && !isLockType(blockType);

export const matchingLockFor = (block: Block) =>
  isKey(block) && block.blockType.split("-")[0] + "-lock";

export const isMatch = (keyBlock: Block, lockBlock: Block) =>
  isKey(keyBlock) &&
  isLock(lockBlock) &&
  lockBlock.blockType === matchingLockFor(keyBlock);

export const isLockSolvable = (level: LevelState): boolean =>
  level.columns.every(
    (col) =>
      !isLock(col.blocks.at(-1)) &&
      col.blocks.every((b, i) => {
        if (isKey(b)) {
          const lock = col.blocks[i + 1];
          return !lock || lock.blockType !== matchingLockFor(b);
        }
        return true;
      })
  ) && isKeysReachable(level);

export const isKeysReachable = (level: LevelState): boolean => {
  // Check if locks could all be opened
  // by keys in different columns, and that between keys and conditional locks are no circular dependencies

  type BlockWithCoordinates = `${BlockType}-${number}-${number}`;

  const keyDependencies = new Map<
    BlockWithCoordinates,
    Set<BlockWithCoordinates>
  >();

  level.columns.forEach((col, x) => {
    col.blocks.forEach((block, y) => {
      if (isKey(block)) {
        const dependencies = new Set<BlockWithCoordinates>();
        for (let i = y - 1; i >= 0; i--) {
          const aboveBlock = col.blocks[i];
          if (isLock(aboveBlock)) {
            dependencies.add(`${aboveBlock.blockType}-${x}-${i}`);
          }
        }
        keyDependencies.set(`${block.blockType}-${x}-${y}`, dependencies);
      }
      if (isLock(block)) {
        const dependencies = new Set<BlockWithCoordinates>();

        level.columns.forEach((col, x) => {
          col.blocks.forEach((key, y) => {
            if (isMatch(key, block)) {
              dependencies.add(`${key.blockType}-${x}-${y}`);
            }
          });
        });

        keyDependencies.set(`${block.blockType}-${x}-${y}`, dependencies);
      }
    });
  });

  const canUnlock = (
    lock: BlockWithCoordinates,
    visited: Set<string>
  ): boolean => {
    if (visited.has(lock)) return false;
    visited.add(lock);

    const keys = keyDependencies.get(lock);
    if (!keys || keys.size === 0) return false;

    return Array.from(keys).some((key) => {
      const blockLocks = keyDependencies.get(key);
      if (!blockLocks || blockLocks.size === 0) return true;

      return false;
    });
  };

  for (const [block] of keyDependencies) {
    const lockOrKey = block.split("-")[1];
    if (lockOrKey === "lock") {
      const visited = new Set<string>();
      if (!canUnlock(block, visited)) {
        return false;
      }
    }
  }

  return true;
};

export const allShuffled = (level: LevelState): boolean =>
  level.columns.every(
    (c) =>
      c.blocks.length < c.columnSize ||
      c.blocks.map((b) => b.blockType).filter((b, i, l) => l.indexOf(b) === i)
        .length > 1
  );

export const getRevealedIndices = (
  previousLevelState: LevelState,
  newLevelState: LevelState,
  columnIndex: number
) => {
  const previous = previousLevelState.columns[columnIndex].blocks;
  const size = newLevelState.columns[columnIndex].columnSize;
  const prevBlockCount = previous.length;
  const blockCount = newLevelState.columns[columnIndex].blocks.length;
  const offset = prevBlockCount - blockCount;

  return newLevelState.columns[columnIndex].blocks
    .map((block, i) => ({
      i: size - blockCount + i,
      newlyRevealed: !!block.revealed && !previous[offset + i].revealed
    }))
    .filter(({ newlyRevealed }) => newlyRevealed)
    .map(({ i }) => i);
};

export const revealBlocks = (
  levelState: LevelState,
  revealed: { col: number; row: number }[]
) =>
  produce(levelState, (draft) => {
    revealed.forEach(({ col, row }) => {
      draft.columns[col].blocks[row].revealed = true;
    });
  });
