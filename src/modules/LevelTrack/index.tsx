import { PlayButton } from "../../components/PlayButton";

import { isHard, isSpecial } from "./levelType";

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

  const levelNrs = new Array(13).fill(0).map((_, i) => startNumbering + i);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl mb-2">Block sort</h1>

      <ol className="flex flex-col-reverse w-12 mx-auto">
        {levelNrs.map((i) => {
          const offset = i % 8;
          return (
            <li
              key={i}
              className={`${translates[offset]} whitespace-nowrap leading-8 h-9 align-middle`}
            >
              {i + 1}&nbsp;
              <span className="inline-block border w-8 h-8 align-top rounded-md text-center bg-black/30">
                {i < levelNr && (
                  <span className="bg-green-500 bg-clip-text text-transparent">
                    ✔
                  </span>
                )}
                {i == levelNr && "😀"}
                {i > levelNr && isSpecial(i) && "⭐️"}
                {i > levelNr && isHard(i) && "️🔥"}
              </span>
            </li>
          );
        })}
      </ol>
      <div className="text-center mt-4">
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
