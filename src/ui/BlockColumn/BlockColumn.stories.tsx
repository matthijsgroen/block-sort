import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { createBlock } from "@/game/factories";
import { Block, Column } from "@/game/types";

import { BlockColumn } from "./BlockColumn";

type PagePropsAndCustomArgs = React.ComponentProps<typeof BlockColumn> & {
  type: Column["type"];
  columnSize: number;
  amountBlocks: number;
  locked: boolean;
};

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<PagePropsAndCustomArgs> = {
  title: "BlockSort/BlockColumn",
  component: BlockColumn,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    type: {
      options: ["placement", "buffer"],
      control: { type: "radio" },
    },
    columnSize: {
      control: { type: "number" },
    },
    column: {
      table: { disable: true },
    },
  },
  args: {
    amountSelected: 0,
    amountBlocks: 0,
    type: "placement",
    columnSize: 1,
    started: true,
    locked: false,
    column: {
      type: "placement",
      columnSize: 1,
      locked: false,
      blocks: [],
    },
    onDrop: fn(),
    onLock: fn(),
    onPickUp: fn(),
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
};

export default meta;
type Story = StoryObj<typeof meta>;

const columnSettings = (
  type: Column["type"],
  columnSize = 1,
  locked = false,
  amountBlocks = 0
): Column => {
  return {
    type,
    columnSize,
    locked,
    blocks: Array(Math.max(Math.min(amountBlocks, columnSize), 0))
      .fill(0)
      .map<Block>(() => createBlock("aqua")),
  };
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const SmallPlacementColumn: Story = {
  args: {},
  render: (args) => {
    const { type, columnSize, locked, amountBlocks } = args;
    const column = columnSettings(type, columnSize, locked, amountBlocks);

    return <BlockColumn {...args} column={column} />;
  },
};
