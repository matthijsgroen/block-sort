import { moveBlocks } from "./actions";
import { Block, LevelState } from "./types";

export const canPlaceAmount = (
  level: LevelState,
  columnIndex: number,
  blocks: Block[]
): number => {
  const column = level.columns[columnIndex];
  const spaceLeft = column.columnSize - column.blocks.length;

  const setColor = blocks[0].color;
  if (column.limitColor && column.limitColor !== setColor) {
    return 0;
  }
  if (column.blocks[0] && column.blocks[0].color !== setColor) {
    return 0;
  }
  return Math.min(spaceLeft, blocks.length);
};

export const hasWon = (level: LevelState): boolean =>
  level.columns.every(
    (col) =>
      (col.type === "placement" &&
        col.columnSize === col.blocks.length &&
        col.blocks.every((b) => b.color === col.blocks[0].color)) ||
      col.blocks.length === 0
  );

export const isStuck = (level: LevelState): boolean => {
  const createSignature = (level: LevelState) =>
    level.columns.map((c) => c.blocks[0]?.color);

  const countHidden = (level: LevelState) =>
    level.columns.reduce(
      (r, c) => r + c.blocks.filter((b) => b.revealed === true).length,
      0
    );

  const topSignature = createSignature(level);
  const originalHidden = countHidden(level);

  return level.columns.every((_source, sourceIndex) => {
    let didChange = false;
    let playLevel = level;

    level.columns.forEach((_dest, destIndex) => {
      if (sourceIndex === destIndex) return false;
      playLevel = moveBlocks(playLevel, sourceIndex, destIndex);
      const resultSig = createSignature(playLevel);
      const resultHidden = countHidden(playLevel);
      if (
        resultHidden !== originalHidden ||
        resultSig.some((c, i) => c !== topSignature[i])
      ) {
        didChange = true;
      }
    });

    return !didChange;
  });
};

export const allShuffled = (level: LevelState): boolean =>
  level.columns.every(
    (c) =>
      c.blocks.length < c.columnSize ||
      c.blocks.map((b) => b.color).filter((b, i, l) => l.indexOf(b) === i)
        .length > 1
  );
