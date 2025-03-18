import { isKey, isLock, matchingLockFor } from "@/game/state";
import type { Block, Column } from "@/game/types";

export const hasSpace = (column: Column): boolean =>
  column.columnSize > column.blocks.length;

export const canPlaceBlock = (column: Column, block: Block): boolean => {
  const destBlock = column.blocks[0];
  if (!hasSpace(column)) {
    return false;
  }
  if (isLock(block)) {
    return false;
  }
  if (column.limitColor === "rainbow" && !isKey(block)) {
    return true;
  }
  if (destBlock?.color === block.color && !isKey(block)) {
    return true;
  }
  if (column.type === "inventory" && isKey(block)) {
    return true;
  }
  if (isKey(block) && destBlock && matchingLockFor(block) === destBlock.color) {
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

export const isColumnCorrectlySorted = (column: Column): boolean => {
  if (column.blocks.length === 0) return false;
  const firstColor = column.blocks[0].color;
  return (
    column.blocks.every((block) => block.color === firstColor) &&
    column.type === "placement"
  );
};
