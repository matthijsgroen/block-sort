import type { LevelSettings } from "@/game/types";

// Source: https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
export const hash = (str: string): number => {
  let hash = 0,
    i,
    chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

export const settingsHash = (settings: LevelSettings): string => {
  const hashVersion: LevelSettings = {
    ...settings,
    hideBlockTypes: settings.hideBlockTypes ?? "none",
    extraBuffers: (settings.extraBuffers ?? []).filter((b) => b.amount > 0)
  };
  delete hashVersion.layoutMap;
  delete hashVersion.playMoves;
  return hash(JSON.stringify(hashVersion)).toString();
};
