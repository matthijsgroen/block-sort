import { PropsWithChildren, useEffect, useState } from "react";
import { ISourceOptions, MoveDirection } from "@tsparticles/engine";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import clsx from "clsx";

import { BlockTheme } from "@/game/themes";
import { LevelType } from "@/support/getLevelType";

type Props = {
  levelType?: LevelType;
  theme?: BlockTheme;
};

const snow: ISourceOptions = {
  detectRetina: true,
  fpsLimit: 30,
  pauseOnBlur: true,
  particles: {
    number: {
      value: 100,
    },
    move: {
      direction: MoveDirection.bottom,
      enable: true,
      random: false,
      straight: false,
    },
    opacity: {
      value: { min: 0.1, max: 0.5 },
    },
    size: {
      value: { min: 2, max: 10 },
    },
    shape: {
      type: "emoji",
      options: {
        emoji: {
          font: "sans-serif",
          value: "❄️",
        },
      },
    },

    wobble: {
      distance: 20,
      enable: true,
      speed: {
        min: -5,
        max: 5,
      },
    },
  },
};

const ghosts: ISourceOptions = {
  detectRetina: true,
  fpsLimit: 30,
  pauseOnBlur: true,
  particles: {
    number: {
      value: 10,
    },
    move: {
      direction: MoveDirection.top,
      enable: true,
      random: false,
      straight: false,
    },
    opacity: {
      value: { min: 0.1, max: 0.5 },
    },
    size: {
      value: { min: 3, max: 20 },
    },
    shape: {
      type: "emoji",
      options: {
        emoji: {
          font: "sans-serif",
          value: "️👻",
        },
      },
    },

    wobble: {
      distance: 20,
      enable: true,
      speed: {
        min: -5,
        max: 5,
      },
    },
  },
};

const themeParticles: Record<BlockTheme, ISourceOptions | undefined> = {
  winter: snow,
  halloween: ghosts,
  default: undefined,
};

export const Background: React.FC<PropsWithChildren<Props>> = ({
  children,
  levelType,
  theme = "default",
}) => {
  const [init, setInit] = useState(false);

  const particles = themeParticles[theme];

  // this should be run only once per application lifetime
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  return (
    <div
      className={clsx(
        "h-full relative transition-all [transition-duration:1.5s] [transition-timing-function:ease-out]",
        {
          "bg-transparent": levelType === undefined || levelType === "normal",
          "bg-purple-700/50": levelType === "special",
          "bg-red-600/70": levelType === "hard",
          "bg-green-600/40": levelType === "easy",
          "bg-slate-400/40": levelType === "scrambled",
        }
      )}
    >
      {theme === "halloween" && (
        <div className="absolute left-0 top-0 h-full w-full animate-lightning bg-white"></div>
      )}
      <div className="absolute left-0 top-0 h-full w-full mix-blend-multiply bg-wood-texture"></div>
      {theme === "halloween" && (
        <div className="absolute left-0 bottom-0 text-8xl -rotate-12">🎃</div>
      )}
      {theme === "winter" && (
        <div className="absolute left-0 bottom-0 text-8xl">🎄</div>
      )}
      {theme === "winter" && (
        <div className="absolute right-0 top-3/4 text-8xl -rotate-45 translate-x-8">
          ⛄️
        </div>
      )}
      <div className="absolute left-0 top-0 h-safe-area w-full">{children}</div>
      {init && particles && <Particles id="tsparticles" options={particles} />}
    </div>
  );
};
