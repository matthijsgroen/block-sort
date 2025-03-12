import type { Meta, StoryObj } from "@storybook/react";

import { generateRandomLevel } from "@/game/level-creation/generateRandomLevel";
import { getDailySettings } from "@/game/level-types/daily";
import { getSpecial2Settings } from "@/game/level-types/special";
import type { BlockTheme } from "@/game/themes";
import { mulberry32 } from "@/support/random";

import { LevelLayout as LevelLayoutComponent } from "../LevelLayout/LevelLayout";

type CustomArgs = {
  theme: BlockTheme;
};

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<CustomArgs> = {
  title: "BlockSort/Theme",
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered"
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    theme: {
      options: ["default", "halloween", "winter", "spring", "summer", "daily"],
      control: { type: "select" }
    }
  },
  args: {
    theme: "default"
  }
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
};

export default meta;
type Story = StoryObj<typeof meta>;

const SEED = 123456789;

const random = mulberry32(SEED);

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Theme: Story = {
  args: {},
  render: (args) => {
    const settings =
      args.theme === "daily" ? getDailySettings(11) : getSpecial2Settings(11);
    const level = generateRandomLevel(settings, random);
    return (
      <div className="flex w-full flex-col">
        <LevelLayoutComponent
          started={true}
          levelState={level}
          theme={args.theme}
        />
      </div>
    );
  }
};
