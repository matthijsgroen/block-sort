import { use } from "react";

import { ErrorContext } from "@/modules/Layout/ErrorBoundary";

export const AppCrashScreen: React.FC = () => {
  const { error } = use(ErrorContext);

  return (
    <div className="flex h-full flex-col text-2xl font-bold text-light-wood">
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="text-4xl">😢</div>
        <p className="my-4 max-w-[300px] text-center">
          uh oh... the game crashed.
        </p>
        <p className="my-4 max-w-[300px] text-center">
          Error message: &quot;{error?.message}&quot;
        </p>
        <p className="my-4 max-w-[300px] text-center">
          please e-mail me on{" "}
          <a
            href={`mailto:matthijs.groen@gmail.com?subject=[BlockSort]-appCrash&body=Error%20message:%20${encodeURIComponent(error?.message ?? "unknown")}`}
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
