import { use, useEffect, useState } from "react";

import { Transition } from "@/ui/Transition/Transition";

import { sound } from "@/audio";
import { ZEN_MODE } from "@/featureFlags";
import {
  getLevelSettings,
  getLevelType,
  LevelTypeString
} from "@/game/level-types/index";
import { ThemeContext } from "@/modules/Layout/ThemeContext";
import { LevelLoader } from "@/modules/Level/LevelLoader";
import { LevelTrack } from "@/modules/LevelTrack/LevelTrack";
import { generateNewSeed, mulberry32 } from "@/support/random";
import { getThemeSong } from "@/support/themeMusic";
import { useGameStorage } from "@/support/useGameStorage";

import { BetaContext } from "../Layout/BetaContext";

import { BASE_SEED, SCREEN_TRANSITION } from "./constants";
import { ZEN_MODE_UNLOCK } from "./zenModeConstants";

type Props = {
  active: boolean;
  showInstallButton: boolean;
  onInstall: VoidFunction;
  onManual: VoidFunction;
  onOpenSettings: VoidFunction;
  onZenModeStart: VoidFunction;
};

export const NormalMode: React.FC<Props> = ({
  active,
  showInstallButton,
  onInstall,
  onOpenSettings,
  onZenModeStart,
  onManual
}) => {
  const [levelNr, setLevelNr] = useGameStorage("levelNr", 0);
  const [levelSeed, setLevelSeed] = useState(() =>
    generateNewSeed(BASE_SEED, levelNr)
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
          onManual={onManual}
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
