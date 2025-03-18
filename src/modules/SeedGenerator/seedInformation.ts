import c from "ansi-colors";
import fs from "node:fs";
import path from "node:path";

import { levelSeeds } from "@/data/levelSeeds";

import { MAX_LEVELS_PER_DIFFICULTY } from "./constants";
import { levelProducers } from "./producers";

const numPadding = (number: number, space: number) =>
  number.toString().padStart(space);

export const showSeedStatistics = () => {
  let previousName = "";
  levelProducers.forEach((producer) => {
    const seeds = levelSeeds[producer.hash];

    const moves = seeds.map((s) => s[1]).sort((a, b) => a - b);
    if (previousName !== producer.name) {
      console.log("");
      console.log(`${c.bold(producer.name)}`);
      previousName = producer.name;
    }
    if (moves.length === 0) {
      console.log(
        ` ${numPadding(producer.difficulty + 1, 2)} ` + c.gray("No seeds")
      );
      return;
    }
    const average = Math.round(moves.reduce((r, m) => r + m, 0) / moves.length);
    const q1 = moves[Math.floor(moves.length / 4)];
    const q3 = moves[Math.floor((moves.length / 4) * 3)];
    const q2 = moves[Math.floor(moves.length / 2)];
    const lowest = moves[0];
    const highest = moves.at(-1)!;
    const hardLevels = moves.filter((m) => m > average + 40).length;

    const expectedMax = MAX_LEVELS_PER_DIFFICULTY[producer.difficulty];
    const tooLow = moves.length < expectedMax;
    const tooHigh = moves.length > expectedMax;
    const value = numPadding(moves.length, 3);
    const formattedValue = tooLow
      ? c.bold(c.red(value))
      : tooHigh
        ? c.yellow(value)
        : value;

    console.log(
      ` ${numPadding(producer.difficulty + 1, 2)} - ${formattedValue}/${numPadding(expectedMax, 3)} ` +
        `- Avg: ${c.bold(numPadding(average, 3))} - ${numPadding(lowest, 3)} ├──[${numPadding(q1, 3)} |${c.bold(numPadding(q2, 3))}| ${numPadding(q3, 3)}]──┤ ${numPadding(highest, 3)} ${hardLevels > 0 ? `(Hard: ${hardLevels})` : ""}`
    );
  });
};

export const exportSeedInformation = (exportPath: string) => {
  const columns = levelProducers.map((producer) => {
    const seeds = levelSeeds[producer.hash];
    const moves = seeds.map((s) => `${s[1]}`);
    return [producer.name, ...moves];
  });

  const rows = Math.max(...columns.map((c) => c.length));

  const data = Array.from({ length: rows }, (_, i) => {
    return columns.map((c) => c[i] || "").join(",");
  }).join("\n");

  writeDataToFile(exportPath, data);

  console.log(`Seed information exported to ${exportPath}`);
  console.log(
    "you can analyze this data with https://datatab.net/statistics-calculator/charts/create-boxplot"
  );
};

const writeDataToFile = (exportPath: string, data: string) => {
  const exportFile = path.resolve(exportPath);
  const exportDir = path.dirname(exportFile);

  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
  }

  fs.writeFileSync(exportFile, data);
};
