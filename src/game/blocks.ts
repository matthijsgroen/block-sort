export const BLOCK_COLORS = [
  "white", // square
  "red", // cross
  "yellow", // circle
  "blue", // moon
  "purple", // star
  "black", // music note?
  "green", // diamond
  "aqua", // lightning bolt
  "darkgreen", // three circles
  "brown", // toadstool
  "pink", // animal footprint
] as const;

export type BlockColor = (typeof BLOCK_COLORS)[number];

export const shapeMapping: Record<BlockColor, string> = {
  black: "🎵",
  brown: "🍄",
  darkgreen: "🟢",
  yellow: "🟡",
  aqua: "⚡️",
  pink: "🐾",
  purple: "✡️",
  blue: "☽",
  red: "❌",
  white: "🔲",
  green: "🔶",
};
