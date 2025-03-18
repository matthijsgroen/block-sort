import { describe, expect, it } from "vitest";

import type { RangedItem } from "./schedule";
import { filterInRange } from "./schedule";

describe(filterInRange, () => {
  it("returns items that are in range", () => {
    type Content = { name: string } & RangedItem;
    const testItems: Content[] = [
      {
        name: "single day",
        begin: { month: 1, day: 9 },
        end: { month: 1, day: 9 }
      },
      {
        name: "out-of-range",
        begin: { month: 2, day: 6 },
        end: { month: 2, day: 10 }
      },
      {
        name: "year-bridge",
        begin: { month: 12, day: 1 },
        end: { month: 2, day: 1 }
      },
      {
        name: "small-range",
        begin: { month: 1, day: 6 },
        end: { month: 1, day: 10 }
      }
    ];
    const items = filterInRange(new Date("2021-01-09"), testItems);
    expect(items.map((item) => item.name)).toEqual([
      "single day",
      "year-bridge",
      "small-range"
    ]);
  });
});
