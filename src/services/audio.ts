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

export const audioSystem = <
  Stream extends string,
  AudioLibrary extends Record<string, AudioItem<Stream>>
>(
  streams: Record<Stream, StreamItem>,
  audioItems: AudioLibrary
) => {
  // Store HTMLAudioElements for each audio item
  const audioElements: Record<string, HTMLAudioElement[]> = {};
  const playingInStream: Record<
    string,
    Record<string, keyof AudioLibrary | undefined>
  > = {};

  // Preload audio elements if not lazy
  for (const [key, item] of Object.entries(audioItems)) {
    if (!item.lazy) {
      const audio = new Audio(item.fileUrl);
      audio.loop = !!item.loop;
      audio.preload = "auto";
      audio.volume = typeof item.gain === "number" ? item.gain : 1.0;
      audioElements[key] = [audio];
    }
  }

  // Suspend/resume all audio on tab visibility change
  // Keep track of which audios were playing before suspend
  let resumeList: HTMLAudioElement[] = [];
  const suspendAllAudio = () => {
    resumeList = [];
    Object.values(audioElements).forEach((arr) => {
      arr.forEach((audio) => {
        if (!audio.paused && !audio.ended) {
          resumeList.push(audio);
        }
        audio.pause();
      });
    });
  };
  const resumeAllAudio = () => {
    // Auto-resume all audios that were playing before suspend
    resumeList.forEach((audio) => {
      // Only resume if not ended
      if (audio.paused && !audio.ended) {
        audio.play();
      }
    });
    resumeList = [];
  };
  if (typeof document !== "undefined" && typeof window !== "undefined") {
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        suspendAllAudio();
      } else {
        resumeAllAudio();
      }
    });
  }

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
      if (itemInfo.singleInStream) {
        const currentlyPlaying = getCurrentlyPlaying(item) as string;
        if (currentlyPlaying) {
          // Stop the currently playing audio in the stream
          if (audioElements[currentlyPlaying]) {
            audioElements[currentlyPlaying].forEach((el) => {
              el.pause();
              el.currentTime = 0;
            });
          }
        }
      }

      // Support multiple instances if needed
      if (itemInfo.multipleInstances) {
        const audio = new Audio(itemInfo.fileUrl);
        audio.loop = !!itemInfo.loop;
        audio.preload = "auto";
        audio.volume = typeof itemInfo.gain === "number" ? itemInfo.gain : 1.0;
        audio.play();
        if (!audioElements[item as string]) {
          audioElements[item as string] = [];
        }
        audioElements[item as string].push(audio);
        audio.onended = () => {
          audioElements[item as string] = audioElements[item as string].filter(
            (a) => a !== audio
          );
          setStoppedPlaying(item);
        };
      } else {
        let audio: HTMLAudioElement;
        if (
          !audioElements[item as string] ||
          audioElements[item as string].length === 0
        ) {
          audio = new Audio(itemInfo.fileUrl);
          audio.loop = !!itemInfo.loop;
          audio.preload = "auto";
          audio.volume =
            typeof itemInfo.gain === "number" ? itemInfo.gain : 1.0;
          audioElements[item as string] = [audio];
        } else {
          audio = audioElements[item as string][0];
        }
        audio.currentTime = 0;
        audio.play();
        audio.onended = () => {
          setStoppedPlaying(item);
        };
      }
      setCurrentlyPlaying(item);
    },
    stopAllInStream: (stream: Stream) => {
      for (const [k, v] of Object.entries(audioItems)) {
        if (v.audioStream === stream) {
          if (audioElements[k]) {
            audioElements[k].forEach((el) => {
              el.pause();
              el.currentTime = 0;
            });
          }
          playingInStream[stream] = {};
        }
      }
    },
    stop: (item: keyof AudioLibrary) => {
      if (audioElements[item as string]) {
        audioElements[item as string].forEach((el) => {
          el.pause();
          el.currentTime = 0;
        });
      }
      setStoppedPlaying(item);
    }
  };
};
