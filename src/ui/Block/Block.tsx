import { useEffect } from "react";
import clsx from "clsx";

import { encodeForContent } from "@/support/emojiEncoding";
import { useDelayedToggle } from "@/support/useDelayedToggle";

import styles from "./Block.module.css";

export type Props = {
  moved: boolean;
  revealed?: boolean;
  color: string;
  selected?: boolean | null;
  suggested?: boolean | null;
  /**
   * Used to offset animations
   */
  index?: number;
  locked?: boolean;
  shape?: string;
  shadow?: boolean;
  onPickUp?: VoidFunction;
  onDrop?: VoidFunction;
  onLock?: VoidFunction;
};

export const Block: React.FC<Props> = ({
  revealed = true,
  color,
  shape,
  moved,
  index = 0,
  onLock,
  onDrop,
  onPickUp,
  selected = null,
  suggested = null,
  locked = false,
  shadow = true,
}) => {
  const isLocked = useDelayedToggle(locked, {
    initialValue: false,
    onDelay: 10,
    onOn: onLock,
  });
  const isRevealed = useDelayedToggle(revealed, { onDelay: 10 });

  const displayShape = (revealed ? shape : undefined) ?? "❓";

  useEffect(() => {
    if (moved && !selected && !isLocked) {
      onDrop?.();
    }
  }, []);

  useEffect(() => {
    if (selected) {
      onPickUp?.();
    } else {
      onDrop?.();
    }
  }, [selected]);

  return (
    <div
      style={{
        "--cube-color": revealed ? color : "#64748b",
        "--cube-shape-opacity": revealed ? "50%" : "100%",
        "--cube-shape": `'${encodeForContent(displayShape)}'`,
        animationDelay: !locked ? `-${index * 50}ms` : "0",
      }}
      className={clsx(
        "relative -mt-top-block h-height-block w-block text-center",
        {
          [styles.selected]: selected && !isLocked,
          "animate-locked": !selected && isLocked,
          "animate-place": !selected && !isLocked,
        },
      )}
    >
      {shadow && <div className={styles.shadow}></div>}
      <div
        className={clsx(
          styles.layer,
          "rounded-md border border-black/10 bg-block transition-colors",
          {
            [styles.selectedOutline]: selected,
            "[transition-duration:0ms]": isRevealed,
            "[transition-duration:500ms]": !isRevealed,
          },
        )}
      ></div>
      <div
        className={clsx(styles.layer, "z-10 pt-7", {
          [styles.suggestedOutline]: suggested,
        })}
      >
        <span className={clsx("block", styles.shape)}></span>
      </div>
      {revealed && <div className={clsx(styles.layer, styles.texture)}></div>}
      <div
        className={clsx(styles.layer, {
          [styles.gradient]: revealed,
          [styles.hidden]: !revealed,
        })}
      ></div>
      <div
        className={clsx(
          "absolute h-full w-full rounded-md",
          styles.gradientLocked,
          { ["opacity-100"]: isLocked, ["opacity-0"]: !isLocked },
        )}
      ></div>
    </div>
  );
};
