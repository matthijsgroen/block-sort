import { Dispatch, SetStateAction, use, useEffect } from "react";
import clsx from "clsx";

import { GameTitle } from "@/ui/GameTitle/GameTitle";
import { PlayButton } from "@/ui/PlayButton";
import { TopButton } from "@/ui/TopButton/TopButton";
import { WoodButton } from "@/ui/WoodButton/WoodButton";

import { LevelType } from "@/support/getLevelType";

import { DIFFICULTY_LEVELS, LEVEL_TYPES } from "../GameModi/zenModeConstants";
import { BackgroundContext } from "../Layout/BackgroundContext";

import styles from "./ZenSelection.module.css";

type Props = {
  levelNr: number;
  difficultyIndex: number;
  setDifficultyIndex: Dispatch<SetStateAction<number>>;
  levelTypeIndex: number;
  setLevelTypeIndex: Dispatch<SetStateAction<number>>;
  onLevelStart: (levelType: LevelType, difficulty: number) => void;
  onZenModeEnd?: VoidFunction;
  onOpenSettings?: VoidFunction;
};

export const ZenSelection: React.FC<Props> = ({
  levelNr,
  difficultyIndex,
  setDifficultyIndex,
  levelTypeIndex,
  setLevelTypeIndex,
  onZenModeEnd,
  onLevelStart,
  onOpenSettings,
}) => {
  const { setLevelType, setScreenLayout } = use(BackgroundContext);
  useEffect(() => {
    setLevelType("easy");
    setScreenLayout("zenMode");
  }, []);

  // Synch with offline state

  const selectedDifficulty = DIFFICULTY_LEVELS[difficultyIndex];
  const selectedLevelType = LEVEL_TYPES[levelTypeIndex];
  const enabledDifficulties = DIFFICULTY_LEVELS.length;
  const enabledLevelTypes = LEVEL_TYPES.length;

  return (
    <div className="flex flex-col items-center h-full">
      <div className="flex flex-row p-2 gap-x-2 w-full">
        {onOpenSettings && (
          <TopButton buttonType="settings" onClick={onOpenSettings} />
        )}
        <GameTitle />
        {onOpenSettings && <div className="size-block"></div>}
      </div>
      <div className="flex-1 flex flex-col gap-7">
        <div className="text-center">
          <span className="text-4xl">🌻</span>
        </div>
        <div className={clsx(styles.text, styles.title, styles.shadow)}>
          Select difficulty
        </div>
        <div className="flex flex-row gap-4 items-center">
          <WoodButton
            onClick={() => {
              setDifficultyIndex(
                (a) => (a - 1 + enabledDifficulties) % enabledDifficulties
              );
            }}
          >
            <span className="inline-block translate-y-[5px] px-2">◀</span>︎
          </WoodButton>
          <div className="w-[200px]">
            <div
              className={clsx(styles.text, {
                [styles.disabled]:
                  levelNr < selectedDifficulty.unlocksAtLevel - 1,
                [styles.enabled]:
                  levelNr >= selectedDifficulty.unlocksAtLevel - 1,
                [styles.shadow]:
                  levelNr >= selectedDifficulty.unlocksAtLevel - 1,
              })}
            >
              {selectedDifficulty.name}
            </div>
            {selectedDifficulty.unlocksAtLevel - 1 > levelNr && (
              <div className="text-center -mt-2">
                Unlocks at level {selectedDifficulty.unlocksAtLevel}
              </div>
            )}
          </div>
          <WoodButton
            onClick={() => {
              setDifficultyIndex((a) => (a + 1) % enabledDifficulties);
            }}
          >
            <span className="inline-block translate-y-[5px] px-2">▶</span>︎ ︎
          </WoodButton>
        </div>
        <div className={clsx(styles.text, styles.title, styles.shadow)}>
          Select level type
        </div>
        <div className="flex flex-row gap-4 items-center">
          <WoodButton
            onClick={() => {
              setLevelTypeIndex(
                (a) => (a - 1 + enabledLevelTypes) % enabledLevelTypes
              );
            }}
          >
            <span className="inline-block translate-y-[5px] px-2">◀</span>︎
          </WoodButton>
          <div className="w-[200px]">
            <div
              className={clsx(styles.text, {
                [styles.disabled]:
                  levelNr < selectedLevelType.unlocksAtLevel - 1,
                [styles.enabled]:
                  levelNr >= selectedLevelType.unlocksAtLevel - 1,
                [styles.shadow]:
                  levelNr >= selectedLevelType.unlocksAtLevel - 1,
              })}
            >
              {selectedLevelType.name}
            </div>
            {selectedLevelType.unlocksAtLevel - 1 > levelNr && (
              <div className="text-center -mt-2">
                Unlocks at level {selectedLevelType.unlocksAtLevel}
              </div>
            )}
          </div>
          <WoodButton
            onClick={() => {
              setLevelTypeIndex((a) => (a + 1) % enabledLevelTypes);
            }}
          >
            <span className="inline-block translate-y-[5px] px-2">▶</span>︎ ︎
          </WoodButton>
        </div>
      </div>
      <div className="text-center pb-10 flex flex-row justify-between w-full px-5">
        <div className={"block"}>
          <button
            onClick={onZenModeEnd}
            className={clsx(
              "inline-block h-12 rounded-3xl shadow-lg font-bold pt-3 px-6 bg-orange-500 active:scale-90 transition-transform"
            )}
          >
            <span className={"block -translate-y-1 scale-150"}>◀︎</span>
          </button>
        </div>
        <PlayButton
          label={selectedDifficulty.name}
          onClick={() => {
            onLevelStart(selectedLevelType.levelType, difficultyIndex);
          }}
          type={selectedLevelType.levelType}
          disabled={
            levelNr < selectedDifficulty.unlocksAtLevel - 1 ||
            levelNr < selectedLevelType.unlocksAtLevel - 1
          }
        />
        <div className={clsx("block transition-opacity opacity-0")}>
          <button
            onClick={() => {}}
            className={clsx(
              "inline-block h-12 rounded-3xl shadow-lg font-bold pt-3 px-6 bg-orange-500",
              "invisible"
            )}
          >
            <span className={"block -translate-y-1 scale-150"}>▸</span>
          </button>
        </div>
      </div>
    </div>
  );
};
