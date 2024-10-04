import clsx from "clsx";

import { ReactComponent } from "@/assets/readme.md";

import styles from "./Changelog.module.css";

export const Attribution: React.FC = () => (
  <div
    className={clsx(
      "text-sm flex-1 overflow-y-scroll max-h-[60vh] overscroll-y-contain",
      styles.changelog
    )}
  >
    <ReactComponent />
  </div>
);
