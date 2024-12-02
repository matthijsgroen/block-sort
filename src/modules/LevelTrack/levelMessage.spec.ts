import { describe, expect, it } from "vitest";

import { LEVEL_SCALE } from "@/game/level-settings/levelSettings";

import { ZEN_MODE_UNLOCK } from "../GameModi/constants";

import { getLevelMessage } from "./levelMessage";

describe(getLevelMessage, () => {
  it("does not start with a message", () => {
    expect(getLevelMessage(0)).toBeUndefined();
  });

  it("displays a message for each difficulty change", () => {
    LEVEL_SCALE.forEach((levelNr) => {
      const message = getLevelMessage(levelNr);
      expect(message).not.toBeUndefined();
    });
  });

  it("displays a message for unlocking zen mode", () => {
    const message = getLevelMessage(ZEN_MODE_UNLOCK - 1);
    expect(message).match(/Zen mode unlocked/);
  });
});
