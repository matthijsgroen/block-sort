import {
  ComponentProps,
  createContext,
  Dispatch,
  PropsWithChildren,
  useState,
} from "react";

import { Background } from "@/ui/Background/Background";

type Theme = ComponentProps<typeof Background>["theme"];
export const BackgroundContext = createContext<
  [value: Theme, updateValue: Dispatch<Theme>]
>([undefined, () => {}]);

export const BackgroundProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const state = useState<Theme>(undefined);
  return (
    <BackgroundContext.Provider value={state}>
      <Background theme={state[0]}>{children}</Background>
    </BackgroundContext.Provider>
  );
};
