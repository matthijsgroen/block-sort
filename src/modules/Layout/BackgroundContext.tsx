import {
  createContext,
  Dispatch,
  PropsWithChildren,
  use,
  useState,
} from "react";

import { Background } from "@/ui/Background/Background";

import { LevelTypeString } from "@/game/level-types";
import { ThemeContext } from "@/modules/Layout/ThemeContext";

export const BackgroundContext = createContext<{
  levelType: LevelTypeString | undefined;
  setLevelType: Dispatch<LevelTypeString | undefined>;
  screenLayout: string;
  setScreenLayout: Dispatch<string>;
}>({
  levelType: undefined,
  setLevelType: () => {},
  screenLayout: "",
  setScreenLayout: () => {},
});

export const BackgroundProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [levelType, setLevelType] = useState<LevelTypeString | undefined>(
    undefined,
  );
  const [screenLayout, setScreenLayout] = useState<string>("levelTrack");
  const { activeTheme } = use(ThemeContext);
  return (
    <BackgroundContext
      value={{
        levelType,
        setLevelType,
        screenLayout,
        setScreenLayout,
      }}
    >
      <Background
        levelType={levelType}
        theme={activeTheme}
        layout={screenLayout}
      >
        {children}
      </Background>
    </BackgroundContext>
  );
};
