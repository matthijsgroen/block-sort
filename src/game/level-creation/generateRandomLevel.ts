import { shuffle } from "@/support/random";
import { timesMap } from "@/support/timeMap";

import { BLOCK_COLORS, type BlockColor, type BlockType } from "../blocks";
import {
  createBlock,
  createBufferColumn,
  createLevelState,
  createOversizedColumn,
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
    oversizedColumns = [],
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

  // The last N colors (one per oversized column entry) become oversized colors.
  // The remaining colors go into normal placement columns.
  const allBlockColors = availableColors.slice(0, amountColors) as BlockColor[];
  const oversizedCount = oversizedColumns.length;
  const normalColors = allBlockColors.slice(
    0,
    amountColors - oversizedCount
  ) as BlockColor[];
  const oversizedColors = allBlockColors.slice(
    amountColors - oversizedCount
  ) as BlockColor[];

  const blockColors: BlockColor[] = normalColors;
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

  const amountBars = blockColors.length * stacksPerColor;
  const blocks: BlockType[] = [];

  const amountPerColor = Math.ceil(lockKeyBlocks.length / blockColors.length);

  for (const color of blockColors) {
    const newColor = new Array(stackSize * stacksPerColor).fill(color);
    // Evenly distribute locks and keys over the colors
    const locksOrKeys = lockKeyBlocks.splice(0, amountPerColor);
    newColor.splice(0, locksOrKeys.length, ...locksOrKeys);
    blocks.push(...newColor);
  }

  // Build oversized blocks: for each oversized column, create multiplier×stackSize blocks
  // of its assigned colour and add them to the block pool (distributed via shuffle).
  const oversizedBlocks: BlockType[] = [];
  for (let i = 0; i < oversizedColors.length; i++) {
    const color = oversizedColors[i];
    const multiplier = oversizedColumns[i].multiplier;
    for (let j = 0; j < stackSize * multiplier; j++) {
      oversizedBlocks.push(color);
    }
  }
  blocks.push(...oversizedBlocks);

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
    )
    .concat(
      // For each oversized column, add `multiplier` extra placement columns
      // and fill them from the remaining block pool (the oversized-colour blocks
      // have been shuffled into `blocks` together with the normal-colour blocks,
      // so the distribution is random).
      // Total block count = normalColors×stackSize + multiplier×stackSize
      // Total slot count  = (normalColors + multiplier)×stackSize  ✓
      oversizedColors.flatMap((color, i) => {
        const multiplier = oversizedColumns[i].multiplier;
        return [
          createOversizedColumn(stackSize * multiplier, color),
          ...timesMap(multiplier, () =>
            createPlacementColumn(
              stackSize,
              new Array(stackSize)
                .fill(0)
                .map(() => createBlock(blocks.shift()!))
            )
          )
        ];
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
