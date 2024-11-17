import type { Meta, StoryObj } from "@storybook/react";

import { StartAnimation } from "./StartAnimation";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof StartAnimation> = {
  title: "BlockSort/StartAnimation",
  component: StartAnimation,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered"
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {},
  args: {
    message: "Hello, World!"
  },
  render: (args) => {
    return (
      <div style={{ width: "100vw", height: "100vh" }}>
        <StartAnimation {...args} />
      </div>
    );
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Special: Story = {
  args: {
    color: "#ff00ff",
    shapeColor: "#ff00ff",
    message: "Special",
    shape: "⭐️"
  }
};

export const Hard: Story = {
  args: {
    color: "#ff8000",
    message: "Hard",
    shape: "️🔥"
  }
};
