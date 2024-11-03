import { Suspense, use, useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { levelSeeds } from "@/data/levelSeeds";
import { moveBlocks, selectFromColumn } from "@/game/actions";
import { generatePlayableLevel } from "@/game/level-creation/tactics";
import { LevelState } from "@/game/types";
import { hash } from "@/support/hash";
import { mulberry32 } from "@/support/random";

import { Loading } from "../Loading/Loading";

import { BLOCK_ANIMATION_TIME, LevelLayout } from "./LevelLayout";
import { getNormalSettings } from "@/game/level-types/normal";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta = {
  title: "BlockSort/LevelLayout",
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered"
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {},
  args: {}
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
};

export default meta;
type Story = StoryObj<typeof meta>;

const Loader: React.FC<{ level: Promise<LevelState> }> = ({ level }) => {
  const state = use(level);
  const [levelState, setLevelState] = useState(state);

  const [selection, setSelection] = useState<
    [column: number, amount: number] | undefined
  >(undefined);
  const [item, setItem] = useState<number>(0);

  useEffect(() => {
    const selectTimeoutId = setTimeout(() => {
      const move = state.moves[item];
      if (move) {
        const result = selectFromColumn(levelState, move.from);
        setSelection([move.from, result.length]);
      }
    }, 1000 + BLOCK_ANIMATION_TIME);

    const moveTimeoutId = setTimeout(() => {
      const move = state.moves[item];
      if (move) {
        setLevelState((state) => moveBlocks(state, move.from, move.to));
        setSelection(undefined);
        setItem((item) => item + 1);
      }
    }, 1500 + BLOCK_ANIMATION_TIME);

    return () => {
      clearTimeout(selectTimeoutId);
      clearTimeout(moveTimeoutId);
    };
  }, [state, item]);

  return (
    <LevelLayout
      started={true}
      levelState={levelState}
      animateBlocks={true}
      selection={selection}
    />
  );
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const BlockAnimation: Story = {
  args: {},
  render: () => {
    const levelSettings = getNormalSettings(8);
    const hashVersion = { ...levelSettings };
    delete hashVersion["playMoves"];

    const settingsHash = hash(JSON.stringify(hashVersion)).toString();

    const seeds = levelSeeds[settingsHash] ?? [];
    const preSeed = seeds[0];
    const random = mulberry32(preSeed);
    const level = generatePlayableLevel(levelSettings, random, preSeed);
    return (
      <div className="flex w-full flex-col">
        <Suspense
          fallback={
            <div>
              <Loading />
            </div>
          }
        >
          <Loader level={level} />
        </Suspense>
      </div>
    );
  }
};
