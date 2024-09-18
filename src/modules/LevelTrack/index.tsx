import clsx from "clsx";

import { isHard, isSpecial, LEVEL_SCALE } from "@/game/levelSettings";

import { PlayButton } from "../../ui/PlayButton";

import styles from "./levelTrack.module.css";

type Props = {
  levelNr: number;
  onLevelStart: VoidFunction;
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

export const LevelTrack: React.FC<Props> = ({ onLevelStart, levelNr }) => {
  const startNumbering = Math.max(Math.floor(levelNr - 4), 0);

  const levelNrs = new Array(30).fill(0).map((_, i) => startNumbering + i);

  return (
    <div className="flex flex-col items-center h-safe-area">
      <h1 className="text-3xl mb-2 font-extrabold mt-2">Block Sort</h1>

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
                  className={clsx("text-orange-400", {
                    "text-green-900": i < levelNr,
                    "font-bold": i === levelNr,
                    "text-purple-500": isSpecial(i) && i >= levelNr,
                  })}
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
                  {i > levelNr && isSpecial(i) && "⭐️"}
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
