import type { PropsWithChildren } from "react";
import clsx from "clsx";

import type { BlockTheme, Particles } from "@/game/themes";

import { CSSParticles } from "./CSSParticles";

import styles from "./Background.module.css";

type Props = {
  backgroundClassName?: string;
  theme?: BlockTheme;
  particles?: Particles;
  layout?: string;
  musicEnabled?: boolean;
};

const symbols = {
  ghost: "\\1F47B",
  snow: "\\2744",
  yellowCircle: "\\1F7E1",
  bubbles: "\\1FAE7",
  drop: "\\1F4A7"
};

export const Background: React.FC<PropsWithChildren<Props>> = ({
  children,
  backgroundClassName = "",
  theme = "default",
  layout = "default",
  particles,
  musicEnabled = true
}) => {
  return (
    <div
      className={clsx(
        "relative h-full overflow-hidden transition-all [transition-duration:1.5s] [transition-timing-function:ease-out]",
        backgroundClassName
      )}
    >
      {theme === "halloween" && (
        <div className="absolute left-0 top-0 h-full w-full animate-lightning bg-white"></div>
      )}
      <div className="absolute left-0 top-0 h-full w-full bg-wood-texture bg-top mix-blend-multiply"></div>
      {theme === "summer" && (
        <div
          className={clsx(
            "absolute left-0 top-0 h-full w-full",
            styles.sunlight
          )}
        >
          <div
            className={clsx(
              "absolute bottom-0 right-2/3 -mb-[3rem] origin-bottom -scale-x-[1] text-[10rem] transition-transform [transition-duration:1500ms]"
            )}
          >
            🌴
          </div>
          <div
            className={clsx(
              "absolute bottom-0 left-2/3 -mb-[3rem] origin-bottom text-[10rem] transition-transform [transition-duration:1500ms]"
            )}
          >
            🌴
          </div>
          <div className="absolute left-4 top-[30px] -rotate-12">
            <div className={clsx("absolute origin-bottom text-[5rem]")}>
              {particles !== "sweat" && particles !== "heavy-sweat" && "😁️"}
              {particles === "sweat" && "️😛"}
              {particles === "heavy-sweat" && "️🥵"}
            </div>
            <div
              className={clsx(
                "relative left-2 top-4 origin-center -translate-y-2 text-[4rem]"
              )}
            >
              🕶️️
            </div>
          </div>
        </div>
      )}
      {theme === "halloween" && (
        <div
          className={clsx(
            "absolute bottom-0 left-0 text-8xl transition-all [transition-duration:2000ms]",
            {
              "translate-x-[100vw]": layout === "zenMode"
            }
          )}
        >
          <div
            className={clsx(
              "inline-block transition-all [transition-duration:2000ms]",
              {
                "-rotate-12": layout === "levelTrack",
                "-translate-x-[90px] rotate-[372deg]": layout === "zenMode"
              }
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
                "[transition-delay:1500ms]": layout === "zenMode"
              }
            )}
          >
            🎄
          </div>
          <div
            className={clsx(
              "absolute bottom-0 left-0 origin-bottom scale-150 text-8xl transition-transform [transition-duration:1500ms]",
              {
                "translate-y-[150%] rotate-12": layout === "zenMode",
                "[transition-delay:1500ms]": layout === "levelTrack"
              }
            )}
          >
            🎄
          </div>
        </>
      )}
      {theme === "winter" && particles !== "heavy-sweat" && (
        <div className={clsx("absolute right-0 top-3/4 translate-x-8 -rotate-45 text-8xl", particles === "sweat" && "blur-[2px]")}>
          ⛄️
        </div>
      )}
      {theme === "spring" && (
        <div
          className={clsx(
            "pointer-events-none absolute bottom-0 left-0 origin-bottom rotate-6 scale-150 text-8xl transition-transform [transition-duration:3000ms]",
            {
              "translate-y-[180%] rotate-12": layout === "zenMode",
              "[transition-delay:1500ms]": layout === "levelTrack"
            }
          )}
        >
          <div
            className={clsx("-mb-1 origin-bottom", {
              ["animate-plantWiggle"]: musicEnabled,
              ["animate-plantWiggleSlow"]: !musicEnabled
            })}
          >
            🌷
          </div>
        </div>
      )}
      <div className="absolute left-0 top-0 h-safe-area w-full">{children}</div>
      {theme === "spring" && (
        <>
          <div
            className={clsx(
              "pointer-events-none absolute right-0 top-0 origin-top-right rotate-[20deg] animate-rayShift opacity-30",
              "h-3/4 w-[7rem] translate-x-4 bg-gradient-to-b from-[#ffff80fd] via-[#ffffae90] to-[#ffffae00]"
            )}
          ></div>
          <div
            className={clsx(
              "pointer-events-none absolute right-0 top-0 origin-top-right rotate-[20deg] animate-rayShift2 opacity-30",
              "h-3/4 w-[8rem] -translate-x-9 bg-gradient-to-b from-[#ffffa0fd] via-[#ffffae90] to-[#ffffae00]"
            )}
          ></div>
        </>
      )}
      {theme === "spring" && (
        <div
          className={clsx(
            "pointer-events-none absolute bottom-0 right-1/4 -mb-6 origin-bottom translate-x-8 text-8xl",
            {
              ["animate-plantWiggle"]: musicEnabled,
              ["animate-plantWiggleSlow"]: !musicEnabled
            }
          )}
        >
          🌱
        </div>
      )}
      {particles === "ghosts" && (
        <CSSParticles
          symbol={symbols.ghost}
          amount={10}
          direction="up"
          shift={200}
          scale={[0.7, 1.8]}
          speed={[30, 50]}
          floatDistance={[20, 100]}
          floatSpeed={[5, 10]}
        />
      )}
      {particles === "snow" && (
        <CSSParticles
          symbol={symbols.snow}
          amount={30}
          shift={100}
          direction="down"
          scale={[0.2, 1]}
          speed={[30, 50]}
          floatDistance={[20, 100]}
          floatSpeed={[5, 10]}
        />
      )}
      {particles === "sweat" && (
        <CSSParticles
          symbol={symbols.drop}
          amount={10}
          shift={100}
          direction="down"
          scale={[0.6, 1.0]}
          opacity={[0.3, 0.6]}
          speed={[90, 120]}
          floatDistance={[0, 10]}
          floatSpeed={[5, 10]}
        />
      )}
      {particles === "heavy-sweat" && (
        <CSSParticles
          symbol={symbols.drop}
          amount={20}
          shift={100}
          direction="down"
          scale={[0.8, 1.2]}
          opacity={[0.4, 0.7]}
          speed={[70, 90]}
          floatDistance={[0, 10]}
          floatSpeed={[5, 10]}
        />
      )}
      {particles === "pollen" && (
        <CSSParticles
          symbol={symbols.yellowCircle}
          amount={10}
          shift={100}
          direction="down"
          scale={[0.2, 0.4]}
          speed={[40, 80]}
          floatDistance={[20, 100]}
          floatSpeed={[5, 10]}
        />
      )}
      {particles === "bubbles" && (
        <CSSParticles
          symbol={symbols.bubbles}
          amount={10}
          direction="up"
          shift={400}
          scale={[0.7, 1.8]}
          speed={[30, 50]}
          floatDistance={[10, 30]}
          floatSpeed={[8, 12]}
        />
      )}
    </div>
  );
};
