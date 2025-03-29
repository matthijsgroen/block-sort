import { use } from "react";

import { TopButton } from "@/ui/TopButton/TopButton";

import { ErrorContext } from "../Layout/ErrorBoundary";

type Props = {
  onBack: VoidFunction;
  levelNr: number;
  stageNr: number;
};
export const ErrorScreen: React.FC<Props> = ({ onBack, levelNr, stageNr }) => {
  const { error } = use(ErrorContext);

  return (
    <div className="flex h-full flex-col text-2xl font-bold text-light-wood">
      <div className="flex flex-row items-center gap-x-2 pl-safeLeft pr-safeRight pt-2">
        <TopButton
          buttonType="back"
          onClick={() => {
            onBack();
          }}
        />
      </div>
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="text-4xl">😢</div>
        <p className="my-4 max-w-[300px] text-center">
          uh oh... failed to generate level {levelNr + 1}{" "}
          {stageNr > 0 ? `stage ${stageNr + 1}` : ""}.
        </p>
        <p className="my-4 max-w-[300px] text-center">
          Error message: &quot;{error?.message}&quot;
        </p>
        <p className="my-4 max-w-[300px] text-center">
          please e-mail me on{" "}
          <a
            href={`mailto:matthijsgroen@gmail.com?subject=[BlockSort]-Failed-to-generate-level-${levelNr + 1}-${stageNr + 1}&body=Error%20message:%20${encodeURIComponent(error?.message ?? "unknown")}`}
            className="underline"
          >
            matthijs.groen@gmail.com
          </a>{" "}
          to notify me
        </p>
      </div>
    </div>
  );
};
