import { BLOCK_COLORS, BlockColor } from "@/game/blocks";
import { Column, LevelState, Move } from "@/game/types";

export type LevelStateDTO = {
  c: {
    b: { c: number; r: boolean }[];
    s: number;
    l?: number;
    t: number;
  }[];
  m: MoveDTO[];
};

export type MoveDTO = { f: number; t: number };

export const toLevelStateDTO = (state: LevelState): LevelStateDTO => {
  return {
    c: state.columns.map((c) => ({
      b: c.blocks.map((b) => ({
        c: BLOCK_COLORS.indexOf(b.color),
        r: !!b.revealed,
      })),
      s: c.columnSize,
      l:
        c.limitColor !== undefined
          ? BLOCK_COLORS.indexOf(c.limitColor)
          : undefined,
      t: c.type === "placement" ? 1 : 0,
    })),
    m: toMoveDTO(state.moves),
  };
};

export const toMoveDTO = (moves: Move[]): MoveDTO[] =>
  moves.map((m) => ({ f: m.from, t: m.to }));

export const fromLevelStateDTO = (dto: LevelStateDTO): LevelState => {
  const colors = dto.c.reduce<BlockColor[]>(
    (r, c) =>
      c.b.reduce<BlockColor[]>(
        (r, b) =>
          r.includes(BLOCK_COLORS[b.c]) ? r : r.concat(BLOCK_COLORS[b.c]),
        r,
      ),
    [],
  );
  colors.sort();

  return {
    colors,
    columns: dto.c.map<Column>((c) => ({
      blocks: c.b.map((b) => ({
        color: BLOCK_COLORS[b.c],
        revealed: b.r,
      })),
      columnSize: c.s,
      limitColor: c.l !== undefined ? BLOCK_COLORS[c.l] : undefined,
      type: c.t === 1 ? "placement" : "buffer",
      locked: c.b.length === c.s && c.b.every((b) => b.c === c.b[0].c),
    })),
    moves: fromMoveDTO(dto.m),
  };
};

export const fromMoveDTO = (moves: MoveDTO[]): Move[] =>
  moves.map((m) => ({ from: m.f, to: m.t }));
