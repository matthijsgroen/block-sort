import clsx from "clsx";

import { WoodButton } from "../WoodButton/WoodButton";

import styles from "./TopButton.module.css";
type ButtonType =
  | "restart"
  | "back"
  | "settings"
  | "close"
  | "install"
  | "help";

type Props = {
  onClick?: VoidFunction;
  highlight?: boolean;
  buttonType: ButtonType;
};

export const TopButton: React.FC<Props> = ({
  onClick,
  buttonType,
  highlight = false
}) => {
  const iconMap: Record<ButtonType, string> = {
    back: "arrow_back",
    restart: "replay",
    settings: "settings",
    install: "download",
    help: "question_mark",
    close: "close"
  };
  const icon = iconMap[buttonType];
  const button = (
    <WoodButton onClick={onClick}>
      <span className="material-icons -ml-[2px] pt-1 text-center align-middle !text-xl">
        {icon}
      </span>
    </WoodButton>
  );

  return highlight ? (
    <div className={clsx("inline-block", styles.highlight)}>{button}</div>
  ) : (
    button
  );
};
