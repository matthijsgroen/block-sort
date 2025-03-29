import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { Switch } from "./Switch";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof Switch> = {
  title: "Fields/Switch",
  component: Switch,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered"
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    items: {
      table: { disable: true }
    },
    selected: {
      control: { type: "select" },
      options: ["easy", "medium", "hard"]
    }
  },
  args: {}
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
};

export default meta;
type Story = StoryObj<typeof Switch>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    items: [
      { name: "Easy", value: "easy" },
      { name: "Medium", value: "medium" },
      { name: "Hard", value: "hard" }
    ],
    selected: "easy"
  },
  render: (args) => {
    const [value, setValue] = useState(args.selected);
    return <Switch {...args} selected={value} onSelectionChange={setValue} />;
  }
};
