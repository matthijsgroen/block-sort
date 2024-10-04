import { lazy } from "react";
import clsx from "clsx";

import styles from "./Changelog.module.css";

const ChangelogData = lazy(() => import("./ChangelogData"));

export const Changelog: React.FC = () => {
  return (
    <div
      className={clsx(
        "text-sm flex-1 overflow-y-scroll max-h-[60vh] overscroll-y-contain",
        styles.changelog
      )}
    >
      <ChangelogData />
    </div>
  );
};
