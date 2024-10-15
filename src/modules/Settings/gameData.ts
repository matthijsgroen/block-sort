import info from "@/../package.json";
import { replayMoves } from "@/game/actions";
import { LevelState, Move } from "@/game/types";
import { getGameValue, setGameValue } from "@/support/useGameStorage";

import {
  fromLevelStateDTO,
  fromMoveDTO,
  LevelStateDTO,
  MoveDTO,
  toLevelStateDTO,
  toMoveDTO,
} from "./dto";

type LevelDataDTO = {
  l: number;
  a: number;
  s: LevelStateDTO | null;
  m: MoveDTO[];
};

export type DataFormat = {
  l: number;
  ld: LevelDataDTO;
  z: {
    l: number;
    d: number;
    t: number;
  };
  version: string;
};

const setLevelData = async (
  storagePrefix: string,
  levelNr: number,
  data: LevelDataDTO,
) => {
  const levelState = data.s ? fromLevelStateDTO(data.s) : null;

  await Promise.all([
    setGameValue<number>(`${storagePrefix}lostCounter`, data.l),
    setGameValue<number>(`${storagePrefix}autoMoves`, data.a),
    setGameValue<LevelState | null>(
      `${storagePrefix}initialLevelState${levelNr}`,
      levelState,
    ),
    setGameValue<Move[]>(`${storagePrefix}moves`, fromMoveDTO(data.m)),
    setGameValue(
      `${storagePrefix}levelState${levelNr}`,
      levelState ? replayMoves(levelState, fromMoveDTO(data.m)) : null,
    ),
  ]);
};

export const setGameData = async (data: DataFormat) => {
  await Promise.all([
    setGameValue("levelNr", data.l),
    setGameValue("zenLevelNr", data.z.l),
    setGameValue("zenDifficulty", data.z.d),
    setGameValue("zenLevelType", data.z.t),
  ]);

  await Promise.all([setLevelData("", data.l, data.ld)]);
};

const getLevelData = async (
  storagePrefix: string,
  levelNr: number,
): Promise<LevelDataDTO> => {
  const lostCounter =
    (await getGameValue<number>(`${storagePrefix}lostCounter`)) ?? 0;
  const autoMoves =
    (await getGameValue<number>(`${storagePrefix}autoMoves`)) ?? 0;
  const initial = await getGameValue<LevelState>(
    `${storagePrefix}initialLevelState${levelNr}`,
  );
  const moves = (await getGameValue<Move[]>(`${storagePrefix}moves`)) ?? [];
  return {
    l: lostCounter,
    a: autoMoves,
    s: initial ? toLevelStateDTO(initial) : null,
    m: toMoveDTO(moves),
  };
};

export const getGameData = async (): Promise<DataFormat> => {
  const levelNr = (await getGameValue<number>("levelNr")) ?? 0;
  const zenLevelNr = (await getGameValue<number>("zenLevelNr")) ?? 0;
  const zenDifficulty = (await getGameValue<number>("zenDifficulty")) ?? 0;
  const zenLevelType = (await getGameValue<number>("zenLevelType")) ?? 0;

  return {
    l: levelNr,
    ld: await getLevelData("", levelNr),
    z: {
      l: zenLevelNr,
      d: zenDifficulty,
      t: zenLevelType,
    },
    version: info.version,
  };
};
