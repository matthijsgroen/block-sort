import lose from "@/assets/lose.mp3";
import music from "@/assets/music.mp3";
import pickup from "@/assets/pickup.mp3";
import place from "@/assets/place.mp3";
import win from "@/assets/win.mp3";

type StreamItem = {
  gainNode?: GainNode;
  gain: number;
  disabled?: boolean;
};

type Stream = "effects" | "music";

const streams: Record<Stream, StreamItem> = {
  effects: { gain: 0.1 },
  music: { gain: 0.1 },
};

type AudioItem = {
  fileUrl: string;
  audioStream: Stream;
  buffer?: AudioBuffer;
  /**
   * @default false
   */
  loop?: boolean;
  /**
   * Determines if the same sound can be played multiple times at the same time
   * @default false
   */
  multipleInstances?: boolean;
};

const createItem = (
  audioStream: Stream,
  fileUrl: string,
  { loop = false, multipleInstances = false } = {}
): AudioItem => ({
  audioStream,
  fileUrl,
  loop,
  multipleInstances,
});

const audioItems = {
  music: createItem("music", music, { loop: true }),
  lose: createItem("effects", lose),
  place: createItem("effects", place),
  lock: createItem("effects", place, { multipleInstances: true }),
  win: createItem("effects", win),
  pickup: createItem("effects", pickup),
};

const loadAndDecodeAudio = async (
  context: AudioContext,
  fileUrl: string
): Promise<AudioBuffer> => {
  const file = await fetch(fileUrl);
  const buffer = await file.arrayBuffer();
  return context.decodeAudioData(buffer);
};

const loadAudio = async () => {
  const context = new AudioContext();

  // stop audio if game loses focus
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      context.suspend();
    } else {
      context.resume();
    }
  });

  // initialize streams
  for (const stream of Object.values(streams)) {
    stream.gainNode = context.createGain();
    stream.gainNode.gain.value = stream.gain;
    stream.gainNode.connect(context.destination);
  }

  // Load audio in buffers
  await Promise.all(
    Object.entries(audioItems).map(async ([, v]) => {
      if (v.buffer === undefined) {
        v.buffer = await loadAndDecodeAudio(context, v.fileUrl);
      }
    })
  );

  const playBuffer = (item: AudioItem) => {
    let sourcePlaying: null | { stop: VoidFunction } = null;
    const targetNode = streams[item.audioStream].gainNode;
    if (!targetNode) {
      throw new Error(
        `Audio stream for ${item.audioStream} is not yet initialized`
      );
    }

    const play = (): {
      stop: VoidFunction;
    } => {
      if (item.buffer === undefined) {
        return { stop: () => {} };
      }
      const source = context.createBufferSource();
      source.loop = item.loop === true;
      source.buffer = item.buffer;

      source.connect(targetNode);
      source.start(context.currentTime, 0);
      if (!item.loop) {
        source.onended = () => {
          source.stop();
          source.disconnect();
          sourcePlaying = null;
        };
      }

      return {
        stop: () => {
          source.stop();
          source.disconnect();
        },
      };
    };

    return {
      play: () => {
        if (sourcePlaying !== null && !item.multipleInstances) {
          return sourcePlaying;
        }
        sourcePlaying = play();
        return sourcePlaying;
      },
      stop: () => {
        if (sourcePlaying !== null && !item.multipleInstances) {
          sourcePlaying.stop();
          sourcePlaying = null;
        }
      },
    };
  };

  const audioPlayers = Object.fromEntries(
    Object.entries(audioItems).map(([k, v]) => [k, playBuffer(v)])
  );

  return {
    suspend: () => context.suspend(),
    resume: () => context.resume(),
    play: (item: keyof typeof audioItems) => {
      audioPlayers[item].play();
    },
    stop: (item: keyof typeof audioItems) => {
      audioPlayers[item].stop();
    },
  };
};

let soundSystem: ReturnType<typeof loadAudio> | null = null;

const getSoundSystem = async () => {
  if (soundSystem === null) {
    soundSystem = loadAudio();
  }
  return soundSystem;
};

export const sound = {
  setStreamEnabled: (stream: Stream, enabled = true) => {
    streams[stream].disabled = !enabled;
  },
  play: (item: keyof typeof audioItems) => {
    const itemInfo = audioItems[item];
    const stream = streams[itemInfo.audioStream];
    if (stream.disabled) {
      return;
    }
    getSoundSystem().then((s) => {
      s.resume();
      s.play(item);
    });
  },
  stop: (item: keyof typeof audioItems) => {
    getSoundSystem().then((s) => s.stop(item));
  },
};