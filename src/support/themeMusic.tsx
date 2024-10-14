import { AudioItemName } from "@/audio";
import { BlockTheme } from "@/game/themes";

const song: Record<BlockTheme, AudioItemName> = {
  default: "music",
  halloween: "halloween",
  winter: "winter",
  spring: "music",
};

export const getThemeSong = (theme: BlockTheme) => song[theme];
