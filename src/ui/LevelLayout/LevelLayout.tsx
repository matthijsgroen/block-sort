import { Dispatch } from "react";

import { LevelState } from "@/game/types";
import { colSizes } from "@/support/grid";

import { BlockColumn } from "../BlockColumn/BlockColumn";

type Props = {
  started: boolean;
  levelState: LevelState;
  selection?: [column: number, amount: number];
  onColumnClick?: Dispatch<number>;
  onPickUp?: VoidFunction;
  onDrop?: VoidFunction;
  onLock?: VoidFunction;
};

const determineColumns = (
  maxColumnHeight: number,
  amountColumns: number
): string => {
  if (maxColumnHeight <= 6 && amountColumns < 6) {
    const gridColumnCount = amountColumns;
    return colSizes[gridColumnCount];
  }
  if (maxColumnHeight <= 6 && amountColumns < 12) {
    const gridColumnCount = Math.ceil(amountColumns / 2);
    return colSizes[gridColumnCount];
  }
  if (maxColumnHeight <= 4 && amountColumns < 16) {
    const gridColumnCount = Math.ceil(amountColumns / 3);
    return colSizes[gridColumnCount];
  }

  return "grid-cols-6";
};

export const LevelLayout: React.FC<Props> = ({
  started,
  levelState,
  selection,
  onColumnClick,
  onDrop,
  onLock,
  onPickUp,
}) => {
  const maxColumnSize = levelState.columns.reduce(
    (r, c) => Math.max(r, c.columnSize),
    0
  );
  const cols = determineColumns(maxColumnSize, levelState.columns.length);
  return (
    <div className="flex-1 flex flex-wrap justify-center p-2">
      <div className="w-full max-w-[600px] content-center">
        <div className={`grid grid-flow-dense ${cols}`}>
          {levelState.columns.map((bar, i) => (
            <BlockColumn
              column={bar}
              key={i}
              onClick={() => onColumnClick?.(i)}
              started={started}
              amountSelected={
                selection && i === selection[0] ? selection[1] : 0
              }
              onLock={onLock}
              onDrop={onDrop}
              onPickUp={onPickUp}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
