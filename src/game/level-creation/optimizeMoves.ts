import { moveBlocks } from "../actions";
import { LevelState } from "../types";

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
    const highestIndex = movesWithHash.findLastIndex(
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
