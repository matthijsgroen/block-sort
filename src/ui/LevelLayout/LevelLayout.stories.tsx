import type { Meta, StoryObj } from "@storybook/react";

import {
  generateRandomLevel,
  LevelSettings,
} from "@/game/level-creation/generateRandomLevel";
import { getSettings as getHardSettings } from "@/game/level-settings/hardSettings";
import { getSettings as getNormalSettings } from "@/game/level-settings/normalSettings";
import { getSettings as getSpecial1Settings } from "@/game/level-settings/special1Settings";
import { getSettings as getSpecial2Settings } from "@/game/level-settings/special2Settings";
import { getSettings as getSpecial3Settings } from "@/game/level-settings/special3Settings";
import { getSettings as getSpecial4Settings } from "@/game/level-settings/special4Settings";
import { mulberry32 } from "@/support/random";

import { LevelLayout as LevelLayoutComponent } from "./LevelLayout";

type LevelType =
  | "normal"
  | "hard"
  | "special1"
  | "special2"
  | "special3"
  | "special4";

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
        "hard",
        "special1",
        "special2",
        "special3",
        "special4",
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
  hard: getHardSettings,
  special1: getSpecial1Settings,
  special2: getSpecial2Settings,
  special3: getSpecial3Settings,
  special4: getSpecial4Settings,
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
      <div className="w-full flex flex-col">
        <LevelLayoutComponent started={true} levelState={level} />
      </div>
    );
  },
};
