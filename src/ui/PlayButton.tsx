import clsx from "clsx";

type Props = {
  levelNr: number;
  special?: boolean;
  hard?: boolean;
  easy?: boolean;
  onClick: VoidFunction;
};

export const PlayButton: React.FC<Props> = ({
  levelNr,
  onClick,
  special,
  hard,
  easy,
}) => (
  <button
    onClick={onClick}
    className={clsx(
      "inline-block w-[10rem] h-12 rounded-3xl shadow-lg font-bold pt-3",
      {
        "bg-orange-500": !special && !easy,
        "bg-purple-500": special,
        "bg-green-700": easy,
      }
    )}
  >
    <span
      className={`block ${(hard || special || easy) == false ? "-translate-y-1" : ""}`}
    >
      Level {levelNr}
    </span>
    {special && (
      <span className="inline-block text-xs translate-y-1 bg-purple-400 px-2 py-1 shadow rounded-md">
        ⭐️ special
      </span>
    )}
    {hard && (
      <span className="inline-block text-xs translate-y-1 bg-orange-600 px-2 py-1 shadow rounded-md">
        🔥️ hard
      </span>
    )}
    {easy && (
      <span className="inline-block text-xs translate-y-1 bg-green-800 px-2 py-1 shadow rounded-md">
        🍀 easy
      </span>
    )}
  </button>
);
