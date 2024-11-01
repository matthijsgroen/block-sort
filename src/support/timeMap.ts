export const timesMap = <T>(
  amount: number,
  func: (index: number, amount: number) => T
): T[] => Array.from({ length: amount }).map((_, i, l) => func(i, l.length));
