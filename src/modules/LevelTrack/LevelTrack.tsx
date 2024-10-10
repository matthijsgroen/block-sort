import { use, useEffect, useState } from "react";
import clsx from "clsx";

import { GameTitle } from "@/ui/GameTitle/GameTitle";
import { Smiley } from "@/ui/Smiley/Smiley";
import { TopButton } from "@/ui/TopButton/TopButton";
import { ZenButton } from "@/ui/ZenButton";

import {
  isEasy,
  isHard,
  isScrambled,
  isSpecial,
  LEVEL_SCALE,
} from "@/game/level-settings/levelSettings";
import { effectTimeout } from "@/support/effectTimeout";
import { getLevelType } from "@/support/getLevelType";
import { useGameStorage } from "@/support/useGameStorage";

import { PlayButton } from "../../ui/PlayButton";
import { BackgroundContext } from "../Layout/BackgroundContext";
import { BetaContext } from "../Layout/BetaContext";

import styles from "./levelTrack.module.css";

type Props = {
  levelNr: number;
  hasZenMode?: boolean;
  showInstallButton?: boolean;
  onInstall?: VoidFunction;
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
  "-translate-x-10",
];

export const LevelTrack: React.FC<Props> = ({
  levelNr: officialLevelNr,
  hasZenMode = false,
  showInstallButton = false,
  onInstall,
  onZenModeStart,
  onLevelStart,
  onOpenSettings,
}) => {
  const [levelNr, setDisplayLevelNr] = useGameStorage(
    "displayLevelNr",
    officialLevelNr
  );

  // If levelNr is lower than the official one (keep in offline state)
  // Start a transition to the next level
  useEffect(() => {
    return effectTimeout(() => {
      setDisplayLevelNr((nr) => (nr < officialLevelNr ? nr + 1 : nr));
    }, 2000);
  }, [officialLevelNr]);

  const startNumbering = Math.max(Math.floor(levelNr - 2), 0);
  const levelNrs = new Array(30).fill(0).map((_, i) => startNumbering + i);

  const { setLevelType, setScreenLayout } = use(BackgroundContext);
  useEffect(() => {
    setLevelType(undefined);
    setScreenLayout("levelTrack");
  }, []);
  const { setShowBeta } = use(BetaContext);
  const [betaCounter, setBetaCounter] = useState(0);

  useEffect(() => {
    if (betaCounter > 7) {
      setShowBeta(true);
    }
  }, [betaCounter]);

  const jumpRight = (levelNr + 2) % 8 < 4;

  return (
    <div className="flex flex-col items-center h-full">
      <div className="flex flex-row pt-2 pl-safeLeft pr-safeRight gap-x-2 w-full">
        <TopButton buttonType="settings" onClick={onOpenSettings} />
        <GameTitle
          onClick={() => {
            setBetaCounter((counter) => counter + 1);
          }}
        />
        {!showInstallButton && <div className="size-block"></div>}
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

      <ol className="flex flex-col-reverse w-full flex-1 overflow-y-hidden">
        {levelNrs.map((i) => {
          const offset = i % 8;
          const levelTransition = LEVEL_SCALE.includes(i);
          return (
            <>
              {levelNr < officialLevelNr && i === levelNr && (
                <li
                  key={`jump${i}`}
                  className={clsx(
                    "relative -top-7 z-10 flex align-middle items-center w-full flex-shrink-0 justify-center h-0",
                    {
                      [styles.levelUp]: levelTransition,
                      [styles.shiftDown]:
                        levelNr < officialLevelNr && levelNr > 2,
                    }
                  )}
                >
                  <div
                    className={clsx(
                      translates[offset],
                      "whitespace-nowrap leading-10 align-middle mx-auto"
                    )}
                  >
                    <span className={clsx("text-transparent")}>
                      {i + 1}&nbsp;
                    </span>
                    <span
                      className={clsx(
                        "inline-block size-block border-1 border-transparent align-top rounded-md text-center",
                        {
                          ["relative"]: i === levelNr,
                        }
                      )}
                    >
                      <span
                        className={clsx("inline-block", {
                          [styles.hop]: levelNr < officialLevelNr,
                        })}
                        style={{
                          "--direction": jumpRight ? "2.6rem" : "-2.4rem",
                          "--rotateDirection": jumpRight ? "40deg" : "-40deg",
                        }}
                      >
                        <Smiley />
                      </span>
                    </span>
                  </div>
                </li>
              )}
              <li
                key={i}
                style={{ "--levelNr": `'${LEVEL_SCALE.indexOf(i) + 1}'` }}
                className={clsx(
                  "flex align-middle items-center w-full h-height-block flex-shrink-0 justify-center",
                  {
                    [styles.levelUp]: levelTransition,
                    [styles.shiftDown]:
                      levelNr < officialLevelNr && levelNr > 2,
                  }
                )}
              >
                <div
                  className={clsx(
                    translates[offset],
                    "whitespace-nowrap leading-10 align-middle mx-auto"
                  )}
                >
                  <span
                    className={clsx(
                      "text-orange-400",
                      {
                        "text-green-900": i < officialLevelNr,
                        "font-bold": i === officialLevelNr,
                        "text-purple-500": isSpecial(i) && i >= officialLevelNr,
                        "text-green-700": isEasy(i) && i >= officialLevelNr,
                        "text-slate-400":
                          isScrambled(i) && i >= officialLevelNr,
                      },
                      styles.textShadow
                    )}
                  >
                    {i + 1}&nbsp;
                  </span>
                  <span
                    className={clsx(
                      "inline-block border size-block align-top rounded-md text-center bg-black/30",
                      {
                        "border border-block-brown":
                          !isSpecial(i) ||
                          !isHard(i) ||
                          !isEasy(i) ||
                          isScrambled(i),
                        "border-2 border-purple-800": isSpecial(i),
                        "border-2 border-orange-700": isHard(i),
                        "border-2 border-green-800": isEasy(i),
                        "border-2 border-slate-400": isScrambled(i),
                        ["relative"]: i === levelNr,
                      }
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
                          ["hidden"]: levelNr < officialLevelNr,
                        })}
                      >
                        <Smiley />
                      </span>
                    )}
                    {i == levelNr && levelNr < officialLevelNr && (
                      <span
                        className={clsx(
                          "bg-green-500 bg-clip-text text-transparent animate-fadeIn [animation-duration:2s] [animation-delay:1s] opacity-0",
                          styles.doneGlow
                        )}
                      >
                        ✔
                      </span>
                    )}
                    {i > levelNr && isSpecial(i) && (
                      <span
                        style={{ "--color": "#a855f7" }}
                        className={styles.colorEmoji}
                      >
                        ⭐️
                      </span>
                    )}
                    {i > levelNr && isHard(i) && "️🔥"}
                    {i > levelNr && isEasy(i) && (
                      <span
                        style={{ "--color": "#15803d" }}
                        className={styles.colorEmoji}
                      >
                        ️🍀
                      </span>
                    )}
                    {i > levelNr && isScrambled(i) && (
                      <span
                        style={{ "--color": "#94a3b8" }}
                        className={styles.colorEmoji}
                      >
                        ️🧩
                      </span>
                    )}
                  </span>
                </div>
              </li>
            </>
          );
        })}
      </ol>
      <div className="text-center pb-10 flex flex-row justify-between w-full px-5">
        <div className="w-22"></div>
        <PlayButton
          label={`Level ${officialLevelNr + 1}`}
          onClick={onLevelStart}
          type={getLevelType(officialLevelNr)}
        />
        <div
          className={clsx("block transition-opacity w-22", {
            ["opacity-0"]: !hasZenMode,
            ["opacity-100"]: hasZenMode,
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
