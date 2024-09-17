import { useEffect, useState } from "react";

import { shapeMapping } from "@/game/blocks";
import { Column } from "@/game/types";
import { rowSpans } from "@/support/grid";
import { timesMap } from "@/support/timeMap";

import { Block, colorMap } from "./Block";

import styles from "./BlockColumn.module.css";

type Props = {
  column: Column;
  amountSelected?: number;
  started?: boolean;
  onClick?: VoidFunction;
};

export const BlockColumn: React.FC<Props> = ({
  column,
  onClick,
  started = true,
  amountSelected = 0,
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
      }, 400);
      return () => clearTimeout(clear);
    }
  }, [locked, column.locked]);

  useEffect(() => {
    if (locked) {
      const clear = setInterval(() => {
        setBlocksLocked((a) => {
          if (blocksLocked > column.columnSize) {
            clearInterval(clear);
          }
          return a + 1;
        });
      }, 100);
      return () => clearInterval(clear);
    }
  }, [locked]);

  return (
    <div className={`${rowSpans[column.columnSize]} justify-self-center`}>
      <div
        className={`border-2 border-transparent border-t-block-brown ${locked ? "contain-paint" : ""} ${column.type === "buffer" ? "rounded-b-md" : "rounded-md"} box-content pb-6`}
      >
        <div
          className={`border-2 border-block-brown w-block box-content bg-black/20 cursor-pointer flex flex-col-reverse ${
            column.type === "buffer"
              ? "border-t-0 rounded-b-md"
              : "border-t-0 rounded-md shadow-inner"
          } `}
          // onTouchStart={onColumnClick(i)}
          onTouchStart={onClick}
        >
          {column.blocks.map((_b, p, l) => {
            const index = l.length - 1 - p;
            const block = l[index];
            const isSelected = index < amountSelected;
            return (
              <Block
                key={column.columnSize - column.blocks.length + index}
                locked={p <= blocksLocked}
                moved={started}
                revealed={block.revealed}
                color={block.color}
                selected={isSelected}
              />
            );
          })}
          {timesMap(column.columnSize - column.blocks.length, (p, l) =>
            l - p === l && column.limitColor !== undefined ? (
              <div
                key={column.blocks.length + p}
                className={`${p === 0 && column.blocks.length === 0 ? styles.bottom : styles.empty} ${styles.shade}`}
              >
                <div
                  style={{ "--cube-color": colorMap[column.limitColor] }}
                  className={`${styles.limit} animate-fadeIn`}
                >
                  {shapeMapping[column.limitColor]}
                </div>
              </div>
            ) : (
              <div
                key={column.blocks.length + p}
                className={`${p === 0 && column.blocks.length === 0 ? styles.bottom : styles.empty} ${styles.shade}`}
              ></div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
