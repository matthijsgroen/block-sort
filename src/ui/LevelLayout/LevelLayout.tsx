import { Dispatch, use } from "react";

import { BlockTheme } from "@/game/themes";
import { LevelState } from "@/game/types";
import { BetaContext } from "@/modules/Layout/BetaContext";
import { colSizes } from "@/support/grid";
import { isIos } from "@/support/isIos";
import { useScreenUpdate } from "@/support/useScreenUpdate";

import { BlockColumn } from "../BlockColumn/BlockColumn";

import { BlockAnimation } from "./BlockAnimation";
import { useBlockAnimation } from "./useBlockAnimation";

type Props = {
  started: boolean;
  levelState: LevelState;
  selection?: [column: number, amount: number];
  suggestionSelection?: [column: number, amount: number];
  suggestionTarget?: number;
  hideFormat?: "glass" | "present";
  theme?: BlockTheme;
  onColumnClick?: Dispatch<number>;
  onPickUp?: VoidFunction;
  onDrop?: VoidFunction;
  onLock?: VoidFunction;
};

const determineColumns = (
  maxColumnHeight: number,
  amountColumns: number
): string => {
  const isLandscape = window.innerHeight < window.innerWidth;

  if (maxColumnHeight <= 6 && amountColumns < 6) {
    const gridColumnCount = amountColumns;
    return colSizes[gridColumnCount];
  }
  if (maxColumnHeight <= 6 && amountColumns < 12 && !isLandscape) {
    const gridColumnCount = Math.ceil(amountColumns / 2);
    return colSizes[gridColumnCount];
  }
  if (maxColumnHeight <= 4 && amountColumns < 16 && !isLandscape) {
    const gridColumnCount = Math.ceil(amountColumns / 3);
    return colSizes[gridColumnCount];
  }
  if (isLandscape) {
    return colSizes[Math.min(amountColumns, 12)];
  }

  return "grid-cols-6";
};

export const LevelLayout: React.FC<Props> = ({
  started,
  levelState,
  selection,
  suggestionSelection,
  suggestionTarget,
  theme = "default",
  hideFormat = "glass",
  onColumnClick,
  onDrop,
  onLock,
  onPickUp
}) => {
  useScreenUpdate();
  const { showBeta } = use(BetaContext);

  /**
   * Disable block move animation on iOS, as it is not performant.
   *
   * Especially in standalone mode, apple is gimping the performance
   */
  const blockMoveAnimationDisabled = isIos() && !showBeta;
  const moveTransitionTime = 300;

  const { animate, pickup, animationPaths } = useBlockAnimation(
    levelState,
    selection,
    { disabled: blockMoveAnimationDisabled, transitionTime: moveTransitionTime }
  );

  const maxColumnSize = levelState.columns.reduce(
    (r, c) => Math.max(r, c.columnSize),
    0
  );
  const cols = determineColumns(maxColumnSize, levelState.columns.length);
  return (
    <>
      <div className="flex flex-1 flex-wrap justify-center p-2">
        <div className="w-full max-w-[600px] content-center">
          <div className={`grid grid-flow-dense ${cols}`}>
            {levelState.columns.map((bar, i) => (
              <BlockColumn
                column={bar}
                key={i}
                theme={theme}
                motionDuration={
                  blockMoveAnimationDisabled ? 0 : moveTransitionTime
                }
                onClick={() => {
                  onColumnClick?.(i);
                }}
                started={started}
                suggested={suggestionTarget === i}
                amountSelected={
                  selection && i === selection[0] ? selection[1] : 0
                }
                amountSuggested={
                  suggestionSelection && i === suggestionSelection[0]
                    ? suggestionSelection[1]
                    : 0
                }
                hideFormat={hideFormat}
                onLock={onLock}
                onDrop={onDrop}
                onPickUp={({ top, rect }) => {
                  pickup(top, rect);

                  onPickUp?.();
                }}
                onPlacement={({ top, rect }) => {
                  animate(top, rect);
                }}
              />
            ))}
          </div>
        </div>
      </div>
      {animationPaths.map((p, i) => (
        <BlockAnimation
          key={i}
          path={p}
          theme={theme}
          duration={moveTransitionTime}
        />
      ))}
    </>
  );
};
