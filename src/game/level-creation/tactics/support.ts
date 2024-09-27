import { Block, Column } from "@/game/types";

export const hasSpace = (column: Column): boolean =>
  column.columnSize > column.blocks.length;

export const canPlaceBlock = (column: Column, block: Block): boolean => {
  const destBlock = column.blocks[0];
  if (!hasSpace(column)) {
    return false;
  }
  if (destBlock?.color === block.color) {
    return true;
  }
  if (
    destBlock === undefined &&
    (column.limitColor === undefined || column.limitColor === block.color)
  ) {
    return true;
  }
  return false;
};
