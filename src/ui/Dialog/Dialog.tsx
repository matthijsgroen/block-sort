import { PropsWithChildren, useEffect, useRef } from "react";
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
  onClose,
}) => {
  const dialogElement = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialogElement.current?.showModal();
    const listener = () => {
      onClose?.();
    };
    dialogElement.current?.addEventListener("close", listener);
    return () => {
      dialogElement.current?.removeEventListener("close", listener);
    };
  }, []);

  return (
    <dialog
      ref={dialogElement}
      className={clsx("pb-5 px-0 bg-transparent w-4/5 max-h-3/4", {
        "max-w-[300px]": !wide,
        "max-w-4/5": wide,
      })}
    >
      <div
        className={clsx(
          "rounded-xl border border-black p-4 drop-shadow-lg animate-fadeIn [animation-duration:0.3s]",
          styles.woodBackground
        )}
      >
        {children}
        <div className="text-center translate-y-9 -mt-9">
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
