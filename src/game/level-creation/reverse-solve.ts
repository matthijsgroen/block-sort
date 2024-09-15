import { produce } from "immer";

import { pick, shuffle } from "@/support/random";
import { timesMap } from "@/support/timeMap";

import { BLOCK_COLORS, BlockColor } from "../blocks";
import {
  createBlock,
  createBufferColumn,
  createPlacementColumn,
} from "../factories";
import { Column, LevelState } from "../types";

export type LevelSettings = {
  amountColors?: number;
  hideBlockTypes?: boolean;
  stackSize?: number;
  extraPlacementStacks?: number;
  extraPlacementLimits?: number;
  buffers?: number;
  bufferSizes?: number;
  amountShuffles?: number;
};

export const generateLevel = (
  random: () => number,
  {
    amountColors = 2,
    stackSize = 4,
    extraPlacementStacks = 2,
    extraPlacementLimits = 0,
    buffers = 0,
    bufferSizes = 1,
    // hideBlockTypes = false,
    amountShuffles = 15,
  }: LevelSettings
): LevelState => {
  const base = generateBaseLevel(random, {
    amountColors,
    stackSize,
    extraPlacementStacks,
    extraPlacementLimits,
    buffers,
    bufferSizes,
  });

  let lvl = base;

  for (let i = 0; i < amountShuffles; i++) {
    lvl = moveBlocks(random)(lvl);
  }

  return lvl;
};

const canPlace = (
  color: BlockColor,
  column: Column,
  amount: number
): number => {
  if (column.limitColor !== undefined && column.limitColor !== color) {
    return 0;
  }

  return Math.min(column.columnSize - column.blocks.length, amount);
};

export const moveBlocks = (random: () => number) =>
  produce<LevelState>((draft) => {
    // Move should be undo-able
    const sources = draft.columns.reduce<[column: number, amount: number][]>(
      (r, c, i) => {
        if (c.blocks.length === 0) {
          return r;
        }

        const color = c.blocks[0].color;
        const same = c.blocks.reduce((r, b) => {
          if (b.color === color) {
            return r + 1;
          }
          return r;
        }, 0);
        const otherOnTop = c.blocks[same] !== undefined;
        const toMove = otherOnTop ? same - 1 : same;

        return toMove > 0 ? r.concat([[i, toMove]]) : r;
      },
      []
    );

    const source = pick(sources, random);
    const amountToMove = source[1] - (random() > 0.5 ? 1 : 0);

    // console.log(source, amountToMove);

    const block = draft.columns[source[0]].blocks[0];

    const targets = draft.columns.reduce<[number, number][]>((r, c, i) => {
      const amount = canPlace(block.color, c, amountToMove);

      return amount > 0 && i !== source[0] ? r.concat([[i, amount]]) : r;
    }, []);
    const target = pick(targets, random);
    console.log(targets);
    console.log(source[0], block.color, target[0], target[1]);

    const blocks = draft.columns[source[0]].blocks.splice(0, target[1]);
    draft.columns[target[0]].blocks.unshift(...blocks);
    draft.moves.push({ from: source[0], to: target[0] });
  });

export const generateBaseLevel = (
  random: () => number,
  {
    amountColors = 2,
    stackSize = 4,
    extraPlacementStacks = 2,
    extraPlacementLimits = 0,
    buffers = 0,
    bufferSizes = 1,
  }: LevelSettings
): LevelState => {
  // Generate level, this should be extracted
  const availableColors = BLOCK_COLORS.slice();
  shuffle(availableColors, random);

  const blockColors = availableColors.slice(0, amountColors);
  const placementLimits =
    extraPlacementLimits > 0 ? blockColors.slice(-extraPlacementLimits) : [];

  const freeColors = blockColors.filter((e) => !placementLimits.includes(e));

  return {
    colors: blockColors,
    columns: freeColors
      .map((color) =>
        createPlacementColumn(
          stackSize,
          new Array(stackSize).fill(0).map(() => createBlock(color))
        )
      )
      .concat(
        timesMap(extraPlacementLimits + extraPlacementStacks, () =>
          createPlacementColumn(stackSize)
        )
      )
      .concat(
        placementLimits.map((color) =>
          createPlacementColumn(
            stackSize,
            new Array(stackSize).fill(0).map(() => createBlock(color)),
            color
          )
        )
      )
      .concat(timesMap(buffers, () => createBufferColumn(bufferSizes))),
    moves: [],
  };
};
