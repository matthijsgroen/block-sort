import type { PropsWithChildren } from "react";
import { Children } from "react";
import clsx from "clsx";

type Props = PropsWithChildren<{
  onClick?: VoidFunction;
  href?: string;
  size?: "default" | "large";
  icon?: string;
}>;

export const TransparentButton: React.FC<Props> = ({
  onClick,
  href,
  children,
  icon,
  size = "default"
}) => {
  const classNames = clsx(
    "inline-block select-none rounded-full border border-black p-2 shadow-md",
    "text-center align-middle text-black focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black",
    "transition-transform active:scale-90",
    {
      "px-4 text-sm": size === "default"
    }
  );
  const hasChildren = Children.count(children) > 0;
  const iconElement = icon ? (
    <span
      className={`material-icons inline-block ${hasChildren ? "pr-1" : ""} align-middle !text-[0.9rem]`}
    >
      {icon}
    </span>
  ) : null;

  if (href) {
    return (
      <a href={href} target={"_blank"} className={classNames} rel="noreferrer">
        {iconElement} {children}
      </a>
    );
  }
  return (
    <button onClick={onClick} className={classNames}>
      {iconElement} {children}
    </button>
  );
};
