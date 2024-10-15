import { produce } from "immer";

import { moveBlocks } from "./actions";
import { Block, LevelState } from "./types";

export const canPlaceAmount = (
  level: LevelState,
  columnIndex: number,
  blocks: Block[],
): number => {
  const column = level.columns[columnIndex];
  const spaceLeft = column.columnSize - column.blocks.length;

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
      col.blocks.length === 0,
  );

export const isStuck = (level: LevelState): boolean => {
  const createSignature = (level: LevelState) =>
    level.columns.map((c) => {
      const block = c.blocks[0];
      return block ? block.color : c.limitColor;
    });

  const countHidden = (level: LevelState) =>
    level.columns.reduce(
      (r, c) => r + c.blocks.filter((b) => b.revealed === true).length,
      0,
    );

  const countCompleted = (level: LevelState) =>
    level.columns.filter(
      (col) =>
        col.type === "placement" &&
        col.columnSize === col.blocks.length &&
        col.blocks.every((b) => b.color === col.blocks[0].color),
    ).length;

  const topSignature = createSignature(level);
  const originalHidden = countHidden(level);
  const originalCompleted = countCompleted(level);

  return level.columns.every((_source, sourceIndex) => {
    let didChange = false;
    let playLevel = level;

    level.columns.forEach((_dest, destIndex) => {
      if (sourceIndex === destIndex) return false;
      playLevel = moveBlocks(playLevel, sourceIndex, destIndex);
      const resultSig = createSignature(playLevel);
      const resultHidden = countHidden(playLevel);
      const resultCompleted = countCompleted(playLevel);
      if (
        resultHidden !== originalHidden ||
        resultCompleted !== originalCompleted ||
        resultSig.some((c, i) => c !== topSignature[i]) ||
        hasWon(playLevel)
      ) {
        didChange = true;
      }
    });

    return !didChange;
  });
};

export const allShuffled = (level: LevelState): boolean =>
  level.columns.every(
    (c) =>
      c.blocks.length < c.columnSize ||
      c.blocks.map((b) => b.color).filter((b, i, l) => l.indexOf(b) === i)
        .length > 1,
  );

export const getRevealedIndices = (
  previousLevelState: LevelState,
  newLevelState: LevelState,
  columnIndex: number,
) => {
  const previous = previousLevelState.columns[columnIndex].blocks;
  const size = newLevelState.columns[columnIndex].columnSize;
  const prevBlockCount = previous.length;
  const blockCount = newLevelState.columns[columnIndex].blocks.length;
  const offset = prevBlockCount - blockCount;

  return newLevelState.columns[columnIndex].blocks
    .map((block, i) => ({
      i: size - blockCount + i,
      newlyRevealed: !!block.revealed && !previous[offset + i].revealed,
    }))
    .filter(({ newlyRevealed }) => newlyRevealed)
    .map(({ i }) => i);
};

export const revealBlocks = (
  levelState: LevelState,
  revealed: { col: number; row: number }[],
) =>
  produce(levelState, (draft) => {
    revealed.forEach(({ col, row }) => {
      draft.columns[col].blocks[row].revealed = true;
    });
  });
