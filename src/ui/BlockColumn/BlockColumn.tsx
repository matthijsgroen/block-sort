import { useEffect, useState } from "react";
import clsx from "clsx";

import { Block } from "@/ui/Block/Block";
import { Tray } from "@/ui/Tray/Tray";

import { BlockTheme, getColorMapping, getShapeMapping } from "@/game/themes";
import { Column } from "@/game/types";
import { rowSpans } from "@/support/grid";
import { timesMap } from "@/support/timeMap";

import styles from "./BlockColumn.module.css";

type Props = {
  column: Column;
  amountSelected?: number;
  amountSuggested?: number;
  suggested?: boolean;
  started?: boolean;
  theme?: BlockTheme;
  hideFormat?: "glass" | "present";
  onClick?: VoidFunction;
  onPickUp?: VoidFunction;
  onDrop?: VoidFunction;
  onLock?: VoidFunction;
};

export const BlockColumn: React.FC<Props> = ({
  column,
  onClick,
  onDrop,
  onLock,
  onPickUp,
  theme = "default",
  hideFormat = "glass",
  started = true,
  suggested = false,
  amountSelected = 0,
  amountSuggested = 0,
}) => {
  const [locked, setLocked] = useState(column.locked);
  const [blocksLocked, setBlocksLocked] = useState(-1);

  useEffect(() => {
    if (!column.locked) {
      setLocked(column.locked);
      setBlocksLocked(-1);
    }
    if (!locked && column.locked) {
      const clear = setTimeout(() => {
        setLocked(column.locked);
      }, 200);
      return () => clearTimeout(clear);
    }
  }, [locked, column.locked]);

  useEffect(() => {
    if (locked) {
      const clear = setInterval(() => {
        setBlocksLocked((a) => {
          if (blocksLocked > column.columnSize + 1) {
            clearInterval(clear);
          }
          return a + 1;
        });
      }, 50);
      return () => clearInterval(clear);
    }
  }, [locked]);

  const activeShapeMap = getShapeMapping(theme);
  const activeColorMap = getColorMapping(theme);

  return (
    <div className={`${rowSpans[column.columnSize + 1]} justify-self-center`}>
      <div
        className={clsx("box-content border border-transparent pb-6", {
          "contain-paint": locked,
          "rounded-b-md": column.type === "buffer",
          "rounded-md border-t-black/60": column.type === "placement",
        })}
      >
        {suggested && (
          <div className="pointer-events-none absolute w-block translate-y-1 animate-pulse bg-green-200 bg-clip-text text-center text-2xl text-transparent opacity-30">
            👇
          </div>
        )}
        <div
          className={clsx(
            "box-content flex w-block cursor-pointer flex-col-reverse",
            {
              [styles.buffer]: column.type === "buffer",
              "rounded-md border border-t-0 border-black/60 bg-black/20 shadow-inner":
                column.type === "placement",
            },
          )}
          onPointerDown={onClick}
        >
          <Tray locked={blocksLocked > 0} />
          {column.blocks.map((_b, p, l) => {
            const index = l.length - 1 - p;
            const block = l[index];
            const isSelected = index < amountSelected;
            const isSuggested = index < amountSuggested;
            return (
              <div key={column.columnSize - column.blocks.length + index}>
                <Block
                  locked={p <= blocksLocked - 1}
                  index={index}
                  moved={started}
                  shadow={column.type === "placement" || isSelected}
                  revealed={block.revealed}
                  color={activeColorMap[block.color]}
                  hideFormat={hideFormat}
                  shape={
                    block.revealed ? activeShapeMap[block.color] : undefined
                  }
                  selected={isSelected}
                  suggested={isSuggested}
                  onDrop={onDrop}
                  onPickUp={onPickUp}
                  onLock={onLock}
                />
              </div>
            );
          })}
          {timesMap(column.columnSize - column.blocks.length, (p, l) =>
            l - p === l && column.limitColor !== undefined ? (
              <div
                key={column.blocks.length + p}
                className={`${p === 0 && column.blocks.length === 0 ? styles.bottom : styles.empty} ${styles.shade}`}
              >
                <div
                  style={{ "--cube-color": activeColorMap[column.limitColor] }}
                  className={`${styles.limit} animate-fadeIn`}
                >
                  {amountSelected === 0 &&
                    activeShapeMap[column.limitColor] && (
                      <>{activeShapeMap[column.limitColor]}&#xFE0F;</>
                    )}
                </div>
              </div>
            ) : (
              <div
                key={column.blocks.length + p}
                className={`${p === 0 && column.blocks.length === 0 ? styles.bottom : styles.empty} ${styles.shade}`}
              ></div>
            ),
          )}
        </div>
      </div>
    </div>
  );
};
