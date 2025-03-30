import { use } from "react";

import { Transition } from "@/ui/Transition/Transition";

import { sound } from "@/audio";
import type { LevelTypeString } from "@/game/level-types/index";
import { getUnlockableLevelTypes } from "@/game/level-types/index";
import type { LevelSettings, MultiStageLevelSettings } from "@/game/types";
import { ThemeContext } from "@/modules/Layout/ThemeContext";
import { LevelLoader } from "@/modules/Level/LevelLoader";
import { generateNewSeed, mulberry32, pick } from "@/support/random";
import { getThemeSong } from "@/support/themeMusic";
import { deleteGameValue, useGameStorage } from "@/support/useGameStorage";
import { useWakeLock } from "@/support/useWakeLock";

import { ZenSelection } from "../ZenSelection/ZenSelection";

import {
  DIFFICULTY_LEVELS,
  SCREEN_TRANSITION,
  ZEN_BASE_SEED
} from "./constants";

type Props = {
  active: boolean;
  onOpenSettings: VoidFunction;
  onZenModeEnd: VoidFunction;
};

export const ZenMode: React.FC<Props> = ({
  active,
  onOpenSettings,
  onZenModeEnd
}) => {
  const [zenLevelNr, setZenLevelNr] = useGameStorage("zenLevelNr", 0);
  const [levelNr] = useGameStorage<null | number>("levelNr", null);

  const [inLevel, setInLevel] = useGameStorage("inLevel", false);

  const { requestWakeLock, releaseWakeLock } = useWakeLock();
  const [difficultyIndex, setDifficultyIndex] = useGameStorage(
    "zenDifficulty",
    0
  );
  const [levelTypeIndex, setLevelTypeIndex] = useGameStorage("zenLevelType", 0);

  const { activeTheme } = use(ThemeContext);
  const song = getThemeSong(activeTheme);

  const zenLevelSeed = generateNewSeed(ZEN_BASE_SEED, zenLevelNr);

  const random = mulberry32(zenLevelSeed);

  const [currentGame, setCurrentGame] = useGameStorage<null | {
    title: string;
    levelType: string;
    difficultyIndex: number;
    settings: LevelSettings | MultiStageLevelSettings;
  }>("zenLevelSettings", () => {
    const levelTypes = getUnlockableLevelTypes();
    const fallbackLevelType = levelTypes[levelTypeIndex % levelTypes.length];
    const settings = fallbackLevelType.getZenSettings(
      zenLevelNr,
      difficultyIndex + 1
    );

    const fallbackGame = {
      title: DIFFICULTY_LEVELS[difficultyIndex].name,
      difficultyIndex,
      levelType: fallbackLevelType.type,
      settings
    };
    return fallbackGame;
  });

  return (
    <>
      <Transition
        className={"h-full"}
        active={inLevel && active}
        startDelay={
          SCREEN_TRANSITION /* wait for level track to be unmounted */
        }
        duration={SCREEN_TRANSITION}
      >
        {currentGame !== null && (
          <LevelLoader
            onComplete={(won) => {
              releaseWakeLock();
              setInLevel(false);
              if (won) {
                setZenLevelNr((nr) => nr + 1);
                setCurrentGame(null);
              }
            }}
            levelNr={zenLevelNr}
            levelType={currentGame.levelType as LevelTypeString}
            seed={zenLevelSeed}
            storagePrefix="zen"
            levelSettings={currentGame.settings}
            title={currentGame.title}
          />
        )}
      </Transition>
      <Transition
        className={"h-full"}
        active={!inLevel && active}
        startDelay={SCREEN_TRANSITION /* wait for level to be unmounted */}
        duration={SCREEN_TRANSITION}
      >
        <ZenSelection
          levelNr={levelNr ?? 0}
          difficultyIndex={difficultyIndex}
          levelTypeIndex={levelTypeIndex}
          setDifficultyIndex={setDifficultyIndex}
          setLevelTypeIndex={setLevelTypeIndex}
          onLevelStart={(levelType, difficultyIndex) => {
            requestWakeLock();
            const difficultySettings = DIFFICULTY_LEVELS[difficultyIndex];

            if (
              currentGame !== null &&
              currentGame.levelType === levelType.type &&
              currentGame.difficultyIndex === difficultyIndex
            ) {
              sound.play(song);
              setInLevel(true);
              return;
            }

            deleteGameValue(`zeninitialLevelState${zenLevelNr}`);
            deleteGameValue(`zenlevelState${zenLevelNr}`);
            deleteGameValue(`zenlevelStage`);

            const difficulty = pick(difficultySettings.difficulties, random);
            const settings = levelType.getZenSettings(
              zenLevelNr,
              difficulty + 1
            );

            setCurrentGame({
              title: DIFFICULTY_LEVELS[difficultyIndex].name,
              difficultyIndex,
              levelType: levelType.type,
              settings
            });
            // tie playback to user interaction
            sound.play(song);
            setInLevel(true);
          }}
          onOpenSettings={onOpenSettings}
          onZenModeEnd={onZenModeEnd}
        />
      </Transition>
    </>
  );
};
