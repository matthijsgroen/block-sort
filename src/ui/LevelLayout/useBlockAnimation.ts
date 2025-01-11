import { useCallback, useEffect, useRef } from "react";

import styles from "@/ui/Block/Block.module.css";

import { BlockTheme, getColorMapping, getShapeMapping } from "@/game/themes";
import { BlockColor, LevelState } from "@/game/types";
import { createFrames, Rect, shiftRect } from "@/support/createFrames";
import { effectTimeout } from "@/support/effectTimeout";
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

const createBlock = (shape: string, color: string): HTMLDivElement => {
  const div = document.createElement("div");
  div.style.setProperty("--cube-color", color);
  div.style.setProperty("--shape-color", color);
  div.style.setProperty("--cube-shape-opacity", "50%");
  div.style.setProperty("--cube-shape", `'${encodeForContent(shape)}'`);
  div.style.setProperty("--cube-top-shape", `'${encodeForContent(shape)}'`);
  div.classList.add(
    "-mt-top-block",
    "h-height-block",
    "w-block",
    "rounded-md",
    "text-center",
    "pointer-events-none",
    styles.blockGradient,
    styles.shape
  );

  return div;
};

type AnimationData = {
  sourceBlocks: DOMRect[];
  targetSpot: DOMRect;
  sourceColumnTop: number;
  targetColumnTop: number;
};

export const useBlockAnimation = (
  levelState: LevelState,
  selection: [columnNr: number, amount: number] | undefined,
  {
    disabled = false,
    transitionTime = 400,
    theme = "default",
    getScale = () => 1
  }: {
    disabled?: boolean;
    transitionTime?: number;
    theme?: BlockTheme;
    getScale?: () => number;
  } = {}
) => {
  const selectionRef = useRef<DOMRect[]>([]);
  const transitionTop = useRef<number | undefined>(undefined);

  const animationRef = useRef<AnimationData | undefined>(undefined);

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

    return effectTimeout(() => {
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
      const source = shiftRect(
        animationData.sourceBlocks[
          animationData.sourceBlocks.length - blocksAdded
        ],
        0,
        20
      );
      const target = shiftRect(animationData.targetSpot, 0, -5);

      const color = getColorMapping(theme)[blockColor];
      const shape = getShapeMapping(theme)[blockColor];

      animateBlocksByTranslate(
        source,
        target,
        animationData,
        blocksAdded,
        shape,
        color,
        getScale(),
        transitionTime - 20
      );
    }, 10); // delay to allow the DOM to update first
  }, [levelState]);

  if (disabled) {
    return { animate: () => {}, pickup: () => {} };
  }

  return { animate, pickup };
};

const animateBlocksByTranslate = (
  source: Rect,
  target: Rect,
  animationData: AnimationData,
  blocksAdded: number,
  shape: string,
  color: string,
  scale: number,
  transitionTime: number
) =>
  timesMap(blocksAdded, (i) => {
    const start = shiftRect(source, 0, -40 * i);
    const end = shiftRect(target, 0, -40 * (blocksAdded - 1 - i));

    const div = createBlock(shape, color);
    div.style.setProperty("top", `${start.y}px`);
    div.style.setProperty("scale", `${scale}`);
    div.style.setProperty("left", `${start.x}px`);
    div.classList.add("absolute");
    const frames = createFrames(
      start,
      end,
      animationData.sourceColumnTop - 60,
      animationData.targetColumnTop - 60,
      blocksAdded + 10 - i
    );

    document.body.appendChild(div);

    div.animate(frames, {
      duration: transitionTime,
      fill: "forwards",
      easing: "ease-in-out",
      iterations: 1
    }).onfinish = () => {
      div.remove();
    };

    return div;
  });
