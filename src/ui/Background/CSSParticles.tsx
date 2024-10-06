import clsx from "clsx";

import { between, mulberry32 } from "@/support/random";
import { timesMap } from "@/support/timeMap";

import styles from "./CSSParticles.module.css";

type Props = {
  symbol: string;
  amount: number;
  direction: "up" | "down";
  scale: [min: number, max: number];
};

const SEED = 123456789;

export const CSSParticles: React.FC<Props> = ({
  symbol,
  amount,
  direction,
  scale,
}) => {
  const random = mulberry32(SEED);
  const yStart = direction === "up" ? "100vh" : "calc(0vh - 50px)";
  const yEnd = direction === "up" ? "calc(0vh - 50px)" : "100vh";

  return (
    <div className="absolute inset-0 pointer-events-none">
      {timesMap(amount, (i) => {
        const movement = between(20, 40, random);
        return (
          <div
            key={i}
            style={{
              left: `${between(-2, 98, random)}vw`,
              top: "-50px",
              "--floatSpeed": `${between(2, 6, random)}s`,
              "--floatDelay": `${between(0, 1, random)}s`,
              "--moveSpeed": `${movement}s`,
              "--delay": `-${between(0, movement, random)}s`,
              "--directionYStart": `${yStart}`,
              "--directionYEnd": `${yEnd}`,
              "--directionXStart": "0px",
              "--directionXEnd": `${between(-100, 100, random)}px`,
              "--float": `${between(20, 40, random)}px`,
              "--symbol": `"${symbol}"`,
              scale: `${between(scale[0], scale[1], random)}`,
              opacity: `${between(0.5, 0.8, random)}`,
            }}
            className={clsx(styles.float, styles.particle)}
          ></div>
        );
      })}
    </div>
  );
};
