import { moveBlocks } from "../actions";
import { Column, LevelState, Move } from "../types";

import { canPlaceBlock, isColumnCorrectlySorted } from "./tactics/support";

const columnCompletionScore = (state: LevelState): number =>
  state.columns.reduce((score, col) => {
    if (col.blocks.length === 0) return score; // Empty column, neutral
    const max = col.type === "placement" ? 10 : 5;
    const firstColor = col.blocks[0].color;
    const sameColorBlocks = col.blocks.filter(
      (b) => b.color === firstColor
    ).length;
    const completion = sameColorBlocks / col.blocks.length;
    return (
      score + (completion === 1 ? max * 2 * sameColorBlocks : completion * max)
    ); // Bonus for completed columns
  }, 0);

const bufferPenalty = (state: LevelState): number => {
  return state.columns.reduce((penalty, col) => {
    if (col.type === "buffer") {
      return penalty - col.blocks.length * 2; // Penalty for each block in buffer
    }
    return penalty;
  }, 0);
};

const blockingPenalty = (state: LevelState): number =>
  state.columns.reduce((penalty, col) => {
    for (let i = 1; i < col.blocks.length; i++) {
      if (col.blocks[i].color !== col.blocks[i - 1].color) {
        penalty -= 5; // Penalty for each block that is blocked by a different color
      }
    }
    return penalty;
  }, 0);

const isValidMove = (from: Column, to: Column): boolean => {
  if (from.blocks.length === 0) return false;
  return canPlaceBlock(to, from.blocks[0]);
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
  const maxBlocks = Math.max(
    ...state.columns
      .filter((c) => c.type === "placement")
      .map((col) => col.blocks.length)
  );
  const minBlocks = Math.min(
    ...state.columns
      .filter((c) => c.type === "placement")
      .map((col) => col.blocks.length)
  );
  return (maxBlocks - minBlocks) * -1; // Negative score for imbalance
};

const splittingPenalty = (state: LevelState, move: Move): number => {
  const fromColumn = state.columns[move.from];
  if (isColumnCorrectlySorted(fromColumn)) {
    return -10; // Arbitrary penalty value for breaking a sorted column
  }
  return 0;
};

const isBufferMove = (state: LevelState, move: Move): boolean => {
  const fromColumn = state.columns[move.from];
  const toColumn = state.columns[move.to];

  return (
    fromColumn.type === "buffer" &&
    toColumn.type === "buffer" &&
    fromColumn.columnSize === toColumn.columnSize &&
    toColumn.blocks.length === 0
  );
};

const isPartialMove = (state: LevelState, move: Move): boolean => {
  const fromColumn = state.columns[move.from];
  return (
    fromColumn.blocks.length > 0 &&
    fromColumn.blocks.some(
      (block, index) =>
        index < fromColumn.blocks.length - 1 &&
        block.color !== fromColumn.blocks[0].color
    )
  );
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

export const scoreStateWithMove = (state: LevelState, move: Move): number => {
  const newState = moveBlocks(state, move);

  let score = scoreState(newState);

  if (isBufferMove(state, move)) {
    score -= 10;
  }

  if (isPartialMove(state, move)) {
    score -= 5;
  }
  score += splittingPenalty(state, move);
  return score;
};
