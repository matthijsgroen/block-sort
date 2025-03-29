import { useMemo } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { generateRandomLevel } from "@/game/level-creation/generateRandomLevel";
import { LEVEL_SCALE } from "@/game/level-settings/levelSettings";
import { producers } from "@/modules/SeedGenerator/producers";
import { mulberry32 } from "@/support/random";

import { LevelLayout as LevelLayoutComponent } from "./LevelLayout";

const displayProducers = producers;

type CustomArgs = {
  levelType: string;
  difficulty: number;
  animation: "none" | "fadeIn" | "fadeOut";
  random: number;
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
      options: displayProducers.map((p) => p.name),
      control: { type: "select" }
    },
    difficulty: {
      control: {
        type: "number",
        min: 1,
        max: 11
      }
    },
    animation: {
      options: ["none", "fadeIn", "fadeOut"],
      control: { type: "select" }
    }
  },
  args: {
    difficulty: 1,
    levelType: "normal",
    animation: "none",
    random: 0
  }
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
};

export default meta;
type Story = StoryObj<CustomArgs>;

const SEED = 123456789;

const random = mulberry32(SEED);

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const LevelLayout: Story = {
  render: (args) => {
    const level = useMemo(() => {
      const seeder =
        displayProducers.find((p) => p.name === args.levelType) ??
        displayProducers[0];
      const settings = seeder.producer(
        Math.min(Math.max(args.difficulty, 1), 12)
      );
      return generateRandomLevel(settings, random);
    }, [args.levelType, args.difficulty, args.random]);

    return (
      <div className="flex w-full min-w-96 flex-col">
        <h1 className="mb-3 text-center font-mono text-xl text-white">
          Level: {(LEVEL_SCALE[args.difficulty - 2] ?? 0) + 1}
        </h1>
        <p className="mb-4 text-white/60">
          These are just random generated, not necessarily solvable
        </p>
        <LevelLayoutComponent
          started={true}
          levelState={level}
          animateColumns={args.animation}
        />
      </div>
    );
  }
};
