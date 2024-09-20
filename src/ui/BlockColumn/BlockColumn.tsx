import { useEffect, useState } from "react";
import clsx from "clsx";

import { shapeMapping } from "@/game/blocks";
import { Column } from "@/game/types";
import { rowSpans } from "@/support/grid";
import { timesMap } from "@/support/timeMap";

import { Block } from "../Block/Block";
import { colorMap } from "../Block/colormap";
import { Tray } from "../Tray/Tray";

import styles from "./BlockColumn.module.css";

type Props = {
  column: Column;
  amountSelected?: number;
  started?: boolean;
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
      }, 100);
      return () => clearInterval(clear);
    }
  }, [locked]);

  return (
    <div className={`${rowSpans[column.columnSize]} justify-self-center`}>
      <div
        className={clsx("border border-transparent box-content pb-6", {
          "contain-paint": locked,
          "rounded-b-md": column.type === "buffer",
          "rounded-md border-t-black/60": column.type === "placement",
        })}
      >
        <div
          className={clsx(
            "w-block box-content cursor-pointer flex flex-col-reverse",
            {
              [styles.buffer]: column.type === "buffer",
              "bg-black/20 border border-black/60 border-t-0 rounded-md shadow-inner":
                column.type === "placement",
            }
          )}
          onPointerDown={onClick}
        >
          <Tray locked={blocksLocked > 0} />
          {column.blocks.map((_b, p, l) => {
            const index = l.length - 1 - p;
            const block = l[index];
            const isSelected = index < amountSelected;
            return (
              <Block
                key={column.columnSize - column.blocks.length + index}
                locked={p <= blocksLocked - 1}
                moved={started}
                shadow={column.type === "placement" || isSelected}
                revealed={block.revealed}
                color={colorMap[block.color]}
                shape={block.revealed ? shapeMapping[block.color] : undefined}
                selected={isSelected}
                onDrop={onDrop}
                onPickUp={onPickUp}
                onLock={onLock}
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
