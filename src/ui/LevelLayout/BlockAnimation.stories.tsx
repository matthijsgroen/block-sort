import { Suspense, use, useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { levelSeeds } from "@/data/levelSeeds";
import { moveBlocks, selectFromColumn } from "@/game/actions";
import { generatePlayableLevel } from "@/game/level-creation/tactics";
import { LevelState } from "@/game/types";
import { levelProducers } from "@/modules/SeedGenerator/producers";
import { settingsHash } from "@/support/hash";
import { mulberry32 } from "@/support/random";

import { Loading } from "../Loading/Loading";

import { BLOCK_ANIMATION_TIME, LevelLayout } from "./LevelLayout";

type CustomArgs = {
  levelType: string;
  difficulty: number;
};

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<CustomArgs> = {
  title: "BlockSort/LevelLayout",
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered"
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    levelType: {
      options: levelProducers.map((p) => p.name),
      control: { type: "select" }
    },
    difficulty: {
      control: {
        type: "number",
        min: 1,
        max: 11
      }
    }
  },
  args: {
    difficulty: 1,
    levelType: "normal"
  }
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
    setLevelState(state);
    setItem(0);
    setSelection(undefined);
  }, [level]);

  useEffect(() => {
    const selectTimeoutId = setTimeout(() => {
      const move = state.moves[item];
      if (move) {
        const result = selectFromColumn(levelState, move.from);
        setSelection([move.from, result.length]);
      }
    }, 100 + BLOCK_ANIMATION_TIME);

    const moveTimeoutId = setTimeout(() => {
      const move = state.moves[item];
      if (move) {
        setLevelState((state) => moveBlocks(state, move));
        setSelection(undefined);
        setItem((item) => item + 1);
      }
    }, 300 + BLOCK_ANIMATION_TIME);

    return () => {
      clearTimeout(selectTimeoutId);
      clearTimeout(moveTimeoutId);
    };
  }, [state, item]);

  return (
    <div className="flex w-full min-w-96 flex-col">
      <h1 className="mb-3 text-center font-mono text-xl text-white">
        Moves: {state.moves.length}
      </h1>
      <LevelLayout
        started={true}
        levelState={levelState}
        animateBlocks={true}
        selection={selection}
      />
    </div>
  );
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const BlockAnimation: Story = {
  args: {},
  render: (args) => {
    const seeder =
      levelProducers.find((p) => p.name === args.levelType) ??
      levelProducers[0];

    const levelSettings = seeder.producer(
      Math.min(Math.max(args.difficulty, 1), 12)
    );
    const hash = settingsHash(levelSettings);

    const seeds = levelSeeds[hash] ?? [];
    const preSeed = seeds[0]?.[0];
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
