import { BLOCK_COLORS, BlockColor, LimitColor } from "@/game/blocks";
import { solvers } from "@/game/level-creation/solvers";
import { Column, LevelState, Move } from "@/game/types";

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

export const toLevelStateDTO = (state: LevelState): LevelStateDTO => {
  return {
    c: state.columns.map((c) => ({
      b: c.blocks.map((b) => ({
        c: BLOCK_COLORS.indexOf(b.color),
        r: !!b.revealed
      })),
      s: c.columnSize,
      l: toLimitColorDTO(c.limitColor),
      t: c.type === "placement" ? 1 : 0,
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
  const colors = dto.c.reduce<BlockColor[]>(
    (r, c) =>
      c.b.reduce<BlockColor[]>(
        (r, b) =>
          r.includes(BLOCK_COLORS[b.c]) ? r : r.concat(BLOCK_COLORS[b.c]),
        r
      ),
    []
  );
  colors.sort();

  return {
    colors,
    columns: dto.c.map<Column>((c) => ({
      blocks: c.b.map((b) => ({
        color: BLOCK_COLORS[b.c],
        revealed: b.r
      })),
      columnSize: c.s,
      limitColor: fromLimitColorDTO(c.l),
      type: c.t === 1 ? "placement" : "buffer",
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
