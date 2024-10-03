import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { IOptions, ISourceOptions, MoveDirection } from "@tsparticles/engine";
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
  fpsLimit: 60,
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
          font: "system-ui",
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

export const Background: React.FC<PropsWithChildren<Props>> = ({
  children,
  levelType,
}) => {
  const [init, setInit] = useState(false);
  const [useParticles, setUseParticles] = useState(false);

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
      <div className="absolute left-0 top-0 h-full w-full mix-blend-multiply bg-wood-texture"></div>
      <div className="absolute left-0 top-0 h-safe-area w-full">{children}</div>
      {init && useParticles && <Particles id="tsparticles" options={snow} />}
    </div>
  );
};
