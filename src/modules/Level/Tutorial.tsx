import { Block } from "@/ui/Block/Block";

import { BlockTheme, getColorMapping, getShapeMapping } from "@/game/themes";
import { LevelState, Move } from "@/game/types";

type Props = {
  selection?: [column: number, amount: number];
  levelState: LevelState;
  activeTheme: BlockTheme;
  levelMoves: Move[];
};

export const Tutorial: React.FC<Props> = ({
  selection,
  levelState,
  activeTheme,
  levelMoves
}) => (
  <div className="mb-8 h-20 w-full max-w-[600px] px-4 text-center text-lg text-orange-200">
    {levelMoves.length === 0 && !selection && (
      <>
        <p>Move the blocks to the right column.</p>
        <p>Click on a column to select the top blocks of the same kind.</p>
      </>
    )}
    {levelMoves.length === 0 && selection && (
      <p>Click on the right column to move the selected blocks there.</p>
    )}
    {levelMoves.length === 1 && !selection && (
      <p>
        Well done! Now select the other{" "}
        <span className="inline-block scale-75 text-sm">
          <Block
            moved={true}
            color={
              getColorMapping(activeTheme)[
                levelState.columns[2].blocks[0].color
              ]
            }
            shape={
              getShapeMapping(activeTheme)[
                levelState.columns[2].blocks[0].color
              ]
            }
          />
        </span>{" "}
        to stack on the right column.
      </p>
    )}
    {levelMoves.length === 1 &&
      selection &&
      selection[0] !== 2 &&
      levelMoves[0].from !== selection[0] && (
        <p>Nice, now select the right column again.</p>
      )}
    {levelMoves.length === 1 &&
      selection &&
      (selection[0] === 2 || levelMoves[0].from === selection[0]) && (
        <p>Oops, you need to select from another column.</p>
      )}
    {levelMoves.length == 2 && (
      <>
        <p>Nice!</p>
        <p>Can you complete this level?</p>
      </>
    )}
  </div>
);