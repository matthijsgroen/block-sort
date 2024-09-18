import lose from "@/assets/lose.mp3";
import music from "@/assets/music.mp3";
import place from "@/assets/place.mp3";
import win from "@/assets/win.mp3";

let musicBuffer: AudioBuffer | null = null;
let winBuffer: AudioBuffer | null = null;
let loseBuffer: AudioBuffer | null = null;
let placeBuffer: AudioBuffer | null = null;

let musicEnabled = true;
let soundEnabled = true;

const loadAudio = async () => {
  const context = new AudioContext();
  const effectsGain = context.createGain();
  const musicGain = context.createGain();

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      context.suspend();
    } else {
      context.resume();
    }
  });

  effectsGain.connect(context.destination);
  musicGain.connect(context.destination);

  const loadAndDecodeAudio = async (fileUrl: string): Promise<AudioBuffer> => {
    const file = await window.fetch(fileUrl);
    const buffer = await file.arrayBuffer();
    return context.decodeAudioData(buffer);
  };

  console.log("start loading audio...");

  musicBuffer = await loadAndDecodeAudio(music);
  winBuffer = await loadAndDecodeAudio(win);
  loseBuffer = await loadAndDecodeAudio(lose);
  placeBuffer = await loadAndDecodeAudio(place);
  console.log("done!");

  const playBuffer = (
    buffer: AudioBuffer,
    gain: AudioNode,
    loop = false,
    singleSource = true
  ) => {
    let sourcePlaying: null | { stop: VoidFunction } = null;

    const play = (): {
      stop: VoidFunction;
    } => {
      const source = context.createBufferSource();
      source.loop = loop;
      source.buffer = buffer;

      source.connect(gain);
      source.start(context.currentTime, 0);
      if (!loop) {
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
        if (sourcePlaying !== null && singleSource) {
          return sourcePlaying;
        }
        sourcePlaying = play();
        return sourcePlaying;
      },
      stop: () => {
        if (sourcePlaying !== null && singleSource) {
          sourcePlaying.stop();
          sourcePlaying = null;
        }
      },
    };
  };

  const musicPlayer = playBuffer(musicBuffer, musicGain, true);
  const playPlacePlayer = playBuffer(placeBuffer, effectsGain);
  const playLockPlayer = playBuffer(placeBuffer, effectsGain, false, false);
  const playWinPlayer = playBuffer(winBuffer, effectsGain);
  const playLosePlayer = playBuffer(loseBuffer, effectsGain);

  return {
    suspend: () => context.suspend(),
    resume: () => context.resume(),
    playMusic: () => {
      musicPlayer.play();
    },
    stopMusic: () => {
      musicPlayer.stop();
    },
    playPlace: () => {
      playPlacePlayer.play();
    },
    playLock: () => {
      playLockPlayer.play();
    },
    playWin: () => {
      playWinPlayer.play();
    },
    playLose: () => {
      playLosePlayer.play();
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
  setSoundEnabled: (state: boolean) => {
    soundEnabled = state;
  },
  setMusicEnabled: (state: boolean) => {
    musicEnabled = state;
  },
  playMusic: () => {
    if (!musicEnabled) {
      return;
    }
    getSoundSystem().then((s) => s.playMusic());
  },
  stopMusic: () => {
    getSoundSystem().then((s) => s.stopMusic());
  },
  playWin: () => {
    if (!soundEnabled) {
      return;
    }
    getSoundSystem().then((s) => s.playWin());
  },
  playLose: () => {
    if (!soundEnabled) {
      return;
    }
    getSoundSystem().then((s) => s.playLose());
  },
  playPlace: () => {
    if (!soundEnabled) {
      return;
    }
    getSoundSystem().then((s) => s.playPlace());
  },
  playLock: () => {
    if (!soundEnabled) {
      return;
    }
    getSoundSystem().then((s) => s.playLock());
  },
};
