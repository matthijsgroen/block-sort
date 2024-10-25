import clsx from "clsx";

import { encodeForContent } from "@/support/emojiEncoding";

import styles from "./Block.module.css";

export type HideFormat = "glass" | "present";

export type Props = {
  color: string;
  shape: string;
  blur?: boolean;
};

export const BlockLight: React.FC<Props> = ({ color, shape, blur = false }) => (
  <div
    style={{
      "--cube-color": color,
      "--cube-shape-opacity": "50%",
      "--cube-shape": `'${encodeForContent(shape)}'`,
      "--cube-top-shape": `'${encodeForContent(shape)}'`
    }}
    className={clsx(
      "relative -mt-top-block h-height-block w-block rounded-md bg-block text-center",
      {
        "blur-[2px]": blur
      }
    )}
  >
    <div className={clsx(styles.layer, "z-10 pt-7")}>
      <span className={clsx("block", styles.shape)}></span>
    </div>
    <div className={clsx(styles.layer, styles.gradient)}></div>
  </div>
);
