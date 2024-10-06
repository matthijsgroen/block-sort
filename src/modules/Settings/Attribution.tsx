import clsx from "clsx";

import { ReactComponent } from "@/assets/readme.md";

import styles from "./TextStyling.module.css";

export const Attribution: React.FC = () => (
  <div
    className={clsx(
      "text-sm flex-1 overflow-y-scroll max-h-[60vh] overscroll-y-contain",
      styles.textStyling
    )}
  >
    <ReactComponent />
  </div>
);
