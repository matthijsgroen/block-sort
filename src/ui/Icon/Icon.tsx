import clsx from "clsx";

const Icon: React.FC<{
  icon: string;
  className?: string;
  size?: "default" | "small";
}> = ({ icon, size = "default", className }) => (
  <span
    className={clsx(
      `material-icons inline-block align-middle`,
      {
        "!text-[0.9rem]": size === "small"
      },
      className
    )}
  >
    {icon}
  </span>
);

export default Icon;
