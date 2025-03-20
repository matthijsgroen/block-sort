import clsx from "clsx";

import { Dialog } from "@/ui/Dialog/Dialog";
import { DialogTitle } from "@/ui/Dialog/DialogTitle";
import { TransparentButton } from "@/ui/TransparentButton/TransparentButton";

import InstallationInstructions from "@/docs/installation.md";

import styles from "../Settings/TextStyling.module.css";

type Props = {
  onClose?: VoidFunction;
  onOpenManual?: VoidFunction;
};

export const InstallPrompt: React.FC<Props> = ({ onClose, onOpenManual }) => (
  <Dialog
    wide={false}
    onClose={() => {
      onClose?.();
    }}
  >
    <DialogTitle>Installing Block Sort</DialogTitle>
    <div
      className={clsx(
        styles.textStyling,
        "max-h-[calc(100vh-200px)] overflow-y-auto"
      )}
    >
      <TransparentButton onClick={onOpenManual} icon="question_mark">
        Game Manual
      </TransparentButton>
      <InstallationInstructions />
    </div>
  </Dialog>
);
