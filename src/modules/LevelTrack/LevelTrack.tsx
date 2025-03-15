import { Fragment, use, useEffect, useState } from "react";
import clsx from "clsx";

import { GameTitle } from "@/ui/GameTitle/GameTitle";
import { Smiley } from "@/ui/Smiley/Smiley";
import { TopButton } from "@/ui/TopButton/TopButton";
import { ZenButton } from "@/ui/ZenButton";

import { sound } from "@/audio";
import { LEVEL_SCALE } from "@/game/level-settings/levelSettings";
import { getLevelType, getLevelTypeByType } from "@/game/level-types";
import type { BlockTheme } from "@/game/themes";
import { LevelNode } from "@/modules/LevelTrack/LevelNode";
import { effectTimeout } from "@/support/effectTimeout";
import { useGameStorage } from "@/support/useGameStorage";

import { PlayButton } from "../../ui/PlayButton";
import { BackgroundContext } from "../Layout/BackgroundContext";
import { BetaContext } from "../Layout/BetaContext";

import { LevelDoneIcon } from "./LevelDoneIcon";
import { getLevelMessage } from "./levelMessage";
import { LevelTrackMessageBar } from "./LevelTrackMessageBar";
import { LevelTypeIcon } from "./LevelTypeIcon";

import styles from "./levelTrack.module.css";

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

const translates = [
  "",
  "translate-x-10",
  "translate-x-20",
  "translate-x-10",
  "",
  "-translate-x-10",
  "-translate-x-20",
  "-translate-x-10"
];

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

  const startNumbering = Math.max(Math.floor(levelNr - 2), 0);
  const levelNrs = new Array(30).fill(0).map((_, i) => startNumbering + i);

  const { setLevelType, setScreenLayout } = use(BackgroundContext);
  useEffect(() => {
    setLevelType(undefined);
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

  const jumpRight = (levelNr + 2) % 8 < 4;

  const hasMessage = getLevelMessage(officialLevelNr) !== undefined;

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

      <ol
        className="flex w-full flex-1 flex-col-reverse overflow-y-hidden"
        style={{
          "--distance": hasMessage ? "-4.5rem" : "-3.5rem",
          "--jump-distance": hasMessage ? "4.5rem" : "3.5rem"
        }}
      >
        {levelNrs.map((i) => {
          const offset = i % 8;

          const levelMessage = getLevelMessage(i);

          return (
            <Fragment key={i}>
              {levelMessage !== undefined && (
                <li
                  className={clsx(
                    "flex w-full flex-shrink-0 items-center justify-center border-b-2 border-b-black/10 align-middle",
                    {
                      [styles.shiftDown]:
                        levelNr < officialLevelNr && levelNr >= 2
                    }
                  )}
                >
                  <LevelTrackMessageBar levelNr={i} message={levelMessage} />
                </li>
              )}
              <li
                style={{ "--levelNr": `'${LEVEL_SCALE.indexOf(i) + 1}'` }}
                className={clsx(
                  "flex h-height-block w-full flex-shrink-0 items-center justify-center align-middle",
                  {
                    [styles.shiftDown]:
                      levelNr < officialLevelNr && levelNr >= 2
                  }
                )}
              >
                <LevelNode
                  levelNr={i}
                  theme={theme}
                  className={translates[offset]}
                  completed={i < officialLevelNr}
                  isCurrent={i === officialLevelNr}
                >
                  {i == officialLevelNr && (
                    <span
                      className={clsx("inline-block w-10", {
                        [styles.hop]: levelNr < officialLevelNr
                      })}
                      style={{
                        "--direction": jumpRight ? "-2.6rem" : "2.4rem",
                        "--rotateDirection": jumpRight ? "40deg" : "-40deg"
                      }}
                    >
                      <Smiley />
                    </span>
                  )}
                  {(i < levelNr ||
                    (levelNr < officialLevelNr && i === levelNr)) && (
                    <LevelDoneIcon
                      fadeIn={i === levelNr && levelNr < officialLevelNr}
                    />
                  )}
                  {i > levelNr && (
                    <LevelTypeIcon
                      levelNr={i}
                      theme={theme}
                      fadeOut={i === officialLevelNr}
                    />
                  )}
                </LevelNode>
              </li>
            </Fragment>
          );
        })}
      </ol>
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
