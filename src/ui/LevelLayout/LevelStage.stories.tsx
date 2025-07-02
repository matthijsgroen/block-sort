import { useMemo } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { generateRandomLevel } from "@/game/level-creation/generateRandomLevel";
import { getLevelTypesForStorybook } from "@/game/level-types";
import type { BlockTheme } from "@/game/themes";
import { themeSchedule } from "@/game/themes";
import { isMultiStageLevel } from "@/modules/Level/LevelLoader";
import { mulberry32 } from "@/support/random";
import { stringUnionToArray } from "@/support/unionToArray";

import { Background } from "../Background/Background";

import { LevelLayout as LevelLayoutComponent } from "./LevelLayout";

type CustomArgs = {
  theme: BlockTheme;
  levelType: string;
  levelNr: number;
  animation: "none" | "fadeIn" | "fadeOut";
  stage: number;
  random: number;
};

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<CustomArgs> = {
  title: "BlockSort/LevelStage",
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered"
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    theme: {
      options: stringUnionToArray<BlockTheme>()(
        "default",
        "winter",
        "spring",
        "summer",
        "halloween"
      ),
      control: { type: "select" },
      description:
        "The theme of the level, which affects the background and particles."
    },
    levelType: {
      options: getLevelTypesForStorybook().map(
        (p) => `${p.symbol ?? ""} ${p.name}`
      ),
      control: { type: "select" }
    },
    levelNr: {
      control: {
        type: "number",
        min: 1,
        max: 3000
      }
    },
    stage: {
      control: {
        type: "number",
        min: 1,
        max: 3
      }
    },
    animation: {
      options: ["none", "fadeIn", "fadeOut"],
      control: { type: "select" }
    }
  },
  args: {
    levelNr: 1,
    levelType: " normal",
    animation: "none",
    stage: 1,
    random: 0
  }
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
};

export default meta;
type Story = StoryObj<CustomArgs>;

const SEED = 123456789;

const random = mulberry32(SEED);

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const LevelLayout: Story = {
  render: (args) => {
    const level = useMemo(() => {
      const levelType =
        getLevelTypesForStorybook().find(
          (p) => `${p.symbol ?? ""} ${p.name}` === args.levelType
        ) ?? getLevelTypesForStorybook()[0];

      const settings = levelType.getSettings(args.levelNr);

      if (isMultiStageLevel(settings)) {
        const stage = Math.min(args.stage - 1, settings.stages.length - 1);
        return generateRandomLevel(settings.stages[stage].settings, random);
      }

      return generateRandomLevel(settings, random);
    }, [args.levelType, args.levelNr, args.random, args.stage]);

    const levelType =
      getLevelTypesForStorybook().find(
        (p) => `${p.symbol ?? ""} ${p.name}` === args.levelType
      ) ?? getLevelTypesForStorybook()[0];

    const settings = levelType.getSettings(args.levelNr);

    let backgroundClassName = levelType?.backgroundClassName;
    const theme = themeSchedule.find((t) => t.theme === args.theme);
    let particles = levelType?.levelModifiers?.particles ?? theme?.particles;
    let hideFormat = levelType?.levelModifiers?.hideMode;

    if (isMultiStageLevel(settings)) {
      const stage = Math.min(args.stage - 1, settings.stages.length - 1);
      const stageSettings = settings.stages[stage];
      backgroundClassName =
        stageSettings.backgroundClassname ?? backgroundClassName;
      particles = stageSettings.levelModifiers?.particles ?? particles;
      hideFormat = stageSettings.levelModifiers?.hideMode ?? hideFormat;
    }

    return (
      <div className="flex h-dvh w-dvw flex-col">
        <Background
          backgroundClassName={backgroundClassName}
          particles={particles}
          theme={args.theme}
        >
          <h1 className="mb-3 text-center font-mono text-xl text-white">
            Level: {args.levelNr}
          </h1>
          <p className="mb-4 text-white/60">
            These are just random generated, not necessarily solvable
          </p>
          <LevelLayoutComponent
            theme={args.theme}
            started={true}
            levelState={level}
            hideFormat={hideFormat}
            animateColumns={args.animation}
          />
        </Background>
      </div>
    );
  }
};
