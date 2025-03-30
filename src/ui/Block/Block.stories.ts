import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { Block } from "./Block";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "BlockSort/Block",
  component: Block,
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
      options: ["glass", "present", "ice"],
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
    shapeColored: false,
    index: 0,
    onDrop: fn(),
    onLock: fn(),
    onPickUp: fn()
  }
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
} satisfies Meta<typeof Block>;

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

export const lock: Story = {
  args: {
    shape: "👻",
    color: "#333333",
    shapeColored: true
  }
};
