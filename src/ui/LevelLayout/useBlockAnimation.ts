import { useCallback, useEffect, useRef } from "react";

import styles from "@/ui/Block/Block.module.css";

import type { BlockType } from "@/game/blocks";
import { locks } from "@/game/level-creation/lock-n-key";
import { isKeyType, isLockType } from "@/game/state";
import type { BlockTheme } from "@/game/themes";
import { getColorMapping, getShapeMapping } from "@/game/themes";
import type { LevelState } from "@/game/types";
import type { Rect } from "@/support/createFrames";
import { createFrames, shiftRect } from "@/support/createFrames";
import { effectTimeout } from "@/support/effectTimeout";
import { encodeForContent } from "@/support/emojiEncoding";
import { timesMap } from "@/support/timeMap";

export type AnimationPath = {
  startX: number;
  startY: number;
  offset: number;
  count: number;
  path: string;
  blockType: BlockType;
};

const createBlock = (
  shape: string,
  color: string,
  outline: boolean
): HTMLDivElement => {
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
  if (outline) {
    div.classList.add(styles.shapeOutline);
  } else {
    div.classList.add(styles.lockNKey);
  }

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
  const sourceColumnRef = useRef<number>(-1);
  const transitionTop = useRef<number | undefined>(undefined);

  const animationRef = useRef<AnimationData | undefined>(undefined);

  useEffect(() => {
    if (selection === undefined) {
      selectionRef.current = [];
    } else {
      sourceColumnRef.current = selection[0];
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
      levelState === previousLevelState.current ||
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
      let targetColumn = levelState.columns.findIndex(
        (c, i) => c.blocks.length > prevLevel.columns[i].blocks.length
      );
      const sourceColumnIndex = sourceColumnRef.current;

      if (targetColumn === -1 && sourceColumnIndex) {
        targetColumn = levelState.columns.findIndex(
          (c, i) =>
            c.blocks.length < prevLevel.columns[i].blocks.length &&
            i !== sourceColumnIndex
        );
      }

      if (
        targetColumn === -1 ||
        !animationRef.current ||
        animationRef.current.sourceBlocks.length === 0
      ) {
        return;
      }

      const animationData = animationRef.current;

      const blocksAdded =
        levelState.columns[targetColumn].blocks.length -
        prevLevel.columns[targetColumn].blocks.length;

      const blockType =
        blocksAdded < 0
          ? prevLevel.columns[sourceColumnIndex].blocks[0].blockType
          : levelState.columns[targetColumn].blocks[0].blockType;

      const blocksDelta =
        levelState.columns.reduce((r, c) => r + c.blocks.length, 0) -
        prevLevel.columns.reduce((r, c) => r + c.blocks.length, 0);

      const blocksMoving = Math.abs(blocksAdded - Math.max(blocksDelta, 0));

      const source = shiftRect(
        animationData.sourceBlocks[
          animationData.sourceBlocks.length - blocksMoving
        ],
        0,
        20
      );
      const target = shiftRect(animationData.targetSpot, 0, -5);

      const stackType = prevLevel.columns[targetColumn].blocks[0]?.blockType;
      if (stackType && isKeyType(blockType) && isLockType(stackType)) {
        animateKeyLockClash(
          animationData.targetColumnTop === animationData.targetSpot.top
            ? target.x + 2
            : target.x,
          animationData.targetColumnTop === animationData.targetSpot.top
            ? animationData.targetColumnTop + 18
            : animationData.targetColumnTop + 60,
          getScale(),
          blockType,
          stackType,
          transitionTime - 20
        );
      }

      const color = getColorMapping(theme)[blockType];
      const shape = getShapeMapping(theme)[blockType];
      const outline = !isKeyType(blockType) && !isLockType(blockType);

      animateBlocksByTranslate(
        source,
        target,
        animationData,
        blocksMoving,
        shape,
        color,
        getScale(),
        transitionTime - 20,
        outline
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
  transitionTime: number,
  outline: boolean
) =>
  timesMap(blocksAdded, (i) => {
    const start = shiftRect(source, 0, -40 * i);
    const end = shiftRect(target, 0, -40 * (blocksAdded - 1 - i));

    const div = createBlock(shape, color, outline);
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

const animateKeyLockClash = (
  x: number,
  y: number,
  scale: number,
  _key: BlockType,
  lock: BlockType,
  delay: number
) => {
  // const keyData = keys.find((k) => k.name === key);
  // if (keyData) {
  //   const keyBlock = createBlock(keyData?.symbol, keyData?.color, false);
  //   keyBlock.style.setProperty("top", `${y}px`);
  //   keyBlock.style.setProperty("scale", `${scale}`);
  //   keyBlock.style.setProperty("left", `${x}px`);
  //   keyBlock.style.setProperty("opacity", "0");
  //   keyBlock.classList.add("absolute");
  //   document.body.appendChild(keyBlock);
  //   const frames: Keyframe[] = [
  //     { transform: `translate(0px, 0px)`, opacity: 1 },
  //     { transform: `translate(-10px, -10px)`, opacity: 1 },
  //     { transform: `translate(0px, -40px)`, opacity: 1, scale: 1.2 },
  //     { transform: `translate(0px, 0px)`, opacity: 0, scale: 1 }
  //   ];
  //   keyBlock.animate(frames, {
  //     duration: 300,
  //     delay: delay,
  //     fill: "forwards",
  //     easing: "ease-in-out",
  //     iterations: 1
  //   }).onfinish = () => {
  //     keyBlock.remove();
  //   };
  // }
  const lockData = locks.find((k) => k.name === lock);
  if (lockData) {
    const lockBlock = createBlock(lockData?.symbol, lockData?.color, false);
    lockBlock.style.setProperty("top", `${y}px`);
    lockBlock.style.setProperty("scale", `${scale}`);
    lockBlock.style.setProperty("left", `${x}px`);
    lockBlock.style.setProperty("opacity", "0");
    lockBlock.classList.add("absolute");
    document.body.appendChild(lockBlock);
    const frames: Keyframe[] = [
      { transform: `translate(0px, 0px)`, opacity: 1 },
      { transform: `translate(0px, 0px)`, opacity: 0, scale: 2 }
    ];
    lockBlock.animate(frames, {
      duration: 300,
      delay: delay,
      fill: "forwards",
      easing: "ease-in-out",
      iterations: 1
    }).onfinish = () => {
      lockBlock.remove();
    };
  }
};
