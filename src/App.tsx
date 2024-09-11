import { useState } from "react";
import { LevelTrack } from "./modules/LevelTrack/index.tsx";
import PWABadge from "./PWABadge.tsx";
import { Level } from "./modules/Level/index.tsx";

export const App: React.FC = () => {
  const [levelNr] = useState(0);

  const [inLevel, setInLevel] = useState(false);

  return (
    <>
      {!inLevel && (
        <LevelTrack
          levelNr={levelNr}
          onLevelStart={() => {
            setInLevel(true);
          }}
        />
      )}
      {inLevel && (
        <Level
          amountColors={levelNr + 7}
          stackSize={16}
          buffers={3}
          bufferSizes={4}
          extraPlacementLimits={1}
          extraPlacementStacks={1}
          hideBlockTypes={true}
          seed={12345678901234}
        />
      )}
      <PWABadge />
    </>
  );
};
