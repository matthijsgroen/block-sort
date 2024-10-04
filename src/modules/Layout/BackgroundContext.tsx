import {
  ComponentProps,
  createContext,
  Dispatch,
  PropsWithChildren,
  use,
  useState,
} from "react";

import { Background } from "@/ui/Background/Background";

import { ThemeContext } from "@/support/ThemeProvider";

type Theme = ComponentProps<typeof Background>["levelType"];
export const BackgroundContext = createContext<
  [value: Theme, updateValue: Dispatch<Theme>]
>([undefined, () => {}]);

export const BackgroundProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const state = useState<Theme>(undefined);
  const { activeTheme } = use(ThemeContext);
  return (
    <BackgroundContext.Provider value={state}>
      <Background levelType={state[0]} theme={activeTheme}>
        {children}
      </Background>
    </BackgroundContext.Provider>
  );
};
