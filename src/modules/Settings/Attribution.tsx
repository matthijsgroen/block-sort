import clsx from "clsx";

import { ReactComponent } from "@/assets/readme.md";

import styles from "./TextStyling.module.css";

export const Attribution: React.FC = () => (
  <div
    className={clsx(
      "max-h-[60vh] flex-1 overflow-y-scroll overscroll-y-contain text-sm",
      styles.textStyling
    )}
  >
    <ReactComponent />
  </div>
);
