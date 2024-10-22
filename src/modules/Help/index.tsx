import { use } from "react";
import clsx from "clsx";

import { Dialog } from "@/ui/Dialog/Dialog";
import { DialogTitle } from "@/ui/Dialog/DialogTitle";

import { ReactComponent as Christmas } from "@/../docs/christmas.md";
import { ReactComponent as Halloween } from "@/../docs/halloween.md";
import { ReactComponent as HelpText } from "@/../docs/help.md";

import { ThemeContext } from "../Layout/ThemeContext";

import styles from "../Settings/TextStyling.module.css";

type Props = {
  onClose?: VoidFunction;
  onOpenManual?: VoidFunction;
};

export const Help: React.FC<Props> = ({ onClose }) => {
  const { activeTheme } = use(ThemeContext);
  return (
    <Dialog
      wide={false}
      onClose={() => {
        onClose?.();
      }}
    >
      <DialogTitle>Game Manual</DialogTitle>
      <div
        className={clsx(
          styles.textStyling,
          "max-h-[calc(100vh-200px)] overflow-y-auto",
        )}
      >
        <HelpText />
        {activeTheme === "halloween" && <Halloween />}
        {activeTheme === "winter" && <Christmas />}
      </div>
    </Dialog>
  );
};
