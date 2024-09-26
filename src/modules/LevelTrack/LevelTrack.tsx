import { use, useEffect } from "react";
import clsx from "clsx";

import {
  isEasy,
  isHard,
  isScrambled,
  isSpecial,
  LEVEL_SCALE,
} from "@/game/level-settings/levelSettings";
import { getLevelType } from "@/support/getLevelType";
import { Smiley } from "@/ui/Smiley/Smiley";
import { TopButton } from "@/ui/TopButton/TopButton";

import { PlayButton } from "../../ui/PlayButton";
import { BackgroundContext } from "../Layout/BackgroundContext";

import styles from "./levelTrack.module.css";

type Props = {
  levelNr: number;
  onLevelStart: VoidFunction;
  onOpenSettings?: VoidFunction;
};

const translates = [
  "",
  "translate-x-8",
  "translate-x-16",
  "translate-x-8",
  "",
  "-translate-x-8",
  "-translate-x-16",
  "-translate-x-8",
];

export const LevelTrack: React.FC<Props> = ({
  levelNr,
  onLevelStart,
  onOpenSettings,
}) => {
  const startNumbering = Math.max(Math.floor(levelNr - 2), 0);

  const levelNrs = new Array(30).fill(0).map((_, i) => startNumbering + i);

  const [, setTheme] = use(BackgroundContext);
  useEffect(() => {
    setTheme(undefined);
  }, []);

  return (
    <div className="flex flex-col items-center h-full">
      <div className="flex flex-row p-2 gap-x-2 w-full">
        {onOpenSettings && (
          <TopButton buttonType="settings" onClick={onOpenSettings} />
        )}

        <h1
          className={clsx(
            "text-3xl mb-2 font-extrabold flex-1 text-center text-orange-400 font-block-sort",
            styles.header
          )}
        >
          Block Sort
        </h1>
        {onOpenSettings && <div className="size-block"></div>}
      </div>

      <ol className="flex flex-col-reverse w-full flex-1 overflow-y-hidden">
        {levelNrs.map((i) => {
          const offset = i % 8;
          const levelTransition = LEVEL_SCALE.includes(i);
          return (
            <li
              key={i}
              className={clsx(
                "flex align-middle items-center w-full h-height-block flex-shrink-0 justify-center",
                {
                  [styles.levelUp]: levelTransition,
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
                      "text-green-900": i < levelNr,
                      "font-bold": i === levelNr,
                      "text-purple-500": isSpecial(i) && i >= levelNr,
                      "text-green-700": isEasy(i) && i >= levelNr,
                      "text-slate-400": isScrambled(i) && i >= levelNr,
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
                  {i == levelNr && <Smiley />}
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
          );
        })}
      </ol>
      <div className="text-center pb-10">
        <PlayButton
          levelNr={levelNr + 1}
          onClick={onLevelStart}
          type={getLevelType(levelNr)}
        />
      </div>
    </div>
  );
};
