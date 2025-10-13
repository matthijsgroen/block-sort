import type { PropsWithChildren } from "react";
import { Children } from "react";
import clsx from "clsx";

import Icon from "../Icon/Icon";

type Props = PropsWithChildren<{
  onClick?: VoidFunction;
  href?: string;
  size?: "default" | "large";
  rounded?: "full" | "large";
  icon?: string;
}>;

export const TransparentButton: React.FC<Props> = ({
  onClick,
  href,
  children,
  icon,
  rounded = "full",
  size = "default"
}) => {
  const classNames = clsx(
    rounded === "full" ? "rounded-full" : "rounded-lg",
    "inline-block select-none border border-black p-2 shadow-md",
    "text-center align-middle text-black focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black",
    "transition-transform active:scale-90",
    {
      "px-4 text-sm": size === "default"
    }
  );
  const hasChildren = Children.count(children) > 0;
  const iconElement = icon ? (
    <Icon icon={icon} className={hasChildren ? "pr-1" : ""} size="small" />
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
