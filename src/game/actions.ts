import { produce } from "immer";

import { canPlaceAmount } from "./state";
import { Block, BlockColor, LevelState, Move } from "./types";

export const selectFromColumn = (
  level: LevelState,
  columnIndex: number,
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

export const moveBlocks = (
  level: LevelState,
  startColumn: number,
  endColumn: number,
): LevelState =>
  produce<LevelState>((draft) => {
    if (startColumn === endColumn) {
      return;
    }
    const blocks = selectFromColumn(draft, startColumn);
    if (blocks.length === 0) return;
    const amountToMove = canPlaceAmount(draft, endColumn, blocks);
    const moving = draft.columns[startColumn].blocks.splice(0, amountToMove);
    if (moving.length === 0) return;

    const topBlockOrigin = draft.columns[startColumn].blocks[0];
    if (topBlockOrigin?.revealed === false) {
      topBlockOrigin.revealed = true;

      let index = 1;
      let nextBlockOrigin = draft.columns[startColumn].blocks[index];
      while (nextBlockOrigin?.color === topBlockOrigin.color) {
        nextBlockOrigin.revealed = true;
        index++;
        nextBlockOrigin = draft.columns[startColumn].blocks[index];
      }
    }
    const endCol = draft.columns[endColumn];
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
  moves: Move[],
): LevelState =>
  moves.reduce<LevelState>(
    (state, { from, to }) => moveBlocks(state, from, to),
    levelState,
  );
