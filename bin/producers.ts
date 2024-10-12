import {
  getHard2Settings,
  getHardSettings,
} from "../src/game/level-types/hard";
import {
  getNormal2Settings,
  getNormal3Settings,
  getNormalSettings,
} from "../src/game/level-types/normal";
import {
  getSpecial1Settings,
  getSpecial2Settings,
  getSpecial3Settings,
  getSpecial4Settings,
  getSpecial5Settings,
} from "../src/game/level-types/special";
import { SettingsProducer } from "../src/game/types";

export type Producer = {
  name: string;
  producer: SettingsProducer;
};

export const producers: Producer[] = [
  { name: "Normal1", producer: getNormalSettings },
  { name: "Normal2", producer: getNormal2Settings },
  { name: "Normal3", producer: getNormal3Settings },
  { name: "Special1", producer: getSpecial1Settings },
  { name: "Special2", producer: getSpecial2Settings },
  { name: "Special3", producer: getSpecial3Settings },
  { name: "Special4", producer: getSpecial4Settings },
  { name: "Special5", producer: getSpecial5Settings },
  { name: "Hard", producer: getHardSettings },
  { name: "Hard2", producer: getHard2Settings },
];
