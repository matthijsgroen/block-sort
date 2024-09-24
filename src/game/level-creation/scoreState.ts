import { Column, LevelState } from "../types";

const columnCompletionScore = (state: LevelState): number => {
  return state.columns.reduce((score, col) => {
    if (col.blocks.length === 0) return score; // Empty column, neutral
    const firstColor = col.blocks[0].color;
    const sameColorBlocks = col.blocks.filter(
      (b) => b.color === firstColor
    ).length;
    const completion = sameColorBlocks / col.blocks.length;
    return score + (completion === 1 ? 10 : completion * 5); // Bonus for completed columns
  }, 0);
};

const bufferPenalty = (state: LevelState): number => {
  return state.columns.reduce((penalty, col) => {
    if (col.type === "buffer") {
      return penalty - col.blocks.length * 2; // Penalty for each block in buffer
    }
    return penalty;
  }, 0);
};

const blockingPenalty = (state: LevelState): number => {
  return state.columns.reduce((penalty, col) => {
    for (let i = 1; i < col.blocks.length; i++) {
      if (col.blocks[i].color !== col.blocks[i - 1].color) {
        penalty -= 5; // Penalty for each block that is blocked by a different color
      }
    }
    return penalty;
  }, 0);
};

const isValidMove = (from: Column, to: Column): boolean => {
  if (from.blocks.length === 0) return false;
  if (to.blocks.length === 0 && to.limitColor === undefined) return true;

  const topBlock = from.blocks[0];
  if (topBlock.color === to.limitColor && to.blocks.length < to.columnSize)
    return true;

  const targetBlock = to.blocks[0];
  if (
    targetBlock !== undefined &&
    topBlock.color === targetBlock.color &&
    to.columnSize > to.blocks.length
  )
    return true;

  return false;
};

const futureMovePotential = (state: LevelState): number => {
  let potentialMoves = 0;
  for (let i = 0; i < state.columns.length; i++) {
    for (let j = 0; j < state.columns.length; j++) {
      if (i !== j && isValidMove(state.columns[i], state.columns[j])) {
        potentialMoves++;
      }
    }
  }
  return potentialMoves * 2; // Higher score for more valid moves
};

const lockedColumnReward = (state: LevelState): number => {
  return state.columns.reduce((score, col) => {
    if (col.locked && col.blocks.every((b) => b.color === col.limitColor)) {
      return score + 15; // Bonus for fully locked and sorted columns
    }
    return score;
  }, 0);
};

const balanceScore = (state: LevelState): number => {
  const maxBlocks = Math.max(...state.columns.map((col) => col.blocks.length));
  const minBlocks = Math.min(...state.columns.map((col) => col.blocks.length));
  return (maxBlocks - minBlocks) * -1; // Negative score for imbalance
};

export const scoreState = (state: LevelState): number => {
  const columnCompletion = columnCompletionScore(state);
  const bufferUsage = bufferPenalty(state);
  const blockedPenalty = blockingPenalty(state);
  const movePotential = futureMovePotential(state);
  const lockedReward = lockedColumnReward(state);
  const balance = balanceScore(state);

  return (
    columnCompletion +
    bufferUsage +
    blockedPenalty +
    movePotential +
    lockedReward +
    balance
  );
};
