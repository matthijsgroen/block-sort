import type { PropsWithChildren } from "react";
import { useEffect, useRef } from "react";
import clsx from "clsx";

import { TopButton } from "../TopButton/TopButton";

import styles from "./Dialog.module.css";

type Props = PropsWithChildren<{
  wide?: boolean;
  onClose?: VoidFunction;
}>;

export const Dialog: React.FC<Props> = ({
  children,
  wide = false,
  onClose
}) => {
  const dialogElement = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogElement.current;
    dialog?.showModal();
    const listener = () => {
      onClose?.();
    };
    dialog?.addEventListener("close", listener);
    return () => {
      dialog?.removeEventListener("close", listener);
    };
  }, [onClose]);

  return (
    <dialog
      ref={dialogElement}
      className={clsx("max-h-3/4 w-4/5 bg-transparent px-0 pb-5", {
        "max-w-[320px]": !wide,
        "max-w-4/5": wide
      })}
    >
      <div
        className={clsx(
          "max-h-3/4 animate-fadeIn rounded-xl border border-black p-4 drop-shadow-lg [animation-duration:0.3s]",
          styles.woodBackground
        )}
      >
        {children}
        <div className="-mt-9 translate-y-9 text-center">
          <TopButton
            buttonType="close"
            onClick={() => {
              dialogElement.current?.close();
            }}
          />
        </div>
      </div>
    </dialog>
  );
};
