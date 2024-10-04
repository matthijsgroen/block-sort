export const effectTimeout = (
  goal: VoidFunction,
  duration: number
): VoidFunction => {
  const clear = setTimeout(goal, duration);
  return () => clearTimeout(clear);
};
