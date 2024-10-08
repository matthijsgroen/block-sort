import clsx from "clsx";

import { TextEmoji } from "@/support/Emoji";

import { WoodButton } from "../WoodButton/WoodButton";

import styles from "./TopButton.module.css";

type Props = {
  onClick?: VoidFunction;
  highlight?: boolean;
  buttonType: "restart" | "back" | "settings" | "close" | "install";
};

export const TopButton: React.FC<Props> = ({
  onClick,
  buttonType,
  highlight = false,
}) => {
  const button = (
    <WoodButton onClick={onClick}>
      <span
        className={clsx({
          "text-2xl":
            buttonType === "back" ||
            buttonType === "settings" ||
            buttonType === "close" ||
            buttonType === "install",
          "text-4xl": buttonType === "restart",
        })}
      >
        {buttonType === "back" && (
          <span className="inline-block translate-y-[2px]">&larr;</span>
        )}
        {buttonType === "restart" && (
          <span className="inline-block -translate-y-[5px] -translate-x-[2px]">
            &#10226;
          </span>
        )}
        {buttonType === "settings" && (
          <span className="inline-block translate-y-[2px] translate-x-[-1px]">
            ⛭
          </span>
        )}
        {buttonType === "install" && (
          <span className="inline-block -translate-y-[1px] translate-x-[-1px] font-mono underline">
            <TextEmoji emoji="⬇" />
          </span>
        )}
        {buttonType === "close" && (
          <span className="inline-block -translate-x-[1px]">&times;</span>
        )}
      </span>
    </WoodButton>
  );

  return highlight ? (
    <div className={clsx("inline-block", styles.highlight)}>{button}</div>
  ) : (
    button
  );
};
