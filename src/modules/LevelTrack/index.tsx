import { isHard, isSpecial } from "@/game/levelSettings";

import { PlayButton } from "../../components/PlayButton";

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
  const startNumbering = Math.max(Math.floor(levelNr - 5), 0);

  const levelNrs = new Array(30).fill(0).map((_, i) => startNumbering + i);

  return (
    <div className="flex flex-col items-center h-safe-screen py-2">
      <h1 className="text-3xl mb-2 font-extrabold mt-2">Block sort</h1>

      <ol className="flex flex-col-reverse w-4/5 mx-auto flex-1 overflow-y-hidden items-center">
        {levelNrs.map((i) => {
          const offset = i % 8;
          return (
            <li
              key={i}
              className={`${translates[offset]} whitespace-nowrap leading-8 h-9 align-middle`}
            >
              {i + 1}&nbsp;
              <span className="inline-block border border-block-brown w-8 h-8 align-top rounded-md text-center bg-black/30">
                {i < levelNr && (
                  <span
                    className={`bg-green-500 bg-clip-text text-transparent ${styles.doneGlow}`}
                  >
                    ✔
                  </span>
                )}
                {i == levelNr && "😀"}
                {i > levelNr && isSpecial(i) && "⭐️"}
                {i > levelNr && !isSpecial(i) && isHard(i) && "️🔥"}
              </span>
            </li>
          );
        })}
      </ol>
      <div className="text-center py-6">
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
