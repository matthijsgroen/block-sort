import { PlayButton } from "../../components/PlayButton";

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
  const startNumbering = Math.floor(levelNr / 10);

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
              <span className="inline-block border w-8 h-8 align-top rounded-md text-center">
                {i < levelNr && "✔"}
                {i == levelNr && "😀"}
                {i > levelNr && (i + 1) % 10 === 6 && "⭐️"}
                {i > levelNr && (i + 1) % 10 === 8 && "️🔥"}
              </span>
            </li>
          );
        })}
      </ol>
      <div className="text-center mt-4">
        <PlayButton
          levelNr={levelNr + 1}
          onClick={onLevelStart}
          special={(levelNr + 1) % 10 === 6}
          hard={(levelNr + 1) % 10 === 8}
        />
      </div>
    </div>
  );
};
