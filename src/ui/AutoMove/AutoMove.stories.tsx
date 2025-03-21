import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { AutoMove } from "./AutoMove";

import "../../icons.css";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof AutoMove> = {
  title: "BlockSort/AutoMove",
  component: AutoMove,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered"
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    onClick: {
      control: { disable: true }
    }
  },
  args: {
    onClick: fn(),
    autoMoves: 5
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {};
