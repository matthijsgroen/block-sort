export const timesMap = <T>(
  amount: number,
  func: (index: number, amount: number) => T
): T[] => new Array(amount).fill(0).map((_, i, l) => func(i, l.length));
