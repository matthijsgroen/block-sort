export type StreamItem = {
  gainNode?: GainNode;
  gain: number;
  disabled?: boolean;
};

export type AudioItem<Stream> = {
  fileUrl: string;
  audioStream: Stream;
  gainNode?: GainNode;
  buffer?: AudioBuffer;
  gain?: number;
  /**
   * @default false
   */
  lazy?: boolean;
  /**
   * @default false
   */
  loop?: boolean;
  /**
   * Determines if the same sound can be played multiple times at the same time
   * @default false
   */
  multipleInstances?: boolean;
  /**
   * Stops others in the stream with the same key
   */
  singleInStream?: string;
};

export const createItem = <Stream>(
  audioStream: Stream,
  fileUrl: string,
  gain = 1.0,
  {
    loop = false,
    multipleInstances = false,
    lazy = false,
    singleInStream
  }: Omit<AudioItem<Stream>, "gain" | "fileUrl" | "audioStream"> = {}
): AudioItem<Stream> => ({
  audioStream,
  fileUrl,
  gain,
  loop,
  multipleInstances,
  lazy,
  singleInStream
});

const loadAndDecodeAudio = async (
  context: AudioContext,
  fileUrl: string
): Promise<AudioBuffer> => {
  const file = await fetch(fileUrl);
  const buffer = await file.arrayBuffer();
  return context.decodeAudioData(buffer);
};

export const audioSystem = <
  Stream extends string,
  AudioLibrary extends Record<string, AudioItem<Stream>>
>(
  streams: Record<Stream, StreamItem>,
  audioItems: AudioLibrary
) => {
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

    document.addEventListener(
      "pointerdown",
      () => {
        context.resume();
      },
      { once: true }
    );

    // initialize streams
    for (const stream of Object.values<StreamItem>(streams)) {
      stream.gainNode = context.createGain();
      stream.gainNode.gain.value = stream.gain;
      stream.gainNode.connect(context.destination);
    }

    // Load audio in buffers
    await Promise.all(
      Object.entries(audioItems).map(async ([, v]) => {
        if (v.buffer === undefined && !v.lazy) {
          v.buffer = await loadAndDecodeAudio(context, v.fileUrl);
        }
      })
    );

    const playBuffer = (item: AudioItem<Stream>) => {
      let sourcePlaying: null | { stop: VoidFunction } = null;
      if (!item.gainNode) {
        const targetNode = streams[item.audioStream].gainNode;
        if (!targetNode) {
          throw new Error(
            `Audio stream for ${item.audioStream} is not yet initialized`
          );
        }
        item.gainNode = context.createGain();
        item.gainNode.gain.value = item.gain ?? 1.0;
        item.gainNode.connect(targetNode);
      }
      const target = item.gainNode;

      const play = (): {
        stop: VoidFunction;
      } => {
        if (item.buffer === undefined) {
          let playing = true;
          let lazySource: AudioBufferSourceNode | null = null;
          loadAndDecodeAudio(context, item.fileUrl).then((buffer) => {
            item.buffer = buffer;
            if (playing) {
              const loadedSource = context.createBufferSource();
              loadedSource.loop = item.loop === true;
              loadedSource.buffer = item.buffer;

              loadedSource.connect(target);
              loadedSource.start(context.currentTime, 0);
              lazySource = loadedSource;
              if (!item.loop) {
                loadedSource.onended = () => {
                  loadedSource.stop();
                  loadedSource.disconnect();
                  sourcePlaying = null;
                };
              }
            }
          });
          return {
            stop: () => {
              playing = false;
              if (lazySource !== null) {
                lazySource.stop();
                lazySource.disconnect();
              }
            }
          };
        }
        const source = context.createBufferSource();
        source.loop = item.loop === true;
        source.buffer = item.buffer;

        source.connect(target);
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
          }
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
        }
      };
    };

    const audioPlayers = Object.fromEntries(
      Object.entries(audioItems).map(([k, v]) => [k, playBuffer(v)])
    ) as Record<keyof AudioLibrary, ReturnType<typeof playBuffer>>;

    return {
      suspend: () => context.suspend(),
      resume: () => context.resume(),
      play: (item: keyof typeof audioItems) => {
        audioPlayers[item].play();
      },
      stop: (item: keyof typeof audioItems) => {
        audioPlayers[item].stop();
      }
    };
  };

  let soundSystem: ReturnType<typeof loadAudio> | null = null;

  const getSoundSystem = async () => {
    if (soundSystem === null) {
      soundSystem = loadAudio();
    }
    return soundSystem;
  };

  const playingInStream: Record<
    string,
    Record<string, keyof AudioLibrary | undefined>
  > = {};

  const getCurrentlyPlaying = (item: keyof AudioLibrary) => {
    const itemInfo = audioItems[item];
    if (itemInfo.singleInStream) {
      return playingInStream[itemInfo.audioStream]?.[itemInfo.singleInStream];
    }
  };
  const isCurrentlyPlaying = (item: keyof AudioLibrary) => {
    return getCurrentlyPlaying(item) === item;
  };
  const setCurrentlyPlaying = (item: keyof AudioLibrary) => {
    const itemInfo = audioItems[item];
    if (itemInfo.singleInStream) {
      playingInStream[itemInfo.audioStream] ??= {};
      playingInStream[itemInfo.audioStream][itemInfo.singleInStream] = item;
    }
  };
  const setStoppedPlaying = (item: keyof AudioLibrary) => {
    const itemInfo = audioItems[item];
    if (itemInfo.singleInStream && isCurrentlyPlaying(item)) {
      playingInStream[itemInfo.audioStream] ??= {};
      playingInStream[itemInfo.audioStream][itemInfo.singleInStream] =
        undefined;
    }
  };

  return {
    setStreamEnabled: (stream: Stream, enabled = true) => {
      streams[stream].disabled = !enabled;
    },
    play: (item: keyof AudioLibrary) => {
      if (document.visibilityState === "hidden") {
        return;
      }
      const itemInfo = audioItems[item];
      const stream = streams[itemInfo.audioStream];
      if (stream.disabled) {
        return;
      }
      if (isCurrentlyPlaying(item)) {
        return;
      }
      getSoundSystem().then((s) => {
        s.resume();
        if (itemInfo.singleInStream) {
          const currentlyPlaying = getCurrentlyPlaying(item);
          if (currentlyPlaying) {
            s.stop(currentlyPlaying);
          }
        }

        s.play(item);
        setCurrentlyPlaying(item);
      });
    },
    stopAllInStream: (stream: Stream) => {
      getSoundSystem().then((s) => {
        for (const [k, v] of Object.entries(audioItems)) {
          if (v.audioStream === stream) {
            s.stop(k as keyof AudioLibrary);
            playingInStream[stream] = {};
          }
        }
      });
    },
    stop: (item: keyof AudioLibrary) => {
      getSoundSystem().then((s) => {
        s.stop(item);
        setStoppedPlaying(item);
      });
    }
  };
};
