import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { createBlock } from "@/game/factories";
import type { Block, Column } from "@/game/types";

import { BlockColumn } from "./BlockColumn";

type BlockColumnPropsAndCustomArgs = React.ComponentProps<
  typeof BlockColumn
> & {
  type: Column["type"];
  columnSize: number;
  amountBlocks: number;
  locked: boolean;
  limited: boolean;
  amountHidden: number;
};

const columnSettings = (
  type: Column["type"],
  columnSize = 1,
  locked = false,
  limited = false,
  amountBlocks = 0,
  amountHidden = 0
): Column => {
  return {
    type,
    columnSize,
    locked,
    limitColor: limited ? "aqua" : undefined,
    blocks: Array(Math.max(Math.min(amountBlocks, columnSize), 0))
      .fill(0)
      .map<Block>((_, index, l) =>
        createBlock("aqua", l.length - index - 1 < amountHidden)
      )
  };
};

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<BlockColumnPropsAndCustomArgs> = {
  title: "BlockSort/BlockColumn",
  component: BlockColumn,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered"
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    type: {
      options: ["placement", "buffer", "inventory"],
      control: { type: "radio" }
    },
    hideFormat: {
      options: ["glass", "present", "ice"],
      control: { type: "radio" }
    },
    animation: {
      options: ["none", "fadeIn", "fadeOut"],
      control: { type: "select" }
    },
    columnSize: {
      control: { type: "number" }
    },
    column: {
      table: { disable: true }
    }
  },
  args: {
    amountSuggested: 0,
    amountSelected: 0,
    amountBlocks: 0,
    amountHidden: 0,
    suggested: false,
    type: "placement",
    columnSize: 1,
    started: true,
    locked: false,
    limited: false,
    blocked: false,
    column: {
      type: "placement",
      columnSize: 1,
      locked: false,
      blocks: []
    },
    onDrop: fn(),
    onLock: fn(),
    onPickUp: fn(),
    onPointerDown: fn(),
    onPointerUp: fn()
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  render: (args) => {
    const { type, columnSize, locked, amountBlocks, limited, amountHidden } =
      args;
    const column = columnSettings(
      type,
      columnSize,
      locked,
      limited,
      amountBlocks,
      amountHidden
    );

    return <BlockColumn {...args} column={column} />;
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const SmallPlacementColumn: Story = {
  args: {
    columnSize: 4,
    amountBlocks: 2
  }
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const SmallBufferColumn: Story = {
  args: {
    type: "buffer",
    columnSize: 4,
    amountBlocks: 2
  }
};

export const LockedColumn: Story = {
  args: {
    type: "placement",
    columnSize: 4,
    amountBlocks: 4,
    locked: true
  }
};

export const HiddenColumn: Story = {
  args: {
    type: "placement",
    columnSize: 4,
    amountBlocks: 3,
    amountHidden: 2
  }
};

export const LimitedColumn: Story = {
  args: {
    type: "placement",
    columnSize: 4,
    amountBlocks: 2,
    limited: true
  }
};

export const LimitedColumnSelection: Story = {
  args: {
    type: "placement",
    columnSize: 4,
    amountBlocks: 2,
    amountSelected: 1,
    limited: true
  }
};

export const ColumnBlockSuggestion: Story = {
  args: {
    type: "placement",
    columnSize: 4,
    amountBlocks: 3,
    amountSuggested: 2
  }
};

export const ColumnSuggestion: Story = {
  args: {
    type: "placement",
    columnSize: 4,
    amountBlocks: 3,
    suggested: true
  }
};
