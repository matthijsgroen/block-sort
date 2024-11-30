import { moveBlocks } from "../actions";
import { LevelState } from "../types";

const findLastIndex = <T>(
  array: T[],
  predicate: (value: T, index: number, obj: T[]) => boolean
): number => {
  // Iterate from the end of the array to the beginning
  for (let i = array.length - 1; i >= 0; i--) {
    if (predicate(array[i], i, array)) {
      return i; // Return the index if the condition is met
    }
  }
  return -1; // Return -1 if no element satisfies the condition
};

export const optimizeMoves = (level: LevelState): LevelState => {
  let levelClone: LevelState = JSON.parse(JSON.stringify(level)) as LevelState;

  const movesWithHash: { from: number; to: number; hash: string }[] =
    level.moves.map((move) => {
      levelClone = moveBlocks(levelClone, move);
      return {
        from: move.from,
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
  const optimizedMoves = movesWithHash.map((move) => ({
    from: move.from,
    to: move.to
  }));

  return { ...level, moves: optimizedMoves };
};
