export const isSpecial = (levelNr: number) => (levelNr + 1) % 6 === 0;
export const isHard = (levelNr: number) => (levelNr + 1) % 7 === 0;
