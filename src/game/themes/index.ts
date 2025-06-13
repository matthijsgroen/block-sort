import { filterInRange, type RangedItem } from "@/support/schedule";

import type { BlockColor, BlockType } from "../blocks";
import { type Key, keys, type Lock, locks } from "../level-creation/lock-n-key";
import type { LevelModifiers } from "../types";

import { colorMap, shapeMap } from "./default";
import { colorMap as colorMapFall, shapeMap as shapeMapFall } from "./fall";
import {
  colorMap as colorMapSpring,
  shapeMap as shapeMapSpring
} from "./spring";
import {
  colorMap as colorMapSummer,
  shapeMap as shapeMapSummer
} from "./summer";
import {
  colorMap as colorMapWinter,
  shapeMap as shapeMapWinter
} from "./winter";

export type BlockTheme =
  | "default"
  | "halloween"
  | "winter"
  | "spring"
  | "summer";

export const getShapeMapping = (
  theme: BlockTheme
): Record<BlockType, string> => {
  const lockNKeyMapping: Record<Lock | Key, string> = [
    ...locks,
    ...keys
  ].reduce(
    (r, { name, symbol }) => ({ ...r, [name]: symbol }),
    {} as Record<Lock | Key, string>
  );

  const mapping: Record<BlockTheme, Record<BlockColor, string>> = {
    default: shapeMap,
    halloween: shapeMapFall,
    winter: shapeMapWinter,
    spring: shapeMapSpring,
    summer: shapeMapSummer
  };
  return { ...mapping[theme], ...lockNKeyMapping };
};

export const getColorMapping = (
  theme: BlockTheme
): Record<BlockType, string> => {
  const lockNKeyMapping: Record<Lock | Key, string> = [
    ...locks,
    ...keys
  ].reduce(
    (r, { name, color }) => ({ ...r, [name]: color }),
    {} as Record<Lock | Key, string>
  );

  const mapping: Record<BlockTheme, Record<BlockColor, string>> = {
    default: colorMap,
    halloween: colorMapFall,
    winter: colorMapWinter,
    spring: colorMapSpring,
    summer: colorMapSummer
  };
  return { ...mapping[theme], ...lockNKeyMapping };
};

export type ThemeSchedule = RangedItem & {
  name: string;
  theme: BlockTheme;
  levelModifiers?: (RangedItem & {
    modifiers: LevelModifiers;
  })[];
};

export const themeSchedule: ThemeSchedule[] = [
  {
    begin: { month: 10, day: 1 },
    end: { month: 11, day: 4 },
    name: "Fall/Halloween",
    theme: "halloween",
    levelModifiers: [
      {
        modifiers: { ghostMode: true },
        begin: { month: 10, day: 5 },
        end: { month: 11, day: 2 }
      }
    ]
  },
  {
    begin: { month: 12, day: 1 },
    end: { month: 1, day: 6 },
    name: "Winter/Christmas",
    theme: "winter",
    levelModifiers: [
      {
        modifiers: { hideMode: "present", keepRevealed: true },
        begin: { month: 12, day: 14 },
        end: { month: 1, day: 1 }
      }
    ]
  },
  {
    begin: { month: 3, day: 15 },
    end: { month: 5, day: 15 },
    name: "Spring",
    theme: "spring"
  },
  {
    begin: { month: 6, day: 25 },
    end: { month: 8, day: 25 },
    name: "Summer",
    theme: "summer",
    levelModifiers: [
      {
        modifiers: { hideMode: "ice", keepRevealed: false },
        begin: { month: 7, day: 1 },
        end: { month: 8, day: 1 }
      }
    ]
  }
];

export const getActiveTheme = (date: Date) => {
  const activeSchedule = filterInRange(date, themeSchedule)[0];
  return activeSchedule?.theme ?? "default";
};

export const getActiveModifiers = (date: Date) =>
  filterInRange(date, themeSchedule).flatMap((theme) =>
    theme.levelModifiers ? filterInRange(date, theme.levelModifiers) : []
  );
