import { Dispatch, useRef } from "react";

import { BlockTheme } from "@/game/themes";
import { LevelState } from "@/game/types";
import { colSizes } from "@/support/grid";
import { useScreenUpdate } from "@/support/useScreenUpdate";

import { BlockColumn } from "../BlockColumn/BlockColumn";

import { useBlockAnimation } from "./useBlockAnimation";

type Props = {
  started: boolean;
  levelState: LevelState;
  selection?: [column: number, amount: number];
  suggestionSelection?: [column: number, amount: number];
  suggestionTarget?: number;
  hideFormat?: "glass" | "present";
  theme?: BlockTheme;
  animateBlocks?: boolean;
  onColumnDown?: Dispatch<number>;
  onColumnUp?: Dispatch<number>;
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

const BLOCK_ANIMATION_TIME = 400;

export const LevelLayout: React.FC<Props> = ({
  started,
  levelState,
  selection,
  suggestionSelection,
  suggestionTarget,
  animateBlocks = true,
  theme = "default",
  hideFormat = "glass",
  onColumnDown,
  onColumnUp,
  onDrop,
  onLock,
  onPickUp
}) => {
  useScreenUpdate();

  // Create an array of refs
  const refsArray = useRef<HTMLDivElement[]>([]);

  // Assign a ref to each element in the array
  const addToRefsArray = (el: HTMLDivElement | null, index: number) => {
    if (el && !refsArray.current.includes(el)) {
      refsArray.current[index] = el;
    }
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const x = event.clientX;
    const y = event.clientY;

    // Use elementFromPoint to find the element at the touch end coordinates
    const targetElement = document.elementFromPoint(x, y);

    // Find the index of the target element in refsArray
    const targetIndex = refsArray.current.findIndex(
      (ref) => ref && ref.contains(targetElement)
    );

    if (targetIndex !== -1) {
      onColumnUp?.(targetIndex);
    }
  };

  const { animate, pickup } = useBlockAnimation(levelState, selection, {
    disabled: !animateBlocks,
    transitionTime: BLOCK_ANIMATION_TIME,
    theme
  });

  const maxColumnSize = levelState.columns.reduce(
    (r, c) => Math.max(r, c.columnSize),
    0
  );
  const cols = determineColumns(maxColumnSize, levelState.columns.length);
  return (
    <div className="flex w-full flex-1 touch-none flex-col flex-wrap items-center justify-center">
      <div className="w-full max-w-[600px]">
        <div className={`grid grid-flow-dense ${cols}`}>
          {levelState.columns.map((bar, i) => (
            <BlockColumn
              column={bar}
              key={i}
              ref={(el) => addToRefsArray(el, i)}
              theme={theme}
              motionDuration={animateBlocks ? BLOCK_ANIMATION_TIME : 0}
              onPointerDown={() => {
                onColumnDown?.(i);
              }}
              onPointerUp={(e) => {
                handlePointerUp(e);
              }}
              started={started}
              suggested={suggestionTarget === i}
              amountSelected={
                selection && i === selection[0] ? selection[1] : 0
              }
              detectHover={!!selection}
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
  );
};
