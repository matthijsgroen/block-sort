const MIN_LOSE_COUNT = 15;
const INITIAL_STEPS = 5;
const INCREASE_STEP = 5;
const LOSE_ITERATION_COUNT = 3;
export const MAX_SOLVE_PERCENTAGE = 0.5;

export const getAutoMoveCount = (lostCounter: number) => {
  if (lostCounter < MIN_LOSE_COUNT) {
    return 0;
  }
  return (
    INITIAL_STEPS +
    Math.floor((lostCounter - MIN_LOSE_COUNT) / LOSE_ITERATION_COUNT) *
      INCREASE_STEP
  );
};
