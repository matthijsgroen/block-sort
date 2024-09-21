import { use } from "react";
import clsx from "clsx";

import {
  isHard,
  isSpecial,
  LEVEL_SCALE,
} from "@/game/level-settings/levelSettings";
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
  const startNumbering = Math.max(Math.floor(levelNr - 4), 0);

  const levelNrs = new Array(30).fill(0).map((_, i) => startNumbering + i);

  const [, setTheme] = use(BackgroundContext);
  setTheme(undefined);

  return (
    <div className="flex flex-col items-center h-full">
      <div className="flex flex-row p-2 gap-x-2 w-full">
        {onOpenSettings && (
          <TopButton buttonType="settings" onClick={onOpenSettings} />
        )}

        <h1
          className={clsx(
            "text-3xl mb-2 font-extrabold flex-1 text-center text-orange-400"
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
                    },
                    styles.textShadow
                  )}
                >
                  {i + 1}&nbsp;
                </span>
                <span className="inline-block border border-block-brown size-block align-top rounded-md text-center bg-black/30">
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
                  {i == levelNr && "😀"}
                  {i > levelNr && isSpecial(i) && (
                    <span className={styles.colorEmoji}>⭐️</span>
                  )}
                  {i > levelNr && isHard(i) && "️🔥"}
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
          special={isSpecial(levelNr)}
          hard={isHard(levelNr)}
        />
      </div>
    </div>
  );
};
