import { useCallback, useEffect, useRef } from "react";

import styles from "@/ui/Block/Block2.module.css";

import { BlockTheme, getColorMapping, getShapeMapping } from "@/game/themes";
import { BlockColor, LevelState } from "@/game/types";
import { createAnimationPath, Rect } from "@/support/createAnimationPath";
import { encodeForContent } from "@/support/emojiEncoding";
import { timesMap } from "@/support/timeMap";

export type AnimationPath = {
  startX: number;
  startY: number;
  offset: number;
  count: number;
  path: string;
  color: BlockColor;
};

export const useBlockAnimation = (
  levelState: LevelState,
  selection: [columnNr: number, amount: number] | undefined,
  {
    disabled = false,
    transitionTime = 400,
    theme = "default"
  }: { disabled?: boolean; transitionTime?: number; theme?: BlockTheme } = {}
) => {
  const selectionRef = useRef<DOMRect[]>([]);
  const transitionTop = useRef<number | undefined>(undefined);

  const animationRef = useRef<
    | {
        sourceBlocks: DOMRect[];
        targetSpot: DOMRect;
        sourceColumnTop: number;
        targetColumnTop: number;
      }
    | undefined
  >(undefined);

  useEffect(() => {
    if (selection === undefined) {
      selectionRef.current = [];
    }
  }, [selection]);

  const animate = useCallback((targetTop: number, targetRect: DOMRect) => {
    animationRef.current = {
      sourceBlocks: selectionRef.current,
      targetSpot: targetRect,
      sourceColumnTop: transitionTop.current ?? 0,
      targetColumnTop: targetTop
    };

    selectionRef.current = [];
    transitionTop.current = undefined;
  }, []);

  const pickup = useCallback((top: number, rect: DOMRect) => {
    selectionRef.current.push(rect);
    transitionTop.current = top;
  }, []);

  const previousLevelState = useRef<LevelState>(undefined);

  useEffect(() => {
    if (
      !previousLevelState.current ||
      levelState == previousLevelState.current ||
      disabled
    ) {
      previousLevelState.current = levelState;
      return;
    }

    const prevLevel = previousLevelState.current;
    previousLevelState.current = levelState;

    if (prevLevel.columns.length !== levelState.columns.length) {
      return; // layout changed, no animation
    }

    const addedColumn = levelState.columns.findIndex(
      (c, i) => c.blocks.length > prevLevel.columns[i].blocks.length
    );

    if (
      addedColumn === -1 ||
      !animationRef.current ||
      animationRef.current.sourceBlocks.length === 0
    ) {
      return;
    }

    const animationData = animationRef.current;

    const blocksAdded =
      levelState.columns[addedColumn].blocks.length -
      prevLevel.columns[addedColumn].blocks.length;

    const blockColor = levelState.columns[addedColumn].blocks[0].color;
    const source = animationData.sourceBlocks.at(-1)!;
    const target: Rect = {
      x: animationData.targetSpot.x,
      y: animationData.targetSpot.y - 80,
      width: animationData.targetSpot.width,
      height: animationData.targetSpot.height
    };
    const path = createAnimationPath(
      source,
      target,
      animationData.sourceColumnTop - 60,
      animationData.targetColumnTop - 60
    );

    const newAnimationPaths = timesMap(blocksAdded, (i) => {
      return {
        startX: source.x,
        startY: source.top + 20,
        offset: i,
        count: blocksAdded,
        path,
        color: blockColor
      };
    });

    const color = getColorMapping(theme)[blockColor];
    const shape = getShapeMapping(theme)[blockColor];

    // create instances of blocks self, outside of react
    newAnimationPaths.map<HTMLDivElement>((path) => {
      const div = document.createElement("div");
      div.style.setProperty("--cube-color", color);
      div.style.setProperty("--shape-color", color);
      div.style.setProperty("--cube-shape-opacity", "50%");
      div.style.setProperty("--cube-shape", `'${encodeForContent(shape)}'`);
      div.style.setProperty("--cube-top-shape", `'${encodeForContent(shape)}'`);
      div.style.setProperty("top", `${path.startY}px`);
      div.style.setProperty("left", `${path.startX}px`);
      div.style.setProperty("offset-path", `path('${path.path}')`);
      div.style.setProperty("offset-rotate", "0deg");
      div.style.setProperty("--animation-duration", `${transitionTime}ms`);
      div.classList.add(
        "-mt-top-block",
        "h-height-block",
        "w-block",
        "rounded-md",
        "text-center",
        "pointer-events-none",
        "absolute",
        styles.blockGradient,
        styles.shape
      );

      document.body.appendChild(div);
      div.addEventListener("animationend", () => {
        div.remove();
      });
      div.animate(
        [
          { offsetDistance: `${40 * path.offset}px` },
          {
            offsetDistance: `calc(100% - ${40 * (path.count - 1 - path.offset)}px)`
          }
        ],
        {
          duration: transitionTime,
          fill: "forwards",
          iterations: 1
        }
      ).onfinish = () => {
        div.remove();
      };

      return div;
    });
  }, [levelState]);

  if (disabled) {
    return { animate: () => {}, pickup: () => {} };
  }

  return { animate, pickup };
};
