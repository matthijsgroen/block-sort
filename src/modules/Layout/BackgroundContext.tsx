import type { Dispatch, PropsWithChildren } from "react";
import { createContext, use, useState } from "react";

import { Background } from "@/ui/Background/Background";

import { ThemeContext } from "@/modules/Layout/ThemeContext";
import { useGameStorage } from "@/support/useGameStorage";

export const BackgroundContext = createContext<{
  backgroundClassName: string | undefined;
  setBackgroundClassName: Dispatch<string | undefined>;
  screenLayout: string;
  setScreenLayout: Dispatch<string>;
}>({
  backgroundClassName: undefined,
  setBackgroundClassName: () => {},
  screenLayout: "",
  setScreenLayout: () => {}
});

export const BackgroundProvider: React.FC<PropsWithChildren> = ({
  children
}) => {
  const [backgroundClassName, setBackgroundClassName] = useState<
    string | undefined
  >(undefined);
  const [screenLayout, setScreenLayout] = useState<string>("levelTrack");
  const [musicEnabled] = useGameStorage("musicEnabled", null);
  const { activeTheme } = use(ThemeContext);

  return (
    <BackgroundContext
      value={{
        backgroundClassName,
        setBackgroundClassName,
        screenLayout,
        setScreenLayout
      }}
    >
      <Background
        backgroundClassName={backgroundClassName}
        theme={activeTheme}
        layout={screenLayout}
        musicEnabled={musicEnabled ?? true}
      >
        {children}
      </Background>
    </BackgroundContext>
  );
};
