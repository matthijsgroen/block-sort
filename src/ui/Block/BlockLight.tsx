import { CSSProperties } from "react";
import clsx from "clsx";

import { encodeForContent } from "@/support/emojiEncoding";

import styles from "./Block.module.css";

export type HideFormat = "glass" | "present";

export type Props = {
  style?: CSSProperties;
  className?: string;
  color: string;
  shape: string;
};

export const BlockLight: React.FC<Props> = ({
  color,
  shape,
  style,
  className
}) => (
  <div
    style={{
      "--cube-color": color,
      "--cube-shape-opacity": "50%",
      "--cube-shape": `'${encodeForContent(shape)}'`,
      "--cube-top-shape": `'${encodeForContent(shape)}'`,
      ...style
    }}
    className={clsx(
      "-mt-top-block h-height-block w-block rounded-md pt-7 text-center",
      styles["light-gradient"],
      styles.shape,
      className
    )}
  ></div>
);