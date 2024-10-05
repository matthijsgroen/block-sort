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

export const BackgroundContext = createContext<
  [value: LevelType | undefined, updateValue: Dispatch<LevelType | undefined>]
>([undefined, () => {}]);

export const BackgroundProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const state = useState<LevelType | undefined>(undefined);
  const { activeTheme } = use(ThemeContext);
  const [particlesEnabled] = useGameStorage("particlesEnabled", null);
  return (
    <BackgroundContext.Provider value={state}>
      <Background
        levelType={state[0]}
        theme={activeTheme}
        disableParticles={!particlesEnabled}
      >
        {children}
      </Background>
    </BackgroundContext.Provider>
  );
};
