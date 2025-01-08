import { describe, expect, it } from "vitest";

import { generateColorMap } from "./daily";

describe(generateColorMap, () => {
  it("generates a color map based on a main color", () => {
    const mainColor = "#000099";
    const colorMap = generateColorMap(mainColor);

    expect(colorMap).toEqual({
      white: "#000099",
      red: "#000099",
      yellow: "#000099",
      blue: "#000099",
      purple: "#000099",
      black: "#000099",
      green: "#000099",
      aqua: "#000099",
      darkgreen: "#000099",
      darkblue: "#000099",
      brown: "#000099",
      pink: "#000099",
      turquoise: "#000099",
      orange: "#000099",
      lightyellow: "#000099",
      gray: "#000099"
    });
  });
});
