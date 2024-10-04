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

export const BackgroundContext = createContext<
  [value: LevelType | undefined, updateValue: Dispatch<LevelType | undefined>]
>([undefined, () => {}]);

export const BackgroundProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const state = useState<LevelType | undefined>(undefined);
  const { activeTheme } = use(ThemeContext);
  return (
    <BackgroundContext.Provider value={state}>
      <Background levelType={state[0]} theme={activeTheme}>
        {children}
      </Background>
    </BackgroundContext.Provider>
  );
};
