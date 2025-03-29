import type { Dispatch } from "react";
import React, { useCallback, useEffect, useRef, useState } from "react";

import type { BlockTheme } from "@/game/themes";
import type { LevelState } from "@/game/types";
import { colSizes } from "@/support/grid";
import { useScreenUpdate } from "@/support/useScreenUpdate";

import type { HideFormat } from "../Block/Block";
import { BlockColumn } from "../BlockColumn/BlockColumn";

import { useBlockAnimation } from "./useBlockAnimation";

type Props = {
  started: boolean;
  levelState: LevelState;
  selection?: [column: number, amount: number];
  suggestionSelection?: [column: number, amount: number];
  suggestionTarget?: number;
  hideFormat?: HideFormat;
  theme?: BlockTheme;
  tutorialContent?: React.ReactNode;
  animateBlocks?: boolean;
  animateColumns?: "fadeOut" | "fadeIn" | "none";
  onColumnDown?: Dispatch<number>;
  onColumnUp?: Dispatch<number>;
  onPickUp?: VoidFunction;
  onDrop?: VoidFunction;
  onLock?: VoidFunction;
  onMatch?: VoidFunction;
};

const determineColumns = (
  maxColumnHeight: number,
  levelState: LevelState
): string => {
  const amountColumns = levelState.columns.length;
  const isLandscape = window.innerHeight < window.innerWidth;
  const isLimitedHeight = window.innerHeight < 500;
  if (levelState.width && !isLimitedHeight) {
    return colSizes[levelState.width];
  }
  if (levelState.width && isLimitedHeight && levelState.width < 6) {
    return colSizes[levelState.width * 2];
  }

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
    return `${colSizes[Math.min(amountColumns, 12)]}`;
  }

  return "grid-cols-6";
};

export const BLOCK_ANIMATION_TIME = 500;

export const LevelLayout: React.FC<Props> = ({
  started,
  levelState,
  selection,
  suggestionSelection,
  suggestionTarget,
  tutorialContent,
  animateBlocks = true,
  animateColumns = "none",
  theme = "default",
  hideFormat = "glass",
  onColumnDown,
  onColumnUp,
  onDrop,
  onLock,
  onPickUp,
  onMatch
}) => {
  useScreenUpdate();
  const containerHeightRef = useRef<HTMLDivElement>(null);
  const contentHeightRef = useRef<HTMLDivElement>(null);

  // Create an array of refs
  const refsArray = useRef<HTMLDivElement[]>([]);

  // Assign a ref to each element in the array
  const addToRefsArray = (el: HTMLDivElement | null, index: number) => {
    if (el && !refsArray.current.includes(el)) {
      refsArray.current[index] = el;
    }
  };

  const [hoverColumnIndex, setHoverColumnIndex] = useState(-1);
  useEffect(() => {
    if (selection) {
      const onPointerMove = (event: PointerEvent) => {
        let hoverIndex = -1;
        for (const ref of refsArray.current) {
          const rect = ref.getBoundingClientRect();
          const isInside =
            event.clientX >= rect.left &&
            event.clientX <= rect.right &&
            event.clientY >= rect.top &&
            event.clientY <= rect.bottom;
          if (isInside) {
            hoverIndex = refsArray.current.indexOf(ref);
          }
        }
        setHoverColumnIndex(hoverIndex);
      };
      window.addEventListener("pointermove", onPointerMove);
      return () => {
        window.removeEventListener("pointermove", onPointerMove);
      };
    } else {
      setHoverColumnIndex(-1);
    }
  }, [!!selection]);

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
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
    },
    [onColumnUp]
  );

  const { animate, pickup } = useBlockAnimation(levelState, selection, {
    disabled: !animateBlocks,
    transitionTime: BLOCK_ANIMATION_TIME,
    theme,
    getScale: () =>
      parseFloat(
        contentHeightRef.current?.style.getPropertyValue("--levelScale") ?? "1"
      )
  });

  const handlePickup = useCallback(
    ({ top, rect }: { top: number; rect: DOMRect }) => {
      pickup(top, rect);
      onPickUp?.();
    },
    [onPickUp]
  );

  const handlePlacement = useCallback(
    ({ top, rect }: { top: number; rect: DOMRect }) => {
      animate(top, rect);
    },
    []
  );

  const maxColumnSize = levelState.columns.reduce(
    (r, c) => Math.max(r, c.columnSize + (c.paddingTop ?? 0)),
    0
  );
  const cols = determineColumns(maxColumnSize, levelState);

  useEffect(() => {
    const scaleContent = () => {
      if (contentHeightRef.current && containerHeightRef.current) {
        containerHeightRef.current.style.overflow = "hidden";
        contentHeightRef.current.style.setProperty("--levelScale", "1");

        const scale =
          containerHeightRef.current.clientHeight /
          contentHeightRef.current.scrollHeight;

        if (scale < 1) {
          contentHeightRef.current.style.setProperty(
            "--levelScale",
            `${containerHeightRef.current.clientHeight / (contentHeightRef.current.scrollHeight + 20)}`
          );
        } else {
          contentHeightRef.current.style.setProperty("--levelScale", "1");
        }
        containerHeightRef.current.style.overflow = "visible";
      }
    };
    scaleContent();
    window.addEventListener("resize", scaleContent);
    return () => {
      window.removeEventListener("resize", scaleContent);
    };
  }, [contentHeightRef, containerHeightRef]);

  return (
    <div className="flex flex-1 justify-center" ref={containerHeightRef}>
      <div
        className="flex w-full max-w-[800px] flex-1 touch-none flex-col flex-wrap items-center justify-center"
        ref={contentHeightRef}
      >
        {tutorialContent}
        <div className="box-border w-full origin-top scale-[--levelScale]">
          <div className={`grid grid-flow-dense ${cols} py-2`}>
            {levelState.columns.map((bar, i) => (
              <BlockColumn
                column={bar}
                key={i}
                ref={(el) => addToRefsArray(el, i)}
                animation={animateColumns}
                animationDelay={
                  animateColumns === "fadeOut"
                    ? 2_000 + (levelState.columns.length - 1 - i) * 100
                    : (levelState.columns.length - 1 - i) * 100
                }
                theme={theme}
                motionDuration={animateBlocks ? BLOCK_ANIMATION_TIME : 0}
                onPointerDown={() => {
                  onColumnDown?.(i);
                }}
                onPointerUp={handlePointerUp}
                started={started}
                suggested={suggestionTarget === i}
                blocked={selection && i === selection[0] && selection[1] === 0}
                amountSelected={
                  selection && i === selection[0] ? selection[1] : 0
                }
                hovering={hoverColumnIndex === i}
                amountSuggested={
                  suggestionSelection && i === suggestionSelection[0]
                    ? suggestionSelection[1]
                    : 0
                }
                hideFormat={hideFormat}
                onLock={onLock}
                onDrop={onDrop}
                onPickUp={handlePickup}
                onPlacement={handlePlacement}
                onMatch={onMatch}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
