import { Dispatch, useEffect, useRef } from "react";
import clsx from "clsx";

import { encodeForContent } from "@/support/emojiEncoding";
import { useDelayedToggle } from "@/support/useDelayedToggle";

import styles from "./Block2.module.css";

export type HideFormat = "glass" | "present";

export type Props = {
  moved: boolean;
  revealed?: boolean;
  hideFormat?: HideFormat;
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
  blur?: boolean;
  onPickUp?: Dispatch<DOMRect>;
  onDrop?: VoidFunction;
  onLock?: VoidFunction;
};

const GLASS_COLOR = "#64748b";
const PRESENT_COLOR = "#6b0";

export const Block2: React.FC<Props> = ({
  revealed = true,
  hideFormat = "glass",
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
  blur = false
}) => {
  const blockRef = useRef<HTMLDivElement>(null);
  const isLocked = useDelayedToggle(locked, {
    initialValue: false,
    onDelay: 10,
    onOn: onLock
  });
  const isRevealed = useDelayedToggle(revealed, { onDelay: 10 });

  const displayShape = (revealed ? shape : undefined) ?? "❓";

  useEffect(() => {
    if (moved && !selected && !isLocked) {
      onDrop?.();
    }
  }, []);

  useEffect(() => {
    if (selected && blockRef.current) {
      // Communicate coordinates
      const rect = blockRef.current.getBoundingClientRect();
      onPickUp?.(rect);
    } else {
      const timeoutId = setTimeout(() => {
        onDrop?.();
      }, 10);
      // Allows clearing of sound effect on column sync
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [selected]);

  const hiddenColor = hideFormat === "glass" ? GLASS_COLOR : PRESENT_COLOR;
  const showTopShape = revealed || hideFormat === "glass";

  return (
    <div
      ref={blockRef}
      style={{
        "--cube-color": color,
        "--hidden-color": hiddenColor,
        "--cube-shape-opacity": revealed ? "50%" : "100%",
        "--shape-color": revealed ? "var(--cube-color)" : "var(--hidden-color)",
        "--cube-shape": `'${encodeForContent(displayShape)}'`,
        "--cube-top-shape": showTopShape
          ? `'${encodeForContent(displayShape)}'`
          : "''",
        animationDelay: !locked ? `-${index * 50}ms` : "0"
      }}
      className={clsx(
        "pointer-events-none relative h-block w-block rounded-md",
        {
          [styles.shadow]: shadow && !selected,
          "animate-locked": !selected && isLocked,
          "animate-place": !selected && !isLocked,
          [styles.selected]: selected && !isLocked
        }
      )}
    >
      <div
        className={clsx(
          "absolute bottom-0 h-height-block w-block rounded-md text-center",
          styles.shape,
          {
            "[transition-duration:0ms]": isRevealed,
            [styles["light-gradient"]]: revealed && !isLocked,
            [styles.gradientLocked]: revealed && isLocked,
            [styles.glass]: !revealed && hideFormat === "glass",
            [styles.present]: !revealed && hideFormat === "present",
            "blur-[2px]": blur,
            [styles.selectedOutline]: selected,
            [styles.suggestedOutline]: suggested
          }
        )}
      ></div>
    </div>
  );
};