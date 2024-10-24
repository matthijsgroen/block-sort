import { useEffect, useRef, useState } from "react";

import { BlockColor, LevelState } from "@/game/types";
import { createAnimationPath } from "@/support/createAnimationPath";
import { effectTimeout } from "@/support/effectTimeout";

export type AnimationPath = {
  startX: number;
  startY: number;
  path: string;
  color: BlockColor;
};

export const useBlockAnimation = (
  levelState: LevelState,
  selection: [columnNr: number, amount: number] | undefined,
  { disabled = false, transitionTime = 400 } = {}
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

  const animate = (targetTop: number, targetRect: DOMRect) => {
    animationRef.current = {
      sourceBlocks: selectionRef.current.slice(),
      targetSpot: targetRect,
      sourceColumnTop: transitionTop.current ?? 0,
      targetColumnTop: targetTop
    };

    selectionRef.current = [];
    transitionTop.current = undefined;
  };

  const pickup = (top: number, rect: DOMRect) => {
    selectionRef.current.push(rect);
    transitionTop.current = top;
  };

  const [animationPaths, setAnimationPaths] = useState<AnimationPath[]>([]);
  const previousLevelState = useRef<LevelState>(undefined);

  useEffect(() => {
    if (
      !previousLevelState.current ||
      levelState == previousLevelState.current
    ) {
      previousLevelState.current = levelState;
      return;
    }

    const prevLevel = previousLevelState.current;
    previousLevelState.current = levelState;

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

    const newAnimationPaths = Array.from({ length: blocksAdded }).map(
      (_, i) => {
        const source = animationData.sourceBlocks[i];
        const target = new DOMRect(
          animationData.targetSpot.x,
          animationData.targetSpot.y - 80 + i * 30,
          animationData.targetSpot.width,
          animationData.targetSpot.height
        );
        const sourceColumnTop = animationData.sourceColumnTop - 60;
        const targetColumnTop = animationData.targetColumnTop - 60;

        return {
          startX: source.x,
          startY: source.top + 20,
          path: createAnimationPath(
            source,
            target,
            sourceColumnTop,
            targetColumnTop
          ),
          color: blockColor
        };
      }
    );
    setAnimationPaths(newAnimationPaths);

    return effectTimeout(() => {
      setAnimationPaths([]);
    }, transitionTime);
  }, [levelState]);

  if (disabled) {
    return { animate: () => {}, pickup: () => {}, animationPaths: [] };
  }

  return { animate, pickup, animationPaths };
};
