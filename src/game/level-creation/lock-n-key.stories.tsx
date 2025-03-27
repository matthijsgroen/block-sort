import { Fragment } from "react/jsx-runtime";
import type { Meta, StoryObj } from "@storybook/react";

import { Block } from "@/ui/Block/Block";

import { keys, locks } from "./lock-n-key";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "BlockSort/LocksAndKeys",
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered"
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"]
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
} satisfies Meta<typeof Block>;

export default meta;
type Story = StoryObj<typeof Block>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args

export const lock: Story = {
  render: () => (
    <div className="grid auto-rows-[4rem] grid-cols-[1fr,3rem,3rem] gap-4">
      {locks.map((lock, index) => {
        const key = keys[index];
        return (
          <Fragment key={lock.name}>
            <p className="pt-5 text-right font-bold capitalize">
              {lock.name.split("-")[0]}
            </p>
            <Block
              color={lock.color}
              shape={lock.symbol}
              moved={false}
              shapeColored
            />
            <Block
              color={key.color}
              shape={key.symbol}
              moved={false}
              shapeColored
            />
          </Fragment>
        );
      })}
    </div>
  )
};
