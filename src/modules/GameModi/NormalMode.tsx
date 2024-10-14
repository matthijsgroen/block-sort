import { use, useEffect, useState } from "react";

import { Transition } from "@/ui/Transition/Transition.tsx";

import { sound } from "@/audio.ts";
import { ZEN_MODE } from "@/featureFlags.ts";
import {
  getLevelSettings,
  getLevelType,
  LevelTypeString,
} from "@/game/level-types/index.ts";
import { ThemeContext } from "@/modules/Layout/ThemeContext.tsx";
import { LevelLoader } from "@/modules/Level/LevelLoader.tsx";
import { LevelTrack } from "@/modules/LevelTrack/LevelTrack.tsx";
import { generateNewSeed, mulberry32 } from "@/support/random.ts";
import { getThemeSong } from "@/support/themeMusic.tsx";
import { useGameStorage } from "@/support/useGameStorage.ts";

import { BetaContext } from "../Layout/BetaContext.tsx";

import { BASE_SEED, SCREEN_TRANSITION } from "./constants.ts";
import { ZEN_MODE_UNLOCK } from "./zenModeConstants.ts";

type Props = {
  active: boolean;
  showInstallButton: boolean;
  onInstall: VoidFunction;
  onOpenSettings: VoidFunction;
  onZenModeStart: VoidFunction;
};

export const NormalMode: React.FC<Props> = ({
  active,
  showInstallButton,
  onInstall,
  onOpenSettings,
  onZenModeStart,
}) => {
  const [levelNr, setLevelNr] = useGameStorage("levelNr", 0);
  const [levelSeed, setLevelSeed] = useState(() =>
    generateNewSeed(BASE_SEED, levelNr),
  );
  const [inLevel, setInLevel] = useGameStorage("inLevel", false);

  useEffect(() => {
    setLevelSeed(generateNewSeed(BASE_SEED, levelNr));
  }, [levelNr]);

  const random = mulberry32(levelSeed);
  const settings = getLevelSettings(levelNr, random);

  const { activeTheme } = use(ThemeContext);
  const song = getThemeSong(activeTheme);

  const { showBeta } = use(BetaContext);

  return (
    <>
      <Transition
        className={"h-full"}
        active={!inLevel && active}
        startDelay={SCREEN_TRANSITION /* wait for level to be unmounted */}
        duration={SCREEN_TRANSITION}
      >
        <LevelTrack
          levelNr={levelNr}
          hasZenMode={levelNr >= ZEN_MODE_UNLOCK - 1 && ZEN_MODE}
          showInstallButton={showInstallButton || showBeta}
          onLevelStart={() => {
            // tie playback to user interaction
            sound.play(song);
            setInLevel(true);
          }}
          onOpenSettings={onOpenSettings}
          onInstall={onInstall}
          onZenModeStart={onZenModeStart}
        />
      </Transition>
      <Transition
        className={"h-full"}
        active={inLevel && active}
        startDelay={
          SCREEN_TRANSITION /* wait for level track to be unmounted */
        }
        duration={SCREEN_TRANSITION}
      >
        <LevelLoader
          onComplete={(won) => {
            setInLevel(false);
            if (won) {
              setLevelNr((nr) => nr + 1);
            }
          }}
          levelNr={levelNr}
          levelType={getLevelType(levelNr).type as LevelTypeString}
          seed={levelSeed}
          levelSettings={settings}
          title={`Level ${levelNr + 1}`}
        />
      </Transition>
    </>
  );
};
