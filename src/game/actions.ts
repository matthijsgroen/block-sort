import { produce } from "immer";

import { canPlaceAmount } from "./state";
import { Block, BlockColor, LevelState, Move } from "./types";

export const selectFromColumn = (
  level: LevelState,
  columnIndex: number
): Block[] => {
  const result: Block[] = [];
  if (level.columns[columnIndex].locked) {
    return result;
  }

  let color: BlockColor | null = null;
  let index = 0;

  let topBlock = level.columns[columnIndex].blocks[index];
  while (
    (topBlock?.color === color || color === null) &&
    topBlock?.revealed !== false &&
    topBlock !== undefined
  ) {
    result.push(topBlock);
    color = topBlock.color;
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

    const topBlockOrigin = draft.columns[move.from].blocks[0];
    if (topBlockOrigin?.revealed === false) {
      topBlockOrigin.revealed = true;

      let index = 1;
      let nextBlockOrigin = draft.columns[move.from].blocks[index];
      while (nextBlockOrigin?.color === topBlockOrigin.color) {
        nextBlockOrigin.revealed = true;
        index++;
        nextBlockOrigin = draft.columns[move.from].blocks[index];
      }
    }
    const endCol = draft.columns[move.to];
    endCol.blocks.unshift(...moving);
    const moveColor = moving[0].color;

    if (
      endCol.type === "placement" &&
      endCol.blocks.length === endCol.columnSize &&
      endCol.blocks.every((b) => b.color === moveColor)
    ) {
      endCol.blocks.forEach((b) => {
        b.revealed = true;
      });
      endCol.locked = true;
    }
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
