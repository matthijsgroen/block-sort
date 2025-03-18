import { selectFromColumn } from "@/game/actions";
import type { LevelState, Move } from "@/game/types";

const EMPTY = { ghostTarget: undefined, ghostSelection: undefined };

export const ghostModeModifier = (
  levelState: LevelState,
  previousLevelMoves: Move[],
  levelMoves: Move[],
  { enabled = true } = {}
) => {
  if (!enabled) {
    return EMPTY;
  }
  const ghostMoves = previousLevelMoves.filter(
    (m, i) => levelMoves[i]?.from === m.from && levelMoves[i]?.to === m.to
  );
  const canGhostMove = levelMoves.length === ghostMoves.length;
  if (!canGhostMove) {
    return EMPTY;
  }

  const nextGhostMove = previousLevelMoves[levelMoves.length];
  if (!nextGhostMove) {
    return EMPTY;
  }

  const ghostSelection: [column: number, amount: number] | undefined = [
    nextGhostMove.from,
    selectFromColumn(levelState, nextGhostMove.from).length
  ];

  const ghostTarget: number | undefined = nextGhostMove.to;

  return { ghostTarget, ghostSelection };
};
