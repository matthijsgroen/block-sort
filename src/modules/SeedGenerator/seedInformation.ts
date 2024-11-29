import c from "ansi-colors";
import fs from "node:fs";
import path from "node:path";

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
    const hardLevels = moves.filter((m) => m > average + 40).length;

    console.log(
      ` ${numPadding(producer.difficulty, 2)} - Avg: ${c.bold(numPadding(average, 3))} - ${numPadding(lowest, 3)} ├──[${numPadding(q1, 3)} |${c.bold(numPadding(q2, 3))}| ${numPadding(q3, 3)}]──┤ ${numPadding(highest, 3)} ${hardLevels > 0 ? `(Hard: ${hardLevels})` : ""}`
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
