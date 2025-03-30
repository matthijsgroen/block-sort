import { Fragment } from "react/jsx-runtime";
import clsx from "clsx";

import { LEVEL_SCALE } from "@/game/level-settings/levelSettings";
import { getLevelType } from "@/game/level-types";
import type { BlockTheme } from "@/game/themes";
import { LevelDoneIcon } from "@/modules/LevelTrack/LevelDoneIcon";
import { LevelNode } from "@/modules/LevelTrack/LevelNode";
import { LevelTrackMessageBar } from "@/modules/LevelTrack/LevelTrackMessageBar";
import { LevelTypeIcon } from "@/modules/LevelTrack/LevelTypeIcon";

import { Smiley } from "../Smiley/Smiley";

import styles from "./levelTrack.module.css";

const translates = [
  "",
  "translate-x-10",
  "translate-x-20",
  "translate-x-10",
  "",
  "-translate-x-10",
  "-translate-x-20",
  "-translate-x-10"
];

type Props = {
  levelNr: number;
  officialLevelNr: number;
  amountToRender?: number;
  scrollOffset?: number;
  numberFrom: number;
  maxLevelNr?: number;
  theme: BlockTheme;

  getLevelMessage?: (levelNr: number) => string | undefined;
};

export const Track: React.FC<Props> = ({
  levelNr,
  amountToRender = 30,
  scrollOffset = 2,
  maxLevelNr = Infinity,
  officialLevelNr,
  numberFrom,
  theme,
  getLevelMessage
}) => {
  const levelNrs = new Array(amountToRender)
    .fill(0)
    .map((_, i) => numberFrom + i);
  const jumpRight = (levelNr + 2) % 8 < 4;
  const hasMessage = getLevelMessage?.(officialLevelNr) !== undefined;

  return (
    <ol
      className="flex w-full flex-1 flex-col-reverse overflow-y-hidden"
      style={{
        "--distance": hasMessage ? "-4.5rem" : "-3.5rem",
        "--jump-distance": hasMessage ? "4.5rem" : "3.5rem"
      }}
    >
      {levelNrs.map((i) => {
        const offset = i % 8;
        const levelMessage = getLevelMessage?.(i);
        if (i > maxLevelNr) {
          return null;
        }
        const levelType = getLevelType(i, theme);

        return (
          <Fragment key={i}>
            {levelMessage !== undefined && (
              <li
                className={clsx(
                  "flex w-full flex-shrink-0 items-center justify-center border-b-2 border-b-black/10 align-middle",
                  {
                    [styles.shiftDown]:
                      levelNr < officialLevelNr && levelNr >= scrollOffset
                  }
                )}
              >
                <LevelTrackMessageBar levelNr={i} message={levelMessage} />
              </li>
            )}
            <li
              style={{ "--levelNr": `'${LEVEL_SCALE.indexOf(i) + 1}'` }}
              className={clsx(
                "flex h-height-block w-full flex-shrink-0 items-center justify-center align-middle",
                {
                  [styles.shiftDown]: levelNr < officialLevelNr && levelNr >= 2
                }
              )}
            >
              <LevelNode
                levelNr={i + 1}
                className={translates[offset]}
                completed={i < officialLevelNr}
                isCurrent={i === officialLevelNr}
                textColor={levelType.textClassName}
                borderColor={levelType.borderClassName}
              >
                {i == officialLevelNr && (
                  <span
                    className={clsx("inline-block w-10", {
                      [styles.hop]: levelNr < officialLevelNr
                    })}
                    style={{
                      "--direction": jumpRight ? "-2.6rem" : "2.4rem",
                      "--rotateDirection": jumpRight ? "40deg" : "-40deg"
                    }}
                  >
                    <Smiley />
                  </span>
                )}
                {(i < levelNr ||
                  (levelNr < officialLevelNr && i === levelNr)) && (
                  <LevelDoneIcon
                    fadeIn={i === levelNr && levelNr < officialLevelNr}
                  />
                )}
                {i > levelNr && (
                  <LevelTypeIcon
                    fadeOut={i === officialLevelNr}
                    levelType={levelType}
                  />
                )}
              </LevelNode>
            </li>
          </Fragment>
        );
      })}
    </ol>
  );
};
