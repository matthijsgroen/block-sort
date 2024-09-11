export const timesMap = <T>(amount: number, func: (index: number) => T): T[] =>
  new Array(amount).fill(0).map((_, i) => func(i));
