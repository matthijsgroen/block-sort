import { PropsWithChildren } from "react";
import clsx from "clsx";

import { getLevelTypeByType, LevelTypeString } from "@/game/level-types";
import { BlockTheme } from "@/game/themes";

import { CSSParticles } from "./CSSParticles";

type Props = {
  levelType?: LevelTypeString;
  theme?: BlockTheme;
  layout?: string;
};

export const Background: React.FC<PropsWithChildren<Props>> = ({
  children,
  levelType = "normal",
  theme = "default",
  layout = "default",
}) => {
  const lvlType = getLevelTypeByType(levelType);

  return (
    <div
      className={clsx(
        "relative h-full overflow-hidden transition-all [transition-duration:1.5s] [transition-timing-function:ease-out]",
        lvlType?.backgroundClassName,
      )}
    >
      {theme === "halloween" && (
        <div className="absolute left-0 top-0 h-full w-full animate-lightning bg-white"></div>
      )}
      <div className="absolute left-0 top-0 h-full w-full bg-wood-texture mix-blend-multiply"></div>
      {theme === "halloween" && (
        <div
          className={clsx(
            "absolute bottom-0 left-0 text-8xl transition-all [transition-duration:2000ms]",
            {
              "translate-x-[100vw]": layout === "zenMode",
            },
          )}
        >
          <div
            className={clsx(
              "inline-block transition-all [transition-duration:2000ms]",
              {
                "-rotate-12": layout === "levelTrack",
                "-translate-x-[90px] rotate-[372deg]": layout === "zenMode",
              },
            )}
          >
            🎃
          </div>
        </div>
      )}
      {theme === "winter" && (
        <>
          <div
            className={clsx(
              "absolute bottom-0 right-0 origin-bottom scale-150 text-8xl transition-transform [transition-duration:1500ms]",
              {
                "translate-y-[150%] -rotate-12": layout === "levelTrack",
                "[transition-delay:1500ms]": layout === "zenMode",
              },
            )}
          >
            🎄
          </div>
          <div
            className={clsx(
              "absolute bottom-0 left-0 origin-bottom scale-150 text-8xl transition-transform [transition-duration:1500ms]",
              {
                "translate-y-[150%] rotate-12": layout === "zenMode",
                "[transition-delay:1500ms]": layout === "levelTrack",
              },
            )}
          >
            🎄
          </div>
        </>
      )}
      {theme === "winter" && (
        <div className="absolute right-0 top-3/4 translate-x-8 -rotate-45 text-8xl">
          ⛄️
        </div>
      )}
      <div className="absolute left-0 top-0 h-safe-area w-full">{children}</div>
      {theme === "spring" && (
        <>
          <div
            className={clsx(
              "pointer-events-none absolute right-0 top-0 origin-top-right rotate-[20deg] opacity-30",
              "h-3/4 w-[7rem] translate-x-4 bg-gradient-to-b from-[#fffffffd] via-[#ffffae90] to-[#ffffae00]",
            )}
          ></div>
          <div
            className={clsx(
              "pointer-events-none absolute right-0 top-0 origin-top-right rotate-[20deg] opacity-30",
              "h-3/4 w-[8rem] -translate-x-9 bg-gradient-to-b from-[#fffffffd] via-[#ffffae90] to-[#ffffae00]",
            )}
          ></div>
          <div
            className={clsx(
              "pointer-events-none absolute bottom-0 left-0 origin-bottom rotate-6 scale-150 text-8xl transition-transform [transition-duration:1500ms]",
              {
                "translate-y-[150%] rotate-12": layout === "zenMode",
                "[transition-delay:1500ms]": layout === "levelTrack",
              },
            )}
          >
            🌷
          </div>
        </>
      )}
      {theme === "halloween" && (
        <CSSParticles
          symbol="👻"
          amount={10}
          direction="up"
          shift={200}
          scale={[0.7, 1.8]}
          speed={[30, 50]}
          floatDistance={[20, 100]}
          floatSpeed={[5, 10]}
        />
      )}
      {theme === "winter" && (
        <CSSParticles
          symbol="❄️"
          amount={30}
          shift={100}
          direction="down"
          scale={[0.2, 1]}
          speed={[30, 50]}
          floatDistance={[20, 100]}
          floatSpeed={[5, 10]}
        />
      )}
      {theme === "spring" && (
        <CSSParticles
          symbol="🟡"
          amount={10}
          shift={100}
          direction="down"
          scale={[0.2, 0.4]}
          speed={[40, 80]}
          floatDistance={[20, 100]}
          floatSpeed={[5, 10]}
        />
      )}
    </div>
  );
};
