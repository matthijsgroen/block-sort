export type HintMode = "standard" | "eager" | "off";

type HintSystem = {
  minLoseCount: number;
  initialSteps: number;
  increaseStep: number;
  loseIterationCount: number;
  maxSolvePercentage: number;
};

const hintSystems: Record<HintMode, HintSystem> = {
  standard: {
    minLoseCount: 15,
    initialSteps: 5,
    increaseStep: 5,
    loseIterationCount: 3,
    maxSolvePercentage: 0.5
  },
  eager: {
    minLoseCount: 5,
    initialSteps: 5,
    increaseStep: 3,
    loseIterationCount: 1,
    maxSolvePercentage: 0.95
  },
  off: {
    minLoseCount: 15,
    initialSteps: 0,
    increaseStep: 1,
    loseIterationCount: 0,
    maxSolvePercentage: 0
  }
};

export const getAutoMoveCount = (
  lostCounter: number,
  solverMoves: number,
  hintMode: HintMode = "standard"
) => {
  const system = hintSystems[hintMode];

  if (lostCounter < system.minLoseCount) {
    return 0;
  }
  const autoMoves =
    system.initialSteps +
    Math.floor(
      (lostCounter - system.minLoseCount) / system.loseIterationCount
    ) *
      system.increaseStep;

  return Math.max(
    Math.min(autoMoves, Math.floor(solverMoves * system.maxSolvePercentage)),
    0
  );
};
