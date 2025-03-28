import type { Meta, StoryObj } from "@storybook/react";

import { Background } from "./Background";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "BlockSort/Background",
  component: Background,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered"
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  args: {
    levelType: "normal",
    theme: "default",
    layout: "levelTrack",
    musicEnabled: true
  },
  argTypes: {
    levelType: {
      options: ["none", "easy", "hard", "special", "scrambled", "dungeon"],
      control: "select"
    },
    theme: {
      options: ["default", "halloween", "winter", "spring", "summer"],
      control: "select"
    },
    layout: {
      options: ["levelTrack", "zenMode"],
      control: "select"
    }
  },
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  decorators: [
    (Story) => (
      <div
        style={{ height: "calc(100vh - 2rem)", width: "calc(100vw - 2rem)" }}
      >
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof Background>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args

export const Default: Story = {
  args: {}
};
