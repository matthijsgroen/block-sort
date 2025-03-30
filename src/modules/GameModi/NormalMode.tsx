import { use, useEffect, useState } from "react";

import { Transition } from "@/ui/Transition/Transition";

import { ZEN_MODE } from "@/featureFlags";
import type { LevelTypeString } from "@/game/level-types/index";
import { getLevelSettings, getLevelType } from "@/game/level-types/index";
import { getActiveTheme } from "@/game/themes";
import { LevelLoader } from "@/modules/Level/LevelLoader";
import { LevelTrack } from "@/modules/LevelTrack/LevelTrack";
import { levelForDevelopment } from "@/support/developmentSettings";
import { generateNewSeed, mulberry32 } from "@/support/random";
import { getToday } from "@/support/schedule";
import { useGameStorage } from "@/support/useGameStorage";
import { useWakeLock } from "@/support/useWakeLock";

import { BetaContext } from "../Layout/BetaContext";

import { BASE_SEED, SCREEN_TRANSITION, ZEN_MODE_UNLOCK } from "./constants";

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
  const [levelNr, setLevelNr] = useGameStorage(
    "levelNr",
    process.env.NODE_ENV === "production" ? 0 : levelForDevelopment
  );
  const [levelSeed, setLevelSeed] = useState(() =>
    generateNewSeed(BASE_SEED, levelNr)
  );
  const [inLevel, setInLevel] = useGameStorage("inLevel", false);

  useEffect(() => {
    setLevelSeed(generateNewSeed(BASE_SEED, levelNr));
  }, [levelNr]);

  const theme = getActiveTheme(getToday());
  const random = mulberry32(levelSeed);
  const settings = getLevelSettings(levelNr, theme, random);

  const { showBeta } = use(BetaContext);

  const { requestWakeLock, releaseWakeLock } = useWakeLock();

  return (
    <>
      <Transition
        className={"h-full"}
        active={!inLevel && active}
        startDelay={SCREEN_TRANSITION /* wait for level to be unmounted */}
        duration={SCREEN_TRANSITION}
      >
        <LevelTrack
          theme={theme}
          levelNr={levelNr}
          hasZenMode={levelNr >= ZEN_MODE_UNLOCK - 1 && ZEN_MODE}
          showInstallButton={showInstallButton || showBeta}
          onLevelStart={() => {
            requestWakeLock();
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
            releaseWakeLock();
            setInLevel(false);
            if (won) {
              setLevelNr((nr) => nr + 1);
            }
          }}
          useStreak
          levelNr={levelNr}
          levelType={getLevelType(levelNr, theme).type as LevelTypeString}
          showTutorial={levelNr === 0}
          seed={levelSeed}
          levelSettings={settings}
          title={`Level ${levelNr + 1}`}
        />
      </Transition>
    </>
  );
};
