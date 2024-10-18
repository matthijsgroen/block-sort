import clsx from "clsx";

export const TextEmoji: React.FC<{ emoji: string; className?: string }> = ({
  emoji,
  className
}) => {
  return (
    <span className={clsx("font-mono", className)}>{`${emoji}\uFE0E`}</span>
  );
};
