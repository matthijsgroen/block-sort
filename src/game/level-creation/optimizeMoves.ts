import { findLastIndex } from "@/support/findLastIndex";

import { moveBlocks, selectFromColumn } from "../actions";
import type { LevelState } from "../types";

export const optimizeMoves = (level: LevelState): LevelState => {
  let levelClone: LevelState = JSON.parse(JSON.stringify(level)) as LevelState;

  const movesWithHash: {
    from: number;
    to: number;
    amount: number;
    bufferJump: boolean;
    hash: string;
  }[] = level.moves.map((move) => {
    const selection = selectFromColumn(levelClone, move.from);

    levelClone = moveBlocks(levelClone, move);
    const fromColumn = levelClone.columns[move.from];
    const toColumn = levelClone.columns[move.to];

    const isBufferJump =
      fromColumn.type === toColumn.type &&
      fromColumn.type === "buffer" &&
      fromColumn.columnSize === toColumn.columnSize &&
      selection.length === fromColumn.columnSize;

    return {
      from: move.from,
      bufferJump: isBufferJump,
      amount: selection.length,
      to: move.to,
      hash: JSON.stringify(levelClone.columns)
    };
  });

  for (let i = 0; i < movesWithHash.length; i++) {
    const hash = movesWithHash[i].hash;
    const highestIndex = findLastIndex(
      movesWithHash,
      (move) => move.hash === hash
    );
    if (highestIndex !== i) {
      movesWithHash.splice(i + 1, highestIndex - i);
    }
  }
  for (let i = 0; i < movesWithHash.length; i++) {
    if (movesWithHash[i].bufferJump) {
      // find move that moved blocks to the from column, if directly before
      const j = i - 1;
      if (movesWithHash[j].to === movesWithHash[i].from) {
        if (movesWithHash[j].amount === movesWithHash[i].amount) {
          // Target column is empty at the time, since action was directly before
          movesWithHash[j].to = movesWithHash[i].to;
          movesWithHash.splice(i, 1);
          i--;
        }
      }
    }
  }

  const optimizedMoves = movesWithHash.map((move) => ({
    from: move.from,
    to: move.to
  }));

  return { ...level, moves: optimizedMoves };
};
