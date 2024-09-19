import { Dispatch, useEffect, useRef } from "react";
import clsx from "clsx";

import { Checkbox } from "@/ui/Checkbox";
import { TopButton } from "@/ui/TopButton/TopButton";

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

  useEffect(() => {
    dialogElement.current?.showModal();
  }, []);

  return (
    <dialog
      ref={dialogElement}
      className="pb-5 px-0 bg-transparent w-4/5 max-w-[300px]"
    >
      <div
        className={clsx(
          "rounded-xl border border-black p-4 drop-shadow-lg animate-fadeIn [animation-duration:0.3s]",
          styles.woodBackground
        )}
      >
        <h1 className="mb-2 font-bold">BlockSort, v0.1</h1>
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
        </div>
        <p className="text-xs my-3">2024, Matthijs Groen</p>
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
