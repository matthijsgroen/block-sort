import { Fragment, use, useEffect, useState } from "react";
import clsx from "clsx";

import { GameTitle } from "@/ui/GameTitle/GameTitle";
import { Smiley } from "@/ui/Smiley/Smiley";
import { TopButton } from "@/ui/TopButton/TopButton";
import { ZenButton } from "@/ui/ZenButton";

import { sound } from "@/audio";
import {
  getDifficultyLevel,
  LEVEL_SCALE
} from "@/game/level-settings/levelSettings";
import {
  getLevelType,
  getLevelTypeByType,
  getLevelTypeByUnlock,
  levelTypeBorder,
  levelTypeTextColor
} from "@/game/level-types";
import { effectTimeout } from "@/support/effectTimeout";
import { timesMap } from "@/support/timeMap";
import { useGameStorage } from "@/support/useGameStorage";

import { PlayButton } from "../../ui/PlayButton";
import {
  DIFFICULTIES,
  DIFFICULTY_LEVELS,
  ZEN_MODE_UNLOCK
} from "../GameModi/constants";
import { BackgroundContext } from "../Layout/BackgroundContext";
import { BetaContext } from "../Layout/BetaContext";

import { LevelTrackMessageBar } from "./LevelTrackMessageBar";
import { LevelTypeIcon } from "./LevelTypeIcon";

import styles from "./levelTrack.module.css";

type Props = {
  levelNr: number;
  hasZenMode?: boolean;
  showInstallButton?: boolean;
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

const getLevelMessage = (levelNr: number): string | undefined => {
  if (LEVEL_SCALE.includes(levelNr)) {
    const difficulty = DIFFICULTIES[getDifficultyLevel(levelNr) - 1];
    const message = `${timesMap(difficulty.stars, () => "⭐️").join("")} ${difficulty.name} ${timesMap(difficulty.stars, () => "⭐️").join("")}`;
    return message;
  }
  if (ZEN_MODE_UNLOCK - 1 === levelNr) {
    return "🌻 Zen mode unlocked";
  }
  const unlockedZenDifficulty = DIFFICULTY_LEVELS.find(
    (d) => d.unlocksAtLevel - 1 === levelNr
  );
  if (unlockedZenDifficulty) {
    return `🌻 Zen difficulty ${unlockedZenDifficulty.name} unlocked`;
  }

  const unlockedZenType = getLevelTypeByUnlock(levelNr);
  if (unlockedZenType) {
    return `🌻 Zen level type ${unlockedZenType.name} unlocked`;
  }

  return undefined;
};

export const LevelTrack: React.FC<Props> = ({
  levelNr: officialLevelNr,
  hasZenMode = false,
  showInstallButton = false,
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
    : getLevelType(officialLevelNr);

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
          "--distance": hasMessage ? "-4.5rem" : "-3.5rem"
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
              {levelNr < officialLevelNr && i === levelNr && (
                <li
                  className={clsx(
                    "relative -top-7 z-10 flex h-0 w-full flex-shrink-0 items-center justify-center align-middle",
                    {
                      [styles.shiftDown]:
                        levelNr < officialLevelNr && levelNr >= 2
                    }
                  )}
                >
                  <div
                    className={clsx(
                      translates[offset],
                      "mx-auto whitespace-nowrap align-middle leading-10"
                    )}
                  >
                    <span className={clsx("text-transparent")}>
                      {i + 1}&nbsp;
                    </span>
                    <span
                      className={clsx(
                        "border-1 inline-block size-block rounded-md border-transparent text-center align-top",
                        {
                          ["relative"]: i === levelNr
                        }
                      )}
                    >
                      <span
                        className={clsx("inline-block", {
                          [styles.hop]: levelNr < officialLevelNr
                        })}
                        style={{
                          "--direction": jumpRight ? "2.6rem" : "-2.4rem",
                          "--rotateDirection": jumpRight ? "40deg" : "-40deg"
                        }}
                      >
                        <Smiley />
                      </span>
                    </span>
                  </div>
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
                <div
                  className={clsx(
                    translates[offset],
                    "mx-auto whitespace-nowrap align-middle leading-10"
                  )}
                >
                  <span
                    className={clsx(
                      {
                        "text-green-600": i < officialLevelNr,
                        "font-bold": i === officialLevelNr
                      },
                      i > officialLevelNr ? levelTypeTextColor(i) : undefined,
                      i === officialLevelNr
                        ? levelType.textClassName
                        : undefined,
                      styles.textShadow
                    )}
                  >
                    {i + 1}&nbsp;
                  </span>
                  <span
                    className={clsx(
                      "inline-block size-block rounded-md border bg-black/30 text-center align-top",
                      { ["relative"]: i === levelNr },
                      i === officialLevelNr
                        ? levelType.borderClassName
                        : levelTypeBorder(i)
                    )}
                  >
                    {i < levelNr && (
                      <span
                        className={clsx(
                          "bg-green-500 bg-clip-text text-transparent",
                          styles.doneGlow
                        )}
                      >
                        ✔
                      </span>
                    )}
                    {i == levelNr && (
                      <span
                        className={clsx("inline-block", {
                          ["hidden"]: levelNr < officialLevelNr
                        })}
                      >
                        <Smiley />
                      </span>
                    )}
                    {i == levelNr && levelNr < officialLevelNr && (
                      <span
                        className={clsx(
                          "animate-fadeIn bg-green-500 bg-clip-text text-transparent opacity-0 [animation-delay:1s] [animation-duration:2s]",
                          styles.doneGlow
                        )}
                      >
                        ✔
                      </span>
                    )}
                    {i > levelNr && (
                      <LevelTypeIcon
                        levelNr={i}
                        fadeOut={i === officialLevelNr}
                      />
                    )}
                  </span>
                </div>
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
