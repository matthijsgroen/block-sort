import clsx from "clsx";

type Props = {
  onClick?: VoidFunction;
};

export const ZenButton: React.FC<Props> = ({ onClick }) => (
  <button
    onClick={onClick}
    className={clsx(
      "inline-block h-12 rounded-3xl shadow-lg font-bold pt-3 px-6 bg-orange-500 active:scale-90 transition-transform"
    )}
  >
    <span className={"block -translate-y-1 scale-150"}>️🌻 ▸</span>
  </button>
);
