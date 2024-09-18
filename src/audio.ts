import lose from "@/assets/lose.mp3";
import music from "@/assets/music.mp3";
import place from "@/assets/place.mp3";
import win from "@/assets/win.mp3";

let musicElement: HTMLAudioElement | null = null;
let winElement: HTMLAudioElement | null = null;
let loseElement: HTMLAudioElement | null = null;
let placeElement: HTMLAudioElement | null = null;

let musicEnabled = true;
let soundEnabled = true;

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
    musicElement ??= new Audio(music);
    musicElement.loop = true;

    if (musicElement.paused) {
      musicElement.play();
    }
  },
  stopMusic: () => {
    if (!musicElement) {
      return;
    }
    musicElement.pause();
  },
  playWin: () => {
    if (!soundEnabled) {
      return;
    }

    winElement ??= new Audio(win);

    if (winElement.paused) {
      winElement.play();
    }
  },
  playLose: () => {
    if (!soundEnabled) {
      return;
    }

    loseElement ??= new Audio(lose);

    if (loseElement.paused) {
      loseElement.play();
    }
  },
  playPlace: () => {
    if (!soundEnabled) {
      return;
    }

    placeElement ??= new Audio(place);
    placeElement.volume = 0.5;

    if (placeElement.paused) {
      placeElement.play();
    }
  },
  playLock: () => {
    if (!soundEnabled) {
      return;
    }

    placeElement ??= new Audio(place);
    placeElement.volume = 0.5;

    const audioCopy: HTMLAudioElement = placeElement.cloneNode(
      true
    ) as HTMLAudioElement;
    audioCopy.play();
  },
};

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    sound.stopMusic();
  }
  if (document.visibilityState === "visible") {
    sound.playMusic();
  }
});
