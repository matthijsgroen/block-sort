import type { Meta, StoryObj } from "@storybook/react";

import { generateRandomLevel } from "@/game/level-creation/generateRandomLevel";
import { getDailySettings } from "@/game/level-types/daily";
import { mulberry32 } from "@/support/random";
import { fakeDate } from "@/support/schedule";

import { LevelLayout as LevelLayoutComponent } from "../LevelLayout/LevelLayout";

type CustomArgs = {
  theme: string;
};

const occasionDates: [Date, name: string][] = [
  [new Date("2022-02-14"), "valentine"],
  [new Date("2022-12-25"), "christmas"],
  [new Date("2022-10-31"), "halloween"],
  [new Date("2022-01-01"), "newYear"],
  [new Date("2022-04-22"), "earthDay"],
  [new Date("2022-04-01"), "aprilFools"],
  [new Date("2022-03-17"), "stPatricks"]
];

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
      options: ["default", ...occasionDates.map(([, name]) => name)],
      control: { type: "select" }
    }
  },
  args: {
    theme: "valentine"
  }
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
};

export default meta;
type Story = StoryObj<typeof meta>;

const SEED = 123456789;

const random = mulberry32(SEED);

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const DailyTheme: Story = {
  args: {},
  render: (args) => {
    const settings = getDailySettings(11);
    const level = generateRandomLevel(settings, random);
    // fake the date
    const date = occasionDates.find((date) => date[1] === args.theme)?.[0];
    if (date) {
      fakeDate(date);
    }

    return (
      <div className="flex w-full flex-col">
        <LevelLayoutComponent
          started={true}
          levelState={level}
          theme={"daily"}
        />
      </div>
    );
  }
};
