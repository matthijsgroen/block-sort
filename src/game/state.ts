import { produce } from "immer";

import { moveBlocks, selectFromColumn } from "./actions";
import { Block, BlockColor, LevelState } from "./types";

export const canPlaceAmount = (
  level: LevelState,
  columnIndex: number,
  blocks: Block[]
): number => {
  const column = level.columns[columnIndex];
  const spaceLeft = column.columnSize - column.blocks.length;

  if (column.type === "buffer" && column.limitColor === "rainbow") {
    return Math.min(spaceLeft, blocks.length);
  }

  const setColor = blocks[0].color;
  if (column.limitColor && column.limitColor !== setColor) {
    return 0;
  }
  if (column.blocks[0] && column.blocks[0].color !== setColor) {
    return 0;
  }
  return Math.min(spaceLeft, blocks.length);
};

export const hasWon = (level: LevelState): boolean =>
  level.columns.every(
    (col) =>
      (col.type === "placement" &&
        col.columnSize === col.blocks.length &&
        col.blocks.every((b) => b.color === col.blocks[0].color)) ||
      col.blocks.length === 0
  );

const createSignature = (level: LevelState) =>
  level.columns.map((c) => {
    const block = c.blocks[0];
    return block ? block.color : c.limitColor;
  });

const countHidden = (level: LevelState) =>
  level.columns.reduce(
    (r, c) => r + c.blocks.filter((b) => b.revealed === true).length,
    0
  );

const blockedByBuffer = (level: LevelState) => {
  const smallestAvailableSeries = level.columns.reduce<
    [BlockColor, amount: number]
  >(
    (acc, col, index) => {
      if (col.blocks.length === 0) return acc;
      if (col.type !== "placement") return acc;
      const countSame = selectFromColumn(level, index).length;
      if (countSame < acc[1]) {
        return [col.blocks[0].color, countSame];
      }
      return acc;
    },
    ["red", Infinity]
  );

  const blockColor = smallestAvailableSeries[0];

  const largestFreeBufferSpace = level.columns.reduce((acc, col) => {
    if (
      col.type === "buffer" &&
      col.limitColor === undefined &&
      col.blocks.length === 0
    ) {
      return acc + col.columnSize;
    }
    if (
      col.type === "buffer" &&
      (col.limitColor === blockColor || col.blocks[0]?.color === blockColor)
    ) {
      return acc + col.columnSize - col.blocks.length;
    }
    return acc;
  }, 0);

  if (largestFreeBufferSpace === 0) return false;
  return smallestAvailableSeries[1] > largestFreeBufferSpace;
};

const countCompleted = (level: LevelState) =>
  level.columns.filter(
    (col) =>
      col.type === "placement" &&
      col.columnSize === col.blocks.length &&
      col.blocks.every((b) => b.color === col.blocks[0].color)
  ).length;

export const isStuck = (level: LevelState): boolean => {
  const topSignature = createSignature(level);
  const originalHidden = countHidden(level);
  const originalCompleted = countCompleted(level);

  const initialBlocked = blockedByBuffer(level);
  if (initialBlocked) return true;

  return level.columns.every((_source, sourceIndex) => {
    let playLevel = level;

    const didChange = level.columns.some((_dest, destIndex) => {
      if (sourceIndex === destIndex) return false;
      playLevel = moveBlocks(playLevel, { from: sourceIndex, to: destIndex });
      const resultSig = createSignature(playLevel);
      const resultHidden = countHidden(playLevel);
      const resultCompleted = countCompleted(playLevel);
      if (
        resultHidden !== originalHidden ||
        resultCompleted !== originalCompleted ||
        (resultSig.some((c, i) => c !== topSignature[i]) &&
          !blockedByBuffer(playLevel)) ||
        hasWon(playLevel)
      ) {
        return true;
      }
      return false;
    });

    return !didChange;
  });
};

export const allShuffled = (level: LevelState): boolean =>
  level.columns.every(
    (c) =>
      c.blocks.length < c.columnSize ||
      c.blocks.map((b) => b.color).filter((b, i, l) => l.indexOf(b) === i)
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
