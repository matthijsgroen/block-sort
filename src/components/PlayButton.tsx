type Props = {
  levelNr: number;
  onClick: VoidFunction;
};

export const PlayButton: React.FC<Props> = ({ levelNr, onClick }) => (
  <button
    onClick={onClick}
    className="w-[10rem] h-12 bg-orange-500 rounded-3xl shadow-lg font-bold"
  >
    Level {levelNr}
  </button>
);
