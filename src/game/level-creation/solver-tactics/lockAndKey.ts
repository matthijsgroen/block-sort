import type { BlockType } from "@/game/blocks";
import { isKey, isLock } from "@/game/state";

import { keys, locks } from "../lock-n-key";

import type { Tactic, WeightedMove } from "./types";

type ColumnData = {
  index: number;
  pairName: string;
  color: BlockType;
  columnType: "placement" | "buffer" | "inventory";
};

export const removeLock: Tactic = (level, _random = Math.random) => {
  const keyBlocks = level.columns
    .map<ColumnData | undefined>((c, i) => {
      const topBlock = c.blocks[0];
      if (!topBlock) return undefined;
      if (c.locked) return undefined;
      if (!isKey(topBlock)) return undefined;

      return {
        index: i,
        pairName:
          locks.find((l) => l.name === topBlock.blockType)?.pairName ??
          "unknown",
        color: topBlock.blockType,
        columnType: c.type
      };
    })
    .filter((c): c is ColumnData => c !== undefined);
  const lockBlocks = level.columns
    .map<ColumnData | undefined>((c, i) => {
      const topBlock = c.blocks[0];
      if (!topBlock) return undefined;
      if (c.locked) return undefined;
      if (!isLock(topBlock)) return undefined;

      return {
        index: i,
        pairName:
          keys.find((l) => l.name === topBlock.blockType)?.pairName ??
          "unknown",
        color: topBlock.blockType,
        columnType: c.type
      };
    })
    .filter((c): c is ColumnData => c !== undefined);

  return keyBlocks.reduce<WeightedMove[]>((r, source) => {
    const targets = lockBlocks.filter(
      (source) => source && source.pairName === source?.pairName
    );
    if (targets.length === 0) return r;
    return r.concat(
      targets.map<WeightedMove>((target) => {
        return {
          name: "removeLock",
          move: { from: source.index, to: target.index },
          weight: 20 + (source.columnType !== "inventory" ? 10 : 0)
        };
      })
    );
  }, []);
};

export const storeKey: Tactic = (level, _random = Math.random) => {
  const keyBlocks = level.columns
    .map<ColumnData | undefined>((c, i) => {
      const topBlock = c.blocks[0];
      if (!topBlock) return undefined;
      if (c.locked) return undefined;
      if (!isKey(topBlock)) return undefined;

      return {
        index: i,
        pairName:
          locks.find((l) => l.name === topBlock.blockType)?.pairName ??
          "unknown",
        color: topBlock.blockType,
        columnType: c.type
      };
    })
    .filter((c): c is ColumnData => c !== undefined);
  const inventoryColumns = level.columns
    .map<{ index: number; columnType: "inventory" } | undefined>((c, i) => {
      const hasSpace = c.blocks.length < c.columnSize;
      if (c.type !== "inventory" || !hasSpace) return undefined;

      return {
        index: i,
        columnType: c.type
      };
    })
    .filter(
      (c): c is { index: number; columnType: "inventory" } => c !== undefined
    );

  return keyBlocks.reduce<WeightedMove[]>((r, source) => {
    if (inventoryColumns.length === 0) return r;
    return r.concat(
      inventoryColumns.map<WeightedMove>((target) => {
        return {
          name: "storeKey",
          move: { from: source.index, to: target.index },
          weight: 15
        };
      })
    );
  }, []);
};
