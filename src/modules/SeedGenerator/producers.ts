import { LEVEL_SCALE } from "@/game/level-settings/levelSettings";
import {
  getNormal2Settings,
  getNormal3Settings,
  getNormal4Settings,
  getNormalSettings
} from "@/game/level-types/normal";
import {
  getSpecial1Settings,
  getSpecial2Settings,
  getSpecial3Settings,
  getSpecial4Settings,
  getSpecial5Settings
} from "@/game/level-types/special";
import { getSpringSettings } from "@/game/level-types/spring";
import { SettingsProducer } from "@/game/types";
import { settingsHash } from "@/support/hash";

import { getHard2Settings, getHardSettings } from "../../game/level-types/hard";

export type Producer = {
  name: string;
  producer: SettingsProducer;
};

export const producers: Producer[] = [
  { name: "Normal1", producer: getNormalSettings },
  { name: "Normal2", producer: getNormal2Settings },
  { name: "Normal3", producer: getNormal3Settings },
  { name: "Normal4", producer: getNormal4Settings },
  { name: "Special1", producer: getSpecial1Settings },
  { name: "Special2", producer: getSpecial2Settings },
  { name: "Special3", producer: getSpecial3Settings },
  { name: "Special4", producer: getSpecial4Settings },
  { name: "Special5", producer: getSpecial5Settings },
  { name: "Hard", producer: getHardSettings },
  { name: "Hard2", producer: getHard2Settings },
  { name: "Spring", producer: getSpringSettings }
];

const scale: number[] = [0, ...LEVEL_SCALE];

export type Seeder = {
  hash: string;
  producer: SettingsProducer;
  difficulty: number;
  name: string;
};

export const levelProducers = producers.flatMap((producer) =>
  scale.reduce<Seeder[]>((acc, _lvl, index) => {
    const settings = producer.producer(index + 1);
    return acc.concat({
      hash: settingsHash(settings),
      name: producer.name,
      producer: producer.producer,
      difficulty: index
    });
  }, [])
);