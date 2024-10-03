import { Dispatch, Suspense, useEffect, useRef, useState } from "react";
import clsx from "clsx";

import { Checkbox } from "@/ui/Checkbox";
import { TopButton } from "@/ui/TopButton/TopButton";

import info from "@/../package.json";

import { Changelog } from "./Changelog";

import styles from "./index.module.css";

type Props = {
  soundEnabled?: boolean;
  musicEnabled?: boolean;
  onSoundChange?: Dispatch<boolean>;
  onMusicChange?: Dispatch<boolean>;
  onClose?: VoidFunction;
};

export const Settings: React.FC<Props> = ({
  soundEnabled = true,
  musicEnabled = true,
  onSoundChange,
  onMusicChange,
  onClose,
}) => {
  const dialogElement = useRef<HTMLDialogElement>(null);
  const [activeTab, setActiveTab] = useState<
    "settings" | "changes" | "attribution"
  >("settings");

  useEffect(() => {
    dialogElement.current?.showModal();
  }, []);

  return (
    <dialog
      ref={dialogElement}
      className="pb-5 px-0 bg-transparent w-4/5 max-w-[300px] max-h-4/5"
    >
      <div
        className={clsx(
          "rounded-xl border border-black p-4 drop-shadow-lg animate-fadeIn [animation-duration:0.3s]",
          styles.woodBackground
        )}
      >
        <h1 className={clsx("mb-2 font-bold font-block-sort", styles.title)}>
          BlockSort, v{info.version}
        </h1>

        {activeTab === "settings" && (
          <div className="flex flex-col gap-3">
            <Checkbox
              value={soundEnabled}
              onChange={(v) => onSoundChange?.(v)}
              label="Sound Effects"
            />
            <Checkbox
              value={musicEnabled}
              onChange={(v) => onMusicChange?.(v)}
              label="Music"
            />
            {"share" in navigator && (
              <button
                className={clsx(
                  "inline-block rounded-full border border-black p-2 shadow-md",
                  "bg-black bg-clip-text text-transparent",
                  "active:scale-90 transition-transform"
                )}
                onClick={async () => {
                  try {
                    await navigator.share({
                      title: "Block Sort",
                      url: "https://matthijsgroen.github.io/block-sort/",
                      text: "A block sorting puzzle game. No ads, cookies, tracking or payments. Just the pure fun!",
                    });
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  } catch (e) {
                    // Nothing to do, user probably canceled the share
                  }
                }}
              >
                ❤︎ Share
              </button>
            )}
            <p className="text-xs">Matthijs Groen, 2024</p>
            <div className="flex flex-row justify-between pb-4">
              <button
                className={clsx(
                  "inline-block rounded-full border border-black p-2 shadow-md text-black text-sm px-4",
                  "active:scale-90 transition-transform"
                )}
                onClick={() => setActiveTab("changes")}
              >
                Recent changes
              </button>
              <button
                className={clsx(
                  "inline-block rounded-full border border-black p-2 shadow-md text-black text-sm px-4",
                  "active:scale-90 transition-transform"
                )}
              >
                Attribution
              </button>
            </div>
          </div>
        )}
        {activeTab === "changes" && (
          <div className="flex flex-col gap-3">
            <button
              className={clsx(
                "inline-block rounded-full border border-black p-2 shadow-md text-black text-sm px-4",
                "active:scale-90 transition-transform"
              )}
              onClick={() => setActiveTab("settings")}
            >
              Back
            </button>
            <Suspense fallback={<div>Loading...</div>}>
              <Changelog />
            </Suspense>
          </div>
        )}
        <div className="text-center translate-y-9 -mt-9">
          <TopButton
            buttonType="close"
            onClick={() => {
              onClose?.();
              dialogElement.current?.close();
            }}
          />
        </div>
      </div>
    </dialog>
  );
};
