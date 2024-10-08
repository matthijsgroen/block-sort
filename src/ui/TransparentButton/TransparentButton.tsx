import { PropsWithChildren } from "react";
import clsx from "clsx";

type Props = PropsWithChildren<{
  onClick?: VoidFunction;
  size?: "default" | "large";
}>;

export const TransparentButton: React.FC<Props> = ({
  onClick,
  children,
  size = "default",
}) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "inline-block rounded-full border border-black p-2 shadow-md",
        "text-black",
        "active:scale-90 transition-transform",
        {
          "text-sm px-4": size === "default",
        }
      )}
    >
      {children}
    </button>
  );
};
