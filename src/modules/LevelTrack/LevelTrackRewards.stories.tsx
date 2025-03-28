import type { Meta, StoryObj } from "@storybook/react";

import { LEVEL_SCALE } from "@/game/level-settings/levelSettings";
import { getUnlockableLevelTypes } from "@/game/level-types";
import { timesMap } from "@/support/timeMap";

import { DIFFICULTIES, DIFFICULTY_LEVELS } from "../GameModi/constants";

import { LevelNode } from "./LevelNode";
import { LevelTypeIcon } from "./LevelTypeIcon";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta = {
  title: "BlockSort/Rewards",
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered"
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"]
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
};

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Rewards: Story = {
  args: {},
  render: () => {
    return (
      <div>
        <h1 className="text-xl font-bold">Rewards</h1>
        <p>Here is where the rewards will be displayed</p>

        <h2 className="mt-2 font-bold">Difficulty levels</h2>
        <ol>
          {LEVEL_SCALE.map((difficulty, index) => (
            <li key={index}>
              {difficulty + 1}: {DIFFICULTIES[index].name}
            </li>
          ))}
        </ol>
        <h2 className="mt-2 font-bold">Zen Difficulty levels</h2>
        <ol>
          {DIFFICULTY_LEVELS.map((difficulty, index) => (
            <li key={index}>
              {difficulty.unlocksAtLevel}: {difficulty.name}
            </li>
          ))}
        </ol>
        <h2 className="mt-2 font-bold">Zen level types</h2>
        <ol>
          {getUnlockableLevelTypes().map((levelType, index) => (
            <li key={index}>
              {levelType.unlocksAtLevel}: {levelType.name}
            </li>
          ))}
        </ol>
      </div>
    );
  }
};

export const LevelTypesOverview: Story = {
  args: {
    theme: "default"
  },
  argTypes: {
    theme: {
      options: ["default", "halloween", "winter", "spring", "summer"],
      control: "select"
    }
  },
  render: ({ theme }) => {
    return (
      <div>
        <h1 className="mb-2 text-xl font-bold">Level Track</h1>
        <div className="m-4 grid grid-cols-8 gap-4 pb-32">
          {timesMap(300, (index) => (
            <LevelNode key={index} levelNr={index} theme={theme}>
              <LevelTypeIcon levelNr={index} theme={theme} />
            </LevelNode>
          ))}
        </div>
      </div>
    );
  }
};
