import c from "ansi-colors";

import { levelSeeds } from "@/data/levelSeeds";

import { levelProducers } from "./producers";

const numPadding = (number: number, space: number) =>
  number.toString().padStart(space);

export const showSeedStatistics = () => {
  let previousName = "";
  levelProducers.forEach((producer) => {
    if (previousName !== producer.name) {
      console.log("");
      console.log(c.bold(producer.name));
      previousName = producer.name;
    }
    const seeds = levelSeeds[producer.hash];

    const moves = seeds.map((s) => s[1]).sort((a, b) => a - b);
    const average = Math.round(moves.reduce((r, m) => r + m, 0) / moves.length);
    const q1 = moves[Math.floor(moves.length / 4)];
    const q3 = moves[Math.floor((moves.length / 4) * 3)];
    const q2 = moves[Math.floor(moves.length / 2)];
    const lowest = moves[0];
    const highest = moves.at(-1)!;
    const hardLevels = moves.filter((m) => m > average + 50).length;

    console.log(
      ` ${numPadding(producer.difficulty, 2)} - Avg: ${c.bold(numPadding(average, 3))} - ${numPadding(lowest, 3)} ├──[${numPadding(q1, 3)} |${c.bold(numPadding(q2, 3))}| ${numPadding(q3, 3)}]──┤ ${numPadding(highest, 3)} ${hardLevels > 0 ? `(Hard: ${hardLevels})` : ""}`
    );
  });
};
