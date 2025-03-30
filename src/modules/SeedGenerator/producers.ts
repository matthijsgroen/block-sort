import { LEVEL_SCALE } from "@/game/level-settings/levelSettings";
import {
  getDungeonSettings,
  getDungeonSettings2,
  getDungeonSettings3
} from "@/game/level-types/dungeon";
import { getHard2Settings, getHardSettings } from "@/game/level-types/hard";
import {
  getNormal2Settings,
  getNormal3Settings,
  getNormal4Settings,
  getNormal5Settings,
  getNormalSettings
} from "@/game/level-types/normal";
import {
  getSpecial1Settings,
  getSpecial2Settings,
  getSpecial3Settings,
  getSpecial4Settings,
  getSpecial5Settings
} from "@/game/level-types/special";
import {
  getEasySpringSettings,
  getSpringSettings
} from "@/game/level-types/spring";
import type { SettingsProducer } from "@/game/types";
import { settingsHash } from "@/support/hash";

export type Producer = {
  name: string;
  producer: SettingsProducer;
};

export const producers: Producer[] = [
  { name: "Normal1", producer: getNormalSettings },
  { name: "Normal2", producer: getNormal2Settings },
  { name: "Normal3", producer: getNormal3Settings },
  { name: "Normal4", producer: getNormal4Settings },
  { name: "Normal5", producer: getNormal5Settings },
  { name: "Special1", producer: getSpecial1Settings },
  { name: "Special2", producer: getSpecial2Settings },
  { name: "Special3", producer: getSpecial3Settings },
  { name: "Special4", producer: getSpecial4Settings },
  { name: "Special5", producer: getSpecial5Settings },
  { name: "Hard", producer: getHardSettings },
  { name: "Hard2", producer: getHard2Settings },
  { name: "Spring", producer: getSpringSettings },
  { name: "SpringEasy", producer: getEasySpringSettings },
  { name: "Dungeon", producer: getDungeonSettings },
  { name: "Dungeon2", producer: getDungeonSettings2 },
  { name: "Dungeon3", producer: getDungeonSettings3 }
  // { name: "Daily", producer: getDailySettings }
];

const scale: number[] = [0, ...LEVEL_SCALE];

export type Seeder = {
  hash: string;
  producer: SettingsProducer;
  difficulty: number;
  name: string;
};

export const levelProducers = producers
  .flatMap((producer) =>
    scale.reduce<Seeder[]>((acc, _lvl, index) => {
      const settings = producer.producer(index + 1);
      return acc.concat({
        hash: settingsHash(settings),
        name: producer.name,
        producer: producer.producer,
        difficulty: index
      });
    }, [])
  )
  .filter(
    (seeder, index, seeders) =>
      seeders.findIndex((s) => s.hash === seeder.hash) === index
  );

export const getFilteredProducers = (
  types: { name: string; levels: number[] }[] | undefined,
  producers = levelProducers
) =>
  producers.filter((l) => {
    if (types === undefined) return true;
    return types.some(
      (t) =>
        t.name.toLowerCase() === l.name.toLowerCase() &&
        (t.levels.length === 0 || t.levels.includes(l.difficulty + 1))
    );
  });
