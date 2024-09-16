export const fib = (start: number, steps: number): number[] => {
  const result: number[] = [];
  let value = start;
  let prev = start;
  for (let i = 0; i < steps - 1; i++) {
    result.push(value);
    const temp = value;
    value = prev + value;
    prev = temp;
  }
  return result;
};
