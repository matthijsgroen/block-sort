import clsx from "clsx";

import { WoodButton } from "../WoodButton/WoodButton";

type Props = {
  onClick?: VoidFunction;
  buttonType: "restart" | "back" | "settings" | "close";
};

export const TopButton: React.FC<Props> = ({ onClick, buttonType }) => (
  <WoodButton onClick={onClick}>
    <span
      className={clsx({
        "text-2xl":
          buttonType === "back" ||
          buttonType === "settings" ||
          buttonType === "close",
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
      {buttonType === "close" && (
        <span className="inline-block translate-x-[-1px]">&times;</span>
      )}
    </span>
  </WoodButton>
);
