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

const blockedByPlacement = (level: LevelState) => {
  const bufferSeries: [BlockColor, amount: number, index: number][] = [];
  level.columns.forEach((col, index) => {
    if (col.blocks.length === 0) return;
    if (col.type !== "buffer") return;
    const countSame = selectFromColumn(level, index).length;
    bufferSeries.push([col.blocks[0].color, countSame, index]);
  });

  const placementSpaceForColor = (blockColor: BlockColor, index: number) =>
    level.columns.reduce((acc, col, i) => {
      if (i === index) return acc;
      if (
        col.type === "placement" &&
        (col.limitColor === blockColor ||
          col.blocks[0]?.color === blockColor ||
          (col.limitColor === undefined && col.blocks.length === 0))
      ) {
        return acc + col.columnSize - col.blocks.length;
      }
      if (col.type === "buffer" && col.limitColor === "rainbow") {
        return acc + col.columnSize - col.blocks.length;
      }
      if (
        col.type === "buffer" &&
        (col.limitColor === blockColor || col.blocks[0]?.color === blockColor)
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
  const placementSeries: [BlockColor, amount: number, index: number][] = [];
  level.columns.forEach((col, index) => {
    if (col.blocks.length === 0) return;
    if (col.type !== "placement") return;
    const countSame = selectFromColumn(level, index).length;
    placementSeries.push([col.blocks[0].color, countSame, index]);
  });

  const bufferSpaceForColor = (blockColor: BlockColor, index: number) =>
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
        (col.limitColor === blockColor || col.blocks[0]?.color === blockColor)
      ) {
        return acc + col.columnSize - col.blocks.length;
      }
      if (
        col.type === "placement" &&
        (col.limitColor === blockColor ||
          col.blocks[0]?.color === blockColor ||
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

  const canFit = placementSeries.some(([color, amount, index]) => {
    const largestFreeBufferSpace = bufferSpaceForColor(color, index);

    return amount <= largestFreeBufferSpace;
  });

  return !canFit;
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

  const hasBuffers = level.columns.some((c) => c.type === "buffer");

  const initialBlocked =
    hasBuffers && blockedByBuffer(level) && blockedByPlacement(level);
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
