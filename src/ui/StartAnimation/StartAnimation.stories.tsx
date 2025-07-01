import type { Meta, StoryObj } from "@storybook/react-vite";

import { getLevelTypesForStorybook } from "@/game/level-types";

import { StartAnimation } from "./StartAnimation";

type CustomArgs = {
  levelType: string;
};

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<CustomArgs> = {
  title: "BlockSort/StartAnimation",
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered"
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    levelType: {
      options: getLevelTypesForStorybook()
        .filter((p) => p.showIntro)
        .map((p) => `${p.symbol ?? ""} ${p.name}`),
      control: { type: "select" },
      description:
        "The type of level to start the animation for. This affects the message and shape shown."
    }
  },
  args: {
    levelType: "normal"
  },
  render: (args) => {
    const levelType = getLevelTypesForStorybook().find(
      (p) => `${p.symbol ?? ""} ${p.name}` === args.levelType
    );

    const animationProps = {
      color: levelType?.introTextColor ?? "#ffffff",
      shapeColor: levelType?.color,
      message: levelType?.name ?? "Welcome to Block Sorting!",
      shape: levelType?.symbol ?? "🔵",
      delay: 0
    };
    return (
      <div style={{ width: "100vw", height: "100vh" }}>
        <StartAnimation {...animationProps} key={args.levelType} />
      </div>
    );
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const LevelStartAnimation: Story = {};
