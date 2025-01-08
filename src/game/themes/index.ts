import { levelModifiers } from "@/game/level-types/types";
import { filterInRange, RangedItem } from "@/support/schedule";

import { BlockColor } from "../types";

import {
  colorMap as colorMapDaily,
  generateColorMap,
  generateShapeMap,
  shapeMap as shapeMapDaily
} from "./daily";
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
  | "summer"
  | "daily";

type Occasion = {
  date: Date;
  name: string;
  symbol: string;
  mainColor: string;
};

const occasions: Occasion[] = [
  {
    name: "Valentine",
    date: new Date("2022-02-14"),
    symbol: "💖",
    mainColor: "#A00000"
  }
];

export const getShapeMapping = (
  theme: BlockTheme,
  date?: Date
): Record<BlockColor, string> => {
  const mapping: Record<BlockTheme, Record<BlockColor, string>> = {
    default: shapeMap,
    halloween: shapeMapFall,
    winter: shapeMapWinter,
    spring: shapeMapSpring,
    summer: shapeMapSummer,
    daily: shapeMapDaily
  };
  if (theme === "daily" && date) {
    const occasion = occasions.find((occasion) => {
      return (
        occasion.date.getMonth() === date.getMonth() &&
        occasion.date.getDate() === date.getDate()
      );
    });

    if (occasion) {
      return generateShapeMap(occasion.symbol);
    }
  }
  return mapping[theme];
};

export const getColorMapping = (
  theme: BlockTheme,
  date?: Date
): Record<BlockColor, string> => {
  const mapping: Record<BlockTheme, Record<BlockColor, string>> = {
    default: colorMap,
    halloween: colorMapFall,
    winter: colorMapWinter,
    spring: colorMapSpring,
    summer: colorMapSummer,
    daily: colorMapDaily
  };
  if (theme === "daily" && date) {
    const occasion = occasions.find((occasion) => {
      return (
        occasion.date.getMonth() === date.getMonth() &&
        occasion.date.getDate() === date.getDate()
      );
    });

    if (occasion) {
      return generateColorMap(occasion.mainColor);
    }
  }

  return mapping[theme];
};

export type ThemeSchedule = RangedItem & {
  name: string;
  theme: BlockTheme;
  levelModifiers?: (RangedItem & {
    modifiers: levelModifiers;
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
        begin: { month: 10, day: 15 },
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
        modifiers: { packageMode: true },
        begin: { month: 12, day: 14 },
        end: { month: 1, day: 1 }
      }
    ]
  },
  {
    begin: { month: 3, day: 15 },
    end: { month: 4, day: 20 },
    name: "Spring",
    theme: "spring"
  },
  {
    begin: { month: 7, day: 15 },
    end: { month: 8, day: 20 },
    name: "Summer",
    theme: "summer"
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
