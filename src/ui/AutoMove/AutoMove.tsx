import { WoodButton } from "../WoodButton/WoodButton";

type Props = {
  onClick?: VoidFunction;
  autoMoves: number;
};

export const AutoMove: React.FC<Props> = ({ onClick, autoMoves }) => (
  <WoodButton onClick={onClick}>
    <>
      <span className={"inline-block px-2 pt-[4px] text-lg"}>Automove</span>
      <span className="mr-1 inline-block rounded-md bg-black/20 p-1 text-xs">
        {autoMoves}
      </span>
    </>
  </WoodButton>
);
