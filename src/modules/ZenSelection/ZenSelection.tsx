import type { Dispatch, SetStateAction } from "react";
import { use, useEffect } from "react";
import clsx from "clsx";

import { GameTitle } from "@/ui/GameTitle/GameTitle";
import { PlayButton } from "@/ui/PlayButton";
import { TopButton } from "@/ui/TopButton/TopButton";
import { WoodButton } from "@/ui/WoodButton/WoodButton";

import { getUnlockableLevelTypes } from "@/game/level-types";
import type { LevelType } from "@/game/level-types/types";
import { getActiveTheme } from "@/game/themes";
import { getToday } from "@/support/schedule";
import { timesMap } from "@/support/timeMap";

import { DIFFICULTY_LEVELS } from "../GameModi/constants";
import { BackgroundContext } from "../Layout/BackgroundContext";
import { BetaContext } from "../Layout/BetaContext";

import styles from "./ZenSelection.module.css";

type Props = {
  levelNr: number;
  difficultyIndex: number;
  setDifficultyIndex: Dispatch<SetStateAction<number>>;
  levelTypeIndex: number;
  setLevelTypeIndex: Dispatch<SetStateAction<number>>;
  onLevelStart: (levelType: LevelType<string>, difficulty: number) => void;
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
  onOpenSettings
}) => {
  const { setBackgroundClassName, setScreenLayout } = use(BackgroundContext);
  useEffect(() => {
    setBackgroundClassName("bg-green-600/40");
    setScreenLayout("zenMode");
  }, []);

  const { showBeta } = use(BetaContext);

  const activeTheme = getActiveTheme(getToday());
  // Synch with offline state
  const levelTypes = getUnlockableLevelTypes(showBeta, activeTheme);

  const selectedDifficulty = DIFFICULTY_LEVELS[difficultyIndex];
  const selectedLevelType = levelTypes[levelTypeIndex % levelTypes.length];
  const enabledDifficulties = DIFFICULTY_LEVELS.length;
  const enabledLevelTypes = levelTypes.length;

  return (
    <div className="flex h-full flex-col items-center">
      <div className="flex w-full flex-row gap-x-2 pb-2 pl-safeLeft pr-safeRight pt-safeTop">
        {onOpenSettings && (
          <TopButton buttonType="settings" onClick={onOpenSettings} />
        )}
        <GameTitle />
        {onOpenSettings && <div className="size-block"></div>}
      </div>
      <div className="flex flex-1 flex-col gap-7">
        <div className="text-center">
          <span className="text-4xl">🌻</span>
        </div>
        <div className="flex flex-row flex-wrap justify-center gap-12">
          <div className="flex flex-col gap-4">
            <div className={clsx(styles.text, styles.title, styles.shadow)}>
              Select difficulty
            </div>
            <div className="flex flex-row items-center gap-4">
              <WoodButton
                onClick={() => {
                  setDifficultyIndex(
                    (a) => (a - 1 + enabledDifficulties) % enabledDifficulties
                  );
                }}
              >
                <span className={"material-icons align-middle !text-3xl"}>
                  ︎keyboard_arrow_left
                </span>
              </WoodButton>
              <div className="w-[200px]">
                <div
                  className={clsx(styles.text, {
                    [styles.disabled]:
                      levelNr < selectedDifficulty.unlocksAtLevel - 1,
                    [styles.enabled]:
                      levelNr >= selectedDifficulty.unlocksAtLevel - 1,
                    [styles.shadow]:
                      levelNr >= selectedDifficulty.unlocksAtLevel - 1
                  })}
                >
                  {selectedDifficulty.name}
                </div>
                {selectedDifficulty.unlocksAtLevel - 1 > levelNr ? (
                  <div className="-mt-2 text-center">
                    Unlocks at level {selectedDifficulty.unlocksAtLevel}
                  </div>
                ) : (
                  <div className="-mt-2 bg-gradient-to-r from-orange-200 to-orange-600 bg-clip-text text-center tracking-widest text-transparent">
                    {timesMap(difficultyIndex + 1, () => "⭐️")}
                  </div>
                )}
              </div>
              <WoodButton
                onClick={() => {
                  setDifficultyIndex((a) => (a + 1) % enabledDifficulties);
                }}
              >
                <span className={"material-icons align-middle !text-3xl"}>
                  ︎keyboard_arrow_right
                </span>
              </WoodButton>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className={clsx(styles.text, styles.title, styles.shadow)}>
              Select level type
            </div>
            <div className="flex flex-row items-center gap-4">
              <WoodButton
                onClick={() => {
                  setLevelTypeIndex(
                    (a) => (a - 1 + enabledLevelTypes) % enabledLevelTypes
                  );
                }}
              >
                <span className={"material-icons align-middle !text-3xl"}>
                  ︎keyboard_arrow_left
                </span>
              </WoodButton>
              <div className="w-[200px]">
                <div
                  className={clsx(styles.text, {
                    [styles.disabled]:
                      levelNr < selectedLevelType.unlocksAtLevel - 1,
                    [styles.enabled]:
                      levelNr >= selectedLevelType.unlocksAtLevel - 1 ||
                      (selectedLevelType.inBetaTest && showBeta),
                    [styles.shadow]:
                      levelNr >= selectedLevelType.unlocksAtLevel - 1 ||
                      (selectedLevelType.inBetaTest && showBeta)
                  })}
                >
                  {selectedLevelType.name}
                </div>
                {selectedLevelType.unlocksAtLevel - 1 > levelNr && (
                  <div className="-mt-2 text-center">
                    Unlocks at level {selectedLevelType.unlocksAtLevel}
                  </div>
                )}
                {selectedLevelType.inBetaTest &&
                  showBeta &&
                  selectedLevelType.unlocksAtLevel === undefined && (
                    <div className="-mt-2 text-center">Beta test</div>
                  )}
              </div>
              <WoodButton
                onClick={() => {
                  setLevelTypeIndex((a) => (a + 1) % enabledLevelTypes);
                }}
              >
                <span className={"material-icons align-middle !text-3xl"}>
                  ︎keyboard_arrow_right
                </span>
                ︎
              </WoodButton>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-row justify-between px-2 pb-7 text-center">
        <div className={"block w-22"}>
          <button
            onClick={onZenModeEnd}
            className={clsx(
              "inline-block h-12 rounded-3xl bg-orange-500 px-4 font-bold shadow-lg transition-transform active:scale-90"
            )}
          >
            <span className={"material-icons align-middle !text-4xl"}>
              ︎keyboard_arrow_left
            </span>
          </button>
        </div>
        <PlayButton
          label={selectedDifficulty.name}
          onClick={() => {
            onLevelStart(selectedLevelType, difficultyIndex);
          }}
          type={selectedLevelType}
          disabled={
            levelNr < selectedDifficulty.unlocksAtLevel - 1 ||
            levelNr < selectedLevelType.unlocksAtLevel - 1
          }
        />
        <div className={"block w-22"}></div>
      </div>
    </div>
  );
};
