import { version } from "@/../package.json";
import { replayMoves } from "@/game/actions";
import type { LevelState, Move } from "@/game/types";
import { getGameValue, setGameValue } from "@/support/useGameStorage";

import type { LevelStateDTO, MoveDTO } from "./dto";
import {
  fromHintModeDTO,
  fromLevelStateDTO,
  fromMoveDTO,
  toHintModeDTO,
  toLevelStateDTO,
  toMoveDTO
} from "./dto";

type LevelDataDTO = {
  /**
   * Lost counter
   */
  l: number;
  /**
   * Used auto moves
   */
  a: number;
  /**
   * Level state
   */
  s: LevelStateDTO | null;
  /**
   * Moves
   */
  m: MoveDTO[];
};

export type DataFormat = {
  /**
   * Level number
   */
  l: number;
  /**
   * Level data
   */
  ld: LevelDataDTO;
  /**
   * Streak
   */
  s: number;
  /**
   * Hint mode
   */
  h: number;
  /**
   * Zen mode data
   */
  z: {
    /**
     * Zen level number
     */
    l: number;
    /**
     * Zen difficulty
     */
    d: number;
    /**
     * Zen level type
     */
    t: number;
  };
  version: string;
};

const setLevelData = async (
  storagePrefix: string,
  levelNr: number,
  data: LevelDataDTO
) => {
  const levelState = data.s ? fromLevelStateDTO(data.s) : null;

  await Promise.all([
    setGameValue<number>(`${storagePrefix}lostCounter`, data.l),
    setGameValue<number>(`${storagePrefix}usedAutoMoves`, data.a),
    setGameValue<LevelState | null>(
      `${storagePrefix}initialLevelState${levelNr}`,
      levelState
    ),
    setGameValue<Move[]>(`${storagePrefix}moves`, fromMoveDTO(data.m)),
    setGameValue(
      `${storagePrefix}levelState${levelNr}`,
      levelState ? replayMoves(levelState, fromMoveDTO(data.m)) : null
    )
  ]);
};

export const setGameData = async (data: DataFormat) => {
  await Promise.all([
    setGameValue("levelNr", data.l),
    setGameValue("zenLevelNr", data.z.l),
    setGameValue("zenDifficulty", data.z.d),
    setGameValue("zenLevelType", data.z.t),
    setGameValue("hintMode", fromHintModeDTO(data.h)),
    setGameValue("streak", data.s)
  ]);

  await Promise.all([setLevelData("", data.l, data.ld)]);
};

const getLevelData = async (
  storagePrefix: string,
  levelNr: number
): Promise<LevelDataDTO> => {
  const lostCounter =
    (await getGameValue<number>(`${storagePrefix}lostCounter`)) ?? 0;
  const usedAutoMoves =
    (await getGameValue<number>(`${storagePrefix}usedAutoMoves`)) ?? 0;
  const initial = await getGameValue<LevelState>(
    `${storagePrefix}initialLevelState${levelNr}`
  );
  const moves = (await getGameValue<Move[]>(`${storagePrefix}moves`)) ?? [];
  return {
    l: lostCounter,
    a: usedAutoMoves,
    s: initial ? toLevelStateDTO(initial) : null,
    m: toMoveDTO(moves)
  };
};

export const getGameData = async (): Promise<DataFormat> => {
  const levelNr = (await getGameValue<number>("levelNr")) ?? 0;
  const zenLevelNr = (await getGameValue<number>("zenLevelNr")) ?? 0;
  const zenDifficulty = (await getGameValue<number>("zenDifficulty")) ?? 0;
  const zenLevelType = (await getGameValue<number>("zenLevelType")) ?? 0;
  const hintMode =
    (await getGameValue<"standard" | "eager" | "off">("hintMode")) ??
    "standard";
  const streak = (await getGameValue<number>("streak")) ?? 0;

  return {
    l: levelNr,
    ld: await getLevelData("", levelNr),
    h: toHintModeDTO(hintMode),
    s: streak,
    z: {
      l: zenLevelNr,
      d: zenDifficulty,
      t: zenLevelType
    },
    version: version
  };
};
