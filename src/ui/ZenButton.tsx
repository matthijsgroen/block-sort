import clsx from "clsx";

type Props = {
  onClick?: VoidFunction;
};

export const ZenButton: React.FC<Props> = ({ onClick }) => (
  <button
    onClick={onClick}
    className={clsx(
      "inline-block h-12 rounded-3xl bg-orange-500 px-6 pt-3 font-bold shadow-lg transition-transform active:scale-90"
    )}
  >
    <span className={"block -translate-y-1 scale-150"}>️🌻 ▸</span>
  </button>
);
