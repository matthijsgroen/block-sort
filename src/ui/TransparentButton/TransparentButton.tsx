import { PropsWithChildren } from "react";
import clsx from "clsx";

type Props = PropsWithChildren<{
  onClick?: VoidFunction;
  href?: string;
  size?: "default" | "large";
}>;

export const TransparentButton: React.FC<Props> = ({
  onClick,
  href,
  children,
  size = "default",
}) => {
  const classNames = clsx(
    "inline-block rounded-full border border-black p-2 shadow-md",
    "text-center text-black",
    "transition-transform active:scale-90",
    {
      "px-4 text-sm": size === "default",
    },
  );

  if (href) {
    return (
      <a href={href} target={"_blank"} className={classNames} rel="noreferrer">
        {children}
      </a>
    );
  }
  return (
    <button onClick={onClick} className={classNames}>
      {children}
    </button>
  );
};
