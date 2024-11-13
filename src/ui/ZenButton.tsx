import clsx from "clsx";

type Props = {
  onClick?: VoidFunction;
};

export const ZenButton: React.FC<Props> = ({ onClick }) => (
  <button
    onClick={onClick}
    className={clsx(
      "inline-block h-12 whitespace-nowrap rounded-3xl bg-orange-500 pl-4 pr-3 pt-1 align-bottom font-bold shadow-lg transition-transform active:scale-90"
    )}
  >
    <span className={"inline-block text-2xl"}>️🌻</span>
    <span className="material-icons -ml-1 align-bottom !text-3xl">
      keyboard_arrow_right
    </span>
  </button>
);
