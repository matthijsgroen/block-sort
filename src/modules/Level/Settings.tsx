import { LevelSettings } from "@/game/generateLevel";
import { LevelState } from "@/game/types";

type Props = {
  levelSettings: LevelSettings;
  level?: LevelState;
};

export const Settings: React.FC<Props> = ({ levelSettings, level }) => (
  <div className="p-4">
    <h2 className="text-xl">Debug</h2>
    {Object.entries(levelSettings).map(([k, v]) => (
      <div key={k}>
        <label className="font-bold">{k}:</label>
        <output className="pl-1">
          {v}
          {v === true && "yes"}
          {v === false && "no"}
        </output>
      </div>
    ))}
    {level && (
      <div>
        <label className="font-bold">Beated in:</label>
        <output className="pl-1">{level.movesNeeded} moves</output>
      </div>
    )}
  </div>
);
