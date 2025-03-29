import { shuffle } from "@/support/random";
import { timesMap } from "@/support/timeMap";

import { BLOCK_COLORS, type BlockType } from "../blocks";
import {
  createBlock,
  createBufferColumn,
  createLevelState,
  createPlacementColumn
} from "../factories";
import { allShuffled, isLockSolvable, isStuck } from "../state";
import type { Column, LayoutMap, LevelSettings, LevelState } from "../types";

import type { Key, Lock } from "./lock-n-key";
import { lockNKeyPairs } from "./lock-n-key";

export const generateRandomLevel = (
  {
    amountColors = 2,
    stackSize = 4,
    extraPlacementStacks = 2,
    extraPlacementLimits = 0,
    buffers = 0,
    bufferSizes = 1,
    bufferPlacementLimits = 0,
    extraBuffers = [],
    blockColorPick = "start",
    hideBlockTypes = "none",
    stacksPerColor = 1,
    solver = "default",
    amountLockTypes = 0,
    amountLocks = 0,
    lockOffset = 0,
    layoutMap
  }: LevelSettings,
  random: () => number
): LevelState => {
  // This results in gradually reveal new colors as you progress
  const colorPool = Math.ceil(amountColors / 4) * 4;
  // Generate level, this should be extracted
  const availableColors =
    blockColorPick === "end"
      ? BLOCK_COLORS.slice(-colorPool)
      : BLOCK_COLORS.slice(0, colorPool);
  shuffle(availableColors, random);

  // This simulates having 12 colors for the first few levels,
  // resulting in a better level design
  timesMap(Math.max(12 - colorPool, 0), () => random());

  const bufferList = (
    [
      {
        amount: buffers,
        size: bufferSizes,
        limit: bufferPlacementLimits,
        bufferType: "normal"
      }
    ] as Exclude<LevelSettings["extraBuffers"], undefined>
  ).concat(extraBuffers);

  const blockColors = availableColors.slice(0, amountColors);
  let stackLimit = blockColors.length - extraPlacementLimits;
  // 1. select lock type

  const lockKeyBlocks: (Lock | Key)[] = [];
  if (amountLockTypes > 0) {
    const lockKeyPairs = lockNKeyPairs.slice();
    const start = Math.min(lockOffset, lockKeyPairs.length - amountLockTypes);
    const lockTypes = lockKeyPairs.slice(start, start + amountLockTypes);

    const lockAndKeys = new Array(amountLocks).fill(0).flatMap((_v, i) => {
      const lockType = lockTypes[i % lockTypes.length];
      return [`${lockType}-lock`, `${lockType}-key`];
    }) as (Lock | Key)[];

    lockKeyBlocks.push(...lockAndKeys);
  }

  const amountBars = amountColors * stacksPerColor;
  const blocks: BlockType[] = [];

  const amountPerColor = Math.ceil(lockKeyBlocks.length / blockColors.length);

  for (const color of blockColors) {
    const newColor = new Array(stackSize * stacksPerColor).fill(color);
    // Evenly distribute locks and keys over the colors
    const locksOrKeys = lockKeyBlocks.splice(0, amountPerColor);
    newColor.splice(0, locksOrKeys.length, ...locksOrKeys);
    blocks.push(...newColor);
  }
  shuffle(blocks, random);

  const columns = timesMap<Column>(amountBars, (ci) =>
    createPlacementColumn(
      stackSize,
      new Array(stackSize)
        .fill(0)
        .map((_, i) =>
          createBlock(
            blocks.shift()!,
            (hideBlockTypes === "all" ||
              (hideBlockTypes === "checker" && (i + (ci % 2)) % 2 === 0)) &&
              i !== 0
          )
        )
    )
  )
    .concat(
      timesMap(extraPlacementStacks, (i) =>
        createPlacementColumn(
          stackSize,
          [],
          i < extraPlacementLimits ? blockColors[stackLimit + i] : undefined
        )
      )
    )
    .concat(
      bufferList.flatMap(({ amount, size, limit, bufferType = "normal" }) => {
        stackLimit -= limit;

        return timesMap(amount, (i) =>
          createBufferColumn(
            size,
            bufferType === "unlimited"
              ? "rainbow"
              : i < limit
                ? blockColors[stackLimit + i]
                : undefined,
            [],
            bufferType === "inventory" ? "inventory" : "buffer"
          )
        );
      })
    );

  const levelState = createLevelState(columns, solver);
  return applyLayoutMap(levelState, layoutMap);
};

export const applyLayoutMap = (
  levelState: LevelState,
  layoutMap: LayoutMap | undefined
): LevelState => {
  if (!layoutMap) return levelState;

  const offsetPos = (fromColumn: number) => {
    if (fromColumn > -1) return fromColumn;
    return levelState.columns.length + fromColumn;
  };

  const matchColumn = (fromColumn: number, index: number) => {
    if (offsetPos(fromColumn) === index) return true;
    return false;
  };

  const unaffectedColumns = levelState.columns.filter(
    (_c, i) => !layoutMap.columns.some((l) => matchColumn(l.fromColumn, i))
  );

  const reorderedColumns = Array.from<Column | null>({
    length: levelState.columns.length
  }).fill(null);

  layoutMap.columns.forEach((c) => {
    const column = levelState.columns.find((_, i) =>
      matchColumn(c.fromColumn, i)
    );
    if (!column) {
      throw new Error("Column not found");
    }
    reorderedColumns[
      c.toColumn !== undefined ? offsetPos(c.toColumn) : c.fromColumn
    ] = {
      ...column,
      paddingTop: c.paddingTop
    };
  });
  const newColumns = reorderedColumns.map<Column>(
    (c): Column => c ?? (unaffectedColumns.shift() as Column)
  );

  return { ...levelState, columns: newColumns, width: layoutMap.width };
};

export const hasMinimalLevelQuality = (level: LevelState) =>
  !isStuck(level) && allShuffled(level) && isLockSolvable(level);
