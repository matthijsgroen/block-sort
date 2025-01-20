export const findLastIndex = <T>(
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
