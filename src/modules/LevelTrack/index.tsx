import { PlayButton } from "../../components/PlayButton";

type Props = {
  levelNr: number;
  onLevelStart: VoidFunction;
};

export const LevelTrack: React.FC<Props> = ({ onLevelStart, levelNr }) => {
  const startNumbering = Math.floor(levelNr / 10);

  const levelNrs = new Array(10).fill(0).map((_, i) => startNumbering + i);

  return (
    <div>
      <h1>Block sort</h1>

      <ol>
        {levelNrs.map((i) => (
          <li key={i}>{i + 1}</li>
        ))}
      </ol>
      <PlayButton levelNr={levelNr + 1} onClick={onLevelStart} />
    </div>
  );
};
