import { Dispatch, useEffect, useRef, useState } from "react";

import { BlockTheme, getColorMapping, getShapeMapping } from "@/game/themes";
import { BlockColor, LevelState } from "@/game/types";
import { createAnimationPath } from "@/support/createAnimationPath";
import { effectTimeout } from "@/support/effectTimeout";
import { colSizes } from "@/support/grid";
import { usePrevious } from "@/support/usePrevious";
import { useScreenUpdate } from "@/support/useScreenUpdate";

import { Block } from "../Block/Block";
import { BlockColumn } from "../BlockColumn/BlockColumn";

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

  /** Begin motion animation code */
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

  const [animationPaths, setAnimationPaths] = useState<
    {
      startX: number;
      startY: number;
      path: string;
      color: BlockColor;
    }[]
  >([]);
  const previousLevelState = usePrevious(levelState);

  useEffect(() => {
    if (previousLevelState && levelState !== previousLevelState) {
      const addedColumn = levelState.columns.findIndex(
        (c, i) => c.blocks.length > previousLevelState.columns[i].blocks.length
      );
      if (
        addedColumn !== -1 &&
        animationRef.current &&
        animationRef.current.sourceBlocks.length > 0
      ) {
        const animationData = animationRef.current;
        const blocksAdded =
          levelState.columns[addedColumn].blocks.length -
          previousLevelState.columns[addedColumn].blocks.length;
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
            const sourceColumnTop = animationData.sourceColumnTop - 50;
            const targetColumnTop = animationData.targetColumnTop - 50;

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
        }, 300);
      }
    }
  }, [levelState]);

  /** End motion animation code */

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
      {animationPaths.length > 0 && (
        <>
          {animationPaths.map((p, i) => (
            <div
              key={i}
              style={{
                top: p.startY,
                left: p.startX,
                offsetPath: `path('${p.path}')`,
                offsetRotate: "0deg",
                offsetDistance: "1%"
              }}
              className="animate-blockMove absolute"
            >
              <Block
                color={getColorMapping(theme)[p.color]}
                shape={getShapeMapping(theme)[p.color]}
                moved
                shadow={false}
                blur
              />
            </div>
          ))}
        </>
      )}
    </>
  );
};
