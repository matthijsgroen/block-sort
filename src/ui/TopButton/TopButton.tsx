import clsx from "clsx";

import styles from "./TopButton.module.css";

type Props = {
  onClick?: VoidFunction;
  buttonType: "restart" | "back" | "settings";
};

export const TopButton: React.FC<Props> = ({ onClick, buttonType }) => {
  return (
    <button
      onPointerDown={onClick}
      className={clsx(
        {
          "text-2xl": buttonType === "back",
          "text-4xl": buttonType === "restart",
        },
        "inline-block size-block border border-black rounded-full",
        styles.buttonBackground
      )}
    >
      {buttonType === "back" && <span className="inline-block">&larr;</span>}
      {buttonType === "restart" && (
        <span className="inline-block -translate-y-[5px] -translate-x-[2px]">
          &#10226;
        </span>
      )}
      {buttonType === "settings" && (
        <span className="inline-block scale-150">⛭</span>
      )}
    </button>
  );
};
