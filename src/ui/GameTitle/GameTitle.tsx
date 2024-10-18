import clsx from "clsx";

import { Block } from "../Block/Block";

import styles from "./GameTitle.module.css";

type Props = {
  onClick?: () => void;
};

export const GameTitle: React.FC<Props> = ({ onClick }) => (
  <h1
    className={clsx(
      "mb-2 flex-1 text-center font-block-sort text-3xl font-extrabold text-orange-400",
      styles.header
    )}
    onClick={onClick}
  >
    Bl
    <div className="-mx-2 inline-block translate-y-1 scale-50 text-sm">
      <Block moved={true} color="#fb923c" shape="️⭐️" revealed />
    </div>
    ck S
    <div className="-mx-2 inline-block translate-y-1 scale-50 text-sm">
      <Block moved={true} color="#fb923c" shape="️🧩" revealed />
    </div>
    rt
  </h1>
);
