import type { Dispatch, PropsWithChildren } from "react";
import { createContext, use, useState } from "react";

import { Background } from "@/ui/Background/Background";

import type { LevelTypeString } from "@/game/level-types";
import { ThemeContext } from "@/modules/Layout/ThemeContext";
import { useGameStorage } from "@/support/useGameStorage";

export const BackgroundContext = createContext<{
  levelType: LevelTypeString | undefined;
  setLevelType: Dispatch<LevelTypeString | undefined>;
  screenLayout: string;
  setScreenLayout: Dispatch<string>;
}>({
  levelType: undefined,
  setLevelType: () => {},
  screenLayout: "",
  setScreenLayout: () => {}
});

export const BackgroundProvider: React.FC<PropsWithChildren> = ({
  children
}) => {
  const [levelType, setLevelType] = useState<LevelTypeString | undefined>(
    undefined
  );
  const [screenLayout, setScreenLayout] = useState<string>("levelTrack");
  const [musicEnabled] = useGameStorage("musicEnabled", null);
  const { activeTheme } = use(ThemeContext);
  return (
    <BackgroundContext
      value={{
        levelType,
        setLevelType,
        screenLayout,
        setScreenLayout
      }}
    >
      <Background
        levelType={levelType}
        theme={activeTheme}
        layout={screenLayout}
        musicEnabled={musicEnabled ?? true}
      >
        {children}
      </Background>
    </BackgroundContext>
  );
};
