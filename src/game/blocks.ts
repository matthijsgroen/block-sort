export const BLOCK_COLORS = [
  "white", // square
  "red", // cross
  "yellow", // circle
  "blue", // moon
  "purple", // star
  "black", // music note?
  "green", // diamond
  "aqua", // lightning bolt
  "darkgreen", // clover
  "darkblue", // star
  "brown", // toadstool
  "pink", // animal footprint
  "turquoise", // triangle
  "orange", // butterfly
  "lightyellow", // sun
  "gray", // fish
] as const;

export type BlockColor = (typeof BLOCK_COLORS)[number];
