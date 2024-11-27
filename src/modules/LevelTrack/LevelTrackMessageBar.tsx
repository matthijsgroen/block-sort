import clsx from "clsx";

const translates = [
  "",
  "translate-x-10",
  "translate-x-10",
  "translate-x-20",
  "translate-x-10",
  "",
  "-translate-x-10",
  "-translate-x-20",
  "-translate-x-10"
];

export const LevelTrackMessageBar: React.FC<{
  levelNr: number;
  message: string;
}> = ({ levelNr, message }) => {
  const offset = levelNr % 8;
  return (
    <div
      className={clsx(
        "inline-block h-4 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-xs tracking-widest text-transparent",
        translates[offset]
      )}
    >
      {message}
    </div>
  );
};
