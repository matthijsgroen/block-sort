import { use, useEffect, useState } from "react";
import clsx from "clsx";

import { GameTitle } from "@/ui/GameTitle/GameTitle";
import { Track } from "@/ui/LevelTrack/LevelTrack";
import { TopButton } from "@/ui/TopButton/TopButton";
import { ZenButton } from "@/ui/ZenButton";

import { sound } from "@/audio";
import { getLevelType, getLevelTypeByType } from "@/game/level-types";
import type { BlockTheme } from "@/game/themes";
import { effectTimeout } from "@/support/effectTimeout";
import { useGameStorage } from "@/support/useGameStorage";

import { PlayButton } from "../../ui/PlayButton";
import { BackgroundContext } from "../Layout/BackgroundContext";
import { BetaContext } from "../Layout/BetaContext";

import { getLevelMessage } from "./levelMessage";

type Props = {
  levelNr: number;
  hasZenMode?: boolean;
  showInstallButton?: boolean;
  theme?: BlockTheme;
  onInstall?: VoidFunction;
  onManual?: VoidFunction;
  onLevelStart: VoidFunction;
  onZenModeStart?: VoidFunction;
  onOpenSettings?: VoidFunction;
};

export const LevelTrack: React.FC<Props> = ({
  levelNr: officialLevelNr,
  hasZenMode = false,
  showInstallButton = false,
  theme = "default",
  onInstall,
  onManual,
  onZenModeStart,
  onLevelStart,
  onOpenSettings
}) => {
  const [levelNr, setDisplayLevelNr] = useGameStorage(
    "displayLevelNr",
    officialLevelNr
  );
  const [levelTypeString] = useGameStorage("levelType", null);
  const levelType = levelTypeString
    ? getLevelTypeByType(levelTypeString)
    : getLevelType(officialLevelNr, theme);

  // If levelNr is lower than the official one (keep in offline state)
  // Start a transition to the next level
  useEffect(() => {
    if (officialLevelNr <= levelNr) {
      return;
    }
    if (officialLevelNr > levelNr + 1) {
      setDisplayLevelNr(officialLevelNr);
      return;
    }
    const cancellations: VoidFunction[] = [];
    cancellations.push(
      effectTimeout(() => {
        sound.play("progress");
      }, 1000)
    );
    cancellations.push(
      effectTimeout(() => {
        setDisplayLevelNr((nr) => (nr < officialLevelNr ? nr + 1 : nr));
      }, 2000)
    );
    return () => {
      cancellations.forEach((cancel) => cancel());
    };
  }, [officialLevelNr, levelNr]);

  const numberFrom = Math.max(Math.floor(levelNr - 2), 0);

  const { setBackgroundClassName, setScreenLayout } = use(BackgroundContext);
  useEffect(() => {
    setBackgroundClassName(undefined);
    setScreenLayout("levelTrack");
  }, []);
  const { setShowBeta, showBeta } = use(BetaContext);
  const [betaCounter, setBetaCounter] = useState(0);

  useEffect(() => {
    if (betaCounter > 7) {
      if (!showBeta) {
        sound.play("win");
        setShowBeta(true);
      } else {
        sound.play("lose");
        setShowBeta(false);
      }
      setBetaCounter(0);
    }
  }, [betaCounter]);

  return (
    <div className="flex h-full flex-col items-center">
      <div className="flex w-full flex-row gap-x-2 pl-safeLeft pr-safeRight pt-safeTop">
        <TopButton buttonType="settings" onClick={onOpenSettings} />
        <GameTitle
          onClick={() => {
            setBetaCounter((counter) => counter + 1);
          }}
        />
        {!showInstallButton && (
          <TopButton
            buttonType="help"
            onClick={() => {
              onManual?.();
            }}
          />
        )}
        {showInstallButton && (
          <TopButton
            buttonType="install"
            onClick={() => {
              onInstall?.();
            }}
            highlight
          />
        )}
      </div>
      <Track
        levelNr={levelNr}
        officialLevelNr={officialLevelNr}
        numberFrom={numberFrom}
        getLevelMessage={getLevelMessage}
        theme={theme}
      />

      <div className="flex w-full flex-row justify-between px-2 pb-7 text-center">
        <div className="w-22"></div>
        <PlayButton
          label={
            officialLevelNr < 9
              ? `Play level ${officialLevelNr + 1}`
              : `Level ${officialLevelNr + 1}`
          }
          onClick={onLevelStart}
          highlight={officialLevelNr === 0}
          type={levelType}
        />
        <div
          className={clsx("block w-22 transition-opacity", {
            ["opacity-0"]: !hasZenMode,
            ["opacity-100"]: hasZenMode
          })}
        >
          <ZenButton
            onClick={() => {
              if (!hasZenMode) return;
              onZenModeStart?.();
            }}
          />
        </div>
      </div>
    </div>
  );
};
