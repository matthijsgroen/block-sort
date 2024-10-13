import type { Meta, StoryObj } from "@storybook/react";

import { generateRandomLevel } from "@/game/level-creation/generateRandomLevel";
import {
  getHard2Settings,
  getHardSettings as getHardSettings,
} from "@/game/level-types/hard";
import {
  getNormal2Settings,
  getNormal3Settings,
  getNormalSettings,
} from "@/game/level-types/normal";
import {
  getSpecial1Settings,
  getSpecial2Settings,
  getSpecial3Settings,
  getSpecial4Settings,
  getSpecial5Settings,
} from "@/game/level-types/special";
import { LevelSettings } from "@/game/types";
import { mulberry32 } from "@/support/random";

import { LevelLayout as LevelLayoutComponent } from "./LevelLayout";

type LevelType =
  | "normal"
  | "normal2"
  | "normal3"
  | "hard"
  | "hard2"
  | "special1"
  | "special2"
  | "special3"
  | "special4"
  | "special5";

type CustomArgs = {
  levelType: LevelType;
  difficulty: number;
};

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<CustomArgs> = {
  title: "BlockSort/LevelLayout",
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
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
        "hard",
        "hard2",
        "special1",
        "special2",
        "special3",
        "special4",
        "special5",
      ],
      control: { type: "select" },
    },
    difficulty: {
      control: { type: "number" },
    },
  },
  args: {
    difficulty: 1,
    levelType: "normal",
  },
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
  hard: getHardSettings,
  hard2: getHard2Settings,
  special1: getSpecial1Settings,
  special2: getSpecial2Settings,
  special3: getSpecial3Settings,
  special4: getSpecial4Settings,
  special5: getSpecial5Settings,
};

const SEED = 123456789;

const random = mulberry32(SEED);

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const LevelLayout: Story = {
  args: {},
  render: (args) => {
    const producer = settingProducer[args.levelType];
    const settings = producer(Math.min(Math.max(args.difficulty, 1), 11));
    const level = generateRandomLevel(settings, random);
    return (
      <div className="flex w-full flex-col">
        <LevelLayoutComponent started={true} levelState={level} />
      </div>
    );
  },
};
