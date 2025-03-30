import halloween from "@/assets/halloween.aac";
import lose from "@/assets/lose.mp3";
import music from "@/assets/music.aac";
import pickup from "@/assets/pickup.mp3";
import place from "@/assets/place.mp3";
import progress from "@/assets/progress.mp3";
import restart from "@/assets/restart.mp3";
import match from "@/assets/splash-audio.mp3";
import spring from "@/assets/spring.aac";
import stageWin from "@/assets/stage.mp3";
import summer from "@/assets/summer.aac";
import win from "@/assets/win.mp3";
import winter from "@/assets/winter.aac";

import type { StreamItem } from "./services/audio";
import { audioSystem, createItem } from "./services/audio";

export enum Stream {
  effects = "effects",
  music = "music"
}

const streams: Record<Stream, StreamItem> = {
  effects: { gain: 0.5 },
  music: { gain: 0.5 }
};

const audioItems = {
  music: createItem(Stream.music, music, 1.0, {
    loop: true,
    lazy: true,
    singleInStream: "music"
  }),
  halloween: createItem(Stream.music, halloween, 0.5, {
    loop: true,
    lazy: true,
    singleInStream: "music"
  }),
  winter: createItem(Stream.music, winter, 0.4, {
    loop: true,
    lazy: true,
    singleInStream: "music"
  }),
  spring: createItem(Stream.music, spring, 0.5, {
    loop: true,
    lazy: true,
    singleInStream: "music"
  }),
  summer: createItem(Stream.music, summer, 0.5, {
    loop: true,
    lazy: true,
    singleInStream: "music"
  }),
  lose: createItem(Stream.effects, lose, 0.5),
  restart: createItem(Stream.effects, restart, 0.5),
  place: createItem(Stream.effects, place),
  lock: createItem(Stream.effects, place, 1.0, { multipleInstances: true }),
  win: createItem(Stream.effects, win),
  stageWin: createItem(Stream.effects, stageWin),
  pickup: createItem(Stream.effects, pickup, 2.0),
  progress: createItem(Stream.effects, progress),
  match: createItem(Stream.effects, match)
};

export type AudioItemName = keyof typeof audioItems;

export const sound = audioSystem(streams, audioItems);
