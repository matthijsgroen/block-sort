import {
  createContext,
  Dispatch,
  PropsWithChildren,
  use,
  useState,
} from "react";

import { Background } from "@/ui/Background/Background";

import { LevelType } from "@/support/getLevelType";
import { ThemeContext } from "@/support/ThemeProvider";
import { useGameStorage } from "@/support/useGameStorage";

export const BackgroundContext = createContext<{
  levelType: LevelType | undefined;
  setLevelType: Dispatch<LevelType | undefined>;
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
  const [levelType, setLevelType] = useState<LevelType | undefined>(undefined);
  const [screenLayout, setScreenLayout] = useState<string>("levelTrack");
  const { activeTheme } = use(ThemeContext);
  const [particlesEnabled] = useGameStorage("particlesEnabled", null);
  return (
    <BackgroundContext.Provider
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
        disableParticles={!particlesEnabled}
      >
        {children}
      </Background>
    </BackgroundContext.Provider>
  );
};
