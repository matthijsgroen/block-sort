import { lazy } from "react";
import clsx from "clsx";

import styles from "./TextStyling.module.css";

const ChangelogData = lazy(() => import("./ChangelogData"));

export const Changelog: React.FC = () => {
  return (
    <div
      className={clsx(
        "max-h-[60vh] flex-1 overflow-y-scroll overscroll-y-contain text-sm",
        styles.textStyling
      )}
    >
      <ChangelogData />
    </div>
  );
};
