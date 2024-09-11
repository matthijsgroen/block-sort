import { useState } from "react";
import { LevelTrack } from "./modules/LevelTrack/index.tsx";
import PWABadge from "./PWABadge.tsx";
import { NormalLevel } from "./modules/NormalLevel/index.tsx";

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
      {inLevel && <NormalLevel levelNr={levelNr} seed={12345678901234} />}
      <PWABadge />
    </>
  );
};
