import { produce } from "immer";

import { findLastIndex } from "@/support/findLastIndex";

import type { BlockType } from "./blocks";
import { canPlaceAmount, isKey, isLock, matchingLockFor } from "./state";
import type { Block, Column, LevelState, Move } from "./types";

export const selectFromColumn = (
  level: LevelState,
  columnIndex: number
): Block[] => {
  const result: Block[] = [];
  if (level.columns[columnIndex].locked) {
    return result;
  }

  let color: BlockType | null = null;
  let index = 0;

  let topBlock = level.columns[columnIndex].blocks[index];

  if (isLock(topBlock)) {
    return result;
  }
  if (isKey(topBlock)) {
    return [topBlock];
  }
  while (
    (topBlock?.blockType === color || color === null) &&
    topBlock?.revealed !== false &&
    topBlock !== undefined
  ) {
    result.push(topBlock);
    color = topBlock.blockType;
    index++;
    topBlock = level.columns[columnIndex].blocks[index];
  }
  return result;
};

export const moveBlocks = (level: LevelState, move: Move): LevelState =>
  produce<LevelState>((draft) => {
    if (move.from === move.to) {
      return;
    }
    const blocks = selectFromColumn(draft, move.from);
    if (blocks.length === 0) return;
    const amountToMove = canPlaceAmount(draft, move.to, blocks);
    const moving = draft.columns[move.from].blocks.splice(0, amountToMove);
    if (moving.length === 0 || amountToMove === 0) return;

    if (moving.length === 1 && isKey(blocks[0])) {
      const lock = matchingLockFor(blocks[0]);
      if (draft.columns[move.to].blocks[0]?.blockType === lock) {
        draft.columns[move.to].blocks.shift();
        const topBlockTarget = draft.columns[move.to].blocks[0];
        if (topBlockTarget?.revealed === false) {
          topBlockTarget.revealed = true;
        }
        const topBlockOrigin = draft.columns[move.from].blocks[0];
        if (topBlockOrigin?.revealed === false) {
          topBlockOrigin.revealed = true;
        }
        return;
      }
    }

    const topBlockOrigin = draft.columns[move.from].blocks[0];
    if (topBlockOrigin?.revealed === false) {
      topBlockOrigin.revealed = true;

      let index = 1;
      let nextBlockOrigin = draft.columns[move.from].blocks[index];
      while (nextBlockOrigin?.blockType === topBlockOrigin.blockType) {
        nextBlockOrigin.revealed = true;
        index++;
        nextBlockOrigin = draft.columns[move.from].blocks[index];
      }
    }
    const endCol = draft.columns[move.to];
    endCol.blocks.unshift(...moving);
    const moveColor = moving[0].blockType;

    if (
      endCol.type === "placement" &&
      endCol.blocks.length === endCol.columnSize &&
      endCol.blocks.every((b) => b.blockType === moveColor)
    ) {
      endCol.blocks.forEach((b) => {
        b.revealed = true;
      });
      endCol.locked = true;
    }
    if (
      endCol.type === "placement" &&
      endCol.blocks.length < endCol.columnSize &&
      endCol.blocks.every((b) => b.blockType === moveColor) &&
      draft.columns.every(
        (c) => c === endCol || c.blocks.every((b) => b.blockType !== moveColor)
      )
    ) {
      while (endCol.blocks.length < endCol.columnSize) {
        endCol.blocks.push({ blockType: moveColor, revealed: true });
      }
      endCol.blocks.forEach((b) => {
        b.revealed = true;
      });
      endCol.locked = true;
    }
  })(level);

const columnHasHidableBlocks = (c: Column): boolean =>
  c.locked !== true &&
  c.blocks.some((b, i, l) => b.revealed !== false && i < l.length - 1);

const hideIndex = (c: Column): number =>
  findLastIndex(c.blocks, (b) => b.revealed !== false);

export const hideBlock = (level: LevelState): LevelState =>
  produce<LevelState>((draft) => {
    const canHide = draft.columns.some(columnHasHidableBlocks);
    if (!canHide) {
      return draft;
    }

    const potentialColumns = draft.columns
      .filter(columnHasHidableBlocks)
      .sort((a, b) => {
        return hideIndex(b) - hideIndex(a);
      });
    const hideColumn = potentialColumns[0];
    const blockIndex = hideIndex(hideColumn);

    hideColumn.blocks[blockIndex].revealed = false;
  })(level);

export const replayMoves = (
  levelState: LevelState,
  moves: Move[]
): LevelState => {
  let state = levelState;
  for (const move of moves) {
    state = moveBlocks(state, move);
  }
  return state;
};
