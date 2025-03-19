import type { BlockType, LimitColor } from "@/game/blocks";
import { BLOCK_COLORS } from "@/game/blocks";
import { keys, locks } from "@/game/level-creation/lock-n-key";
import type { solvers } from "@/game/level-creation/solvers";
import { isColorType, isKeyType, isLockType } from "@/game/state";
import type { Column, LevelState, Move } from "@/game/types";

export type LevelStateDTO = {
  /**
   * Columns
   */
  c: {
    /**
     * Blocks
     */
    b: { c: number; r: boolean }[];
    /**
     * Column size
     */
    s: number;
    /**
     * Limit color
     */
    l?: number;
    /**
     * Column type
     */
    t: number;
    /**
     * padding top
     */
    p?: number;
  }[];
  w?: number;
  m: MoveDTO[];
  /**
   * solver
   */
  s?: number;
};

export type MoveDTO = { f: number; t: number };

const toLimitColorDTO = (color: LimitColor | undefined): number | undefined =>
  color !== undefined
    ? color === "rainbow"
      ? 200
      : BLOCK_COLORS.indexOf(color)
    : undefined;

const fromLimitColorDTO = (
  colorId: number | undefined
): LimitColor | undefined =>
  colorId !== undefined
    ? colorId === 200
      ? "rainbow"
      : BLOCK_COLORS[colorId]
    : undefined;

const blockTypeToNumber = (type: BlockType): number => {
  if (isColorType(type)) {
    return BLOCK_COLORS.indexOf(type);
  }
  if (isLockType(type)) {
    return 50 + locks.findIndex((l) => l.name === type);
  }
  if (isKeyType(type)) {
    return 100 + keys.findIndex((l) => l.name === type);
  }
  return 200;
};

const numberToBlockType = (number: number): BlockType => {
  if (number < 50) {
    return BLOCK_COLORS[number];
  }
  if (number < 100) {
    return locks[number - 50].name;
  }
  // if (number < 150) {
  return keys[number - 100].name;
  // }
};

export const toLevelStateDTO = (state: LevelState): LevelStateDTO => {
  return {
    c: state.columns.map((c) => ({
      b: c.blocks.map((b) => ({
        c: blockTypeToNumber(b.blockType),
        r: !!b.revealed
      })),
      s: c.columnSize,
      l: toLimitColorDTO(c.limitColor),
      t: (
        {
          buffer: 0,
          placement: 1,
          inventory: 2
        } satisfies Record<Column["type"], number>
      )[c.type],
      p: c.paddingTop
    })),
    m: toMoveDTO(state.moves),
    w: state.width,
    s: toSolverDTO(state.solver)
  };
};

export const toMoveDTO = (moves: Move[]): MoveDTO[] =>
  moves.map((m) => ({ f: m.from, t: m.to }));

export const toSolverDTO = (
  solver: keyof typeof solvers | undefined
): number | undefined => {
  if (solver === undefined) {
    return undefined;
  }
  const solverMapping: Record<keyof typeof solvers, number | undefined> = {
    default: undefined
  };
  return solverMapping[solver];
};

export const fromLevelStateDTO = (dto: LevelStateDTO): LevelState => {
  const blockTypes = dto.c.reduce<BlockType[]>(
    (r, c) =>
      c.b.reduce<BlockType[]>(
        (r, b) =>
          r.includes(numberToBlockType(b.c))
            ? r
            : r.concat(numberToBlockType(b.c)),
        r
      ),
    []
  );
  blockTypes.sort();

  return {
    blockTypes,
    columns: dto.c.map<Column>((c) => ({
      blocks: c.b.map((b) => ({
        blockType: numberToBlockType(b.c),
        revealed: b.r
      })),
      columnSize: c.s,
      limitColor: fromLimitColorDTO(c.l),
      type: (["buffer", "placement", "inventory"] satisfies Column["type"][])[
        c.t
      ],
      locked: c.b.length === c.s && c.b.every((b) => b.c === c.b[0].c),
      paddingTop: c.p
    })),
    moves: fromMoveDTO(dto.m),
    width: dto.w,
    solver: fromSolverDTO(dto.s)
  };
};

export const fromMoveDTO = (moves: MoveDTO[]): Move[] =>
  moves.map((m) => ({ from: m.f, to: m.t }));

export const toHintModeDTO = (
  hintMode: "standard" | "eager" | "off"
): number => {
  if (hintMode === "standard") {
    return 0;
  } else if (hintMode === "eager") {
    return 1;
  }
  return 2;
};

export const fromHintModeDTO = (
  hintMode: number
): "standard" | "eager" | "off" => {
  if (hintMode === 0) {
    return "standard";
  } else if (hintMode === 1) {
    return "eager";
  }
  return "off";
};

export const fromSolverDTO = (
  solver: number | undefined
): keyof typeof solvers | undefined => {
  if (solver === undefined) {
    return undefined;
  }
  const solverMapping: Record<number, keyof typeof solvers | undefined> = {
    0: undefined
  };
  return solverMapping[solver];
};
