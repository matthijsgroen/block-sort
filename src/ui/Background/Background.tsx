import { PropsWithChildren } from "react";
import clsx from "clsx";

type Props = {
  theme?: "easy" | "hard" | "special";
};

export const Background: React.FC<PropsWithChildren<Props>> = ({
  children,
  theme,
}) => {
  return (
    <div
      className={clsx(
        "h-safe-area relative transition-all [transition-duration:3s]",
        {
          "bg-transparent": theme === undefined,
          "bg-purple-700/50": theme === "special",
          "bg-red-600/70": theme === "hard",
          "bg-green-600/40": theme === "easy",
        }
      )}
    >
      <div className="absolute left-0 top-0 h-full w-full mix-blend-multiply bg-wood-texture"></div>
      <div className="absolute left-0 top-0 h-full w-full">{children}</div>
    </div>
  );
};