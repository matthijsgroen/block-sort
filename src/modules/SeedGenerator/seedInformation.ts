import c from "ansi-colors";

import { levelSeeds } from "@/data/levelSeeds";

import { levelProducers } from "./producers";

export const showSeedStatistics = () => {
  let previousName = "";
  levelProducers.forEach((producer) => {
    if (previousName !== producer.name) {
      console.log("");
      console.log(c.bold(producer.name));
      previousName = producer.name;
    }
    const seeds = levelSeeds[producer.hash];

    const moves = seeds.map((s) => s[1]);
    const average = Math.round(moves.reduce((r, m) => r + m, 0) / moves.length);
    const lowest = moves.reduce((r, m) => Math.min(r, m));
    const highest = moves.reduce((r, m) => Math.max(r, m));

    console.log(
      `  ${producer.difficulty} - Avg: ${average} - Min: ${lowest} -${average - lowest} - Max: ${highest} +${highest - average}`
    );
  });
};
