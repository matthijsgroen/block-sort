import { use, useEffect, useState } from "react";

import { Transition } from "@/ui/Transition/Transition";

import { ZEN_MODE } from "@/featureFlags";
import {
  getLevelSettings,
  getLevelType,
  LevelTypeString
} from "@/game/level-types/index";
import { LevelLoader } from "@/modules/Level/LevelLoader";
import { LevelTrack } from "@/modules/LevelTrack/LevelTrack";
import { generateNewSeed, mulberry32 } from "@/support/random";
import { useGameStorage } from "@/support/useGameStorage";

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
    process.env.NODE_ENV === "production" ? 0 : 16
  );
  const [levelSeed, setLevelSeed] = useState(() =>
    generateNewSeed(BASE_SEED, levelNr)
  );
  const [inLevel, setInLevel] = useGameStorage("inLevel", false);

  useEffect(() => {
    setLevelSeed(generateNewSeed(BASE_SEED, levelNr));
  }, [levelNr]);

  const random = mulberry32(levelSeed);
  const settings = getLevelSettings(levelNr, random);

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
          useStreak
          levelNr={levelNr}
          levelType={getLevelType(levelNr).type as LevelTypeString}
          showTutorial={levelNr === 0}
          seed={levelSeed}
          levelSettings={settings}
          title={`Level ${levelNr + 1}`}
        />
      </Transition>
    </>
  );
};
