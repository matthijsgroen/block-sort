import info from "@/../package.json";
import { LevelState } from "@/game/types";
import { getGameValue, setGameValue } from "@/support/useGameStorage";

type LevelData = {
  lostCounter: number;
  autoMoves: number;
  initial: LevelState | null;
  state: LevelState | null;
};

export type DataFormat = {
  levelNr: number;
  levelData: LevelData;
  zenLevelData: LevelData;
  zenMode: {
    levelNr: number;
    difficulty: number;
    levelType: number;
  };
  version: string;
};

const setLevelData = async (
  storagePrefix: string,
  levelNr: number,
  data: LevelData
) => {
  await Promise.all([
    setGameValue(`${storagePrefix}lostCounter`, data.lostCounter),
    setGameValue(`${storagePrefix}autoMoves`, data.autoMoves),
    setGameValue(`${storagePrefix}initialLevelState${levelNr}`, data.initial),
    setGameValue(`${storagePrefix}levelState${levelNr}`, data.state),
  ]);
};

export const setGameData = async (data: DataFormat) => {
  await Promise.all([
    setGameValue("levelNr", data.levelNr),
    setGameValue("zenLevelNr", data.zenMode.levelNr),
    setGameValue("zenDifficulty", data.zenMode.difficulty),
    setGameValue("zenLevelType", data.zenMode.levelType),
  ]);

  await Promise.all([
    setLevelData("", data.levelNr, data.levelData),
    setLevelData("zen", data.zenMode.levelNr, data.zenLevelData),
  ]);
};

const getLevelData = async (storagePrefix: string, levelNr: number) => {
  const lostCounter =
    (await getGameValue<number>(`${storagePrefix}lostCounter`)) ?? 0;
  const autoMoves =
    (await getGameValue<number>(`${storagePrefix}autoMoves`)) ?? 0;
  const initial = await getGameValue<LevelState>(
    `${storagePrefix}initialLevelState${levelNr}`
  );
  const state = await getGameValue<LevelState>(
    `${storagePrefix}levelState${levelNr}`
  );
  return { lostCounter, autoMoves, initial, state };
};

export const getGameData = async (): Promise<DataFormat> => {
  const levelNr = (await getGameValue<number>("levelNr")) ?? 0;
  const zenLevelNr = (await getGameValue<number>("zenLevelNr")) ?? 0;
  const zenDifficulty = (await getGameValue<number>("zenDifficulty")) ?? 0;
  const zenLevelType = (await getGameValue<number>("zenLevelType")) ?? 0;

  return {
    levelNr,
    levelData: await getLevelData("", levelNr),
    zenLevelData: await getLevelData("zen", zenLevelNr),
    zenMode: {
      levelNr: zenLevelNr,
      difficulty: zenDifficulty,
      levelType: zenLevelType,
    },
    version: info.version,
  };
};
