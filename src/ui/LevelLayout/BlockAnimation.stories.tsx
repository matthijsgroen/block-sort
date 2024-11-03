import { Suspense, use, useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { levelSeeds } from "@/data/levelSeeds";
import { moveBlocks, selectFromColumn } from "@/game/actions";
import { generatePlayableLevel } from "@/game/level-creation/tactics";
import { getHard2Settings, getHardSettings } from "@/game/level-types/hard";
import {
  getNormal2Settings,
  getNormal3Settings,
  getNormal4Settings,
  getNormalSettings
} from "@/game/level-types/normal";
import {
  getSpecial1Settings,
  getSpecial2Settings,
  getSpecial3Settings,
  getSpecial4Settings,
  getSpecial5Settings
} from "@/game/level-types/special";
import { getSpringSettings } from "@/game/level-types/spring";
import { LevelSettings, LevelState } from "@/game/types";
import { hash } from "@/support/hash";
import { mulberry32 } from "@/support/random";

import { Loading } from "../Loading/Loading";

import { BLOCK_ANIMATION_TIME, LevelLayout } from "./LevelLayout";

type LevelType =
  | "normal"
  | "normal2"
  | "normal3"
  | "normal4"
  | "hard"
  | "hard2"
  | "special1"
  | "special2"
  | "special3"
  | "special4"
  | "special5"
  | "spring";

type CustomArgs = {
  levelType: LevelType;
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
      options: [
        "normal",
        "normal2",
        "normal3",
        "normal4",
        "hard",
        "hard2",
        "special1",
        "special2",
        "special3",
        "special4",
        "special5",
        "spring"
      ],
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

const settingProducer: Record<
  LevelType,
  (difficulty: number) => LevelSettings
> = {
  normal: getNormalSettings,
  normal2: getNormal2Settings,
  normal3: getNormal3Settings,
  normal4: getNormal4Settings,
  hard: getHardSettings,
  hard2: getHard2Settings,
  special1: getSpecial1Settings,
  special2: getSpecial2Settings,
  special3: getSpecial3Settings,
  special4: getSpecial4Settings,
  special5: getSpecial5Settings,
  spring: getSpringSettings
};

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
  render: (args) => {
    const producer = settingProducer[args.levelType];
    const levelSettings = producer(Math.min(Math.max(args.difficulty, 1), 12));
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
