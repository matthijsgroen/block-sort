import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { Block2 } from "./Block2";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "BlockSort/Block2",
  component: Block2,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered"
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    color: { control: "color" },
    hideFormat: {
      options: ["glass", "present"],
      control: { type: "radio" }
    }
  },
  args: {
    shape: "✔️",
    color: "#16a34a",
    hideFormat: "glass",
    moved: true,
    selected: false,
    locked: false,
    revealed: true,
    shadow: true,
    suggested: false,
    index: 0,
    onDrop: fn(),
    onLock: fn(),
    onPickUp: fn()
  }
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
} satisfies Meta<typeof Block2>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const ColorShape: Story = {
  args: {}
};

export const hidden: Story = {
  args: {
    shape: "✔",
    revealed: false
  }
};