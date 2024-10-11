import { use } from "react";

import { Transition } from "@/ui/Transition/Transition.tsx";

import { sound } from "@/audio.ts";
import { getZenSettings } from "@/game/level-settings/zenLevelSettings.ts";
import { LevelSettings } from "@/game/types.ts";
import { LevelLoader } from "@/modules/Level/LevelLoader.tsx";
import { LevelType } from "@/support/getLevelType.ts";
import { generateNewSeed, mulberry32, pick } from "@/support/random.ts";
import { getThemeSong } from "@/support/themeMusic.tsx";
import { ThemeContext } from "@/support/ThemeProvider.tsx";
import { deleteGameValue, useGameStorage } from "@/support/useGameStorage.ts";

import { ZenSelection } from "../ZenSelection/ZenSelection.tsx";

import { SCREEN_TRANSITION, ZEN_BASE_SEED } from "./constants.ts";
import { DIFFICULTY_LEVELS } from "./zenModeConstants.ts";

type Props = {
  active: boolean;
  onOpenSettings: VoidFunction;
  onZenModeEnd: VoidFunction;
};

export const ZenMode: React.FC<Props> = ({
  active,
  onOpenSettings,
  onZenModeEnd,
}) => {
  const [zenLevelNr, setZenLevelNr] = useGameStorage("zenLevelNr", 0);
  const [levelNr] = useGameStorage<null | number>("levelNr", null);

  const [inLevel, setInLevel] = useGameStorage("inLevel", false);

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
    levelType: LevelType;
    difficultyIndex: number;
    settings: LevelSettings;
  }>("zenLevelSettings", null);

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
              setInLevel(false);
              if (won) {
                setZenLevelNr((nr) => nr + 1);
                setCurrentGame(null);
              }
            }}
            levelNr={zenLevelNr}
            levelType={currentGame.levelType}
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
            const difficultySettings = DIFFICULTY_LEVELS[difficultyIndex];

            if (
              currentGame !== null &&
              currentGame.levelType === levelType &&
              currentGame.difficultyIndex === difficultyIndex
            ) {
              sound.play(song);
              setInLevel(true);
              return;
            }
            deleteGameValue(`zeninitialLevelState${zenLevelNr}`);
            deleteGameValue(`zenlevelState${zenLevelNr}`);

            const difficulty = pick(difficultySettings.difficulties, random);
            const settings = getZenSettings(
              difficulty + 1,
              levelType,
              zenLevelNr
            );

            setCurrentGame({
              title: DIFFICULTY_LEVELS[difficultyIndex].name,
              difficultyIndex,
              levelType,
              settings,
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
